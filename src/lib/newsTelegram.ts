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

export function yangilikMaqolaUrl(websiteValue: string | undefined, slug: string) {
  const website = safeUrl(websiteValue, 'https://urosfera.uz')!.replace(/\/$/, '')
  return `${website}/yangiliklar/${encodeURIComponent(slug)}`
}

function qisqartir(value: string | null, max: number) {
  const clean = (value ?? '').replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`
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
    const detail = json.description ?? raw.replace(/[\r\n\t]+/g, ' ').trim().slice(0, 500) ?? `Telegram ${method} xatosi`
    throw new Error(`Telegram HTTP ${response.status} (${method}): ${detail || 'noma’lum xato'}`)
  }
  return json.result
}

export function telegramPostFallback(news: NewsRow) {
  if (news.telegram_post_uz?.trim()) return news.telegram_post_uz.trim()
  const title = (news.title_uz ?? news.original_title).trim()
  const summary = (news.summary_uz ?? '').trim()
  const content = qisqartir(news.content_uz, 950)
  return [title, summary, content && content !== summary ? content : ''].filter(Boolean).join('\n\n')
}

export async function telegramKanalgaYangilik(news: NewsRow): Promise<{ messageId: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const channelId = process.env.TELEGRAM_CHANNEL_ID
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN topilmadi (Vercel env scope'larini tekshiring)")
  if (!channelId) throw new Error("TELEGRAM_CHANNEL_ID topilmadi (Vercel env scope'larini tekshiring)")
  if (news.telegram_message_id) throw new Error('Yangilik Telegramga avval yuborilgan')

  const articleUrl = yangilikMaqolaUrl(process.env.WEBSITE_URL, news.slug)
  const sourceUrl = safeUrl(news.source_url, articleUrl)!
  const instagramUrl = safeUrl(process.env.INSTAGRAM_URL)
  const youtubeUrl = safeUrl(process.env.YOUTUBE_URL)
  const telegramUrl = safeUrl(process.env.TELEGRAM_SOCIAL_URL)
  const socialLinks = [
    telegramUrl && `🔵 <a href="${escapeHtml(telegramUrl)}">Telegram</a>`,
    instagramUrl && `🟣 <a href="${escapeHtml(instagramUrl)}">Instagram</a>`,
    youtubeUrl && `🔴 <a href="${escapeHtml(youtubeUrl)}">YouTube</a>`,
  ].filter((link): link is string => Boolean(link))
  const socialFooter = socialLinks.length ? `<b>Bizni kuzating:</b> ${socialLinks.join(' • ')}` : ''
  const text = [
    escapeHtml(telegramPostFallback(news)),
    `🔗 <b>Original manba:</b> <a href="${escapeHtml(sourceUrl)}">${escapeHtml(news.source_name)}</a>`,
    '— Urosfera | Urologiya bilim platformasi', socialFooter,
  ].filter(Boolean).join('\n\n')

  const reply_markup = { inline_keyboard: [
    [{ text: '📖 Urosferada batafsil o‘qish', url: articleUrl }],
  ] }

  if (!news.image_url) {
    const sent = await telegramRequest(token, 'sendMessage', { chat_id: channelId, text,
      parse_mode: 'HTML', link_preview_options: { is_disabled: true }, reply_markup })
    return { messageId: String(sent.message_id) }
  }

  if (text.length <= CAPTION_SAFE_LIMIT) {
    const sent = await telegramRequest(token, 'sendPhoto', { chat_id: channelId, photo: news.image_url,
      caption: text, parse_mode: 'HTML', reply_markup })
    return { messageId: String(sent.message_id) }
  }

  // Caption sig'masa rasm alohida, to'liq matn esa undan keyingi xabarda ketadi.
  await telegramRequest(token, 'sendPhoto', { chat_id: channelId, photo: news.image_url })
  const sent = await telegramRequest(token, 'sendMessage', { chat_id: channelId, text,
    parse_mode: 'HTML', link_preview_options: { is_disabled: true }, reply_markup })
  return { messageId: String(sent.message_id) }
}
