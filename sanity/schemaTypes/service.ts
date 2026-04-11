// Design Ref: §3.3 — 서비스 스키마
// 다국어: name, description
// 공통: price (€), duration, order — Plan SC: 가격 수정 5분 내
import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: '서비스',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '서비스명',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '서비스 설명',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'price',
      title: '가격 (€)',
      description: '유로(€) 기준 가격 — 모든 언어에 동일하게 표시됩니다',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'duration',
      title: '소요 시간',
      description: '예: 2h, 3-4h',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: '표시 순서',
      description: '숫자가 낮을수록 먼저 표시됩니다',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [
    { title: '표시 순서', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: {
      price: 'price',
      duration: 'duration',
    },
    prepare({ price, duration }) {
      return {
        title: `€${price ?? '?'}`,
        subtitle: duration ?? '',
      }
    },
  },
})
