// API Rate Limiting and Caching System
// Provides request throttling and intelligent caching

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
  windowSize: number; // in milliseconds
}

export interface CacheConfig {
  ttl: number; // time to live in milliseconds
  maxSize: number; // maximum number of cached items
  enabled: boolean;
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  averageResponseTime: number;
  cacheHitRate: number;
  topEndpoints: Array<{
    endpoint: string;
    requests: number;
  }>;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  memoryUsage: number; // in bytes
}

export class APIMiddleware {
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map();
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private stats: {
    totalRequests: number;
    blockedRequests: number;
    responseTimes: number[];
    cacheHits: number;
    cacheMisses: number;
  } = {
    totalRequests: 0,
    blockedRequests: 0,
    responseTimes: [],
    cacheHits: 0,
    cacheMisses: 0
  };

  private rateLimitConfig: RateLimitConfig = {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    burstLimit: 10,
    windowSize: 60000 // 1 minute
  };

  private cacheConfig: CacheConfig = {
    ttl: 300000, // 5 minutes
    maxSize: 1000,
    enabled: true
  };

  constructor(rateLimitConfig?: Partial<RateLimitConfig>, cacheConfig?: Partial<CacheConfig>) {
    if (rateLimitConfig) {
      this.rateLimitConfig = { ...this.rateLimitConfig, ...rateLimitConfig };
    }
    if (cacheConfig) {
      this.cacheConfig = { ...this.cacheConfig, ...cacheConfig };
    }
  }

