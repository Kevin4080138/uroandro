import type { NewsSourceAdapter } from '../types'
export const nichdAdapter: NewsSourceAdapter = { key: 'nichd-news', async fetch() {
  throw new Error('NICHD: tekshirilgan RSS/API topilmadi; public HTML parser yoqilmagan')
} }
