import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { eslatmaYubor, bugunToshkent, sanaSurish } from '@/lib/bildirishnoma'

// Navbat eslatmasi — kechqurun (Toshkent vaqti bilan ~18:00) ertangi kunga
// yozilganlarga yuboriladi.
//
// Nega kerak: bemor onlayn navbatga yoziladi va unutib qo'yadi — klinikada
// bo'sh qolgan slot eng ko'p yo'qotish manbai. Shifokorga esa ertangi kun
// nechta bemor kelishi bir qatorda bildiriladi.

type Navbat = {
  id: string
  doctor_id: string
  patient_id: string
  vaqt: string
  holat: string
}

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const ertaga = sanaSurish(bugunToshkent(), 1)

  const { data, error } = await supabase
    .from('navbatlar')
    .select('id, doctor_id, patient_id, vaqt, holat')
    .eq('sana', ertaga)
    .neq('holat', 'bekor')
    .order('vaqt')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const navbatlar = (data ?? []) as Navbat[]
  if (navbatlar.length === 0) {
    return NextResponse.json({ ok: true, sana: ertaga, navbat: 0 })
  }

  // Shifokor ismlarini bir so'rovda olamiz — har navbat uchun alohida
  // so'rov yuborish sekin bo'lardi.
  const doctorIdlar = [...new Set(navbatlar.map((n) => n.doctor_id))]
  const { data: shifokorlar } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', doctorIdlar)

  const ism = new Map((shifokorlar ?? []).map((p) => [p.id, p.full_name as string]))

  // ── Bemorlarga ──
  let bemorga = 0
  let xatolar = 0
  for (const n of navbatlar) {
    const shifokor = ism.get(n.doctor_id) ?? 'shifokor'
    const natija = await eslatmaYubor({
      userId: n.patient_id,
      turi: 'navbat',
      manbaId: n.id,
      xabar: {
        title: '🗓 Ertaga navbatingiz bor',
        body: `${shifokor} qabuliga soat <b>${n.vaqt}</b> ga yozilgansiz.\n\nKela olmasangiz, iltimos oldindan bekor qiling — o'rningiz boshqa bemorga bo'shaydi.`,
        url: '/patient/navbat',
      },
    })
    if (natija === 'xato') xatolar++
    if (natija === 'yuborildi') bemorga++
  }

  // ── Shifokorlarga: ertangi kun xulosasi ──
  let shifokorga = 0
  for (const docId of doctorIdlar) {
    const shu = navbatlar.filter((n) => n.doctor_id === docId)
    const vaqtlar = shu.map((n) => n.vaqt).join(', ')
    const natija = await eslatmaYubor({
      userId: docId,
      turi: 'navbat_shifokor',
      manbaId: ertaga, // kuniga bitta xulosa
      xabar: {
        title: `🗓 Ertaga ${shu.length} ta bemor`,
        body: `Qabul vaqtlari: ${vaqtlar}`,
        url: '/doctor/navbatlar',
      },
    })
    if (natija === 'xato') xatolar++
    if (natija === 'yuborildi') shifokorga++
  }

  return NextResponse.json({ ok: xatolar === 0, sana: ertaga, navbat: navbatlar.length, bemorga, shifokorga, xatolar })
}
