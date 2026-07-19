import { createAdminClient } from '@/lib/supabaseAdmin'

// Urosfera boti orqali xabar yuborish. chat_id profiles.telegram_chat_id da saqlanadi
// (bot bilan telefon tasdiqlangan foydalanuvchilarda mavjud bo'ladi).

const TOKEN = process.env.TELEGRAM_BOT_TOKEN

// Vercel'dagi Production domeni (www bilan). Domen o'zgarsa — Vercel'da
// NEXT_PUBLIC_SITE_URL o'zgaruvchisini qo'shish kifoya, kodni tahrirlash shart emas.
export const SAYT_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.urosfera.uz').replace(/\/$/, '')

type Tugma = { matn: string; yol: string } // yol — sayt ichidagi yo'l: '/student/darslar'

// Sayt sahifasini Telegram ichida (Mini App) ochadigan tugma qatori tayyorlaydi.
export function miniAppTugmalari(tugmalar: Tugma[], qatorda = 1) {
  const hammasi = tugmalar.map((t) => ({
    text: t.matn,
    web_app: { url: `${SAYT_URL}${t.yol}` },
  }))
  const qatorlar: (typeof hammasi)[] = []
  for (let i = 0; i < hammasi.length; i += qatorda) {
    qatorlar.push(hammasi.slice(i, i + qatorda))
  }
  return { inline_keyboard: qatorlar }
}

// Bitta chatga xabar yuborish. Xato bo'lsa false qaytaradi (chaqiruvchi buzilmaydi).
export async function telegramChatgaYubor(
  chatId: string | number,
  matn: string,
  extra?: Record<string, unknown>
): Promise<boolean> {
  if (!TOKEN) return false
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: matn,
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
        ...extra,
      }),
    })
    const json = await res.json()
    if (!json.ok) {
      // 403 = foydalanuvchi botni bloklagan → bog'lanishni tozalaymiz
      if (json.error_code === 403) {
        const supabase = createAdminClient()
        await supabase.from('profiles').update({ telegram_chat_id: null }).eq('telegram_chat_id', String(chatId))
      }
      return false
    }
    return true
  } catch {
    return false
  }
}

// Foydalanuvchi ID (profiles.id) bo'yicha yuborish — bog'lanmagan bo'lsa jimgina false.
export async function telegramYubor(
  userId: string,
  matn: string,
  extra?: Record<string, unknown>
): Promise<boolean> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('profiles')
    .select('telegram_chat_id')
    .eq('id', userId)
    .maybeSingle()
  const chatId = data?.telegram_chat_id
  if (!chatId) return false
  return telegramChatgaYubor(chatId, matn, extra)
}

// Bir nechta foydalanuvchiga (rol bo'yicha ham) — nechtasiga yetgani qaytariladi.
export async function telegramKoplabYubor(
  userIdlar: string[],
  matn: string,
  extra?: Record<string, unknown>
): Promise<number> {
  if (userIdlar.length === 0) return 0
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('profiles')
    .select('telegram_chat_id')
    .in('id', userIdlar)
    .not('telegram_chat_id', 'is', null)

  let yuborildi = 0
  for (const r of data ?? []) {
    if (await telegramChatgaYubor(r.telegram_chat_id as string, matn, extra)) yuborildi++
  }
  return yuborildi
}

// Telefon raqami bo'yicha profilga chat_id ni bog'lash (OTP oqimida chaqiriladi).
export async function chatIdniProfilgaBogla(telefon: string, chatId: string | number) {
  const supabase = createAdminClient()
  await supabase
    .from('profiles')
    .update({ telegram_chat_id: String(chatId) })
    .eq('telefon', telefon)
}
