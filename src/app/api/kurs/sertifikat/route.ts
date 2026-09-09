import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { bosqichMap } from '@/lib/kurs/kirish'
import { bosqichSertifikatliMi, sertifikatKodiYarat } from '@/lib/talim/sertifikat'
import type { Bosqich } from '@/lib/talim/darslar'

// Kurs (modul) tizimi uchun BOSQICH sertifikati — loyiqlik FAQAT serverda,
// modul testlaridan (kurs_urinishlar.otdi) hisoblanadi. Eski /api/sertifikat/ber
// darslar tizimidan hisoblaydi; bu esa yangi modul tizimidan. Ikkalasi ham
// bir xil `sertifikatlar` jadvali va /sertifikat/[kod] tekshiruv sahifasidan foydalanadi.
//
// AGENTS qoidasi: sertifikat faqat O'rta/Qiyin uchun; EASY da yo'q. Majburiy
// modullardan birortasida test banki bo'lmasa yoki nashr qilinmagan bo'lsa —
// bosqich "tayyorlanmoqda", sertifikat berilmaydi (hujjat qadrini yo'qotmaslik uchun).

type EligibHolat = {
  amaldagi: boolean          // bu bosqich sertifikatli (O'rta/Qiyin) mi
  jami: number               // majburiy modullar soni
  otgan: number              // testi o'tilgan majburiy modullar
  bankSiz: number            // test banki yo'q (yoki nashr emas) majburiy modullar
  tayyorlanmoqda: boolean    // kontent to'liq emas — sertifikat hali yo'q
  loyiqmi: boolean           // hamma shart bajarilgan
  ortachaFoiz: number
}

async function eligib(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  yonalish: string,
  kursBosqich: string,
): Promise<{ holat: EligibHolat; obunaBosqich: Bosqich } | null> {
  const mapped = bosqichMap(kursBosqich)          // 'orta' → "o'rta"
  if (!mapped) return null
  const obunaBosqich = mapped as Bosqich
  if (!bosqichSertifikatliMi(obunaBosqich)) {
    return { obunaBosqich, holat: { amaldagi: false, jami: 0, otgan: 0, bankSiz: 0, tayyorlanmoqda: false, loyiqmi: false, ortachaFoiz: 0 } }
  }

  const { data: modulData } = await admin
    .from('kurs_modullar')
    .select('id, holat')
    .eq('yonalish', yonalish).eq('bosqich', kursBosqich).eq('majburiy', true)
  const modullar = (modulData as { id: string; holat: string }[] | null) ?? []
  const ids = modullar.map((m) => m.id)

  if (ids.length === 0) {
    return { obunaBosqich, holat: { amaldagi: true, jami: 0, otgan: 0, bankSiz: 0, tayyorlanmoqda: true, loyiqmi: false, ortachaFoiz: 0 } }
  }

  const [bankRes, urinishRes] = await Promise.all([
    admin.from('kurs_savollar').select('modul_id').eq('tur', 'test').in('modul_id', ids),
    admin.from('kurs_urinishlar').select('modul_id, foiz, otdi').eq('student_id', userId).eq('tur', 'test').eq('otdi', true).in('modul_id', ids),
  ])
  const bankli = new Set(((bankRes.data as { modul_id: string }[] | null) ?? []).map((r) => r.modul_id))
  const otganFoiz = new Map<string, number>()
  for (const r of ((urinishRes.data as { modul_id: string; foiz: number | null }[] | null) ?? [])) {
    const f = r.foiz ?? 0
    if (!otganFoiz.has(r.modul_id) || f > otganFoiz.get(r.modul_id)!) otganFoiz.set(r.modul_id, f)
  }

  // Bank yo'q YOKI nashr emas modul → kontent tayyor emas
  const bankSiz = modullar.filter((m) => !bankli.has(m.id) || m.holat !== 'nashr').length
  const otgan = modullar.filter((m) => otganFoiz.has(m.id)).length
  const tayyorlanmoqda = bankSiz > 0
  const foizlar = [...otganFoiz.values()]
  const ortachaFoiz = foizlar.length ? Math.round(foizlar.reduce((s, f) => s + f, 0) / foizlar.length) : 0

  return {
    obunaBosqich,
    holat: {
      amaldagi: true, jami: modullar.length, otgan, bankSiz, tayyorlanmoqda,
      loyiqmi: modullar.length > 0 && !tayyorlanmoqda && otgan === modullar.length,
      ortachaFoiz,
    },
  }
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
  const yonalish = typeof rec.yonalish === 'string' ? rec.yonalish.trim() : ''
  const kursBosqich = typeof rec.bosqich === 'string' ? rec.bosqich.trim() : ''
  if (amal !== 'holat' && amal !== 'ber') return NextResponse.json({ error: "Amal noto'g'ri" }, { status: 400 })
  if (!yonalish || !kursBosqich) return NextResponse.json({ error: "yonalish/bosqich ko'rsatilmagan" }, { status: 400 })

  const admin = createAdminClient()
  const res = await eligib(admin, user.id, yonalish, kursBosqich)
  if (!res) return NextResponse.json({ error: "Bosqich noto'g'ri" }, { status: 400 })
  const { holat, obunaBosqich } = res

  // Mavjud sertifikat (agar berilgan bo'lsa)
  const { data: mavjud } = await admin
    .from('sertifikatlar')
    .select('kod').eq('student_id', user.id).eq('turi', 'bosqich').eq('bosqich', obunaBosqich).is('kategoriya', null)
    .maybeSingle()
  const mavjudKod = (mavjud as { kod: string } | null)?.kod ?? null

  if (amal === 'holat') {
    return NextResponse.json({ ok: true, ...holat, sertifikat: mavjudKod })
  }

  // ── ber ──
  if (!holat.amaldagi) return NextResponse.json({ error: 'Bu bosqich uchun sertifikat berilmaydi' }, { status: 400 })
  if (mavjudKod) return NextResponse.json({ ok: true, kod: mavjudKod, yangimi: false })
  if (!holat.loyiqmi) return NextResponse.json({ error: 'Hali barcha shartlar bajarilmagan' }, { status: 403 })

  const { data: profil } = await admin.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
  const ism = ((profil as { full_name?: string } | null)?.full_name ?? '').trim()
  if (ism.length < 3) {
    return NextResponse.json({ error: "Sertifikat uchun profilda to'liq ism-familiya bo'lishi kerak" }, { status: 400 })
  }

  for (let i = 0; i < 5; i++) {
    const kod = sertifikatKodiYarat()
    const { error } = await admin.from('sertifikatlar').insert({
      kod, student_id: user.id, turi: 'bosqich', bosqich: obunaBosqich, kategoriya: null,
      ism, foiz: holat.ortachaFoiz, dars_soni: holat.jami,
    })
    if (!error) {
      await admin.from('profiles').update({ ism_qulflangan: true }).eq('id', user.id)
      return NextResponse.json({ ok: true, kod, yangimi: true })
    }
    if (!error.message.includes('sertifikatlar_kod_key')) {
      return NextResponse.json({ error: 'Sertifikat yaratilmadi' }, { status: 500 })
    }
  }
  return NextResponse.json({ error: 'Sertifikat yaratilmadi' }, { status: 500 })
}
