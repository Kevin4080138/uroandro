export type NewsCategory = 'urologiya' | 'andrologiya' | 'ginekologiya'
export type NewsStatus = 'draft' | 'approved' | 'published' | 'rejected' | 'failed'

export type NewsRow = {
  id: string
  slug: string
  source_name: string
  source_url: string
  source_date: string | null
  original_title: string
  title_uz: string | null
  summary_uz: string | null
  content_uz: string | null
  category: NewsCategory
  importance: 'normal' | 'high' | 'critical'
  student_importance: string | null
  doctor_importance: string | null
  patient_importance: string | null
  telegram_post_uz: string | null
  status: NewsStatus
  content_origin: 'manual' | 'automation'
  image_url: string | null
  image_source_url: string | null
  image_credit: string | null
  telegram_message_id: string | null
  telegram_status: 'pending' | 'sent' | 'failed' | 'skipped'
  telegram_error: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  source_key: string | null
  external_id: string | null
  canonical_url: string | null
  content_type: 'news' | 'research_summary' | 'guideline_update' | 'educational_article' | 'clinical_review' | 'event'
  specialty: 'urology' | 'gynecology' | 'andrology' | 'urogynecology' | 'mixed' | null
  audience: Array<'student' | 'doctor' | 'patient'>
  importance_score: number
  importance_reasons: string[]
  telegram_auto_eligible: boolean
  telegram_selected_at: string | null
  telegram_sent_at: string | null
  banner_approval_status: 'not_created' | 'pending' | 'active' | 'failed'
  source_published_at: string | null
  source_metadata: Record<string, unknown>
}
