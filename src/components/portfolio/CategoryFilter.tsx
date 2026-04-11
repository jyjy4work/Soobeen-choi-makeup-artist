'use client'

import { useTranslations } from 'next-intl'

type Props = {
  selected: string
  onChange: (cat: string) => void
}

const CATEGORIES = ['all', 'wedding', 'editorial', 'stage', 'natural'] as const

export default function CategoryFilter({ selected, onChange }: Props) {
  const t = useTranslations('portfolio')

  const labels: Record<string, string> = {
    all: t('filter_all'),
    wedding: t('category_wedding'),
    editorial: t('category_editorial'),
    stage: t('category_stage'),
    natural: t('category_natural'),
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 text-[9px] tracking-[0.3em] uppercase transition-all duration-200 border ${
            selected === cat
              ? 'border-brand-50 bg-brand-50 text-brand-800'
              : 'border-brand-400 text-brand-300 hover:border-brand-50 hover:text-brand-50'
          }`}
        >
          {labels[cat]}
        </button>
      ))}
    </div>
  )
}
