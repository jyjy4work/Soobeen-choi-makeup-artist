'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const LOCALES = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'ko', flag: '🇰🇷', label: 'KO' },
  { code: 'zh', flag: '🇨🇳', label: 'ZH' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  function switchLocale(targetLocale: string) {
    const segments = pathname.split('/')
    segments[1] = targetLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-brand-200
          hover:text-brand-50 transition-colors px-2 py-1.5 uppercase"
        aria-label="Select language"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <svg className="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-28 bg-brand-700 border border-brand-500 shadow-xl z-20">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-[10px] tracking-[0.2em] text-left
                  uppercase hover:bg-brand-600 transition-colors
                  ${l.code === locale ? 'text-brand-100' : 'text-brand-300'}`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
