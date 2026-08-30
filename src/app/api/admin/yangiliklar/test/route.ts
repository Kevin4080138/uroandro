import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { kunlikYangilikIshiniBajar } from '@/lib/newsRun'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Tizimga kirilmagan' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ ok: false, error: "Ruxsat yo'q" }, { status: 403 })

    const result = await kunlikYangilikIshiniBajar(true)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Noma’lum xato'
    console.error(`[daily-news][admin-test] ${message}`)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
