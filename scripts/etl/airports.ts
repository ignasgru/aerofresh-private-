// scripts/etl/airports.ts
// Skeleton ETL script for fetching airport data from OurAirports dataset

import { prisma } from "@aerofresh/db/src/client";

export async function fetchAirports(): Promise<void> {
  const csvUrl = "https://ourairports.com/data/airports.csv";
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch airports: ${response.statusText}`);
  }
  const csvText = await response.text();
  const lines = csvText.split("\n");
  const header = lines.shift()?.split(",");
  if (!header) {
    console.warn("Airports CSV has no header");
    return;
  }

  for (const line of lines) {
    if (!line.trim()) continue;
    const values = line.split(",");
    const record: Record<string, string> = {};
    header.forEach((key, idx) => {
      record[key] = values[idx];
    });

    const icao = record["ident"]?.trim().toUpperCase();
    if (!icao) continue;
    const lat = record["latitude_deg"] ? parseFloat(record["latitude_deg"]) : undefined;
    const lon = record["longitude_deg"] ? parseFloat(record["longitude_deg"]) : undefined;
    const elev = record["elevation_ft"] ? parseInt(record["elevation_ft"], 10) : undefined;
    const tz = record["tz_database_time_zone"] || undefined;
    const name = record["name"] || undefined;
    const iata = record["iata_code"] || undefined;
    try {
      await prisma.airport.upsert({
        where: { icao },
        update: {
          iata,
          name,
          geom: lat !== undefined && lon !== undefined ? { lat, lon } : undefined,
          elev,
          tz,
        },
        create: {
          icao,
          iata,
          name,
          geom: lat !== undefined && lon !== undefined ? { lat, lon } : undefined,
          elev,
          tz,
        },
      });
    } catch (err) {
      console.error(`Failed to upsert airport ${icao}:`, err);
    }
  }

  console.log("Finished processing airports");
}

if (require.main === module) {
  fetchAirports().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
