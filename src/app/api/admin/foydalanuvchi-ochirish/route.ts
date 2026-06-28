import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profil?.role !== 'admin') return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: "userId yo'q" }, { status: 400 })
  if (userId === user.id) return NextResponse.json({ error: "O'zingizni o'chira olmaysiz" }, { status: 400 })

  const admin = createAdminClient()
  const { data: maqsadProfil } = await admin.from('profiles').select('full_name, role, email, telefon').eq('id', userId).single()

  await admin.from('profiles').delete().eq('id', userId)
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await admin.from('admin_audit_log').insert({
    admin_id: user.id,
    amal: "foydalanuvchi_ochirish",
    maqsad_user_id: userId,
    tafsilot: maqsadProfil ?? null,
  })

  return NextResponse.json({ ok: true })
}
