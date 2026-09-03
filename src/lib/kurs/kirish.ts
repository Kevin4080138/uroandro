import type { SupabaseClient } from '@supabase/supabase-js'

// Kurs kirish nazorati — SERVER tomonida (route'larda) ishlatiladi.
// `togri` javoblar yoki draft kontent hech qachon shu yerdan sizmaydi:
// helper faqat "ruxsat bor/yo'q" qaytaradi, kontentni emas.

export type KursBosqich = 'oson' | 'orta' | 'qiyin'

// kurs_darslar/kurs_modullar.bosqich ('orta') → obunalar.bosqich ("o'rta").
// Noma'lum qiymat → null (FAIL-CLOSED: chaqiruvchi kirishni rad etadi).
const OBUNA_BOSQICH: Record<KursBosqich, string> = {
  oson: 'oson',
  orta: "o'rta",
  qiyin: 'qiyin',
}

export function bosqichMap(bosqich: string): string | null {
  if (bosqich === 'oson' || bosqich === 'orta' || bosqich === 'qiyin') {
    return OBUNA_BOSQICH[bosqich]
  }
  return null
}

type DarsRow = {
  id: string
  faol: boolean
  bepul_namuna: boolean
  modul_id: string | null
  bosqich: string
}

type ModulRow = {
  id: string
  holat: string
  bepul: boolean
  bosqich: string
}

export type KirishSabab =
  | 'dars-topilmadi'
  | 'modul-topilmadi'
  | 'modul-nashr-emas'
  | 'dars-faol-emas'
  | 'bosqich-notogri'
  | 'obuna-yoq'
  | 'db-xato'

export type KirishNatija = {
  ruxsat: boolean
  sabab?: KirishSabab
  dars?: DarsRow
  modul?: ModulRow
}

// Foydalanuvchi admin (RLS/UI bypass) ekanini profiles.role dan aniqlaydi.
export async function foydalanuvchiAdminMi(
  admin: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await admin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()
  return (data as { role?: string } | null)?.role === 'admin'
}

// Server-authoritative kirish:
//   admin → doim ruxsat.
//   aks holda NASHR DARVOZASI: modul holat='nashr' VA dars faol=true.
//   so'ng KIRISH HUQUQI: modul bepul YOKI dars bepul_namuna YOKI shu bosqichga
//   faol obuna (muddati o'tmagan).
export async function darsgaKirishBormi(
  admin: SupabaseClient,
  userId: string,
  darsId: string,
  opts: { adminMi: boolean }
): Promise<KirishNatija> {
  const { data: darsData, error: darsErr } = await admin
    .from('kurs_darslar')
    .select('id, faol, bepul_namuna, modul_id, bosqich')
    .eq('id', darsId)
    .maybeSingle()
  if (darsErr) return { ruxsat: false, sabab: 'db-xato' }
  const dars = darsData as DarsRow | null
  if (!dars) return { ruxsat: false, sabab: 'dars-topilmadi' }

  let modul: ModulRow | undefined
  if (dars.modul_id) {
    const { data: modulData, error: modulErr } = await admin
      .from('kurs_modullar')
      .select('id, holat, bepul, bosqich')
      .eq('id', dars.modul_id)
      .maybeSingle()
    if (modulErr) return { ruxsat: false, sabab: 'db-xato', dars }
    modul = (modulData as ModulRow | null) ?? undefined
  }

  if (opts.adminMi) return { ruxsat: true, dars, modul }

  // Nashr darvozasi — draft modul yoki nofaol dars hech kimga ochilmaydi
  if (!modul || modul.holat !== 'nashr') {
    return { ruxsat: false, sabab: 'modul-nashr-emas', dars, modul }
  }
  if (!dars.faol) {
    return { ruxsat: false, sabab: 'dars-faol-emas', dars, modul }
  }

  // Kirish huquqi
  if (modul.bepul || dars.bepul_namuna) {
    return { ruxsat: true, dars, modul }
  }

  const obunaBosqich = bosqichMap(modul.bosqich)
  if (!obunaBosqich) {
    // Noma'lum bosqich — fail-closed
    return { ruxsat: false, sabab: 'bosqich-notogri', dars, modul }
  }

  const { data: obunaData, error: obunaErr } = await admin
    .from('obunalar')
    .select('tugash_sanasi')
    .eq('student_id', userId)
    .eq('bosqich', obunaBosqich)
    .eq('faol', true)
  if (obunaErr) return { ruxsat: false, sabab: 'db-xato', dars, modul }
  const obunalar = (obunaData as { tugash_sanasi: string | null }[] | null) ?? []
  const faolObuna = obunalar.some(
    (o) => !o.tugash_sanasi || new Date(o.tugash_sanasi) > new Date()
  )
  if (faolObuna) return { ruxsat: true, dars, modul }

  return { ruxsat: false, sabab: 'obuna-yoq', dars, modul }
}

export type ModulKirishNatija = {
  ruxsat: boolean
  sabab?: KirishSabab
  modul?: ModulRow
}

// Modul darajasidagi kirish (modul test/USMLE/case uchun):
//   admin → doim ruxsat. Aks holda modul holat='nashr', so'ng bepul YOKI faol obuna.
export async function modulgaKirishBormi(
  admin: SupabaseClient,
  userId: string,
  modulId: string,
  opts: { adminMi: boolean }
): Promise<ModulKirishNatija> {
  const { data: modulData, error: modulErr } = await admin
    .from('kurs_modullar')
    .select('id, holat, bepul, bosqich')
    .eq('id', modulId)
    .maybeSingle()
  if (modulErr) return { ruxsat: false, sabab: 'db-xato' }
  const modul = (modulData as ModulRow | null) ?? undefined
  if (!modul) return { ruxsat: false, sabab: 'modul-topilmadi' }

  if (opts.adminMi) return { ruxsat: true, modul }

  if (modul.holat !== 'nashr') return { ruxsat: false, sabab: 'modul-nashr-emas', modul }
  if (modul.bepul) return { ruxsat: true, modul }

  const obunaBosqich = bosqichMap(modul.bosqich)
  if (!obunaBosqich) return { ruxsat: false, sabab: 'bosqich-notogri', modul }

  const { data: obunaData, error: obunaErr } = await admin
    .from('obunalar')
    .select('tugash_sanasi')
    .eq('student_id', userId)
    .eq('bosqich', obunaBosqich)
    .eq('faol', true)
  if (obunaErr) return { ruxsat: false, sabab: 'db-xato', modul }
  const obunalar = (obunaData as { tugash_sanasi: string | null }[] | null) ?? []
  const faolObuna = obunalar.some(
    (o) => !o.tugash_sanasi || new Date(o.tugash_sanasi) > new Date()
  )
  if (faolObuna) return { ruxsat: true, modul }
  return { ruxsat: false, sabab: 'obuna-yoq', modul }
}
