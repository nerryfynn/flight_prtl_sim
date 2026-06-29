'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import SearchForm from '@/components/SearchForm'
import FlightResults from '@/components/FlightResults'
import BookingChecker from '@/components/BookingChecker'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

interface Flight {
  id: string
  flightNumber: string
  airline: { code: string; name: string }
  departure: { airport: string; city: string; time: string }
  arrival: { airport: string; city: string; time: string }
  duration: number
  distance: number
  price: { economy: number; business: number; firstClass: number }
  availability: { economy: number; business: number; firstClass: number }
  status: string
}

const mockFlights: Flight[] = [
  {
    id: '1',
    flightNumber: 'NH2047',
    airline: { code: 'NH', name: 'All Nippon Airways' },
    departure: { airport: 'NRT', city: 'Tokyo', time: '2026-07-30T10:30:00+09:00' },
    arrival: { airport: 'VNO', city: 'Vilnius', time: '2026-07-30T16:00:00+03:00' },
    duration: 840,
    distance: 9300,
    price: { economy: 19860000, business: 45000000, firstClass: 65000000 },
    availability: { economy: 35, business: 8, firstClass: 0 },
    status: 'SCHEDULED',
  },
  {
    id: '2',
    flightNumber: 'NH211',
    airline: { code: 'NH', name: 'All Nippon Airways' },
    departure: { airport: 'NRT', city: 'Tokyo', time: '2026-08-02T18:00:00+09:00' },
    arrival: { airport: 'LHR', city: 'London', time: '2026-08-03T00:20:00+01:00' },
    duration: 720,
    distance: 9560,
    price: { economy: 15900000, business: 33000000, firstClass: 0 },
    availability: { economy: 42, business: 12, firstClass: 0 },
    status: 'SCHEDULED',
  },
  {
    id: '3',
    flightNumber: 'NH175',
    airline: { code: 'NH', name: 'All Nippon Airways' },
    departure: { airport: 'NRT', city: 'Tokyo', time: '2026-08-07T23:30:00+09:00' },
    arrival: { airport: 'LAX', city: 'Los Angeles', time: '2026-08-07T18:30:00-07:00' },
    duration: 660,
    distance: 8800,
    price: { economy: 12500000, business: 28000000, firstClass: 0 },
    availability: { economy: 20, business: 6, firstClass: 0 },
    status: 'SCHEDULED',
  },
  {
    id: '4',
    flightNumber: 'NH473',
    airline: { code: 'NH', name: 'All Nippon Airways' },
    departure: { airport: 'KIX', city: 'Osaka', time: '2026-07-31T08:45:00+09:00' },
    arrival: { airport: 'HND', city: 'Tokyo', time: '2026-07-31T10:00:00+09:00' },
    duration: 75,
    distance: 270,
    price: { economy: 2800000, business: 5500000, firstClass: 0 },
    availability: { economy: 140, business: 30, firstClass: 0 },
    status: 'SCHEDULED',
  },
]

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [searchParams, setSearchParams] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (params: any) => {
    setIsSearching(true)
    setSearchParams(params)

    const results = mockFlights.filter(flight => {
      const matchesFrom = flight.departure.airport === params.from
      const matchesTo = flight.arrival.airport === params.to
      const cabinAvailability =
        params.cabin === 'BUSINESS'
          ? flight.availability.business
          : params.cabin === 'FIRST'
          ? flight.availability.firstClass
          : flight.availability.economy

      return matchesFrom && matchesTo && cabinAvailability > 0
    })

    setFlights(results)

    if (results.length === 0) {
      toast('該当するフライトが見つかりません', { icon: '✈️' })
    } else {
      toast.success(`${results.length}件のフライトが見つかりました`, {
        duration: 3,
      })
    }

    setIsSearching(false)
  }

  return (
    <>
      <Header />
      <Navigation />

      {/* NO NETWORK - Only this content in the middle */}
      <main className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-7xl mb-4">📡</div>
          <h1 className="text-3xl font-bold text-red-600 mb-3">FAILED TO CONNECT</h1>
          <p className="text-gray-600 text-lg">
            Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </main>

      <Footer />
    </>
  )
}
