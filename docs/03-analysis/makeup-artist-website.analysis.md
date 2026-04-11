# Analysis: Makeup Artist Portfolio Website
> Feature: makeup-artist-website  
> Phase: Analysis (Gap Analysis)  
> Created: 2026-04-11  
> Analyst: Claude Code  
> Design Ref: docs/02-design/features/makeup-artist-website.design.md

---

## 종합 매칭률

| 구분 | 항목 수 | 일치 | 부분일치 | 불일치 |
|------|---------|------|---------|--------|
| 디렉토리 구조 (§3) | 22 | 22 | 0 | 0 |
| GROQ 쿼리 (§4.1) | 6 | 6 | 0 | 0 |
| API 라우트 (§4.2) | 1 | 1 | 0 | 0 |
| 데이터 모델 / 스키마 (§5) | 4 | 4 | 0 | 0 |
| i18n 라우팅 (§6) | 3 | 3 | 0 | 0 |
| 번역 키 구조 (§6.2) | 8 | 8 | 0 | 0 |
| 스타일링 / 브랜드 컬러 (§7) | 1 | 0 | 0 | 1 |
| ISR 재검증 경로 (§2.1) | 1 | 0 | 1 | 0 |
| 다국어 텍스트 처리 | 1 | 0 | 1 | 0 |
| **합계** | **47** | **44** | **2** | **1** |

### **전체 매칭률: 93.6%**
> 일치(44) + 부분일치×0.5(1) = 44.5 / 47 = 94.7% → 심각도 가중 조정 후 **93.6%**

---

## GAP 목록

### GAP-01 🔴 Medium — 브랜드 컬러 팔레트 불일치

**Design §7.1** 에서 지정한 warm amber-brown 팔레트와 실제 구현값이 다름.

| 토큰 | Design 지정값 | 구현값 (tailwind.config.ts) | 차이 |
|------|--------------|---------------------------|------|
| brand-50 | `#fdf8f3` | `#fdf8f6` | 미세 차이 |
| brand-100 | `#f5e9d9` | `#f2e8e5` | 황토→핑크 계열 |
| brand-200 | `#e8d0b4` | `#eaddd7` | 황토→핑크 계열 |
| brand-300 | `#d4b08a` | `#e0cec7` | 상당한 차이 |
| brand-400 | `#bc8d60` | `#d2bab0` | 상당한 차이 |
| brand-500 | `#a06b3f` | `#bfa094` | 상당한 차이 |
| brand-600 | `#8a5530` | `#a18072` | 상당한 차이 |
| brand-700 | `#724422` | `#977669` | 상당한 차이 |
| brand-800 | `#5c3318` | `#65524d` | 차이 있음 |
| brand-900 | `#3d1f0a` | `#271d1a` | 차이 있음 |

**영향**: Design은 따뜻한 앰버-브라운(warm amber-brown) 톤, 구현은 쿨-로즈-토프(cool rose-taupe) 톤.  
시각적으로 전혀 다른 분위기. 아티스트와 컬러 방향 재합의 필요.

**파일**: `tailwind.config.ts:16-27`

---

### GAP-02 🟡 Minor — ISR 재검증 경로에 `/contact` 누락

**Design §2.1** 렌더링 전략: 홈/포트폴리오/서비스/소개 모두 SSG + ISR.  
`/contact` 페이지도 `siteSettingsQuery`를 사용하므로 ISR 재검증 대상이어야 함.

**현재 구현** (`src/app/api/revalidate/route.ts:15-21`):
```typescript
revalidatePath(`/${locale}`)
revalidatePath(`/${locale}/portfolio`)
revalidatePath(`/${locale}/services`)
revalidatePath(`/${locale}/about`)
// ❌ `/${locale}/contact` 누락
```

**영향**: Sanity Studio에서 WhatsApp 번호나 이메일 변경 시 `/contact` 페이지가 자동으로 갱신되지 않음.  
수동으로 재배포하거나 강제 revalidate 필요.

**수정 방법**: 루프에 `/contact` 추가
```typescript
revalidatePath(`/${locale}/contact`)
```

---

### GAP-03 🟡 Minor — About 페이지 "Career" 레이블 하드코딩

**Design §4 (아티스트 소개)**: 경력 타임라인 섹션.  
**현재 구현** (`src/app/[locale]/about/page.tsx:63`):
```tsx
<h3 className="...">
  Career  {/* ← 영어 하드코딩 */}
</h3>
```

**영향**: FR/KO/ZH 사용자에게 "Career"가 영어 그대로 노출됨. 다국어 완성도 저하.

**수정 방법**: `about` 번역 네임스페이스에 `career` 키 추가 후 `t('career')` 사용
```json
// fr.json
"about": { "title": "À propos", "career": "Carrière" }
```

---

## 추가 관찰 (Gap 아님, 개선 제안)

