import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-04-11',
  useCdn: false,  // CDN 캐시 비활성화 — ISR revalidate로 제어
})

// ISR 재검증용 — API 토큰 포함 (서버 사이드 전용)
export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-04-11',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
