import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SAYT_URL, miniAppTugmalari, chatIdniProfilgaBogla } from '@/lib/telegramSend'
import { authenticQuizWebhook, recordQuizPoll } from '@/lib/telegramQuiz.server'
import { parsePollUpdate, QuizError } from '@/lib/telegramQuiz'

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
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
      ...extra,
    }),
  })
}

// ─────────────────────────────────────────────────────────
// Menyular
// ─────────────────────────────────────────────────────────

// Rolga qarab Mini App tugmalari — sayt Telegram ichida ochiladi.
function menyuTugmalari(role: string | null) {
  if (role === 'patient') {
    return miniAppTugmalari([
      { matn: '🩺 Shifokorga murojaat', yol: '/patient/murojaat' },
      { matn: '🗓 Navbat olish', yol: '/patient/navbat' },
      { matn: '💊 Dorilarim', yol: '/patient/dorilarim' },
      { matn: '🏠 Bosh sahifa', yol: '/patient/dashboard' },
    ])
  }
  if (role === 'doctor') {
    return miniAppTugmalari([
      { matn: '👨‍⚕️ Shifokor paneli', yol: '/doctor/dashboard' },
      { matn: '📋 Murojaatlar', yol: '/doctor/bemor-bolimi' },
      { matn: '🧮 Kalkulyatorlar', yol: '/doctor/calculators' },
    ])
  }
  // student va boshqalar (admin ham shu menyuni ko'radi)
  return miniAppTugmalari([
    { matn: '📚 Darslar', yol: '/student/darslar' },
    { matn: '📊 Natijalarim', yol: '/student/natijalarim' },
    { matn: '🎯 O\'zingizni tekshiring', yol: '/student/ozingizni-tekshiring' },
    { matn: '🏠 Bosh sahifa', yol: '/student/dashboard' },
  ])
}

async function profilTop(chatId: number) {
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('telegram_chat_id', String(chatId))
    .maybeSingle()
  return data
}

async function asosiyMenyu(chatId: number, profil: { full_name: string | null; role: string } | null) {
  if (profil) {
    const rolNomi = profil.role === 'patient' ? 'Bemor' : profil.role === 'doctor' ? 'Shifokor' : 'Talaba'
    await sendMessage(
      chatId,
      `👋 <b>Salom, ${profil.full_name ?? 'foydalanuvchi'}!</b>\n` +
      `<i>${rolNomi} bo'limi</i>\n\n` +
      `Quyidagi tugmalar orqali Urosfera'ni shu yerning o'zida oching:`,
      { reply_markup: menyuTugmalari(profil.role) }
    )
    return
  }

  // Hali bog'lanmagan foydalanuvchi
  await sendMessage(
    chatId,
    `👋 <b>Urosfera — urologiya platformasi</b>\n\n` +
    `📚 Talabalar uchun bosqichma-bosqich darslar, testlar va sertifikatlar\n` +
    `🩺 Bemorlar uchun shifokorga murojaat va navbat\n\n` +
    `Platformani ochish uchun pastdagi tugmani bosing. ` +
    `Ro'yxatdan o'tish uchun telefon raqamingizni yuborsangiz, ` +
    `bu yerdan barcha xabarnomalarni olib turasiz.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Urosfera\'ni ochish', web_app: { url: SAYT_URL } }],
        ],
      },
    }
  )
  await telefonSora(chatId)
}

async function telefonSora(chatId: number) {
  await sendMessage(
    chatId,
    '📱 Telefon raqamingizni tasdiqlash uchun pastdagi tugmani bosing:',
    {
      reply_markup: {
        keyboard: [[{ text: '📱 Telefon raqamimni yuborish', request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  )
}

// ─────────────────────────────────────────────────────────
// OTP
// ─────────────────────────────────────────────────────────

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

  // Raqam allaqachon ro'yxatdan o'tgan bo'lsa — chat_id ni profilga bog'laymiz,
  // shunda platformadagi xabarnomalar shu yerga kela boshlaydi.
  await chatIdniProfilgaBogla(phone, chatId)

  await sendMessage(
    chatId,
    `🔐 <b>Tasdiqlash kodingiz:</b>\n\n<code>${otp}</code>\n\n` +
    `⏱ Kod 5 daqiqa davomida amal qiladi.\n\n` +
    `⚠️ Hech qachon bu kodni boshqalar bilan ulashmang.\n` +
    `Agar bu so'rovni siz yubormagan bo'lsangiz, xabarni e'tiborsiz qoldiring.`,
    { reply_markup: { remove_keyboard: true } }
  )
}

