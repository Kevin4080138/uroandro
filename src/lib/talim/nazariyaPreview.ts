import fs from 'fs/promises'
import path from 'path'
import { createAdminClient } from '@/lib/supabaseAdmin'

// Ochiq (login talab qilmaydigan) dars sahifalari uchun nazariyaning boshlang'ich qismi.
//
// Tarkib `dars_tarkibi` jadvalida saqlanadi va uning RLS siyosati tizimga kirganlarga
// ruxsat beradi — shu sabab bu yerda service-role client ishlatiladi va matn SERVER'da
// qisqartiriladi. Natijada to'liq nazariya HTML'ga hech qachon tushmaydi: mehmon faqat
// qisqartirilgan qismni oladi.

export type NazariyaOnamoyish = {
  paragraflar: { turi: 'sarlavha' | 'matn'; matn: string }[]
  qolganSarlavhalar: string[]  // ochilmagan qismdagi bo'lim nomlari — "ichida nima bor"ni ko'rsatadi
  jamiBelgi: number
}

const PREVIEW_BELGI = 1400 // taxminan 2 ekran matn — Google indekslashi uchun yetarli, kursni ochib bermaydi

function htmlNiTozala(s: string) {
  return s
    // Teg o'rniga bo'sh joy — aks holda <span>2</span>Sarlavha "2Sarlavha" bo'lib yopishadi
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// HTML'dan sarlavha va paragraflarni tartib bilan ajratib oladi. Teglar butunlay
// tashlanadi — natija har doim yaroqli markup bo'ladi (yarim ochiq teg qolmaydi).
function normalizatsiya(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9а-яёʻ'’Ѐ-ӿ]+/gi, '')
}

export function nazariyadanOnamoyish(html: string, darsSarlavhasi?: string): NazariyaOnamoyish {
  // /public/nazariyalar/ dagi mualliflik sahifalarida mundarija (nav), skript va uslub
  // bloklari bor — ular matn emas, olib tashlanmasa onamoyish shovqinga to'ladi.
  const tana = html
    .replace(/<(script|style|nav|aside|header|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')

  const bloklar: { turi: 'sarlavha' | 'matn'; matn: string }[] = []
  // `li` ataylab olinmaydi — ko'pincha mundarija/navigatsiya elementlari bo'ladi.
  const re = /<(h1|h2|h3|p)\b[^>]*>([\s\S]*?)<\/\1>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(tana)) !== null) {
    const matn = htmlNiTozala(m[2])
    // Juda qisqa bo'laklar (belgi, raqam, "⏱ 20 daqiqa" kabi yorliqlar) matn hisoblanmaydi
    if (matn.length < 12) continue
    const turi = /^h[123]$/i.test(m[1]) ? 'sarlavha' : 'matn'
    // Manba HTML ichidagi dars nomi sahifaning o'z h1'ini takrorlaydi — tashlab ketamiz
    if (turi === 'sarlavha' && darsSarlavhasi && normalizatsiya(matn) === normalizatsiya(darsSarlavhasi)) continue
    bloklar.push({ turi, matn })
  }

  const paragraflar: typeof bloklar = []
  let belgi = 0
  let i = 0
  for (; i < bloklar.length; i++) {
    if (belgi >= PREVIEW_BELGI) break
    paragraflar.push(bloklar[i])
    belgi += bloklar[i].matn.length
  }
  // Oxiri sarlavha bilan tugab qolmasin — bo'sh bo'lim taassurotini bermasin
  while (paragraflar.length > 1 && paragraflar[paragraflar.length - 1].turi === 'sarlavha') {
    paragraflar.pop()
    i--
  }

  // "Manbalar", "Adabiyotlar" kabi xizmatchi bo'limlar qiziqtiruvchi ro'yxatga tushmasin
  const XIZMATCHI = /^(manbalar|adabiyot|foydalanilgan|qisqartma|lug'at|mundarija|dars mazmuni)/i
  const qolganSarlavhalar = bloklar
    .slice(i)
    .filter((b) => b.turi === 'sarlavha' && !XIZMATCHI.test(b.matn))
    .map((b) => b.matn)
  const jamiBelgi = bloklar.reduce((s, b) => s + b.matn.length, 0)

  return { paragraflar, qolganSarlavhalar, jamiBelgi }
}

// Darsning nazariya HTML manbasi ikki xil bo'lishi mumkin: `dars_tarkibi` jadvali yoki
// /public/nazariyalar/ dagi statik fayl (nazariyaIframe bilan ko'rsatiladigan darslar).
export async function nazariyaHtmlniOl(slug: string, iframeYoli?: string): Promise<string | null> {
  if (iframeYoli) {
    try {
      const fayl = path.join(process.cwd(), 'public', iframeYoli.replace(/^\//, ''))
      return await fs.readFile(fayl, 'utf8')
    } catch {
      return null
    }
  }
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('dars_tarkibi')
      .select('nazariya_html')
      .eq('dars_slug', slug)
      .maybeSingle()
    return (data?.nazariya_html as string | null) ?? null
  } catch {
    return null
  }
}

// Ochiq sahifalarda ko'rsatiladigan darslar: nazariyasi tayyor bo'lganlari.
// Skelet darslar indekslanmaydi — bo'sh sahifa SEO'ga zarar qiladi.
export async function nazariyasiBorSluglar(): Promise<Set<string>> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('dars_tarkibi')
      .select('dars_slug')
      .not('nazariya_html', 'is', null)
    return new Set((data ?? []).map((r) => r.dars_slug as string))
  } catch {
    return new Set()
  }
}
