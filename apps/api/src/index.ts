import { PrismaClient } from '@prisma/client';

// CORS headers for all responses
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  'Access-Control-Max-Age': '86400',
};

// Initialize Prisma client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_WsRSZFM9y3nU@ep-withered-mode-aeites9e-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    },
  },
});

// Health check endpoint
async function handleHealth(): Promise<Response> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    return new Response(JSON.stringify({
      ok: true,
      ts: Date.now(),
      message: 'AeroFresh API is running with real data!',
      version: '2.0.0',
      database: 'connected',
      environment: 'development'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      ok: false,
      ts: Date.now(),
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      version: '2.0.0',
      database: 'disconnected'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS,
      },
    });
  }
}

// Aircraft search endpoint
async function handleSearch(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    if (!query) {
      return new Response(JSON.stringify({ 
        error: 'Query parameter "q" is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    // Try to find aircraft in database first
    try {
      const aircraft = await prisma.aircraft.findMany({
        where: {
          OR: [
            { tail: { contains: query.toUpperCase() } },
            { make: { contains: query } },
            { model: { contains: query } }
          ]
        },
        take: 10
      });

      if (aircraft.length > 0) {
        const results = aircraft.map((a: any) => ({
          tail: a.tail,
          make: a.make,
          model: a.model,
          year: a.year,
          riskScore: Math.floor(Math.random() * 50) + 10 // TODO: Calculate real risk score
        }));

        return new Response(JSON.stringify({
          results,
          count: results.length,
          query: query.toUpperCase(),
          source: 'database'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
    } catch (dbError) {
      console.log('Database search failed, using fallback:', dbError);
    }

    // Fallback to mock data if no database results
    const mockResults = {
      results: [{
        tail: query.toUpperCase(),
        make: 'Cessna',
        model: '172',
        year: 2020,
        riskScore: 15
      }],
      count: 1,
      query: query.toUpperCase(),
      source: 'fallback'
    };

    return new Response(JSON.stringify(mockResults), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

// Aircraft summary endpoint
async function handleAircraftSummary(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const tail = url.pathname.split('/')[3]; // /api/aircraft/:tail/summary
    
    if (!tail) {
      return new Response(JSON.stringify({ 
        error: 'Aircraft tail number is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    // Try to find aircraft in database
    try {
      const aircraft = await prisma.aircraft.findUnique({
        where: { tail: tail.toUpperCase() }
      });

      if (aircraft) {
        // Get related data
        const [adDirectives, accidents, owners] = await Promise.all([
          prisma.adDirective.count({ where: { status: 'OPEN' } }),
          prisma.accident.count({ where: { tail: tail.toUpperCase() } }),
          prisma.aircraftOwner.count({ where: { tail: tail.toUpperCase() } })
        ]);

        const summary = {
          tail: aircraft.tail,
          make: aircraft.make,
          model: aircraft.model,
          year: aircraft.year,
          riskScore: Math.min(100, Math.max(0, (adDirectives * 10) + (accidents * 20) + (owners * 5))),
          status: 'active',
          metrics: {
            adDirectives,
            accidents,
            owners
          },
          source: 'database'
        };

        return new Response(JSON.stringify(summary), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
    } catch (dbError) {
      console.log('Database query failed, using fallback:', dbError);
    }

    // Fallback to mock data
    const mockSummary = {
      tail: tail.toUpperCase(),
      make: 'Cessna',
      model: '172',
      year: 2020,
      riskScore: 15,
      status: 'active',
      source: 'fallback'
    };

    return new Response(JSON.stringify(mockSummary), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Aircraft summary failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

// Live tracking endpoint
async function handleLiveTracking(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const minutes = parseInt(url.searchParams.get('minutes') || '30');

    // Try to get real live data from database
    try {
      const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
      const livePositions = await prisma.eventLive.findMany({
        where: {
          ts: { gte: cutoffTime }
        },
        include: {
          aircraft: true
        },
        orderBy: { ts: 'desc' },
        take: limit
      });

      if (livePositions.length > 0) {
        const positions = livePositions.map((pos: any, i: number) => ({
          id: i + 1,
          tail: pos.tail,
          lat: pos.lat,
          lon: pos.lon,
          alt: pos.alt,
          speed: pos.speed,
          heading: pos.heading,
          ts: pos.ts.toISOString(),
          aircraft: {
            make: pos.aircraft?.make || 'Unknown',
            model: pos.aircraft?.model || 'Unknown'
          }
        }));

        return new Response(JSON.stringify({
          positions,
          count: positions.length,
          timeRange: `${minutes} minutes`,
          source: 'database'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
    } catch (dbError) {
      console.log('Database live tracking failed, using fallback:', dbError);
    }

    // Fallback to mock data
    const mockLiveData = {
      positions: Array.from({ length: limit }, (_, i) => ({
        id: i + 1,
        tail: `N${String(100 + i).padStart(3, '0')}AB`,
        lat: 34.0522 + (Math.random() - 0.5) * 0.5,
        lon: -118.2437 + (Math.random() - 0.5) * 0.5,
        alt: 3000 + Math.random() * 12000,
        speed: 100 + Math.random() * 250,
        heading: Math.random() * 360,
        ts: new Date(Date.now() - Math.random() * minutes * 60 * 1000).toISOString(),
        aircraft: {
          make: ['Cessna', 'Piper', 'Beechcraft'][i % 3],
          model: ['172', 'Cherokee', 'Bonanza'][i % 3]
        }
      })),
      count: limit,
      timeRange: `${minutes} minutes`,
      source: 'fallback'
    };

    return new Response(JSON.stringify(mockLiveData), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Live tracking failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: CORS,
      });
    }
    
    try {
      // Route to appropriate handler
      if (path === '/api/health') {
        return await handleHealth();
      } else if (path === '/api/search') {
        return await handleSearch(request);
      } else if (path.startsWith('/api/aircraft/') && path.endsWith('/summary')) {
        return await handleAircraftSummary(request);
      } else if (path === '/api/tracking/live') {
        return await handleLiveTracking(request);
      } else {
        return new Response(JSON.stringify({
          error: 'Endpoint not found',
          availableEndpoints: [
            '/api/health',
            '/api/search?q=<query>',
            '/api/aircraft/<tail>/summary',
            '/api/tracking/live?limit=20&minutes=30'
          ]
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...CORS,
          },
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS,
        },
      });
    }
  },
};