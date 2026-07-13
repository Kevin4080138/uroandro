// Operatsiyalar katalogi — bemor uchun oddiy tilda tushuntiruvchi ma'lumot.
// Maqsad: bemor operatsiyadan oldin nimaga tayyorlanishini, qancha davom etishini,
// taxminiy narxini va qancha vaqtda tiklanishini oldindan bilsin (qo'rquvni kamaytiradi).
//
// DIQQAT: bu yerdagi narxlar — Farg'ona bo'yicha taxminiy oraliq. Yakuniy narx
// klinika, anesteziya turi va holatning murakkabligiga qarab farq qiladi.

export type OperatsiyaBosqich = {
  sarlavha: string
  matn: string
}

export type Operatsiya = {
  slug: string
  nom: string
  organ: string          // qaysi a'zoga tegishli
  belgi: string          // emoji
  qisqa: string          // bir jumlada nima ekani
  nimaUchun: string      // nega qilinadi (oddiy tilda)
  davomiyligi: string    // taxminiy davomiylik
  anesteziya: string     // og'riqsizlantirish turi
  yotish: string         // klinikada necha kun yotadi
  narxOraliq: string     // taxminiy narx (Farg'ona)
  tiklanish: string      // qancha vaqtda odatdagi hayotga qaytadi
  tayyorgarlik: string[] // operatsiyadan oldin nima qilish kerak
  jarayon: OperatsiyaBosqich[] // qanday o'tadi
  keyin: string[]        // operatsiyadan keyin nimalarga e'tibor
  ogohlantiruvchiBelgilar: string[] // qachon zudlik bilan shifokorga
}

