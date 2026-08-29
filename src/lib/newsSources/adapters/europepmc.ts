import type { NewsSourceAdapter, NormalizedNewsCandidate, SourceConfig, Specialty } from '../types'

// Europe PMC REST API — ochiq, bot-doʻst JSON. PubMed'ni toʻldiradi (PMC + MED).
// Hujjat: https://europepmc.org/RestfulWebService
const BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search'
const TIMEOUT_MS = 15_000

function specialtyFor(category: SourceConfig['category']): Specialty {
  return category === 'andrologiya' ? 'andrology' : category === 'ginekologiya' ? 'gynecology' : 'urology'
}

function sanaOralig(lookbackDays: number) {
  const to = new Date()
  const from = new Date(to.getTime() - Math.max(1, lookbackDays) * 86400000)
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  return `[${iso(from)} TO ${iso(to)}]`
}

type EuropePmcResult = {
  id?: string; source?: string; pmid?: string; doi?: string; title?: string
  abstractText?: string; authorString?: string; firstPublicationDate?: string; language?: string
}

export const europepmcAdapter: NewsSourceAdapter = {
  key: 'europepmc',
  async fetch(config: SourceConfig): Promise<NormalizedNewsCandidate[]> {
    if (!config.search_query) throw new Error(`${config.name}: Europe PMC qidiruv soʻrovi yoʻq`)
    const query = `(${config.search_query}) AND (LANG:eng) AND (HAS_ABSTRACT:Y) AND (FIRST_PDATE:${sanaOralig(config.lookback_days ?? 30)})`
    const params = new URLSearchParams({ query, format: 'json', pageSize: '25', resultType: 'core', sort: 'P_PDATE_D desc' })

    const response = await fetch(`${BASE}?${params}`, {
      headers: { 'User-Agent': 'UrosferaNewsBot/1.0 (admin@urosfera.uz)', Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`${config.name}: Europe PMC HTTP ${response.status}`)
    const data = await response.json() as { resultList?: { result?: EuropePmcResult[] } }
    const results = data.resultList?.result ?? []
    const specialty = specialtyFor(config.category)

    return results.flatMap((r) => {
      const title = (r.title ?? '').replace(/\s+/g, ' ').trim()
      const summary = (r.abstractText ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      if (!title || !summary) return []
      const pmid = r.pmid?.trim() || null
      const doi = r.doi?.trim() || null
      // PMID boʻlsa canonical'ni PubMed manziliga tenglaymiz — PubMed bilan aynan dedup boʻladi.
      const canonical = pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
        : `https://europepmc.org/article/${r.source ?? 'MED'}/${r.id ?? ''}`
      const original = `https://europepmc.org/article/${r.source ?? 'MED'}/${r.id ?? ''}`
      return [{
        source_key: config.source_key, source_name: config.name, source_type: 'api' as const,
        external_id: pmid ? `pmid:${pmid}` : `${r.source ?? 'MED'}:${r.id ?? ''}`,
        original_url: original, canonical_url: canonical, title_original: title, summary_original: summary,
        authors: r.authorString ? r.authorString.split(',').map((a) => a.trim()).filter(Boolean).slice(0, 12) : [],
        published_at: r.firstPublicationDate ? new Date(`${r.firstPublicationDate}T00:00:00.000Z`).toISOString() : null,
        source_updated_at: null, image_url: null, specialty, content_type: 'research_summary' as const,
        metadata: { provider: 'Europe PMC', pmid, doi, epmc_source: r.source ?? null, epmc_id: r.id ?? null },
      }]
    })
  },
}
