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

export function bugungiMahalliySana() {
  const hozir = new Date()
  const yil = hozir.getFullYear()
  const oy = String(hozir.getMonth() + 1).padStart(2, '0')
  const kun = String(hozir.getDate()).padStart(2, '0')
  return `${yil}-${oy}-${kun}`
}
