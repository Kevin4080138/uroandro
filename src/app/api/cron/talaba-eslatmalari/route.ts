import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { eslatmaYubor, bugunToshkent, sanaSurish } from '@/lib/bildirishnoma'
import { darsTop } from '@/lib/talim/darslar'

// Talaba turtkilari — ikkalasi bitta cronda, ataylab.
//
//   1. Flashcard takrorlash (1, 3, 7, 30-kun) — intervalli takrorlash
//   2. Yarim qolgan dars — boshlangan, lekin amaliy testgacha yetmagan
//
// Nega birga: `eslatmaYubor` kunlik chegara qo'yadi (kuniga bitta turtki).
// Alohida cronlar bo'lsa tartib tasodifiy bo'lardi. Bu yerda takrorlash
// birinchi ketadi — u aniq rejaga bog'liq va qiymati yuqoriroq.

const INTERVALLAR = [1, 3, 7, 30] // bosqich → keyingi takrorlashgacha kun

/** Dars boshlangandan keyin necha kun jim tursa "tashlab ketilgan" hisoblanadi */
const JIMLIK_MIN = 3
const JIMLIK_MAX = 14

function darsNomi(slug: string): string {
  return darsTop(slug)?.sarlavha ?? slug
}

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const bugun = bugunToshkent()

  // ── 1. Takrorlash vaqti kelganlar ─────────────────────────────────────────
  const { data: rejalar, error: rejaXato } = await supabase
    .from('takrorlash_rejasi')
    .select('id, student_id, dars_slug, bosqich')
    .eq('tugadi', false)
    .lte('keyingi_sana', bugun)

  // Jimgina o'tkazib yuborilsa, cron "ok" qaytaraveradi va buzilgani
  // bilinmaydi — shuning uchun xato ochiq qaytariladi.
  if (rejaXato) {
    return NextResponse.json({ error: 'takrorlash_rejasi: ' + rejaXato.message }, { status: 500 })
  }

  let takrorlash = 0
  let xatolar = 0
  const turtkiOlgan = new Set<string>()

  for (const r of rejalar ?? []) {
    const nom = darsNomi(r.dars_slug)
    const natija = await eslatmaYubor({
      userId: r.student_id,
      turi: 'takrorlash',
      manbaId: r.dars_slug,
      kunlikLimit: true,
      xabar: {
        title: '🃏 Takrorlash vaqti',
        body: `<b>${nom}</b> flashcardlarini takrorlang.\n\nQisqa takrorlash yodda saqlashni bir necha barobar oshiradi — 5 daqiqa yetadi.`,
        url: `/student/darslar/${r.dars_slug}`,
      },
    })

    // Reja faqat xabar haqiqatan yetib borganda oldinga suriladi.
    // Kunlik chegaraga tushgan yoki o'chirilgan bo'lsa joyida qoladi —
    // aks holda bildirishnomani o'chirgan talaba keyin yoqsa, reja
    // allaqachon yopilgan bo'lib, hech qachon takrorlashga chaqirilmasdi.
    if (natija === 'yuborildi' || natija === 'takror') {
      const keyingiBosqich = r.bosqich + 1
      if (keyingiBosqich >= INTERVALLAR.length) {
        await supabase.from('takrorlash_rejasi').update({ tugadi: true }).eq('id', r.id)
      } else {
        await supabase.from('takrorlash_rejasi').update({
          bosqich: keyingiBosqich,
          keyingi_sana: sanaSurish(bugun, INTERVALLAR[keyingiBosqich]),
        }).eq('id', r.id)
      }
    }

    if (natija === 'xato') xatolar++
    if (natija === 'yuborildi') { takrorlash++; turtkiOlgan.add(r.student_id) }
  }

  // ── 2. Yarim qolgan darslar ───────────────────────────────────────────────
  // Oxirgi 30 kunlik progressni olamiz va JS'da guruhlaymiz: "amaliy" qadami
  // yo'q, oxirgi harakati 3–14 kun oldin bo'lgan darslar tashlab ketilgan.
  const chegara = new Date()
  chegara.setUTCDate(chegara.getUTCDate() - 30)

  const { data: progress, error: progressXato } = await supabase
    .from('dars_qadam_progress')
    .select('student_id, dars_slug, qadam, created_at')
    .gte('created_at', chegara.toISOString())

  if (progressXato) {
    return NextResponse.json({ error: 'dars_qadam_progress: ' + progressXato.message }, { status: 500 })
  }

  type Holat = { oxirgi: string; amaliyBor: boolean }
  const jadval = new Map<string, Holat>()

  for (const p of progress ?? []) {
    const kalit = `${p.student_id}|${p.dars_slug}`
    const h = jadval.get(kalit) ?? { oxirgi: p.created_at as string, amaliyBor: false }
    if ((p.created_at as string) > h.oxirgi) h.oxirgi = p.created_at as string
    if (p.qadam === 'amaliy') h.amaliyBor = true
    jadval.set(kalit, h)
  }

  let yarimDars = 0
  for (const [kalit, h] of jadval) {
    if (h.amaliyBor) continue

    const kunOtdi = Math.floor((Date.now() - new Date(h.oxirgi).getTime()) / 86_400_000)
    if (kunOtdi < JIMLIK_MIN || kunOtdi > JIMLIK_MAX) continue

    const [studentId, slug] = kalit.split('|')
    if (turtkiOlgan.has(studentId)) continue // bugun takrorlash turtkisini olgan

    const natija = await eslatmaYubor({
      userId: studentId,
      turi: 'yarim_dars',
      manbaId: slug,
      kunlikLimit: true,
      xabar: {
        title: '📖 Dars yarim qoldi',
        body: `<b>${darsNomi(slug)}</b> darsini boshlagansiz, lekin amaliy testgacha yetmadingiz.\n\nQolgan qismi ko'p vaqt olmaydi — o'qiganingiz esdan chiqmasidan yakunlang.`,
        url: `/student/darslar/${slug}`,
      },
    })
    if (natija === 'xato') xatolar++
    if (natija === 'yuborildi') yarimDars++
  }

  return NextResponse.json({ ok: xatolar === 0, sana: bugun, takrorlash, yarimDars, xatolar })
}
