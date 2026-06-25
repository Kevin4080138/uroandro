import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { foydalanuvchigaPushYubor } from '@/lib/pushSend'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { murojaatId } = await req.json()
  if (!murojaatId) return NextResponse.json({ error: "murojaatId yo'q" }, { status: 400 })

  // RLS orqali — faqat shu murojaatni qabul qilgan shifokor bu yozuvni o'qiy oladi
  const { data: m } = await supabase
    .from('murojaatlar')
    .select('id, patient_id, doctor_id')
    .eq('id', murojaatId)
    .single()

  if (!m || m.doctor_id !== user.id) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const yuborildi = await foydalanuvchigaPushYubor(m.patient_id, {
    title: '💬 Shifokoringiz javob berdi',
    body: 'Murojaatingizga javob keldi — ko\'rish uchun bosing',
    url: '/patient/murojaatlarim',
  })

  return NextResponse.json({ ok: true, yuborildi })
}
