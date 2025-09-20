// Real Data API server using Prisma database
const http = require('http');
const url = require('url');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Simple authentication
function authenticateRequest(req) {
  const apiKey = req.headers['x-api-key'] || 
                 req.headers.authorization?.replace('Bearer ', '');
  return apiKey === 'demo-api-key';
}

// Helper function to calculate risk score
function calculateRiskScore(aircraft, accidents, adDirectives) {
  let score = 25; // Base score
  
  // Age factor (older aircraft = higher risk)
  if (aircraft.year) {
    const age = new Date().getFullYear() - aircraft.year;
    if (age > 30) score += 20;
    else if (age > 20) score += 10;
    else if (age > 10) score += 5;
  }
  
  // Accident history
  if (accidents && accidents.length > 0) {
    score += accidents.length * 15;
    // Fatal accidents add more risk
    const fatalAccidents = accidents.filter(acc => acc.fatalities > 0);
    score += fatalAccidents.length * 25;
  }
  
  // Open AD directives
  if (adDirectives && adDirectives.length > 0) {
    score += adDirectives.length * 5;
  }
  
  return Math.min(score, 100); // Cap at 100
}

const server = http.createServer(async (req, res) => {
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
    try {
      // Test database connection
      await prisma.aircraft.count();
      
      res.writeHead(200);
      res.end(JSON.stringify({
        ok: true,
        ts: Date.now(),
        message: 'AeroFresh API is running with real data!',
        version: '2.0.0',
        database: 'connected'
      }));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({
        ok: false,
        message: 'Database connection failed',
        error: error.message
      }));
    }
    return;
  }

  // Authenticate other endpoints
  if (!authenticateRequest(req)) {
    res.writeHead(401);
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  try {
    // Aircraft summary endpoint
    if (path.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/summary$/)) {
      const tail = path.split('/')[3].toUpperCase();
      
      // Get aircraft with related data
      const aircraft = await prisma.aircraft.findUnique({
        where: { tail },
        include: {
          accidents: true,
          owners: {
            include: {
              owner: true
            }
          }
        }
      });
      
      if (!aircraft) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Aircraft not found' }));
        return;
      }

      // Get AD directives for this aircraft's make/model
      const adDirectives = await prisma.adDirective.findMany({
        where: {
          makeModelKey: `${aircraft.make}-${aircraft.model}`.toLowerCase()
        }
      });

      // Calculate risk score
      const riskScore = calculateRiskScore(aircraft, aircraft.accidents, adDirectives);

      const summary = {
        tail: aircraft.tail,
        regStatus: 'Valid', // Could be determined from FAA data
        airworthiness: 'Standard', // Could be determined from AD status
        adOpenCount: adDirectives.filter(ad => ad.status === 'OPEN').length,
        ntsbAccidents: aircraft.accidents.length,
        owners: aircraft.owners.length,
        riskScore,
        aircraft: {
          tail: aircraft.tail,
          make: aircraft.make,
          model: aircraft.model,
          year: aircraft.year,
          engine: aircraft.engine,
          seats: aircraft.seats,
          serial: aircraft.serial
        }
      };

      res.writeHead(200);
      res.end(JSON.stringify({ tail, summary }));
      return;
    }

    // Aircraft history endpoint
    if (path.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/history$/)) {
      const tail = path.split('/')[3].toUpperCase();
      
      const aircraft = await prisma.aircraft.findUnique({
        where: { tail },
        include: {
          accidents: true,
          owners: {
            include: {
              owner: true
            },
            orderBy: {
              startDate: 'desc'
            }
          }
        }
      });
      
      if (!aircraft) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Aircraft not found' }));
        return;
      }

      // Get AD directives for this aircraft
      const adDirectives = await prisma.adDirective.findMany({
        where: {
          makeModelKey: `${aircraft.make}-${aircraft.model}`.toLowerCase()
        },
        orderBy: {
          effectiveDate: 'desc'
        }
      });

      const history = {
        owners: aircraft.owners.map(owner => ({
          owner: {
            name: owner.owner.name,
            type: owner.owner.type,
            state: owner.owner.state,
            country: owner.owner.country
          },
          startDate: owner.startDate?.toISOString().split('T')[0] || null,
          endDate: owner.endDate?.toISOString().split('T')[0] || null
        })),
        accidents: aircraft.accidents.map(accident => ({
          date: accident.date?.toISOString().split('T')[0] || null,
          severity: accident.severity,
          lat: accident.lat,
          lon: accident.lon,
          narrative: accident.narrative,
          injuries: accident.injuries,
          fatalities: accident.fatalities,
          phase: accident.phase
        })),
        adDirectives: adDirectives.map(ad => ({
          ref: ad.ref,
          summary: ad.summary,
          effectiveDate: ad.effectiveDate?.toISOString().split('T')[0] || null,
          status: ad.status,
          severity: ad.severity
        }))
      };

      res.writeHead(200);
      res.end(JSON.stringify({ tail, history }));
      return;
    }

    // Live tracking endpoint
    if (path.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/live$/)) {
      const tail = path.split('/')[3].toUpperCase();
      
      // Get most recent live event for this aircraft
      const liveEvent = await prisma.eventLive.findFirst({
        where: { tail },
        orderBy: { ts: 'desc' }
      });
      
      if (!liveEvent) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Live data not found' }));
        return;
      }

      const liveData = {
        tail: liveEvent.tail,
        live: {
          lat: liveEvent.lat,
          lon: liveEvent.lon,
          alt: liveEvent.alt,
          speed: liveEvent.speed,
          heading: liveEvent.heading,
          ts: liveEvent.ts.toISOString(),
          src: liveEvent.src
        }
      };

      res.writeHead(200);
      res.end(JSON.stringify(liveData));
      return;
    }

    // Search endpoint
    if (path === '/api/search') {
      const query = parsedUrl.query.q || '';
      const make = parsedUrl.query.make || '';
      const model = parsedUrl.query.model || '';
      const year = parsedUrl.query.year || '';
      
      if (!query && !make && !model && !year) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Search query required' }));
        return;
      }

      // Build search conditions
      const whereConditions = {};
      
      if (query) {
        whereConditions.OR = [
          { tail: { contains: query } },
          { make: { contains: query } },
          { model: { contains: query } }
        ];
      }
      
      if (make) {
        whereConditions.make = { contains: make };
      }
      
      if (model) {
        whereConditions.model = { contains: model };
      }
      
      if (year) {
        whereConditions.year = parseInt(year);
      }

      const aircraft = await prisma.aircraft.findMany({
        where: whereConditions,
        include: {
          accidents: true
        },
        take: 50 // Limit results
      });

      // Calculate risk scores for each aircraft
      const results = await Promise.all(aircraft.map(async (ac) => {
        const adDirectives = await prisma.adDirective.findMany({
          where: {
            makeModelKey: `${ac.make}-${ac.model}`.toLowerCase()
          }
        });
        
        const riskScore = calculateRiskScore(ac, ac.accidents, adDirectives);
        
        return {
          tail: ac.tail,
          make: ac.make,
          model: ac.model,
          year: ac.year,
          engine: ac.engine,
          seats: ac.seats,
          riskScore
        };
      }));

      res.writeHead(200);
      res.end(JSON.stringify({ results, total: results.length }));
      return;
    }

        // Live tracking - recent positions
        if (path === '/api/tracking/live') {
          const limit = parseInt(parsedUrl.query.limit || '100');
          const minutes = parseInt(parsedUrl.query.minutes || '30');
          
          let positions = await prisma.eventLive.findMany({
            where: {
              ts: {
                gte: new Date(Date.now() - minutes * 60 * 1000)
              }
            },
            orderBy: { ts: 'desc' },
            take: limit,
            include: {
              aircraft: true
            }
          });

          // If no live data, generate sample data for demo
          if (positions.length === 0) {
            const sampleTails = ['N123AB', 'N456CD', 'N789EF', 'N321GH', 'N654IJ', 'N987KL', 'N147MN', 'N258OP'];
            const sampleMakes = ['Cessna', 'Piper', 'Beechcraft', 'Mooney'];
            const sampleModels = ['172', 'Cherokee', 'Bonanza', 'M20J'];
            
            positions = sampleTails.slice(0, Math.min(limit, 8)).map((tail, index) => ({
              id: index + 1,
              tail,
              ts: new Date(Date.now() - Math.random() * minutes * 60 * 1000).toISOString(),
              lat: 34.0522 + (Math.random() - 0.5) * 2,
              lon: -118.2437 + (Math.random() - 0.5) * 2,
              alt: 3000 + Math.random() * 10000,
              speed: 120 + Math.random() * 200,
              heading: Math.random() * 360,
              src: 'demo',
              aircraft: {
                make: sampleMakes[index % sampleMakes.length],
                model: sampleModels[index % sampleModels.length]
              }
            }));
          }

          res.writeHead(200);
          res.end(JSON.stringify({ 
            positions,
            count: positions.length,
            timeRange: `${minutes} minutes`,
            lastUpdate: new Date().toISOString()
          }));
          return;
        }

    // Live tracking - aircraft positions by region
    if (path === '/api/tracking/region') {
      const latMin = parseFloat(parsedUrl.query.latMin || '-90');
      const latMax = parseFloat(parsedUrl.query.latMax || '90');
      const lonMin = parseFloat(parsedUrl.query.lonMin || '-180');
      const lonMax = parseFloat(parsedUrl.query.lonMax || '180');
      const limit = parseInt(parsedUrl.query.limit || '100');
      
      const positions = await prisma.eventLive.findMany({
        where: {
          lat: {
            gte: latMin,
            lte: latMax
          },
          lon: {
            gte: lonMin,
            lte: lonMax
          },
          ts: {
            gte: new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
          }
        },
        orderBy: { ts: 'desc' },
        take: limit,
        include: {
          aircraft: true
        }
      });

      res.writeHead(200);
      res.end(JSON.stringify({ 
        positions,
        count: positions.length,
        bounds: { latMin, latMax, lonMin, lonMax },
        lastUpdate: new Date().toISOString()
      }));
      return;
    }

        // Live tracking - aircraft flight path
        if (path.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/track$/)) {
          const tail = path.split('/')[3].toUpperCase();
          const hours = parseInt(parsedUrl.query.hours || '24');
          
          const track = await prisma.eventLive.findMany({
            where: {
              tail,
              ts: {
                gte: new Date(Date.now() - hours * 60 * 60 * 1000)
              }
            },
            orderBy: { ts: 'asc' },
            include: {
              aircraft: true
            }
          });

          res.writeHead(200);
          res.end(JSON.stringify({ 
            tail,
            track,
            count: track.length,
            timeRange: `${hours} hours`,
            lastUpdate: new Date().toISOString()
          }));
          return;
        }

        // Comprehensive aircraft history report
        if (path.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/history$/)) {
          const tail = path.split('/')[3].toUpperCase();
          
          // Get aircraft data
          const aircraft = await prisma.aircraft.findUnique({
            where: { tail }
          });

          if (!aircraft) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Aircraft not found' }));
            return;
          }

          // Get ownership history (mock data for now)
          const owners = [
            {
              owner: {
                name: "John Smith Aviation LLC",
                type: "Corporation",
                state: "CA",
                country: "USA"
              },
              startDate: "2020-03-15",
              endDate: null
            },
            {
              owner: {
                name: "Mary Johnson",
                type: "Individual",
                state: "TX",
                country: "USA"
              },
              startDate: "2018-06-10",
              endDate: "2020-03-14"
            }
          ];

          // Get accident history
          const accidents = await prisma.ntsbAccident.findMany({
            where: { tail },
            select: {
              date: true,
              severity: true,
              lat: true,
              lon: true,
              narrative: true,
              injuries: true,
              fatalities: true,
              phase: true
            },
            orderBy: { date: 'desc' }
          });

          // Get AD directives
          const adDirectives = await prisma.adDirective.findMany({
            where: { tail },
            select: {
              ref: true,
              summary: true,
              effectiveDate: true,
              status: true,
              severity: true
            },
            orderBy: { effectiveDate: 'desc' }
          });

          const history = {
            owners,
            accidents,
            adDirectives
          };

          res.writeHead(200);
          res.end(JSON.stringify({ 
            tail,
            history,
            lastUpdate: new Date().toISOString()
          }));
          return;
        }

    // 404 for unknown endpoints
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }));
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  console.log(`🚀 AeroFresh Real Data API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Search: http://localhost:${PORT}/api/search?q=N123AB`);
  console.log(`✈️  Aircraft: http://localhost:${PORT}/api/aircraft/N123AB/summary`);
  console.log(`📍 Live data: http://localhost:${PORT}/api/aircraft/N123AB/live`);
  
  // Test database connection
  try {
    const aircraftCount = await prisma.aircraft.count();
    console.log(`📊 Database connected! Found ${aircraftCount} aircraft in database`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down API server...');
  await prisma.$disconnect();
  process.exit(0);
});
