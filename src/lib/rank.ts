import { DARSLAR } from '@/lib/talim/darslar'

export type RankInfo = {
  darajaSon: number       // 0–10
  nom: string
  unvon: string           // qisqa unvon (badge uchun)
  tier: 'boshlang' | 'oson' | 'orta' | 'qiyin' | 'akademik'
  subRank: 1 | 2 | 3     // tier ichidagi pogon darajasi
  keyingiFoiz: number     // keyingi darajagacha foiz (0–100)
  keyingiNom: string
  tavsif: string
}

export type ProgressData = {
  oson: { bajarilgan: number; jami: number }
  orta: { bajarilgan: number; jami: number }
  qiyin: { bajarilgan: number; jami: number }
}

const OSON_JAMI  = DARSLAR.filter(d => d.bosqich === 'oson').length  || 1
const ORTA_JAMI  = DARSLAR.filter(d => d.bosqich === "o'rta").length || 1
const QIYIN_JAMI = DARSLAR.filter(d => d.bosqich === 'qiyin').length || 1

const RANKS: Omit<RankInfo, 'keyingiFoiz'>[] = [
  // Tier: boshlang (hali hech narsa yo'q)
  { darajaSon: 0,  nom: 'Yangi Talaba',      unvon: '—',              tier: 'boshlang', subRank: 1, keyingiNom: 'Yangi Tabib',     tavsif: 'Birinchi darsni boshlang!' },

  // Oson bosqich — bronza
  { darajaSon: 1,  nom: 'Yangi Tabib',        unvon: 'I-chevron',      tier: 'oson',     subRank: 1, keyingiNom: 'Izchi Tabib',      tavsif: 'Tibbiyot asoslarini o\'rganmoqda' },
  { darajaSon: 2,  nom: 'Izchi Tabib',         unvon: 'II-chevron',     tier: 'oson',     subRank: 2, keyingiNom: 'Tajribali Tabib',  tavsif: 'Klinik bilimlarni mustahkamlayapti' },
  { darajaSon: 3,  nom: 'Tajribali Tabib',     unvon: 'III-chevron',    tier: 'oson',     subRank: 3, keyingiNom: 'Rezident',         tavsif: 'Asoslar bosqichini zabt etdi' },

  // O'rta bosqich — kumush
  { darajaSon: 4,  nom: 'Rezident',            unvon: 'I-olmos',        tier: 'orta',     subRank: 1, keyingiNom: 'Klinik Hakim',    tavsif: 'Klinik amaliyotga qadam qo\'ydi' },
  { darajaSon: 5,  nom: 'Klinik Hakim',        unvon: 'II-olmos',       tier: 'orta',     subRank: 2, keyingiNom: 'Shifo Ustasi',    tavsif: 'Diagnostika va davolashni o\'zlashtirmoqda' },
  { darajaSon: 6,  nom: 'Shifo Ustasi',        unvon: 'III-olmos',      tier: 'orta',     subRank: 3, keyingiNom: 'Urolog',          tavsif: 'O\'rta bosqichni muvaffaqiyatli yakunladi' },

  // Qiyin bosqich — oltin
  { darajaSon: 7,  nom: 'Urolog',              unvon: 'I-yulduz',       tier: 'qiyin',    subRank: 1, keyingiNom: 'Bosh Urolog',     tavsif: 'Murakkab klinik masalalarni hal qilmoqda' },
  { darajaSon: 8,  nom: 'Bosh Urolog',         unvon: 'II-yulduz',      tier: 'qiyin',    subRank: 2, keyingiNom: 'Urolog Olimi',    tavsif: 'Campbell-Walsh darajasida bilimga ega' },
  { darajaSon: 9,  nom: 'Urolog Olimi',        unvon: 'III-yulduz',     tier: 'qiyin',    subRank: 3, keyingiNom: 'Akademik',        tavsif: 'Qiyin bosqichni zabt etdi' },

  // Akademik — qirollik
  { darajaSon: 10, nom: 'Urologiya Akademigi', unvon: 'Akademik',       tier: 'akademik', subRank: 3, keyingiNom: '—',               tavsif: 'Urologiya bo\'yicha to\'liq kurs yakunlandi! 🏆' },
]

