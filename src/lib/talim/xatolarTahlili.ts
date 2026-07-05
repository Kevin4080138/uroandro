export type XatoVariant = {
  matn: string
  togri: boolean
  izoh: string
}

export type XatoTahlil = {
  id: number
  sarlavha: string
  emoji: string
  vaziyat: string
  notogriqaror: string
  savol: string
  variantlar: XatoVariant[]
  togriYol: string
}

const XATOLAR_TAHLILI: Record<string, XatoTahlil[]> = {
  'h-varikotsele-kasalligi': [
    {
      id: 1,
      sarlavha: 'O\'ng tomon varikotsele: shifokor nima qildi?',
      emoji: '⚠️',
      vaziyat:
        '45 yoshli erkak tekshiruv paytida o\'ng skrotumda venalar kengayishi aniqlandi. Shifokor USI buyurmay, darhol o\'ng tomon varikotselectomiya rejalashtirib, operatsiya tayyorgarligini boshladi.',
      notogriqaror:
        'Shifokor o\'ng tomon varikotsele uchun hech qanday qo\'shimcha tekshiruvsiz darhol jarrohlikka yubordi.',
      savol: 'Bu holda shifokorning asosiy xatosi nima?',
      variantlar: [
        {
          matn: 'Jarrohlik usulini noto\'g\'ri tanlagan',
          togri: false,
          izoh: 'Jarrohlik usuli hali tanlanmagan — muammo undan oldin. Asosiy xato boshqa joyda.',
        },
        {
          matn: 'O\'ng tomon varikotsele — buyrak o\'smasini istisno qilmagan',
          togri: true,
          izoh: 'To\'g\'ri. O\'ng tomon varikotsele — XAVFLI BELGI. Bu ko\'pincha o\'ng buyrak venasini qisib qo\'yuvchi o\'sma (buyrak hujayrali saratoni) belgisi bo\'lishi mumkin. Avval KT yoki USI bilan buyrakni tekshirish MAJBURIY. O\'ng tomonda varikotsele chap tomonga qaraganda ancha kam uchraydi — shuning uchun har doim etiologiyasini aniqlash kerak.',
        },
        {
          matn: 'Spermogramma buyurmagan',
          togri: false,
          izoh: 'Spermogramma muhim, lekin bu holatdagi BIRINCHI va ENG MUHIM xato emas. Jarrohlikka ketishdan oldin buyrak patologiyasini istisno qilish hayotiy ahamiyatga ega.',
        },
        {
          matn: 'Bemor yoshiga e\'tibor bermagan',
          togri: false,
          izoh: '45 yosh varikotsele uchun g\'ayrioddiy emas. Muammo yosh emas — o\'ng tomonlama lokalizatsiya va buyrak tekshiruvining o\'tkazilmaganidir.',
        },
      ],
      togriYol:
        'O\'ng tomon varikotsele aniqlanganda AVVALO buyrak USI yoki KT qilinishi shart. Buyrak o\'smasi istisno qilingandan keyingina varikotselectomiya rejalashtiriladi. Bu qoida hayot saqlovchi ahamiyatga ega.',
    },
    {
      id: 2,
      sarlavha: 'O\'smirda \'kuzatib turish\' qarori',
      emoji: '🧑',
      vaziyat:
        '14 yoshli o\'g\'il bolada maktab ko\'rigi paytida chap tomon varikotsele aniqlandi. USI da: chap testis 10 ml, o\'ng testis 19 ml. Shifokor: "Hozircha hech narsa qilmaylik, o\'sib-ulg\'ayganida ko\'ramiz" deb yubordi.',
      notogriqaror:
        'Shifokor o\'smirda testikular atrofiya bor ekaniga qaramay kuzatuv taktikasini tanladi.',
      savol: 'Bu taktikaning asosiy kamchiligi nima?',
      variantlar: [
        {
          matn: 'O\'smirlarda varikotsele o\'z-o\'zidan yo\'qoladi',
          togri: false,
          izoh: 'Noto\'g\'ri. Varikotsele o\'z-o\'zidan regressiya qilmaydi. Bu fikr mutlaqo asossiz va kutish testis funksiyasiga zarar etkazadi.',
        },
        {
          matn: 'Chap testis hajmi o\'ng tomonidan > 20% kichik — bu jarrohlikka absolyut ko\'rsatma',
          togri: true,
          izoh: 'To\'g\'ri. 10 ml vs 19 ml — bu deyarli 47% hajm farqi. Ipsilateral testikular atrofiya (> 20% hajm farqi) o\'smirlarda varikotselectomiya uchun absolyut ko\'rsatma. Kechiktirish spermatogenezni yanada buzadi. Erta operatsiyadan so\'ng testis o\'sishi (\'catch-up growth\') mumkin.',
        },
        {
          matn: 'O\'smirlarda operatsiya qilish xavfli',
          togri: false,
          izoh: 'Noto\'g\'ri. O\'smirlarda mikrojarrohlik xavfsiz va muvaffaqiyatli o\'tkaziladi. Aksincha, kechiktirish testis funksiyasini qaytarib bo\'lmas darajada buzishi mumkin.',
        },
        {
          matn: 'Gormonlarni avval tekshirish kerak edi',
          togri: false,
          izoh: 'Gormonlar foydali ma\'lumot beradi, lekin bu holatda asosiy xato emas. Testis atrofiyasi aniq — bu yetarli ko\'rsatma. Gormon tekshiruvi kuzatuv elementlaridan biri, lekin operatsiyani kechiktirishni oqlashi mumkin emas.',
        },
      ],
      togriYol:
        'O\'smirlarda varikotsele + testikular atrofiya (> 20% hajm farqi) = jarrohlik. Kutish noto\'g\'ri. Erta varikotselectomiyadan so\'ng testis hajmi tiklana boshlaydi va kelajakdagi fertilligi saqlanadi.',
    },
    {
      id: 3,
      sarlavha: 'Bepushtlikda \'dori bilan davolash\'',
      emoji: '💊',
      vaziyat:
        '29 yoshli erkak 1.5 yildan beri homiladorlik bo\'lmayapti. Ko\'rikda: chap Gr.II varikotsele, Valsalva sinamasida yaqqol venalar palpatsiyada aniqlanadi. Spermogramma: oligoastenozoospermiya. Juftligida patologiya yo\'q. Shifokor 6 oy davomida L-karnitin + vitamin E buyurdi.',
      notogriqaror:
        'Klinik varikotsele + bepushtlik holatida shifokor jarrohliksiz faqat konservativ davolashni tanladi.',
      savol: 'Bu yondashuvning asosiy muammosi nima?',
      variantlar: [
        {
          matn: 'L-karnitin varikotsele uchun umuman ko\'rsatilmagan',
          togri: false,
          izoh: 'L-karnitin sperm uchun foydali bo\'lishi mumkin, lekin bu holatdagi muammo dori tanlovi emas. Asosiy masala — jarrohlik o\'rniga faqat dorini tanlashdir.',
        },
        {
          matn: 'Klinik varikotsele + bepushtlikda WHO tavsiyasiga ko\'ra jarrohlik birinchi navbatdagi tanlovi',
          togri: true,
          izoh: 'To\'g\'ri. WHO (2021) va EAU qo\'llanmalariga ko\'ra: klinik varikotsele + bepushtlik + normal juftlik tekshiruvi → varikotselectomiya tavsiya etiladi. Konservativ davolash jarrohlik samarasiga teng emas. Dorini berish vaqt yo\'qotish va bemorda noto\'g\'ri umid uyg\'otadi.',
        },
        {
          matn: '6 oy muddati juda qisqa edi, kamida 1 yil kutish kerak',
          togri: false,
          izoh: 'Noto\'g\'ri. Allaqachon 1.5 yil bepushtlik — bu etarli muddat. Yana kutish yanada to\'g\'ri emas. Tashxis aniq, ko\'rsatma bor — harakatlanish vaqti kelgan.',
        },
        {
          matn: 'Avval ART (EKO/ICSI) tavsiya qilish kerak edi',
          togri: false,
          izoh: 'Noto\'g\'ri. EKO/ICSI — jarrohlik muvaffaqiyatsiz bo\'lgandan keyingi qadam. Klinik varikotsele bor va davolanuvchi — avval varikotselectomiya, sperm yaxshilanishi kutiladi. EKO ga to\'g\'ridan-to\'g\'ri o\'tish resurslarni behuda sarflash.',
        },
      ],
      togriYol:
        'Klinik varikotsele + bepushtlik + normal juftlik tekshiruvi = varikotselectomiya. Bu davolash samarali (spermogramma 60-80% da yaxshilanadi) va arzon. Konservativ davolash faqat subklinik varikotsele yoki jarrohlikka qarshi ko\'rsatma bo\'lganda tanlanadi.',
    },
    {
      id: 4,
      sarlavha: 'Epididimorxit tashxisi bilan ketdi',
      emoji: '🔴',
      vaziyat:
        '22 yoshli yigit chap testisda og\'irlik hissi va engil noqulaylik bilan keldi. Harorati 36.6°C, leykotsitoz yo\'q. Ko\'rikda shifokor chap testis usti biroz sezgir deb topdi. USI buyurmay, "epididimorxit" deb 10 kunlik antibiotik kursi yozdi.',
      notogriqaror:
        'Shifokor varikotsele ehtimolini ko\'rib chiqmay, antibiotik yozdi.',
      savol: 'Bu xatoning asosi nima va nima qilish kerak edi?',
      variantlar: [
        {
          matn: 'Epididimorxit uchun antibiotik kursi juda qisqa edi',
          togri: false,
          izoh: 'Muammo kurs uzunligida emas. Tashxisning o\'zi noto\'g\'ri qo\'yilgan bo\'lishi mumkin.',
        },
        {
          matn: 'Isitma va leykotsitoz yo\'q — infektsion etiologiya shubhali, varikotsele istisno qilinmagan',
          togri: true,
          izoh: 'To\'g\'ri. Epididimorxit uchun odatda isitma, leykotsitoz, siydikda leykotsitlar bo\'ladi. Bu bemorning harorati normal, infeksiya belgilari yo\'q. Og\'irlik hissi + yosh erkak = varikotsele ko\'rsatmasida ko\'rik o\'tkazish va USI buyurish kerak edi. Valsalva sinami ham o\'tkazilmagan.',
        },
        {
          matn: 'Antibiotik o\'rniga og\'riq qoldiruvchi berish kerak edi',
          togri: false,
          izoh: 'Simptomatik davolash ham noto\'g\'ri — chunki asosiy muammo aniqlanmagan. Varikotsele bo\'lsa, antibiotik ham, analgetik ham klinik muammoni hal qilmaydi.',
        },
        {
          matn: 'Bemor yoshiga qarab prostatit tashxisini ko\'rib chiqish kerak edi',
          togri: false,
          izoh: '22 yoshli erkakda prostatit kam uchraydi. Simptomlar prostatit bilan mos kelmaydi (siydik yo\'li belgilari yo\'q). Varikotsele bu yoshda eng ko\'p uchraydigan skrotal patologiya.',
        },
      ],
      togriYol:
        'Isitma va infeksiya belgilari yo\'q bo\'lganda og\'riqsiz/engillik hissidagi skrotal muammo uchun avvalo varikotsele, gidrotsele, spermatotsele ko\'rib chiqilishi kerak. Ko\'rik (Valsalva bilan, turgan holda) + USI — birinchi qadam. Differensial tashxizsiz antibiotik yozish noto\'g\'ri.',
    },
    {
      id: 5,
      sarlavha: 'Mikrojarrohlik o\'rniga Palomo — to\'g\'ri qarormi?',
      emoji: '🔪',
      vaziyat:
        '31 yoshli erkakda chap Gr.II varikotsele + spermogramma yomonlashgan. Shifokor Palomo (retroperitoneal) usulini tanladi. 4 oy o\'tib bemor chap skrotumda og\'riqsiz suyuqlik to\'planishi (gidrotsele) bilan qaytdi. Spermogramma yaxshilanmadi.',
      notogriqaror:
        'Birlamchi davolashda zamonaviy standart usul o\'rniga Palomo operatsiyasi tanlandi.',
      savol: 'Palomo usulida gidrotsele ko\'p uchraydigan sababi nima?',
      variantlar: [
        {
          matn: 'Testikular arteriya bog\'langan',
          togri: false,
          izoh: 'Arteriya shikastlanishi testikular atrofiyaga olib keladi, gidrotselega emas. Palomo usulida arteriya odatda ko\'rinadi va saqlanishga harakat qilinadi.',
        },
        {
          matn: 'Limfa tomirlari bog\'langan yoki shikastlangan',
          togri: true,
          izoh: 'To\'g\'ri. Palomo (retroperitoneal, yuqori) usulida limfa tomirlari venalar bilan birgalikda bog\'lanib ketishi mumkin. Limfostaz natijasida gidrotsele rivojlanadi — bu 7-30% hollarda kuzatiladi. Mikrojarrohlikda esa limfa tomirlari mikroskop ostida aniq ko\'rinadi va saqlanadi, shuning uchun gidrotsele xavfi < 1%.',
        },
        {
          matn: 'Operatsiya sohasi infektsiyalangan',
          togri: false,
          izoh: 'Infeksion gidrotsele kam uchraydi va u og\'riq, isitma bilan kechadi. Bu bemorda og\'riqsiz — sof limfostaz gidrotselesi.',
        },
        {
          matn: 'Venalar to\'liq bog\'lanmagan, qon to\'planmoqda',
          togri: false,
          izoh: 'Qon to\'planishi (gematoma) og\'riqli va tez rivojlanadi. Og\'riqsiz, sekin rivojlangan kengayish — limfostaz gidrotselasini ko\'rsatadi.',
        },
      ],
      togriYol:
        'Zamonaviy standartda birlamchi varikotsele davolash uchun mikrojarrohlik (Marmar/subingvinal) tavsiya etiladi: retsidiv < 1%, gidrotsele < 1%, sperm yaxshilanishi yuqori. Palomo usuli eskirgan va gidrotsele asoratlari ko\'p. Bu bemorga endi skleroterapiya yoki mikrojarrohlik qayta operatsiyasi kerak.',
    },
  ],
}

export function xatolarTahliliOl(darsSlug: string): XatoTahlil[] {
  return XATOLAR_TAHLILI[darsSlug] ?? []
}
