// Kalkulyatorlar ro'yxati — shifokor va talaba bo'limlari uchun bitta manba.
//
// Sahifalar `src/app/doctor/calculators/<slug>/` da turadi. Talaba bo'limi ham
// shu sahifalarga havola qiladi: kalkulyator o'quv vositasi, bemor ma'lumoti
// yo'q, shuning uchun ikkala rol uchun bir xil.
//
// `oquv` — talaba bo'limida ko'rsatiladigan "nima o'rganasiz" izohi. Shifokorga
// vosita kerak, talabaga esa uning MA'NOSI kerak: shkala nimani o'lchaydi,
// qaysi chegara qiymat qarorni o'zgartiradi.

export type Kalkulyator = {
  slug: string
  icon: string
  title: string
  desc: string
  kategoriya: string
  faol: boolean
  gradient: string
  oquv?: string
}

export const KALK_KATEGORIYALARI = [
  'Hammasi', 'Prostata', 'Erektil funksiya', 'Erkak bepushtligi', 'Buyrak', 'Siydik pufagi', 'Jarrohlik',
] as const

export const KALKULYATORLAR: Kalkulyator[] = [
  // --- Tartib: IPSS, IIEF-5, NIH-CPSI, EHS, PSA, PCPT, CAPRA, Charlson, Clavien-Dindo, AMS, ADAM, PEDT, WHO Spermogramma, eGFR, RENAL ---
  {
    slug: 'ipss', icon: '📊', title: 'IPSS / AUA-SS',
    desc: 'Xalqaro prostata simptomlari indeksi — 7 savol bo\'yicha og\'irlik darajasini baholash',
    kategoriya: 'Prostata', faol: true, gradient: 'linear-gradient(135deg, #2563eb, #0891b2)',
    oquv: "0–7 yengil · 8–19 o'rta · 20–35 og'ir. Davolash tanlashda birinchi qadam: 8 dan yuqori ball dori davolashni boshlash uchun asos bo'ladi.",
  },
  {
    slug: 'iief5', icon: '💙', title: 'IIEF-5 (SHIM)',
    desc: 'Erektil disfunksiyani 5 savollik anketa orqali baholash',
    kategoriya: 'Erektil funksiya', faol: true, gradient: 'linear-gradient(135deg, #db2777, #f43f5e)',
    oquv: "5–25 ball. 22 dan past — erektil disfunksiya bor. 5–7 og'ir, 8–11 o'rta, 12–16 yengil-o'rta, 17–21 yengil.",
  },
  {
    slug: 'nih-cpsi', icon: '🔥', title: 'NIH-CPSI',
    desc: 'Surunkali prostatit / chanoq og\'rig\'i sindromi indeksi',
    kategoriya: 'Prostata', faol: true, gradient: 'linear-gradient(135deg, #b91c1c, #ea580c)',
    oquv: "Uch qism: og'riq, siyish, hayot sifati. Og'riq qismi eng og'irlikli — CPPS da asosiy shikoyat shu.",
  },
  {
    slug: 'ehs', icon: '💎', title: 'EHS — Ereksiya Qattiqligi',
    desc: '4 bosqichli shkala orqali ereksiya sifatini tezkor baholash (EAU tavsiyasi)',
    kategoriya: 'Erektil funksiya', faol: true, gradient: 'linear-gradient(135deg, #7c3aed, #db2777)',
    oquv: "4 bosqich: 1 — kattalashadi lekin qattiq emas, 4 — to'liq qattiq. Tez baholash uchun, anketa o'rniga.",
  },
  {
    slug: 'psa', icon: '🩸', title: 'PSA kalkulyatori',
    desc: 'Yoshga moslashgan me\'zonlar, PSA zichligi va erkin/umumiy PSA nisbati',
    kategoriya: 'Prostata', faol: true, gradient: 'linear-gradient(135deg, #dc2626, #f97316)',
    oquv: "Yoshga moslashgan me'zon muhim: 40–49 yosh uchun 2.5 ng/ml, 70+ uchun 6.5. PSA zichligi 0.15 dan yuqori bo'lsa biopsiya haqida o'ylanadi.",
  },
  {
    slug: 'pcpt', icon: '🔬', title: 'PCPT Risk Kalkulyatori',
    desc: 'PSA, yosh, irq, DRE va anamnez asosida prostata saratoni xavfini hisoblash',
    kategoriya: 'Prostata', faol: true, gradient: 'linear-gradient(135deg, #b91c1c, #7c3aed)',
    oquv: "PSA ning o'zi yetarli emas — yosh, DRE va anamnez bilan birga xavf hisoblanadi. Ortiqcha biopsiyadan saqlaydi.",
  },
  {
    slug: 'capra', icon: '🎯', title: 'CAPRA Score',
    desc: 'PSA, Gleason, bosqich, yosh va biyopsiya asosida prostata saratoni prognozini baholash',
    kategoriya: 'Prostata', faol: true, gradient: 'linear-gradient(135deg, #dc2626, #9333ea)',
    oquv: "0–10 ball: 0–2 past xavf, 3–5 o'rta, 6+ yuqori. Operatsiyadan keyingi retsidiv ehtimolini bashorat qiladi.",
  },
  {
    slug: 'charlson', icon: '🏥', title: 'Charlson Comorbidity Index',
    desc: '19 kasallik va yosh asosida operatsiya xavfi va 10 yillik tiriklikni hisoblash',
    kategoriya: 'Jarrohlik', faol: true, gradient: 'linear-gradient(135deg, #0369a1, #6366f1)',
    oquv: "Yondosh kasalliklar og'irligi. Operatsiyaga ko'rsatma berishda: ball yuqori bo'lsa, agressiv davolash foydadan ko'ra zarar keltirishi mumkin.",
  },
  {
    slug: 'clavien-dindo', icon: '⚕️', title: 'Clavien-Dindo Klassifikatsiyasi',
    desc: 'Jarrohlik asoratlari og\'irligini I–V darajali standartlashtirilgan shkala bilan baholash',
    kategoriya: 'Jarrohlik', faol: true, gradient: 'linear-gradient(135deg, #1d4ed8, #dc2626)',
    oquv: "Operatsiyadan keyingi asoratlarni I–V darajada tasniflaydi. IIIb dan boshlab qayta operatsiya kerak bo'ladi.",
  },
  {
    slug: 'ams', icon: '🧬', title: 'AMS Score',
    desc: 'Erkaklar qarilik simptomlari (somatik, psixologik, jinsiy) — 17 savollik anketa',
    kategoriya: 'Erektil funksiya', faol: true, gradient: 'linear-gradient(135deg, #7c3aed, #db2777)',
    oquv: "Erkaklarda yoshga bog'liq androgen tanqisligi belgilarini baholaydi — testosteron tekshirishga ko'rsatma berish uchun.",
  },
  {
    slug: 'adam', icon: '🧪', title: 'Testosteron tanqisligi (ADAM)',
    desc: 'Erkaklarda androgen yetishmovchiligi anketasi orqali dastlabki baholash',
    kategoriya: 'Erektil funksiya', faol: true, gradient: 'linear-gradient(135deg, #4338ca, #6366f1)',
    oquv: "10 savollik skrining. Ijobiy javob testosteron tekshirishga asos bo'ladi, tashxis emas.",
  },
  {
    slug: 'pedt', icon: '⏱️', title: 'PEDT',
    desc: 'Erta eyakulyatsiyani 5 savollik diagnostik anketa orqali aniqlash',
    kategoriya: 'Erektil funksiya', faol: true, gradient: 'linear-gradient(135deg, #0891b2, #6366f1)',
    oquv: "Erta eyakulyatsiyani anketa orqali baholaydi. 11 dan yuqori — ehtimol bor, 9–10 chegara.",
  },
  {
    slug: 'spermogramma', icon: '🔭', title: 'WHO 2021 spermogramma',
    desc: 'Sperma tahlili ko\'rsatkichlarini WHO 6-nashr me\'zonlari bilan solishtirish',
    kategoriya: 'Erkak bepushtligi', faol: true, gradient: 'linear-gradient(135deg, #0d9488, #22c55e)',
    oquv: "WHO 2021 me'zonlari: konsentratsiya ≥16 mln/ml, harakatchanlik ≥42%, morfologiya ≥4%. Bir tahlil yetarli emas — 2–3 marta takrorlanadi.",
  },
  {
    slug: 'egfr', icon: '🫘', title: 'eGFR (CKD-EPI)',
    desc: 'Kreatinin, yosh va jins asosida buyrak filtratsiya tezligini hisoblash',
    kategoriya: 'Buyrak', faol: true, gradient: 'linear-gradient(135deg, #0369a1, #38bdf8)',
    oquv: "Buyrak funksiyasini bosqichlarga ajratadi (G1–G5). 60 dan past — surunkali buyrak kasalligi, dori dozalari qayta hisoblanadi.",
  },
  {
    slug: 'renal', icon: '🗺️', title: 'R.E.N.A.L. nefrometriya',
    desc: 'Buyrak o\'smasi murakkabligini USI/KT o\'lchamlari bo\'yicha ballash',
    kategoriya: 'Buyrak', faol: true, gradient: 'linear-gradient(135deg, #15803d, #84cc16)',
    oquv: "Buyrak o'smasining anatomik murakkabligini ball bilan o'lchaydi — qisman nefrektomiya mumkinmi yoki yo'qmi, shu hal qiladi.",
  },
  // Qolgan kalkulyatorlar
  {
    slug: 'prostata-hajmi', icon: '🍈', title: 'Prostata hajmi',
    desc: 'USI o\'lchamlari (uzunlik × kenglik × balandlik) asosida ellipsoid formula bo\'yicha hajm',
    kategoriya: 'Prostata', faol: true, gradient: 'linear-gradient(135deg, #ea580c, #facc15)',
    oquv: "Ellipsoid formulasi: uzunlik × eni × balandlik × 0.52. 30 ml dan katta prostata — BPH da dori tanlashga ta'sir qiladi.",
  },
  {
    slug: 'varikotsele', icon: '🧮', title: 'Varikotsele solishtirish',
    desc: 'Laparoskopik, Marmar, Skleroterapiya, Palomo, Ivanissevich usullarini qiyosiy tahlil qilish',
    kategoriya: 'Erkak bepushtligi', faol: true, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    oquv: "Usullarni retsidiv, gidrotsele xavfi va arteriya saqlanishi bo'yicha solishtiradi. Mikrojarrohlik (Marmar) — zamonaviy standart.",
  },
  {
    slug: 'dubin-amelar', icon: '🔬', title: 'Dubin-Amelar darajasi',
    desc: 'Varikotsele klinik darajasini (I–III) tekshiruv natijalari bo\'yicha aniqlash',
    kategoriya: 'Erkak bepushtligi', faol: true, gradient: 'linear-gradient(135deg, #7c3aed, #c026d3)',
    oquv: "I daraja faqat Valsalva bilan, II — palpatsiyada, III — ko'z bilan ko'rinadi. Daraja operatsiyaga ko'rsatmaga ta'sir qiladi.",
  },
  {
    slug: 'cockcroft-gault', icon: '⚗️', title: 'Kreatinin klirensi (Cockcroft-Gault)',
    desc: 'Tana vazni, yosh va kreatinin asosida klirensni baholash',
    kategoriya: 'Buyrak', faol: true, gradient: 'linear-gradient(135deg, #0e7490, #06b6d4)',
    oquv: "Kreatinin klirensi — dori dozasini moslashda hali ham ishlatiladi, ayniqsa antibiotiklarda.",
  },
  {
    slug: 'stone', icon: '🪨', title: 'STONE skor',
    desc: 'Siydik yo\'li toshi ehtimolini klinik belgilar bo\'yicha bashorat qilish',
    kategoriya: 'Buyrak', faol: true, gradient: 'linear-gradient(135deg, #57534e, #a8a29e)',
    oquv: "Buyrak kolikasida tosh ehtimolini klinik belgilardan bashorat qiladi — KT ni har doim ham qilmaslik uchun.",
  },
  {
    slug: 'uroflowmetriya', icon: '💧', title: 'Uroflowmetriya baholash',
    desc: 'Siydik oqimi tezligi (Qmax) natijalarini yosh me\'zonlari bilan izohlash',
    kategoriya: 'Siydik pufagi', faol: true, gradient: 'linear-gradient(135deg, #1d4ed8, #06b6d4)',
    oquv: "Qmax 15 ml/s dan yuqori — normal, 10 dan past — obstruksiya ehtimoli yuqori. Hajm 150 ml dan kam bo'lsa natija ishonchsiz.",
  },
  {
    slug: 'oab-v8', icon: '🚻', title: 'OAB-V8',
    desc: 'Giperaktiv siydik pufagi simptomlarini skrining anketasi orqali baholash',
    kategoriya: 'Siydik pufagi', faol: true, gradient: 'linear-gradient(135deg, #9333ea, #d946ef)',
    oquv: "8 ta savol. 8 ball va undan yuqori — giperaktiv qovuq ehtimoli, keyingi tekshiruvga asos.",
  },
]
