import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { modulgaKirishBormi, foydalanuvchiAdminMi } from '@/lib/kurs/kirish'

// Modul test / USMLE — server-authoritative attempt lifecycle.
//  boshlash  → ochiq urinish bo'lsa o'shani, aks holda savol tanlab yangi urinish
//              yaratadi; savollar `togri`SIZ qaytariladi.
//  topshirish → aynan o'sha urinish savol_ids bo'yicha serverda baholanadi;
//              bir marta yakunlanadi (idempotent).

const OTISH_FOIZ = 70

// Fisher–Yates — bank tartibini aralashtirish (server tomonda)
function aralashtir<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
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
  const amal = rec.amal
  const admin = createAdminClient()
  const adminMi = await foydalanuvchiAdminMi(admin, user.id)

  // ─────────────────────────── BOSHLASH ───────────────────────────
  if (amal === 'boshlash') {
    const modulId = typeof rec.modul_id === 'string' ? rec.modul_id.trim() : ''
    const tur = rec.tur
    if (!modulId) return NextResponse.json({ error: "modul_id ko'rsatilmagan" }, { status: 400 })
    if (tur !== 'test' && tur !== 'usmle') {
      return NextResponse.json({ error: "tur noto'g'ri" }, { status: 400 })
    }

    const kirish = await modulgaKirishBormi(admin, user.id, modulId, { adminMi })
    if (!kirish.ruxsat) {
      const status = kirish.sabab === 'modul-topilmadi' ? 404 : 403
      return NextResponse.json({ error: 'Modulga kirish yo‘q', sabab: kirish.sabab }, { status })
    }

    // Ochiq urinish bo'lsa — o'shani davom ettiramiz (idempotent)
    const { data: ochiqData } = await admin
      .from('kurs_urinishlar')
      .select('id, savol_ids')
      .eq('student_id', user.id)
      .eq('modul_id', modulId)
      .eq('tur', tur)
      .is('yakunlangan_at', null)
      .maybeSingle()
    const ochiq = ochiqData as { id: string; savol_ids: unknown } | null

    let urinishId: string
    let savolIds: string[]
    if (ochiq && Array.isArray(ochiq.savol_ids)) {
      urinishId = ochiq.id
      savolIds = ochiq.savol_ids as string[]
    } else {
      // Yangi urinish — bankdan savol tanlaymiz
      const { data: bankData, error: bankErr } = await admin
        .from('kurs_savollar')
        .select('id')
        .eq('modul_id', modulId)
        .eq('tur', tur)
      if (bankErr) return NextResponse.json({ error: 'Bank olinmadi' }, { status: 500 })
      const bank = (bankData as { id: string }[] | null) ?? []
      if (bank.length === 0) {
        return NextResponse.json(
          { code: 'TEST_BANK_NOT_READY', error: 'Modul testi hali tayyor emas' },
          { status: 409 }
        )
      }
      savolIds = aralashtir(bank.map((b) => b.id))

      const { data: yangiData, error: insErr } = await admin
        .from('kurs_urinishlar')
        .insert({ student_id: user.id, modul_id: modulId, tur, savol_ids: savolIds })
        .select('id')
        .maybeSingle()
      if (insErr || !yangiData) {
        // Poyga: ayni damda boshqa ochiq urinish yaratilgan bo'lishi mumkin
        const { data: qaytaData } = await admin
          .from('kurs_urinishlar')
          .select('id, savol_ids')
          .eq('student_id', user.id)
          .eq('modul_id', modulId)
          .eq('tur', tur)
          .is('yakunlangan_at', null)
          .maybeSingle()
        const qayta = qaytaData as { id: string; savol_ids: unknown } | null
        if (!qayta || !Array.isArray(qayta.savol_ids)) {
          return NextResponse.json({ error: 'Urinish yaratilmadi' }, { status: 500 })
        }
        urinishId = qayta.id
        savolIds = qayta.savol_ids as string[]
      } else {
        urinishId = (yangiData as { id: string }).id
      }
    }

    // Savollarni `togri`SIZ, savol_ids tartibida qaytaramiz
    const { data: savolData } = await admin
      .from('kurs_savollar')
      .select('id, savol, variantlar, sort_order')
      .in('id', savolIds)
    const savolMap = new Map(
      ((savolData as { id: string; savol: string; variantlar: unknown }[] | null) ?? []).map((s) => [s.id, s])
    )
    const savollar = savolIds
      .map((id) => savolMap.get(id))
      .filter((s): s is { id: string; savol: string; variantlar: unknown } => !!s)
      .map((s) => ({ id: s.id, savol: s.savol, variantlar: s.variantlar }))

    return NextResponse.json({ ok: true, urinish_id: urinishId, jami: savollar.length, savollar })
  }

  // ─────────────────────────── TOPSHIRISH ───────────────────────────
  if (amal === 'topshirish') {
    const urinishId = typeof rec.urinish_id === 'string' ? rec.urinish_id.trim() : ''
    const javoblar = rec.javoblar
    if (!urinishId) return NextResponse.json({ error: "urinish_id ko'rsatilmagan" }, { status: 400 })
    if (!Array.isArray(javoblar)) {
      return NextResponse.json({ error: 'javoblar noto‘g‘ri' }, { status: 400 })
    }

    const { data: urData } = await admin
      .from('kurs_urinishlar')
      .select('id, student_id, tur, savol_ids, yakunlangan_at, ball, jami, foiz, otdi')
      .eq('id', urinishId)
      .maybeSingle()
    const urinish = urData as {
      id: string; student_id: string; tur: string; savol_ids: unknown
      yakunlangan_at: string | null; ball: number | null; jami: number | null
      foiz: number | null; otdi: boolean
    } | null
    if (!urinish) return NextResponse.json({ error: 'Urinish topilmadi' }, { status: 404 })
    if (urinish.student_id !== user.id && !adminMi) {
      return NextResponse.json({ error: 'Ruxsat yo‘q' }, { status: 403 })
    }

    // Allaqachon yakunlangan → mavjud natijani qaytaramiz (idempotent)
    if (urinish.yakunlangan_at) {
      return NextResponse.json({
        ok: true, yakunlangan: true,
        ball: urinish.ball, jami: urinish.jami, foiz: urinish.foiz, otdi: urinish.otdi,
      })
    }

    const savolIds = Array.isArray(urinish.savol_ids) ? (urinish.savol_ids as string[]) : []
    if (javoblar.length !== savolIds.length) {
      return NextResponse.json({ error: 'javoblar soni savollarga mos emas' }, { status: 400 })
    }

    const { data: savolData } = await admin
      .from('kurs_savollar')
      .select('id, togri')
      .in('id', savolIds)
    const togriMap = new Map(
      ((savolData as { id: string; togri: number }[] | null) ?? []).map((s) => [s.id, s.togri])
    )

    let ball = 0
    const xatolar: string[] = []
    for (let i = 0; i < savolIds.length; i++) {
      const togri = togriMap.get(savolIds[i])
      if (typeof togri === 'number' && javoblar[i] === togri) ball++
      else xatolar.push(savolIds[i])
    }
    const jami = savolIds.length
    const foiz = jami > 0 ? Math.round((ball / jami) * 100) : 0
    const otdi = foiz >= OTISH_FOIZ

    // Bir martalik yakunlash — poyga guardi
    const { data: yangilanishData } = await admin
      .from('kurs_urinishlar')
      .update({
        yakunlangan_at: new Date().toISOString(),
        ball, jami, foiz, otdi,
        javoblar: { tanlangan: javoblar, xatolar },
      })
      .eq('id', urinishId)
      .is('yakunlangan_at', null)
      .select('id')
    const yangilandi = ((yangilanishData as { id: string }[] | null) ?? []).length > 0
    if (!yangilandi) {
      // Boshqa so'rov yakunlagan — mavjud natijani qaytaramiz
      const { data: qaytaData } = await admin
        .from('kurs_urinishlar')
        .select('ball, jami, foiz, otdi')
        .eq('id', urinishId)
        .maybeSingle()
      const qayta = qaytaData as { ball: number | null; jami: number | null; foiz: number | null; otdi: boolean } | null
      return NextResponse.json({ ok: true, yakunlangan: true, ...(qayta ?? {}) })
    }

    return NextResponse.json({ ok: true, ball, jami, foiz, otdi })
  }

  return NextResponse.json({ error: "Amal noto'g'ri" }, { status: 400 })
}
