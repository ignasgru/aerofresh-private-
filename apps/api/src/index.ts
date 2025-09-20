// Enhanced aircraft database with realistic data
const AIRCRAFT_DATABASE = {
  'N737AB': {
    tail: 'N737AB',
    make: 'Boeing',
    model: '737-800',
    year: 2018,
    serial: 'LN-12345',
    typeCode: 'B738',
    engine: 'CFM56-7B26',
    seats: 189,
    riskScore: 25,
    status: 'active',
    owners: [
      {
        name: 'Southwest Airlines',
        type: 'Airline',
        startDate: '2018-03-15',
        endDate: null
      }
    ],
    accidents: [],
    adDirectives: [
      {
        ref: 'AD-2023-001',
        summary: 'Inspection of engine mount bolts',
        status: 'OPEN',
        severity: 'MEDIUM',
        effectiveDate: '2023-01-15'
      }
    ],
    flightHours: 15420,
    cycles: 8945,
    lastInspection: '2024-08-15',
    nextInspection: '2025-02-15'
  },
  'N320CD': {
    tail: 'N320CD',
    make: 'Airbus',
    model: 'A320',
    year: 2019,
    serial: 'MSN-4567',
    typeCode: 'A320',
    engine: 'CFM56-5B4',
    seats: 180,
    riskScore: 18,
    status: 'active',
    owners: [
      {
        name: 'American Airlines',
        type: 'Airline',
        startDate: '2019-06-20',
        endDate: null
      }
    ],
    accidents: [],
    adDirectives: [
      {
        ref: 'AD-2023-002',
        summary: 'Wing flap inspection',
        status: 'OPEN',
        severity: 'HIGH',
        effectiveDate: '2023-03-10'
      }
    ],
    flightHours: 12850,
    cycles: 7230,
    lastInspection: '2024-09-10',
    nextInspection: '2025-03-10'
  },
  'N172EF': {
    tail: 'N172EF',
    make: 'Cessna',
    model: '172',
    year: 2020,
    serial: '172-12345',
    typeCode: 'C172',
    engine: 'Lycoming O-320-D2J',
    seats: 4,
    riskScore: 8,
    status: 'active',
    owners: [
      {
        name: 'Flight Training Academy',
        type: 'Flight School',
        startDate: '2020-01-10',
        endDate: null
      }
    ],
    accidents: [],
    adDirectives: [],
    flightHours: 1250,
    cycles: 890,
    lastInspection: '2024-10-01',
    nextInspection: '2025-04-01'
  },
  'N787GH': {
    tail: 'N787GH',
    make: 'Boeing',
    model: '787-9',
    year: 2021,
    serial: 'LN-98765',
    typeCode: 'B789',
    engine: 'GEnx-1B74',
    seats: 290,
    riskScore: 12,
    status: 'active',
    owners: [
      {
        name: 'United Airlines',
        type: 'Airline',
        startDate: '2021-09-15',
        endDate: null
      }
    ],
    accidents: [],
    adDirectives: [
      {
        ref: 'AD-2024-001',
        summary: 'Battery system inspection',
        status: 'OPEN',
        severity: 'HIGH',
        effectiveDate: '2024-01-20'
      }
    ],
    flightHours: 8920,
    cycles: 3450,
    lastInspection: '2024-11-15',
    nextInspection: '2025-05-15'
  },
  'N350IJ': {
    tail: 'N350IJ',
    make: 'Airbus',
    model: 'A350-900',
    year: 2020,
    serial: 'MSN-5432',
    typeCode: 'A359',
    engine: 'Trent XWB-84',
    seats: 315,
    riskScore: 15,
    status: 'active',
    owners: [
      {
        name: 'Delta Air Lines',
        type: 'Airline',
        startDate: '2020-11-20',
        endDate: null
      }
    ],
    accidents: [],
    adDirectives: [],
    flightHours: 15680,
    cycles: 4200,
    lastInspection: '2024-12-01',
    nextInspection: '2025-06-01'
  }
};

const LIVE_POSITIONS = [
  {
    tail: 'N737AB',
    lat: 40.7128,
    lon: -74.0060,
    alt: 35000,
    speed: 450,
    heading: 270,
    ts: new Date(Date.now() - 5 * 60 * 1000),
    aircraft: {
      make: 'Boeing',
      model: '737-800',
      year: 2018
    }
  },
  {
    tail: 'N320CD',
    lat: 41.8781,
    lon: -87.6298,
    alt: 28000,
    speed: 380,
    heading: 180,
    ts: new Date(Date.now() - 8 * 60 * 1000),
    aircraft: {
      make: 'Airbus',
      model: 'A320',
      year: 2019
    }
  },
  {
    tail: 'N172EF',
    lat: 33.9425,
    lon: -118.4081,
    alt: 3500,
    speed: 120,
    heading: 90,
    ts: new Date(Date.now() - 2 * 60 * 1000),
    aircraft: {
      make: 'Cessna',
      model: '172',
      year: 2020
    }
  }
];

// CORS headers for all responses
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  'Access-Control-Max-Age': '86400',
};

// Health check endpoint
async function handleHealth(): Promise<Response> {
  return new Response(JSON.stringify({
    ok: true,
    ts: Date.now(),
    message: 'AeroFresh API is running with comprehensive aircraft data!',
    version: '2.0.0',
    database: 'enhanced_demo',
    environment: 'production',
    stats: {
      aircraft: Object.keys(AIRCRAFT_DATABASE).length,
      adDirectives: Object.values(AIRCRAFT_DATABASE).reduce((sum, a) => sum + a.adDirectives.length, 0),
      accidents: Object.values(AIRCRAFT_DATABASE).reduce((sum, a) => sum + a.accidents.length, 0),
      livePositions: LIVE_POSITIONS.length
    },
    note: 'Using comprehensive realistic aircraft data - database integration in progress'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...CORS,
    },
  });
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

    // Search enhanced aircraft database
    const searchResults = Object.values(AIRCRAFT_DATABASE).filter(aircraft => 
      aircraft.tail.toLowerCase().includes(query.toLowerCase()) ||
      aircraft.make.toLowerCase().includes(query.toLowerCase()) ||
      aircraft.model.toLowerCase().includes(query.toLowerCase())
    );

    if (searchResults.length > 0) {
      const results = searchResults.map(a => ({
        tail: a.tail,
        make: a.make,
        model: a.model,
        year: a.year,
        serial: a.serial,
        typeCode: a.typeCode,
        engine: a.engine,
        seats: a.seats,
        riskScore: a.riskScore
      }));

      return new Response(JSON.stringify({
        results,
        count: results.length,
        query: query.toUpperCase(),
        source: 'enhanced_demo'
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

    // Get aircraft data from enhanced database
    const aircraft = AIRCRAFT_DATABASE[tail.toUpperCase()];
    
    if (aircraft) {
      return new Response(JSON.stringify({
        ...aircraft,
        source: 'enhanced_demo'
      }), {
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

    // Get live tracking data from enhanced database
    const livePositions = LIVE_POSITIONS.slice(0, limit);

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
          source: 'enhanced_demo'
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