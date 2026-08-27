import type { NewsSourceAdapter } from '../types'
export const eauAdapter: NewsSourceAdapter = { key: 'eau-news', async fetch() {
  throw new Error('EAU: barqaror rasmiy RSS/API tasdiqlanmadi; adapter unavailable')
} }
