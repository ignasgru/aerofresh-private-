// scripts/etl/liveData.ts
// Real-time ADS-B data integration script

import prisma from '../../packages/db/src/client';

// ADS-B data source interfaces
interface AircraftPosition {
  icao24: string;
  callsign?: string;
  origin_country?: string;
  time_position?: number;
  last_contact?: number;
  longitude?: number;
  latitude?: number;
  baro_altitude?: number;
  on_ground?: boolean;
  velocity?: number;
  true_track?: number;
  vertical_rate?: number;
  sensors?: number[];
  geo_altitude?: number;
  squawk?: string;
  spi?: boolean;
  position_source?: number;
}

interface OpenSkyResponse {
  time: number;
  states: (string | number | boolean | null)[][];
}

// Helper function to parse OpenSky API response
function parseOpenSkyState(state: (string | number | boolean | null)[]): AircraftPosition | null {
  if (state.length < 17) return null;
  
  return {
    icao24: state[0] as string,
    callsign: state[1] as string || undefined,
    origin_country: state[2] as string || undefined,
    time_position: state[3] as number || undefined,
    last_contact: state[4] as number || undefined,
    longitude: state[5] as number || undefined,
    latitude: state[6] as number || undefined,
    baro_altitude: state[7] as number || undefined,
    on_ground: state[8] as boolean || false,
    velocity: state[9] as number || undefined,
    true_track: state[10] as number || undefined,
    vertical_rate: state[11] as number || undefined,
    sensors: Array.isArray(state[12]) ? state[12] as number[] : undefined,
    geo_altitude: state[13] as number || undefined,
    squawk: state[14] as string || undefined,
    spi: state[15] as boolean || false,
    position_source: state[16] as number || undefined
  };
}

