import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { portfolioQuery } from '@/lib/sanity/queries'
import Gallery from '@/components/portfolio/Gallery'

type Props = { params: { locale: string } }

export default async function PortfolioPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  const items = await client.fetch(portfolioQuery, { locale }).catch(() => [])

  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-14">
        <div className="py-16 flex items-center gap-4">
          <div className="w-8 h-px bg-brand-100" />
          <h1 className="text-[10px] tracking-[0.6em] text-brand-100 uppercase">
            {t('title')}
          </h1>
        </div>
        <Gallery items={items} />
        <div className="pb-24" />
      </div>
    </div>
  )
}
