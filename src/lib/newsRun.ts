import { createAdminClient } from '@/lib/supabaseAdmin'
import { uzbekContentYarat } from '@/lib/newsContent'
import { newsImageTopVaSaqlash } from '@/lib/newsImages'
import { manbaNomzodlari, newsSlug, pubmedNomzodiniUrlBoyicha, type FeedCandidate, type FeedSource } from '@/lib/newsRss'
import { yangilikBannerlariniSaqlash, yangilikniNashrQil } from '@/lib/newsPublish'
import type { NewsRow } from '@/lib/newsTypes'

export type NewsRunResult = {
  candidatesFound: number
  draftsCreated: number
  draftsEnriched: number
  duplicates: number
  geminiFailures: number
  publishedCount: number
  errors: string[]
}

export async function kunlikYangilikIshiniBajar(testMode: boolean): Promise<NewsRunResult & { skipped?: boolean; reason?: string }> {
  const supabase = createAdminClient()
  // Xavfsiz default: env berilmasa ham avtomatik nashr o'chirilgan.
  const autoPublish = (process.env.NEWS_AUTOPUBLISH ?? 'false') === 'true'
  const today = new Date().toISOString().slice(0, 10)
  const { data: run, error: runError } = await supabase.from('yangilik_ishlari').insert({
    status: 'running', run_key: testMode ? null : today, metadata: { mode: testMode ? 'admin_test' : 'cron', telegram_disabled: testMode },
  }).select('id').single()
  if (!testMode && runError?.code === '23505') return { candidatesFound: 0, draftsCreated: 0, draftsEnriched: 0, duplicates: 0, geminiFailures: 0, publishedCount: 0, errors: [], skipped: true, reason: 'Bugungi cron allaqachon bajarilgan' }
  if (runError || !run) throw new Error(runError?.message ?? 'Ish yozuvi yaratilmadi')

  let candidatesFound = 0, draftsCreated = 0, draftsEnriched = 0, duplicates = 0, geminiFailures = 0, publishedCount = 0
  const errors: string[] = []

  const natijaniYakunlash = async () => {
    const result = { candidatesFound, draftsCreated, draftsEnriched, duplicates, geminiFailures, publishedCount, errors }
    await supabase.from('yangilik_ishlari').update({ status: 'completed', candidates_found: candidatesFound,
      published_count: publishedCount, metadata: { mode: testMode ? 'admin_test' : 'cron', telegram_disabled: testMode,
        drafts_created: draftsCreated, drafts_enriched: draftsEnriched, duplicates, gemini_failures: geminiFailures, errors } }).eq('id', run.id)
    return result
  }

  const geminiKontent = async (candidate: { title: string; summary: string; url: string }, source: FeedSource, newsId: string) => {
    const result = await uzbekContentYarat({ ...candidate, sourceName: source.name })
    if (result.content) return result.content
    geminiFailures++
    const message = `${source.name}: ${result.error}`
    errors.push(message)
    await supabase.from('yangilik_xato_loglari').insert({
      run_id: run.id, source_id: source.id, news_id: newsId, stage: 'gemini', error_message: result.error,
      metadata: { source_url: candidate.url },
    })
    return null
  }
  try {
    // Cron faqat o'zi yaratgan, muddati tugagan bannerlarni arxivlaydi.
    if (!testMode) {
      await supabase.from('bannerlar').update({ arxiv: true, faol: false })
        .eq('content_origin', 'automation').eq('arxiv', false).lt('tugash', new Date().toISOString())
    }
    const { data: sources, error } = await supabase.from('yangilik_manbalari').select('*').eq('enabled', true).order('priority').limit(20)
    if (error) throw error

    if (testMode) {
      const sourceRows = (sources ?? []) as FeedSource[]
      const { data: draftRows, error: draftsError } = await supabase.from('yangiliklar').select('*')
        .eq('content_origin', 'automation').eq('status', 'draft').order('created_at').limit(100)
      if (draftsError) throw draftsError
      const emptyDraft = ((draftRows ?? []) as NewsRow[]).find((draft) => !(draft.title_uz?.trim()
        && draft.summary_uz?.trim() && draft.content_uz?.trim() && draft.student_importance?.trim()
        && draft.doctor_importance?.trim() && draft.patient_importance?.trim()))

      if (emptyDraft) {
        const source = sourceRows.find((item) => item.name === emptyDraft.source_name)
          ?? sourceRows.find((item) => item.category === emptyDraft.category && item.source_type === 'pubmed')
        if (!source || source.source_type !== 'pubmed') {
          throw new Error(`Bo'sh draft uchun faol PubMed manbasi topilmadi: ${emptyDraft.source_name}`)
        }
        const candidate = await pubmedNomzodiniUrlBoyicha(source, emptyDraft.source_url)
        if (!candidate) throw new Error(`PubMed draft uchun sarlavha va abstract qaytarmadi: ${emptyDraft.source_url}`)
        candidatesFound = 1
        const content = await geminiKontent(candidate, source, emptyDraft.id)
        if (content) {
          const { error: updateError } = await supabase.from('yangiliklar').update({ ...content, updated_at: new Date().toISOString() })
            .eq('id', emptyDraft.id).eq('content_origin', 'automation').eq('status', 'draft')
          if (updateError) errors.push(`${source.name}: draftni boyitish xatosi: ${updateError.message}`)
          else {
            draftsEnriched = 1
            await yangilikBannerlariniSaqlash({ ...emptyDraft, ...content }, { faol: false })
          }
        }
        return natijaniYakunlash()
      }

      let selected: { candidate: FeedCandidate; source: FeedSource } | null = null
      for (const source of sourceRows) {
        try {
          const candidates = await manbaNomzodlari(source)
          candidatesFound += candidates.length
          for (const candidate of candidates) {
            const { data: duplicate } = await supabase.from('yangiliklar').select('id').eq('content_origin', 'automation')
              .eq('dedup_hash', candidate.dedupHash).limit(1).maybeSingle()
            if (duplicate) { duplicates++; continue }
            selected = { candidate, source }
            break
          }
          if (selected) break
        } catch (sourceError) {
          const message = sourceError instanceof Error ? sourceError.message : source.name
          errors.push(message)
          await supabase.from('yangilik_xato_loglari').insert({ run_id: run.id, source_id: source.id,
            stage: 'source', error_message: message })
        }
      }
      if (!selected) return natijaniYakunlash()

      const { candidate, source } = selected
      const { data: inserted, error: insertError } = await supabase.from('yangiliklar').insert({
        slug: newsSlug(candidate.title, candidate.dedupHash), source_name: source.name, source_url: candidate.url,
        source_date: candidate.publishedAt, original_title: candidate.title, category: candidate.category,
        dedup_hash: candidate.dedupHash, status: 'draft', content_origin: 'automation',
      }).select('*').single()
      if (insertError || !inserted) throw new Error(insertError?.message ?? 'Test drafti yaratilmadi')
      draftsCreated = 1
      const content = await geminiKontent(candidate, source, inserted.id)
      if (content) {
        const { error: updateError } = await supabase.from('yangiliklar').update({ ...content, updated_at: new Date().toISOString() })
          .eq('id', inserted.id).eq('content_origin', 'automation').eq('status', 'draft')
        if (updateError) errors.push(`${source.name}: Gemini kontentini saqlash xatosi: ${updateError.message}`)
        else {
          draftsEnriched = 1
          await yangilikBannerlariniSaqlash({ ...inserted, ...content }, { faol: false })
        }
      }
      return natijaniYakunlash()
    }

    for (const source of (sources ?? []) as FeedSource[]) {
      try {
        const candidates = await manbaNomzodlari(source)
        candidatesFound += candidates.length
        for (const candidate of candidates.slice(0, 3)) {
          const { data: duplicate } = await supabase.from('yangiliklar').select('*').eq('content_origin', 'automation').eq('dedup_hash', candidate.dedupHash).limit(1).maybeSingle()
          if (duplicate) {
            const draft = duplicate as NewsRow
            const tayyor = Boolean(draft.title_uz?.trim() && draft.summary_uz?.trim() && draft.content_uz?.trim()
              && draft.student_importance?.trim() && draft.doctor_importance?.trim() && draft.patient_importance?.trim())
            if (draft.status !== 'draft' || tayyor) { duplicates++; continue }

            const content = await geminiKontent(candidate, source, draft.id)
            if (!content) continue
            const { error: updateError } = await supabase.from('yangiliklar').update({ ...content, updated_at: new Date().toISOString() })
              .eq('id', draft.id).eq('content_origin', 'automation').eq('status', 'draft')
            if (updateError) { errors.push(`${source.name}: draftni boyitish xatosi: ${updateError.message}`); continue }
            draftsEnriched++
            if (testMode) await yangilikBannerlariniSaqlash({ ...draft, ...content }, { faol: false })
            continue
          }

          const { data: inserted, error: insertError } = await supabase.from('yangiliklar').insert({
            slug: newsSlug(candidate.title, candidate.dedupHash), source_name: source.name, source_url: candidate.url,
            source_date: candidate.publishedAt, original_title: candidate.title, category: candidate.category,
            dedup_hash: candidate.dedupHash, status: 'draft', content_origin: 'automation',
          }).select('*').single()
          if (insertError || !inserted) {
            if (insertError?.code === '23505') duplicates++
            else errors.push(insertError?.message ?? candidate.url)
            continue
          }
          draftsCreated++
          let content = await geminiKontent(candidate, source, inserted.id)
          if (content) {
            const { error: contentError } = await supabase.from('yangiliklar').update({ ...content, updated_at: new Date().toISOString() })
              .eq('id', inserted.id).eq('content_origin', 'automation')
            if (contentError) {
              errors.push(`${source.name}: Gemini kontentini saqlash xatosi: ${contentError.message}`)
              content = null
            }
          }
          const image = await newsImageTopVaSaqlash({ newsId: inserted.id, title: candidate.title, category: candidate.category,
            sourceUrl: candidate.url, mayReuseOfficialImages: source.may_reuse_official_images })
          if (image) await supabase.from('yangiliklar').update(image).eq('id', inserted.id)

          // Admin testi DB'da ko'riladigan preview bannerlar yaratadi, lekin ular faol emas.
          // Shuning uchun draft maqola ochiq sahifaga chiqmaydi va Telegram chaqirilmaydi.
          if (testMode) {
            await yangilikBannerlariniSaqlash({ ...inserted, ...(content ?? {}), ...(image ?? {}) }, { faol: false })
          }

          // Test rejimi env qiymatidan qat'i nazar hech qachon publish/Telegram qilmaydi.
          if (!testMode && autoPublish && content) {
            await supabase.from('yangiliklar').update({ status: 'approved' }).eq('id', inserted.id)
            await yangilikniNashrQil(inserted.id)
            publishedCount++
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : source.name
        errors.push(message)
        await supabase.from('yangilik_xato_loglari').insert({ run_id: run.id, source_id: source.id, stage: 'source', error_message: message })
      }
    }
    return natijaniYakunlash()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Noma’lum xato'
    await supabase.from('yangilik_ishlari').update({ status: 'failed', candidates_found: candidatesFound,
      published_count: publishedCount, error_message: message, metadata: { mode: testMode ? 'admin_test' : 'cron',
        drafts_created: draftsCreated, drafts_enriched: draftsEnriched, duplicates, gemini_failures: geminiFailures, errors } }).eq('id', run.id)
    throw new Error(message)
  }
}
