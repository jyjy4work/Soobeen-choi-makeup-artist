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
import RevealSection from '@/components/ui/RevealSection'

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
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-brand-800 flex items-center overflow-hidden">

        {/* Hero background image */}
        {settings?.heroImage?.asset && (
          <Image
            src={urlFor(settings.heroImage).width(1920).height(1080).fit('crop').url()}
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
        )}

        {/* Vertical decorative text — desktop only */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
          <div className="w-px h-20 bg-brand-400" />
          <span className="text-brand-300 text-[9px] tracking-[0.45em] uppercase [writing-mode:vertical-rl] rotate-180">
            Paris · France
          </span>
          <div className="w-px h-20 bg-brand-400" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 pt-28 pb-24">

          {/* Overline */}
          <p className="text-brand-100 text-[10px] tracking-[0.6em] uppercase mb-10 animate-fade-in-up">
            &#8212;&nbsp;Makeup Artist&nbsp;&#8212;
          </p>

          {/* Display headline */}
          <div className="mb-10">
            <h1 className="font-display font-light leading-[0.88] tracking-[-0.01em] text-brand-50
              text-[clamp(4.5rem,12vw,11rem)]
              animate-fade-in-up animate-delay-100">
              MAKEUP
            </h1>
            <h1 className="font-display font-light italic leading-[0.88] tracking-[-0.01em] text-brand-50
              text-[clamp(4.5rem,12vw,11rem)]
              animate-fade-in-up animate-delay-200
              pl-[clamp(1.5rem,5vw,6rem)]">
              ARTIST
            </h1>
          </div>

          {/* Gold rule */}
          <div className="flex items-center gap-4 mb-8 animate-fade-in-up animate-delay-300">
            <div className="w-12 h-px bg-brand-100" />
            <span className="text-brand-100 text-[9px] tracking-[0.5em] uppercase">Paris</span>
          </div>

          {/* Tagline */}
          {settings?.heroTagline && (
            <p className="text-brand-200 text-sm font-light leading-relaxed max-w-xs md:max-w-sm
              mb-12 animate-fade-in-up animate-delay-300">
              {settings.heroTagline}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-6 animate-fade-in-up animate-delay-400">
            <Link
              href={`/${locale}/portfolio`}
              className="group inline-flex items-center gap-3 px-8 py-3.5
                border border-brand-100 text-brand-50 text-[10px] tracking-[0.4em] uppercase
                hover:bg-brand-100 hover:text-brand-800 transition-all duration-300"
            >
              {t('hero.cta')}
              <span className="group-hover:translate-x-1 transition-transform duration-300">&#8594;</span>
            </Link>

            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-300 hover:text-brand-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-[10px] tracking-[0.3em] uppercase">Instagram</span>
              </a>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-6 md:left-14 flex items-center gap-3 animate-fade-in-up animate-delay-500">
          <div className="w-px h-8 bg-brand-400" />
          <span className="text-brand-300 text-[9px] tracking-[0.4em] uppercase">{t('hero.scroll')}</span>
        </div>
      </section>

      {/* ─── FEATURED PORTFOLIO ───────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-24 px-6 md:px-14 max-w-7xl mx-auto">
          <RevealSection>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-brand-100" />
                <h2 className="text-[10px] tracking-[0.5em] text-brand-100 uppercase">
                  {t('home.portfolio_section')}
                </h2>
              </div>
              <Link
                href={`/${locale}/portfolio`}
                className="text-[9px] tracking-[0.3em] text-brand-300 hover:text-brand-100
                  border-b border-brand-400 hover:border-brand-100 pb-0.5 uppercase transition-colors"
              >
                {t('home.portfolio_more')}
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2">
              {featured.map((item: any) => (
                <div key={item._id} className="aspect-square bg-brand-700 overflow-hidden relative group cursor-pointer">
                  {item.image?.asset ? (
                    <>
                      <Image
                        src={urlFor(item.image).width(600).height(600).fit('crop').url()}
                        alt={item.title ?? item.category ?? ''}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-brand-800/0 group-hover:bg-brand-800/50
                        transition-all duration-500 flex items-end p-4">
                        <span className="text-brand-50 text-[9px] tracking-[0.4em] uppercase
                          translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                          transition-all duration-300">
                          {item.category}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-brand-400 text-[9px] tracking-wider uppercase">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </RevealSection>
        </section>
      )}

      {/* ─── SERVICES PREVIEW ─────────────────────────────── */}
      {services.length > 0 && (
        <section className="py-24 bg-brand-700 px-6 md:px-14">
          <RevealSection className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-8 h-px bg-brand-100" />
              <h2 className="text-[10px] tracking-[0.5em] text-brand-100 uppercase">
                {t('home.services_section')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {services.map((s: any) => (
                <div
                  key={s._id}
                  className="border border-brand-500 p-8 hover:border-brand-100 transition-colors group"
                >
                  <h3 className="text-[9px] tracking-[0.35em] text-brand-200 uppercase mb-5
                    group-hover:text-brand-100 transition-colors">
                    {s.name ?? '—'}
                  </h3>
                  <p className="font-display font-light text-4xl text-brand-50">€{s.price}</p>
                  {s.duration && (
                    <p className="text-brand-300 text-[9px] mt-2 tracking-wider uppercase">{s.duration}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-4">
              <div className="w-8 h-px bg-brand-500" />
              <Link
                href={`/${locale}/services`}
                className="text-[9px] tracking-[0.3em] text-brand-300 hover:text-brand-100
                  border-b border-brand-400 hover:border-brand-100 pb-0.5 uppercase transition-colors"
              >
                {t('home.services_more')}
              </Link>
            </div>
          </RevealSection>
        </section>
      )}

      {/* ─── CONTACT CTA ──────────────────────────────────── */}
      <section className="py-32 px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-8 h-px bg-brand-100" />
          <h2 className="text-[10px] tracking-[0.5em] text-brand-100 uppercase">
            {t('home.contact_section')}
          </h2>
          <div className="w-8 h-px bg-brand-100" />
        </div>
        <ContactButtons
          whatsappNumber={settings?.whatsappNumber}
          email={settings?.email}
        />
      </section>
    </>
  )
}
