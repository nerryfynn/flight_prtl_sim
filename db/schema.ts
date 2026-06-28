import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  boolean,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Airports
export const airports = pgTable(
  'airports',
  {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 3 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    country: varchar('country', { length: 100 }).notNull(),
    timezone: varchar('timezone', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      codeIdx: uniqueIndex('airports_code_idx').on(table.code),
    }
  }
)

// Airlines
export const airlines = pgTable(
  'airlines',
  {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 2 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    country: varchar('country', { length: 100 }).notNull(),
    logo: text('logo'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      codeIdx: uniqueIndex('airlines_code_idx').on(table.code),
    }
  }
)

// Aircraft
export const aircraft = pgTable('aircraft', {
  id: serial('id').primaryKey(),
  registration: varchar('registration', { length: 20 }).unique().notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  manufacturer: varchar('manufacturer', { length: 100 }).notNull(),
  totalSeats: integer('total_seats').notNull(),
  economySeats: integer('economy_seats').notNull(),
  businessSeats: integer('business_seats').notNull(),
  firstClassSeats: integer('first_class_seats').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Flights
export const flights = pgTable(
  'flights',
  {
    id: serial('id').primaryKey(),
    flightNumber: varchar('flight_number', { length: 10 }).unique().notNull(),
    airlineId: integer('airline_id').notNull(),
    aircraftId: integer('aircraft_id').notNull(),
    departureAirportId: integer('departure_airport_id').notNull(),
    arrivalAirportId: integer('arrival_airport_id').notNull(),
    departureTime: timestamp('departure_time').notNull(),
    arrivalTime: timestamp('arrival_time').notNull(),
    duration: integer('duration').notNull(), // in minutes
    distance: integer('distance').notNull(), // in kilometers
    economyPrice: integer('economy_price').notNull(), // in JPY cents
    businessPrice: integer('business_price').notNull(),
    firstClassPrice: integer('first_class_price').notNull(),
    economyAvailable: integer('economy_available').notNull(),
    businessAvailable: integer('business_available').notNull(),
    firstClassAvailable: integer('first_class_available').notNull(),
    status: varchar('status', { length: 20 }).default('SCHEDULED'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      flightNumberIdx: uniqueIndex('flights_number_idx').on(table.flightNumber),
      airlineIdx: uniqueIndex('flights_airline_idx').on(table.airlineId),
      departureIdx: uniqueIndex('flights_departure_idx').on(table.departureAirportId),
      arrivalIdx: uniqueIndex('flights_arrival_idx').on(table.arrivalAirportId),
      timeIdx: uniqueIndex('flights_time_idx').on(table.departureTime),
    }
  }
)

// Passengers
export const passengers = pgTable(
  'passengers',
  {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    phone: varchar('phone', { length: 20 }),
    dateOfBirth: timestamp('date_of_birth').notNull(),
    gender: varchar('gender', { length: 1 }),
    nationality: varchar('nationality', { length: 100 }).notNull(),
    passportNumber: varchar('passport_number', { length: 50 }).unique().notNull(),
    passportExpiry: timestamp('passport_expiry').notNull(),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    country: varchar('country', { length: 100 }),
    postalCode: varchar('postal_code', { length: 10 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('passengers_email_idx').on(table.email),
      passportIdx: uniqueIndex('passengers_passport_idx').on(table.passportNumber),
    }
  }
)

// Bookings
export const bookings = pgTable(
  'bookings',
  {
    id: serial('id').primaryKey(),
    pnr: varchar('pnr', { length: 20 }).unique().notNull(),
    flightId: integer('flight_id').notNull(),
    passengerId: integer('passenger_id').notNull(),
    seatNumber: varchar('seat_number', { length: 10 }).notNull(),
    cabinClass: varchar('cabin_class', { length: 20 }).notNull(),
    price: integer('price').notNull(),
    status: varchar('status', { length: 20 }).default('CONFIRMED'),
    checkedIn: boolean('checked_in').default(false),
    checkedInAt: timestamp('checked_in_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      pnrIdx: uniqueIndex('bookings_pnr_idx').on(table.pnr),
      flightSeatIdx: uniqueIndex('bookings_flight_seat_idx').on(table.flightId, table.seatNumber),
      flightIdx: uniqueIndex('bookings_flight_idx').on(table.flightId),
      passengerIdx: uniqueIndex('bookings_passenger_idx').on(table.passengerId),
    }
  }
)

// Relations
export const airportsRelations = relations(airports, ({ many }) => ({
  departureFlights: many(flights, { relationName: 'departureAirport' }),
  arrivalFlights: many(flights, { relationName: 'arrivalAirport' }),
}))

export const airlinesRelations = relations(airlines, ({ many }) => ({
  flights: many(flights),
}))

export const aircraftRelations = relations(aircraft, ({ many }) => ({
  flights: many(flights),
}))

export const flightsRelations = relations(flights, ({ one, many }) => ({
  airline: one(airlines, {
    fields: [flights.airlineId],
    references: [airlines.id],
  }),
  aircraftInfo: one(aircraft, {
    fields: [flights.aircraftId],
    references: [aircraft.id],
  }),
  departureAirport: one(airports, {
    fields: [flights.departureAirportId],
    references: [airports.id],
    relationName: 'departureAirport',
  }),
  arrivalAirport: one(airports, {
    fields: [flights.arrivalAirportId],
    references: [airports.id],
    relationName: 'arrivalAirport',
  }),
  bookings: many(bookings),
}))

export const passengersRelations = relations(passengers, ({ many }) => ({
  bookings: many(bookings),
}))

export const bookingsRelations = relations(bookings, ({ one }) => ({
  flight: one(flights, {
    fields: [bookings.flightId],
    references: [flights.id],
  }),
  passenger: one(passengers, {
    fields: [bookings.passengerId],
    references: [passengers.id],
  }),
}))
