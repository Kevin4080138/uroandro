UPDATE dars_tarkibi
SET savollar_banki = $sistit_savollar$[
  {
    "savol": "Sistit (cystitis) qanday ta'riflanadi?",
    "variantlar": ["Buyrak to'qimasining yallig'lanishi", "Siydik pufagi uroteliyining bakterial invaziyaga yallig'lanish javobi", "Siydik yo'lining mexanik to'siqlishi", "Uretraning kengayishi"],
    "togri": 1,
    "izoh": "Sistit — siydik pufagi uroteliyining bakterial invaziyaga yallig'lanish javobi bo'lib, odatda bakteriuriya va piyuriya bilan kechadi."
  },
  {
    "savol": "Sistitning klassik klinik triada belgisi qaysilar?",
    "variantlar": ["Isitma, qaltirash va bel og'rig'i", "Dizuriya, siydik tezligi va siydik shoshilishi", "Qonli siydik, og'riq va isitma", "Siydik tutolmaslik, bel og'rig'i va ko'ngil aynishi"],
    "togri": 1,
    "izoh": "Sistitning klassik triada belgisi: dizuriya (achishish), siydik tezligi (frequency) va siydik shoshilishi (urgency). Isitma esa pielonefritga ishora."
  },
  {
    "savol": "Asoratlanmagan sistit (uncomplicated cystitis) kimda uchraydi?",
    "variantlar": ["Kateter qo'yilgan bemorlarda", "Homilador ayollarda", "Tuzilishi va funksiyasi normal siydik yo'liga ega, homilador bo'lmagan sog'lom ayollarda", "Qandli diabetli bemorlarda"],
    "togri": 2,
    "izoh": "Asoratlanmagan sistit — tuzilishi va funksiyasi normal siydik yo'liga ega, homilador bo'lmagan, immunosupressiyasiz sog'lom ayollarda uchraydigan infeksiya."
  },
  {
    "savol": "Qaysi holat 'asoratlangan sistit' (complicated cystitis) sifatida tasniflanadi?",
    "variantlar": ["Sog'lom yosh ayolda birinchi marta UTI", "Erkakda yoki kateterizatsiyalangan bemordan kelib chiqqan UTI", "Dizuriya bilan kechuvchi har qanday UTI", "Nitrofurantoin bilan davolangan UTI"],
    "togri": 1,
    "izoh": "Asoratlangan sistit: erkaklar, homilador ayollar, siydik yo'li anatomik/funksional anomaliyasi, kateterizatsiya, immunosupressiya yoki qandli diabet bilan bog'liq UTI."
  },
  {
    "savol": "Qayta uchraydigan UTI (rUTI) qanday ta'riflanadi?",
    "variantlar": ["1 oy ichida 2 ta epizod", "6 oy ichida 2 ta yoki 1 yil ichida 3 ta tasdiqlangan epizod", "1 yil ichida 2 ta epizod", "2 yil ichida 5 ta epizod"],
    "togri": 1,
    "izoh": "rUTI — 6 oy ichida 2 ta yoki 1 yil ichida 3 ta laborator tasdiqlangan UTI epizodi."
  },
  {
    "savol": "Rezort infeksiya (bacterial persistence) nima?",
    "variantlar": ["Yangi bakteriya bilan qayta zararlash", "Xuddi shu bakteriyaning muolajadan keyin ham siydik yo'lida saqlanib qolishi", "Antibiotikka rezistentlik rivojlanishi", "Virusli infeksiya qo'shilishi"],
    "togri": 1,
    "izoh": "Bacterial persistence — davolashdan keyin xuddi shu bakteriyaning siydik yo'lida (masalan, tosh, prostata yoki kateter ichida) saqlanib qolishi. Qayta infeksiyadan farqli."
  },
  {
    "savol": "CAUTI nosokomial infeksiyalarning qancha qismini tashkil etadi?",
    "variantlar": ["~20%", "~50%", "80 foizdan ko'pi", "~95%"],
    "togri": 2,
    "izoh": "CAUTI (kateter bilan bog'liq UTI) nosokomial (kasalxona) infeksiyalarining 80 foizidan ko'pini tashkil etadi — eng keng tarqalgan kasalxona infeksiyasi."
  },
  {
    "savol": "Ayollar UTIga erkaklar bilan solishtirganda nima uchun ko'proq moyil?",
    "variantlar": ["Immunitet tizimi zaifroq bo'lganligi uchun", "Uretraning erkaklarga nisbatan qisqaroq bo'lganligi uchun", "Ko'proq suyuqlik ichishlari sababli", "Gormonlar darajasi tufayli"],
    "togri": 1,
    "izoh": "Ayollarda uretra erkaklar uretrасiga nisbatan ancha qisqa — bu bakteriyaning qovuqqa tezroq ko'tarilishiga imkon beradi va UTI xavfini oshiradi."
  },
  {
    "savol": "Erkaklarda UTI qanday baholanishi kerak?",
    "variantlar": ["Asoratlanmagan deb qabul qilinadi", "Har doim asoratlangan deb qabul qilinadi", "Faqat yoshli erkaklarda asoratlangan", "Hech qanday tekshiruv zarur emas"],
    "togri": 1,
    "izoh": "Erkaklarda har qanday UTI asoratlangan deb qabul qilinishi kerak — ko'pincha anatomik yoki funksional patologiya (masalan, prostata gиперplaziyasi, to'liq bo'shalmaslik) asosida."
  },
  {
    "savol": "Sistitda infeksiya qaysi yo'l bilan ko'pincha rivojlanadi?",
    "variantlar": ["Gematogen yo'l — qon orqali", "Limfogen yo'l — limfa orqali", "Asending yo'l — uretra orqali ko'tarilish", "To'g'ridan-to'g'ri yaqin a'zolardan o'tish"],
    "togri": 2,
    "izoh": "UTI ko'pincha ichakdan va teri yuzasidan keladigan bakteriyalarning uretra orqali ko'tarilishi (ascending route) natijasida rivojlanadi."
  },
  {
    "savol": "UTI qo'zg'atuvchilarining taxminan qancha foizini UPEC tashkil etadi?",
    "variantlar": ["~30%", "~50%", "~80%", "~95%"],
    "togri": 2,
    "izoh": "Uropatogen E. coli (UPEC) — siydik yo'li infeksiyalarining taxminan 80 foizini qamrab oluvchi asosiy qo'zg'atuvchi."
  },
  {
    "savol": "UPEC fimbriyalari (fimbriae/pili) qanday vazifani bajaradi?",
    "variantlar": ["Antibiotikdan himoya qiladi", "Bakteriyaning uroteliy hujayralariga yopishishini ta'minlaydi", "Temir tortib oladi", "Uroteliyni to'g'ridan-to'g'ri yo'q qiladi"],
    "togri": 1,
    "izoh": "UPEC fimbriyalari (ipi-nay o'simtalar) uroteliy hujayralaridagi receptor uchun yopishish vositasi — infeksiyaning birinchi bosqichi."
  },
  {
    "savol": "UPEC biofilm hosil qilishining klinik ahamiyati nima?",
    "variantlar": ["Bakteriyaning o'sishini tormozlaydi", "Antibiotik va immunitetdan himoyalanib, qayta infeksiyalarga olib keladi", "Siydikni sterillashtiradi", "Piyuriyani kamaytiradi"],
    "togri": 1,
    "izoh": "UPEC biofilm — bakteriyani antibiotik ta'siridan va immunitetdan himoyalovchi plyonka. Biofilm qayta infeksiyalar va surunkali UTIning asosiy sabablaridan biri."
  },
  {
    "savol": "UPEC sideroforlarining vazifasi nima?",
    "variantlar": ["Uroteliyni shikastlash", "Temir tortib olib, kam temirli muhitda ham o'sishni ta'minlash", "Biofilm hosil qilish", "Siydik pH ni o'zgartirish"],
    "togri": 1,
    "izoh": "Siderofori — UPEC ning temir chelatlash mexanizmi. Siydikda temir miqdori juda kam — UPEC siderofori orqali bu muhitda ham o'sa oladi."
  },
  {
    "savol": "Suprapubik og'riq sistitda qayerda seziladi?",
    "variantlar": ["Bel sohasida", "Qov usti sohasida", "O'ng qovurg'a ostida", "Ko'krak qafasida"],
    "togri": 1,
    "izoh": "Suprapubik og'riq — qov (pubis) usti sohasida seziluvchi og'riq yoki bosim hissi. Sistitning klinik belgisi sifatida qabul qilinadi."
  },
  {
    "savol": "Quyidagi qaysi belgilar sistit uchun XARAKTERLI EMAS va pielonefritni ko'rsatadi?",
    "variantlar": ["Dizuriya va siydik tezligi", "Suprapubik og'riq", "Isitma, qaltirash va bel og'rig'i", "Siydik shoshilishi"],
    "togri": 2,
    "izoh": "Isitma, qaltirash va bel og'rig'i sistit belgisi emas — bu belgilar infeksiyaning buyrakka ko'tarilganini (pielonefrit) ko'rsatadi va boshqacha yondashuvni talab qiladi."
  },
  {
    "savol": "Dizuriya va siydik tezligi kombinatsiyasi vaginal ajralma bo'lmasa, UTI ehtimolini qancha deb baholash mumkin?",
    "variantlar": ["~50%", "~70%", "90 foizdan ortiq", "~30%"],
    "togri": 2,
    "izoh": "Tadqiqotlar shuni ko'rsatadiki, dizuriya + siydik tezligi kombinatsiyasi vaginal ajralma yoki ta'sirlanish bo'lmaganda, 90 foizdan ortiq hollarda UTI mavjudligini oldindan aytish mumkin."
  },
  {
    "savol": "Sistitni qaysi holatlardan farqlash zarur?",
    "variantlar": ["Buyrak toshi va gidronefroz", "IC/BPS, vaginit, GSM va qovuq saratoni", "Pielonefrit va prostata saratoni", "Varikotsele va gidrotsele"],
    "togri": 1,
    "izoh": "Sistit simptomlarini (dizuriya, tezlik) IC/BPS, vaginit, GSM va qovuq saratonidan farqlash zarur — barchasida o'xshash belgilar bo'lishi mumkin, ammo davolash farq qiladi."
  },
  {
    "savol": "Tasma tahlilida leykotsit esteraza va nitrit birgalikda musbat bo'lsa, UTI ehtimoli qancha?",
    "variantlar": ["~50%", "~70%", "Kamida 90%", "100%"],
    "togri": 2,
    "izoh": "Tasma tahlilida leykotsit esteraza + nitrit birgalikda musbat bo'lsa, UTI ehtimoli kamida 90 foizga etadi — bu tezkor skrining uchun yetarli klinik ma'lumot."
  },
  {
    "savol": "Siydik ekinmasi UTI diagnostikasida nima uchun 'oltin standart' hisoblanadi?",
    "variantlar": ["Tez natija beradi (30 daqiqada)", "Qo'zg'atuvchini va antibiotik sezuvchanligini aniq aniqlaydi", "Arzon va qulay usul", "Hamma laboratoriyalarda mavjud"],
    "togri": 1,
    "izoh": "Siydik ekinmasi — UTI ni tasdiqlash va antibiotik sezuvchanligini aniqlashning 'oltin standarti'. Natija 18–48 soatda chiqadi."
  },
  {
    "savol": "Qaysi holatlarda siydik ekinmasi MAJBURIY hisoblanadi?",
    "variantlar": ["Barcha ayollarda", "Erkaklar, homilador ayollar, asoratlangan UTI, davolashga javob bermaydigan holat", "Faqat og'ir sistitda", "Faqat kasalxonaga yotganda"],
    "togri": 1,
    "izoh": "Ekinma majburiy: erkaklar, homilador ayollar, asoratlangan UTI, davolashga javob bermaydigan holat, rUTI va bosqichma-bosqich UTI kuzatuvida."
  },
  {
    "savol": "Asoratlanmagan o'tkir sistitli ayollarda siydik ekinmasi haqida qaysi fikr to'g'ri?",
    "variantlar": ["Har doim majburiy", "Klinik belgilar etarli — rutina ekinma shart emas", "Faqat antibiotikdan keyin o'tkaziladi", "Faqat yoshli ayollarda shart emas"],
    "togri": 1,
    "izoh": "Asoratlanmagan o'tkir sistitda sog'lom ayollar uchun klinik belgilar asosida davolash mumkin — rutina siydik ekinmasi IDSA qo'llanmasida tavsiya etilmaydi."
  },
  {
    "savol": "Doimiy kateter qo'yilgan bemorning siydigida bakteriya aniqlansa, simptom bo'lmasa nima qilish kerak?",
    "variantlar": ["Darhol antibiotik boshlash", "Kateter almashtirish", "Davolash shart emas — bu kolonizatsiya, klinik infeksiya emas", "Kasalxonaga yotqizish"],
    "togri": 2,
    "izoh": "Doimiy kateterli bemorlarda asimptomatik bakteriuriya klinik infeksiya emas — davolash antibiotiklarning ortiqcha qo'llanilishiga va rezistentlikka olib keladi."
  },
  {
    "savol": "IDSA qo'llanmasiga ko'ra asoratlanmagan sistitda birinchi tanlash antibiotigi qaysi?",
    "variantlar": ["Siprofloksatsin", "Amoksitsillin", "Nitrofurantoin (100 mg, 2 marta/kun, 5 kun)", "Tseftriakson"],
    "togri": 2,
    "izoh": "Nitrofurantoin — asoratlanmagan sistitda birinchi tanlash. Minimal rezistentlik, yaxshi xavfsizlik profili. Erta pielonefrit gumonida qo'llanmaydi."
  },
  {
    "savol": "TMP-SMX sistitda qachon qo'llanilishi tavsiya etiladi?",
    "variantlar": ["Har doim birinchi tanlov sifatida", "Mahalliy rezistentlik 20% dan kam bo'lganda va so'nggi 3 oyda ishlatilmagan bo'lsa", "Faqat og'ir sistitda", "Faqat kasalxona sharoitida"],
    "togri": 1,
    "izoh": "TMP-SMX (3 kun) samarali, ammo mahalliy rezistentlik ≥20% bo'lsa yoki so'nggi 3 oyda ishlatilgan bo'lsa, boshqa dori tanlash kerak."
  },
  {
    "savol": "Fosfomitsin trometamolning asosiy qulayligi nima?",
    "variantlar": ["Eng arzon dori", "Bitta dozada (3 g) qabul qilinadi", "Pielonefritga ham ta'sir qiladi", "Homiladorlikda xavfsiz emas"],
    "togri": 1,
    "izoh": "Fosfomitsin trometamol bir martalik 3 g dozada qabul qilinadi — buning bemorga qulayligi yuqori. Samaradorligi nitrofurantinga nisbatan biroz past."
  },
  {
    "savol": "Ftorokinolonlar (siprofloksatsin) asoratlanmagan sistitda qachon ishlatilishi kerak?",
    "variantlar": ["Har doim birinchi tanlov sifatida", "Faqat bolalarda", "Oxirgi chora sifatida — birinchi qator dorilar mavjud bo'lsa ishlatmaslik kerak", "Homiladorlarda birinchi tanlov sifatida"],
    "togri": 2,
    "izoh": "Ftorokinolonlar yuqori kollateral zarar (rezistentlik oshirish) va FDA ogohlantirishlari sababli oxirgi chora sifatida saqlanishi kerak — birinchi qator dorilar mavjud bo'lsa ishlatilmaydi."
  },
  {
    "savol": "Davolashdan keyin simptomlar yo'qolgan ayollarda kuzatuv viziti va ekinma zarurmi?",
    "variantlar": ["Ha, har doim zarur", "Faqat 2 hafta o'tgach zarur", "Yo'q — shart emas", "Faqat 65 yoshdan katta bemorlarda zarur"],
    "togri": 2,
    "izoh": "Davolashdan keyin simsiz bo'lgan asoratlanmagan sistitli ayollarda kuzatuv viziti yoki nazorat ekinmasi zarur emas — bu AUA/IDSA tavsiyasi."
  },
  {
    "savol": "rUTI ta'rifiga ko'ra quyidagi qaysi holat to'g'ri?",
    "variantlar": ["1 yil ichida 1 ta epizod", "6 oy ichida 2 ta yoki 1 yil ichida 3 ta tasdiqlangan UTI epizodi", "2 yil ichida 2 ta epizod", "Har oyda 1 ta epizod"],
    "togri": 1,
    "izoh": "rUTI — 6 oy ichida ≥2 ta yoki 12 oy ichida ≥3 ta laborator tasdiqlangan UTI epizodi."
  },
  {
    "savol": "rUTI profilaktikasida ko'proq suyuqlik ichishning asosiy mexanizmi nima?",
    "variantlar": ["Siydikni ishqorlashtirish", "Siydikni suyultirib, bakteriyani mexanik yo'l bilan chiqarib yuborish", "Bakteriya o'sishini to'xtatish", "Qovuq pH ini o'zgartirish"],
    "togri": 1,
    "izoh": "Ko'proq suyuqlik ichish siydik hajmini oshiradi va tez-tez siydik chiqarishni ta'minlaydi — bakteriya yopishishi va ko'payishi uchun kamroq vaqt qoladi."
  },
  {
    "savol": "D-mannoz rUTI profilaktikasida qanday ta'sir ko'rsatadi?",
    "variantlar": ["Siydikni antispetik qiladi", "UPEC fimbriyalarining uroteliyga yopishishini tormozlaydi", "Siydik pH ni past saqlaydi", "Antibiotik sifatida ishlaydi"],
    "togri": 1,
    "izoh": "D-mannoz UPEC ning mannoze-sezgir fimbriyalariga raqobatchi sifatida bog'lanib, bakteriyaning uroteliyga yopishishini tormozlaydi."
  },
  {
    "savol": "Menopauza davridagi ayollarda rUTI xavfini kamaytirish uchun qaysi mahalliy davo tavsiya etiladi?",
    "variantlar": ["Mahalliy antibiotik", "Vaginal estrogen", "Sistoskopiya", "Doimiy antibiotik profilaktikasi"],
    "togri": 1,
    "izoh": "Menopauza davrida estrogen kamayishi vaginal va uretra shilliq qavatini yupqalashtiradi. Vaginal estrogen shilliq qavat himoyasini tiklab, UTI xavfini kamaytiradi."
  },
  {
    "savol": "Spermitisidal moddalar va diafragmaning rUTI bilan bog'liqligi nima?",
    "variantlar": ["UTI xavfini kamaytiradi", "UTI xavfini oshiradi", "Hech qanday aloqasi yo'q", "Faqat yoshli ayollarda xavfni oshiradi"],
    "togri": 1,
    "izoh": "Spermitisidal moddalar va diafragma vaginal florani o'zgartirib, UPEC kolonizatsiyasiga sharoit yaratadi — UTI xavfini oshiradi. rUTI bo'lsa, ulardan voz kechish tavsiya etiladi."
  },
  {
    "savol": "Asoratlanmagan rUTI uchun sistoskopiya va tasvirlash tekshiruvlari rutina tavsiya etilishi haqida qaysi fikr to'g'ri?",
    "variantlar": ["Har doim tavsiya etiladi", "Faqat antibiotik profilaktikasidan oldin", "Rutina tavsiya etilmaydi — faqat xavf omillari bo'lsa ko'rsatiladi", "Yiliga bir marta tavsiya etiladi"],
    "togri": 2,
    "izoh": "Asoratlanmagan rUTI uchun sistoskopiya va tasvirlash tekshiruvlari rutina tavsiya etilmaydi. Faqat gematuriya, tosh shubhasi yoki obstruksiya belgilari bo'lsa ko'rsatiladi."
  },
  {
    "savol": "IC/BPS (interstitial sistit) bakterial sistitdan qanday farq qiladi?",
    "variantlar": ["IC/BPS yuqori isitmа bilan kechadi", "IC/BPS infeksiyasiz surunkali qovuq og'rig'i sindromi — ekinmada bakteriya bo'lmaydi", "IC/BPS faqat erkaklarda uchraydi", "IC/BPS antibiotik bilan tuzaladi"],
    "togri": 1,
    "izoh": "IC/BPS — infeksiyasiz surunkali qovuq og'rig'i sindromi. Dizuriya va tezlik kabi o'xshash belgilari bo'lsa-da, siydik ekinmasi manfiy, sababi boshqacha — davolash mutlaqo farq qiladi."
  },
  {
    "savol": "ASB (asimptomatik bakteriuriya) qaysi bemorlarda davolash talab qilmaydi?",
    "variantlar": ["Faqat yoshli ayollarda", "Homilador ayollarda", "Doimiy kateter bilan yuruvchi va simptomsiz bemorlarda", "Faqat erkaklarda"],
    "togri": 2,
    "izoh": "Doimiy kateterli va boshqa ko'pchilik bemorlarda asimptomatik bakteriuriya klinik infeksiya emas — davolash shart emas. Istisno: homilador ayollar va ba'zi urologik aralashuvlardan oldin."
  },
  {
    "savol": "UPEC ning kapsulyar polisaxaridlari (K-antigens) qanday vazifani bajaradi?",
    "variantlar": ["Uroteliyga yopishishni ta'minlaydi", "Fagositozdan (immunitet hujumidan) himoya qiladi", "Temir tortib oladi", "Antibiotikni parchalaydi"],
    "togri": 1,
    "izoh": "Kapsulyar polisaxaridlar (K-antigens) UPEC ni neytrofil fagositozidan himoya qilib, qondan klirensi sekinlashtiradi — infeksiyaning davom etishiga yordam beradi."
  },
  {
    "savol": "Qayta uchraydigan UTI xavfi nimaga mutanosib ravishda ortadi?",
    "variantlar": ["Faqat yoshga", "Oldingi infeksiyalar soni bilan to'g'ri mutanosib", "Faqat antibiotik turiga", "Faqat ovqatlanish tartibiga"],
    "togri": 1,
    "izoh": "Qayta uchraydigan UTI xavfi oldingi infeksiyalar soni bilan to'g'ri mutanosib ravishda ortadi — har bir epizod keyingisining xavfini oshiradi."
  },
  {
    "savol": "CAUTI (catheter-associated UTI) ta'riflanishi uchun nima zarur?",
    "variantlar": ["Isitma va qovuq og'rig'i yetarli", "Kateter mavjud bo'lib, klinik UTI belgilari va musbat ekinma bo'lishi", "Faqat musbat siydik ekinmasi", "Faqat piyuriya bo'lishi"],
    "togri": 1,
    "izoh": "CAUTI uchun kateter mavjudligi + klinik UTI belgilari (isitma, siydik shoshilishi va h.k.) + musbat siydik ekinmasi zarur. Faqat bakteriuriya CAUTI emas."
  },
  {
    "savol": "Siydikda bakteriya borligi qachon klinik ahamiyatga ega bo'ladi?",
    "variantlar": ["Har qanday miqdorda", "Piyuriya va klinik belgilar bilan birgalikda bo'lganda", "Faqat 1 dan ortiq bakteriya turi aniqlanganda", "Siydik rangi o'zgarganda"],
    "togri": 1,
    "izoh": "Siydik haqiqatda steril emas — sog'lom kishilarda ham oz miqdorda bakteriya bo'lishi mumkin. Klinik qaror uchun piyuriya va klinik belgilar majmuasi muhim, nafaqat bakteriya soni."
  },
  {
    "savol": "Sistitning asosiy xulosasiga ko'ra qaysi fikr TO'G'RI?",
    "variantlar": ["Isitma sistitning asosiy belgisi", "Nitrofurantoin va TMP-SMX birinchi qator; ftorokinolonlar so'nggi chora", "Barcha sistitli bemorlarga siydik ekinmasi majburiy", "rUTI da sistoskopiya har doim tavsiya etiladi"],
    "togri": 1,
    "izoh": "Nitrofurantoin va TMP-SMX — birinchi qator vositalar. Ftorokinolonlar kollateral zarar va rezistentlik xavfi tufayli so'nggi chora sifatida saqlanishi kerak."
  }
]$sistit_savollar$::jsonb
WHERE dars_slug = 'sistit-asoslari';
