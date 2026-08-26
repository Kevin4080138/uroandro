import type { NewsRow } from '@/lib/newsTypes'

const CAPTION_SAFE_LIMIT = 950 // Telegram limiti 1024; HTML entity/taglari uchun zaxira.

class TelegramApiError extends Error {}

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

export function yangilikMaqolaUrl(websiteValue: string | undefined, slug: string) {
  const website = safeUrl(websiteValue, 'https://urosfera.uz')!.replace(/\/$/, '')
  return `${website}/yangiliklar/${encodeURIComponent(slug)}`
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

function mavzuEmojisi(category: NewsRow['category']) {
  if (category === 'andrologiya') return '🧬'
  if (category === 'ginekologiya') return '🩺'
  return '🔬'
}

function safeTelegramError(value: string) {
  const ids = [
    process.env.TELEGRAM_CUSTOM_EMOJI_ID,
    process.env.INSTAGRAM_CUSTOM_EMOJI_ID,
    process.env.YOUTUBE_CUSTOM_EMOJI_ID,
  ].filter((id): id is string => Boolean(id))
  return ids.reduce((message, id) => message.replaceAll(id, '[custom-emoji-id]'), value)
}

async function telegramRequest(token: string, method: string, body: Record<string, unknown>) {
  let response: Response
  try {
    response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    })
  } catch (error) {
    const detail = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')
      ? '20 soniyada javob kelmadi' : error instanceof Error ? error.message : 'tarmoq xatosi'
    throw new Error(`Telegram ${method} so'rovi bajarilmadi: ${detail.slice(0, 500)}`)
  }
  const raw = await response.text()
  let json: { ok?: boolean; result?: { message_id: number }; description?: string } = {}
  try { json = JSON.parse(raw) as typeof json } catch { /* Quyida xavfsiz HTTP xatosi qaytariladi. */ }
  if (!response.ok || !json.ok || !json.result) {
    const rawDetail = json.description ?? raw.replace(/[\r\n\t]+/g, ' ').trim().slice(0, 500) ?? `Telegram ${method} xatosi`
    const detail = safeTelegramError(rawDetail)
    throw new TelegramApiError(`Telegram HTTP ${response.status} (${method}): ${detail || 'noma’lum xato'}`)
  }
  return json.result
}

function customEmoji(id: string | undefined, fallback: string) {
  return id && /^\d+$/.test(id) ? `<tg-emoji emoji-id="${id}">${fallback}</tg-emoji>` : fallback
}

async function telegramRequestCustomFallback(
  token: string,
  method: string,
  body: Record<string, unknown>,
  textField: 'text' | 'caption',
  customText: string,
  fallbackText: string,
  customEmojisBor: boolean,
) {
  try {
    return await telegramRequest(token, method, { ...body, [textField]: customText })
  } catch (error) {
    if (!customEmojisBor || !(error instanceof TelegramApiError)) throw error
    console.warn(`[daily-news][telegram] ${method}: custom emoji rad etildi, oddiy emoji bilan qayta yuborilmoqda`)
    return telegramRequest(token, method, { ...body, [textField]: fallbackText })
  }
}

