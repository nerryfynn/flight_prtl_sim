import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { airports } from '@/db/schema'

export async function GET() {
  try {
    const airportList = await db
      .select({
        id: airports.id,
        code: airports.code,
        name: airports.name,
        city: airports.city,
        country: airports.country,
      })
      .from(airports)

    return NextResponse.json(airportList)
  } catch (error) {
    console.error('Airports fetch error:', error)
    return NextResponse.json(
      { error: '空港情報取得に失敗しました' },
      { status: 500 }
    )
  }
}
