# Design: Makeup Artist Portfolio Website
> Feature: makeup-artist-website  
> Phase: Design  
> Created: 2026-04-11  
> Status: Completed (Retroactive Documentation)  
> Architecture: Option C — Pragmatic Balance (선택됨)

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 파리 거주 메이크업 아티스트의 글로벌 고객 유치 및 문의 채널 확보 |
| **WHO** | 수빈 (메이크업 아티스트) + 잠재 고객 (FR/EN/KO/ZH 사용자) |
| **RISK** | Sanity 콘텐츠 미입력 시 빈 사이트 노출 / 다국어 번역 품질 |
| **SUCCESS** | 배포 완료 + 4개 언어 정상 작동 + Sanity Studio에서 콘텐츠 관리 가능 |
| **SCOPE** | 포트폴리오/서비스/소개/문의 4개 섹션, Vercel 배포, ISR 캐시 갱신 |

---

## 1. Overview

파리 활동 메이크업 아티스트를 위한 **Sanity CMS 기반 다국어 포트폴리오 사이트**.  
Next.js 14 App Router + next-intl로 4개 언어(FR/EN/KO/ZH) URL 라우팅을 구현하고,  
Sanity Studio를 `/studio` 경로에 내장하여 아티스트가 직접 콘텐츠를 관리한다.

---

## 2. Architecture

### 2.1 선택 아키텍처: Option C — Pragmatic Balance

```
[Client Browser]
      │
      ▼
[Vercel Edge — Middleware]
  next-intl locale detection → /{locale}/...
      │
      ▼
[Next.js App Router — Server Components]
  /{locale}/page.tsx         → 홈 (Hero + Featured Portfolio + Services Preview + Contact CTA)
  /{locale}/portfolio        → 포트폴리오 갤러리 (CategoryFilter + Lightbox)
  /{locale}/services         → 서비스 & 가격
  /{locale}/about            → 아티스트 소개
  /{locale}/contact          → 문의
  /studio/[[...tool]]        → Sanity Studio (embedded)
      │
      ▼
[Sanity CDN / API]
  client (useCdn: true)      → 페이지 렌더링 (read-only)
  serverClient (useCdn: false) → ISR 재검증 (write 포함)
      │
      ▼
[/api/revalidate]            ← Sanity Webhook (POST, x-webhook-secret)
  revalidatePath 호출 → ISR 갱신
```

### 2.2 렌더링 전략
| 페이지 | 전략 | 이유 |
|--------|------|------|
| 홈/포트폴리오/서비스/소개 | SSG + ISR | 콘텐츠 변경 빈도 낮음, SEO 중요 |
| /studio | Dynamic (SSR) | Sanity Studio는 CSR 필요 |
| /api/revalidate | API Route | Webhook 수신 |

---

## 3. Directory Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (metadata only)
│   ├── robots.ts                     # Robots.txt
│   ├── sitemap.ts                    # Dynamic sitemap (all locales)
│   ├── [locale]/
│   │   ├── layout.tsx                # Locale layout (Header, Footer, next-intl)
│   │   ├── page.tsx                  # 홈페이지
│   │   ├── portfolio/page.tsx        # 포트폴리오 갤러리
│   │   ├── services/page.tsx         # 서비스 & 가격
│   │   ├── about/page.tsx            # 아티스트 소개
│   │   └── contact/page.tsx          # 문의 페이지
│   ├── studio/
│   │   ├── layout.tsx                # Studio 전용 레이아웃
│   │   └── [[...tool]]/page.tsx      # NextStudio 컴포넌트
│   └── api/
│       └── revalidate/route.ts       # ISR 웹훅 엔드포인트
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # 고정 헤더 + 모바일 햄버거
│   │   └── Footer.tsx                # 푸터 + SNS 아이콘
│   ├── portfolio/
│   │   ├── Gallery.tsx               # 갤러리 그리드 + 라이트박스 (Client)
│   │   └── CategoryFilter.tsx        # 카테고리 필터 버튼 (Client)
│   ├── contact/
│   │   └── ContactButtons.tsx        # WhatsApp + Email CTA 버튼
│   └── ui/
│       └── LanguageSwitcher.tsx      # 언어 선택 드롭다운 (Client)
├── lib/
│   └── sanity/
│       ├── client.ts                 # Sanity 클라이언트 (CDN + serverClient)
│       ├── queries.ts                # GROQ 쿼리 모음
│       └── image.ts                  # urlFor 이미지 URL 빌더
├── i18n/
│   ├── routing.ts                    # 로케일 설정 (fr/en/ko/zh, default=fr)
│   └── request.ts                    # 메시지 로딩 설정
├── messages/
│   ├── fr.json                       # 프랑스어 번역
│   ├── en.json                       # 영어 번역
│   ├── ko.json                       # 한국어 번역
│   └── zh.json                       # 중국어 번역
└── middleware.ts                     # next-intl 미들웨어 (로케일 감지)

