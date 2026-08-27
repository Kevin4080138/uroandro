import { pubmedNomzodlar } from '../../newsRss'
import type { NewsSourceAdapter } from '../types'

export const pubmedAdapter: NewsSourceAdapter = {
  key: 'pubmed',
  async fetch(config) {
    const rows = await pubmedNomzodlar({ ...config, source_type: 'pubmed' })
    return rows.map((row) => ({
      source_key: config.source_key, source_name: config.name, source_type: 'api',
      external_id: new URL(row.url).pathname.split('/').find((part) => /^\d+$/.test(part)) ?? null,
      original_url: row.url, canonical_url: row.url, title_original: row.title,
      summary_original: row.summary, authors: row.authors ?? [], published_at: row.publishedAt,
      source_updated_at: null, image_url: null,
      specialty: row.category === 'urologiya' ? 'urology' : row.category === 'andrologiya' ? 'andrology' : 'gynecology',
      content_type: 'research_summary', metadata: { provider: 'NCBI E-utilities', pmid: row.url.split('/')[3], doi: row.doi },
    }))
  },
}
