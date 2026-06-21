export type Protokol = {
  slug: string
  nom: string
  toifa: string
  qisqa: string
  korsatma: string
  tashxis: string[]
  davolash: string[]
  manba: string
}

export const PROTOKOLLAR: Protokol[] = [
  {
    slug: 'varikotsele',
    nom: 'Varikotsele',
    toifa: 'Andrologiya',
    qisqa: "Urug'don venalarining patologik kengayishi — erkak bepushtligining eng ko'p uchraydigan tuzatiluvchi sababi.",
    korsatma: "Spermogramma yomonlashgan bepushtlik, urug'don hajmi kichrayishi (o'smirlarda), og'riq, katta simptomatik varikotsele.",
    tashxis: [
      "Fizik ko'rik (Valsalva sinamasi bilan), Dubin–Amelar bo'yicha daraja aniqlash",
      'Skrotal Doppler USI — vena diametri va reflux tasdiqlash',
      'Spermogramma (WHO 2021 me\'zonlari) — kamida 2 marta, 2-4 hafta orasida',
      'Gormonal panel (testosteron, FSH, LH) — ayniqsa gipogonadizm shubhasida',
    ],
    davolash: [
      "I daraja, simptomsiz, spermogramma me'yorida — dinamik kuzatuv",
      "Bepushtlik/og'riq/gipotrofiya bilan birga II-III daraja — jarrohlik davolash ko'rsatilgan",
      "Mikrojarrohlik subingvinal (Marmar) — eng past retsidiv (1-2%) va gidrotsele (0-1%) darajasi, oltin standart",
      "Laparoskopik — ikki tomonlama holatlarda bitta yondashuv afzalligi",
      "Skleroterapiya/Palomo/Ivanissevich — mikrojarrohlik imkoni bo'lmaganda alternativ",
    ],
    manba: 'EAU Guidelines on Sexual and Reproductive Health (Male Infertility)',
  },
  {
    slug: 'bph',
    nom: "Benign prostata giperplaziyasi (BPH)",
    toifa: 'Urologiya',
    qisqa: "Prostata bezining yoshga bog'liq benign kattalashishi, pastki siydik yo'llari simptomlariga (PSYS) olib keladi.",
    korsatma: "O'rta-og'ir PSYS (IPSS≥8), siydik tutilishi, retsidivlanuvchi infeksiya, gematuriya, buyrak funksiyasi buzilishi.",
    tashxis: [
      'IPSS (xalqaro prostata simptomlari indeksi) so\'rovnomasi',
      'Rektal raqamli tekshiruv (DRE) va PSA (saraton xavfini istisno qilish uchun)',
      'Siydik tahlili, uroflowmetriya (Qmax), qoldiq siydik hajmi (USI)',
      'Prostata hajmi — transrektal USI (TRUS) zarur bo\'lganda',
    ],
    davolash: [
      "Yengil simptomlar (IPSS<8) — dinamik kuzatuv, hayot tarzi tuzatishlari",
      "Alfa-blokatorlar (tamsulozin va h.k.) — tez simptomatik yengillik",
      "5-alfa-reduktaza inhibitorlari — katta prostata (>40ml) hajmida, uzoq muddatli",
      "Kombinatsiyalangan davolash — og'ir simptomlar yoki katta hajmda",
      "Jarrohlik (TURP, lazer enukleatsiya/vaporizatsiya) — dori-darmonga javob bermaganda yoki asoratlarda",
    ],
    manba: 'EAU Guidelines on Management of Non-Neurogenic Male LUTS',
  },
  {
    slug: 'prostatit',
    nom: 'Prostatit',
    toifa: 'Urologiya',
    qisqa: "Prostata bezining yallig'lanishi — o'tkir bakterial, surunkali bakterial yoki surunkali tos og'rig'i sindromi (CPPS) shaklida bo'ladi.",
    korsatma: "Tos sohasidagi og'riq, siyish buzilishlari, ba'zan isitma (o'tkir holatda) — kamida 3 oy davom etsa surunkali deb hisoblanadi.",
    tashxis: [
      "Anamnez va simptomlar (NIH-CPSI so'rovnomasi)",
      'Siydik tahlili va bakposevi, jinsiy yo\'l bilan yuqadigan infeksiyalarni istisno qilish',
      "DRE — o'tkir holatda ehtiyotkorlik bilan (massaj qilish mumkin emas)",
      'Prostata sekretini/siydikni tekshirish (4-stakan sinamasi) — surunkali holatda',
    ],
    davolash: [
      "O'tkir bakterial — fluorxinolon yoki trimetoprim-sulfametoksazol, 2-4 hafta antibiotik",
      "Surunkali bakterial — antibiotik 4-6 hafta, alfa-blokatorlar bilan birga",
      "CPPS (bakterial bo'lmagan) — alfa-blokatorlar, og'riqni boshqarish, fizioterapiya, psixologik qo'llab-quvvatlash",
      "Antibiotikka javob bo'lmasa — qayta baholash, surunkali og'riq protokoliga o'tish",
    ],
    manba: 'EAU Guidelines on Urological Infections',
  },
  {
    slug: 'urolitiaz',
    nom: 'Siydik-tosh kasalligi (Urolitiaz)',
    toifa: 'Urologiya',
    qisqa: "Siydik yo'llarida tosh hosil bo'lishi — kolikasimon og'riq bilan namoyon bo'ladigan eng ko'p uchraydigan urologik holatlardan biri.",
    korsatma: "O'tkir bel/qorin og'rig'i (buyrak kolikasi), gematuriya, infeksiya belgilari, siydik oqimi to'siqi.",
    tashxis: [
      'Низкодозали KT (qorin/chanoq) — oltin standart tashxis usuli',
      'USI — homiladorlikda yoki nurlanishni cheklash kerak bo\'lganda birinchi qadam',
      'Siydik tahlili (gematuriya, infeksiya), qon kreatinin/elektrolitlar',
      "Tosh tarkibini tahlil qilish (chiqgan tosh bo'lsa) — metabolik sabablarni aniqlash uchun",
    ],
    davolash: [
      "<10mm tosh, og'riq nazorat qilinadigan — konservativ kuzatuv (MET — alfa-blokator bilan chiqishni tezlashtirish)",
      "Og'ir og'riq, infeksiya, to'siq — shoshilinch dekompressiya (stent yoki nefrostomiya)",
      "ESWL (zarba to'lqini bilan parchalash) — kichik-o'rta tosh, qulay joylashganda",
      "Ureteroskopiya (URS) — ureter toshlari uchun birinchi tanlov ko'pincha",
      "PCNL (perkutan nefrolitotomiya) — katta (>20mm) buyrak toshlari",
      "Metabolik tekshiruv va profilaktika — retsidivni kamaytirish uchun suyuqlik/diyeta tavsiyalari",
    ],
    manba: 'EAU Guidelines on Urolithiasis',
  },
  {
    slug: 'erektil-disfunksiya',
    nom: 'Erektil disfunksiya',
    toifa: 'Andrologiya',
    qisqa: "Jinsiy aloqa uchun yetarli ereksiyaga erishish yoki uni saqlab turishning doimiy qiyinligi.",
    korsatma: "≥3 oy davom etgan ereksiya muammosi; yurak-qon tomir xavf omillarini baholash muhim (ED ko'pincha erta belgi).",
    tashxis: [
      'Anamnez (IIEF so\'rovnomasi), psixogen/organik sabablarni farqlash',
      'Testosteron, qon glyukozasi/HbA1c, lipid profili — metabolik sabablarni istisno qilish',
      'Yurak-qon tomir xavfini baholash (ED — erta kardiovaskulyar belgi bo\'lishi mumkin)',
      'Penil doppler USI — vaskulyar sababdan shubhalanilganda',
    ],
    davolash: [
      "Hayot tarzi tuzatishlari (vazn, jismoniy faollik, chekishni tashlash) — birinchi qadam",
      "PDE5 inhibitorlari (sildenafil va h.k.) — birinchi qatordagi dori davolash",
      "Testosteron almashtirish — tasdiqlangan gipogonadizmda",
      "Vakuum qurilmalar, intrakavernoz in'ektsiyalar — dori-darmon samarasiz bo'lganda",
      "Penil protez implantatsiyasi — refrakter holatlarda",
    ],
    manba: 'EAU Guidelines on Sexual and Reproductive Health (Erectile Dysfunction)',
  },
  {
    slug: 'gidrosele',
    nom: 'Gidrosele',
    toifa: 'Andrologiya',
    qisqa: "Tunika vaginalis ichida suyuqlik to'planishi, moshonka kattalashishiga olib keladi.",
    korsatma: "Simptomatik (og'riq, noqulaylik, kattalashish) gidrosele yoki tashxisni murakkablashtiruvchi katta hajm.",
    tashxis: [
      "Fizik ko'rik — transilluminatsiya musbat (suyuqlik belgisi)",
      'Skrotal USI — tuxumdon patologiyasini (o\'sma, varikotsele) istisno qilish uchun majburiy',
      "Ikkilamchi sabablarni qidirish (infeksiya, travma, o'sma)",
    ],
    davolash: [
      "Kichik, simptomsiz — kuzatuv",
      "Simptomatik kattalashgan — jarrohlik (gidrosellektomiya) asosiy davolash usuli",
      "Aspiratsiya/skleroterapiya — jarrohlikka nomzod bo'lmagan bemorlarda muqobil, retsidiv darajasi yuqoriroq",
    ],
    manba: 'EAU Guidelines on Paediatric Urology / general andrology references',
  },
  {
    slug: 'epididimit-orxit',
    nom: 'Epididimit / Orxit',
    toifa: 'Andrologiya',
    qisqa: "Epididim va/yoki tuxumdonning o'tkir yallig'lanishi, ko'pincha infeksion sabab bilan.",
    korsatma: "O'tkir moshonka og'rig'i va shishi — testikulyar torsiyani shoshilinch istisno qilish kerak.",
    tashxis: [
      "Shoshilinch: testikulyar torsiyani istisno qilish (Doppler USI, kremaster refleksi)",
      'Siydik tahlili va bakposevi, jinsiy yo\'l infeksiyalari skriningi (yosh faol erkaklarda)',
      'Skrotal Doppler USI — qon oqimi (epididimitda kuchaygan, torsiyada pasaygan)',
    ],
    davolash: [
      "Jinsiy yo'l infeksiyasiga bog'liq (yosh) — ceftriakson + doksitsiklin/azitromisin",
      "Siydik yo'li infeksiyasiga bog'liq (keksa) — fluorxinolon",
      "Simptomatik: dam olish, moshonkani ko'tarib turish, og'riqsizlantirish, sovuq kompres",
      "Abssess yoki javob bo'lmasa — jarrohlik konsultatsiyasi",
    ],
    manba: 'EAU Guidelines on Urological Infections',
  },
  {
    slug: 'erkak-bepushtligi',
    nom: 'Erkak faktori bepushtlik',
    toifa: 'Andrologiya',
    qisqa: "Juftlikning 12 oylik himoyalanmagan jinsiy aloqadan keyin homiladorlikka erisha olmasligida erkak faktorini baholash.",
    korsatma: "1 yildan ortiq bepushtlik (yoki ayol faktori bilan bog'liq omillar bo'lsa ertaroq), spermogramma anomaliyasi.",
    tashxis: [
      "Spermogramma (WHO 2021) — kamida 2 marta, 2-4 hafta orasida",
      "Gormonal panel: testosteron, FSH, LH, prolaktin",
      "Skrotal USI — varikotsele, obstruksiya belgilarini aniqlash",
      "Genetik tekshiruv (karyotip, Y-mikrodeletsiya) — og'ir oligo/azoospermiyada",
    ],
    davolash: [
      "Varikotsele aniqlansa — mikrojarrohlik varikotselektomiya (spermogramma/homiladorlik natijalarini yaxshilaydi)",
      "Gormonal sabab (gipogonadotrop gipogonadizm) — gormonal davolash",
      "Obstruktiv azoospermiya — jarrohlik korreksiyasi yoki sperma olish + IVF/ICSI",
      "Idiopatik holatlar — antioksidantlar (ma'lumotlar cheklangan), yordamchi reproduktiv texnologiyalar",
    ],
    manba: 'EAU Guidelines on Sexual and Reproductive Health (Male Infertility)',
  },
]
