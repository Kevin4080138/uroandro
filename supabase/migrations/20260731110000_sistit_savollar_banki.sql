UPDATE dars_tarkibi
SET savollar_banki = $sistit_savollar$[
  {
    "savol": "Sistit (cystitis) qanday ta'riflanadi?",
    "variantlar": ["Buyrak parenxima to'qimasining bakterial yallig'lanishi", "Siydik pufagi uroteliyining bakterial yallig'lanish javobi", "Siydik yo'lining tosh bilan mexanik to'silib qolishi holati", "Uretra kanalining patologik ravishda kengayib ketishi holati"],
    "togri": 1,
    "izoh": "Sistit — siydik pufagi uroteliyining bakterial invaziyaga yallig'lanish javobi bo'lib, odatda bakteriuriya va piyuriya bilan kechadi."
  },
  {
    "savol": "Sistitning klassik klinik triada belgisi qaysilar?",
    "variantlar": ["Isitma, qaltirash va bir tomonlama bel og'rig'i birgalikda", "Dizuriya, siydik tezligi va siydik shoshilishi birgalikda", "Qonli siydik, o'tkir og'riq va yuqori isitma birgalikda", "Siydik tutolmaslik, bel og'rig'i va ko'ngil aynishi birga"],
    "togri": 1,
    "izoh": "Sistitning klassik triada belgisi: dizuriya (achishish), siydik tezligi (frequency) va siydik shoshilishi (urgency). Isitma esa pielonefritga ishora."
  },
  {
    "savol": "Asoratlanmagan sistit (uncomplicated cystitis) kimda uchraydi?",
    "variantlar": ["Doimiy siydik kateteri qo'yilgan bemorlarda uchraydi", "Homilador ayollarda va immunosupressiyali bemorlarda", "Normal siydik yo'lli, homilador bo'lmagan sog'lom ayolda", "Qandli diabet bilan og'rigan bemorlarda uchraydigan UTI"],
    "togri": 2,
    "izoh": "Asoratlanmagan sistit — tuzilishi va funksiyasi normal siydik yo'liga ega, homilador bo'lmagan, immunosupressiyasiz sog'lom ayollarda uchraydigan infeksiya."
  },
  {
    "savol": "Qaysi holat 'asoratlangan sistit' (complicated cystitis) sifatida tasniflanadi?",
    "variantlar": ["Sog'lom yosh ayolda birinchi marta yuzaga kelgan oddiy UTI", "Erkakda yoki kateterizatsiyalangan bemordan kelib chiqqan UTI", "Dizuriya bilan kechuvchi har qanday oddiy quyi UTI holati", "Nitrofurantoin bilan muvaffaqiyatli davolangan oddiy UTI"],
    "togri": 1,
    "izoh": "Asoratlangan sistit: erkaklar, homilador ayollar, siydik yo'li anatomik/funksional anomaliyasi, kateterizatsiya, immunosupressiya yoki qandli diabet bilan bog'liq UTI."
  },
  {
    "savol": "Qayta uchraydigan UTI (rUTI) qanday ta'riflanadi?",
    "variantlar": ["1 oy ichida 2 ta ketma-ket kuzatilgan UTI epizodi", "6 oy ichida 2 ta yoki 1 yil ichida 3 ta tasdiqlangan epizod", "1 yil davomida atigi 2 ta kuzatilgan UTI epizodi", "2 yil davomida jami 5 ta kuzatilgan UTI epizodi"],
    "togri": 1,
    "izoh": "rUTI — 6 oy ichida 2 ta yoki 1 yil ichida 3 ta laborator tasdiqlangan UTI epizodi."
  },
  {
    "savol": "Rezort infeksiya (bacterial persistence) nima?",
    "variantlar": ["Butunlay yangi bakteriya turi bilan qayta zararlanish holati", "Xuddi shu bakteriyaning muolajadan keyin ham saqlanib qolishi", "Qo'llanilgan antibiotikka nisbatan rezistentlik rivojlanishi", "Mavjud infeksiyaga qo'shimcha virusli infeksiya qo'shilishi"],
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
    "variantlar": ["Ayollarda immunitet tizimi tabiatan ancha zaifroq bo'lgani uchun", "Uretraning erkaklarnikiga nisbatan ancha qisqaroq bo'lgani uchun", "Ayollar odatda kamroq suyuqlik iste'mol qilishlari sababidan", "Ayol jinsiy gormonlari darajasi yuqoriroq bo'lishi tufayli"],
    "togri": 1,
    "izoh": "Ayollarda uretra erkaklar uretrасiga nisbatan ancha qisqa — bu bakteriyaning qovuqqa tezroq ko'tarilishiga imkon beradi va UTI xavfini oshiradi."
  },
  {
    "savol": "Erkaklarda UTI qanday baholanishi kerak?",
    "variantlar": ["Har doim asoratlanmagan oddiy infeksiya deb qabul qilinadi", "Har doim asoratlangan infeksiya sifatida qabul qilinishi kerak", "Faqat 50 yoshdan katta erkaklarda asoratlangan hisoblanadi", "Hech qanday qo'shimcha tekshiruvni talab qilmaydigan holat"],
    "togri": 1,
    "izoh": "Erkaklarda har qanday UTI asoratlangan deb qabul qilinishi kerak — ko'pincha anatomik yoki funksional patologiya (masalan, prostata gиперplaziyasi, to'liq bo'shalmaslik) asosida."
  },
  {
    "savol": "Sistitda infeksiya qaysi yo'l bilan ko'pincha rivojlanadi?",
    "variantlar": ["Gematogen yo'l — qon oqimi orqali", "Limfogen yo'l — limfa tomiri orqali", "Asending yo'l — uretra orqali ko'tarilish", "Qo'shni a'zolardan to'g'ridan-to'g'ri o'tish"],
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
    "variantlar": ["Bakteriyani antibiotik ta'siridan himoyalash vazifasini bajaradi", "Bakteriyaning uroteliy hujayralariga yopishishini ta'minlaydi", "Muhitdan temir ionlarini tortib olish vazifasini bajaradi", "Uroteliy hujayralarini to'g'ridan-to'g'ri parchalab yo'q qiladi"],
    "togri": 1,
    "izoh": "UPEC fimbriyalari (ipi-nay o'simtalar) uroteliy hujayralaridagi receptor uchun yopishish vositasi — infeksiyaning birinchi bosqichi."
  },
  {
    "savol": "UPEC biofilm hosil qilishining klinik ahamiyati nima?",
    "variantlar": ["Bakteriyaning ko'payishi va o'sishini sekinlashtirib tormozlaydi", "Antibiotik va immunitetdan himoyalab qayta infeksiyaga olib keladi", "Siydikni bakteriyalardan tozalab sterillashtiruvchi ta'sir beradi", "Siydikdagi piyuriya (leykotsit) miqdorini kamaytirib yuboradi"],
    "togri": 1,
    "izoh": "UPEC biofilm — bakteriyani antibiotik ta'siridan va immunitetdan himoyalovchi plyonka. Biofilm qayta infeksiyalar va surunkali UTIning asosiy sabablaridan biri."
  },
  {
    "savol": "UPEC sideroforlarining vazifasi nima?",
    "variantlar": ["Uroteliy hujayralarini shikastlab yallig'lanish keltirib chiqarish", "Temir tortib olib, kam temirli muhitda ham o'sishni ta'minlash", "Bakteriyani qoplovchi himoya biofilmini hosil qilib berish", "Siydik muhitining kislotalik (pH) darajasini o'zgartirib berish"],
    "togri": 1,
    "izoh": "Siderofori — UPEC ning temir chelatlash mexanizmi. Siydikda temir miqdori juda kam — UPEC siderofori orqali bu muhitda ham o'sa oladi."
  },
  {
    "savol": "Suprapubik og'riq sistitda qayerda seziladi?",
    "variantlar": ["Yon-bel (flank) sohasida", "Qov (pubis) usti sohasida", "O'ng qovurg'a ostida", "Ko'krak qafasi orqasida"],
    "togri": 1,
    "izoh": "Suprapubik og'riq — qov (pubis) usti sohasida seziluvchi og'riq yoki bosim hissi. Sistitning klinik belgisi sifatida qabul qilinadi."
  },
  {
    "savol": "Quyidagi qaysi belgilar sistit uchun XARAKTERLI EMAS va pielonefritni ko'rsatadi?",
    "variantlar": ["Dizuriya va siydik tezligi (frequency)", "Qov usti (suprapubik) sohasidagi og'riq", "Isitma, qaltirash va bir tomonlama bel og'rig'i", "Siydik shoshilishi (urgency) va noqulaylik"],
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
    "variantlar": ["Buyrak toshi va gidronefroz kabi obstruktiv holatlardan", "IC/BPS, vaginit, GSM va qovuq saratoni holatlaridan", "Pielonefrit va prostata bezi saratoni holatlaridan", "Varikotsele va gidrotsele kabi skrotal holatlardan"],
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
    "variantlar": ["Juda tez, atigi 30 daqiqada aniq natija berishi tufayli", "Qo'zg'atuvchini va antibiotik sezuvchanligini aniq belgilashi", "Boshqa usullarga qaraganda arzon va qulay bo'lishi tufayli", "Deyarli barcha laboratoriyalarda mavjud bo'lishi tufayli"],
    "togri": 1,
    "izoh": "Siydik ekinmasi — UTI ni tasdiqlash va antibiotik sezuvchanligini aniqlashning 'oltin standarti'. Natija 18–48 soatda chiqadi."
  },
  {
    "savol": "Qaysi holatlarda siydik ekinmasi MAJBURIY hisoblanadi?",
    "variantlar": ["Istisnosiz barcha ayol bemorlarda majburiy hisoblanadi", "Erkak, homilador, asoratlangan UTI va javobsiz holatlarda", "Faqat og'ir kechuvchi sistit holatlarida majburiy bo'ladi", "Faqat kasalxonaga yotqizilgan bemorlardagina majburiy"],
    "togri": 1,
    "izoh": "Ekinma majburiy: erkaklar, homilador ayollar, asoratlangan UTI, davolashga javob bermaydigan holat, rUTI va bosqichma-bosqich UTI kuzatuvida."
  },
  {
    "savol": "Asoratlanmagan o'tkir sistitli ayollarda siydik ekinmasi haqida qaysi fikr to'g'ri?",
    "variantlar": ["Barcha holatlarda istisnosiz majburiy tarzda o'tkaziladi", "Klinik belgilar yetarli — rutina ekinma talab etilmaydi", "Faqat antibiotik kursi tugagandan keyin o'tkaziladi", "Faqat 65 yoshdan katta bo'lmagan ayollarda shart emas"],
    "togri": 1,
    "izoh": "Asoratlanmagan o'tkir sistitda sog'lom ayollar uchun klinik belgilar asosida davolash mumkin — rutina siydik ekinmasi IDSA qo'llanmasida tavsiya etilmaydi."
  },
  {
    "savol": "Doimiy kateter qo'yilgan bemorning siydigida bakteriya aniqlansa, simptom bo'lmasa nima qilish kerak?",
    "variantlar": ["Zudlik bilan keng spektrli antibiotik terapiyani boshlash", "Kateterni yangisiga almashtirib, kuzatuvni davom ettirish", "Davolash shart emas — bu kolonizatsiya, infeksiya emas", "Bemorni tekshiruv uchun kasalxonaga yotqizib qo'yish"],
    "togri": 2,
    "izoh": "Doimiy kateterli bemorlarda asimptomatik bakteriuriya klinik infeksiya emas — davolash antibiotiklarning ortiqcha qo'llanilishiga va rezistentlikka olib keladi."
  },
  {
    "savol": "IDSA qo'llanmasiga ko'ra asoratlanmagan sistitda birinchi tanlash antibiotigi qaysi?",
    "variantlar": ["Siprofloksatsin 500 mg × 2/kun, 7 kunlik kurs bilan", "Amoksitsillin 500 mg × 3/kun, 7 kunlik kurs bilan", "Nitrofurantoin 100 mg × 2/kun, 5 kunlik kurs bilan", "Tseftriakson 1 g mushak ichiga bir martalik doza bilan"],
    "togri": 2,
    "izoh": "Nitrofurantoin — asoratlanmagan sistitda birinchi tanlash. Minimal rezistentlik, yaxshi xavfsizlik profili. Erta pielonefrit gumonida qo'llanmaydi."
  },
  {
    "savol": "TMP-SMX sistitda qachon qo'llanilishi tavsiya etiladi?",
    "variantlar": ["Istalgan vaziyatda eng birinchi tanlov dori sifatida", "Rezistentlik <20% va so'nggi 3 oyda ishlatilmagan bo'lsa", "Faqat og'ir kechuvchi sistit holatlarida qo'llaniladi", "Faqat kasalxona sharoitida IV shaklda qo'llaniladi"],
    "togri": 1,
    "izoh": "TMP-SMX (3 kun) samarali, ammo mahalliy rezistentlik ≥20% bo'lsa yoki so'nggi 3 oyda ishlatilgan bo'lsa, boshqa dori tanlash kerak."
  },
  {
    "savol": "Fosfomitsin trometamolning asosiy qulayligi nima?",
    "variantlar": ["Bozordagi eng arzon narxli antibiotik bo'lishi tufayli", "Bir martalik yagona (3 g) dozada qabul qilinishi tufayli", "Pielonefritga ham baravar samarali ta'sir ko'rsatishi tufayli", "Homiladorlik davrida umuman xavfsiz bo'lmasligi tufayli"],
    "togri": 1,
    "izoh": "Fosfomitsin trometamol bir martalik 3 g dozada qabul qilinadi — buning bemorga qulayligi yuqori. Samaradorligi nitrofurantinga nisbatan biroz past."
  },
  {
    "savol": "Ftorokinolonlar (siprofloksatsin) asoratlanmagan sistitda qachon ishlatilishi kerak?",
    "variantlar": ["Istalgan holatda eng birinchi tanlov dori sifatida ishlatiladi", "Faqat go'dak va o'smir bolalar davolashida ishlatiladi", "Oxirgi chora — birinchi qator dorilar bo'lsa ishlatilmaydi", "Homilador ayollarda birinchi tanlov sifatida ishlatiladi"],
    "togri": 2,
    "izoh": "Ftorokinolonlar yuqori kollateral zarar (rezistentlik oshirish) va FDA ogohlantirishlari sababli oxirgi chora sifatida saqlanishi kerak — birinchi qator dorilar mavjud bo'lsa ishlatilmaydi."
  },
  {
    "savol": "Davolashdan keyin simptomlar yo'qolgan ayollarda kuzatuv viziti va ekinma zarurmi?",
    "variantlar": ["Ha, davolash tugagach har doim majburiy tarzda zarur", "Faqat davolash tugaganidan 2 hafta o'tgach zarur bo'ladi", "Yo'q — simptomsiz bo'lsa kuzatuv va ekinma shart emas", "Faqat 65 yoshdan katta bo'lgan bemorlardagina zarur"],
    "togri": 2,
    "izoh": "Davolashdan keyin simsiz bo'lgan asoratlanmagan sistitli ayollarda kuzatuv viziti yoki nazorat ekinmasi zarur emas — bu AUA/IDSA tavsiyasi."
  },
  {
    "savol": "rUTI ta'rifiga ko'ra quyidagi qaysi holat to'g'ri?",
    "variantlar": ["1 yil davomida atigi 1 ta kuzatilgan UTI epizodi", "6 oy ichida ≥2 ta yoki 1 yil ichida ≥3 ta tasdiqlangan epizod", "2 yil davomida jami 2 ta kuzatilgan UTI epizodi", "Har oyda muntazam ravishda bittadan UTI epizodi"],
    "togri": 1,
    "izoh": "rUTI — 6 oy ichida ≥2 ta yoki 12 oy ichida ≥3 ta laborator tasdiqlangan UTI epizodi."
  },
  {
    "savol": "rUTI profilaktikasida ko'proq suyuqlik ichishning asosiy mexanizmi nima?",
    "variantlar": ["Siydikni ishqorlashtirib bakteriya o'sishiga to'sqinlik qilish", "Siydikni suyultirib bakteriyani mexanik yo'l bilan chiqarish", "Bakteriyaning bo'linishi va ko'payishini bevosita to'xtatish", "Qovuq shilliq qavati muhitining pH darajasini o'zgartirish"],
    "togri": 1,
    "izoh": "Ko'proq suyuqlik ichish siydik hajmini oshiradi va tez-tez siydik chiqarishni ta'minlaydi — bakteriya yopishishi va ko'payishi uchun kamroq vaqt qoladi."
  },
  {
    "savol": "D-mannoz rUTI profilaktikasida qanday ta'sir ko'rsatadi?",
    "variantlar": ["Siydik muhitini antiseptik holatga keltirib sterillashtirish", "UPEC fimbriyalarining uroteliyga yopishishini tormozlash", "Siydik pH darajasini doimiy ravishda past holatda saqlash", "To'g'ridan-to'g'ri antibiotik kabi bakteriyalarni o'ldirish"],
    "togri": 1,
    "izoh": "D-mannoz UPEC ning mannoze-sezgir fimbriyalariga raqobatchi sifatida bog'lanib, bakteriyaning uroteliyga yopishishini tormozlaydi."
  },
  {
    "savol": "Menopauza davridagi ayollarda rUTI xavfini kamaytirish uchun qaysi mahalliy davo tavsiya etiladi?",
    "variantlar": ["Mahalliy qo'llaniladigan antibiotik krem", "Vaginal estrogen (mahalliy gormon)", "Diagnostik sistoskopiya tekshiruvi", "Doimiy og'iz orqali antibiotik profilaktikasi"],
    "togri": 1,
    "izoh": "Menopauza davrida estrogen kamayishi vaginal va uretra shilliq qavatini yupqalashtiradi. Vaginal estrogen shilliq qavat himoyasini tiklab, UTI xavfini kamaytiradi."
  },
  {
    "savol": "Spermitisidal moddalar va diafragmaning rUTI bilan bog'liqligi nima?",
    "variantlar": ["UTI xavfini sezilarli darajada kamaytiruvchi ta'sir ko'rsatadi", "Vaginal florani o'zgartirib UTI xavfini oshiruvchi ta'sir beradi", "UTI rivojlanishi bilan hech qanday aloqadorligi mavjud emas", "Faqat 50 yoshdan katta ayollardagina UTI xavfini oshiradi"],
    "togri": 1,
    "izoh": "Spermitisidal moddalar va diafragma vaginal florani o'zgartirib, UPEC kolonizatsiyasiga sharoit yaratadi — UTI xavfini oshiradi. rUTI bo'lsa, ulardan voz kechish tavsiya etiladi."
  },
  {
    "savol": "Asoratlanmagan rUTI uchun sistoskopiya va tasvirlash tekshiruvlari rutina tavsiya etilishi haqida qaysi fikr to'g'ri?",
    "variantlar": ["Barcha rUTI holatlarida istisnosiz doim tavsiya etiladi", "Faqat antibiotik profilaktikasi boshlanishidan oldin zarur", "Rutina tavsiya etilmaydi — faqat xavf omillari bo'lsa ko'rsatiladi", "Har yili muntazam ravishda bir marta tavsiya etib boriladi"],
    "togri": 2,
    "izoh": "Asoratlanmagan rUTI uchun sistoskopiya va tasvirlash tekshiruvlari rutina tavsiya etilmaydi. Faqat gematuriya, tosh shubhasi yoki obstruksiya belgilari bo'lsa ko'rsatiladi."
  },
  {
    "savol": "IC/BPS (interstitial sistit) bakterial sistitdan qanday farq qiladi?",
    "variantlar": ["IC/BPS yuqori isitma va qaltirash bilan kechadigan holat", "IC/BPS infeksiyasiz surunkali qovuq og'rig'i — ekinma manfiy", "IC/BPS faqat erkak jinsi vakillarida uchraydigan holat", "IC/BPS oddiy antibiotik kursi bilan tuzalib ketadigan holat"],
    "togri": 1,
    "izoh": "IC/BPS — infeksiyasiz surunkali qovuq og'rig'i sindromi. Dizuriya va tezlik kabi o'xshash belgilari bo'lsa-da, siydik ekinmasi manfiy, sababi boshqacha — davolash mutlaqo farq qiladi."
  },
  {
    "savol": "ASB (asimptomatik bakteriuriya) qaysi bemorlarda davolash talab qilmaydi?",
    "variantlar": ["Faqat 65 yoshdan katta yoshli ayollarda davolanmaydi", "Homilador ayollarda albatta davolanishi shart bo'lgan holat", "Doimiy kateterli va simptomsiz bemorlarda davolanmaydi", "Faqat erkak jinsli bemorlarda davolash talab etilmaydi"],
    "togri": 2,
    "izoh": "Doimiy kateterli va boshqa ko'pchilik bemorlarda asimptomatik bakteriuriya klinik infeksiya emas — davolash shart emas. Istisno: homilador ayollar va ba'zi urologik aralashuvlardan oldin."
  },
  {
    "savol": "UPEC ning kapsulyar polisaxaridlari (K-antigens) qanday vazifani bajaradi?",
    "variantlar": ["Bakteriyaning uroteliy hujayralariga yopishishini ta'minlaydi", "Fagositozdan (immunitet hujumidan) himoyalash vazifasini bajaradi", "Muhitdan temir ionlarini tortib olish vazifasini bajaradi", "Qo'llanilgan antibiotik molekulalarini parchalab tashlaydi"],
    "togri": 1,
    "izoh": "Kapsulyar polisaxaridlar (K-antigens) UPEC ni neytrofil fagositozidan himoya qilib, qondan klirensi sekinlashtiradi — infeksiyaning davom etishiga yordam beradi."
  },
  {
    "savol": "Qayta uchraydigan UTI xavfi nimaga mutanosib ravishda ortadi?",
    "variantlar": ["Faqat bemorning umumiy yoshiga to'g'ri mutanosib ravishda", "Oldingi infeksiyalar soni bilan to'g'ri mutanosib ravishda", "Faqat qo'llanilgan antibiotik turiga bog'liq ravishda", "Faqat kundalik ovqatlanish tartibiga bog'liq ravishda"],
    "togri": 1,
    "izoh": "Qayta uchraydigan UTI xavfi oldingi infeksiyalar soni bilan to'g'ri mutanosib ravishda ortadi — har bir epizod keyingisining xavfini oshiradi."
  },
  {
    "savol": "CAUTI (catheter-associated UTI) ta'riflanishi uchun nima zarur?",
    "variantlar": ["Faqat isitma va qovuq og'rig'i belgilarining o'zi yetarli bo'ladi", "Kateter mavjudligi + klinik UTI belgilari + musbat ekinma", "Faqat siydik ekinmasining musbat natija berishi kifoya qiladi", "Faqat piyuriya (siydikda leykotsit) mavjudligi kifoya qiladi"],
    "togri": 1,
    "izoh": "CAUTI uchun kateter mavjudligi + klinik UTI belgilari (isitma, siydik shoshilishi va h.k.) + musbat siydik ekinmasi zarur. Faqat bakteriuriya CAUTI emas."
  },
  {
    "savol": "Siydikda bakteriya borligi qachon klinik ahamiyatga ega bo'ladi?",
    "variantlar": ["Siydikda topilgan har qanday miqdordagi bakteriya ahamiyatli", "Piyuriya va klinik belgilar bilan birgalikda bo'lgan taqdirda", "Faqat bittadan ortiq bakteriya turi aniqlangan taqdirdagina", "Faqat siydik rangi va tiniqligi o'zgargan taqdirda ahamiyatli"],
    "togri": 1,
    "izoh": "Siydik haqiqatda steril emas — sog'lom kishilarda ham oz miqdorda bakteriya bo'lishi mumkin. Klinik qaror uchun piyuriya va klinik belgilar majmuasi muhim, nafaqat bakteriya soni."
  },
  {
    "savol": "Sistitning asosiy xulosasiga ko'ra qaysi fikr TO'G'RI?",
    "variantlar": ["Isitma sistitning eng asosiy va tipik klinik belgisidir", "Nitrofurantoin/TMP-SMX birinchi qator; ftorokinolon so'nggi chora", "Barcha sistitli bemorlarga siydik ekinmasi majburiy tekshiruv", "rUTI holatida diagnostik sistoskopiya har doim tavsiya etiladi"],
    "togri": 1,
    "izoh": "Nitrofurantoin va TMP-SMX — birinchi qator vositalar. Ftorokinolonlar kollateral zarar va rezistentlik xavfi tufayli so'nggi chora sifatida saqlanishi kerak."
  }
]$sistit_savollar$::jsonb
WHERE dars_slug = 'sistit-asoslari';
