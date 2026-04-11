// Plan SC: 포트폴리오 미리보기 + 서비스 CTA + WhatsApp 문의 연결
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import {
  featuredPortfolioQuery,
  servicesPreviewQuery,
  siteSettingsQuery,
} from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import ContactButtons from '@/components/contact/ContactButtons'

type Props = { params: { locale: string } }

export default async function HomePage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale })

  const [featured, services, settings] = await Promise.all([
    client.fetch(featuredPortfolioQuery, { locale }).catch(() => []),
    client.fetch(servicesPreviewQuery, { locale }).catch(() => []),
    client.fetch(siteSettingsQuery, { locale }).catch(() => null),
  ])

  return (
    <>
      {/* 1. Hero */}
      <section className="min-h-screen flex items-center justify-center bg-brand-50 pt-16">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.4em] text-brand-800 mb-4 uppercase">
            Makeup Artist
          </h1>
          <p className="text-brand-500 tracking-widest mb-2">Paris, France</p>
          {settings?.heroTagline && (
            <p className="text-brand-600 text-lg font-light mt-4 mb-8 max-w-md mx-auto">
              {settings.heroTagline}
            </p>
          )}
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link
              href={`/${locale}/portfolio`}
              className="inline-block px-10 py-3 border border-brand-400 text-brand-700 text-sm tracking-[0.2em] hover:bg-brand-100 transition-colors uppercase"
            >
              {t('hero.cta')}
            </Link>
            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-500 hover:text-brand-800 transition-colors group"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-xs tracking-[0.2em] uppercase group-hover:underline underline-offset-2">
                  {t('contact.instagram')}
                </span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 2. Featured Portfolio */}
      {featured.length > 0 && (
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <h2 className="text-center text-xs tracking-[0.4em] text-brand-500 uppercase">
            {t('home.portfolio_section')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mt-10">
            {featured.map((item: any) => (
              <div key={item._id} className="aspect-square bg-brand-100 overflow-hidden relative">
                {item.image?.asset ? (
                  <Image
                    src={urlFor(item.image).width(600).height(600).fit('crop').url()}
                    alt={item.title ?? item.category ?? ''}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                    <span className="text-brand-400 text-xs tracking-wider uppercase">
                      {item.category}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href={`/${locale}/portfolio`}
              className="text-xs tracking-[0.2em] text-brand-500 hover:text-brand-800 border-b border-brand-300 pb-0.5 uppercase transition-colors"
            >
              {t('home.portfolio_more')}
            </Link>
          </div>
        </section>
      )}

      {/* 3. Services Preview */}
      {services.length > 0 && (
        <section className="py-20 bg-brand-50 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-xs tracking-[0.4em] text-brand-500 uppercase">
              {t('home.services_section')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {services.map((s: any) => (
                <div key={s._id} className="bg-white p-6 text-center border border-brand-100">
                  <h3 className="text-sm font-medium tracking-widest text-brand-800 uppercase mb-2">
                    {s.name ?? '—'}
                  </h3>
                  <p className="text-brand-700 font-light text-xl">€{s.price}</p>
                  {s.duration && (
                    <p className="text-brand-400 text-xs mt-1 tracking-wider">{s.duration}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href={`/${locale}/services`}
                className="text-xs tracking-[0.2em] text-brand-500 hover:text-brand-800 border-b border-brand-300 pb-0.5 uppercase transition-colors"
              >
                {t('home.services_more')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. Contact CTA */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-xs tracking-[0.4em] text-brand-500 uppercase mb-10">
          {t('home.contact_section')}
        </h2>
        <ContactButtons
          whatsappNumber={settings?.whatsappNumber}
          email={settings?.email}
        />
      </section>
    </>
  )
}