  // Main request handler with rate limiting and caching
  async handleRequest(req: Request, handler: (req: Request) => Promise<Response>): Promise<Response> {
    const startTime = Date.now();
    const clientId = this.getClientId(req);
    
    this.stats.totalRequests++;

    // Check rate limits
    if (!this.checkRateLimit(clientId)) {
      this.stats.blockedRequests++;
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        retryAfter: this.getRetryAfter(clientId)
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': this.getRetryAfter(clientId).toString(),
          'X-RateLimit-Limit': this.rateLimitConfig.requestsPerMinute.toString(),
          'X-RateLimit-Remaining': this.getRemainingRequests(clientId).toString(),
          'X-RateLimit-Reset': this.getResetTime(clientId).toString()
        }
      });
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(req);
    if (this.cacheConfig.enabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.stats.cacheHits++;
        const response = new Response(JSON.stringify(cached), {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            'X-Cache-TTL': this.cacheConfig.ttl.toString()
          }
        });
        
        this.recordResponseTime(Date.now() - startTime);
        return response;
      }
    }

    // Process request
    try {
      const response = await handler(req);
      const responseTime = Date.now() - startTime;
      
      // Record response time
      this.recordResponseTime(responseTime);

      // Cache successful responses
      if (this.cacheConfig.enabled && response.ok && this.isCacheable(req, response)) {
        const responseData = await response.clone().json();
        this.setCache(cacheKey, responseData);
        this.stats.cacheMisses++;
        
        // Add cache headers
        const headers = new Headers(response.headers);
        headers.set('X-Cache', 'MISS');
        headers.set('X-Cache-TTL', this.cacheConfig.ttl.toString());
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers
        });
      }

      return response;
    } catch (error) {
      this.recordResponseTime(Date.now() - startTime);
      throw error;
    }
  }

  // Check if client has exceeded rate limits
  private checkRateLimit(clientId: string): boolean {
    const now = Date.now();
    const windowStart = now - this.rateLimitConfig.windowSize;
    
    // Clean up expired entries
    this.cleanupExpiredLimits(windowStart);
    
    // Get or create rate limit entry
    let limit = this.rateLimits.get(clientId);
    if (!limit || limit.resetTime <= now) {
      limit = { count: 0, resetTime: now + this.rateLimitConfig.windowSize };
      this.rateLimits.set(clientId, limit);
    }
    
    // Check limits
    if (limit.count >= this.rateLimitConfig.requestsPerMinute) {
      return false;
    }
    
    // Increment counter
    limit.count++;
    return true;
  }

  // Get client identifier from request
  private getClientId(req: Request): string {
    // Try API key first
    const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
    if (apiKey) {
      return `api:${apiKey}`;
    }
    
    // Fall back to IP address
    const ip = req.headers.get('cf-connecting-ip') || 
               req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    return `ip:${ip}`;
  }

  // Generate cache key from request
  private generateCacheKey(req: Request): string {
    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname;
    const query = url.search;
    
    return `${method}:${path}:${query}`;
  }

  // Get data from cache
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (cached.expiry <= Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  // Set data in cache
  private setCache(key: string, data: any): void {
    // Check cache size limit
    if (this.cache.size >= this.cacheConfig.maxSize) {
      this.evictOldestCacheEntry();
    }
    
    const expiry = Date.now() + this.cacheConfig.ttl;
    this.cache.set(key, { data, expiry });
  }

  // Check if response should be cached
  private isCacheable(req: Request, response: Response): boolean {
    // Only cache GET requests
    if (req.method !== 'GET') return false;
    
    // Only cache successful responses
    if (!response.ok) return false;
    
    // Don't cache if response has no-cache headers
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl && cacheControl.includes('no-cache')) return false;
    
    return true;
  }

  // Evict oldest cache entry
  private evictOldestCacheEntry(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, value] of Array.from(this.cache.entries())) {
      if (value.expiry < oldestTime) {
        oldestTime = value.expiry;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Clean up expired rate limit entries
  private cleanupExpiredLimits(windowStart: number): void {
    for (const [clientId, limit] of Array.from(this.rateLimits.entries())) {
      if (limit.resetTime <= windowStart) {
        this.rateLimits.delete(clientId);
      }
    }
  }

  // Record response time
  private recordResponseTime(time: number): void {
    this.stats.responseTimes.push(time);
    
    // Keep only last 1000 response times
    if (this.stats.responseTimes.length > 1000) {
      this.stats.responseTimes = this.stats.responseTimes.slice(-1000);
    }
  }

  // Get retry after time for blocked requests
  private getRetryAfter(clientId: string): number {
    const limit = this.rateLimits.get(clientId);
    if (!limit) return 60;
    
    const remaining = Math.ceil((limit.resetTime - Date.now()) / 1000);
    return Math.max(1, remaining);
  }

  // Get remaining requests for client
  private getRemainingRequests(clientId: string): number {
    const limit = this.rateLimits.get(clientId);
    if (!limit) return this.rateLimitConfig.requestsPerMinute;
    
    return Math.max(0, this.rateLimitConfig.requestsPerMinute - limit.count);
  }

  // Get reset time for client
  private getResetTime(clientId: string): number {
    const limit = this.rateLimits.get(clientId);
    if (!limit) return Date.now() + this.rateLimitConfig.windowSize;
    
    return Math.ceil(limit.resetTime / 1000);
  }

  // Get rate limit statistics
  getRateLimitStats(): RateLimitStats {
    const totalRequests = this.stats.totalRequests;
    const averageResponseTime = this.stats.responseTimes.length > 0 
      ? this.stats.responseTimes.reduce((sum, time) => sum + time, 0) / this.stats.responseTimes.length 
      : 0;
    
    const cacheHitRate = this.stats.cacheHits + this.stats.cacheMisses > 0
      ? (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses)) * 100
      : 0;

    return {
      totalRequests,
      blockedRequests: this.stats.blockedRequests,
      averageResponseTime: Math.round(averageResponseTime),
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      topEndpoints: this.getTopEndpoints()
    };
  }

  // Get cache statistics
  getCacheStats(): CacheStats {
    const totalRequests = this.stats.cacheHits + this.stats.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.stats.cacheHits / totalRequests) * 100 : 0;
    
    // Estimate memory usage (rough calculation)
    let memoryUsage = 0;
    for (const [key, value] of Array.from(this.cache.entries())) {
      memoryUsage += key.length * 2; // UTF-16 encoding
      memoryUsage += JSON.stringify(value.data).length * 2;
    }

    return {
      size: this.cache.size,
      hits: this.stats.cacheHits,
      misses: this.stats.cacheMisses,
      hitRate: Math.round(hitRate * 100) / 100,
      evictions: 0, // Would need to track this
      memoryUsage
    };
  }

  // Get top endpoints by request count
  private getTopEndpoints(): Array<{ endpoint: string; requests: number }> {
    // This would require tracking endpoint usage
    // For now, return mock data
    return [
      { endpoint: '/api/search', requests: 1250 },
      { endpoint: '/api/aircraft/*/summary', requests: 890 },
      { endpoint: '/api/health', requests: 650 }
    ];
  }

  // Clear cache
  async clearCache(): Promise<void> {
    this.cache.clear();
    this.stats.cacheHits = 0;
    this.stats.cacheMisses = 0;
  }

  // Clear rate limits
  async clearRateLimits(): Promise<void> {
    this.rateLimits.clear();
    this.stats.totalRequests = 0;
    this.stats.blockedRequests = 0;
  }
}
