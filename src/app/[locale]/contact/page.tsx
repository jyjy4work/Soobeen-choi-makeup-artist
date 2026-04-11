// Plan SC: WhatsApp 1클릭 연결
import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { siteSettingsQuery } from '@/lib/sanity/queries'
import ContactButtons from '@/components/contact/ContactButtons'

type Props = { params: { locale: string } }

export default async function ContactPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'contact' })
  const settings = await client.fetch(siteSettingsQuery, { locale }).catch(() => null)

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-xs tracking-[0.5em] text-brand-500 uppercase mb-4">
        {t('title')}
      </h1>
      <p className="text-brand-400 text-sm mb-12 max-w-md">{t('subtitle')}</p>

      <ContactButtons
        whatsappNumber={settings?.whatsappNumber}
        email={settings?.email}
      />

      {/* SNS 링크 */}
      {(settings?.instagramUrl || settings?.youtubeUrl) && (
        <div className="mt-16 flex gap-8 justify-center">
          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.2em] text-brand-400 hover:text-brand-700 uppercase border-b border-brand-200 pb-0.5 transition-colors"
            >
              {t('instagram')}
            </a>
          )}
          {settings.youtubeUrl && (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.2em] text-brand-400 hover:text-brand-700 uppercase border-b border-brand-200 pb-0.5 transition-colors"
            >
              {t('youtube')}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
