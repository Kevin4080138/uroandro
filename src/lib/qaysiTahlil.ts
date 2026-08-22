// "Qaysi tahlil kerak?" — bemor shikoyatiga qarab tavsiya etiladigan tahlillar.
// DIQQAT: bu tibbiy tashxis EMAS — faqat yo'l-yo'riq. Mazmun shifokor tomonidan
// ko'rib chiqilishi kerak. Har bir shikoyat urologiyaga oid keng tarqalgan holatlar.

export type Tahlil = {
  nom: string
  nima_uchun: string
}

export type Shikoyat = {
  id: string
  matn: string           // bemor ko'radigan yorliq
  kategoriya: string      // guruh
  shoshilinch?: boolean   // shoshilinch (red-flag) belgisi
  ogohlantirish?: string  // shoshilinch bo'lsa — ko'rsatiladigan maxsus ogohlantirish
  tahlillar: Tahlil[]     // BIRINCHISI — birlamchi (asosiy) tahlil, qolganlari — qo'shimcha
}

// Kategoriyalar ko'rsatilish tartibi
export const KATEGORIYALAR = [
  'Siyish bilan bog\'liq',
  'Og\'riq',
  'Qonli siydik',
  'Erkak salomatligi',
  'Buyrak / umumiy',
  'Profilaktika',
] as const