export const OPERATSIYALAR: Operatsiya[] = [
  {
    slug: 'varikotsele-marmar',
    nom: 'Varikotsele — mikrojarrohlik (Marmar usuli)',
    organ: 'Moyak / urug\' tizimchasi',
    belgi: '🔬',
    qisqa: 'Moyak venalarining kengayishini mikroskop yordamida bog\'lab qo\'yish.',
    nimaUchun:
      'Moyak atrofidagi venalar kengayib qolganda (varikotsele) qon oqishi buziladi, moyak qizib ketadi va spermatozoidlar sifati pasayadi. Bu erkak bepushtligining eng ko\'p uchraydigan, ammo davolash mumkin bo\'lgan sababidir. Operatsiya kengaygan venalarni bog\'lab, qon aylanishini tiklaydi.',
    davomiyligi: '45–90 daqiqa',
    anesteziya: 'Mahalliy yoki umumiy (klinikaga qarab)',
    yotish: 'Ko\'pincha o\'sha kuni uyga (statsionarsiz)',
    narxOraliq: 'Taxminan 3–7 mln so\'m',
    tiklanish: '5–7 kunda yengil ishga, 3 haftada to\'liq faollikka',
    tayyorgarlik: [
      'Operatsiyadan oldin spermogramma va qonda gormon tekshiruvi topshiriladi',
      'Operatsiyadan 6 soat oldin ovqat yemaslik (umumiy narkoz bo\'lsa)',
      'Aspirin va qonni suyultiruvchi dorilarni shifokor ruxsatisiz to\'xtatmang, avval ayting',
      'Chov sohasini tozalab (soqolab) kelish tavsiya etiladi',
    ],
    jarayon: [
      { sarlavha: 'Kichik kesma', matn: 'Chov sohasida 2–3 sm kichik kesma qilinadi.' },
      { sarlavha: 'Mikroskop', matn: 'Operatsion mikroskop ostida venalar arteriya va limfa yo\'llaridan ajratiladi — bu asoratlarni kamaytiradi.' },
      { sarlavha: 'Bog\'lash', matn: 'Faqat kengaygan venalar bog\'lanadi, arteriya va limfa saqlanadi.' },
      { sarlavha: 'Tikish', matn: 'Kesma ko\'pincha eriydigan ip bilan tikiladi, chandiq deyarli sezilmaydi.' },
    ],
    keyin: [
      'Dastlabki 2 kun chov sohasiga muzli kompress (10 daqiqadan) qo\'ying',
      '1 hafta og\'ir narsa ko\'tarmang va jinsiy aloqadan saqlaning',
      'Shifokor bergan og\'riq qoldiruvchi va antibiotikni to\'liq iching',
      'Natijani baholash uchun 3 oydan keyin qayta spermogramma topshiriladi',
    ],
    ogohlantiruvchiBelgilar: [
      'Harorat 38°C dan oshsa',
      'Yara qizarib, yiring yoki yomon hid chiqsa',
      'Moyak kuchli shishib, qattiq og\'risa',
    ],
  },
  {
    slug: 'gidrotsele',
    nom: 'Gidrotsele operatsiyasi',
    organ: 'Moyak pardasi',
    belgi: '💧',
    qisqa: 'Moyak atrofida to\'plangan suyuqlikni olib tashlash.',
    nimaUchun:
      'Moyak pardalari orasida ortiqcha suyuqlik yig\'ilib, moyak shishib ketadi (gidrotsele). Katta gidrotsele noqulaylik va og\'irlik hissi beradi. Operatsiya suyuqlikni chiqarib, uning qayta yig\'ilmasligi uchun pardani qayta shakllantiradi.',
    davomiyligi: '30–60 daqiqa',
    anesteziya: 'Mahalliy yoki umumiy',
    yotish: 'Ko\'pincha o\'sha kuni uyga',
    narxOraliq: 'Taxminan 2–5 mln so\'m',
    tiklanish: '1 haftada yengil faollik, 2–3 haftada to\'liq',
    tayyorgarlik: [
      'Umumiy qon va siydik tahlili topshiriladi',
      'Umumiy narkoz bo\'lsa 6 soat och qolish',
      'Chov sohasini tozalab kelish',
    ],
    jarayon: [
      { sarlavha: 'Kesma', matn: 'Yorg\'oq (moshonka) sohasida kichik kesma qilinadi.' },
      { sarlavha: 'Suyuqlikni chiqarish', matn: 'To\'plangan suyuqlik so\'rib olinadi.' },
      { sarlavha: 'Pardani qayta tikish', matn: 'Parda ag\'darib tikiladi — bu suyuqlik qayta yig\'ilmasligi uchun.' },
    ],
    keyin: [
      'Yorg\'oqni ko\'tarib turuvchi maxsus ich kiyim (suspenzoriy) kiyish shishni kamaytiradi',
      'Dastlabki kunlar muzli kompress',
      '2 hafta og\'ir jismoniy yuk va jinsiy aloqadan saqlanish',
    ],
    ogohlantiruvchiBelgilar: [
      'Kuchli shish yoki qon ketishi',
      'Harorat ko\'tarilishi',
      'Yara atrofida yiring',
    ],
  },
  {
    slug: 'sunnat',
    nom: 'Sunnat (xatna) — tibbiy ko\'rsatma bilan',
    organ: 'Jinsiy olat',
    belgi: '✂️',
    qisqa: 'Jinsiy olat boshini yopib turuvchi ortiqcha terini olib tashlash.',
    nimaUchun:
      'Fimoz (terining ochilmasligi), takroriy yallig\'lanish yoki gigiena muammolarida tibbiy ko\'rsatma bilan bajariladi. Ortiqcha teri olinib, olat boshi ochiq qoladi — bu tozalikni osonlashtiradi va yallig\'lanishlarni kamaytiradi.',
    davomiyligi: '20–40 daqiqa',
    anesteziya: 'Mahalliy (kattalar), umumiy (bolalar)',
    yotish: 'O\'sha kuni uyga',
    narxOraliq: 'Taxminan 1–3 mln so\'m',
    tiklanish: '7–10 kunda yara bitadi, 4 haftada to\'liq',
    tayyorgarlik: [
      'Yallig\'lanish bo\'lsa avval davolanadi',
      'Umumiy narkoz (bola) bo\'lsa och qolish',
      'Toza ich kiyim bilan kelish',
    ],
    jarayon: [
      { sarlavha: 'Og\'riqsizlantirish', matn: 'Soha to\'liq uyushtiriladi, og\'riq sezilmaydi.' },
      { sarlavha: 'Terini olish', matn: 'Ortiqcha teri aniq o\'lchamda kesib olinadi.' },
      { sarlavha: 'Tikish', matn: 'Eriydigan ip bilan tikiladi, ip o\'zi tushib ketadi.' },
    ],
    keyin: [
      'Yarani quruq va toza saqlang, shifokor aytgan malham suring',
      'Bo\'shroq ich kiyim kiying',
      'Kattalar 4 hafta jinsiy aloqadan saqlanadi',
      'Bolada siyish og\'riqli bo\'lsa iliq suvda siyish yengillashtiradi',
    ],
    ogohlantiruvchiBelgilar: [
      'To\'xtamaydigan qon ketishi',
      'Kuchli shish va qorayish',
      'Harorat va yiring',
    ],
  },
  {
    slug: 'tosh-urs-lazer',
    nom: 'Siydik yo\'li toshi — endoskopik lazer (URS)',
    organ: 'Siydik yo\'li / buyrak',
    belgi: '⚡',
    qisqa: 'Siydik yo\'lidagi toshni kesuvsiz, ichkaridan lazer bilan maydalash.',
    nimaUchun:
      'Siydik yo\'lida (yoki buyrakda) tiqilib qolgan tosh kuchli sanchiq, qon va infeksiyaga sabab bo\'ladi. Nozik kamera (endoskop) tabiiy siydik yo\'li orqali kiritiladi va tosh lazer bilan qumga aylantiriladi — tashqi kesma bo\'lmaydi.',
    davomiyligi: '30–90 daqiqa',
    anesteziya: 'Umumiy yoki spinal',
    yotish: '1 kun (ba\'zan o\'sha kuni)',
    narxOraliq: 'Taxminan 4–9 mln so\'m',
    tiklanish: '3–5 kunda odatdagi hayotga',
    tayyorgarlik: [
      'Siydik ekmasi (infeksiya bor-yo\'qligi) va KT/UZI tekshiruvi',
      'Infeksiya bo\'lsa avval antibiotik bilan davolanadi',
      'Narkoz uchun 6 soat och qolish',
    ],
    jarayon: [
      { sarlavha: 'Endoskop', matn: 'Nozik kamera siydik chiqarish yo\'li orqali toshga yetkaziladi.' },
      { sarlavha: 'Lazer', matn: 'Tosh lazer bilan mayda bo\'laklarga bo\'linadi.' },
      { sarlavha: 'Stent', matn: 'Ko\'pincha vaqtincha ichki naycha (stent) qo\'yiladi — shishni kamaytiradi, keyin olinadi.' },
    ],
    keyin: [
      'Kuniga 2–2.5 litr suv iching — qum yuvilib chiqadi',
      'Stent qo\'yilgan bo\'lsa yengil noqulaylik normal, uni belgilangan kunda oldiring',
      'Siydikda yengil qon 1–2 kun bo\'lishi mumkin',
      'Toshning tarkibini bilib, qaytalanmasligi uchun parhez tuziladi',
    ],
    ogohlantiruvchiBelgilar: [
      'Harorat va titroq (infeksiya belgisi)',
      'Umuman siya olmaslik',
      'Kuchayib boradigan qon ketishi',
    ],
  },
  {
    slug: 'tur-p',
    nom: 'Prostata adenomasi — TUR-P (endoskopik)',
    organ: 'Prostata',
    belgi: '🔷',
    qisqa: 'Kattalashgan prostatning siydik yo\'lini bo\'g\'ayotgan qismini ichkaridan olib tashlash.',
    nimaUchun:
      'Yoshi ulg\'aygan erkaklarda prostata kattalashib, siydik yo\'lini siqadi: siyish qiyinlashadi, tez-tez va tunda turib siyish, chala bo\'shash paydo bo\'ladi. Dori yordam bermasa, kattalashgan qism siydik yo\'li orqali (kesuvsiz) qirib olinadi va oqim tiklanadi.',
    davomiyligi: '60–90 daqiqa',
    anesteziya: 'Spinal yoki umumiy',
    yotish: '2–3 kun',
    narxOraliq: 'Taxminan 6–12 mln so\'m',
    tiklanish: '3–4 haftada to\'liq faollik',
    tayyorgarlik: [
      'PSA, siydik ekmasi, prostata UZI va oqim tezligi tekshiriladi',
      'Qonni suyultiruvchi dorilar shifokor nazorati ostida to\'xtatiladi',
      'Narkoz uchun och qolish',
    ],
    jarayon: [
      { sarlavha: 'Rezektoskop', matn: 'Maxsus asbob siydik yo\'li orqali prostataga yetkaziladi.' },
      { sarlavha: 'Qirish', matn: 'Bo\'g\'ayotgan to\'qima yupqa qatlamlab olib tashlanadi.' },
      { sarlavha: 'Kateter', matn: 'Vaqtincha siydik naychasi (kateter) qo\'yiladi, yuvib turiladi.' },
    ],
    keyin: [
      'Kateter olingach dastlab tez-tez va biroz og\'riq bilan siyish normal, asta yaxshilanadi',
      'Kuniga ko\'p suyuqlik iching',
      '4 hafta og\'ir yuk, velosiped va jinsiy aloqadan saqlaning',
      'Siydikda yengil qon 1–2 haftagacha bo\'lishi mumkin',
    ],
    ogohlantiruvchiBelgilar: [
      'Siya olmay qolish (siydik tutilishi)',
      'Ko\'p qon va laxta ketishi',
      'Harorat va titroq',
    ],
  },
  {
    slug: 'orxidopeksiya',
    nom: 'Tushmagan moyak — orxidopeksiya',
    organ: 'Moyak',
    belgi: '🧒',
    qisqa: 'Yorg\'oqqa tushmagan moyakni o\'z joyiga tushirib mahkamlash.',
    nimaUchun:
      'Ba\'zi o\'g\'il bolalarda moyak tug\'ilishdan yorg\'oqqa tushmay, chov kanalida qoladi. O\'z vaqtida tushirilmasa kelajakda bepushtlik va o\'sma xavfi ortadi. Operatsiya moyakni yorg\'oqqa tushirib mahkamlaydi.',
    davomiyligi: '45–90 daqiqa',
    anesteziya: 'Umumiy',
    yotish: 'Ko\'pincha o\'sha kuni yoki 1 kun',
    narxOraliq: 'Taxminan 3–6 mln so\'m',
    tiklanish: '1 haftada faol, 2–3 haftada to\'liq',
    tayyorgarlik: [
      'UZI bilan moyak joyi aniqlanadi',
      'Bola narkoz uchun belgilangan vaqt och qoladi',
      'Toza kiyim bilan kelish',
    ],
    jarayon: [
      { sarlavha: 'Topish', matn: 'Chov sohasida kichik kesma orqali moyak topiladi.' },
      { sarlavha: 'Bo\'shatish', matn: 'Moyak tizimchasi cho\'zilib, yorg\'oqqacha yetadigan qilinadi.' },
      { sarlavha: 'Mahkamlash', matn: 'Moyak yorg\'oq ichida maxsus cho\'ntakka joylashtirib mahkamlanadi.' },
    ],
    keyin: [
      'Bolaga tinch o\'yin rejimini bering, sakrash va velosipeddan 2 hafta saqlang',
      'Yara toza va quruq bo\'lsin',
      'Belgilangan kunda moyak joyini tekshirishga keling',
    ],
    ogohlantiruvchiBelgilar: [
      'Moyak yana yuqoriga tortilib qolsa',
      'Kuchli shish va qorayish',
      'Harorat',
    ],
  },
]

