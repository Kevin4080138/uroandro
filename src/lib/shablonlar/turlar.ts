export type Maydon = {
  key: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'select' | 'checklist' | 'date' | 'olcham'
  variantlar?: string[]      // select yoki checklist uchun
  default?: string
  birlik?: string            // masalan "мл", "мм"
  faqat?: string[]           // faqat shu hujjat id'larida ko'rinadi (bo'sh bo'lsa — hammasida)
  keng?: boolean             // formada to'liq kenglikni egallaydi
}

export type MaydonGuruh = { nom: string; maydonlar: Maydon[] }

export type HujjatBlok =
  | { tur: 'sarlavha'; matn: string }
  | { tur: 'qator'; chap: string; ong: string }
  | { tur: 'band'; etiket: string; matn: string }   // qalin yorliq + oqib turuvchi mazmun
  | { tur: 'matn'; matn: string }
  | { tur: 'royxat'; bandlar: string[] }
  | { tur: 'imzo'; chap: string; ong: string }       // imzo qatori (o'ngga surilgan)
  | { tur: 'bosh' }

export type Hujjat = {
  id: string
  nom: string
  kunlik?: boolean   // bir nechta kunlik yozuvni boshqaradi (d.kunlar massivi)
  render: (d: Record<string, any>, bemor: any, shifokorIsmi: string) => HujjatBlok[]
}

export type Shablon = {
  id: string
  kasallik: string
  guruhlar: MaydonGuruh[]
  hujjatlar: Hujjat[]
}

// checklist qiymati massiv sifatida saqlanadi
export const cl = (v: any): string[] => (Array.isArray(v) ? v : [])
export const ro = (v: any, d = '—') => (v && String(v).trim() ? String(v) : d)