// ─────────────────────────────────────────────────────────
// Webhook
// ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (body?.poll) {
    // Poll statistikasi faqat Telegram bilan kelishilgan maxfiy header orqali qabul qilinadi.
    try {
      if (!authenticQuizWebhook(req.headers.get('x-telegram-bot-api-secret-token'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      if (body.poll.type !== 'quiz') return NextResponse.json({ ok: true })
      const snapshot = parsePollUpdate(body)
      await recordQuizPoll(snapshot)
      return NextResponse.json({ ok: true })
    } catch (error) {
      if (error instanceof QuizError && error.status === 400) return NextResponse.json({ ok: true })
      // Baza vaqtincha ishlamasa Telegram qayta yetkazadi; natija yo'qolmaydi.
      return NextResponse.json({ error: 'Poll update unavailable' }, { status: 503 })
    }
  }
  try {

    // Inline tugma bosilishi (kelajakda kerak bo'ladi) — javobsiz qolmasin
    if (body?.callback_query) {
      const cq = body.callback_query
      if (TOKEN) {
        await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: cq.id }),
        })
      }
      return NextResponse.json({ ok: true })
    }

    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })
    // OTP va shaxsiy menyu guruhdagi quiz muhokamalariga javob bermasin.
    if (message.chat?.type !== 'private') return NextResponse.json({ ok: true })

    const chatId: number = message.chat.id

    // 1) Kontakt ulashildi → OTP + profilga bog'lash
    if (message.contact) {
      const phone = normalizePhone(message.contact.phone_number)
      await sendOTP(chatId, phone)
      const profil = await profilTop(chatId)
      if (profil) await asosiyMenyu(chatId, profil)
      return NextResponse.json({ ok: true })
    }

    const text: string = (message.text || '').trim()
    const buyruq = text.toLowerCase()

    // 2) /start, /menu — asosiy menyu (bog'langan bo'lsa) yoki tanishtiruv
    if (buyruq.startsWith('/start') || buyruq.startsWith('/menu')) {
      const profil = await profilTop(chatId)
      await asosiyMenyu(chatId, profil)
      return NextResponse.json({ ok: true })
    }

    // 3) /yordam
    if (buyruq.startsWith('/help') || buyruq.startsWith('/yordam')) {
      await sendMessage(
        chatId,
        `ℹ️ <b>Yordam</b>\n\n` +
        `/menu — asosiy menyu\n` +
        `/ulash — telefon raqamni bog'lash (xabarnomalar uchun)\n\n` +
        `Savollar bo'lsa: @urolog_arabboyev`,
      )
      return NextResponse.json({ ok: true })
    }

    // 4) /ulash — chat'ni profilga bog'lash
    if (buyruq.startsWith('/ulash')) {
      await telefonSora(chatId)
      return NextResponse.json({ ok: true })
    }

    // 5) Qo'lda telefon raqam yuborilgan
    const digits = text.replace(/\D/g, '')
    if (digits.length >= 9 && digits.length <= 13) {
      await sendOTP(chatId, normalizePhone(text))
      return NextResponse.json({ ok: true })
    }

    // 6) Boshqa har qanday xabar → menyu
    const profil = await profilTop(chatId)
    await asosiyMenyu(chatId, profil)

  } catch {
    // Telegram ga har doim 200 qaytarish kerak
  }

  return NextResponse.json({ ok: true })
}
