// Online navbat uchun vaqt slotlarini yasash yordamchilari.

export type IshJadvali = {
  qabul_kunlari: number[]      // 1=Dushanba ... 7=Yakshanba
  qabul_boshlanish: string     // '09:00'
  qabul_tugash: string         // '17:00'
  slot_daqiqa: number          // 30
}

export const HAFTA_KUNLARI = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']

// ISO hafta kuni: 1=Dushanba ... 7=Yakshanba
export function haftaKuni(sana: Date): number {
  const d = sana.getDay()
  return d === 0 ? 7 : d
}

export function sanaISO(sana: Date): string {
  const y = sana.getFullYear()
  const m = String(sana.getMonth() + 1).padStart(2, '0')
  const d = String(sana.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Keyingi `kunSoni` kun ichida shifokor qabul qiladigan kunlar
export function qabulKunlari(jadval: IshJadvali, kunSoni = 14): Date[] {
  const kunlar: Date[] = []
  const bugun = new Date()
  for (let i = 0; i < kunSoni; i++) {
    const s = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate() + i)
    if ((jadval.qabul_kunlari ?? []).includes(haftaKuni(s))) kunlar.push(s)
  }
  return kunlar
}

// Bir kun uchun barcha slotlar ('09:00', '09:30', ...)
export function kunSlotlari(jadval: IshJadvali): string[] {
  const daqiqaga = (t: string) => {
    const [h, m] = t.split(':').map((x) => parseInt(x, 10))
    return (h || 0) * 60 + (m || 0)
  }
  const bosh = daqiqaga(jadval.qabul_boshlanish || '09:00')
  const tugash = daqiqaga(jadval.qabul_tugash || '17:00')
  const qadam = jadval.slot_daqiqa > 0 ? jadval.slot_daqiqa : 30
  const slotlar: string[] = []
  for (let t = bosh; t + qadam <= tugash; t += qadam) {
    slotlar.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`)
  }
  return slotlar
}

// Bugungi kun uchun o'tib ketgan slotlarni chiqarib tashlash
export function otganSlotmi(sana: Date, slot: string): boolean {
  const hozir = new Date()
  if (sanaISO(sana) !== sanaISO(hozir)) return false
  const [h, m] = slot.split(':').map((x) => parseInt(x, 10))
  return h * 60 + m <= hozir.getHours() * 60 + hozir.getMinutes()
}
