import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { darsTop, type TestSavoli } from '@/lib/talim/darslar'

type YopiqSavol = TestSavoli & { vinyetka?: string }
type Urinish = { id: string; student_id: string; dars_slug: string; dars_nomi: string; savollar: YopiqSavol[]; tugash_at: string; yakunlangan_at: string | null; togri_son: number | null; jami_savol: number | null; foiz: number | null }

function aralashtir<T>(arr: T[]): T[] {
  const n = [...arr]
  for (let i = n.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [n[i], n[j]] = [n[j], n[i]] }
  return n
}

function savolniAralashtir(s: YopiqSavol): YopiqSavol {
  const variantlar = aralashtir(s.variantlar.map((matn, i) => ({ matn, togri: i === s.togri })))
  return { ...s, variantlar: variantlar.map((v) => v.matn), togri: variantlar.findIndex((v) => v.togri) }
}

function klientSavollari(savollar: YopiqSavol[]) {
  return savollar.map(({ savol, variantlar, vinyetka }) => ({ savol, variantlar, ...(vinyetka ? { vinyetka } : {}) }))
}

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const admin = createAdminClient()

  if (body.amal === 'boshlash') {
    const darsSlug = typeof body.darsSlug === 'string' ? body.darsSlug : ''
    if (!darsSlug) return NextResponse.json({ error: 'darsSlug kerak' }, { status: 400 })

    const { data: eskiNatija } = await admin.from('talim_natijalari').select('id').eq('student_id', user.id).eq('dars_slug', darsSlug).eq('turi', 'nazorat').limit(1).maybeSingle()
    if (eskiNatija) return NextResponse.json({ error: 'Nazorat allaqachon topshirilgan' }, { status: 409 })

    const { data: mavjud } = await admin.from('nazorat_urinishlari').select('*').eq('student_id', user.id).eq('dars_slug', darsSlug).maybeSingle()
    if (mavjud) {
      const u = mavjud as Urinish
      if (u.yakunlangan_at) return NextResponse.json({ error: 'Nazorat allaqachon yakunlangan' }, { status: 409 })
      return NextResponse.json({ urinishId: u.id, savollar: klientSavollari(u.savollar), tugashAt: u.tugash_at })
    }

    const { data: tarkib } = await admin.from('dars_tarkibi').select('nazorat_savollar, nazorat_savol_soni, nazorat_vaqt_daqiqa').eq('dars_slug', darsSlug).maybeSingle()
    const kodDars = darsTop(darsSlug)
    const bank = ((tarkib?.nazorat_savollar as YopiqSavol[] | null) ?? kodDars?.nazoratSavollar ?? [])
    if (!bank.length) return NextResponse.json({ error: "Nazorat savollari hali tayyor emas" }, { status: 404 })
    const soni = Math.min(tarkib?.nazorat_savol_soni ?? kodDars?.nazoratSavolSoni ?? 20, bank.length)
    const vaqt = tarkib?.nazorat_vaqt_daqiqa ?? kodDars?.nazoratVaqtDaqiqa ?? 15
    const savollar = aralashtir(bank).slice(0, soni).map(savolniAralashtir)
    const tugashAt = new Date(Date.now() + vaqt * 60_000).toISOString()
    const { data, error } = await admin.from('nazorat_urinishlari').insert({ student_id: user.id, dars_slug: darsSlug, dars_nomi: kodDars?.sarlavha ?? darsSlug, savollar, tugash_at: tugashAt }).select('id').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ urinishId: data.id, savollar: klientSavollari(savollar), tugashAt })
  }

  if (body.amal === 'topshirish') {
    const urinishId = typeof body.urinishId === 'string' ? body.urinishId : ''
    const javoblar = Array.isArray(body.javoblar) ? body.javoblar : []
    const { data } = await admin.from('nazorat_urinishlari').select('*').eq('id', urinishId).eq('student_id', user.id).single()
    if (!data) return NextResponse.json({ error: 'Urinish topilmadi' }, { status: 404 })
    const u = data as Urinish
    if (u.yakunlangan_at) return NextResponse.json({ togriSon: u.togri_son, jami: u.jami_savol, foiz: u.foiz })
    if (Date.now() > new Date(u.tugash_at).getTime() + 30_000) return NextResponse.json({ error: 'Nazorat vaqti tugagan' }, { status: 409 })
    if (javoblar.length !== u.savollar.length || javoblar.some((v: unknown) => v !== null && (!Number.isInteger(v) || (v as number) < 0))) return NextResponse.json({ error: "Javoblar noto'g'ri" }, { status: 400 })

    const togriSon = u.savollar.reduce((n, s, i) => n + (javoblar[i] === s.togri ? 1 : 0), 0)
    const jami = u.savollar.length
    const foiz = Math.round((togriSon / jami) * 100)
    const qoidabuzarlik = !!body.qoidabuzarlik
    const { data: yopildi } = await admin.from('nazorat_urinishlari').update({ yakunlangan_at: new Date().toISOString(), togri_son: togriSon, jami_savol: jami, foiz, qoidabuzarlik }).eq('id', u.id).is('yakunlangan_at', null).select('id').maybeSingle()
    if (!yopildi) return NextResponse.json({ error: 'Urinish allaqachon yakunlangan' }, { status: 409 })
    const { error } = await admin.from('talim_natijalari').insert({ student_id: user.id, dars_slug: u.dars_slug, dars_nomi: u.dars_nomi, togri_son: togriSon, jami_savol: jami, foiz, turi: 'nazorat', qoidabuzarlik })
    if (error) {
      await admin.from('nazorat_urinishlari').update({ yakunlangan_at: null, togri_son: null, jami_savol: null, foiz: null }).eq('id', u.id)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ togriSon, jami, foiz })
  }

  return NextResponse.json({ error: "Noma'lum amal" }, { status: 400 })
}
