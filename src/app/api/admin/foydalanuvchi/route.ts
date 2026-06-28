import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { telefonToEmail } from '@/lib/patientAuth'

export async function PATCH(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profil?.role !== 'admin') return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

  const { userId, email, telefon, parol } = await req.json()
  if (!userId) return NextResponse.json({ error: "userId yo'q" }, { status: 400 })

  const admin = createAdminClient()
  const updateBody: { email?: string; password?: string } = {}
  if (email) updateBody.email = email
  if (telefon) updateBody.email = telefonToEmail(telefon) // bemor uchun texnik email telefon asosida hosil qilinadi
  if (parol) updateBody.password = parol

  if (Object.keys(updateBody).length > 0) {
    const { error } = await admin.auth.admin.updateUserById(userId, updateBody)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (telefon) {
    await admin.from('profiles').update({ telefon }).eq('id', userId)
  }
  if (email) {
    await admin.from('profiles').update({ email }).eq('id', userId)
  }

  return NextResponse.json({ ok: true })
}
