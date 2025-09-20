import prisma from '../packages/db/src/client';

async function seedData() {
  try {
    // Create sample aircraft
    await prisma.aircraft.upsert({
      where: { tail: 'N123AB' },
      update: {},
      create: {
        tail: 'N123AB',
        make: 'Cessna',
        model: '172',
        year: 2015,
        engine: 'Lycoming O-320',
        seats: 4
      }
    });

    await prisma.aircraft.upsert({
      where: { tail: 'N456CD' },
      update: {},
      create: {
        tail: 'N456CD',
        make: 'Piper',
        model: 'Cherokee',
        year: 2010,
        engine: 'Lycoming O-320',
        seats: 4
      }
    });

    // Create sample airports
    await prisma.airport.upsert({
      where: { icao: 'KJFK' },
      update: {},
      create: {
        icao: 'KJFK',
        iata: 'JFK',
        name: 'John F Kennedy International Airport',
        lat: 40.6413,
        lon: -73.7781,
        elevation: 13
      }
    });

    await prisma.airport.upsert({
      where: { icao: 'KLAX' },
      update: {},
      create: {
        icao: 'KLAX',
        iata: 'LAX',
        name: 'Los Angeles International Airport',
        lat: 33.9416,
        lon: -118.4085,
        elevation: 125
      }
    });

    // Create sample live events
    await prisma.eventLive.create({
      data: {
        tail: 'N123AB',
        ts: new Date(),
        lat: 40.7128,
        lon: -74.0060,
        alt: 3500,
        src: 'adsb',
        speed: 180,
        heading: 90
      }
    });

    console.log('✅ Sample data created successfully!');
    console.log('📊 Created:');
    console.log('   - 2 aircraft (N123AB, N456CD)');
    console.log('   - 2 airports (KJFK, KLAX)');
    console.log('   - 1 live event');
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}
