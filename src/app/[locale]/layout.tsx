import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { client } from '@/lib/sanity/client'
import { siteSettingsQuery } from '@/lib/sanity/queries'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-sans',
  display: 'swap',
})

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

  const settings = await client
    .fetch(siteSettingsQuery, { locale })
    .catch(() => null)

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-brand-800 text-brand-50 font-sans antialiased">
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
