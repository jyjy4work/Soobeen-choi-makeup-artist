// Design Ref: §4 — GROQ 쿼리 (locale projection 패턴)
// 패턴: fieldName[_key == $locale][0].value
import { groq } from 'next-sanity'

// 홈 화면 featured 포트폴리오 (최대 6개)
export const featuredPortfolioQuery = groq`
  *[_type == "portfolio" && featured == true] | order(date desc)[0...6] {
    _id,
    "title": title[_key == $locale][0].value,
    category,
    date,
    image { asset->, hotspot, crop }
  }
`

// 포트폴리오 전체 목록
export const portfolioQuery = groq`
  *[_type == "portfolio"] | order(date desc) {
    _id,
    "title": title[_key == $locale][0].value,
    category,
    date,
    image { asset->, hotspot, crop }
  }
`

// 서비스 목록
export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    "name": name[_key == $locale][0].value,
    "description": description[_key == $locale][0].value,
    price,
    duration
  }
`

// 아티스트 정보 (싱글톤)
export const artistQuery = groq`
  *[_type == "artist" && _id == "artist-singleton"][0] {
    "name": name[_key == $locale][0].value,
    "bio": bio[_key == $locale][0].value,
    photo { asset->, hotspot, crop },
    "awards": awards[] {
      "title": title[_key == $locale][0].value,
      year
    } | order(year desc)
  }
`

// 사이트 설정 (싱글톤) — WhatsApp, 이메일, SNS URL
export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "site-settings-singleton"][0] {
    "heroTagline": heroTagline[_key == $locale][0].value,
    instagramUrl,
    youtubeUrl,
    whatsappNumber,
    email
  }
`

// 홈용 서비스 미리보기 (최대 3개)
export const servicesPreviewQuery = groq`
  *[_type == "service"] | order(order asc)[0...3] {
    _id,
    "name": name[_key == $locale][0].value,
    price,
    duration
  }
`
