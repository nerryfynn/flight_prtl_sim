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

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [searchParams, setSearchParams] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (params: any) => {
    setIsSearching(true)
    setSearchParams(params)

    try {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        date: params.departDate,
        cabin: params.cabin,
      })

      const res = await fetch(`/api/flights?${queryParams}`)

      if (res.ok) {
        const data = await res.json()
        setFlights(data)

        if (data.length === 0) {
          toast('該当するフライトが見つかりません', { icon: '✈️' })
        } else {
          toast.success(`${data.length}件のフライトが見つかりました`, {
            duration: 3,
          })
        }
      } else {
        toast.error('フライト検索に失敗しました')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('検索処理中にエラーが発生しました')
    } finally {
      setIsSearching(false)
    }
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