sanity/
├── sanity.config.ts                  # Sanity Studio 설정 (basePath: '/studio')
├── schemaTypes/
│   ├── portfolio.ts                  # 포트폴리오 스키마
│   ├── service.ts                    # 서비스 스키마
│   ├── artist.ts                     # 아티스트 싱글톤 스키마
│   └── siteSettings.ts              # 사이트 설정 싱글톤 스키마
└── index.ts                          # 스키마 타입 export
```

---

## 4. API Design

### 4.1 GROQ Queries (Sanity)

```typescript
// 홈 Featured 포트폴리오 (최대 6개)
*[_type == "portfolio" && featured == true] | order(date desc)[0...6] {
  _id,
  "title": title[_key == $locale][0].value,
  category,
  date,
  image { asset->, hotspot, crop }
}

// 포트폴리오 전체
*[_type == "portfolio"] | order(date desc) { ... }

// 서비스 (order asc)
*[_type == "service"] | order(order asc) { ... }

// 아티스트 싱글톤
*[_type == "artist" && _id == "artist-singleton"][0] { ... }

// 사이트 설정 싱글톤
*[_type == "siteSettings" && _id == "site-settings-singleton"][0] { ... }
```

**Locale Projection 패턴**: `fieldName[_key == $locale][0].value`

### 4.2 API Routes

| Method | Path | 인증 | 역할 |
|--------|------|------|------|
| POST | `/api/revalidate` | `x-webhook-secret` header | ISR 재검증 트리거 |

---

## 5. Data Models (Sanity Schemas)

### 5.1 Portfolio
```
_type: "portfolio"
title: internationalizedArrayString (fr/en/ko/zh)
category: "wedding" | "editorial" | "stage" | "natural"
image: image (required, hotspot)
date: date
featured: boolean (홈페이지 표시 여부)
```

### 5.2 Service
```
_type: "service"
name: internationalizedArrayString (fr/en/ko/zh)
description: internationalizedArrayText (optional)
price: number (€, positive)
duration: string (e.g. "2h")
order: number (표시 순서)
```

### 5.3 Artist (Singleton: "artist-singleton")
```
_type: "artist"
name: internationalizedArrayString
bio: internationalizedArrayText
photo: image (required)
awards: array of { title: internationalizedArrayString, year: number }
```

### 5.4 SiteSettings (Singleton: "site-settings-singleton")
```
_type: "siteSettings"
heroTagline: internationalizedArrayString
instagramUrl: url
youtubeUrl: url
whatsappNumber: string (digits + country code)
email: string
```

---

## 6. i18n Design

### 6.1 URL 구조
```
/fr/           → 홈 (기본, Accept-Language: fr → redirect)
/en/portfolio  → 포트폴리오 (영어)
/ko/services   → 서비스 (한국어)
/zh/about      → 소개 (중국어)
```

### 6.2 번역 키 구조
```json
{
  "nav": { "portfolio": "...", "services": "...", "about": "...", "contact": "..." },
  "hero": { "cta": "...", "scroll": "..." },
  "home": { "portfolio_section": "...", "services_section": "...", "contact_section": "..." },
  "portfolio": { "title": "...", "filter_all": "...", "category_wedding": "..." },
  "services": { "title": "...", "price_label": "...", "contact_cta": "..." },
  "about": { "title": "..." },
  "contact": { "title": "...", "whatsapp": "...", "email": "..." },
  "footer": { "rights": "..." }
}
```

---

## 7. Styling Design

### 7.1 브랜드 컬러 팔레트
```
brand-50:  #fdf8f3  (배경, 히어로)
brand-100: #f5e9d9  (카드 배경)
brand-200: #e8d0b4
brand-300: #d4b08a
brand-400: #bc8d60  (보조 텍스트)
brand-500: #a06b3f  (주요 보조)
brand-600: #8a5530
brand-700: #724422  (본문 텍스트)
brand-800: #5c3318  (제목)
brand-900: #3d1f0a
```

### 7.2 타이포그래피
- 제목: `font-extralight tracking-[0.4em] uppercase` (럭셔리 감성)
- 보조: `text-xs tracking-[0.2em] uppercase`
- 본문: `font-light text-sm leading-relaxed`

---

## 8. Test Plan

| 레벨 | 항목 | 방법 |
|------|------|------|
| L1 | 4개 locale URL 200 응답 | `curl https://makeup-artist-one.vercel.app/{locale}/` |
| L1 | `/api/revalidate` 인증 거부 (401) | curl without secret header |
| L1 | `/robots.txt`, `/sitemap.xml` 응답 | 직접 접속 |
| L2 | 포트폴리오 카테고리 필터 동작 | 브라우저 클릭 테스트 |
| L2 | 언어 전환 시 URL 변경 | 언어 스위처 클릭 확인 |
| L2 | WhatsApp 버튼 링크 확인 | href 값 검증 |
| L3 | Sanity Studio 접속 → 콘텐츠 입력 → 사이트 반영 | 전체 플로우 |

