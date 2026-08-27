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

async function yangilikniOl(newsId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('yangiliklar').select('*').eq('id', newsId).single()
  if (error || !data) throw new Error('Yangilik topilmadi')
  const news = data as NewsRow
  if (!news.title_uz || !news.summary_uz || !news.content_uz) throw new Error("O'zbekcha kontent to'liq emas")
  return { supabase, news }
}

async function maqolaniPublicQil(news: NewsRow) {
  const supabase = createAdminClient()
  const now = new Date()
  if (news.status === 'published') return
  const { error } = await supabase.from('yangiliklar').update({
    status: 'published', published_at: news.published_at ?? now.toISOString(), updated_at: now.toISOString(),
  }).eq('id', news.id)
  if (error) throw new Error(`Maqolani nashr qilish xatosi: ${error.message}`)
  news.status = 'published'
  news.published_at = news.published_at ?? now.toISOString()
}

export async function yangilikBannergaChiqar(newsId: string, options?: { umumiyBanner?: boolean }) {
  const { supabase, news } = await yangilikniOl(newsId)
  await maqolaniPublicQil(news)
  await yangilikBannerlariniSaqlash(news, { umumiyBanner: options?.umumiyBanner, faol: true })
  await supabase.from('yangiliklar').update({ banner_approval_status: 'active', updated_at: new Date().toISOString() }).eq('id', news.id)
  return { published: true, bannerStatus: 'active' as const }
}

export async function yangilikTelegramgaYubor(newsId: string, options?: { resendTelegram?: boolean }) {
  const { supabase, news } = await yangilikniOl(newsId)
  await maqolaniPublicQil(news)

  if (news.telegram_message_id && !options?.resendTelegram) {
    return { published: true, telegramStatus: 'sent' as const, alreadySent: true }
  }
  if (options?.resendTelegram) {
    const { error: resetError } = await supabase.from('yangiliklar').update({
      telegram_message_id: null, telegram_status: 'pending', telegram_error: null, telegram_selected_at: null,
    }).eq('id', news.id)
    if (resetError) throw new Error(`Telegram holatini yangilash xatosi: ${resetError.message}`)
    news.telegram_message_id = null
  }

  const { data: claimed, error: claimError } = await supabase.from('yangiliklar').update({
    telegram_selected_at: new Date().toISOString(), telegram_status: 'pending', telegram_error: null,
  }).eq('id', news.id).is('telegram_selected_at', null).select('id').maybeSingle()
  if (claimError) throw new Error(`Telegram lock xatosi: ${claimError.message}`)
  if (!claimed) throw new Error('Telegram yuborish allaqachon boshqa jarayonda boshlandi')

  try {
    const sent = await telegramKanalgaYangilik(news)
    const { error: sentError } = await supabase.from('yangiliklar').update({
      telegram_message_id: sent.messageId, telegram_status: 'sent', telegram_error: null, telegram_sent_at: new Date().toISOString(),
    }).eq('id', news.id)
    if (sentError) throw new Error(`Telegram message_id saqlash xatosi: ${sentError.message}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Telegram xatosi'
    console.error(`[daily-news][telegram] news_id=${news.id} ${message}`)
    await supabase.from('yangiliklar').update({ telegram_status: 'failed', telegram_error: message, telegram_selected_at: null }).eq('id', news.id)
    throw new Error(message)
  }
  return { published: true, telegramStatus: 'sent' as const }
}

export async function yangilikBannerVaTelegram(newsId: string, options?: { umumiyBanner?: boolean; resendTelegram?: boolean }) {
  const banner = await yangilikBannergaChiqar(newsId, { umumiyBanner: options?.umumiyBanner })
  const telegram = await yangilikTelegramgaYubor(newsId, { resendTelegram: options?.resendTelegram })
  return { ...banner, ...telegram }
}

// Cronning mavjud avtomatik nashr oqimi uchun orqaga mos alias.
export function yangilikniNashrQil(newsId: string, options?: { resendTelegram?: boolean; umumiyBanner?: boolean }) {
  return yangilikBannerVaTelegram(newsId, options)
}