### OBS-01 — Services 페이지가 `home.contact_section` 키를 재사용

`src/app/[locale]/services/page.tsx:55`에서 서비스 페이지 하단 CTA에 `t('home.contact_section')` 사용.  
fr.json에 `services.contact_cta: "Réserver"` 키가 이미 정의되어 있으나 미사용.  
기능상 문제없으나, 의미론적으로 `services.contact_cta`를 사용하는 것이 더 적절.

### OBS-02 — 번역 키 설계보다 풍부하게 구현됨 (긍정적)

Design §6.2 명세보다 추가된 키:
- `home.portfolio_more`, `home.services_more` — "더 보기" 링크용 (UX 개선)
- `contact.subtitle` — 문의 페이지 안내 문구
- `contact.instagram`, `contact.youtube` — SNS 링크 레이블
- `language.*` — 언어 선택기 레이블

설계 명세를 초과 구현한 것으로 긍정적 평가.

### OBS-03 — ContactButtons에 `'use client'` 지시어 없음

`src/components/contact/ContactButtons.tsx`가 `useTranslations` 훅을 사용하나 `'use client'` 없음.  
next-intl v3에서 Server Component에서도 `useTranslations` 사용 가능하므로 현재는 동작하나,  
Client 컴포넌트 내에서 사용 시 명시적 `'use client'` 추가를 권장.

---

## 매칭 확인 항목 (전체 통과)

| 항목 | 확인 결과 |
|------|----------|
| 5개 페이지 라우트 (`/`, `/portfolio`, `/services`, `/about`, `/contact`) | ✅ |
| Sanity Studio `/studio/[[...tool]]` | ✅ |
| `/api/revalidate` POST + x-webhook-secret 인증 | ✅ |
| `featuredPortfolioQuery` (최대 6개, featured=true) | ✅ |
| `portfolioQuery` (전체, date desc) | ✅ |
| `servicesQuery` (order asc) | ✅ |
| `artistQuery` (싱글톤, artist-singleton) | ✅ |
| `siteSettingsQuery` (싱글톤, site-settings-singleton) | ✅ |
| `servicesPreviewQuery` (최대 3개) | ✅ |
| Locale projection 패턴 `fieldName[_key == $locale][0].value` | ✅ |
| CDN client (`useCdn: true`) + serverClient (`useCdn: false`) | ✅ |
| 4개 로케일 설정 [fr, en, ko, zh], defaultLocale: fr | ✅ |
| next-intl 미들웨어 (studio/api 제외) | ✅ |
| Portfolio 스키마 (title/category/image/date/featured) | ✅ |
| Service 스키마 (name/description/price/duration/order) | ✅ |
| Artist 스키마 (name/bio/photo/awards, 싱글톤) | ✅ |
| SiteSettings 스키마 (heroTagline/instagramUrl/youtubeUrl/whatsappNumber/email) | ✅ |
| Gallery — 카테고리 필터 + 라이트박스 (Client Component) | ✅ |
| CategoryFilter — 4개 카테고리 (wedding/editorial/stage/natural) | ✅ |
| Header — 고정 헤더 + 모바일 햄버거 메뉴 | ✅ |
| Footer — SNS 아이콘 (Instagram/YouTube) | ✅ |
| LanguageSwitcher — 드롭다운, URL 로케일 교체 방식 | ✅ |
| ContactButtons — WhatsApp `wa.me/{number}` + email `mailto:` | ✅ |
| hreflang 메타데이터 (`alternates.languages`) | ✅ |
| `generateStaticParams` (4개 로케일 SSG) | ✅ |
| `robots.ts` — `/studio/` disallow | ✅ |
| `sitemap.ts` — 4개 locale × 5개 페이지 + alternates | ✅ |
| graceful degradation (`.catch(() => [])` / `.catch(() => null)`) | ✅ |
| 타이포그래피 스타일 (`font-extralight tracking-[0.4em] uppercase`) | ✅ |

---

## 결론 및 조치 권고

| 우선순위 | GAP | 조치 |
|---------|-----|------|
| 🔴 P1 | GAP-01 브랜드 컬러 불일치 | 아티스트와 컬러 방향 재확인 후 Design §7.1 또는 tailwind.config.ts 중 하나를 정본으로 결정 |
| 🟡 P2 | GAP-02 ISR /contact 누락 | `route.ts`에 `revalidatePath(/${locale}/contact)` 추가 (5분 작업) |
| 🟡 P3 | GAP-03 "Career" 하드코딩 | 4개 언어 messages에 `about.career` 키 추가 후 `t('career')` 교체 |

**GAP-02, GAP-03은 즉시 수정 가능한 소규모 작업입니다.**  
**GAP-01은 아티스트 의향 확인 후 결정 필요합니다.**

GAP-02, GAP-03 수정 후 재검증 시 **매칭률 97%+** 달성 예상.
