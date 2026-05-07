'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    // { href: `/${locale}/services`, label: t('services') }, // 비활성화 — 콘텐츠 준비 후 주석 해제
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-brand-500 bg-brand-800/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-14 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-display font-light text-base tracking-[0.25em] text-brand-50
            hover:text-brand-100 transition-colors uppercase"
        >
          Makeup Artist
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[0.35em] text-brand-200 hover:text-brand-50 transition-colors uppercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: lang + hamburger */}
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <button
            className="md:hidden p-2 text-brand-200 hover:text-brand-50 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu — slide down */}
      <div className={`md:hidden bg-brand-800 border-t border-brand-500 px-6
        overflow-hidden transition-all duration-300 ease-in-out
        ${menuOpen ? 'max-h-64 py-5 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
        <div className="flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[10px] tracking-[0.35em] text-brand-200 hover:text-brand-50 uppercase transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
