// Simple API for testing without Prisma
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ 
        ok: true, 
        ts: Date.now(),
        message: "AeroFresh API is running!"
      }), {
        headers: { "content-type": "application/json" },
      });
    }

    // Simple authentication check
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
    if (!apiKey || apiKey !== 'demo-api-key') {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Aircraft summary endpoint
    if (url.pathname.startsWith('/api/aircraft/') && url.pathname.endsWith('/summary')) {
      const tail = url.pathname.split('/')[3].toUpperCase();
      
      // Mock data for testing
      const mockAircraft = {
        tail: tail,
        make: 'Cessna',
        model: '172',
        year: 2015,
        engine: 'Lycoming O-320',
        seats: 4
      };

      const summary = {
        tail: mockAircraft.tail,
        regStatus: "Valid",
        airworthiness: "Standard",
        adOpenCount: 0,
        ntsbAccidents: 0,
        owners: 1,
        riskScore: 25,
        aircraft: mockAircraft
      };

      return new Response(JSON.stringify({ tail, summary }), {
        headers: { "content-type": "application/json" },
      });
    }

    // Live tracking endpoint
    if (url.pathname.startsWith('/api/aircraft/') && url.pathname.endsWith('/live')) {
      const tail = url.pathname.split('/')[3].toUpperCase();
      
      // Mock live data
      const liveData = {
        tail,
        live: {
          lat: 40.7128,
          lon: -74.0060,
          alt: 3500,
          speed: 180,
          heading: 90,
          ts: new Date().toISOString(),
          src: 'adsb'
        }
      };

      return new Response(JSON.stringify(liveData), {
        headers: { "content-type": "application/json" },
      });
    }

    // Search endpoint
    if (url.pathname === '/api/search') {
      const searchTerm = url.searchParams.get('q') || '';
      
      // Mock search results
      const results = [
        {
          tail: 'N123AB',
          make: 'Cessna',
          model: '172',
          year: 2015,
          riskScore: 25
        },
        {
          tail: 'N456CD',
          make: 'Piper',
          model: 'Cherokee',
          year: 2010,
          riskScore: 30
        }
      ].filter(aircraft => 
        aircraft.tail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aircraft.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aircraft.model.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return new Response(JSON.stringify({ results, total: results.length }), {
        headers: { "content-type": "application/json" },
      });
    }

    // 404 for unknown endpoints
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  },
};
