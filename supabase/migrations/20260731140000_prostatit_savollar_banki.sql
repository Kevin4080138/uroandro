UPDATE dars_tarkibi
SET savollar_banki = $prostatit_savollar$[
  {
    "savol": "Prostatitning NIH tasnifi qachon nashr etilgan?",
    "variantlar": ["1978-yilda Drach tomonidan", "1999-yilda NIH tomonidan", "2005-yilda AUA tomonidan", "1990-yilda EAU tomonidan"],
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
    "variantlar": ["Surunkali chanoq og'rig'i sindromi", "Og'riq yo'q, tasodifan topiladi", "O'tkir bakterial infeksiya — isitma, LUTS, og'riq", "Qayta uchraydigan UTI epizodlari"],
    "togri": 2,
    "izoh": "NIH kat. I — ABP: o'tkir bakterial infeksiya bilan namoyon bo'ladi — isitma, siydik yo'li belgilari (LUTS) va og'riq. Barcha kategoriyalar orasida eng kam tarqalgani (<5%)."
  },
  {
    "savol": "ABP (O'tkir bakterial prostatit) qaysi yosh guruhlarida ikki cho'qqili tarqalishni ko'rsatadi?",
    "variantlar": ["10–20 va 50–60 yoshda", "20–40 va 60 yoshdan keyin", "30–50 yoshda faqat", "60–70 yoshda faqat"],
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
    "variantlar": ["Og'riq kuchayishi uchun", "Sepsis va bakteriemiyaga olib kelishi mumkin", "PSA darajasini ko'taradi", "Siydik tutilishiga olib keladi"],
    "togri": 1,
    "izoh": "ABP da prostat massaji MUTLAQ YASAQ — massaj sepsis va bakteriemiyaga olib kelishi mumkin. Massaj faqat kat. II, III va IV diagnostikasida qo'llaniladi."
  },
  {
    "savol": "O'tkir prostatitda qon ekinmasi qachon olinishi kerak?",
    "variantlar": ["Antibiotikdan 2 kun keyin", "Antibiotik berishdan oldin, isitma yoki qaltirash bo'lganda", "Kasalxonadan chiqishda", "Faqat surunkali prostatitda"],
    "togri": 1,
    "izoh": "Qon ekinmasi isitma yoki qaltirash bo'lganda antibiotik berishdan OLDIN olinishi kerak — so'ng antibiotik berilsa ekinma manfiy chiqadi va qo'zg'atuvchi aniqlanmaydi."
  },
  {
    "savol": "O'tkir prostatitda PSA ni buyurish nima uchun tavsiya etilmaydi?",
    "variantlar": ["PSA o'tkir prostatitda doim yuqori bo'ladi va prostat saratoni ko'rsatmaydi", "PSA tekshiruvi qimmat", "PSA faqat yoshli erkaklarda ishlatiladi", "PSA klinik ahamiyatga ega emas"],
    "togri": 0,
    "izoh": "O'tkir fazada prostata yallig'lanishi sababli PSA har doim yuqori bo'ladi — bu prostat saratoni belgisi emas. Shuning uchun o'tkir prostatitda PSA buyurish tavsiya etilmaydi."
  },
  {
    "savol": "NIH kategoriya II — Surunkali bakterial prostatit (CBP) ning asosiy klinik xususiyati nima?",
    "variantlar": ["Isitma va qaltirash bilan kechadigan o'tkir infeksiya", "Bir xil bakteriya bilan qayta uchraydigan UTI; epizodlar oralig'ida asimptomatik", "Og'riq yo'q, tasodifan topiladi", "Surunkali chanoq og'rig'i"],
    "togri": 1,
    "izoh": "CBP — prostatada doimiy bakteria manbai bo'lib, bir xil organizm bilan qayta-qayta kelib chiqadigan UTI. Epizodlar oralig'ida bemorlar nisbatan asimptomatik — bu ABP va CP/CPPS dan farqlovchi xususiyat."
  },
  {
    "savol": "Surunkali bakterial prostatit (CBP) uchun qaysi antibiotiklar afzal va nima uchun?",
    "variantlar": ["Penitsyllinlar — keng spektrliligi uchun", "Ftorokinolonlar — prostata to'qimasiga eng yaxshi singagani sababli", "Nitrofurantoin — samaradorligi tufayli", "Karbapenemlar — keng spektrliligi uchun"],
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
    "variantlar": ["Nefrektomiya", "Prostatektomiya", "TURP (prostataning transuretal rezeksiyasi)", "Orxiektomiya"],
    "togri": 2,
    "izoh": "CBP da qaytuvchi holatlarda uzoq muddatli antibiotik suppressiv davolash yoki TURP (transuretal prostat rezeksiyasi) ko'rib chiqilishi mumkin — prostata ichidagi infeksiya manbaini bartaraf etish uchun."
  },
  {
    "savol": "NIH kategoriya III (CP/CPPS) ning ta'rifi qanday?",
    "variantlar": ["O'tkir bakterial infeksiya bilan kechadigan prostatit", "So'nggi 6 oyning kamida 3 oyida chanoqda og'riq; standart usullar bilan uropatogen bakteriya topilmagan", "Og'riq yo'q, tasodifan topiladi", "Faqat yoshli erkaklarda uchraydigan sinrom"],
    "togri": 1,
    "izoh": "CP/CPPS NIH ta'rifi: so'nggi 6 oyning kamida 3 oyida chanoqda og'riq yoki noqulaylik; standart mikrobiologik usullar bilan uropatogen bakteriya topilmagan holat."
  },
  {
    "savol": "CP/CPPS da og'riq manbai doim prostata bo'ladimi?",
    "variantlar": ["Ha, har doim prostata sababli", "Yo'q — og'riq chanoq tubi, nevrologik yoki psixologik omillardan ham kelib chiqishi mumkin", "Faqat orqiq mushaklardan", "Faqat siydik pufagidan"],
    "togri": 1,
    "izoh": "'Prostatit' atamasi tarixiy — zamonaviy tushunchaga ko'ra CP/CPPS da og'riq chanoq tubi, nevrolog yoki psixologik omillardan ham kelib chiqishi mumkin. Og'riq manbai doim prostata emas."
  },
  {
    "savol": "NIH-CPSI (Surunkali Prostatit Simptom Indeksi) qaysi uch sohani qamrab oladi?",
    "variantlar": ["Isitma, og'riq, siydik", "Og'riq, siydik simptomlari va hayot sifati (QOL)", "Laborator, klinik va radiologik", "Og'riq, jinsiy funksiya va uyqu"],
    "togri": 1,
    "izoh": "NIH-CPSI uch sohani baholaydi: Pain (og'riq — perineum, moyaklar, suprapubik), Urinary (siydik tezligi, to'siqli belgilar) va QOL (hayot sifati — kundalik faoliyatga ta'sir)."
  },
  {
    "savol": "CP/CPPS da og'riq qaysi sohada eng ko'p (63%) seziladi?",
    "variantlar": ["Suprapubik soha (42%)", "Penis uchi (32%)", "Perineum (63%)", "Bel sohasida"],
    "togri": 2,
    "izoh": "NIH-CPSI bo'yicha og'riq joylashuvi: perineum (63%) — eng ko'p; moyaklar (58%); ejakulyatsiya paytida og'riq (48%); suprapubik soha (42%); penis uchi (32%)."
  },
  {
    "savol": "IIIA va IIIB subkategoriyalarining farqi nimada va klinik amaliyotda bu farq muhimmi?",
    "variantlar": ["IIIA — og'riq yo'q; IIIB — og'riq bor; klinik muhim", "IIIA — EPS/VB3 da leykotsitlar bor (yallig'lanishli); IIIB — yo'q; klinik amaliyotda sezilarli farq ko'rsatilmagan", "IIIA — bakteria bor; IIIB — yo'q; muhim farq", "IIIA — og'ir; IIIB — engil kechadi"],
    "togri": 1,
    "izoh": "IIIA — EPS/VB3 da leykotsitlar bor (yallig'lanishli); IIIB — yo'q (yallig'lanishsiz). Ammo klinik amaliyotda ikkisi o'rtasida sezilarli klinik farq ko'rsatilmagan — hozirgi qo'llanmalar mikroskopiya asosida farqlashni tavsiya etmaydi."
  },
  {
    "savol": "UPOINT fenotiplashtirish tizimi nima?",
    "variantlar": ["Prostatit uchun jarrohlik tasnifi", "CP/CPPS da bemorni 6 soha bo'yicha tavsiflash va individual davolash rejasi tuzish tizimi", "Antibiotik tanlash algoritmi", "Laborator tekshiruvlar ketma-ketligi"],
    "togri": 1,
    "izoh": "UPOINT — CP/CPPS bemorini 6 soha bo'yicha baholash: U-Urinary, P-Psychosocial, O-Organ-specific, I-Infection, N-Neurologic/Systemic, T-Tenderness. Har bir bemor noyob 'qor parchasi' profili ko'rsatadi."
  },
  {
    "savol": "UPOINT tizimidagi 'I' harfi qaysi sohani anglatadi?",
    "variantlar": ["Immunologik", "Infeksiya (Infection)", "Interstitial", "Inguinal"],
    "togri": 1,
    "izoh": "UPOINT da I — Infection (infeksiya belgilari) sohasi. Bu soha musbat bo'lsa antibiotik qo'shiladi. 6 soha: Urinary, Psychosocial, Organ-specific, Infection, Neurologic/Systemic, Tenderness."
  },
  {
    "savol": "CP/CPPS tashxisi qanday xarakterga ega?",
    "variantlar": ["Tasdiqlash tashxisi — laboratoriya tasdiqlaydi", "Istisno qilish tashxisi — boshqa sabablar istisno qilingandan keyin qo'yiladi", "Faqat KT bilan tasdiqlanadi", "Faqat biopsiya bilan tasdiqlanadi"],
    "togri": 1,
    "izoh": "CP/CPPS — istisno qilish tashxisi. Diagnoz qo'yishdan oldin boshqa organik sabablar (tosh, saraton, infeksiya, nevrolog patologiya) istisno qilinishi kerak."
  },
  {
    "savol": "NIH kategoriya IV — Asimptomatik yallig'lanishli prostatit qanday aniqlanadi?",
    "variantlar": ["Og'riq va dizuriya bilan klinik namoyon bo'ladi", "Boshqa sabab bilan o'tkazilgan tekshiruv (biopsiya, sperma tahlili) davomida tasodifan topiladi", "Laborator tekshiruvda doim aniqlanadi", "Isitma va qaltirash bilan boshlanadi"],
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
    "variantlar": ["Prostata biopsiyasi usuli; hozir TRUS bilan o'zgartirilgan", "VB1, VB2, EPS va VB3 — lokalizatsiya uchun; hozir soddalashtirilgan ikki stakan usuli (VB2+VB3) ko'proq qo'llaniladi", "Qon tahlili usuli; hozir NAAT bilan o'zgartirilgan", "Ultratovush usuli; hozir KT bilan o'zgartirilgan"],
    "togri": 1,
    "izoh": "Meares-Stamey to'rt stakan usuli (VB1, VB2, EPS, VB3) lokalizatsiya uchun 'oltin standart' edi. Hozirgi amaliyotda soddalashtirilgan ikki stakan usuli (VB2 + VB3) ko'proq qo'llaniladi."
  },
  {
    "savol": "Kat. I (ABP) da prostat absessi shubhasi bo'lganda qaysi tekshiruv ko'rsatiladi?",
    "variantlar": ["Siydik sitologiyasi", "TRUS yoki KT — 48 soatda javob yo'q bo'lsa", "Qon ekinmasi", "PSA tahlili"],
    "togri": 1,
    "izoh": "ABP da 48 soatda antibiotikka javob yo'q bo'lsa — prostat absessi istisno qilish uchun TRUS (transrektal ultratovush) yoki KT majburiy."
  },
  {
    "savol": "Kat. III (CP/CPPS) da siydik sitologiyasi nima uchun tavsiya etiladi?",
    "variantlar": ["Bakteriya turini aniqlash uchun", "Irritativ simptomlar va gematuriyada qovuq karsinoma in situ (CIS) ni istisno qilish uchun", "Prostat saratonini aniqlash uchun", "Antibiotik sezuvchanligini tekshirish uchun"],
    "togri": 1,
    "izoh": "Kat. III da irritativ siydik simptomlari va gematuriya bo'lsa — siydik sitologiyasi qovuq karsinoma in situ (CIS) ni istisno qilish uchun o'tkaziladi."
  },
  {
    "savol": "ABP da kasalxonaga yotqizish ko'rsatmasi qanday?",
    "variantlar": ["Hech qachon kasalxona shart emas", "Tizimli infeksiya belgilari (sepsis, yuqori isitma, qusish) bo'lsa — kasalxona, IV antibiotik", "Faqat yoshli erkaklarda kasalxona kerak", "Faqat prostat absessida kasalxona kerak"],
    "togri": 1,
    "izoh": "ABP da tizimli infeksiya belgilari (sepsis, yuqori isitma, qusish) bo'lsa — kasalxonaga yotqizish, IV antibiotiklar (aminoglikozid + ampitsillin yoki karbapenem), gidratatsiya va kuzatuv zarur."
  },
  {
    "savol": "ABP da siydik ushlanishida qaysi drenaj usuli afzal?",
    "variantlar": ["Uretral kateter uzoq muddatda afzal", "Suprapubik kateter uzoq muddatli drenajda afzal", "Hech qanday drenaj shart emas", "Faqat operatsiya yo'li"],
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
    "variantlar": ["Faqat antibiotik", "Antibiotik va α-bloker kombinatsiyasi", "Faqat α-bloker", "NSAID va α-bloker"],
    "togri": 1,
    "izoh": "Meta-tahlillar: antibiotik va α-bloker kombinatsiyasi NIH-CPSI ballini 13,8 ballga kamaytiradi — monoterapiyaga nisbatan ancha yuqori. Bu multimodal yondashuvning asosi."
  },
  {
    "savol": "CP/CPPS da α-blokerlar qaysi soha uchun qo'llaniladi?",
    "variantlar": ["Og'riq sohasida", "Siydik (urinary) sohasida — siydik tezligi va to'siqli belgilar", "Psixosocial sohada", "Nevrolog sohada"],
    "togri": 1,
    "izoh": "α-blokerlar CP/CPPS da siydik sohasida — siydik tezligi va to'siqli belgilarni yaxshilash uchun qo'llaniladi. UPOINT da U (Urinary) sohasiga to'g'ri keladi."
  },
  {
    "savol": "CP/CPPS da antibiotiklar infeksiya bo'lmagan hollarda ham qisman yordam berishi mumkin — nima uchun?",
    "variantlar": ["Yangi infeksiyani oldini oladi", "Yallig'lanishga qarshi ta'sir (IL-6 va TNF-α pasaytirish) orqali", "Og'riqni to'g'ridan-to'g'ri kamaytiradi", "Prostata hajmini kichraytiradi"],
    "togri": 1,
    "izoh": "Antibiotiklar CP/CPPS da infeksiya bo'lmagan hollarda ham IL-6 va TNF-α pasaytirish orqali yallig'lanishga qarshi ta'sir ko'rsatadi — bu empirik davolash uchun ilmiy asoslanish."
  },
  {
    "savol": "Kat. IV (Asimptomatik yallig'lanishli prostatit) davolash talabiga ega bo'ladimi?",
    "variantlar": ["Ha, har doim darhol davolash kerak", "Ko'pincha davo talab etmaydi", "Har doim TURP kerak", "Har doim antibiotik kerak"],
    "togri": 1,
    "izoh": "Kat. IV — ko'pincha davo talab etmaydi. Tasodifan topilgan asimptomatik yallig'lanish klinik ahamiyati hali to'liq aniqlanmagan topilma hisoblanadi."
  },
  {
    "savol": "NIH tasnifida qaysi kategoriyalarda siydik ekinmasi musbat bo'ladi?",
    "variantlar": ["Faqat kat. I da", "Kat. I va II da — bakterial infeksiya bor", "Kat. III va IV da", "Barcha kategoriyalarda"],
    "togri": 1,
    "izoh": "Siydik ekinmasi kat. I (ABP) da musbat, kat. II (CBP) da qayta musbat. Kat. III (CP/CPPS) da manfiy, kat. IV da ham manfiy — bu bakterial vs. nobakterial tasniflashning asosi."
  },
  {
    "savol": "PVR (postvoyd qoldiq siydik) tekshiruvi prostatitda nima uchun o'tkaziladi?",
    "variantlar": ["Prostat saratonini istisno qilish uchun", "Siydik ushlanishini istisno qilish uchun — barcha kategoriyalarda", "Antibiotik sezuvchanligini aniqlash uchun", "Qon bosimini tekshirish uchun"],
    "togri": 1,
    "izoh": "PVR (ultratovush bilan o'lchanadigan postvoyd qoldiq siydik) barcha prostatit kategoriyalarida siydik ushlanishini istisno qilish uchun tavsiya etiladi."
  },
  {
    "savol": "Qaysi prostatit kategoriyasida prostat massaji DIAGNOSTIKA UCHUN qo'llanilishi mumkin?",
    "variantlar": ["Faqat kat. I da", "Kat. II, III va IV da", "Hech qaysi kategoriyada emas", "Faqat kat. IV da"],
    "togri": 1,
    "izoh": "Prostat massaji: kat. I (ABP) da MUTLAQ YASAQ (sepsis xavfi). Kat. II, III va IV da EPS olish uchun diagnostika maqsadida qo'llanilishi mumkin."
  },
  {
    "savol": "CP/CPPS da qisqa muddatli simptomi bo'lgan va uzoq muddatli simptomi bo'lgan bemorlar uchun antibiotik samaradorligi qanday farqlanadi?",
    "variantlar": ["Uzoq muddatli bemorlarda ko'proq foyda beradi", "Qisqa muddatli simptomi bo'lganlarda antibiotik uzoq muddatlilarga nisbatan ko'proq foyda beradi", "Farq yo'q", "Antibiotik umuman foyda bermaydi"],
    "togri": 1,
    "izoh": "Qisqa muddatli simptomi bo'lgan bemorlarda antibiotik davolash uzoq muddatli simptomi bo'lganlarga nisbatan ko'proq foyda beradi — bu empirik antibiotik qo'llash uchun muhim klinik ma'lumot."
  },
  {
    "savol": "CP/CPPS ning multimodal davolashida psixologik yordam va antidepressantlar qaysi soha uchun qo'llaniladi?",
    "variantlar": ["Siydik simptomlari uchun", "Psixosocial (P) sohasida", "Organ-spesifik (O) sohasida", "Muskuloskeletal (T) sohasida"],
    "togri": 1,
    "izoh": "UPOINT da P (Psychosocial) soha musbat bo'lsa — psixologik yordam va antidepressantlar qo'llaniladi. Ko'p CP/CPPS bemorlarida depressiya, tashvish va hayot sifatining pasayishi kuzatiladi."
  },
  {
    "savol": "Chanoq tubi davolash mashqlari (pelvic floor therapy) CP/CPPS da qaysi soha uchun ko'rsatilgan?",
    "variantlar": ["Siydik sohasida", "Infeksiya sohasida", "Muskuloskeletal og'riqlilik (T — Tenderness) sohasida", "Organ-spesifik sohasida"],
    "togri": 2,
    "izoh": "Chanoq tubi davolash mashqlari UPOINT da T (Tenderness — muskuloskeletal og'riqlilik) soha musbat bo'lganda qo'llaniladi. Chanoq tubi gipertoniyasi CP/CPPS da muhim omil."
  },
  {
    "savol": "Prostatit bilan bog'liq klinik xulosada qaysi fikr TO'G'RI?",
    "variantlar": ["Barcha prostatit holatlari bakterial sababli", "CP/CPPS — multimodal, UPOINT asosida fenotiplashtirish eng yaxshi natija beradi", "ABP da ftorokinolonlar monoterapiyasi yetarli, kasalxona shart emas", "PSA o'tkir prostatitda normal bo'ladi"],
    "togri": 1,
    "izoh": "CP/CPPS (~90% holat) uchun multimodal yondashuv va UPOINT fenotiplashtirish eng yaxshi natija beradi. ABP da og'ir holatlarda kasalxona kerak; PSA o'tkir prostatitda yuqori bo'ladi."
  }
]$prostatit_savollar$::jsonb
WHERE dars_slug = 'prostatit-umumiy-tasniflash';
