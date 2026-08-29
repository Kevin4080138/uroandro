import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { newsSlug } from '@/lib/newsRss'
import type { NewsCategory, NewsRow } from '@/lib/newsTypes'

async function adminTekshir() {
  const client = await createServerSupabase()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return false
  const { data } = await client.from('profiles').select('role').eq('id', user.id).single()
  return data?.role === 'admin'
}

const CATEGORIES: NewsCategory[] = ['urologiya', 'andrologiya', 'ginekologiya']
const CONTENT_TYPES = ['news', 'research_summary', 'guideline_update', 'educational_article', 'clinical_review', 'event']
const IMPORTANCE = ['normal', 'high', 'critical']
const ROLES = ['student', 'doctor', 'patient']

// Qo'lda maqola yaratish. Avtomatik oqimdan farqli — admin to'g'ridan-to'g'ri kontent kiritadi.
export async function POST(req: Request) {
  if (!await adminTekshir()) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const body = await req.json() as Partial<NewsRow> & { source_url?: string }
  const title = (body.title_uz ?? '').trim()
  if (!title) return NextResponse.json({ error: 'Sarlavha kiritilishi shart' }, { status: 400 })

  const category: NewsCategory = CATEGORIES.includes(body.category as NewsCategory) ? body.category as NewsCategory : 'urologiya'
  const contentType = CONTENT_TYPES.includes(body.content_type as string) ? body.content_type as NewsRow['content_type'] : 'educational_article'
  const importance = IMPORTANCE.includes(body.importance as string) ? body.importance as NewsRow['importance'] : 'normal'
  const audience = Array.isArray(body.audience) ? body.audience.filter((role) => ROLES.includes(role)) : ['student', 'doctor', 'patient']
  const hash = randomUUID().replace(/-/g, '')
  const sourceUrl = (body.source_url ?? '').trim() || `manual://${hash}`

  const admin = createAdminClient()
  const now = new Date().toISOString()
  const { data, error } = await admin.from('yangiliklar').insert({
    slug: newsSlug(title, hash),
    source_name: (body.source_name as string)?.trim() || 'Urosfera',
    source_url: sourceUrl,
    original_title: (body.original_title as string)?.trim() || title,
    title_uz: title,
    summary_uz: (body.summary_uz ?? '').trim() || null,
    content_uz: (body.content_uz ?? '').trim() || null,
    telegram_post_uz: (body.telegram_post_uz ?? '').trim() || null,
    student_importance: (body.student_importance ?? '').trim() || null,
    doctor_importance: (body.doctor_importance ?? '').trim() || null,
    patient_importance: (body.patient_importance ?? '').trim() || null,
    image_url: (body.image_url as string)?.trim() || null,
    category, content_type: contentType, importance, audience,
    dedup_hash: hash, status: 'draft', content_origin: 'manual',
    banner_approval_status: 'not_created', telegram_status: 'pending',
    telegram_auto_eligible: false, created_at: now, updated_at: now,
  }).select('id').single()

  if (error) {
    console.error(`[daily-news][manual-create] ${error.message}`)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true, id: data.id })
}
