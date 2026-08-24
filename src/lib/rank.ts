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
  shart: string           // shu unvonga erishish sharti (talabaga ko'rsatiladi)
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
  // Tier: boshlang
  { darajaSon: 0,  nom: 'Boshlovchi',   unvon: '▰',                tier: 'boshlang', subRank: 1, keyingiNom: 'Boshlovchi',   tavsif: 'Birinchi darsni boshlang!',                        shart: 'Hali dars boshlanmagan — birinchi oson darsni oching' },

  // Oson bosqich — bronza (bars)
  { darajaSon: 1,  nom: 'Boshlovchi',   unvon: '▰',                tier: 'oson',     subRank: 1, keyingiNom: 'Shogird',      tavsif: 'Tibbiyot asoslarini o\'rganmoqda',                 shart: 'Oson bosqichda birinchi darsni tugating' },
  { darajaSon: 2,  nom: 'Shogird',      unvon: '▰▰',               tier: 'oson',     subRank: 2, keyingiNom: 'Bilimdon',     tavsif: 'Bilimlarni mustahkamlayapti',                      shart: 'Oson bosqich darslarining 35% ini tugating' },
  { darajaSon: 3,  nom: 'Bilimdon',     unvon: '▰▰▰',              tier: 'oson',     subRank: 3, keyingiNom: 'Izlanuvchi',   tavsif: 'Asoslar bosqichini zabt etdi',                     shart: 'Oson bosqich darslarining 70% ini tugating' },

  // O'rta bosqich — kumush (star + bars)
  { darajaSon: 4,  nom: 'Izlanuvchi',   unvon: '⭐ ▰▰▰',           tier: 'orta',     subRank: 1, keyingiNom: 'Amaliyotchi',  tavsif: 'Klinik amaliyotga qadam qo\'ydi',                  shart: 'Oson bosqichni yakunlab, o\'rta bosqichga o\'ting' },
  { darajaSon: 5,  nom: 'Amaliyotchi',  unvon: '⭐⭐ ▰▰▰',          tier: 'orta',     subRank: 2, keyingiNom: 'Mutaxassis',   tavsif: 'Diagnostika va davolashni o\'zlashtirmoqda',       shart: 'O\'rta bosqich darslarining 35% ini tugating' },
  { darajaSon: 6,  nom: 'Mutaxassis',   unvon: '⭐⭐⭐ ▰▰▰',         tier: 'orta',     subRank: 3, keyingiNom: 'Ekspert',      tavsif: 'O\'rta bosqichni muvaffaqiyatli yakunladi',        shart: 'O\'rta bosqich darslarining 70% ini tugating' },

  // Qiyin bosqich — oltin (stars)
  { darajaSon: 7,  nom: 'Ekspert',      unvon: '⭐⭐⭐⭐',            tier: 'qiyin',    subRank: 1, keyingiNom: 'Ustoz',        tavsif: 'Murakkab klinik masalalarni hal qilmoqda',        shart: 'O\'rta bosqichni yakunlab, qiyin bosqichga o\'ting' },
  { darajaSon: 8,  nom: 'Ustoz',        unvon: '⭐⭐⭐⭐⭐',           tier: 'qiyin',    subRank: 2, keyingiNom: 'Elita',        tavsif: 'Eng chuqur klinik bilimlarga ega',                shart: 'Qiyin bosqich darslarining 35% ini tugating' },
  { darajaSon: 9,  nom: 'Elita',        unvon: '⭐⭐⭐⭐⭐ 🏅',        tier: 'qiyin',    subRank: 3, keyingiNom: 'Afsona',       tavsif: 'Qiyin bosqichni zabt etdi',                        shart: 'Qiyin bosqich darslarining 70% ini tugating' },

  // Afsona — qirollik
  { darajaSon: 10, nom: 'Afsona',       unvon: '👑 ⭐⭐⭐⭐⭐ 🪽',    tier: 'akademik', subRank: 3, keyingiNom: '—',             tavsif: 'To\'liq kurs yakunlandi! 🏆',                      shart: 'Har uch bosqichning kamida 80% ini tugating' },
]

// Modal uchun: 0-daraja "boshlang'ich holat" (hali dars boshlanmagan) bo'lgani
// uchun tashlab yuboriladi — talabaga ko'rsatiladigan haqiqiy unvonlar 1..10.
export function hammaRanklar(): Omit<RankInfo, 'keyingiFoiz'>[] {
  return RANKS.slice(1)
}

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

// Ginekologiya (yoki boshqa yo'nalish) uchun: bosqich kesimidagi tugallangan/jami
// sanoqlaridan to'g'ridan-to'g'ri rank hisoblaydi. Urologiya DARSLAR'iga bog'liq emas.
export function getRankFromStages(
  stages: { id: string; tugadi: number; jami: number }[],
): RankInfo {
  const top = (id: string) => stages.find((s) => s.id === id)
  const o  = top('oson')
  const or = top('orta') ?? top("o'rta")
  const q  = top('qiyin')
  return getRank({
    oson:  { bajarilgan: o?.tugadi  ?? 0, jami: o?.jami  || 1 },
    orta:  { bajarilgan: or?.tugadi ?? 0, jami: or?.jami || 1 },
    qiyin: { bajarilgan: q?.tugadi  ?? 0, jami: q?.jami  || 1 },
  })
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
