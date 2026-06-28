'use client'

export default function Footer() {
  return (
    <footer className="bg-ana-blue-dark text-white mt-16 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 className="text-xl font-bold mb-4">ANA</h4>
          <p className="text-sm text-blue-200">全日本空輸（ANA）</p>
          <p className="text-sm text-blue-200">© 2024 ANA All rights reserved.</p>
          <p className="text-sm text-blue-200 mt-3">〒105-0001 東京都港区虎ノ門1-10-5</p>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-blue-100">予約・購入</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-blue-200 hover:text-white transition">航空券を探す</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">航空券 + 宿泊</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">特典航空券</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">ホテル予約</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">レンタカー</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-blue-100">サポート</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-blue-200 hover:text-white transition">予約照会</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">チェックイン</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">運航状況</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">よくある質問</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">お問い合わせ</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-blue-100">ANA Mileage Club</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-blue-200 hover:text-white transition">会員登録</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">マイルを貯める</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">マイルを使う</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">ステータス特典</a></li>
            <li><a href="#" className="text-blue-200 hover:text-white transition">提携パートナー</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-blue-800 text-center">
        <p className="text-xs text-blue-300">
          本サイトはANA公式サイトをベースにした、フル機能の航空券予約システムのデモンストレーションです。
        </p>
        <p className="text-xs text-blue-300 mt-2">
          リアルデータベース統合・Vercelサーバーレスバックエンド・Next.js TypeScript フロントエンド
        </p>
      </div>
    </footer>
  )
}
