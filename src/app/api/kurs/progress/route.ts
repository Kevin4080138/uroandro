import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { darsgaKirishBormi, foydalanuvchiAdminMi, type KirishSabab } from '@/lib/kurs/kirish'

// Server-authoritative dars progressi.
//  • amal='tezkor'  → 3 tezkor savolni `togri`SIZ qaytaradi (savol_id + variantlar).
//  • amal='korildi' → nazariya oxirigacha ko'rildi (yengil, idempotent).
//  • amal='yakunla' → javoblar {savol_id, tanlov}[] serverda baholanadi.
//  `togri` javob indekslari hech qachon klientга yuborilmaydi.
//  Yozuv service-role bilan (RLS klient yozuvini rad etadi).

const TEZKOR_JAMI = 3
const OTISH = 2

function kirishStatus(sabab?: KirishSabab): number {
  if (sabab === 'dars-topilmadi' || sabab === 'modul-topilmadi') return 404
  if (sabab === 'db-xato') return 500
  return 403
}

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
  if (amal !== 'tezkor' && amal !== 'korildi' && amal !== 'yakunla') {
    return NextResponse.json({ error: "Amal noto'g'ri" }, { status: 400 })
  }

  const admin = createAdminClient()
  const adminMi = await foydalanuvchiAdminMi(admin, user.id)

  // Kirish nazorati — draft/pullik kontent bloklanadi (DB xato → 500)
  const kirish = await darsgaKirishBormi(admin, user.id, darsId, { adminMi })
  if (!kirish.ruxsat) {
    return NextResponse.json({ error: "Bu darsga kirish yo'q", sabab: kirish.sabab }, { status: kirishStatus(kirish.sabab) })
  }

  // ── tezkor: savollarni `togri`SIZ qaytarish ──
  if (amal === 'tezkor') {
    const { data: savolData, error: savolErr } = await admin
      .from('kurs_savollar')
      .select('id, savol, variantlar, sort_order')
      .eq('dars_id', darsId)
      .eq('tur', 'tezkor')
      .order('sort_order', { ascending: true })
    if (savolErr) return NextResponse.json({ error: 'Savollar olinmadi' }, { status: 500 })
    const savollar = (savolData as { id: string; savol: string; variantlar: unknown }[] | null) ?? []
    if (savollar.length !== TEZKOR_JAMI) {
      return NextResponse.json({ code: 'TEZKOR_BANK_NOT_READY', error: 'Tezkor savollar hali tayyor emas' }, { status: 409 })
    }
    return NextResponse.json({
      ok: true,
      savollar: savollar.map((s) => ({ id: s.id, savol: s.savol, variantlar: s.variantlar })),
    })
  }

  // ── korildi: idempotent yengil yozuv ──
  if (amal === 'korildi') {
    const { error } = await admin
      .from('kurs_progress')
      .upsert({ student_id: user.id, dars_id: darsId, korildi: true }, { onConflict: 'student_id,dars_id' })
    if (error) return NextResponse.json({ error: 'Saqlanmadi' }, { status: 500 })
    return NextResponse.json({ ok: true, korildi: true })
  }

  // ── yakunla: javoblar {savol_id, tanlov}[] server bahosi ──
  const javoblar = rec.javoblar
  if (!Array.isArray(javoblar) || javoblar.length !== TEZKOR_JAMI) {
    return NextResponse.json({ error: `Aynan ${TEZKOR_JAMI} ta javob kerak` }, { status: 400 })
  }
  const javobMap = new Map<string, number>()
  for (const j of javoblar) {
    const o = (j ?? {}) as Record<string, unknown>
    if (typeof o.savol_id !== 'string' || typeof o.tanlov !== 'number' || !Number.isInteger(o.tanlov) || o.tanlov < 0) {
      return NextResponse.json({ error: 'javoblar {savol_id, tanlov} shaklida bo‘lsin' }, { status: 400 })
    }
    javobMap.set(o.savol_id, o.tanlov)
  }

  const { data: savolData, error: savolErr } = await admin
    .from('kurs_savollar')
    .select('id, togri')
    .eq('dars_id', darsId)
    .eq('tur', 'tezkor')
    .order('sort_order', { ascending: true })
  if (savolErr) return NextResponse.json({ error: 'Savollar olinmadi' }, { status: 500 })
  const savollar = (savolData as { id: string; togri: number }[] | null) ?? []
  if (savollar.length !== TEZKOR_JAMI) {
    return NextResponse.json({ code: 'TEZKOR_BANK_NOT_READY', error: 'Tezkor savollar hali tayyor emas' }, { status: 409 })
  }
  // Har tezkor savolga javob berilgan bo'lsin (savol_id lar mos kelsin)
  if (!savollar.every((s) => javobMap.has(s.id))) {
    return NextResponse.json({ error: 'javoblar savollarga mos emas' }, { status: 400 })
  }

  let togri = 0
  for (const s of savollar) {
    if (javobMap.get(s.id) === s.togri) togri++
  }
  const otdiHozir = togri >= OTISH

  // Mavjud progressni o'qish — o'tilgan darsni downgrade QILMAYMIZ
  const { data: mavjudData, error: mavjudErr } = await admin
    .from('kurs_progress')
    .select('tugatdim, tezkor_togri')
    .eq('student_id', user.id)
    .eq('dars_id', darsId)
    .maybeSingle()
  if (mavjudErr) return NextResponse.json({ error: 'Progress olinmadi' }, { status: 500 })
  const mavjud = mavjudData as { tugatdim: boolean; tezkor_togri: number | null } | null

  const yakunTugatdim = mavjud?.tugatdim === true || otdiHozir
  // DB CHECK: tugatdim=true ⇒ tezkor_togri>=2. O'tgan bo'lsa eng yaxshi natijani saqlaymiz.
  const saqlanadiganTogri = yakunTugatdim
    ? Math.max(togri, mavjud?.tezkor_togri ?? 0)
    : togri

  const { error: yozuvErr } = await admin
    .from('kurs_progress')
    .upsert(
      {
        student_id: user.id,
        dars_id: darsId,
        korildi: true,
        tugatdim: yakunTugatdim,
        tezkor_togri: saqlanadiganTogri,
        tezkor_jami: TEZKOR_JAMI,
      },
      { onConflict: 'student_id,dars_id' }
    )
  if (yozuvErr) return NextResponse.json({ error: 'Saqlanmadi' }, { status: 500 })

  // Bu urinish natijasi + darsning umumiy tugatdim holati (togri indekslari YO'Q)
  return NextResponse.json({ ok: true, togri, jami: TEZKOR_JAMI, otdi: otdiHozir, tugatdim: yakunTugatdim })
}
