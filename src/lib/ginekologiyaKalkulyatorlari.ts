export type GinekologiyaKalkulyatori = {
  slug: string
  icon: string
  title: string
  kategoriya: string
  faol?: boolean
}

export const GIN_KALK_KATEGORIYALARI = [
  'Hammasi',
  'Homiladorlik',
  'Tug‘ruq',
  'Reproduktiv salomatlik',
  'Onkoginekologiya',
  'Uroginekologiya',
] as const

// Hozircha faqat katalog. Har bir kalkulyatorning formulasi, savollari va
// klinik izohi keyingi bosqichda alohida qo‘shiladi.
export const GINEKOLOGIYA_KALKULYATORLARI: GinekologiyaKalkulyatori[] = [
  { slug: 'homiladorlik-muddati', icon: '📅', title: 'Homiladorlik muddati va taxminiy tug‘ruq sanasi', kategoriya: 'Homiladorlik', faol: true },
  { slug: 'gestatsion-yosh-utt', icon: '🩻', title: 'UTT bo‘yicha gestatsion yosh', kategoriya: 'Homiladorlik', faol: true },
  { slug: 'homila-vazni', icon: '👶', title: 'Homilaning taxminiy vazni (Hadlock)', kategoriya: 'Homiladorlik', faol: true },
  { slug: 'bishop', icon: '🩺', title: 'Bishop shkalasi', kategoriya: 'Tug‘ruq' },
  { slug: 'apgar', icon: '👶', title: 'Apgar shkalasi', kategoriya: 'Tug‘ruq' },
  { slug: 'qon-yoqotish', icon: '🩸', title: 'Tug‘ruqdan keyingi qon yo‘qotishni baholash', kategoriya: 'Tug‘ruq' },
  { slug: 'vbac', icon: '🤱', title: 'VBAC muvaffaqiyat ehtimoli', kategoriya: 'Tug‘ruq' },
  { slug: 'preeklampsiya-xavfi', icon: '🫀', title: 'Preeklampsiya xavfini baholash', kategoriya: 'Homiladorlik' },
  { slug: 'padua-obstetrik-vte', icon: '🩸', title: 'Homiladorlikda VTE xavfini baholash', kategoriya: 'Homiladorlik' },
  { slug: 'ferriman-gallwey', icon: '🧬', title: 'Modifikatsiyalangan Ferriman–Gallwey shkalasi', kategoriya: 'Reproduktiv salomatlik' },
  { slug: 'free-androgen-index', icon: '🧪', title: 'Erkin androgen indeksi (FAI)', kategoriya: 'Reproduktiv salomatlik' },
  { slug: 'homa-ir', icon: '🧫', title: 'HOMA-IR indeksi', kategoriya: 'Reproduktiv salomatlik' },
  { slug: 'amh-yoshga-mos', icon: '🥚', title: 'AMH natijasini yoshga mos baholash', kategoriya: 'Reproduktiv salomatlik' },
  { slug: 'ovulyatsiya-kuni', icon: '🌸', title: 'Ovulyatsiya kunini taxminlash', kategoriya: 'Reproduktiv salomatlik' },
  { slug: 'menopauza-mrs', icon: '🌙', title: 'Menopauza reyting shkalasi (MRS)', kategoriya: 'Reproduktiv salomatlik' },
  { slug: 'fraks', icon: '🦴', title: 'FRAX — osteoporotik sinish xavfi', kategoriya: 'Reproduktiv salomatlik' },
  { slug: 'rmi', icon: '🎗️', title: 'RMI — tuxumdon o‘smasi malignlik indeksi', kategoriya: 'Onkoginekologiya' },
  { slug: 'roma', icon: '🔬', title: 'ROMA — tuxumdon saratoni xavfi algoritmi', kategoriya: 'Onkoginekologiya' },
  { slug: 'iota-simple-rules', icon: '🩻', title: 'IOTA Simple Rules', kategoriya: 'Onkoginekologiya' },
  { slug: 'iota-adnex', icon: '📊', title: 'IOTA ADNEX modeli', kategoriya: 'Onkoginekologiya' },
  { slug: 'cervical-cancer-risk', icon: '🎗️', title: 'Bachadon bo‘yni saratoni xavfini baholash', kategoriya: 'Onkoginekologiya' },
  { slug: 'pfiq-7', icon: '📋', title: 'PFIQ-7 — tos tubi ta’siri so‘rovnomasi', kategoriya: 'Uroginekologiya' },
  { slug: 'pfdi-20', icon: '📝', title: 'PFDI-20 — tos tubi simptomlari so‘rovnomasi', kategoriya: 'Uroginekologiya' },
  { slug: 'pop-q', icon: '📐', title: 'POP-Q klassifikatsiyasi', kategoriya: 'Uroginekologiya' },
  { slug: 'iciq-ui-sf', icon: '💧', title: 'ICIQ-UI SF — siydik tutolmaslik shkalasi', kategoriya: 'Uroginekologiya' },
]
