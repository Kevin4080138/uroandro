import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TOKEN = process.env.TELEGRAM_BOT_TOKEN

async function sendMessage(chatId: number, text: string, extra?: object) {
  if (!TOKEN) return
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra }),
  })
}

// Telefon raqam so'rash tugmasini ko'rsatish
async function showPhoneButton(chatId: number) {
  await sendMessage(
    chatId,
    '👋 <b>Urosfera botiga xush kelibsiz!</b>\n\n' +
    'Ro\'yxatdan o\'tish uchun telefon raqamingizni tasdiqlashimiz kerak.\n\n' +
    'Pastdagi tugmani bosing:',
    {
      reply_markup: {
        keyboard: [[
          { text: '📱 Telefon raqamimni yuborish', request_contact: true }
        ]],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    }
  )
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('998')) return digits
  if (digits.startsWith('0')) return '998' + digits.slice(1)
  if (digits.length === 9) return '998' + digits
  return digits
}

async function sendOTP(chatId: number, phone: string) {
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

  await supabase.from('telegram_otp').delete().eq('phone', phone)
  await supabase.from('telegram_otp').insert({
    phone,
    code: otp,
    chat_id: chatId.toString(),
    expires_at: expiresAt,
    used: false,
  })

  await sendMessage(
    chatId,
    `🔐 <b>Tasdiqlash kodingiz:</b>\n\n<code>${otp}</code>\n\n` +
    `⏱ Kod 5 daqiqa davomida amal qiladi.\n\n` +
    `⚠️ Hech qachon bu kodni boshqalar bilan ulashmang.\n` +
    `Agar bu so'rovni siz yubormagan bo'lsangiz, xabarni e'tiborsiz qoldiring.`,
    {
      reply_markup: { remove_keyboard: true }
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId: number = message.chat.id

    // 1) Foydalanuvchi "Telefon raqamimni yuborish" tugmasini bosgan — contact keldi
    if (message.contact) {
      const phone = normalizePhone(message.contact.phone_number)
      await sendOTP(chatId, phone)
      return NextResponse.json({ ok: true })
    }

    const text: string = (message.text || '').trim()

    // 2) /start yoki boshqa buyruq — tugma ko'rsat
    if (text.startsWith('/start') || text === '') {
      await showPhoneButton(chatId)
      return NextResponse.json({ ok: true })
    }

    // 3) Qo'lda telefon raqam yuborilgan bo'lsa
    const digits = text.replace(/\D/g, '')
    const isPhone = digits.length >= 9 && digits.length <= 13

    if (isPhone) {
      const phone = normalizePhone(text)
      await sendOTP(chatId, phone)
      return NextResponse.json({ ok: true })
    }

    // 4) Boshqa xabar
    await showPhoneButton(chatId)

  } catch {
    // Telegram ga har doim 200 qaytarish kerak
  }

  return NextResponse.json({ ok: true })
}
