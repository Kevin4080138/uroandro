import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { kunlikYangilikIshiniBajar } from '@/lib/newsRun'

export const maxDuration = 300

export async function POST() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

  try {
    const result = await kunlikYangilikIshiniBajar(true)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Noma’lum xato' }, { status: 500 })
  }
}
