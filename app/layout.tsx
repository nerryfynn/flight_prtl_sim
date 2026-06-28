import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'ANA - 航空券予約',
  description: '全日本空輸の航空券予約ポータル。国内線・国際線の航空券をオンラインでご予約いただけます。',
  keywords: ['航空券', '予約', 'ANA', '全日本空輸', 'フライト'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
