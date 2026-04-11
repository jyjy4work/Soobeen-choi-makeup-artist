import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // 유효하지 않은 로케일은 기본값(fr)으로 대체
  if (!locale || !routing.locales.includes(locale as 'fr' | 'en' | 'ko' | 'zh')) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
