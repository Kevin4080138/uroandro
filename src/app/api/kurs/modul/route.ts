import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { modulgaKirishBormi, foydalanuvchiAdminMi, type KirishSabab } from '@/lib/kurs/kirish'

// Modul mashq markazi uchun XULOSA — qaysi bo'limlar mavjudligini (adaptiv
// kartalar uchun) va case ro'yxatini beradi. `togri`/`izoh`/`bosqichlar`
// mazmuni HECH QACHON chiqmaydi — faqat sanoq va sarlavha.

function kirishStatus(sabab?: KirishSabab): number {
  if (sabab === 'modul-topilmadi') return 404
  if (sabab === 'db-xato') return 500
  return 403
}

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "So'rov noto'g'ri" }, { status: 400 })
  }
  const rec = (body ?? {}) as Record<string, unknown>
  const modulId = typeof rec.modul_id === 'string' ? rec.modul_id.trim() : ''
  if (!modulId) return NextResponse.json({ error: "modul_id ko'rsatilmagan" }, { status: 400 })

  const admin = createAdminClient()
  const adminMi = await foydalanuvchiAdminMi(admin, user.id)
  const kirish = await modulgaKirishBormi(admin, user.id, modulId, { adminMi })
  if (!kirish.ruxsat) {
    return NextResponse.json({ error: 'Modulga kirish yo‘q', sabab: kirish.sabab }, { status: kirishStatus(kirish.sabab) })
  }

  // Modul meta
  const { data: modulData } = await admin
    .from('kurs_modullar').select('id, nom, bosqich, holat').eq('id', modulId).maybeSingle()
  const modul = modulData as { id: string; nom: string; bosqich: string; holat: string } | null
  if (!modul) return NextResponse.json({ error: 'Modul topilmadi' }, { status: 404 })

  // Bank sanoqlari (head: true — faqat count, mazmun emas)
  const [flashRes, testRes, usmleRes, caseRes] = await Promise.all([
    admin.from('kurs_flashcardlar').select('id', { count: 'exact', head: true }).eq('modul_id', modulId),
    admin.from('kurs_savollar').select('id', { count: 'exact', head: true }).eq('modul_id', modulId).eq('tur', 'test'),
    admin.from('kurs_savollar').select('id', { count: 'exact', head: true }).eq('modul_id', modulId).eq('tur', 'usmle'),
    admin.from('kurs_caselar').select('id, sarlavha, bosqichlar').eq('modul_id', modulId).order('sort_order', { ascending: true }),
  ])

  const caselar = ((caseRes.data as { id: string; sarlavha: string; bosqichlar: unknown }[] | null) ?? [])
    .map((c) => ({ id: c.id, sarlavha: c.sarlavha, jami: Array.isArray(c.bosqichlar) ? c.bosqichlar.length : 0 }))
    .filter((c) => c.jami > 0)

  return NextResponse.json({
    ok: true,
    modul: { id: modul.id, nom: modul.nom, bosqich: modul.bosqich, holat: modul.holat },
    banklar: {
      flashcard: flashRes.count ?? 0,
      test: testRes.count ?? 0,
      usmle: usmleRes.count ?? 0,
    },
    caselar,
  })
}
