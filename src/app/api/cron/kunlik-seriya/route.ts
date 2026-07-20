import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { xabarYubor } from '@/lib/xabarYubor'
import { sozlamaYoqilganmi } from '@/lib/bildirishnoma'

// Kunlik seriya eslatmasi: kechqurun (Toshkent vaqti bilan ~19:00) hali bugun
// faol bo'lmagan, lekin seriyasi tirik talabalarga "seriyangiz xavf ostida" xabari.
// Seriya kecha faol bo'lganlarda tirik — bugun ham bir qadam qilinmasa ertaga uziladi.

function bugunToshkent() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}

function kechagiSana(bugun: string) {
  const d = new Date(`${bugun}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const bugun = bugunToshkent()
  const kecha = kechagiSana(bugun)

  // Aynan kecha faol bo'lganlar — seriya hali uzilmagan, bugun oxirgi imkoniyat.
  // Bugun faol bo'lganlar (oxirgi_sana = bugun) tabiiy ravishda tashqarida qoladi.
  const { data: nomzodlar } = await supabase
    .from('kunlik_seriya')
    .select('student_id, joriy, eng_uzun')
    .eq('oxirgi_sana', kecha)
    .gte('joriy', 2) // 1 kunlik "seriya" uchun bezovta qilmaymiz
    // Hali eslatma olmaganlar (NULL) ham kirishi shart — sof `neq` NULL qatorlarni
    // tashlab ketadi, chunki SQL'da NULL != '2026-07-19' natijasi NULL bo'ladi.
    .or(`eslatma_sanasi.is.null,eslatma_sanasi.neq.${bugun}`)

  let yuborildi = 0
  for (const s of nomzodlar ?? []) {
    // Talaba seriya eslatmasini o'chirgan bo'lsa — yubormaymiz
    if (!(await sozlamaYoqilganmi(s.student_id, 'seriya'))) continue

    // Avval belgilaymiz — xabar yuborish qisman muvaffaqiyatli bo'lsa ham takror yuborilmasin.
    const { error } = await supabase.rpc('seriya_eslatma_belgila', {
      p_student_id: s.student_id, p_sana: bugun,
    })
    if (error) continue

    const rekordga = s.joriy + 1 > s.eng_uzun
    yuborildi += await xabarYubor(s.student_id, {
      title: `🔥 ${s.joriy} kunlik seriyangiz xavf ostida!`,
      body: rekordga
        ? `Bugun bitta dars qadamini yakunlasangiz — ${s.joriy + 1} kun bilan shaxsiy rekordingizni yangilaysiz. Bir qadam yetarli!`
        : `Seriyangiz uzilmasligi uchun bugun kamida bitta dars qadamini yakunlang. Bir qadam yetarli!`,
      url: '/student/darslar',
    })
  }

  return NextResponse.json({ ok: true, sana: bugun, nomzod: nomzodlar?.length ?? 0, yuborildi })
}
