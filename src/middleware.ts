// Design Ref: §5.2 — Accept-Language 감지 → 해당 로케일로 리다이렉트
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Sanity Studio(/studio), API 라우트, 정적 파일 제외
  matcher: ['/((?!studio|api|_next|_vercel|.*\\..*).*)'],
}
