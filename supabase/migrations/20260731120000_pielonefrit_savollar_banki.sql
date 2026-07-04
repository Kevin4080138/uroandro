UPDATE dars_tarkibi
SET savollar_banki = $pielonefrit_savollar$[
  {
    "savol": "O'tkir pielonefrit qanday ta'riflanadi?",
    "variantlar": ["Qovuq uroteliyining o'tkir bakterial infeksiyasi va dizuriya", "Isitma, qaltirash va bel-qovurg'a og'rig'i bilan yuqori UTI", "Buyrakda tosh hosil bo'lib siydik yo'lini to'sish jarayoni", "Siydik pufagining yallig'lanishi — quyi siydik yo'li infeksiyasi"],
    "togri": 1,
    "izoh": "O'tkir pielonefrit — qaltirash, isitma (≥38°C) va bir yoki ikki tomonlama bel-qovurg'a burchagi og'rig'i (CVAT) bilan namoyon bo'ladigan, bakteriuriya va piyuriya bilan kechadigan klinik sindrom."
  },
  {
    "savol": "Pielonefrit tashxisi asosan nimaga asoslanadi?",
    "variantlar": ["Faqat KT tomografiya natijalariga to'liq asoslanadi", "Faqat qon va siydik ekinmasi natijalariga asoslanadi", "Klinik belgilarga — tasvirlash yagona mezon emas", "Faqat ultratovush (UZT) tekshiruvi natijasiga asoslanadi"],
    "togri": 2,
    "izoh": "Pielonefrit tashxisi klinik belgilar asosida qo'yiladi — rentgenologik belgilar yoki tasvirlash natijalari yagona mezon hisoblanmaydi."
  },
  {
    "savol": "Pielonefrit va sistitning asosiy farqi qaysi belgi bo'yicha?",
    "variantlar": ["Dizuriya mavjudligi — faqat pielonefritda uchraydi", "Siydik rangi va tiniqligining o'zgarishi bo'yicha", "Isitma (≥38°C) va bel-qovurg'a burchagi og'rig'i", "Qo'zg'atuvchi bakteriya turining farq qilishi bo'yicha"],
    "togri": 2,
    "izoh": "Isitma (≥38°C) va CVAT — pielonefritning asosiy belgilari. Sistitda odatda isitma bo'lmaydi. Dizuriya va siydik tezligi ikkisida ham bo'lishi yoki bo'lmasligi mumkin."
  },
  {
    "savol": "Sistitda isitma bo'lsa nima degan ma'no beradi?",
    "variantlar": ["Bu ham oddiy sistitning kutiladigan normal belgisi", "Infeksiya buyrakka ko'tarilgan — pielonefrit ehtimoli bor", "Faqat virusli infeksiya qo'shilganidan dalolat beradi", "Kuchliroq antibiotik kerakligini bildiruvchi belgi"],
    "togri": 1,
    "izoh": "Sistitda isitma odatda bo'lmaydi. Agar isitma bo'lsa — infeksiya yuqoriga (buyrakka) tarqalganidan dalolat beradi, ya'ni pielonefrit rivojlanishi mumkin."
  },
  {
    "savol": "O'tkir pielonefritning klassik triadasi qaysi?",
    "variantlar": ["Dizuriya, siydik tezligi va suprapubik og'riq birgalikda", "Qorin og'rig'i, diareya va yuqori isitma birgalikda", "Isitma, bel-qovurg'a og'rig'i va ko'ngil aynashi/qusish", "Isitma, dizuriya va o'tkir siydik tutilishi birgalikda"],
    "togri": 2,
    "izoh": "O'tkir pielonefritning klassik triadasi: isitma (≥38°C, ko'pincha qaltirash bilan), bel-qovurg'a burchagi og'rig'i (CVAT) va ko'ngil aynashi/qusish."
  },
  {
    "savol": "Pielonefritda quyida sanab o'tilganlardan qaysi LUTS belgisi odatda BO'LMASLIGI MUMKIN?",
    "variantlar": ["Doimiy yuqori isitma", "Bir tomonlama bel og'rig'i", "Dizuriya va siydik tezligi", "Ko'ngil aynashi, qusish"],
    "togri": 2,
    "izoh": "Quyi siydik yo'li simptomlari (dizuriya, siydik tezligi) pielonefritda ba'zan birga uchraydi, ba'zan esa umuman bo'lmaydi. Isitma esa asosiy belgi."
  },
  {
    "savol": "CVAT nima va u qayerda aniqlanadi?",
    "variantlar": ["Qov usti (suprapubik) sohasidagi bosim og'rig'i", "Bel-qovurg'a burchagini urishda og'riqlilik belgisi", "Siydik yo'lini baholovchi ultratovush tekshiruvi usuli", "Yon tomonda yotib qon bosimini o'lchash usuli"],
    "togri": 1,
    "izoh": "CVAT (Costovertebral Angle Tenderness) — bel-qovurg'a burchagini palpatsiya yoki urishda og'riqlilik. Pielonefritning asosiy jismoniy tekshiruv belgisi."
  },
  {
    "savol": "Pielonefrit qanday yo'l bilan ko'pincha rivojlanadi?",
    "variantlar": ["Gematogen yo'l — bakteriya qon oqimi orqali yetadi", "Limfogen yo'l — bakteriya limfa tomirlari orqali o'tadi", "Asending yo'l — qovuqdagi bakteriya buyrakka ko'tariladi", "To'g'ridan-to'g'ri qo'shni a'zolardan tarqalib o'tishi"],
    "togri": 2,
    "izoh": "Pielonefrit aksariyati qovuqdagi bakteriyalarning siydik yo'li orqali buyrakka ko'tarilishi (asending yo'l) natijasida yuzaga keladi. Gematogen yo'l kamroq uchraydi."
  },
  {
    "savol": "To'siqlanish pielonefrit xavfini nima uchun oshiradi?",
    "variantlar": ["Umumiy immunitet holatini sezilarli darajada pasaytiradi", "Siydik turg'unligi hosil qilib bakteriya o'sishini tezlashtiradi", "Buyrakning qon bilan ta'minlanishini keskin kamaytiradi", "Antibiotikning ichakdan so'rilishini sekinlashtirib qo'yadi"],
    "togri": 1,
    "izoh": "To'siqlanish (tosh, UPJ to'siqlanishi, BPH) siydik turg'unligini hosil qiladi — bu esa bakteriyaning ko'payishi va buyrakka penetratsiyasi uchun qulay sharoit yaratadi."
  },
  {
    "savol": "Qandli diabet (DM) pielonefrit xavfini qanday oshiradi?",
    "variantlar": ["Siydik yo'li kanalini bosib mexanik ravishda toraytiradi", "Ko'proq siydik ishlab chiqarilib bakteriya yuvilishiga xalaqit", "Neytrofil funksiyasini buzadi va to'liq bo'shalmaslikka olib keladi", "Antibiotik metabolizmini jigarda tezlashtirib ta'sirini pasaytiradi"],
    "togri": 2,
    "izoh": "Qandli diabet neytrofil funksiyasini buzadi va neyrogeniya tufayli to'liq bo'shalmaslikka olib keladi — bu emfizematoz pielonefrit va absess xavfini oshiradi."
  },
  {
    "savol": "VUR (vezikouretal reflyuks) pielonefritda qanday xavfga olib keladi?",
    "variantlar": ["Faqat katta yoshli kattalarda jiddiy xavf tug'diradi", "Bolalarda buyrak chaqiqlari rivojlanishiga olib keladi", "Faqat arterial gipertoniya rivojlanishiga sabab bo'ladi", "Siydik yo'lida tosh hosil bo'lishiga zamin yaratadi"],
    "togri": 1,
    "izoh": "VUR — siydikning qovuqdan siydik yo'liga teskari oqishi. Bolalarda infeksiya bilan birgalikda bo'lganda buyrak chaqiqlari rivojlanish xavfini sezilarli oshiradi."
  },
  {
    "savol": "To'siqlanish + pielonefrit kombinatsiyasi klinik jihatdan qanday baholanadi?",
    "variantlar": ["Oddiy asoratlanmagan pielonefrit kabi ambulator davolanadi", "Hayot uchun xavfli holat — to'siqni bartaraf etish birinchi qadam", "Faqat kuchli antibiotik bilan aralashuvsiz davolanadigan holat", "Faol davo shart emas, kuzatib turish bilan cheklaniladigan holat"],
    "togri": 1,
    "izoh": "To'silgan pielonefrit (obstructed pyelonephritis) — hayot uchun xavfli holat. To'siqni zudlik bilan bartaraf etish (ureteral stent yoki perkutan nefrostomiya) antibiotikdan muhimroq birinchi qadam."
  },
  {
    "savol": "Surunkali pielonefrit qanday tavsiflanadi?",
    "variantlar": ["Doimo faol bakterial infeksiya bilan birga kechuvchi holat", "Faqat bolalik davrida uchraydigan bir tomonlama holat", "Buyrak korteksi atrofiyasi, kalitsiya kengayishi — VUR oqibati", "Har doim ikki buyrakni bir vaqtda zararlaydigan o'tkir holat"],
    "togri": 2,
    "izoh": "Surunkali pielonefrit — buyrak korteksida maydon yo'qolishi va kalitsiyalarning kengayishi bilan tavsiflanuvchi uzoq muddatli holat. Ko'pincha faol infeksiya bilan bog'liq emas — oldingi infeksiyalar yoki VUR ning oqibati."
  },
  {
    "savol": "Pielonefritda laborator tekshiruvda CBC (umumiy qon tahlili)da nima kutiladi?",
    "variantlar": ["Leykopeniya va anemiya birgalikda", "Leykotsitoz, neytrofillar ustunligi", "Trombositoz va yuqori trombotsit", "Eritrotsitoz va gemoglobin oshishi"],
    "togri": 1,
    "izoh": "Pielonefritda CBC da leykotsitoz va neytrofillar ustunligi kuzatiladi — bu bakterial infeksiya va sistemik yallig'lanishni ko'rsatadi."
  },
  {
    "savol": "Pielonefritda siydik ekinmasi nima uchun majburiy?",
    "variantlar": ["Faqat buyrakni tasvirga tushirish rejasini tuzish uchun", "Faqat umumiy buyrak funksiyasini baholab olish uchun", "Qo'zg'atuvchi bakteriya va antibiotik sezuvchanligini aniqlash", "Siydik pH va solishtirma og'irligini o'lchab olish uchun"],
    "togri": 2,
    "izoh": "Siydik ekinmasi pielonefritda majburiy — qo'zg'atuvchi bakteriya turini va antibiotik sezuvchanligini aniqlash uchun kerak, bu esa maqsadli davolashga imkon beradi."
  },
  {
    "savol": "Qon ekinmasi (blood culture) pielonefritda qachon olinishi kerak?",
    "variantlar": ["Pielonefritli barcha bemorlarda istisnosiz olinadi", "Kasalxona talab etuvchi og'ir holat va sepsis gumonida", "Faqat antibiotik boshlangandan bir kun keyin olinadi", "Faqat bolalarda va homilador ayollarda olinadi"],
    "togri": 1,
    "izoh": "Qon ekinmasi kasalxonaga yotqizish talab etiladigan og'ir holatlarda va sepsis gumonida olinadi — bakteriemiyani aniqlash va antibiotik tanlashni to'g'rilash uchun."
  },
  {
    "savol": "Asoratlanmagan o'tkir pielonefritda tasvirlash tekshiruvi darhol kerakmi?",
    "variantlar": ["Ha, har doim kontrastli KT darhol o'tkazilishi shart", "Ha, har bir bemorda darhol ultratovush zarur bo'ladi", "Ha, har doim DMSA skan tekshiruvi darhol bajariladi", "Yo'q, asoratlanmagan hollarda darhol talab etilmaydi"],
    "togri": 3,
    "izoh": "Asoratlanmagan o'tkir pielonefritda tasvirlash tekshiruvi darhol talab etilmaydi. Aniq ko'rsatmalar bo'lsa (72 soatdan oshganda isitma, tosh shubhasi, erkaklar, DM) — zarur."
  },
  {
    "savol": "Pielonefritda 72 soatdan oshganda isitma davom etsa qaysi tekshiruv bajarilishi kerak?",
    "variantlar": ["Ultratovush tekshiruvi bu holatda mutlaqo yetarli bo'ladi", "Kontrast bilan KT — absess va to'siqlanishni istisno qilish", "DMSA skan bilan buyrak chaqiqlarini baholash zarur bo'ladi", "Qon ekinmasini qaytadan olib, natijasini kutish kifoya"],
    "togri": 1,
    "izoh": "Antibiotik boshlangandan keyin 72 soatdan oshganda isitma davom etsa — kontrast bilan KT majburiy: to'siqlanish, buyrak yoki perinefrik absess istisno qilinishi kerak."
  },
  {
    "savol": "Ambulatoria (uyda) davolash qachon mumkin?",
    "variantlar": ["Sepsis belgilari bo'lgan bemorlarda ham uyda davolash mumkin", "Faqat yoshi katta bo'lmagan sog'lom ayollarda amalga oshiriladi", "Qusish va sepsis yo'q, og'iz orqali dori qabul qila oladiganlarda", "Faqat kasallikning birinchi epizodida qo'llanishi mumkin bo'ladi"],
    "togri": 2,
    "izoh": "Ambulatoria davolash: qusish yo'q, sepsis belgisi yo'q, og'iz orqali dori qabul qila oladigan bemorlar uchun. Bunday holatlarda 7 kunlik og'iz orqali antibiotik yetarli."
  },
  {
    "savol": "Ambulatoria pielonefrit davolashida birinchi tanlash antibiotigi qaysi?",
    "variantlar": ["Nitrofurantoin 100 mg × 2/kun, besh kunlik kurs bilan", "Amoksitsillin 500 mg × 3/kun, yetti kunlik kurs bilan", "Siprofloksatsin 500 mg × 2/kun, 7 kun (rezistentlik <10%)", "Fosfomitsin 3 g bir martalik doza sifatida qabul qilinadi"],
    "togri": 2,
    "izoh": "Siprofloksatsin (500 mg × 2/kun, 7 kun) — mahalliy ftorokinolon rezistentligi 10% dan past bo'lganda ambulatoria pielonefritda birinchi tanlash. Nitrofurantoin pielonefritda ishlatilmaydi."
  },
  {
    "savol": "Nima uchun nitrofurantoin pielonefrit uchun TAN OLINMAYDI?",
    "variantlar": ["Juda qimmat bo'lgani uchun keng qo'llanmaydigan dori", "Ftorokinolonlarga rezistentlikni tezda oshirib yuboradi", "Buyrak to'qimasida yetarli kontsentratsiya yarata olmaydi", "Faqat bolalar uchun ruxsat etilgan tor spektrli dori"],
    "togri": 2,
    "izoh": "Nitrofurantoin sistitga ajoyib, lekin pielonefritda emas — buyrak to'qimasida va qon zardobida yetarli darajada to'planmaydi. Yuqori UTI uchun sistemik antibiotiklar kerak."
  },
  {
    "savol": "TMP-SMX pielonefritda qachon ishlatiladi?",
    "variantlar": ["Har doim empirik birinchi tanlov sifatida qo'llaniladi", "Ekinma sezuvchanligi tasdiqlanganda, 14 kunlik kurs bilan", "Faqat kasalxona sharoitida IV shaklda qo'llaniladigan dori", "Faqat homilador ayollarda xavfsiz tanlov hisoblanadi"],
    "togri": 1,
    "izoh": "TMP-SMX pielonefritda 14 kun mobaynida ishlatiladi — ammo faqat ekinma natijasi bilan sezuvchanlik tasdiqlanganda. Empirik tanlash sifatida rezistentlik xavfi tufayli cheklangan."
  },
  {
    "savol": "Kasalxonaga yotqizish ko'rsatmalari qaysilar?",
    "variantlar": ["Faqat tana harorati 39°C dan oshib ketgan holatlarda", "Faqat kasallikning birinchi epizodi kuzatilgan bemorlarda", "Sepsis, qusish/dehidratatsiya, javobsizlik, homiladorlik, to'siq", "Faqat erkak jinsli bemorlarda majburiy tarzda amalga oshiriladi"],
    "togri": 2,
    "izoh": "Kasalxona ko'rsatkichlari: yuqori isitma, qusish/dehidratatsiya, sepsis belgilari, ambulatoria davolash 72 soat ichida natija bermaganida, homiladorlik, immunosupressiya yoki to'siqlanish gumonida."
  },
  {
    "savol": "Kasalxonada pielonefrit davolashda IV antibiotikdan og'iz orqali davolashga qachon o'tiladi?",
    "variantlar": ["Davolash boshlangan 24 soatdan keyin har doim o'tiladi", "Bemor holati barqarorlashgach; jami kurs 10–14 kun", "Faqat siydik ekinmasi manfiy natija bergandan keyin o'tiladi", "Hech qachon o'tilmaydi — kasalxonada doim IV davom etadi"],
    "togri": 1,
    "izoh": "Kasalxonada IV antibiotik bilan boshlanadi, bemorning holati barqarorlashgandan keyin og'iz orqali davolashga o'tiladi va jami kurs 10–14 kun bo'lishi kerak."
  },
  {
    "savol": "Buyrak absessining (renal abscess) asosiy klinik farqlovchi belgisi nima?",
    "variantlar": ["Faqat kindik atrofidagi qorin og'rig'i bilan namoyon bo'ladi", "Faqat izolyatsiyalangan yuqori isitma bilan kechuvchi holat", "Pielonefritga o'xshash, ammo og'irroq va 5 kundan uzun", "Faqat siydikda piyuriya topilishi bilan ajralib turadigan holat"],
    "togri": 2,
    "izoh": "Buyrak abssessi pielonefritga o'xshash belgilar beradi, ammo odatda og'irroq va 5 kundan uzun davomli. KT — diagnostika usuli. 3 sm dan kichik — antibiotik; kattaroqlarda perkutan drenaj."
  },
  {
    "savol": "3 sm dan katta buyrak absessini qanday davolash kerak?",
    "variantlar": ["Faqat sistemik antibiotik terapiyasining o'zi yetarli bo'ladi", "Antibiotik bilan birgalikda perkutan drenaj o'tkazish kerak", "Zudlik bilan buyrakni olib tashlash (nefrektomiya) bajariladi", "Faol aralashuvsiz kuzatib turish taktikasi tanlanadi"],
    "togri": 1,
    "izoh": "3 sm dan kichik buyrak abssessi ko'pincha antibiotik bilan hal bo'ladi. 3 sm dan katta abssesslarda perkutan drenaj kerak bo'ladi."
  },
  {
    "savol": "Perinefrik absessni (perinephric abscess) o'tkir pielonefritdan farqlaydigan asosiy mezon nima?",
    "variantlar": ["Umumiy siydik tahlilidagi o'zgarishlar asosida farqlanadi", "Faqat bir tomonlama bel og'rig'i bo'lishi bilan farqlanadi", "5 kundan uzun simptom va 4 kundan ortiq davom etuvchi isitma", "Siydik ekinmasidagi bakteriya turiga qarab aniqlanadi"],
    "togri": 2,
    "izoh": "5 kundan uzun simptomlar va antibiotikdan keyin ham 4 kundan ko'p davom etadigan isitma — perinefrik absessni o'tkir pielonefritdan farqlaydigan asosiy klinik mezon."
  },
  {
    "savol": "Emfizematoz pielonefrit bilan deyarli har doim qaysi holat birgalikda uchraydi?",
    "variantlar": ["O'tkir buyrak yetishmovchiligi", "Qandli diabet (diabetes mellitus)", "Buyrak jomidagi yirik shox tosh", "Homiladorlikning uchinchi trimestri"],
    "togri": 1,
    "izoh": "Emfizematoz pielonefrit deyarli barcha hollarda qandli diabet bilan bog'liq. Gaz hosil qiluvchi bakteriyalar (asosan E. coli) tomonidan kelib chiqariladigan o'tkir nekrozlashtiruvchi buyrak infeksiyasi."
  },
  {
    "savol": "Emfizematoz pielonefritda KT da qanday topilma aniqlanadi?",
    "variantlar": ["Buyrak jomida yirik shox toshning aniqlanishi", "Buyrak to'qimasida gaz topilishi — diagnostik belgi", "Buyrakning umumiy hajmi kattalashib ketishi", "Perinefrik bo'shliqda erkin suyuqlik to'planishi"],
    "togri": 1,
    "izoh": "Emfizematoz pielonefritda KT da buyrak to'qimasida gaz topilishi diagnostik hisoblanadi. Bu urologik shoshilinch holat bo'lib, o'lim darajasi 19–43%."
  },
  {
    "savol": "Emfizematoz pielonefritning o'lim darajasi qancha?",
    "variantlar": ["1–5%", "5–10%", "19–43%", "60–80%"],
    "togri": 2,
    "izoh": "Emfizematoz pielonefrit jiddiy urologik shoshilinch holat — o'lim darajasi 19–43%. Davolash: suyuqlik va keng spektrli antibiotiklar, glyukoza nazorati, perkutan drenaj; keng shakllarda nefrektomiya."
  },
  {
    "savol": "Ksantogranulematoz pielonefrit (XGP) nima bilan tavsiflanadi?",
    "variantlar": ["Buyrak to'qimasida faol gaz hosil bo'lishi bilan kechadi", "Lipid yukli makrofaglar bilan parenxima almashinuvi; tosh, to'siq", "Faqat bolalik davrida uchraydigan o'tkinchi yallig'lanish", "Antibiotik bilan izsiz to'liq davolanadigan yengil holat"],
    "togri": 1,
    "izoh": "XGP — tosh kasalligi va to'siqlanish bilan bog'liq, buyrak parenximasini lipid yukli makrofaglar (köpük hujayralar) bilan almashtiruvchi surunkali yallig'lanish. Nefrektomiya — asosiy davolash."
  },
  {
    "savol": "XGP (ksantogranulematoz pielonefrit) nega buyrak hujayra sarataoniga o'xshab qolishi mumkin?",
    "variantlar": ["Ikkala holat ham yuqori isitma bilan namoyon bo'lgani uchun", "KT da nofaol buyrak va to'qima o'zgarishlari saratonga o'xshaydi", "Ikkala holatda ham CVAT belgisi musbat bo'lgani uchun", "Ikkalasi bir xil klinik va laborator belgilarni bergani uchun"],
    "togri": 1,
    "izoh": "XGP KT da nofaol buyrak va to'qimaviy o'zgarishlar bilan buyrak hujayra sarataoniga taqlid qilishi mumkin — bu diagnostik muammolarga olib keladi. Nefrektomiya ham davolash, ham tashxis usuli."
  },
  {
    "savol": "O'tkir pielonefritdan keyin DMSA skan da buyrak chaqiqlari qancha vaqt o'tgach va qancha foizda aniqlanadi?",
    "variantlar": ["10–20 yil o'tgach, taxminan 50 foiz bemorda aniqlanadi", "Infeksiyadan 1 yil o'tgach, taxminan 10 foizda aniqlanadi", "Davolashdan 5 yil o'tgach, taxminan 25 foizda aniqlanadi", "Barcha bemorlarda infeksiyadan atigi 1 yil o'tgach topiladi"],
    "togri": 0,
    "izoh": "O'tkir pielonefritdan 10–20 yil o'tgach DMSA skanida bemorlarning taxminan 50 foizida buyrak chaqiqlari aniqlanadi — ammo buyrak funksiyasi ko'pincha sezilarli darajada kamaymasdi."
  },
  {
    "savol": "Bolalarda antibiotikni har 1 soat kechiktirish buyrak chaqiqi xavfini qancha oshiradi?",
    "variantlar": ["Har soatlik kechikish xavfni 0,1% ga oshiradi", "Har soatlik kechikish xavfni 0,8% ga oshiradi", "Har soatlik kechikish xavfni taxminan 5% ga oshiradi", "Har soatlik kechikish xavfni taxminan 10% ga oshiradi"],
    "togri": 1,
    "izoh": "Bolalarda antibiotikni har bir soat kechiktirish buyrak chaqiqi xavfini 0,8% ga oshiradi — bu tezkor davolash boshlashning muhimligini ko'rsatadi."
  },
  {
    "savol": "Pielonefritda antibiotik 72 soatdan kech boshlansa, buyrak chaqiqi xavfi qanday o'zgaradi?",
    "variantlar": ["Chaqiq xavfida sezilarli farq umuman kuzatilmaydi", "48 soatgacha boshlanganga nisbatan ikki barobar yuqori", "Erta boshlangan holatlarga qaraganda ancha kamroq bo'ladi", "48 soatgacha boshlanganga nisbatan uch barobar yuqori"],
    "togri": 1,
    "izoh": "Antibiotik 72 soatdan kech boshlanganida buyrak chaqiqi xavfi 48 soatgacha boshlanganiga nisbatan ikki marta yuqori — erta davolash chaqiqlarni oldini olishda juda muhim."
  },
  {
    "savol": "Radiologik jihatdan buyrak chaqig'ini tug'ma displaziyadan farqlash nimaga asoslanadi?",
    "variantlar": ["Farqlash juda oson — har doim aniq belgilari mavjud bo'ladi", "Faqat bemorning yoshi asosida ishonchli tarzda farqlanadi", "Kichik buyrak, kamaygan izotop yutilishi va past funksiya", "Faqat siydik ekinmasi natijasiga tayanib aniq farqlanadi"],
    "togri": 2,
    "izoh": "Kichik buyrak, tarqoq kamaygani izoton absorbsiyasi va kamaygani differensial buyrak funksiyasi ko'pincha tug'ma displaziyani ko'rsatadi. Bu farq davolash taktikasiga ta'sir qilishi mumkin."
  },
  {
    "savol": "Ekinma natijalari kelgandan keyin (48–72 soat) davolash qanday o'zgartiriladimi?",
    "variantlar": ["O'zgartirish shart emas — empirik davo oxirigacha davom etadi", "Ha — sezuvchanlikka qarab maqsadli davolashga o'tiladi", "Faqat kasalxona sharoitidagi bemorlarda o'zgartiriladi", "Faqat davolash boshlangach 7 kun o'tgandan keyin o'zgartiriladi"],
    "togri": 1,
    "izoh": "Ekinma natijalari kelib tushgandan keyin antibiotik sezuvchanlikka qarab maqsadli davolashga o'tilishi kerak. Aminoglikozid kabi toksik dorilar imkon qadar tezroq kamroq toksik preparatlar bilan almashtiriladi."
  },
  {
    "savol": "Homiladorlikda pielonefrit xavfi nima uchun oshadi?",
    "variantlar": ["Homiladorlik davrida umumiy immunitet keskin kuchsizlanadi", "Siydik yo'li tonusi pasayib, siydik turg'unligiga olib keladi", "Buyraklar ancha ko'proq siydik ishlab chiqara boshlaydi", "Uretra kanali qisqarib, bakteriya kirishini osonlashtiradi"],
    "togri": 1,
    "izoh": "Homiladorlikda progesteron ta'sirida siydik yo'li tonusi pasayadi — bu siydik turg'unligiga va bakteriyaning ko'payishiga sharoit yaratib, pielonefrit xavfini oshiradi."
  },
  {
    "savol": "Pielonefritning xulosa bo'yicha 'isitmasiz pielonefrit' odatda nima ekanini ko'rsatadi?",
    "variantlar": ["Bu odatda og'ir kechuvchi asoratlangan pielonefritdir", "Bu ko'pincha aslida sistit — quyi siydik yo'li infeksiyasidir", "Bu ko'pincha emfizematoz pielonefrit ko'rinishidir", "Bu odatda uzoq davom etgan surunkali pielonefritdir"],
    "togri": 1,
    "izoh": "Isitma pielonefritning asosiy belgisi. 'Isitmasiz pielonefrit' — bu ko'pincha sistitdir. Har qanday UTIni to'g'ri tasniflamoq uchun isitma mavjudligi muhim mezon."
  },
  {
    "savol": "Pielonefrit og'ir shakllarining diagnostikasida asosiy tasvirlash usuli qaysi?",
    "variantlar": ["Oddiy qorin bo'shlig'i rentgenografiyasi", "Ultratovush (UZT) tekshiruvi usuli", "Kompyuter tomografiyasi (KT) usuli", "DMSA izotop skanerlash usuli"],
    "togri": 2,
    "izoh": "KT — buyrak abssessi, perinefrik absess, emfizematoz pielonefrit va XGP ni aniqlashda asosiy tasvirlash usuli. Absess va gaz aniqlanishida KT eng informativ."
  },
  {
    "savol": "Pielonefritda surunkali holatga o'tishida asosiy patologik jarayon nima?",
    "variantlar": ["Buyrak jomida yirik tosh hosil bo'lish jarayoni", "Korteks atrofiyasi, kalitsiya kengayishi va fibrozlanish", "Siydik yo'lining sezilarli darajada kengayib ketishi", "Buyrak arteriyalarining torayib qon oqimini kamaytirishi"],
    "togri": 1,
    "izoh": "Surunkali pielonefritda buyrak korteksida maydon yo'qolishi, kalitsiyalarning kengayishi va fibrozlanish kuzatiladi — bu oldingi infeksiyalar yoki VUR ning uzoq muddatli oqibati."
  }
]$pielonefrit_savollar$::jsonb
WHERE dars_slug = 'pielonefrit-asoslari';
