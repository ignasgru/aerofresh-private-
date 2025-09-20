// scripts/etl/airports.ts
// ETL script for fetching airport data from OurAirports dataset

import prisma from '../../packages/db/src/client';

// Helper function to parse CSV line with proper quote handling
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  return result;
}

export async function fetchAirports(): Promise<void> {
  console.log('🏢 Starting Airports ETL...');
  
  const csvUrl = "https://ourairports.com/data/airports.csv";
  console.log('📥 Fetching airport data from:', csvUrl);
  
  // Use node-fetch with SSL options for development
  const fetch = (await import('node-fetch')).default;
  const httpsAgent = new (await import('https')).Agent({
    rejectUnauthorized: false // For development only
  });
  
  const response = await fetch(csvUrl, {
    agent: httpsAgent
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch airports: ${response.statusText}`);
  }
  
  const csvText = await response.text();
  console.log(`📊 Downloaded ${csvText.length} characters of data`);
  
  const lines = csvText.split("\n").filter(line => line.trim());
  if (lines.length === 0) {
    console.warn("Airports CSV is empty");
    return;
  }

  // Parse header row
  const headerLine = lines[0];
  const headers = parseCsvLine(headerLine);
  console.log(`📋 Found ${headers.length} columns:`, headers.slice(0, 5).join(', '), '...');

  let processedCount = 0;
  let errorCount = 0;

  // Process data rows (skip header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    try {
      const values = parseCsvLine(line);
      const record: Record<string, string> = {};
      headers.forEach((key, idx) => {
        record[key] = values[idx] || '';
      });

      const icao = record["ident"]?.trim().toUpperCase();
      if (!icao || icao.length < 3) continue;
      
      const lat = record["latitude_deg"] ? parseFloat(record["latitude_deg"]) : undefined;
      const lon = record["longitude_deg"] ? parseFloat(record["longitude_deg"]) : undefined;
      const elev = record["elevation_ft"] ? parseInt(record["elevation_ft"], 10) : undefined;
      const tz = record["tz_database_time_zone"] || undefined;
      const name = record["name"] || undefined;
      const iata = record["iata_code"] || undefined;
      
      // Only process airports with valid coordinates
      if (!lat || !lon || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
      
      await prisma.airport.upsert({
        where: { icao },
        update: {
          iata,
          name,
          lat,
          lon,
          elevation: elev,
          timezone: tz,
        },
        create: {
          icao,
          iata,
          name,
          lat,
          lon,
          elevation: elev,
          timezone: tz,
        },
      });
      
      processedCount++;
      if (processedCount % 1000 === 0) {
        console.log(`✅ Processed ${processedCount} airports...`);
      }
      
    } catch (err) {
      errorCount++;
      if (errorCount % 100 === 0) {
        console.error(`❌ ${errorCount} errors so far. Latest error:`, err);
      }
    }
  }

  console.log(`🎉 Airports ETL completed! Processed: ${processedCount}, Errors: ${errorCount}`);
}

// Run the ETL if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAirports()
    .then(() => {
      console.log('Airports ETL completed successfully');
      prisma.$disconnect();
    })
    .catch((err) => {
      console.error('Airports ETL failed:', err);
      prisma.$disconnect();
      process.exit(1);
    });
}
