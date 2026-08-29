import type { NewsCategory } from '@/lib/newsTypes'

export type SourceType = 'api' | 'rss' | 'atom' | 'jsonld' | 'html' | 'unavailable'
export type Specialty = 'urology' | 'gynecology' | 'andrology' | 'urogynecology' | 'mixed'
export type ContentType = 'news' | 'research_summary' | 'guideline_update' | 'educational_article' | 'clinical_review' | 'event'
export type Audience = 'student' | 'doctor' | 'patient'

export type SourceConfig = {
  id: string; source_key: string; name: string; base_url: string | null; feed_url: string
  source_url: string; source_type: string; category: NewsCategory; specialties: Specialty[]
  priority: number; search_query?: string | null; lookback_days?: number
  may_reuse_official_images: boolean; trust_tier?: number
}
export type NormalizedNewsCandidate = {
  source_key: string; source_name: string; source_type: SourceType; external_id: string | null
  original_url: string; canonical_url: string; title_original: string; summary_original: string
  authors: string[]; published_at: string | null; source_updated_at: string | null; image_url: string | null
  specialty: Specialty; content_type: ContentType; metadata: Record<string, unknown>
}

export interface NewsSourceAdapter {
  key: string
  fetch(config: SourceConfig): Promise<NormalizedNewsCandidate[]>
}
