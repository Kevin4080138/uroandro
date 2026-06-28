import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'

// Foydalanuvchining o'zi o'z hisobini butunlay o'chiradi (admin paneldagidan farqli — bu yerda faqat o'zini o'chirish mumkin).
// Xavfsizlik: o'chirish irreversible amal bo'lgani uchun, sessiya o'g'irlangan taqdirda ham
// hisobni o'chira olmasligi uchun parolni qayta tasdiqlashni talab qilamiz.
export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { password } = await req.json().catch(() => ({ password: '' }))
  if (!password) return NextResponse.json({ error: 'Parolni kiriting' }, { status: 400 })

  // Parolni tasdiqlash uchun mustaqil (cookie'siz) klient — joriy sessiyaga ta'sir qilmaydi.
  const verifyClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { error: verifyError } = await verifyClient.auth.signInWithPassword({ email: user.email, password })
  if (verifyError) return NextResponse.json({ error: "Parol noto'g'ri" }, { status: 401 })

  const admin = createAdminClient()
  await admin.from('profiles').delete().eq('id', user.id)
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
