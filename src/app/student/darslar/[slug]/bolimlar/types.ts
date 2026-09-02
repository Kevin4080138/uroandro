// Dars bo'limlari o'rtasida bo'linadigan umumiy tiplar.
// (Ilgari hammasi DarsClient.tsx ichida edi — 2100+ qatorlik yagona fayl.)

export type Tab =
  | 'nazariya' | 'video' | 'yuklab' | 'flashcard' | 'amaliy' | 'usmle'
  | 'klinik' | 'interaktiv' | 'vaziyatli' | 'xatolar' | 'nazorat'

// Nazariya ostidagi qo'shimcha adabiyot havolasi.
export type Adabiyot = { nom: string; url: string }

// Test topshirilganda qaytadigan natija (amaliy/USMLE/nazorat umumiy).
// `qoidabuzarlik` — nazoratda oyna/tab almashtirish tufayli avtomatik yakunlangan bo'lsa true.
export type TestNatija = { togriSon: number; jami: number; qoidabuzarlik?: boolean; javoblar?: (number | null)[] }
