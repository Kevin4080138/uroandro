export type KlinikQadam = {
  savol: string
  variantlar: string[]
  togri: number
  izoh: string
}

export type KlinikHolat = {
  id: number
  sarlavha: string
  emoji: string
  bemor: string
  shikoyat: string
  tekshiruv: string
  qadamlar: KlinikQadam[]
  xulosa: string
}

// darsSlug → klinik holatlar
const KLINIK_HOLATLAR: Record<string, KlinikHolat[]> = {
  'h-varikotsele-kasalligi': [
    {
      id: 1,
      sarlavha: 'Yosh yigit va bolasizlik muammosi',
      emoji: '👨',
      bemor: '28 yoshli erkak, nikohda 2 yil, homiladorlik yo\'q.',
      shikoyat: 'Chap tomon chov sohasida og\'irlik hissi, ba\'zan og\'riq. Ish faoliyatida o\'zgarish yo\'q.',
      tekshiruv: 'Ko\'rikda: chap testisda to\'lqin uruvchi venalar palpatsiyada aniqlanadi (Valsalva sinamasida kuchayadi). O\'ng tomon — normal. Spermogramma: oligoastenozoospermiya. USI: chap pampiniform pleksus venalari 3.8 mm gacha kengaygan.',
      qadamlar: [
        {
          savol: 'Bu bemorga dastlab qaysi tashxisni qo\'yasiz?',
          variantlar: ['Epididimorxit', 'Chap tomon varikotsele', 'Gidrotsele', 'Spermatotsele'],
          togri: 1,
          izoh: 'Palpatsiyada to\'lqin uruvchi venalar + Valsalva sinamasida kuchayish + USI da 3.8 mm — bu varikotsele uchun klassik tasvir. Epididimorxit uchun og\'riq va isitma bo\'lishi kerak edi.',
        },
        {
          savol: 'WHO me\'yori bo\'yicha varikotsele uchun USI da venaning minimal diametri qancha bo\'lishi kerak?',
          variantlar: ['> 2 mm', '> 3 mm', '> 4 mm', '> 5 mm'],
          togri: 1,
          izoh: 'WHO tavsiyasi bo\'yicha pampiniform pleksus venalarining diametri > 3 mm (dam olish holatida yoki Valsalva paytida) bo\'lsa varikotsele deyiladi. Bizning bemorning 3.8 mm — bu chegara qiymatdan oshgan.',
        },
        {
          savol: 'Bemorga qaysi davolash usuli eng maqsadga muvofiq?',
          variantlar: ['Konservativ davolash (skrotal qo\'llab-quvvatlash)', 'Palomo operatsiyasi', 'Mikrojarrohlik varikotselectomiya (Marmar usuli)', 'Skleroterapiya'],
          togri: 2,
          izoh: 'Yoshli bemor, bolasizlik, klinik varikotsele — mikrojarrohlik usuli (Marmar/subingvinal) eng past retsidiv (< 1%) va eng kam yon ta\'sirga ega. Palomo ham qabul qilinishi mumkin, lekin gidrotsele xavfi yuqoriroq.',
        },
      ],
      xulosa: 'Varikotsele — erkak bepushtligining davolanuvchi sabablaridan biri. Klinik tashxis + USI + spermogramma kombinatsiyasi to\'g\'ri yo\'naltirish imkonini beradi. Mikrojarrohlik usuli zamonaviy standartda afzal ko\'riladi.',
    },
    {
      id: 2,
      sarlavha: 'O\'smirda aniqlanib qolgan varikotsele',
      emoji: '🧑',
      bemor: '15 yoshli o\'g\'il bola, maktab tibbiy ko\'rigi paytida aniqlangan.',
      shikoyat: 'Shikoyat yo\'q, tasodifan aniqlangan. Sport bilan shug\'ullanadi.',
      tekshiruv: 'Ko\'rikda: chap testisda \'qurt to\'pi\' ko\'rinishidagi venalar, o\'ng tomon normal. Testis hajmi: chap — 12 ml, o\'ng — 18 ml (chap testis atrofiyasi). Valsalva sinamasida kuchayadi. Gormonlar normal.',
      qadamlar: [
        {
          savol: 'O\'smirda varikotsele qaysi tomonda ko\'proq uchraydi?',
          variantlar: ['O\'ng tomon', 'Chap tomon', 'Ikki tomon teng', 'Ko\'pincha ikki tomonlama'],
          togri: 1,
          izoh: 'Varikotsele 80-90% hollarda chap tomonda uchraydi. Bu chap testikular venaning chap buyrak venasiga to\'g\'ri burchak ostida quyilishi bilan bog\'liq — bu gidrostatik bosimni oshiradi.',
        },
        {
          savol: 'Bemorning chap testisi kichikroq (12 ml vs 18 ml). Bu qanday nomlanadi?',
          variantlar: ['Giperspermiya', 'Ipsilateral testikular atrofiya', 'Orxit', 'Testikular torsion'],
          togri: 1,
          izoh: 'Bir tomon testisning kontralateral tomon bilan solishtirib 20% dan kichik bo\'lishi — ipsilateral testikular atrofiya. O\'smirlarda bu jarrohlikka absolyut ko\'rsatma hisoblanadi.',
        },
        {
          savol: 'Bu bemorga nima qilish kerak?',
          variantlar: ['Kuzatib turish, hech narsa qilmaslik', 'Darhol jarrohlik — testikular atrofiya bor', '6 oyda bir USI bilan kuzatuv', 'Gormon terapiyasi'],
          togri: 1,
          izoh: 'O\'smirlarda testikular atrofiya (> 20% hajm farqi) jarrohlik uchun absolyut ko\'rsatma. Kechiktirish sperm ishlab chiqarishni yanada yomonlashtiradi. Operatsiyadan so\'ng testis hajmini tiklash mumkin (\'catch-up growth\').',
        },
      ],
      xulosa: 'O\'smirda varikotsele bilan ipsilateral testikular atrofiya aniqlansa — kutish noto\'g\'ri. Erta jarrohlik testis funksiyasini saqlash va to\'g\'ri rivojlanishni ta\'minlaydi.',
    },
    {
      id: 3,
      sarlavha: 'Operatsiyadan keyin retsidiv',
      emoji: '🏥',
      bemor: '32 yoshli erkak, 1 yil oldin Palomo usuli bilan operatsiya qilingan.',
      shikoyat: 'Og\'riq yo\'q, ammo spermogramma yaxshilanmagan. Nazorat USI da venalar yana kengaygan.',
      tekshiruv: 'Ko\'rikda: chap tomon venalari palpatsiyada seziladi, lekin birlamchi operatsiyaga qaraganda kamroq. USI: 3.2 mm. Spermogramma: oldingi ko\'rsatkichlar o\'zgarmagan. Gidrotsele yo\'q.',
      qadamlar: [
        {
          savol: 'Palomo usulida retsidiv eng ko\'p qaysi sababdan kelib chiqadi?',
          variantlar: ['Operator xatosi', 'Kolateral venalarning rivojlanishi', 'Arteriyaning bog\'lanishi', 'Limfa tomirlarining shikastlanishi'],
          togri: 1,
          izoh: 'Palomo usulida yuqori ligatura qilinadi, lekin kolateral venalar (gubernakulum, kremasteral venalar) ligatura ostida qolishi mumkin. Bu venalar kengayib retsidivga olib keladi. Shu sababli zamonaviy standart — past (subingvinal/mikrojarrohlik) ligatura.',
        },
        {
          savol: 'Retsidivda qayta operatsiya uchun qaysi usul afzal?',
          variantlar: ['Yana Palomo', 'Mikrojarrohlik (Marmar usuli)', 'Skleroterapiya', 'Laparoskopiya'],
          togri: 1,
          izoh: 'Retsidiv varikotsele uchun mikrojarrohlik usuli eng maqsadga muvofiq — chunki aniq vizualizatsiya (mikroskop ostida) barcha kollateral venalarni bog\'lash imkonini beradi, arteriya va limfa tomirlarini saqlab qoladi.',
        },
        {
          savol: 'Palomo operatsiyasining eng ko\'p uchraydigan yon ta\'siri qaysi?',
          variantlar: ['Orxalgia', 'Gidrotsele', 'Testikular atrofiya', 'Infektsiya'],
          togri: 1,
          izoh: 'Palomo (retroperitoneal) usulida limfa tomirlari ko\'pincha bog\'lanadi yoki shikastlanadi. Bu limfostaz natijasida gidrotselega olib keladi — 7-30% holatlarda uchraydi. Shu sababli zamonaviy shifokorlar mikrojarrohlikni afzal ko\'radi.',
        },
      ],
      xulosa: 'Retsidiv varikotsele klinik amaliyotda uchrab turadi. Qayta jarrohlikda mikrojarrohlik usuli (Marmar) eng yaxshi natijalar beradi — retsidiv < 1%, gidrotsele < 1%. Birlamchi operatsiyada ham shu usul tanlansa maqsadga muvofiq.',
    },
  ],
}

export function klinikHolatlarOl(darsSlug: string): KlinikHolat[] {
  return KLINIK_HOLATLAR[darsSlug] ?? []
}
