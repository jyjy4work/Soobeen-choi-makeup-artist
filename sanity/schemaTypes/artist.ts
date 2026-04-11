// Design Ref: §3.4 — 아티스트 정보 스키마 (싱글톤)
// 다국어: name, bio, awards.title
import { defineField, defineType } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: '아티스트 정보',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '이름',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: '소개글',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'photo',
      title: '프로필 사진',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'awards',
      title: '경력 & 수상',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: '내용',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'year',
              title: '연도',
              type: 'number',
            }),
          ],
          preview: {
            select: { year: 'year' },
            prepare: ({ year }) => ({ title: String(year ?? '') }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { media: 'photo' },
    prepare({ media }) {
      return { title: '아티스트 프로필', media }
    },
  },
})
