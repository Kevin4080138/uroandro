UPDATE dars_tarkibi
SET savollar_banki = $tugma_savollar$[
  {
    "savol": "CAKUT qisqartmasi nimani anglatadi?",
    "variantlar": ["Congenital Anomalies of the Kidney and Urinary Tract", "Chronic Anomalies of the Kidney and Ureteral Tract", "Congenital Agenesis of the Kidney and Urethral Tissue", "Cystic Abnormalities of the Kidney and Urinary Tubules"],
    "togri": 0,
    "izoh": "CAKUT — Congenital Anomalies of the Kidney and Urinary Tract: buyrak va siydik yo'llarining tug'ma anomaliyalari majmuasi."
  },
  {
    "savol": "CAKUT bolalardagi surunkali buyrak kasalligi (CKD) sabablarining qancha qismini tashkil etadi?",
    "variantlar": ["~10%", "~25%", "Yarmidan ko'pini", "Deyarli hammasini"],
    "togri": 2,
    "izoh": "CAKUT bolalardagi CKD sabablarining yarmidan ko'pini tashkil etadi — bu guruhni klinik jihatdan eng muhim tug'ma nuqsonlar qatoriga kiritadi."
  },
  {
    "savol": "Embrion buyragining rivojlanishida to'g'ri ketma-ketlik qaysi?",
    "variantlar": ["Metanefros → mezonefros → pronefros", "Mezonefros → pronefros → metanefros", "Pronefros → mezonefros → metanefros", "Pronefros → metanefros → mezonefros"],
    "togri": 2,
    "izoh": "Siydik tizimi uch bosqichda rivojlanadi: pronefros → mezonefros → metanefros. Doimiy buyrak bo'ladigan metanefros 5-haftadan boshlab shakllanadi."
  },
  {
    "savol": "Ureter kurtagi (ureteric bud) qaysi tuzilmadan o'sib chiqadi?",
    "variantlar": ["Metanefrik mezodermdan", "Mezonefrik (Wolff) kanalidan", "Pronefrik kanalidan", "Kloaka devoridan"],
    "togri": 1,
    "izoh": "Ureter kurtagi mezonefrik (Wolff) kanalidan o'sib chiqib, buyrak yig'uvchi sistemasi, siydik yo'li va qovuqning bir qismiga aylanadi."
  },
  {
    "savol": "Metanefrik mezoderm ureter kurtagi bilan qanday aloqa orqali nefronlarga aylanadi?",
    "variantlar": ["Mexanik bosim orqali", "Induktiv aloqa orqali", "Qon ta'minoti orqali", "Gormonlar ta'siri orqali"],
    "togri": 1,
    "izoh": "Metanefrik mezoderm va ureter kurtagi o'rtasidagi induktiv (reciprocal) aloqa nefronlar va buyrak stromasini hosil qiladi. Bu aloqa buzilsa — CAKUT yuzaga keladi."
  },
  {
    "savol": "Ureter kurtagi juda baland chiqsa qaysi anomaliya ehtimoli ortadi?",
    "variantlar": ["Vezikouretal reflyuks (VUR)", "Buyrak displaziyasi", "UPJ to'siqlanishi (UPJO)", "Gipospadiya anomaliyasi"],
    "togri": 1,
    "izoh": "Ureter kurtagi juda baland chiqsa — buyrak displaziyasi, juda past chiqsa — vezikouretal reflyuks (VUR) ehtimoli ortadi."
  },
  {
    "savol": "Qovuq va uretra embrionda qaysi tuzilmadan shakllanadi?",
    "variantlar": ["Metanefrik mezodermdan", "Mezonefrik (Wolff) kanalidan", "Urogenital sinusdan", "Allantois qoldig'idan"],
    "togri": 2,
    "izoh": "Qovuq va uretra 4–6-haftada kloakaning urorektal septum tomonidan bo'linishi natijasida urogenital sinusdan shakllanadi."
  },
  {
    "savol": "Ikki tomonlama buyrak ageneziyasi (Potter sindromi) qanday oqibatga olib keladi?",
    "variantlar": ["Ko'pincha belgisiz (asimptomatik) kechadigan holat", "Qarama-qarshi buyrak kompensator gipertrofiyasi", "Amniotik suyuqlik yo'qligi, o'pka gipoplaziyasi — o'lim", "Faqat surunkali buyrak kasalligi (CKD) rivojlanadi"],
    "togri": 2,
    "izoh": "Ikki tomonlama ageneziyada buyraklar ishlamaydi → amniotik suyuqlik (oligogidroamnios) hosil bo'lmaydi → o'pka rivojlanmaydi (gipoplaziya) → deyarli 100% o'lim."
  },
  {
    "savol": "Bir tomonlama buyrak ageneziyasi qanchalik uchraydi va asosiy klinik oqibati nima?",
    "variantlar": ["1:5000; deyarli har doim o'lim bilan yakunlanadi", "1:1200; ko'pincha asimptomatik, 30% da CKD xavfi", "1:400; UPJ to'siqlanishi xavfi juda yuqori bo'ladi", "1:300; deyarli har doim jarrohlik talab etadi"],
    "togri": 1,
    "izoh": "Bir tomonlama buyrak ageneziyasi 1:1200 uchraydi. Ko'pincha asimptomatik; qarama-qarshi buyrak kompensator gipertrofiyaga uchraydi, lekin 30% da CKD belgilari kuzatilishi mumkin."
  },
  {
    "savol": "Ektopik buyrak ko'pincha qayerda joylashadi?",
    "variantlar": ["Ko'krak qafasi bo'shlig'ida", "Chanoq (tos) bo'shlig'ida", "Jigar ostida, o'ng tomonda", "Taloq yonida, chap tomonda"],
    "togri": 1,
    "izoh": "Ektopik buyrak embrion davrida to'g'ri ko'tarilmay chanoqda qolib ketadi. Ko'pincha aylanmagan (malrotated) va gidronefroz yoki toshlarga moyil bo'ladi."
  },
  {
    "savol": "Ot-nalcha buyrak (horseshoe kidney) qanchalik uchraydi va qaysi jinsda ko'proq?",
    "variantlar": ["1:1200; ayollarda ikki barobar ko'proq uchraydi", "1:400; erkaklarda ikki barobar ko'proq uchraydi", "1:5000; ikki jinsda ham teng uchraydi", "1:900; faqat erkak jinsi vakillarida uchraydi"],
    "togri": 1,
    "izoh": "Ot-nalcha buyrak 1:400 uchraydi — eng keng tarqalgan qo'shilish anomaliyasi. Erkaklarda ayollarga nisbatan ikki marta ko'proq uchraydi."
  },
  {
    "savol": "Ot-nalcha buyrakda isthmus (birlashgan to'qima) qayerda joylashib, ko'tarilishni to'xtatadi?",
    "variantlar": ["Jigar ostida, o'ng buyrak venasi darajasida", "Aorta oldida, past chayrali arteriya darajasida", "Diafragma ostida, aorta bifurkatsiyasi darajasida", "Qovuq ustida, siydik yo'li kirish joyi yonida"],
    "togri": 1,
    "izoh": "Isthmus aorta oldida, past chayrali arteriya (arteria mesenterica inferior) darajasida ko'tarilishni mexanik tarzda to'xtatib qoladi."
  },
  {
    "savol": "Ot-nalcha buyrak bilan qaysi asoratlar ko'proq birga uchraydi?",
    "variantlar": ["Sistit va prostatit kabi yallig'lanish kasalliklari", "UPJ to'siqlanishi, siydik yo'li toshlari va VUR", "Buyrak displaziyasi va ADPKD kasalliklari", "Gipospadiya va epispadiya anomaliyalari"],
    "togri": 1,
    "izoh": "Ot-nalcha buyrakda UPJ to'siqlanishi 13–34%, siydik yo'li toshlari va VUR bilan birga uchraydi. Ko'pchilik hollarda asimptomatik."
  },
  {
    "savol": "Buyrak displaziyasining eng og'ir ko'rinishi — MCDK nima?",
    "variantlar": ["Bir necha katta kista, qolgan to'qima normal ishlaydi", "Buyrak faoliyatsiz kistalar majmuasiga aylanadi (invülosiya)", "Ikki tomonlama politistik buyrak kasalligi shakli", "Buyrak to'qimasining to'liq fibroz bilan almashinishi"],
    "togri": 1,
    "izoh": "MCDK (multicystic dysplastic kidney) — buyrak faoliyatsiz kistalar majmuasiga aylanadi. Ko'pincha bir tomonlama, spontan invülosiyaga uchraydi."
  },
  {
    "savol": "ADPKD (autosomal dominant politistik buyrak kasalligi) qaysi gen mutatsiyasi bilan bog'liq?",
    "variantlar": ["PAX2 geni mutatsiyasi", "PKD1/PKD2 genlari mutatsiyasi", "WT1 geni mutatsiyasi", "HNF1B geni mutatsiyasi"],
    "togri": 1,
    "izoh": "ADPKD PKD1 va PKD2 gen mutatsiyalari bilan bog'liq. Ko'pincha 30–50 yoshda belgilanadi va buyrak yetishmovchiligiga olib kelishi mumkin."
  },
  {
    "savol": "ARPKD (autosomal retsessiv politistik buyrak kasalligi) qanchalik uchraydi va eng og'ir oqibati nima?",
    "variantlar": ["1:400; faqat katta yoshdagilar uchun xavf tug'diradi", "1:20,000; yangida o'pka gipoplaziyasi va buyrak yetishmovchiligi", "1:1200; deyarli belgisiz (asimptomatik) kechadigan holat", "1:5000; faqat surunkali buyrak kasalligiga olib keladi"],
    "togri": 1,
    "izoh": "ARPKD 1:20,000 uchraydi. Og'ir shaklida yangi tug'ilganda o'pka gipoplaziyasi va buyrak yetishmovchiligi kuzatiladi."
  },
  {
    "savol": "MCDK va UPJ to'siqlanishini farqlash uchun qaysi tekshiruv tavsiya etiladi?",
    "variantlar": ["VCUG (sistouretrogramma)", "MAG3 diuretik renografiya", "KT urografiya tekshiruvi", "Oddiy qorin rentgenografiyasi"],
    "togri": 1,
    "izoh": "MCDK va UPJO prenatal UTT'da o'xshash ko'rinishi mumkin. Postnatal MAG3 diuretik renografiya buyrak funksiyasi va oqim dinamikasini baholab, ikkalasini farqlaydi."
  },
  {
    "savol": "UPJ to'siqlanishining (UPJO) eng ko'p sababi nima?",
    "variantlar": ["Tashqi bosim — kesib o'tuvchi qo'shimcha tomir", "Ichki tor — apristaltik segment (intrinsik stenoz)", "VUR natijasida siydik yo'lining kengayishi", "Buyrak jomidagi toshning yo'lni to'sishi"],
    "togri": 1,
    "izoh": "UPJO ning eng ko'p sababi ichki tor — apristaltik segment (intrinsik stenoz). Tashqi bosim (kesib o'tuvchi tomir) va yuqori kirish nuqtasi ham sabab bo'lishi mumkin."
  },
  {
    "savol": "UPJO davolashda 'oltin standart' jarrohlik usuli qaysi?",
    "variantlar": ["Nefrektomiya (buyrakni olib tashlash)", "Piyeloplastika (pyeloplasty)", "Uretroskopiya tekshiruvi", "Lazer litotripsi usuli"],
    "togri": 1,
    "izoh": "Piyeloplastika — buyrak jomi va siydik yo'lini qayta birlashtiruvchi jarrohlik amaliyoti — UPJO davolashning 'oltin standarti' hisoblanadi."
  },
  {
    "savol": "Weigert-Meyer qoidasiga ko'ra duplikat tizimda yuqori qutb uretri qayerga kiradi?",
    "variantlar": ["Qovuqqa yuqoriroqda va lateralroqda kiradi", "Qovuqqa pastroqda va mediaroqda kiradi", "To'g'ridan-to'g'ri uretra kanaliga kiradi", "Prostata bezi to'qimasi ichiga kiradi"],
    "togri": 1,
    "izoh": "Weigert-Meyer qoidasi: yuqori qutb uretri qovuqqa pastroqda va mediaroqda kiradi; pastki qutb uretri esa normal holatga yaqinroq kiradi."
  },
  {
    "savol": "Duplikat tizimda qaysi qutb uretri VURga ko'proq moyil?",
    "variantlar": ["Yuqori qutb uretri", "Pastki qutb uretri", "Ikkalasi ham teng darajada", "Hech qaysi biri moyil emas"],
    "togri": 1,
    "izoh": "Pastki qutb uretri trigonga yaqinroq, nisbatan qisqaroq intramural segmentga ega bo'lgani uchun VURga moyilroq. Yuqori qutb uretri esa ektopik yoki ureterotselga moyil."
  },
  {
    "savol": "Ureterotsel (ureterocele) nima?",
    "variantlar": ["Siydik yo'lining to'liq yo'qligi (ageneziya)", "Siydik yo'li distal qismining sista kabi kengayishi", "Siydik yo'lining ikkilanishi (duplikatsiya)", "Siydik yo'lining teskari (ektopik) joylashishi"],
    "togri": 1,
    "izoh": "Ureterotsel — siydik yo'lining distal (intravesikal) qismining balonsimon kengayishi. Ko'pincha duplikat tizimning yuqori qutb uretri bilan bog'liq."
  },
  {
    "savol": "Ektopik ureterning ayollarda klassik belgisi nima?",
    "variantlar": ["Doimiy qonli siydik (gematuriya) kelishi", "Qovuq tutish saqlangan holda doimiy tomchilash", "Siydik chiqarishda kuchli zo'riqish (kuchlanish)", "Kunduzi tez-tez siydik qilishga ehtiyoj"],
    "togri": 1,
    "izoh": "Ektopik ureter trigondan tashqarida, masalan vaginaga kirsa, sfinkterdan past bo'ladi — qovuq tutish saqlangan holda doimiy tomchilash kuzatiladi. Bu klassik belgi."
  },
  {
    "savol": "Qovuq ekssrofiyasi qanchalik uchraydi va qaysi anomaliya bilan birga kechadi?",
    "variantlar": ["1:5000; gipospadiya anomaliyasi bilan birga", "1:30,000; erkakda epispadiya bilan birga kechadi", "1:1200; vezikouretal reflyuks (VUR) bilan birga", "1:400; UPJ to'siqlanishi (UPJO) bilan birga"],
    "togri": 1,
    "izoh": "Qovuq ekssrofiyasi 1:30,000 uchraydi. Erkakda qovuq oldingi devori ochiq bo'lib, dorsal tomondan joylashgan uretra teshigi (epispadiya) bilan birga kechadi."
  },
  {
    "savol": "Patent urachus (urachal fistula) qanday belgi beradi?",
    "variantlar": ["Qorin og'rig'i va yuqori isitma", "Kindikdan siydik oqib chiqishi", "Siydikni tutolmaslik (inkontinensiya)", "Qorin bo'shlig'ida suyuqlik to'planishi"],
    "togri": 1,
    "izoh": "Patent urachus — urachus yopilmay qolsa, qovuqdan kindikka kanal ochiq qoladi. Klassik belgi: kindikdan siydik oqishi."
  },
  {
    "savol": "Urachus kistasining asosiy klinik xavfi nima?",
    "variantlar": ["Siydikni tutolmaslik holati", "Ko'pincha infeksiyalanishi mumkin", "Buyrak toshining hosil bo'lishi", "Spontan yo'qola olmasligi"],
    "togri": 1,
    "izoh": "Urachus kistasi — ikki tomondan yopiq, o'rtada suyuqlik to'planishi. Ko'pincha asimptomatik, ammo infeksiyalanishi (absess) mumkin — bu asosiy klinik xavf."
  },
  {
    "savol": "Orqa uretra valvalari (PUV) qaysi jinsda uchraydi?",
    "variantlar": ["Faqat qiz go'daklarda", "Faqat o'g'il go'daklarda", "Ikki jinsda ham teng", "Ko'proq qiz go'daklarda"],
    "togri": 1,
    "izoh": "PUV faqat erkak go'daklarda uchraydigan, orqa uretraga to'siq yasaydigan membranoz burmalar — anatomik jihatdan faqat o'g'il bolalarda mavjud bo'lishi mumkin."
  },
  {
    "savol": "PUV diagnostikasida 'kalit teshigi belgisi' (keyhole sign) nima?",
    "variantlar": ["DMSA skanda buyrak chaqig'ining aniq ko'rinishi", "UTTda kengaygan qovuq va orqa uretraning ko'rinishi", "VCUGda kontrast moddaning teskari yo'nalishda oqishi", "KTda buyrak jomidagi toshning aniq ko'rinishi"],
    "togri": 1,
    "izoh": "Prenatal UTT'da kengaygan qovuq va orqa uretraning birgalikdagi ko'rinishi 'kalit teshigi belgisi' deyiladi — PUV uchun kuchli gumon belgisi."
  },
  {
    "savol": "PUV davolanmasdan qolsa qanday oqibat bo'ladi?",
    "variantlar": ["O'z-o'zidan asta-sekin tuzalib ketadi", "Buyrak to'qimasi qaytmas zararlanishi mumkin", "Faqat siydik yo'li infeksiyasiga olib keladi", "Faqat gipospadiya anomaliyasiga olib keladi"],
    "togri": 1,
    "izoh": "PUV qovuqdan ortga bosim beradi → ikki tomonlama gidronefroz → buyrak to'qimasi qaytmas zararlanishi → CKD. Zudlik bilan endoskopik davolash zarur."
  },
  {
    "savol": "Gipospadiya qanchalik uchraydi?",
    "variantlar": ["1:5000 yangi tug'ilgan erkak", "1:300 yangi tug'ilgan erkak", "1:30,000 yangi tug'ilgan bola", "1:1200 yangi tug'ilgan erkak"],
    "togri": 1,
    "izoh": "Gipospadiya taxminan 1:300 yangi tug'ilgan erkak go'daklarda uchraydi — erkak go'daklardagi eng ko'p uchraydigan tug'ma uretra anomaliyasi."
  },
  {
    "savol": "Gipospadiyada uretra teshigi qayerda joylashadi?",
    "variantlar": ["Normal holatdan oldinda — glans uchida", "Normal holatdan orqaroqda — korpus bo'ylab", "Skrotum (moshonka) sohasida joylashadi", "Perineum sohasida, faqat og'ir shaklda"],
    "togri": 1,
    "izoh": "Gipospadiyada uretra teshigi normal holatdan (glans uchi) orqaroqda — distal, o'rta yoki proksimal joylashishi mumkin. Distal shakl eng ko'p uchraydi."
  },
  {
    "savol": "VUR — vezikouretal reflyuks nima?",
    "variantlar": ["Siydikning buyrakdan siydik yo'liga oqishi", "Siydikning qovuqdan siydik yo'liga teskari oqishi", "Siydikning uretra kanalida to'xtab qolishi", "Siydikning uretradan qovuqqa qaytib oqishi"],
    "togri": 1,
    "izoh": "VUR — siydikning qovuqdan siydik yo'liga teskari yo'nalishda oqishi. Asosiy mexanizm — qovuq devorida intramural segmentning etarlicha rivojlanmaganliği."
  },
  {
    "savol": "VUR xalqaro tasnifida I-daraja qanday tavsiflanadi?",
    "variantlar": ["Reflyuks buyrak jomigacha yetadi, kengayish yo'q", "Reflyuks siydik yo'liga kiradi, jomga yetmaydi", "Siydik yo'li va buyrak jomi yengil kengaygan", "Kuchli kengayish va siydik yo'lining buralishi"],
    "togri": 1,
    "izoh": "VUR I-daraja: reflyuks siydik yo'liga kirib, buyrak jomiga etib bormaydi va kengayish kuzatilmaydi — eng yengil daraja."
  },
  {
    "savol": "VUR V-daraja qanday tavsiflanadi?",
    "variantlar": ["Reflyuks faqat siydik yo'lida, kengayishsiz holat", "Buyrak jomigacha yetadi, ammo kengayish kuzatilmaydi", "O'rtacha kengayish va siydik yo'lining buralishi", "Kuchli kengayish, buralish, papilla izi yo'qolgan"],
    "togri": 3,
    "izoh": "VUR V-daraja: kuchli kengayish va buralish, buyrak papillalarining izi yo'qolgan — eng og'ir daraja, ko'pincha jarrohlik talab qiladi."
  },
  {
    "savol": "VURning asosiy klinik xavfi nima?",
    "variantlar": ["Siydik yo'lida yirik toshlarning hosil bo'lishi", "UTIda bakteriya buyrakka ko'tarilib chaqiq (scar) hosil", "Qovuq ekssrofiyasi anomaliyasining rivojlanishi", "Gidronefroz bilan asoratlanib buyrak kengayishi"],
    "togri": 1,
    "izoh": "VURning asosiy xavfi: UTI vaqtida bakteriyalar siydik yo'li orqali buyrakka ko'tariladi → pielonefrit → renal chaqiq (scar) → surunkali buyrak kasalligi."
  },
  {
    "savol": "VUR diagnostikasining 'oltin standarti' qaysi tekshiruv?",
    "variantlar": ["MAG3 diuretik renografiya", "DMSA izotop skanerlash", "Voiding cystourethrogram (VCUG)", "MR (magnit-rezonans) urografiya"],
    "togri": 2,
    "izoh": "VCUG — siydik chiqarish jarayonida qovuq va uretrani kontrastli rentgen bilan tekshirish — VUR diagnostikasining 'oltin standarti'."
  },
  {
    "savol": "Bolalarda VUR kuzatuvida VCUG o'rniga nima afzal ko'riladi?",
    "variantlar": ["Kompyuter tomografik (KT) urografiya", "Magnit-rezonans (MR) urografiya", "Radionuklid sistografiya (RNC)", "DMSA izotop skanerlash usuli"],
    "togri": 2,
    "izoh": "VCUG nurlanish beradi. Takroriy baholash uchun bolalarda radionuklid sistografiya (RNC) kamroq nurlanish beradi — shu sababli kuzatuvda afzal."
  },
  {
    "savol": "CAKUT diagnostikasida birinchi navbatdagi tekshiruv qaysi va nima uchun?",
    "variantlar": ["VCUG — reflyuksni bevosita ko'rsatib bergani uchun", "KT urografiya — eng aniq natija bergani uchun", "Ultratovush — nurlanishsiz, arzon, real vaqtda bo'lgani", "MAG3 renografiya — funksional ma'lumot bergani uchun"],
    "togri": 2,
    "izoh": "Ultratovush (UTT) CAKUT gumonida birinchi navbatdagi tekshiruv: nurlanish yo'q, arzon, real vaqtda, prenatal ham qo'llaniladi."
  },
  {
    "savol": "MAG3 diuretik renografiya qaysi holat uchun asosiy tekshiruv?",
    "variantlar": ["Vezikouretal reflyuks (VUR) darajasini aniqlash uchun", "Buyrak to'qimasidagi chaqiqlarni aniqlash uchun", "UPJ to'siqlanishi darajasi va buyrak funksiyasini baholash", "Gipospadiya anomaliyasi darajasini aniqlash uchun"],
    "togri": 2,
    "izoh": "MAG3 diuretik renografiya UPJ to'siqlanishi darajasini va buyrak oqim dinamikasini baholashda asosiy funktsional tekshiruv hisoblanadi."
  },
  {
    "savol": "DMSA skan qaysi holat uchun qo'llaniladi?",
    "variantlar": ["Vezikouretal reflyuks (VUR) diagnostikasi uchun", "Buyrak to'qimasi chaqiqlari va differensial funksiya", "UPJ to'siqlanishini jarrohlik bilan davolash uchun", "Orqa uretra valvalari (PUV) diagnostikasi uchun"],
    "togri": 1,
    "izoh": "DMSA skan buyrak to'qimasida chaqiqlarni (renal scar) nozik aniqlash va har bir buyrakning differensial (alohida) funksiyasini baholash uchun qo'llaniladi."
  },
  {
    "savol": "ALARA tamoyili nima va nima uchun bolalarda ayniqsa muhim?",
    "variantlar": ["Antibiotikni minimal dozada berish — infeksiya profilaktikasi", "Ion nurlanishini minimallashtirish — bolalar ko'p tekshiriladi", "Jarrohlik aralashuvini imkon qadar kechiktirish tamoyili", "Siydik tahlilini juda tez-tez o'tkazmaslik tamoyili"],
    "togri": 1,
    "izoh": "ALARA (As Low As Reasonably Achievable) — ion nurlanishini imkon qadar kamaytirish tamoyili. Bolalarda ayniqsa muhim, chunki ular umr davomida ko'p marta tekshirilishi va nurlanishning kumulyativ ta'siri bo'lishi mumkin."
  }
]$tugma_savollar$::jsonb
WHERE dars_slug = 'siydik-tanosil-tugma-anomaliyalar';
