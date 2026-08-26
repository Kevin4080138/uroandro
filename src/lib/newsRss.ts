import { createHash } from 'node:crypto'
import type { NewsCategory } from '@/lib/newsTypes'

export type FeedSource = {
  id: string; name: string; feed_url: string; source_url: string; category: NewsCategory
  priority: number; may_reuse_official_images: boolean
  source_type?: 'rss' | 'pubmed'; search_query?: string | null; lookback_days?: number
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

const TOPIC = /\b(urolog|urology|urinary|bladder|kidney|renal|prostate|testicular|androlog|male infertility|erectile|gynecol|gynaecol|ovarian|uterine|cervix|endometri|menopaus|pelvic)\b|\bcervical\s+(?:cancer|carcinoma|screening)\b/i
const ANDROLOGY = /\b(androlog|male infertility|erectile|testicular|testis|penile|sperm|semen)\b/i
const GYNECOLOGY = /\b(gynecol|gynaecol|ovarian|uterine|cervix|endometri|menopaus|pelvic floor|vaginal|vulva)\b|\bcervical\s+(?:cancer|carcinoma|screening)\b/i
const NON_GYNECOLOGIC_CERVICAL = /\bcervical\s+(?:dystonia|spine|myelopathy|radiculopathy)\b/i

export function ginekologiyaMavzusimi(text: string) {
  return !NON_GYNECOLOGIC_CERVICAL.test(text) && GYNECOLOGY.test(text)
}

function categoryFor(text: string, fallback: NewsCategory): NewsCategory {
  if (ANDROLOGY.test(text)) return 'andrologiya'
  if (ginekologiyaMavzusimi(text)) return 'ginekologiya'
  return fallback
}

const NCBI_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const NCBI_HEADERS = { 'User-Agent': 'UrosferaNewsBot/1.0 (admin@urosfera.uz)' }

function pubmedTag(block: string, name: string) {
  const matches = [...block.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'gi'))]
  return matches.map((match) => decodeXml(match[1])).filter(Boolean).join(' ')
}

function pubmedDate(block: string) {
  const raw = pubmedTag(block, 'PubDate') || pubmedTag(block, 'ArticleDate')
  const year = raw.match(/\b(19|20)\d{2}\b/)?.[0]
  if (!year) return null
  const months: Record<string, string> = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
  const monthName = Object.keys(months).find((name) => raw.includes(name))
  const numeric = raw.match(/\b(?:0?[1-9]|1[0-2])\b/)?.[0]
  const month = monthName ? months[monthName] : numeric?.padStart(2, '0') ?? '01'
  const date = new Date(`${year}-${month}-01T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function pubmedMaqolalarniOqish(xml: string, source: FeedSource): FeedCandidate[] {
  const articles = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/gi) ?? []
  return articles.map((article) => {
    const pmid = pubmedTag(article, 'PMID').split(' ')[0]
    const title = pubmedTag(article, 'ArticleTitle')
    const summary = pubmedTag(article, 'AbstractText')
    const url = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
    return { title, url, summary, publishedAt: pubmedDate(article), source, category: source.category,
      dedupHash: createHash('sha256').update(`pubmed:${pmid}`).digest('hex') }
  }).filter((item) => /^\d+$/.test(item.url.split('/')[3]) && item.title && item.summary
    && !(source.category === 'ginekologiya' && NON_GYNECOLOGIC_CERVICAL.test(`${item.title} ${item.summary}`)))
}

export async function pubmedNomzodiniUrlBoyicha(source: FeedSource, url: string): Promise<FeedCandidate | null> {
  const pmid = new URL(url).pathname.split('/').find((part) => /^\d+$/.test(part))
  if (!pmid) throw new Error(`${source.name}: draft manzilida PubMed ID topilmadi`)
  const params = new URLSearchParams({
    db: 'pubmed', id: pmid, rettype: 'abstract', retmode: 'xml',
    tool: 'UrosferaNewsBot', email: 'admin@urosfera.uz',
  })
  const response = await fetch(`${NCBI_BASE}/efetch.fcgi?${params}`, {
    headers: NCBI_HEADERS, signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`${source.name}: EFetch HTTP ${response.status}`)
  return pubmedMaqolalarniOqish(await response.text(), source)[0] ?? null
}

export async function pubmedNomzodlar(source: FeedSource): Promise<FeedCandidate[]> {
  if (!source.search_query) throw new Error(`${source.name}: PubMed qidiruv so'rovi yo'q`)
  const params = new URLSearchParams({
    db: 'pubmed', term: source.search_query, reldate: String(source.lookback_days ?? 30), datetype: 'edat',
    retmax: '10', sort: 'pub_date', retmode: 'json', tool: 'UrosferaNewsBot', email: 'admin@urosfera.uz',
  })
  const search = await fetch(`${NCBI_BASE}/esearch.fcgi?${params}`, { headers: NCBI_HEADERS, signal: AbortSignal.timeout(15_000) })
  if (!search.ok) throw new Error(`${source.name}: ESearch HTTP ${search.status}`)
  const json = await search.json() as { esearchresult?: { idlist?: string[] } }
  const ids = json.esearchresult?.idlist ?? []
  if (!ids.length) return []

  // NCBI API kalitisiz bir IP uchun sekundiga 3 so'rov limitidan oshmaymiz.
  await new Promise((resolve) => setTimeout(resolve, 400))
  const fetchParams = new URLSearchParams({
    db: 'pubmed', id: ids.join(','), rettype: 'abstract', retmode: 'xml',
    tool: 'UrosferaNewsBot', email: 'admin@urosfera.uz',
  })
  const details = await fetch(`${NCBI_BASE}/efetch.fcgi?${fetchParams}`, { headers: NCBI_HEADERS, signal: AbortSignal.timeout(20_000) })
  if (!details.ok) throw new Error(`${source.name}: EFetch HTTP ${details.status}`)
  return pubmedMaqolalarniOqish(await details.text(), source)
}

export function manbaNomzodlari(source: FeedSource) {
  return source.source_type === 'pubmed' ? pubmedNomzodlar(source) : rssNomzodlar(source)
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
    && !(item.category === 'ginekologiya' && NON_GYNECOLOGIC_CERVICAL.test(`${item.title} ${item.summary}`))
    && (!item.publishedAt || new Date(item.publishedAt).getTime() >= cutoff))
}

export function newsSlug(title: string, hash: string) {
  const base = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'tibbiy-yangilik'
  return `${base}-${hash.slice(0, 8)}`
}
