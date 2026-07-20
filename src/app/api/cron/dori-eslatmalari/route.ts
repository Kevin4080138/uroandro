import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { xabarYubor } from '@/lib/xabarYubor'
import { sozlamaYoqilganmi } from '@/lib/bildirishnoma'
import { vaqtJadvali, faolKunMi } from '@/lib/doriEslatma'

function tashkentVaqt() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
  const parts = fmt.formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value
  return { sana: `${get('year')}-${get('month')}-${get('day')}`, hhmm: `${get('hour')}:${get('minute')}` }
}

function kunFarqi(sana1: string, sana2: string) {
  const a = new Date(sana1); a.setHours(0, 0, 0, 0)
  const b = new Date(sana2); b.setHours(0, 0, 0, 0)
  return Math.round((a.getTime() - b.getTime()) / (24 * 3600 * 1000))
}

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { sana, hhmm } = tashkentVaqt()

  const { data: retseptlar } = await supabase
    .from('dori_retseptlari')
    .select('*')
    .eq('faol', true)
    .not('bemor_user_id', 'is', null)

  let yuborildi = 0
  let tekshirildi = 0
  let tugashEslatmasi = 0

  for (const r of retseptlar ?? []) {
    if (!faolKunMi(r.boshlanish_sanasi, r.muddat_kun)) continue
    const vaqtlar = vaqtJadvali(r.kuniga_marta)
    const idx = vaqtlar.findIndex((v) => v === hhmm)
    if (idx === -1) continue
    tekshirildi++
    const vaqtTartibi = idx + 1

    // Allaqachon qabul qilingan bo'lsa eslatma yubormaymiz
    const { data: qabul } = await supabase
      .from('dori_qabullari')
      .select('id')
      .eq('retsept_id', r.id).eq('sana', sana).eq('vaqt_tartibi', vaqtTartibi)
      .maybeSingle()
    if (qabul) continue

    // Bemor dori eslatmasini o'chirgan bo'lsa — yubormaymiz
    if (!(await sozlamaYoqilganmi(r.bemor_user_id, 'dori'))) continue

    // Bir martalik yuborishni kafolatlash (unique constraint orqali himoyalangan)
    const { error: insertError } = await supabase.from('dori_eslatma_yuborilgan').insert({
      retsept_id: r.id, sana, vaqt_tartibi: vaqtTartibi,
    })
    if (insertError) continue

    // Kursning so'nggi kuni ekanini aniqlash — eslatma matniga qo'shamiz
    const tugashKuni = new Date(r.boshlanish_sanasi)
    tugashKuni.setDate(tugashKuni.getDate() + r.muddat_kun - 1)
    const oxirgiKun = kunFarqi(tugashKuni.toISOString().slice(0, 10), sana) === 0

    yuborildi += await xabarYubor(r.bemor_user_id, {
      title: oxirgiKun ? '💊 Dorining oxirgi kuni!' : '💊 Dori vaqti keldi',
      body: `${r.nomi}${r.dozasi ? ' — ' + r.dozasi : ''} ichish vaqti keldi${oxirgiKun ? " (kursning so'nggi kuni)" : ''}`,
      url: '/patient/dorilarim',
    })
  }

  // Ertaga tugaydigan kurslar haqida bir martalik eslatma (faqat kuniga 1 marta — soat 09:00 da tekshiramiz)
  if (hhmm === '09:00') {
    for (const r of retseptlar ?? []) {
      const tugashKuni = new Date(r.boshlanish_sanasi)
      tugashKuni.setDate(tugashKuni.getDate() + r.muddat_kun - 1)
      const tugashSanaStr = tugashKuni.toISOString().slice(0, 10)
      const ertangiSana = new Date(sana)
      ertangiSana.setDate(ertangiSana.getDate() + 1)
      if (tugashSanaStr !== ertangiSana.toISOString().slice(0, 10)) continue
      if (!(await sozlamaYoqilganmi(r.bemor_user_id, 'dori'))) continue

      const { error: insertError } = await supabase.from('dori_eslatma_yuborilgan').insert({
        retsept_id: r.id, sana, vaqt_tartibi: 0, // 0 — "ertaga tugaydi" eslatmasi belgisi
      })
      if (insertError) continue

      tugashEslatmasi += await xabarYubor(r.bemor_user_id, {
        title: '⏳ Dori kursi ertaga tugaydi',
        body: `${r.nomi} kursi ertaga (${tugashSanaStr}) tugaydi`,
        url: '/patient/dorilarim',
      })
    }
  }

  return NextResponse.json({ ok: true, vaqt: hhmm, tekshirildi, yuborildi, tugashEslatmasi })
}
