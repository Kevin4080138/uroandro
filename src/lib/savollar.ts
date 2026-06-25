export type Savol = {
  savol: string
  javob: string[] // har bir elementi alohida paragraf
  kategoriya: string
}

export const SAVOL_KATEGORIYALARI = [
  'Hammasi', 'Umumiy', 'Prostata', 'Erkak salomatligi', 'Tekshiruvlar', 'Operatsiya', 'Ilova haqida',
] as const

export const SAVOLLAR: Savol[] = [
  // UMUMIY
  {
    kategoriya: 'Umumiy',
    savol: "Qachon urologga murojaat qilishim kerak?",
    javob: [
      "Quyidagi belgilardan biri bo'lsa, urologga murojaat qilish tavsiya etiladi: siydikda qon (gematuriya), siyishda og'riq yoki achishish, tez-tez siyish yoki tunda bir necha marta siyish uchun turish, siyish oqimi zaiflashishi yoki to'liq bo'shamaslik hissi, bel yoki yon qorin sohasidagi kuchli og'riq, moyak yoki jinsiy a'zo sohasidagi og'riq yoki shish, erektil disfunksiya yoki bepushtlik muammosi.",
      "Shoshilinch yordam talab qiladigan holatlar: to'satdan boshlangan kuchli bel/yon qorin og'rig'i (toshli kolika), siydik to'liq to'xtab qolishi (siydik chiqmasligi), moyakda to'satdan boshlangan kuchli og'riq (torsiya ehtimoli — bu holatda har bir soat muhim, 6 soat ichida murojaat qilinishi kerak).",
    ],
  },
  {
    kategoriya: 'Umumiy',
    savol: "Murojaat (shikoyat) yuborgandan keyin javob qachon keladi?",
    javob: [
      "Murojaatingiz shifokorlar navbatiga tushadi va odatda 24 soat ichida ko'rib chiqiladi. Murojaat holatini (\"Yuborildi\" → \"Ko'rib chiqilmoqda\" → \"Javob berildi\") \"Mening murojaatlarim\" bo'limidan kuzatib borishingiz mumkin.",
      "Agar holat o'tkir bo'lsa (kuchli og'riq, qon ketishi, yuqori harorat) — ilovada javob kutmasdan, eng yaqin tibbiy muassasaga yoki shoshilinch yordamga murojaat qiling.",
    ],
  },
  {
    kategoriya: 'Umumiy',
    savol: "Mening shaxsiy va tibbiy ma'lumotlarim maxfiy saqlanadimi?",
    javob: [
      "Ha. Sizning shikoyatingiz, tibbiy tarixingiz va tahlil natijalaringiz faqat siz murojaat yuborgan yoki sizga biriktirilgan shifokorga ko'rinadi. Boshqa bemorlar yoki ruxsatsiz shaxslar sizning ma'lumotlaringizni ko'ra olmaydi.",
      "Tizim darajasida ma'lumotlar bazasi xavfsizlik qoidalari (Row Level Security) orqali himoyalangan — bu har bir foydalanuvchi faqat o'ziga tegishli yoki ruxsat berilgan ma'lumotni ko'rishini ta'minlaydi.",
    ],
  },
  // PROSTATA
  {
    kategoriya: 'Prostata',
    savol: "PSA natijam yuqori chiqdi — bu saraton degani emasmi?",
    javob: [
      "Yo'q, albatta emas. PSA (Prostate-Specific Antigen) prostata saratoniga xos emas — uning darajasi BPH (prostatanning yosh bilan tabiiy kattalashishi), prostatit (yallig'lanish), hatto so'nggi 48 soat ichidagi jinsiy aloqadan keyin ham vaqtincha ko'tarilishi mumkin.",
      "Yuqori PSA — bu qo'shimcha tekshiruv (yoshga moslashgan me'zon bilan solishtirish, erkin/umumiy PSA nisbati, prostata MRT, zarur bo'lsa biopsiya) kerakligini bildiradi, tashxis emas. Shifokoringiz natijani boshqa ko'rsatkichlar bilan birga baholaydi.",
    ],
  },
  {
    kategoriya: 'Prostata',
    savol: "BPH (prostata kattalashishi) saratonga aylanib qoladimi?",
    javob: [
      "Yo'q. BPH (Benign Prostatic Hyperplasia) — prostata to'qimasining saratonsiz (benign) o'sishi va u saratonga aylanmaydi. Ikkisi alohida, bir-biriga bog'liq bo'lmagan holatlar bo'lib, ba'zan bir xil bemorda ikkalasi parallel uchrashi mumkin, lekin biri ikkinchisiga sabab bo'lmaydi.",
      "BPH asosan tez-tez siyish, oqim zaiflashishi kabi hayot sifatiga ta'sir qiluvchi simptomlar beradi, ammo hayot uchun xavf tug'dirmaydi va samarali davolanadi.",
    ],
  },
  {
    kategoriya: 'Prostata',
    savol: "Tez-tez siyish va tunda bir necha marta turish normal holmi?",
    javob: [
      "Yoshga qarab tungi 0-1 marta turish normal hisoblanadi. 2 va undan ortiq marta tungi siyish (nokturiya) odatda BPH, qandli diabet, yurak yetishmovchiligi yoki ortiqcha suyuqlik iste'moli bilan bog'liq bo'lishi mumkin.",
      "Agar bu holat bir necha hafta davom etayotgan bo'lsa, IPSS (Xalqaro prostata simptomlari indeksi) testini topshirib, urologga murojaat qiling — bu kuzatuv yoki dorivor davolash kerakligini aniqlashtirishga yordam beradi.",
    ],
  },
  {
    kategoriya: 'Prostata',
    savol: "Prostata massaji foydali yoki zararlimi?",
    javob: [
      "Prostata massaji faqat tibbiy ko'rsatma bo'yicha (masalan, prostata sekretini tahlil uchun olish maqsadida) shifokor tomonidan bajariladi va bu tashxis maqsadidagi tibbiy muolaja, \"sog'lomlashtirish\" vositasi emas.",
      "O'tkir bakterial prostatit gumon qilinganda prostata massaji bajarilmaydi — bu infeksiyaning qonga tarqalishi (sepsis) xavfini oshirishi mumkin. Har qanday holatda bu muolaja faqat shifokor ko'rsatmasi bilan amalga oshirilishi kerak.",
    ],
  },
  // ERKAK SALOMATLIGI
  {
    kategoriya: 'Erkak salomatligi',
    savol: "Varikotsele har doim operatsiya talab qiladimi?",
    javob: [
      "Yo'q. Agar varikotsele simptomsiz bo'lsa, spermogramma normal bo'lsa va bepushtlik shikoyati bo'lmasa — oddiy kuzatuv tavsiya etiladi, operatsiya shart emas.",
      "Jarrohlik davolash asosan quyidagi hollarda ko'rib chiqiladi: bepushtlik bilan birga patologik spermogramma, doimiy og'riq, yoki o'smirlarda moyak hajmining progressiv kichrayishi (gipotrofiya).",
    ],
  },
  {
    kategoriya: 'Erkak salomatligi',
    savol: "Erektil disfunksiya faqat keksalikda bo'ladimi?",
    javob: [
      "Yo'q, erektil disfunksiya har qanday yoshda uchrashi mumkin. Yosh erkaklarda ko'pincha psixogen sabablar (stress, tashvishlanish, munosabatlardagi muammolar) ustunlik qiladi, yosh ulg'ayishi bilan esa organik sabablar (qon tomir, asab, gormonal) ko'proq uchraydi.",
      "Bu holat ko'pincha davolanadi — sabab aniqlangandan keyin hayot tarzi o'zgarishi, dorivor davo (PDE5 inhibitorlari) yoki boshqa usullar bilan samarali yordam berish mumkin. Bu mavzuda uyalmasdan shifokorga murojaat qilish muhim, chunki ED ko'pincha yurak-qon tomir kasalliklarining erta belgisi bo'lishi mumkin.",
    ],
  },
  {
    kategoriya: 'Erkak salomatligi',
    savol: "Spermogramma natijasi yomon bo'lsa, bola ko'rish imkoni yo'qmi?",
    javob: [
      "Yo'q, bunday xulosa chiqarish to'g'ri emas. Spermogramma ko'rsatkichlari (konsentratsiya, harakatchanlik, morfologiya) past bo'lishi bepushtlik xavfini oshiradi, lekin bu mutlaqo bola ko'ra olmaslik degani emas — ko'p hollarda davolash (sababga qarab: varikotsele operatsiyasi, gormonal terapiya, infeksiyani davolash, hayot tarzi o'zgarishi) orqali ko'rsatkichlar yaxshilanadi.",
      "Bitta tahlil natijasi yetarli emas — natijalar kun sayin o'zgarib turishi mumkin, shuning uchun odatda 2-3 oydan keyin qayta tahlil tavsiya etiladi va yakuniy xulosa faqat shifokor tomonidan, to'liq tekshiruv asosida chiqariladi.",
    ],
  },
  // TEKSHIRUVLAR
  {
    kategoriya: 'Tekshiruvlar',
    savol: "Spermogramma topshirishdan oldin qanday tayyorlanish kerak?",
    javob: [
      "Tahlildan oldin 2-7 kun (optimal — 3-5 kun) jinsiy aloqa va onanizmdan saqlanish kerak — bu davr ko'p bo'lsa, harakatchanlik pasayishi, kam bo'lsa, konsentratsiya pastligi natijaga ta'sir qilishi mumkin.",
      "Tahlildan oldin kamida 2-3 kun alkogol, sauna/issiq vannadan saqlanish, shuningdek yuqori haroratga (masalan, uzoq avtomobil haydash) uzoq vaqt ta'sirlanmaslik tavsiya etiladi — bular sperma sifatiga vaqtincha salbiy ta'sir qiladi.",
    ],
  },
  {
    kategoriya: 'Tekshiruvlar',
    savol: "Prostata/buyrak USI qilishdan oldin qovuq to'la bo'lishi kerakmi?",
    javob: [
      "Ha, abdominal (qorin orqali) prostata yoki siydik pufagi USI qilinishidan oldin qovuq to'la bo'lishi kerak — odatda tekshiruvdan 1-1.5 soat oldin siyishni to'xtatib, 0.5-1 litr suv ichish tavsiya etiladi. To'la qovuq prostata va qovuqni aniqroq ko'rishga yordam beradi.",
      "Transrektal USI (TRUS) uchun esa, aksincha, qovuqni to'la qilish shart emas, bu haqda shifokoringiz aniq ko'rsatma beradi. Buyrak USI uchun maxsus tayyorgarlik odatda kerak emas, lekin shifokor ko'rsatmasiga amal qilish tavsiya etiladi.",
    ],
  },
  {
    kategoriya: 'Tekshiruvlar',
    savol: "Siydikda qon (gematuriya) doim xavfli belgimi?",
    javob: [
      "Siydikda qon ko'rinishi (makrogematuriya) yoki tahlilda aniqlanishi (mikrogematuriya) har doim qo'shimcha tekshiruv talab qiladigan belgi hisoblanadi, lekin har doim jiddiy kasallik degani emas — sabab oddiy infeksiyadan (sistit) tortib, toshlardan, jarohatdan yoki kamdan-kam hollarda o'simta jarayonlardan iborat bo'lishi mumkin.",
      "Har qanday holatda, gematuriya aniqlangach, sababini topish uchun siydik tahlili, USI va zarur bo'lsa qo'shimcha tekshiruvlar (sistoskopiya, KT) o'tkazish uchun urologga murojaat qiling — buni \"o'z-o'zidan o'tib ketadi\" deb e'tiborsiz qoldirmaslik kerak.",
    ],
  },
  // OPERATSIYA
  {
    kategoriya: 'Operatsiya',
    savol: "Varikotsele operatsiyasidan keyin necha kun tiklanish kerak?",
    javob: [
      "Marmar (mikrojarrohlik) usulida odatda 1-2 kun stasionarda kuzatuv, so'ngra 1-2 hafta davomida og'ir jismoniy yuklamadan (sport, og'ir yuk ko'tarish) saqlanish tavsiya etiladi. To'liq jismoniy faollikka qaytish odatda 3-4 hafta ichida mumkin bo'ladi.",
      "Jinsiy hayotga qaytish odatda jarrohdan tasdiq olingandan keyin, taxminan 1-2 hafta ichida mumkin — bu individual holatga bog'liq, shuning uchun shifokoringiz tavsiyasiga amal qiling.",
    ],
  },
  {
    kategoriya: 'Operatsiya',
    savol: "Operatsiyadan keyin qachon nazorat ko'rigiga kelishim kerak?",
    javob: [
      "Odatda birinchi nazorat ko'rigi operatsiyadan 7-10 kun o'tgach belgilanadi — bu vaqtda jarohat holati tekshiriladi va agar tikuvlar erimaydigan turdan bo'lsa, ular olib tashlanadi.",
      "Aniq sana va keyingi nazoratlar jadvali sizning shifokoringiz tomonidan chiqaruv epikrizida (hujjatda) ko'rsatiladi — bu tavsiyalarga qat'iy amal qilish asoratlarning oldini olishda muhim.",
    ],
  },
  {
    kategoriya: 'Operatsiya',
    savol: "Mahalliy anesteziya (og'riqsizlantirish) ostida og'riq sezamanmi?",
    javob: [
      "Mahalliy anesteziya operatsiya qilinadigan sohani his sezishdan to'liq mahrum qiladi, shuning uchun operatsiya jarayonida og'riq sezilmaydi — faqat ba'zida bosim yoki tortilish hissi bo'lishi mumkin, bu normal holat.",
      "Operatsiyadan keyin, anesteziya ta'siri tugagach, engil og'riq yoki noqulaylik bo'lishi mumkin — bu uchun shifokor tavsiya etgan og'riqsizlantiruvchi dorilarni belgilangan tartibda qabul qiling.",
    ],
  },
  // ILOVA HAQIDA
  {
    kategoriya: 'Ilova haqida',
    savol: "Murojaatimni aniq shifokorga yuborishim mumkinmi yoki umumiy navbatga tushadimi?",
    javob: [
      "Ikkalasi ham mumkin. Murojaat yuborishda siz xohlagan aniq shifokorni tanlashingiz mumkin, yoki \"umumiy navbat\"ga yuborib, birinchi bo'sh shifokor murojaatingizni qabul qilishini kutishingiz mumkin — bu javobni tezroq olish imkonini beradi.",
    ],
  },
  {
    kategoriya: 'Ilova haqida',
    savol: "Shifokor javobini o'qiganimni qanday bilishadi?",
    javob: [
      "Siz shifokor javobini ochib o'qiganingizdan so'ng, tizim avtomatik tarzda buni belgilaydi va shifokor tomonida \"✓✓ Bemor ko'rdi\" ko'rsatkichi paydo bo'ladi — bu shifokorga javobingizni qabul qilganingizni bildiradi.",
    ],
  },
  {
    kategoriya: 'Ilova haqida',
    savol: "Ro'yxatdan o'tishda nima uchun email emas, telefon raqami so'raladi?",
    javob: [
      "Bemorlar uchun ro'yxatdan o'tish va kirish jarayonini soddalashtirish maqsadida ism-familiya va telefon raqami orqali kirish tizimi joriy qilingan — bu email manzili bo'lmagan yoki undan foydalanish qiyin bo'lgan foydalanuvchilar uchun ham qulay.",
    ],
  },
]

export function savolQidir(matn: string, royxat: Savol[]) {
  const q = matn.trim().toLowerCase()
  if (!q) return royxat
  return royxat.filter((s) => s.savol.toLowerCase().includes(q) || s.javob.some((j) => j.toLowerCase().includes(q)))
}
