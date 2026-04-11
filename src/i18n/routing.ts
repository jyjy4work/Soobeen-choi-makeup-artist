// Design Ref: §5.1 — 4개 로케일 정의, 기본값 프랑스어
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en', 'ko', 'zh'],
  defaultLocale: 'fr',
  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]
