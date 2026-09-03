import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { darsgaKirishBormi, foydalanuvchiAdminMi } from '@/lib/kurs/kirish'

// Server-authoritative dars progressi.
//  • Klient hech qanday natija DA'VO qilmaydi — faqat amal + javoblarni yuboradi.
//  • Tezkor savollar serverda `kurs_savollar` dan olinib baholanadi; `togri`
//    javob indekslari hech qachon klientга yuborilmaydi.
//  • Yozuv service-role bilan (RLS klient yozuvini rad etadi); `tugatdim`
//    server-authoritative.

const TEZKOR_JAMI = 3   // dars tezkor savoli — aynan 3 ta
const OTISH = 2         // tugatdim uchun kamida 2 to'g'ri

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "So'rov noto'g'ri" }, { status: 400 })
  }
  const rec = (body ?? {}) as Record<string, unknown>

  const darsId = typeof rec.dars_id === 'string' ? rec.dars_id.trim() : ''
  if (!darsId) return NextResponse.json({ error: "dars_id ko'rsatilmagan" }, { status: 400 })

  const amal = rec.amal
  if (amal !== 'korildi' && amal !== 'yakunla') {
    return NextResponse.json({ error: "Amal noto'g'ri" }, { status: 400 })
  }

  const admin = createAdminClient()
  const adminMi = await foydalanuvchiAdminMi(admin, user.id)

  // Kirish nazorati — draft/pullik kontent bloklanadi
  const kirish = await darsgaKirishBormi(admin, user.id, darsId, { adminMi })
  if (!kirish.ruxsat) {
    const status = kirish.sabab === 'dars-topilmadi' ? 404 : 403
    return NextResponse.json({ error: "Bu darsga kirish yo'q", sabab: kirish.sabab }, { status })
  }

  // ── korildi: nazariya oxirigacha ko'rildi (yengil, idempotent) ──
  if (amal === 'korildi') {
    const { error } = await admin
      .from('kurs_progress')
      .upsert(
        { student_id: user.id, dars_id: darsId, korildi: true },
        { onConflict: 'student_id,dars_id' }
      )
    if (error) return NextResponse.json({ error: 'Saqlanmadi' }, { status: 500 })
    return NextResponse.json({ ok: true, korildi: true })
  }

  // ── yakunla: 3 tezkor savol server bahosi ──
  const javoblar = rec.javoblar
  const javoblarTogri =
    Array.isArray(javoblar) &&
    javoblar.length === TEZKOR_JAMI &&
    javoblar.every((j) => typeof j === 'number' && Number.isInteger(j) && j >= 0)
  if (!javoblarTogri) {
    return NextResponse.json({ error: `Aynan ${TEZKOR_JAMI} ta javob kerak` }, { status: 400 })
  }

  const { data: savolData, error: savolErr } = await admin
    .from('kurs_savollar')
    .select('togri, sort_order')
    .eq('dars_id', darsId)
    .eq('tur', 'tezkor')
    .order('sort_order', { ascending: true })
  if (savolErr) return NextResponse.json({ error: 'Savollar olinmadi' }, { status: 500 })

  const savollar = (savolData as { togri: number; sort_order: number }[] | null) ?? []
  if (savollar.length !== TEZKOR_JAMI) {
    return NextResponse.json(
      { code: 'TEZKOR_BANK_NOT_READY', error: 'Tezkor savollar hali tayyor emas' },
      { status: 409 }
    )
  }

  const javoblarSon = javoblar as number[]
  let togri = 0
  for (let i = 0; i < TEZKOR_JAMI; i++) {
    if (javoblarSon[i] === savollar[i].togri) togri++
  }
  const otdi = togri >= OTISH

  const { error: yozuvErr } = await admin
    .from('kurs_progress')
    .upsert(
      {
        student_id: user.id,
        dars_id: darsId,
        korildi: true,
        tugatdim: otdi,
        tezkor_togri: togri,
        tezkor_jami: TEZKOR_JAMI,
      },
      { onConflict: 'student_id,dars_id' }
    )
  if (yozuvErr) return NextResponse.json({ error: 'Saqlanmadi' }, { status: 500 })

  // Faqat o'z natijasi (necha to'g'ri) — `togri` javob indekslari YUBORILMAYDI.
  return NextResponse.json({ ok: true, togri, jami: TEZKOR_JAMI, otdi })
}
