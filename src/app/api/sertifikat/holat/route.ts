import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { boblarHolati, bosqichlarHolati } from '@/lib/talim/sertifikat'
import { foydalanuvchiHolatlari } from '@/lib/talim/sertifikatServer'

// Sertifikatlar sahifasi uchun yig'ma holat. Og'ir hisob serverda bajariladi,
// clientga faqat kichik xulosa boradi.
export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })

  const admin = createAdminClient()
  const [holatlar, { data: mavjud }, { data: profil }] = await Promise.all([
    foydalanuvchiHolatlari(user.id),
    admin.from('sertifikatlar')
      .select('kod, turi, bosqich, kategoriya, created_at, bekor_qilingan')
      .eq('student_id', user.id),
    admin.from('profiles').select('full_name, ism_qulflangan').eq('id', user.id).maybeSingle(),
  ])

  return NextResponse.json({
    bosqichlar: bosqichlarHolati(holatlar),
    boblar: boblarHolati(holatlar),
    mavjud: mavjud ?? [],
    ism: profil?.full_name ?? '',
    ismQulflangan: !!profil?.ism_qulflangan,
  })
}
