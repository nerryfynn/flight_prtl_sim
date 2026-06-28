'use client'

import { useState } from 'react'

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('flights')

  return (
    <>
      <nav className="bg-ana-blue text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-2 sm:gap-6 py-2 text-sm">
          <a href="#" className="hover:text-yellow-300 font-semibold text-white border-b-2 border-yellow-400 pb-1">
            予約
          </a>
          <a href="#" className="hover:text-blue-200 text-blue-200 pb-1">
            運航状況
          </a>
          <a href="#" className="hover:text-blue-200 text-blue-200 pb-1">
            国内線予約確認
          </a>
          <a href="#" className="hover:text-blue-200 text-blue-200 pb-1">
            国際線予約確認
          </a>
          <a href="#" className="hover:text-blue-200 text-blue-200 pb-1">
            チェックイン
          </a>
          <span className="ml-auto hidden lg:inline text-xs text-blue-200">
            <i className="fas fa-phone mr-1"></i> 0120-029-283
          </span>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-1 sm:gap-4 py-3 text-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('flights')}
            className={`pb-2 px-2 whitespace-nowrap transition-all ${
              activeTab === 'flights'
                ? 'tab-active'
                : 'tab-inactive'
            }`}
          >
            <i className="fas fa-plane mr-1"></i> 航空券
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-2 px-2 whitespace-nowrap transition-all ${
              activeTab === 'packages'
                ? 'tab-active'
                : 'tab-inactive'
            }`}
          >
            <i className="fas fa-hotel mr-1"></i> 航空券 + 宿泊
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`pb-2 px-2 whitespace-nowrap transition-all ${
              activeTab === 'points'
                ? 'tab-active'
                : 'tab-inactive'
            }`}
          >
            <i className="fas fa-gem mr-1"></i> 特典航空券
          </button>
        </div>
      </div>
    </>
  )
}
