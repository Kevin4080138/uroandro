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

export type Dars = {
  slug: string
  sarlavha: string
  kategoriya: string
  qisqa: string
  daqiqa: number
  bolimlar: DarsBolimi[]
  manbalar: string[]
  test: TestSavoli[]
}

export const DARS_KATEGORIYALARI = ['Hammasi', 'Prostata', 'Andrologiya', 'Urolitiaz', 'Onkourologiya'] as const

export const DARSLAR: Dars[] = [
  {
    slug: 'bph-luts',
    sarlavha: "Benign prostata giperplaziyasi (BPH) va pastki siydik yo'llari simptomlari",
    kategoriya: 'Prostata',
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
    kategoriya: 'Prostata',
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
    slug: 'varikotsele-infertility',
    sarlavha: 'Varikotsele va erkak bepushtligi',
    kategoriya: 'Andrologiya',
    qisqa: "Varikotsele patofiziologiyasi, darajalash, spermogrammaga ta'siri va jarrohlik usullari.",
    daqiqa: 8,
    bolimlar: [
      {
        sarlavha: '1. Patofiziologiya',
        matn: [
          "Varikotsele — pampiniform venoz pleksusning patologik kengayishi va burama tarzda cho'zilishi. Chap tomonda ancha ko'p uchraydi (taxminan 85-90% hollarda), chunki chap uruğ venasi chap buyrak venasiga to'g'ri burchak ostida quyiladi, bu esa venoz oqimga ko'proq qarshilik va gidrostatik bosim yaratadi; o'ng uruğ venasi esa to'g'ridan-to'g'ri pastki kovak venaga ingichka burchak ostida quyiladi.",
          "Venoz qon turg'unligi mahalliy harorat oshishi, oksidlanish stressi va gipoksiyaga olib keladi — bularning barchasi spermatogenezga salbiy ta'sir ko'rsatadi.",
        ],
      },
      {
        sarlavha: '2. Klinik darajalash (Dubin-Amelar)',
        matn: [
          "0-daraja (subklinik): palpatsiyada aniqlanmaydi, faqat USI/Doppler orqali topiladi. I-daraja: faqat Valsalva sinamasi (kuchanish) vaqtida palpatsiya qilinadi. II-daraja: Valsalva sinamasisiz ham palpatsiya qilinadi, lekin ko'rinmaydi. III-daraja: ko'z bilan ko'rinadi va aniq palpatsiya qilinadi.",
          "USI/Doppler tekshiruvida uruğ tizimchasi venalarining diametri ≥3 mm va Valsalva bilan reflyuks (qonning teskari oqimi) aniqlanishi varikotsele uchun tipik hisoblanadi.",
        ],
      },
      {
        sarlavha: "3. Spermogrammaga ta'siri",
        matn: [
          "Varikotsele klassik tarzda OAT-sindromga (Oligo-Astheno-Teratozoospermia) olib kelishi mumkin — sperma konsentratsiyasi, harakatchanligi va morfologiyasining barchasi pasayadi. Bu o'zgarishlar WHO 2021 (6-nashr) me'zonlari bo'yicha baholanadi.",
          "Shuni ta'kidlash kerakki, varikotsele bo'lgan har bir erkakda bepushtlik kelib chiqmaydi — taxminan 35-40% erkak bepushtligi holatlarida varikotsele aniqlanadi, lekin umumiy erkak populyatsiyasida varikotsele uchrashi taxminan 15% ni tashkil qiladi.",
        ],
      },
      {
        sarlavha: '4. Davolash ko\'rsatkichlari va usullari',
        matn: [
          "Jarrohlik davolashga asosiy ko'rsatkichlar: klinik aniqlanadigan (I-III daraja) varikotsele + patologik spermogramma + bepushtlik (≥1 yil himoyalanmagan jinsiy aloqa) + ayolda fertillik muammosi aniqlanmagan yoki davolanadigan bo'lishi. Og'riq sindromi yoki progressiv moyak gipotrofiyasi (ayniqsa o'smirlarda) ham mustaqil ko'rsatma bo'lishi mumkin.",
          "Asosiy usullar: mikrojarrohlik subinguinal varikotselektomiya (Marmar usuli — eng yuqori samaradorlik va eng kam qaytalanish ko'rsatkichi bilan oltin standart hisoblanadi), laparoskopik varikotselektomiya, Palomo va Ivanissevich (retroperitoneal) usullari, skleroterapiya/embolizatsiya (minimal invaziv, lekin qaytalanish darajasi yuqoriroq).",
        ],
      },
    ],
    manbalar: [
      'EAU Guidelines on Sexual and Reproductive Health — Male Infertility (2024)',
      'WHO Laboratory Manual for the Examination of Human Semen, 6th ed. (2021)',
      'Dubin L, Amelar RD. Fertil Steril. (1970) — klinik darajalash',
    ],
    test: [
      {
        savol: "Varikotsele nima uchun ko'pincha chap tomonda uchraydi?",
        variantlar: ['Chap moyak kattaroq bo\'ladi', "Chap uruğ venasi chap buyrak venasiga to'g'ri burchak ostida quyiladi", "O'ng tomonda venalar yo'q", 'Bu tasodifiy holat'],
        togri: 1,
        izoh: "Chap uruğ venasining chap buyrak venasiga to'g'ri burchak ostida quyilishi venoz qarshilikni oshiradi, shu sabab chap tomon ustunlik qiladi.",
      },
      {
        savol: "Dubin-Amelar bo'yicha qaysi daraja 'faqat Valsalva sinamasi vaqtida palpatsiya qilinadi' deb ta'riflanadi?",
        variantlar: ['0-daraja', 'I-daraja', 'II-daraja', 'III-daraja'],
        togri: 1,
        izoh: "I-daraja — tinch holatda sezilmaydi, faqat Valsalva (kuchanish) sinamasi vaqtida palpatsiya qilinadi.",
      },
      {
        savol: "OAT-sindromi qaysi uchta ko'rsatkichning pasayishini bildiradi?",
        variantlar: ['Hajm, pH, rang', 'Konsentratsiya, harakatchanlik, morfologiya', 'Yosh, vazn, bo\'y', 'Libido, erektsiya, ejakulyatsiya'],
        togri: 1,
        izoh: 'OAT — Oligo (konsentratsiya past) - Astheno (harakatchanlik past) - Teratozoospermia (morfologiya buzilgan).',
      },
      {
        savol: "Varikotsele jarrohlik usullari ichida 'oltin standart' deb hisoblanadigan usul qaysi?",
        variantlar: ['Skleroterapiya', 'Ivanissevich usuli', 'Mikrojarrohlik subinguinal varikotselektomiya (Marmar)', 'Palomo usuli'],
        togri: 2,
        izoh: "Marmar usuli eng yuqori samaradorlik va eng past qaytalanish darajasi tufayli oltin standart hisoblanadi.",
      },
      {
        savol: "USI/Doppler'da qaysi vena diametri varikotsele uchun tipik ko'rsatkich hisoblanadi?",
        variantlar: ['≥3 mm reflyuks bilan', '≤1 mm', 'Faqat 10 mm dan katta', "Diametr ahamiyatsiz, faqat rang muhim"],
        togri: 0,
        izoh: "Uruğ tizimchasi venalarining diametri ≥3 mm bo'lib, Valsalva bilan reflyuks aniqlanishi varikotsele uchun tipik USI belgisi hisoblanadi.",
      },
    ],
  },
  {
    slug: 'erektil-disfunksiya',
    sarlavha: 'Erektil disfunksiya: sabablari, baholash va davolash',
    kategoriya: 'Andrologiya',
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
    kategoriya: 'Urolitiaz',
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
]

export function darsTop(slug: string) {
  return DARSLAR.find((d) => d.slug === slug)
}
