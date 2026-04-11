'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-brand-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href={`/${locale}`}
          className="text-sm font-light tracking-[0.3em] text-brand-800 hover:text-brand-600 transition-colors uppercase"
        >
          Makeup Artist
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest text-brand-600 hover:text-brand-900 transition-colors uppercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 우측: 언어 선택 + 모바일 메뉴 버튼 */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden p-2 text-brand-700"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-brand-100 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-widest text-brand-700 hover:text-brand-900 uppercase"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
