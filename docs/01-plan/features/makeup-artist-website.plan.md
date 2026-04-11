# Plan: Makeup Artist Portfolio Website
> Feature: makeup-artist-website  
> Phase: Plan  
> Created: 2026-04-11  
> Status: Completed (Retroactive Documentation)

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 파리에서 활동하는 한국인 메이크업 아티스트가 포트폴리오를 온라인으로 보여주고 글로벌 고객(프랑스/영어권/한국/중국)으로부터 문의를 받을 채널이 없었음 |
| **Solution** | Next.js 14 + Sanity CMS 기반 다국어(4개 언어) 포트폴리오 사이트 — 아티스트 본인이 직접 콘텐츠를 관리하고 WhatsApp/이메일로 문의를 받는 구조 |
| **UX Effect** | 언어 장벽 없이 글로벌 고객이 포트폴리오를 탐색하고, CTA 버튼 한 번으로 WhatsApp 문의까지 원활하게 연결 |
| **Core Value** | 고객 입장: 자국 언어로 서비스 확인 후 즉시 문의 가능 / 아티스트 입장: 코딩 없이 사진/가격/소개 업데이트 가능 |

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

## 1. Requirements

### 1.1 기능 요구사항

| ID | 요구사항 | 우선순위 | 상태 |
|----|----------|----------|------|
| FR-01 | 4개 언어(FR/EN/KO/ZH) 지원, URL 기반 라우팅 (`/{locale}/...`) | Must | ✅ 완료 |
| FR-02 | 포트폴리오 갤러리 — 카테고리 필터 (wedding/editorial/stage/natural) + 라이트박스 | Must | ✅ 완료 |
| FR-03 | 서비스 & 가격 목록 — Sanity에서 관리, 유로 가격 표시 | Must | ✅ 완료 |
| FR-04 | 아티스트 소개 — 사진, 바이오, 경력 타임라인 | Must | ✅ 완료 |
| FR-05 | WhatsApp 문의 버튼 + 이메일 버튼 (Sanity 설정에서 관리) | Must | ✅ 완료 |
| FR-06 | Sanity Studio 내장 (`/studio`) — 아티스트가 직접 콘텐츠 관리 | Must | ✅ 완료 |
| FR-07 | 홈페이지에 Featured 포트폴리오 최대 6개 미리보기 표시 | Should | ✅ 완료 |
| FR-08 | 홈페이지에 서비스 최대 3개 미리보기 표시 | Should | ✅ 완료 |
| FR-09 | ISR — Sanity 웹훅으로 콘텐츠 publish 시 자동 캐시 갱신 | Should | ✅ 완료 |
| FR-10 | SEO — 동적 sitemap, hreflang, 로케일별 메타데이터 | Should | ✅ 완료 |

### 1.2 비기능 요구사항

| ID | 요구사항 | 상태 |
|----|----------|------|
| NFR-01 | 모바일 반응형 (mobile-first, Tailwind CSS) | ✅ 완료 |
| NFR-02 | Vercel 배포, 자동 GitHub 연동 | ✅ 완료 |
| NFR-03 | .env.local에 시크릿 관리, .gitignore로 보호 | ✅ 완료 |
| NFR-04 | Sanity CDN 이미지 최적화 (next/image + urlFor) | ✅ 완료 |
| NFR-05 | Sanity 쿼리 실패 시 graceful degradation (catch → []) | ✅ 완료 |

---

## 2. Scope

### 포함
- Next.js 14 App Router 기반 웹사이트 (5개 페이지: 홈/포트폴리오/서비스/소개/문의)
- Sanity v3 Studio 내장 + 4개 스키마 (portfolio/service/artist/siteSettings)
- next-intl 다국어 (fr/en/ko/zh, 기본값 fr)
- Tailwind CSS 커스텀 브랜드 컬러 (베이지/브라운 팔레트)
- Vercel 배포 + GitHub 자동 푸시 훅

### 제외
- 예약 시스템 (직접 예약 — WhatsApp/이메일 문의로 대체)
- 결제 기능
- 사용자 계정/로그인
- 댓글/리뷰 기능

---

## 3. Success Criteria

| SC | 기준 | 측정 방법 |
|----|------|----------|
| SC-01 | 4개 언어 페이지 모두 빌드 오류 없이 렌더링 | `next build` 성공 + 각 locale URL 접속 확인 |
| SC-02 | Sanity Studio에서 콘텐츠 입력 후 사이트에 반영 | Studio → publish → 사이트 새로고침 확인 |
| SC-03 | 포트폴리오 이미지가 Sanity CDN에서 정상 로드 | 홈/포트폴리오 페이지 이미지 확인 |
| SC-04 | WhatsApp 버튼 클릭 시 올바른 번호로 연결 | `wa.me/{number}` 링크 확인 |
| SC-05 | Vercel 프로덕션 배포 정상 (`makeup-artist-one.vercel.app`) | 200 응답 확인 |
| SC-06 | `/robots.txt`, `/sitemap.xml` 정상 응답 | 직접 URL 접속 확인 |

---

## 4. Tech Stack

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14.2.3 | 프레임워크, App Router, ISR |
| React | ^18 | UI |
| next-intl | ^3.14.0 | 다국어 라우팅/번역 |
| Sanity | ^3.45.0 | CMS, Studio |
| next-sanity | ^9.0.0 | Sanity 클라이언트 |
| sanity-plugin-internationalized-array | ^2.0.0 | 다국어 필드 UI |
| @sanity/image-url | ^1.0.2 | 이미지 URL 빌더 |
| Tailwind CSS | ^3.4.1 | 스타일링 |
| TypeScript | ^5 | 타입 안전성 |
| Vercel | — | 배포 플랫폼 |

---

## 5. Risk & Mitigation

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Sanity 콘텐츠 미입력 | 빈 섹션 노출 | graceful degradation (empty state 메시지) |
| Next.js 14.2.3 보안 취약점 | 보안 | 추후 업그레이드 필요 (낮은 긴급도) |
| 웹훅 시크릿 미설정 | ISR 미작동 | Sanity webhook 설정 가이드 제공 |
| Sanity CORS 미설정 | Studio 접근 불가 | sanity.io/manage에서 도메인 추가 필요 |
