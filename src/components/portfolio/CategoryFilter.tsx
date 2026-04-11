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
    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 text-xs tracking-[0.2em] uppercase transition-colors border ${
            selected === cat
              ? 'border-brand-700 bg-brand-700 text-white'
              : 'border-brand-300 text-brand-500 hover:border-brand-500 hover:text-brand-700'
          }`}
        >
          {labels[cat]}
        </button>
      ))}
    </div>
  )
}
