// 루트 레이아웃 — next-intl 없이 최소한만 설정
// [locale]/layout.tsx 에서 실제 lang 속성과 메타데이터 처리
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Makeup Artist',
  description: 'Professional Makeup Artist based in Paris',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