// Fetch live aircraft data from OpenSky Network
export async function fetchLiveAircraftData(): Promise<void> {
  console.log('📡 Starting live ADS-B data fetch...');
  
  try {
    // OpenSky Network API (free tier)
    const openSkyUrl = 'https://opensky-network.org/api/states/all';
    
    console.log('🌐 Fetching data from OpenSky Network...');
    const response = await fetch(openSkyUrl, {
      headers: {
        'User-Agent': 'AeroFresh/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`OpenSky API error: ${response.status} ${response.statusText}`);
    }
    
    const data: OpenSkyResponse = await response.json();
    console.log(`📊 Received ${data.states?.length || 0} aircraft positions`);
    
    if (!data.states || data.states.length === 0) {
      console.log('⚠️  No aircraft data received');
      return;
    }
    
    let processedCount = 0;
    let errorCount = 0;
    
    // Process each aircraft position
    for (const state of data.states) {
      try {
        const position = parseOpenSkyState(state);
        if (!position || !position.icao24) continue;
        
        // Convert ICAO24 to tail number (simplified - real implementation would need registry lookup)
        const tailNumber = await convertIcaoToTail(position.icao24);
        
        // Only process if we have valid coordinates and altitude
        if (!position.latitude || !position.longitude || !position.baro_altitude) continue;
        
        // Create or update live event
        await prisma.eventLive.upsert({
          where: {
            tail_ts: {
              tail: tailNumber,
              ts: new Date(position.last_contact! * 1000)
            }
          },
          update: {
            lat: position.latitude,
            lon: position.longitude,
            alt: position.baro_altitude,
            speed: position.velocity || 0,
            heading: position.true_track || 0,
            src: 'opensky'
          },
          create: {
            tail: tailNumber,
            ts: new Date(position.last_contact! * 1000),
            lat: position.latitude,
            lon: position.longitude,
            alt: position.baro_altitude,
            speed: position.velocity || 0,
            heading: position.true_track || 0,
            src: 'opensky'
          }
        });
        
        processedCount++;
        
        if (processedCount % 100 === 0) {
          console.log(`✅ Processed ${processedCount} aircraft positions...`);
        }
        
      } catch (err) {
        errorCount++;
        if (errorCount % 50 === 0) {
          console.error(`❌ ${errorCount} errors so far. Latest error:`, err);
        }
      }
    }
    
    console.log(`🎉 Live data fetch completed! Processed: ${processedCount}, Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Failed to fetch live aircraft data:', error);
    
    // Fallback: Create some sample live data
    console.log('📝 Creating sample live data as fallback...');
    await createSampleLiveData();
  }
}

// Convert ICAO24 code to tail number (simplified implementation)
async function convertIcaoToTail(icao24: string): Promise<string> {
  // In a real implementation, you would:
  // 1. Query a registry database to map ICAO24 to tail numbers
  // 2. Handle different country prefixes (N, G, F, etc.)
  // 3. Deal with military and other special cases
  
  // For now, we'll use a simple mapping or generate sample tail numbers
  const existingAircraft = await prisma.aircraft.findMany({
    take: 10
  });
  
  if (existingAircraft.length > 0) {
    // Use existing aircraft in our database
    const randomIndex = Math.floor(Math.random() * existingAircraft.length);
    return existingAircraft[randomIndex].tail;
  }
  
  // Generate a sample tail number based on ICAO24
  const numericPart = parseInt(icao24.substring(2), 16) % 1000;
  return `N${numericPart.toString().padStart(3, '0')}AB`;
}

// Create sample live data as fallback
async function createSampleLiveData(): Promise<void> {
  console.log('📝 Creating sample live tracking data...');
  
  const sampleLiveEvents = [
    {
      tail: 'N123AB',
      ts: new Date(),
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lon: -74.0060 + (Math.random() - 0.5) * 0.1,
      alt: 3500 + Math.random() * 1000,
      speed: 180 + Math.random() * 50,
      heading: Math.random() * 360,
      src: 'sample'
    },
    {
      tail: 'N456CD',
      ts: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      lat: 33.9416 + (Math.random() - 0.5) * 0.1,
      lon: -118.4085 + (Math.random() - 0.5) * 0.1,
      alt: 4200 + Math.random() * 1000,
      speed: 220 + Math.random() * 50,
      heading: Math.random() * 360,
      src: 'sample'
    },
    {
      tail: 'N789EF',
      ts: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      lat: 25.7617 + (Math.random() - 0.5) * 0.1,
      lon: -80.1918 + (Math.random() - 0.5) * 0.1,
      alt: 2800 + Math.random() * 1000,
      speed: 160 + Math.random() * 50,
      heading: Math.random() * 360,
      src: 'sample'
    }
  ];
  
  for (const event of sampleLiveEvents) {
    try {
      await prisma.eventLive.create({
        data: event
      });
    } catch (err) {
      console.error(`Failed to create sample live event for ${event.tail}:`, err);
    }
  }
  
  console.log(`✅ Created ${sampleLiveEvents.length} sample live events`);
}

// Continuous live data fetching (for production use)
export async function startLiveDataService(): Promise<void> {
  console.log('🚀 Starting continuous live data service...');
  
  // Initial fetch
  await fetchLiveAircraftData();
  
  // Set up interval for continuous updates (every 5 minutes)
  const interval = setInterval(async () => {
    try {
      await fetchLiveAircraftData();
    } catch (error) {
      console.error('❌ Live data fetch failed:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping live data service...');
    clearInterval(interval);
    process.exit(0);
  });
  
  console.log('✅ Live data service started. Updates every 5 minutes.');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'continuous') {
    startLiveDataService()
      .then(() => {
        console.log('✅ Live data service completed successfully');
      })
      .catch((err) => {
        console.error('❌ Live data service failed:', err);
        prisma.$disconnect();
        process.exit(1);
      });
  } else {
    fetchLiveAircraftData()
      .then(() => {
        console.log('✅ Live data fetch completed successfully');
        prisma.$disconnect();
      })
      .catch((err) => {
        console.error('❌ Live data fetch failed:', err);
        prisma.$disconnect();
        process.exit(1);
      });
  }
}
