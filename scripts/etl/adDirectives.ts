// scripts/etl/adDirectives.ts
// ETL script for downloading Airworthiness Directives (ADs)

import prisma from '../../packages/db/src/client';

// NOTE: The FAA publishes ADs in PDF/HTML; you may need to scrape or parse them.
// This script outlines the steps but does not implement full parsing logic.
export async function fetchAdDirectives(): Promise<void> {
  // Example base URL for FAA Airworthiness Directives by make/model.
  // You might iterate over aircraft makes and models from the database and fetch corresponding ADs.
  const baseUrl = "https://www.faa.gov/regulations_policies/airworthiness_directives/index.cfm";

  // TODO: fetch pages per make/model, parse directive numbers, titles, and effective dates.
  // For demonstration, we will define a placeholder array of AD records.
  const mockAds = [
    {
      ref: "AD 2020-24-09",
      makeModelKey: "CESSNA-172", // key like `${make}-${model}`
      summary: "Inspection of fuel lines for corrosion",
      effectiveDate: new Date("2020-12-10"),
    },
  ];

  for (const ad of mockAds) {
    try {
      await prisma.adDirective.create({
        data: {
          ref: ad.ref,
          makeModelKey: ad.makeModelKey,
          summary: ad.summary,
          effectiveDate: ad.effectiveDate,
          status: 'OPEN',
          severity: 'MEDIUM',
        },
      });
    } catch (err) {
      console.error(`Failed to upsert AD ${ad.ref}:`, err);
    }
  }

  console.log("Finished processing Airworthiness Directives");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAdDirectives()
    .then(() => {
      console.log('AD Directives ETL completed successfully');
      prisma.$disconnect();
    })
    .catch((err) => {
      console.error('AD Directives ETL failed:', err);
      prisma.$disconnect();
      process.exit(1);
    });
}
