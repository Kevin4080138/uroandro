import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { type Bosqich } from '@/lib/talim/darslar'
import { boblarHolati, bosqichlarHolati, bosqichSertifikatliMi, sertifikatKodiYarat } from '@/lib/talim/sertifikat'
import { foydalanuvchiHolatlari } from '@/lib/talim/sertifikatServer'

// Sertifikat/nishon berish. Loyiqlik FAQAT shu yerda — serverda — hisoblanadi:
// client hech qanday natija yoki huquq da'vosini yubormaydi, faqat nima so'rayotganini
// aytadi. Shu sabab hujjatni so'rov yasab "o'zicha" olish mumkin emas.

type Sorov = { turi: 'bosqich' | 'bob'; bosqich: Bosqich; kategoriya?: string }

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 })

  let sorov: Sorov
  try {
    sorov = await req.json()
  } catch {
    return NextResponse.json({ error: "So'rov noto'g'ri" }, { status: 400 })
  }
  if (sorov?.turi !== 'bosqich' && sorov?.turi !== 'bob') {
    return NextResponse.json({ error: "So'rov noto'g'ri" }, { status: 400 })
  }
  if (sorov.turi === 'bosqich' && !bosqichSertifikatliMi(sorov.bosqich)) {
    return NextResponse.json({ error: "Bu bosqich uchun sertifikat berilmaydi" }, { status: 400 })
  }

  const admin = createAdminClient()

  const [{ data: profil }, holatlar] = await Promise.all([
    admin.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    foydalanuvchiHolatlari(user.id),
  ])

  const ism = (profil?.full_name ?? '').trim()
  if (ism.length < 3) {
    return NextResponse.json(
      { error: "Sertifikat uchun profilda to'liq ism-familiya bo'lishi kerak" },
      { status: 400 }
    )
  }

  let loyiqmi = false
  let foiz: number | null = null
  let darsSoni = 0

  if (sorov.turi === 'bosqich') {
    const holat = bosqichlarHolati(holatlar).find((b) => b.bosqich === sorov.bosqich)
    loyiqmi = !!holat?.loyiqmi
    foiz = holat?.ortachaFoiz ?? null
    darsSoni = holat?.jami ?? 0
  } else {
    const holat = boblarHolati(holatlar).find(
      (b) => b.bosqich === sorov.bosqich && b.kategoriya === sorov.kategoriya
    )
    loyiqmi = !!holat?.loyiqmi
    darsSoni = holat?.jami ?? 0
  }

  if (!loyiqmi) {
    return NextResponse.json({ error: "Hali barcha shartlar bajarilmagan" }, { status: 403 })
  }

  // Allaqachon berilgan bo'lsa — yangisini yasamaymiz, mavjudini qaytaramiz.
  const { data: mavjud } = await admin
    .from('sertifikatlar')
    .select('kod')
    .eq('student_id', user.id)
    .eq('turi', sorov.turi)
    .eq('bosqich', sorov.bosqich)
    .eq('kategoriya', sorov.turi === 'bob' ? sorov.kategoriya! : null)
    .maybeSingle()
  if (mavjud) return NextResponse.json({ ok: true, kod: mavjud.kod, yangimi: false })

  // Kod to'qnashuvi juda kam ehtimolli, lekin unique cheklovga urilsa qayta urinamiz.
  for (let urinish = 0; urinish < 5; urinish++) {
    const kod = sertifikatKodiYarat()
    const { error } = await admin.from('sertifikatlar').insert({
      kod,
      student_id: user.id,
      turi: sorov.turi,
      bosqich: sorov.bosqich,
      kategoriya: sorov.turi === 'bob' ? sorov.kategoriya : null,
      ism,
      foiz,
      dars_soni: darsSoni,
    })
    if (!error) {
      // Sertifikatdagi ism endi hujjatga tushdi — profilda o'zboshimchalik bilan o'zgarmasin
      if (sorov.turi === 'bosqich') {
        await admin.from('profiles').update({ ism_qulflangan: true }).eq('id', user.id)
      }
      return NextResponse.json({ ok: true, kod, yangimi: true })
    }
    if (!error.message.includes('sertifikatlar_kod_key')) {
      return NextResponse.json({ error: "Sertifikat yaratilmadi" }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "Sertifikat yaratilmadi" }, { status: 500 })
}