export function operatsiyaTop(slug: string): Operatsiya | undefined {
  return OPERATSIYALAR.find((o) => o.slug === slug)
}

// ── Operatsiyadan keyingi kuzatuv jadvali ─────────────────────────────
// Har bir bosqich operatsiya sanasidan necha kun o'tgach eslatiladi.
// Foydalanuvchi so'ragan reja: 1-kun, 7-kun, 1-oy, 3-oy, 6-oy.

export type PostOpBosqich = {
  kalit: string   // texnik kalit (guard uchun)
  kun: number     // operatsiyadan necha kun keyin
  nom: string     // qisqa nom
  sarlavha: string
  matn: string    // eslatma matni (push va sahifada)
}

export const POSTOP_JADVALI: PostOpBosqich[] = [
  {
    kalit: '1kun', kun: 1, nom: '1-kun',
    sarlavha: 'Operatsiyadan keyingi 1-kun',
    matn: 'Yarani quruq saqlang, muzli kompress qo\'ying va shifokor bergan og\'riq qoldiruvchini iching. Harorat 38°C dan oshsa yoki kuchli qon ketsa — darhol shifokorga murojaat qiling.',
  },
  {
    kalit: '7kun', kun: 7, nom: '7-kun',
    sarlavha: 'Operatsiyadan keyingi 7-kun',
    matn: 'Yara holatini tekshirish vaqti. Qizarish, yiring yoki og\'riq kuchaymaganini kuzating. Eriydigan bo\'lmagan ip qo\'yilgan bo\'lsa, uni olish uchun shifokorga yozilishni unutmang.',
  },
  {
    kalit: '1oy', kun: 30, nom: '1-oy',
    sarlavha: 'Operatsiyadan keyingi 1-oy',
    matn: 'Odatda odatdagi hayotga to\'liq qaytish davri. Nazorat ko\'rigidan o\'ting va zarur tekshiruvlarni topshiring. Og\'ir jismoniy yukni asta-sekin oshiring.',
  },
  {
    kalit: '3oy', kun: 90, nom: '3-oy',
    sarlavha: 'Operatsiyadan keyingi 3-oy',
    matn: 'Natijani baholash vaqti. Varikotsele yoki bepushtlik operatsiyasidan keyin qayta spermogramma topshiriladi. O\'zgarishlarni shifokor bilan muhokama qiling.',
  },
  {
    kalit: '6oy', kun: 180, nom: '6-oy',
    sarlavha: 'Operatsiyadan keyingi 6-oy',
    matn: 'Yakuniy nazorat ko\'rigi. Uzoq muddatli natija baholanadi va keyingi kuzatuv rejasi belgilanadi. O\'zingizni yaxshi his qilsangiz ham nazoratdan o\'ting.',
  },
]

// Berilgan operatsiya sanasidan bugungacha o'tgan kunlarga qarab bosqich holatini beradi.
export function postOpHolat(operatsiyaSana: string, bugun = new Date()) {
  const boshl = new Date(operatsiyaSana)
  boshl.setHours(0, 0, 0, 0)
  const b = new Date(bugun)
  b.setHours(0, 0, 0, 0)
  const otganKun = Math.round((b.getTime() - boshl.getTime()) / (24 * 3600 * 1000))
  return POSTOP_JADVALI.map((bosq) => ({
    ...bosq,
    otdi: otganKun >= bosq.kun,
    qoldi: Math.max(0, bosq.kun - otganKun),
  }))
}
