import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { xabarYubor } from '@/lib/xabarYubor'

// Admin bitta talabaga push yuboradi (masalan, xavf zonasidagi sust talabaga eslatma).
export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profil?.role !== 'admin') return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

  const { userId, title, body, url } = await req.json()
  if (!userId || !title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "userId, title va body majburiy" }, { status: 400 })
  }

  const yuborildi = await xabarYubor(userId, {
    title: title.trim(),
    body: body.trim(),
    url: url?.trim() || undefined,
  })

  return NextResponse.json({ ok: true, yuborildi })
}
