import type { NewsSourceAdapter } from '../types'
export const auaAdapter: NewsSourceAdapter = { key: 'aua-news', async fetch() {
  throw new Error('AUA: foydalanish shartlari bot/AI qayta ishlashini cheklaydi; adapter unavailable')
} }
