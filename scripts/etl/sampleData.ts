// scripts/etl/sampleData.ts
// ETL script for creating comprehensive sample aircraft data

import prisma from '../../packages/db/src/client';

// Sample aircraft data with realistic information
const sampleAircraft = [
  {
    tail: 'N123AB',
    serial: '172-12345',
    make: 'Cessna',
    model: '172',
    typeCode: 'SINGLE ENGINE LAND',
    year: 2015,
    engine: 'Lycoming O-320',
    seats: 4
  },
  {
    tail: 'N456CD',
    serial: 'PA28-45678',
    make: 'Piper',
    model: 'Cherokee',
    typeCode: 'SINGLE ENGINE LAND',
    year: 2010,
    engine: 'Lycoming O-360',
    seats: 4
  },
  {
    tail: 'N789EF',
    serial: 'BE36-78901',
    make: 'Beechcraft',
    model: 'Bonanza',
    typeCode: 'SINGLE ENGINE LAND',
    year: 2008,
    engine: 'Continental IO-550',
    seats: 6
  },
  {
    tail: 'N234GH',
    serial: 'C182-23456',
    make: 'Cessna',
    model: '182',
    typeCode: 'SINGLE ENGINE LAND',
    year: 2012,
    engine: 'Lycoming O-470',
    seats: 4
  },
  {
    tail: 'N567IJ',
    serial: 'PA32-56789',
    make: 'Piper',
    model: 'Saratoga',
    typeCode: 'SINGLE ENGINE LAND',
    year: 2005,
    engine: 'Lycoming IO-540',
    seats: 6
  },
  {
    tail: 'N890KL',
    serial: 'SR22-89012',
    make: 'Cirrus',
    model: 'SR22',
    typeCode: 'SINGLE ENGINE LAND',
    year: 2018,
    engine: 'Continental IO-550',
    seats: 4
  },
  {
    tail: 'N345MN',
    serial: 'DA40-34567',
    make: 'Diamond',
    model: 'DA40',
    typeCode: 'SINGLE ENGINE LAND',
    year: 2019,
    engine: 'Lycoming IO-360',
    seats: 4
  },
  {
    tail: 'N678OP',
    serial: 'C206-67890',
    make: 'Cessna',
    model: '206',
    typeCode: 'SINGLE ENGINE LAND',
    year: 2014,
    engine: 'Lycoming IO-540',
    seats: 6
  },
  {
    tail: 'N901QR',
    serial: 'PA34-90123',
    make: 'Piper',
    model: 'Seneca',
    typeCode: 'MULTI ENGINE LAND',
    year: 2007,
    engine: 'Continental IO-360',
    seats: 6
  },
  {
    tail: 'N456ST',
    serial: 'BE58-45678',
    make: 'Beechcraft',
    model: 'Baron',
    typeCode: 'MULTI ENGINE LAND',
    year: 2011,
    engine: 'Lycoming IO-540',
    seats: 6
  }
];

// Sample owners
const sampleOwners = [
  {
    name: 'Sky High Aviation LLC',
    type: 'Corporation',
    state: 'CA',
    country: 'US'
  },
  {
    name: 'John Smith',
    type: 'Individual',
    state: 'TX',
    country: 'US'
  },
  {
    name: 'Blue Skies Flight School',
    type: 'Partnership',
    state: 'FL',
    country: 'US'
  },
  {
    name: 'Sarah Johnson',
    type: 'Individual',
    state: 'NY',
    country: 'US'
  },
  {
    name: 'Aero Transport Services',
    type: 'Corporation',
    state: 'WA',
    country: 'US'
  }
];

// Sample accidents
const sampleAccidents = [
  {
    tail: 'N456CD',
    date: new Date('2019-08-22'),
    severity: 'SERIOUS',
    lat: 33.9416,
    lon: -118.4085,
    narrative: 'Aircraft lost control during landing approach due to crosswind conditions. Pilot made emergency landing off runway.',
    fatalities: 0,
    injuries: 2,
    phase: 'LANDING'
  },
  {
    tail: 'N789EF',
    date: new Date('2021-03-10'),
    severity: 'FATAL',
    lat: 25.7617,
    lon: -80.1918,
    narrative: 'Aircraft crashed during approach due to pilot error and weather conditions.',
    fatalities: 2,
    injuries: 0,
    phase: 'APPROACH'
  },
  {
    tail: 'N567IJ',
    date: new Date('2020-11-15'),
    severity: 'MINOR',
    lat: 40.7128,
    lon: -74.0060,
    narrative: 'Aircraft experienced engine failure during takeoff. Pilot made emergency landing on runway.',
    fatalities: 0,
    injuries: 1,
    phase: 'TAKEOFF'
  }
];

// Sample AD Directives
const sampleADDirectives = [
  {
    makeModelKey: 'cessna-172',
    ref: 'AD 2020-15-02',
    summary: 'Inspect and replace engine mount bolts',
    effectiveDate: new Date('2020-08-15'),
    status: 'OPEN',
    severity: 'HIGH'
  },
  {
    makeModelKey: 'piper-cherokee',
    ref: 'AD 2021-08-05',
    summary: 'Inspect fuel system components',
    effectiveDate: new Date('2021-08-05'),
    status: 'OPEN',
    severity: 'MEDIUM'
  },
  {
    makeModelKey: 'beechcraft-bonanza',
    ref: 'AD 2019-12-10',
    summary: 'Replace landing gear components',
    effectiveDate: new Date('2019-12-10'),
    status: 'CLOSED',
    severity: 'HIGH'
  }
];

