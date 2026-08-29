import { createAdminClient } from '@/lib/supabaseAdmin'
import { xabarYubor } from '@/lib/xabarYubor'

/**
 * Eslatma yuborishning yagona nuqtasi — sozlama, takrorlanish va kunlik
 * chegara shu yerda tekshiriladi.
 *
 * Nega kerak: bot orqali kuniga bir nechta xabar kelsa foydalanuvchi botni
 * o'chiradi, keyin muhim xabar ham yetib bormaydi. Har bir cron o'zicha
 * yuboraversa, bu chegarani nazorat qilib bo'lmaydi.
 *
 * `xabarYubor` esa quyi qatlam bo'lib qoladi: u shunchaki push + Telegramga
 * uzatadi. Hodisaga bog'liq shoshilinch xabarlar (shifokor javobi, yangi
 * retsept) avvalgidek to'g'ridan-to'g'ri `xabarYubor` ni chaqiraveradi.
 */

export type EslatmaTuri =
  | 'navbat'       // bemorga: ertaga navbatingiz bor
  | 'navbat_shifokor'
  | 'dori'
  | 'operatsiya'
  | 'seriya'
  | 'takrorlash'
  | 'yarim_dars'
  | 'murojaat'
  | 'javobsiz_murojaat'
  | 'yangilik'

/** Jurnaldagi `turi` → sozlamalar jadvalidagi ustun */
const SOZLAMA_USTUNI: Record<EslatmaTuri, string> = {
  navbat: 'navbat',
  navbat_shifokor: 'navbat',
  dori: 'dori',
  operatsiya: 'operatsiya',
  seriya: 'seriya',
  takrorlash: 'takrorlash',
  yarim_dars: 'yarim_dars',
  murojaat: 'murojaat',
  javobsiz_murojaat: 'murojaat',
  yangilik: 'yangilik',
}

export type Natija = 'yuborildi' | 'ochirilgan' | 'takror' | 'kunlik_limit' | 'xato'

export function bugunToshkent(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}

/** Toshkent sanasiga kun qo'shadi/ayiradi. */
export function sanaSurish(sana: string, kun: number): string {
  const d = new Date(`${sana}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + kun)
  return d.toISOString().slice(0, 10)
}

/**
 * Faqat sozlama tekshiruvi — o'z dedup mexanizmi bor eski cronlar uchun.
 *
 * `dori-eslatmalari`, `operatsiya-eslatmalari` va `kunlik-seriya` allaqachon
 * o'z jadvallari orqali takrorlanishdan himoyalangan (masalan dori kuniga
 * bir necha marta, har doza uchun alohida yuboriladi). Ularni to'liq
 * `eslatmaYubor` ga o'tkazish bu mantiqni buzardi — shuning uchun ular
 * faqat shu tekshiruvni qo'shadi.
 */
export async function sozlamaYoqilganmi(userId: string, turi: EslatmaTuri): Promise<boolean> {
  const supabase = createAdminClient()
  const ustun = SOZLAMA_USTUNI[turi]
  // Ustun nomi o'zgaruvchida bo'lgani uchun `select('*')` — dinamik nom
  // bilan Supabase tip xulosasi ishlamaydi.
  const { data } = await supabase
    .from('bildirishnoma_sozlamalari')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (!data) return true // sozlama yaratilmagan — hammasi yoqilgan
  return (data as unknown as Record<string, boolean>)[ustun] !== false
}

export async function eslatmaYubor(opts: {
  userId: string
  turi: EslatmaTuri
  /** Bir manba uchun kuniga bir marta: navbat id, dars slug yoki sana */
  manbaId?: string
  xabar: { title: string; body: string; url?: string }
  /**
   * "Turtki" turidagi xabarlar uchun true — foydalanuvchi kuniga bittadan
   * ortiq turtki olmaydi. Kutilayotgan xabarlar (navbat, dori) uchun false:
   * ular foydalanuvchining o'zi rejalashtirgan hodisaga bog'liq.
   */
  kunlikLimit?: boolean
}): Promise<Natija> {
  const { userId, turi, manbaId = '', xabar, kunlikLimit = false } = opts
  const supabase = createAdminClient()
  const sana = bugunToshkent()

  // 1) Sozlama. Yozuv bo'lmasa — hammasi yoqilgan deb hisoblanadi.
  if (!(await sozlamaYoqilganmi(userId, turi))) return 'ochirilgan'

  // 2) Kunlik chegara — faqat turtkilar uchun
  if (kunlikLimit) {
    const { count } = await supabase
      .from('bildirishnoma_yuborilgan')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('sana', sana)
    if ((count ?? 0) > 0) return 'kunlik_limit'
  }

  // 3) Jurnalga yozish — UNIQUE kalit takrorlanishni to'sadi.
  //    Avval yoziladi, keyin yuboriladi: cron ikki marta ishga tushsa,
  //    ikkinchisi shu yerda to'xtaydi va ikkinchi xabar ketmaydi.
  const { error: jurnalXato } = await supabase
    .from('bildirishnoma_yuborilgan')
    .insert({ user_id: userId, turi, manba_id: manbaId, sana })

  if (jurnalXato) {
    // 23505 — unique buzilishi, ya'ni allaqachon yuborilgan
    if (jurnalXato.code === '23505') return 'takror'
    return 'xato'
  }

  await xabarYubor(userId, xabar)
  return 'yuborildi'
}
