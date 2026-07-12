// Shifokorning shaxsiy shablonlari — bazada (JSONB) saqlanadigan deklarativ format.
// Hujjat matnlarida {{kalit}} yoki {{kalit|standart}} o'rinbosarlar ishlatiladi;
// maxsus kalitlar: {{bemor.fio}}, {{shifokor}}.
import type { Shablon, MaydonGuruh, HujjatBlok } from './turlar'

export type DeklarativBlok =
  | { tur: 'sarlavha'; matn: string }
  | { tur: 'matn'; matn: string }
  | { tur: 'band'; etiket: string; matn: string }
  | { tur: 'qator'; chap: string; ong: string }
  | { tur: 'royxat'; kalit: string }          // checklist maydon kaliti — har bir tanlov alohida band
  | { tur: 'imzo'; chap: string; ong: string }
  | { tur: 'bosh' }

export type DeklarativHujjat = { id: string; nom: string; bloklar: DeklarativBlok[] }

export type ShablonTuzilma = {
  guruhlar: MaydonGuruh[]
  hujjatlar: DeklarativHujjat[]
}

export type ShaxsiyShablonRow = {
  id: string
  kasallik: string
  tuzilma: ShablonTuzilma
}

function qiymat(kalit: string, d: Record<string, any>, bemor: any, shifokorIsmi: string, standart: string): string {
  if (kalit === 'bemor.fio') return bemor?.fio && String(bemor.fio).trim() ? String(bemor.fio) : standart
  if (kalit === 'shifokor') return shifokorIsmi && shifokorIsmi.trim() ? shifokorIsmi : standart
  const v = d[kalit]
  if (Array.isArray(v)) return v.length ? v.join(', ') : standart
  return v !== undefined && v !== null && String(v).trim() !== '' ? String(v) : standart
}

export function matnniToldir(matn: string, d: Record<string, any>, bemor: any, shifokorIsmi: string): string {
  return matn.replace(/\{\{\s*([^}|]+?)\s*(?:\|([^}]*))?\}\}/g, (_, kalit: string, standart?: string) =>
    qiymat(kalit.trim(), d, bemor, shifokorIsmi, standart !== undefined ? standart : '—'))
}

function blokniYasa(b: DeklarativBlok, d: Record<string, any>, bemor: any, sh: string): HujjatBlok {
  const t = (m: string) => matnniToldir(m, d, bemor, sh)
  switch (b.tur) {
    case 'bosh': return { tur: 'bosh' }
    case 'sarlavha': return { tur: 'sarlavha', matn: t(b.matn) }
    case 'matn': return { tur: 'matn', matn: t(b.matn) }
    case 'band': return { tur: 'band', etiket: t(b.etiket), matn: t(b.matn) }
    case 'qator': return { tur: 'qator', chap: t(b.chap), ong: t(b.ong) }
    case 'imzo': return { tur: 'imzo', chap: t(b.chap), ong: t(b.ong) }
    case 'royxat': {
      const v = d[b.kalit]
      return { tur: 'royxat', bandlar: Array.isArray(v) && v.length ? v : ['—'] }
    }
  }
}

// Bazadagi yozuvni mavjud hujjatlar sahifasi tushunadigan Shablon ko'rinishiga aylantiradi
export function shaxsiyShablonga(row: ShaxsiyShablonRow): Shablon {
  const tuzilma = row.tuzilma ?? { guruhlar: [], hujjatlar: [] }
  return {
    id: row.id,
    kasallik: row.kasallik,
    guruhlar: tuzilma.guruhlar ?? [],
    hujjatlar: (tuzilma.hujjatlar ?? []).map((h) => ({
      id: h.id,
      nom: h.nom,
      render: (d, bemor, shifokorIsmi) => (h.bloklar ?? []).map((b) => blokniYasa(b, d, bemor, shifokorIsmi)),
    })),
  }
}

