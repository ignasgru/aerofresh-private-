import prisma from '../../packages/db/src/client';

// Define AircraftPosition interface locally for this script
interface AircraftPosition {
  icao24: string;
  callsign?: string;
  latitude?: number;
  longitude?: number;
  baroAltitude?: number;
  geoAltitude?: number;
  velocity?: number;
  trueTrack?: number;
  verticalRate?: number;
  timePosition: number;
  lastContact: number;
  onGround: boolean;
  spi: boolean;
  squawk?: string;
  originCountry?: string;
}


// Mock flight tracker for ETL script (in production, this would be the real implementation)
class MockFlightTracker {
  async getOpenSkyPositions(): Promise<AircraftPosition[]> {
    // In a real implementation, this would call OpenSky API
    // For now, return mock data
    console.log('Mock: Fetching aircraft positions from OpenSky...');
    return [
      {
        icao24: 'ABC123',
        callsign: 'N123AB',
        latitude: 40.7128,
        longitude: -74.0060,
        baroAltitude: 3500,
        geoAltitude: 3600,
        velocity: 180,
        trueTrack: 90,
        verticalRate: 500,
        timePosition: Date.now(),
        lastContact: Date.now(),
        onGround: false,
        spi: false,
        squawk: '1200',
        originCountry: 'US'
      }
    ];
  }
}

const flightTracker = new MockFlightTracker();

// Fetch live aircraft events from ADS-B data sources
async function fetchLiveEvents(): Promise<Array<{ tail: string; ts: Date; lat: number; lon: number; alt: number; src: string; speed?: number; heading?: number }>> {
  try {
    // Get current aircraft positions from OpenSky
    const positions = await flightTracker.getOpenSkyPositions();
    
    return positions.map((pos: AircraftPosition) => ({
      tail: pos.callsign || `ICAO${pos.icao24}`,
      ts: new Date(pos.timePosition),
      lat: pos.latitude || 0,
      lon: pos.longitude || 0,
      alt: pos.baroAltitude || pos.geoAltitude || 0,
      src: 'adsb',
      speed: pos.velocity,
      heading: pos.trueTrack
    }));
  } catch (error) {
    console.error('Failed to fetch live events:', error);
    return [];
  }
}

export async function loadEventLive(): Promise<void> {
  const events = await fetchLiveEvents();
  for (const event of events) {
    const { tail, ts, lat, lon, alt, src, speed, heading } = event;
    await prisma.eventLive.create({
      data: { 
        tail, 
        ts, 
        lat, 
        lon, 
        alt, 
        src,
        speed,
        heading
      },
    });
  }
  console.log(`Loaded ${events.length} live events`);
}

// Run the ETL if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  loadEventLive()
    .then(() => {
      console.log('Live Events ETL completed successfully');
      prisma.$disconnect();
    })
    .catch((err) => {
      console.error('Live Events ETL failed:', err);
      prisma.$disconnect();
      process.exit(1);
    });
}
