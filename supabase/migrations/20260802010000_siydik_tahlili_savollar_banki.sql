-- 3-dars: Umumiy siydik tahlili — 50 ta amaliy test savoli (shuffle 15)
-- Variantlar uzunligi muvozanatlangan (uzunlik teli yo'q).
UPDATE public.dars_tarkibi
SET savollar_banki = $savollar$[
  {
    "savol": "Umumiy siydik tahlili (urinalysis) nechta asosiy komponentdan iborat?",
    "variantlar": ["2 ta", "3 ta", "4 ta", "5 ta"],
    "togri": 1,
    "izoh": "Umumiy siydik tahlili uch qismdan iborat: tashqi ko'rinishni baholash, tasma (dipstick) tahlili va mikroskopik tekshiruv."
  },
  {
    "savol": "Eng ishonchli siydik namunasi qaysi usulda olinadi?",
    "variantlar": ["Birinchi oqim (dastlabki porsiya) namunasi", "O'rta oqim toza tutilgan namuna (clean-catch)", "24 soat davomida yig'ilgan siydik namunasi", "Suprapubik aspiratsiya orqali olingan namuna"],
    "togri": 1,
    "izoh": "O'rta oqim, toza tutilgan namuna (clean-catch midstream urine) eng ishonchli va amaliyotda eng ko'p qo'llaniladigan usul."
  },
  {
    "savol": "Siydik namunasi olingandan keyin xona haroratida necha soat ichida tekshirilishi kerak?",
    "variantlar": ["30 daqiqa", "1 soat", "4 soat", "12 soat"],
    "togri": 1,
    "izoh": "Xona haroratida 1 soat ichida, sovutilgan holatda esa 4 soat ichida tekshirilishi kerak."
  },
  {
    "savol": "Ayollarda siydik namunasida kontaminatsiya ehtimoli nima uchun yuqoriroq?",
    "variantlar": ["Ayollarda siydik hajmi kamroq bo'lgani sababli", "Introitus atrofidagi leykotsit/bakteriya aralashishi mumkin", "Ayollarda siydik pH doimo yuqori bo'lgani sababli", "Ayollarda buyrak funksiyasi pastroq bo'lgani sababli"],
    "togri": 1,
    "izoh": "Ayollarda siydik yo'lining tashqi qismi (introitus) atrofidagi leykotsit va bakteriyalar namunaga aralashishi mumkin."
  },
  {
    "savol": "Klinik shubha kuchli, lekin natija aniq bo'lmagan holatda qaysi usul tavsiya etiladi?",
    "variantlar": ["Takroriy clean-catch o'rta oqim namunasini olish", "Kateter orqali olingan namunani (catheterized) olish", "24 soat davomida yig'ilgan namunani olish", "Suprapubik punksiya orqali namuna olish"],
    "togri": 1,
    "izoh": "Kateter orqali olingan namuna (catheterized specimen) kontaminatsiya ehtimolini keskin kamaytiradi."
  },
  {
    "savol": "Normal siydikning rangi qanday bo'ladi?",
    "variantlar": ["Butunlay rangsiz — toza suv kabi tiniq", "Och sariqdan to'q sariq ranggacha oralig'ida", "Yashil-ko'k tusli, g'ayritabiiy rangda", "Oq, loyqa va xira ko'rinishga ega"],
    "togri": 1,
    "izoh": "Normal siydik och sariqdan to'q sariq ranggacha bo'lishi mumkin — bu suyuqlik miqdoriga bog'liq."
  },
  {
    "savol": "Siydikda qizil yoki 'choy rangi' ko'rinish nimani bildirishi mumkin?",
    "variantlar": ["Organizmning dehidratatsiyasini", "Siydikdagi glyukozuriyani", "Gematuriya yoki pigmentlarni", "Kuchli proteinuriyani"],
    "togri": 2,
    "izoh": "Qizil yoki choy rangi siydik gematuriya, ayrim dorilar yoki oziq-ovqat (lavlagi) sababli bo'lishi mumkin."
  },
  {
    "savol": "Siydikda loylanish (xiralashish) ko'pincha nimaning belgisi?",
    "variantlar": ["Siydikdagi glyukozuriya (qand) belgisi", "Piyuriya yoki fosfat kristallar belgisi", "Siydikdagi bilirubinuriya belgisi", "Siydikdagi ketonuriya belgisi"],
    "togri": 1,
    "izoh": "Loylanish piyuriya (leykotsitlar) yoki ishqorli siydikda cho'kma hosil bo'lgan fosfat kristallar sababli bo'lishi mumkin."
  },
  {
    "savol": "Siydikning yoqimsiz hidi infeksiya uchun ishonchli belgi hisoblanadimi?",
    "variantlar": ["Ha, juda yuqori sezuvchanlikka ega belgi", "Yo'q, sezuvchanligi va aniqligi past belgi", "Ha, lekin bu faqat erkaklarda ishonchli", "Ha, agar siydik pH darajasi yuqori bo'lsa"],
    "togri": 1,
    "izoh": "Yoqimsiz hid o'z-o'zidan infeksiya belgisi hisoblanmaydi — bu ko'rsatkich sezuvchanligi va aniqligi past."
  },
  {
    "savol": "Pseudogematuriya nima?",
    "variantlar": ["Haqiqiy qon — jiddiy buyrak kasalligining belgisi", "Siydikning oziq-ovqat/dorilar tufayli qizarib ko'rinishi", "Siydikda leykotsitlar (piyuriya) ko'payib ketishi", "Siydikda bakteriyalarning ko'p miqdorda ko'rinishi"],
    "togri": 1,
    "izoh": "Pseudogematuriya — siydikning dehidratatsiya, lavlagi yoki fenazopiridin kabi dorilar tufayli qizarib ko'rinishi, lekin mikroskopda eritrotsit topilmaydi."
  },
  {
    "savol": "Haqiqiy gematuriyani pseudogematuriyadan farqlash uchun nima qilish kerak?",
    "variantlar": ["Tasma tahlilida qon reaksiyasi musbat ekanini tekshirish", "Mikroskopik tekshiruvda eritrotsitlar borligini tasdiqlash", "Faqat siydik rangiga qarab bevosita xulosa chiqarish", "Siydikning hidini tekshirib, natijaga baho berish"],
    "togri": 1,
    "izoh": "Haqiqiy gematuriyani aniqlash uchun faqat rangga emas, albatta mikroskopik tekshiruvda eritrotsitlar borligini tasdiqlash kerak."
  },
  {
    "savol": "Solishtirma og'irlik (specific gravity) nimani ko'rsatadi?",
    "variantlar": ["Siydikdagi bakteriyalarning umumiy sonini ko'rsatadi", "Buyrakning suyultirish/konsentratsiyalash qobiliyatini", "Siydik yo'lida infeksiya borligini bevosita ko'rsatadi", "Buyrakda hosil bo'lgan tosh turini ko'rsatib beradi"],
    "togri": 1,
    "izoh": "Solishtirma og'irlik siydikning suvga nisbatan zichligi bo'lib, organizmning suyultirish/konsentratsiyalash qobiliyatini ko'rsatadi."
  },
  {
    "savol": "Yuqori solishtirma og'irlik qaysi holatlarda kuzatiladi?",
    "variantlar": ["Juda ko'p miqdorda suyuqlik ichib yuborganda", "Dehidratatsiya yoki glyukozuriya (diabet) holatida", "Buyrak tubulalari jiddiy shikastlanganda", "Diuretik (siydik haydovchi) dori qabul qilganda"],
    "togri": 1,
    "izoh": "Yuqori qiymat dehidratatsiya yoki glyukozuriya (qandli diabet)da kuzatiladi."
  },
  {
    "savol": "Normal siydik pH oralig'i qancha?",
    "variantlar": ["2.0–4.0", "4.5–8.0", "8.5–10.0", "7.0 (aniq neytral)"],
    "togri": 1,
    "izoh": "Normal siydik pH 4.5–8.0 oralig'ida, o'rtacha 5.5–6.5 bo'ladi."
  },
  {
    "savol": "Ishqorli siydik (pH > 7.5) ko'pincha qaysi infeksiyani ko'rsatadi?",
    "variantlar": ["Oddiy E. coli bilan bog'liq infeksiyani ko'rsatadi", "Ureaza ishlab chiqaruvchi bakteriya (Proteus) infeksiyasini", "Stafilokokk bakteriyasi bilan bog'liq infeksiyani", "Virusli qo'zg'atuvchi bilan bog'liq infeksiyani"],
    "togri": 1,
    "izoh": "Ishqorli siydik ko'pincha ureaza ishlab chiqaruvchi bakteriyalar (masalan, Proteus) bilan bog'liq infeksiyani ko'rsatadi."
  },
  {
    "savol": "Leykotsit esteraza nimaning belgisi?",
    "variantlar": ["Siydikdagi gematuriya (qon)", "Piyuriya — siydikda leykotsit ko'pligi", "Siydikdagi glyukozuriya (qand)", "Siydikdagi ketonuriya (keton)"],
    "togri": 1,
    "izoh": "Leykotsit esteraza parchalangan leykotsitlardan chiqadigan ferment bo'lib, piyuriya (siydikda leykotsit ko'pligi) belgisi."
  },
  {
    "savol": "Nitrit testi qaysi bakteriyalar mavjudligida musbat chiqadi?",
    "variantlar": ["Gram-musbat kokk turdagi bakteriyalar mavjudligida", "Gram-manfiy bakteriyalar (Enterobacteriaceae) borligida", "Faqat virusli qo'zg'atuvchilar mavjud bo'lganda", "Faqat zamburug' (mikoz) infeksiyasi bo'lganda"],
    "togri": 1,
    "izoh": "Ko'pgina gram-manfiy bakteriyalar (Enterobacteriaceae oilasi) nitratlarni nitritga aylantiradi."
  },
  {
    "savol": "Nitrit testining sezuvchanligi taxminan qancha?",
    "variantlar": ["~95%", "~79%", "~49%", "~30%"],
    "togri": 2,
    "izoh": "Nitrit testining sezuvchanligi ~49%, lekin aniqligi ~98% — yuqori aniqlik, past sezuvchanlik."
  },
  {
    "savol": "Leykotsit esteraza va nitrit birgalikda qo'llanilganda UTI skrining sezuvchanligi taxminan qancha?",
    "variantlar": ["~50%", "~65%", "~88%", "~99%"],
    "togri": 2,
    "izoh": "Ikkisi birgalikda (har qaysisi musbat) bo'lganda sezuvchanlik ~88%, aniqlik ~79%."
  },
  {
    "savol": "Leykotsit esteraza yolg'on manfiy chiqishiga nima sabab bo'lishi mumkin?",
    "variantlar": ["Past solishtirma og'irlik va suyultirilgan siydik", "Yuqori solishtirma og'irlik, glyukozuriya, askorbin kislota", "Ishqorli (yuqori pH li) siydik muhiti mavjudligi", "Siydikka qon aralashib qolishi (gematuriya)"],
    "togri": 1,
    "izoh": "Yuqori solishtirma og'irlik, glyukozuriya va askorbin kislota leykotsit esteraza yolg'on manfiy natijasiga sabab bo'lishi mumkin."
  },
  {
    "savol": "Tasma faqat leykotsit esterazaga musbat, nitritga manfiy bo'lsa — nima qilish kerak?",
    "variantlar": ["Zudlik bilan empirik antibiotik terapiyani boshlash", "Mikroskopik tekshiruv va zarurda siydik ekinmasi", "Hech qanday qo'shimcha chora ko'rmasdan qoldirish", "Tasma (dipstick) tahlilini qaytadan o'tkazish"],
    "togri": 1,
    "izoh": "Bu nafaqat infeksiyani, balki boshqa yallig'lanish sabablarini ham ko'rsatishi mumkin — antibiotik boshlashdan oldin mikroskopik tekshiruv tavsiya etiladi."
  },
  {
    "savol": "Glyukozuriya qaysi hollarda kuzatiladi?",
    "variantlar": ["Buyrakda tosh hosil bo'lgan holatlarda kuzatiladi", "Qandli diabet yoki buyrak tubula patologiyasida", "Siydik yo'li o'tkir infeksiyasi holatlarida kuzatiladi", "Organizm dehidratatsiyasi holatlarida kuzatiladi"],
    "togri": 1,
    "izoh": "Glyukozuriya qandli diabet yoki buyrak tubulalari patologiyasida kuzatiladi."
  },
  {
    "savol": "Sog'lom kattalar kuniga taxminan qancha oqsil chiqaradi?",
    "variantlar": ["0 mg", "80–150 mg", "500–1000 mg", "2000 mg dan ortiq"],
    "togri": 1,
    "izoh": "Sog'lom kattalar kuniga 80–150 mg oqsil chiqaradi, bundan ko'p miqdor buyrak kasalligi belgisi bo'lishi mumkin."
  },
  {
    "savol": "Siydikda bilirubin aniqlanishi qaysi a'zolar patologiyasini ko'rsatadi?",
    "variantlar": ["Buyrak va siydik yo'llari", "Jigar yoki o't yo'llari", "Qovuq (siydik pufagi)", "Prostata bezi"],
    "togri": 1,
    "izoh": "Siydikda bilirubin aniqlanishi jigar yoki o't yo'llarida patologiya mavjudligini ko'rsatadi."
  },
  {
    "savol": "Keton tanachalari siydikda qaysi hollarda ko'tariladi?",
    "variantlar": ["Siydik yo'li o'tkir infeksiyasi holatlarida", "Ochlik, diabetik ketoatsidoz yoki past uglevod parhez", "Buyrakda tosh hosil bo'lgan holatlarda", "Siydikka qon aralashgan (gematuriya) holatda"],
    "togri": 1,
    "izoh": "Keton tanachalari ochlik, qandli diabet dekompensatsiyasi yoki past uglevodli parhezda ko'tariladi."
  },
  {
    "savol": "Siydik mikroskopiyasi (sediment tahlili) uchun namuna qanday tayyorlanadi?",
    "variantlar": ["Maxsus filtr orqali filtrlanadi", "Sentrifugalanib, cho'kma (sediment) ko'riladi", "Yuqori haroratda qaynatib olinadi", "Havoda quritilib, so'ng ko'riladi"],
    "togri": 1,
    "izoh": "Siydik namunasi sentrifugadan o'tkazilib, cho'kma (sediment)ni mikroskop ostida ko'rib chiqiladi."
  },
  {
    "savol": "Gematuriya mezoni — yuqori quvvatli maydonda (HPF) nechta eritrotsit?",
    "variantlar": ["1 va undan ortiq", "3 va undan ortiq", "10 va undan ortiq", "50 va undan ortiq"],
    "togri": 1,
    "izoh": "HPF da 3 va undan ortiq eritrotsit borligi gematuriya mezoni hisoblanadi."
  },
  {
    "savol": "Piyuriya mezoni — HPF da nechta leykotsit?",
    "variantlar": ["1 dan ortiq", "3 dan ortiq", "5 dan ortiq", "20 dan ortiq"],
    "togri": 2,
    "izoh": "HPF da 5 dan ortiq leykotsit piyuriya — infeksiya yoki yallig'lanish belgisi hisoblanadi."
  },
  {
    "savol": "Siydik sedimentida eritrotsit silindrlari (RBC cast) topilishi nimani bildiradi?",
    "variantlar": ["Siydik yo'li o'tkir infeksiyasini", "Qovuq (siydik pufagi) saratonini", "Glomerulyar (koptokcha) kasallikni", "Prostata bezi adenomasini"],
    "togri": 2,
    "izoh": "Eritrotsit silindrlari glomerulyar kasallik belgisi bo'lib, urolog emas, nefrolog konsultatsiyasini talab qiladi."
  },
  {
    "savol": "Struvit kristallar qaysi holatda hosil bo'ladi?",
    "variantlar": ["Normal kislotalik (normotsidik) siydikda hosil bo'ladi", "Ureaza ishlab chiqaruvchi bakteriya infeksiyasida", "Qandli diabet (diabet) holatlarida hosil bo'ladi", "Organizm dehidratatsiyasida hosil bo'ladi"],
    "togri": 1,
    "izoh": "Struvit (uchqirsimon fosfat) kristallar ureaza ishlab chiqaruvchi bakteriyalar (Proteus) infeksiyasi natijasida ishqorli siydikda hosil bo'ladi."
  },
  {
    "savol": "Asimptomatik mikroskopik gematuriya (AMH) ta'rifi qanday?",
    "variantlar": ["Siydik rangining tashqi ko'rinishda qizarib ko'rinishi", "Toza namunada, benign sababsiz HPF da 3+ eritrotsit", "Siydik ekinmasida bakteriya sonining oshib ketishi", "Tasma tahlilida qon reaksiyasining musbat chiqishi"],
    "togri": 1,
    "izoh": "AMH — toza yig'ilgan namunada, oson aniqlanadigan benign sabab bo'lmagan holatda HPF da 3 va undan ortiq eritrotsit borligi."
  },
  {
    "savol": "AMH aniqlanganda keyingi qadam nima?",
    "variantlar": ["Hech qanday chora ko'rmaslik", "To'liq urologik tekshiruv o'tkazish", "Zudlik bilan jarrohlik qilish", "Faqat takroriy tahlil qilish"],
    "togri": 1,
    "izoh": "AMH keyingi to'liq urologik tekshiruv zarurligini belgilashda asosiy mezon hisoblanadi."
  },
  {
    "savol": "Zardob kreatinini nimani o'lchaydi?",
    "variantlar": ["Jigarning zararsizlantirish funksiyasini o'lchaydi", "Buyrak funksiyasini (GFR) bilvosita o'lchaydi", "Qondagi glyukoza (shakar) darajasini o'lchaydi", "Siydik yo'li infeksiyasi borligini o'lchaydi"],
    "togri": 1,
    "izoh": "Zardob kreatinini mushak metabolizmi natijasida hosil bo'ladigan modda bo'lib, buyrak funksiyasini (GFR) bilvosita baholash uchun asosiy ko'rsatkich."
  },
  {
    "savol": "Zardob kreatinini qaysi omilga bog'liq bo'lgani uchun mukammal ko'rsatkich emas?",
    "variantlar": ["Bemorning ovqatlanish vaqtiga", "Bemorning mushak massasiga", "Chiqarilgan siydik hajmiga", "Bemor tana haroratiga"],
    "togri": 1,
    "izoh": "Kreatinin darajasi yosh, jins, bo'y va ayniqsa mushak massasiga bog'liq — past mushak massasida GFR pasayishini to'liq aks ettira olmaydi."
  },
  {
    "savol": "GFR nima?",
    "variantlar": ["Bir sutkada chiqariladigan umumiy siydik hajmi", "Buyrak bir daqiqada qonni filtrlay olish hajmi", "Arterial qon bosimining o'rtacha ko'rsatkichi", "Jigar funksiyasining biokimyoviy ko'rsatkichi"],
    "togri": 1,
    "izoh": "GFR (glomerulyar filtratsiya tezligi) — buyraklarning bir daqiqada qonni qancha hajmda filtrlay olishini ko'rsatadi."
  },
  {
    "savol": "Past mushak massasiga ega bemorlarda kreatinin o'rniga qaysi muqobil ko'rsatkich ishlatilishi mumkin?",
    "variantlar": ["Zardob albumini", "Sistatin C (Cystatin C)", "Umumiy bilirubin", "PSA antigeni"],
    "togri": 1,
    "izoh": "Cystatin C mushak massasiga bog'liq emas va bunday bemorlarda ko'proq aniqlik berishi mumkin."
  },
  {
    "savol": "BUN (qon urea azoti) nimani baholashda ishlatiladi?",
    "variantlar": ["Faqat jigar funksiyasi holatini baholashda ishlatiladi", "Buyrak funksiyasi va suyuqlik holatini baholashda", "Siydik yo'li infeksiyasini aniqlashda ishlatiladi", "Prostata bezi holatini baholashda ishlatiladi"],
    "togri": 1,
    "izoh": "BUN buyrak funksiyasi va suyuqlik holatini baholashda kreatinin bilan birga qo'llaniladi."
  },
  {
    "savol": "Elektrolitlar (Na, K) urologiyada asosan qaysi holatda tekshiriladi?",
    "variantlar": ["Oddiy siydik yo'li infeksiyasi holatlarida tekshiriladi", "To'siqlanishdan keyingi diurez yoki buyrak yetishmovchiligida", "Prostata bezi adenomasi holatlarida tekshiriladi", "Varikosele kasalligi holatlarida tekshiriladi"],
    "togri": 1,
    "izoh": "Siydik yo'li to'siqlanishidan keyingi diurez yoki buyrak yetishmovchiligida elektrolit muvozanati buzilishi aniqlanadi."
  },
  {
    "savol": "PSA (prostata-spetsifik antigen) haqida qaysi fikr to'g'ri?",
    "variantlar": ["Faqat prostata saratoni holatida ko'tariladigan ko'rsatkich", "Saraton bo'lmagan holatlarda ham ko'tarilishi mumkin", "Faqat ayol jinsi vakillarida tekshiriladigan ko'rsatkich", "Buyrak funksiyasini baholaydigan asosiy ko'rsatkich"],
    "togri": 1,
    "izoh": "PSA prostata bezi holatini baholashda qo'llaniladigan, lekin faqat prostataga xos bo'lmagan ko'rsatkich — saraton bo'lmagan holatlarda ham ko'tarilishi mumkin."
  },
  {
    "savol": "Siydik ekinmasi (urine culture) nimaning 'oltin standarti'?",
    "variantlar": ["Buyrak toshi diagnostikasining", "Siydik yo'li infeksiyasini tasdiqlash", "Buyrak funksiyasini baholashning", "Prostata kasalligi diagnostikasining"],
    "togri": 1,
    "izoh": "Siydik ekinmasi UTI ni tasdiqlashning oltin standarti bo'lib, qo'zg'atuvchi bakteriya turini va antibiotik sezuvchanligini aniqlaydi."
  },
  {
    "savol": "Siydik ekinmasi natijasi olish uchun qancha vaqt kerak?",
    "variantlar": ["Atigi 1–2 soat ichida", "Kamida 18 soatdan 2–3 kungacha", "Bor-yo'g'i 5–10 daqiqa ichida", "Kamida bir hafta davomida"],
    "togri": 1,
    "izoh": "Dastlabki natija kamida 18 soatda, to'liq antibiotik sezuvchanlik esa 2–3 kunda aniqlanadi."
  },
  {
    "savol": "Siydik ekinmasida bakteriya soni qancha bo'lganda natija 'musbat' hisoblanadi?",
    "variantlar": ["1,000 CFU/mL", "10,000 CFU/mL", "100,000 CFU/mL", "1,000,000 CFU/mL"],
    "togri": 2,
    "izoh": "Bakteriya soni kamida 100,000 CFU/mL bo'lganda natija musbat hisoblanadi va klinik simptomlar bilan birgalikda baholanadi."
  },
  {
    "savol": "Barcha bemorlarda siydik ekinmasini rutina tarzda buyurish nima uchun tavsiya etilmaydi?",
    "variantlar": ["Bu tekshiruv juda arzon va oson bo'lgani uchun", "Ortiqcha aniqlash va keraksiz antibiotikka olib kelishi uchun", "Natijasi juda tez (bir necha daqiqada) chiqishi uchun", "Faqat go'dak va bolalarda ishlatilishi uchun"],
    "togri": 1,
    "izoh": "Rutina ekinma, ayniqsa kateterli bemorlarda, ortiqcha aniqlash va keraksiz antibiotik davolanishiga olib kelishi mumkin."
  },
  {
    "savol": "Doimiy kateterli bemorning siydigida bakteriya borligi har doim klinik infeksiyani bildiradimi?",
    "variantlar": ["Ha, albatta klinik infeksiyani bildiradi", "Yo'q, bu ko'pincha kolonizatsiya bo'ladi", "Ha, agar siydik pH darajasi yuqori bo'lsa", "Ha, agar bakteriya soni 1000 CFU/mL dan ortsa"],
    "togri": 1,
    "izoh": "Kateterli bemorlarning siydigida bakteriya bo'lishi (kolonizatsiya) ko'pincha klinik infeksiya emas."
  },
  {
    "savol": "Nima uchun umumiy siydik tahlili ekinmadan oldin bajariladi?",
    "variantlar": ["Ekinmadan ancha arzonroq tekshiruv bo'lgani uchun", "Tezkor klinik qaror qabul qilish imkonini bergani uchun", "Ekinmadan ancha aniqroq natija bergani uchun", "Bu tekshiruv faqat ayol bemorlarda qo'llangani uchun"],
    "togri": 1,
    "izoh": "Ekinma natijasi 18 soat–3 kun talab qilgani uchun, tezkor klinik qarorlar ko'pincha umumiy siydik tahlili asosida qabul qilinadi."
  },
  {
    "savol": "Faqat tasma (dipstick) tahlili mikroskopiya o'rnini bosa oladimi?",
    "variantlar": ["Ha, to'liq mikroskopiya o'rnini bosa oladi", "Yo'q, mikroskopiya o'rnini bosa olmaydi", "Ha, lekin faqat gematuriya holatida bosadi", "Ha, lekin faqat erkak bemorlarda bosadi"],
    "togri": 1,
    "izoh": "Faqat tasma tahlili mikroskopiya o'rnini bosa olmaydi — ikkalasi birgalikda qo'llanilganda eng yuqori diagnostik qiymatga ega."
  },
  {
    "savol": "Kalsiy oksalat kristallar siydikda topilishi nimani ko'rsatadi?",
    "variantlar": ["Siydik yo'li o'tkir infeksiyasini", "Tosh hosil bo'lish xavfi borligini", "Jigar kasalligi mavjudligini", "Qandli diabet mavjudligini"],
    "togri": 1,
    "izoh": "Kalsiy oksalat kristallar siydikda eng ko'p uchraydigan kristal turi bo'lib, tosh hosil bo'lish xavfi haqida ma'lumot beradi."
  },
  {
    "savol": "Nitrit testining aniqligi (specificity) taxminan qancha?",
    "variantlar": ["~49%", "~79%", "~87%", "~98%"],
    "togri": 3,
    "izoh": "Nitrit testining aniqligi ~98% — yuqori aniqlik, lekin past sezuvchanlik (~49%)."
  },
  {
    "savol": "Leykotsit esterazaning sezuvchanligi taxminan qancha?",
    "variantlar": ["~49%", "~65%", "~79%", "~98%"],
    "togri": 2,
    "izoh": "Leykotsit esteraza sezuvchanligi ~79%, aniqligi ~87%."
  },
  {
    "savol": "Surunkali buyrak kasalligi (CKD) bosqichlarini aniqlashda asosiy mezon nima?",
    "variantlar": ["Siydikning tashqi rangi", "GFR — filtratsiya tezligi", "Siydikning pH darajasi", "Chiqarilgan siydik hajmi"],
    "togri": 1,
    "izoh": "GFR surunkali buyrak kasalligi bosqichlarini aniqlashda asosiy mezon hisoblanadi."
  }
]$savollar$
WHERE dars_slug = 'siydik-tahlili-asoslari';
