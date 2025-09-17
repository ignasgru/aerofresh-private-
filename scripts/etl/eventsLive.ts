import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch live aircraft events from an external API (e.g. OpenSky or ADS-B Exchange).
async function fetchLiveEvents(): Promise<Array<{ tail: string; ts: Date; lat: number; lon: number; alt: number; src: string }>> {
  // TODO: Implement API call to fetch live flight positions.
  // Example: call OpenSky or ADS-B Exchange to get aircraft positions.
  // Return an array of objects with tail number, timestamp, latitude, longitude, altitude, and source identifier.
  return [];
}

export async function loadEventLive(): Promise<void> {
  const events = await fetchLiveEvents();
  for (const event of events) {
    const { tail, ts, lat, lon, alt, src } = event;
    await prisma.eventLive.create({
      data: { tail, ts, lat, lon, alt, src },
    });
  }
  console.log('Live events loaded');
}

if (require.main === module) {
  loadEventLive().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
