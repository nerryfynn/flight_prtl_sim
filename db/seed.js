const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
const {
  airports,
  airlines,
  aircraft,
  flights,
  passengers,
  bookings,
} = require('./schema.ts')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool)

async function seed() {
  try {
    console.log('🌱 Seeding database...')

    // Create airports
    const airportData = [
      { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
      { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
      { code: 'KIX', name: 'Kansai International', city: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo' },
      { code: 'VNO', name: 'Vilnius', city: 'Vilnius', country: 'Lithuania', timezone: 'Europe/Vilnius' },
      { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK', timezone: 'Europe/London' },
      { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
      { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
      { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA', timezone: 'America/New_York' },
      { code: 'SYD', name: 'Sydney', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
      { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
    ]

    console.log('✈️  Creating airports...')
    for (const ap of airportData) {
      await db.insert(airports).values(ap).onConflictDoNothing()
    }

    // Create airlines
    const airlineData = [
      { code: 'NH', name: 'All Nippon Airways', country: 'Japan' },
      { code: 'JL', name: 'Japan Airlines', country: 'Japan' },
      { code: 'BA', name: 'British Airways', country: 'UK' },
    ]

    console.log('🛫 Creating airlines...')
    const createdAirlines = []
    for (const al of airlineData) {
      const [airline] = await db.insert(airlines).values(al).onConflictDoNothing().returning()
      if (airline) createdAirlines.push(airline)
    }

    // Create aircraft
    const aircraftData = [
      {
        registration: 'JA8941',
        model: 'Boeing 777-200',
        manufacturer: 'Boeing',
        totalSeats: 330,
        economySeats: 274,
        businessSeats: 56,
        firstClassSeats: 0,
      },
      {
        registration: 'JA381A',
        model: 'Airbus A380-800',
        manufacturer: 'Airbus',
        totalSeats: 520,
        economySeats: 420,
        businessSeats: 100,
        firstClassSeats: 0,
      },
      {
        registration: 'JA894D',
        model: 'Boeing 787-9',
        manufacturer: 'Boeing',
        totalSeats: 285,
        economySeats: 225,
        businessSeats: 60,
        firstClassSeats: 0,
      },
    ]

    console.log('✈️  Creating aircraft...')
    const createdAircraft = []
    for (const ac of aircraftData) {
      const [a] = await db.insert(aircraft).values(ac).returning()
      if (a) createdAircraft.push(a)
    }

    // Create flights
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const inThreeDays = new Date()
    inThreeDays.setDate(inThreeDays.getDate() + 3)
    const inWeek = new Date()
    inWeek.setDate(inWeek.getDate() + 7)

    const flightData = [
      {
        flightNumber: 'NH2047',
        airlineId: createdAirlines[0]?.id || 1,
        aircraftId: createdAircraft[2]?.id || 3,
        departureAirportId: 1,
        arrivalAirportId: 4,
        departureTime: new Date('2026-07-30T10:00:00+09:00'),
        arrivalTime: new Date('2026-07-30T16:00:00+03:00'),
        duration: 840,
        distance: 9300,
        economyPrice: 19860000,
        businessPrice: 45000000,
        firstClassPrice: 65000000,
        economyAvailable: 180,
        businessAvailable: 30,
        firstClassAvailable: 0,
      },
      {
        flightNumber: 'NH473',
        airlineId: createdAirlines[0]?.id || 1,
        aircraftId: createdAircraft[2]?.id || 3,
        departureAirportId: 2,
        arrivalAirportId: 1,
        departureTime: tomorrow,
        arrivalTime: new Date(tomorrow.getTime() + 60 * 60000),
        duration: 60,
        distance: 270,
        economyPrice: 2800000,
        businessPrice: 5500000,
        firstClassPrice: 0,
        economyAvailable: 140,
        businessAvailable: 30,
        firstClassAvailable: 0,
      },
      {
        flightNumber: 'NH211',
        airlineId: createdAirlines[0]?.id || 1,
        aircraftId: createdAircraft[0]?.id || 1,
        departureAirportId: 1,
        arrivalAirportId: 5,
        departureTime: inThreeDays,
        arrivalTime: new Date(inThreeDays.getTime() + 720 * 60000),
        duration: 720,
        distance: 9560,
        economyPrice: 15900000,
        businessPrice: 33000000,
        firstClassPrice: 0,
        economyAvailable: 210,
        businessAvailable: 42,
        firstClassAvailable: 0,
      },
      {
        flightNumber: 'NH175',
        airlineId: createdAirlines[0]?.id || 1,
        aircraftId: createdAircraft[0]?.id || 1,
        departureAirportId: 1,
        arrivalAirportId: 7,
        departureTime: inWeek,
        arrivalTime: new Date(inWeek.getTime() + 570 * 60000),
        duration: 570,
        distance: 8800,
        economyPrice: 12500000,
        businessPrice: 28000000,
        firstClassPrice: 0,
        economyAvailable: 200,
        businessAvailable: 48,
        firstClassAvailable: 0,
      },
      {
        flightNumber: 'JL401',
        airlineId: createdAirlines[1]?.id || 2,
        aircraftId: createdAircraft[1]?.id || 2,
        departureAirportId: 3,
        arrivalAirportId: 10,
        departureTime: tomorrow,
        arrivalTime: new Date(tomorrow.getTime() + 300 * 60000),
        duration: 300,
        distance: 2200,
        economyPrice: 7500000,
        businessPrice: 16000000,
        firstClassPrice: 0,
        economyAvailable: 280,
        businessAvailable: 60,
        firstClassAvailable: 0,
      },
      {
        flightNumber: 'BA109',
        airlineId: createdAirlines[2]?.id || 3,
        aircraftId: createdAircraft[2]?.id || 3,
        departureAirportId: 5,
        arrivalAirportId: 1,
        departureTime: inThreeDays,
        arrivalTime: new Date(inThreeDays.getTime() + 840 * 60000),
        duration: 840,
        distance: 9560,
        economyPrice: 16200000,
        businessPrice: 34500000,
        firstClassPrice: 0,
        economyAvailable: 150,
        businessAvailable: 35,
        firstClassAvailable: 0,
      },
    ]

    console.log('🛫 Creating flights...')
    for (const fl of flightData) {
      await db.insert(flights).values(fl).onConflictDoNothing()
    }

    // Create passengers
    const passengerData = [
      {
        firstName: '太郎',
        lastName: '山田',
        email: 'taro.yamada@example.com',
        phone: '+81-90-1234-5678',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'M',
        nationality: 'Japan',
        passportNumber: 'JP1234567890',
        passportExpiry: new Date('2030-12-31'),
        address: '東京都渋谷区神宮前1-1-1',
        city: 'Tokyo',
        country: 'Japan',
        postalCode: '150-0001',
      },
      {
        firstName: '花子',
        lastName: '佐藤',
        email: 'hanako.sato@example.com',
        phone: '+81-90-9876-5432',
        dateOfBirth: new Date('1990-03-22'),
        gender: 'F',
        nationality: 'Japan',
        passportNumber: 'JP0987654321',
        passportExpiry: new Date('2028-08-15'),
        address: '東京都千代田区丸の内1-1',
        city: 'Tokyo',
        country: 'Japan',
        postalCode: '100-0005',
      },
      {
        firstName: 'Karen',
        lastName: 'Kumikoya',
        email: 'addresskumikoyakaren@gmail.com',
        phone: '+81-90-1234-5678',
        dateOfBirth: new Date('2000-01-01'),
        gender: 'F',
        nationality: 'Japan',
        passportNumber: 'JPN123456789',
        passportExpiry: new Date('2035-12-31'),
        address: 'Tokyo, Japan',
        city: 'Tokyo',
        country: 'Japan',
        postalCode: '100-0001',
      },
    ]

    console.log('👤 Creating passengers...')
    const createdPassengers = []
    for (const p of passengerData) {
      const [pass] = await db.insert(passengers).values(p).onConflictDoNothing().returning()
      if (pass) createdPassengers.push(pass)
    }

    // Create bookings
    if (createdPassengers.length > 0) {
      const bookingData = [
        {
          pnr: 'ANA27A',
          flightId: 1,
          passengerId: createdPassengers[0]?.id || 1,
          seatNumber: '3A',
          cabinClass: 'BUSINESS',
          price: 45000000,
          status: 'CANCELLED',
        },
      ]

      console.log('🎫 Creating bookings...')
      for (const b of bookingData) {
        await db.insert(bookings).values(b).onConflictDoNothing()
      }
    }

    console.log('✅ Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
