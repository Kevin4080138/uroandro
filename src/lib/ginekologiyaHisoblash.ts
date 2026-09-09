const KUN_MS = 86_400_000

export function utcSana(sana: string) {
  const [yil, oy, kun] = sana.split('-').map(Number)
  return new Date(Date.UTC(yil, oy - 1, kun))
}

export function sanaQosh(sana: Date, kun: number) {
  return new Date(sana.getTime() + kun * KUN_MS)
}

export function kunFarqi(boshlanish: Date, tugash: Date) {
  return Math.floor((tugash.getTime() - boshlanish.getTime()) / KUN_MS)
}

export function homiladorlikHisobla(oxirgiHayz: string, siklKunlari: number, baholashSanasi: string) {
  const ohb = utcSana(oxirgiHayz)
  const sana = utcSana(baholashSanasi)
  const tuzatish = siklKunlari - 28
  const otganKun = kunFarqi(ohb, sana) - tuzatish
  const tts = sanaQosh(ohb, 280 + tuzatish)
  // Embrion (urug'lanish) yoshi gestatsion yoshdan ~14 kun kam — ovulyatsiya
  // oxirgi hayzdan taxminan 2 hafta keyin bo'ladi. Faqat GA ≥ 14 kunda ko'rsatiladi.
  const embrionKun = otganKun - 14
  return {
    otganKun,
    hafta: Math.floor(otganKun / 7),
    kun: otganKun % 7,
    tts,
    embrionBor: embrionKun >= 0,
    embrionHafta: Math.floor(Math.max(0, embrionKun) / 7),
    embrionKunQoldiq: Math.max(0, embrionKun) % 7,
  }
}

// INTERGROWTH-21st: GA (kun) = 40.9041 + 3.21585 × √CRL + 0.348956 × CRL.
export function crlGestatsionYosh(crlMm: number) {
  const jamiKun = Math.round(40.9041 + 3.21585 * Math.sqrt(crlMm) + 0.348956 * crlMm)
  return { jamiKun, hafta: Math.floor(jamiKun / 7), kun: jamiKun % 7 }
}

// Hadlock (BPD, HC, AC, FL), barcha biometrik o'lchamlar santimetrda.
export function hadlockVazn(bpdMm: number, hcMm: number, acMm: number, flMm: number) {
  const bpd = bpdMm / 10, hc = hcMm / 10, ac = acMm / 10, fl = flMm / 10
  const log10 = 1.3596 + 0.0064 * hc + 0.0424 * ac + 0.174 * fl + 0.00061 * bpd * ac - 0.00386 * ac * fl
  return Math.pow(10, log10)
}

const OYLAR = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']

// Intl 'uz-UZ' uzun oy nomlarini ba'zi muhitlarda bermaydi ("M05" ga tushib
// qoladi) — shuning uchun o'zbekcha oy nomlarini o'zimiz beramiz.
export function sanaFormat(sana: Date) {
  return `${sana.getUTCDate()} ${OYLAR[sana.getUTCMonth()]} ${sana.getUTCFullYear()}`
}

// Erkin androgen indeksi — testosteron va SHBG bir xil molyar birlikda (nmol/L).
export function faiHisob(testosteron: number, shbg: number) {
  return (testosteron / shbg) * 100
}

// HOMA-IR — glyukoza birligi bo'yicha bo'luvchi farq qiladi.
export function homaIr(glukoza: number, insulin: number, birlik: 'mmol' | 'mgdl') {
  return (glukoza * insulin) / (birlik === 'mmol' ? 22.5 : 405)
}

// RMI I — Jacobs 1990: U (UTT belgilar soni) × M (menopauzal status) × CA-125.
export function rmiHisob(belgiSoni: number, postmenopauza: boolean, ca125: number) {
  const U = belgiSoni === 0 ? 0 : belgiSoni === 1 ? 1 : 3
  const M = postmenopauza ? 3 : 1
  return { U, M, rmi: U * M * ca125 }
}

// Ovulyatsiya va fertil oyna — ovulyatsiya keyingi hayzdan ~14 kun oldin.
export function ovulyatsiyaHisob(oxirgiHayz: string, siklKunlari: number) {
  const ohb = utcSana(oxirgiHayz)
  const keyingiHayz = sanaQosh(ohb, siklKunlari)
  const ovulyatsiya = sanaQosh(keyingiHayz, -14)
  const fertilBosh = sanaQosh(ovulyatsiya, -5)
  return { keyingiHayz, ovulyatsiya, fertilBosh, fertilTugash: ovulyatsiya }
}

