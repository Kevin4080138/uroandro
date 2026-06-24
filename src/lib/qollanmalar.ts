export type Qollanma = {
  nom: string
  tashkilot: string
  tavsif: string
  url: string
  kategoriya: string
  kalkulyator?: string // bog'liq kalkulyator slug (mavjud bo'lsa)
}

export const QOLLANMALAR: Qollanma[] = [
  {
    nom: 'EAU Guidelines', tashkilot: 'European Association of Urology',
    tavsif: "Yevropa urologiya assotsiatsiyasining yillik yangilanadigan, barcha urologik kasalliklarni qamrab oluvchi to'liq klinik qo'llanmalari to'plami.",
    url: 'https://uroweb.org/guidelines', kategoriya: 'Umumiy',
  },
  {
    nom: 'AUA Guidelines', tashkilot: 'American Urological Association',
    tavsif: "Amerika urologiya assotsiatsiyasining klinik amaliyot bo'yicha rasmiy tavsiyalari va bayonotlari.",
    url: 'https://www.auanet.org/guidelines-and-quality/guidelines', kategoriya: 'Umumiy',
  },
  {
    nom: 'NICE Guidance', tashkilot: 'National Institute for Health and Care Excellence (UK)',
    tavsif: "Britaniya milliy sog'liqni saqlash institutining dalillarga asoslangan klinik tavsiyalari.",
    url: 'https://www.nice.org.uk/guidance', kategoriya: 'Umumiy',
  },
  {
    nom: 'EAU Male Sexual & Reproductive Health', tashkilot: 'European Association of Urology',
    tavsif: "Erektil disfunksiya, erkak bepushtligi va jinsiy salomatlik bo'yicha EAU qo'llanmasi.",
    url: 'https://uroweb.org/guidelines/sexual-and-reproductive-health', kategoriya: 'Andrologiya', kalkulyator: 'iief5',
  },
  {
    nom: 'WHO Laboratory Manual (Semen)', tashkilot: 'World Health Organization',
    tavsif: "Spermogramma tahlili va baholash uchun rasmiy WHO laboratoriya qo'llanmasi (6-nashr, 2021).",
    url: 'https://www.who.int/teams/sexual-and-reproductive-health-and-research', kategoriya: 'Andrologiya', kalkulyator: 'spermogramma',
  },
  {
    nom: 'ISSM Clinical Guidelines', tashkilot: 'International Society for Sexual Medicine',
    tavsif: "Erektil disfunksiya, erta ejakulyatsiya va boshqa jinsiy salomatlik muammolari bo'yicha xalqaro tavsiyalar.",
    url: 'https://www.issm.info/sexual-health-headlines/issm-guidelines', kategoriya: 'Andrologiya', kalkulyator: 'iief5',
  },
  {
    nom: 'EAU Male Infertility Guidelines', tashkilot: 'European Association of Urology',
    tavsif: "Erkak bepushtligini tashxislash va davolash bo'yicha EAU qo'llanmasi, varikotsele bo'limi bilan birga.",
    url: 'https://uroweb.org/guidelines/sexual-and-reproductive-health/male-infertility', kategoriya: 'Andrologiya', kalkulyator: 'dubin-amelar',
  },
  {
    nom: 'EAU Non-neurogenic Male LUTS / BPH', tashkilot: 'European Association of Urology',
    tavsif: "Benign prostata giperplaziyasi va pastki siydik yo'llari simptomlarini davolash bo'yicha qo'llanma.",
    url: 'https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts', kategoriya: 'Prostata', kalkulyator: 'ipss',
  },
  {
    nom: 'AUA BPH Guideline', tashkilot: 'American Urological Association',
    tavsif: "Benign prostata giperplaziyasi simptomlarini baholash va bosqichma-bosqich davolash algoritmi.",
    url: 'https://www.auanet.org/guidelines-and-quality/guidelines/benign-prostatic-hyperplasia-(bph)-guideline', kategoriya: 'Prostata', kalkulyator: 'ipss',
  },
  {
    nom: 'EAU Chronic Pelvic Pain', tashkilot: 'European Association of Urology',
    tavsif: "Surunkali prostatit va kichik chanoq og'rig'i sindromi (CP/CPPS) bo'yicha tashxis va davolash tavsiyalari.",
    url: 'https://uroweb.org/guidelines/chronic-pelvic-pain', kategoriya: 'Prostata', kalkulyator: 'nih-cpsi',
  },
  {
    nom: 'EAU Prostate Cancer Guidelines', tashkilot: 'European Association of Urology',
    tavsif: "Prostata saratonini erta aniqlash, PSA skrining strategiyasi va davolash bosqichlari bo'yicha qo'llanma.",
    url: 'https://uroweb.org/guidelines/prostate-cancer', kategoriya: 'Onkourologiya', kalkulyator: 'psa',
  },
  {
    nom: 'EAU Renal Cell Carcinoma', tashkilot: 'European Association of Urology',
    tavsif: "Buyrak hujayrali saraton diagnostikasi, R.E.N.A.L. nefrometriya va jarrohlik strategiyasi bo'yicha qo'llanma.",
    url: 'https://uroweb.org/guidelines/renal-cell-carcinoma', kategoriya: 'Onkourologiya', kalkulyator: 'renal',
  },
  {
    nom: 'EAU Urolithiasis Guidelines', tashkilot: 'European Association of Urology',
    tavsif: "Siydik yo'li toshlari diagnostikasi, metabolik baholash va davolash usullari (ESWL, URS, PCNL) bo'yicha qo'llanma.",
    url: 'https://uroweb.org/guidelines/urolithiasis', kategoriya: 'Urolitiaz', kalkulyator: 'stone',
  },
  {
    nom: 'ICS Standardisation Reports', tashkilot: 'International Continence Society',
    tavsif: "Urodinamika, uroflowmetriya va giperaktiv siydik pufagi terminologiyasi bo'yicha xalqaro standartlashtirilgan hisobotlar.",
    url: 'https://www.ics.org/Documents', kategoriya: 'Siydik pufagi', kalkulyator: 'uroflowmetriya',
  },
  {
    nom: 'KDIGO CKD Guideline', tashkilot: 'Kidney Disease: Improving Global Outcomes',
    tavsif: "Surunkali buyrak kasalligini baholash, bosqichlash (eGFR/CKD-EPI) va kuzatish bo'yicha xalqaro qo'llanma.",
    url: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/', kategoriya: 'Buyrak', kalkulyator: 'egfr',
  },
  {
    nom: 'EAU Paediatric Urology', tashkilot: 'European Association of Urology',
    tavsif: "Bolalarda urologik anomaliyalar, krptorxizm, vezikoureteral reflyuks va boshqa pediatrik holatlar bo'yicha qo'llanma.",
    url: 'https://uroweb.org/guidelines/paediatric-urology', kategoriya: 'Pediatrik',
  },
]

export const QOLLANMA_KATEGORIYALARI = ['Hammasi', ...Array.from(new Set(QOLLANMALAR.map((q) => q.kategoriya)))]
