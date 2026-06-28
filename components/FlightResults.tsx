'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Flight {
  id: string
  flightNumber: string
  airline: {
    code: string
    name: string
  }
  departure: {
    airport: string
    city: string
    time: string
  }
  arrival: {
    airport: string
    city: string
    time: string
  }
  duration: number
  distance: number
  price: {
    economy: number
    business: number
    firstClass: number
  }
  availability: {
    economy: number
    business: number
    firstClass: number
  }
  status: string
}

interface FlightResultsProps {
  flights: Flight[]
  cabin: string
  isLoading?: boolean
}

export default function FlightResults({ flights, cabin, isLoading }: FlightResultsProps) {
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
  }

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    })
  }

  const getDurationText = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}時間${mins}分`
  }

  const getAvailability = (cabin: string, flight: Flight) => {
    const cabinMap: { [key: string]: keyof typeof flight.availability } = {
      ECONOMY: 'economy',
      BUSINESS: 'business',
      FIRST: 'firstClass',
    }
    return flight.availability[cabinMap[cabin] || 'economy']
  }

  if (isLoading) {
    return (
      <div className="ana-card border border-gray-200 text-center py-8">
        <div className="inline-block">
          <i className="fas fa-spinner fa-spin text-4xl text-ana-blue mb-4"></i>
          <p className="text-gray-600 mt-2">フライト情報を検索中...</p>
        </div>
      </div>
    )
  }

  if (flights.length === 0) {
    return (
      <div className="ana-card border border-gray-200 border-orange-200 bg-orange-50 text-center py-8">
        <i className="fas fa-info-circle text-2xl text-orange-600 mb-3"></i>
        <p className="text-orange-800 font-medium">指定条件に合致するフライトが見つかりません</p>
        <p className="text-orange-700 text-sm mt-1">別の日付や空港を試してください</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-4">
        <i className="fas fa-plane-departure mr-2 text-ana-blue"></i>
        {flights.length}件のフライトが見つかりました
      </div>

      {flights.map(flight => {
        const isExpanded = expandedFlightId === flight.id
        const availability = getAvailability(cabin, flight)
        const cabinMap: { [key: string]: keyof typeof flight.price } = {
          ECONOMY: 'economy',
          BUSINESS: 'business',
          FIRST: 'firstClass',
        }
        const price = flight.price[cabinMap[cabin] || 'economy']

        return (
          <div key={flight.id} className="ana-card border-l-4 border-ana-blue">
            <div className="grid md:grid-cols-12 gap-4">
              {/* Flight Info */}
              <div className="md:col-span-7">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-ana-blue">{flight.airline.code}</span>
                  <span className="flight-status-badge status-scheduled">
                    <i className="fas fa-check-circle mr-1"></i>
                    {flight.status === 'SCHEDULED' ? '運航確定' : flight.status}
                  </span>
                  {availability > 0 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      座席あり: {availability}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {flight.departure.airport} → {flight.arrival.airport}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    <i className="fas fa-clock text-ana-blue mr-1"></i>
                    出発: <span className="font-bold">{formatTime(flight.departure.time)}</span> ({formatDate(flight.departure.time)})
                  </span>
                  <span>
                    <i className="fas fa-clock text-ana-blue mr-1"></i>
                    到着: <span className="font-bold">{formatTime(flight.arrival.time)}</span>
                  </span>
                  <span>
                    <i className="fas fa-hourglass-half text-ana-blue mr-1"></i>
                    {getDurationText(flight.duration)}
                  </span>
                  <span>
                    <i className="fas fa-plane text-ana-blue mr-1"></i>
                    {flight.flightNumber}
                  </span>
                </div>
              </div>

              {/* Price & Select */}
              <div className="md:col-span-5">
                <div className="bg-ana-light-blue p-4 rounded-lg text-center mb-3">
                  <div className="text-xs text-gray-600 mb-1">運賃</div>
                  <div className="text-2xl font-extrabold text-ana-blue">
                    {formatPrice(price)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">税込・燃油込</div>
                </div>

                {availability > 0 ? (
                  <button
                    onClick={() => setExpandedFlightId(isExpanded ? null : flight.id)}
                    className="btn-ana w-full"
                  >
                    {isExpanded ? (
                      <>
                        <i className="fas fa-chevron-up mr-2"></i>
                        詳細を隠す
                      </>
                    ) : (
                      <>
                        <i className="fas fa-chevron-down mr-2"></i>
                        詳細・予約
                      </>
                    )}
                  </button>
                ) : (
                  <button disabled className="btn-ana w-full opacity-50 cursor-not-allowed">
                    <i className="fas fa-chair mr-2"></i>
                    満席
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">出発空港</p>
                    <p className="font-semibold">{flight.departure.city} ({flight.departure.airport})</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">到着空港</p>
                    <p className="font-semibold">{flight.arrival.city} ({flight.arrival.airport})</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">移動距離</p>
                    <p className="font-semibold">{flight.distance.toLocaleString()}km</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">選択クラス</p>
                    <p className="font-semibold">{cabin === 'ECONOMY' ? 'エコノミー' : cabin === 'BUSINESS' ? 'ビジネス' : 'ファーストクラス'}</p>
                  </div>
                </div>

                <button className="btn-ana w-full">
                  <i className="fas fa-shopping-cart mr-2"></i>
                  このフライトを予約
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
