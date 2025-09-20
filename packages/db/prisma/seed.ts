import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with sample aircraft data...');

  // Create sample aircraft
  const aircraft = [
    {
      tail: 'N737AB',
      serial: 'LN-12345',
      make: 'Boeing',
      model: '737-800',
      typeCode: 'B738',
      year: 2018,
      engine: 'CFM56-7B26',
      seats: 189,
    },
    {
      tail: 'N320CD',
      serial: 'MSN-4567',
      make: 'Airbus',
      model: 'A320',
      typeCode: 'A320',
      year: 2019,
      engine: 'CFM56-5B4',
      seats: 180,
    },
    {
      tail: 'N172EF',
      serial: '172-12345',
      make: 'Cessna',
      model: '172',
      typeCode: 'C172',
      year: 2020,
      engine: 'Lycoming O-320-D2J',
      seats: 4,
    },
    {
      tail: 'N787GH',
      serial: 'LN-98765',
      make: 'Boeing',
      model: '787-9',
      typeCode: 'B789',
      year: 2021,
      engine: 'GEnx-1B74',
      seats: 290,
    },
    {
      tail: 'N350IJ',
      serial: 'MSN-5432',
      make: 'Airbus',
      model: 'A350-900',
      typeCode: 'A359',
      year: 2020,
      engine: 'Trent XWB-84',
      seats: 315,
    }
  ];

  for (const plane of aircraft) {
    await prisma.aircraft.upsert({
      where: { tail: plane.tail },
      update: plane,
      create: plane,
    });
  }

  // Create sample owners
  const owners = [
    {
      id: 'owner-1',
      name: 'Southwest Airlines',
      type: 'Airline',
      state: 'TX',
      country: 'USA',
    },
    {
      id: 'owner-2',
      name: 'American Airlines',
      type: 'Airline',
      state: 'TX',
      country: 'USA',
    },
    {
      id: 'owner-3',
      name: 'Flight Training Academy',
      type: 'Flight School',
      state: 'CA',
      country: 'USA',
    },
    {
      id: 'owner-4',
      name: 'United Airlines',
      type: 'Airline',
      state: 'IL',
      country: 'USA',
    },
    {
      id: 'owner-5',
      name: 'Delta Air Lines',
      type: 'Airline',
      state: 'GA',
      country: 'USA',
    }
  ];

  for (const owner of owners) {
    await prisma.owner.upsert({
      where: { id: owner.id },
      update: owner,
      create: owner,
    });
  }

  // Create aircraft ownership relationships
  const ownerships = [
    { tail: 'N737AB', ownerId: 'owner-1', startDate: new Date('2018-03-15') },
    { tail: 'N320CD', ownerId: 'owner-2', startDate: new Date('2019-06-20') },
    { tail: 'N172EF', ownerId: 'owner-3', startDate: new Date('2020-01-10') },
    { tail: 'N787GH', ownerId: 'owner-4', startDate: new Date('2021-09-15') },
    { tail: 'N350IJ', ownerId: 'owner-5', startDate: new Date('2020-11-20') },
  ];

  for (const ownership of ownerships) {
    await prisma.aircraftOwner.upsert({
      where: { 
        tail_ownerId: {
          tail: ownership.tail,
          ownerId: ownership.ownerId
        }
      },
      update: ownership,
      create: ownership,
    });
  }

  // Create sample AD directives
  const adDirectives = [
    {
      makeModelKey: 'Boeing-737-800',
      ref: 'AD-2023-001',
      summary: 'Inspection of engine mount bolts',
      status: 'OPEN',
      severity: 'MEDIUM',
      effectiveDate: new Date('2023-01-15'),
    },
    {
      makeModelKey: 'Airbus-A320',
      ref: 'AD-2023-002',
      summary: 'Wing flap inspection',
      status: 'OPEN',
      severity: 'HIGH',
      effectiveDate: new Date('2023-03-10'),
    },
    {
      makeModelKey: 'Boeing-787-9',
      ref: 'AD-2024-001',
      summary: 'Battery system inspection',
      status: 'OPEN',
      severity: 'HIGH',
      effectiveDate: new Date('2024-01-20'),
    }
  ];

  for (const ad of adDirectives) {
    await prisma.adDirective.upsert({
      where: { ref: ad.ref },
      update: ad,
      create: ad,
    });
  }

  // Create sample live tracking events
  const now = new Date();
  const liveEvents = [
    {
      tail: 'N737AB',
      ts: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
      lat: 40.7128,
      lon: -74.0060,
      alt: 35000,
      speed: 450,
      heading: 270,
      src: 'ADS-B',
    },
    {
      tail: 'N320CD',
      ts: new Date(now.getTime() - 8 * 60 * 1000), // 8 minutes ago
      lat: 41.8781,
      lon: -87.6298,
      alt: 28000,
      speed: 380,
      heading: 180,
      src: 'ADS-B',
    },
    {
      tail: 'N172EF',
      ts: new Date(now.getTime() - 2 * 60 * 1000), // 2 minutes ago
      lat: 33.9425,
      lon: -118.4081,
      alt: 3500,
      speed: 120,
      heading: 90,
      src: 'ADS-B',
    }
  ];

  for (const event of liveEvents) {
    await prisma.eventLive.upsert({
      where: {
        tail_ts: {
          tail: event.tail,
          ts: event.ts
        }
      },
      update: event,
      create: event,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${aircraft.length} aircraft, ${owners.length} owners, ${adDirectives.length} AD directives, ${liveEvents.length} live events`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
