// Design Ref: §3.1 — sanity-plugin-i18n-fields로 문서 내 언어 탭 구현
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { schemaTypes } from './schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'makeup-artist-studio',
  title: 'Makeup Artist Studio',
  basePath: '/studio',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('root')
          .title('관리')
          .items([
            S.listItem()
              .id('portfolio')
              .title('📷 포트폴리오')
              .child(S.documentTypeList('portfolio')),
            S.listItem()
              .id('service')
              .title('💄 서비스 & 가격')
              .child(S.documentTypeList('service')),
            S.listItem()
              .id('artist')
              .title('👤 아티스트 정보')
              .child(
                S.document()
                  .schemaType('artist')
                  .documentId('artist-singleton')
              ),
            S.listItem()
              .id('siteSettings')
              .title('⚙️ 사이트 설정')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('site-settings-singleton')
              ),
          ]),
    }),
    // Plan SC: 4개 언어 탭으로 아티스트가 10분 내 포트폴리오 추가 가능
    internationalizedArray({
      languages: [
        { id: 'fr', title: '🇫🇷 Français' },
        { id: 'en', title: '🇬🇧 English' },
        { id: 'ko', title: '🇰🇷 한국어' },
        { id: 'zh', title: '🇨🇳 中文' },
      ],
      fieldTypes: ['string', 'text'],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
