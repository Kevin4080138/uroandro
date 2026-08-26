import { createAdminClient } from '@/lib/supabaseAdmin'
import sharp from 'sharp'

type ImageResult = { image_url: string; image_source_url: string; image_credit: string }
type ImageCandidate = { downloadUrl: string; sourceUrl: string; credit: string }

function htmlMeta(html: string, property: string) {
  const tags = html.match(/<meta\s+[^>]*>/gi) ?? []
  for (const tag of tags) {
    const prop = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1]
    const content = tag.match(/content=["']([^"']+)["']/i)?.[1]
    if (prop?.toLowerCase() === property.toLowerCase() && content) return content.replace(/&amp;/g, '&')
  }
  return null
}

async function officialImage(pageUrl: string): Promise<ImageCandidate | null> {
  try {
    const res = await fetch(pageUrl, { signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': 'UrosferaNewsBot/1.0' } })
    if (!res.ok) return null
    const url = htmlMeta(await res.text(), 'og:image')
    if (!url) return null
    return { downloadUrl: new URL(url, pageUrl).toString(), sourceUrl: pageUrl, credit: 'Rasm: original rasmiy manba' }
  } catch { return null }
}

async function pexelsImage(query: string): Promise<ImageCandidate | null> {
  const key = process.env.PEXELS_API_KEY
  if (!key) return null
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: { Authorization: key }, signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const photo = (await res.json() as { photos?: Array<{ url: string; photographer: string; src: { large2x?: string; large: string } }> }).photos?.[0]
    return photo ? { downloadUrl: photo.src.large2x ?? photo.src.large, sourceUrl: photo.url, credit: `Photo: ${photo.photographer} / Pexels` } : null
  } catch { return null }
}

async function unsplashImage(query: string): Promise<ImageCandidate | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) return null
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: { Authorization: `Client-ID ${key}` }, signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const photo = (await res.json() as { results?: Array<{ links: { html: string }; urls: { regular: string }; user: { name: string } }> }).results?.[0]
    return photo ? { downloadUrl: photo.urls.regular, sourceUrl: photo.links.html, credit: `Photo: ${photo.user.name} / Unsplash` } : null
  } catch { return null }
}

export async function newsImageTopVaSaqlash(args: {
  newsId: string; title: string; category: string; sourceUrl: string; mayReuseOfficialImages: boolean
}): Promise<ImageResult | null> {
  const query = `${args.category} medical healthcare`
  const image = (args.mayReuseOfficialImages ? await officialImage(args.sourceUrl) : null)
    ?? await pexelsImage(query)
    ?? await unsplashImage(query)
  if (!image) return null

  try {
    const response = await fetch(image.downloadUrl, { signal: AbortSignal.timeout(15_000) })
    if (!response.ok) return null
    const contentType = response.headers.get('content-type') ?? 'image/jpeg'
    if (!contentType.startsWith('image/')) return null
    const bytes = await response.arrayBuffer()
    if (bytes.byteLength > 8 * 1024 * 1024) return null
    let quality = 78
    let optimized = await sharp(Buffer.from(bytes)).rotate().resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality }).toBuffer()
    while (optimized.byteLength > 150 * 1024 && quality > 42) {
      quality -= 8
      optimized = await sharp(Buffer.from(bytes)).rotate().resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality }).toBuffer()
    }
    const path = `yangiliklar/${args.newsId}.webp`
    const supabase = createAdminClient()
    const { error } = await supabase.storage.from('bannerlar').upload(path, optimized, { contentType: 'image/webp', upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('bannerlar').getPublicUrl(path)
    return { image_url: data.publicUrl, image_source_url: image.sourceUrl, image_credit: image.credit }
  } catch { return null }
}
