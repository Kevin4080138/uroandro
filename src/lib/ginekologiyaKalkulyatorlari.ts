export type GinekologiyaKalkulyatori = {
  slug: string
  icon: string
  title: string
  kategoriya: string
  // 'jonli' — interaktiv hisoblash bor; 'malumot' — hozircha to'liq klinik
  // ma'lumot sahifasi (savol banki yoki tashqi modelga bog'liq).
  holat: 'jonli' | 'malumot'
}

export const GIN_KALK_KATEGORIYALARI = [
  'Hammasi',
  'Homiladorlik',
  'Tug‘ruq',
  'Reproduktiv salomatlik',
  'Onkoginekologiya',
  'Uroginekologiya',
] as const

export const GINEKOLOGIYA_KALKULYATORLARI: GinekologiyaKalkulyatori[] = [
  { slug: 'homiladorlik-muddati', icon: '📅', title: 'Homiladorlik muddati va taxminiy tug‘ruq sanasi', kategoriya: 'Homiladorlik', holat: 'jonli' },
  { slug: 'gestatsion-yosh-utt', icon: '🩻', title: 'UTT bo‘yicha gestatsion yosh', kategoriya: 'Homiladorlik', holat: 'jonli' },
  { slug: 'homila-vazni', icon: '👶', title: 'Homilaning taxminiy vazni (Hadlock)', kategoriya: 'Homiladorlik', holat: 'jonli' },
  { slug: 'ovulyatsiya-kuni', icon: '🌸', title: 'Ovulyatsiya kunini taxminlash', kategoriya: 'Reproduktiv salomatlik', holat: 'jonli' },
  { slug: 'bishop', icon: '🩺', title: 'Bishop shkalasi', kategoriya: 'Tug‘ruq', holat: 'jonli' },
  { slug: 'apgar', icon: '👶', title: 'Apgar shkalasi', kategoriya: 'Tug‘ruq', holat: 'jonli' },
  { slug: 'qon-yoqotish', icon: '🩸', title: 'Tug‘ruqdan keyingi qon yo‘qotishni baholash', kategoriya: 'Tug‘ruq', holat: 'jonli' },
  { slug: 'ferriman-gallwey', icon: '🧬', title: 'Modifikatsiyalangan Ferriman–Gallwey shkalasi', kategoriya: 'Reproduktiv salomatlik', holat: 'jonli' },
  { slug: 'free-androgen-index', icon: '🧪', title: 'Erkin androgen indeksi (FAI)', kategoriya: 'Reproduktiv salomatlik', holat: 'jonli' },
  { slug: 'homa-ir', icon: '🧫', title: 'HOMA-IR indeksi', kategoriya: 'Reproduktiv salomatlik', holat: 'jonli' },
  { slug: 'rmi', icon: '🎗️', title: 'RMI — tuxumdon o‘smasi malignlik indeksi', kategoriya: 'Onkoginekologiya', holat: 'jonli' },
  { slug: 'iota-simple-rules', icon: '🩻', title: 'IOTA Simple Rules', kategoriya: 'Onkoginekologiya', holat: 'jonli' },
  { slug: 'pop-q', icon: '📐', title: 'POP-Q klassifikatsiyasi', kategoriya: 'Uroginekologiya', holat: 'jonli' },
  { slug: 'vbac', icon: '🤱', title: 'VBAC muvaffaqiyat ehtimoli', kategoriya: 'Tug‘ruq', holat: 'malumot' },
  { slug: 'preeklampsiya-xavfi', icon: '🫀', title: 'Preeklampsiya — aspirin profilaktikasi', kategoriya: 'Homiladorlik', holat: 'jonli' },
  { slug: 'rcog-obstetrik-vte', icon: '🩸', title: 'Homiladorlik va puerperiyda VTE xavfi (RCOG)', kategoriya: 'Homiladorlik', holat: 'jonli' },
  { slug: 'amh-yoshga-mos', icon: '🥚', title: 'AMH natijasini yoshga mos baholash', kategoriya: 'Reproduktiv salomatlik', holat: 'malumot' },
  { slug: 'menopauza-mrs', icon: '🌙', title: 'Menopauza reyting shkalasi (MRS)', kategoriya: 'Reproduktiv salomatlik', holat: 'malumot' },
  { slug: 'frax', icon: '🦴', title: 'FRAX — osteoporotik sinish xavfi', kategoriya: 'Reproduktiv salomatlik', holat: 'malumot' },
  { slug: 'roma', icon: '🔬', title: 'ROMA — tuxumdon saratoni xavfi algoritmi', kategoriya: 'Onkoginekologiya', holat: 'malumot' },
  { slug: 'iota-adnex', icon: '📊', title: 'IOTA ADNEX modeli', kategoriya: 'Onkoginekologiya', holat: 'malumot' },
  { slug: 'cervical-cancer-risk', icon: '🎗️', title: 'Bachadon bo‘yni saratoni xavfini baholash (ASCCP)', kategoriya: 'Onkoginekologiya', holat: 'malumot' },
  { slug: 'pfiq-7', icon: '📋', title: 'PFIQ-7 — tos tubi ta’siri so‘rovnomasi', kategoriya: 'Uroginekologiya', holat: 'malumot' },
  { slug: 'pfdi-20', icon: '📝', title: 'PFDI-20 — tos tubi simptomlari so‘rovnomasi', kategoriya: 'Uroginekologiya', holat: 'malumot' },
  { slug: 'iciq-ui-sf', icon: '💧', title: 'ICIQ-UI SF — siydik tutolmaslik shkalasi', kategoriya: 'Uroginekologiya', holat: 'malumot' },
]
