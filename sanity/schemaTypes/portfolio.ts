// Design Ref: §3.2 — 포트폴리오 스키마
// 다국어: title (internationalizedArrayString)
// 공통: category, image, date, featured
import { defineField, defineType } from 'sanity'

export const portfolio = defineType({
  name: 'portfolio',
  title: '포트폴리오',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '카테고리',
      type: 'string',
      options: {
        list: [
          { title: '웨딩 (Mariage)', value: 'wedding' },
          { title: '화보 (Éditorial)', value: 'editorial' },
          { title: '무대/공연 (Scène)', value: 'stage' },
          { title: '일상/내추럴 (Naturel)', value: 'natural' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: '사진',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: '작업 날짜',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'featured',
      title: '홈 화면에 표시',
      description: '체크하면 홈페이지 메인에 표시됩니다 (최대 6개)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: '표시 순서',
      description: '숫자가 작을수록 앞에 표시됩니다. (1, 2, 3 ...)',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: '표시 순서',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: '최신순',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      media: 'image',
      category: 'category',
      date: 'date',
    },
    prepare({ media, category, date }) {
      return {
        title: category ?? '미분류',
        subtitle: date ?? '',
        media,
      }
    },
  },
})
