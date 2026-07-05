export type VaziyatliSavol = {
  savol: string
  variantlar: string[]
  togri: number
  izoh: string
}

export type VaziyatliMasala = {
  id: number
  sarlavha: string
  emoji: string
  vaziyat: string
  savollar: VaziyatliSavol[]
}

const VAZIYATLI_MASALALAR: Record<string, VaziyatliMasala[]> = {
  'h-varikotsele-kasalligi': [
    {
      id: 1,
      sarlavha: 'Nikohda 2 yil, hali farzand yo\'q',
      emoji: '👨‍👩‍👦',
      vaziyat:
        'Sardor, 30 yoshli yurist, nikohda 2 yil bo\'lib, farzandlari yo\'q. Juftligi ginekolog tomonidan tekshirilgan — patologiya topilmagan. Sardor urologga murojaat qildi. Shikoyat: chap chov sohasida og\'irlik hissi, uzoq o\'tirganda kuchayadi. Ko\'rik: turgan holatda chap testisda "qurt to\'pi" ko\'rinishidagi venalar, Valsalva sinamasida kuchayadi. O\'ng tomon — norm. Testis hajmi: chap 14 ml, o\'ng 20 ml. Harorat 36.7°C, leykotsitlar normal.',
      savollar: [
        {
          savol: 'Sardorda eng ehtimoliy tashxis nima?',
          variantlar: [
            'Chap epididimorxit',
            'Chap tomon klinik varikotsele',
            'Chap gidrotsele',
            'Chap spermatotsele',
          ],
          togri: 1,
          izoh:
            'Turgan holatda "qurt to\'pi" ko\'rinishi + Valsalva sinamasida kuchayish + USI da venalar kengayishi — bu klinik varikotsele uchun klassik tasvir. Epididimorxit uchun isitma/leykotsitoz bo\'lishi kerak. Gidrotsele/spermatotsele transilluminatsiyada aniqlanadi va venoz xarakter ko\'rsatmaydi.',
        },
        {
          savol: 'Sardorning chap testisi o\'ng tomonidan kichikroq (14 ml vs 20 ml). Bu necha foiz hajm farqi va klinik ahamiyati nima?',
          variantlar: [
            '10% — klinik ahamiyati yo\'q, kuzatuv yetarli',
            '20% — chegaraviy holat, 6 oyda qayta tekshirish',
            '30% — ipsilateral testikular atrofiya, jarrohlik ko\'rsatmasi',
            '50% — testis funksiyasi to\'liq yo\'qolgan',
          ],
          togri: 2,
          izoh:
            '(20−14)/20 × 100 = 30% hajm farqi. Bu ipsilateral testikular atrofiyani anglatadi. Yosh erkaklarda > 20% hajm farqi + klinik varikotsele = jarrohlik ko\'rsatmasi. Testis hajmi farqi spermatogenezning buzilish darajasini aks ettiradi.',
        },
        {
          savol: 'Qaysi tekshiruvlar majburiy?',
          variantlar: [
            'Faqat spermogramma yetarli',
            'Spermogramma + skrotal Doppler USI + FSH/LH/testosteron',
            'KT qorin bo\'shlig\'i + spermogramma',
            'MRT chanoq + gormonlar',
          ],
          togri: 1,
          izoh:
            'Standart protokol: (1) Spermogramma — sperma sifatini baholash; (2) Doppler USI — venalar diametrini o\'lchash (> 3 mm = patologik), qon oqimini baholash; (3) Gormonlar — testis funksiyasini baholash, davolash strategiyasini aniqlash. KT/MRT faqat o\'ng tomon varikotsele yoki shubhali holatlarda.',
        },
        {
          savol: 'Spermogramma natijasi: konsentratsiya 8 mln/ml, harakatchanlik 25%, normal shakl 2%. Davolash taktikasi?',
          variantlar: [
            '3 oy konservativ davolash, keyin qayta spermogramma',
            'Darhol EKO/ICSI ga yuborish',
            'Mikrojarrohlik varikotselectomiya (Marmar usuli)',
            'Klomifen sitrat bilan gormon stimulyatsiyasi',
          ],
          togri: 2,
          izoh:
            'Klinik varikotsele + bepushtlik + anormal spermogramma + normal juftlik — bu mikrojarrohlik uchun klassik ko\'rsatma (WHO, EAU 2024). Konservativ davolash jarrohlik samarasiga teng emas. EKO — jarrohlikdan keyingi qadam. Gormon terapiyasi bu holatda asossiz.',
        },
      ],
    },
    {
      id: 2,
      sarlavha: 'O\'smirda topilgan — nima qilish kerak?',
      emoji: '🧑',
      vaziyat:
        'Komiljon, 16 yoshli o\'quvchi, sport tibbiyoti ko\'rigida chap tomon varikotsele aniqlandi. Shikoyat yo\'q — tasodifan topilgan. Ko\'rikda: chap testisda venalar palpatsiyada aniqlanadi, Valsalva sinamasida belgiliroq bo\'ladi. USI: chap pampiniform pleksus 3.6 mm (dam olish holatida), testis hajmi: chap 11 ml, o\'ng 18 ml. Gormonlar: FSH 5.2 IU/L (norm), testosteron 14 nmol/L (norm).',
      savollar: [
        {
          savol: 'Komiljonning varikotsele darajasi (WHO tasnifi bo\'yicha) va asosiy xavf omili nima?',
          variantlar: [
            'Gr. I — Valsalva sinamasida palpatsiya qilinadi; xavf yo\'q',
            'Gr. II — turgan holatda palpatsiya qilinadi; xavf past',
            'Gr. II, pampiniform pleksus > 3 mm + testikular atrofiya (39% hajm farqi) — jarrohlik ko\'rsatmasi',
            'Subklinik — faqat USI da aniqlanadi; davolash kerak emas',
          ],
          togri: 2,
          izoh:
            'Turgan holatda palpatsiya qilinuvchi = Gr. II. Asosiy xavf: (18−11)/18 × 100 = 39% hajm farqi — bu og\'ir atrofiya. O\'smirlarda > 20% testis hajm farqi + klinik varikotsele = absolyut jarrohlik ko\'rsatmasi. Gormonlar normal bo\'lsa ham — atrofiya progressiya qilmoqda.',
        },
        {
          savol: 'Ota-onasi "hali yosh, kutaylik" deydi. Siz qanday tushuntirasiz?',
          variantlar: [
            'Ular to\'g\'ri, o\'smir 18 yoshga to\'lgach qayta tekshirilsin',
            'Varikotsele o\'z-o\'zidan yo\'qolishi mumkin, kutish oqilona',
            'Testikular atrofiya mavjud — kechiktirish spermatogenezni qaytarib bo\'lmas darajada buzadi, erta jarrohlik testis funksiyasini tiklaydi',
            'Farzand ko\'rish vaqtida EKO qilsa bo\'ladi, hozir shoshilmaslik kerak',
          ],
          togri: 2,
          izoh:
            'O\'smirlarda varikotsele prогрессив kechadi. Atrofiya mavjud bo\'lsa — har 6 oyda 1-2 ml testis yo\'qolishi davom etadi. Erta operatsiyadan so\'ng "catch-up growth" — testis hajmini tiklash mumkin. 18 yoshga qadar kutish irreversibel zarar qoldirishi mumkin. Bu holat ota-onaga tushuntirilishi shart.',
        },
        {
          savol: 'Operatsiya rejalashtirildi. O\'smirga qaysi usul va anesteziya tanlash kerak?',
          variantlar: [
            'Palomo (retroperitoneal), umumiy anesteziya',
            'Laparoskopik, umumiy anesteziya',
            'Mikrojarrohlik varikotselectomiya (subingvinal), umumiy yoki spinal anesteziya',
            'Skleroterapiya, lokal anesteziya',
          ],
          togri: 2,
          izoh:
            'O\'smirlarda ham mikrojarrohlik (Marmar usuli) birinchi tanlov — retsidiv < 1%, gidrotsele < 1%, "catch-up growth" yuqoriroq. Palomo usulida limfa tomirlari shikastlanishi va gidrotsele xavfi yuqori. Skleroterapiya o\'smirlar uchun standart emas. Anesteziya turi tana vazniga va markazga qarab tanlanadi.',
        },
        {
          savol: 'Operatsiyadan 6 oy o\'tdi. Nazorat tekshiruvida nima baholanishi kerak?',
          variantlar: [
            'Faqat USI — retsidiv yo\'qligini tekshirish',
            'Faqat gormonlar — FSH, testosteron',
            'USI (testis hajmi, retsidiv) + gormonlar (FSH, testosteron, inhibin B)',
            'Spermogramma + gormonlar + USI',
          ],
          togri: 2,
          izoh:
            'O\'smirda operatsiyadan keyingi asosiy maqsad — testis o\'sishi (catch-up growth) va funksiya tiklanishi. USI da testis hajmini solishtiramiz. Gormonlar (FSH pasayishi, testosteron va inhibin B oshishi) spermatogenez tiklanishini ko\'rsatadi. Spermogramma faqat 18 yoshdan keyin olinadi.',
        },
      ],
    },
    {
      id: 3,
      sarlavha: 'Murakkab holat: ikki tomonlama varikotsele + azoospermiya',
      emoji: '🔬',
      vaziyat:
        'Bobur, 34 yoshli muhandis, 3 yildan beri homiladorlik yo\'q. Ko\'rikda: ikki tomonlama varikotsele (chap Gr. III, o\'ng Gr. I). Testis hajmi: chap 10 ml, o\'ng 15 ml (me\'yor 15-25 ml). Spermogramma: azoospermiya (spermada spermatozoidlar yo\'q, 2 marta tekshirildi). FSH: 18 IU/L (yuqori), testosteron: 9 nmol/L (past). USI: chap venalar 4.2 mm, o\'ng 3.1 mm.',
      savollar: [
        {
          savol: 'Yuqori FSH va past testosteron bu holatda nimani anglatadi?',
          variantlar: [
            'Gipofiz adenomasi — MRT kerak',
            'Birlamchi testikular yetishmovchilik — Sertoli va Leydig hujayralari shikastlangan',
            'Gipotireoz — qalqonsimon bez tekshirilsin',
            'Psixogen stress — psixolog ko\'rigi kerak',
          ],
          togri: 1,
          izoh:
            'Yuqori FSH (> 7.6 IU/L) = gipofiz testisni ko\'proq stimulyatsiya qilmoqda, lekin testis javob bermayapti → birlamchi testikular yetishmovchilik. Past testosteron = Leydig hujayralari ham shikastlangan. Bu ikki tomonlama atrofiya + uzoq muddat varikotsele oqibati.',
        },
        {
          savol: 'Azoospermiya turi qanday aniqlanadi va bu holatda qaysi tur ehtimolroq?',
          variantlar: [
            'Obstruktiv azoospermiya — yo\'llar tiqilib qolgan, TESE kerak emas',
            'Sekretor (non-obstruktiv) azoospermiya — yuqori FSH, atrofiya, spermatogenez buzilgan',
            'Retrograd eyakulyatsiya — siydik tahlili kerak',
            'Kongenital yo\'llar aplaziyasi — CFTR geni tekshirilsin',
          ],
          togri: 1,
          izoh:
            'Yuqori FSH + testis atrofiyasi + varikotsele = sekretor (non-obstruktiv) azoospermiya. Obstruktiv azoospermiyada FSH odatda normal, testis hajmi to\'liq. Retrograd eyakulyatsiya va aplaziya bu klinik tasvir bilan mos kelmaydi.',
        },
        {
          savol: 'Bobur uchun qaysi davolash strategiyasi to\'g\'ri?',
          variantlar: [
            'Darhol TESE + ICSI — varikotselectomiya azoospermiyada samarasiz',
            'Avval ikki tomonlama varikotselectomiya, 6-12 oyda spermogramma, keyin qaror',
            'Klomifen + vitamin E 6 oy davomida, keyin qayta tekshirish',
            'Donor spermasi bilan inseminatsiya',
          ],
          togri: 1,
          izoh:
            'EAU 2024: azoospermiya + klinik varikotsele holatida varikotselectomiya TAVSIYA ETILADI — chunki 20-40% bemorlar operatsiyadan keyin spermogrammasida spermatozoidlar paydo bo\'ladi (ejaculatda). Bu TESE ni keraksiz qilishi mumkin. Avval jarrohlik, 6-12 oy kutish, agar yo\'q bo\'lsa — TESE/ICSI.',
        },
        {
          savol: 'Operatsiyadan 12 oy o\'tib spermogramma: konsentratsiya 1.2 mln/ml (og\'ir oligozoospermiya). Keyingi qadam?',
          variantlar: [
            'Yana 6 oy kutish — sperma yana yaxshilanishi mumkin',
            'TESE + ICSI — ejakulatdagi sperma ICSI uchun etarli',
            'Donor spermasi bilan IVF',
            'Qayta varikotselectomiya — retsidiv yo\'qligini tekshirib',
          ],
          togri: 1,
          izoh:
            'ICSI uchun bitta tirik spermatozoid yetarli. 1.2 mln/ml — bu ICSI uchun to\'liq etarli! TESE shart emas (ejakulatda sperma bor). Agar retsidiv yo\'q bo\'lsa, qayta operatsiya kerak emas. Donor spermasi — faqat bemorning o\'z spermasini ishlatish iloji bo\'lmaganda.',
        },
      ],
    },
  ],
}

export function vaziyatliMasalalarOl(darsSlug: string): VaziyatliMasala[] {
  return VAZIYATLI_MASALALAR[darsSlug] ?? []
}
