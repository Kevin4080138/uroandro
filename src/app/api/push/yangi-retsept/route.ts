import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { foydalanuvchigaPushYubor } from '@/lib/pushSend'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { retseptIds } = await req.json()
  if (!Array.isArray(retseptIds) || retseptIds.length === 0) {
    return NextResponse.json({ error: "retseptIds yo'q" }, { status: 400 })
  }

  // RLS orqali — faqat shu shifokor yozgan retseptlar qaytadi
  const { data: retseptlar } = await supabase
    .from('dori_retseptlari')
    .select('id, nomi, bemor_user_id, doctor_id')
    .in('id', retseptIds)

  const ozimniki = (retseptlar ?? []).filter((r) => r.doctor_id === user.id && r.bemor_user_id)
  if (ozimniki.length === 0) return NextResponse.json({ ok: true, yuborildi: 0 })

  const bemorUserId = ozimniki[0].bemor_user_id
  const nomlar = ozimniki.map((r) => r.nomi).join(', ')

  const yuborildi = await foydalanuvchigaPushYubor(bemorUserId, {
    title: '💊 Yangi dori retsepti',
    body: `Shifokoringiz sizga yangi dori tayinladi: ${nomlar}`,
    url: '/patient/dorilarim',
  })

  return NextResponse.json({ ok: true, yuborildi })
}
