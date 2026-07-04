UPDATE dars_tarkibi
SET savollar_banki = $tosh_savollar$[
  {
    "savol": "Siydik tosh kasalligi (urolithiasis) zamonaviy tushunchada qanday qaraladi?",
    "variantlar": ["Mahalliy urologik muammo — faqat buyrakka ta'sir qiladi", "Mineral almashinuvi buzilishi — tizimli kasalliklar bilan bog'liq", "Infeksion kasallik — asosan bakteriyalar keltirib chiqaradi", "Ovqatlanish buzilishi — faqat noto'g'ri parhezga bog'liq"],
    "togri": 1,
    "izoh": "Zamonaviy tushunchaga ko'ra tosh kasalligi shunchaki mahalliy urologik muammo emas — mineral almashinuvi buzilishi (disorder of mineral metabolism) sifatida qaraladi va CKD, yurak kasalligi hamda suyak mineral zichligi pasayishi bilan bog'liq."
  },
  {
    "savol": "Tosh kasalligining eng muhim epidemiologik xususiyati nima?",
    "variantlar": ["Yuqori qaytalanish — 3–5 yil ichida ~50% da yangi tosh", "Past qaytalanish — bir marta o'tgach kamdan-kam takrorlanadi", "Faqat erkaklarda uchraydi, ayollar umuman kasallanmaydi", "Faqat bolalik davrida uchraydigan o'tkinchi holat"],
    "togri": 0,
    "izoh": "Tosh kasalligining eng muhim xususiyati — yuqori qaytalanish darajasi. Bolalikda tosh o'tkazgan bemorlarning taxminan 50 foizida 3–5 yil ichida yangi tosh rivojlanadi. Shuning uchun metabolik baholash va profilaktika zarur."
  },
  {
    "savol": "Tosh hosil bo'lishining asosiy sharti nima?",
    "variantlar": ["Buyrak infeksiyasi — bakteriyalar kristallni cho'ktiradi", "Siydik pH keskin o'zgarishi — kislota-ishqor nomutanosibligi", "Siydik to'yinishi — modda konsentratsiyasi eruvchanlikdan oshadi", "Buyrak hajmi kichrayishi — filtratsiya maydoni qisqaradi"],
    "togri": 2,
    "izoh": "Tosh hosil bo'lishining asosiy sharti — siydikning to'yinishi (supersaturation). Siydikda kristall hosil qiluvchi moddalar konsentratsiyasi eruvchanlik chegarasidan oshganda, kristallar cho'kadi va asta-sekin o'sib toshga aylanadi."
  },
  {
    "savol": "Tosh hosil bo'lishining asosiy bosqichlari qaysi tartibda kechadi?",
    "variantlar": ["Kristal o'sishi → to'yinish → yadrolanish → ushlanish", "To'yinish → yadrolanish → kristal o'sishi → ushlanish", "Yadrolanish → to'yinish → ushlanish → kristal o'sishi", "Ushlanish → to'yinish → yadrolanish → kristal o'sishi"],
    "togri": 1,
    "izoh": "Tosh hosil bo'lish bosqichlari: 1) To'yinish (supersaturation); 2) Yadrolanish (nucleation) — birinchi kristal yadro; 3) Kristal o'sishi va agregatsiyasi; 4) Ushlanish (retention) — buyrak to'qimasiga yopishish."
  },
  {
    "savol": "Randall plyakalari nima va qanday ahamiyatga ega?",
    "variantlar": ["Buyrak arteriyasidagi kalsifikatsiya — qon tomir devorida", "Surunkali buyrak infeksiyasining o'ziga xos ko'rsatkichi", "Siydik yo'lida to'planuvchi oqsil-shilimshiq qatlami", "Buyrak so'rg'ichlaridagi gidroksiapatit — tosh poydevori"],
    "togri": 3,
    "izoh": "Randall plyakalari — buyrak so'rg'ichlari (papilla) yuzasidagi gidroksiapatitdan iborat oq to'planmalar. Ko'pchilik idiopatik kalsiy oksalat toshlari shu plyakalar ustida o'sadi — ular toshning birikadigan 'poydevori' hisoblanadi."
  },
  {
    "savol": "Siydikdagi tabiiy inhibitorlar (sitrat va magniy) tosh hosil bo'lishiga qanday ta'sir qiladi?",
    "variantlar": ["Tosh hosil bo'lishini tezlashtiradi — kristallni cho'ktiradi", "Kristal hosil bo'lishini sekinlashtiradi — xavfni kamaytiradi", "Siydik tarkibiga hech qanday sezilarli ta'sir ko'rsatmaydi", "Siydik pH ni oshirib infeksiyaga moyillik yaratadi"],
    "togri": 1,
    "izoh": "Sitrat va magniy — siydikdagi tabiiy inhibitorlar, kristal hosil bo'lishini sekinlashtiradi. Gipositraturiya (sitrat kamayishi) tosh xavfini oshiradi — shuning uchun davolashda kaliy sitrat qo'llaniladi."
  },
  {
    "savol": "Kattalar siydik toshlarining qancha foizini kalsiy oksalat toshlari tashkil etadi?",
    "variantlar": ["20–30%", "40–50%", "60–70%", "75–80%"],
    "togri": 3,
    "izoh": "Kalsiy oksalat — eng keng tarqalgan tosh turi, 75–80% ni tashkil etadi. KTda zich (600–1200 HU); siydik pH ga kam bog'liq. Randall plyakalari ustida o'sadi."
  },
  {
    "savol": "Kalsiy fosfat toshlari qanday siydik muhitida hosil bo'ladi va qaysi kasallik bilan bog'liq?",
    "variantlar": ["Kislotali siydikda past pH da; ko'pincha sistit bilan birga", "Ishqoriy siydikda yuqori pH da; tubular atsidoz (RTA) bilan", "Neytral siydikda; qandli diabet bilan chambarchas bog'liq", "Past pH da; siydik yo'li infeksiyasi natijasida hosil bo'ladi"],
    "togri": 1,
    "izoh": "Kalsiy fosfat toshlari ishqoriy siydikda (yuqori pH) hosil bo'ladi va buyrak tubulalari atsidozi (RTA) bilan bog'liq bo'lishi mumkin. Barcha toshlarning taxminan 5% ini tashkil etadi."
  },
  {
    "savol": "Struvit toshlari nima va ular qanday sababdan hosil bo'ladi?",
    "variantlar": ["Kalsiy oksalat toshi — ortiqcha oksalat iste'moli natijasi", "Magniy-ammoniy-fosfat — ureaza ishlab chiqaruvchi bakteriya", "Siydik kislotasi toshi — podagra kasalligida hosil bo'ladi", "Sistin toshi — nasliy amino kislota transporti buzilishida"],
    "togri": 1,
    "izoh": "Struvit (magniy-ammoniy-fosfat) toshlari ureaza ishlab chiqaruvchi bakteriyalar (Proteus va boshqalar) infeksiyasida hosil bo'ladi. Tez o'sadi, 'shox tosh' (staghorn calculus) hosil qiladi — 10–20% ni tashkil etadi."
  },
  {
    "savol": "Shox tosh (staghorn calculus) ko'pincha qaysi tosh turi bilan bog'liq va qanday xavf tug'diradi?",
    "variantlar": ["Kalsiy oksalat bilan; jiddiy asorat bermaydigan past xavf", "Struvit bilan; buyrak funksiyasi yo'qolishi va sepsis xavfi", "Siydik kislotasi bilan; asosan metabolik asoratlar xavfi", "Sistin bilan; faqat nasliy o'tuvchi cheklangan xavf"],
    "togri": 1,
    "izoh": "Shox tosh ko'pincha struvit toshlari bilan bog'liq — buyrak jomini to'ldiradigan katta shoxsimon tosh. Buyrak funksiyasini yo'qotish va sepsis xavfi tug'diradi, faol davolashni talab qiladi."
  },
  {
    "savol": "Siydik kislotasi (urat) toshlari KTda qanday ko'rinadi va qaysi pH da hosil bo'ladi?",
    "variantlar": ["KTda radiodense (rentgen siquvchi); ishqoriy siydikda hosil", "KTda umuman ko'rinmaydi; neytral pH li siydikda hosil bo'ladi", "KTda radiolusent (200–400 HU); kislotali past pH siydikda", "KTda 600–1200 HU zich; kislotali past pH li siydikda hosil"],
    "togri": 2,
    "izoh": "Siydik kislotasi toshlari KTda rentgen o'tkazuvchi (radiolusent) bo'lib, 200–400 HU zichlikka ega. Kislotali siydikda (past pH) hosil bo'ladi. KUB rentgenida ko'rinmaydi, ammo KTda aniqlanadi."
  },
  {
    "savol": "Sistin toshlari (cystine stones) kim va qachon rivojlanadi?",
    "variantlar": ["Katta yoshlilarda; ko'p go'sht va oqsil iste'mol qilganda", "Sistinuriyada (nasliy); yoshlarda, ko'pincha shox tosh holida", "Infeksiya oqibatida; istalgan yoshda va jinsda uchraydi", "Podagra fonida; asosan 40 yoshdan oshgan bemorlarda"],
    "togri": 1,
    "izoh": "Sistin toshlari — sistinuriya (nasliy amino kislota transport buzilishi) da hosil bo'ladi. Barcha toshlarning <2% ni tashkil etadi. Ko'pincha yoshlarda uchraydi va shox tosh shaklida namoyon bo'lishi mumkin."
  },
  {
    "savol": "Tosh bemorlarining qancha foizida giperkaltsiuriya aniqlanadi?",
    "variantlar": ["5–10%", "15–20%", "30–50%", "60–70%"],
    "togri": 2,
    "izoh": "Giperkaltsiuriya (siydikda kalsiy ko'payishi) — eng keng tarqalgan metabolik buzilish, tosh bemorlarining 30–50% da aniqlanadi. Kalsiy oksalat va fosfat toshlariga olib keladi."
  },
  {
    "savol": "Tosh kasalligining nasliy moyilligini egizaklar tadqiqoti qanday ko'rsatgan?",
    "variantlar": ["Nasliy omilning ahamiyati deyarli yo'q darajada past", "Ayollarda 46%, erkaklarda 56–57% nasliy moyillik aniqlangan", "Nasliy omil faqat erkaklarda, ayollarda umuman ta'sirsiz", "Tosh kasalligi to'liq (100%) nasliy omillar bilan belgilanadi"],
    "togri": 1,
    "izoh": "Egizaklar tadqiqotida tosh kasalligining nasliy moyilligi: ayollarda 46%, erkaklarda 56–57%. Gen omillari muhim rol o'ynaydi, ammo atrof-muhit omillari ham katta ta'sir ko'rsatadi."
  },
  {
    "savol": "G'arb parhezida tosh kasalligi uchun eng muhim ikki oziq-ovqat xavf omili qaysilar?",
    "variantlar": ["Ko'p C vitamini va ortiqcha kalsiy iste'mol qilish odati", "Ko'p oksalatli ovqat va kam oqsilli parhezga rioya qilish", "Kam siydik kislotasi va ortiqcha magniy iste'mol qilish", "Kam suyuqlik ichish va ortiqcha tuz (natriy) iste'moli"],
    "togri": 3,
    "izoh": "Kam suyuqlik ichish va ko'p tuz iste'moli — g'arb parhezining tosh kasalligi uchun eng muhim ikki oziq-ovqat xavf omili. Kam suyuqlik siydikni konsentratsiyalaydi, ko'p tuz esa kalsiy ekskresiyasini oshiradi."
  },
  {
    "savol": "Buyrak sanchig'i (renal colic) qanday og'riq bilan tavsiflanadi?",
    "variantlar": ["Doimiy, o'tmas og'riq — vaqt o'tishi bilan o'zgarmaydi", "Kolikasimon, to'lqinsimon og'riq; bemor tinch turolmaydi", "Faqat siydik chiqarish paytida seziladigan achishuvli og'riq", "Nafas olganda kuchayadigan, ko'krakka uzatiluvchi og'riq"],
    "togri": 1,
    "izoh": "Buyrak sanchig'i — kolikasimon og'riq: to'lqinsimon, kuchayib-susayib turadigan. Bemor tinch turolmay qulay holat izlaydi. Buyrak jomi va siydik yo'lining to'lib-toshib cho'zilishi natijasida yuzaga keladi."
  },
  {
    "savol": "Buyrak sanchig'ida og'riq qayerdan boshlanib, qayerga tarqaladi?",
    "variantlar": ["Qorin o'rtasidan boshlab yuqoriga, ko'krak sohaga tarqaladi", "Bel-qovurg'a burchagidan qov, moyak yoki labiyaga tarqaladi", "Faqat bel sohasida qoladi, boshqa joyga umuman tarqalmaydi", "Ko'krak qafasidan boshlab qorinning pastki qismiga tushadi"],
    "togri": 1,
    "izoh": "Og'riq joylashuvi va tarqalishi: bel-qovurg'a burchagidan boshlanib, tosh pastga tushgani sari qov, moyak (erkakda) yoki labiyaga (ayolda) tarqaladi — bu tarqalish toshning siydik yo'lidagi joylashuvini ko'rsatadi."
  },
  {
    "savol": "Tosh kasalligida gematuriya qanday bo'ladi va og'riqsiz gematuriya nimani anglatadi?",
    "variantlar": ["Har doim og'riqsiz kechadi — bu toshning tipik belgisi", "Gematuriya tosh kasalligida umuman kuzatilmaydigan holat", "Ko'pincha og'riq bilan; og'riqsiz bo'lsa saraton tekshiriladi", "Faqat tosh juda katta bo'lgandagina qonli siydik paydo bo'ladi"],
    "togri": 2,
    "izoh": "Gematuriya tosh kasalligida ko'pincha og'riq bilan birga kuzatiladi. Og'riqsiz gematuriya toshga xos emas — boshqa sabablar (ayniqsa urologik saraton) tekshirilishi kerak."
  },
  {
    "savol": "Tosh siydik yo'lining pastki qismiga yaqinlashganda qanday qo'shimcha belgilar paydo bo'ladi?",
    "variantlar": ["Isitma va qaltirash — tananing infeksiyaga umumiy javobi", "Dizuriya va siydik tezligi — sistitni taqlid qiluvchi belgilar", "Ko'krak qafasida og'riq va nafas qisilishi kabi belgilar", "Ko'rish xiralashuvi va bosh aylanishi kabi nevrologik belgilar"],
    "togri": 1,
    "izoh": "Tosh siydik yo'lining distal (pastki) qismiga yaqinlashganda — dizuriya va siydik tezligi paydo bo'ladi. Bu belgilar sistitni taqlid qilishi mumkin."
  },
  {
    "savol": "Isitmali to'silgan tosh klinik jihatdan qanday baholanadi?",
    "variantlar": ["Oddiy tosh kasalligidek ambulator tarzda davolab boriladi", "Shoshilinch holat — dekompressiya antibiotikdan muhimroq qadam", "Faqat antibiotik bilan, aralashuvsiz davolash yetarli bo'ladi", "Aktiv davo shart emas, kuzatib turish bilan cheklaniladi"],
    "togri": 1,
    "izoh": "Isitmali to'silgan tosh (obstructed infected stone / urosepsis) — shoshilinch urologik holat. Ureteral stent yoki perkutan nefrostomiya bilan zudlik bilan dekompressiya qilish — antibiotikdan muhimroq birinchi qadam."
  },
  {
    "savol": "Kontrastsiz KT (NCCT) tosh diagnostikasida qanday sezuvchanlik va aniqlikka ega?",
    "variantlar": ["Sezuvchanlik 70%, aniqlik 75%", "Sezuvchanlik 80–85%, aniqlik 85–90%", "Sezuvchanlik 94–95%, aniqlik 95–98%", "Sezuvchanlik 99–100%, aniqlik 100%"],
    "togri": 2,
    "izoh": "Kontrastsiz KT (NCCT) — kattalar uchun tosh diagnostikasining 'oltin standarti' (AUA). Sezuvchanlik 94–95%, aniqlik 95–98%. Deyarli barcha tosh turlarini aniqlaydi (indinavir toshlaridan tashqari)."
  },
  {
    "savol": "Qaysi tosh turi kontrastsiz KTda aniqlanmaydi?",
    "variantlar": ["Kalsiy oksalat toshlari (zich, 600–1200 HU)", "Struvit toshlari (infeksion, shox tosh)", "Indinavir toshlari (HIV proteaza inhibitori)", "Sistin toshlari (nasliy sistinuriya)"],
    "togri": 2,
    "izoh": "Indinavir toshlari (HIV davo dorisi — proteaza inhibitori) kontrastsiz KTda aniqlanmaydi — shuning uchun bu istisnoni bilish muhim. Boshqa barcha tosh turlari KTda ko'rinadi."
  },
  {
    "savol": "Bolalar va homilador ayollarda tosh diagnostikasida birinchi tanlash usuli qaysi va nima uchun?",
    "variantlar": ["Kontrastsiz KT — eng yuqori aniqlik bergani uchun afzal", "Ultratovush — nurlanishsiz, yosh bemorlar uchun xavfsiz", "KUB rentgen — arzon va tez natija bergani uchun qulay", "DECT — tosh tarkibini aniq farqlash imkonini bergani uchun"],
    "togri": 1,
    "izoh": "EAU bolalar va homiladorlarda birinchi navbatda ultratovushni tavsiya etadi — nurlanishsiz usul. KT nurlanishi (10–20 mSv) yosh bemorlarda jiddiy masala. KT faqat ultratovush aniq natija bermaganda qo'llaniladi."
  },
  {
    "savol": "Ultratovushda toshni aniqlashda qanday belgilar ishlatiladi?",
    "variantlar": ["Doppler oqim effekti va toshning faol harakatlanishi", "'Twinkle' artefakt va toshning orqasidagi akustik soya", "Kontrast moddaning tosh atrofida to'planib qolishi", "Buyrak hajmining kattalashishi va shaklining o'zgarishi"],
    "togri": 1,
    "izoh": "Ultratovushda 'twinkle artefakt' (rang Doppler) va akustik soya toshni aniqlaydi. Sezuvchanligi KTga qaraganda pastroq, ammo nurlanishsiz va xavfsiz."
  },
  {
    "savol": "KUB rentgenida qaysi tosh turi ko'rinmaydi?",
    "variantlar": ["Kalsiy oksalat toshlari (radiopak)", "Struvit toshlari (qisman ko'rinadi)", "Siydik kislotasi toshlari (radiolusent)", "Kalsiy fosfat toshlari (radiopak)"],
    "togri": 2,
    "izoh": "Siydik kislotasi (urat) toshlari KUB rentgenida ko'rinmaydi (radiolusent) — rentgen nurlarini o'tkazib yuboradi. Kalsiyli toshlar ko'rinadi. KUB davolash kuzatuvida foydali."
  },
  {
    "savol": "DECT (ikki energiyali KT) ning tosh diagnostikasidagi asosiy ustunligi nima?",
    "variantlar": ["KTga nisbatan sezilarli darajada kam nurlanish beradi", "Kontrast modda ishlatmasdan qo'llash mumkin bo'lgan usul", "Tosh tarkibini (urat/urat emas) ~99% aniqlik bilan farqlaydi", "Bolalar va homiladorlarda birinchi tanlanadigan xavfsiz usul"],
    "togri": 2,
    "izoh": "DECT — tosh tarkibini, ayniqsa urat va urat bo'lmagan toshlarni ~99% aniqlik bilan farqlaydi. Bu davolash taktikasini belgilashda (masalan, siydik kislotasi toshini eritish imkoniyati) muhim."
  },
  {
    "savol": "24 soatlik siydik tahlili tosh diagnostikasida nima uchun o'tkaziladi?",
    "variantlar": ["Tosh o'lchami va joylashuvini aniq belgilash maqsadida", "Metabolik baholash — kalsiy, oksalat, sitrat, urat, hajm, pH", "Siydik yo'lidagi infeksiya va qo'zg'atuvchini aniqlash uchun", "Antibiotiklarga sezuvchanlikni belgilab davo tanlash uchun"],
    "togri": 1,
    "izoh": "24 soatlik siydik tahlili metabolik baholash uchun o'tkaziladi: kalsiy, oksalat, sitrat, siydik kislotasi, hajm va pH. Bu tosh hosil bo'lishiga olib keluvchi aniq buzilishni aniqlash va profilaktik davolash uchun zarur."
  },
  {
    "savol": "O'tkir buyrak sanchig'ida og'riqni yengishda birinchi tanlash dori qaysi?",
    "variantlar": ["Opioidlar (og'riq qoldiruvchi narkotik)", "NSAIDlar (masalan, diklofenak)", "Paratsetamol (oddiy analgetik)", "Kortikosteroidlar (yallig'lanishga qarshi)"],
    "togri": 1,
    "izoh": "NSAIDlar (masalan, diklofenak) buyrak sanchig'ida og'riqni yengishda birinchi tanlash — prostaglandin yo'li orqali ta'sir qilib, siydik yo'li spazmi va og'riqni kamaytiradi. Ba'zan opioidlar ham qo'shiladi."
  },
  {
    "savol": "Medikal ekspulsiv terapiya (MET) nima va qanday ishlaydi?",
    "variantlar": ["Toshni to'g'ridan-to'g'ri eritib yuboruvchi dori kursi", "Infeksiyani yo'qotish uchun beriladigan antibiotik kursi", "α-bloker (tamsulozin) — distal tosh chiqishini yengillashtiradi", "KT oldidan tomirga kontrast modda yuborish muolajasi"],
    "togri": 2,
    "izoh": "MET (Medical Expulsive Therapy) — α-blokerlar (tamsulozin) distal siydik yo'li toshining chiqishiga yordam berishi mumkin. Kichik toshlar (<5–6 mm) ko'pincha o'z-o'zidan chiqadi va MET bu jarayonni tezlashtiradi."
  },
  {
    "savol": "Tosh profilaktikasida necha litr siydik hajmiga erishish tavsiya etiladi?",
    "variantlar": ["Kuniga 0.5–1 L", "Kuniga 1–1.5 L", "Kuniga 2–2.5 L", "Kuniga 4–5 L"],
    "togri": 2,
    "izoh": "Profilaktikada kuniga kamida 2–2.5 L siydik hajmiga erishish tavsiya etiladi — bu siydikni suyultiradi va kristal konsentratsiyasini kamaytiradi. Eng muhim va arzon profilaktik chora."
  },
  {
    "savol": "Kaliy sitrat tosh profilaktikasida qanday ishlaydi?",
    "variantlar": ["Siydikni kislotalashtirib kristal cho'kishini kuchaytiradi", "Siydikka kalsiy ekskresiyasini oshirib toshni ko'paytiradi", "Sitratni oshiradi va siydikni ishqorlab urat toshini eritadi", "Buyrak filtratsiyasini yaxshilab funksiyani to'liq tiklaydi"],
    "togri": 2,
    "izoh": "Kaliy sitrat gipositraturiya va siydik kislotasi toshlarida qo'llaniladi: sitrat darajasini oshirib kristal hosil bo'lishini tormozlaydi; siydikni ishqorlashtirib urat toshlarini eritadi."
  },
  {
    "savol": "Tiazid diuretiklar tosh profilaktikasida qachon qo'llaniladi?",
    "variantlar": ["Gipositraturiyada (sitrat kamayishi)", "Giperkaltsiuriyada (kalsiy ko'payishi)", "Giperurikozuriyada (urat ko'payishi)", "Struvit (infeksion) toshlarida"],
    "togri": 1,
    "izoh": "Tiazid diuretiklar giperkaltsiuriyada (siydikda kalsiy ko'payishi) qo'llaniladi — buyrak tubulalarida kalsiy reabsorbsiyasini oshirib, siydikka kalsiy ekskresiyasini kamaytiradi."
  },
  {
    "savol": "Kalsiy toshli bemorlarda ovqatdagi kalsiyni keskin cheklash nima uchun tavsiya etilmaydi?",
    "variantlar": ["Kalsiy suyak salomatligi uchun juda zarur bo'lgani uchun", "Ichakda oksalat so'rilishini oshirib tosh xavfini kuchaytiradi", "Kalsiy immun tizim faoliyati uchun zarur element bo'lgani uchun", "Kalsiy buyrak filtratsiya funksiyasini yaxshilagani uchun"],
    "togri": 1,
    "izoh": "Kalsiy toshli bemorlarda ovqatdagi kalsiyni keskin cheklash tavsiya etilmaydi — paradoksal ravishda ichakda oksalat so'rilishini oshirib tosh xavfini kuchaytiradi. To'g'ri yondashuv: normal kalsiy, ammo natriy va oksalatni kamaytirish."
  },
  {
    "savol": "C vitamini qo'shimchalari kalsiy oksalat toshli bemorlarda nima uchun to'xtatilishi kerak?",
    "variantlar": ["C vitamini organizm immunitetini sezilarli pasaytiradi", "C vitamini siydik pH ni oshirib muhitni ishqorlashtiradi", "C vitamini oksalatga aylanib giperoksaluriyani kuchaytiradi", "C vitamini qondagi kaliy darajasini xavfli darajada tushiradi"],
    "togri": 2,
    "izoh": "C vitamini (askorbin kislota) oksalatga metabolizllanadi — ko'p iste'mol qilish giperoksaluriyani kuchaytiradi va kalsiy oksalat tosh xavfini oshiradi. Shuning uchun qo'shimchalar to'xtatilishi kerak."
  },
  {
    "savol": "Tosh kasalligida siydik tarkibini baholash uchun qaysi asosiy metabolik tekshiruvlar tavsiya etiladi?",
    "variantlar": ["Faqat siydik ekinmasi — infeksiyani aniqlash uchun yetarli", "24 soatlik siydik va qon tahlili (kreatinin, kalsiy, urat)", "Faqat oddiy umumiy siydik tahlili bilan cheklanish mumkin", "Faqat KT tekshiruvi — tosh o'lchami va zichligini aniqlash"],
    "togri": 1,
    "izoh": "Metabolik baholash: 24 soatlik siydik tahlili — kalsiy, oksalat, sitrat, siydik kislotasi, hajm, pH; qon tahlili — kreatinin (buyrak funksiyasi), kalsiy, siydik kislotasi. Bu tosh profilaktikasi rejasini belgilaydi."
  },
  {
    "savol": "Tosh kasalligining xulosa bo'yicha qaysi fikr TO'G'RI?",
    "variantlar": ["Kalsiy toshli bemorga ovqat kalsiyini keskin cheklash kerak", "Isitmali to'silgan toshda antibiotik eng birinchi qadam bo'ladi", "Kontrastsiz KT — kattalarda standart; bolalarda ultratovush", "Siydik kislotasi toshlari KUB rentgenida aniq ko'rinib turadi"],
    "togri": 2,
    "izoh": "Kontrastsiz KT — kattalar uchun oltin standart (94–95% sezuvchanlik); bolalar va homiladorlarda nurlanish sababli ultratovush afzal. Kalsiy cheklanmaydi; isitmali to'siqda dekompressiya birinchi; urat KUBda ko'rinmaydi."
  }
]$tosh_savollar$::jsonb
WHERE dars_slug = 'siydik-tosh-kasalligi-asoslari';
