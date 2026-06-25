import { createClient } from '@/lib/supabase'

// Telefon raqamlarni solishtirish uchun normallashtirish — faqat raqamlarni qoldiradi
// va oxirgi 9 ta raqamni oladi (O'zbekiston mobil raqami), formatlash farqlaridan qat'i nazar mos topish uchun.
export function telefonNormallashtir(telefon: string | null | undefined): string {
  return (telefon ?? '').replace(/\D/g, '').slice(-9)
}

// Bemorning telefon raqami orqali ro'yxatdan o'tgan bemor hisobini (profiles.id) topadi.
export async function bemorHisobiniTop(supabase: ReturnType<typeof createClient>, telefon: string | null | undefined): Promise<string | null> {
  const raqam = telefonNormallashtir(telefon)
  if (!raqam) return null

  const { data: nomzodlar } = await supabase.from('profiles').select('id, telefon').eq('role', 'patient')
  const mos = (nomzodlar ?? []).find((p: any) => telefonNormallashtir(p.telefon) === raqam)
  return mos?.id ?? null
}
