'use client'

// Design Ref: §6.1 — 언어 전환 드롭다운
// 현재 로케일 유지하며 URL 로케일만 변경
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const LOCALES = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  function switchLocale(targetLocale: string) {
    // /ko/portfolio → /fr/portfolio 로 교체
    const segments = pathname.split('/')
    segments[1] = targetLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-900 transition-colors px-2 py-1"
        aria-label="Select language"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* 배경 클릭 시 닫기 */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-36 bg-white border border-brand-200 shadow-lg z-20">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-brand-50 transition-colors ${
                  l.code === locale ? 'text-brand-900 font-medium' : 'text-brand-600'
                }`}
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
