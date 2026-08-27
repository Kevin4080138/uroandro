import type { NewsSourceAdapter } from '../types'
export const acogAdapter: NewsSourceAdapter = { key: 'acog-news', async fetch() {
  throw new Error('ACOG: barqaror rasmiy RSS/API tasdiqlanmadi; adapter unavailable')
} }