export const SHIKOYATLAR: Shikoyat[] = [
  // ─── Siyish bilan bog'liq ───
  {
    id: 'dizuriya', matn: 'Siyishda achishish / yonish (dizuriya)', kategoriya: 'Siyish bilan bog\'liq',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Yallig\'lanish/infeksiya belgilarini (leykotsit, bakteriya, nitrit) aniqlaydi' },
      { nom: 'Siydik ekinmasi (bakposev)', nima_uchun: 'Qaysi bakteriya sabab va qaysi antibiotik ta\'sir qilishini aniqlaydi' },
    ],
  },
  {
    id: 'tez-siyish', matn: 'Tez-tez siyish (kunduzi yoki kechasi)', kategoriya: 'Siyish bilan bog\'liq',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Infeksiya yoki qand (glyukoza) borligini tekshiradi' },
      { nom: 'Qonda glyukoza (qand)', nima_uchun: 'Qandli diabet tez siyishning keng sababi — uni istisno qiladi' },
      { nom: 'PSA + prostata UZI (erkaklarda)', nima_uchun: '40+ yosh erkaklarda prostata kattalashishi (BPH) ni baholaydi' },
    ],
  },
  {
    id: 'kuchsiz-oqim', matn: 'Kuchsiz oqim / siyishni kutish / to\'liq bo\'shalmaslik', kategoriya: 'Siyish bilan bog\'liq',
    tahlillar: [
      { nom: 'Qoldiq siydik UZI (PVR)', nima_uchun: 'Siyishdan keyin qovuqda qancha siydik qolishini o\'lchaydi' },
      { nom: 'PSA + prostata UZI', nima_uchun: 'Prostata kattalashishi (BPH) yoki boshqa sababni baholaydi' },
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Qo\'shimcha infeksiyani istisno qiladi' },
    ],
  },
  {
    id: 'inkontinensiya', matn: 'Siydikni tutolmaslik (o\'z-o\'zidan chiqib ketishi)', kategoriya: 'Siyish bilan bog\'liq',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Infeksiya ta\'sirlanishga sabab bo\'lishini istisno qiladi' },
      { nom: 'Qoldiq siydik UZI (PVR)', nima_uchun: 'Qovuqning bo\'shalishini baholaydi (to\'lib-toshib oqish ehtimoli)' },
    ],
  },
  {
    id: 'kuchli-qistov', matn: 'Kuchli qistov — ushlab turolmayman', kategoriya: 'Siyish bilan bog\'liq',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Infeksiya qistovga sabab bo\'lishini istisno qiladi' },
      { nom: 'Qoldiq siydik UZI (PVR)', nima_uchun: 'Qovuq to\'liq bo\'shalyaptimi — buni baholaydi' },
    ],
  },
  {
    id: 'nokturiya', matn: 'Kechasi siyishga ko\'p turaman', kategoriya: 'Siyish bilan bog\'liq',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Infeksiya yoki qandni tekshiradi' },
      { nom: 'Qonda glyukoza (qand)', nima_uchun: 'Qandli diabet kechasi ko\'p siyishning keng sababi' },
      { nom: 'PSA + prostata UZI (erkaklarda)', nima_uchun: '40+ yosh erkaklarda prostata kattalashishini baholaydi' },
    ],
  },
  {
    id: 'siya-olmayapman', matn: 'Umuman siya olmayapman (o\'tkir siydik tutilishi)', kategoriya: 'Siyish bilan bog\'liq',
    shoshilinch: true, ogohlantirish: 'Umuman siya olmaslik — shoshilinch holat. Zudlik bilan shifokorga yoki tez yordamga murojaat qiling (qovuqni bo\'shatish kerak).',
    tahlillar: [
      { nom: 'Shoshilinch shifokor ko\'rigi', nima_uchun: 'Qovuqni kateter bilan bo\'shatish va sababni aniqlash zarur' },
    ],
  },

  // ─── Og'riq ───
  {
    id: 'bel-ogriq', matn: 'Bel / yon qorin og\'rig\'i (to\'lqinsimon, kuchli)', kategoriya: 'Og\'riq',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Tosh yoki infeksiya belgisini (qon, leykotsit) ko\'rsatadi' },
      { nom: 'Buyrak-siydik yo\'li UZI', nima_uchun: 'Tosh va buyrak kengayishini (gidronefroz) aniqlaydi' },
      { nom: 'Kontrastsiz KT (shifokor tavsiyasi bilan)', nima_uchun: 'Toshni aniqlashda oltin standart' },
    ],
  },
  {
    id: 'isitma-bel', matn: 'Isitma + bel og\'rig\'i + qaltirash', kategoriya: 'Og\'riq',
    shoshilinch: true, ogohlantirish: 'Isitma bilan bel og\'rig\'i buyrak infeksiyasi (pielonefrit) belgisi bo\'lishi mumkin — kechiktirmasdan shifokorga murojaat qiling.',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili + ekinma', nima_uchun: 'Buyrak infeksiyasi va qo\'zg\'atuvchini aniqlaydi' },
      { nom: 'Qon tahlili (umumiy qon, CRP)', nima_uchun: 'Yallig\'lanish va infeksiya og\'irligini baholaydi' },
      { nom: 'Buyrak UZI', nima_uchun: 'To\'siqlanish yoki absessni istisno qiladi' },
    ],
  },
  {
    id: 'qov-ogriq', matn: 'Qov usti (pastki qorin) og\'rig\'i / bosim', kategoriya: 'Og\'riq',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Qovuq yallig\'lanishi (sistit) belgilarini ko\'rsatadi' },
      { nom: 'Siydik ekinmasi', nima_uchun: 'Infeksiya bo\'lsa qo\'zg\'atuvchini aniqlaydi' },
    ],
  },
  {
    id: 'chov-sanchiq', matn: 'Chov / moyakka tarqaydigan sanchiq', kategoriya: 'Og\'riq',
    tahlillar: [
      { nom: 'Buyrak-siydik yo\'li UZI', nima_uchun: 'Siydik yo\'lidagi toshni (tarqoq og\'riqning keng sababi) qidiradi' },
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Tosh yoki infeksiya belgisini (qon, leykotsit) ko\'rsatadi' },
    ],
  },

  // ─── Qonli siydik ───
  {
    id: 'makrogematuriya', matn: 'Ko\'zga ko\'rinadigan qonli siydik', kategoriya: 'Qonli siydik',
    shoshilinch: true, ogohlantirish: 'Ko\'zga ko\'rinadigan qon — albatta shifokor tekshiruvini talab qiladi (tosh, infeksiya yoki o\'sma sababli bo\'lishi mumkin). Kechiktirmang.',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili + siydik sitologiyasi', nima_uchun: 'Qon manbai va shubhali hujayralarni baholaydi' },
      { nom: 'Buyrak-qovuq UZI yoki KT', nima_uchun: 'Tosh, o\'sma yoki boshqa sababni qidiradi' },
      { nom: 'Sistoskopiya (shifokor tomonidan)', nima_uchun: 'Qovuq ichini bevosita ko\'rish — o\'smani istisno qilish uchun' },
    ],
  },
  {
    id: 'mikrogematuriya', matn: 'Tahlilda qon chiqdi, lekin ko\'zga ko\'rinmaydi', kategoriya: 'Qonli siydik',
    tahlillar: [
      { nom: 'Umumiy siydik tahlilini takrorlash', nima_uchun: 'Vaqtinchalik sabablarni (mashq, hayz) istisno qiladi' },
      { nom: 'Buyrak-qovuq UZI', nima_uchun: 'Tuzilmaviy sababni (tosh, o\'sma) baholaydi' },
      { nom: 'Shifokor konsultatsiyasi', nima_uchun: 'Qo\'shimcha tekshiruv (KT/sistoskopiya) zarurligini belgilaydi' },
    ],
  },

  // ─── Erkak salomatligi ───
  {
    id: 'moshak-otkir', matn: 'To\'satdan kuchli moshak (urug\'don) og\'rig\'i', kategoriya: 'Erkak salomatligi',
    shoshilinch: true, ogohlantirish: 'To\'satdan kuchli moshak og\'rig\'i — moyak burilishi (torsion) bo\'lishi mumkin, bu 6 soatlik SHOSHILINCH holat. Zudlik bilan tez yordamga murojaat qiling — tahlil kutmang!',
    tahlillar: [
      { nom: 'Shoshilinch Doppler UZI', nima_uchun: 'Moyakning qon oqimini tekshiradi (torsionni aniqlaydi)' },
    ],
  },
  {
    id: 'moshak-shish', matn: 'Moshak / urug\'donda shish yoki tugun (og\'riqsiz)', kategoriya: 'Erkak salomatligi',
    shoshilinch: true, ogohlantirish: 'Urug\'dondagi og\'riqsiz qattiq tugun — albatta shifokor tekshiruvini talab qiladi (o\'sma bo\'lishi mumkin). Kechiktirmang.',
    tahlillar: [
      { nom: 'Moshak (skrotum) UZI', nima_uchun: 'Tugun turini (o\'sma, kista, varikotsele) aniqlaydi' },
      { nom: 'Qon o\'sma markerlari (AFP, β-hCG, LDH)', nima_uchun: 'O\'sma shubhasi bo\'lsa baholanadi (shifokor tavsiyasi bilan)' },
    ],
  },
  {
    id: 'ed', matn: 'Jinsiy zaiflik (erektsiya muammosi)', kategoriya: 'Erkak salomatligi',
    tahlillar: [
      { nom: 'Qonda testosteron (ertalab)', nima_uchun: 'Erkaklik gormoni yetishmovchiligini tekshiradi' },
      { nom: 'Qonda glyukoza / HbA1c', nima_uchun: 'Qandli diabet erektil disfunksiyaning keng sababi' },
      { nom: 'Lipid profil (xolesterin)', nima_uchun: 'Tomir sabablarini baholaydi — yurak xavfi bilan ham bog\'liq' },
    ],
  },
  {
    id: 'bepushtlik', matn: 'Bola bo\'lmayapti (bepushtlik)', kategoriya: 'Erkak salomatligi',
    tahlillar: [
      { nom: 'Spermogramma', nima_uchun: 'Spermatozoid soni, harakati va shaklini baholaydi — asosiy tahlil' },
      { nom: 'Gormonlar (FSH, LH, testosteron)', nima_uchun: 'Spermatogenez va gormonal sabablarni tekshiradi' },
      { nom: 'Moshak UZI', nima_uchun: 'Varikotsele yoki tuzilmaviy sababni aniqlaydi' },
    ],
  },
  {
    id: 'uretra-ajralma', matn: 'Jinsiy a\'zodan ajralma / jinsiy yo\'l infeksiyasi shubhasi', kategoriya: 'Erkak salomatligi',
    tahlillar: [
      { nom: 'Uretra surtmasi / NAAT (gonokokk, xlamidiya)', nima_uchun: 'Jinsiy yo\'l infeksiyasi qo\'zg\'atuvchisini aniqlaydi' },
      { nom: 'JYYI paneli (HIV, sifilis, gepatit)', nima_uchun: 'Jinsiy yo\'l infeksiyalari ko\'pincha birga uchraydi — birga tekshiriladi' },
    ],
  },
  {
    id: 'surunkali-prostatit', matn: 'Prostata sohasida uzoq davom etgan noqulaylik / og\'riq', kategoriya: 'Erkak salomatligi',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili + ekinma', nima_uchun: 'Prostata/siydik yo\'li infeksiyasini tekshiradi' },
      { nom: 'PSA (shifokor bilan)', nima_uchun: 'Prostata holatini baholashda yordam beradi (shifokor talqin qiladi)' },
      { nom: 'Qoldiq siydik UZI (PVR)', nima_uchun: 'Qovuq bo\'shalishi va prostata ta\'sirini baholaydi' },
    ],
  },

  // ─── Buyrak / umumiy ───
  {
    id: 'shish-koPik', matn: 'Oyoq/yuz shishi + siydik ko\'piklanishi', kategoriya: 'Buyrak / umumiy',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili (oqsil)', nima_uchun: 'Siydikda oqsil yo\'qotishni (buyrak muammosi) ko\'rsatadi' },
      { nom: 'Qonda kreatinin + GFR', nima_uchun: 'Buyrak funksiyasini baholaydi' },
    ],
  },
  {
    id: 'siydik-ozgarish', matn: 'Siydik rangi / hidi o\'zgarishi', kategoriya: 'Buyrak / umumiy',
    tahlillar: [
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Infeksiya, qon, bilirubin yoki konsentratsiyani baholaydi' },
    ],
  },
  {
    id: 'tosh-tarixi', matn: 'Ilgari buyrak toshi bo\'lgan — qaytalanmasligini tekshirmoqchiman', kategoriya: 'Buyrak / umumiy',
    tahlillar: [
      { nom: 'Buyrak-siydik yo\'li UZI', nima_uchun: 'Yangi yoki qolgan toshni tekshiradi' },
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Yashirin infeksiya yoki qonni ko\'rsatadi' },
      { nom: 'Qonda kalsiy, siydik kislotasi, kreatinin', nima_uchun: 'Tosh hosil bo\'lish sabablari va buyrak funksiyasini baholaydi' },
    ],
  },

  // ─── Profilaktika ───
  {
    id: 'checkup-erkak', matn: 'Shikoyatim yo\'q, lekin tekshiruvdan o\'tmoqchiman (erkak 40+)', kategoriya: 'Profilaktika',
    tahlillar: [
      { nom: 'PSA + prostata UZI', nima_uchun: '40+ yoshda prostata salomatligini profilaktik baholaydi' },
      { nom: 'Umumiy siydik tahlili', nima_uchun: 'Yashirin infeksiya yoki qonni erta aniqlaydi' },
      { nom: 'Qonda glyukoza + kreatinin', nima_uchun: 'Diabet va buyrak funksiyasini nazorat qiladi' },
    ],
  },
]