export async function telegramKanalgaYangilik(news: NewsRow): Promise<{ messageId: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const channelId = process.env.TELEGRAM_CHANNEL_ID
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN topilmadi (Vercel env scope'larini tekshiring)")
  if (!channelId) throw new Error("TELEGRAM_CHANNEL_ID topilmadi (Vercel env scope'larini tekshiring)")
  if (news.telegram_message_id) throw new Error('Yangilik Telegramga avval yuborilgan')

  const articleUrl = yangilikMaqolaUrl(process.env.WEBSITE_URL, news.slug)
  const sourceUrl = safeUrl(news.source_url, articleUrl)!
  const topicEmoji = mavzuEmojisi(news.category)
  const title = escapeHtml(news.title_uz ?? news.original_title)
  const summary = escapeHtml(summaryQatorlari(news.summary_uz))
  const student = escapeHtml(qisqartir(news.student_importance, 150))
  const doctor = escapeHtml(qisqartir(news.doctor_importance, 150))
  const patient = escapeHtml(qisqartir(news.patient_importance, 150))
  const importance = [student && `🎓 <b>Talaba:</b> ${student}`, doctor && `👨‍⚕️ <b>Shifokor:</b> ${doctor}`, patient && `🧑 <b>Bemor:</b> ${patient}`].filter(Boolean).join('\n')
  const instagramUrl = safeUrl(process.env.INSTAGRAM_URL)
  const youtubeUrl = safeUrl(process.env.YOUTUBE_URL)
  const telegramUrl = safeUrl(process.env.TELEGRAM_SOCIAL_URL)
  const customEmojiIds = {
    telegram: process.env.TELEGRAM_CUSTOM_EMOJI_ID,
    instagram: process.env.INSTAGRAM_CUSTOM_EMOJI_ID,
    youtube: process.env.YOUTUBE_CUSTOM_EMOJI_ID,
  }
  const customEmojisBor = Boolean(
    (telegramUrl && customEmojiIds.telegram && /^\d+$/.test(customEmojiIds.telegram))
    || (instagramUrl && customEmojiIds.instagram && /^\d+$/.test(customEmojiIds.instagram))
    || (youtubeUrl && customEmojiIds.youtube && /^\d+$/.test(customEmojiIds.youtube)),
  )
  const socialLinks = (custom: boolean) => [
    telegramUrl && `${custom ? customEmoji(customEmojiIds.telegram, '✈️') : '✈️'} <a href="${escapeHtml(telegramUrl)}">Telegram</a>`,
    instagramUrl && `${custom ? customEmoji(customEmojiIds.instagram, '📸') : '📸'} <a href="${escapeHtml(instagramUrl)}">Instagram</a>`,
    youtubeUrl && `${custom ? customEmoji(customEmojiIds.youtube, '▶️') : '▶️'} <a href="${escapeHtml(youtubeUrl)}">YouTube</a>`,
  ].filter((link): link is string => Boolean(link))
  const matnYarat = (custom: boolean) => {
    const links = socialLinks(custom)
    const socialFooter = links.length ? `📲 <b>Bizni kuzating:</b>\n${links.join(' //\n')}` : ''
    return [
    `${topicEmoji} <b>${title}</b>`, summary, importance,
    `🔗 <b>Original manba:</b> <a href="${escapeHtml(sourceUrl)}">${escapeHtml(news.source_name)}</a>`,
    '— Urosfera | Urologiya bilim platformasi', socialFooter,
    ].filter(Boolean).join('\n\n')
  }
  const customText = matnYarat(true)
  const fallbackText = matnYarat(false)

  const reply_markup = { inline_keyboard: [
    [{ text: '📖 Urosferada batafsil o‘qish', url: articleUrl }],
  ] }

  if (!news.image_url) {
    const sent = await telegramRequestCustomFallback(token, 'sendMessage', {
      chat_id: channelId, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, reply_markup,
    }, 'text', customText, fallbackText, customEmojisBor)
    return { messageId: String(sent.message_id) }
  }

  if (customText.length <= CAPTION_SAFE_LIMIT) {
    const sent = await telegramRequestCustomFallback(token, 'sendPhoto', {
      chat_id: channelId, photo: news.image_url, parse_mode: 'HTML', reply_markup,
    }, 'caption', customText, fallbackText, customEmojisBor)
    return { messageId: String(sent.message_id) }
  }

  // Caption sig'masa rasm alohida, to'liq matn esa undan keyingi xabarda ketadi.
  await telegramRequest(token, 'sendPhoto', { chat_id: channelId, photo: news.image_url })
  const sent = await telegramRequestCustomFallback(token, 'sendMessage', {
    chat_id: channelId, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, reply_markup,
  }, 'text', customText, fallbackText, customEmojisBor)
  return { messageId: String(sent.message_id) }
}
