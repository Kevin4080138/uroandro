import { createAdminClient } from '@/lib/supabaseAdmin'
import { uzbekContentYarat } from '@/lib/newsContent'
import { newsMinImportanceScore, newsMaxPerRun } from '@/lib/newsConfig'
import { avtoTasdiqQarori } from '@/lib/newsGate'
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
    lookback_days: Number(row.lookback_days ?? 30), may_reuse_official_images: Boolean(row.may_reuse_official_images), trust_tier: Number(row.trust_tier ?? 3) }
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
    const { data: tagRows } = await supabase.from('yangilik_teglari').select('slug,nom_uz')
    const allowedTags = (tagRows ?? []).map((row) => ({ slug: String(row.slug), nom_uz: String(row.nom_uz) }))
    const { data: drafts } = await supabase.from('yangiliklar').select('*').eq('content_origin', 'automation').eq('status', 'draft').order('updated_at').limit(25)
    const blank = ((drafts ?? []) as NewsRow[]).find((item) => !item.title_uz?.trim() || !item.summary_uz?.trim() || !item.content_uz?.trim() || !item.telegram_post_uz?.trim())
    if (testMode && blank) {
      const source = sources.find((item) => item.source_key === blank.source_key) ?? sources.find((item) => item.name === blank.source_name)
      if (!source || source.source_type !== 'pubmed') throw new Error(`Bo'sh draft uchun PubMed manbasi topilmadi: ${blank.source_name}`)
      const candidate = await pubmedNomzodiniUrlBoyicha({ ...source, source_type: 'pubmed' }, blank.source_url)
      if (!candidate) throw new Error('PubMed sarlavha va abstract qaytarmadi')
      const generated = await uzbekContentYarat({ title: candidate.title, summary: candidate.summary, url: candidate.url, sourceName: source.name }, allowedTags)
      if (!generated.content) { result.geminiFailures++; await logError(source, 'gemini', generated.error, blank.id) }
      else { const { error } = await supabase.from('yangiliklar').update({ ...generated.content, tags: generated.meta.tags, reading_level: generated.meta.readingLevel, updated_at: new Date().toISOString() }).eq('id', blank.id).eq('content_origin', 'automation'); if (error) throw error; result.draftsEnriched = 1; result.processedNewsId = blank.id }
      await finish('completed'); return result
    }
    if (!autoFetch && !testMode) { result.skipped = true; result.reason = 'NEWS_AUTO_FETCH=false'; await finish('completed', result.reason); return result }
    // Manbalar parallel o'qiladi — ketma-ket bo'lsa ko'p manba funksiya vaqtini oshiradi (504).
    // Bog'lamalar (concurrency) cheklangan, NCBI kabi manbalar bir vaqtda haddan ortiq so'rov olmasin.
    const CONCURRENCY = 6
    const all: Array<{ candidate: NormalizedNewsCandidate; source: SourceConfig }> = []
    const fetchedAll: Array<{ source: SourceConfig; fetched: Awaited<ReturnType<typeof fetchSourceSafely>> }> = []
    for (let i = 0; i < sources.length; i += CONCURRENCY) {
      const batch = sources.slice(i, i + CONCURRENCY)
      const settled = await Promise.all(batch.map(async (source) => {
        const fetched = await fetchSourceSafely(source), now = new Date().toISOString()
        await supabase.from('yangilik_manbalari').update(fetched.error ? { last_checked_at: now, last_error: fetched.error } : { last_checked_at: now, last_success_at: now, last_error: null }).eq('id', source.id)
        return { source, fetched }
      }))
      fetchedAll.push(...settled)
    }
    for (const { source, fetched } of fetchedAll) {
      result.checkedSources++
      if (fetched.error) { await logError(source, 'source', fetched.error); continue }
      result.candidatesFound += fetched.candidates.length; all.push(...fetched.candidates.map((candidate) => ({ candidate, source })))
    }
    const eligible: Array<{ candidate: NormalizedNewsCandidate; source: SourceConfig; score: number; reasons: string[] }> = []
    for (const item of all) {
      item.candidate.canonical_url = canonicalUrl(item.candidate.canonical_url)
      // Arzon filtrlar (tarmoqsiz) avval — DB dedup so'rovlari faqat mos va yuqori baholi nomzodlar uchun.
      if (!urosferaRelevant(item.candidate)) continue
      const ranked = importanceHisobla(item.candidate)
      if (ranked.score < newsMinImportanceScore()) continue
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
      eligible.push({ ...item, ...ranked })
    }
    result.eligibleCount = eligible.length; eligible.sort((a, b) => b.score - a.score || (Date.parse(b.candidate.published_at ?? '') || 0) - (Date.parse(a.candidate.published_at ?? '') || 0))
    if (!eligible.length) { result.reason = 'no eligible content'; result.skipped = true; await finish('completed', result.reason); return result }
    // Bir run'da eng yaxshi top-N maqola olinadi. Test rejimida faqat bittasi.
    const tanlanganlar = eligible.slice(0, testMode ? 1 : newsMaxPerRun())

    const maqolaniYarat = async (selected: typeof eligible[number], index: number) => {
      const hash = candidateHash(selected.candidate), audience = defaultAudience(selected.candidate.content_type)
      const category = selected.candidate.specialty === 'gynecology' ? 'ginekologiya' : selected.candidate.specialty === 'andrology' ? 'andrologiya' : 'urologiya'
      const { data: inserted, error: insertError } = await supabase.from('yangiliklar').insert({ slug: newsSlug(selected.candidate.title_original, hash), source_name: selected.candidate.source_name,
        source_url: selected.candidate.original_url, source_date: selected.candidate.published_at, original_title: selected.candidate.title_original, category,
        dedup_hash: hash, status: 'draft', content_origin: 'automation', source_key: selected.candidate.source_key, external_id: selected.candidate.external_id,
        canonical_url: selected.candidate.canonical_url, content_type: selected.candidate.content_type, specialty: selected.candidate.specialty, audience,
        importance_score: selected.score, importance_reasons: selected.reasons, telegram_auto_eligible: true, banner_approval_status: 'pending',
        trust_tier: selected.source.trust_tier ?? 3, source_published_at: selected.candidate.published_at, source_metadata: selected.candidate.metadata }).select('*').single()
      if (insertError || !inserted) { await logError(selected.source, 'insert', insertError?.message ?? 'Yangilik saqlanmadi'); return }
      result.draftsCreated++; if (!result.processedNewsId) result.processedNewsId = inserted.id
      await supabase.from('yangilik_source_references').upsert({ news_id: inserted.id, source_key: selected.candidate.source_key,
        external_id: selected.candidate.external_id, canonical_url: selected.candidate.canonical_url,
        metadata: selected.candidate.metadata }, { onConflict: 'news_id,canonical_url' })
      const generated = await uzbekContentYarat({ title: selected.candidate.title_original, summary: selected.candidate.summary_original, url: selected.candidate.original_url, sourceName: selected.candidate.source_name }, allowedTags)
      if (!generated.content) { result.geminiFailures++; await logError(selected.source, 'gemini', generated.error, inserted.id); return }
      // Bosqichli avto-tasdiq: ishonch + manba darajasi + xavfsizlik chegarasidan oʻtsagina nashr.
      const qaror = avtoTasdiqQarori({ confidence: generated.meta.confidence, trustTier: selected.source.trust_tier ?? 3, safetyIssues: generated.meta.safetyIssues, autoSite, testMode })
      const status = qaror.publish ? 'published' : 'draft', now = new Date().toISOString()
      const { error: updateError } = await supabase.from('yangiliklar').update({ ...generated.content, status,
        tags: generated.meta.tags, reading_level: generated.meta.readingLevel,
        verification_status: status === 'published' ? 'tasdiqlangan' : 'kutilmoqda', auto_published: status === 'published',
        published_at: status === 'published' ? now : null, updated_at: now,
        source_metadata: { ...selected.candidate.metadata, gemini_confidence: generated.meta.confidence, safety_issues: generated.meta.safetyIssues, auto_decision: qaror } }).eq('id', inserted.id).eq('content_origin', 'automation')
      if (updateError) { await logError(selected.source, 'enrich', updateError.message, inserted.id); return }
      result.draftsEnriched++
      const image = await newsImageTopVaSaqlash({ newsId: inserted.id, title: selected.candidate.title_original, category,
        sourceUrl: selected.candidate.original_url, mayReuseOfficialImages: selected.source.may_reuse_official_images })
      if (image) await supabase.from('yangiliklar').update(image).eq('id', inserted.id).eq('content_origin', 'automation')
      // Telegram faqat eng yuqori maqola uchun va faqat u haqiqatan nashr boʻlgan boʻlsa.
      if (index === 0 && !testMode && autoTelegram && status === 'published') {
        try { await yangilikTelegramgaYubor(inserted.id); result.telegramResult = 'sent'; result.publishedCount++ }
        catch (error) { await logError(selected.source, 'telegram', error instanceof Error ? error.message : 'Telegram xatosi', inserted.id); result.telegramResult = 'failed' }
      }
    }

    for (let i = 0; i < tanlanganlar.length; i++) await maqolaniYarat(tanlanganlar[i], i)
    if (result.telegramResult === 'not_sent') result.telegramResult = testMode ? 'disabled_in_test' : 'disabled_by_env'
    await finish('completed'); return result
  } catch (error) { const message = error instanceof Error ? error.message : 'Noma’lum xato'; result.errors.push(message); await finish('failed'); throw new Error(message) }
}