// Label'dan maydon kaliti yasash (o'zbek/rus harflarini lotin slugga)
const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k',
  л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ь: '', э: 'e', ю: 'yu', я: 'ya', қ: 'q', ғ: 'g', ҳ: 'h', ў: 'o',
}
export function kalitYasa(label: string): string {
  return label.toLowerCase()
    .split('').map((c) => TRANSLIT[c] ?? c).join('')
    .replace(/['ʼ’`]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40) || 'maydon'
}

// Yangi shablon uchun boshlang'ich skelet — 5 bo'limli standart:
// Anamnez / Status localis / Diagnoz / Davolash / Tavsiyalar
export function yangiTuzilma(): ShablonTuzilma {
  return {
    guruhlar: [
      {
        nom: "Bemor ma'lumotlari",
        maydonlar: [
          { key: 'tugilgan_yil', label: "Tug'ilgan yili", type: 'text' },
          { key: 'korik_sana', label: "Ko'rik sanasi", type: 'date' },
          { key: 'korik_vaqt', label: "Ko'rik vaqti", type: 'select', default: '10:00', variantlar: ['08:30', '09:15', '10:00', '10:45', '11:30', '14:00'] },
        ],
      },
      {
        nom: 'Shikoyatlar',
        maydonlar: [
          { key: 'shikoyatlar', label: 'Shikoyatlar', type: 'checklist', variantlar: ['Оғриққа', 'Умумий ҳолсизликка'] },
        ],
      },
      {
        nom: 'Anamnez',
        maydonlar: [
          { key: 'anamnez_morbi', label: 'Anamnesis morbi', type: 'textarea', keng: true, default: 'Анамнезидан ўзини бир неча вақтдан буён хаста деб билади.' },
          { key: 'anamnez_vitae', label: 'Anamnesis vitae', type: 'textarea', keng: true, default: 'Ёшлигидан қониқарли оила шароитида ўсиб улғайган. Операция муолажалари ўтказмаган.' },
          { key: 'allergiya', label: 'Allergologik anamnez', type: 'text', keng: true, default: 'Дори-дармонларга нисбатан ножўя ҳолат кузатилмаган.' },
        ],
      },
      {
        nom: 'Status localis',
        maydonlar: [
          { key: 'status_localis', label: 'Status localis', type: 'textarea', keng: true, default: '' },
        ],
      },
      {
        nom: 'Tashxis',
        maydonlar: [
          { key: 'tashxis', label: 'Klinik tashxis', type: 'select', keng: true, variantlar: [] },
        ],
      },
      {
        nom: 'Davolash',
        maydonlar: [
          { key: 'davo', label: 'Tavsiya etilgan davo', type: 'checklist', variantlar: [] },
        ],
      },
      {
        nom: 'Tavsiyalar',
        maydonlar: [
          { key: 'tavsiya', label: 'Tavsiyalar', type: 'textarea', keng: true, default: '' },
        ],
      },
      {
        nom: 'Imzolar',
        maydonlar: [
          { key: 'davolovchi', label: 'Davolovchi vrach', type: 'text' },
        ],
      },
    ],
    hujjatlar: [
      {
        id: 'birlamchi',
        nom: "Birlamchi ko'rik",
        bloklar: [
          { tur: 'matn', matn: '{{korik_sana|__.__.____}}-й   Соат: {{korik_vaqt|____}}        Урология бўлимида кўрик.' },
          { tur: 'band', etiket: 'Бемор', matn: '{{bemor.fio}} {{tugilgan_yil|____}}-йил.' },
          { tur: 'band', etiket: 'Бемор шикоятлари', matn: '{{shikoyatlar}}' },
          { tur: 'band', etiket: 'Anamnesis morbi', matn: '{{anamnez_morbi}}' },
          { tur: 'band', etiket: 'Anamnesis vitae', matn: '{{anamnez_vitae}} Аллергологик анамнез: {{allergiya}}' },
          { tur: 'band', etiket: 'Status localis', matn: '{{status_localis}}' },
          { tur: 'band', etiket: 'Ташхис', matn: '{{tashxis}}' },
          { tur: 'band', etiket: 'Даво', matn: '' },
          { tur: 'royxat', kalit: 'davo' },
          { tur: 'band', etiket: 'Тавсия', matn: '{{tavsiya}}' },
          { tur: 'bosh' },
          { tur: 'imzo', chap: 'Даволовчи врач', ong: '{{davolovchi}}' },
        ],
      },
      {
        id: 'xulosa',
        nom: 'Xulosa / Tavsiyanoma',
        bloklar: [
          { tur: 'sarlavha', matn: 'ВРАЧ ХУЛОСАСИ' },
          { tur: 'qator', chap: 'Бемор', ong: '{{bemor.fio}}' },
          { tur: 'qator', chap: 'Туғилган йили', ong: '{{tugilgan_yil}}' },
          { tur: 'qator', chap: 'Кўрик санаси', ong: '{{korik_sana}}' },
          { tur: 'qator', chap: 'Ташхис', ong: '{{tashxis}}' },
          { tur: 'sarlavha', matn: 'Даво' },
          { tur: 'royxat', kalit: 'davo' },
          { tur: 'sarlavha', matn: 'Тавсиялар' },
          { tur: 'matn', matn: '{{tavsiya}}' },
          { tur: 'bosh' },
          { tur: 'imzo', chap: 'Врач', ong: '{{davolovchi}}' },
        ],
      },
    ],
  }
}
