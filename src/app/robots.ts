import type { MetadataRoute } from 'next'
import { SAYT_URL } from '@/lib/saytUrl'

// Shaxsiy ma'lumot bo'lgan yoki login talab qiladigan bo'limlar indekslanmasin —
// ular Google uchun ham foydasiz, bemor ma'lumotlari nuqtai nazaridan ham xavfli.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/student/', '/doctor/', '/patient/', '/auth/'],
      },
    ],
    sitemap: `${SAYT_URL}/sitemap.xml`,
    host: SAYT_URL,
  }
}
