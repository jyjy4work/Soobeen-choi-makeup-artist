// Design Ref: §8 — Sanity 웹훅 수신 → ISR 재검증
// Sanity에서 콘텐츠 publish 시 자동 호출
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')

  // 보안: 웹훅 시크릿 검증
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // 모든 로케일 페이지 재검증
  const locales = ['fr', 'en', 'ko', 'zh']
  for (const locale of locales) {
    revalidatePath(`/${locale}`)
    revalidatePath(`/${locale}/portfolio`)
    revalidatePath(`/${locale}/services`)
    revalidatePath(`/${locale}/about`)
    revalidatePath(`/${locale}/contact`)
  }

  return NextResponse.json({ revalidated: true, timestamp: Date.now() })
}
