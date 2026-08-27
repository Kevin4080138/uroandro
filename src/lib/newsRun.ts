import { createAdminClient } from '@/lib/supabaseAdmin'
import { uzbekContentYarat } from '@/lib/newsContent'
import { newsMinImportanceScore } from '@/lib/newsConfig'
import { candidateHash, canonicalUrl, titleSimilarity } from '@/lib/newsDedup'
import { newsImageTopVaSaqlash } from '@/lib/newsImages'
import { defaultAudience, importanceHisobla } from '@/lib/newsRanking'
import { urosferaRelevant } from '@/lib/newsRelevance'
import { newsSlug, pubmedNomzodiniUrlBoyicha } from '@/lib/newsRss'
import { yangilikTelegramgaYubor } from '@/lib/newsPublish'
import { newsCronSlotKey } from '@/lib/newsSchedule'
import { fetchSourceSafely } from '@/lib/newsSources/registry'
import type { NormalizedNewsCandidate, SourceConfig } from '@/lib/newsSources/types'
import type { NewsRow } from '@/lib/newsTypes'

export type NewsRunResult = { candidatesFound: number; draftsCreated: number; draftsEnriched: number; duplicates: number; geminiFailures: number; publishedCount: number; processedNewsId: string | null; checkedSources: number; eligibleCount: number; telegramResult: string; errors: string[]; skipped?: boolean; reason?: string }
const boolEnv = (name: string, fallback: boolean) => process.env[name] == null ? fallback : process.env[name] === 'true'
function sourceConfig(row: Record<string, unknown>): SourceConfig {
  return { id: String(row.id), source_key: String(row.source_key), name: String(row.name), base_url: row.base_url ? String(row.base_url) : null,
    feed_url: String(row.feed_url), source_url: String(row.source_url), source_type: String(row.source_type), category: row.category as SourceConfig['category'],
    specialties: (row.specialties ?? []) as SourceConfig['specialties'], priority: Number(row.priority), search_query: row.search_query ? String(row.search_query) : null,
    lookback_days: Number(row.lookback_days ?? 30), may_reuse_official_images: Boolean(row.may_reuse_official_images) }
}

