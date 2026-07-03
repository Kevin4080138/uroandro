UPDATE dars_tarkibi
SET savollar_banki = $pielonefrit_savollar$[
  {
    "savol": "O'tkir pielonefrit qanday ta'riflanadi?",
    "variantlar": ["Qovuq uroteliyining bakterial infeksiyasi", "Qaltirash, isitma (≥38°C) va bel-qovurg'a burchagi og'rig'i bilan namoyon bo'ladigan yuqori siydik yo'li infeksiyasi", "Buyrakda tosh hosil bo'lishi jarayoni", "Siydik pufagining yallig'lanishi"],
    "togri": 1,
    "izoh": "O'tkir pielonefrit — qaltirash, isitma (≥38°C) va bir yoki ikki tomonlama bel-qovurg'a burchagi og'rig'i (CVAT) bilan namoyon bo'ladigan, bakteriuriya va piyuriya bilan kechadigan klinik sindrom."
  },
  {
    "savol": "Pielonefrit tashxisi asosan nimaga asoslanadi?",
    "variantlar": ["Faqat KT natijalariga", "Klinik belgilarga — rentgenologik yoki tasvirlash natijalari yagona mezon hisoblanmaydi", "Faqat siydik ekinmasi natijasiga", "Faqat UZT natijasiga"],
    "togri": 1,
    "izoh": "Pielonefrit tashxisi klinik belgilar asosida qo'yiladi — rentgenologik belgilar yoki tasvirlash natijalari yagona mezon hisoblanmaydi."
  },
  {
    "savol": "Pielonefrit va sistitning asosiy farqi qaysi belgi bo'yicha?",
    "variantlar": ["Dizuriya mavjudligi", "Isitma (≥38°C) va bel-qovurg'a burchagi og'rig'i", "Siydik rangi", "Bakteriya turi"],
    "togri": 1,
    "izoh": "Isitma (≥38°C) va CVAT — pielonefritning asosiy belgilari. Sistitda odatda isitma bo'lmaydi. Dizuriya va siydik tezligi ikkisida ham bo'lishi yoki bo'lmasligi mumkin."
  },
  {
    "savol": "Sistitda isitma bo'lsa nima degan ma'no beradi?",
    "variantlar": ["Bu ham sistitning normal belgisi", "Infeksiya buyrakka ko'tarilgan — pielonefrit ehtimoli bor", "Faqat virusli infeksiya qo'shilganini anglatadi", "Antibiotik kuchliroq kerakligini anglatadi"],
    "togri": 1,
    "izoh": "Sistitda isitma odatda bo'lmaydi. Agar isitma bo'lsa — infeksiya yuqoriga (buyrakka) tarqalganidan dalolat beradi, ya'ni pielonefrit rivojlanishi mumkin."
  },
  {
    "savol": "O'tkir pielonefritning klassik triadasi qaysi?",
    "variantlar": ["Dizuriya, siydik tezligi va suprapubik og'riq", "Isitma, bel-qovurg'a burchagi og'rig'i va ko'ngil aynashi/qusish", "Isitma, dizuriya va siydik tutilishi", "Qorin og'rig'i, diareya va isitma"],
    "togri": 1,
    "izoh": "O'tkir pielonefritning klassik triadasi: isitma (≥38°C, ko'pincha qaltirash bilan), bel-qovurg'a burchagi og'rig'i (CVAT) va ko'ngil aynashi/qusish."
  },
  {
    "savol": "Pielonefritda quyida sanab o'tilganlardan qaysi LUTS belgisi odatda BO'LMASLIGI MUMKIN?",
    "variantlar": ["Isitma", "Bel og'rig'i", "Dizuriya va siydik tezligi", "Ko'ngil aynashi"],
    "togri": 2,
    "izoh": "Quyi siydik yo'li simptomlari (dizuriya, siydik tezligi) pielonefritda ba'zan birga uchraydi, ba'zan esa umuman bo'lmaydi. Isitma esa asosiy belgi."
  },
  {
    "savol": "CVAT nima va u qayerda aniqlanadi?",
    "variantlar": ["Qov usti sohasidagi og'riq", "Bel-qovurg'a burchagini palpatsiya yoki urishda og'riqlilik — pielonefrit belgisi", "Siydik yo'lining ultratovush tekshiruvi", "Qon bosimini o'lchash usuli"],
    "togri": 1,
    "izoh": "CVAT (Costovertebral Angle Tenderness) — bel-qovurg'a burchagini palpatsiya yoki urishda og'riqlilik. Pielonefritning asosiy jismoniy tekshiruv belgisi."
  },
  {
    "savol": "Pielonefrit qanday yo'l bilan ko'pincha rivojlanadi?",
    "variantlar": ["Gematogen yo'l — qon orqali", "Limfogen yo'l — limfa orqali", "Asending yo'l — qovuqdagi bakteriyalar siydik yo'li orqali buyrakka ko'tarilishi", "To'g'ridan-to'g'ri yaqin a'zolardan o'tish"],
    "togri": 2,
    "izoh": "Pielonefrit aksariyati qovuqdagi bakteriyalarning siydik yo'li orqali buyrakka ko'tarilishi (asending yo'l) natijasida yuzaga keladi. Gematogen yo'l kamroq uchraydi."
  },
  {
    "savol": "To'siqlanish pielonefrit xavfini nima uchun oshiradi?",
    "variantlar": ["Immunitetni pasaytiradi", "Siydik turg'unligini hosil qilib, bakteriya o'sishini tezlashtiradi", "Buyrak qon aylanishini kamaytiradi", "Antibiotik so'rilishini kamaytiradi"],
    "togri": 1,
    "izoh": "To'siqlanish (tosh, UPJ to'siqlanishi, BPH) siydik turg'unligini hosil qiladi — bu esa bakteriyaning ko'payishi va buyrakka penetratsiyasi uchun qulay sharoit yaratadi."
  },
  {
    "savol": "Qandli diabet (DM) pielonefrit xavfini qanday oshiradi?",
    "variantlar": ["Siydik yo'lini toraytiradi", "Neytrofil funksiyasini buzadi va neyrogeniya tufayli to'liq bo'shalmaslikka olib keladi", "Ko'proq siydik ishlab chiqaradi", "Antibiotik metabolizmini tezlashtiradi"],
    "togri": 1,
    "izoh": "Qandli diabet neytrofil funksiyasini buzadi va neyrogeniya tufayli to'liq bo'shalmaslikka olib keladi — bu emfizematoz pielonefrit va absess xavfini oshiradi."
  },
  {
    "savol": "VUR (vezikouretal reflyuks) pielonefritda qanday xavfga olib keladi?",
    "variantlar": ["Faqat katta yoshlilarda xavfli", "Bolalarda buyrak chaqiqlari rivojlanishiga olib keladi", "Faqat gipertoniyaga sabab bo'ladi", "Siydik yo'li toshlariga sabab bo'ladi"],
    "togri": 1,
    "izoh": "VUR — siydikning qovuqdan siydik yo'liga teskari oqishi. Bolalarda infeksiya bilan birgalikda bo'lganda buyrak chaqiqlari rivojlanish xavfini sezilarli oshiradi."
  },
  {
    "savol": "To'siqlanish + pielonefrit kombinatsiyasi klinik jihatdan qanday baholanadi?",
    "variantlar": ["Odatdagi pielonefrit kabi davolanadi", "Hayot uchun xavfli shoshilinch holat — to'siqni bartaraf etish birinchi qadam", "Faqat antibiotik bilan davolanadi", "Ko'zatib turish kifoya"],
    "togri": 1,
    "izoh": "To'silgan pielonefrit (obstructed pyelonephritis) — hayot uchun xavfli holat. To'siqni zudlik bilan bartaraf etish (ureteral stent yoki perkutan nefrostomiya) antibiotikdan muhimroq birinchi qadam."
  },
  {
    "savol": "Surunkali pielonefrit qanday tavsiflanadi?",
    "variantlar": ["Faol bakterial infeksiya bilan bog'liq", "Buyrak korteksida atrofiya va kalitsiyalarning kengayishi; ko'pincha oldingi infeksiyalar yoki VUR ning uzoq muddatli oqibati", "Faqat bolalarda uchraydi", "Faqat bir tomonlama bo'ladi"],
    "togri": 1,
    "izoh": "Surunkali pielonefrit — buyrak korteksida maydon yo'qolishi va kalitsiyalarning kengayishi bilan tavsiflanuvchi uzoq muddatli holat. Ko'pincha faol infeksiya bilan bog'liq emas — oldingi infeksiyalar yoki VUR ning oqibati."
  },
  {
    "savol": "Pielonefritda laborator tekshiruvda CBC (umumiy qon tahlili)da nima kutiladi?",
    "variantlar": ["Leykopeniya va anemiya", "Leykotsitoz, neytrofillar ustunligi", "Trombositoz", "Eritrotsitoz"],
    "togri": 1,
    "izoh": "Pielonefritda CBC da leykotsitoz va neytrofillar ustunligi kuzatiladi — bu bakterial infeksiya va sistemik yallig'lanishni ko'rsatadi."
  },
  {
    "savol": "Pielonefritda siydik ekinmasi nima uchun majburiy?",
    "variantlar": ["Faqat tasvirga tushirish uchun", "Kasallikni qo'zg'atuvchi bakteriya va antibiotik sezuvchanligini aniqlash uchun", "Buyrak funksiyasini baholash uchun", "Siydik pH ini o'lchash uchun"],
    "togri": 1,
    "izoh": "Siydik ekinmasi pielonefritda majburiy — qo'zg'atuvchi bakteriya turini va antibiotik sezuvchanligini aniqlash uchun kerak, bu esa maqsadli davolashga imkon beradi."
  },
  {
    "savol": "Qon ekinmasi (blood culture) pielonefritda qachon olinishi kerak?",
    "variantlar": ["Barcha bemorlarda", "Kasalxonaga yotqizish talab etiladigan og'ir holatlarda va sepsis gumonida", "Faqat antibiotik boshlanganidan keyin", "Faqat bolalarda"],
    "togri": 1,
    "izoh": "Qon ekinmasi kasalxonaga yotqizish talab etiladigan og'ir holatlarda va sepsis gumonida olinadi — bakteriemiyani aniqlash va antibiotik tanlashni to'g'rilash uchun."
  },
  {
    "savol": "Asoratlanmagan o'tkir pielonefritda tasvirlash tekshiruvi darhol kerakmi?",
    "variantlar": ["Ha, har doim KT zarur", "Yo'q, asoratlanmagan hollarda darhol talab etilmaydi", "Ha, har doim UZT zarur", "Ha, DMSA skan zarur"],
    "togri": 1,
    "izoh": "Asoratlanmagan o'tkir pielonefritda tasvirlash tekshiruvi darhol talab etilmaydi. Aniq ko'rsatmalar bo'lsa (72 soatdan oshganda isitma, tosh shubhasi, erkaklar, DM) — zarur."
  },
  {
    "savol": "Pielonefritda 72 soatdan oshganda isitma davom etsa qaysi tekshiruv bajarilishi kerak?",
    "variantlar": ["Ultratovush yetarli", "Kontrast bilan KT — absess va to'siqlanishni istisno qilish uchun", "DMSA skan", "Qon ekinmasi qaytadan"],
    "togri": 1,
    "izoh": "Antibiotik boshlangandan keyin 72 soatdan oshganda isitma davom etsa — kontrast bilan KT majburiy: to'siqlanish, buyrak yoki perinefrik absess istisno qilinishi kerak."
  },
  {
    "savol": "Ambulatoria (uyda) davolash qachon mumkin?",
    "variantlar": ["Sepsis belgilari bo'lsa ham mumkin", "Qusish yo'q, sepsis belgisi yo'q, og'iz orqali dori qabul qila oladigan bemorlarda", "Faqat yoshli ayollarda", "Faqat birinchi epizodda"],
    "togri": 1,
    "izoh": "Ambulatoria davolash: qusish yo'q, sepsis belgisi yo'q, og'iz orqali dori qabul qila oladigan bemorlar uchun. Bunday holatlarda 7 kunlik og'iz orqali antibiotik yetarli."
  },
  {
    "savol": "Ambulatoria pielonefrit davolashida birinchi tanlash antibiotigi qaysi?",
    "variantlar": ["Nitrofurantoin", "Siprofloksatsin 500 mg × 2/kun, 7 kun (mahalliy rezistentlik 10% dan past bo'lsa)", "Fosfomitsin", "Amoksitsillin"],
    "togri": 1,
    "izoh": "Siprofloksatsin (500 mg × 2/kun, 7 kun) — mahalliy ftorokinolon rezistentligi 10% dan past bo'lganda ambulatoria pielonefritda birinchi tanlash. Nitrofurantoin pielonefritda ishlatilmaydi."
  },
  {
    "savol": "Nima uchun nitrofurantoin pielonefrit uchun TAN OLINMAYDI?",
    "variantlar": ["Juda qimmat dori", "Erta pielonefritda buyrak to'qimasida yetarli kontsentratsiya yaratmaydi", "Fotokinol rezistentligini oshiradi", "Faqat bolalarda ishlatiladi"],
    "togri": 1,
    "izoh": "Nitrofurantoin sistitga ajoyib, lekin pielonefritda emas — buyrak to'qimasida va qon zardobida yetarli darajada to'planmaydi. Yuqori UTI uchun sistemik antibiotiklar kerak."
  },
  {
    "savol": "TMP-SMX pielonefritda qachon ishlatiladi?",
    "variantlar": ["Har doim birinchi tanlov", "Organizm sezuvchanligi ma'lum bo'lganda (ekinma natijasiga qarab), 14 kun", "Faqat kasalxonada", "Faqat homiladorlarda"],
    "togri": 1,
    "izoh": "TMP-SMX pielonefritda 14 kun mobaynida ishlatiladi — ammo faqat ekinma natijasi bilan sezuvchanlik tasdiqlanganda. Empirik tanlash sifatida rezistentlik xavfi tufayli cheklangan."
  },
  {
    "savol": "Kasalxonaga yotqizish ko'rsatmalari qaysilar?",
    "variantlar": ["Faqat isitma 39°C dan oshganda", "Sepsis belgilari, qusish/dehidratatsiya, 72 soat ichida javob yo'qligi, homiladorlik yoki to'siqlanish gumon", "Faqat birinchi epizodda", "Faqat erkaklar"],
    "togri": 1,
    "izoh": "Kasalxona ko'rsatkichlari: yuqori isitma, qusish/dehidratatsiya, sepsis belgilari, ambulatoria davolash 72 soat ichida natija bermaganida, homiladorlik, immunosupressiya yoki to'siqlanish gumonida."
  },
  {
    "savol": "Kasalxonada pielonefrit davolashda IV antibiotikdan og'iz orqali davolashga qachon o'tiladi?",
    "variantlar": ["24 soatdan keyin har doim", "Bemorning holati barqarorlashgandan keyin; jami 10–14 kun", "Faqat ekinma manfiy bo'lganda", "Hech qachon — kasalxonada hamisha IV"],
    "togri": 1,
    "izoh": "Kasalxonada IV antibiotik bilan boshlanadi, bemorning holati barqarorlashgandan keyin og'iz orqali davolashga o'tiladi va jami kurs 10–14 kun bo'lishi kerak."
  },
  {
    "savol": "Buyrak absessining (renal abscess) asosiy klinik farqlovchi belgisi nima?",
    "variantlar": ["Faqat qorin og'rig'i", "Pielonefritga o'xshash, ammo odatda og'irroq va 5 kundan uzun davomli", "Faqat isitma", "Faqat piyuriya"],
    "togri": 1,
    "izoh": "Buyrak abssessi pielonefritga o'xshash belgilar beradi, ammo odatda og'irroq va 5 kundan uzun davomli. KT — diagnostika usuli. 3 sm dan kichik — antibiotik; kattaroqlarda perkutan drenaj."
  },
  {
    "savol": "3 sm dan katta buyrak absessini qanday davolash kerak?",
    "variantlar": ["Faqat antibiotik yetarli", "Antibiotik bilan birga perkutan drenaj kerak", "Darhol nefrektomiya", "Kuzatib turish"],
    "togri": 1,
    "izoh": "3 sm dan kichik buyrak abssessi ko'pincha antibiotik bilan hal bo'ladi. 3 sm dan katta abssesslarda perkutan drenaj kerak bo'ladi."
  },
  {
    "savol": "Perinefrik absessni (perinephric abscess) o'tkir pielonefritdan farqlaydigan asosiy mezon nima?",
    "variantlar": ["Siydik tahlili natijasi", "5 kundan uzun simptomlar va antibiotikdan keyin ham 4 kundan ko'p davom etadigan isitma", "Faqat bel og'rig'i", "Siydik ekinmasi natijalari"],
    "togri": 1,
    "izoh": "5 kundan uzun simptomlar va antibiotikdan keyin ham 4 kundan ko'p davom etadigan isitma — perinefrik absessni o'tkir pielonefritdan farqlaydigan asosiy klinik mezon."
  },
  {
    "savol": "Emfizematoz pielonefrit bilan deyarli har doim qaysi holat birgalikda uchraydi?",
    "variantlar": ["O'tkir buyrak yetishmovchiligi", "Qandli diabet", "Buyrak toshi", "Homiladorlik"],
    "togri": 1,
    "izoh": "Emfizematoz pielonefrit deyarli barcha hollarda qandli diabet bilan bog'liq. Gaz hosil qiluvchi bakteriyalar (asosan E. coli) tomonidan kelib chiqariladigan o'tkir nekrozlashtiruvchi buyrak infeksiyasi."
  },
  {
    "savol": "Emfizematoz pielonefritda KT da qanday topilma aniqlanadi?",
    "variantlar": ["Buyrakda tosh", "Buyrak to'qimasida gaz topilishi — diagnostik belgi", "Buyrak kengayishi", "Perinefrik suyuqlik"],
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
    "variantlar": ["Gaz hosil bo'lishi bilan", "Lipid yukli makrofaglar (köpük hujayralar) bilan buyrak parenximasining almashinuvi; tosh va to'siqlanish bilan bog'liq", "Faqat bolalarda uchraydi", "Antibiotik bilan to'liq davolanadi"],
    "togri": 1,
    "izoh": "XGP — tosh kasalligi va to'siqlanish bilan bog'liq, buyrak parenximasini lipid yukli makrofaglar (köpük hujayralar) bilan almashtiruvchi surunkali yallig'lanish. Nefrektomiya — asosiy davolash."
  },
  {
    "savol": "XGP (ksantogranulematoz pielonefrit) nega buyrak hujayra sarataoniga o'xshab qolishi mumkin?",
    "variantlar": ["Ikkisi ham isitma beradi", "KT da nofaol buyrak va to'qimaviy o'zgarishlar saraton tasviri bilan o'xshash ko'rinadi", "Ikkisi ham CVAT beradi", "Ikkisi ham bir xil belgili"],
    "togri": 1,
    "izoh": "XGP KT da nofaol buyrak va to'qimaviy o'zgarishlar bilan buyrak hujayra sarataoniga taqlid qilishi mumkin — bu diagnostik muammolarga olib keladi. Nefrektomiya ham davolash, ham tashxis usuli."
  },
  {
    "savol": "O'tkir pielonefritdan keyin DMSA skan da buyrak chaqiqlari qanchа vaqt o'tgach va qancha foizda aniqlanadi?",
    "variantlar": ["1 yildan keyin, ~10% da", "10–20 yil o'tgach, taxminan 50 foizida", "5 yildan keyin, ~25% da", "Hamma bemorda 1 yildan keyin"],
    "togri": 1,
    "izoh": "O'tkir pielonefritdan 10–20 yil o'tgach DMSA skanida bemorlarning taxminan 50 foizida buyrak chaqiqlari aniqlanadi — ammo buyrak funksiyasi ko'pincha sezilarli darajada kamaymasdi."
  },
  {
    "savol": "Bolalarda antibiotikni har 1 soat kechiktirish buyrak chaqiqi xavfini qancha oshiradi?",
    "variantlar": ["0,1% ga", "0,8% ga", "5% ga", "10% ga"],
    "togri": 1,
    "izoh": "Bolalarda antibiotikni har bir soat kechiktirish buyrak chaqiqi xavfini 0,8% ga oshiradi — bu tezkor davolash boshlashning muhimligini ko'rsatadi."
  },
  {
    "savol": "Pielonefritda antibiotik 72 soatdan kech boshlansa, buyrak chaqiqi xavfi qanday o'zgaradi?",
    "variantlar": ["Farq yo'q", "48 soatgacha boshlanganga nisbatan ikki marta yuqori", "Kamroq bo'ladi", "Uch marta yuqori"],
    "togri": 1,
    "izoh": "Antibiotik 72 soatdan kech boshlanganida buyrak chaqiqi xavfi 48 soatgacha boshlanganiga nisbatan ikki marta yuqori — erta davolash chaqiqlarni oldini olishda juda muhim."
  },
  {
    "savol": "Radiologik jihatdan buyrak chaqig'ini tug'ma displaziyadan farqlash nimaga asoslanadi?",
    "variantlar": ["Farqlash oson — har doim aniq belgilari bor", "Kichik buyrak, tarqoq kamaygani izoton absorbsiyasi va kamaygani differensial funksiya ko'pincha tug'ma displaziyani ko'rsatadi", "Faqat yoshga asoslanadi", "Faqat siydik ekinmasiga asoslanadi"],
    "togri": 1,
    "izoh": "Kichik buyrak, tarqoq kamaygani izoton absorbsiyasi va kamaygani differensial buyrak funksiyasi ko'pincha tug'ma displaziyani ko'rsatadi. Bu farq davolash taktikasiga ta'sir qilishi mumkin."
  },
  {
    "savol": "Ekinma natijalari kelgandan keyin (48–72 soat) davolash qanday o'zgartiriladimi?",
    "variantlar": ["O'zgartirish shart emas", "Ha — sezuvchanlikka qarab maqsadli davolashga o'tilishi kerak", "Faqat kasalxonada o'zgartiriladi", "Faqat 7 kundan keyin o'zgartiriladi"],
    "togri": 1,
    "izoh": "Ekinma natijalari kelib tushgandan keyin antibiotik sezuvchanlikka qarab maqsadli davolashga o'tilishi kerak. Aminoglikozid kabi toksik dorilar imkon qadar tezroq kamroq toksik preparatlar bilan almashtiriladi."
  },
  {
    "savol": "Homiladorlikda pielonefrit xavfi nima uchun oshadi?",
    "variantlar": ["Immunitet kuchsizlashadi", "Siydik yo'li tonusining pasayishi siydik turg'unligiga olib keladi", "Ko'proq siydik ishlab chiqariladi", "Uretra qisqaradi"],
    "togri": 1,
    "izoh": "Homiladorlikda progesteron ta'sirida siydik yo'li tonusi pasayadi — bu siydik turg'unligiga va bakteriyaning ko'payishiga sharoit yaratib, pielonefrit xavfini oshiradi."
  },
  {
    "savol": "Pielonefritning xulosa bo'yicha 'isitmasiz pielonefrit' odatda nima ekanini ko'rsatadi?",
    "variantlar": ["Og'ir pielonefrit", "Bu ko'pincha sistitdir", "Emfizematoz pielonefrit", "Surunkali pielonefrit"],
    "togri": 1,
    "izoh": "Isitma pielonefritning asosiy belgisi. 'Isitmasiz pielonefrit' — bu ko'pincha sistitdir. Har qanday UTIni to'g'ri tasniflamoq uchun isitma mavjudligi muhim mezon."
  },
  {
    "savol": "Pielonefrit og'ir shakllarining diagnostikasida asosiy tasvirlash usuli qaysi?",
    "variantlar": ["Oddiy rentgen", "UZT (ultratovush)", "KT (kompyuter tomografiyasi)", "DMSA skan"],
    "togri": 2,
    "izoh": "KT — buyrak abssessi, perinefrik absess, emfizematoz pielonefrit va XGP ni aniqlashda asosiy tasvirlash usuli. Absess va gaz aniqlanishida KT eng informativ."
  },
  {
    "savol": "Pielonefritda surunkali holatga o'tishida asosiy patologik jarayon nima?",
    "variantlar": ["Buyrakda tosh hosil bo'lishi", "Buyrak korteksida atrofiya, kalitsiyalar kengayishi va fibrozlanish", "Siydik yo'lining kengayishi", "Buyrak tomirlarining torayishi"],
    "togri": 1,
    "izoh": "Surunkali pielonefritda buyrak korteksida maydon yo'qolishi, kalitsiyalarning kengayishi va fibrozlanish kuzatiladi — bu oldingi infeksiyalar yoki VUR ning uzoq muddatli oqibati."
  }
]$pielonefrit_savollar$::jsonb
WHERE dars_slug = 'pielonefrit-asoslari';
