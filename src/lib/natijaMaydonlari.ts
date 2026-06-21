export type Maydon = {
  key: string
  label: string
  unit?: string
  type: 'number' | 'text' | 'select'
  options?: string[]
}

// "Asosiy" maydonlar tashriflar jadvalidagi haqiqiy ustunlarga to'g'ri keladi,
// qolganlari natija_json ustunida saqlanadi.
export const asosiyMaydonKalitlari = [
  'tomon', 'daraja', 'vena_diametri', 'reflux',
  'sperm_konts', 'sperm_harakat', 'sperm_morf',
  'testosteron', 'fsh', 'lh',
]

export const testNatijaMaydonlari: Record<string, Maydon[]> = {
  'PSA (umumiy)': [
    { key: 'psa', label: 'PSA', unit: 'ng/ml', type: 'number' },
  ],
  'Uroflowmetriya (siydik oqimi tezligi)': [
    { key: 'oqim_tezligi', label: 'Maksimal oqim tezligi', unit: 'ml/s', type: 'number' },
  ],
  'Prostata USI (TRUS)': [
    { key: 'prostata_hajmi', label: 'Prostata hajmi', unit: 'ml', type: 'number' },
  ],
  'Umumiy siydik tahlili': [
    { key: 'leykotsit', label: 'Leykotsit', unit: 'p/k', type: 'text' },
    { key: 'eritrotsit', label: 'Eritrotsit', unit: 'p/k', type: 'text' },
    { key: 'protein', label: 'Protein', type: 'text' },
  ],
  'Siydik bakposevi': [
    { key: 'bakposev', label: 'Bakposev natijasi', type: 'text' },
  ],
  'Buyrak-qovuq USI': [
    { key: 'buyrak_qovuq_usi', label: 'USI xulosasi', type: 'text' },
  ],
  'Buyrak USI': [
    { key: 'buyrak_usi', label: 'USI xulosasi', type: 'text' },
  ],
  'Qon biokimyosi (kreatinin, urea)': [
    { key: 'kreatinin', label: 'Kreatinin', unit: 'mkmol/l', type: 'number' },
    { key: 'urea', label: 'Urea', unit: 'mmol/l', type: 'number' },
  ],
  'Qovuq USI': [
    { key: 'qovuq_usi', label: 'USI xulosasi', type: 'text' },
  ],
  'Urodinamik tekshiruv': [
    { key: 'urodinamika', label: 'Xulosa', type: 'text' },
  ],
  'Testosteron': [
    { key: 'testosteron', label: 'Testosteron', unit: 'nmol/l', type: 'number' },
  ],
  'Gormonal panel (FSH, LH, prolaktin)': [
    { key: 'fsh', label: 'FSH', unit: 'mIU/ml', type: 'number' },
    { key: 'lh', label: 'LH', unit: 'mIU/ml', type: 'number' },
    { key: 'prolaktin', label: 'Prolaktin', unit: 'ng/ml', type: 'number' },
  ],
  'Gormonal panel (FSH, LH, testosteron, prolaktin)': [
    { key: 'fsh', label: 'FSH', unit: 'mIU/ml', type: 'number' },
    { key: 'lh', label: 'LH', unit: 'mIU/ml', type: 'number' },
    { key: 'testosteron', label: 'Testosteron', unit: 'nmol/l', type: 'number' },
    { key: 'prolaktin', label: 'Prolaktin', unit: 'ng/ml', type: 'number' },
  ],
  'Penil doppler USI': [
    { key: 'penil_doppler', label: 'Xulosa', type: 'text' },
  ],
  'Moshonka doppler USI': [
    { key: 'tomon', label: 'Tomoni', type: 'select', options: ['chap', "o'ng", 'ikki tomonlama'] },
    { key: 'daraja', label: 'Darajasi (Dubin)', type: 'select', options: ['I', 'II', 'III'] },
    { key: 'vena_diametri', label: 'Vena diametri', unit: 'mm', type: 'number' },
    { key: 'reflux', label: 'Reflux', type: 'select', options: ['bor', "yo'q"] },
  ],
  'Spermogramma': [
    { key: 'sperm_konts', label: 'Konsentratsiya', unit: 'mln/ml', type: 'number' },
    { key: 'sperm_harakat', label: 'Harakatchanlik', unit: '%', type: 'number' },
    { key: 'sperm_morf', label: 'Normal morfologiya', unit: '%', type: 'number' },
  ],
}

// Buyurilgan tekshiruvlar matnidan (vergul bilan ajratilgan) tegishli
// maydonlar ro'yxatini chiqarib beradi, dublikatlarsiz, test nomi bo'yicha guruhlangan.
export function tekshiruvBoyichaMaydonlar(buyurilganTekshiruvlar: string): { test: string; maydonlar: Maydon[] }[] {
  const testlar = buyurilganTekshiruvlar.split(',').map((s) => s.trim()).filter(Boolean)
  const korilganKalitlar = new Set<string>()
  const natija: { test: string; maydonlar: Maydon[] }[] = []

  for (const test of testlar) {
    const maydonlar = testNatijaMaydonlari[test]
    if (!maydonlar) continue
    const yangiMaydonlar = maydonlar.filter((m) => {
      if (korilganKalitlar.has(m.key)) return false
      korilganKalitlar.add(m.key)
      return true
    })
    if (yangiMaydonlar.length > 0) natija.push({ test, maydonlar: yangiMaydonlar })
  }
  return natija
}
