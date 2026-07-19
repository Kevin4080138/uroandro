import crypto from 'crypto'

// Telegram Mini App initData imzosini tekshirish.
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
// Soxta kirishning oldini oladi: imzo bot tokeni bilan yasalgan sirli kalitga mos kelishi shart.

export type TelegramUser = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

export function initDataTekshir(
  initData: string,
  botToken: string,
  maxYoshSekund = 86400 // 24 soat — eski initData qabul qilinmaydi
): { ok: true; user: TelegramUser } | { ok: false; sabab: string } {
  if (!initData) return { ok: false, sabab: "initData bo'sh" }

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return { ok: false, sabab: 'hash yo\'q' }
  params.delete('hash')

  // data_check_string: kalitlar alfavit tartibida, "key=value" \n bilan birlashtiriladi
  const dataCheckString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n')

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
  const calcHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  // Vaqt-barqaror taqqoslash (timing attack'dan himoya)
  const a = Buffer.from(calcHash, 'hex')
  const b = Buffer.from(hash, 'hex')
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, sabab: 'imzo mos kelmadi' }
  }

  // Eskirganlik tekshiruvi
  const authDate = Number(params.get('auth_date') || 0)
  if (authDate && Date.now() / 1000 - authDate > maxYoshSekund) {
    return { ok: false, sabab: 'initData eskirgan' }
  }

  try {
    const user = JSON.parse(params.get('user') || 'null') as TelegramUser | null
    if (!user?.id) return { ok: false, sabab: 'user yo\'q' }
    return { ok: true, user }
  } catch {
    return { ok: false, sabab: 'user parse xatosi' }
  }
}

// Telegram user ID'sidan ko'rinmas texnik email (bemor telefon-email naqshiga o'xshash)
export function telegramEmail(tgId: number | string): string {
  return `tg${tgId}@telegram.urosfera.uz`
}
