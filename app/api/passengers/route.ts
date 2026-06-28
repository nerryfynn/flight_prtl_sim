import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { passengers } from '@/db/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      nationality,
      passportNumber,
      passportExpiry,
      address,
      city,
      country,
      postalCode,
    } = body

    if (!firstName || !lastName || !email || !passportNumber) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    const [passenger] = await db
      .insert(passengers)
      .values({
        firstName,
        lastName,
        email,
        phone: phone || null,
        dateOfBirth: new Date(dateOfBirth),
        gender: gender || null,
        nationality,
        passportNumber,
        passportExpiry: new Date(passportExpiry),
        address: address || null,
        city: city || null,
        country: country || null,
        postalCode: postalCode || null,
      })
      .returning()

    return NextResponse.json(passenger, { status: 201 })
  } catch (error) {
    console.error('Passenger creation error:', error)
    return NextResponse.json(
      { error: '搭乗者情報の作成に失敗しました' },
      { status: 500 }
    )
  }
}
