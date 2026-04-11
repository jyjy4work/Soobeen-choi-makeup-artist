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
    ? urlFor(artist.photo).width(800).height(1000).fit('crop').url()
    : null

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-center text-xs tracking-[0.5em] text-brand-500 uppercase mb-16">
        {t('title')}
      </h1>

      {artist ? (
        <>
          {/* 프로필 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-20">
            {/* 사진 */}
            <div className="aspect-[4/5] relative bg-brand-100 overflow-hidden">
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
                  <span className="text-brand-300 text-xs tracking-widest">PHOTO</span>
                </div>
              )}
            </div>

            {/* 소개 텍스트 */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-extralight tracking-[0.3em] text-brand-800 uppercase mb-6">
                {artist.name}
              </h2>
              {artist.bio && (
                <p className="text-brand-600 leading-relaxed text-sm whitespace-pre-line">
                  {artist.bio}
                </p>
              )}
            </div>
          </div>

          {/* 경력 타임라인 */}
          {artist.awards && artist.awards.length > 0 && (
            <div className="border-t border-brand-100 pt-16">
              <h3 className="text-xs tracking-[0.4em] text-brand-400 uppercase mb-10 text-center">
                Career
              </h3>
              <div className="space-y-4 max-w-xl mx-auto">
                {artist.awards.map((award: any, i: number) => (
                  <div key={i} className="flex gap-6 items-baseline">
                    <span className="text-brand-400 text-sm font-light w-12 shrink-0 text-right">
                      {award.year}
                    </span>
                    <span className="text-brand-700 text-sm">{award.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-brand-300 text-sm tracking-wider mt-20">
          (Sanity Studio에서 아티스트 정보를 입력해 주세요)
        </p>
      )}
    </div>
  )
}
