import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import { artistQuery } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'

type Props = { params: { locale: string } }

export default async function AboutPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'about' })
  const artist = await client.fetch(artistQuery, { locale }).catch(() => null)

  const photoUrl = artist?.photo?.asset
    ? urlFor(artist.photo).width(900).height(1200).fit('crop').url()
    : null

  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-14">

        <div className="py-16 flex items-center gap-4">
          <div className="w-8 h-px bg-brand-100" />
          <h1 className="text-[10px] tracking-[0.6em] text-brand-100 uppercase">
            {t('title')}
          </h1>
        </div>

        {artist ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start pb-24">

              {/* Photo */}
              <div className="aspect-[3/4] relative bg-brand-700 overflow-hidden">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={artist.name ?? 'Artist'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-brand-400 text-[9px] tracking-widest uppercase">Photo</span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center py-4 md:py-16">
                <h2 className="font-display font-light text-5xl md:text-6xl tracking-[-0.01em]
                  text-brand-50 uppercase mb-6 leading-[0.92]">
                  {artist.name}
                </h2>

                <div className="w-10 h-px bg-brand-100 mb-8" />

                {artist.bio && (
                  <p className="text-brand-200 leading-relaxed text-sm font-light whitespace-pre-line mb-12">
                    {artist.bio}
                  </p>
                )}

                {/* Career timeline */}
                {artist.awards && artist.awards.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[9px] tracking-[0.45em] text-brand-100 uppercase">
                        {t('career')}
                      </span>
                      <div className="flex-1 h-px bg-brand-500" />
                    </div>
                    <div className="space-y-3.5">
                      {artist.awards.map((award: any, i: number) => (
                        <div key={i} className="flex gap-6 items-baseline">
                          <span className="font-display font-light text-brand-100 text-sm w-12 shrink-0 text-right">
                            {award.year}
                          </span>
                          <span className="text-brand-200 text-xs leading-relaxed">{award.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-brand-400 text-[9px] tracking-wider mt-20 uppercase">
            (Sanity Studio에서 아티스트 정보를 입력해 주세요)
          </p>
        )}
      </div>
    </div>
  )
}
