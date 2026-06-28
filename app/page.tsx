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

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Section */}
        <SearchForm onSearch={handleSearch} isLoading={isSearching} />

        {/* Booking Checker */}
        <BookingChecker />

        {/* Flight Results */}
        {(isSearching || flights.length > 0) && (
          <div className="mt-8">
            <FlightResults
              flights={flights}
              cabin={searchParams?.cabin || 'ECONOMY'}
              isLoading={isSearching}
            />
          </div>
        )}

        {/* Info Section */}
        {flights.length === 0 && !isSearching && (
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="ana-card">
              <div className="text-3xl text-ana-blue mb-3">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="font-bold text-lg mb-2">安全・確実</h3>
              <p className="text-sm text-gray-600">
                ANAの予約システムで安全にご予約いただけます。
              </p>
            </div>

            <div className="ana-card">
              <div className="text-3xl text-ana-blue mb-3">
                <i className="fas fa-plane"></i>
              </div>
              <h3 className="font-bold text-lg mb-2">国内外の主要路線</h3>
              <p className="text-sm text-gray-600">
                日本国内をはじめ、世界中の主要都市へのフライトをご紹介しています。
              </p>
            </div>

            <div className="ana-card">
              <div className="text-3xl text-ana-blue mb-3">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 className="font-bold text-lg mb-2">24時間対応</h3>
              <p className="text-sm text-gray-600">
                いつでもどこからでも、スマートフォンで予約・確認できます。
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
