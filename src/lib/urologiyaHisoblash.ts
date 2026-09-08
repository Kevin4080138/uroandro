// Urologiya kalkulyatorlarining sof mantig'i — doctor va student sahifalari
// bir manbani ulashadi (matn/formula ikki joyda ajralib qolmasin).

// ─── eGFR (CKD-EPI 2021, irqsiz) ──────────────────────────────────────────
// Kreatinin mg/dL da. µmol/L → mg/dL: ÷88.4.
export function ckdEpi2021(kreatininMgDl: number, yosh: number, jins: 'erkak' | 'ayol') {
  const k = jins === 'ayol' ? 0.7 : 0.9
  const a = jins === 'ayol' ? -0.241 : -0.302
  const minScr = Math.min(kreatininMgDl / k, 1)
  const maxScr = Math.max(kreatininMgDl / k, 1)
  let egfr = 142 * Math.pow(minScr, a) * Math.pow(maxScr, -1.2) * Math.pow(0.9938, yosh)
  if (jins === 'ayol') egfr *= 1.012
  return egfr
}

export function egfrBosqich(egfr: number) {
  if (egfr >= 90) return { nom: 'G1 — Normal yoki yuqori', rang: '#16a34a' }
  if (egfr >= 60) return { nom: 'G2 — Yengil pasaygan', rang: '#65a30d' }
  if (egfr >= 45) return { nom: "G3a — O'rtacha pasaygan", rang: '#d97706' }
  if (egfr >= 30) return { nom: "G3b — O'rtacha-og'ir pasaygan", rang: '#ea580c' }
  if (egfr >= 15) return { nom: "G4 — Og'ir pasaygan", rang: '#dc2626' }
  return { nom: 'G5 — Buyrak yetishmovchiligi', rang: '#991b1b' }
}

// ─── IPSS / AUA-SS ────────────────────────────────────────────────────────
const IPSS_CHASTOTA = ['Hech qachon', "5 martadan kamida 1 marta", 'Yarmidan kamida', 'Taxminan yarmida', "Yarmidan ko'pida", 'Deyarli har doim'] as const

export const IPSS_SAVOLLAR: { key: string; matn: string; variantlar: readonly string[] }[] = [
  { key: 'tuliq_bosalmaslik', matn: "So'nggi 1 oy ichida siydikni chiqarib bo'lgandan keyin siydik pufagi to'liq bo'shamagandek tuyulgan holatlar qanchalik tez-tez bo'lgan?", variantlar: IPSS_CHASTOTA },
  { key: 'tezlik', matn: "So'nggi 1 oy ichida siydikni chiqargandan 2 soat o'tmay yana siyishga ehtiyoj qanchalik tez-tez bo'lgan?", variantlar: IPSS_CHASTOTA },
  { key: 'uzilib_uzilib', matn: "So'nggi 1 oy ichida siyish vaqtida oqim bir necha marta to'xtab-to'xtab davom etgan holatlar qanchalik tez-tez bo'lgan?", variantlar: IPSS_CHASTOTA },
  { key: 'toxtatolmaslik', matn: "So'nggi 1 oy ichida siyishni kechiktirish qiyin bo'lgan (zudlik bilan siyishga majbur bo'lgan) holatlar qanchalik tez-tez bo'lgan?", variantlar: IPSS_CHASTOTA },
  { key: 'kuchsiz_oqim', matn: "So'nggi 1 oy ichida siydik oqimi kuchsiz bo'lgan holatlar qanchalik tez-tez bo'lgan?", variantlar: IPSS_CHASTOTA },
  { key: 'kuchanish', matn: "So'nggi 1 oy ichida siyishni boshlash uchun kuchanishga (zo'riqishga) to'g'ri kelgan holatlar qanchalik tez-tez bo'lgan?", variantlar: IPSS_CHASTOTA },
  { key: 'tungi_siyish', matn: "So'nggi 1 oy ichida, odatda, kechasi uxlab yotganda necha marta siyish uchun turishga to'g'ri kelgan?", variantlar: ['Hech qachon', '1 marta', '2 marta', '3 marta', '4 marta', "5 va undan ko'p marta"] },
]

export const IPSS_QOL_VARIANTLAR = [
  'Juda mamnunman', 'Mamnunman', 'Asosan qoniqarli',
  'Aralash (taxminan baravar qoniqarli/noqoniqarli)', 'Asosan noqoniqarli', 'Noxush', 'Juda yomon',
]

export function ipssDaraja(jami: number) {
  if (jami <= 7) return { nom: 'Yengil simptomlar', rang: '#16a34a', tavsif: "Faol kuzatuv (watchful waiting) tavsiya etiladi, hayot tarzini o'zgartirish yetarli bo'lishi mumkin." }
  if (jami <= 19) return { nom: "O'rtacha simptomlar", rang: '#d97706', tavsif: "Ball o'zi davolashni boshlamaydi: qaror bezovtalik darajasi (QoL), asoratlar, tekshiruv natijalari va bemor xohishiga bog'liq. Kuzatuv, hayot tarzini o'zgartirish yoki dorivor davolash (alfa-blokator, 5-alfa-reduktaza inhibitori) ko'rib chiqiladi." }
  return { nom: "Og'ir simptomlar", rang: '#dc2626', tavsif: "Urolog konsultatsiyasi va keng tekshiruv, ko'pincha jarrohlik davolanishi ko'rib chiqiladi." }
}

// ─── PSA ──────────────────────────────────────────────────────────────────
export const PSAD_CHEGARA = 0.15

// Yoshga moslashgan PSA me'zonlari (Oesterling va boshq., AUA qo'llanmasi)
export const PSA_YOSH_MEZONLARI = [
  { oraliq: [40, 49], maxPSA: 2.5 },
  { oraliq: [50, 59], maxPSA: 3.5 },
  { oraliq: [60, 69], maxPSA: 4.5 },
  { oraliq: [70, 120], maxPSA: 6.5 },
] as const

export function psaYoshMezoni(yosh: number) {
  return PSA_YOSH_MEZONLARI.find((m) => yosh >= m.oraliq[0] && yosh <= m.oraliq[1]) ?? PSA_YOSH_MEZONLARI[PSA_YOSH_MEZONLARI.length - 1]
}

// 4–10 ng/mL "kulrang zona"da erkin/umumiy PSA nisbati bo'yicha taxminiy xavf.
export function fpsaXavf(foiz: number) {
  if (foiz < 10) return { daraja: 'Yuqori xavf', ehtimol: '~56%', rang: '#dc2626' }
  if (foiz < 15) return { daraja: "O'rtacha-yuqori xavf", ehtimol: '~28%', rang: '#ea580c' }
  if (foiz < 20) return { daraja: "O'rtacha xavf", ehtimol: '~20%', rang: '#d97706' }
  if (foiz < 25) return { daraja: "Past-o'rtacha xavf", ehtimol: '~16%', rang: '#65a30d' }
  return { daraja: 'Past xavf', ehtimol: '~8%', rang: '#16a34a' }
}

// O'nlik son: vergulni ham qabul qilamiz ("5,2" → 5.2).
export function sonOqi(qiymat: string) {
  return parseFloat(qiymat.replace(',', '.'))
}
