'use client'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-3">
            <img src="https://ana.co.jp/favicon.ico" alt="ANA logo" className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold text-ana-blue">ANA</div>
              <div className="text-xs text-gray-500 hidden sm:inline">全日本空輸</div>
            </div>
          </a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-sm flex-wrap">
          <span className="hidden md:inline text-gray-600">
            <i className="fas fa-globe mr-1"></i> 日本語 | EN
          </span>
          <a href="#" className="text-ana-blue hover:text-ana-blue-dark font-medium">
            <i className="fas fa-user mr-1"></i> ログイン
          </a>
          <a href="#" className="text-ana-blue hover:text-ana-blue-dark font-medium">
            <i className="fas fa-user-plus mr-1"></i> 新規登録
          </a>
          <a href="#" className="bg-ana-blue text-white px-3 py-1 rounded-full text-xs hover:bg-ana-blue-dark transition">
            <i className="fas fa-plane mr-1"></i> 予約する
          </a>
        </div>
      </div>
    </header>
  )
}
