import webpush from 'web-push'
import { createAdminClient } from '@/lib/supabaseAdmin'

let sozlangan = false
function vapidSozla() {
  if (sozlangan) return
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )
  sozlangan = true
}

export async function foydalanuvchigaPushYubor(userId: string, payload: { title: string; body: string; url?: string }) {
  vapidSozla()
  const supabase = createAdminClient()
  const { data: obunalar } = await supabase.from('push_obunalari').select('*').eq('user_id', userId)

  let yuborildi = 0
  for (const o of obunalar ?? []) {
    try {
      await webpush.sendNotification(
        { endpoint: o.endpoint, keys: { p256dh: o.p256dh, auth: o.auth } },
        JSON.stringify(payload)
      )
      yuborildi++
    } catch (e: any) {
      if (e.statusCode === 404 || e.statusCode === 410) {
        await supabase.from('push_obunalari').delete().eq('endpoint', o.endpoint)
      }
    }
  }
  return yuborildi
}
