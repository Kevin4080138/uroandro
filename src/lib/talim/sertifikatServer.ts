import { createAdminClient } from '@/lib/supabaseAdmin'
import { DARSLAR } from '@/lib/talim/darslar'
import { darsHolati, type DarsHolati, type NatijaYozuvi } from '@/lib/talim/sertifikat'

// Talabaning har bir dars bo'yicha holatini serverda hisoblaydi.
//
// Bu ataylab serverda turadi: hisob uchun `dars_tarkibi` dagi nazorat banklari kerak,
// ular esa og'ir JSON. Clientga faqat hisob natijasi (kichik ob'ekt) boradi —
// darslar.ts ni bazaga ko'chirishdagi mantiq bu yerda ham saqlanadi.
export async function foydalanuvchiHolatlari(userId: string): Promise<Map<string, DarsHolati>> {
  const admin = createAdminClient()

  const [{ data: natijalar }, { data: qadamlar }, { data: tarkiblar }] = await Promise.all([
    admin.from('talim_natijalari').select('dars_slug, foiz, turi').eq('student_id', userId),
    admin.from('dars_qadam_progress').select('dars_slug, qadam').eq('student_id', userId),
    admin.from('dars_tarkibi').select('dars_slug, nazorat_savollar, sertifikat_otish_foizi'),
  ])

  const qadamMap = new Map<string, Set<string>>()
  for (const q of qadamlar ?? []) {
    const s = qadamMap.get(q.dars_slug) ?? new Set<string>()
    s.add(q.qadam)
    qadamMap.set(q.dars_slug, s)
  }

  const nazoratBor = new Map<string, boolean>()
  const otishFoizi = new Map<string, number>()
  for (const t of tarkiblar ?? []) {
    nazoratBor.set(t.dars_slug, Array.isArray(t.nazorat_savollar) && t.nazorat_savollar.length > 0)
    otishFoizi.set(t.dars_slug, t.sertifikat_otish_foizi ?? 70)
  }

  const holatlar = new Map<string, DarsHolati>()
  for (const d of DARSLAR) {
    holatlar.set(d.slug, darsHolati(
      d.slug,
      (natijalar ?? []) as NatijaYozuvi[],
      qadamMap.get(d.slug),
      nazoratBor.get(d.slug) ?? false,
      otishFoizi.get(d.slug) ?? 70
    ))
  }
  return holatlar
}
