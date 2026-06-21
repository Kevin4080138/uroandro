// Shikoyat toifasiga (organga) qarab tavsiya etiladigan standart tekshiruvlar.
export const tekshiruvTavsiyalari: Record<string, string[]> = {
  Siyish: ['Umumiy siydik tahlili', 'Siydik bakposevi', 'Buyrak-qovuq USI'],
  Buyrak: ['Buyrak USI', 'Qon biokimyosi (kreatinin, urea)', 'Umumiy siydik tahlili'],
  Qovuq: ['Qovuq USI', 'Umumiy siydik tahlili', 'Urodinamik tekshiruv'],
  'Prostata bezi': ['PSA (umumiy)', 'Prostata USI (TRUS)', 'Uroflowmetriya (siydik oqimi tezligi)'],
  'Jinsiy aloqa': ['Testosteron', 'Gormonal panel (FSH, LH, prolaktin)', 'Penil doppler USI'],
  'Moshonka / Tuxumdon': ['Moshonka doppler USI', 'Testosteron'],
  'Bepushtlik / reproduktiv': ['Spermogramma', 'Gormonal panel (FSH, LH, testosteron, prolaktin)', 'Moshonka doppler USI'],
}
