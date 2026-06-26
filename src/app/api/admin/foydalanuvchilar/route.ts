import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profil?.role !== 'admin') return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

  const admin = createAdminClient()
  const emaillar: Record<string, string> = {}
  let sahifa = 1
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page: sahifa, perPage: 1000 })
    if (error || !data) break
    for (const u of data.users) emaillar[u.id] = u.email ?? ''
    if (data.users.length < 1000) break
    sahifa++
  }

  return NextResponse.json({ emaillar })
}
