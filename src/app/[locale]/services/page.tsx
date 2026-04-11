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
    <div className="pt-14 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-14">

        <div className="py-16 flex items-center gap-4">
          <div className="w-8 h-px bg-brand-100" />
          <h1 className="text-[10px] tracking-[0.6em] text-brand-100 uppercase">
            {t('services.title')}
          </h1>
        </div>

        {services.length > 0 ? (
          <div className="divide-y divide-brand-500">
            {services.map((s: any, i: number) => (
              <div
                key={s._id}
                className="py-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 group"
              >
                <div className="flex gap-6 items-start">
                  <span className="text-brand-400 text-[10px] font-display font-light tracking-wider mt-0.5 w-6 shrink-0 text-right">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="text-[10px] tracking-[0.35em] text-brand-50 uppercase mb-3
                      group-hover:text-brand-100 transition-colors">
                      {s.name ?? '—'}
                    </h2>
                    {s.description && (
                      <p className="text-brand-300 text-sm leading-relaxed font-light max-w-md">
                        {s.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 sm:pl-8">
                  <p className="font-display font-light text-4xl text-brand-50 tracking-tight">
                    &euro;{s.price}
                  </p>
                  {s.duration && (
                    <p className="text-brand-300 text-[9px] tracking-wider mt-1.5 uppercase">
                      {s.duration}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-400 text-[9px] tracking-widest text-center mt-20 uppercase">
            (Sanity Studio에서 서비스를 추가해 주세요)
          </p>
        )}

        {/* Contact CTA */}
        <div className="mt-20 pb-24 pt-12 border-t border-brand-500 text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-8 h-px bg-brand-100" />
            <p className="text-[10px] tracking-[0.4em] text-brand-100 uppercase">
              {t('home.contact_section')}
            </p>
            <div className="w-8 h-px bg-brand-100" />
          </div>
          <ContactButtons
            whatsappNumber={settings?.whatsappNumber}
            email={settings?.email}
          />
        </div>
      </div>
    </div>
  )
}