export function getRank(p: ProgressData): RankInfo {
  const oFoiz  = p.oson.jami  ? p.oson.bajarilgan  / p.oson.jami  : 0
  const orFoiz = p.orta.jami  ? p.orta.bajarilgan  / p.orta.jami  : 0
  const qFoiz  = p.qiyin.jami ? p.qiyin.bajarilgan / p.qiyin.jami : 0

  let darajaSon = 0

  if (oFoiz >= 0.7)       darajaSon = 3
  else if (oFoiz >= 0.35) darajaSon = 2
  else if (oFoiz > 0)     darajaSon = 1

  if (darajaSon === 3) {
    if (orFoiz >= 0.7)       darajaSon = 6
    else if (orFoiz >= 0.35) darajaSon = 5
    else if (orFoiz > 0)     darajaSon = 4
  }

  if (darajaSon === 6) {
    if (qFoiz >= 0.7)       darajaSon = 9
    else if (qFoiz >= 0.35) darajaSon = 8
    else if (qFoiz > 0)     darajaSon = 7
  }

  if (darajaSon === 9 && oFoiz >= 0.8 && orFoiz >= 0.8 && qFoiz >= 0.8) {
    darajaSon = 10
  }

  const rank = RANKS[darajaSon]

  // keyingiFoiz hisoblash
  let keyingiFoiz = 0
  if (darajaSon === 0)        keyingiFoiz = Math.round(oFoiz * 100 / 0.01)
  else if (darajaSon === 1)   keyingiFoiz = Math.round((oFoiz / 0.35) * 100)
  else if (darajaSon === 2)   keyingiFoiz = Math.round(((oFoiz - 0.35) / 0.35) * 100)
  else if (darajaSon === 3)   keyingiFoiz = Math.round(orFoiz * 100 / 0.01)
  else if (darajaSon === 4)   keyingiFoiz = Math.round((orFoiz / 0.35) * 100)
  else if (darajaSon === 5)   keyingiFoiz = Math.round(((orFoiz - 0.35) / 0.35) * 100)
  else if (darajaSon === 6)   keyingiFoiz = Math.round(qFoiz * 100 / 0.01)
  else if (darajaSon === 7)   keyingiFoiz = Math.round((qFoiz / 0.35) * 100)
  else if (darajaSon === 8)   keyingiFoiz = Math.round(((qFoiz - 0.35) / 0.35) * 100)
  else if (darajaSon === 9)   keyingiFoiz = Math.round(Math.min(oFoiz, orFoiz, qFoiz) / 0.8 * 100)
  else                        keyingiFoiz = 100

  return { ...rank, keyingiFoiz: Math.min(100, Math.max(0, keyingiFoiz)) }
}

export function getProgressData(
  natijalars: { dars_slug: string }[],
): ProgressData {
  const slugSet = new Set(natijalars.map(n => n.dars_slug))

  const osonDars  = DARSLAR.filter(d => d.bosqich === 'oson')
  const ortaDars  = DARSLAR.filter(d => d.bosqich === "o'rta")
  const qiyinDars = DARSLAR.filter(d => d.bosqich === 'qiyin')

  return {
    oson:  { bajarilgan: osonDars.filter(d => slugSet.has(d.slug)).length,  jami: OSON_JAMI  },
    orta:  { bajarilgan: ortaDars.filter(d => slugSet.has(d.slug)).length,  jami: ORTA_JAMI  },
    qiyin: { bajarilgan: qiyinDars.filter(d => slugSet.has(d.slug)).length, jami: QIYIN_JAMI },
  }
}
