import Constants from 'expo-constants';

// Network state types
export type NetworkState = 'checking' | 'online' | 'offline';

// API configuration with fallbacks
const getConfigValue = (key: string, defaultValue: string): string => {
  try {
    return Constants.expoConfig?.extra?.[key] || defaultValue;
  } catch {
    return defaultValue;
  }
};

const API_BASE_URL = getConfigValue('API_BASE_URL', 'http://192.168.3.1:3001');
const API_TIMEOUT = parseInt(getConfigValue('API_TIMEOUT', '10000'));
const API_RETRY_COUNT = parseInt(getConfigValue('API_RETRY_COUNT', '3'));

// Global network state
let networkState: NetworkState = 'checking';
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

// Demo data generators
export const demoData = {
  aircraft: () => ({
    tail: 'N123AB',
    make: 'Cessna',
    model: '172',
    year: 2020,
    riskScore: 15,
    engine: 'Lycoming O-320',
    seats: 4,
    serial: '172-12345'
  }),
  
  livePositions: (limit: number = 20, minutes: number = 30) => {
    const baseTime = Date.now();
    const sampleTails = ['N123AB', 'N456CD', 'N789EF', 'N321GH', 'N654IJ', 'N987KL'];
    const sampleMakes = ['Cessna', 'Piper', 'Beechcraft', 'Mooney', 'Cirrus', 'Diamond'];
    const sampleModels = ['172', 'Cherokee', 'Bonanza', 'M20J', 'SR22', 'DA40'];
    
    return Array.from({ length: Math.min(limit, 6) }, (_, index) => {
      const timeOffset = Math.random() * minutes * 60 * 1000;
      const lat = 34.0522 + (Math.random() - 0.5) * 0.5;
      const lon = -118.2437 + (Math.random() - 0.5) * 0.5;
      
      return {
        id: index + 1,
        tail: sampleTails[index] || `N${String(100 + index).padStart(3, '0')}AB`,
        lat,
        lon,
        alt: 3000 + Math.random() * 12000,
        speed: 100 + Math.random() * 250,
        heading: Math.random() * 360,
        ts: new Date(baseTime - timeOffset).toISOString(),
        aircraft: { 
          make: sampleMakes[index % sampleMakes.length], 
          model: sampleModels[index % sampleModels.length] 
        }
      };
    });
  },
  
  searchResults: (tail: string) => {
    const types = [
      { make: 'Cessna', model: '172', year: 2020, riskScore: 15 },
      { make: 'Piper', model: 'Cherokee', year: 2018, riskScore: 20 },
      { make: 'Beechcraft', model: 'Bonanza', year: 2019, riskScore: 25 },
      { make: 'Mooney', model: 'M20J', year: 2021, riskScore: 10 },
      { make: 'Cirrus', model: 'SR22', year: 2022, riskScore: 5 },
      { make: 'Diamond', model: 'DA40', year: 2023, riskScore: 8 }
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    return [{
      tail: tail.toUpperCase(),
      make: randomType.make,
      model: randomType.model,
      year: randomType.year,
      riskScore: randomType.riskScore
    }];
  }
};

// Health check function
export async function checkHealth(): Promise<NetworkState> {
  const now = Date.now();
  
  // Skip health check if checked recently
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL && networkState !== 'checking') {
    return networkState;
  }
  
  networkState = 'checking';
  lastHealthCheck = now;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.ok) {
        networkState = 'online';
        console.log('✅ API Health check passed:', data);
      } else {
        networkState = 'offline';
        console.log('❌ API Health check failed - server not OK');
      }
    } else {
      networkState = 'offline';
      console.log('❌ API Health check failed - HTTP error:', response.status);
    }
  } catch (error) {
    networkState = 'offline';
    console.log('❌ API Health check failed - network error:', error instanceof Error ? error.message : String(error));
  }
  
  return networkState;
}

// Generic API call wrapper with retry and fallback
export async function apiCall<T>(
  endpoint: string,
  demoDataGenerator: () => T,
  options: RequestInit = {}
): Promise<{ data: T; mode: NetworkState; isDemo: boolean }> {
  
  // Check health first
  const healthState = await checkHealth();
  
  // If offline, return demo data immediately
  if (healthState !== 'online') {
    return {
      data: demoDataGenerator(),
      mode: 'offline',
      isDemo: true
    };
  }
  
  // Try API call with retries
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= API_RETRY_COUNT; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API call successful: ${endpoint}`);
        return {
          data,
          mode: 'online',
          isDemo: false
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`❌ API call attempt ${attempt}/${API_RETRY_COUNT} failed for ${endpoint}:`, lastError.message);
      
      if (attempt < API_RETRY_COUNT) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  // All attempts failed, return demo data
  console.log(`🔄 All API attempts failed for ${endpoint}, using demo data`);
  networkState = 'offline';
  
  return {
    data: demoDataGenerator(),
    mode: 'offline',
    isDemo: true
  };
}

// Enhanced API functions with real data support
export const api = {
  // Health check - critical for status indicators
  health: async (): Promise<NetworkState> => {
    const result = await checkHealth();
    console.log(`🏥 Health check result: ${result}`);
    return result;
  },
  
  // Search aircraft - with real database support
  search: (query: string) => apiCall(
    `/api/search?q=${encodeURIComponent(query)}`,
    () => ({ 
      results: demoData.searchResults(query), 
      count: 1, 
      query: query.toUpperCase(),
      source: 'demo'
    })
  ),
  
  // Get aircraft summary - with risk calculation
  aircraftSummary: (tail: string) => apiCall(
    `/api/aircraft/${encodeURIComponent(tail)}/summary`,
    () => ({ 
      ...demoData.aircraft(), 
      tail: tail.toUpperCase(),
      source: 'demo'
    })
  ),
  
  // Get live positions - with real ADS-B data support
  livePositions: (limit = 20, minutes = 30) => apiCall(
    `/api/tracking/live?limit=${limit}&minutes=${minutes}`,
    () => ({ 
      positions: demoData.livePositions(limit, minutes), 
      count: limit, 
      timeRange: `${minutes} minutes`, 
      lastUpdate: new Date().toISOString(),
      source: 'demo'
    })
  ),
  
  // Get comprehensive report - CarVertical-style
  comprehensiveReport: (tail: string) => apiCall(
    `/api/aircraft/${encodeURIComponent(tail)}/history`,
    () => ({
      summary: { ...demoData.aircraft(), tail: tail.toUpperCase() },
      history: { 
        owners: [
          { name: 'ABC Aviation LLC', startDate: '2020-01-15', endDate: null, location: 'Los Angeles, CA' }
        ], 
        accidents: [], 
        adDirectives: [
          { id: '2024-001', title: 'Engine Inspection Required', status: 'OPEN', date: '2024-01-15' }
        ] 
      },
      inspections: [
        { type: 'Annual', date: '2023-12-01', result: 'Passed', inspector: 'John Smith' }
      ],
      marketValue: { current: 150000, trend: 'stable', lastUpdated: '2024-01-01' },
      riskAnalysis: { score: 15, factors: ['Low risk aircraft', 'Regular maintenance'] },
      source: 'demo'
    })
  )
};

// Export current network state getter
export function getCurrentNetworkState(): NetworkState {
  return networkState;
}

// Force network state (for testing)
export function setNetworkState(state: NetworkState): void {
  networkState = state;
}
