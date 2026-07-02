-- 3-dars: Umumiy siydik tahlili — 50 ta amaliy test savoli (shuffle 15)
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
    "variantlar": ["Birinchi oqim namunasi", "O'rta oqim toza tutilgan namuna (clean-catch midstream)", "24 soatlik yig'ilgan namuna", "Suprapubik aspiratsiya"],
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
    "variantlar": ["Siydik hajmi kam bo'lgani uchun", "Introitus atrofidagi leykotsit va bakteriyalar aralashishi mumkinligi uchun", "Siydik pH yuqori bo'lgani uchun", "Buyrak funksiyasi past bo'lgani uchun"],
    "togri": 1,
    "izoh": "Ayollarda siydik yo'lining tashqi qismi (introitus) atrofidagi leykotsit va bakteriyalar namunaga aralashishi mumkin."
  },
  {
    "savol": "Klinik shubha kuchli, lekin natija aniq bo'lmagan holatda qaysi usul tavsiya etiladi?",
    "variantlar": ["Takroriy clean-catch", "Kateter orqali olingan namuna", "24 soatlik namuna", "Suprapubik punksiya"],
    "togri": 1,
    "izoh": "Kateter orqali olingan namuna (catheterized specimen) kontaminatsiya ehtimolini keskin kamaytiradi."
  },
  {
    "savol": "Normal siydikning rangi qanday bo'ladi?",
    "variantlar": ["Rangsiz (suv kabi)", "Och sariqdan to'q sariqgacha", "Yashil tusli", "Oq loyqa"],
    "togri": 1,
    "izoh": "Normal siydik och sariqdan to'q sariq ranggacha bo'lishi mumkin — bu suyuqlik miqdoriga bog'liq."
  },
  {
    "savol": "Siydikda qizil yoki 'choy rangi' ko'rinish nimani bildirishi mumkin?",
    "variantlar": ["Dehidratatsiyani", "Glyukozuriyani", "Gematuriya yoki boshqa pigmentlarni", "Proteinuriyani"],
    "togri": 2,
    "izoh": "Qizil yoki choy rangi siydik gematuriya, ayrim dorilar yoki oziq-ovqat (lavlagi) sababli bo'lishi mumkin."
  },
  {
    "savol": "Siydikda loylanish (xiralashish) ko'pincha nimaning belgisi?",
    "variantlar": ["Glyukozuriya", "Piyuriya yoki fosfat kristallar", "Bilirubinuriya", "Ketonuriya"],
    "togri": 1,
    "izoh": "Loylanish piyuriya (leykotsitlar) yoki ishqorli siydikda cho'kma hosil bo'lgan fosfat kristallar sababli bo'lishi mumkin."
  },
  {
    "savol": "Siydikning yoqimsiz hidi infeksiya uchun ishonchli belgi hisoblanadimi?",
    "variantlar": ["Ha, yuqori sezuvchanlikka ega", "Yo'q, sezuvchanligi va aniqligi past", "Ha, lekin faqat erkaklarda", "Ha, agar pH yuqori bo'lsa"],
    "togri": 1,
    "izoh": "Yoqimsiz hid o'z-o'zidan infeksiya belgisi hisoblanmaydi — bu ko'rsatkich sezuvchanligi va aniqligi past."
  },
  {
    "savol": "Pseudogematuriya nima?",
    "variantlar": ["Haqiqiy qon — buyrak kasalligi belgisi", "Siydikning dehidratatsiya, oziq-ovqat yoki dorilar tufayli qizarib ko'rinishi", "Siydikda leykotsitlar ko'pligi", "Siydikda bakteriyalar ko'rinishi"],
    "togri": 1,
    "izoh": "Pseudogematuriya — siydikning dehidratatsiya, lavlagi yoki fenazopiridin kabi dorilar tufayli qizarib ko'rinishi, lekin mikroskopda eritrotsit topilmaydi."
  },
  {
    "savol": "Haqiqiy gematuriyani pseudogematuriyadan farqlash uchun nima qilish kerak?",
    "variantlar": ["Tasma tahlilida qon musbat bo'lishini tekshirish", "Mikroskopik tekshiruvda eritrotsitlar borligini tasdiqlash", "Siydik rangiga qarab xulosa chiqarish", "Siydik hidini tekshirish"],
    "togri": 1,
    "izoh": "Haqiqiy gematuriyani aniqlash uchun faqat rangga emas, albatta mikroskopik tekshiruvda eritrotsitlar borligini tasdiqlash kerak."
  },
  {
    "savol": "Solishtirma og'irlik (specific gravity) nimani ko'rsatadi?",
    "variantlar": ["Siydikdagi bakteriyalar sonini", "Buyrakning siydikni suyultirish/konsentratsiyalash qobiliyatini", "Siydik yo'li infeksiyasi borligini", "Buyrak toshi turini"],
    "togri": 1,
    "izoh": "Solishtirma og'irlik siydikning suvga nisbatan zichligi bo'lib, organizmning suyultirish/konsentratsiyalash qobiliyatini ko'rsatadi."
  },
  {
    "savol": "Yuqori solishtirma og'irlik qaysi holatlarda kuzatiladi?",
    "variantlar": ["Ko'p suv ichganda", "Dehidratatsiya yoki glyukozuriyada", "Buyrak tubulalari shikastlanganda", "Diuretik qabul qilganda"],
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
    "variantlar": ["E. coli infeksiyasi", "Ureaza ishlab chiqaruvchi bakteriyalar (masalan, Proteus)", "Stafilokokk infeksiyasi", "Virusli infeksiya"],
    "togri": 1,
    "izoh": "Ishqorli siydik ko'pincha ureaza ishlab chiqaruvchi bakteriyalar (masalan, Proteus) bilan bog'liq infeksiyani ko'rsatadi."
  },
  {
    "savol": "Leykotsit esteraza nimaning belgisi?",
    "variantlar": ["Gematuriya", "Piyuriya (siydikda leykotsit ko'pligi)", "Glyukozuriya", "Ketonuriya"],
    "togri": 1,
    "izoh": "Leykotsit esteraza parchalangan leykotsitlardan chiqadigan ferment bo'lib, piyuriya (siydikda leykotsit ko'pligi) belgisi."
  },
  {
    "savol": "Nitrit testi qaysi bakteriyalar mavjudligida musbat chiqadi?",
    "variantlar": ["Gram-musbat kokklar", "Ko'pgina gram-manfiy bakteriyalar (Enterobacteriaceae)", "Viruslar", "Zamburug'lar"],
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
    "variantlar": ["Past solishtirma og'irlik", "Yuqori solishtirma og'irlik, glyukozuriya, askorbin kislota", "Ishqorli siydik", "Qon aralashuvi"],
    "togri": 1,
    "izoh": "Yuqori solishtirma og'irlik, glyukozuriya va askorbin kislota leykotsit esteraza yolg'on manfiy natijasiga sabab bo'lishi mumkin."
  },
  {
    "savol": "Tasma faqat leykotsit esterazaga musbat, nitritga manfiy bo'lsa — nima qilish kerak?",
    "variantlar": ["Darhol antibiotik boshlash", "Mikroskopik tekshiruv va zarur bo'lsa siydik ekinmasi", "Hech narsa qilmaslik", "Takroriy tasma tahlili"],
    "togri": 1,
    "izoh": "Bu nafaqat infeksiyani, balki boshqa yallig'lanish sabablarini ham ko'rsatishi mumkin — antibiotik boshlashdan oldin mikroskopik tekshiruv tavsiya etiladi."
  },
  {
    "savol": "Glyukozuriya qaysi hollarda kuzatiladi?",
    "variantlar": ["Buyrak toshi bo'lganda", "Qandli diabet yoki buyrak tubulalari patologiyasida", "Siydik yo'li infeksiyasida", "Dehidratatsiyada"],
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
    "variantlar": ["Buyrak", "Jigar yoki o't yo'llari", "Qovuq", "Prostata"],
    "togri": 1,
    "izoh": "Siydikda bilirubin aniqlanishi jigar yoki o't yo'llarida patologiya mavjudligini ko'rsatadi."
  },
  {
    "savol": "Keton tanachalari siydikda qaysi hollarda ko'tariladi?",
    "variantlar": ["Siydik yo'li infeksiyasida", "Ochlik, diabetik ketoatsidoz yoki past uglevodli parhezda", "Buyrak toshida", "Gematuriyada"],
    "togri": 1,
    "izoh": "Keton tanachalari ochlik, qandli diabet dekompensatsiyasi yoki past uglevodli parhezda ko'tariladi."
  },
  {
    "savol": "Siydik mikroskopiyasi (sediment tahlili) uchun namuna qanday tayyorlanadi?",
    "variantlar": ["Filtrlanadi", "Sentrifugadan o'tkazilib, cho'kma ko'riladi", "Qaynatiladi", "Quritiladi"],
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
    "variantlar": ["Siydik yo'li infeksiyasini", "Qovuq saratonini", "Glomerulyar kasallikni", "Prostata adenomasini"],
    "togri": 2,
    "izoh": "Eritrotsit silindrlari glomerulyar kasallik belgisi bo'lib, urolog emas, nefrolog konsultatsiyasini talab qiladi."
  },
  {
    "savol": "Struvit kristallar qaysi holatda hosil bo'ladi?",
    "variantlar": ["Normotsidik siydikda", "Ureaza ishlab chiqaruvchi bakteriyalar infeksiyasida", "Diabetda", "Dehidratatsiyada"],
    "togri": 1,
    "izoh": "Struvit (uchqirsimon fosfat) kristallar ureaza ishlab chiqaruvchi bakteriyalar (Proteus) infeksiyasi natijasida ishqorli siydikda hosil bo'ladi."
  },
  {
    "savol": "Asimptomatik mikroskopik gematuriya (AMH) ta'rifi qanday?",
    "variantlar": ["Siydik rangining qizarib ko'rinishi", "Toza namunada, benign sabab bo'lmagan holatda HPF da 3+ eritrotsit", "Siydik ekinmasida bakteriya oshishi", "Tasma tahlilida qon musbat chiqishi"],
    "togri": 1,
    "izoh": "AMH — toza yig'ilgan namunada, oson aniqlanadigan benign sabab bo'lmagan holatda HPF da 3 va undan ortiq eritrotsit borligi."
  },
  {
    "savol": "AMH aniqlanganda keyingi qadam nima?",
    "variantlar": ["Hech narsa qilmaslik", "To'liq urologik tekshiruv", "Darhol operatsiya", "Faqat takroriy tahlil"],
    "togri": 1,
    "izoh": "AMH keyingi to'liq urologik tekshiruv zarurligini belgilashda asosiy mezon hisoblanadi."
  },
  {
    "savol": "Zardob kreatinini nimani o'lchaydi?",
    "variantlar": ["Jigar funksiyasini", "Buyrak funksiyasini (GFR) bilvosita", "Qon shakar darajasini", "Siydik yo'li infeksiyasini"],
    "togri": 1,
    "izoh": "Zardob kreatinini mushak metabolizmi natijasida hosil bo'ladigan modda bo'lib, buyrak funksiyasini (GFR) bilvosita baholash uchun asosiy ko'rsatkich."
  },
  {
    "savol": "Zardob kreatinini qaysi omilga bog'liq bo'lgani uchun mukammal ko'rsatkich emas?",
    "variantlar": ["Ovqatlanish vaqtiga", "Mushak massasiga", "Siydik hajmiga", "Tana haroratiga"],
    "togri": 1,
    "izoh": "Kreatinin darajasi yosh, jins, bo'y va ayniqsa mushak massasiga bog'liq — past mushak massasida GFR pasayishini to'liq aks ettira olmaydi."
  },
  {
    "savol": "GFR nima?",
    "variantlar": ["Siydik hajmi", "Buyraklarning bir daqiqada qonni filtrlay olish hajmi", "Qon bosimi ko'rsatkichi", "Jigar funksiyasi ko'rsatkichi"],
    "togri": 1,
    "izoh": "GFR (glomerulyar filtratsiya tezligi) — buyraklarning bir daqiqada qonni qancha hajmda filtrlay olishini ko'rsatadi."
  },
  {
    "savol": "Past mushak massasiga ega bemorlarda kreatinin o'rniga qaysi muqobil ko'rsatkich ishlatilishi mumkin?",
    "variantlar": ["Albumin", "Cystatin C", "Bilirubin", "PSA"],
    "togri": 1,
    "izoh": "Cystatin C mushak massasiga bog'liq emas va bunday bemorlarda ko'proq aniqlik berishi mumkin."
  },
  {
    "savol": "BUN (qon urea azoti) nimani baholashda ishlatiladi?",
    "variantlar": ["Faqat jigar funksiyasini", "Buyrak funksiyasi va suyuqlik holatini", "Siydik yo'li infeksiyasini", "Prostata holatini"],
    "togri": 1,
    "izoh": "BUN buyrak funksiyasi va suyuqlik holatini baholashda kreatinin bilan birga qo'llaniladi."
  },
  {
    "savol": "Elektrolitlar (Na, K) urologiyada asosan qaysi holatda tekshiriladi?",
    "variantlar": ["Siydik yo'li infeksiyasida", "Siydik yo'li to'siqlanishidan keyingi diurez yoki buyrak yetishmovchiligida", "Prostata adenomasida", "Varikoseleda"],
    "togri": 1,
    "izoh": "Siydik yo'li to'siqlanishidan keyingi diurez yoki buyrak yetishmovchiligida elektrolit muvozanati buzilishi aniqlanadi."
  },
  {
    "savol": "PSA (prostata-spetsifik antigen) haqida qaysi fikr to'g'ri?",
    "variantlar": ["Faqat prostata saratonida ko'tariladi", "Saraton bo'lmagan holatlarda ham ko'tarilishi mumkin", "Faqat ayollarda tekshiriladi", "Buyrak funksiyasi ko'rsatkichi"],
    "togri": 1,
    "izoh": "PSA prostata bezi holatini baholashda qo'llaniladigan, lekin faqat prostataga xos bo'lmagan ko'rsatkich — saraton bo'lmagan holatlarda ham ko'tarilishi mumkin."
  },
  {
    "savol": "Siydik ekinmasi (urine culture) nimaning 'oltin standarti'?",
    "variantlar": ["Buyrak toshi diagnostikasi", "Siydik yo'li infeksiyasini tasdiqlash", "Buyrak funksiyasini baholash", "Prostata kasalligi diagnostikasi"],
    "togri": 1,
    "izoh": "Siydik ekinmasi UTI ni tasdiqlashning oltin standarti bo'lib, qo'zg'atuvchi bakteriya turini va antibiotik sezuvchanligini aniqlaydi."
  },
  {
    "savol": "Siydik ekinmasi natijasi olish uchun qancha vaqt kerak?",
    "variantlar": ["1–2 soat", "Kamida 18 soatdan 2–3 kungacha", "5–10 daqiqa", "1 hafta"],
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
    "variantlar": ["Juda arzon bo'lgani uchun", "Ortiqcha aniqlash va keraksiz antibiotik davolanishiga olib kelishi mumkinligi uchun", "Natija juda tez chiqishi uchun", "Faqat bolalarda ishlatilishi uchun"],
    "togri": 1,
    "izoh": "Rutina ekinma, ayniqsa kateterli bemorlarda, ortiqcha aniqlash va keraksiz antibiotik davolanishiga olib kelishi mumkin."
  },
  {
    "savol": "Doimiy kateterli bemorning siydigida bakteriya borligi har doim klinik infeksiyani bildiradimi?",
    "variantlar": ["Ha, albatta", "Yo'q, bu ko'pincha kolonizatsiya bo'lishi mumkin", "Ha, agar pH yuqori bo'lsa", "Ha, agar bakteriya soni 1000 CFU/mL dan ortiq bo'lsa"],
    "togri": 1,
    "izoh": "Kateterli bemorlarning siydigida bakteriya bo'lishi (kolonizatsiya) ko'pincha klinik infeksiya emas."
  },
  {
    "savol": "Nima uchun umumiy siydik tahlili ekinmadan oldin bajariladi?",
    "variantlar": ["Arzonroq bo'lgani uchun", "Tezkor klinik qaror qabul qilish uchun", "Aniqroq bo'lgani uchun", "Faqat ayollarda qo'llaniladi"],
    "togri": 1,
    "izoh": "Ekinma natijasi 18 soat–3 kun talab qilgani uchun, tezkor klinik qarorlar ko'pincha umumiy siydik tahlili asosida qabul qilinadi."
  },
  {
    "savol": "Faqat tasma (dipstick) tahlili mikroskopiya o'rnini bosa oladimi?",
    "variantlar": ["Ha, to'liq o'rnini bosadi", "Yo'q, bosa olmaydi", "Ha, lekin faqat gematuriyada", "Ha, lekin faqat erkaklarda"],
    "togri": 1,
    "izoh": "Faqat tasma tahlili mikroskopiya o'rnini bosa olmaydi — ikkalasi birgalikda qo'llanilganda eng yuqori diagnostik qiymatga ega."
  },
  {
    "savol": "Kalsiy oksalat kristallar siydikda topilishi nimani ko'rsatadi?",
    "variantlar": ["Siydik yo'li infeksiyasini", "Tosh hosil bo'lish xavfini", "Jigar kasalligini", "Qandli diabetni"],
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
    "variantlar": ["Siydik rangi", "GFR (glomerulyar filtratsiya tezligi)", "Siydik pH", "Siydik hajmi"],
    "togri": 1,
    "izoh": "GFR surunkali buyrak kasalligi bosqichlarini aniqlashda asosiy mezon hisoblanadi."
  }
]$savollar$
WHERE dars_slug = 'siydik-tahlili-asoslari';
