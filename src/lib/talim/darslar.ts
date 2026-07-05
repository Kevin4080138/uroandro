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

export const DARSLAR: Dars[] = [
  {
    slug: 'bph-luts',
    sarlavha: "Benign prostata giperplaziyasi (BPH) va pastki siydik yo'llari simptomlari",
    kategoriya: "Prostata va erkak jinsiy a'zolari kasalliklari",
    bosqich: 'qiyin',
    bepulNamuna: true,
    qisqa: "BPH nima, qanday simptomlar beradi, qanday tashxislanadi va bosqichma-bosqich qanday davolanadi.",
    daqiqa: 9,
    bolimlar: [
      {
        sarlavha: '1. BPH nima?',
        matn: [
          "Benign prostata giperplaziyasi (BPH — Benign Prostatic Hyperplasia) — prostata bezining stromal va epitelial hujayralarining saratonsiz (benign) ko'payishi natijasida hajmi kattalashishi. Bu yosh ulg'aygan erkaklarda fiziologik jarayon hisoblanadi: 60 yoshdan keyin erkaklarning taxminan 50%ida, 80 yoshdan keyin esa 80%dan ortig'ida gistologik BPH belgilari topiladi.",
          "BPH o'zi xavfli emas va saraton bilan bog'liq emas, biroq kattalashgan prostata siydik chiqarish kanalini (uretrani) toraytirib, pastki siydik yo'llari simptomlarini (LUTS — Lower Urinary Tract Symptoms) keltirib chiqaradi.",
        ],
      },
      {
        sarlavha: '2. Simptomlar — saqlanish va bo\'shatish guruhlari',
        matn: [
          "LUTS ikki katta guruhga bo'linadi. Saqlanish (storage) simptomlari: tez-tez siyish, nokturiya (tungi siyish), to'satdan kuchli siyish ehtiyoji (urgency). Bo'shatish (voiding) simptomlari: siyishni boshlashda kuchanish, oqim kuchsizligi, uzilib-uzilib siyish, to'liq bo'shamaslik hissi va siyishdan keyin tomchilash.",
          "Bu simptomlar standartlashtirilgan tarzda IPSS (International Prostate Symptom Score) anketasi orqali baholanadi — 7 savol, 0–35 ball: 0–7 yengil, 8–19 o'rtacha, 20–35 og'ir simptomlar.",
        ],
      },
      {
        sarlavha: '3. Tashxis',
        matn: [
          "Asosiy tekshiruvlar: anamnez va IPSS anketasi, jismoniy ko'rik (shu jumladan rektal palpatsiya — DRE), umumiy siydik tahlili (infeksiya/gematuriyani istisno qilish uchun), PSA (prostata saratonini istisno qilish va davolash strategiyasini tanlash uchun), prostata USI (hajmni o'lchash) va uroflowmetriya (Qmax — maksimal oqim tezligini baholash).",
          "Prostata hajmi ellipsoid formula (V = 0.52 × uzunlik × kenglik × balandlik) bo'yicha hisoblanadi va davolash usulini tanlashda muhim omil hisoblanadi: 30 sm³dan kichik prostatalarda dorivor davo ko'pincha yetarli, 80–100 sm³dan katta prostatalarda esa jarrohlik (ayniqsa ochiq yoki lazer enukleatsiyasi) ko'rib chiqiladi.",
        ],
      },
      {
        sarlavha: '4. Davolash bosqichlari',
        matn: [
          "1-bosqich — kuzatuv (watchful waiting): yengil simptomli (IPSS ≤7), hayot sifatiga sezilarli ta'sir qilmaydigan holatlarda faqat hayot tarzini o'zgartirish (suyuqlik rejimini tartibga solish, kechqurun kam suyuqlik ichish, kofein/alkoldan saqlanish) tavsiya etiladi.",
          "2-bosqich — dorivor davo: alfa-1-blokatorlar (tamsulozin, alfuzozin) prostata va qovuq bo'yni silliq mushaklarini bo'shashtirib tezkor simptomatik yengillik beradi. 5-alfa-reduktaza inhibitorlari (finasterid, dutasterid) prostata hajmini asta-sekin kichraytiradi, ayniqsa katta prostatali (>40 sm³) bemorlarda samarali, ta'siri 3–6 oyda namoyon bo'ladi. Ikkalasining kombinatsiyasi katta prostatali va og'ir simptomli bemorlarda tavsiya etiladi.",
          "3-bosqich — jarrohlik davo: dorivor davo samara bermaganda yoki asoratlar (qaytalanuvchi siydik to'lib qolishi, qon ketish, toshlar, buyrak funksiyasi pasayishi) rivojlanganda ko'rib chiqiladi. TURP (transuretral rezeksiya) — oltin standart, kichik-o'rta prostatalar uchun. Katta prostatalar uchun lazer enukleatsiyasi (HoLEP) yoki ochiq prostatektomiya.",
        ],
      },
    ],
    manbalar: [
      'EAU Guidelines on Non-neurogenic Male LUTS (2024)',
      'AUA Guideline: Surgical Management of BPH (2020, 2023 yangilanish)',
      'Oesterling JE va boshq. — yoshga moslashgan PSA me\'zonlari',
    ],
    test: [
      {
        savol: 'BPH nima uchun "benign" deb ataladi?',
        variantlar: ['Chunki u hech qachon simptom bermaydi', 'Chunki u saraton emas, to\'qima saratonsiz ko\'payadi', 'Chunki u faqat yosh erkaklarda uchraydi', 'Chunki u doim operatsiyasiz o\'tib ketadi'],
        togri: 1,
        izoh: 'BPH prostata to\'qimasining saratonsiz (benign) giperplaziyasi — bu uning saraton bilan bog\'liq emasligini, lekin baribir simptom berishi mumkinligini bildiradi.',
      },
      {
        savol: 'IPSS bo\'yicha 8–19 ball qaysi darajaga to\'g\'ri keladi?',
        variantlar: ['Yengil simptomlar', "O'rtacha simptomlar", "Og'ir simptomlar", 'Simptom yo\'q'],
        togri: 1,
        izoh: 'IPSS shkalasi: 0–7 yengil, 8–19 o\'rtacha, 20–35 og\'ir simptomlarni bildiradi.',
      },
      {
        savol: "Quyidagilardan qaysi biri 'saqlanish' (storage) simptomiga misol?",
        variantlar: ["Siyish oqimi kuchsizligi", 'Nokturiya (tungi siyish)', "Siyishni boshlashda kuchanish", "To'liq bo'shamaslik hissi"],
        togri: 1,
        izoh: "Nokturiya saqlanish guruhiga kiradi; oqim kuchsizligi, kuchanish va to'liq bo'shamaslik — bo'shatish (voiding) simptomlari.",
      },
      {
        savol: '5-alfa-reduktaza inhibitorlari (finasterid) qaysi mexanizm orqali ta\'sir qiladi?',
        variantlar: ['Qovuq mushaklarini darhol bo\'shashtiradi', "Prostata hajmini vaqt o'tishi bilan kichraytiradi", "Siydikni darhol chiqarib tashlaydi", 'Faqat infeksiyani yo\'qotadi'],
        togri: 1,
        izoh: "5-alfa-reduktaza inhibitorlari testosteronning dihidrotestosteronga aylanishini bloklab, prostata hajmini 3–6 oy davomida asta-sekin kichraytiradi — alfa-blokatorlardan farqli, tezkor emas.",
      },
      {
        savol: "Qaysi prostata hajmi ko'rsatkichi katta prostatali bemorlarda lazer enukleatsiyasini ko'rib chiqishga asos bo'ladi?",
        variantlar: ['10 sm³ dan kichik', '20-30 sm³', "80-100 sm³ dan katta", 'Hajm ahamiyatsiz'],
        togri: 2,
        izoh: "80-100 sm³ dan katta prostatalarda HoLEP (Holmium Laser Enucleation of the Prostate) yoki ochiq prostatektomiya ko'rib chiqiladi, chunki TURP bunday hollarda texnik jihatdan murakkablashadi.",
      },
    ],
  },
  {
    slug: 'prostatit-cpps',
    sarlavha: "Surunkali prostatit va kichik chanoq og'rig'i sindromi (CP/CPPS)",
    kategoriya: "Prostata va erkak jinsiy a'zolari kasalliklari",
    bosqich: 'qiyin',
    qisqa: "Prostatit turlari, NIH klassifikatsiyasi, tashxis va davolash yondashuvi.",
    daqiqa: 7,
    bolimlar: [
      {
        sarlavha: "1. NIH klassifikatsiyasi",
        matn: [
          "AQSh Milliy sog'liqni saqlash instituti (NIH) prostatitni 4 turga bo'ladi: I tur — o'tkir bakterial prostatit (yuqori harorat, og'ir intoksikatsiya bilan kechadigan o'tkir infeksiya); II tur — surunkali bakterial prostatit (qaytalanuvchi siydik yo'li infeksiyasi, prostata sekretida bakteriya aniqlanadi); III tur — surunkali prostatit/kichik chanoq og'rig'i sindromi (CP/CPPS) — eng ko'p uchraydigan tur, bakteriya aniqlanmaydi; IV tur — asimptomatik yallig'lanuvchi prostatit (simptomsiz, faqat tasodifan aniqlanadi).",
          "III tur o'z ichida yana ikkiga bo'linadi: IIIA — yallig'lanuvchi (prostata sekretida/spermada leykotsitlar ko'p), IIIB — noyallig'lanuvchi (leykotsitlar yo'q).",
        ],
      },
      {
        sarlavha: '2. Klinik ko\'rinish',
        matn: [
          "Asosiy shikoyat — kichik chanoq sohasidagi (oraliq, moyaklar, jinsiy a'zo, pastki qorin) surunkali og'riq, kamida 3 oy davomida. Bunga siyish simptomlari (tez-tez siyish, to'liq bo'shamaslik) va jinsiy funksiya buzilishlari (ejakulyatsiyadan keyingi og'riq, erektil disfunksiya) qo'shilishi mumkin.",
          "Bu holat bemorning hayot sifatiga sezilarli salbiy ta'sir ko'rsatadi va ko'pincha uzoq muddatli, qaytalanuvchi kechishga ega.",
        ],
      },
      {
        sarlavha: '3. Tashxis',
        matn: [
          "NIH-CPSI (Chronic Prostatitis Symptom Index) anketasi — 3 domen (og'riq, siyish, hayot sifati) bo'yicha 0–43 ball orasida standartlashtirilgan baholash vositasi.",
          "Bakterial va abakterial turlarni farqlash uchun Meares-Stamey 4-stakan testi yoki soddalashtirilgan oldin-keyin (pre/post-massage) siydik testi qo'llaniladi: prostata massajidan keyin siydikda leykotsit/bakteriya sonining oshishi yallig'lanish yoki infeksiyani ko'rsatadi.",
        ],
      },
      {
        sarlavha: '4. Davolash',
        matn: [
          "II tur (bakterial): uzoq muddatli (4–6 hafta) antibiotikoterapiya — odatda ftorxinolonlar yoki trimetoprim-sulfametoksazol, chunki bu dorilar prostata to'qimasiga yaxshi o'tadi.",
          "III tur (CP/CPPS): multimodal yondashuv tavsiya etiladi — alfa-blokatorlar (siyish simptomlarini yengillashtirish uchun), og'riqsizlantiruvchilar, tazo tubi mushaklarini bo'shashtirish mashqlari (pelvik floor terapiya), ba'zan past dozali antibiotik sinovi (4 haftagacha, agar yallig'lanish belgilari bo'lsa). Yagona \"sehrli\" davo yo'q — individuallashtirilgan, fenotipga asoslangan yondashuv (UPOINT tasnifi) zamonaviy standart hisoblanadi.",
        ],
      },
    ],
    manbalar: [
      'EAU Guidelines on Chronic Pelvic Pain (2024)',
      'NIH Chronic Prostatitis Classification (Krieger va boshq., 1999)',
      'Litwin MS va boshq. — NIH-CPSI validatsiyasi (1999)',
    ],
    test: [
      {
        savol: 'NIH klassifikatsiyasi bo\'yicha eng ko\'p uchraydigan prostatit turi qaysi?',
        variantlar: ["I tur — o'tkir bakterial", 'II tur — surunkali bakterial', 'III tur — CP/CPPS', 'IV tur — asimptomatik'],
        togri: 2,
        izoh: "III tur (CP/CPPS) prostatit hollarining 90% dan ortig'ini tashkil qiladi va bakteriya aniqlanmaydi.",
      },
      {
        savol: 'IIIA va IIIB turlarini bir-biridan nima farqlaydi?',
        variantlar: ["IIIA da bakteriya bor, IIIB da yo'q", "IIIA da prostata sekretida leykotsitlar ko'p, IIIB da yo'q", 'IIIA faqat yosh erkaklarda', "IIIA o'tkir, IIIB surunkali"],
        togri: 1,
        izoh: 'IIIA — yallig\'lanuvchi (leykotsitlar ko\'p), IIIB — noyallig\'lanuvchi (leykotsitlar yo\'q); ikkalasida ham bakteriya aniqlanmaydi.',
      },
      {
        savol: 'NIH-CPSI anketasi necha balldan iborat shkala bo\'yicha baholanadi?',
        variantlar: ['0-10', '0-25', '0-43', '0-100'],
        togri: 2,
        izoh: "NIH-CPSI 3 domen (og'riq 0-21, siyish 0-10, hayot sifati 0-12) bo'yicha jami 0-43 ball oralig'ida natija beradi.",
      },
      {
        savol: 'II tur (surunkali bakterial prostatit) uchun standart davolash davomiyligi qancha?',
        variantlar: ['3-5 kun', '7-10 kun', '4-6 hafta', '6 oy'],
        togri: 2,
        izoh: "Surunkali bakterial prostatit prostata to'qimasiga dori yaxshi o'tishi uchun uzoq (4-6 hafta) antibiotikoterapiya talab qiladi.",
      },
      {
        savol: 'CP/CPPS (III tur) davolashda zamonaviy standart yondashuv qaysi?',
        variantlar: ['Faqat bitta uzoq antibiotik kursi', 'Faqat jarrohlik', 'Multimodal, fenotipga asoslangan (UPOINT) yondashuv', 'Hech qanday davolash kerak emas'],
        togri: 2,
        izoh: "CP/CPPS heterogen sindrom bo'lgani uchun yagona davo yo'q — UPOINT fenotiplashtirish asosida individuallashtirilgan multimodal davolash tavsiya etiladi.",
      },
    ],
  },
  {
    slug: 'erektil-disfunksiya',
    sarlavha: 'Erektil disfunksiya: sabablari, baholash va davolash',
    kategoriya: 'Reproduktiv va seksual salomatlik',
    bosqich: 'qiyin',
    qisqa: "Erektsiya fiziologiyasi, ED sabablari klassifikatsiyasi va bosqichma-bosqich davolash algoritmi.",
    daqiqa: 7,
    bolimlar: [
      {
        sarlavha: "1. Ta'rif va fiziologiya",
        matn: [
          "Erektil disfunksiya (ED) — jinsiy aloqa uchun yetarli erektsiyani doimiy ravishda erisha olmaslik yoki saqlab qola olmaslik holati, kamida 3 oy davomida saqlanishi kerak (o'tkir/vaqtinchalik holatlar istisno).",
          "Erektsiya neyrovaskulyar jarayon: jinsiy qo'zg'alish → kavernoz sinuslarda azot oksidi (NO) ajralishi → siklik GMF (cGMF) darajasi oshishi → kavernoz tana silliq mushaklarining bo'shashishi → qon to'lishi va erektsiya. Fosfodiesteraza-5 (PDE5) fermenti cGMF'ni parchalab erektsiyani tugatadi — shu sababli PDE5 inhibitorlari (sildenafil va boshq.) bu fermentni bloklab erektsiyani uzaytiradi.",
        ],
      },
      {
        sarlavha: '2. Sabablari',
        matn: [
          "Organik sabablar: vaskulyar (ateroskleroz, qandli diabet — eng ko'p uchraydigan sabab guruhi), neyrogen (orqa miya shikastlanishi, Parkinson, multipl skleroz, prostatektomiyadan keyingi nerv shikastlanishi), gormonal (gipogonadizm/testosteron tanqisligi), dorilar (antidepressantlar, antigipertenzivlar).",
          "Psixogen sabablar: stress, tashvishlanish, depressiya, munosabatlardagi muammolar. Amaliyotda ko'pincha aralash (organik + psixogen) tabiat kuzatiladi.",
          "ED ko'pincha kardiovaskulyar kasalliklarning erta belgisi hisoblanadi — penis arteriyalari koronar arteriyalardan kichikroq bo'lgani uchun ateroskleroz birinchi bo'lib shu yerda namoyon bo'lishi mumkin ('penis koronar muammosining erta signali' kontsepsiyasi).",
        ],
      },
      {
        sarlavha: '3. Baholash',
        matn: [
          "IIEF-5 (SHIM) anketasi — 5 savollik standart skrining vositasi, 1-25 ball: 1-7 og'ir, 8-11 o'rtacha-og'ir, 12-16 o'rtacha, 17-21 yengil, 22-25 ED yo'q.",
          "Asosiy laboratoriya tekshiruvlari: ertalabki umumiy testosteron, glyukoza/HbA1c (diabet skrining), lipid profil (kardiovaskulyar xavf). ADAM anketasi testosteron tanqisligi ehtimolini skrining qilishda qo'shimcha vosita bo'lib xizmat qiladi.",
        ],
      },
      {
        sarlavha: '4. Davolash bosqichlari',
        matn: [
          "1-bosqich — hayot tarzi o'zgartirish: jismoniy faollik, vazn nazorati, chekishni tashlash, qandli diabet/gipertoniyani nazorat qilish — bularning barchasi erektil funksiyani yaxshilaydi.",
          "2-bosqich — PDE5 inhibitorlari (sildenafil, tadalafil, vardenafil) — birinchi qatordagi dorivor davo, samaradorligi 60-80%.",
          "3-bosqich — vakuum-erektsion qurilmalar, intrakavernoz inyeksiyalar (alprostadil) — PDE5 inhibitorlari samara bermaganda.",
          "4-bosqich — penil protezlash (implantatsiya) — boshqa usullar samarasiz bo'lganda, eng yuqori bemor qoniqishi ko'rsatkichiga ega yakuniy yechim.",
        ],
      },
    ],
    manbalar: [
      'EAU Guidelines on Sexual and Reproductive Health — Erectile Dysfunction (2024)',
      'ISSM Clinical Guidelines for ED',
      'Rosen RC va boshq. — IIEF va IIEF-5 validatsiyasi (1997, 1999)',
    ],
    test: [
      {
        savol: 'Erektsiya jarayonida PDE5 fermenti qanday rol o\'ynaydi?',
        variantlar: ['cGMF hosil qiladi', 'cGMF ni parchalaydi va erektsiyani tugatadi', "Testosteron ishlab chiqaradi", "Qon bosimini oshiradi"],
        togri: 1,
        izoh: 'PDE5 cGMF ni parchalab kavernoz tana mushaklarining qayta qisqarishiga olib keladi; PDE5 inhibitorlari shu fermentni bloklab erektsiyani uzaytiradi.',
      },
      {
        savol: "ED nima uchun ko'pincha kardiovaskulyar kasalliklarning erta belgisi hisoblanadi?",
        variantlar: ["Chunki yurak va penis bog'liq emas", "Penis arteriyalari kichikroq bo'lgani uchun ateroskleroz birinchi shu yerda namoyon bo'ladi", "ED faqat yosh erkaklarda uchraydi", "Bu tasodifiy bog'liqlik"],
        togri: 1,
        izoh: "Penis arteriyalarining kichik diametri tufayli aterosklerotik o'zgarishlar koronar arteriyalardan oldinroq klinik namoyon bo'lishi mumkin.",
      },
      {
        savol: 'IIEF-5 bo\'yicha 22-25 ball nimani bildiradi?',
        variantlar: ["Og'ir ED", "O'rtacha ED", 'ED belgilari yo\'q', 'Aniqlash mumkin emas'],
        togri: 2,
        izoh: 'IIEF-5 shkalasida 22-25 ball ED belgilari yo\'qligini bildiradi.',
      },
      {
        savol: 'ED davolashda birinchi qatordagi dorivor davo qaysi guruh?',
        variantlar: ['Antibiotiklar', 'PDE5 inhibitorlari', 'Antidepressantlar', 'Diuretiklar'],
        togri: 1,
        izoh: "PDE5 inhibitorlari (sildenafil, tadalafil, vardenafil) hayot tarzi o'zgarishidan keyingi birinchi qatordagi dorivor davo hisoblanadi.",
      },
      {
        savol: 'Boshqa usullar samarasiz bo\'lganda eng yuqori bemor qoniqishini beradigan yakuniy davolash usuli qaysi?',
        variantlar: ['Vakuum qurilma', 'Intrakavernoz inyeksiya', 'Penil protezlash', "Faqat psixoterapiya"],
        togri: 2,
        izoh: "Penil protezlash (implantatsiya) boshqa konservativ usullar samarasiz bo'lganda eng yuqori uzoq muddatli bemor qoniqishi ko'rsatkichiga ega.",
      },
    ],
  },
  {
    slug: 'urolitiaz',
    sarlavha: "Siydik yo'li toshlari (urolitiaz): patogenez, tashxis va davolash",
    kategoriya: "Buyrak va siydik yo'llari kasalliklari",
    bosqich: 'qiyin',
    qisqa: "Tosh turlari, klinik ko'rinish, STONE skori va zamonaviy davolash usullari (ESWL, URS, PCNL).",
    daqiqa: 8,
    bolimlar: [
      {
        sarlavha: '1. Tosh turlari va patogenez',
        matn: [
          "Eng ko'p uchraydigan tosh turi — kalsiy oksalat (taxminan 70-80% hollar), so'ngra kalsiy fosfat, siydik kislotasi (uric acid) toshlari (odatda giperurikemiya holatlarida, podagrada uchraydi), struvit (infeksion toshlar, urea-parchalovchi bakteriyalar — Proteus — bilan bog'liq) va sistin toshlari (genetik, sistinuriya kasalligida).",
          "Toshlanishga moyillik omillari: yetarli suyuqlik iste'mol qilmaslik, ovqatlanish xususiyatlari (yuqori tuz/oqsil, past sitrat), metabolik buzilishlar (giperkalsiuriya, giperoksaluriya, gipositraturiya), anatomik anomaliyalar (siydik oqimi turg'unligi) va oilaviy moyillik.",
        ],
      },
      {
        sarlavha: '2. Klinik ko\'rinish va tashxis',
        matn: [
          "Klassik klinik ko'rinish — renal kolika: to'satdan boshlangan, juda kuchli, to'lqinsimon bel/yon qorin og'rig'i, ko'ngil aynishi/qusish bilan birga, bemor tinch joy topa olmaydi (bu boshqa qorin og'riqlaridan farqlovchi xususiyat). Og'riq toshning siljishiga qarab pastga, chov sohasiga tarqalishi mumkin.",
          "STONE skori (Sex, Time, Origin, Nausea, Erythrocytes) — 5 oddiy klinik parametr asosida toshlik ehtimolini bashorat qiladi va KT zarurligini kamaytirishga yordam beradi. Tasdiqlash uchun oltin standart — kontrastsiz spiral KT (sezuvchanlik >95%), birinchi qatorda esa USI ko'pincha radiatsiyasiz dastlabki baholash uchun qo'llaniladi.",
        ],
      },
      {
        sarlavha: "3. O'tkir davolash",
        matn: [
          "Kichik toshlar (≤5-6 mm) ko'pincha o'z-o'zidan chiqib ketadi (spontan chiqish ehtimoli yuqori) — analgeziya (NSAID birinchi tanlov) va alfa-blokatorlar (MET — Medical Expulsive Therapy, siydik yo'li silliq mushaklarini bo'shashtirib tosh chiqishini osonlashtiradi) bilan kuzatuv tavsiya etiladi.",
          "Katta toshlar, og'riqni nazorat qilib bo'lmasligi, infeksiya bilan birga keluvchi obstruksiya (septik holat xavfi) yoki yagona buyrakda obstruksiya — bularning barchasi shoshilinch dekompressiya (stent qo'yish yoki nefrostomiya) uchun ko'rsatma hisoblanadi.",
        ],
      },
      {
        sarlavha: "4. Rejalashtirilgan davolash usullari",
        matn: [
          "ESWL (Extracorporeal Shock Wave Lithotripsy — tashqi zarba to'lqin litotripsiyasi): noinvaziv, kichik-o'rta (<2 sm) toshlar uchun, ayniqsa buyrak kosachasida joylashganda samarali.",
          "URS (Ureteroscopy — ureteroskopiya): endoskopik usul, siydik yo'lidagi toshlarda, lazer (Holmium:YAG) bilan toshni maydalash imkonini beradi, yuqori muvaffaqiyat darajasiga ega.",
          "PCNL (Percutaneous Nephrolithotomy — perkutan nefrolitotomiya): katta (>2 sm) yoki murakkab (koral shaklidagi) buyrak toshlari uchun standart usul, teri orqali to'g'ridan-to'g'ri buyrak kollektor tizimiga kirish orqali bajariladi.",
          "Metabolik baholash (24 soatlik siydik tahlili) qaytalanuvchi toshlanishning oldini olish uchun muhim — suyuqlik rejimi (kuniga ≥2.5 L siydik hajmi), tuz/oqsil cheklash va tosh turiga qarab maxsus dietetik tavsiyalar beriladi.",
        ],
      },
    ],
    manbalar: [
      'EAU Guidelines on Urolithiasis (2024)',
      'Moore CL va boshq. — STONE score validatsiyasi, BMJ (2014)',
      'AUA/Endourological Society Surgical Management of Stones Guideline',
    ],
    test: [
      {
        savol: "Siydik yo'li toshlarining eng ko'p uchraydigan turi qaysi?",
        variantlar: ['Struvit', 'Sistin', 'Kalsiy oksalat', 'Uric acid'],
        togri: 2,
        izoh: 'Kalsiy oksalat toshlari barcha urolitiaz hollarining 70-80% ni tashkil qiladi.',
      },
      {
        savol: 'Struvit toshlari odatda qaysi holat bilan bog\'liq?',
        variantlar: ["Yuqori oqsil iste'moli", 'Urea-parchalovchi bakteriyalar (masalan, Proteus) bilan infeksiya', "Genetik kasallik", 'Past suyuqlik iste\'moli'],
        togri: 1,
        izoh: 'Struvit (infeksion) toshlar urea-parchalovchi bakteriyalar (eng ko\'p Proteus) ajratadigan urease fermenti tufayli hosil bo\'ladi.',
      },
      {
        savol: 'Renal kolikani boshqa qorin og\'riqlaridan ajratuvchi klassik xususiyati nima?',
        variantlar: ["Bemor harakatsiz yotadi", "Bemor tinch joy topa olmaydi, to'lqinsimon og'riq", 'Og\'riq doim past haroratli', "Og'riq faqat tunda paydo bo'ladi"],
        togri: 1,
        izoh: 'Renal kolikada bemor doimiy harakatda bo\'lib qulay holat topa olmaydi — bu peritonit kabi holatlardan farqli xususiyat (ularda bemor harakatsiz yotadi).',
      },
      {
        savol: "Siydik yo'li toshini tasdiqlashda oltin standart tekshiruv qaysi?",
        variantlar: ['Umumiy qon tahlili', 'Kontrastsiz spiral KT', "Rentgen", "Faqat USI"],
        togri: 1,
        izoh: "Kontrastsiz spiral KT sezuvchanligi 95% dan yuqori bo'lib, urolitiaz tasdiqlashda oltin standart hisoblanadi.",
      },
      {
        savol: 'Katta (>2 sm) yoki koral shaklidagi buyrak toshlari uchun standart davolash usuli qaysi?',
        variantlar: ['ESWL', 'URS', 'PCNL', 'Faqat kuzatuv'],
        togri: 2,
        izoh: "PCNL (perkutan nefrolitotomiya) katta va murakkab buyrak toshlarini davolashning standart usuli hisoblanadi.",
      },
    ],
  },
  {
    slug: 'prostata-saraton-asoslari',
    sarlavha: 'Prostata saratoni: erta aniqlash va asosiy davolash strategiyasi',
    kategoriya: 'Onkourologiya',
    bosqich: 'qiyin',
    qisqa: "PSA skrining, biopsiya ko'rsatmalari, Gleason tasnifi va xavf guruhlariga asoslangan davolash.",
    daqiqa: 8,
    bolimlar: [
      {
        sarlavha: '1. Epidemiologiya va xavf omillari',
        matn: [
          "Prostata saratoni erkaklarda eng ko'p tashxislanadigan saraton turlaridan biri, asosan 50 yoshdan keyin uchraydi va yosh bilan xavf sezilarli oshadi. Asosiy xavf omillari: yosh, oilaviy anamnez (1-darajali qarindoshda prostata saratoni xavfni 2 baravar oshiradi), irqiy/etnik moyillik va genetik omillar (BRCA2 mutatsiyasi xavfni oshiradi).",
        ],
      },
      {
        sarlavha: '2. PSA skrining va uning cheklovlari',
        matn: [
          "PSA (Prostate-Specific Antigen) skrining tortishuvli mavzu — u sezgir, lekin spesifik emas (BPH, prostatit, jinsiy aloqadan keyin ham ko'tarilishi mumkin). Shu sababli yoshga moslashgan me'zonlar, PSA zichligi (PSAD) va erkin/umumiy PSA nisbati (%fPSA) kabi qo'shimcha ko'rsatkichlar spesifikani oshirish uchun ishlatiladi.",
          "Zamonaviy EAU/AUA qo'llanmalari individuallashtirilgan, bemor bilan muhokama qilingan ('shared decision-making') skrining yondashuvini tavsiya etadi — har bir erkakka ommaviy skrining emas.",
        ],
      },
      {
        sarlavha: '3. Biopsiya va Gleason tasnifi',
        matn: [
          "Shubhali PSA yoki rektal palpatsiya natijalarida multiparametrik MRT (mpMRI) va PI-RADS tasnifi qo'llaniladi — bu shubhali o'choqlarni aniqlashtirib, keraksiz biopsiyalarni kamaytiradi. MRT-yo'naltirilgan (fusion) biopsiya zamonaviy standart hisoblanadi.",
          "Gleason tasnifi gistologik agressivlik darajasini baholaydi (2 dan 5 gacha har bir naqsh uchun ball, eng ko'p uchraydigan + ikkinchi eng ko'p naqsh ballari qo'shiladi). Gleason 6 (3+3) — past darajali, 7 (3+4 yoki 4+3) — o'rta darajali, 8-10 — yuqori darajali agressivlikni bildiradi. Zamonaviy amaliyotda Gleason Grade Group (1-5) tasnifi ham qo'llaniladi.",
        ],
      },
      {
        sarlavha: '4. Xavf guruhlariga asoslangan davolash',
        matn: [
          "Past xavfli (PSA <10, Gleason ≤6, T1-T2a): faol kuzatuv (active surveillance) ko'pincha birinchi tanlov — muntazam PSA, MRT va qayta biopsiya bilan kuzatib boriladi, darhol davolash shart emas.",
          "O'rta xavfli: radikal prostatektomiya yoki nurli terapiya (ba'zan gormonal terapiya bilan birga) asosiy variantlar.",
          "Yuqori xavfli va metastatik holatlar: nurli terapiya + uzoq muddatli androgen deprivatsiya terapiyasi (ADT), yoki ilg'or holatlarda kimyoterapiya/yangi gormonal agentlar bilan kombinatsiya. Davolash qarori har doim multidisciplinar jamoa (urolog, onkolog-radiolog, kimyoterapevt) tomonidan qabul qilinishi tavsiya etiladi.",
        ],
      },
    ],
    manbalar: [
      'EAU-EANM-ESTRO-ESUR-ISUP-SIOG Guidelines on Prostate Cancer (2024)',
      'NCCN Clinical Practice Guidelines — Prostate Cancer',
      'Epstein JI va boshq. — Gleason Grade Group tasnifi (2016, ISUP)',
    ],
    test: [
      {
        savol: 'PSA skrining nima uchun tortishuvli mavzu hisoblanadi?',
        variantlar: ["PSA hech qachon noto'g'ri natija bermaydi", "PSA sezgir, lekin spesifik emas — BPH/prostatit ham uni oshiradi", 'PSA faqat ayollarda o\'lchanadi', "PSA testi juda qimmat"],
        togri: 1,
        izoh: "PSA yuqori sezuvchanlikka ega, lekin past spesifiklik tufayli benign holatlarda ham (BPH, prostatit) ko'tariladi, bu ortiqcha biopsiyalarga olib kelishi mumkin.",
      },
      {
        savol: 'mpMRI va PI-RADS tasnifining asosiy maqsadi nima?',
        variantlar: ["PSA o'rnini butunlay almashtirish", "Shubhali o'choqlarni aniqlab, keraksiz biopsiyalarni kamaytirish", "Faqat metastazlarni aniqlash", "Gleason ballini hisoblash"],
        togri: 1,
        izoh: "mpMRI/PI-RADS shubhali o'choqlarni aniqlashtirib, MRT-yo'naltirilgan biopsiyaga yo'l ochadi va keraksiz biopsiyalar sonini kamaytiradi.",
      },
      {
        savol: 'Gleason 3+4=7 qaysi agressivlik darajasiga to\'g\'ri keladi?',
        variantlar: ['Past darajali', "O'rta darajali", 'Yuqori darajali', 'Aniqlanmagan'],
        togri: 1,
        izoh: "Gleason 7 (3+4 yoki 4+3) o'rta darajali agressivlikni bildiradi; Gleason 6 past, Gleason 8-10 yuqori darajali hisoblanadi.",
      },
      {
        savol: 'Past xavfli prostata saratonida birinchi tanlov sifatida nima tavsiya etiladi?',
        variantlar: ['Darhol radikal prostatektomiya', "Faol kuzatuv (active surveillance)", 'Darhol kimyoterapiya', "Hech qanday tekshiruv kerak emas"],
        togri: 1,
        izoh: "Past xavfli guruhda faol kuzatuv ko'pincha birinchi tanlov bo'lib, muntazam PSA/MRT/biopsiya bilan progressiya kuzatiladi, darhol agressiv davolash shart emas.",
      },
      {
        savol: 'Yuqori xavfli prostata saratonida nurli terapiyaga odatda qaysi davolash qo\'shiladi?',
        variantlar: ['Faqat vitaminlar', "Uzoq muddatli androgen deprivatsiya terapiyasi (ADT)", "Faqat fizioterapiya", 'Hech narsa qo\'shilmaydi'],
        togri: 1,
        izoh: "Yuqori xavfli holatlarda nurli terapiya bilan birga uzoq muddatli ADT qo'llanilishi natijalarni sezilarli yaxshilaydi.",
      },
    ],
  },

  // ============================================================
  // 🟢 EASY (1-bosqich) — Umumiy urologiya asoslari
  // ============================================================

  // I. Kirish va semiotika
  {
    slug: 'urologiya-predmeti',
    sarlavha: 'Urologiyaning predmeti va asosiy tushunchalari',
    kategoriya: 'Kirish va semiotika',
    bosqich: 'oson',
    bepulNamuna: true,
    qisqa: "Urologiya nimani o'rganadi va uning ichki yo'nalishlari haqida umumiy tushuncha.",
    daqiqa: 4,
    bolimlar: [
      {
        sarlavha: '1. Urologiya nima?',
        matn: [
          "Urologiya — buyrak, siydik yo'llari (siydik naychalari, siydik pufagi, uretra) kasalliklarini, shuningdek erkaklarda qo'shimcha ravishda jinsiy-tanosil a'zolari (prostata, moyak, urug' yo'llari) kasalliklarini o'rganadigan va davolaydigan tibbiyot sohasi. Ayollarda urolog faqat siydik chiqarish tizimi bilan shug'ullanadi, erkaklarda esa jinsiy-tanosil tizimi ham uning vakolat doirasiga kiradi.",
          "Urologiya ichida bir necha tor yo'nalish mavjud: andrologiya (erkak reproduktiv salomatligi), onkourologiya (siydik-tanosil a'zolari saratoni), pediatrik urologiya (bolalar), funksional urologiya (siydik tutolmaslik va qovuq faoliyati buzilishi) va endourologiya (kam invaziv, endoskopik usullar).",
        ],
      },
    ],
    manbalar: ['Campbell-Walsh Urology, 12th ed. — Kirish bobi', 'EAU Guidelines — Umumiy kirish'],
    test: [
      {
        savol: "Urologiya asosan qaysi tizim kasalliklarini o'rganadi?",
        variantlar: ['Yurak-qon tomir tizimi', 'Siydik-tanosil tizimi', 'Nafas olish tizimi', 'Ovqat hazm qilish tizimi'],
        togri: 1,
        izoh: "Urologiya siydik chiqarish tizimi (buyrak, siydik yo'llari) va erkaklarda qo'shimcha ravishda jinsiy-tanosil a'zolari bilan shug'ullanadi.",
      },
      {
        savol: "Andrologiya urologiyaning qaysi yo'nalishi hisoblanadi?",
        variantlar: ['Bolalar urologiyasi', 'Erkak reproduktiv salomatligi', 'Saraton kasalliklari', 'Siydik tutolmaslik'],
        togri: 1,
        izoh: "Andrologiya — erkak reproduktiv va jinsiy salomatligini o'rganadigan urologiyaning tor yo'nalishi.",
      },
      {
        savol: 'Ayollarda urolog asosan nima bilan shug\'ullanadi?',
        variantlar: ['Faqat siydik chiqarish tizimi bilan', "Jinsiy a'zolar bilan ham", 'Faqat buyrak bilan', 'Hech narsa bilan'],
        togri: 0,
        izoh: "Ayollarda urologiyaning vakolat doirasi faqat siydik chiqarish tizimi (buyrak, siydik yo'llari, qovuq) bilan chegaralanadi.",
      },
    ],
    amaliySavolSoni: 15,
    savollarBanki: [
      {
        savol: "Urologiya fanining asosiy predmeti nima?",
        variantlar: ['Yurak-qon tomir tizimi kasalliklari', "Buyrak va siydik yo'llari kasalliklari", 'Markaziy asab tizimi kasalliklari', 'Suyak-mushak tizimi kasalliklari'],
        togri: 1,
        izoh: "Urologiya — buyrak va siydik yo'llari kasalliklarini o'rganadigan va davolaydigan tibbiyot sohasi.",
      },
      {
        savol: "Erkaklarda urologiya vakolat doirasiga siydik tizimidan tashqari yana nima kiradi?",
        variantlar: ['Ovqat hazm qilish a\'zolari', "Jinsiy-tanosil a'zolari", 'Nafas olish a\'zolari', 'Endokrin bezlarning barchasi'],
        togri: 1,
        izoh: "Erkaklarda urolog qo'shimcha ravishda jinsiy-tanosil a'zolari (prostata, moyak, urug' yo'llari) bilan ham shug'ullanadi.",
      },
      {
        savol: "Ayollarda urolog asosan qaysi tizim bilan shug'ullanadi?",
        variantlar: ['Faqat siydik chiqarish tizimi', 'Siydik va jinsiy tizim birgalikda', 'Faqat reproduktiv tizim', 'Butun endokrin tizim'],
        togri: 0,
        izoh: "Ayollarda urologning vakolat doirasi faqat siydik chiqarish tizimi bilan chegaralanadi.",
      },
      {
        savol: "Quyidagilardan qaysi biri siydik yo'llari tarkibiga kiradi?",
        variantlar: ['Prostata', "Siydik pufagi (qovuq)", 'Moyak', "Urug' pufakchasi"],
        togri: 1,
        izoh: "Siydik yo'llari — siydik naychalari, siydik pufagi va uretradan iborat.",
      },
      {
        savol: "Urologiyada erkaklarga xos qo'shimcha a'zolarga quyidagilardan qaysi biri kiradi?",
        variantlar: ['Buyrak', 'Ureter (siydik naychasi)', 'Prostata', 'Qovuq'],
        togri: 2,
        izoh: "Prostata — erkaklarda urologiya vakolat doirasiga qo'shimcha kiruvchi jinsiy-tanosil a'zosi.",
      },
      {
        savol: "Andrologiya urologiyaning qanday yo'nalishi?",
        variantlar: ['Bolalar kasalliklari', 'Erkak reproduktiv salomatligi', 'Endoskopik davolash usullari', 'Saraton kasalliklari'],
        togri: 1,
        izoh: "Andrologiya — erkak reproduktiv va jinsiy salomatligini o'rganadigan tor yo'nalish.",
      },
      {
        savol: "Onkourologiya nimani o'rganadi?",
        variantlar: ["Siydik-tanosil a'zolari saratonini", 'Bolalar urologik kasalliklarini', 'Siydik tutolmaslikni', 'Endoskopik jarrohlikni'],
        togri: 0,
        izoh: "Onkourologiya — siydik-tanosil a'zolari saratoni bilan shug'ullanadigan yo'nalish.",
      },
      {
        savol: "Pediatrik urologiya qaysi bemorlar guruhi bilan shug'ullanadi?",
        variantlar: ['Keksa yoshdagi bemorlar', 'Bolalar', 'Homilador ayollar', 'Sportchilar'],
        togri: 1,
        izoh: "Pediatrik urologiya — bolalardagi urologik kasalliklar bilan shug'ullanadigan yo'nalish.",
      },
      {
        savol: "Funksional urologiya asosan nimani o'rganadi?",
        variantlar: ["Siydik-tanosil a'zolari saratonini", 'Siydik tutolmaslik va qovuq faoliyati buzilishini', "Bolalar tug'ma anomaliyalarini", 'Erkak bepushtligini'],
        togri: 1,
        izoh: "Funksional urologiya — siydik tutolmaslik va qovuq faoliyati buzilishi bilan shug'ullanadi.",
      },
      {
        savol: "Endourologiya usullarining asosiy xususiyati nima?",
        variantlar: ['Ochiq keng kesma jarrohlik', 'Faqat dori-darmon bilan davolash', 'Kam invaziv, endoskopik yondashuv', "Faqat diagnostika, davolash yo'q"],
        togri: 2,
        izoh: "Endourologiya — kam invaziv, endoskopik usullarga asoslangan yo'nalish.",
      },
      {
        savol: "Urologiya qaysi ikkita asosiy tizimni birgalikda qamrab oladi (erkaklarda)?",
        variantlar: ["Siydik chiqarish va jinsiy-tanosil tizimlari", 'Nafas olish va yurak-qon tomir tizimlari', 'Asab va endokrin tizimlari', "Ovqat hazm qilish va tayanch-harakat tizimlari"],
        togri: 0,
        izoh: "Erkaklarda urologiya siydik chiqarish tizimi va jinsiy-tanosil tizimini birgalikda qamrab oladi.",
      },
      {
        savol: "Quyidagilardan qaysi biri urologiyaning tor (subspesialist) yo'nalishi emas?",
        variantlar: ['Andrologiya', 'Onkourologiya', 'Kardiologiya', 'Endourologiya'],
        togri: 2,
        izoh: "Kardiologiya — yurak kasalliklari bilan shug'ullanadigan alohida soha, urologiyaga tegishli emas.",
      },
      {
        savol: "Urug' yo'llari qaysi tizimga tegishli?",
        variantlar: ['Erkak jinsiy-tanosil tizimiga', 'Nafas olish tizimiga', 'Ovqat hazm qilish tizimiga', 'Asab tizimiga'],
        togri: 0,
        izoh: "Urug' yo'llari — erkak jinsiy-tanosil a'zolari tarkibiga kiradi.",
      },
      {
        savol: "Ayollarda urologning vakolat doirasi erkaklarnikiga nisbatan qanday?",
        variantlar: ["Kengroq, chunki reproduktiv a'zolarni ham qamraydi", 'Tor, faqat siydik chiqarish tizimi bilan chegaralangan', 'Ayollarda umuman urolog kerak emas', "Farqi yo'q, ikkalasida ham bir xil"],
        togri: 1,
        izoh: "Ayollarda urologning vakolat doirasi erkaklarnikidan tor — faqat siydik chiqarish tizimi bilan chegaralanadi.",
      },
      {
        savol: "Moyak (testis) urologiyada qaysi guruhga kiradi?",
        variantlar: ['Siydik yo\'llari a\'zolari', "Erkak jinsiy-tanosil a'zolari", 'Faqat gormonal endokrin bez', 'Hech qaysi guruhga kirmaydi'],
        togri: 1,
        izoh: "Moyak — erkaklarda urologiya vakolat doirasiga kiruvchi jinsiy-tanosil a'zosi.",
      },
      {
        savol: "Quyidagi yo'nalishlardan qaysi biri bevosita saraton kasalliklari bilan shug'ullanadi?",
        variantlar: ['Funksional urologiya', 'Onkourologiya', 'Pediatrik urologiya', 'Andrologiya'],
        togri: 1,
        izoh: "Onkourologiya — siydik-tanosil a'zolari saratoni bilan bevosita shug'ullanadigan yo'nalish.",
      },
      {
        savol: "Erkak bepushtligi va jinsiy funksiya buzilishlari asosan qaysi yo'nalish predmeti hisoblanadi?",
        variantlar: ['Onkourologiya', 'Andrologiya', 'Endourologiya', 'Pediatrik urologiya'],
        togri: 1,
        izoh: "Andrologiya erkak reproduktiv salomatligi, jumladan bepushtlik va jinsiy funksiya buzilishlarini o'rganadi.",
      },
      {
        savol: "Siydik pufagi (qovuq) qaysi tizim tarkibiga kiradi?",
        variantlar: ["Erkak jinsiy-tanosil tizimi", 'Siydik chiqarish tizimi', 'Endokrin tizim', 'Limfa tizimi'],
        togri: 1,
        izoh: "Siydik pufagi — siydik chiqarish tizimining bir qismi.",
      },
      {
        savol: "Quyidagilardan qaysi biri faqat erkaklarga xos a'zo emas (ya'ni siydik tizimiga tegishli, umumiy)?",
        variantlar: ['Prostata', 'Moyak', 'Buyrak', "Urug' pufakchasi"],
        togri: 2,
        izoh: "Buyrak — ham erkaklarda, ham ayollarda mavjud bo'lgan siydik chiqarish tizimi a'zosi.",
      },
      {
        savol: "Bolalarda uchraydigan tug'ma siydik-tanosil anomaliyalari bilan qaysi yo'nalish shug'ullanadi?",
        variantlar: ['Pediatrik urologiya', 'Onkourologiya', 'Andrologiya', 'Funksional urologiya'],
        togri: 0,
        izoh: "Pediatrik urologiya bolalardagi tug'ma anomaliyalar va boshqa urologik muammolar bilan shug'ullanadi.",
      },
      {
        savol: "Kam invaziv, mini-teshikli yoki teshiksiz endoskopik operatsiyalar qaysi yo'nalishga tegishli?",
        variantlar: ['Pediatrik urologiya', 'Endourologiya', 'Andrologiya', 'Onkourologiya'],
        togri: 1,
        izoh: "Endourologiya — kam invaziv, endoskopik operatsiya usullariga ixtisoslashgan yo'nalish.",
      },
      {
        savol: "Qovuq faoliyati buzilishi (masalan, neyrogen qovuq) qaysi yo'nalish doirasida o'rganiladi?",
        variantlar: ['Funksional urologiya', 'Onkourologiya', 'Pediatrik urologiya', 'Andrologiya'],
        togri: 0,
        izoh: "Funksional urologiya qovuq faoliyati buzilishi va siydik tutolmaslik bilan shug'ullanadi.",
      },
      {
        savol: "Quyidagi ta'riflardan qaysi biri \"urologiya\" so'ziga to'g'ri keladi?",
        variantlar: ['Faqat bolalar kasalliklarini o\'rganuvchi fan', "Buyrak, siydik yo'llari va (erkaklarda) jinsiy-tanosil a'zolari kasalliklarini o'rganuvchi va davolovchi soha", 'Faqat saraton kasalliklarini o\'rganuvchi soha', "Faqat endoskopik jarrohlik usullarini o'rganuvchi soha"],
        togri: 1,
        izoh: "Urologiya — buyrak, siydik yo'llari va erkaklarda qo'shimcha jinsiy-tanosil a'zolari kasalliklarini o'rganuvchi va davolovchi tibbiyot sohasi.",
      },
      {
        savol: "Prostata bezi qaysi a'zolar guruhiga kiradi?",
        variantlar: ["Siydik yo'llari a'zosi", "Erkak jinsiy-tanosil a'zosi", 'Endokrin bez, gormonal tizim', 'Limfa tugunlari guruhi'],
        togri: 1,
        izoh: "Prostata — erkak jinsiy-tanosil a'zolariga kiradi.",
      },
      {
        savol: "Urologiyaning tor yo'nalishlaridan bo'lmagan variantni toping.",
        variantlar: ['Andrologiya', 'Onkourologiya', 'Pediatrik urologiya', 'Gastroenterologiya'],
        togri: 3,
        izoh: "Gastroenterologiya — ovqat hazm qilish tizimi bilan shug'ullanadigan alohida soha, urologiyaga tegishli emas.",
      },
      {
        savol: "Funksional urologiya ko'proq qaysi bemorlar bilan ishlaydi?",
        variantlar: ['Siydik tutolmasligi bo\'lgan bemorlar', 'Saraton kasalligi bo\'lgan bemorlar', "Tug'ma anomaliyasi bo'lgan bolalar", 'Faqat erkak bepushtligi bo\'lgan bemorlar'],
        togri: 0,
        izoh: "Funksional urologiya asosan siydik tutolmasligi va qovuq faoliyati buzilgan bemorlar bilan ishlaydi.",
      },
      {
        savol: "Onkourologiya doirasida saraton nuqtai nazaridan qaysi a'zo O'RGANILMAYDI?",
        variantlar: ['Buyrak', 'Qovuq', 'Prostata', 'Yurak'],
        togri: 3,
        izoh: "Yurak — kardiologiya vakolat doirasiga tegishli, onkourologiya siydik-tanosil a'zolari saratoni bilan shug'ullanadi.",
      },
      {
        savol: "Endourologik usullarning an'anaviy ochiq jarrohlikdan asosiy afzalligi nima?",
        variantlar: ['Kamroq invaziv, tezroq tiklanish', 'Har doim arzonroq bo\'ladi', 'Faqat bolalarda qo\'llaniladi', "Dori-darmonsiz davolash imkonini beradi"],
        togri: 0,
        izoh: "Endourologiya kam invaziv bo'lgani uchun bemor tezroq tiklanadi.",
      },
      {
        savol: "\"Erkak reproduktiv salomatligi\" ta'rifi qaysi tor yo'nalishga tegishli?",
        variantlar: ['Onkourologiya', 'Andrologiya', 'Pediatrik urologiya', 'Funksional urologiya'],
        togri: 1,
        izoh: "Andrologiya — erkak reproduktiv salomatligini o'rganadigan yo'nalish.",
      },
      {
        savol: "Siydik-tanosil a'zolari saratoni bilan shug'ullanadigan mutaxassis qanday nomlanadi?",
        variantlar: ['Androlog', 'Onkourolog', 'Pediatr-urolog', 'Funksional urolog'],
        togri: 1,
        izoh: "Onkourolog — siydik-tanosil a'zolari saratoni bilan shug'ullanadigan mutaxassis.",
      },
      {
        savol: "Quyidagilardan qaysi biri \"siydik yo'llari\" tarkibiga KIRMAYDI?",
        variantlar: ['Siydik naychalari (ureterlar)', 'Siydik pufagi', 'Uretra', "Urug' pufakchasi"],
        togri: 3,
        izoh: "Urug' pufakchasi — erkak jinsiy-tanosil a'zosi, siydik yo'llariga emas.",
      },
      {
        savol: "Erkaklarda qo'shimcha jinsiy-tanosil a'zolarini o'z ichiga olgan urologiya, ayollarga nisbatan qanday tavsiflanadi?",
        variantlar: ["Ayollardagidan tor doirali", 'Ayollardagidan kengroq doirali', 'Aynan bir xil', "Umuman bog'liq emas"],
        togri: 1,
        izoh: "Erkaklarda urologiya jinsiy-tanosil a'zolarini ham qamragani uchun ayollardagiga nisbatan kengroq.",
      },
      {
        savol: "Bola yoshidagi bemorlarda uchraydigan siydik-tanosil kasalliklari bilan kim shug'ullanadi?",
        variantlar: ['Androlog', 'Pediatrik urolog', 'Onkourolog', 'Kardiolog'],
        togri: 1,
        izoh: "Pediatrik urolog bolalardagi siydik-tanosil kasalliklari bilan shug'ullanadi.",
      },
      {
        savol: "Quyidagi yo'nalishlardan qaysi biri \"kam invaziv, endoskopik usullar\" ta'rifiga mos keladi?",
        variantlar: ['Andrologiya', 'Endourologiya', 'Pediatrik urologiya', 'Onkourologiya'],
        togri: 1,
        izoh: "Endourologiya kam invaziv, endoskopik usullar bilan tavsiflanadi.",
      },
      {
        savol: "Urologiya sohasida \"predmet\" (o'rganish ob'yekti) sifatida eng to'g'ri ta'rifni tanlang.",
        variantlar: ['Faqat buyrak kasalliklari', "Buyrak, siydik yo'llari va erkaklarda jinsiy-tanosil a'zolari kasalliklari", "Faqat jinsiy-tanosil a'zolari kasalliklari", 'Faqat siydik pufagi kasalliklari'],
        togri: 1,
        izoh: "Urologiyaning predmeti — buyrak, siydik yo'llari va erkaklarda qo'shimcha jinsiy-tanosil a'zolari kasalliklari.",
      },
      {
        savol: "Quyidagilardan qaysi biri erkak jinsiy-tanosil a'zolariga tegishli EMAS?",
        variantlar: ['Prostata', 'Moyak', "Urug' pufakchasi", 'Siydik pufagi'],
        togri: 3,
        izoh: "Siydik pufagi — siydik chiqarish tizimi a'zosi, jinsiy-tanosil a'zosi emas.",
      },
      {
        savol: "Siydik tutolmaslik muammosi bo'yicha ixtisoslashgan urolog qanday ataladi?",
        variantlar: ['Funksional urolog', 'Onkourolog', 'Androlog', 'Pediatrik urolog'],
        togri: 0,
        izoh: "Funksional urolog siydik tutolmaslik va qovuq faoliyati buzilishi bo'yicha ixtisoslashgan.",
      },
      {
        savol: "Urologiya sohasidagi besh tor yo'nalishni to'g'ri sanab bering.",
        variantlar: [
          'Andrologiya, onkourologiya, pediatrik urologiya, funksional urologiya, endourologiya',
          'Kardiologiya, nevrologiya, gastroenterologiya, pulmonologiya, endokrinologiya',
          'Travmatologiya, oftalmologiya, otorinolaringologiya, dermatologiya, psixiatriya',
          'Ftiziatriya, infeksionist, gematologiya, revmatologiya, allergologiya',
        ],
        togri: 0,
        izoh: "Urologiya ichidagi besh tor yo'nalish: andrologiya, onkourologiya, pediatrik urologiya, funksional urologiya va endourologiya.",
      },
      {
        savol: "Prostata, moyak va urug' yo'llari birgalikda qanday umumiy nom bilan ataladi?",
        variantlar: ["Jinsiy-tanosil a'zolari", "Siydik yo'llari a'zolari", 'Endokrin bezlar', 'Limfa a\'zolari'],
        togri: 0,
        izoh: "Prostata, moyak va urug' yo'llari — erkaklarda urologiya vakolat doirasiga kiruvchi jinsiy-tanosil a'zolari.",
      },
      {
        savol: "Umumiy qilib aytganda, urologiya qaysi ta'rifga to'g'ri mos keladi?",
        variantlar: [
          'Faqat erkaklar kasalliklarini davolovchi soha',
          "Buyrak va siydik yo'llari, shuningdek erkaklarda qo'shimcha jinsiy-tanosil a'zolari kasalliklarini o'rganuvchi va davolovchi tibbiyot sohasi",
          'Faqat bolalar kasalliklarini davolovchi soha',
          "Faqat diagnostika bilan shug'ullanuvchi soha (davolamaydi)",
        ],
        togri: 1,
        izoh: "Urologiya — buyrak va siydik yo'llari, shuningdek erkaklarda qo'shimcha jinsiy-tanosil a'zolari kasalliklarini o'rganuvchi va davolovchi tibbiyot sohasi.",
      },
    ],
  },
  {
    slug: 'urologik-simptomlar',
    sarlavha: 'Asosiy urologik simptomlar: dizuriya, gematuriya, og\'riq, siydik ushlanishi',
    kategoriya: 'Kirish va semiotika',
    bosqich: 'oson',
    qisqa: "Urologiyada eng ko'p uchraydigan to'rt asosiy shikoyat turi va ularning ma'nosi.",
    daqiqa: 5,
    bolimlar: [
      {
        sarlavha: '1. Asosiy simptomlar',
        matn: [
          "Dizuriya — siyish vaqtidagi og'riq yoki noxush yonish hissi, ko'pincha siydik yo'li infeksiyasi (sistit, uretrit) belgisi. Gematuriya — siydikda qon bo'lishi: ko'z bilan ko'rinadigan (makrogematuriya) yoki faqat laborator tahlilda aniqlanadigan (mikrogematuriya) bo'lishi mumkin va sababi har doim aniqlanishi shart, chunki bu o'sma belgisi ham bo'lishi mumkin.",
          "Urologik og'riq odatda bel/yon qorin sohasida (buyrak/siydik yo'li toshlari), kichik chanoqda (prostata, qovuq) yoki moyakda joylashadi. Siydik ushlanishi — qovuqda to'plangan siydikni mustaqil chiqara olmaslik holati; o'tkir (to'satdan boshlanadi, juda og'riqli, shoshilinch yordam talab qiladi) va surunkali (asta-sekin rivojlanadi, qovuq doimo to'lib turadi) turlarga bo'linadi.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines — Urologik simptomlarni baholash', 'Campbell-Walsh Urology, 12th ed.'],
    test: [
      {
        savol: 'Gematuriya nima?',
        variantlar: ['Siyishda og\'riq', 'Siydikda qon bo\'lishi', 'Siydik hajmining ko\'payishi', 'Siydik rangining sariq bo\'lishi'],
        togri: 1,
        izoh: "Gematuriya — siydikda qizil qon hujayralari (eritrotsitlar) borligini bildiradi.",
      },
      {
        savol: 'Makro- va mikrogematuriya orasidagi farq nimada?',
        variantlar: ["Makro — ko'z bilan ko'rinadi, mikro — faqat tahlilda aniqlanadi", "Ular orasida farq yo'q", 'Mikrogematuriya har doim xavfliroq', 'Makrogematuriya faqat erkaklarda uchraydi'],
        togri: 0,
        izoh: "Makrogematuriya ko'z bilan ko'rinadigan qonli siydikni, mikrogematuriya esa faqat mikroskopik tahlilda aniqlanadigan eritrotsitlarni bildiradi.",
      },
      {
        savol: "O'tkir siydik ushlanishi qanday holat?",
        variantlar: ['Asta-sekin rivojlanadi va og\'riqsiz kechadi', "To'satdan boshlanadi, juda og'riqli va shoshilinch yordam talab qiladi", 'Faqat ayollarda uchraydi', 'Davolanishi shart emas'],
        togri: 1,
        izoh: "O'tkir siydik ushlanishi to'satdan boshlanadi, kuchli og'riq va qovuqning to'lib-toshishi bilan kechadi — bu shoshilinch urologik holat.",
      },
    ],
    amaliySavolSoni: 15,
    savollarBanki: [
      {
        savol: "Dizuriya nima?",
        variantlar: ['Siydikda qon bo\'lishi', 'Siyish vaqtidagi og\'riq yoki achishish', 'Siydik tutolmaslik', 'Tez-tez siyish'],
        togri: 1,
        izoh: "Dizuriya — siydik chiqarish vaqtida og'riq yoki achishish hissi.",
      },
      {
        savol: "Dizuriyaning eng ko'p uchraydigan sababi qaysi?",
        variantlar: ['Buyrak toshi', 'Sistit (qovuq yallig\'lanishi)', 'Prostata saratoni', 'Gidronefroz'],
        togri: 1,
        izoh: "Sistit — dizuriyaning eng ko'p uchraydigan sababi, ayniqsa ayollarda.",
      },
      {
        savol: "Gematuriya nima?",
        variantlar: ['Siyishda og\'riq', 'Siydikda qon bo\'lishi', 'Siydik hajmining ko\'payishi', 'Siydik rangining sariq bo\'lishi'],
        togri: 1,
        izoh: "Gematuriya — siydikda qizil qon hujayralari (eritrotsitlar) borligini bildiradi.",
      },
      {
        savol: "Makrogematuriya va mikrogematuriyaning farqi nimada?",
        variantlar: ["Makro — ko'z bilan ko'rinadi, mikro — faqat tahlilda aniqlanadi", "Ular orasida farq yo'q", 'Mikrogematuriya har doim xavfliroq', 'Makrogematuriya faqat erkaklarda uchraydi'],
        togri: 0,
        izoh: "Makrogematuriya ko'z bilan ko'rinadigan qonli siydikni, mikrogematuriya esa faqat mikroskopik tahlilda aniqlanadigan eritrotsitlarni bildiradi.",
      },
      {
        savol: "Og'riqsiz makrogematuriyada eng birinchi qanday kasallikni istisno qilish kerak?",
        variantlar: ['Sistit', 'Urologik saraton (o\'sma)', 'Pielonefrit', 'Prostatit'],
        togri: 1,
        izoh: "Og'riqsiz makrogematuriya — urologik saratonning (ayniqsa qovuq saratoni) birinchi va ba'zan yagona belgisi bo'lishi mumkin.",
      },
      {
        savol: "O'tkir siydik ushlanishi qanday holat?",
        variantlar: ['Asta-sekin rivojlanadi va og\'riqsiz kechadi', "To'satdan boshlanadi, juda og'riqli va shoshilinch yordam talab qiladi", 'Faqat ayollarda uchraydi', 'Davolanishi shart emas'],
        togri: 1,
        izoh: "O'tkir siydik ushlanishi to'satdan boshlanadi, kuchli og'riq va qovuqning to'lib-toshishi bilan kechadi — bu shoshilinch urologik holat.",
      },
      {
        savol: "Surunkali siydik ushlanishi qanday farq qiladi?",
        variantlar: ["Asta-sekin rivojlanadi, ko'pincha og'riqsiz", "To'satdan boshlanadi, juda og'riqli", 'Faqat bolalarda uchraydi', 'Hech qachon davolanmaydi'],
        togri: 0,
        izoh: "Surunkali siydik ushlanishi asta-sekin rivojlanadi, ko'pincha og'riqsiz kechadi va qovuqda doimiy qoldiq siydik bilan tavsiflanadi.",
      },
      {
        savol: "Buyrak og'rig'i odatda qaysi sohadа seziladi?",
        variantlar: ['Suprapubik soha', 'Bel-qovurg\'a burchagi (kostovertebral burchak)', 'Ko\'krak qafasi', 'Bo\'yin sohasi'],
        togri: 1,
        izoh: "Buyrak og'rig'i odatda bel-qovurg'a burchagida (12-qovurg'adan past, umurtqa yon tomonida) seziladi.",
      },
      {
        savol: "Siydik yo'li toshi og'rig'i ko'pincha qayerga aks etadi (irradiyatsiya)?",
        variantlar: ['Yelka va qo\'lga', 'Moyak (erkaklarda) yoki labiya (ayollarda)ga', 'Orqaga va bo\'yinga', 'Oyoq panjasiga'],
        togri: 1,
        izoh: "Siydik yo'li og'rig'i umumiy nerv ta'minoti (T11–L1) tufayli moyak yoki labiyaga aks etishi mumkin.",
      },
      {
        savol: "Kolikasimon (to'siqli) og'riq va parenximatoz og'riqning asosiy farqi nima?",
        variantlar: ["Kolika — bemor tinch turolmaydi; parenximatoz — bemor harakatsiz yotadi", "Ikkalasi ham bir xil kechadi", "Kolika faqat erkaklarda bo'ladi", "Parenximatoz og'riq faqat bolalarda uchraydi"],
        togri: 0,
        izoh: "Kolikasimon og'riqda bemor qulay holat izlab harakat qiladi, parenximatoz og'riqda esa bemor harakatsiz yotishga harakat qiladi.",
      },
      {
        savol: "Stranguriya nima?",
        variantlar: ['Siydikda qon', 'Siydik chiqarish oxirida kuchli, achishtiruvchi og\'riq', 'Tez-tez siyish', 'Siydik tutolmaslik'],
        togri: 1,
        izoh: "Stranguriya — siydik chiqarish oxirida his qilinadigan kuchli, achishtiruvchi og'riq, ko'pincha qovuq yallig'lanishi belgisi.",
      },
      {
        savol: "Uretrit ko'pincha qanday infeksiyalar natijasida yuzaga keladi?",
        variantlar: ['Nafas yo\'llari infeksiyalari', 'Jinsiy yo\'l bilan yuqadigan infeksiyalar (gonoreya, xlamidiya)', 'Teri infeksiyalari', 'Ichak infeksiyalari'],
        togri: 1,
        izoh: "Uretrit ko'pincha jinsiy yo'l bilan yuqadigan infeksiyalar (gonoreya, xlamidiya, gerpes) natijasida yuzaga keladi.",
      },
      {
        savol: "Dizuriya bilan birga uretral ajralma bo'lsa, eng ehtimoliy tashxis nima?",
        variantlar: ['Sistit', 'Uretrit', 'Pielonefrit', 'Buyrak toshi'],
        togri: 1,
        izoh: "Dizuriya + uretral ajralma birikishi uretrit (ko'pincha JYI tufayli)ga xos belgi hisoblanadi.",
      },
      {
        savol: "Ayollarda dizuriyaga o'xshash shikoyat beruvchi, lekin siydik yo'li infeksiyasi bo'lmagan holat qaysi?",
        variantlar: ['Pielonefrit', 'Vaginit', 'Gidronefroz', 'Buyrak yetishmovchiligi'],
        togri: 1,
        izoh: "Vaginit ayollarda dizuriyaga o'xshash og'riq berishi mumkin, lekin aslida qin sohasidan keladigan og'riq.",
      },
      {
        savol: "Mikroskopik gematuriya qanday aniqlanadi?",
        variantlar: ['Bemor siydik rangini o\'zi ko\'radi', 'Faqat mikroskop tekshiruvida (HPF da 3 tadan ortiq eritrotsit)', 'Siydik hidi o\'zgarishi bilan', 'Faqat qon tahlili orqali'],
        togri: 1,
        izoh: "Mikroskopik gematuriya ko'zga ko'rinmaydi, faqat mikroskop ostida yuqori quvvatli maydonda (HPF) 3 tadan ortiq eritrotsit aniqlansa tashxislanadi.",
      },
      {
        savol: "Gematuriyani siydik oqimining boshlang'ich qismida ko'rish nimani ko'rsatadi?",
        variantlar: ['Buyrak manbali qon ketishni', 'Uretra yoki prostata manbali qon ketishni', 'Qovuq saratonini', 'Normal fiziologik holatni'],
        togri: 1,
        izoh: "Boshlang'ich (initial) gematuriya uretra yoki prostata manbai haqida dalolat beradi.",
      },
      {
        savol: "Total gematuriya (butun oqim davomida qon) qaysi manba haqida ma'lumot beradi?",
        variantlar: ['Faqat uretra', 'Faqat prostata', 'Yuqori siydik yo\'llari yoki qovuq', 'Moyak'],
        togri: 2,
        izoh: "Total gematuriya — yuqori siydik yo'llari (buyrak, ureter) yoki qovuq manbasini ko'rsatadi.",
      },
      {
        savol: "AUA tasnifiga ko'ra, mikroskopik gematuriyali bemorlar qanday guruhlarga bo'linadi?",
        variantlar: ['Past, o\'rta va yuqori xavf', 'Faqat yuqori va past xavf', 'Xavf guruhlarga bo\'linmaydi', 'Yoshga qarab faqat ikki guruh'],
        togri: 0,
        izoh: "AUA qo'llanmasi bo'yicha bemorlar yosh, jins, chekish tarixi va gematuriya darajasiga qarab past, o'rta va yuqori xavf guruhlariga bo'linadi.",
      },
      {
        savol: "Qovuq og'rig'i odatda qaysi sohadа seziladi?",
        variantlar: ['Bel-qovurg\'a burchagida', 'Suprapubik sohadа', 'Tos sohasida', 'Ko\'krak qafasida'],
        togri: 1,
        izoh: "Qovuq og'rig'i suprapubik sohadа seziladi, qovuq to'lganda kuchayadi va bo'shagandan keyin yengillashadi.",
      },
      {
        savol: "O'tkir siydik ushlanishida birinchi qilinishi kerak bo'lgan amaliy qadam nima?",
        variantlar: ['Qovuq ultratovushi', 'Kechiktirmasdan kateterizatsiya (qovuqni bo\'shatish)', 'Antibiotik berish', 'Bemor kuzatish'],
        togri: 1,
        izoh: "O'tkir siydik ushlanishida birinchi navbatda qovuqni kateterizatsiya orqali bo'shatish kerak — bu shoshilinch holat.",
      },
      {
        savol: "Agar uretral kateterizatsiya imkonsiz bo'lsa, nima qilinadi?",
        variantlar: ['Hech narsa qilinmaydi', 'Suprapubik kateter qo\'yiladi', 'Faqat antibiotik beriladi', 'Bemor uyga yuboriladi'],
        togri: 1,
        izoh: "Uretral kateterizatsiya imkonsiz bo'lsa (masalan, uretra jarohati shubhasi), suprapubik kateter qo'yiladi — qorin old devori orqali to'g'ridan-to'g'ri qovuqqa.",
      },
      {
        savol: "PVR (postvoid residual) nima?",
        variantlar: ['Siydik chiqargandan keyin qovuqda qolgan siydik hajmi', 'Buyrakda filtratsiyadagi qoldiq', 'Siydikdagi oqsil miqdori', 'Qovuq hajmining umumiy sig\'imi'],
        togri: 0,
        izoh: "PVR — siydik chiqargandan keyin qovuqda qolgan siydik miqdori, ultratovush yoki kateterizatsiya yordamida o'lchanadi.",
      },
      {
        savol: "Prostata kattalashishi (BPH) asosan qanday simptomga sabab bo'ladi?",
        variantlar: ['Gematuriya', 'Siydik ushlanishi', 'Dizuriya', 'Buyrak og\'rig\'i'],
        togri: 1,
        izoh: "BPH uretrani toraytirib, siydik ushlanishi va pastki siydik yo'llari simptomlarini keltirib chiqaradi.",
      },
      {
        savol: "Pielonefritda og'riq qanday xarakterga ega?",
        variantlar: ['Kolikasimon, intermittent', 'Doimiy, bel sohasida, CVAT bilan birga', 'Suprapubik sohadа, tez-tez siyish bilan', 'Og\'riqsiz kechadi'],
        togri: 1,
        izoh: "Pielonefritda og'riq doimiy xarakterda bo'lib, bel-qovurg'a burchagi og'riqliligi (CVAT) bilan birga kechadi.",
      },
      {
        savol: "CVAT nima va qaysi kasallikda aniqlanadi?",
        variantlar: ['Bel-qovurg\'a burchagida palpatsiyada og\'riqlilik — pielonefrit belgisi', 'Suprapubik og\'riq — sistit belgisi', 'Moyak og\'rig\'i — orxoepididimit belgisi', 'Uretra og\'rig\'i — uretrit belgisi'],
        togri: 0,
        izoh: "CVAT (Costovertebral Angle Tenderness) — bel-qovurg'a burchagida palpatsiyada og'riqlilik, pielonefrit belgisi.",
      },
      {
        savol: "Katta yoshdagi chekuvchi bemorda davom etuvchi dizuriya qanday kasallik belgisi bo'lishi mumkin?",
        variantlar: ['Oddiy sistit', 'Yashirin qovuq saratoni (carcinoma in situ)', 'Gidronefroz', 'Kriptorxizm'],
        togri: 1,
        izoh: "50 yoshdan katta, chekish tarixi bo'lgan bemorlarda davom etuvchi dizuriya qovuq saratoni (CIS) belgisi bo'lishi mumkin.",
      },
      {
        savol: "Siydik yo'li toshlariga xos og'riq qanday boshlanadi?",
        variantlar: ['Asta-sekin, kunlar davomida', 'To\'satdan, o\'tkir boshlanish bilan', 'Faqat tungi paytda', 'Og\'riqsiz kechadi'],
        togri: 1,
        izoh: "Siydik yo'li toshiga xos og'riq o'tkir boshlanadi, kolikasimon xarakterda bo'ladi.",
      },
      {
        savol: "Quyidagi simptomlardan qaysi biri saqlanish (storage) simptomlari guruhiga kiradi?",
        variantlar: ['Siyish oqimining kuchsizligi', 'Tez-tez siyish (frequency) va nokturiya', 'Siyishni boshlashda kuchanish', 'Uzilib-uzilib siyish'],
        togri: 1,
        izoh: "Tez-tez siyish va nokturiya — saqlanish (storage) simptomlari guruhiga kiradi.",
      },
      {
        savol: "Quyidagilardan qaysi biri bo'shatish (voiding) simptomi?",
        variantlar: ['To\'satdan kuchli siyish ehtiyoji (urgency)', 'Siyish oqimining kuchsizligi', 'Nokturiya (tungi siyish)', 'Tez-tez siyish'],
        togri: 1,
        izoh: "Siyish oqimining kuchsizligi — bo'shatish (voiding) simptomlariga kiradi.",
      },
      {
        savol: "Og'riq va og'riqlilik (tenderness) orasidagi farq nima?",
        variantlar: ["Og'riq — bemorning subyektiv tuyg'usi, og'riqlilik — shifokor palpatsiyasida aniqlanadigan ob'ektiv belgi", "Ular bir xil narsa", "Og'riqlilik faqat laboratoriyada aniqlanadi", "Og'riq faqat bolalarda bo'ladi"],
        togri: 0,
        izoh: "Og'riq bemorning o'zi his qiladigan subyektiv tuyg'u, og'riqlilik esa shifokor tekshiruvida aniqlanadigan ob'ektiv belgi.",
      },
      {
        savol: "Siydik ushlanishining nevrologik sabablari qaysi?",
        variantlar: ['Orqa miya jarohati, ko\'p tarqalgan skleroz, diabetik neyropatiya', 'Faqat BPH', 'Faqat uretra torayishi', 'Faqat prostatit'],
        togri: 0,
        izoh: "Nevrologik sabablar: orqa miya jarohati, ko'p tarqalgan skleroz va diabetga bog'liq neyropatiya siydik ushlanishiga olib kelishi mumkin.",
      },
      {
        savol: "Qaysi dori-darmonlar siydik ushlanishiga sabab bo'lishi mumkin?",
        variantlar: ['Antibiotiklar', 'Antikolinergik vositalar, simpatomimetiklar, opioidlar', 'Vitaminlar', 'Antigipertenziv vositalarning barchasi'],
        togri: 1,
        izoh: "Antikolinergik va simpatomimetik vositalar, hamda opioidlar qovuq faoliyatini buzib, siydik ushlanishiga sabab bo'lishi mumkin.",
      },
      {
        savol: "Yuqori xavfli mikroskopik gematuriya bemorida qanday tekshiruv tavsiya etiladi?",
        variantlar: ['Faqat qayta siydik tahlili', 'Sistoskopiya + kompyuter tomografiya urografiyasi (CTU)', 'Faqat antibiotik berish', 'Hech qanday tekshiruv kerak emas'],
        togri: 1,
        izoh: "Yuqori xavfli guruhdagi bemorlarga sistoskopiya va CTU tavsiya etiladi.",
      },
      {
        savol: "Terminal gematuriya (siydik oqimining oxirida qon) qaysi manba haqida gapiradi?",
        variantlar: ['Buyrak manbasi', 'Qovuq bo\'yni manbasi', 'Uretra manbasi', 'Moyak manbasi'],
        togri: 1,
        izoh: "Terminal gematuriya qovuq bo'yni manbasini ko'rsatadi.",
      },
      {
        savol: "Dizuriya bilan birga isitma va bel og'rig'i bo'lsa, eng ehtimoliy tashxis nima?",
        variantlar: ['Sistit', 'Pielonefrit', 'Uretrit', 'Qovuq saratoni'],
        togri: 1,
        izoh: "Dizuriya + isitma + bel og'rig'i (CVAT) — pielonefritga xos klassik uchlik.",
      },
      {
        savol: "Siydik ekinmasi (urine culture) qachon zarur bo'ladi?",
        variantlar: ['Har doim, barcha bemorlarda', 'Klinik belgilarga mos kelmagan hollarda, dipstick natijasini tasdiqlash uchun', 'Faqat erkaklarda', 'Hech qachon kerak emas'],
        togri: 1,
        izoh: "Klinik belgilarga mos kelmagan holatlarda siydik ekinmasi bilan bakterial infeksiyani tasdiqlash kerak.",
      },
      {
        savol: "Qovuq og'rig'i qachon kuchayadi?",
        variantlar: ['Qovuq bo\'shagandan keyin', 'Qovuq to\'lganda', 'Faqat tungi paytda', 'Faqat erta tongda'],
        togri: 1,
        izoh: "Qovuq og'rig'i suprapubik sohadа qovuq to'lganda kuchayadi va bo'shagandan keyin yengillashadi.",
      },
      {
        savol: "To'rtta asosiy urologik simptomni to'g'ri sanab bering.",
        variantlar: ['Dizuriya, gematuriya, og\'riq, siydik ushlanishi', 'Isitma, yo\'tal, bosh og\'rig\'i, ko\'ngil aynishi', 'Terlash, holsizlik, ishtaha yo\'qolishi, og\'riq', 'Qichishish, shishish, qizarish, issiqlik'],
        togri: 0,
        izoh: "Urologiyada to'rtta asosiy simptom: dizuriya, gematuriya, og'riq va siydik ushlanishi.",
      },
      {
        savol: "Uretra torayishi (stricture) qanday simptomga sabab bo'ladi?",
        variantlar: ['Gematuriya', 'Siydik oqimining kuchsizligi va siydik ushlanishi', 'Buyrak og\'rig\'i', 'Tez-tez siyish'],
        togri: 1,
        izoh: "Uretra torayishi siydik oqimini mexanik ravishda to'sib, siydik ushlanishi va oqim kuchsizligiga sabab bo'ladi.",
      },
      {
        savol: "Bemor anamnezida (HPI) qaysi ma'lumotlar aniqlash shart?",
        variantlar: ["Og'riq joylashuvi, xarakteri, boshlanish vaqti, kuchaytiruvchi/yengillashtiruvchi omillar", 'Faqat bemor ismi va yoshi', 'Faqat laboratoriya natijalari', 'Faqat oilaviy anamnez'],
        togri: 0,
        izoh: "HPI (kasallik anamnezi) da alomatning joylashuvi, xarakteri, boshlanish vaqti va kuchayish/pasayish omillarini aniqlash shart.",
      },
    ],
  },
  {
    slug: 'siydik-tahlili-asoslari',
    sarlavha: 'Umumiy siydik tahlili va asosiy laborator ko\'rsatkichlar',
    kategoriya: 'Kirish va semiotika',
    bosqich: 'oson',
    qisqa: "Umumiy siydik tahlilidagi asosiy ko'rsatkichlar va ularning klinik ahamiyati.",
    daqiqa: 5,
    amaliySavolSoni: 15,
    bolimlar: [
      {
        sarlavha: '1. Asosiy ko\'rsatkichlar',
        matn: [
          "Umumiy siydik tahlili urologiyada eng arzon va informativ birinchi tekshiruv hisoblanadi. Leykotsitlar (oqsil hujayralar) ko'pligi infeksiya/yallig'lanishni, eritrotsitlar (qon hujayralari) borligi gematuriyani, oqsil (protein) borligi buyrak filtratsiyasi buzilishini, nitritlar bakterial infeksiyani ko'rsatishi mumkin.",
          "Siydikning solishtirma og'irligi (zichligi) buyrakning siydikni quyuqlashtirish qobiliyatini, pH darajasi esa metabolik holat va tosh turini bashorat qilishda yordam beradi (masalan, doimiy ishqoriy pH struvit toshiga moyillikni ko'rsatadi). Glyukoza va keton tanachalari diabetni aniqlashda qo'shimcha ma'lumot beradi.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines — Laborator diagnostika', "Klinik laboratoriya tahlillari qo'llanmasi"],
    test: [
      {
        savol: 'Siydikda leykotsitlar ko\'pligi nimani ko\'rsatadi?',
        variantlar: ['Diabetni', "Infeksiya/yallig'lanishni", 'Buyrak toshini', "Qon bosimi o'zgarishini"],
        togri: 1,
        izoh: "Leykotsituriya (siydikda leykotsitlar ko'pligi) odatda siydik yo'li infeksiyasi yoki yallig'lanish belgisi.",
      },
      {
        savol: 'Siydikda nitrit aniqlanishi nimani bildiradi?',
        variantlar: ['Diabetni', "Bakterial infeksiya ehtimolini", "Buyrak yetishmovchiligini", 'Dehidratatsiyani'],
        togri: 1,
        izoh: "Ba'zi bakteriyalar nitratni nitritga aylantiradi — bu test bakterial siydik yo'li infeksiyasini taxmin qilishda foydalanadi.",
      },
      {
        savol: 'Doimiy ishqoriy (yuqori) siydik pH qaysi tosh turiga moyillikni ko\'rsatishi mumkin?',
        variantlar: ['Sistin toshi', 'Siydik kislotasi toshi', 'Struvit toshi', 'Kalsiy oksalat toshi'],
        togri: 2,
        izoh: "Ishqoriy siydik muhiti urea-parchalovchi bakteriyalar (Proteus) bilan bog'liq struvit toshlari uchun qulay sharoit yaratadi.",
      },
    ],
  },
  {
    slug: 'utt-asosiy-tekshiruv',
    sarlavha: "UTT (ultratovush) — urologiyada asosiy tekshiruv usuli",
    kategoriya: 'Kirish va semiotika',
    bosqich: 'oson',
    qisqa: "Urologiyada UTT nima uchun birinchi tanlovdagi tekshiruv usuli hisoblanadi.",
    daqiqa: 4,
    amaliySavolSoni: 15,
    bolimlar: [
      {
        sarlavha: '1. UTT nima uchun muhim?',
        matn: [
          "Ultratovush tekshiruvi (UTT) — radiatsiyasiz, arzon va keng tarqalgan tasviriy diagnostika usuli, shu sababli urologiyada ko'pchilik holatlarda birinchi qatorda qo'llaniladi. U buyrak hajmi va tuzilishini, siydik to'planishi (gidronefroz) borligini, qovuqdagi qoldiq siydik miqdorini, prostata hajmini va moyak/uruğ tizimchasi patologiyalarini (Doppler rejimida qon oqimini) baholash imkonini beradi.",
          "UTT cheklovlari ham bor: kichik toshlarni, ayniqsa siydik yo'lining pastki qismidagi toshlarni har doim ham aniqlay olmaydi, va natija ko'p jihatdan tekshiruvchi shifokorning tajribasiga bog'liq (operator-dependent usul). Shu sabab shubhali holatlarda KT yoki MRT bilan qo'shimcha tasdiqlash talab qilinadi.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines — Tasviriy diagnostika', 'Campbell-Walsh Urology, 12th ed. — Imaging bobi'],
    test: [
      {
        savol: 'UTT urologiyada birinchi tanlov bo\'lishining asosiy sababi nima?',
        variantlar: ['Eng aniq usul bo\'lgani uchun', "Radiatsiyasiz, arzon va keng tarqalganligi uchun", "Faqat shoshilinch holatlarda ishlatiladi", 'Faqat bolalarda qo\'llaniladi'],
        togri: 1,
        izoh: "UTT radiatsiya bermaydi, arzon va deyarli har qayerda mavjud, shu sababli birinchi qatordagi tekshiruv hisoblanadi.",
      },
      {
        savol: 'UTT yordamida nimalarni baholash mumkin emas to\'g\'ridan-to\'g\'ri ishonchli?',
        variantlar: ['Buyrak hajmini', 'Gidronefrozni', 'Prostata hajmini', 'Siydik yo\'lining pastki qismidagi kichik toshlarni har doim'],
        togri: 3,
        izoh: "UTT kichik, ayniqsa pastki siydik yo'lidagi toshlarni har doim aniqlay olmaydi, bunday holatlarda KT ko'proq ishonchli.",
      },
      {
        savol: 'UTT natijasi nimaga ko\'proq bog\'liq bo\'lishi tufayli "operator-dependent" deyiladi?',
        variantlar: ['Qurilma narxiga', "Tekshiruvchi shifokorning tajribasiga", 'Bemorning yoshiga', 'Kun vaqtiga'],
        togri: 1,
        izoh: "UTT natijasi sezilarli darajada tekshiruvni o'tkazayotgan shifokorning malakasi va tajribasiga bog'liq.",
      },
    ],
  },

  // II. Anatomiya va fiziologiya (umumiy)
  {
    slug: 'buyrak-siydik-yollari-anatomiyasi',
    sarlavha: "Buyrak va siydik yo'llarining umumiy anatomiyasi",
    kategoriya: 'Anatomiya va fiziologiya',
    amaliySavolSoni: 15,
    bosqich: 'oson',
    qisqa: "Buyrak, siydik naychalari va ularning asosiy vazifalari haqida umumiy tushuncha.",
    daqiqa: 5,
    bolimlar: [
      {
        sarlavha: '1. Asosiy tuzilish',
        matn: [
          "Inson ikkita buyrakka ega, ular qorin orti bo'shlig'ida (retroperitoneal), umurtqa pog'onasining ikki tomonida joylashgan. Buyrakning asosiy funksional birligi nefron bo'lib, har bir buyrakda taxminan 1 million nefron bor; ular qonni filtrlab siydik hosil qiladi va suv-tuz muvozanatini, qon bosimini, qonning kislota-ishqor balansini boshqarishda ishtirok etadi.",
          "Buyrakda hosil bo'lgan siydik siydik naychalari (uretrlar) orqali qovuqga oqib tushadi. Har bir siydik naychasi peristaltik (to'lqinsimon) qisqarishlar yordamida siydikni faol harakatga keltiradi — bu sof gravitatsiyaga emas, aktiv mushak qisqarishiga asoslangan jarayon.",
        ],
      },
    ],
    manbalar: ['Gray\'s Anatomy for Students', 'Campbell-Walsh Urology, 12th ed. — Anatomiya bobi'],
    test: [
      {
        savol: 'Buyrakning asosiy funksional birligi nima deb ataladi?',
        variantlar: ['Glomerula', 'Nefron', 'Kortikal birlik', 'Pelvis'],
        togri: 1,
        izoh: "Nefron — buyrakning qon filtratsiyasi va siydik hosil qilishni amalga oshiruvchi asosiy funksional birligi.",
      },
      {
        savol: 'Siydik buyrakdan qovuqgacha qanday harakatlanadi?',
        variantlar: ['Faqat gravitatsiya tufayli', "Siydik naychalarining peristaltik qisqarishi orqali", "Qovuqning so'rib olishi orqali", 'U umuman harakat qilmaydi'],
        togri: 1,
        izoh: "Siydik naychalari to'lqinsimon (peristaltik) mushak qisqarishlari orqali siydikni faol ravishda qovuq tomon harakatlantiradi.",
      },
      {
        savol: 'Buyraklar tananing qaysi qismida joylashgan?',
        variantlar: ["Ko'krak qafasi ichida", "Qorin orti bo'shlig'ida (retroperitoneal)", "Kichik chanoqda", 'Qorin bo\'shlig\'i ichida (intraperitoneal)'],
        togri: 1,
        izoh: "Buyraklar qorin pardasi orqasida, retroperitoneal joyda, umurtqa pog'onasining ikki tomonida joylashgan.",
      },
    ],
  },
  {
    slug: 'qovuq-uretra-tuzilishi',
    sarlavha: "Siydik pufagi va uretra — tuzilishi va vazifasi",
    kategoriya: 'Anatomiya va fiziologiya',
    bosqich: 'oson',
    qisqa: "Qovuq va uretraning asosiy vazifalari va erkak-ayol uretrasi orasidagi farq.",
    daqiqa: 4,
    amaliySavolSoni: 15,
    bolimlar: [
      {
        sarlavha: '1. Qovuq va uretra',
        matn: [
          "Siydik pufagi (qovuq) — siydikni vaqtincha to'plab turuvchi, mushak devoriga (detruzor mushagi) ega rezervuar a'zo. Qovuq bo'shashganda siydik to'planadi, qisqarganda esa siydik chiqarish (mikturatsiya) sodir bo'ladi — bu jarayon markaziy va periferik nerv tizimi tomonidan boshqariladi.",
          "Uretra — qovuqdan tashqariga siydik chiqaruvchi naycha. Erkak uretrasi (taxminan 18-20 sm) ancha uzun bo'lib, prostata orqali o'tadi, ayol uretrasi esa qisqaroq (taxminan 4 sm) — shu sababli ayollarda siydik yo'li infeksiyalari ancha tez-tez uchraydi, chunki bakteriyalar qovuqgacha qisqa masofani osonroq bosib o'tadi.",
        ],
      },
    ],
    manbalar: ["Gray's Anatomy for Students", 'Campbell-Walsh Urology, 12th ed.'],
    test: [
      {
        savol: 'Qovuqning siydikni chiqarish uchun qisqaruvchi asosiy mushagi qanday nomlanadi?',
        variantlar: ['Sfinkter', 'Detruzor', 'Levator', 'Kremaster'],
        togri: 1,
        izoh: "Detruzor mushagi qovuq devorida joylashgan va qisqarganda siydik chiqarishni ta'minlaydi.",
      },
      {
        savol: 'Ayollarda siydik yo\'li infeksiyasi erkaklarga nisbatan nima uchun tez-tez uchraydi?',
        variantlar: ["Ayol uretrasi ancha qisqa bo'lgani uchun", "Ayollarda prostata yo'qligi uchun", 'Ayollarda buyrak kichikroq', 'Bu noto\'g\'ri ma\'lumot'],
        togri: 0,
        izoh: "Ayol uretrasi ancha qisqa (~4 sm) bo'lgani uchun bakteriyalar qovuqgacha tezroq yetib boradi.",
      },
      {
        savol: 'Erkak uretrasi qaysi a\'zo orqali o\'tadi?',
        variantlar: ['Moyak', 'Prostata', 'Buyrak', 'Siydik naychasi'],
        togri: 1,
        izoh: "Erkak uretrasi prostata bezi ichidan o'tadi, shu sabab BPH kabi prostata kattalashishi uretrani siqib siyishni qiyinlashtirishi mumkin.",
      },
    ],
  },
  {
    slug: 'erkak-jinsiy-azolari-tuzilishi',
    sarlavha: "Erkak jinsiy a'zolari — umumiy tuzilishi (prostata, moyak, urug' pufakchasi)",
    kategoriya: 'Anatomiya va fiziologiya',
    bosqich: 'oson',
    qisqa: "Erkak reproduktiv a'zolarining asosiy tuzilishi va vazifalari.",
    daqiqa: 5,
    amaliySavolSoni: 15,
    bolimlar: [
      {
        sarlavha: '1. Asosiy a\'zolar',
        matn: [
          "Moyaklar (testislar) — yorg'oqda joylashgan, ikkita asosiy vazifani bajaradigan a'zo: spermatozoidlar ishlab chiqish (spermatogenez) va testosteron gormonini ishlab chiqarish. Moyaklarning tanadan tashqarida, yorg'oqda joylashishi sababi — spermatogenez uchun tana haroratidan 2-4°C past harorat talab qilinishi.",
          "Urug' pufakchalari prostata orqasida joylashgan va sperma suyuqligining katta qismini (fruktoza va boshqa moddalar bilan boyitilgan) ishlab chiqaradi. Prostata bezi qovuq tagida, uretrani o'rab turgan holda joylashgan — u ham sperma suyuqligiga qo'shimcha komponent (prostata sekretsiyasi, sperma harakatchanligini qo'llab-quvvatlovchi fermentlar) ishlab chiqaradi.",
        ],
      },
    ],
    manbalar: ["Gray's Anatomy for Students", 'Campbell-Walsh Urology, 12th ed. — Erkak reproduktiv anatomiya'],
    test: [
      {
        savol: 'Moyaklar nima uchun yorg\'oqda, tanadan tashqarida joylashgan?',
        variantlar: ['Bu shunchaki tasodif', "Spermatogenez uchun pastroq harorat talab qilinadi", "Bu testosteron ishlab chiqarishni kamaytiradi", 'Faqat estetik sabab'],
        togri: 1,
        izoh: "Spermatogenez uchun tana haroratidan 2-4°C past harorat zarur, shu sababli moyaklar yorg'oqda joylashgan.",
      },
      {
        savol: 'Urug\' pufakchalari qayerda joylashgan?',
        variantlar: ["Moyak ichida", 'Prostata orqasida', "Qovuq ichida", 'Buyrakda'],
        togri: 1,
        izoh: "Urug' pufakchalari prostata orqasida joylashgan va sperma suyuqligining katta qismini ishlab chiqaradi.",
      },
      {
        savol: 'Moyaklarning ikkita asosiy vazifasi qaysilar?',
        variantlar: ['Siydik filtratsiyasi va saqlash', 'Spermatogenez va testosteron ishlab chiqarish', "Sperma harakatini ta'minlash va qon filtratsiyasi", 'Faqat gormon saqlash'],
        togri: 1,
        izoh: "Moyaklar spermatozoidlar ishlab chiqarish (spermatogenez) va testosteron gormonini ishlab chiqarish bilan shug'ullanadi.",
      },
    ],
  },
  {
    slug: 'siydik-tanosil-tugma-anomaliyalar',
    sarlavha: "Siydik-tanosil a'zolarining tug'ma anomaliyalari haqida umumiy tushuncha",
    kategoriya: 'Anatomiya va fiziologiya',
    bosqich: 'oson',
    qisqa: "Eng ko'p uchraydigan tug'ma siydik-tanosil anomaliyalari haqida umumiy ma'lumot.",
    daqiqa: 4,
    amaliySavolSoni: 15,
    bolimlar: [
      {
        sarlavha: '1. Umumiy tushuncha',
        matn: [
          "Siydik-tanosil tizimi embrional rivojlanish davomida murakkab jarayonlardan o'tadi, shu sabab bu tizimda tug'ma anomaliyalar nisbatan ko'p uchraydi. Eng ko'p uchraydiganlari: kriptorxizm (moyakning yorg'oqqa tushmasligi), gipospadiya (uretra teshigining noto'g'ri, pastroq joyda ochilishi), buyrakning duplikatsiyasi yoki agenezi (rivojlanmasligi) va vezikoureteral reflyuks (siydikning qovuqdan buyrakka qarab teskari oqishi).",
          "Bu anomaliyalarning ko'pchiligi homiladorlik davridagi UTT skriningida yoki tug'ilgandan keyingi birinchi tekshiruvlarda aniqlanadi. Erta aniqlash va kuzatuv muhim, chunki ba'zilari (masalan, davolanmagan vezikoureteral reflyuks) buyrak funksiyasiga uzoq muddatli zarar yetkazishi mumkin.",
        ],
      },
    ],
    manbalar: ['EAU/ESPU Guidelines on Paediatric Urology', 'Campbell-Walsh Urology, 12th ed. — Pediatrik urologiya bobi'],
    test: [
      {
        savol: 'Kriptorxizm nima?',
        variantlar: ["Uretra teshigining noto'g'ri joyda ochilishi", "Moyakning yorg'oqqa tushmasligi", "Buyrakning ikkilanishi", 'Qovuq devorining yupqalashishi'],
        togri: 1,
        izoh: "Kriptorxizm — bir yoki ikki moyakning yorg'oqqa to'liq tushmasligi holati.",
      },
      {
        savol: 'Gipospadiya nimani bildiradi?',
        variantlar: ["Moyakning tushmasligini", 'Uretra teshigining odatdagidan pastroq joyda ochilishini', 'Buyrak yetishmovchiligini', 'Qovuq kattalashishini'],
        togri: 1,
        izoh: "Gipospadiya — uretra tashqi teshigining penis uchida emas, pastroq qismida ochiladigan tug'ma anomaliya.",
      },
      {
        savol: 'Vezikoureteral reflyuks nimani anglatadi?',
        variantlar: ['Siydikning buyrakdan qovuqga normal oqishini', 'Siydikning qovuqdan buyrakka teskari oqishini', "Moyakning burilishini", "Prostata kattalashishini"],
        togri: 1,
        izoh: "Vezikoureteral reflyuks — siydikning normal yo'nalishga qarama-qarshi, qovuqdan buyrak tomon teskari oqishi, davolanmasa buyrak funksiyasiga zarar yetkazishi mumkin.",
      },
    ],
  },

  // III. Yallig'lanish kasalliklari
  {
    slug: 'sistit-asoslari',
    sarlavha: "Sistit (siydik pufagi yallig'lanishi) — asosiy belgilar va davolash",
    kategoriya: "Yallig'lanish kasalliklari",
    bosqich: 'oson',
    amaliySavolSoni: 15,
    qisqa: "Sistitning asosiy belgilari, sabablari va birinchi qatordagi davolash yondashuvi.",
    daqiqa: 5,
    bolimlar: [
      {
        sarlavha: '1. Belgilari va sababi',
        matn: [
          "Sistit — siydik pufagining ko'pincha bakterial infeksiya (eng ko'p E. coli) tufayli kelib chiqadigan yallig'lanishi. Asosiy belgilar: tez-tez siyish ehtiyoji, dizuriya (siyishda og'riq/yonish), kichik chanoq sohasidagi noqulaylik va ba'zan siydikning loyqalanishi yoki yoqimsiz hidi. Yuqori harorat odatda bo'lmaydi — agar harorat ko'tarilsa, bu infeksiya yuqoriga (buyrakka) tarqalganidan dalolat berishi mumkin.",
          "Sistit ayollarda qisqa uretra tufayli ancha ko'p uchraydi. Tashxis odatda klinik belgilar va umumiy siydik tahlili (leykotsituriya, ba'zan bakteriuriya) asosida qo'yiladi. Asoratsiz sistit qisqa muddatli (3-5 kunlik) antibiotikoterapiya bilan davolanadi.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines on Urological Infections', 'IDSA Guidelines for UTI'],
    test: [
      {
        savol: 'Sistitning eng ko\'p uchraydigan qo\'zg\'atuvchisi qaysi?',
        variantlar: ['Stafilokokk', 'E. coli', 'Streptokokk', 'Klebsiella (kamroq, lekin E.coli birinchi o\'rinda)'],
        togri: 1,
        izoh: "E. coli sistitning eng ko'p uchraydigan qo'zg'atuvchisi hisoblanadi.",
      },
      {
        savol: 'Sistitda yuqori harorat (isitma) bo\'lishi nimadan dalolat berishi mumkin?',
        variantlar: ["Bu sistitning oddiy belgisi", "Infeksiya buyrakka tarqalganidan", 'Bu allergik reaksiya', "Hech nimadan, e'tibor berilmasligi mumkin"],
        togri: 1,
        izoh: "Oddiy asoratsiz sistitda yuqori harorat bo'lmaydi — uning paydo bo'lishi infeksiya yuqori siydik yo'llariga (pielonefrit) tarqalganini ko'rsatishi mumkin.",
      },
      {
        savol: 'Asoratsiz sistit uchun odatdagi antibiotikoterapiya davomiyligi qancha?',
        variantlar: ['1 kun', '3-5 kun', '4-6 hafta', '6 oy'],
        togri: 1,
        izoh: "Asoratsiz, oddiy sistit qisqa muddatli (odatda 3-5 kunlik) antibiotikoterapiya bilan muvaffaqiyatli davolanadi.",
      },
    ],
  },
  {
    slug: 'pielonefrit-asoslari',
    sarlavha: 'Pielonefrit — asosiy belgilar va davolash',
    kategoriya: "Yallig'lanish kasalliklari",
    bosqich: 'oson',
    amaliySavolSoni: 15,
    qisqa: "Pielonefritning sistitdan farqi, belgilari va davolash yondashuvi.",
    daqiqa: 5,
    bolimlar: [
      {
        sarlavha: '1. Belgilari va davolash',
        matn: [
          "Pielonefrit — buyrak to'qimasi va kosachasining bakterial infeksiyasi, ko'pincha pastki siydik yo'li infeksiyasining yuqoriga tarqalishi natijasida kelib chiqadi. Sistitdan farqli, pielonefritda yuqori harorat (isitma), titroq, bel/yon qorin og'rig'i va umumiy holatning yomonlashishi (ko'ngil aynishi, qusish) kuzatiladi.",
          "Tashxis klinik belgilar, umumiy siydik tahlili (leykotsituriya, bakteriuriya) va siydik ekmasi (qaysi bakteriya va qaysi antibiotikka sezgir ekanini aniqlash uchun) asosida qo'yiladi. Asoratsiz pielonefrit odatda og'izdan ichiladigan antibiotik bilan 7-14 kun davomida davolanadi, og'ir holatlarda (yuqori isitma, qusish, septik holat xavfi) stasionarda venaga yuboriladigan antibiotik talab qilinadi.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines on Urological Infections', 'IDSA Guidelines for Pyelonephritis'],
    test: [
      {
        savol: 'Pielonefritni sistitdan farqlovchi asosiy belgi qaysi?',
        variantlar: ['Tez-tez siyish', 'Yuqori harorat va bel/yon qorin og\'rig\'i', "Siydik rangi o'zgarishi", "Siyishda yengil noqulaylik"],
        togri: 1,
        izoh: "Pielonefritda yuqori harorat, titroq va bel/yon qorin og'rig'i kuzatiladi — bular oddiy sistitda odatda bo'lmaydi.",
      },
      {
        savol: 'Pielonefrit tashxisida qo\'shimcha ravishda nima qilish maqsadga muvofiq?',
        variantlar: ['Faqat umumiy qon tahlili', 'Siydik ekmasi (antibiotikka sezgirlikni aniqlash uchun)', 'Faqat rentgen', "Hech qanday qo'shimcha tahlil kerak emas"],
        togri: 1,
        izoh: "Siydik ekmasi qaysi bakteriya sabab bo'lganini va qaysi antibiotikka sezgir ekanini aniqlashtirib, to'g'ri davolashni tanlashga yordam beradi.",
      },
      {
        savol: 'Og\'ir pielonefrit (yuqori isitma, qusish, septik xavf) qanday davolanadi?',
        variantlar: ['Faqat uyda kuzatuv', "Stasionarda venaga yuboriladigan antibiotik bilan", 'Faqat og\'riqsizlantiruvchi bilan', 'Darhol jarrohlik bilan'],
        togri: 1,
        izoh: "Og'ir holatlarda bemorni stasionarga yotqizib venaga yuboriladigan (intravenoz) antibiotikoterapiya boshlash zarur.",
      },
    ],
  },
  {
    slug: 'uretrit-asoslari',
    sarlavha: "Uretrit (gonokokkli va nogonokokkli) — umumiy tushuncha",
    kategoriya: "Yallig'lanish kasalliklari",
    amaliySavolSoni: 15,
    bosqich: 'oson',
    qisqa: "Uretritning ikki asosiy turi va ularning klinik farqlari.",
    daqiqa: 4,
    bolimlar: [
      {
        sarlavha: '1. Turlari va farqlari',
        matn: [
          "Uretrit — uretra (siydik chiqarish naychasi)ning yallig'lanishi, asosan jinsiy yo'l bilan yuqadigan infeksiya natijasida kelib chiqadi. Ikki asosiy turga bo'linadi: gonokokkli uretrit (Neisseria gonorrhoeae qo'zg'atadi, odatda yorqin sariq-yashil, ko'p ajralma va kuchli dizuriya bilan kechadi) va nogonokokkli uretrit (eng ko'p Chlamydia trachomatis qo'zg'atadi, belgilari yengilroq yoki simptomsiz kechishi mumkin).",
          "Ikki turini farqlash uchun uretral surtma yoki siydik namunasida PCR (molekulyar) tahlil qo'llaniladi. Davolash qo'zg'atuvchiga qarab tanlanadi (gonokokkli uretrit uchun seftriakson, xlamidial uretrit uchun azitromisin yoki doksiklin), va jinsiy hamrohni ham bir vaqtda davolash qaytalanishning oldini olish uchun muhim.",
        ],
      },
    ],
    manbalar: ['CDC STI Treatment Guidelines', 'EAU Guidelines on Urological Infections'],
    test: [
      {
        savol: 'Gonokokkli uretritni qaysi qo\'zg\'atuvchi keltirib chiqaradi?',
        variantlar: ['Chlamydia trachomatis', 'Neisseria gonorrhoeae', 'E. coli', 'Candida'],
        togri: 1,
        izoh: "Gonokokkli uretrit Neisseria gonorrhoeae bakteriyasi tomonidan qo'zg'atiladi.",
      },
      {
        savol: 'Nogonokokkli uretritning eng ko\'p uchraydigan qo\'zg\'atuvchisi qaysi?',
        variantlar: ['Neisseria gonorrhoeae', 'Chlamydia trachomatis', 'Staphylococcus aureus', 'Proteus mirabilis'],
        togri: 1,
        izoh: "Chlamydia trachomatis nogonokokkli uretritning eng ko'p tarqalgan sababi hisoblanadi.",
      },
      {
        savol: 'Uretrit davolashda jinsiy hamrohni ham davolash nima uchun muhim?',
        variantlar: ["Bu shart emas", "Qaytalanishning oldini olish uchun", 'Faqat qonun talabi', 'Hech qanday ahamiyati yo\'q'],
        togri: 1,
        izoh: "Jinsiy yo'l bilan yuqadigan infeksiyalarda hamrohni ham davolamasdan, qayta yuqish (re-infeksiya) xavfi yuqori bo'ladi.",
      },
    ],
  },
  {
    slug: 'prostatit-umumiy-tasniflash',
    sarlavha: "Prostatit — umumiy tasniflash va belgilar",
    kategoriya: "Yallig'lanish kasalliklari",
    bosqich: 'oson',
    amaliySavolSoni: 15,
    qisqa: "Prostatitning to'rt asosiy turi haqida umumiy, kirish darajasidagi tushuncha.",
    daqiqa: 4,
    bolimlar: [
      {
        sarlavha: '1. Umumiy tasniflash',
        matn: [
          "Prostatit — prostata bezining yallig'lanishi, va u bir xil kasallik emas, balki to'rt xil klinik holatni o'z ichiga oladi: o'tkir bakterial prostatit (kuchli infeksiya, yuqori harorat bilan kechadi), surunkali bakterial prostatit (qaytalanuvchi infeksiya), surunkali prostatit/kichik chanoq og'rig'i sindromi (eng ko'p uchraydigan tur, bakteriya aniqlanmaydi) va asimptomatik yallig'lanuvchi prostatit (simptomsiz, tasodifan aniqlanadi).",
          "O'tkir bakterial prostatit shoshilinch e'tibor talab qiladi: yuqori harorat, titroq, kichik chanoq og'rig'i va siyish qiyinlashishi bilan namoyon bo'ladi, antibiotikoterapiya kechiktirilmasligi kerak. Boshqa turlari ko'pincha asta-sekin rivojlanadi va surunkali kechadi.",
        ],
      },
    ],
    manbalar: ['NIH Chronic Prostatitis Classification', 'EAU Guidelines on Urological Infections'],
    test: [
      {
        savol: 'Prostatitning necha asosiy turi mavjud?',
        variantlar: ['Ikki', 'Uch', "To'rt", 'Olti'],
        togri: 2,
        izoh: "NIH tasnifi bo'yicha prostatitning to'rt asosiy turi mavjud: o'tkir bakterial, surunkali bakterial, surunkali/CPPS va asimptomatik yallig'lanuvchi.",
      },
      {
        savol: 'Qaysi prostatit turi shoshilinch e\'tibor talab qiladi?',
        variantlar: ["Asimptomatik yallig'lanuvchi", "O'tkir bakterial prostatit", 'Surunkali CPPS', 'Hech biri'],
        togri: 1,
        izoh: "O'tkir bakterial prostatit yuqori harorat va og'ir umumiy holat bilan kechadi, darhol antibiotikoterapiya talab qiladi.",
      },
      {
        savol: 'Prostatitning eng ko\'p uchraydigan turi qaysi?',
        variantlar: ["O'tkir bakterial", 'Surunkali bakterial', "Surunkali prostatit/kichik chanoq og'rig'i sindromi (CPPS)", 'Asimptomatik yallig\'lanuvchi'],
        togri: 2,
        izoh: "CPPS (III tur) prostatit hollarining katta qismini tashkil qiladi va bunda bakteriya aniqlanmaydi.",
      },
    ],
  },
  {
    slug: 'orxoepididimit-asoslari',
    sarlavha: "Orxoepididimit (moyak-quyma yallig'lanishi) — asosiy belgilar",
    kategoriya: "Yallig'lanish kasalliklari",
    amaliySavolSoni: 15,
    bosqich: 'oson',
    qisqa: "Orxoepididimitning sabablari, belgilari va torsiyadan farqlash zarurati.",
    daqiqa: 4,
    bolimlar: [
      {
        sarlavha: '1. Sabab va belgilar',
        matn: [
          "Orxoepididimit — moyak (orxit) va quyma (epididimit) ning birgalikdagi yallig'lanishi, ko'pincha quymadan boshlanib moyakka tarqaladi. Yosh, jinsiy faol erkaklarda sabab ko'pincha jinsiy yo'l bilan yuqadigan infeksiyalar (xlamidiya, gonokokk), katta yoshdagi erkaklarda esa ko'pincha siydik yo'li infeksiyasi bilan bog'liq bakteriyalar (E. coli) bo'ladi.",
          "Asosiy belgilar: yorg'oqda asta-sekin kuchayuvchi og'riq va shish, terining qizarishi, ba'zan yuqori harorat. Bu juda muhim — orxoepididimitni o'tkir moyak burilishi (torsiya)dan farqlash zarur, chunki torsiya bir necha soat ichida jarrohlik aralashuvni talab qiladigan shoshilinch holat, orxoepididimit esa asta-sekin rivojlanadi va antibiotik bilan davolanadi.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines on Urological Infections', 'CDC STI Treatment Guidelines'],
    test: [
      {
        savol: 'Yosh, jinsiy faol erkaklarda orxoepididimitning ko\'p uchraydigan sababi qaysi?',
        variantlar: ['E. coli', "Jinsiy yo'l bilan yuqadigan infeksiyalar (xlamidiya, gonokokk)", "Buyrak toshi", "Diabet"],
        togri: 1,
        izoh: "Yosh, jinsiy faol erkaklarda orxoepididimit ko'pincha jinsiy yo'l bilan yuqadigan infeksiyalar tufayli kelib chiqadi.",
      },
      {
        savol: 'Orxoepididimitni qaysi shoshilinch holatdan farqlash juda muhim?',
        variantlar: ["Pielonefritdan", "O'tkir moyak burilishi (torsiya)dan", 'Sistitdan', "BPH'dan"],
        togri: 1,
        izoh: "Torsiya soatlar ichida jarrohlikni talab qiladigan shoshilinch holat, shu sabab uni orxoepididimitdan to'g'ri farqlash juda muhim.",
      },
      {
        savol: 'Orxoepididimitda og\'riqning rivojlanish xarakteri qanday?',
        variantlar: ["To'satdan, soniyalar ichida boshlanadi", "Asta-sekin, soatlar-kunlar davomida kuchayadi", "Hech qachon og'riq bo'lmaydi", "Faqat tunda paydo bo'ladi"],
        togri: 1,
        izoh: "Orxoepididimitda og'riq odatda asta-sekin kuchayib boradi — bu torsiyaning to'satdan boshlanishidan farqli xususiyat.",
      },
    ],
  },

  // IV. Buyrak va siydik yo'llari kasalliklari
  {
    slug: 'siydik-tosh-kasalligi-asoslari',
    sarlavha: 'Siydik tosh kasalligi — asosiy tushunchalar va klinika',
    kategoriya: "Buyrak va siydik yo'llari",
    amaliySavolSoni: 15,
    bosqich: 'oson',
    qisqa: "Siydik toshlari nima uchun hosil bo'ladi va asosiy klinik ko'rinishi qanday.",
    daqiqa: 5,
    bolimlar: [
      {
        sarlavha: '1. Asosiy tushunchalar',
        matn: [
          "Siydik tosh kasalligi (urolitiaz) — buyrak yoki siydik yo'llarida mineral va tuz cho'kindilaridan tosh hosil bo'lishi. Bunga moyillik tug'diruvchi asosiy omillar: yetarli suyuqlik iste'mol qilmaslik, ovqatlanish xususiyatlari (yuqori tuz/oqsil), metabolik buzilishlar va oilaviy moyillik. Eng ko'p uchraydigan tosh turi — kalsiy oksalat.",
          "Klassik klinik ko'rinish — renal kolika: to'satdan boshlangan, juda kuchli, to'lqinsimon bel/yon qorin og'rig'i, ko'ngil aynishi bilan birga, bemor tinch joy topa olmaydi. Kichik toshlar (taxminan 5-6 mm gacha) ko'pincha o'z-o'zidan chiqib ketishi mumkin, katta toshlar esa maxsus davolashni talab qiladi.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines on Urolithiasis', 'Campbell-Walsh Urology, 12th ed.'],
    test: [
      {
        savol: 'Siydik toshlarining eng ko\'p uchraydigan turi qaysi?',
        variantlar: ['Struvit', 'Sistin', 'Kalsiy oksalat', 'Siydik kislotasi'],
        togri: 2,
        izoh: "Kalsiy oksalat toshlari urolitiaz hollarining katta qismini tashkil qiladi.",
      },
      {
        savol: 'Renal kolikaning klassik xususiyati nima?',
        variantlar: ["Bemor harakatsiz yotadi", "To'lqinsimon, juda kuchli bel/yon qorin og'rig'i, bemor tinch joy topa olmaydi", "Og'riq doim past harorat bilan kechadi", "Og'riq faqat tunda bo'ladi"],
        togri: 1,
        izoh: "Renal kolikada bemor doimiy harakatda bo'lib qulay holat topa olmaydi — bu uni boshqa qorin og'riqlaridan ajratuvchi xususiyat.",
      },
      {
        savol: 'Qanday hajmdagi toshlar ko\'pincha o\'z-o\'zidan chiqib ketishi mumkin?',
        variantlar: ['1-2 sm', "5-6 mm gacha", '3-4 sm', "Hajm ahamiyatsiz"],
        togri: 1,
        izoh: "Kichik (taxminan 5-6 mm gacha) toshlar ko'pincha spontan ravishda chiqib ketadi, kattaroqlari maxsus davolashni talab qiladi.",
      },
    ],
  },
  {
    slug: 'gidronefroz-asoslari',
    sarlavha: 'Gidronefroz — nima va nima uchun yuzaga keladi',
    kategoriya: "Buyrak va siydik yo'llari",
    bosqich: 'oson',
    qisqa: "Gidronefrozning sabablari va nima uchun u xavfli bo'lishi mumkinligi.",
    daqiqa: 20,
    nazariyaIframe: '/nazariyalar/gidronefroz-asoslari.html',
    bolimlar: [
      {
        sarlavha: '1. Sabablari va ahamiyati',
        matn: [
          "Gidronefroz — siydik oqimining biror joyda to'siq (obstruksiya) tufayli to'xtab qolishi natijasida buyrak kosachalarining kengayishi (siydik bilan to'lib-toshishi). Sabablari turlicha bo'lishi mumkin: siydik toshi, siydik yo'lining tug'ma torayishi, prostata kattalashishi (BPH) tufayli siydik chiqishining qiyinlashishi, yoki o'sma siydik yo'lini siqib qo'yishi.",
          "Gidronefroz o'zi alohida kasallik emas, balki boshqa muammoning natijasi (belgisi) hisoblanadi. Agar to'siq uzoq vaqt davomida bartaraf etilmasa, buyrak to'qimasiga doimiy zarar yetishi va buyrak funksiyasi pasayishi mumkin — shu sabab sababini aniqlash va vaqtida bartaraf etish muhim.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines on Urolithiasis', 'Campbell-Walsh Urology, 12th ed.'],
    test: [
      {
        savol: 'Gidronefroz nima?',
        variantlar: ["Buyrak to'qimasining saraton kasalligi", "Siydik oqimi to'sig'i tufayli buyrak kosachalarining kengayishi", 'Qovuq yallig\'lanishi', 'Prostata kattalashishi'],
        togri: 1,
        izoh: "Gidronefroz siydik oqimidagi to'siq natijasida buyrak kosachalarining siydik bilan to'lib kengayishi holati.",
      },
      {
        savol: 'Gidronefroz mustaqil kasallikmi yoki boshqa muammoning natijasimi?',
        variantlar: ['Mustaqil kasallik', 'Boshqa muammo (to\'siq)ning natijasi/belgisi', "Faqat irsiy holat", "Faqat infeksiya natijasi"],
        togri: 1,
        izoh: "Gidronefroz alohida kasallik emas, balki siydik oqimini to'sib qo'yuvchi boshqa sabab (tosh, BPH, o'sma)ning natijasi hisoblanadi.",
      },
      {
        savol: 'Davolanmagan, uzoq davom etgan gidronefroz nimaga olib kelishi mumkin?',
        variantlar: ['Hech qanday oqibatga', "Buyrak to'qimasiga zarar va funksiya pasayishiga", "Faqat vaqtinchalik noqulaylikka", "Faqat tashqi ko'rinish o'zgarishiga"],
        togri: 1,
        izoh: "Uzoq davom etgan to'siq buyrak to'qimasiga bosim o'tkazib, doimiy shikastlanish va funksiya pasayishiga olib kelishi mumkin.",
      },
    ],
  },
  {
    slug: 'siydik-tutolmaslik-turlari',
    sarlavha: 'Siydik tutolmaslik — asosiy turlari',
    kategoriya: "Buyrak va siydik yo'llari",
    bosqich: 'oson',
    qisqa: "Siydik tutolmaslikning asosiy turlari va ularning sabablari.",
    daqiqa: 20,
    nazariyaIframe: '/nazariyalar/siydik-tutolmaslik-turlari.html',
    bolimlar: [
      {
        sarlavha: '1. Asosiy turlari',
        matn: [
          "Siydik tutolmaslik — siydikni mustaqil nazorat qila olmaslik holati, va u bir xil emas, bir necha turga bo'linadi. Stress tipi tutolmaslik — kuchanish, yo'tal, kulish, og'irlik ko'tarish kabi qorin ichi bosimi oshganda siydikning ozgina chiqib ketishi (ko'pincha tug'ruq qilgan ayollarda tos tubi mushaklari zaiflashganda uchraydi).",
          "Urgent (shoshilinch) tipi tutolmaslik — to'satdan, kuchli siyish ehtiyoji paydo bo'lib, tuvaletga yetib bormay siydik chiqib ketishi (qovuq giperfaolligi bilan bog'liq). Aralash tipi — ikkisining kombinatsiyasi. Toshib chiqish (overflow) tipi tutolmaslik esa qovuq to'liq bo'shamasligi natijasida (masalan, BPH tufayli) siydikning tomchilab chiqishi bilan kechadi.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines on Urinary Incontinence', 'Campbell-Walsh Urology, 12th ed.'],
    test: [
      {
        savol: 'Stress tipi siydik tutolmaslik qachon yuzaga keladi?',
        variantlar: ["Tinch holatda, sababsiz", "Kuchanish, yo'tal yoki kulish vaqtida", "Faqat tunda", "Faqat infeksiya paytida"],
        togri: 1,
        izoh: "Stress tipi tutolmaslikda qorin ichi bosimi oshganda (yo'tal, kuchanish, kulish) siydik ozgina chiqib ketadi.",
      },
      {
        savol: 'Urgent tipi siydik tutolmaslik nima bilan bog\'liq?',
        variantlar: ['Tos tubi mushaklari zaifligi bilan', "Qovuq giperfaolligi bilan", 'Buyrak toshi bilan', 'Prostata saratoni bilan'],
        togri: 1,
        izoh: "Urgent tipi tutolmaslik qovuqning giperfaol (haddan tashqari faol) qisqarishi natijasida to'satdan kuchli siyish ehtiyoji bilan kechadi.",
      },
      {
        savol: 'Toshib chiqish (overflow) tipi tutolmaslik odatda nima sababli yuzaga keladi?',
        variantlar: ["Qovuqning to'liq bo'shamasligi (masalan, BPH tufayli)", "Faqat yosh omili", "Faqat ayollarda uchraydi", "Faqat infeksiya tufayli"],
        togri: 0,
        izoh: "Overflow tipi tutolmaslik qovuq to'liq bo'shamay, doimo to'lib turishi (masalan, BPH siydik chiqishini to'sganda) natijasida siydikning tomchilab chiqishi bilan bog'liq.",
      },
    ],
  },

  // V. Prostata va erkak jinsiy a'zolari
  {
    slug: 'prostata-adenomasi-asosiy-belgilar',
    sarlavha: 'Prostata adenomasi (BPH) — asosiy belgilar',
    kategoriya: "Prostata va erkak jinsiy a'zolari",
    bosqich: 'oson',
    bepulNamuna: true,
    qisqa: "BPHning yosh bilan bog'liqligi va asosiy siyish simptomlari haqida kirish darajasidagi tushuncha.",
    daqiqa: 20,
    nazariyaIframe: '/nazariyalar/prostata-adenomasi-asosiy-belgilar.html',
    bolimlar: [
      {
        sarlavha: '1. Asosiy tushuncha',
        matn: [
          "Prostata adenomasi (BPH — benign prostata giperplaziyasi) — prostata bezining saratonsiz (benign) kattalashishi, yosh ulg'aygan erkaklarda juda keng tarqalgan fiziologik jarayon hisoblanadi. Kattalashgan prostata uretrani (siydik chiqarish naychasini) siqib, siyishni qiyinlashtiradi.",
          "Asosiy belgilar ikki guruhga bo'linadi: siyishni boshlashda qiyinlanish, oqim kuchsizligi, to'liq bo'shamaslik hissi (bo'shatish simptomlari) va tez-tez siyish, tungi siyish, to'satdan kuchli siyish ehtiyoji (saqlanish simptomlari). BPH saraton bilan bog'liq emas, ammo simptomlari hayot sifatiga sezilarli ta'sir qilishi mumkin.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines on Non-neurogenic Male LUTS', 'Campbell-Walsh Urology, 12th ed.'],
    test: [
      {
        savol: 'BPH nima?',
        variantlar: ['Prostata saratoni', "Prostataning saratonsiz kattalashishi", "Moyak yallig'lanishi", "Qovuq toshi"],
        togri: 1,
        izoh: "BPH — prostata bezining benign (saratonsiz) kattalashishi, yosh bilan bog'liq tabiiy jarayon.",
      },
      {
        savol: 'BPH siyishga qanday ta\'sir qiladi?',
        variantlar: ["Hech qanday ta'sir qilmaydi", "Uretrani siqib siyishni qiyinlashtiradi", "Siydik hosil bo'lishini to'xtatadi", "Faqat tungi vaqtga ta'sir qiladi"],
        togri: 1,
        izoh: "Kattalashgan prostata uretrani siqib siyish kanalini toraytiradi, bu esa siyishni qiyinlashtiradi.",
      },
      {
        savol: 'BPH saraton bilan bog\'liqmi?',
        variantlar: ["Ha, doimo", "Yo'q, u saratonsiz jarayon", "Faqat yosh erkaklarda bog'liq", "Faqat o'tkir holatda bog'liq"],
        togri: 1,
        izoh: "BPH benign (saratonsiz) jarayon bo'lib, prostata saratoni bilan to'g'ridan-to'g'ri bog'liq emas.",
      },
    ],
  },
  {
    slug: 'fimoz-parafimoz-asoslari',
    sarlavha: "Fimoz va parafimoz — nima va qanday yordam kerak",
    kategoriya: "Prostata va erkak jinsiy a'zolari",
    bosqich: 'oson',
    qisqa: "Fimoz va parafimoz orasidagi farq va parafimozning shoshilinch xususiyati.",
    daqiqa: 20,
    nazariyaIframe: '/nazariyalar/fimoz-parafimoz-asoslari.html',
    bolimlar: [
      {
        sarlavha: '1. Farqi va yordam',
        matn: [
          "Fimoz — qovuq (prepusiy, penis terisi)ning glansdan (penis boshi ustidan) orqaga tortib bo'lmaslik holati. Yosh bolalarda bu fiziologik holat bo'lib, ko'pincha vaqt o'tishi bilan o'z-o'zidan tuzaladi; kattalarda esa surunkali yallig'lanish, infeksiya yoki yara to'qimasi tufayli yuzaga kelishi mumkin va ba'zan davolanishi (krem yoki jarrohlik — sirkumsiziya) talab qilinadi.",
          "Parafimoz — bundan farqli, shoshilinch holat: orqaga tortilgan qovuq terisi qaytarib qo'yilmasligi natijasida glansning qon aylanishi buziladi (qisilib qoladi). Bu shish, og'riq va to'qima nekrozi xavfi bilan kechadi, shu sabab darhol tibbiy yordam (manual qaytarish yoki jarrohlik) talab qiladigan shoshilinch urologik holat hisoblanadi.",
        ],
      },
    ],
    manbalar: ['EAU/ESPU Guidelines on Paediatric Urology', 'Campbell-Walsh Urology, 12th ed.'],
    test: [
      {
        savol: 'Fimoz nima?',
        variantlar: ["Qovuq terisini glansdan orqaga tortib bo'lmaslik", "Orqaga tortilgan terini qaytarib bo'lmaslik", "Moyak shishishi", "Prostata kattalashishi"],
        togri: 0,
        izoh: "Fimoz — penis terisi (prepusiy)ni glans ustidan orqaga tortib bo'lmaslik holati.",
      },
      {
        savol: 'Parafimoz nima uchun shoshilinch holat hisoblanadi?',
        variantlar: ["Chunki u og'riqsiz kechadi", "Glansning qon aylanishi buzilib, to'qima zararlanishi xavfi bor", "Chunki u faqat bolalarda uchraydi", "Chunki u hech qachon davolanmaydi"],
        togri: 1,
        izoh: "Parafimozda qisilib qolgan teri glansning qon aylanishini buzadi, bu shish, og'riq va nekroz (to'qima o'limi) xavfini keltirib chiqaradi.",
      },
      {
        savol: 'Yosh bolalardagi fimoz odatda qanday hal bo\'ladi?',
        variantlar: ["Faqat jarrohlik bilan", "Ko'pincha vaqt o'tishi bilan o'z-o'zidan", "Hech qachon hal bo'lmaydi", "Faqat antibiotik bilan"],
        togri: 1,
        izoh: "Bolalardagi fimoz odatda fiziologik holat bo'lib, yosh o'tishi bilan ko'pincha o'z-o'zidan tuzaladi.",
      },
    ],
  },
  {
    slug: 'varikotsele-gidrotsele-farqi',
    sarlavha: "Varikotsele va gidrotsele — asosiy farqlari",
    kategoriya: "Prostata va erkak jinsiy a'zolari",
    bosqich: 'oson',
    qisqa: "Varikotsele va gidrotsele orasidagi asosiy farqlarni tushunish uchun kirish darajasidagi dars.",
    daqiqa: 20,
    nazariyaIframe: '/nazariyalar/varikotsele-gidrotsele-farqi.html',
    bolimlar: [
      {
        sarlavha: '1. Farqlari',
        matn: [
          "Varikotsele — yorg'oqdagi pampiniform venoz pleksusning patologik kengayishi (venalarning varikoz tarzda kengayishi), ko'pincha chap tomonda uchraydi. U palpatsiyada \"chuvalchang to'plami\" hissini beradi va kuchanganda (Valsalva) yanada bo'rtib chiqadi; uzoq muddatda spermatogenezga salbiy ta'sir qilib, erkak bepushtligiga olib kelishi mumkin.",
          "Gidrotsele — bundan farqli, moyak atrofidagi parda (tunica vaginalis) ichida suyuqlik to'planishi natijasida yuzaga keladi va yumshoq, suyuqlikka o'xshash, yorug'lik o'tkazadigan (transilluminatsiya musbat) shish ko'rinishida bo'ladi. Gidrotsele odatda og'riqsiz va bepushtlik bilan bog'liq emas, lekin katta hajmga yetganda noqulaylik tufayli jarrohlik talab qilinishi mumkin.",
        ],
      },
    ],
    manbalar: ['EAU Guidelines on Sexual and Reproductive Health', 'Campbell-Walsh Urology, 12th ed.'],
    test: [
      {
        savol: 'Varikotsele nima?',
        variantlar: ["Moyak atrofida suyuqlik to'planishi", "Pampiniform venoz pleksusning patologik kengayishi", "Prostata kattalashishi", "Uretra torayishi"],
        togri: 1,
        izoh: "Varikotsele — yorg'oqdagi venalarning (pampiniform pleksus) varikoz tarzda kengayishi.",
      },
      {
        savol: 'Gidrotselening tipik xususiyati nima?',
        variantlar: ["Qattiq va og'riqli", "Yumshoq, yorug'lik o'tkazadigan (transilluminatsiya musbat) shish", "Faqat kuchanishda paydo bo'ladi", "Faqat bepushtlik bilan bog'liq"],
        togri: 1,
        izoh: "Gidrotsele suyuqlik to'plami bo'lgani uchun yorug'lik nurini o'tkazadi (transilluminatsiya musbat) — bu uni boshqa shishlardan ajratuvchi muhim klinik belgi.",
      },
      {
        savol: 'Qaysi holat ko\'proq erkak bepushtligi bilan bog\'liq?',
        variantlar: ['Gidrotsele', 'Varikotsele', "Ikkisi ham bir xil darajada", "Hech biri bog'liq emas"],
        togri: 1,
        izoh: "Varikotsele spermatogenezga salbiy ta'sir qilib, erkak bepushtligining ma'lum bir qismida sababchi bo'lishi mumkin; gidrotsele esa odatda fertillik bilan bog'liq emas.",
      },
    ],
  },
  {
    slug: 'kriptorxizm-asoslari',
    sarlavha: 'Kriptorxizm — nima va nega muhim',
    kategoriya: "Prostata va erkak jinsiy a'zolari",
    bosqich: 'oson',
    qisqa: "Kriptorxizmning ahamiyati va nima uchun erta davolash zarur.",
    daqiqa: 20,
    nazariyaIframe: '/nazariyalar/kriptorxizm-asoslari.html',
    bolimlar: [
      {
        sarlavha: '1. Nima va nega muhim?',
        matn: [
          "Kriptorxizm — bir yoki ikki moyakning tug'ilishdan oldin yorg'oqqa to'liq tushmasligi holati, eng ko'p uchraydigan erkak tug'ma anomaliyalaridan biri. Chaqaloqlarning ma'lum qismida moyak hayotning birinchi oyларида o'z-o'zidan yorg'oqga tushishi mumkin, ammo 6 oylikdan keyin ham tushmagan bo'lsa, bu spontan tushish ehtimoli juda past bo'ladi.",
          "Kriptorxizm muhim, chunki yorg'oqdan tashqarida (qorin bo'shlig'ida yoki chov kanalida) qolgan moyak yuqori harorat ta'sirida bo'ladi — bu uzoq muddatda spermatogenezga zarar yetkazishi va kelajakda bepushtlik xavfini oshirishi, shuningdek moyak saratoni xavfini sezilarli darajada oshirishi mumkin. Shu sabab erta tashxis va zarur bo'lsa jarrohlik (orxidopeksiya, odatda 1-2 yoshgacha) muhim ahamiyatga ega.",
        ],
      },
    ],
    manbalar: ['EAU/ESPU Guidelines on Paediatric Urology', 'AUA Guideline on Cryptorchidism'],
    test: [
      {
        savol: 'Kriptorxizm nima?',
        variantlar: ["Moyak shishishi", "Moyakning yorg'oqqa to'liq tushmasligi", "Moyak burilishi", "Moyak yallig'lanishi"],
        togri: 1,
        izoh: "Kriptorxizm — bir yoki ikki moyakning tug'ma ravishda yorg'oqqa to'liq tushmasligi.",
      },
      {
        savol: 'Davolanmagan kriptorxizm nima uchun xavfli?',
        variantlar: ["Hech qanday xavf yo'q", "Bepushtlik va moyak saratoni xavfini oshiradi", "Faqat estetik muammo", "Faqat siyish muammosi keltirib chiqaradi"],
        togri: 1,
        izoh: "Yorg'oqdan tashqaridagi yuqori harorat spermatogenezga zarar yetkazadi va moyak saratoni xavfini sezilarli oshiradi.",
      },
      {
        savol: 'Kriptorxizm uchun jarrohlik (orxidopeksiya) odatda qaysi yoshgacha tavsiya etiladi?',
        variantlar: ['1-2 yoshgacha', '10 yoshgacha', '18 yoshgacha', "Jarrohlik hech qachon kerak emas"],
        togri: 0,
        izoh: "Spontan tushish ehtimoli past bo'lganda, orxidopeksiya odatda 1-2 yoshgacha amalga oshirilishi tavsiya etiladi, bu spermatogenez va saraton xavfini kamaytirish uchun muhim.",
      },
    ],
  },

  // VI. Shoshilinch holatlar (umumiy tushuncha)
  {
    slug: 'moyak-torsiyasi-asoslari',
    sarlavha: "O'tkir moyak burilishi (torsiya) va o'tkir yorg'oq sindromi — shoshilinch belgilar",
    kategoriya: 'Shoshilinch holatlar',
    bosqich: 'oson',
    qisqa: "Moyak torsiyasini nima uchun soatlar ichida aniqlash va davolash hayotiy ahamiyatga ega.",
    daqiqa: 20,
    nazariyaIframe: '/nazariyalar/moyak-torsiyasi-asoslari.html',
    bolimlar: [
      {
        sarlavha: "1. Nima va nega shoshilinch?",
        matn: [
          "Moyak burilishi (torsiya) — moyak uruğ tizimchasi (qon tomirlari va naychalarni o'z ichiga olgan tizimcha) atrofida burilib, qon oqimini to'sib qo'yishi natijasida yuzaga keladigan o'tkir holat. Bu \"o'tkir yorg'oq sindromi\" deb ataluvchi belgilar guruhining eng xavfli sababi hisoblanadi (boshqa sabablar — orxoepididimit, appendiks testis burilishi va boshqalar).",
          "Belgilari: to'satdan, juda kuchli, bir tomonlama yorg'oq og'rig'i (ko'pincha ko'ngil aynishi/qusish bilan birga), moyakning shishishi va yuqoriga ko'tarilishi. Torsiya tashxisi klinik belgilar va zarur bo'lsa Doppler UTT (qon oqimi yo'qligini ko'rsatadi) bilan tasdiqlanadi, ammo klinik shubha kuchli bo'lsa, tekshiruvni kutmasdan darhol jarrohlikka yo'naltirish kerak.",
        ],
      },
      {
        sarlavha: "2. Nima uchun vaqt hal qiluvchi omil?",
        matn: [
          "Moyakning qon ta'minoti to'liq to'siq holatida bo'lganda, to'qima zararlanishi (nekroz) tezda boshlanadi — birinchi 6 soat ichida jarrohlik qilinsa moyakni saqlab qolish ehtimoli juda yuqori, 12-24 soatdan keyin esa bu ehtimol keskin pasayadi. Shu sabab o'tkir yorg'oq og'rig'i bo'lgan har qanday bemorni shoshilinch tartibda urologga yo'naltirish hayotiy (aniqrog'i, a'zoni saqlab qolish nuqtai nazaridan) ahamiyatga ega.",
        ],
      },
    ],
    manbalar: ['EAU/ESPU Guidelines on Paediatric Urology', 'AUA Guideline on Acute Scrotum'],
    test: [
      {
        savol: 'Moyak torsiyasi nima?',
        variantlar: ["Moyakning yallig'lanishi", "Uruğ tizimchasining burilib qon oqimini to'sib qo'yishi", "Moyak atrofida suyuqlik to'planishi", "Prostata kattalashishi"],
        togri: 1,
        izoh: "Torsiya — uruğ tizimchasining o'z o'qi atrofida burilib qon ta'minotini to'sib qo'yishi natijasida yuzaga keladigan o'tkir holat.",
      },
      {
        savol: "O'tkir yorg'oq og'rig'ida tashxis kutilmasdan nima qilinishi kerak?",
        variantlar: ["Faqat og'riqsizlantiruvchi berish", "Klinik shubha kuchli bo'lsa, darhol jarrohlikka yo'naltirish", "Bir necha kun kuzatish", "Faqat antibiotik berish"],
        togri: 1,
        izoh: "Torsiyada vaqt juda muhim bo'lgani uchun, klinik shubha kuchli bo'lsa, qo'shimcha tekshiruvni kutmasdan shoshilinch jarrohlikka yo'naltirish kerak.",
      },
      {
        savol: "Moyakni saqlab qolish ehtimoli qaysi vaqt oralig'ida eng yuqori bo'ladi?",
        variantlar: ["Birinchi 6 soat ichida", '24-48 soatdan keyin', '1 haftadan keyin', "Vaqt ahamiyatsiz"],
        togri: 0,
        izoh: "Birinchi 6 soat ichida jarrohlik qilinsa moyakni saqlab qolish ehtimoli juda yuqori bo'ladi, vaqt o'tishi bilan bu ehtimol keskin pasayadi.",
      },
    ],
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
