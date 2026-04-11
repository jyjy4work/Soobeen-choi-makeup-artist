// Design Ref: §6.4 — hreflang 메타데이터, lang 속성 처리
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { client } from '@/lib/sanity/client'
import { siteSettingsQuery } from '@/lib/sanity/queries'

type Props = {
  children: React.ReactNode
  params: { locale: string }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const SITE_TITLE = 'Makeup Artist Paris'
const SITE_DESCRIPTION: Record<string, string> = {
  fr: 'Maquilleuse professionnelle basée à Paris. Mariage, éditorial, scène.',
  en: 'Professional makeup artist based in Paris. Wedding, editorial, stage.',
  ko: '파리 기반 전문 메이크업 아티스트. 웨딩, 화보, 무대.',
  zh: '巴黎专业化妆师。婚礼、杂志、舞台。',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return {
    title: { default: SITE_TITLE, template: `%s | ${SITE_TITLE}` },
    description: SITE_DESCRIPTION[locale] ?? SITE_DESCRIPTION.fr,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: '/fr',
        en: '/en',
        ko: '/ko',
        zh: '/zh',
        'x-default': '/fr',
      },
    },
    openGraph: {
      siteName: SITE_TITLE,
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params

  if (!routing.locales.includes(locale as 'fr' | 'en' | 'ko' | 'zh')) {
    notFound()
  }

  const messages = await getMessages()

  // Sanity 미설정 시 null 반환 (graceful fallback)
  const settings = await client
    .fetch(siteSettingsQuery, { locale })
    .catch(() => null)

  return (
    <html lang={locale}>
      <body className="bg-white text-brand-900">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer
            instagramUrl={settings?.instagramUrl}
            youtubeUrl={settings?.youtubeUrl}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
