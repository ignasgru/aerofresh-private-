// Database connection using Neon SQL API (Cloudflare Workers compatible)
const NEON_API_KEY = process.env.NEON_API_KEY || 'npg_WsRSZFM9y3nU';
const NEON_PROJECT_ID = 'ep-withered-mode-aeites9e';

// Helper function to execute SQL queries via Neon SQL API
async function executeQuery(sql: string) {
  try {
    const response = await fetch(`https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}/sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NEON_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.rows || [];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// CORS headers for all responses
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  'Access-Control-Max-Age': '86400',
};

// Health check endpoint
async function handleHealth(): Promise<Response> {
  try {
    // Test database connection
    await executeQuery('SELECT 1 as test');
    
    // Get basic stats
    const [aircraftResult, adResult, accidentResult] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM "Aircraft"'),
      executeQuery('SELECT COUNT(*) as count FROM "AdDirective"'),
      executeQuery('SELECT COUNT(*) as count FROM "Accident"')
    ]);
    
    return new Response(JSON.stringify({
      ok: true,
      ts: Date.now(),
      message: 'AeroFresh API is running with REAL aircraft data!',
      version: '2.0.0',
      database: 'connected',
      environment: 'production',
      stats: {
        aircraft: aircraftResult[0]?.count || 0,
        adDirectives: adResult[0]?.count || 0,
        accidents: accidentResult[0]?.count || 0
      }
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

    // Search real database for aircraft
    const sql = `
      SELECT tail, make, model, year, serial, "typeCode", engine, seats
      FROM "Aircraft"
      WHERE tail ILIKE $1 OR make ILIKE $1 OR model ILIKE $1
      ORDER BY tail ASC
      LIMIT 10
    `;
    
    const aircraft = await executeQuery(sql.replace('$1', `'%${query}%'`));

    if (aircraft.length > 0) {
      const results = aircraft.map(a => ({
        tail: a.tail,
        make: a.make,
        model: a.model,
        year: a.year,
        serial: a.serial,
        typeCode: a.typeCode,
        engine: a.engine,
        seats: a.seats
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

    // Get real aircraft data from database
    const aircraftSql = `SELECT * FROM "Aircraft" WHERE tail = '${tail.toUpperCase()}'`;
    const aircraft = await executeQuery(aircraftSql);

    if (aircraft.length > 0) {
      const plane = aircraft[0];
      
      // Get owners
      const ownersSql = `
        SELECT o.name, o.type, o.state, o.country, ao."startDate", ao."endDate"
        FROM "AircraftOwner" ao
        JOIN "Owner" o ON ao."ownerId" = o.id
        WHERE ao.tail = '${tail.toUpperCase()}'
      `;
      const owners = await executeQuery(ownersSql);

      // Get accidents
      const accidentsSql = `SELECT * FROM "Accident" WHERE tail = '${tail.toUpperCase()}'`;
      const accidents = await executeQuery(accidentsSql);

      // Get AD directives for this aircraft type
      const adSql = `
        SELECT * FROM "AdDirective" 
        WHERE "makeModelKey" = '${plane.make}-${plane.model}' AND status = 'OPEN'
      `;
      const adDirectives = await executeQuery(adSql);

      // Calculate risk score based on real data
      const riskScore = Math.min(100, Math.max(0, 
        (adDirectives.length * 5) + 
        (accidents.length * 20) + 
        (owners.length * 2)
      ));

      const summary = {
        tail: plane.tail,
        make: plane.make,
        model: plane.model,
        year: plane.year,
        serial: plane.serial,
        typeCode: plane.typeCode,
        engine: plane.engine,
        seats: plane.seats,
        riskScore,
        status: 'active',
        owners: owners.map(o => ({
          name: o.name,
          type: o.type,
          startDate: o.startDate,
          endDate: o.endDate
        })),
        accidents: accidents.map(a => ({
          date: a.date,
          severity: a.severity,
          phase: a.phase,
          injuries: a.injuries,
          fatalities: a.fatalities
        })),
        adDirectives: adDirectives.map(ad => ({
          ref: ad.ref,
          summary: ad.summary,
          status: ad.status,
          severity: ad.severity,
          effectiveDate: ad.effectiveDate
        })),
        source: 'database'
      };

      return new Response(JSON.stringify(summary), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
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

    // Get real live tracking data from database
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000).toISOString();
    const liveSql = `
      SELECT el.*, a.make, a.model, a.year
      FROM "EventLive" el
      LEFT JOIN "Aircraft" a ON el.tail = a.tail
      WHERE el.ts >= '${cutoffTime}'
      ORDER BY el.ts DESC
      LIMIT ${limit}
    `;
    const livePositions = await executeQuery(liveSql);

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