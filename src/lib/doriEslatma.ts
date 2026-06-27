// Kuniga necha marta qabul qilinishiga qarab standart eslatma vaqtlari.
const VAQT_JADVALLARI: Record<number, string[]> = {
  1: ['09:00'],
  2: ['09:00', '21:00'],
  3: ['08:00', '14:00', '20:00'],
  4: ['08:00', '12:00', '16:00', '20:00'],
  5: ['07:00', '11:00', '15:00', '19:00', '23:00'],
  6: ['07:00', '10:00', '13:00', '16:00', '19:00', '22:00'],
}

export function vaqtJadvali(kunigaMarta: number): string[] {
  return VAQT_JADVALLARI[kunigaMarta] ?? Array.from({ length: kunigaMarta }, (_, i) => {
    const soat = Math.floor((24 / kunigaMarta) * i) + 8
    return `${String(soat % 24).padStart(2, '0')}:00`
  })
}

export function faolKunMi(boshlanishSanasi: string, muddatKun: number): boolean {
  const boshlanish = new Date(boshlanishSanasi)
  const tugash = new Date(boshlanish)
  tugash.setDate(tugash.getDate() + muddatKun)
  const bugun = new Date()
  bugun.setHours(0, 0, 0, 0)
  boshlanish.setHours(0, 0, 0, 0)
  return bugun >= boshlanish && bugun < tugash
}

export function tugashSanasi(boshlanishSanasi: string, muddatKun: number): string {
  const d = new Date(boshlanishSanasi)
  d.setDate(d.getDate() + muddatKun - 1)
  return d.toISOString().slice(0, 10)
}

// faolKunMi'ning istalgan sanaga nisbatan ishlaydigan umumlashtirilgan ko'rinishi (statistika hisoblash uchun)
export function faolKunMiSana(boshlanishSanasi: string, muddatKun: number, sanaStr: string): boolean {
  const boshlanish = new Date(boshlanishSanasi)
  const tugash = new Date(boshlanish)
  tugash.setDate(tugash.getDate() + muddatKun)
  const sana = new Date(sanaStr)
  sana.setHours(0, 0, 0, 0)
  boshlanish.setHours(0, 0, 0, 0)
  tugash.setHours(0, 0, 0, 0)
  return sana >= boshlanish && sana < tugash
}

// Berilgan "HH:MM" vaqti hali kelmaganmi (hozirgi soatdan keyinmi)
export function vaqtKelmadiMi(vaqt: string): boolean {
  const [soat, daqiqa] = vaqt.split(':').map(Number)
  const hozir = new Date()
  const hozirgiDaqiqa = hozir.getHours() * 60 + hozir.getMinutes()
  return soat * 60 + daqiqa > hozirgiDaqiqa
}

export function qolganKunlar(boshlanishSanasi: string, muddatKun: number): number {
  const boshlanish = new Date(boshlanishSanasi)
  const tugash = new Date(boshlanish)
  tugash.setDate(tugash.getDate() + muddatKun)
  const bugun = new Date()
  bugun.setHours(0, 0, 0, 0)
  tugash.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((tugash.getTime() - bugun.getTime()) / (24 * 3600 * 1000)))
}
