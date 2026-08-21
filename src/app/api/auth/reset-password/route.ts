import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'

const supabase = createAdminClient()

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('998')) return digits
  if (digits.startsWith('0')) return '998' + digits.slice(1)
  if (digits.length === 9) return '998' + digits
  return digits
}

export async function POST(req: NextRequest) {
  try {
    const { phone, code, password } = await req.json()

    if (!phone || !code || !password) {
      return NextResponse.json({ ok: false, error: 'phone, code va password kerak' }, { status: 400 })
    }
    if (String(password).length < 8) {
      return NextResponse.json({ ok: false, error: "Parol kamida 8 ta belgi bo'lishi kerak" }, { status: 400 })
    }

    const normalized = normalizePhone(phone)

    // 1) OTP ni tekshirish (verify-otp bilan bir xil mantiq, lekin bu yerda ham
    //    parol yangilanadi — shuning uchun kod faqat shu yerda "used" bo'ladi)
    const { data: otp, error: otpError } = await supabase
      .from('telegram_otp')
      .select('*')
      .eq('phone', normalized)
      .eq('code', String(code))
      .eq('used', false)
      .single()

    if (otpError || !otp) {
      return NextResponse.json({ ok: false, error: "Kod noto'g'ri yoki muddati o'tgan" }, { status: 400 })
    }
    if (new Date(otp.expires_at) < new Date()) {
      return NextResponse.json({ ok: false, error: "Kodning muddati o'tgan" }, { status: 400 })
    }

    // 2) Shu telefonga tegishli hisobni topish
    const { data: profil } = await supabase
      .from('profiles')
      .select('id')
      .eq('telefon', normalized)
      .maybeSingle()

    if (!profil?.id) {
      return NextResponse.json({ ok: false, error: 'Bu raqam bilan hisob topilmadi' }, { status: 404 })
    }

    // 3) Parolni service-role bilan yangilash (email sessiyasi kerak emas)
    const { error: updateError } = await supabase.auth.admin.updateUserById(profil.id, { password })
    if (updateError) {
      return NextResponse.json({ ok: false, error: 'Parolni yangilashda xatolik' }, { status: 500 })
    }

    // 4) OTP ni ishlatilgan deb belgilash (muvaffaqiyatdan keyin)
    await supabase.from('telegram_otp').update({ used: true }).eq('id', otp.id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server xatosi' }, { status: 500 })
  }
}
