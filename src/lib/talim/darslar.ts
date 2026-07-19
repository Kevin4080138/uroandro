export type TestSavoli = {
  savol: string
  variantlar: string[]
  togri: number
  izoh: string
}

export type DarsBolimi = {
  sarlavha: string
  matn: string[] // har bir elementi alohida paragraf
}

export type UsmleSavoli = TestSavoli & {
  vinyetka?: string // klinik holat matni (bemor yoshi, shikoyati, tekshiruv natijalari)
}

export type Bosqich = 'oson' | "o'rta" | 'qiyin'

export type Dars = {
  slug: string
  sarlavha: string
  kategoriya: string
  bosqich: Bosqich
  qisqa: string
  daqiqa: number
  bolimlar: DarsBolimi[]
  manbalar: string[]
  test: TestSavoli[] // eski darslar uchun — to'g'ridan-to'g'ri ko'rsatiladigan qisqa test

  // Quyidagilar ixtiyoriy — to'liq jihozlangan darslar (masalan HARD bosqich) uchun
  nazariyaHtml?: string // tashqi tahririyatdan tayyor HTML (jadval/callout bilan) — mavjud bo'lsa bolimlar/manbalar o'rniga shu ko'rsatiladi
  nazariyaIframe?: string // /public/ papkasidagi standalone HTML nazariya sahifasining yo'li (iframe orqali ko'rsatiladi)
  asosiyVideoUrl?: string
  videoLinklar?: string[]
  konspektUrl?: string
  prezentatsiyaUrl?: string
  savollarBanki?: TestSavoli[] // 100talik bank — amaliy testda shu yerdan random 20 tasi tanlanadi
  amaliySavolSoni?: number // amaliy testda bankdan nechta savol tasodifiy tanlanadi (default 20)
  usmleSavollar?: UsmleSavoli[]
  nazoratSavollar?: TestSavoli[]
  nazoratSavolSoni?: number // nazoratda nechta savol so'raladi (default 20)
  nazoratVaqtDaqiqa?: number // nazorat uchun vaqt chegarasi (default 15)
  sertifikatOtishFoizi?: number // shu foizdan yuqori bo'lsa sertifikatga loyiq (default 70)
  bepulNamuna?: boolean // obunasiz ham to'liq ko'rish mumkin — bosqichni "sinab ko'rish" uchun
}

export const BOSQICHLAR: { id: Bosqich; nom: string; emoji: string; tavsif: string }[] = [
  {
    id: 'oson', nom: 'EASY — Asoslar', emoji: '🟢',
    tavsif: "Urologiyani endi boshlagan talabalar uchun — asosiy tushunchalar va dastlabki bilimlar",
  },
  {
    id: "o'rta", nom: "O'RTA — Klinik chuqurlik", emoji: '🟡',
    tavsif: "Amaliyotda tez-tez uchraydigan kasalliklar bo'yicha chuqur klinik bilim",
  },
  {
    id: 'qiyin', nom: 'QIYIN — Murakkab holatlar', emoji: '🔴',
    tavsif: "Campbell-Walsh darajasida — barcha kasalliklarni chuqur qamrab oluvchi to'liq kurs",
  },
]

// URL'da apostrof noqulay bo'lgani uchun (o'rta), bosqichlar uchun alohida yo'l-nom moslamasi.
export const BOSQICH_YOLI: Record<Bosqich, string> = { oson: 'oson', "o'rta": 'orta', qiyin: 'qiyin' }

export function bosqichYolidanTop(yol: string): Bosqich | null {
  const topilgan = (Object.entries(BOSQICH_YOLI) as [Bosqich, string][]).find(([, v]) => v === yol)
  return topilgan ? topilgan[0] : null
}

// Har bir bosqich ichida mavzular "umumiy/kirishdan murakkabga" tartibda ko'rinishi uchun
// kategoriyalarning to'g'ri ketma-ketligi (kodda yozilish tartibi har doim mos kelmaydi,
// masalan eski darslar fayl boshida joylashgan bo'lishi mumkin).
export const BOSQICH_KATEGORIYA_TARTIBI: Record<Bosqich, string[]> = {
  oson: [
    'Kirish va semiotika',
    'Anatomiya va fiziologiya',
    "Yallig'lanish kasalliklari",
    "Buyrak va siydik yo'llari",
    "Prostata va erkak jinsiy a'zolari",
    'Shoshilinch holatlar',
  ],
  "o'rta": [
    'Kirish va diagnostika',
    'Anatomiya va fiziologiya',
    "Yallig'lanish va infeksion kasalliklar",
    "Buyrak va siydik yo'llari kasalliklari",
    "Prostata va erkak jinsiy a'zolari",
    'Shoshilinch urologiya',
    'Reproduktiv va seksual salomatlik',
  ],
  qiyin: [
    'Kirish va asoslar',
    'Anatomiya, fiziologiya va embriologiya',
    "Yallig'lanish va infeksion kasalliklar",
    "Buyrak va siydik yo'llari kasalliklari",
    "Prostata va erkak jinsiy a'zolari kasalliklari",
    'Onkourologiya',
    "Shoshilinch urologiya (o'tkir holatlar)",
    'Reproduktiv va seksual salomatlik',
  ],
}

