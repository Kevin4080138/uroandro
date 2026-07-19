import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { initDataTekshir, telegramEmail } from '@/lib/telegramAuth'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN

// Telegram Mini App avto-login.
// 1) initData imzosini tekshiradi (soxta so'rovlarni rad etadi)
// 2) telegram_user_id bo'yicha hisobni topadi; yo'q bo'lsa — rol so'raydi yoki yaratadi
// 3) magic-link token qaytaradi — klient uni verifyOtp bilan sessiyaga aylantiradi
export async function POST(req: NextRequest) {
  if (!TOKEN) return NextResponse.json({ error: 'Bot sozlanmagan' }, { status: 500 })

  const { initData, role } = await req.json().catch(() => ({}))
  const natija = initDataTekshir(initData ?? '', TOKEN)
  if (!natija.ok) {
    return NextResponse.json({ error: 'Imzo tekshiruvidan o\'tmadi', sabab: natija.sabab }, { status: 401 })
  }

  const tg = natija.user
  const tgId = String(tg.id)
  const admin = createAdminClient()

  // 1) Mavjud hisob — telegram_user_id bo'yicha
  let { data: profil } = await admin
    .from('profiles')
    .select('id, email, role, telegram_chat_id')
    .eq('telegram_user_id', tgId)
    .maybeSingle()

  // 1b) Balki ilgari OTP orqali bog'langan (chat_id == user_id private chatda) —
  //     shuni topib telegram_user_id ni to'ldiramiz.
  if (!profil) {
    const { data: chatProfil } = await admin
      .from('profiles')
      .select('id, email, role, telegram_chat_id')
      .eq('telegram_chat_id', tgId)
      .maybeSingle()
    if (chatProfil) {
      await admin.from('profiles').update({ telegram_user_id: tgId }).eq('id', chatProfil.id)
      profil = chatProfil
    }
  }

  // 2) Hisob yo'q — rol tanlanmagan bo'lsa klientdan so'raymiz
  if (!profil) {
    if (role !== 'student' && role !== 'patient') {
      const ism = [tg.first_name, tg.last_name].filter(Boolean).join(' ')
      return NextResponse.json({ needRole: true, name: ism || tg.username || '' })
    }

    // 3) Yangi hisob yaratamiz (parolsiz — faqat Telegram orqali kiradi)
    const email = telegramEmail(tgId)
    const fullName = [tg.first_name, tg.last_name].filter(Boolean).join(' ') || tg.username || 'Foydalanuvchi'
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    })
    if (createErr || !created.user) {
      return NextResponse.json({ error: 'Hisob yaratilmadi', sabab: createErr?.message }, { status: 500 })
    }
    // handle_new_user trigger profilni yaratdi — Telegram ID'larni bog'laymiz
    await admin.from('profiles').update({
      telegram_user_id: tgId,
      telegram_chat_id: tgId,
    }).eq('id', created.user.id)

    profil = { id: created.user.id, email, role, telegram_chat_id: tgId }
  }

  // 4) Sessiya uchun magic-link token
  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: profil.email ?? telegramEmail(tgId),
  })
  if (linkErr || !link.properties?.hashed_token) {
    return NextResponse.json({ error: 'Kirish tokeni yaratilmadi', sabab: linkErr?.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    token_hash: link.properties.hashed_token,
    email: profil.email ?? telegramEmail(tgId),
    role: profil.role,
  })
}
