// scripts/etl/faaRegistry.ts
// Skeleton ETL script for fetching the FAA aircraft registry CSV

import { prisma } from "@aerofresh/db/src/client";

// You may need to install 'node-fetch' and 'papaparse' or use native fetch once supported
// This function downloads the FAA registry CSV and upserts aircraft and owners into the database
export async function fetchFaaRegistry(): Promise<void> {
  const csvUrl = "https://registry.faa.gov/aircraftdownload/CSVFiles/AIRCRAFT.csv";
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch FAA registry: ${response.statusText}`);
  }
  const csvText = await response.text();

  // Parse CSV using PapaParse or a custom parser
  // We assume a header row with fields N-NUMBER, SERIAL NUMBER, MFR MDL CODE, etc.
  // For brevity we do not import papaparse here, but in a real script you would.
  // TODO: install and use 'papaparse' or similar library to parse the CSV

  const lines = csvText.split("\n");
  const header = lines.shift()?.split(",");
  if (!header) {
    console.warn("FAA registry CSV has no header row");
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
    if (!tail) continue;

    try {
      await prisma.aircraft.upsert({
        where: { tail },
        update: {
          make: record["MFR MDL CODE"] || undefined,
          model: record["MODEL"] || undefined,
          typeCode: record["ACFT TYPE"] || undefined,
          year: record["YEAR MFR"] ? parseInt(record["YEAR MFR"], 10) : undefined,
        },
        create: {
          tail,
          make: record["MFR MDL CODE"] || undefined,
          model: record["MODEL"] || undefined,
          typeCode: record["ACFT TYPE"] || undefined,
          year: record["YEAR MFR"] ? parseInt(record["YEAR MFR"], 10) : undefined,
        },
      });

      // TODO: parse owner fields and insert into Owner and AircraftOwner tables

    } catch (err) {
      console.error(`Failed to upsert aircraft ${tail}:`, err);
    }
  }

  console.log("Finished processing FAA registry");
}

// Allow running via `ts-node scripts/etl/faaRegistry.ts`
if (require.main === module) {
  fetchFaaRegistry().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