---

## 9. Environment Variables

| 변수 | 용도 | 노출 |
|------|------|------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity 프로젝트 ID | 공개 |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity 데이터셋 | 공개 |
| `SANITY_API_TOKEN` | Sanity API 토큰 (서버 전용) | 비공개 |
| `SANITY_WEBHOOK_SECRET` | ISR 웹훅 인증 시크릿 | 비공개 |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (sitemap용) | 공개 |

---

## 10. Deployment

| 항목 | 값 |
|------|-----|
| 플랫폼 | Vercel |
| 도메인 | `https://makeup-artist-one.vercel.app` |
| Git 연동 | `github.com/jyjy4work/Soobeen-choi-makeup-artist` |
| 빌드 커맨드 | `npm run build` |
| 환경변수 | Vercel Project Settings에 설정 완료 |
| 자동 배포 | GitHub main 브랜치 push 시 자동 |

---

## 11. Implementation Guide

### 11.1 Module Map

| Module | 파일 | 역할 |
|--------|------|------|
| M1 | `src/app/[locale]/layout.tsx` | 로케일 레이아웃, 메타데이터 |
| M2 | `src/app/[locale]/page.tsx` | 홈페이지 |
| M3 | `src/app/[locale]/portfolio/` | 포트폴리오 페이지 |
| M4 | `src/app/[locale]/services/` | 서비스 페이지 |
| M5 | `src/app/[locale]/about/` | 소개 페이지 |
| M6 | `src/lib/sanity/` | Sanity 클라이언트 & 쿼리 |
| M7 | `src/components/` | UI 컴포넌트 |
| M8 | `sanity/` | CMS 스키마 & Studio 설정 |
| M9 | `src/app/api/revalidate/` | ISR 웹훅 |
| M10 | `src/middleware.ts` + `src/i18n/` | 다국어 미들웨어 |

### 11.2 Implementation Order
1. M10 — i18n 설정 (기반)
2. M6 — Sanity 클라이언트 & 쿼리
3. M8 — Sanity 스키마 & Studio
4. M7 — 공통 컴포넌트
5. M1 — 로케일 레이아웃
6. M2~M5 — 각 페이지
7. M9 — ISR 웹훅
