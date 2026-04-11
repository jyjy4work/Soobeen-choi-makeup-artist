// Sanity Studio를 Next.js 앱 내에 /studio 경로로 임베드
// 아티스트는 https://도메인.com/studio 접속하여 콘텐츠 관리
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
