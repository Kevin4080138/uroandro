import { createAdminClient } from '@/lib/supabaseAdmin'
import { telegramKanalgaYangilik } from '@/lib/newsTelegram'
import type { NewsRow } from '@/lib/newsTypes'

export async function yangilikBannerlariniSaqlash(news: NewsRow, options?: { umumiyBanner?: boolean; faol?: boolean }) {
  const supabase = createAdminClient()
  const now = new Date()
  const end = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const roles = options?.umumiyBanner || news.importance === 'critical' ? ['hamma'] : ['student', 'doctor', 'patient']

  // Faqat ayni maqolaning o'z originidagi bannerlari boshqariladi.
  await supabase.from('bannerlar').delete().eq('yangilik_id', news.id).eq('content_origin', news.content_origin)
    .not('target_role', 'in', `(${roles.join(',')})`)
  for (const role of roles) {
    const description = role === 'student' ? news.student_importance : role === 'doctor' ? news.doctor_importance : role === 'patient' ? news.patient_importance : news.summary_uz
    const { error } = await supabase.from('bannerlar').upsert({
      yangilik_id: news.id, sarlavha: news.title_uz ?? news.original_title,
      tavsif: description ?? news.summary_uz, image_url: news.image_url,
      link_href: `/yangiliklar/${news.slug}`, type: 'yangilik', target_role: role,
      rang: '#0891b2', faol: options?.faol ?? true, arxiv: false,
      boshlanish: now.toISOString(), tugash: end.toISOString(),
      published_at: news.published_at ?? now.toISOString(), content_origin: news.content_origin,
      priority: news.content_origin === 'manual' ? 100 : 10, is_pinned: false,
    }, { onConflict: 'yangilik_id,target_role' })
    if (error) throw error
  }
}

export async function yangilikniNashrQil(newsId: string, options?: { resendTelegram?: boolean; umumiyBanner?: boolean }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('yangiliklar').select('*').eq('id', newsId).single()
  if (error || !data) throw new Error('Yangilik topilmadi')
  const news = data as NewsRow
  if (!news.title_uz || !news.summary_uz || !news.content_uz) throw new Error("O'zbekcha kontent to'liq emas")

  const now = new Date()
  await yangilikBannerlariniSaqlash(news, { umumiyBanner: options?.umumiyBanner, faol: true })

  await supabase.from('yangiliklar').update({ status: 'published', published_at: news.published_at ?? now.toISOString(), updated_at: now.toISOString() }).eq('id', news.id)

  if (options?.resendTelegram) {
    await supabase.from('yangiliklar').update({ telegram_message_id: null, telegram_status: 'pending', telegram_error: null }).eq('id', news.id)
    news.telegram_message_id = null
  }
  if (!news.telegram_message_id) {
    try {
      const sent = await telegramKanalgaYangilik(news)
      await supabase.from('yangiliklar').update(sent
        ? { telegram_message_id: sent.messageId, telegram_status: 'sent', telegram_error: null }
        : { telegram_status: 'skipped' }).eq('id', news.id)
    } catch (error) {
      await supabase.from('yangiliklar').update({ telegram_status: 'failed', telegram_error: error instanceof Error ? error.message : 'Telegram xatosi' }).eq('id', news.id)
    }
  }
  return { published: true }
}
