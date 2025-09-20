import prisma from '../../packages/db/src/client';
// Fetch METAR weather reports from an external API. You may use AVWX or NOAA.
async function fetchMetarData() {
    // TODO: Implement API call to fetch METAR reports
    // Example: const response = await fetch('https://avwx.rest/api/metar/...');
    // Return an array of objects with ICAO code, timestamp, raw METAR string, and parsed JSON
    return [];
}
export async function loadWeatherMetar() {
    const reports = await fetchMetarData();
    for (const report of reports) {
        const { icao, ts, raw, parsed } = report;
        // Insert into the WeatherMetar table
        await prisma.weatherMetar.create({
            data: { icao, ts, raw, parsed },
        });
    }
    console.log('Weather METAR sync complete');
}
if (require.main === module) {
    loadWeatherMetar()
        .then(() => {
        console.log('Weather METAR ETL completed successfully');
        prisma.$disconnect();
    })
        .catch((err) => {
        console.error('Weather METAR ETL failed:', err);
        prisma.$disconnect();
        process.exit(1);
    });
}
