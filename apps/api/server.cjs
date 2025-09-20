// Simple Node.js API server for testing real data
const http = require('http');
const url = require('url');

// Mock data for testing
const mockAircraft = {
  'N123AB': {
    tail: 'N123AB',
    make: 'Cessna',
    model: '172',
    year: 2015,
    engine: 'Lycoming O-320',
    seats: 4,
    riskScore: 25,
    accidents: 0,
    owners: 1
  },
  'N456CD': {
    tail: 'N456CD',
    make: 'Piper',
    model: 'Cherokee',
    year: 2010,
    engine: 'Lycoming O-320',
    seats: 4,
    riskScore: 30,
    accidents: 1,
    owners: 2
  }
};

const mockLiveData = {
  'N123AB': {
    tail: 'N123AB',
    live: {
      lat: 40.7128,
      lon: -74.0060,
      alt: 3500,
      speed: 180,
      heading: 90,
      ts: new Date().toISOString(),
      src: 'adsb'
    }
  }
};

// Simple authentication
function authenticateRequest(req) {
  const apiKey = req.headers['x-api-key'] || 
                 req.headers.authorization?.replace('Bearer ', '');
  return apiKey === 'demo-api-key';
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check (no auth required)
  if (path === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      ok: true,
      ts: Date.now(),
      message: 'AeroFresh API is running!',
      version: '1.0.0'
    }));
    return;
  }

  // Authenticate other endpoints
  if (!authenticateRequest(req)) {
    res.writeHead(401);
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  // Aircraft summary endpoint
  if (path.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/summary$/)) {
    const tail = path.split('/')[3].toUpperCase();
    const aircraft = mockAircraft[tail];
    
    if (!aircraft) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Aircraft not found' }));
      return;
    }

    const summary = {
      tail: aircraft.tail,
      regStatus: 'Valid',
      airworthiness: 'Standard',
      adOpenCount: 0,
      ntsbAccidents: aircraft.accidents,
      owners: aircraft.owners,
      riskScore: aircraft.riskScore,
      aircraft: aircraft
    };

    res.writeHead(200);
    res.end(JSON.stringify({ tail, summary }));
    return;
  }

  // Aircraft history endpoint: /api/aircraft/:tail/history
  if (path.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/history$/)) {
    const tail = path.split('/')[3].toUpperCase();
    const aircraft = mockAircraft[tail];
    
    if (!aircraft) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Aircraft not found' }));
      return;
    }

    // Mock history data
    const history = {
      owners: [
        {
          owner: {
            name: 'Sample Aircraft Owner',
            type: 'Individual',
            state: 'CA',
            country: 'US'
          },
          startDate: '2020-01-01',
          endDate: null
        }
      ],
      accidents: [],
      adDirectives: []
    };

    res.writeHead(200);
    res.end(JSON.stringify({ tail, history }));
    return;
  }

  // Live tracking endpoint
  if (path.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/live$/)) {
    const tail = path.split('/')[3].toUpperCase();
    const liveData = mockLiveData[tail];
    
    if (!liveData) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Live data not found' }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify(liveData));
    return;
  }

  // Search endpoint
  if (path === '/api/search') {
    const query = parsedUrl.query.q || '';
    const results = Object.values(mockAircraft).filter(aircraft => 
      aircraft.tail.toLowerCase().includes(query.toLowerCase()) ||
      aircraft.make.toLowerCase().includes(query.toLowerCase()) ||
      aircraft.model.toLowerCase().includes(query.toLowerCase())
    );

    res.writeHead(200);
    res.end(JSON.stringify({ results, total: results.length }));
    return;
  }

  // Live tracking - recent positions
  if (path === '/api/tracking/live') {
    const limit = parseInt(parsedUrl.query.limit || '100');
    const positions = Object.values(mockLiveData).slice(0, limit);
    
    res.writeHead(200);
    res.end(JSON.stringify({ positions }));
    return;
  }

  // 404 for unknown endpoints
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 AeroFresh API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Search: http://localhost:${PORT}/api/search?q=N123AB`);
  console.log(`✈️  Aircraft: http://localhost:${PORT}/api/aircraft/N123AB/summary`);
  console.log(`📍 Live data: http://localhost:${PORT}/api/aircraft/N123AB/live`);
});
