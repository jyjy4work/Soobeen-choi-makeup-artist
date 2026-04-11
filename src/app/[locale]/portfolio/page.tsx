import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { portfolioQuery } from '@/lib/sanity/queries'
import Gallery from '@/components/portfolio/Gallery'

type Props = { params: { locale: string } }

export default async function PortfolioPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  const items = await client.fetch(portfolioQuery, { locale }).catch(() => [])

  return (
    <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-center text-xs tracking-[0.5em] text-brand-500 uppercase mb-12">
        {t('title')}
      </h1>
      <Gallery items={items} />
    </div>
  )
}
