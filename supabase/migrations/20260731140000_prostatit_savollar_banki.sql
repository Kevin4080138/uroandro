UPDATE dars_tarkibi
SET savollar_banki = $prostatit_savollar$[
  {
    "savol": "Prostatitning NIH tasnifi qachon nashr etilgan?",
    "variantlar": ["1978-yilda Drach va hamkasblari tomonidan", "1999-yilda NIH (Krieger va boshq.) tomonidan", "2005-yilda AUA assotsiatsiyasi tomonidan", "1990-yilda EAU assotsiatsiyasi tomonidan"],
    "togri": 1,
    "izoh": "NIH prostatit tasnifi 1995 va 1998-yillardagi konsensus konferensiyalarida ishlab chiqilib, 1999-yilda NIH (Krieger et al.) tomonidan nashr etildi."
  },
  {
    "savol": "NIH prostatit tasnifida qancha kategoriya mavjud?",
    "variantlar": ["2 ta", "3 ta", "4 ta", "5 ta"],
    "togri": 2,
    "izoh": "NIH tasnifida 4 ta kategoriya mavjud: I — o'tkir bakterial, II — surunkali bakterial, III — CP/CPPS, IV — asimptomatik yallig'lanishli prostatit."
  },
  {
    "savol": "Barcha prostatit holatlarining qancha foizi CP/CPPS (kat. III) ni tashkil etadi?",
    "variantlar": ["5–10%", "20–30%", "50–60%", "~90%"],
    "togri": 3,
    "izoh": "CP/CPPS barcha prostatit holatlarining ~90 foizini tashkil etadi. Haqiqiy bakterial prostatit (kat. I va II) faqat 5–10% ni tashkil etadi."
  },
  {
    "savol": "NIH kategoriya I — O'tkir bakterial prostatit (ABP) qanday xususiyatga ega?",
    "variantlar": ["Surunkali chanoq og'rig'i sindromi bilan kechuvchi holat", "Og'riqsiz kechadi va tekshiruvda tasodifan topiladi", "O'tkir bakterial infeksiya — isitma, LUTS va og'riq", "Bir xil bakteriya bilan qayta uchraydigan UTI epizodlari"],
    "togri": 2,
    "izoh": "NIH kat. I — ABP: o'tkir bakterial infeksiya bilan namoyon bo'ladi — isitma, siydik yo'li belgilari (LUTS) va og'riq. Barcha kategoriyalar orasida eng kam tarqalgani (<5%)."
  },
  {
    "savol": "ABP (O'tkir bakterial prostatit) qaysi yosh guruhlarida ikki cho'qqili tarqalishni ko'rsatadi?",
    "variantlar": ["10–20 yosh va 50–60 yoshda ikki cho'qqi bilan", "20–40 yosh va 60 yoshdan keyin ikki cho'qqi bilan", "Faqat 30–50 yosh oralig'ida bitta cho'qqi bilan", "Faqat 60–70 yosh oralig'ida bitta cho'qqi bilan"],
    "togri": 1,
    "izoh": "ABP 20–40 yoshlarda va 60 yoshdan keyin ikkinchi cho'qqisi bilan ikki fazali (bimodal) tarqalishga ega."
  },
  {
    "savol": "ABP da asosiy qo'zg'atuvchi qaysi organizm va u qancha foizda uchraydi?",
    "variantlar": ["Enterococcus — 65–80%", "E. coli — 65–80%", "Pseudomonas — 65–80%", "Chlamydia — 65–80%"],
    "togri": 1,
    "izoh": "E. coli ABP da 65–80% hollarda asosiy sabab. Boshqa gram-manfiy organizmlar (Pseudomonas, Proteus, Klebsiella) va Enterococcus (~10%) ham uchraydi."
  },
  {
    "savol": "O'tkir bakterial prostatitda prostat massaji nima uchun mutlaq kontrindikatsiyadir?",
    "variantlar": ["Og'riqni chidab bo'lmas darajada kuchaytirib yuborishi uchun", "Sepsis va bakteriemiyaga olib kelib qo'yishi mumkinligi uchun", "Qondagi PSA darajasini keskin ko'tarib yuborishi uchun", "O'tkir siydik ushlanishiga (retention) olib kelishi uchun"],
    "togri": 1,
    "izoh": "ABP da prostat massaji MUTLAQ YASAQ — massaj sepsis va bakteriemiyaga olib kelishi mumkin. Massaj faqat kat. II, III va IV diagnostikasida qo'llaniladi."
  },
  {
    "savol": "O'tkir prostatitda qon ekinmasi qachon olinishi kerak?",
    "variantlar": ["Antibiotik boshlangandan taxminan 2 kun o'tgach olinadi", "Antibiotik berishdan oldin, isitma yoki qaltirash bo'lganda", "Bemor kasalxonadan chiqarilayotgan paytda olinadi", "Faqat surunkali prostatit shubhasi bo'lganda olinadi"],
    "togri": 1,
    "izoh": "Qon ekinmasi isitma yoki qaltirash bo'lganda antibiotik berishdan OLDIN olinishi kerak — so'ng antibiotik berilsa ekinma manfiy chiqadi va qo'zg'atuvchi aniqlanmaydi."
  },
  {
    "savol": "O'tkir prostatitda PSA ni buyurish nima uchun tavsiya etilmaydi?",
    "variantlar": ["PSA o'tkir prostatitda doim yuqori — saraton belgisi emas", "PSA tekshiruvi juda qimmat va uzoq vaqt talab qiladi", "PSA faqat 50 yoshdan katta erkaklarda ishlatiladi", "PSA hech qanday klinik ahamiyatga ega bo'lmagan test"],
    "togri": 0,
    "izoh": "O'tkir fazada prostata yallig'lanishi sababli PSA har doim yuqori bo'ladi — bu prostat saratoni belgisi emas. Shuning uchun o'tkir prostatitda PSA buyurish tavsiya etilmaydi."
  },
  {
    "savol": "NIH kategoriya II — Surunkali bakterial prostatit (CBP) ning asosiy klinik xususiyati nima?",
    "variantlar": ["Isitma va qaltirash bilan kechadigan o'tkir bakterial infeksiya", "Bir xil bakteriya bilan qayta UTI; oraliqda asimptomatik", "Og'riqsiz kechadi va tekshiruvda tasodifan topilib qoladi", "Standart usulda bakteriya topilmaydigan surunkali og'riq"],
    "togri": 1,
    "izoh": "CBP — prostatada doimiy bakteria manbai bo'lib, bir xil organizm bilan qayta-qayta kelib chiqadigan UTI. Epizodlar oralig'ida bemorlar nisbatan asimptomatik — bu ABP va CP/CPPS dan farqlovchi xususiyat."
  },
  {
    "savol": "Surunkali bakterial prostatit (CBP) uchun qaysi antibiotiklar afzal va nima uchun?",
    "variantlar": ["Penitsyllinlar — keng ta'sir spektriga ega bo'lgani uchun", "Ftorokinolonlar — prostata to'qimasiga eng yaxshi singishi uchun", "Nitrofurantoin — yuqori samaradorligi va xavfsizligi uchun", "Karbapenemlar — juda keng ta'sir spektriga ega bo'lgani uchun"],
    "togri": 1,
    "izoh": "Ftorokinolonlar CBP da birinchi tanlash — zwitterion tuzilishi va yuqori lipid eruvchanlik tufayli prostata suyuqligi va to'qimasiga mukammal kirib boradi."
  },
  {
    "savol": "CBP davolash muddati qancha?",
    "variantlar": ["3–5 kun", "7–10 kun", "4 dan 12 haftaga qadar", "6 oydan 1 yilgacha"],
    "togri": 2,
    "izoh": "CBP davolash muddati 4 dan 12 haftaga qadar — prostata to'qimasiga singishi va infeksiya manbaini yo'q qilishi uchun uzoq muddatli davolash zarur."
  },
  {
    "savol": "CBP da davolash muvaffaqiyatsiz bo'lsa, qaysi jarrohlik usuli ko'rib chiqilishi mumkin?",
    "variantlar": ["Nefrektomiya (buyrakni olib tashlash)", "Radikal prostatektomiya operatsiyasi", "TURP — prostataning transuretal rezeksiyasi", "Orxiektomiya (moyakni olib tashlash)"],
    "togri": 2,
    "izoh": "CBP da qaytuvchi holatlarda uzoq muddatli antibiotik suppressiv davolash yoki TURP (transuretal prostat rezeksiyasi) ko'rib chiqilishi mumkin — prostata ichidagi infeksiya manbaini bartaraf etish uchun."
  },
  {
    "savol": "NIH kategoriya III (CP/CPPS) ning ta'rifi qanday?",
    "variantlar": ["O'tkir bakterial infeksiya bilan kechadigan prostatit holati", "So'nggi 6 oyning ≥3 oyida chanoq og'rig'i; bakteriya topilmaydi", "Og'riqsiz kechadi va tekshiruvda tasodifan topilib qoladi", "Faqat 60 yoshdan oshgan erkaklarda uchraydigan sindrom"],
    "togri": 1,
    "izoh": "CP/CPPS NIH ta'rifi: so'nggi 6 oyning kamida 3 oyida chanoqda og'riq yoki noqulaylik; standart mikrobiologik usullar bilan uropatogen bakteriya topilmagan holat."
  },
  {
    "savol": "CP/CPPS da og'riq manbai doim prostata bo'ladimi?",
    "variantlar": ["Ha, og'riq har doim faqat prostata bezi sababli kelib chiqadi", "Yo'q — chanoq tubi, nevrologik yoki psixologik omillardan ham", "Faqat chanoq tubi (orqiq) mushaklaridan kelib chiqadi", "Faqat siydik pufagi (qovuq) devoridan kelib chiqadi"],
    "togri": 1,
    "izoh": "'Prostatit' atamasi tarixiy — zamonaviy tushunchaga ko'ra CP/CPPS da og'riq chanoq tubi, nevrolog yoki psixologik omillardan ham kelib chiqishi mumkin. Og'riq manbai doim prostata emas."
  },
  {
    "savol": "NIH-CPSI (Surunkali Prostatit Simptom Indeksi) qaysi uch sohani qamrab oladi?",
    "variantlar": ["Isitma, o'tkir og'riq va siydik chiqarish belgilari", "Og'riq, siydik simptomlari va hayot sifati (QOL)", "Laborator, klinik va radiologik ko'rsatkichlar", "Og'riq, jinsiy funksiya va uyqu sifati holati"],
    "togri": 1,
    "izoh": "NIH-CPSI uch sohani baholaydi: Pain (og'riq — perineum, moyaklar, suprapubik), Urinary (siydik tezligi, to'siqli belgilar) va QOL (hayot sifati — kundalik faoliyatga ta'sir)."
  },
  {
    "savol": "CP/CPPS da og'riq qaysi sohada eng ko'p (63%) seziladi?",
    "variantlar": ["Qov usti (suprapubik) soha — 42%", "Penis (jinsiy olat) uchi — 32%", "Oraliq (perineum) sohasi — 63%", "Bel va dumg'aza sohasi — 25%"],
    "togri": 2,
    "izoh": "NIH-CPSI bo'yicha og'riq joylashuvi: perineum (63%) — eng ko'p; moyaklar (58%); ejakulyatsiya paytida og'riq (48%); suprapubik soha (42%); penis uchi (32%)."
  },
  {
    "savol": "IIIA va IIIB subkategoriyalarining farqi nimada va klinik amaliyotda bu farq muhimmi?",
    "variantlar": ["IIIA — og'riqsiz, IIIB — og'riqli; farq klinik jihatdan muhim", "IIIA — EPS/VB3 da leykotsit bor, IIIB — yo'q; klinik farq kam", "IIIA — bakteriya bor, IIIB — bakteriya yo'q; farq juda muhim", "IIIA — og'ir kechadi, IIIB — yengil kechadi; farq muhim emas"],
    "togri": 1,
    "izoh": "IIIA — EPS/VB3 da leykotsitlar bor (yallig'lanishli); IIIB — yo'q (yallig'lanishsiz). Ammo klinik amaliyotda ikkisi o'rtasida sezilarli klinik farq ko'rsatilmagan — hozirgi qo'llanmalar mikroskopiya asosida farqlashni tavsiya etmaydi."
  },
  {
    "savol": "UPOINT fenotiplashtirish tizimi nima?",
    "variantlar": ["Prostatit uchun jarrohlik aralashuv turlarini belgilash tizimi", "CP/CPPS bemorni 6 soha bo'yicha tavsiflab davo rejasini tuzish", "Empirik antibiotik tanlashning bosqichma-bosqich algoritmi", "Diagnostik laborator tekshiruvlarning ketma-ketligi tizimi"],
    "togri": 1,
    "izoh": "UPOINT — CP/CPPS bemorini 6 soha bo'yicha baholash: U-Urinary, P-Psychosocial, O-Organ-specific, I-Infection, N-Neurologic/Systemic, T-Tenderness. Har bir bemor noyob 'qor parchasi' profili ko'rsatadi."
  },
  {
    "savol": "UPOINT tizimidagi 'I' harfi qaysi sohani anglatadi?",
    "variantlar": ["Immunologik (Immunologic)", "Infeksiya (Infection)", "Interstitsial (Interstitial)", "Chov sohasi (Inguinal)"],
    "togri": 1,
    "izoh": "UPOINT da I — Infection (infeksiya belgilari) sohasi. Bu soha musbat bo'lsa antibiotik qo'shiladi. 6 soha: Urinary, Psychosocial, Organ-specific, Infection, Neurologic/Systemic, Tenderness."
  },
  {
    "savol": "CP/CPPS tashxisi qanday xarakterga ega?",
    "variantlar": ["Tasdiqlash tashxisi — laboratoriya natijasi diagnozni tasdiqlaydi", "Istisno tashxisi — boshqa sabablar inkor etilgach qo'yiladi", "Faqat kompyuter tomografiya (KT) yordamida tasdiqlanadi", "Faqat prostata biopsiyasi natijasi bilan tasdiqlanadi"],
    "togri": 1,
    "izoh": "CP/CPPS — istisno qilish tashxisi. Diagnoz qo'yishdan oldin boshqa organik sabablar (tosh, saraton, infeksiya, nevrolog patologiya) istisno qilinishi kerak."
  },
  {
    "savol": "NIH kategoriya IV — Asimptomatik yallig'lanishli prostatit qanday aniqlanadi?",
    "variantlar": ["Og'riq va dizuriya kabi belgilar bilan klinik namoyon bo'ladi", "Boshqa maqsadli tekshiruv (biopsiya, sperma) davomida tasodifan", "Har qanday laborator tekshiruvda doimo aniqlanib turadi", "Isitma, qaltirash va o'tkir og'riq bilan to'satdan boshlanadi"],
    "togri": 1,
    "izoh": "Kat. IV — og'riq yo'q. EPS/VB3/biopsiyada leykotsitlar topiladi. Ko'pincha prostata saratoni biopsiyasi yoki bepushtlik uchun sperma tahlili davomida tasodifan aniqlanadi."
  },
  {
    "savol": "Katta yoshdagi erkaklar autopsiyasida surunkali prostata yallig'lanishi qancha foizida aniqlanadi?",
    "variantlar": ["10–20%", "30–40%", "70% dan ko'proqida", "95% dan ko'proqida"],
    "togri": 2,
    "izoh": "Autopsiya tadqiqotlarida katta yoshdagi erkaklarning 70% dan ko'proqida histologik jihatdan surunkali prostata yallig'lanishi topilgan — bu klinik ahamiyati hali to'liq aniqlanmagan topilma."
  },
  {
    "savol": "Klassik Meares-Stamey to'rt stakan usuli nima va hozir u qanday o'zgartiriladigan?",
    "variantlar": ["Prostata biopsiyasi usuli; hozir TRUS bilan almashtirilgan", "VB1, VB2, EPS, VB3 lokalizatsiya; hozir 2 stakan (VB2+VB3)", "Oddiy qon tahlili usuli; hozir NAAT bilan almashtirilgan", "Ultratovush usuli; hozir kompyuter tomografiya bilan almash"],
    "togri": 1,
    "izoh": "Meares-Stamey to'rt stakan usuli (VB1, VB2, EPS, VB3) lokalizatsiya uchun 'oltin standart' edi. Hozirgi amaliyotda soddalashtirilgan ikki stakan usuli (VB2 + VB3) ko'proq qo'llaniladi."
  },
  {
    "savol": "Kat. I (ABP) da prostat absessi shubhasi bo'lganda qaysi tekshiruv ko'rsatiladi?",
    "variantlar": ["Siydik sitologiyasi tekshiruvi darhol o'tkaziladi", "TRUS yoki KT — 48 soatda javob bo'lmasa o'tkaziladi", "Qon ekinmasi qaytadan olinib, natija kutiladi", "Prostata-spetsifik antigen (PSA) tahlili o'tkaziladi"],
    "togri": 1,
    "izoh": "ABP da 48 soatda antibiotikka javob yo'q bo'lsa — prostat absessi istisno qilish uchun TRUS (transrektal ultratovush) yoki KT majburiy."
  },
  {
    "savol": "Kat. III (CP/CPPS) da siydik sitologiyasi nima uchun tavsiya etiladi?",
    "variantlar": ["Qo'zg'atuvchi bakteriya turini aniqlab olish maqsadida", "Irritativ simptom/gematuriyada qovuq CIS ni istisno qilish", "Prostata bezi saratonini erta aniqlash maqsadida o'tkaziladi", "Antibiotiklarga sezuvchanlikni tekshirish maqsadida o'tkaziladi"],
    "togri": 1,
    "izoh": "Kat. III da irritativ siydik simptomlari va gematuriya bo'lsa — siydik sitologiyasi qovuq karsinoma in situ (CIS) ni istisno qilish uchun o'tkaziladi."
  },
  {
    "savol": "ABP da kasalxonaga yotqizish ko'rsatmasi qanday?",
    "variantlar": ["Hech qanday holatda kasalxonaga yotqizish talab etilmaydi", "Sepsis, yuqori isitma, qusish bo'lsa — kasalxona, IV antibiotik", "Faqat 60 yoshdan katta erkaklarda kasalxona talab etiladi", "Faqat prostata absessi rivojlangandagina kasalxona kerak"],
    "togri": 1,
    "izoh": "ABP da tizimli infeksiya belgilari (sepsis, yuqori isitma, qusish) bo'lsa — kasalxonaga yotqizish, IV antibiotiklar (aminoglikozid + ampitsillin yoki karbapenem), gidratatsiya va kuzatuv zarur."
  },
  {
    "savol": "ABP da siydik ushlanishida qaysi drenaj usuli afzal?",
    "variantlar": ["Uzoq muddatli drenaj uchun uretral kateter afzalroq", "Uzoq muddatli drenaj uchun suprapubik kateter afzalroq", "Bu holatda hech qanday drenaj usuli umuman shart emas", "Faqat ochiq jarrohlik operatsiyasi yo'li bilan hal etiladi"],
    "togri": 1,
    "izoh": "ABP da siydik ushlanishida suprapubik kateter uzoq muddatli drenajda afzal. Uretral kateterni qisqa muddatli qo'llash ham mumkin, ammo uzoq muddatda suprapubik yo'l yaxshiroq."
  },
  {
    "savol": "CBP da chlamydial prostatit aniqlansa, qaysi antibiotik siprofloksatsinga nisbatan afzal?",
    "variantlar": ["Metronidazol", "Nitrofurantoin", "Azitromitsin", "Gentamitsin"],
    "togri": 2,
    "izoh": "Chlamydial prostatitda azitromitsin siprofloksatsinga nisbatan afzal — C. trachomatis ga makrolidlar yaxshi ta'sir ko'rsatadi va prostata to'qimasiga yaxshi singadi."
  },
  {
    "savol": "CP/CPPS da meta-tahlillar qaysi kombinatsiya NIH-CPSI ballini 13,8 ballga kamaytirishini ko'rsatdi?",
    "variantlar": ["Faqat antibiotik monoterapiyasi (yolg'iz qo'llash)", "Antibiotik va α-bloker kombinatsiyasini birga qo'llash", "Faqat α-bloker monoterapiyasi (yolg'iz qo'llash)", "NSAID va α-bloker preparatlari kombinatsiyasi"],
    "togri": 1,
    "izoh": "Meta-tahlillar: antibiotik va α-bloker kombinatsiyasi NIH-CPSI ballini 13,8 ballga kamaytiradi — monoterapiyaga nisbatan ancha yuqori. Bu multimodal yondashuvning asosi."
  },
  {
    "savol": "CP/CPPS da α-blokerlar qaysi soha uchun qo'llaniladi?",
    "variantlar": ["Og'riq (pain) sohasida og'riqni kamaytirish uchun", "Siydik (urinary) sohasida — tezlik va to'siqli belgilar", "Psixosocial sohada kayfiyatni yaxshilash uchun qo'llaniladi", "Nevrolog sohada nerv og'rig'ini kamaytirish uchun"],
    "togri": 1,
    "izoh": "α-blokerlar CP/CPPS da siydik sohasida — siydik tezligi va to'siqli belgilarni yaxshilash uchun qo'llaniladi. UPOINT da U (Urinary) sohasiga to'g'ri keladi."
  },
  {
    "savol": "CP/CPPS da antibiotiklar infeksiya bo'lmagan hollarda ham qisman yordam berishi mumkin — nima uchun?",
    "variantlar": ["Kelajakdagi yangi infeksiya rivojlanishini oldini olish orqali", "Yallig'lanishga qarshi ta'sir (IL-6, TNF-α pasaytirish) orqali", "Og'riq retseptorlariga to'g'ridan-to'g'ri ta'sir ko'rsatish orqali", "Prostata bezining umumiy hajmini kichraytirish orqali"],
    "togri": 1,
    "izoh": "Antibiotiklar CP/CPPS da infeksiya bo'lmagan hollarda ham IL-6 va TNF-α pasaytirish orqali yallig'lanishga qarshi ta'sir ko'rsatadi — bu empirik davolash uchun ilmiy asoslanish."
  },
  {
    "savol": "Kat. IV (Asimptomatik yallig'lanishli prostatit) davolash talabiga ega bo'ladimi?",
    "variantlar": ["Ha, aniqlangach har doim darhol davolash kerak", "Ko'pincha davolashni talab qilmaydi", "Har doim TURP operatsiyasi talab etiladi", "Har doim antibiotik kursi talab etiladi"],
    "togri": 1,
    "izoh": "Kat. IV — ko'pincha davo talab etmaydi. Tasodifan topilgan asimptomatik yallig'lanish klinik ahamiyati hali to'liq aniqlanmagan topilma hisoblanadi."
  },
  {
    "savol": "NIH tasnifida qaysi kategoriyalarda siydik ekinmasi musbat bo'ladi?",
    "variantlar": ["Faqat kat. I (ABP) da musbat bo'ladi", "Kat. I va II da — bakterial infeksiya bor", "Faqat kat. III va IV da musbat bo'ladi", "Barcha to'rtta kategoriyada ham musbat"],
    "togri": 1,
    "izoh": "Siydik ekinmasi kat. I (ABP) da musbat, kat. II (CBP) da qayta musbat. Kat. III (CP/CPPS) da manfiy, kat. IV da ham manfiy — bu bakterial vs. nobakterial tasniflashning asosi."
  },
  {
    "savol": "PVR (postvoyd qoldiq siydik) tekshiruvi prostatitda nima uchun o'tkaziladi?",
    "variantlar": ["Prostata bezi saratonini erta istisno qilish maqsadida", "Siydik ushlanishini istisno qilish — barcha kategoriyalarda", "Antibiotiklarga sezuvchanlikni aniqlash maqsadida o'tkaziladi", "Bemorning arterial qon bosimini nazorat qilish maqsadida"],
    "togri": 1,
    "izoh": "PVR (ultratovush bilan o'lchanadigan postvoyd qoldiq siydik) barcha prostatit kategoriyalarida siydik ushlanishini istisno qilish uchun tavsiya etiladi."
  },
  {
    "savol": "Qaysi prostatit kategoriyasida prostat massaji DIAGNOSTIKA UCHUN qo'llanilishi mumkin?",
    "variantlar": ["Faqat kat. I (ABP) da qo'llaniladi", "Kat. II, III va IV da qo'llaniladi", "Hech qaysi kategoriyada qo'llanilmaydi", "Faqat kat. IV da qo'llaniladi"],
    "togri": 1,
    "izoh": "Prostat massaji: kat. I (ABP) da MUTLAQ YASAQ (sepsis xavfi). Kat. II, III va IV da EPS olish uchun diagnostika maqsadida qo'llanilishi mumkin."
  },
  {
    "savol": "CP/CPPS da qisqa muddatli simptomi bo'lgan va uzoq muddatli simptomi bo'lgan bemorlar uchun antibiotik samaradorligi qanday farqlanadi?",
    "variantlar": ["Uzoq muddatli simptomli bemorlarda ancha ko'proq foyda beradi", "Qisqa muddatli simptomlilarda uzoq muddatlilarga nisbatan ko'proq", "Ikki guruh o'rtasida samaradorlik jihatidan farq umuman yo'q", "Antibiotik ikkala guruhga ham umuman foyda keltirmaydi"],
    "togri": 1,
    "izoh": "Qisqa muddatli simptomi bo'lgan bemorlarda antibiotik davolash uzoq muddatli simptomi bo'lganlarga nisbatan ko'proq foyda beradi — bu empirik antibiotik qo'llash uchun muhim klinik ma'lumot."
  },
  {
    "savol": "CP/CPPS ning multimodal davolashida psixologik yordam va antidepressantlar qaysi soha uchun qo'llaniladi?",
    "variantlar": ["Siydik (urinary) simptomlari sohasi uchun qo'llaniladi", "Psixosocial (P) sohasi musbat bo'lganda qo'llaniladi", "Organ-spesifik (O) sohasi uchun qo'llaniladigan davo", "Muskuloskeletal (T) og'riqlilik sohasi uchun qo'llaniladi"],
    "togri": 1,
    "izoh": "UPOINT da P (Psychosocial) soha musbat bo'lsa — psixologik yordam va antidepressantlar qo'llaniladi. Ko'p CP/CPPS bemorlarida depressiya, tashvish va hayot sifatining pasayishi kuzatiladi."
  },
  {
    "savol": "Chanoq tubi davolash mashqlari (pelvic floor therapy) CP/CPPS da qaysi soha uchun ko'rsatilgan?",
    "variantlar": ["Siydik (Urinary) belgilar sohasi uchun ko'rsatilgan", "Infeksiya (Infection) sohasi uchun ko'rsatilgan davo", "Muskuloskeletal og'riqlilik (T — Tenderness) sohasi uchun", "Organ-spesifik (Organ) soha uchun ko'rsatilgan davo"],
    "togri": 2,
    "izoh": "Chanoq tubi davolash mashqlari UPOINT da T (Tenderness — muskuloskeletal og'riqlilik) soha musbat bo'lganda qo'llaniladi. Chanoq tubi gipertoniyasi CP/CPPS da muhim omil."
  },
  {
    "savol": "Prostatit bilan bog'liq klinik xulosada qaysi fikr TO'G'RI?",
    "variantlar": ["Barcha prostatit holatlari faqat bakterial sabab bilan kechadi", "CP/CPPS — multimodal, UPOINT fenotiplash eng yaxshi natija", "ABP da ftorokinolon monoterapiyasi yetarli, kasalxona shart emas", "PSA o'tkir prostatitda har doim normal darajada saqlanadi"],
    "togri": 1,
    "izoh": "CP/CPPS (~90% holat) uchun multimodal yondashuv va UPOINT fenotiplashtirish eng yaxshi natija beradi. ABP da og'ir holatlarda kasalxona kerak; PSA o'tkir prostatitda yuqori bo'ladi."
  }
]$prostatit_savollar$::jsonb
WHERE dars_slug = 'prostatit-umumiy-tasniflash';
