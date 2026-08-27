import { rssNomzodlar } from '../../newsRss'
import type { NewsSourceAdapter } from '../types'

export const niddkAdapter: NewsSourceAdapter = {
  key: 'niddk-news',
  async fetch(config) {
    const rows = await rssNomzodlar({ ...config, source_type: 'rss' })
    return rows.map((row) => ({
      source_key: config.source_key, source_name: config.name, source_type: 'rss', external_id: row.url,
      original_url: row.url, canonical_url: row.url, title_original: row.title, summary_original: row.summary,
      authors: [], published_at: row.publishedAt, source_updated_at: null, image_url: null,
      specialty: row.category === 'andrologiya' ? 'andrology' : row.category === 'ginekologiya' ? 'gynecology' : 'urology',
      content_type: 'news', metadata: { official_feed: config.feed_url },
    }))
  },
}