// ─── RCOG Green-top 37a: homiladorlik/puerperiyda VTE xavfi ────────────────
// Har omilга antenatal (ante) va postnatal (post) ball. Nomlar — o'z ta'rifimiz.
export type VteOmil = { key: string; label: string; ante: number; post: number }
export const RCOG_VTE_OMILLAR: VteOmil[] = [
  { key: 'oldingi_vte', label: "Oldingi VTE (bir martalik, katta jarrohlik bilan bog'liq emas)", ante: 4, post: 3 },
  { key: 'oldingi_vte_kop', label: 'Oldingi takroriy VTE', ante: 4, post: 3 },
  { key: 'trombofiliya_yuqori', label: 'Yuqori xavfli trombofiliya', ante: 3, post: 3 },
  { key: 'trombofiliya_past', label: 'Past xavfli trombofiliya (simptomsiz)', ante: 1, post: 1 },
  { key: 'komorbid', label: "Tibbiy komorbidlik (SLE, saraton, yurak/o'pka, IBD, nefrotik sindrom)", ante: 3, post: 3 },
  { key: 'yosh35', label: 'Yosh > 35', ante: 1, post: 1 },
  { key: 'bmi30', label: 'BMI 30–39', ante: 1, post: 1 },
  { key: 'bmi40', label: 'BMI ≥ 40', ante: 2, post: 2 },
  { key: 'paritet3', label: 'Paritet ≥ 3', ante: 1, post: 1 },
  { key: 'chekish', label: 'Chekish', ante: 1, post: 1 },
  { key: 'varikoz', label: 'Katta varikoz venalar', ante: 1, post: 1 },
  { key: 'preeklampsiya', label: 'Joriy preeklampsiya', ante: 1, post: 1 },
  { key: 'ivf', label: 'ART/IVF (antenatal)', ante: 1, post: 0 },
  { key: 'kop_homila', label: "Ko'p homilalik", ante: 1, post: 1 },
  { key: 'elektiv_kesar', label: 'Elektiv kesar', ante: 0, post: 1 },
  { key: 'shosh_kesar', label: 'Shoshilinch kesar', ante: 0, post: 2 },
  { key: 'uzoq_tugruq', label: "Uzoq tug'ruq > 24 soat", ante: 0, post: 1 },
  { key: 'pph', label: 'PPH > 1 L yoki qon quyish', ante: 0, post: 1 },
  { key: 'vaqtinchalik', label: 'Vaqtinchalik: infeksiya / immobilizatsiya / degidratatsiya / OHSS', ante: 1, post: 1 },
]

export function rcogVteBaho(tanlangan: Set<string>, rejim: 'ante' | 'post') {
  const jami = RCOG_VTE_OMILLAR.filter((o) => tanlangan.has(o.key)).reduce((s, o) => s + (rejim === 'ante' ? o.ante : o.post), 0)
  if (rejim === 'ante') {
    if (jami >= 4) return { jami, tavsif: "Birinchi trimestrdan LMWH profilaktikasini ko'rib chiqing", rang: '#dc2626' }
    if (jami === 3) return { jami, tavsif: "28-haftadan LMWH profilaktikasini ko'rib chiqing", rang: '#d97706' }
    return { jami, tavsif: 'Mobilizatsiya va gidratatsiya; rutin profilaktika shart emas', rang: '#16a34a' }
  }
  if (jami >= 2) return { jami, tavsif: "Kamida 10 kun LMWH profilaktikasini ko'rib chiqing", rang: '#dc2626' }
  if (jami === 1) return { jami, tavsif: 'Rejaga qarab: 10 kun profilaktika ba\'zi hollarda ko\'rib chiqiladi', rang: '#d97706' }
  return { jami, tavsif: 'Erta mobilizatsiya; rutin profilaktika shart emas', rang: '#16a34a' }
}

// ─── Preeklampsiya — aspirin profilaktikasi (ACOG/USPSTF xavf omillari) ─────
export const PREEK_YUQORI_OMILLAR = [
  'Oldingi homiladorlikda preeklampsiya', "Ko'p homilalik", 'Surunkali gipertoniya',
  'Tip 1 yoki 2 diabet', 'Buyrak kasalligi', 'Autoimmun kasallik (SLE, APS)',
]
export const PREEK_ORTA_OMILLAR = [
  'Birinchi homiladorlik', 'BMI > 30', 'Oilaviy anamnez (ona yoki opa-singil)',
  'Yosh ≥ 35', 'Ijtimoiy-demografik omillar', 'Oldingi noxush natija yoki past tug\'ilish vazni', '> 10 yil homiladorlik intervali',
]

export function preekAspirinBaho(yuqoriSoni: number, ortaSoni: number) {
  const tavsiyaEtiladi = yuqoriSoni >= 1
  const korilsin = !tavsiyaEtiladi && ortaSoni >= 2
  if (tavsiyaEtiladi) return { holat: 'tavsiya' as const, matn: 'Past dozali aspirin tavsiya etiladi (≥1 yuqori xavf omili)', rang: '#dc2626' }
  if (korilsin) return { holat: 'korilsin' as const, matn: "Past dozali aspirin ko'rib chiqiladi (≥2 o'rta xavf omili)", rang: '#d97706' }
  return { holat: 'shart_emas' as const, matn: 'Rutin aspirin ko\'rsatmasi yo\'q — standart kuzatuv', rang: '#16a34a' }
}

export function bugungiMahalliySana() {
  const hozir = new Date()
  const yil = hozir.getFullYear()
  const oy = String(hozir.getMonth() + 1).padStart(2, '0')
  const kun = String(hozir.getDate()).padStart(2, '0')
  return `${yil}-${oy}-${kun}`
}
