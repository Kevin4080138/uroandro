import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import * as XLSX from 'xlsx'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const mavzu = searchParams.get('mavzu') ?? 'varikotsele'

  // Barcha bemorlar + natijalar + so'nggi tashrif
  const [{ data: bemorlar }, { data: natijalar }, { data: tashriflar }] = await Promise.all([
    supabase.from('bemorlar').select('id, fio, tugilgan_sana, jinsi, manzil, telefon').eq('created_by', user.id),
    supabase.from('bemor_natijalar').select('bemor_id, malumot, yangilangan').eq('doctor_id', user.id).eq('mavzu', mavzu),
    supabase.from('tashriflar').select('bemor_id, sana, daraja, tomon, vena_diametri, reflux, sperm_konts, sperm_harakat, sperm_morf, testosteron, fsh, lh, tavsiya').eq('doctor_id', user.id).order('sana', { ascending: false }),
  ])

  // Har bir bemor uchun so'nggi tashrifni topamiz
  const tashrifMap: Record<string, any> = {}
  for (const t of tashriflar ?? []) {
    if (!tashrifMap[t.bemor_id]) tashrifMap[t.bemor_id] = t
  }
  const natijalarMap: Record<string, any> = {}
  for (const n of natijalar ?? []) natijalarMap[n.bemor_id] = n.malumot

  const yosh = (sana: string) => {
    if (!sana) return ''
    const yil = new Date().getFullYear() - new Date(sana).getFullYear()
    return String(yil)
  }

  // Mavzuga qarab ustunlar
  const qatorlar = (bemorlar ?? []).map((b: any) => {
    const t = tashrifMap[b.id] ?? {}
    const n = natijalarMap[b.id] ?? {}
    const base = {
      'FIO': b.fio,
      'Yosh': yosh(b.tugilgan_sana),
      'Manzil': b.manzil ?? '',
      'Tashxis': mavzu,
    }

    if (mavzu === 'varikotsele') return {
      ...base,
      'Tomon': t.tomon ?? '',
      'Daraja': t.daraja ?? '',
      'Vena diametri (mm)': t.vena_diametri ?? '',
      'Reflux': t.reflux ?? '',
      'Sperm konts. oldin (mln/ml)': t.sperm_konts ?? '',
      'Progressiv harakat oldin (%)': t.sperm_harakat ?? '',
      'Normal morfologiya oldin (%)': t.sperm_morf ?? '',
      'Testosteron oldin (nmol/L)': t.testosteron ?? '',
      'FSH': t.fsh ?? '',
      'LH': t.lh ?? '',
      'Operatsiya turi': n.operatsiya_turi ?? '',
      'Operatsiya sanasi': n.operatsiya_sanasi ?? '',
      'Anesteziya': n.anesteziya ?? '',
      'Sperm konts. keyin (mln/ml)': n.sperm_konts_keyin ?? '',
      'Progressiv harakat keyin (%)': n.sperm_harakat_keyin ?? '',
      'Normal morfologiya keyin (%)': n.sperm_morf_keyin ?? '',
      'Testosteron keyin (nmol/L)': n.testosteron_keyin ?? '',
      'Kuzatuv (oy)': n.kuzatuv_oyi ?? '',
      'Retsidiv': n.retsidiv ?? '',
      'Gidrotsele': n.gidrotsele ?? '',
      'Homiladorlik': n.homiladorlik ?? '',
      'Umumiy natija': n.umumiy_natija ?? '',
      'Izoh': n.izoh ?? '',
    }

    if (mavzu === 'bph') return {
      ...base,
      'Davolash turi': n.davolash_turi ?? '',
      'Operatsiya sanasi': n.operatsiya_sanasi ?? '',
      'IPSS oldin': n.ipss_oldin ?? '',
      'IPSS keyin': n.ipss_keyin ?? '',
      'Qmax oldin (ml/s)': n.qmax_oldin ?? '',
      'Qmax keyin (ml/s)': n.qmax_keyin ?? '',
      'Qoldiq siydik oldin (ml)': n.qoldiq_oldin ?? '',
      'Qoldiq siydik keyin (ml)': n.qoldiq_keyin ?? '',
      'Kuzatuv (oy)': n.kuzatuv_oyi ?? '',
      'Asorat': n.asorat ?? '',
      'Umumiy natija': n.umumiy_natija ?? '',
      'Izoh': n.izoh ?? '',
    }

    return {
      ...base,
      ...Object.fromEntries(Object.entries(n).map(([k, v]) => [k, String(v ?? '')])),
    }
  })

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(qatorlar)

  // Ustun kengligini avtomatik moslashtirish
  const colWidths = Object.keys(qatorlar[0] ?? {}).map((k) => ({
    wch: Math.max(k.length, ...qatorlar.map((r: any) => String(r[k] ?? '').length), 8)
  }))
  ws['!cols'] = colWidths

  XLSX.utils.book_append_sheet(wb, ws, mavzu.toUpperCase())

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${mavzu}-statistika-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  })
}
