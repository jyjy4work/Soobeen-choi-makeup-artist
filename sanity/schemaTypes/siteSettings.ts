// Design Ref: §3.5 — 사이트 설정 스키마 (싱글톤)
// 다국어: heroTagline
// 공통: SNS URL, WhatsApp 번호, 이메일 (최초 1회 설정)
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '사이트 설정',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTagline',
      title: '히어로 문구',
      description: '홈페이지 메인 화면에 표시되는 한 줄 소개',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      description: '예: https://www.instagram.com/yourname',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      description: '예: https://www.youtube.com/@yourname',
      type: 'url',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp 번호',
      description: '국가코드 포함, 숫자만 입력. 예: 33612345678 (프랑스 +33)',
      type: 'string',
      validation: (Rule) => Rule.regex(/^\d+$/, { name: 'digits only' }),
    }),
    defineField({
      name: 'email',
      title: '이메일 주소',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
  ],
  preview: {
    prepare() {
      return { title: '사이트 설정' }
    },
  },
})
