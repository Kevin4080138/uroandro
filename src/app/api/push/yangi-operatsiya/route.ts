import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { xabarYubor } from '@/lib/xabarYubor'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { kuzatuvId } = await req.json()
  if (!kuzatuvId) return NextResponse.json({ error: "kuzatuvId yo'q" }, { status: 400 })

  // RLS orqali — faqat shu shifokorning kuzatuvi qaytadi
  const { data: kuzatuv } = await supabase
    .from('operatsiya_kuzatuvi')
    .select('id, doctor_id, bemor_user_id, operatsiya_nomi')
    .eq('id', kuzatuvId)
    .single()

  if (!kuzatuv || kuzatuv.doctor_id !== user.id || !kuzatuv.bemor_user_id) {
    return NextResponse.json({ ok: true, yuborildi: 0 })
  }

  const yuborildi = await xabarYubor(kuzatuv.bemor_user_id, {
    title: '🩹 Operatsiyadan keyingi kuzatuv boshlandi',
    body: `${kuzatuv.operatsiya_nomi}: shifokoringiz tiklanish rejasini biriktirdi. Har bosqichda eslatma yuboramiz.`,
    url: '/patient/operatsiya-kuzatuvim',
  })

  return NextResponse.json({ ok: true, yuborildi })
}
