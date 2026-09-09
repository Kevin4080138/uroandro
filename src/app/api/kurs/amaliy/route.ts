import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { darsgaKirishBormi, foydalanuvchiAdminMi, type KirishSabab } from '@/lib/kurs/kirish'

// Dars-darajali AMALIY test — formativ (baholanmaydi, cheksiz urinish, izohli).
//  boshla   → amaliy savollarni `togri`SIZ qaytaradi.
//  yakunla  → javoblar serverda baholanadi; javob YUBORILGANDAN keyin izoh + to'g'ri
//             indeks ochiladi. Progressга yozilmaydi (nazorat testi bu emas).

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
  const amal = rec.amal
  if (!darsId) return NextResponse.json({ error: "dars_id ko'rsatilmagan" }, { status: 400 })
  if (amal !== 'boshla' && amal !== 'yakunla') {
    return NextResponse.json({ error: "Amal noto'g'ri" }, { status: 400 })
  }

  const admin = createAdminClient()
  const adminMi = await foydalanuvchiAdminMi(admin, user.id)
  const kirish = await darsgaKirishBormi(admin, user.id, darsId, { adminMi })
  if (!kirish.ruxsat) {
    return NextResponse.json({ error: "Bu darsga kirish yo'q", sabab: kirish.sabab }, { status: kirishStatus(kirish.sabab) })
  }

  // ── boshla: savollar `togri`SIZ ──
  if (amal === 'boshla') {
    const { data, error } = await admin
      .from('kurs_savollar')
      .select('id, savol, variantlar, sort_order')
      .eq('dars_id', darsId).eq('tur', 'amaliy')
      .order('sort_order', { ascending: true })
    if (error) return NextResponse.json({ error: 'Savollar olinmadi' }, { status: 500 })
    const savollar = (data as { id: string; savol: string; variantlar: unknown }[] | null) ?? []
    if (savollar.length === 0) {
      return NextResponse.json({ code: 'AMALIY_BANK_NOT_READY', error: 'Amaliy test hali tayyor emas' }, { status: 409 })
    }
    return NextResponse.json({ ok: true, savollar: savollar.map((s) => ({ id: s.id, savol: s.savol, variantlar: s.variantlar })) })
  }

  // ── yakunla: server bahosi + izoh ──
  const javoblar = rec.javoblar
  if (!Array.isArray(javoblar) || javoblar.length === 0) {
    return NextResponse.json({ error: 'javoblar kerak' }, { status: 400 })
  }
  const javobMap = new Map<string, number>()
  for (const j of javoblar) {
    const o = (j ?? {}) as Record<string, unknown>
    if (typeof o.savol_id !== 'string' || typeof o.tanlov !== 'number' || !Number.isInteger(o.tanlov) || o.tanlov < 0) {
      return NextResponse.json({ error: 'javoblar {savol_id, tanlov} shaklida bo‘lsin' }, { status: 400 })
    }
    javobMap.set(o.savol_id, o.tanlov)
  }

  const { data, error } = await admin
    .from('kurs_savollar')
    .select('id, togri, izoh, sort_order')
    .eq('dars_id', darsId).eq('tur', 'amaliy')
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: 'Savollar olinmadi' }, { status: 500 })
  const savollar = (data as { id: string; togri: number; izoh: string | null }[] | null) ?? []
  if (savollar.length === 0) {
    return NextResponse.json({ code: 'AMALIY_BANK_NOT_READY', error: 'Amaliy test hali tayyor emas' }, { status: 409 })
  }

  let togri = 0
  for (const s of savollar) {
    if (javobMap.get(s.id) === s.togri) togri++
  }
  const natijalar = savollar.map((s) => ({ savol_id: s.id, togri: s.togri, izoh: s.izoh }))
  return NextResponse.json({ ok: true, togri, jami: savollar.length, natijalar })
}
