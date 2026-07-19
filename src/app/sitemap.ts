import type { MetadataRoute } from 'next'
import { DARSLAR } from '@/lib/talim/darslar'
import { nazariyasiBorSluglar } from '@/lib/talim/nazariyaPreview'
import { SAYT_URL } from '@/lib/saytUrl'

export const revalidate = 3600

// Sitemap faqat OCHIQ sahifalarni sanaydi. Login ortidagi bo'limlar (student, doctor,
// patient, admin) bu yerga ham, robots.ts'ga ham kirmaydi.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tayyor = await nazariyasiBorSluglar()

  const asosiy: MetadataRoute.Sitemap = [
    { url: `${SAYT_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SAYT_URL}/darslar`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SAYT_URL}/shifokorlar`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SAYT_URL}/kasbiy`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SAYT_URL}/bemor`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Tarkibi tayyor darslargina — bo'sh sahifalar indeksatsiya sifatini tushiradi.
  const darslar: MetadataRoute.Sitemap = DARSLAR
    .filter((d) => d.nazariyaIframe || tayyor.has(d.slug))
    .map((d) => ({
      url: `${SAYT_URL}/darslar/${d.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  return [...asosiy, ...darslar]
}
