export type InteraktivTanlov = {
  matn: string
  togri: boolean
  izoh: string
}

export type InteraktivQadam = {
  tur: 'anamnez' | 'tekshiruv' | 'tahlil' | 'tashxis' | 'davolash'
  sarlavha: string
  savol: string
  variantlar: InteraktivTanlov[]
}

export type InteraktivCase = {
  id: number
  sarlavha: string
  emoji: string
  dastlabkiMalumot: string
  qadamlar: InteraktivQadam[]
  xulosa: string
}

const INTERAKTIV_CASELAR: Record<string, InteraktivCase[]> = {
  'h-varikotsele-kasalligi': [
    {
      id: 1,
      sarlavha: 'Siz uroloq-jarrohsiz: bolasizlik bilan kelgan bemor',
      emoji: '🩺',
      dastlabkiMalumot:
        '27 yoshli Jasur 2 yillik nikohda ekanligini, juftligi bilan bolalari yo\'q ekanligini aytib qabulga keldi. Chap chov sohasida og\'irlik hissi bor, lekin og\'riq yo\'q. Sizning vazifangiz — uni to\'liq boshqarish.',
      qadamlar: [
        {
          tur: 'anamnez',
          sarlavha: '📝 Anamnez yig\'ish',
          savol:
            'Jasur bilan suhbatda qaysi savollarni so\'rashingiz eng muhim?',
          variantlar: [
            {
              matn: 'Nikoh muddati, avvalgi homiladorliklar, juftligining tekshiruvi',
              togri: true,
              izoh:
                'To\'g\'ri. Bepushtlik muammosida har ikki tomonni ham tekshirish kerak. Nikoh muddati ≥ 1 yil bo\'lsa va homiladorlik bo\'lmasa — klinik bepushtlik deyiladi. Juftligining tekshiruvini bilish muhim, chunki 40-50% holatlarda sabab erkak tomonida.',
            },
            {
              matn: 'Faqat jinssiy hayot chastotasini so\'rash',
              togri: false,
              izoh:
                'Noto\'g\'ri. Jinssiy hayot chastotasi muhim emas — asosiy masala sperma sifati va anatomik muammo. Bundan tashqari, juftligi va umumiy bepushtlik anamnezi olinmagan bo\'ladi.',
            },
            {
              matn: 'Og\'riq xususiyati, qachon boshlangan, kuchaytiruvchi omillar',
              togri: true,
              izoh:
                'To\'g\'ri. Og\'irlik hissining tabiati (diffuz/lokallashgan, kechqurun kuchayadimi) varikotsele diagnostikasida yordam beradi. Valsalva sinamasida kuchayishi tipik uchun.',
            },
            {
              matn: 'Qaysi sport bilan shug\'ullanishi',
              togri: false,
              izoh:
                'Noto\'g\'ri. Sport anamnezi bu holatda klinikalik ma\'lumot bermaydi. Varikotsele jismoniy yuklanishda kuchayadigan simptomlar berishi mumkin, lekin bu birlamchi savol emas.',
            },
          ],
        },
        {
          tur: 'tekshiruv',
          sarlavha: '🔬 Fizik ko\'rik',
          savol:
            'Jasurni ko\'rik qilayotganda qaysi manevrlar va pozitsiyalar zarur?',
          variantlar: [
            {
              matn: 'Turgan holda va Valsalva sinamasida skrotumni palpatsiya qilish',
              togri: true,
              izoh:
                'To\'g\'ri. Varikotsele turgan holatda yaxshiroq ko\'rinadi (gravitatsiya ta\'siri). Valsalva sinamasida venoz bosim oshib, kengaygan venalar yanada belgiliroq bo\'ladi. Bu klassik tekshiruv usuli.',
            },
            {
              matn: 'Faqat yotgan holatda palpatsiya qilish',
              togri: false,
              izoh:
                'Noto\'g\'ri. Yotgan holatda venoz qon qaytishi yaxshilanadi va varikotsele «yo\'qolib» ketishi mumkin. Gr. I varikotsele faqat Valsalva sinamasida aniqlanadi — shuning uchun turgan holda tekshirish majburiy.',
            },
            {
              matn: 'Testis hajmini orchidometr yoki USI orqali baholash',
              togri: true,
              izoh:
                'To\'g\'ri. Testis atrofiyasini aniqlash juda muhim — chunki ipsilateral (chap) testis kichraygan bo\'lsa, bu jarrohlik uchun absolyut ko\'rsatma. Ikki tomon testis hajmini solishtirish kerak.',
            },
            {
              matn: 'Prostata bezini rektal tekshirish',
              togri: false,
              izoh:
                'Noto\'g\'ri. 27 yoshli erkakda prostata tekshiruvi bepushtlik va varikotsele diagnostikasiga kiritmaydi. Bu geriatrik tekshiruv bo\'lib, bu holatda ma\'lumot bermaydi.',
            },
          ],
        },
        {
          tur: 'tahlil',
          sarlavha: '🧪 Laboratoriya va instrumental tekshiruvlar',
          savol:
            'Ko\'rikdan so\'ng Jasurga qaysi tekshiruvlarni buyurasiz?',
          variantlar: [
            {
              matn: 'Spermogramma (WHO mezonlari bo\'yicha)',
              togri: true,
              izoh:
                'To\'g\'ri. Spermogramma bepushtlik sababi va varikotsele klinik ahamiyatini baholashda asosiy test. Oligoastenozoospermiya varikotsele bilan bog\'liq tipik topilma. 3-5 kunlik abstinensiya kerak.',
            },
            {
              matn: 'Skrotal USI (Doppler bilan)',
              togri: true,
              izoh:
                'To\'g\'ri. Doppler USI varikotsele darajasini aniqlash, venalar diametrini o\'lchash (> 3 mm = patologik), qon oqimini baholash uchun zarur. Palpatsiyada aniqlanmagan subklinik varikotsele ham ko\'rinadi.',
            },
            {
              matn: 'FSH, LH, testosteron darajasi',
              togri: true,
              izoh:
                'To\'g\'ri. Gormonlar testis funksiyasini baholaydi. Varikotsele gipotalamus-gipofiz-testis o\'qini buzishi mumkin. FSH ko\'tarilgan bo\'lsa — spermatogenez buzilganligi belgisi. Bu davolash strategiyasiga ta\'sir qiladi.',
            },
            {
              matn: 'Buyrak va jigar biokimyoviy tahlillari',
              togri: false,
              izoh:
                'Noto\'g\'ri. Varikotsele diagnostikasida buyrak/jigar tahlillari ko\'rsatilmagan. O\'ng tomon varikotsele aniqlansa — buyrak venasi bosimi uchun KT/USI zarur bo\'lishi mumkin, lekin bu holat chap tomonlama.',
            },
          ],
        },
        {
          tur: 'tashxis',
          sarlavha: '🎯 Tashxis va boshqaruv rejasi',
          savol:
            'Spermogrammada oligoastenozoospermiya, USI da chap pampiniform pleksus 3.9 mm. Tashxis va dastlabki harakatlaringiz?',
          variantlar: [
            {
              matn: 'Klinik varikotsele gr. II + oligoastenozoospermiya — jarrohlik maslahatiga yuborish',
              togri: true,
              izoh:
                'To\'g\'ri. Klinik varikotsele + bepushtlik — bu jarrohlikka asosiy ko\'rsatma. WHO tavsiyasi: klinik varikotsele + bepushtlik + normal juftlik tekshiruvi → varikotselectomiya. Sperm parametrlari yaxshilanish imkoniyati yuqori.',
            },
            {
              matn: 'L-karnitin va antioxidant preparatlar 3 oy davomida',
              togri: false,
              izoh:
                'Noto\'g\'ri. Konservativ davolash faqat klinik varikotsele yo\'q yoki jarrohlikka qarshi ko\'rsatma bo\'lganda. Haqiqiy klinik varikotsele + bepushtlikda dori davolash jarrohlik samaradorligiga teng emas — bu vaqt yo\'qotish.',
            },
            {
              matn: 'Juftligini ham ginekolok/reproduktolog huzuriga yuborish',
              togri: true,
              izoh:
                'To\'g\'ri. Bepushtlikning 40-50% sababida ikki tomon ham ishtirok etadi. Juftligi tekshirilmagan bo\'lsa — parallel tekshiruv olib borish kerak. Bu davolash samaradorligini bashorat qilishda muhim.',
            },
            {
              matn: 'EKO/ICSI ga to\'g\'ridan-to\'g\'ri yuborish',
              togri: false,
              izoh:
                'Noto\'g\'ri. EKO/ICSI — bu jarrohlik imkoni bo\'lmaganda yoki muvaffaqiyatsizlikdan keyingi qadam. Klinik varikotsele + bepushtlikda avval varikotselectomiya tavsiya etiladi, chunki sperm parametrlari yaxshilanishi mumkin va tabiiy homiladorlik ehtimoli ortadi.',
            },
          ],
        },
        {
          tur: 'davolash',
          sarlavha: '⚕️ Jarrohlik usulini tanlash',
          savol:
            'Jasur operatsiyaga rozi bo\'ldi. Qaysi usulni tavsiya qilasiz va nima uchun?',
          variantlar: [
            {
              matn: 'Mikrojarrohlik varikotselectomiya (subingvinal, Marmar usuli)',
              togri: true,
              izoh:
                'To\'g\'ri. Zamonaviy oltin standart. Mikroskop ostida arteriya, nerv va limfa tomirlari saqlanadi, barcha venalar bog\'lanadi. Retsidiv < 1%, gidrotsele < 1%, sperm yaxshilanishi 60-80%. Eng kam asoratli usul.',
            },
            {
              matn: 'Palomo operatsiyasi (retroperitoneal yuqori ligatura)',
              togri: false,
              izoh:
                'Qisman to\'g\'ri, lekin optimal emas. Palomo usulida gidrotsele xavfi 7-30% ga yetadi (limfa tomirlari ko\'pincha bog\'lanadi). Retsidiv ham yuqoriroq — kollateral venalar qolishi mumkin. Mikrojarrohlik afzal.',
            },
            {
              matn: 'Laparoskopik varikotselectomiya',
              togri: false,
              izoh:
                'Noto\'g\'ri. Laparoskopiya umumiy anesteziya va qorin bo\'shlig\'ini ochishni talab qiladi. Bir tomonlama varikotsele uchun bu haddan tashqari invaziv. Mikrojarrohlik tezroq, arzonroq va samaraliroq.',
            },
            {
              matn: 'Perkutan venoz embolizatsiya (skleroterapiya)',
              togri: false,
              izoh:
                'Qisman to\'g\'ri, ammo birinchi tanlov emas. Skleroterapiya retsidiv holatlarda yoki jarrohlikdan bosh tortganda ishlatiladi. Birlamchi davolashda mikrojarrohlik natijalar yaxshiroq.',
            },
          ],
        },
      ],
      xulosa:
        'Varikotsele + bepushtlik — bu yosh erkaklar uchun eng ko\'p uchraydigan va davolanuvchi muammo. To\'g\'ri yo\'l: to\'liq anamnez → fizik ko\'rik (turgan holda + Valsalva) → spermogramma + Doppler USI → mikrojarrohlik varikotselectomiya. Operatsiyadan so\'ng 3-6 oyda sperm parametrlari yaxshilanadi. Juftligini ham parallel tekshirish unutilmasin.',
    },
    {
      id: 2,
      sarlavha: 'Operatsiyadan keyin asorat: siz nima qilasiz?',
      emoji: '🏥',
      dastlabkiMalumot:
        'Dilshod, 31 yoshli erkak, 3 oy oldin chap tomon varikotsele uchun Palomo usulida operatsiya o\'tkazilgan. Bugun nazorat tekshiruvi uchun keldi: chap tomon skrotumda og\'riqsiz kengayish paydo bo\'lgan. Spermogramma esa yaxshilanmagan.',
      qadamlar: [
        {
          tur: 'tekshiruv',
          sarlavha: '🔬 Birinchi baholash',
          savol:
            'Dilshodning skrotumidagi og\'riqsiz kengayish uchun dastlabki harakatlaringiz?',
          variantlar: [
            {
              matn: 'Skrotal USI buyurish — kengayish sababini aniqlash',
              togri: true,
              izoh:
                'To\'g\'ri. Og\'riqsiz skrotal kengayish Palomo operatsiyasidan keyin ko\'pincha gidrotsele (limfa tomirlari shikastlanishi) bilan bog\'liq. USI diffuz suyuqlik to\'planishini va testis holatin ko\'rsatadi. Bu zarur birinchi qadam.',
            },
            {
              matn: 'Darhol qayta operatsiyani rejalashtirish',
              togri: false,
              izoh:
                'Noto\'g\'ri. Qayta operatsiyadan oldin asoratning tabiatini aniqlash kerak. USI natijasisiz operatsiya rejalashtirish noto\'g\'ri klinik qaror. Gidrotsele kichik bo\'lsa — kutib turish mumkin.',
            },
            {
              matn: 'Spermogramma va gormonlarni tekshirish',
              togri: true,
              izoh:
                'To\'g\'ri. Spermogramma yaxshilanmagan — bu retsidivni yoki operatsiya muvaffaqiyatsizligini ko\'rsatishi mumkin. Parallel ravishda suyuqlik sababini aniqlash ham kerak. Gormonlar (FSH, testosteron) testis funksiyasini baholaydi.',
            },
            {
              matn: 'Antibiotik va og\'riq qoldiruvchi buyurish',
              togri: false,
              izoh:
                'Noto\'g\'ri. Og\'riqsiz va isitmasiz kengayish — infeksiya belgilari yo\'q. Antibiotik ko\'rsatilmagan. Og\'riq yo\'qligi gidrotsele yoki spermatotsele ehtimolini bildiradi, epididimorxit emas.',
            },
          ],
        },
        {
          tur: 'tahlil',
          sarlavha: '🧪 USI natijasi',
          savol:
            'USI natijasi: chap testis atrofiyasi (14 ml vs o\'ng 22 ml), chap pampiniform pleksus venalari 3.4 mm — retsidiv varikotsele. Gidrotsele yo\'q. Spermogramma: oligoastenozoospermiya davom etmoqda. Siz nima qilasiz?',
          variantlar: [
            {
              matn: 'Retsidiv varikotsele tashxisi — mikrojarrohlik usulida qayta operatsiya',
              togri: true,
              izoh:
                'To\'g\'ri. Palomo operatsiyasidan keyin retsidiv eng ko\'p kollateral venalar sababli yuzaga keladi. Qayta operatsiyada mikrojarrohlik (subingvinal, Marmar usuli) tanlanadi — chunki barcha venalar aniq ko\'rinadi, arteriya va limfa tomirlari saqlanadi.',
            },
            {
              matn: 'Yana Palomo operatsiyasini takrorlash',
              togri: false,
              izoh:
                'Noto\'g\'ri. Palomo usulida retsidiv ko\'p, chunki kollateral venalar qoladi. Yana xuddi shu usulni takrorlash retsidiv xavfini kamaytirmaydi va gidrotsele xavfini oshiradi. Mikrojarrohlik afzal.',
            },
            {
              matn: 'Perkutan venoz embolizatsiya (skleroterapiya)',
              togri: true,
              izoh:
                'To\'g\'ri variant. Retsidiv varikotsele uchun skleroterapiya qabul qilinishi mumkin — ayniqsa oldingi operatsiya sahasida chandiq to\'qimasi bo\'lganda. Minimal invaziv, ambulator sharoitda o\'tkaziladi.',
            },
            {
              matn: 'EKO/ICSI ni darhol tavsiya qilish',
              togri: false,
              izoh:
                'Noto\'g\'ri. Retsidiv varikotsele davolashdan oldin EKO yoqilmagan. Qayta varikotselectomiya muvaffaqiyatli bo\'lsa sperm yaxshilanishi va tabiiy homiladorlik mumkin. EKO — muvaffaqiyatsizlikdan keyingi keyingi qadam.',
            },
          ],
        },
        {
          tur: 'davolash',
          sarlavha: '⚕️ Operatsiyadan keyingi nazorat',
          savol:
            'Mikrojarrohlik qayta operatsiyasi o\'tkazildi. Dilshod 3 oy o\'tib nazoratga keldi. Qaysi ko\'rsatkichlarni baholaysiz?',
          variantlar: [
            {
              matn: 'Spermogramma — sperm parametrlarini birlamchi baholash bilan solishtirish',
              togri: true,
              izoh:
                'To\'g\'ri. Operatsiyadan keyin sperm yaxshilanishi 3-6 oyda ko\'rinadi (spermatogenez sikli 74 kun). Sperm kontsentratsiyasi, harakatchanligi va morfologiyasini oldingi ko\'rsatkichlar bilan solishtirish jarrohlik samaradorligini aniqlaydi.',
            },
            {
              matn: 'Skrotal USI — venalar diametrini nazorat qilish',
              togri: true,
              izoh:
                'To\'g\'ri. USI retsidivni istisno qilish va testis hajmini baholash uchun zarur. Agar venalar yana > 3 mm bo\'lsa — retsidiv. Testis hajmi ortishi (\'catch-up growth\') davolash samarasini ko\'rsatadi.',
            },
            {
              matn: 'Faqat bemor shikoyatini so\'rash va uyga yuborish',
              togri: false,
              izoh:
                'Noto\'g\'ri. Shikoyat yo\'qligi sperm yaxshilanganligini anglatmaydi. Varikotselectomiya asosiy maqsadi — reproduktiv funksiya, og\'riq emas. Ob\'ektiv tekshiruvsiz nazorat noto\'g\'ri.',
            },
            {
              matn: 'Gormonlar (FSH, LH, testosteron) va inhibin B tekshiruvi',
              togri: true,
              izoh:
                'To\'g\'ri. Gormonlar testis funksiyasini aks ettiradi. Inhibin B — Sertoli hujayralari markeri, spermatogenez faolligini ko\'rsatadi. FSH normalizatsiyasi va testosteron oshishi — davolash samarasining belgisi.',
            },
          ],
        },
      ],
      xulosa:
        'Palomo operatsiyasidan keyingi retsidiv — klinik amaliyotda uchrab turuvchi muammo. Diagnostika: USI + spermogramma. Davolash: mikrojarrohlik yoki skleroterapiya. Har qanday varikotselectomiyadan keyin 3-6 oyda spermogramma, USI va gormonlar bilan nazorat o\'tkazilishi shart. Muvaffaqiyatsizlik bo\'lsa — ART (EKO/ICSI) ko\'rib chiqiladi.',
    },
  ],
}

export function interaktivCaselarOl(darsSlug: string): InteraktivCase[] {
  return INTERAKTIV_CASELAR[darsSlug] ?? []
}
