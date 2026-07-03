UPDATE dars_tarkibi
SET savollar_banki = $tosh_savollar$[
  {
    "savol": "Siydik tosh kasalligi (urolithiasis) zamonaviy tushunchada qanday qaraladi?",
    "variantlar": ["Faqat mahalliy urologik muammo", "Mineral almashinuvi buzilishi — CKD, yurak kasalligi va suyak mineral zichligi pasayishi bilan bog'liq", "Faqat infeksion kasallik", "Faqat ovqatlanish buzilishi"],
    "togri": 1,
    "izoh": "Zamonaviy tushunchaga ko'ra tosh kasalligi shunchaki mahalliy urologik muammo emas — mineral almashinuvi buzilishi (disorder of mineral metabolism) sifatida qaraladi va CKD, yurak kasalligi hamda suyak mineral zichligi pasayishi bilan bog'liq."
  },
  {
    "savol": "Tosh kasalligining eng muhim epidemiologik xususiyati nima?",
    "variantlar": ["Past qaytalanish darajasi", "Faqat erkaklar kasallanadi", "Yuqori qaytalanish darajasi — 3–5 yil ichida ~50% da yangi tosh", "Faqat bolalarda uchraydi"],
    "togri": 2,
    "izoh": "Tosh kasalligining eng muhim xususiyati — yuqori qaytalanish darajasi. Bolalikda tosh o'tkazgan bemorlarning taxminan 50 foizida 3–5 yil ichida yangi tosh rivojlanadi. Shuning uchun metabolik baholash va profilaktika zarur."
  },
  {
    "savol": "Tosh hosil bo'lishining asosiy sharti nima?",
    "variantlar": ["Buyrak infeksiyasi", "Siydikning to'yinishi (supersaturation) — modda konsentratsiyasi eruvchanlik chegarasidan oshishi", "Siydik pH ning o'zgarishi", "Buyrak hajmining kichrayishi"],
    "togri": 1,
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
    "variantlar": ["Buyrak arteriyasida kalsifikatsiya", "Buyrak so'rg'ichlarida gidroksiapatitdan iborat to'planmalar — kalsiy oksalat toshining o'sish poydevori", "Surunkali buyrak infeksiyasi belgisi", "Siydik yo'lida to'planuvchi shilimshiq"],
    "togri": 1,
    "izoh": "Randall plyakalari — buyrak so'rg'ichlari (papilla) yuzasidagi gidroksiapatitdan iborat oq to'planmalar. Ko'pchilik idiopatik kalsiy oksalat toshlari shu plyakalar ustida o'sadi — ular toshning birikadigan 'poydevori' hisoblanadi."
  },
  {
    "savol": "Siydikdagi tabiiy inhibitorlar (sitrat va magniy) tosh hosil bo'lishiga qanday ta'sir qiladi?",
    "variantlar": ["Tosh hosil bo'lishini tezlashtiradi", "Kristal hosil bo'lishini sekinlashtiradi — tosh xavfini kamaytiradi", "Hech qanday ta'siri yo'q", "Siydik pH ni o'zgartiradi"],
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
    "variantlar": ["Kislotali siydikda (past pH); sistitla bilan bog'liq", "Ishqoriy siydikda (yuqori pH); buyrak tubulalari atsidozi (RTA) bilan bog'liq bo'lishi mumkin", "Neytral siydikda; DM bilan bog'liq", "Past pH; tub infeksiyasi bilan bog'liq"],
    "togri": 1,
    "izoh": "Kalsiy fosfat toshlari ishqoriy siydikda (yuqori pH) hosil bo'ladi va buyrak tubulalari atsidozi (RTA) bilan bog'liq bo'lishi mumkin. Barcha toshlarning taxminan 5% ini tashkil etadi."
  },
  {
    "savol": "Struvit toshlari nima va ular qanday sababdan hosil bo'ladi?",
    "variantlar": ["Kalsiy oksalat toshlari — oziq-ovqat sababli", "Magniy-ammoniy-fosfat toshlari — ureaza ishlab chiqaruvchi bakteriyalar (Proteus) infeksiyasida", "Siydik kislotasi toshlari — gout kasalligida", "Sistin toshlari — nasliy kasallikda"],
    "togri": 1,
    "izoh": "Struvit (magniy-ammoniy-fosfat) toshlari ureaza ishlab chiqaruvchi bakteriyalar (Proteus va boshqalar) infeksiyasida hosil bo'ladi. Tez o'sadi, 'shox tosh' (staghorn calculus) hosil qiladi — 10–20% ni tashkil etadi."
  },
  {
    "savol": "Shox tosh (staghorn calculus) ko'pincha qaysi tosh turi bilan bog'liq va qanday xavf tug'diradi?",
    "variantlar": ["Kalsiy oksalat; past xavf", "Struvit; buyrak funksiyasini yo'qotish va sepsis xavfi", "Siydik kislotasi; metabolik xavf", "Sistin; faqat nasliy xavf"],
    "togri": 1,
    "izoh": "Shox tosh ko'pincha struvit toshlari bilan bog'liq — buyrak jomini to'ldiradigan katta shoxsimon tosh. Buyrak funksiyasini yo'qotish va sepsis xavfi tug'diradi, faol davolashni talab qiladi."
  },
  {
    "savol": "Siydik kislotasi (urat) toshlari KTda qanday ko'rinadi va qaysi pH da hosil bo'ladi?",
    "variantlar": ["KTda rentgen o'tkazuvchi (radiolusent), 200–400 HU; kislotali siydikda (past pH)", "KTda rentgen siquvchi (radiodense); ishqoriy siydikda", "KTda ko'rinmaydi; neytral siydikda", "KTda 600–1200 HU; past pH da"],
    "togri": 0,
    "izoh": "Siydik kislotasi toshlari KTda rentgen o'tkazuvchi (radiolusent) bo'lib, 200–400 HU zichlikka ega. Kislotali siydikda (past pH) hosil bo'ladi. KUB rentgenida ko'rinmaydi, ammo KTda aniqlanadi."
  },
  {
    "savol": "Sistin toshlari (cystine stones) kim va qachon rivojlanadi?",
    "variantlar": ["Katta yoshlilarda; ko'p go'sht iste'mol qilganda", "Sistinuriya (nasliy kasallik)da; ko'pincha yoshlarda, shox tosh shaklida", "Infeksiya sababli; har qanday yoshda", "Gout kasalligida; 40 yoshdan keyin"],
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
    "variantlar": ["Nasliy omil ahamiyatsiz", "Ayollarda 46%, erkaklarda 56–57%", "Faqat erkaklarda nasliy omil muhim", "100% nasliy belgilanadi"],
    "togri": 1,
    "izoh": "Egizaklar tadqiqotida tosh kasalligining nasliy moyilligi: ayollarda 46%, erkaklarda 56–57%. Gen omillari muhim rol o'ynaydi, ammo atrof-muhit omillari ham katta ta'sir ko'rsatadi."
  },
  {
    "savol": "G'arb parhezida tosh kasalligi uchun eng muhim ikki oziq-ovqat xavf omili qaysilar?",
    "variantlar": ["Ko'p C vitamini va ko'p kalsiy", "Kam suyuqlik ichish va ko'p tuz (natriy) iste'moli", "Ko'p oksalat va kam oqsil", "Kam siydik kislotasi va ko'p magniy"],
    "togri": 1,
    "izoh": "Kam suyuqlik ichish va ko'p tuz iste'moli — g'arb parhezining tosh kasalligi uchun eng muhim ikki oziq-ovqat xavf omili. Kam suyuqlik siydikni konsentratsiyalaydi, ko'p tuz esa kalsiy ekskresiyasini oshiradi."
  },
  {
    "savol": "Buyrak sanchig'i (renal colic) qanday og'riq bilan tavsiflanadi?",
    "variantlar": ["Doimiy, o'tmas og'riq", "Kolikasimon — to'lqinsimon, kuchayib-susayib turadigan; bemor tinch turolmaydi", "Faqat siydik chiqarishda og'riq", "Nafas olishda kuchayadigan og'riq"],
    "togri": 1,
    "izoh": "Buyrak sanchig'i — kolikasimon og'riq: to'lqinsimon, kuchayib-susayib turadigan. Bemor tinch turolmay qulay holat izlaydi. Buyrak jomi va siydik yo'lining to'lib-toshib cho'zilishi natijasida yuzaga keladi."
  },
  {
    "savol": "Buyrak sanchig'ida og'riq qayerdan boshlanib, qayerga tarqaladi?",
    "variantlar": ["Qorin o'rtasidan boshlab, bel sohaga tarqaladi", "Bel-qovurg'a burchagidan boshlanib, tosh pastga tushgani sari qov, moyak yoki labiyaga tarqaladi", "Faqat bel sohasida qoladi", "Ko'krak sohadan qorin pastiga tarqaladi"],
    "togri": 1,
    "izoh": "Og'riq joylashuvi va tarqalishi: bel-qovurg'a burchagidan boshlanib, tosh pastga tushgani sari qov, moyak (erkakda) yoki labiyaga (ayolda) tarqaladi — bu tarqalish toshning siydik yo'lidagi joylashuvini ko'rsatadi."
  },
  {
    "savol": "Tosh kasalligida gematuriya qanday bo'ladi va og'riqsiz gematuriya nimani anglatadi?",
    "variantlar": ["Har doim og'riqsiz gematuriya bo'ladi", "Ko'pincha og'riq bilan birga keladi; og'riqsiz gematuriya toshga xos emas — urologik saraton ehtimolini tekshirish kerak", "Gematuriya hech qachon bo'lmaydi", "Gematuriya faqat tosh juda katta bo'lganda bo'ladi"],
    "togri": 1,
    "izoh": "Gematuriya tosh kasalligida ko'pincha og'riq bilan birga kuzatiladi. Og'riqsiz gematuriya toshga xos emas — boshqa sabablar (ayniqsa urologik saraton) tekshirilishi kerak."
  },
  {
    "savol": "Tosh siydik yo'lining pastki qismiga yaqinlashganda qanday qo'shimcha belgilar paydo bo'ladi?",
    "variantlar": ["Isitma va qaltirash", "Dizuriya va siydik tezligi", "Ko'krak og'rig'i", "Ko'rish buzilishi"],
    "togri": 1,
    "izoh": "Tosh siydik yo'lining distal (pastki) qismiga yaqinlashganda — dizuriya va siydik tezligi paydo bo'ladi. Bu belgilar sistitni taqlid qilishi mumkin."
  },
  {
    "savol": "Isitmali to'silgan tosh klinik jihatdan qanday baholanadi?",
    "variantlar": ["Oddiy tosh kasalligi kabi davolanadi", "Shoshilinch urologik holat — siydik yo'lini zudlik bilan dekompressiya qilish antibiotikdan muhimroq", "Faqat antibiotik bilan davolanadi", "Ko'zatib turish yetarli"],
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
    "variantlar": ["Kalsiy oksalat toshlari", "Struvit toshlari", "Indinavir (HIV dorisi) toshlari", "Sistin toshlari"],
    "togri": 2,
    "izoh": "Indinavir toshlari (HIV davo dorisi — proteaza inhibitori) kontrastsiz KTda aniqlanmaydi — shuning uchun bu istisnoni bilish muhim. Boshqa barcha tosh turlari KTda ko'rinadi."
  },
  {
    "savol": "Bolalar va homilador ayollarda tosh diagnostikasida birinchi tanlash usuli qaysi va nima uchun?",
    "variantlar": ["Kontrastsiz KT — yuqori aniqlik uchun", "Ultratovush — nurlanishsiz, bolalar va homiladorlar uchun xavfsiz", "KUB rentgen — tez va arzon", "DECT — tosh tarkibini aniqlash uchun"],
    "togri": 1,
    "izoh": "EAU bolalar va homiladorlarda birinchi navbatda ultratovushni tavsiya etadi — nurlanishsiz usul. KT nurlanishi (10–20 mSv) yosh bemorlarda jiddiy masala. KT faqat ultratovush aniq natija bermaganda qo'llaniladi."
  },
  {
    "savol": "Ultratovushda toshni aniqlashda qanday belgilar ishlatiladi?",
    "variantlar": ["Doppler effekt va harakatlanish", "'Twinkle artefakt' va akustik soya", "Kontrast to'planishi", "Buyrak hajmi o'zgarishi"],
    "togri": 1,
    "izoh": "Ultratovushda 'twinkle artefakt' (rang Doppler) va akustik soya toshni aniqlaydi. Sezuvchanligi KTga qaraganda pastroq, ammo nurlanishsiz va xavfsiz."
  },
  {
    "savol": "KUB rentgenida qaysi tosh turi ko'rinmaydi?",
    "variantlar": ["Kalsiy oksalat toshlari", "Struvit toshlari", "Siydik kislotasi (urat) toshlari", "Sistin toshlari"],
    "togri": 2,
    "izoh": "Siydik kislotasi (urat) toshlari KUB rentgenida ko'rinmaydi (radiolusent) — rentgen nurlarini o'tkazib yuboradi. Kalsiyli toshlar ko'rinadi. KUB davolash kuzatuvida foydali."
  },
  {
    "savol": "DECT (ikki energiyali KT) ning tosh diagnostikasidagi asosiy ustunligi nima?",
    "variantlar": ["KTdan kamroq nurlanish beradi", "Tosh tarkibini (urat va urat bo'lmagan) ~99% aniqlik bilan farqlaydi", "Kontrastsiz qo'llaniladi", "Bolalarda birinchi tanlash"],
    "togri": 1,
    "izoh": "DECT — tosh tarkibini, ayniqsa urat va urat bo'lmagan toshlarni ~99% aniqlik bilan farqlaydi. Bu davolash taktikasini belgilashda (masalan, siydik kislotasi toshini eritish imkoniyati) muhim."
  },
  {
    "savol": "24 soatlik siydik tahlili tosh diagnostikasida nima uchun o'tkaziladi?",
    "variantlar": ["Tosh o'lchamini aniqlash uchun", "Metabolik baholash uchun — kalsiy, oksalat, sitrat, siydik kislotasi, hajm va pH", "Infeksiya aniqlash uchun", "Antibiotik sezuvchanligini aniqlash uchun"],
    "togri": 1,
    "izoh": "24 soatlik siydik tahlili metabolik baholash uchun o'tkaziladi: kalsiy, oksalat, sitrat, siydik kislotasi, hajm va pH. Bu tosh hosil bo'lishiga olib keluvchi aniq buzilishni aniqlash va profilaktik davolash uchun zarur."
  },
  {
    "savol": "O'tkir buyrak sanchig'ida og'riqni yengishda birinchi tanlash dori qaysi?",
    "variantlar": ["Opioidlar", "NSAIDlar (masalan, diklofenak)", "Paratsetamol", "Kortikosteroidlar"],
    "togri": 1,
    "izoh": "NSAIDlar (masalan, diklofenak) buyrak sanchig'ida og'riqni yengishda birinchi tanlash — prostaglandin yo'li orqali ta'sir qilib, siydik yo'li spazmi va og'riqni kamaytiradi. Ba'zan opioidlar ham qo'shiladi."
  },
  {
    "savol": "Medikal ekspulsiv terapiya (MET) nima va qanday ishlaydi?",
    "variantlar": ["Toshni erituvchi dori kursi", "α-blokerlar (tamsulozin) distal siydik yo'li toshining o'z-o'zidan chiqishiga yordam beruvchi davolash", "Antibiotik kursi — infeksiyani davolash uchun", "KT oldidan kontrast moddasi berish"],
    "togri": 1,
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
    "variantlar": ["Siydikni kislotalashtiradi", "Gipositraturiya va urat toshlarida — siydikdagi sitrat darajasini oshiradi va siydikni ishqorlashtiradi", "Kalsiy ekskresiyasini oshiradi", "Buyrak funksiyasini yaxshilaydi"],
    "togri": 1,
    "izoh": "Kaliy sitrat gipositraturiya va siydik kislotasi toshlarida qo'llaniladi: sitrat darajasini oshirib kristal hosil bo'lishini tormozlaydi; siydikni ishqorlashtirib urat toshlarini eritadi."
  },
  {
    "savol": "Tiazid diuretiklar tosh profilaktikasida qachon qo'llaniladi?",
    "variantlar": ["Gipositraturiyada", "Giperkaltsiuriyada", "Giperurikozuriyada", "Struvit toshlarida"],
    "togri": 1,
    "izoh": "Tiazid diuretiklar giperkaltsiuriyada (siydikda kalsiy ko'payishi) qo'llaniladi — buyrak tubulalarida kalsiy reabsorbsiyasini oshirib, siydikka kalsiy ekskresiyasini kamaytiradi."
  },
  {
    "savol": "Kalsiy toshli bemorlarda ovqatdagi kalsiyni keskin cheklash nima uchun tavsiya etilmaydi?",
    "variantlar": ["Kalsiy suyak uchun zarur bo'lgani uchun", "Paradoksal ravishda ichakda oksalat so'rilishini oshirib tosh xavfini kuchaytiradi", "Kalsiy im'mun tizim uchun zarur bo'lgani uchun", "Kalsiy buyrak funksiyasini yaxshilaydi"],
    "togri": 1,
    "izoh": "Kalsiy toshli bemorlarda ovqatdagi kalsiyni keskin cheklash tavsiya etilmaydi — paradoksal ravishda ichakda oksalat so'rilishini oshirib tosh xavfini kuchaytiradi. To'g'ri yondashuv: normal kalsiy, ammo natriy va oksalatni kamaytirish."
  },
  {
    "savol": "C vitamini qo'shimchalari kalsiy oksalat toshli bemorlarda nima uchun to'xtatilishi kerak?",
    "variantlar": ["C vitamini immunitetni pasaytiradi", "C vitamini giperoksaluriyani kuchaytiradi — oksalat prekursori hisoblanadi", "C vitamini siydik pH ni oshiradi", "C vitamini kaliy darajasini pasaytiradi"],
    "togri": 1,
    "izoh": "C vitamini (askorbin kislota) oksalatga metabolizllanadi — ko'p iste'mol qilish giperoksaluriyani kuchaytiradi va kalsiy oksalat tosh xavfini oshiradi. Shuning uchun qo'shimchalar to'xtatilishi kerak."
  },
  {
    "savol": "Tosh kasalligida siydik tarkibini baholash uchun qaysi asosiy metabolik tekshiruvlar tavsiya etiladi?",
    "variantlar": ["Faqat siydik ekinmasi", "24 soatlik siydik tahlili (kalsiy, oksalat, sitrat, siydik kislotasi, hajm, pH) va qon tahlili (kreatinin, kalsiy, siydik kislotasi)", "Faqat oddiy siydik tahlili", "Faqat KT tekshiruvi"],
    "togri": 1,
    "izoh": "Metabolik baholash: 24 soatlik siydik tahlili — kalsiy, oksalat, sitrat, siydik kislotasi, hajm, pH; qon tahlili — kreatinin (buyrak funksiyasi), kalsiy, siydik kislotasi. Bu tosh profilaktikasi rejasini belgilaydi."
  },
  {
    "savol": "Tosh kasalligining xulosa bo'yicha qaysi fikr TO'G'RI?",
    "variantlar": ["Kalsiy toshli bemorlarga ovqatdagi kalsiyni keskin cheklash tavsiya etiladi", "Isitmali to'silgan toshda antibiotik birinchi qadam", "Kontrastsiz KT kattalar uchun oltin standart; bolalar/homiladorlarda ultratovush afzal", "Siydik kislotasi toshlari KUB rentgenida aniq ko'rinadi"],
    "togri": 2,
    "izoh": "Kontrastsiz KT — kattalar uchun oltin standart (94–95% sezuvchanlik); bolalar va homiladorlarda nurlanish sababli ultratovush afzal. Kalsiy cheklanmaydi; isitmali to'siqda dekompressiya birinchi; urat KUBda ko'rinmaydi."
  }
]$tosh_savollar$::jsonb
WHERE dars_slug = 'siydik-tosh-kasalligi-asoslari';
