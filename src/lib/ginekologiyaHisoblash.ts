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
  return { otganKun, hafta: Math.floor(otganKun / 7), kun: otganKun % 7, tts }
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

export function sanaFormat(sana: Date) {
  return new Intl.DateTimeFormat('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(sana)
}

export function bugungiMahalliySana() {
  const hozir = new Date()
  const yil = hozir.getFullYear()
  const oy = String(hozir.getMonth() + 1).padStart(2, '0')
  const kun = String(hozir.getDate()).padStart(2, '0')
  return `${yil}-${oy}-${kun}`
}
