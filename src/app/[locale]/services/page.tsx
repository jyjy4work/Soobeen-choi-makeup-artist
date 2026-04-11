import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { servicesQuery, siteSettingsQuery } from '@/lib/sanity/queries'
import ContactButtons from '@/components/contact/ContactButtons'

type Props = { params: { locale: string } }

export default async function ServicesPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale })

  const [services, settings] = await Promise.all([
    client.fetch(servicesQuery, { locale }).catch(() => []),
    client.fetch(siteSettingsQuery, { locale }).catch(() => null),
  ])

  return (
    <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-center text-xs tracking-[0.5em] text-brand-500 uppercase mb-16">
        {t('services.title')}
      </h1>

      {services.length > 0 ? (
        <div className="space-y-6">
          {services.map((s: any) => (
            <div
              key={s._id}
              className="border border-brand-100 p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex-1">
                <h2 className="text-sm font-medium tracking-widest text-brand-800 uppercase mb-2">
                  {s.name ?? '—'}
                </h2>
                {s.description && (
                  <p className="text-brand-500 text-sm leading-relaxed">{s.description}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-light text-brand-700">€{s.price}</p>
                {s.duration && (
                  <p className="text-brand-400 text-xs tracking-wider mt-1">{s.duration}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-brand-300 text-sm tracking-wider mt-20">
          (Sanity Studio에서 서비스를 추가해 주세요)
        </p>
      )}

      {/* 하단 문의 CTA */}
      <div className="mt-16 pt-12 border-t border-brand-100 text-center">
        <p className="text-xs tracking-widest text-brand-400 uppercase mb-8">
          {t('home.contact_section')}
        </p>
        <ContactButtons
          whatsappNumber={settings?.whatsappNumber}
          email={settings?.email}
        />
      </div>
    </div>
  )
}
