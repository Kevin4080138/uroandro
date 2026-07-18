import { foydalanuvchigaPushYubor } from '@/lib/pushSend'
import { telegramYubor, SAYT_URL } from '@/lib/telegramSend'

// Foydalanuvchiga bitta xabarni ikkala kanal orqali yuboradi: web-push va Telegram.
// O'zbekistonda push ko'p qurilmalarda o'chiq bo'ladi — Telegram esa deyarli har doim
// yetib boradi. Shu sabab barcha xabarnoma nuqtalari shu funksiyani chaqiradi.
// Qaytaradi: nechta manzilga yetib borgani (push qurilmalari + Telegram bo'lsa 1).
export async function xabarYubor(
  userId: string,
  xabar: { title: string; body: string; url?: string }
): Promise<number> {
  const [push, telegram] = await Promise.all([
    foydalanuvchigaPushYubor(userId, xabar).catch(() => 0),
    telegramYubor(
      userId,
      `<b>${xabar.title}</b>\n\n${xabar.body}`,
      xabar.url
        ? {
            reply_markup: {
              inline_keyboard: [[{ text: '👀 Ochish', web_app: { url: `${SAYT_URL}${xabar.url}` } }]],
            },
          }
        : undefined
    ).catch(() => false),
  ])
  return push + (telegram ? 1 : 0)
}
