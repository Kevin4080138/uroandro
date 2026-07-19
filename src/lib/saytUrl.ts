// Saytning ommaviy manzili — canonical URL, sitemap va OpenGraph uchun.
// Domen o'zgarsa Vercel'da NEXT_PUBLIC_SITE_URL ni o'zgartirish kifoya.
export const SAYT_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.urosfera.uz').replace(/\/$/, '')
