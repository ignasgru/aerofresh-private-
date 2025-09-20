// scripts/etl/faaRegistry.ts
// ETL script for fetching the FAA aircraft registry CSV

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

// ETL function to download and parse FAA aircraft registry data
export async function fetchFaaRegistry(): Promise<void> {
  console.log('🛩️  Starting FAA Registry ETL...');
  
  // Use a more reliable FAA data source
  const csvUrl = "https://registry.faa.gov/aircraftdownload/CSVFiles/AIRCRAFT.csv";
  
  console.log('📥 Fetching FAA registry data from:', csvUrl);
  
  // Use node-fetch with SSL options for development
  const fetch = (await import('node-fetch')).default;
  const httpsAgent = new (await import('https')).Agent({
    rejectUnauthorized: false // For development only
  });
  
  const response = await fetch(csvUrl, {
    agent: httpsAgent
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch FAA registry: ${response.statusText}`);
  }
  
  const csvText = await response.text();
  console.log(`📊 Downloaded ${csvText.length} characters of data`);

  // Parse CSV - FAA format uses quotes and commas
  const lines = csvText.split("\n").filter(line => line.trim());
  if (lines.length === 0) {
    console.warn("FAA registry CSV is empty");
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

      const tail = record["N-NUMBER"]?.trim();
      if (!tail) continue;

      // Clean up make/model codes
      const makeModelCode = record["MFR MDL CODE"]?.trim();
      const [make, model] = makeModelCode ? makeModelCode.split(' ') : ['', ''];
      
      await prisma.aircraft.upsert({
        where: { tail },
        update: {
          serial: record["SERIAL NUMBER"]?.trim() || undefined,
          make: make || undefined,
          model: model || record["MODEL"]?.trim() || undefined,
          typeCode: record["ACFT TYPE"]?.trim() || undefined,
          year: record["YEAR MFR"] ? parseInt(record["YEAR MFR"], 10) : undefined,
          engine: record["ENG MFR MDL"]?.trim() || undefined,
          seats: record["SEATS"] ? parseInt(record["SEATS"], 10) : undefined,
        },
        create: {
          tail,
          serial: record["SERIAL NUMBER"]?.trim() || undefined,
          make: make || undefined,
          model: model || record["MODEL"]?.trim() || undefined,
          typeCode: record["ACFT TYPE"]?.trim() || undefined,
          year: record["YEAR MFR"] ? parseInt(record["YEAR MFR"], 10) : undefined,
          engine: record["ENG MFR MDL"]?.trim() || undefined,
          seats: record["SEATS"] ? parseInt(record["SEATS"], 10) : undefined,
        },
      });

      // Parse and insert owner information
      const ownerName = record["OWNER NAME"]?.trim();
      if (ownerName && ownerName !== 'NONE') {
        // Create or find owner
        let owner = await prisma.owner.findFirst({
          where: { name: ownerName }
        });
        
        if (!owner) {
          owner = await prisma.owner.create({
            data: {
              name: ownerName,
              type: record["OWNER TYPE"]?.trim() || undefined,
              state: record["OWNER STATE"]?.trim() || undefined,
              country: record["OWNER COUNTRY"]?.trim() || undefined,
            }
          });
        }

        // Create aircraft owner relationship
        await prisma.aircraftOwner.upsert({
          where: {
            tail_ownerId: {
              tail,
              ownerId: owner.id
            }
          },
          update: {},
          create: {
            tail,
            ownerId: owner.id,
            startDate: record["OWNER DATE"] ? new Date(record["OWNER DATE"]) : undefined,
          }
        });
      }

      processedCount++;
      if (processedCount % 1000 === 0) {
        console.log(`✅ Processed ${processedCount} aircraft...`);
      }

    } catch (err) {
      errorCount++;
      if (errorCount % 100 === 0) {
        console.error(`❌ ${errorCount} errors so far. Latest error:`, err);
      }
    }
  }

  console.log(`🎉 FAA Registry ETL completed! Processed: ${processedCount}, Errors: ${errorCount}`);
}

// Run the ETL if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchFaaRegistry()
    .then(() => {
      console.log('✅ FAA Registry ETL completed successfully');
      prisma.$disconnect();
    })
    .catch((err) => {
      console.error('❌ FAA Registry ETL failed:', err);
      prisma.$disconnect();
      process.exit(1);
    });
}