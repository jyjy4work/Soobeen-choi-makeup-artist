'use client'

import { useState } from 'react'
import Image from 'next/image'
import CategoryFilter from './CategoryFilter'
import { urlFor } from '@/lib/sanity/image'

type PortfolioItem = {
  _id: string
  title?: string
  category: string
  date?: string
  image: any
}

type Props = {
  items: PortfolioItem[]
}

export default function Gallery({ items }: Props) {
  const [selected, setSelected] = useState('all')
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null)

  const filtered =
    selected === 'all' ? items : items.filter((i) => i.category === selected)

  return (
    <>
      <CategoryFilter selected={selected} onChange={setSelected} />

      {filtered.length === 0 && (
        <p className="text-center text-brand-400 text-sm mt-16 tracking-wider">
          —
        </p>
      )}

      {/* 갤러리 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2 mt-8">
        {filtered.map((item) => {
          const imgUrl = item.image?.asset
            ? urlFor(item.image).width(600).height(600).fit('crop').url()
            : null

          return (
            <button
              key={item._id}
              onClick={() => setLightbox(item)}
              className="aspect-square overflow-hidden bg-brand-100 block group"
            >
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={item.title ?? item.category}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200">
                  <span className="text-brand-400 text-xs tracking-wider uppercase">
                    {item.category}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* 라이트박스 */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
          {lightbox.image?.asset ? (
            <div
              className="max-w-3xl max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(lightbox.image).width(1200).url()}
                alt={lightbox.title ?? lightbox.category}
                width={1200}
                height={900}
                className="object-contain max-h-[85vh] w-auto"
              />
              {lightbox.title && (
                <p className="text-white/70 text-xs tracking-widest text-center mt-3 uppercase">
                  {lightbox.title}
                </p>
              )}
            </div>
          ) : null}
        </div>
      )}
    </>
  )
}
