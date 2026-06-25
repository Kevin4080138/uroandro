import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { vaqtJadvali, faolKunMi } from '@/lib/doriEslatma'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

function tashkentVaqt() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
  const parts = fmt.formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value
  return { sana: `${get('year')}-${get('month')}-${get('day')}`, hhmm: `${get('hour')}:${get('minute')}` }
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

    // Bir martalik yuborishni kafolatlash (unique constraint orqali himoyalangan)
    const { error: insertError } = await supabase.from('dori_eslatma_yuborilgan').insert({
      retsept_id: r.id, sana, vaqt_tartibi: vaqtTartibi,
    })
    if (insertError) continue

    const { data: obunalar } = await supabase.from('push_obunalari').select('*').eq('user_id', r.bemor_user_id)
    for (const o of obunalar ?? []) {
      try {
        await webpush.sendNotification(
          { endpoint: o.endpoint, keys: { p256dh: o.p256dh, auth: o.auth } },
          JSON.stringify({
            title: '💊 Dori vaqti keldi',
            body: `${r.nomi}${r.dozasi ? ' — ' + r.dozasi : ''} ichish vaqti keldi`,
            url: '/patient/dorilarim',
          })
        )
        yuborildi++
      } catch (e: any) {
        if (e.statusCode === 404 || e.statusCode === 410) {
          await supabase.from('push_obunalari').delete().eq('endpoint', o.endpoint)
        }
      }
    }
  }

  return NextResponse.json({ ok: true, vaqt: hhmm, tekshirildi, yuborildi })
}
