import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendTelegram(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId: number = message.chat.id
    const text: string = (message.text || '').trim()

    // Telefon raqamini aniqlash
    const digits = normalizePhone(text)
    const isPhone = digits.length >= 9 && digits.length <= 13

    if (!isPhone) {
      await sendTelegram(
        chatId,
        '📱 Iltimos, telefon raqamingizni yuboring.\nMisol: <code>+998901234567</code>\n\n' +
        'Urosfera platformasida ro\'yxatdan o\'tish uchun zarur.'
      )
      return NextResponse.json({ ok: true })
    }

    const phone = digits.startsWith('998') ? digits : digits.startsWith('0') ? '998' + digits.slice(1) : '998' + digits

    // OTP generatsiya
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Eski OTPlarni o'chirish
    await supabase.from('telegram_otp').delete().eq('phone', phone)

    // Yangi OTP saqlash
    await supabase.from('telegram_otp').insert({
      phone,
      code: otp,
      chat_id: chatId.toString(),
      expires_at: expiresAt,
      used: false,
    })

    await sendTelegram(
      chatId,
      `🔐 <b>Tasdiqlash kodingiz:</b>\n\n<code>${otp}</code>\n\n` +
      `⏱ Kod 5 daqiqa davomida amal qiladi.\n\n` +
      `⚠️ Hech qachon bu kodni boshqalar bilan ulashmang.\n` +
      `Agar bu so\'rovni siz yubormagan bo\'lsangiz, xabarni e\'tiborsiz qoldiring.`
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
