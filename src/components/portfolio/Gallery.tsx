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
        <p className="text-center text-brand-400 text-[9px] mt-20 tracking-widest uppercase">
          &mdash;
        </p>
      )}

      {/* Gallery grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-1.5 mt-10">
        {filtered.map((item) => {
          const imgUrl = item.image?.asset
            ? urlFor(item.image).width(600).height(600).fit('crop').url()
            : null

          return (
            <button
              key={item._id}
              onClick={() => setLightbox(item)}
              className="aspect-square overflow-hidden bg-brand-700 block group relative"
            >
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={item.title ?? item.category}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-brand-400 text-[9px] tracking-wider uppercase">
                    {item.category}
                  </span>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/30 transition-colors duration-500" />
            </button>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-brand-900/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-6 text-brand-300 hover:text-brand-50 text-3xl leading-none transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            &#215;
          </button>
          {lightbox.image?.asset ? (
            <div
              className="max-w-3xl max-h-[88vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(lightbox.image).width(1400).url()}
                alt={lightbox.title ?? lightbox.category}
                width={1400}
                height={1050}
                className="object-contain max-h-[88vh] w-auto"
              />
              {lightbox.title && (
                <p className="text-brand-300 text-[9px] tracking-widest text-center mt-4 uppercase">
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
