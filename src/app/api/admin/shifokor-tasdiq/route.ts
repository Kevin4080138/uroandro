import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profil?.role !== 'admin') return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

  const { userId, amal } = await req.json()
  if (!userId || !amal) return NextResponse.json({ error: "userId yoki amal yo'q" }, { status: 400 })

  const admin = createAdminClient()

  if (amal === 'tasdiqlash') {
    // Email ni Supabase Auth da ham tasdiqlaymiz (aks holda login ishlamaydi)
    const { error: authErr } = await admin.auth.admin.updateUserById(userId, { email_confirm: true })
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 500 })

    const { error: profileErr } = await admin
      .from('profiles')
      .update({ role: 'doctor', doctor_holati: 'tasdiqlandi' })
      .eq('id', userId)
    if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 })
  }

  if (amal === 'rad_etish') {
    const { error } = await admin
      .from('profiles')
      .update({ doctor_holati: 'rad_etildi' })
      .eq('id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
