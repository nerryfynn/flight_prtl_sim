import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { flights, airlines, aircraft, airports } from '@/db/schema'
import { eq, gte, lt, and } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')
    const cabin = searchParams.get('cabin') || 'ECONOMY'

    if (!from || !to || !date) {
      return NextResponse.json(
        { error: '出発地、到着地、日付は必須です' },
        { status: 400 }
      )
    }

    const searchDate = new Date(date)
    const nextDay = new Date(searchDate)
    nextDay.setDate(nextDay.getDate() + 1)

    // Get departure and arrival airport IDs
    const depAirport = await db
      .select()
      .from(airports)
      .where(eq(airports.code, from))
      .limit(1)

    const arrAirport = await db
      .select()
      .from(airports)
      .where(eq(airports.code, to))
      .limit(1)

    if (!depAirport[0] || !arrAirport[0]) {
      return NextResponse.json(
        { error: '空港が見つかりません' },
        { status: 404 }
      )
    }

    const depAirportAlias = alias(airports, 'depAirport')

    // Query flights
    const result = await db
      .select()
      .from(flights)
      .innerJoin(airlines, eq(flights.airlineId, airlines.id))
      .innerJoin(aircraft, eq(flights.aircraftId, aircraft.id))
      .innerJoin(depAirportAlias, eq(flights.departureAirportId, depAirportAlias.id))
      .where(
        and(
          eq(flights.departureAirportId, depAirport[0].id),
          eq(flights.arrivalAirportId, arrAirport[0].id),
          gte(flights.departureTime, searchDate),
          lt(flights.departureTime, nextDay)
        )
      )

    // Format response with availability based on cabin class
    const formattedFlights = result.map(({ flights: f, airlines: al, aircraft: ac, depAirport: da }) => ({
      id: f.id,
      flightNumber: f.flightNumber,
      airline: {
        code: al.code,
        name: al.name,
      },
      aircraft: {
        model: ac.model,
        totalSeats: ac.totalSeats,
      },
      departure: {
        airport: from,
        city: depAirport[0].city,
        time: f.departureTime,
      },
      arrival: {
        airport: to,
        city: arrAirport[0].city,
        time: f.arrivalTime,
      },
      duration: f.duration,
      distance: f.distance,
      price: {
        economy: f.economyPrice,
        business: f.businessPrice,
        firstClass: f.firstClassPrice,
      },
      availability: {
        economy: f.economyAvailable,
        business: f.businessAvailable,
        firstClass: f.firstClassAvailable,
      },
      status: f.status,
    }))

    return NextResponse.json(formattedFlights)
  } catch (error) {
    console.error('Flight search error:', error)
    return NextResponse.json(
      { error: 'フライト検索に失敗しました' },
      { status: 500 }
    )
  }
}
