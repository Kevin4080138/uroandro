import { createHash } from 'node:crypto'
import type { NewsCategory } from '@/lib/newsTypes'

export type FeedSource = {
  id: string; name: string; feed_url: string; source_url: string; category: NewsCategory
  priority: number; may_reuse_official_images: boolean
}
export type FeedCandidate = {
  title: string; url: string; summary: string; publishedAt: string | null; source: FeedSource
  category: NewsCategory; dedupHash: string
}

function decodeXml(value: string) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ').trim()
}
function tag(block: string, names: string[]) {
  for (const name of names) {
    const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))
    if (match) return decodeXml(match[1])
  }
  return ''
}
function link(block: string) {
  const atom = block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1]
  return atom ?? tag(block, ['link', 'guid'])
}

const TOPIC = /\b(urolog|urology|urinary|bladder|kidney|renal|prostate|testicular|androlog|male infertility|erectile|gynecol|gynaecol|ovarian|uterine|cervical|endometri|menopaus|pelvic)\b/i
const ANDROLOGY = /\b(androlog|male infertility|erectile|testicular|testis|penile|sperm|semen)\b/i
const GYNECOLOGY = /\b(gynecol|gynaecol|ovarian|uterine|cervical|endometri|menopaus|pelvic floor|vaginal|vulva)\b/i

function categoryFor(text: string, fallback: NewsCategory): NewsCategory {
  if (ANDROLOGY.test(text)) return 'andrologiya'
  if (GYNECOLOGY.test(text)) return 'ginekologiya'
  return fallback
}

export async function rssNomzodlar(source: FeedSource): Promise<FeedCandidate[]> {
  const response = await fetch(source.feed_url, {
    headers: { 'User-Agent': 'UrosferaNewsBot/1.0 (+https://urosfera.uz)' }, signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`${source.name}: HTTP ${response.status}`)
  const xml = await response.text()
  const blocks = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? xml.match(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/gi) ?? []
  const cutoff = Date.now() - 72 * 60 * 60 * 1000
  return blocks.slice(0, 30).map((block) => {
    const title = tag(block, ['title'])
    const url = link(block)
    const summary = tag(block, ['description', 'summary', 'content:encoded', 'content'])
    const rawDate = tag(block, ['pubDate', 'published', 'updated', 'dc:date'])
    const date = rawDate ? new Date(rawDate) : null
    return { title, url, summary, publishedAt: date && !Number.isNaN(date.getTime()) ? date.toISOString() : null, source,
      category: categoryFor(`${title} ${summary}`, source.category),
      dedupHash: createHash('sha256').update(url.trim().toLowerCase()).digest('hex') }
  }).filter((item) => item.title && /^https?:\/\//.test(item.url) && TOPIC.test(`${item.title} ${item.summary}`)
    && (!item.publishedAt || new Date(item.publishedAt).getTime() >= cutoff))
}

export function newsSlug(title: string, hash: string) {
  const base = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'tibbiy-yangilik'
  return `${base}-${hash.slice(0, 8)}`
}
