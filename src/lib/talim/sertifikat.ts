import { DARSLAR, BOSQICHLAR, type Bosqich } from '@/lib/talim/darslar'

// Sertifikat va nishonlarga loyiqlikni hisoblash — bitta manba, ham serverda
// (hujjat berishda, /api/sertifikat/ber) ham clientda (holatni ko'rsatishda) ishlatiladi.
// Server o'z tekshiruvini clientga ishonmasdan qaytadan bajaradi.

export type NatijaYozuvi = { dars_slug: string; foiz: number; turi: string }

export type DarsHolati = {
  slug: string
  tugallandi: boolean       // nishon uchun: nazariya + amaliy qadamlari
  nazoratdanOtdi: boolean   // sertifikat uchun: nazorat testidan o'tish foizi
  nazoratBormi: boolean
  engYaxshiFoiz: number
}

// Sertifikat faqat O'rta va Qiyin bosqichlar uchun (AGENTS.md qoidasi:
// EASY bosqichida Nazorat ham, Sertifikat ham yo'q). Nishon esa har bosqichda bo'ladi.
export const SERTIFIKATLI_BOSQICHLAR: Bosqich[] = ["o'rta", 'qiyin']

export function bosqichSertifikatliMi(b: Bosqich) {
  return SERTIFIKATLI_BOSQICHLAR.includes(b)
}

export function bosqichNomi(b: Bosqich) {
  return BOSQICHLAR.find((x) => x.id === b)?.nom ?? b
}

// Bir darsning holati: nazorat banki bo'lsa — nazoratdan o'tish talab qilinadi,
// bank hali kiritilmagan bo'lsa — darsni tugallash yetarli. Shu tufayli kontent
// to'ldirilgan sari talab tabiiy ravishda qattiqlashadi, sertifikat esa erishib
// bo'lmaydigan bo'lib qolmaydi.
export function darsHolati(
  slug: string,
  natijalar: NatijaYozuvi[],
  qadamlar: Set<string> | undefined,
  nazoratBormi: boolean,
  otishFoizi: number
): DarsHolati {
  const nazoratlar = natijalar.filter((n) => n.dars_slug === slug && n.turi === 'nazorat')
  const engYaxshiFoiz = nazoratlar.reduce((m, n) => Math.max(m, Number(n.foiz)), 0)
  const tugallandi = !!qadamlar && qadamlar.has('nazariya') && qadamlar.has('amaliy')
  return {
    slug,
    tugallandi,
    nazoratBormi,
    engYaxshiFoiz,
    nazoratdanOtdi: nazoratBormi ? engYaxshiFoiz >= otishFoizi : tugallandi,
  }
}

export type BobHolati = {
  bosqich: Bosqich
  kategoriya: string
  jami: number
  tugagan: number
  loyiqmi: boolean
}

export function boblarHolati(holatlar: Map<string, DarsHolati>): BobHolati[] {
  const boblar = new Map<string, BobHolati>()
  for (const d of DARSLAR) {
    const kalit = `${d.bosqich}|${d.kategoriya}`
    const mavjud = boblar.get(kalit) ?? {
      bosqich: d.bosqich, kategoriya: d.kategoriya, jami: 0, tugagan: 0, loyiqmi: false,
    }
    mavjud.jami++
    if (holatlar.get(d.slug)?.tugallandi) mavjud.tugagan++
    boblar.set(kalit, mavjud)
  }
  for (const b of boblar.values()) b.loyiqmi = b.jami > 0 && b.tugagan === b.jami
  return [...boblar.values()]
}

export type BosqichHolati = {
  bosqich: Bosqich
  jami: number
  otgan: number
  loyiqmi: boolean
  tayyorlanmoqda: boolean   // nazorat banklari to'liq emas — sertifikat hali berilmaydi
  nazoratsizSoni: number
  ortachaFoiz: number
}

export function bosqichlarHolati(holatlar: Map<string, DarsHolati>): BosqichHolati[] {
  return SERTIFIKATLI_BOSQICHLAR.map((b) => {
    const darslar = DARSLAR.filter((d) => d.bosqich === b)
    const otganlar = darslar.filter((d) => holatlar.get(d.slug)?.nazoratdanOtdi)
    const foizlar = otganlar
      .map((d) => holatlar.get(d.slug)!.engYaxshiFoiz)
      .filter((f) => f > 0)

    // Nazorat banki yo'q dars "tugatilgan" bo'lsa o'tilgan hisoblanadi (darsHolati'ga
    // qarang). Agar bosqichdagi darslarning bank'i to'liq bo'lmasa, talaba bitta ham
    // test topshirmasdan sertifikat olishi mumkin edi — bu hujjatning qadrini yo'qotadi.
    // Shu sabab bank to'liq bo'lmaguncha bosqich sertifikati berilmaydi.
    const nazoratsizSoni = darslar.filter((d) => !holatlar.get(d.slug)?.nazoratBormi).length
    const tayyorlanmoqda = darslar.length > 0 && nazoratsizSoni > 0

    return {
      bosqich: b,
      jami: darslar.length,
      otgan: otganlar.length,
      loyiqmi: darslar.length > 0 && !tayyorlanmoqda && otganlar.length === darslar.length,
      tayyorlanmoqda,
      nazoratsizSoni,
      ortachaFoiz: foizlar.length ? Math.round(foizlar.reduce((s, f) => s + f, 0) / foizlar.length) : 0,
    }
  })
}

// Chalkashtirmaslik uchun o'xshash belgilar (O/0, I/1) chiqarib tashlangan alifbo.
const ALIFBO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function sertifikatKodiYarat(): string {
  const bolak = (n: number) =>
    Array.from({ length: n }, () => ALIFBO[Math.floor(Math.random() * ALIFBO.length)]).join('')
  return `URS-${bolak(4)}-${bolak(4)}`
}
