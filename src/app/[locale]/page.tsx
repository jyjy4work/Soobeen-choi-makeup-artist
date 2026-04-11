// Plan SC: 포트폴리오 미리보기 + 서비스 CTA + WhatsApp 문의 연결
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import {
  featuredPortfolioQuery,
  servicesPreviewQuery,
  siteSettingsQuery,
} from '@/lib/sanity/queries'
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
          <div className="mt-10">
            <Link
              href={`/${locale}/portfolio`}
              className="inline-block px-10 py-3 border border-brand-400 text-brand-700 text-sm tracking-[0.2em] hover:bg-brand-100 transition-colors uppercase"
            >
              {t('hero.cta')}
            </Link>
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
              <div key={item._id} className="aspect-square bg-brand-100 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                  <span className="text-brand-400 text-xs tracking-wider uppercase">
                    {item.category}
                  </span>
                </div>
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
