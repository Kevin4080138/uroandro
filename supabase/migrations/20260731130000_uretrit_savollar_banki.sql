UPDATE dars_tarkibi
SET savollar_banki = $uretrit_savollar$[
  {
    "savol": "Uretrit qanday holat sifatida ta'riflanadi?",
    "variantlar": ["Qovuq shilliq qavatining bakterial yallig'lanishi", "Uretra epiteli qoplamining infeksiya/yallig'lanishi", "Prostata bezining o'tkir bakterial yallig'lanishi", "Buyrak jomi va kosachalarining yallig'lanishi"],
    "togri": 1,
    "izoh": "Uretrit — uretra epiteli qoplamining infeksiya yoki yallig'lanishi. Sistit qovuq, prostatit prostata, pielonefrit esa buyrak jomining yallig'lanishi."
  },
  {
    "savol": "2021 CDC qo'llanmasiga ko'ra, uretra ajralmasining Gram bo'yoqli surtmasida yog' immersion maydonida qancha leykotsit uretritni tasdiqlash mezoni hisoblanadi?",
    "variantlar": ["≥1 leykotsit", "≥2 leykotsit", "≥5 leykotsit", "≥10 leykotsit"],
    "togri": 1,
    "izoh": "2021 CDC qo'llanmasiga ko'ra uretra surtmasida ≥2 WBC/yog' immersion maydoni (HPF) uretritni tasdiqlash uchun yetarli. Avvalgi ≥5 WBC/HPF mezoni o'zgartirildi."
  },
  {
    "savol": "Avvalgi CDC qo'llanmalarida qo'llanilgan ≥5 WBC/HPF mezoni nima uchun o'zgartirildi?",
    "variantlar": ["Juda ko'p soxta musbat natija berib yuborgani uchun", "C. trachomatis, gonokokk, M. genitaliumni o'tkazib yuborgani", "Texnik jihatdan bajarish juda qiyin bo'lgani uchun", "Yangi va aniqroq test turi ixtiro qilingani uchun"],
    "togri": 1,
    "izoh": "≥5 WBC/HPF mezoni C. trachomatis, N. gonorrhoeae va M. genitalium bilan bog'liq ko'plab uretrit holatlarini o'tkazib yuborgan — shuning uchun yanada sezgirroq ≥2 WBC/HPF mezoni joriy etildi."
  },
  {
    "savol": "Birinchi qism siydikda uretrit mezoni sifatida qanday leykotsit soni qabul qilingan?",
    "variantlar": ["≥2 leykotsit/HPF", "≥5 leykotsit/HPF", "≥10 leykotsit/HPF", "≥20 leykotsit/HPF"],
    "togri": 2,
    "izoh": "Birinchi qism siydikda ≥10 leykotsit/HPF uretrit diagnostik mezoni hisoblanadi. Uretra surtmasi uchun ≥2 WBC/HPF, siydik uchun esa ≥10 WBC/HPF — ikki xil mezon."
  },
  {
    "savol": "Gonokokkli uretritni keltirib chiqaruvchi qo'zg'atuvchi qanday mikroorganizm?",
    "variantlar": ["Gram-musbat kokk (juft joylashgan)", "Gram-manfiy diplococcus (juft kokk)", "Obligat hujayra ichi paraziti bakteriya", "Hujayra devorisiz mikoplazma bakteriyasi"],
    "togri": 1,
    "izoh": "Neisseria gonorrhoeae — gram-manfiy diplococcus (juft kokk). Surtmada hujayra ichidagi gram-manfiy diplokokklar ko'rinadi. Chlamydia — obligat hujayra ichi paraziti; Mycoplasma — hujayra devorisiz."
  },
  {
    "savol": "N. gonorrhoeae ning inkubatsiya davri qancha?",
    "variantlar": ["1–2 kun", "3–14 kun", "3–4 hafta", "2–3 oy"],
    "togri": 1,
    "izoh": "N. gonorrhoeae ning inkubatsiya davri 3–14 kun. Bu qisqa inkubatsiya davrini bilish kontaktlarni aniqlash va davolashda muhim."
  },
  {
    "savol": "Gonokokkli uretritda erkaklar odatda qanday kechadi?",
    "variantlar": ["Ko'pincha asimptomatik — belgisiz kechadi", "Ko'pincha simptomli — yiringli ajralma, dizuriya", "Faqat qonli siydik (gematuriya) bilan kechadi", "Hech qanday klinik belgi bermay yashirin kechadi"],
    "togri": 1,
    "izoh": "Erkaklar gonokokkli uretritda ko'pincha simptomli — yiringli uretra ajralma va dizuriya kuzatiladi. Ayollar esa ko'pincha asimptomatik kechadi."
  },
  {
    "savol": "Ayollarda gonokokkli infeksiya ko'pincha qanday kechadi va qanday asoratlarga olib kelishi mumkin?",
    "variantlar": ["Simptomli kechadi, faqat dizuriya bilan namoyon", "Asimptomatik; PID, bepushtlik, ektopik homiladorlik", "Hech qachon asoratlanmaydigan yengil infeksiya", "Faqat teri toshmalari bilan namoyon bo'ladigan holat"],
    "togri": 1,
    "izoh": "Ayollarda gonokokkli infeksiya ko'pincha asimptomatik kechadi — bu kechroq aniqlanishga va og'ir asoratlarga (PID, fallop nay chandiqlanishi, bepushtlik, ektopik homiladorlik) olib keladi."
  },
  {
    "savol": "Simptomli erkak uretra surtmasida hujayra ichidagi gram-manfiy diplokokklarning aniqlanishi qanday ahamiyatga ega?",
    "variantlar": ["Ahamiyatsiz — albatta qo'shimcha test talab qiladi", "Diagnostik — gonoreyani ishonchli tasdiqlaydi", "Faqat NGU (nogonokokkli) ni ko'rsatib beradi", "Faqat epidemiologik statistik ma'lumot beradi"],
    "togri": 1,
    "izoh": "Simptomli erkak uretra surtmasida hujayra ichidagi gram-manfiy diplokokklar aniqlanishi gonoreyani tasdiqlash uchun diagnostik hisoblanadi. Ayollarda va asimptomatik erkaklarda esa NAAT talab etiladi."
  },
  {
    "savol": "Gonoreya diagnostikasida eng sezuvchan usul qaysi va qaysi namuna afzal ko'riladi?",
    "variantlar": ["Gram bo'yog'i tekshiruvi; uretra surtmasi namunasi", "NAAT amplifikatsiya testi; birinchi qism siydik", "Mikrobiologik ekinma (culture); venoz qon namunasi", "Seroligik (antitana) test; vena qoni namunasi"],
    "togri": 1,
    "izoh": "NAAT (Nucleic Acid Amplification Test) gonoreya va xlamidiya diagnostikasining eng sezuvchan usuli. Birinchi qism siydik — afzal namuna; uretra surtmasi ham qabul qilinadi."
  },
  {
    "savol": "Gonokokkli uretrit uchun 2021 CDC qo'llanmasida birinchi tanlov davo qaysi?",
    "variantlar": ["Azitromitsin 1 g og'iz orqali bir martalik doza", "Seftriakson 500 mg IM, yagona (bir martalik) doza", "Doksisiklin 100 mg × 2/kun, 7 kunlik kurs bilan", "Siprofloksatsin 500 mg og'iz orqali bir martalik"],
    "togri": 1,
    "izoh": "2021 CDC: seftriakson 500 mg IM yagona doza — gonokokkli uretrit uchun birinchi tanlov. Og'irligi ≥150 kg bo'lganda doza 1 g ga oshiriladi."
  },
  {
    "savol": "Bemor og'irligi ≥150 kg bo'lganda seftriakson dozasi qanday o'zgaradi?",
    "variantlar": ["250 mg IM ga kamaytiriladi", "1 g IM ga oshiriladi", "O'zgarishsiz saqlanadi", "Ikkiga bo'lib yuboriladi"],
    "togri": 1,
    "izoh": "Og'irligi ≥150 kg bo'lgan bemorlarda seftriakson dozasi 1 g IM ga oshiriladi — standart 500 mg doza yetarli terapevtik kontsentratsiya yaratmasligi mumkin."
  },
  {
    "savol": "Seftriakson mavjud bo'lmaganda gonoreya uchun muqobil davo sxemasi qaysi?",
    "variantlar": ["Gentamitsin 240 mg IM + azitromitsin 2 g og'iz", "Doksisiklin 100 mg × 2/kun, 7 kunlik kurs bilan", "Faqat azitromitsin 500 mg bir martalik doza", "Penitsyllin 1 g IM (mushak ichiga) yuboriladi"],
    "togri": 0,
    "izoh": "Seftriakson mavjud bo'lmagan holatlarda: gentamitsin 240 mg IM + azitromitsin 2 g og'iz orqali, yagona doza — CDC 2021 muqobil sxemasi."
  },
  {
    "savol": "CDC 2021 nima uchun gonoreya uchun kombinatsiyalangan (seftriakson+azitromitsin) sxemadan voz kechib, monoterapiyaga o'tdi?",
    "variantlar": ["Azitromitsin endi ishlab chiqarilmay qolgani uchun", "Rezistentlik tufayli doza oshirilib monoterapiyaga", "Monoterapiya ancha arzonroq bo'lib qolgani uchun", "Kombinatsiyaning yon ta'sirlari ko'p bo'lgani uchun"],
    "togri": 1,
    "izoh": "Azitromitsinga gonokokk rezistentligi ortib borishi sababli, CDC 2021 kombinatsiyadan voz kechdi va seftriakson dozasini 250 mg dan 500 mg ga oshirib monoterapiyaga o'tdi."
  },
  {
    "savol": "Ftorokinolonlar gonoreya davolashida hozirgi holatda qanday tavsiya etiladi?",
    "variantlar": ["Birinchi tanlov dori sifatida tavsiya etiladi", "Endi tavsiya etilmaydi (rezistentlik tufayli)", "Faqat homilador ayollarda tavsiya etiladi", "Faqat go'dak va bolalarda tavsiya etiladi"],
    "togri": 1,
    "izoh": "Ftorokinolonlar (siprofloksatsin va boshqalar) N. gonorrhoeae ga keng tarqalgan rezistentlik sababli gonoreya davolashida endi tavsiya etilmaydi."
  },
  {
    "savol": "Nogonokokkli uretrit (NGU) uretrit holatlarining taxminan necha foizini tashkil etadi?",
    "variantlar": ["5–20%", "30–50%", "80–95%", "100%"],
    "togri": 2,
    "izoh": "NGU barcha uretrit holatlarining 80–95% ini tashkil etadi — gonokokkli uretritdan ancha ko'p uchraydi."
  },
  {
    "savol": "NGU qanday tasniflanadi?",
    "variantlar": ["Faqat xlamidiya aniqlangan uretrit holatlari", "N. gonorrhoeae aniqlanmagan barcha uretritlar", "Faqat virusli qo'zg'atuvchili uretrit holatlari", "Faqat qo'zg'atuvchisi noma'lum uretrit holatlari"],
    "togri": 1,
    "izoh": "NGU (Nogonokokkli uretrit) — N. gonorrhoeae aniqlanmagan barcha uretrit holatlari. Bu xlamidiya, M. genitalium, trixomonad, HSV va boshqalar bilan bog'liq bo'lishi mumkin."
  },
  {
    "savol": "NGU qo'zg'atuvchilari orasida eng keng tarqalgani va yoshlar orasida ko'proq uchraydigani qaysi?",
    "variantlar": ["Mycoplasma genitalium", "Chlamydia trachomatis", "Ureaplasma urealyticum", "Trichomonas vaginalis"],
    "togri": 1,
    "izoh": "Chlamydia trachomatis NGU ning eng keng tarqalgan sababi — ayniqsa 24 yoshdan kichik yoshlarda yuqori tarqalishga ega. AQShda eng ko'p ro'yxatga olingan jinsiy yo'l bilan yuquvchi infeksiya."
  },
  {
    "savol": "Qayta va surunkali NGUning asosiy sababi hisoblangan qo'zg'atuvchi qaysi?",
    "variantlar": ["Chlamydia trachomatis", "Mycoplasma genitalium", "Trichomonas vaginalis", "HSV-1 va HSV-2 viruslari"],
    "togri": 1,
    "izoh": "Mycoplasma genitalium qayta va surunkali NGU ning asosiy sababi. Azitromitsinga ortib borayotgan rezistentlik davolashni qiyinlashtiradi."
  },
  {
    "savol": "Keng tekshiruvdan keyin ham qo'zg'atuvchi aniqlanmagan NGU holatlari qancha foizni tashkil etadi?",
    "variantlar": ["10% dan kam holatlarda", "Taxminan 20–30% holatda", "50% dan ko'p holatlarda", "Deyarli 0% (aniqlanadi)"],
    "togri": 2,
    "izoh": "Keng tekshiruvdan keyin ham NGU holatlarining 50% dan ko'pida qo'zg'atuvchi aniqlanmaydi — bu empirik davolash zarurligini ko'rsatadi."
  },
  {
    "savol": "NGU uchun birinchi tanlov davo qaysi va nima uchun?",
    "variantlar": ["Seftriakson — gonoreyaga ham ta'sir qilgani uchun", "Doksisiklin 100 mg × 2/kun, 7 kun — xlamidiya/M.gen", "Faqat azitromitsin — bir martalik doza qulayligi uchun", "Metronidazol — trixomonadaga ta'sir qilgani uchun"],
    "togri": 1,
    "izoh": "Doksisiklin 100 mg × 2/kun, 7 kun — NGU ning birinchi tanlov davosi. C. trachomatis va M. genitaliumga yaxshi faollik ko'rsatadi. Azitromitsinga M. genitalium rezistentligi ortib borgani uchun doksisiklin afzalroq."
  },
  {
    "savol": "NGU uchun azitromitsinning muqobil dozalash sxemalaridan biri qaysi?",
    "variantlar": ["1 g yagona doza yoki 500 mg + 250 mg × 4 kun", "2 g og'iz orqali kuniga, jami 5 kun davomida", "100 mg × 2/kun, 10 kunlik kurs bilan qabul", "3 g bir martalik (yagona) doza bilan qabul"],
    "togri": 0,
    "izoh": "Azitromitsin NGU uchun muqobil davo: 1 g yagona doza yoki 500 mg birinchi kuni, so'ng 250 mg × 4 kun (jami 1.5 g). Ammo M. genitalium rezistentligi tufayli doksisiklin afzalroq."
  },
  {
    "savol": "C. trachomatis qanday turdagi bakteriya?",
    "variantlar": ["Erkin yashovchi gram-musbat kokk bakteriya", "Obligat hujayra ichi gram-manfiy bakteriya", "Hujayra devorisiz mikoplazma bakteriyasi", "Spiral shaklli spiroket (spiroxeta) bakteriya"],
    "togri": 1,
    "izoh": "C. trachomatis — obligat hujayra ichida yashovchi gram-manfiy bakteriya. Mustaqil ATP sintez qila olmaydi, shuning uchun faqat tirik hujayralarda ko'payadi. Bu uni ekinmada o'stirishni qiyinlashtiradi."
  },
  {
    "savol": "AQShda C. trachomatis infeksiyasi qaysi yosh guruhida eng yuqori tarqalishga ega?",
    "variantlar": ["24 yoshdan kichik yoshlarda", "40–50 yosh oralig'ida", "60 yoshdan katta erkaklarda", "Yoshga bog'liq farq sezilmaydi"],
    "togri": 0,
    "izoh": "C. trachomatis infeksiyasi 24 yoshdan kichik yoshlarda eng yuqori tarqalishga ega. Bu yosh guruhini skrining qilish USPSTF va CDC tomonidan tavsiya etiladi."
  },
  {
    "savol": "Xlamidiya infeksiyasida erkaklar va ayollar orasidagi klinik farq qanday?",
    "variantlar": ["Ikkalasida ham har doim asimptomatik kechadi", "Erkaklar asosan simptomli, ayollar asimptomatik", "Ayollar asosan simptomli, erkaklar asimptomatik", "Ikkalasida ham har doim simptomli kechadi"],
    "togri": 1,
    "izoh": "Xlamidiyada erkaklar NGU belgilari bilan simptomli bo'lishi ko'proq, ayollar esa ko'pincha asimptomatik kechadi. Ayollarda asimptomatik kechishi PID va uning asoratlariga olib kelishi mumkin."
  },
  {
    "savol": "Xlamidiya infeksiyasidan keyin davolash tugagach, qachon takroriy NAAT tavsiya etiladi?",
    "variantlar": ["Davolash tugagach 1 hafta o'tib", "Davolash tugagach 1 oy o'tib", "Davolash tugagach 3 oy o'tib", "Davolash tugagach 1 yil o'tib"],
    "togri": 2,
    "izoh": "Xlamidiya davolangandan 3 oy o'tib takroriy NAAT — qayta infeksiyani aniqlash uchun tavsiya etiladi. Bu davolashdan keyingi erta test emas, balki 3 oydan keyin skrining."
  },
  {
    "savol": "Xlamidiya tasdiqlanganda qo'shimcha qaysi infeksiyalar uchun tekshiruv o'tkazish tavsiya etiladi?",
    "variantlar": ["Faqat gepatit B va gepatit C uchun", "Gonorey, HIV va sifilis uchun", "Faqat tuberkulyoz (sil) uchun", "Faqat gepatit A infeksiyasi uchun"],
    "togri": 1,
    "izoh": "Xlamidiya tasdiqlanganda bir vaqtda gonorey, HIV va sifilis uchun tekshiruv o'tkazish tavsiya etiladi — jinsiy yo'l bilan yuquvchi infeksiyalar ko'pincha birga uchraydi."
  },
  {
    "savol": "M. genitalium birinchi marta qachon aniqlangan va NGU ichida qancha ulushni tashkil etadi?",
    "variantlar": ["1990-yillar oxirida; NGU ning 5–10% i", "1980-yillar boshida; NGU ning 15–25% i", "2000-yillar boshida; NGU ning 50% dan ortig'i", "1960-yillar oxirida; NGU ning 1–5% i"],
    "togri": 1,
    "izoh": "M. genitalium 1980-yillarning boshida birinchi marta aniqlangan va NGU holatlarining 15–25% ini tashkil etadi. Qayta va surunkali NGU da ulushi yanada yuqori."
  },
  {
    "savol": "M. genitaliumni Gram bo'yog'i bilan bo'yab bo'lmaydigan sababi nima?",
    "variantlar": ["O'ta juda kichik o'lchamga ega bo'lgani sababli", "Hujayra devoriga ega bo'lmagani (yo'qligi) sababli", "Faqat hujayra ichida yashab ko'payishi sababli", "Antibiotiklarga chidamli (rezistent) bo'lgani sababli"],
    "togri": 1,
    "izoh": "M. genitalium hujayra devoriga ega emas — shuning uchun Gram bo'yog'i bilan bo'yanmaydi. Bu uni beta-laktam antibiotiklarga (penitsyllin, sefalosporinlar) ham nishonga olmaydi."
  },
  {
    "savol": "M. genitalium diagnostikasida yagona klinik foydali usul qaysi?",
    "variantlar": ["Gram bo'yog'i (mikroskopiya)", "Mikrobiologik ekinma (culture)", "NAAT amplifikatsiya testi", "Seroligik (antitana) test"],
    "togri": 2,
    "izoh": "NAAT — M. genitalium diagnostikasida yagona klinik foydali usul. Gram bo'yog'i ishlamaydi (hujayra devori yo'q), ekinma esa 6 oygacha vaqt talab qiladi va amaliy emas."
  },
  {
    "savol": "M. genitalium uchun ekinmada o'sish qancha vaqt davom etishi va bu nima uchun amaliy emasligini bildiradi?",
    "variantlar": ["1–2 kun; juda tez o'sib natija beradi", "6 oygacha; uzoq vaqt talab qilgani uchun amaliy emas", "Bir hafta; standart o'sish vaqti hisoblanadi", "24 soat ichida; tezkor natija bergani uchun"],
    "togri": 1,
    "izoh": "M. genitalium ekinmada o'sishi 6 oygacha vaqt talab qiladi — bu klinik diagnostika uchun mutlaqo amaliy emas. Shuning uchun NAAT yagona klinik foydali usul hisoblanadi."
  },
  {
    "savol": "M. genitalium uchun AQShda makrolid (azitromitsin) rezistentligi qanday darajada?",
    "variantlar": ["5% dan kam (juda past)", "20–30% oralig'ida", "44–90% (juda yuqori)", "Deyarli 0% (yo'q)"],
    "togri": 2,
    "izoh": "M. genitalium uchun azitromitsinga makrolid rezistentligi AQShda 44–90% ga yetgan — bu juda yuqori daraja. Shuning uchun empirik azitromitsin monoterapiyasi ko'pincha muvaffaqiyatsiz bo'ladi."
  },
  {
    "savol": "M. genitalium rezistentligi yuqori bo'lgani uchun qanday yondashuv eng yuqori samaradorlikni ta'minlaydi?",
    "variantlar": ["Empirik azitromitsin monoterapiyasini qo'llash", "Rezistentlik testiga asoslangan maqsadli davolash", "Faqat doksisiklin bilan uzoq muddatli davolash", "Faol davolashsiz oddiy dinamik kuzatuv"],
    "togri": 1,
    "izoh": "M. genitalium uchun rezistentlik testiga asoslangan maqsadli davolash eng yuqori samaradorlikni ta'minlaydi. Makrolid rezistentligi yo'q bo'lsa — azitromitsin; rezistentlik bo'lsa — moksifloksatsin."
  },
  {
    "savol": "GU va NGU o'rtasidagi ajralma xarakteridagi farq qanday?",
    "variantlar": ["GU da shilliq, NGU da yiringli ajralma bo'ladi", "GU da ko'pincha yiringli, NGU da shilliq/kam", "Ikkalasida ham bir xil xarakterli ajralma bo'ladi", "Ikkalasida ham hech qanday ajralma bo'lmaydi"],
    "togri": 1,
    "izoh": "Gonokokkli uretritda ajralma ko'pincha yiringli (sariq-yashil, ko'p miqdorli), NGU da esa shilliq yoki seroz, oz miqdorda. Ammo ajralma xarakteri yordamchi belgi bo'lib, tashxis uchun yetarli emas."
  },
  {
    "savol": "GU va NGU uchun asosiy diagnostik usul (NAAT) uchun qaysi namuna afzal ko'riladi?",
    "variantlar": ["Venoz (tomir) qoni namunasi", "Birinchi qism siydik namunasi", "Ikkinchi (o'rta) qism siydik", "Prostata bezi sekreti namunasi"],
    "togri": 1,
    "izoh": "NAAT uchun birinchi qism siydik afzal namuna — uretra epitheli hujayralarini to'playdi. Ikkinchi qism siydik (o'rta qism) esa suyultirilgan bo'lib, sezuvchanlik pasayadi."
  },
  {
    "savol": "Uretrit davolashida umumiy tamoyillardan biri sifatida, qo'zg'atuvchi aniqlanmagan holatda qanday yondashuv qo'llaniladi?",
    "variantlar": ["Davolash boshlanmaydi, faqat kuzatuv olib boriladi", "Empirik (taxminiy) davolash zudlik bilan boshlanadi", "Faqat jarrohlik yo'li bilan davolash amalga oshiriladi", "Faqat simptomatik (belgilarga) davolash qo'llaniladi"],
    "togri": 1,
    "izoh": "Uretritda qo'zg'atuvchi aniqlanmagan holatlarda ham empirik davolash boshlanadi — NGU holatlarining >50% ida qo'zg'atuvchi aniqlanmaydi, shuning uchun kutish o'rniga keng spektrli empirik davo zarur."
  },
  {
    "savol": "So'nggi necha kun ichidagi jinsiy hamrohlar baholash va davolash uchun yuborilishi shart?",
    "variantlar": ["30 kun", "60 kun", "90 kun", "180 kun"],
    "togri": 1,
    "izoh": "So'nggi 60 kun ichidagi jinsiy hamrohlar baholash, tekshiruv va davolash uchun yuborilishi kerak — infeksiyaning tarqalishini oldini olish uchun kontaktlarni boshqarish muhim."
  },
  {
    "savol": "Asoratlanmagan urogenital va rektal gonoreyada davoga erishtirish testi (test of cure) qanday tavsiya etiladi?",
    "variantlar": ["Har doim istisnosiz majburiy hisoblanadi", "Rutina (odatiy) tavsiya etilmaydi", "Faqat ayol bemorlarda majburiy hisoblanadi", "Faqat 30 yoshdan katta bemorlarda kerak"],
    "togri": 1,
    "izoh": "Asoratlanmagan urogenital va rektal gonoreyada davoga erishtirish testi rutina tavsiya etilmaydi. Faqat faringeal infeksiyada va davolash muvaffaqiyatsiz bo'lganda zarur."
  },
  {
    "savol": "Faringeal gonokokkli infeksiyada davoga erishtirish testi qachon va nima uchun majburiy?",
    "variantlar": ["1–2 kun o'tgach, chunki juda tez natija beradi", "7–14 kun o'tgach, chunki davolash muvaffaqiyati past", "1 oy o'tgach, oddiy rutina protokol sifatida", "Umuman o'tkazilishi shart bo'lmagan tekshiruv"],
    "togri": 1,
    "izoh": "Faringeal gonoreya uchun davolashdan 7–14 kun o'tgach test of cure majburiy — chunki faringeal gonoreya davolashga nisbatan urogenital infeksiyaga qaraganda qiyinroq va muvaffaqiyat darajasi past."
  },
  {
    "savol": "Gonorey aniqlangan barcha bemorlarda qancha vaqt o'tib qayta tekshiruv tavsiya etiladi?",
    "variantlar": ["2 hafta", "1 oy", "3 oy", "6 oy"],
    "togri": 2,
    "izoh": "Gonorey aniqlangan barcha bemorlarga 3 oy o'tib qayta skrining tavsiya etiladi — qayta infeksiya xavfi yuqori (ko'pincha davolanmagan yoki yangi partner orqali)."
  }
]$uretrit_savollar$::jsonb
WHERE dars_slug = 'uretrit-asoslari';
