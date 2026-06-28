'use client'

import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface BookingInfo {
  pnr: string
  status: string
  flight: {
    flightNumber: string
    airline: string
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
  }
  passenger: {
    firstName: string
    lastName: string
    email: string
    phone: string
    nationality: string
    passportNumber: string
    dateOfBirth: string
    passportExpiry: string
    address: string
  }
  seat: string
  cabinClass: string
  price: number
}

export default function BookingChecker() {
  const [pnr, setPnr] = useState('')
  const [lastName, setLastName] = useState('')
  const [flightNumber, setFlightNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pnr || !lastName) {
      toast.error('予約番号と姓を入力してください')
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        pnr,
        lastName,
        ...(flightNumber && { flightNumber }),
      })

      const res = await fetch(`/api/bookings?${params}`)

      if (res.ok) {
        const data = await res.json()
        setBookingInfo(data)
        setShowDetails(true)
        toast.success('予約が確認できました')
      } else {
        const error = await res.json()
        toast.error(error.error || '予約が見つかりません')
        setShowDetails(false)
      }
    } catch (error) {
      console.error('Booking search error:', error)
      toast.error('予約照会に失敗しました')
      setShowDetails(false)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`ana-card border-2 mt-6 ${
      bookingInfo ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-ana-light-blue'
    }`}>
      <h3 className="text-lg font-bold text-ana-blue mb-4">
        <i className="fas fa-search mr-2"></i> 予約照会
      </h3>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              予約番号 (PNR) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例: ANA-XXXXX"
              value={pnr}
              onChange={e => setPnr(e.target.value.toUpperCase())}
              className="input-ana text-sm"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              姓 (氏) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例: YAMADA"
              value={lastName}
              onChange={e => setLastName(e.target.value.toUpperCase())}
              className="input-ana text-sm"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              便名
            </label>
            <input
              type="text"
              placeholder="例: NH-123"
              value={flightNumber}
              onChange={e => setFlightNumber(e.target.value.toUpperCase())}
              className="input-ana text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-ana text-sm py-2 px-6 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-1"></i> 検索中
              </>
            ) : (
              <>
                <i className="fas fa-check mr-1"></i> 確認する
              </>
            )}
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-600">
          <i className="fas fa-info-circle mr-1"></i> 予約番号と姓を入力してご予約を確認いただけます。
        </div>
      </form>

      {/* Booking Details */}
      {showDetails && bookingInfo && (
        <div className="mt-6 pt-4 border-t border-green-200">
          <div className="flex items-center gap-2 text-green-700 mb-4">
            <i className="fas fa-check-circle"></i>
            <span className="font-bold">予約確認済み</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded border border-green-200">
              <h4 className="font-semibold text-ana-blue mb-3">フライト情報</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">航空会社:</span>
                  <span className="font-semibold ml-2">{bookingInfo.flight.airline}</span>
                </div>
                <div>
                  <span className="text-gray-600">便名:</span>
                  <span className="font-semibold ml-2">{bookingInfo.flight.flightNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">出発:</span>
                  <span className="font-semibold ml-2">
                    {bookingInfo.flight.departure.city} ({bookingInfo.flight.departure.airport})
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">到着:</span>
                  <span className="font-semibold ml-2">
                    {bookingInfo.flight.arrival.city} ({bookingInfo.flight.arrival.airport})
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">出発時刻:</span>
                  <span className="font-semibold ml-2">
                    {formatDate(bookingInfo.flight.departure.time)} {formatTime(bookingInfo.flight.departure.time)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-green-200">
              <h4 className="font-semibold text-ana-blue mb-3">搭乗者情報</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">氏名:</span>
                  <span className="font-semibold ml-2">{bookingInfo.passenger.lastName} {bookingInfo.passenger.firstName}</span>
                </div>
                <div>
                  <span className="text-gray-600">座席:</span>
                  <span className="font-semibold ml-2 bg-ana-blue text-white px-2 py-0.5 rounded">{bookingInfo.seat}</span>
                </div>
                <div>
                  <span className="text-gray-600">クラス:</span>
                  <span className="font-semibold ml-2">
                    {bookingInfo.cabinClass === 'ECONOMY' ? 'エコノミー' : 
                     bookingInfo.cabinClass === 'BUSINESS' ? 'ビジネス' : 'ファーストクラス'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">予約番号:</span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{bookingInfo.pnr}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-green-200 md:col-span-2">
              <h4 className="font-semibold text-ana-blue mb-3">パスポート情報</h4>
              <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-4 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">パスポート番号:</span>
                    <span className="font-mono block">{bookingInfo.passenger.passportNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">有効期限:</span>
                    <span className="font-semibold block">{formatDate(bookingInfo.passenger.passportExpiry)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">国籍:</span>
                    <span className="font-semibold block">{bookingInfo.passenger.nationality}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">生年月日:</span>
                    <span className="font-semibold block">{formatDate(bookingInfo.passenger.dateOfBirth)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center rounded border border-gray-200 bg-gray-50 p-3">
                  <Image
                    src="/kumiko.jpeg"
                    alt="Seeded passenger"
                    width={160}
                    height={160}
                    className="rounded object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(false)}
            className="btn-ana-outline text-sm py-2 px-4"
          >
            <i className="fas fa-times mr-1"></i> 閉じる
          </button>
        </div>
      )}
    </div>
  )
}
