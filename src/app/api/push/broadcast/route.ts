import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'

// Admin tomonidan ommaviy push yuborish: auditoriya bo'yicha (hammasi/student/doctor/patient)
// barcha push obunachilarga xabar jo'natadi va tarixga yozadi.
export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profil?.role !== 'admin') return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

  const { title, body, url, auditoriya } = await req.json()
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Sarlavha va matn majburiy' }, { status: 400 })
  }
  const aud = ['hammasi', 'student', 'doctor', 'patient'].includes(auditoriya) ? auditoriya : 'hammasi'

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  const admin = createAdminClient()

  // Auditoriyaga mos foydalanuvchilarning push obunalari
  let obunalarQuery = admin.from('push_obunalari').select('endpoint, p256dh, auth, user_id')
  if (aud !== 'hammasi') {
    const { data: userlar } = await admin.from('profiles').select('id').eq('role', aud)
    const idlar = (userlar ?? []).map((u) => u.id)
    if (idlar.length === 0) {
      return NextResponse.json({ ok: true, yuborildi: 0, qurilmalar: 0 })
    }
    obunalarQuery = obunalarQuery.in('user_id', idlar)
  }
  const { data: obunalar } = await obunalarQuery

  const payload = JSON.stringify({ title: title.trim(), body: body.trim(), url: url?.trim() || undefined })
  let yuborildi = 0
  for (const o of obunalar ?? []) {
    try {
      await webpush.sendNotification(
        { endpoint: o.endpoint, keys: { p256dh: o.p256dh, auth: o.auth } },
        payload
      )
      yuborildi++
    } catch (e: unknown) {
      const kod = (e as { statusCode?: number }).statusCode
      if (kod === 404 || kod === 410) {
        await admin.from('push_obunalari').delete().eq('endpoint', o.endpoint)
      }
    }
  }

  await admin.from('push_xabarlar').insert({
    admin_id: user.id,
    title: title.trim(),
    body: body.trim(),
    url: url?.trim() || null,
    auditoriya: aud,
    yuborildi,
  })

  return NextResponse.json({ ok: true, yuborildi, qurilmalar: obunalar?.length ?? 0 })
}
