import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { siteSettingsQuery } from '@/lib/sanity/queries'
import ContactButtons from '@/components/contact/ContactButtons'

type Props = { params: { locale: string } }

export default async function ContactPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'contact' })
  const settings = await client.fetch(siteSettingsQuery, { locale }).catch(() => null)

  return (
    <div className="pt-14 min-h-screen flex flex-col items-center justify-center px-6 text-center pb-20">

      <div className="flex items-center gap-4 mb-8">
        <div className="w-8 h-px bg-brand-100" />
        <span className="text-[10px] tracking-[0.6em] text-brand-100 uppercase">Contact</span>
        <div className="w-8 h-px bg-brand-100" />
      </div>

      <h1 className="font-display font-light text-5xl md:text-7xl lg:text-8xl
        text-brand-50 mb-6 leading-[0.9] tracking-[-0.01em]">
        {t('title')}
      </h1>

      <p className="text-brand-300 text-sm mb-14 max-w-sm font-light leading-relaxed">
        {t('subtitle')}
      </p>

      <ContactButtons
        whatsappNumber={settings?.whatsappNumber}
        email={settings?.email}
      />

      {(settings?.instagramUrl || settings?.youtubeUrl) && (
        <div className="mt-16 flex gap-8 justify-center">
          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] tracking-[0.35em] text-brand-300 hover:text-brand-100 uppercase
                border-b border-brand-400 hover:border-brand-100 pb-0.5 transition-colors"
            >
              {t('instagram')}
            </a>
          )}
          {settings.youtubeUrl && (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] tracking-[0.35em] text-brand-300 hover:text-brand-100 uppercase
                border-b border-brand-400 hover:border-brand-100 pb-0.5 transition-colors"
            >
              {t('youtube')}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
