import type { NewsRow } from '@/lib/newsTypes'

const CAPTION_SAFE_LIMIT = 950 // Telegram limiti 1024; HTML entity/taglari uchun zaxira.

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}
function safeUrl(value: string | undefined, fallback?: string) {
  if (!value) return fallback
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : fallback
  } catch { return fallback }
}

function qisqartir(value: string | null, max: number) {
  const clean = (value ?? '').replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`
}

function summaryQatorlari(value: string | null) {
  const clean = qisqartir(value, 520)
  if (!clean) return ''
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 4)
  return sentences.length > 1 ? sentences.join('\n') : clean
}

async function telegramRequest(token: string, method: string, body: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  const json = await response.json() as { ok: boolean; result?: { message_id: number }; description?: string }
  if (!json.ok || !json.result) throw new Error(json.description ?? `Telegram ${method} xatosi`)
  return json.result
}

export async function telegramKanalgaYangilik(news: NewsRow): Promise<{ messageId: string } | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const channelId = process.env.TELEGRAM_CHANNEL_ID
  if (!token || !channelId || news.telegram_message_id) return null

  const website = safeUrl(process.env.WEBSITE_URL, 'https://urosfera.uz')!.replace(/\/$/, '')
  const articleUrl = `${website}/yangiliklar/${encodeURIComponent(news.slug)}`
  const sourceUrl = safeUrl(news.source_url, articleUrl)!
  const title = escapeHtml(news.title_uz ?? news.original_title)
  const summary = escapeHtml(summaryQatorlari(news.summary_uz))
  const student = escapeHtml(qisqartir(news.student_importance, 150))
  const doctor = escapeHtml(qisqartir(news.doctor_importance, 150))
  const patient = escapeHtml(qisqartir(news.patient_importance, 150))
  const importance = [student && `🎓 <b>Talaba:</b> ${student}`, doctor && `👨‍⚕️ <b>Shifokor:</b> ${doctor}`, patient && `🧑 <b>Bemor:</b> ${patient}`].filter(Boolean).join('\n')
  const text = [
    `<b>${title}</b>`, summary, importance,
    `🔗 <b>Original manba:</b> <a href="${escapeHtml(sourceUrl)}">${escapeHtml(news.source_name)}</a>`,
    '— Urosfera | Urologiya bilim platformasi',
  ].filter(Boolean).join('\n\n')

  const socialButtons = [
    safeUrl(process.env.INSTAGRAM_URL) && { text: 'Instagram', url: safeUrl(process.env.INSTAGRAM_URL)! },
    safeUrl(process.env.YOUTUBE_URL) && { text: 'YouTube', url: safeUrl(process.env.YOUTUBE_URL)! },
    { text: 'Veb-sayt', url: website },
  ].filter((button): button is { text: string; url: string } => Boolean(button))
  const reply_markup = { inline_keyboard: [
    [{ text: '📖 Urosfera’da batafsil o‘qish', url: articleUrl }],
    socialButtons,
  ].filter(row => row.length > 0) }

  if (!news.image_url) {
    const sent = await telegramRequest(token, 'sendMessage', { chat_id: channelId, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, reply_markup })
    return { messageId: String(sent.message_id) }
  }

  if (text.length <= CAPTION_SAFE_LIMIT) {
    const sent = await telegramRequest(token, 'sendPhoto', { chat_id: channelId, photo: news.image_url, caption: text, parse_mode: 'HTML', reply_markup })
    return { messageId: String(sent.message_id) }
  }

  // Caption sig'masa rasm alohida, to'liq matn esa undan keyingi xabarda ketadi.
  await telegramRequest(token, 'sendPhoto', { chat_id: channelId, photo: news.image_url })
  const sent = await telegramRequest(token, 'sendMessage', { chat_id: channelId, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, reply_markup })
  return { messageId: String(sent.message_id) }
}
