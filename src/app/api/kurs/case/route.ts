import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { modulgaKirishBormi, foydalanuvchiAdminMi } from '@/lib/kurs/kirish'

// Interaktiv case — bosqichma-bosqich.
//  boshlash → birinchi bosqichni `togri`SIZ qaytaradi.
//  javob    → joriy bosqich javobini serverda tekshiradi; KEYINGI bosqich
//             faqat shundan keyin qaytariladi (togri/kelgusi bosqichlar sizmaydi).
//  Oddiy o'quv case: ball/foiz saqlanmaydi, faqat yakunlangan holati.

type Bosqich = {
  matn?: string
  savol?: string
  variantlar?: unknown
  togri?: number
  izoh?: string
}

type Qadam = { bosqich_no: number; tanlov: number; togri: boolean }

function bosqichNiTozalash(b: Bosqich, no: number, jami: number) {
  // `togri` va `izoh` YUBORILMAYDI — faqat ko'rsatiladigan qism
  return { bosqich_no: no, jami_bosqich: jami, matn: b.matn ?? b.savol ?? '', variantlar: b.variantlar ?? [] }
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
    const caseId = typeof rec.case_id === 'string' ? rec.case_id.trim() : ''
    if (!caseId) return NextResponse.json({ error: "case_id ko'rsatilmagan" }, { status: 400 })

    const { data: caseData } = await admin
      .from('kurs_caselar')
      .select('id, modul_id, bosqichlar')
      .eq('id', caseId)
      .maybeSingle()
    const kase = caseData as { id: string; modul_id: string; bosqichlar: unknown } | null
    if (!kase) return NextResponse.json({ error: 'Case topilmadi' }, { status: 404 })

    const kirish = await modulgaKirishBormi(admin, user.id, kase.modul_id, { adminMi })
    if (!kirish.ruxsat) {
      const status = kirish.sabab === 'modul-topilmadi' ? 404 : 403
      return NextResponse.json({ error: 'Case-ga kirish yo‘q', sabab: kirish.sabab }, { status })
    }

    const bosqichlar = Array.isArray(kase.bosqichlar) ? (kase.bosqichlar as Bosqich[]) : []
    if (bosqichlar.length === 0) {
      return NextResponse.json(
        { code: 'CASE_NOT_READY', error: 'Case hali tayyor emas' },
        { status: 409 }
      )
    }

    // Ochiq urinish bo'lsa davom ettiramiz
    const { data: ochiqData } = await admin
      .from('kurs_urinishlar')
      .select('id, javoblar')
      .eq('student_id', user.id)
      .eq('case_id', caseId)
      .eq('tur', 'case')
      .is('yakunlangan_at', null)
      .maybeSingle()
    const ochiq = ochiqData as { id: string; javoblar: unknown } | null

    let urinishId: string
    let joriy: number
    if (ochiq) {
      urinishId = ochiq.id
      const q = (ochiq.javoblar as { qadamlar?: Qadam[] } | null)?.qadamlar ?? []
      joriy = q.length
    } else {
      const { data: yangiData, error: insErr } = await admin
        .from('kurs_urinishlar')
        .insert({
          student_id: user.id, modul_id: kase.modul_id, case_id: caseId,
          tur: 'case', javoblar: { qadamlar: [] },
        })
        .select('id')
        .maybeSingle()
      if (insErr || !yangiData) {
        return NextResponse.json({ error: 'Urinish yaratilmadi' }, { status: 500 })
      }
      urinishId = (yangiData as { id: string }).id
      joriy = 0
    }

    if (joriy >= bosqichlar.length) {
      return NextResponse.json({ ok: true, urinish_id: urinishId, tugadi: true })
    }
    return NextResponse.json({
      ok: true, urinish_id: urinishId, bosqich: bosqichNiTozalash(bosqichlar[joriy], joriy, bosqichlar.length),
    })
  }

  // ─────────────────────────── JAVOB ───────────────────────────
  if (amal === 'javob') {
    const urinishId = typeof rec.urinish_id === 'string' ? rec.urinish_id.trim() : ''
    const bosqichNo = rec.bosqich_no
    const tanlov = rec.tanlov
    if (!urinishId) return NextResponse.json({ error: "urinish_id ko'rsatilmagan" }, { status: 400 })
    if (typeof bosqichNo !== 'number' || !Number.isInteger(bosqichNo) || bosqichNo < 0) {
      return NextResponse.json({ error: 'bosqich_no noto‘g‘ri' }, { status: 400 })
    }
    if (typeof tanlov !== 'number' || !Number.isInteger(tanlov) || tanlov < 0) {
      return NextResponse.json({ error: 'tanlov noto‘g‘ri' }, { status: 400 })
    }

    const { data: urData } = await admin
      .from('kurs_urinishlar')
      .select('id, student_id, case_id, tur, javoblar, yakunlangan_at')
      .eq('id', urinishId)
      .maybeSingle()
    const urinish = urData as {
      id: string; student_id: string; case_id: string | null; tur: string
      javoblar: unknown; yakunlangan_at: string | null
    } | null
    if (!urinish || urinish.tur !== 'case') return NextResponse.json({ error: 'Urinish topilmadi' }, { status: 404 })
    if (urinish.student_id !== user.id && !adminMi) {
      return NextResponse.json({ error: 'Ruxsat yo‘q' }, { status: 403 })
    }
    if (urinish.yakunlangan_at) {
      return NextResponse.json({ ok: true, tugadi: true, yakunlangan: true })
    }

    const { data: caseData } = await admin
      .from('kurs_caselar')
      .select('bosqichlar')
      .eq('id', urinish.case_id as string)
      .maybeSingle()
    const bosqichlar = Array.isArray((caseData as { bosqichlar?: unknown } | null)?.bosqichlar)
      ? ((caseData as { bosqichlar: unknown }).bosqichlar as Bosqich[])
      : []
    if (bosqichlar.length === 0) return NextResponse.json({ error: 'Case topilmadi' }, { status: 404 })

    const qadamlar = ((urinish.javoblar as { qadamlar?: Qadam[] } | null)?.qadamlar ?? []).slice()
    const kutilgan = qadamlar.length
    // Tartibni majburlash — bosqichlarni o'tkazib yuborib bo'lmaydi
    if (bosqichNo !== kutilgan) {
      return NextResponse.json({ error: 'Bosqich tartibi noto‘g‘ri', kutilgan }, { status: 400 })
    }

    const joriyBosqich = bosqichlar[bosqichNo]
    const togri = typeof joriyBosqich.togri === 'number' && tanlov === joriyBosqich.togri
    qadamlar.push({ bosqich_no: bosqichNo, tanlov, togri })

    const oxirgi = bosqichNo >= bosqichlar.length - 1
    const yangiJavoblar = { qadamlar }

    if (oxirgi) {
      // Oddiy o'quv case — yakunlangan holati; ball/foiz NULL
      await admin
        .from('kurs_urinishlar')
        .update({ javoblar: yangiJavoblar, yakunlangan_at: new Date().toISOString() })
        .eq('id', urinishId)
        .is('yakunlangan_at', null)
      const togriSon = qadamlar.filter((q) => q.togri).length
      return NextResponse.json({
        ok: true, tugadi: true,
        joriy: { bosqich_no: bosqichNo, togri, izoh: joriyBosqich.izoh ?? null },
        natija: { togri: togriSon, jami: bosqichlar.length },
      })
    }

    await admin
      .from('kurs_urinishlar')
      .update({ javoblar: yangiJavoblar })
      .eq('id', urinishId)
      .is('yakunlangan_at', null)

    return NextResponse.json({
      ok: true,
      joriy: { bosqich_no: bosqichNo, togri, izoh: joriyBosqich.izoh ?? null },
      keyingi: bosqichNiTozalash(bosqichlar[bosqichNo + 1], bosqichNo + 1, bosqichlar.length),
    })
  }

  return NextResponse.json({ error: "Amal noto'g'ri" }, { status: 400 })
}
