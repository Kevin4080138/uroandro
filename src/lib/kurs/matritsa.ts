// Adaptiv bo'lim matritsasi — qaysi mashq bo'limi qaysi mavzu turi va bosqichda
// pedagogik jihatdan mos kelishini belgilaydi (AGENTS.md daraja matritsasi).
//
// Talaba markazida ko'rinadigan bo'lim =
//   (matritsa tavsiyasi, admin `bolim_override` bilan ustma-ust) ∩ (bank bo'sh emas)
//
// `mavzu_turi` NULL/noma'lum bo'lsa — filtrsiz (hamma tavsiya etiladi), shunda
// eski (turi belgilanmagan) modullar avvalgidek bank-mavjudligi bo'yicha ishlaydi.

export type Bolim = 'flashcard' | 'test' | 'usmle' | 'case'
export type MavzuTuri =
  | 'anatomiya' | 'fiziologiya' | 'simptom' | 'diagnostika' | 'kasallik'
  | 'dori' | 'jarrohlik' | 'shoshilinch' | 'profilaktika'

export const MAVZU_TURLARI: { id: MavzuTuri; nom: string }[] = [
  { id: 'anatomiya', nom: 'Anatomiya' },
  { id: 'fiziologiya', nom: 'Fiziologiya' },
  { id: 'simptom', nom: 'Simptom / semiologiya' },
  { id: 'diagnostika', nom: 'Diagnostika' },
  { id: 'kasallik', nom: 'Kasallik' },
  { id: 'dori', nom: 'Dori davolash' },
  { id: 'jarrohlik', nom: 'Jarrohlik' },
  { id: 'shoshilinch', nom: 'Shoshilinch holat' },
  { id: 'profilaktika', nom: 'Profilaktika' },
]

export const BOLIMLAR: { id: Bolim; nom: string }[] = [
  { id: 'flashcard', nom: 'Flashcard' },
  { id: 'test', nom: 'Amaliy test' },
  { id: 'usmle', nom: 'USMLE' },
  { id: 'case', nom: 'Klinik case' },
]

type BolimMap = Record<Bolim, boolean>

// Bazaviy tavsiya (bosqichdan qat'i nazar). Flashcard + test — deyarli hamma
// turda; USMLE/case — klinik fikrlash talab qiladigan turlarda.
const MATRITSA: Record<MavzuTuri, BolimMap> = {
  anatomiya:    { flashcard: true, test: true, usmle: false, case: false },
  fiziologiya:  { flashcard: true, test: true, usmle: false, case: false },
  simptom:      { flashcard: true, test: true, usmle: true,  case: true },
  diagnostika:  { flashcard: true, test: true, usmle: true,  case: true },
  kasallik:     { flashcard: true, test: true, usmle: true,  case: true },
  dori:         { flashcard: true, test: true, usmle: true,  case: true },
  jarrohlik:    { flashcard: true, test: true, usmle: true,  case: true },
  shoshilinch:  { flashcard: true, test: true, usmle: true,  case: true },
  profilaktika: { flashcard: true, test: true, usmle: false, case: false },
}

function xomTuri(t: string | null | undefined): MavzuTuri | null {
  return t && t in MATRITSA ? (t as MavzuTuri) : null
}

// Matritsa + bosqich qoidasi. AGENTS: EASY (oson) da USMLE/case yo'q.
export function tavsiyaBolimlar(mavzuTuri: string | null | undefined, bosqich: string): BolimMap {
  const turi = xomTuri(mavzuTuri)
  // Turi belgilanmagan → filtrsiz (hammasi tavsiya)
  const asos: BolimMap = turi
    ? { ...MATRITSA[turi] }
    : { flashcard: true, test: true, usmle: true, case: true }
  if (bosqich === 'oson') {
    asos.usmle = false
    asos.case = false
  }
  return asos
}

// Admin override ustma-ust: kalit bo'lsa uni ishlatadi, aks holda tavsiya.
export function bolimKorinadi(
  bolim: Bolim,
  mavzuTuri: string | null | undefined,
  bosqich: string,
  override: Partial<Record<Bolim, boolean>> | null | undefined,
): boolean {
  if (override && typeof override[bolim] === 'boolean') return override[bolim]!
  return tavsiyaBolimlar(mavzuTuri, bosqich)[bolim]
}
