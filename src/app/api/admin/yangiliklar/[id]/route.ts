import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { yangilikBannergaChiqar, yangilikBannerVaTelegram, yangilikTelegramgaYubor, yangilikniQaytaribOl } from '@/lib/newsPublish'

async function adminTekshir() {
  const client = await createServerSupabase()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return false
  const { data } = await client.from('profiles').select('role').eq('id', user.id).single()
  return data?.role === 'admin'
}
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await adminTekshir()) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const { id } = await params
  const body = await req.json() as { action?: string; umumiyBanner?: boolean }
  const admin = createAdminClient()
  try {
    if (body.action === 'banner') return NextResponse.json({ ok: true, ...(await yangilikBannergaChiqar(id, { umumiyBanner: body.umumiyBanner })) })
    if (body.action === 'telegram') return NextResponse.json({ ok: true, ...(await yangilikTelegramgaYubor(id)) })
    if (body.action === 'resend') return NextResponse.json({ ok: true, ...(await yangilikTelegramgaYubor(id, { resendTelegram: true })) })
    if (body.action === 'publish') return NextResponse.json({ ok: true, ...(await yangilikBannerVaTelegram(id, { umumiyBanner: body.umumiyBanner })) })
    if (body.action === 'unpublish') return NextResponse.json({ ok: true, ...(await yangilikniQaytaribOl(id)) })
    if (body.action === 'approve') {
      const { error } = await admin.from('yangiliklar').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'reject') {
      const { error } = await admin.from('yangiliklar').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Noma’lum amal' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Xatolik'
    console.error(`[daily-news][admin-action] action=${body.action ?? 'unknown'} news_id=${id} ${message}`)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
