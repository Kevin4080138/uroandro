import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { foydalanuvchigaPushYubor } from '@/lib/pushSend'
import { POSTOP_JADVALI } from '@/lib/operatsiyalar'

function tashkentSana() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit',
  })
  const parts = fmt.formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value
  return `${get('year')}-${get('month')}-${get('day')}`
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
  const bugun = tashkentSana()

  // Faqat push yuborish mumkin bo'lgan (bemor hisobi bog'langan) kuzatuvlar
  const { data: kuzatuvlar } = await supabase
    .from('operatsiya_kuzatuvi')
    .select('id, bemor_user_id, operatsiya_nomi, operatsiya_sanasi')
    .not('bemor_user_id', 'is', null)

  let yuborildi = 0
  let mosBosqich = 0

  for (const k of kuzatuvlar ?? []) {
    const otganKun = kunFarqi(bugun, k.operatsiya_sanasi)
    if (otganKun < 0) continue // sana kelajakda

    const bosqich = POSTOP_JADVALI.find((b) => b.kun === otganKun)
    if (!bosqich) continue
    mosBosqich++

    // Bir martalik yuborishni kafolatlash (UNIQUE constraint orqali himoyalangan)
    const { error: insertError } = await supabase
      .from('operatsiya_eslatma_yuborilgan')
      .insert({ kuzatuv_id: k.id, bosqich: bosqich.kalit })
    if (insertError) continue // allaqachon yuborilgan

    yuborildi += await foydalanuvchigaPushYubor(k.bemor_user_id, {
      title: `🩹 ${bosqich.sarlavha}`,
      body: `${k.operatsiya_nomi}: ${bosqich.matn}`,
      url: '/patient/operatsiya-kuzatuvim',
    })
  }

  return NextResponse.json({ ok: true, sana: bugun, mosBosqich, yuborildi })
}