export async function kunlikYangilikIshiniBajar(testMode: boolean): Promise<NewsRunResult> {
  const supabase = createAdminClient(), legacyAuto = boolEnv('NEWS_AUTOPUBLISH', false)
  const autoFetch = boolEnv('NEWS_AUTO_FETCH', true), autoTelegram = boolEnv('NEWS_AUTO_TELEGRAM', legacyAuto), autoSite = boolEnv('NEWS_AUTO_SITE_PUBLISH', legacyAuto)
  const { data: run, error: runError } = await supabase.from('yangilik_ishlari').insert({ status: 'running', run_key: null,
    run_slot: testMode ? null : newsCronSlotKey(), metadata: { mode: testMode ? 'admin_test' : 'cron', auto_banner: false } }).select('id').single()
  const result: NewsRunResult = { candidatesFound: 0, draftsCreated: 0, draftsEnriched: 0, duplicates: 0, geminiFailures: 0,
    publishedCount: 0, processedNewsId: null, checkedSources: 0, eligibleCount: 0, telegramResult: 'not_sent', errors: [] }
  if (!testMode && runError?.code === '23505') return { ...result, skipped: true, reason: 'Bu cron sloti allaqachon bajarilgan' }
  if (runError || !run) throw new Error(runError?.message ?? 'Cron audit yozuvi yaratilmadi')
  const finish = async (status: 'completed' | 'failed', reason?: string) => {
    await supabase.from('yangilik_ishlari').update({ status, finished_at: new Date().toISOString(), checked_sources: result.checkedSources,
      found_count: result.candidatesFound, candidates_found: result.candidatesFound, duplicate_count: result.duplicates,
      eligible_count: result.eligibleCount, selected_article_id: result.processedNewsId, telegram_result: { status: result.telegramResult },
      skipped_reason: reason ?? null, error_summary: result.errors.join(' | ').slice(0, 4000) || null, published_count: result.publishedCount,
      metadata: { mode: testMode ? 'admin_test' : 'cron', auto_banner: false, drafts_created: result.draftsCreated,
        drafts_enriched: result.draftsEnriched, gemini_failures: result.geminiFailures } }).eq('id', run.id)
  }
  const logError = async (source: SourceConfig | null, stage: string, message: string, newsId?: string) => {
    result.errors.push(message); console.error(`[medical-content-hub][${stage}] source=${source?.source_key ?? 'none'} ${message}`)
    await supabase.from('yangilik_xato_loglari').insert({ run_id: run.id, source_id: source?.id ?? null, news_id: newsId ?? null, stage, error_message: message.slice(0, 2000) })
  }
  try {
    const { data: sourceRows, error: sourceError } = await supabase.from('yangilik_manbalari').select('*').eq('is_enabled', true).order('priority').limit(30)
    if (sourceError) throw sourceError
    const sources = (sourceRows ?? []).map((row) => sourceConfig(row as Record<string, unknown>))
    const { data: drafts } = await supabase.from('yangiliklar').select('*').eq('content_origin', 'automation').eq('status', 'draft').order('updated_at').limit(25)
    const blank = ((drafts ?? []) as NewsRow[]).find((item) => !item.title_uz?.trim() || !item.summary_uz?.trim() || !item.content_uz?.trim() || !item.telegram_post_uz?.trim())
    if (testMode && blank) {
      const source = sources.find((item) => item.source_key === blank.source_key) ?? sources.find((item) => item.name === blank.source_name)
      if (!source || source.source_type !== 'pubmed') throw new Error(`Bo'sh draft uchun PubMed manbasi topilmadi: ${blank.source_name}`)
      const candidate = await pubmedNomzodiniUrlBoyicha({ ...source, source_type: 'pubmed' }, blank.source_url)
      if (!candidate) throw new Error('PubMed sarlavha va abstract qaytarmadi')
      const generated = await uzbekContentYarat({ title: candidate.title, summary: candidate.summary, url: candidate.url, sourceName: source.name })
      if (!generated.content) { result.geminiFailures++; await logError(source, 'gemini', generated.error, blank.id) }
      else { const { error } = await supabase.from('yangiliklar').update({ ...generated.content, updated_at: new Date().toISOString() }).eq('id', blank.id).eq('content_origin', 'automation'); if (error) throw error; result.draftsEnriched = 1; result.processedNewsId = blank.id }
      await finish('completed'); return result
    }
    if (!autoFetch && !testMode) { result.skipped = true; result.reason = 'NEWS_AUTO_FETCH=false'; await finish('completed', result.reason); return result }
    const all: Array<{ candidate: NormalizedNewsCandidate; source: SourceConfig }> = []
    for (const source of sources) {
      result.checkedSources++
      const fetched = await fetchSourceSafely(source), now = new Date().toISOString()
      await supabase.from('yangilik_manbalari').update(fetched.error ? { last_checked_at: now, last_error: fetched.error } : { last_checked_at: now, last_success_at: now, last_error: null }).eq('id', source.id)
      if (fetched.error) { await logError(source, 'source', fetched.error); continue }
      result.candidatesFound += fetched.candidates.length; all.push(...fetched.candidates.map((candidate) => ({ candidate, source })))
    }
    const eligible: Array<{ candidate: NormalizedNewsCandidate; source: SourceConfig; score: number; reasons: string[] }> = []
    for (const item of all) {
      item.candidate.canonical_url = canonicalUrl(item.candidate.canonical_url)
      const hash = candidateHash(item.candidate)
      let exact: Record<string, unknown> | null = null
      if (item.candidate.external_id) {
        const { data } = await supabase.from('yangiliklar').select('*').eq('source_key', item.candidate.source_key)
          .eq('external_id', item.candidate.external_id).limit(1).maybeSingle()
        exact = data as Record<string, unknown> | null
      }
      if (!exact) { const { data } = await supabase.from('yangiliklar').select('*').eq('dedup_hash', hash).limit(1).maybeSingle(); exact = data as Record<string, unknown> | null }
      if (!exact) { const { data } = await supabase.from('yangiliklar').select('*').eq('canonical_url', item.candidate.canonical_url).limit(1).maybeSingle(); exact = data as Record<string, unknown> | null }
      let duplicate: { id: string; original_title: string; content_origin: 'manual' | 'automation' } | null = exact
        ? { id: String(exact.id), original_title: String(exact.original_title), content_origin: exact.content_origin as 'manual' | 'automation' } : null
      if (!duplicate) { const { data: recent } = await supabase.from('yangiliklar').select('id,original_title,content_origin').eq('content_origin', 'automation').gte('created_at', new Date(Date.now() - 14 * 86400000).toISOString()).limit(100); const similar = (recent ?? []).find((row) => titleSimilarity(row.original_title, item.candidate.title_original) >= .82); duplicate = similar ? { id: String(similar.id), original_title: String(similar.original_title), content_origin: similar.content_origin as 'manual' | 'automation' } : null }
      if (duplicate) { result.duplicates++; if (duplicate.content_origin === 'automation') await supabase.from('yangilik_source_references').upsert({ news_id: duplicate.id, source_key: item.candidate.source_key, external_id: item.candidate.external_id, canonical_url: item.candidate.canonical_url, metadata: item.candidate.metadata }, { onConflict: 'news_id,canonical_url' }); continue }
      const ranked = importanceHisobla(item.candidate)
      if (!urosferaRelevant(item.candidate)) continue
      if (ranked.score >= newsMinImportanceScore()) eligible.push({ ...item, ...ranked })
    }
    result.eligibleCount = eligible.length; eligible.sort((a, b) => b.score - a.score || (Date.parse(b.candidate.published_at ?? '') || 0) - (Date.parse(a.candidate.published_at ?? '') || 0))
    const selected = eligible[0]
    if (!selected) { result.reason = 'no eligible content'; result.skipped = true; await finish('completed', result.reason); return result }
    const hash = candidateHash(selected.candidate), audience = defaultAudience(selected.candidate.content_type)
    const { data: inserted, error: insertError } = await supabase.from('yangiliklar').insert({ slug: newsSlug(selected.candidate.title_original, hash), source_name: selected.candidate.source_name,
      source_url: selected.candidate.original_url, source_date: selected.candidate.published_at, original_title: selected.candidate.title_original,
      category: selected.candidate.specialty === 'gynecology' ? 'ginekologiya' : selected.candidate.specialty === 'andrology' ? 'andrologiya' : 'urologiya',
      dedup_hash: hash, status: 'draft', content_origin: 'automation', source_key: selected.candidate.source_key, external_id: selected.candidate.external_id,
      canonical_url: selected.candidate.canonical_url, content_type: selected.candidate.content_type, specialty: selected.candidate.specialty, audience,
      importance_score: selected.score, importance_reasons: selected.reasons, telegram_auto_eligible: true, banner_approval_status: 'pending',
      source_published_at: selected.candidate.published_at, source_metadata: selected.candidate.metadata }).select('*').single()
    if (insertError || !inserted) throw new Error(insertError?.message ?? 'Yangilik saqlanmadi')
    result.draftsCreated = 1; result.processedNewsId = inserted.id
    await supabase.from('yangilik_source_references').upsert({ news_id: inserted.id, source_key: selected.candidate.source_key,
      external_id: selected.candidate.external_id, canonical_url: selected.candidate.canonical_url,
      metadata: selected.candidate.metadata }, { onConflict: 'news_id,canonical_url' })
    const generated = await uzbekContentYarat({ title: selected.candidate.title_original, summary: selected.candidate.summary_original, url: selected.candidate.original_url, sourceName: selected.candidate.source_name })
    if (!generated.content) { result.geminiFailures++; await logError(selected.source, 'gemini', generated.error, inserted.id); await finish('completed'); return result }
    const status = !testMode && autoSite ? 'published' : 'draft', now = new Date().toISOString()
    const { error: updateError } = await supabase.from('yangiliklar').update({ ...generated.content, status, published_at: status === 'published' ? now : null, updated_at: now }).eq('id', inserted.id).eq('content_origin', 'automation')
    if (updateError) throw updateError
    result.draftsEnriched = 1
    const image = await newsImageTopVaSaqlash({ newsId: inserted.id, title: selected.candidate.title_original,
      category: selected.candidate.specialty === 'gynecology' ? 'ginekologiya' : selected.candidate.specialty === 'andrology' ? 'andrologiya' : 'urologiya',
      sourceUrl: selected.candidate.original_url, mayReuseOfficialImages: selected.source.may_reuse_official_images })
    if (image) await supabase.from('yangiliklar').update(image).eq('id', inserted.id).eq('content_origin', 'automation')
    if (!testMode && autoTelegram && autoSite) { try { await yangilikTelegramgaYubor(inserted.id); result.telegramResult = 'sent'; result.publishedCount = 1 } catch (error) { await logError(selected.source, 'telegram', error instanceof Error ? error.message : 'Telegram xatosi', inserted.id); result.telegramResult = 'failed' } }
    else result.telegramResult = testMode ? 'disabled_in_test' : 'disabled_by_env'
    await finish('completed'); return result
  } catch (error) { const message = error instanceof Error ? error.message : 'Noma’lum xato'; result.errors.push(message); await finish('failed'); throw new Error(message) }
}
