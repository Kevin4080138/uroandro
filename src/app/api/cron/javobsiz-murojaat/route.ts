import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { eslatmaYubor, bugunToshkent } from '@/lib/bildirishnoma'

// Javobsiz murojaat — 24 soatdan ortiq javob berilmagan murojaatlar bo'yicha
// shifokorga kunlik eslatma.
//
// Bemor uchun javobsiz qolish eng yomon tajriba: u platformaga ishonchini
// yo'qotadi va qaytmaydi. Shifokorga esa murojaat kelgani oddiygina esdan
// chiqqan bo'lishi mumkin.
//
// Har bir murojaat uchun alohida emas, shifokorga bitta yig'ma xabar
// yuboriladi — 5 ta javobsiz murojaat 5 ta xabar bo'lib ketmasin.

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const sutkaOldin = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('murojaatlar')
    .select('id, doctor_id, target_doctor_id, shoshilinch, created_at')
    .neq('holat', 'javob_berildi')
    .lt('created_at', sutkaOldin)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Murojaatni qabul qilgan shifokor bo'lmasa, bemor tanlagan shifokorga
  // yoziladi. Ikkalasi ham bo'lmasa — umumiy navbatdagi murojaat, uni
  // eslatib bo'lmaydi (aniq egasi yo'q), admin paneli orqali ko'rinadi.
  const boyicha = new Map<string, { soni: number; shoshilinch: number }>()

  for (const m of data ?? []) {
    const docId = (m.doctor_id ?? m.target_doctor_id) as string | null
    if (!docId) continue
    const j = boyicha.get(docId) ?? { soni: 0, shoshilinch: 0 }
    j.soni++
    if (m.shoshilinch) j.shoshilinch++
    boyicha.set(docId, j)
  }

  const sana = bugunToshkent()
  let yuborildi = 0
  let xatolar = 0

  for (const [docId, j] of boyicha) {
    const shoshilinchQator = j.shoshilinch > 0
      ? `\n\n🚨 Shulardan <b>${j.shoshilinch} tasi shoshilinch</b> deb belgilangan.`
      : ''

    const natija = await eslatmaYubor({
      userId: docId,
      turi: 'javobsiz_murojaat',
      manbaId: sana, // kuniga bitta yig'ma eslatma
      xabar: {
        title: `⏳ ${j.soni} ta murojaat javobsiz`,
        body: `Bir sutkadan ortiq javob kutayotgan murojaatlar bor.${shoshilinchQator}`,
        url: '/doctor/murojaatlar',
      },
    })
    if (natija === 'xato') xatolar++
    if (natija === 'yuborildi') yuborildi++
  }

  return NextResponse.json({ ok: xatolar === 0, shifokor: boyicha.size, yuborildi, xatolar })
}
