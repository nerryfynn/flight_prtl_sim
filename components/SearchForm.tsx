'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface Airport {
  id: string
  code: string
  name: string
  city: string
  country: string
}

interface SearchFormProps {
  onSearch: (params: any) => void
  isLoading: boolean
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [roundtrip, setRoundtrip] = useState(true)
  const [airports, setAirports] = useState<Airport[]>([])
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    cabin: 'ECONOMY',
    passengers: '1',
  })

  useEffect(() => {
    fetchAirports()
  }, [])

  const fetchAirports = async () => {
    try {
      const res = await fetch('/api/airports')
      if (res.ok) {
        const data = await res.json()
        setAirports(data)
      }
    } catch (error) {
      console.error('Failed to fetch airports:', error)
      toast.error('空港情報の読み込みに失敗しました')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.from || !formData.to || !formData.departDate) {
      toast.error('出発地、到着地、日付を入力してください')
      return
    }

    if (formData.from === formData.to) {
      toast.error('出発地と到着地が同じです')
      return
    }

    onSearch({
      from: formData.from,
      to: formData.to,
      departDate: formData.departDate,
      returnDate: roundtrip ? formData.returnDate : null,
      cabin: formData.cabin,
      passengers: parseInt(formData.passengers),
      roundtrip,
    })
  }

  return (
    <form onSubmit={handleSearch} className="ana-card border border-gray-200">
      {/* Trip Type */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setRoundtrip(true)}
          className={`btn-ana-outline text-sm py-1.5 px-6 ${
            roundtrip
              ? 'bg-ana-blue text-white border-ana-blue'
              : ''
          }`}
        >
          往復
        </button>
        <button
          type="button"
          onClick={() => setRoundtrip(false)}
          className={`btn-ana-outline text-sm py-1.5 px-6 ${
            !roundtrip
              ? 'bg-ana-blue text-white border-ana-blue'
              : ''
          }`}
        >
          片道
        </button>
      </div>

      {/* Route Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            出発地 <span className="text-red-500">*</span>
          </label>
          <select
            name="from"
            value={formData.from}
            onChange={handleInputChange}
            className="input-ana"
          >
            <option value="" disabled hidden>出発地を選択してください</option>
            {airports.map(airport => (
              <option key={airport.id} value={airport.code}>
                {airport.code} - {airport.city} ({airport.name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            到着地 <span className="text-red-500">*</span>
          </label>
          <select
            name="to"
            value={formData.to}
            onChange={handleInputChange}
            className="input-ana"
          >
            <option value="" disabled hidden>到着地を選択してください</option>
            {airports.map(airport => (
              <option key={airport.id} value={airport.code}>
                {airport.code} - {airport.city} ({airport.name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            クラス <span className="text-red-500">*</span>
          </label>
          <select
            name="cabin"
            value={formData.cabin}
            onChange={handleInputChange}
            className="input-ana"
          >
            <option value="ECONOMY">エコノミー</option>
            <option value="BUSINESS">ビジネス</option>
            <option value="FIRST">ファーストクラス</option>
          </select>
        </div>
      </div>

      {/* Dates & Passengers */}
      <div className={`grid gap-4 mb-6 ${
        roundtrip ? 'md:grid-cols-4' : 'md:grid-cols-3'
      }`}>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            往路出発日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="departDate"
            value={formData.departDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            className="input-ana"
          />
        </div>

        {roundtrip && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              復路出発日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleInputChange}
              min={formData.departDate || new Date().toISOString().split('T')[0]}
              className="input-ana"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            人数 <span className="text-red-500">*</span>
          </label>
          <select
            name="passengers"
            value={formData.passengers}
            onChange={handleInputChange}
            className="input-ana"
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>大人{n}名</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            プロモーションコード
          </label>
          <input
            type="text"
            placeholder="コードを入力"
            className="input-ana text-sm py-2"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <i className="fas fa-info-circle text-ana-blue mr-1"></i>
          表示金額は選択いただいた条件でのもっともおトクな運賃となります。
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-ana mt-3 md:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              検索中...
            </>
          ) : (
            <>
              <i className="fas fa-search mr-2"></i>
              検索する
            </>
          )}
        </button>
      </div>
    </form>
  )
}