// Sample live events
const sampleLiveEvents = [
  {
    tail: 'N123AB',
    ts: new Date(),
    lat: 40.7128,
    lon: -74.0060,
    alt: 3500,
    speed: 180,
    heading: 90,
    src: 'adsb'
  },
  {
    tail: 'N890KL',
    ts: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    lat: 33.9416,
    lon: -118.4085,
    alt: 4200,
    speed: 220,
    heading: 270,
    src: 'adsb'
  },
  {
    tail: 'N345MN',
    ts: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    lat: 25.7617,
    lon: -80.1918,
    alt: 2800,
    speed: 160,
    heading: 180,
    src: 'adsb'
  }
];

export async function createSampleData(): Promise<void> {
  console.log('🎯 Creating comprehensive sample data...');

  // Create aircraft
  console.log('✈️  Creating aircraft...');
  for (const aircraft of sampleAircraft) {
    await prisma.aircraft.upsert({
      where: { tail: aircraft.tail },
      update: aircraft,
      create: aircraft
    });
  }
  console.log(`✅ Created ${sampleAircraft.length} aircraft`);

  // Create owners
  console.log('👥 Creating owners...');
  const createdOwners = [];
  for (const ownerData of sampleOwners) {
    const owner = await prisma.owner.upsert({
      where: { name: ownerData.name },
      update: ownerData,
      create: ownerData
    });
    createdOwners.push(owner);
  }
  console.log(`✅ Created ${createdOwners.length} owners`);

  // Create aircraft-owner relationships
  console.log('🔗 Creating aircraft-owner relationships...');
  const relationships = [
    { aircraftTail: 'N123AB', ownerName: 'Sky High Aviation LLC' },
    { aircraftTail: 'N456CD', ownerName: 'John Smith' },
    { aircraftTail: 'N789EF', ownerName: 'Blue Skies Flight School' },
    { aircraftTail: 'N234GH', ownerName: 'Sarah Johnson' },
    { aircraftTail: 'N567IJ', ownerName: 'Aero Transport Services' },
    { aircraftTail: 'N890KL', ownerName: 'Sky High Aviation LLC' },
    { aircraftTail: 'N345MN', ownerName: 'John Smith' },
    { aircraftTail: 'N678OP', ownerName: 'Blue Skies Flight School' },
    { aircraftTail: 'N901QR', ownerName: 'Sarah Johnson' },
    { aircraftTail: 'N456ST', ownerName: 'Aero Transport Services' }
  ];

  for (const rel of relationships) {
    const aircraft = await prisma.aircraft.findUnique({ where: { tail: rel.aircraftTail } });
    const owner = await prisma.owner.findUnique({ where: { name: rel.ownerName } });
    
    if (aircraft && owner) {
      await prisma.aircraftOwner.upsert({
        where: {
          tail_ownerId: {
            tail: aircraft.tail,
            ownerId: owner.id
          }
        },
        update: {},
        create: {
          tail: aircraft.tail,
          ownerId: owner.id,
          startDate: new Date('2020-01-01')
        }
      });
    }
  }
  console.log(`✅ Created ${relationships.length} aircraft-owner relationships`);

  // Create accidents
  console.log('🚨 Creating accidents...');
  for (const accident of sampleAccidents) {
    await prisma.accident.create({
      data: accident
    });
  }
  console.log(`✅ Created ${sampleAccidents.length} accidents`);

  // Create AD Directives
  console.log('⚠️  Creating AD Directives...');
  for (const ad of sampleADDirectives) {
    await prisma.adDirective.upsert({
      where: { ref: ad.ref },
      update: ad,
      create: ad
    });
  }
  console.log(`✅ Created ${sampleADDirectives.length} AD Directives`);

  // Create live events
  console.log('📡 Creating live events...');
  for (const event of sampleLiveEvents) {
    await prisma.eventLive.create({
      data: event
    });
  }
  console.log(`✅ Created ${sampleLiveEvents.length} live events`);

  // Get final counts
  const aircraftCount = await prisma.aircraft.count();
  const ownerCount = await prisma.owner.count();
  const accidentCount = await prisma.accident.count();
  const adCount = await prisma.adDirective.count();
  const liveEventCount = await prisma.eventLive.count();
  const airportCount = await prisma.airport.count();

  console.log('🎉 Sample data creation completed!');
  console.log(`📊 Database now contains:
   - ${aircraftCount} aircraft
   - ${ownerCount} owners
   - ${accidentCount} accidents
   - ${adCount} AD directives
   - ${liveEventCount} live events
   - ${airportCount} airports`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createSampleData()
    .then(() => {
      console.log('✅ Sample data creation completed successfully');
      prisma.$disconnect();
    })
    .catch((err) => {
      console.error('❌ Sample data creation failed:', err);
      prisma.$disconnect();
      process.exit(1);
    });
}