// Darslarni bosqich ichidagi to'g'ri bob tartibida saralaydi (kategoriya bo'yicha),
// bir xil kategoriya ichida esa asl (kodda yozilgan) tartib saqlanadi.
export function bosqichBoyichaTartibla(darslar: Dars[], bosqich: Bosqich): Dars[] {
  const tartib = BOSQICH_KATEGORIYA_TARTIBI[bosqich]
  return [...darslar].sort((a, b) => {
    const ai = tartib.indexOf(a.kategoriya)
    const bi = tartib.indexOf(b.kategoriya)
    return (ai === -1 ? tartib.length : ai) - (bi === -1 ? tartib.length : bi)
  })
}

export const DARS_KATEGORIYALARI = [
  'Hammasi',
  'Kirish va semiotika',
  'Anatomiya va fiziologiya',
  "Yallig'lanish kasalliklari",
  "Buyrak va siydik yo'llari",
  "Prostata va erkak jinsiy a'zolari",
  'Shoshilinch holatlar',
  'Prostata',
  'Andrologiya',
  'Urolitiaz',
  'Onkourologiya',
] as const

// DIQQAT: darslarning og'ir tarkibi (nazariya HTML, savol banklari, USMLE/nazorat testlari)
// endi `dars_tarkibi` jadvalida (Supabase) saqlanadi — bu ro'yxatda faqat yengil metama'lumot
// (slug, sarlavha, bosqich, iframe yo'li) qoladi, aks holda hammasi client bundle'ga yuklanadi.
// Yangi dars tarkibi ham to'g'ridan-to'g'ri bazaga yoziladi (seed migratsiya yoki admin orqali).
export const DARSLAR: Dars[] = [
  // EASY bosqichning namunaviy darsi — yangi qoidalar bo'yicha yozilgan
  // (AGENTS.md, "Nazariya yozish qoidalari"). Qolgan EASY darslari shu
  // qolipda qayta yoziladi. Nazariyasi `dars_tarkibi` jadvalida.
  {
    slug: 'prostata-adenomasi-asoslari',
    sarlavha: 'Prostata adenomasi — bu nima?',
    kategoriya: "Prostata va erkak jinsiy a'zolari",
    bosqich: 'oson',
    qisqa: "Prostata nima uchun kattayadi, buni qanday tanib olish mumkin va qachon shoshilinch yordam kerak.",
    daqiqa: 6,
    bolimlar: [],
    manbalar: [],
    test: [],
    amaliySavolSoni: 15,
    bepulNamuna: true,
  },
  {
    slug: 'bph-luts',
    sarlavha: "Benign prostata giperplaziyasi (BPH) va pastki siydik yo'llari simptomlari",
    kategoriya: "Prostata va erkak jinsiy a'zolari kasalliklari",
    bosqich: 'qiyin',
    bepulNamuna: true,
    qisqa: "BPH nima, qanday simptomlar beradi, qanday tashxislanadi va bosqichma-bosqich qanday davolanadi.",
    daqiqa: 9,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'prostatit-cpps',
    sarlavha: "Surunkali prostatit va kichik chanoq og'rig'i sindromi (CP/CPPS)",
    kategoriya: "Prostata va erkak jinsiy a'zolari kasalliklari",
    bosqich: 'qiyin',
    qisqa: "Prostatit turlari, NIH klassifikatsiyasi, tashxis va davolash yondashuvi.",
    daqiqa: 7,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'erektil-disfunksiya',
    sarlavha: 'Erektil disfunksiya: sabablari, baholash va davolash',
    kategoriya: 'Reproduktiv va seksual salomatlik',
    bosqich: 'qiyin',
    qisqa: "Erektsiya fiziologiyasi, ED sabablari klassifikatsiyasi va bosqichma-bosqich davolash algoritmi.",
    daqiqa: 7,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'urolitiaz',
    sarlavha: "Siydik yo'li toshlari (urolitiaz): patogenez, tashxis va davolash",
    kategoriya: "Buyrak va siydik yo'llari kasalliklari",
    bosqich: 'qiyin',
    qisqa: "Tosh turlari, klinik ko'rinish, STONE skori va zamonaviy davolash usullari (ESWL, URS, PCNL).",
    daqiqa: 8,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'prostata-saraton-asoslari',
    sarlavha: 'Prostata saratoni: erta aniqlash va asosiy davolash strategiyasi',
    kategoriya: 'Onkourologiya',
    bosqich: 'qiyin',
    qisqa: "PSA skrining, biopsiya ko'rsatmalari, Gleason tasnifi va xavf guruhlariga asoslangan davolash.",
    daqiqa: 8,
    bolimlar: [],
    manbalar: [],
    test: [],
  },

  // ============================================================
  // 🟢 EASY (1-bosqich) — Umumiy urologiya asoslari
  // ============================================================

  // I. Kirish va semiotika
  {
    slug: 'urologiya-predmeti',
    sarlavha: 'Urologiyaning predmeti va asosiy tushunchalari',
    kategoriya: 'Kirish va semiotika',
    bosqich: "o'rta",
    bepulNamuna: true,
    qisqa: "Urologiya nimani o'rganadi va uning ichki yo'nalishlari haqida umumiy tushuncha.",
    daqiqa: 10,
    bolimlar: [],
    manbalar: [],
    test: [],
    amaliySavolSoni: 15,
    },
  {
    slug: 'urologik-simptomlar',
    sarlavha: 'Asosiy urologik simptomlar: dizuriya, gematuriya, og\'riq, siydik ushlanishi',
    kategoriya: 'Kirish va semiotika',
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Urologiyada eng ko'p uchraydigan to'rt asosiy shikoyat turi va ularning ma'nosi.",
    daqiqa: 10,
    bolimlar: [],
    manbalar: [],
    test: [],
    amaliySavolSoni: 15,
    },
  {
    slug: 'siydik-tahlili-asoslari',
    sarlavha: 'Umumiy siydik tahlili va asosiy laborator ko\'rsatkichlar',
    kategoriya: 'Kirish va semiotika',
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Umumiy siydik tahlilidagi asosiy ko'rsatkichlar va ularning klinik ahamiyati.",
    daqiqa: 10,
    amaliySavolSoni: 15,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'utt-asosiy-tekshiruv',
    sarlavha: "UTT (ultratovush) — urologiyada asosiy tekshiruv usuli",
    kategoriya: 'Kirish va semiotika',
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Urologiyada UTT nima uchun birinchi tanlovdagi tekshiruv usuli hisoblanadi.",
    daqiqa: 10,
    amaliySavolSoni: 15,
    bolimlar: [],
    manbalar: [],
    test: [],
  },

  // II. Anatomiya va fiziologiya (umumiy)
  {
    slug: 'buyrak-siydik-yollari-anatomiyasi',
    sarlavha: "Buyrak va siydik yo'llarining umumiy anatomiyasi",
    kategoriya: 'Anatomiya va fiziologiya',
    amaliySavolSoni: 15,
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Buyrak, siydik naychalari va ularning asosiy vazifalari haqida umumiy tushuncha.",
    daqiqa: 10,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'qovuq-uretra-tuzilishi',
    sarlavha: "Siydik pufagi va uretra — tuzilishi va vazifasi",
    kategoriya: 'Anatomiya va fiziologiya',
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Qovuq va uretraning asosiy vazifalari va erkak-ayol uretrasi orasidagi farq.",
    daqiqa: 10,
    amaliySavolSoni: 15,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'erkak-jinsiy-azolari-tuzilishi',
    sarlavha: "Erkak jinsiy a'zolari — umumiy tuzilishi (prostata, moyak, urug' pufakchasi)",
    kategoriya: 'Anatomiya va fiziologiya',
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Erkak reproduktiv a'zolarining asosiy tuzilishi va vazifalari.",
    daqiqa: 10,
    amaliySavolSoni: 15,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'siydik-tanosil-tugma-anomaliyalar',
    sarlavha: "Siydik-tanosil a'zolarining tug'ma anomaliyalari haqida umumiy tushuncha",
    kategoriya: 'Anatomiya va fiziologiya',
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Eng ko'p uchraydigan tug'ma siydik-tanosil anomaliyalari haqida umumiy ma'lumot.",
    daqiqa: 10,
    amaliySavolSoni: 15,
    bolimlar: [],
    manbalar: [],
    test: [],
  },

  // III. Yallig'lanish kasalliklari
  {
    slug: 'sistit-asoslari',
    sarlavha: "Sistit (siydik pufagi yallig'lanishi) — asosiy belgilar va davolash",
    kategoriya: "Yallig'lanish kasalliklari",
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    amaliySavolSoni: 15,
    qisqa: "Sistitning asosiy belgilari, sabablari va birinchi qatordagi davolash yondashuvi.",
    daqiqa: 10,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'pielonefrit-asoslari',
    sarlavha: 'Pielonefrit — asosiy belgilar va davolash',
    kategoriya: "Yallig'lanish kasalliklari",
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    amaliySavolSoni: 15,
    qisqa: "Pielonefritning sistitdan farqi, belgilari va davolash yondashuvi.",
    daqiqa: 10,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'uretrit-asoslari',
    sarlavha: "Uretrit (gonokokkli va nogonokokkli) — umumiy tushuncha",
    kategoriya: "Yallig'lanish kasalliklari",
    amaliySavolSoni: 15,
    bosqich: "o'rta",
    bepulNamuna: true,
    qisqa: "Uretritning ikki asosiy turi va ularning klinik farqlari.",
    daqiqa: 10,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'prostatit-umumiy-tasniflash',
    sarlavha: "Prostatit — umumiy tasniflash va belgilar",
    kategoriya: "Yallig'lanish kasalliklari",
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    amaliySavolSoni: 15,
    qisqa: "Prostatitning to'rt asosiy turi haqida umumiy, kirish darajasidagi tushuncha.",
    daqiqa: 10,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'orxoepididimit-asoslari',
    sarlavha: "Orxoepididimit (moyak-quyma yallig'lanishi) — asosiy belgilar",
    kategoriya: "Yallig'lanish kasalliklari",
    amaliySavolSoni: 15,
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Orxoepididimitning sabablari, belgilari va torsiyadan farqlash zarurati.",
    daqiqa: 10,
    bolimlar: [],
    manbalar: [],
    test: [],
  },

  // IV. Buyrak va siydik yo'llari kasalliklari
  {
    slug: 'siydik-tosh-kasalligi-asoslari',
    sarlavha: 'Siydik tosh kasalligi — asosiy tushunchalar va klinika',
    kategoriya: "Buyrak va siydik yo'llari",
    amaliySavolSoni: 15,
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Siydik toshlari nima uchun hosil bo'ladi va asosiy klinik ko'rinishi qanday.",
    daqiqa: 10,
    bolimlar: [],
    manbalar: [],
    test: [],
  },
  {
    slug: 'gidronefroz-asoslari',
    sarlavha: 'Gidronefroz — nima va nima uchun yuzaga keladi',
    kategoriya: "Buyrak va siydik yo'llari",
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Gidronefrozning sabablari va nima uchun u xavfli bo'lishi mumkinligi.",
    daqiqa: 17,
    nazariyaIframe: '/nazariyalar/gidronefroz-asoslari.html',
    bolimlar: [],
    manbalar: [],
    amaliySavolSoni: 15,
    test: [],
  },
  {
    slug: 'siydik-tutolmaslik-turlari',
    sarlavha: 'Siydik tutolmaslik — asosiy turlari',
    kategoriya: "Buyrak va siydik yo'llari",
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Siydik tutolmaslikning asosiy turlari va ularning sabablari.",
    daqiqa: 17,
    nazariyaIframe: '/nazariyalar/siydik-tutolmaslik-turlari.html',
    bolimlar: [],
    manbalar: [],
    amaliySavolSoni: 15,
    test: [],
  },

  // V. Prostata va erkak jinsiy a'zolari
  {
    slug: 'prostata-adenomasi-asosiy-belgilar',
    sarlavha: 'Prostata adenomasi (BPH) — asosiy belgilar',
    kategoriya: "Prostata va erkak jinsiy a'zolari",
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "BPHning yosh bilan bog'liqligi va asosiy siyish simptomlari haqida kirish darajasidagi tushuncha.",
    daqiqa: 17,
    nazariyaIframe: '/nazariyalar/prostata-adenomasi-asosiy-belgilar.html',
    bolimlar: [],
    manbalar: [],
    amaliySavolSoni: 15,
    test: [],
  },
  {
    slug: 'fimoz-parafimoz-asoslari',
    sarlavha: "Fimoz va parafimoz — nima va qanday yordam kerak",
    kategoriya: "Prostata va erkak jinsiy a'zolari",
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Fimoz va parafimoz orasidagi farq va parafimozning shoshilinch xususiyati.",
    daqiqa: 17,
    nazariyaIframe: '/nazariyalar/fimoz-parafimoz-asoslari.html',
    bolimlar: [],
    manbalar: [],
    amaliySavolSoni: 15,
    test: [],
  },
  {
    slug: 'varikotsele-gidrotsele-farqi',
    sarlavha: "Varikotsele va gidrotsele — asosiy farqlari",
    kategoriya: "Prostata va erkak jinsiy a'zolari",
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Varikotsele va gidrotsele orasidagi asosiy farqlarni tushunish uchun kirish darajasidagi dars.",
    daqiqa: 16,
    nazariyaIframe: '/nazariyalar/varikotsele-gidrotsele-farqi.html',
    bolimlar: [],
    manbalar: [],
    amaliySavolSoni: 15,
    test: [],
  },
  {
    slug: 'kriptorxizm-asoslari',
    sarlavha: 'Kriptorxizm — nima va nega muhim',
    kategoriya: "Prostata va erkak jinsiy a'zolari",
    bosqich: "o'rta",
    bepulNamuna: true, // EASY dan ko'chirildi — bepul kirish saqlanadi
    qisqa: "Kriptorxizmning ahamiyati va nima uchun erta davolash zarur.",
    daqiqa: 16,
    nazariyaIframe: '/nazariyalar/kriptorxizm-asoslari.html',
    bolimlar: [],
    manbalar: [],
    amaliySavolSoni: 15,
    test: [],
  },

  // VI. Shoshilinch holatlar (umumiy tushuncha)
  {
    slug: 'moyak-torsiyasi-asoslari',
    sarlavha: "O'tkir moyak burilishi (torsiya) va o'tkir yorg'oq sindromi — shoshilinch belgilar",
    kategoriya: 'Shoshilinch holatlar',
    bosqich: "o'rta",
    bepulNamuna: true,
    qisqa: "Moyak torsiyasini nima uchun soatlar ichida aniqlash va davolash hayotiy ahamiyatga ega.",
    daqiqa: 16,
    nazariyaIframe: '/nazariyalar/moyak-torsiyasi-asoslari.html',
    bolimlar: [],
    manbalar: [],
    amaliySavolSoni: 15,
    test: [],
  },

  // ============================================================
  // 🟡 MEDIUM (2-bosqich) — Kengaytirilgan urologiya
  // (skelet — mazmuni keyinroq to'ldiriladi)
  // ============================================================

  // I. Kirish va diagnostika
  m('urologik-anamnez-fizik-tekshiruv', "Urologik anamnez yig'ish va fizik tekshiruv tartibi", 'Kirish va diagnostika'),
  m('siydik-ushlanish-kolika-anuriya-farqlari', "Sindromlar: o'tkir/surunkali siydik ushlanishi, buyrak kolikasi, anuriya — farqlari", 'Kirish va diagnostika'),
  m('siydik-tahlili-posev-biomarkerlar', 'Siydik tahlili, posev va biokimyoviy markerlar (PSA, kreatinin, GFR)', 'Kirish va diagnostika'),
  m('tasvirlash-usullarini-tanlash', 'Tasvirlash usullarini tanlash: UTT, KT, MRT, radioizotop tekshiruvlar', 'Kirish va diagnostika'),
  m('gematuriyani-baholash-algoritmi', 'Gematuriyani baholash algoritmi (mikro- va makrogematuriya)', 'Kirish va diagnostika'),

  // II. Anatomiya va fiziologiya
  m('buyrak-fiziologiyasi-qon-aylanishi', 'Buyrak fiziologiyasi: qon aylanishi, filtratsiya, gormonal funksiya', 'Anatomiya va fiziologiya'),
  m('qovuq-uretra-urodinamikasi', "Siydik pufagi va uretra urodinamikasi (saqlash-bo'shatish sikli)", 'Anatomiya va fiziologiya'),
  m('prostata-urug-moyak-fiziologiyasi', "Prostata, urug' pufakchasi va moyak fiziologiyasi", 'Anatomiya va fiziologiya'),
  m('ayol-kichik-chanoq-anatomiyasi', "Ayol kichik chanog'i anatomiyasi (urologik nuqtai nazardan)", 'Anatomiya va fiziologiya'),
  m('siydik-tanosil-embriologiyasi', 'Siydik-tanosil tizimi embriologiyasi (asosiy bosqichlar)', 'Anatomiya va fiziologiya'),
  m('tugma-anomaliyalar-tasniflash', "Tug'ma rivojlanish anomaliyalari: tasniflash va klinik ahamiyat", 'Anatomiya va fiziologiya'),

  // III. Yallig'lanish va infeksion kasalliklar
  m('sistit-asoratlanmagan-asoratlangan', "Asoratlanmagan va asoratlangan sistit — farqlash va davolash", "Yallig'lanish va infeksion kasalliklar"),
  m('pielonefrit-asoratlanmagan-asoratlangan', "Asoratlanmagan va asoratlangan pielonefrit — farqlash va davolash", "Yallig'lanish va infeksion kasalliklar"),
  m('gonokokkli-uretrit-protokol', 'Gonokokkli uretrit — tashxis va davolash protokoli', "Yallig'lanish va infeksion kasalliklar"),
  m('nogonokokkli-noinfeksion-uretritlar', 'Nogonokokkli va noinfeksion uretritlar', "Yallig'lanish va infeksion kasalliklar"),
  m('surunkali-prostatit-nih-tasnifi', 'Surunkali prostatit va prostatit sindromlari (NIH tasnifi)', "Yallig'lanish va infeksion kasalliklar"),
  m('interstitsial-sistit-ogriq-sindromi', "Interstitsial sistit / siydik pufagi og'riq sindromi", "Yallig'lanish va infeksion kasalliklar"),
  m('urogenital-tuberkulez', 'Urogenital tuberkulez — asosiy klinik belgilar', "Yallig'lanish va infeksion kasalliklar"),

  // IV. Buyrak va siydik yo'llari kasalliklari
  m('siydik-tosh-etiologiya-metabolik', "Siydik tosh kasalligi — etiologiya, metabolik tekshiruv, konservativ davolash", "Buyrak va siydik yo'llari kasalliklari"),
  m('siydik-tosh-zamonaviy-davolash', 'Siydik tosh kasalligi — zamonaviy davolash usullari (ESWL, URS, PNL)', "Buyrak va siydik yo'llari kasalliklari"),
  m('gidronefrotik-transformatsiya', 'Gidronefrotik transformatsiya — bosqichlari va sabablari', "Buyrak va siydik yo'llari kasalliklari"),
  m('nefroptoz-klinikasi', 'Nefroptoz — klinikasi va davolash yondashuvlari', "Buyrak va siydik yo'llari kasalliklari"),
  m('sistoureteral-reflyuks-tasniflash', 'Sistoureteral reflyuks — tasniflash va davolash', "Buyrak va siydik yo'llari kasalliklari"),
  m('siydik-tutolmaslik-diagnostika-prinsiplari', 'Siydik tutolmaslik turlari — stress, urgent, aralash — diagnostika prinsiplari', "Buyrak va siydik yo'llari kasalliklari"),
  m('nefrogen-arterial-gipertenziya', 'Nefrogen arterial gipertenziya — asosiy mexanizm', "Buyrak va siydik yo'llari kasalliklari"),

  // V. Prostata va erkak jinsiy a'zolari
  m('bph-diagnostika-nostatsionar-davolash', 'Prostata adenomasi (BPH) — diagnostika va nostatsionar davolash', "Prostata va erkak jinsiy a'zolari", true),
  m('asoratlanmagan-prostatit-davolash', 'Asoratlanmagan prostatit — davolash prinsiplari', "Prostata va erkak jinsiy a'zolari"),
  m('fimoz-parafimoz-sirkumsizio', 'Fimoz, parafimoz — asoratlari va sirkumsizio texnikasi', "Prostata va erkak jinsiy a'zolari"),
  m('kriptorxizm-operativ-davolash', 'Kriptorxizm — operativ davolash muddatlari va usullari', "Prostata va erkak jinsiy a'zolari"),
  m('varikotsele-klinik-bosqichlari', "Varikotsele — klinik bosqichlari va davolash ko'rsatmalari", "Prostata va erkak jinsiy a'zolari", true),
  m('gidrotsele-spermatotsele-differensial', 'Gidrotsele, spermatotsele — differensial tashxis', "Prostata va erkak jinsiy a'zolari"),
  m('otkir-orxoepididimit-diagnostika', "O'tkir orxoepididimit — diagnostika va davolash", "Prostata va erkak jinsiy a'zolari"),

  // VI. Shoshilinch urologiya
  m('otkir-siydik-ushlanishi-birinchi-yordam', "O'tkir siydik ushlanishi — sabablari va birinchi yordam", 'Shoshilinch urologiya'),
  m('moyak-burilishi-shoshilinch-jarrohlik', "O'tkir moyak burilishi — diagnostika va shoshilinch jarrohlik zarurati", 'Shoshilinch urologiya'),
  m('siydik-tanosil-shikastlanishlari', 'Siydik-tanosil tizimi shikastlanishlari — umumiy tasniflash', 'Shoshilinch urologiya'),

  // VII. Reproduktiv va seksual salomatlik
  m('erkaklar-erektil-disfunksiyasi-m', 'Erkaklar erektil disfunksiyasi — sabablari va birinchi qator davolash', 'Reproduktiv va seksual salomatlik'),
  m('erkaklar-bepushtligi-tekshiruv', 'Erkaklar bepushtligi — asosiy tekshiruv yo\'nalishlari (spermogramma)', 'Reproduktiv va seksual salomatlik'),

  // ============================================================
  // 🔴 HARD (3-bosqich) — Campbell-Walsh asosida to'liq kurs
  // (skelet — mazmuni keyinroq qism-qism to'ldiriladi)
  // ============================================================

  // I BOB. Kirish va asoslar
  h('h-urologiyaga-kirish', 'Urologiyaga kirish — fanning predmeti va vazifalari', 'Kirish va asoslar'),
  h('h-semiotika-sindromlar-simptomlar', 'Urologik kasalliklarning semiotikasi, sindromlar va simptomlar', 'Kirish va asoslar'),
  h('h-laborator-tekshirish-usullari', 'Laborator tekshirish usullari', 'Kirish va asoslar'),
  h('h-instrumental-tekshiruv-usullari', 'Zamonaviy instrumental tekshiruv usullari (UTT, rentgen, KT, MRT, radioizotop, endoskopiya)', 'Kirish va asoslar'),
  h('h-gematuriyani-baholash', 'Gematuriyani baholash', 'Kirish va asoslar'),

  // II BOB. Anatomiya, fiziologiya va embriologiya
  h('h-buyrak-anatomiya-fiziologiya', 'Buyrak normal anatomiyasi va fiziologiyasi', 'Anatomiya, fiziologiya va embriologiya'),
  h('h-ureter-qovuq-uretra-anatomiya', "Siydik nayi (ureter), siydik pufagi va tashqi siydik chiqaruv nayi (uretra) anatomiyasi va fiziologiyasi", 'Anatomiya, fiziologiya va embriologiya'),
  h('h-erkak-jinsiy-azolari-tuzilishi', "Erkak tashqi va ichki jinsiy a'zolari tuzilishi (prostata, urug' pufakchasi, moyak, qovuq teri)", 'Anatomiya, fiziologiya va embriologiya'),
  h('h-ayol-kichik-chanoq-anatomiyasi', "Ayol tashqi va ichki jinsiy a'zolari tuzilishi (kichik chanoq anatomiyasi)", 'Anatomiya, fiziologiya va embriologiya'),
  h('h-siydik-tanosil-embriologiyasi', "Siydik-tanosil a'zolari embriologiyasi", 'Anatomiya, fiziologiya va embriologiya'),
  h('h-tugma-rivojlanish-anomaliyalari', "A'zolarning tug'ma rivojlanish anomaliyalari (renal, ureteral, genital)", 'Anatomiya, fiziologiya va embriologiya'),

  // III BOB. Yallig'lanish va infeksion kasalliklar
  h('h-pielonefrit-asoratlanmagan-asoratlangan', 'Asoratlanmagan va asoratlangan pielonefrit', "Yallig'lanish va infeksion kasalliklar"),
  h('h-sistit-asoratlanmagan-asoratlangan', 'Asoratlanmagan va asoratlangan sistit', "Yallig'lanish va infeksion kasalliklar"),
  h('h-gonokokkli-uretrit-gonoreya', 'Gonokokkli uretrit — gonoreya, tashxis va davolash', "Yallig'lanish va infeksion kasalliklar"),
  h('h-nogonokokkli-noinfeksion-uretritlar', 'Nogonokokkli va noinfeksion uretritlar', "Yallig'lanish va infeksion kasalliklar"),
  h('h-spesifik-nospesifik-yallirlanish-tuberkulez', "Siydik-tanosil a'zolarining boshqa spesifik (jinsiy yo'l bilan yuqadigan) va nospesifik yallig'lanish kasalliklari — jumladan urogenital tuberkulez va parazitar infeksiyalar", "Yallig'lanish va infeksion kasalliklar"),

  // IV BOB. Buyrak va siydik yo'llari kasalliklari
  h('h-gidronefrotik-transformatsiya', 'Gidronefrotik transformatsiya (yuqori siydik yo\'llari obstruksiyasi)', "Buyrak va siydik yo'llari kasalliklari"),
  h('h-nefroptoz', 'Nefroptoz', "Buyrak va siydik yo'llari kasalliklari"),
  h('h-sistoureteral-reflyuks-kasalligi', 'Sistoureteral reflyuks kasalligi', "Buyrak va siydik yo'llari kasalliklari"),
  h('h-siydik-tutolmaslik-prinsiplari', 'Siydik tutolmaslik turlari, diagnostikasi va davolash prinsiplari', "Buyrak va siydik yo'llari kasalliklari"),
  h('h-nefrogen-arterial-gipertenziya', 'Nefrogen arterial gipertenziya', "Buyrak va siydik yo'llari kasalliklari"),

  // V BOB. Prostata va erkak jinsiy a'zolari kasalliklari
  h('h-asoratlanmagan-prostatit', 'Asoratlanmagan prostatit', "Prostata va erkak jinsiy a'zolari kasalliklari"),
  h('h-fimoz-parafimoz-sirkumsizio', 'Fimoz, parafimoz — asoratlari, davolash usullari, sirkumsizio texnikasi', "Prostata va erkak jinsiy a'zolari kasalliklari"),
  h('h-kriptorxizm-operativ-davolash', 'Kriptorxizm va uning operativ davolash', "Prostata va erkak jinsiy a'zolari kasalliklari"),

  // Pilot dars — to'liq jihozlangan tarkib endi `dars_tarkibi` jadvalida (Supabase) saqlanadi,
  // shu sababli bu yerda faqat yengil metama'lumot qoladi.
  {
    slug: 'h-varikotsele-kasalligi',
    sarlavha: 'Varikotsele kasalligi',
    kategoriya: "Prostata va erkak jinsiy a'zolari kasalliklari",
    bosqich: 'qiyin',
    bepulNamuna: true,
    qisqa: "To'liq jihozlangan pilot dars: nazariya, video, konspekt, amaliy/USMLE/nazorat test bo'limlari bilan. Tarkib endi `dars_tarkibi` jadvalida saqlanadi.",
    daqiqa: 5,
    bolimlar: [],
    manbalar: [],
    test: [],
  },

  h('h-gidrotsele-spermatotsele', 'Gidrotsele, spermatotsele', "Prostata va erkak jinsiy a'zolari kasalliklari"),
  h('h-otkir-yorgoq-sindromi', "O'tkir yorg'oq sindromi — o'tkir orxoepididimit, diagnostika, davolash va asoratlari (o'tkir moyak burilishi bilan differensial tashxis)", "Prostata va erkak jinsiy a'zolari kasalliklari"),

  // VI BOB. Onkourologiya
  h('h-qovuq-osmalari', "Siydik pufagi o'smalari (yallig'lanmagan va invaziv shakllari)", 'Onkourologiya'),
  h('h-yuqori-siydik-yollari-uroteliy-osmalari', "Yuqori siydik yo'llari uroteliy o'smalari", 'Onkourologiya'),
  h('h-buyrak-hujayrali-rak', "Buyrak hujayrali rak (benign va malign o'smalar)", 'Onkourologiya'),
  h('h-adrenal-kasalliklar-osmalari', 'Buyrak usti bezi (adrenal) kasalliklari va o\'smalari', 'Onkourologiya'),
  h('h-moyak-osmalari', "Moyak o'smalari", 'Onkourologiya'),
  h('h-penis-uretra-osmalari', "Penis va uretra o'smalari", 'Onkourologiya'),

  // VII BOB. Shoshilinch urologiya (o'tkir holatlar)
  h('h-otkir-siydik-ushlanishi', "O'tkir siydik ushlanishi", "Shoshilinch urologiya (o'tkir holatlar)"),
  h('h-otkir-moyak-burilishi-differensial', "O'tkir moyak burilishi (torsiya) — o'tkir yorg'oq sindromidan differensiatsiya", "Shoshilinch urologiya (o'tkir holatlar)"),
  h('h-siydik-tanosil-shikastlanishlari-travma', "Siydik-tanosil tizimi shikastlanishlari (buyrak, siydik pufagi, uretra, jinsiy a'zolar travmasi)", "Shoshilinch urologiya (o'tkir holatlar)"),
  h('h-otkir-pielonefrit-urosepsis', "O'tkir pielonefrit/urosepsis", "Shoshilinch urologiya (o'tkir holatlar)"),
  h('h-parafimoz-priapizm-shoshilinch', 'Parafimoz, priapizm — shoshilinch holatlar', "Shoshilinch urologiya (o'tkir holatlar)"),

  // VIII BOB. Reproduktiv va seksual salomatlik
  h('h-priapizm', 'Priapizm', 'Reproduktiv va seksual salomatlik'),
  h('h-erkaklar-bepushtligi-art', 'Erkaklar bepushtligi va yordamchi reproduktiv texnologiyalar', 'Reproduktiv va seksual salomatlik'),
  h('h-peyroni-kasalligi', 'Peyroni kasalligi', 'Reproduktiv va seksual salomatlik'),
  h('h-orgazm-ejakulatsiya-buzilishlari', 'Erkaklar orgazm va ejakulatsiya buzilishlari', 'Reproduktiv va seksual salomatlik'),
  h('h-androgen-yetishmovchiligi', 'Androgen yetishmovchiligi va erkaklar salomatligi (testosteron, metabolik sindrom)', 'Reproduktiv va seksual salomatlik'),
]

