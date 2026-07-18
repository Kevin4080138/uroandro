import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { xabarYubor } from '@/lib/xabarYubor'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { murojaatId } = await req.json()
  if (!murojaatId) return NextResponse.json({ error: "murojaatId yo'q" }, { status: 400 })

  // RLS orqali — faqat o'zi yuborgan murojaatini tekshiradi
  const { data: m } = await supabase
    .from('murojaatlar')
    .select('id, patient_id, target_doctor_id, shoshilinch')
    .eq('id', murojaatId)
    .single()

  if (!m || m.patient_id !== user.id) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  }

  const admin = createAdminClient()
  let qabulQiluvchilar: string[] = []

  if (m.target_doctor_id) {
    qabulQiluvchilar = [m.target_doctor_id]
  } else {
    const { data: shifokorlar } = await admin.from('profiles').select('id').eq('role', 'doctor')
    qabulQiluvchilar = (shifokorlar ?? []).map((s) => s.id)
  }

  let jamiYuborildi = 0
  for (const docId of qabulQiluvchilar) {
    jamiYuborildi += await xabarYubor(docId, {
      title: m.shoshilinch ? '🚨 Shoshilinch murojaat!' : '📨 Yangi murojaat',
      body: 'Bemordan yangi shikoyat keldi — ko\'rish uchun bosing',
      url: '/doctor/murojaatlar',
    })
  }

  return NextResponse.json({ ok: true, yuborildi: jamiYuborildi })
}
