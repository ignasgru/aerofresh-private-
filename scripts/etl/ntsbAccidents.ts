// scripts/etl/ntsbAccidents.ts
// Skeleton ETL script for fetching NTSB accident and incident data

import { prisma } from "@aerofresh/db/src/client";

// Note: You may need to install 'node-fetch' and a CSV parser library
export async function fetchNtsbAccidents(): Promise<void> {
  // Example dataset: NTSB provides accident CSV via data.ntsb.gov or data.world
  const csvUrl = "https://cdn.ntsb.gov/data/aviation/accident-csv/AccidentData.csv";
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch NTSB accidents: ${response.statusText}`);
  }
  const csvText = await response.text();

  // TODO: parse CSV into records
  const lines = csvText.split("\n");
  const header = lines.shift()?.split(",");
  if (!header) {
    console.warn("NTSB accidents CSV has no header");
    return;
  }

  for (const line of lines) {
    if (!line.trim()) continue;
    const values = line.split(",");
    const record: Record<string, string> = {};
    header.forEach((key, idx) => {
      record[key] = values[idx];
    });

    const tail = record["N-NUMBER"]?.trim();
    const date = record["EVENT DATE"];
    if (!tail || !date) continue;
    try {
      await prisma.accident.create({
        data: {
          tail,
          date: new Date(date),
          severity: record["INJURY SEVERITY"] || undefined,
          locationLat: record["LATITUDE"] ? parseFloat(record["LATITUDE"]) : undefined,
          locationLon: record["LONGITUDE"] ? parseFloat(record["LONGITUDE"]) : undefined,
          narrative: record["NARRATIVE"] || undefined,
          injuries: record["TOTAL FATALITIES"] ? parseInt(record["TOTAL FATALITIES"], 10) : undefined,
        },
      });
    } catch (err) {
      console.error(`Failed to insert accident for ${tail}:`, err);
    }
  }

  console.log("Finished processing NTSB accidents");
}

if (require.main === module) {
  fetchNtsbAccidents().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