// Skelet darslar uchun yordamchilar — mazmuni keyinroq qism-qism to'ldiriladi.
function skelet(slug: string, sarlavha: string, kategoriya: string, bosqich: Bosqich, bepulNamuna = false): Dars {
  return {
    slug,
    sarlavha,
    kategoriya,
    bosqich,
    qisqa: "Mazmuni tez orada to'ldiriladi.",
    daqiqa: 5,
    bolimlar: [{ sarlavha: 'Tez orada', matn: ["Bu dars mazmuni hozircha tayyorlanmoqda."] }],
    manbalar: [],
    test: [],
    bepulNamuna,
  }
}

function m(slug: string, sarlavha: string, kategoriya: string, bepulNamuna = false): Dars {
  return skelet(slug, sarlavha, kategoriya, "o'rta", bepulNamuna)
}

function h(slug: string, sarlavha: string, kategoriya: string, bepulNamuna = false): Dars {
  return skelet(slug, sarlavha, kategoriya, 'qiyin', bepulNamuna)
}

export function darsTop(slug: string) {
  return DARSLAR.find((d) => d.slug === slug)
}

// Berilgan savol bankidan tasodifiy `soni` tadanini (aralashtirib) tanlab beradi.
export function shuffleVaTanla<T>(bank: T[], soni: number): T[] {
  const nusxa = [...bank]
  for (let i = nusxa.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nusxa[i], nusxa[j]] = [nusxa[j], nusxa[i]]
  }
  return nusxa.slice(0, soni)
}

// Savol javob variantlarini (va to'g'ri javob indeksini mos holda) aralashtiradi —
// bazada qanday tartibda saqlangani har bir talaba/urinish uchun ahamiyatsiz bo'lib qoladi,
// shu bilan javob pozitsiyasi bo'yicha taxmin qilish imkoniyati yo'qoladi.
export function variantlarniAralashtir<T extends TestSavoli>(savol: T): T {
  const juftlar = savol.variantlar.map((matn, i) => ({ matn, togriMi: i === savol.togri }))
  for (let i = juftlar.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[juftlar[i], juftlar[j]] = [juftlar[j], juftlar[i]]
  }
  return { ...savol, variantlar: juftlar.map((j) => j.matn), togri: juftlar.findIndex((j) => j.togriMi) }
}
