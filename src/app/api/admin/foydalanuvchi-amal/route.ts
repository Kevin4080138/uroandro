import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'

// Admin panelidagi foydalanuvchi mutatsiyalari uchun yagona server route.
// Ilgari bular klientdan to'g'ridan-to'g'ri supabase.update/upsert/delete edi:
// xato bo'lsa ham UI "muvaffaqiyat" ko'rsatardi va audit yozilmasdi.
//
// Ikki client ishlatiladi:
//  - createServerSupabase() (foydalanuvchi konteksti) — profiles/obunalar yozuvi.
//    RLS admin'ga ruxsat beradi va trigger'lardagi auth.uid() to'g'ri to'ladi.
//    (rol o'zgarishi profiles ustidagi AFTER UPDATE trigger orqali AVTOMATIK
//     audit'ga tushadi — bu yerda qo'lda yozilmaydi, aks holda takror bo'lardi.)
//  - createAdminClient() (service role) — admin_audit_log INSERT'i, chunki bu
//    jadvalda INSERT siyosati yo'q (faqat SELECT), RLS oddiy foydalanuvchini to'sadi.

type Amal = 'rol_ozgartirish' | 'faol_ozgartirish' | 'arxiv_ozgartirish' | 'obuna_berish' | 'obuna_bekor'
const ROLLAR = ['student', 'doctor', 'patient', 'admin']
const BOSQICHLAR = ['oson', "o'rta", 'qiyin']

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profil?.role !== 'admin') return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

  const body = await req.json()
  const amal = body.amal as Amal
  const userId = body.userId as string | undefined
  if (!userId) return NextResponse.json({ error: "userId yo'q" }, { status: 400 })

  const admin = createAdminClient()

  const yozAudit = (auditAmal: string, tafsilot: unknown) =>
    admin.from('admin_audit_log').insert({ admin_id: user.id, amal: auditAmal, maqsad_user_id: userId, tafsilot })

  switch (amal) {
    case 'rol_ozgartirish': {
      const role = body.role as string
      if (!ROLLAR.includes(role)) return NextResponse.json({ error: "Noto'g'ri rol" }, { status: 400 })

      // Oxirgi adminni admin'likdan tushirib qo'yishdan himoya
      const { data: maqsad } = await admin.from('profiles').select('role').eq('id', userId).single()
      if (maqsad?.role === 'admin' && role !== 'admin') {
        const { count } = await admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin')
        if ((count ?? 0) <= 1) return NextResponse.json({ error: "Oxirgi adminni o'zgartirib bo'lmaydi" }, { status: 400 })
      }

      // Foydalanuvchi konteksti — trigger auth.uid() ni to'ldiradi va audit'ni O'ZI yozadi
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    case 'faol_ozgartirish': {
      const faol = !!body.faol
      // O'zini yoki oxirgi adminni bloklab qo'yishdan himoya
      if (!faol) {
        if (userId === user.id) return NextResponse.json({ error: "O'zingizni bloklay olmaysiz" }, { status: 400 })
        const { data: maqsad } = await admin.from('profiles').select('role').eq('id', userId).single()
        if (maqsad?.role === 'admin') {
          const { count } = await admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin').eq('faol', true)
          if ((count ?? 0) <= 1) return NextResponse.json({ error: "Oxirgi faol adminni bloklab bo'lmaydi" }, { status: 400 })
        }
      }
      const { error } = await supabase.from('profiles').update({ faol }).eq('id', userId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      await yozAudit('faol_ozgartirish', { faol })
      return NextResponse.json({ ok: true })
    }

    case 'arxiv_ozgartirish': {
      const arxivlangan = !!body.arxivlangan
      const { error } = await supabase.from('profiles').update({ arxivlangan }).eq('id', userId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      await yozAudit('arxiv_ozgartirish', { arxivlangan })
      return NextResponse.json({ ok: true })
    }

    case 'obuna_berish': {
      const bosqich = body.bosqich as string
      const oylar = (body.oylar ?? null) as number | null
      if (!BOSQICHLAR.includes(bosqich)) return NextResponse.json({ error: "Noto'g'ri bosqich" }, { status: 400 })
      const tugashSanasi = oylar ? new Date(Date.now() + oylar * 30 * 24 * 60 * 60 * 1000).toISOString() : null
      const { error } = await supabase.from('obunalar').upsert(
        { student_id: userId, bosqich, faol: true, tugash_sanasi: tugashSanasi },
        { onConflict: 'student_id,bosqich' }
      )
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      await yozAudit('obuna_berish', { bosqich, oylar, tugash_sanasi: tugashSanasi })
      return NextResponse.json({ ok: true })
    }

    case 'obuna_bekor': {
      const bosqich = body.bosqich as string
      if (!BOSQICHLAR.includes(bosqich)) return NextResponse.json({ error: "Noto'g'ri bosqich" }, { status: 400 })
      const { error } = await supabase.from('obunalar').delete().eq('student_id', userId).eq('bosqich', bosqich)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      await yozAudit('obuna_bekor', { bosqich })
      return NextResponse.json({ ok: true })
    }

    default:
      return NextResponse.json({ error: "Noma'lum amal" }, { status: 400 })
  }
}
