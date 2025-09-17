import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch METAR weather reports from an external API. You may use AVWX or NOAA.
async function fetchMetarData(): Promise<Array<{ icao: string; ts: Date; raw: string; parsed: any }>> {
  // TODO: Implement API call to fetch METAR reports
  // Example: const response = await fetch('https://avwx.rest/api/metar/...');
  // Return an array of objects with ICAO code, timestamp, raw METAR string, and parsed JSON
  return [];
}

export async function loadWeatherMetar(): Promise<void> {
  const reports = await fetchMetarData();
  for (const report of reports) {
    const { icao, ts, raw, parsed } = report;
    // Upsert into the WeatherMetar table. Adjust the unique identifier as needed.
    await prisma.weatherMetar.upsert({
      where: { icao_ts: { icao, ts } },
      update: { raw, parsed },
      create: { icao, ts, raw, parsed },
    });
  }
  console.log('Weather METAR sync complete');
}

if (require.main === module) {
  loadWeatherMetar().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
