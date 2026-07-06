import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('998')) return digits
  if (digits.startsWith('0')) return '998' + digits.slice(1)
  return '998' + digits
}

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json()
    if (!phone || !code) {
      return NextResponse.json({ ok: false, error: 'phone va code kerak' }, { status: 400 })
    }

    const normalized = normalizePhone(phone)

    const { data, error } = await supabase
      .from('telegram_otp')
      .select('*')
      .eq('phone', normalized)
      .eq('code', code)
      .eq('used', false)
      .single()

    if (error || !data) {
      return NextResponse.json({ ok: false, error: 'Kod noto\'g\'ri yoki muddati o\'tgan' }, { status: 400 })
    }

    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ ok: false, error: 'Kodning muddati o\'tgan' }, { status: 400 })
    }

    // OTPni ishlatilgan deb belgilash
    await supabase.from('telegram_otp').update({ used: true }).eq('id', data.id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server xatosi' }, { status: 500 })
  }
}
