export type Bosqich = {
  sarlavha: string
  matn: string
  svg: 'dush' | 'qollar' | 'aylantirish' | 'solishtirish' | 'jurnal' | 'kalendar' | 'shifokor' | 'kuzatish'
}

export type Yoriqnoma = {
  slug: string
  sarlavha: string
  organ: string
  qisqa: string
  davriylik: string
  bosqichlar: Bosqich[]
  ogohlantiruvchiBelgilar: string[]
  manba: string
}

export const OZ_TEKSHIRUV_YORIQNOMALARI: Yoriqnoma[] = [
  {
    slug: 'moyak-oz-tekshiruv',
    sarlavha: "Moyaklarni o'z-o'zini tekshirish (TSE)",
    organ: 'Moyaklar',
    qisqa: "Moyak saratoni va boshqa o'zgarishlarni erta aniqlash uchun oyiga bir marta bajariladigan oddiy tekshiruv.",
    davriylik: "Oyiga 1 marta, xohlasa har doim bir xil sanada (eslab qolish uchun qulay)",
    bosqichlar: [
      {
        sarlavha: '1-bosqich: Eng qulay vaqtni tanlang',
        matn: "Tekshiruv uchun eng yaxshi vaqt — issiq dush yoki vanna qabul qilingandan keyin. Issiq suv ta'sirida moshonka terisi bo'shashadi va moyaklarni qo'l bilan aniq sezish ancha osonlashadi.",
        svg: 'dush',
      },
      {
        sarlavha: '2-bosqich: Bir vaqtning o\'zida bitta moyakni tekshiring',
        matn: "Har bir moyakni ikki qo'l barmoqlari orasida (bosh barmoq ustda, qolgan barmoqlar ostda) yumshoq tarzda ushlab turing. Bunda biroz bosim bilan, lekin og'riq keltirmaydigan darajada ushlang.",
        svg: 'qollar',
      },
      {
        sarlavha: "3-bosqich: Moyakni barmoqlar orasida aylantirib his qiling",
        matn: "Moyak yuzasini barmoqlaringiz orasida yumshoq tarzda aylantirib, butun yuzasini his qiling. Sog'lom moyak silliq, bir xil tekstura (qattiqligi tuxumga o'xshash, lekin biroz qattiqroq) bo'ladi, qattiq tugunlar, do'mboqchalar yoki notekisliklarsiz.",
        svg: 'aylantirish',
      },
      {
        sarlavha: "4-bosqich: Epididimisni aniqlang va chalkashtirmang",
        matn: "Moyakning orqa-yuqori qismida ip yoki kichik nay shaklidagi tuzilma — epididimis (uruğ ortig'i) joylashgan. Bu tabiiy tuzilma, tugun yoki o'sma emas. Uni moyakning o'z to'qimasidan farqlay olishni o'rganib oling, shunda haqiqiy o'zgarishlarni aniqroq sezasiz.",
        svg: 'kuzatish',
      },
      {
        sarlavha: "5-bosqich: Ikki moyakni solishtiring",
        matn: "Ikkinchi moyak bilan ham xuddi shu tartibda tekshiruvni takrorlang va ikkisini bir-biri bilan solishtiring. Moyaklar hajmi bir-biridan biroz farq qilishi (odatda chap biroz pastroq osilib turishi) normal holat, lekin to'satdan paydo bo'lgan katta farq, og'riq, shish yoki og'irlik hissi e'tiborga olinishi kerak bo'lgan belgi.",
        svg: 'solishtirish',
      },
      {
        sarlavha: "6-bosqich: Natijani eslab qoling yoki yozib qo'ying",
        matn: "Har oylik tekshiruvdan keyin sezgan narsalaringizni (agar bo'lsa) eslab qoling. Vaqt o'tishi bilan o'z moyaklaringizning \"odatdagi\" holatini bilib olasiz va har qanday yangi o'zgarishni tezroq sezasiz.",
        svg: 'jurnal',
      },
    ],
    ogohlantiruvchiBelgilar: [
      "Moyakda qattiq tugun, do'mboqcha yoki notekislik (og'riqli yoki og'riqsiz)",
      "Moyak hajmi yoki shaklining sezilarli o'zgarishi",
      "Moshonkada og'irlik yoki tortilish hissi",
      "Moyak yoki moshonkada to'satdan paydo bo'lgan og'riq yoki noqulaylik",
      "Moshonka terisida shish yoki suyuqlik to'planishi",
      "Ko'krak bezlarining kattalashishi yoki sezgirligi (kamdan-kam, lekin gormonal o'zgarish belgisi bo'lishi mumkin)",
    ],
    manba: "Urology Care Foundation (AUA) va American Cancer Society — moyak saratoni erta aniqlash bo'yicha tavsiyalar.",
  },
  {
    slug: 'siydik-simptom-kuzatuv',
    sarlavha: "Siydik chiqarish simptomlarini kuzatish jurnali",
    organ: 'Prostata / Siydik pufagi',
    qisqa: "BPH va boshqa siydik yo'li muammolarini erta aniqlash uchun o'z simptomlaringizni tizimli kuzatish usuli.",
    davriylik: "Har kuni, 3-7 kun davomida (shifokorga ko'rsatish uchun)",
    bosqichlar: [
      {
        sarlavha: "1-bosqich: Siyish kalendarini boshlang",
        matn: "Bir necha kun (ideal holda 3-7 kun) davomida har safar siyganingizda vaqtni va taxminiy miqdorni (oz/o'rta/ko'p) yozib boring. Bu oddiy jurnal shifokorga aniq tashxis qo'yishda katta yordam beradi.",
        svg: 'kalendar',
      },
      {
        sarlavha: "2-bosqich: Tungi uyqu vaqtidagi siyishlarni alohida belgilang",
        matn: "Tunda necha marta siyish uchun uyg'onganingizni alohida qayd qiling (nokturiya). 2 va undan ortiq marta tungi siyish odatda qo'shimcha tekshiruv talab qiladigan belgi hisoblanadi.",
        svg: 'jurnal',
      },
      {
        sarlavha: "3-bosqich: Oqim sifatini baholang",
        matn: "Har safar siyish vaqtida oqim kuchini (kuchli/o'rtacha/zaif), boshlashda kuchanish kerak bo'lganini, oqim uzilib-uzilib ketganini va siydikdan keyin to'liq bo'shagan-bo'shamaganligingizni eslab qoling.",
        svg: 'kuzatish',
      },
      {
        sarlavha: "4-bosqich: IPSS testini topshiring",
        matn: "Yig'gan kuzatuvlaringiz asosida ilovadagi IPSS (Xalqaro prostata simptomlari indeksi) testini to'ldiring — bu simptomlaringiz og'irlik darajasini standartlashtirilgan tarzda baholaydi va shifokoringizga aniqroq ma'lumot beradi.",
        svg: 'jurnal',
      },
      {
        sarlavha: "5-bosqich: Natijalarni shifokorga ko'rsating",
        matn: "Kuzatuv jurnalingiz va IPSS natijasini keyingi qabulda shifokoringizga ko'rsating yoki ilova orqali murojaat sifatida yuboring — bu tashxis va davolash rejasini tezroq aniqlashtirishga yordam beradi.",
        svg: 'shifokor',
      },
    ],
    ogohlantiruvchiBelgilar: [
      "Siydikda qon (pushti, qizil yoki jigarrang rang)",
      "Siyishda kuchli og'riq yoki achishish",
      "Siydik to'liq to'xtab qolishi (siyolmaslik)",
      "Yuqori harorat bilan birga keluvchi bel/yon qorin og'rig'i",
      "Kutilmagan vazn yo'qotish bilan birga davom etayotgan siyish simptomlari",
    ],
    manba: "EAU Guidelines on Non-neurogenic Male LUTS; IPSS — AUA Symptom Index.",
  },
]

export function yoriqnomaTop(slug: string) {
  return OZ_TEKSHIRUV_YORIQNOMALARI.find((y) => y.slug === slug)
}
