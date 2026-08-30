import type { NewsSourceAdapter, NormalizedNewsCandidate, SourceConfig, Specialty } from '../types'

// DOAJ (Directory of Open Access Journals) — ochiq litsenziyali jurnal maqolalari,
// koʻpincha PubMed'da yoʻq. WAF bot-UA'ni bloklagani uchun brauzer UA ishlatiladi
// (API ochiq va CC litsenziyali — bu qonuniy foydalanish).
const BASE = 'https://doaj.org/api/v3/search/articles/'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const TIMEOUT_MS = 15_000

function specialtyFor(category: SourceConfig['category']): Specialty {
  return category === 'andrologiya' ? 'andrology' : category === 'ginekologiya' ? 'gynecology' : 'urology'
}

type DoajArticle = {
  id?: string
  bibjson?: {
    title?: string; abstract?: string; year?: string; month?: string
    author?: { name?: string }[]
    identifier?: { type?: string; id?: string }[]
    link?: { type?: string; url?: string }[]
    journal?: { title?: string }
  }
}

export const doajAdapter: NewsSourceAdapter = {
  key: 'doaj',
  async fetch(config: SourceConfig): Promise<NormalizedNewsCandidate[]> {
    if (!config.search_query) throw new Error(`${config.name}: DOAJ qidiruv soʻrovi yoʻq`)
    const url = `${BASE}${encodeURIComponent(config.search_query)}?pageSize=25&sort=created_date:desc`
    const response = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`${config.name}: DOAJ HTTP ${response.status}`)
    const data = await response.json() as { results?: DoajArticle[] }
    const specialty = specialtyFor(config.category)

    return (data.results ?? []).flatMap((row) => {
      const b = row.bibjson ?? {}
      const title = (b.title ?? '').replace(/\s+/g, ' ').trim()
      const summary = (b.abstract ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      // Abstractsiz maqola tarjima uchun yaroqsiz — oʻtkazib yuboramiz.
      if (!title || summary.length < 80) return []
      const doi = b.identifier?.find((id) => id.type === 'doi')?.id?.trim() || null
      const fulltext = b.link?.find((link) => link.type === 'fulltext')?.url || (b.link?.[0]?.url ?? null)
      const doajPage = row.id ? `https://doaj.org/article/${row.id}` : null
      const canonical = doi ? `https://doi.org/${doi}` : fulltext ?? doajPage ?? ''
      if (!canonical) return []
      const year = b.year && /^\d{4}$/.test(b.year) ? b.year : null
      const month = b.month && /^\d{1,2}$/.test(b.month) ? b.month.padStart(2, '0') : '01'
      return [{
        source_key: config.source_key, source_name: config.name, source_type: 'api' as const,
        external_id: doi ? `doi:${doi}` : row.id ? `doaj:${row.id}` : null,
        original_url: fulltext ?? doajPage ?? canonical, canonical_url: canonical,
        title_original: title, summary_original: summary,
        authors: (b.author ?? []).map((a) => a.name ?? '').filter(Boolean).slice(0, 12),
        published_at: year ? new Date(`${year}-${month}-01T00:00:00.000Z`).toISOString() : null,
        source_updated_at: null, image_url: null, specialty, content_type: 'research_summary' as const,
        metadata: { provider: 'DOAJ', doi, journal: b.journal?.title ?? null, doaj_id: row.id ?? null },
      }]
    })
  },
}
