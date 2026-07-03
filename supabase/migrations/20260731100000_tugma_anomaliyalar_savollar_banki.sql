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
    "variantlar": ["~10%", "~25%", "Yarmidan ko'pi", "Deyarli hammasi"],
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
    "variantlar": ["Metanefrik mezodermdan", "Mezonefrik kanaldan", "Pronefrik kanaldan", "Kloakadan"],
    "togri": 1,
    "izoh": "Ureter kurtagi mezonefrik (Wolff) kanalidan o'sib chiqib, buyrak yig'uvchi sistemasi, siydik yo'li va qovuqning bir qismiga aylanadi."
  },
  {
    "savol": "Metanefrik mezoderm ureter kurtagi bilan qanday aloqa orqali nefronlarga aylanadi?",
    "variantlar": ["Mexanik bosim orqali", "Induktiv aloqa orqali", "Qon ta'minoti orqali", "Gormonlar orqali"],
    "togri": 1,
    "izoh": "Metanefrik mezoderm va ureter kurtagi o'rtasidagi induktiv (reciprocal) aloqa nefronlar va buyrak stromasini hosil qiladi. Bu aloqa buzilsa — CAKUT yuzaga keladi."
  },
  {
    "savol": "Ureter kurtagi juda baland chiqsa qaysi anomaliya ehtimoli ortadi?",
    "variantlar": ["VUR", "Buyrak displaziyasi", "UPJO", "Gipospadiya"],
    "togri": 1,
    "izoh": "Ureter kurtagi juda baland chiqsa — buyrak displaziyasi, juda past chiqsa — vezikouretal reflyuks (VUR) ehtimoli ortadi."
  },
  {
    "savol": "Qovuq va uretra embrionda qaysi tuzilmadan shakllanadi?",
    "variantlar": ["Metanefrik mezodermdan", "Mezonefrik kanaldan", "Urogenital sinusdan", "Allantoisdan"],
    "togri": 2,
    "izoh": "Qovuq va uretra 4–6-haftada kloakaning urorektal septum tomonidan bo'linishi natijasida urogenital sinusdan shakllanadi."
  },
  {
    "savol": "Ikki tomonlama buyrak ageneziyasi (Potter sindromi) qanday oqibatga olib keladi?",
    "variantlar": ["Ko'pincha asimptomatik kechadi", "Kompensator gipertrofiya yuzaga keladi", "Amniotik suyuqlik yo'qligi va o'pka gipoplaziyasi — deyarli 100% o'lim", "Faqat CKD rivojlanadi"],
    "togri": 2,
    "izoh": "Ikki tomonlama ageneziyada buyraklar ishlamaydi → amniotik suyuqlik (oligogidroamnios) hosil bo'lmaydi → o'pka rivojlanmaydi (gipoplaziya) → deyarli 100% o'lim."
  },
  {
    "savol": "Bir tomonlama buyrak ageneziyasi qanchalik uchraydi va asosiy klinik oqibati nima?",
    "variantlar": ["1:5000; deyarli har doim o'lim bilan tugaydi", "1:1200; ko'pincha asimptomatik, 30% da uzoq muddatli CKD xavfi", "1:400; UPJ to'siqlanishi xavfi yuqori", "1:300; jarrohlik zarur"],
    "togri": 1,
    "izoh": "Bir tomonlama buyrak ageneziyasi 1:1200 uchraydi. Ko'pincha asimptomatik; qarama-qarshi buyrak kompensator gipertrofiyaga uchraydi, lekin 30% da CKD belgilari kuzatilishi mumkin."
  },
  {
    "savol": "Ektopik buyrak ko'pincha qayerda joylashadi?",
    "variantlar": ["Ko'krak qafasida", "Chanoqda", "Jigar ostida", "Taloq yonida"],
    "togri": 1,
    "izoh": "Ektopik buyrak embrion davrida to'g'ri ko'tarilmay chanoqda qolib ketadi. Ko'pincha aylanmagan (malrotated) va gidronefroz yoki toshlarga moyil bo'ladi."
  },
  {
    "savol": "Ot-nalcha buyrak (horseshoe kidney) qanchalik uchraydi va qaysi jinsda ko'proq?",
    "variantlar": ["1:1200; ayollarda ikki marta ko'proq", "1:400; erkaklarda ikki marta ko'proq", "1:5000; teng uchraydi", "1:900; faqat erkaklarda"],
    "togri": 1,
    "izoh": "Ot-nalcha buyrak 1:400 uchraydi — eng keng tarqalgan qo'shilish anomaliyasi. Erkaklarda ayollarga nisbatan ikki marta ko'proq uchraydi."
  },
  {
    "savol": "Ot-nalcha buyrakda isthmus (birlashgan to'qima) qayerda joylashib, ko'tarilishni to'xtatadi?",
    "variantlar": ["Jigar ostida, o'ng buyrak venasi darajasida", "Aorta oldida, past chayrali arteriya darajasida", "Diafragma ostida, qorin aortasi bifurkatsiyasida", "Qovuq ustida, siydik yo'li kirish joyi yonida"],
    "togri": 1,
    "izoh": "Isthmus aorta oldida, past chayrali arteriya (arteria mesenterica inferior) darajasida ko'tarilishni mexanik tarzda to'xtatib qoladi."
  },
  {
    "savol": "Ot-nalcha buyrak bilan qaysi asoratlar ko'proq birga uchraydi?",
    "variantlar": ["Sistit va prostatit", "UPJ to'siqlanishi, siydik yo'li toshlari va VUR", "Buyrak displaziyasi va ADPKD", "Gipospadiya va epispadiya"],
    "togri": 1,
    "izoh": "Ot-nalcha buyrakda UPJ to'siqlanishi 13–34%, siydik yo'li toshlari va VUR bilan birga uchraydi. Ko'pchilik hollarda asimptomatik."
  },
  {
    "savol": "Buyrak displaziyasining eng og'ir ko'rinishi — MCDK nima?",
    "variantlar": ["Buyrakda bir nechta katta kista bo'lib, qolgan to'qima normal ishlaydi", "Buyrak faoliyatsiz kistalar majmuasiga aylanadi, ko'pincha spontan invülosiyaga uchraydi", "Ikki tomonlama politistik buyrak kasalligi", "Buyrak to'qimasining to'liq fibrozi"],
    "togri": 1,
    "izoh": "MCDK (multicystic dysplastic kidney) — buyrak faoliyatsiz kistalar majmuasiga aylanadi. Ko'pincha bir tomonlama, spontan invülosiyaga uchraydi."
  },
  {
    "savol": "ADPKD (autosomal dominant politistik buyrak kasalligi) qaysi gen mutatsiyasi bilan bog'liq?",
    "variantlar": ["PAX2 geni", "PKD1/PKD2 genlari", "WT1 geni", "HNF1B geni"],
    "togri": 1,
    "izoh": "ADPKD PKD1 va PKD2 gen mutatsiyalari bilan bog'liq. Ko'pincha 30–50 yoshda belgilanadi va buyrak yetishmovchiligiga olib kelishi mumkin."
  },
  {
    "savol": "ARPKD (autosomal retsessiv politistik buyrak kasalligi) qanchalik uchraydi va eng og'ir oqibati nima?",
    "variantlar": ["1:400; faqat kattalar uchun xavfli", "1:20,000; og'ir shaklida yangi tug'ilganda o'pka gipoplaziyasi va buyrak yetishmovchiligi", "1:1200; asimptomatik kechadi", "1:5000; faqat surunkali buyrak kasalligiga olib keladi"],
    "togri": 1,
    "izoh": "ARPKD 1:20,000 uchraydi. Og'ir shaklida yangi tug'ilganda o'pka gipoplaziyasi va buyrak yetishmovchiligi kuzatiladi."
  },
  {
    "savol": "MCDK va UPJ to'siqlanishini farqlash uchun qaysi tekshiruv tavsiya etiladi?",
    "variantlar": ["VCUG", "MAG3 diuretik renografiya", "KT urografiya", "Oddiy qorin rentgeni"],
    "togri": 1,
    "izoh": "MCDK va UPJO prenatal UTT'da o'xshash ko'rinishi mumkin. Postnatal MAG3 diuretik renografiya buyrak funksiyasi va oqim dinamikasini baholab, ikkalasini farqlaydi."
  },
  {
    "savol": "UPJ to'siqlanishining (UPJO) eng ko'p sababi nima?",
    "variantlar": ["Tashqi bosim — kesib o'tuvchi tomir", "Ichki tor — apristaltik segment (intrinsik stenoz)", "VUR natijasida siydik yo'li kengayishi", "Buyrak toshi"],
    "togri": 1,
    "izoh": "UPJO ning eng ko'p sababi ichki tor — apristaltik segment (intrinsik stenoz). Tashqi bosim (kesib o'tuvchi tomir) va yuqori kirish nuqtasi ham sabab bo'lishi mumkin."
  },
  {
    "savol": "UPJO davolashda 'oltin standart' jarrohlik usuli qaysi?",
    "variantlar": ["Nefrektomiya", "Piyeloplastika (pyeloplasty)", "Uretroskopiya", "Lazer litotripsi"],
    "togri": 1,
    "izoh": "Piyeloplastika — buyrak jomi va siydik yo'lini qayta birlashtiruvchi jarrohlik amaliyoti — UPJO davolashning 'oltin standarti' hisoblanadi."
  },
  {
    "savol": "Weigert-Meyer qoidasiga ko'ra duplikat tizimda yuqori qutb uretri qayerga kiradi?",
    "variantlar": ["Qovuqqa yuqoriroqda va lateralroqda", "Qovuqqa pastroqda va mediaroqda", "To'g'ridan-to'g'ri uretraga", "Prostata bez to'qimasiga"],
    "togri": 1,
    "izoh": "Weigert-Meyer qoidasi: yuqori qutb uretri qovuqqa pastroqda va mediaroqda kiradi; pastki qutb uretri esa normal holatga yaqinroq kiradi."
  },
  {
    "savol": "Duplikat tizimda qaysi qutb uretri VURga ko'proq moyil?",
    "variantlar": ["Yuqori qutb", "Pastki qutb", "Ikkisi teng", "Hech qaysisi moyil emas"],
    "togri": 1,
    "izoh": "Pastki qutb uretri trigonga yaqinroq, nisbatan qisqaroq intramural segmentga ega bo'lgani uchun VURga moyilroq. Yuqori qutb uretri esa ektopik yoki ureterotselga moyil."
  },
  {
    "savol": "Ureterotsel (ureterocele) nima?",
    "variantlar": ["Siydik yo'lining to'liq yo'qligi", "Siydik yo'lining distal qismining sista kabi kengayishi", "Siydik yo'lining ikkilanishi", "Siydik yo'lining teskari joylashishi"],
    "togri": 1,
    "izoh": "Ureterotsel — siydik yo'lining distal (intravesikal) qismining balonsimon kengayishi. Ko'pincha duplikat tizimning yuqori qutb uretri bilan bog'liq."
  },
  {
    "savol": "Ektopik ureterning ayollarda klassik belgisi nima?",
    "variantlar": ["Qonli siydik", "Qovuq tutish saqlangan holda doimiy siydik tomchilashi", "Siydik chiqarishda kuchlanish", "Tez-tez siydik qilish"],
    "togri": 1,
    "izoh": "Ektopik ureter trigondan tashqarida, masalan vaginaga kirsa, sfinkterdan past bo'ladi — qovuq tutish saqlangan holda doimiy tomchilash kuzatiladi. Bu klassik belgi."
  },
  {
    "savol": "Qovuq ekssrofiyasi qanchalik uchraydi va qaysi anomaliya bilan birga kechadi?",
    "variantlar": ["1:5000; gipospadiya bilan", "1:30,000; erkakda epispadiya bilan", "1:1200; VUR bilan", "1:400; UPJO bilan"],
    "togri": 1,
    "izoh": "Qovuq ekssrofiyasi 1:30,000 uchraydi. Erkakda qovuq oldingi devori ochiq bo'lib, dorsal tomondan joylashgan uretra teshigi (epispadiya) bilan birga kechadi."
  },
  {
    "savol": "Patent urachus (urachal fistula) qanday belgi beradi?",
    "variantlar": ["Qorin og'rig'i va isitma", "Kindikdan siydik oqishi", "Siydik tutolmaslik", "Qorin bo'shlig'ida suyuqlik to'planishi"],
    "togri": 1,
    "izoh": "Patent urachus — urachus yopilmay qolsa, qovuqdan kindikka kanal ochiq qoladi. Klassik belgi: kindikdan siydik oqishi."
  },
  {
    "savol": "Urachus kistasining asosiy klinik xavfi nima?",
    "variantlar": ["Siydik tutolmaslik", "Ko'pincha infeksiyalanishi mumkin", "Buyrak toshi hosil bo'lishi", "Spontan yo'qolishi mumkin emas"],
    "togri": 1,
    "izoh": "Urachus kistasi — ikki tomondan yopiq, o'rtada suyuqlik to'planishi. Ko'pincha asimptomatik, ammo infeksiyalanishi (absess) mumkin — bu asosiy klinik xavf."
  },
  {
    "savol": "Orqa uretra valvalari (PUV) qaysi jinsda uchraydi?",
    "variantlar": ["Faqat qizlarda", "Faqat o'g'il bolalarda", "Ikki jinsda teng", "Ko'proq qizlarda"],
    "togri": 1,
    "izoh": "PUV faqat erkak go'daklarda uchraydigan, orqa uretraga to'siq yasaydigan membranoz burmalar — anatomik jihatdan faqat o'g'il bolalarda mavjud bo'lishi mumkin."
  },
  {
    "savol": "PUV diagnostikasida 'kalit teshigi belgisi' (keyhole sign) nima?",
    "variantlar": ["DMSA skanda buyrak chaqig'ining ko'rinishi", "Ultratovushda kengaygan qovuq va orqa uretraning birgalikdagi ko'rinishi", "VCUG da kontrast moddaning teskari oqishi", "KT'da buyrak toshining ko'rinishi"],
    "togri": 1,
    "izoh": "Prenatal UTT'da kengaygan qovuq va orqa uretraning birgalikdagi ko'rinishi 'kalit teshigi belgisi' deyiladi — PUV uchun kuchli gumon belgisi."
  },
  {
    "savol": "PUV davolanmasdan qolsa qanday oqibat bo'ladi?",
    "variantlar": ["O'z-o'zidan tuzalib ketadi", "Buyrak to'qimasi qaytmas zararlanishi mumkin", "Faqat siydik yo'li infeksiyasiga olib keladi", "Faqat gipospadiyaga olib keladi"],
    "togri": 1,
    "izoh": "PUV qovuqdan ortga bosim beradi → ikki tomonlama gidronefroz → buyrak to'qimasi qaytmas zararlanishi → CKD. Zudlik bilan endoskopik davolash zarur."
  },
  {
    "savol": "Gipospadiya qanchalik uchraydi?",
    "variantlar": ["1:5000 yangi tug'ilgan erkak", "1:300 yangi tug'ilgan erkak", "1:30,000 yangi tug'ilgan", "1:1200 yangi tug'ilgan erkak"],
    "togri": 1,
    "izoh": "Gipospadiya taxminan 1:300 yangi tug'ilgan erkak go'daklarda uchraydi — erkak go'daklardagi eng ko'p uchraydigan tug'ma uretra anomaliyasi."
  },
  {
    "savol": "Gipospadiyada uretra teshigi qayerda joylashadi?",
    "variantlar": ["Normal holatdan oldinda — glanste", "Normal holatdan orqaroqda — korpus bo'ylab", "Skrotumda", "Perineumda, faqat og'ir shaklda"],
    "togri": 1,
    "izoh": "Gipospadiyada uretra teshigi normal holatdan (glans uchi) orqaroqda — distal, o'rta yoki proksimal joylashishi mumkin. Distal shakl eng ko'p uchraydi."
  },
  {
    "savol": "VUR — vezikouretal reflyuks nima?",
    "variantlar": ["Siydikning buyrakdan siydik yo'liga oqishi", "Siydikning qovuqdan siydik yo'liga teskari yo'nalishda oqishi", "Siydikning uretrada to'xtatilishi", "Siydikning uretradan qovuqqa qaytishi"],
    "togri": 1,
    "izoh": "VUR — siydikning qovuqdan siydik yo'liga teskari yo'nalishda oqishi. Asosiy mexanizm — qovuq devorida intramural segmentning etarlicha rivojlanmaganliği."
  },
  {
    "savol": "VUR xalqaro tasnifida I-daraja qanday tavsiflanadi?",
    "variantlar": ["Reflyuks buyrak jomigacha yetadi, kengayish yo'q", "Reflyuks siydik yo'liga kiradi, buyrak jomiga etmaydi, kengayish yo'q", "Siydik yo'li va buyrak jomi yengil kengaygan", "Kuchli kengayish va buralish"],
    "togri": 1,
    "izoh": "VUR I-daraja: reflyuks siydik yo'liga kirib, buyrak jomiga etib bormaydi va kengayish kuzatilmaydi — eng yengil daraja."
  },
  {
    "savol": "VUR V-daraja qanday tavsiflanadi?",
    "variantlar": ["Reflyuks faqat siydik yo'lida, kengayishsiz", "Buyrak jomigacha yetadi, kengayish yo'q", "O'rtacha kengayish, siydik yo'li buralgan", "Kuchli kengayish va buralish, buyrak papillalari izi yo'qolgan"],
    "togri": 3,
    "izoh": "VUR V-daraja: kuchli kengayish va buralish, buyrak papillalarining izi yo'qolgan — eng og'ir daraja, ko'pincha jarrohlik talab qiladi."
  },
  {
    "savol": "VURning asosiy klinik xavfi nima?",
    "variantlar": ["Siydik yo'li toshlari hosil bo'lishi", "UTI vaqtida bakteriyalar buyrakka ko'tarilib, renal chaqiq (scar) hosil qilishi", "Qovuq ekssrofiyasi rivojlanishi", "Gidronefroz bilan asoratlanishi"],
    "togri": 1,
    "izoh": "VURning asosiy xavfi: UTI vaqtida bakteriyalar siydik yo'li orqali buyrakka ko'tariladi → pielonefrit → renal chaqiq (scar) → surunkali buyrak kasalligi."
  },
  {
    "savol": "VUR diagnostikasining 'oltin standarti' qaysi tekshiruv?",
    "variantlar": ["MAG3 diuretik renografiya", "DMSA skan", "Voiding cystourethrogram (VCUG)", "MR urografiya"],
    "togri": 2,
    "izoh": "VCUG — siydik chiqarish jarayonida qovuq va uretrani kontrastli rentgen bilan tekshirish — VUR diagnostikasining 'oltin standarti'."
  },
  {
    "savol": "Bolalarda VUR kuzatuvida VCUG o'rniga nima afzal ko'riladi?",
    "variantlar": ["KT urografiya", "MR urografiya", "Radionuklid sistografiya (RNC)", "DMSA skan"],
    "togri": 2,
    "izoh": "VCUG nurlanish beradi. Takroriy baholash uchun bolalarda radionuklid sistografiya (RNC) kamroq nurlanish beradi — shu sababli kuzatuvda afzal."
  },
  {
    "savol": "CAKUT diagnostikasida birinchi navbatdagi tekshiruv qaysi va nima uchun?",
    "variantlar": ["VCUG — reflyuksni to'g'ridan-to'g'ri ko'rsatgani uchun", "KT urografiya — eng aniq bo'lgani uchun", "Ultratovush — nurlanishsiz, arzon, real vaqtda bo'lgani uchun", "MAG3 — funksional ma'lumot beradi"],
    "togri": 2,
    "izoh": "Ultratovush (UTT) CAKUT gumonida birinchi navbatdagi tekshiruv: nurlanish yo'q, arzon, real vaqtda, prenatal ham qo'llaniladi."
  },
  {
    "savol": "MAG3 diuretik renografiya qaysi holat uchun asosiy tekshiruv?",
    "variantlar": ["VUR darajasini aniqlash uchun", "Buyrak chaqiqlarini aniqlash uchun", "UPJ to'siqlanishi darajasini va buyrak funksiyasini baholash uchun", "Gipospadiya darajasini aniqlash uchun"],
    "togri": 2,
    "izoh": "MAG3 diuretik renografiya UPJ to'siqlanishi darajasini va buyrak oqim dinamikasini baholashda asosiy funktsional tekshiruv hisoblanadi."
  },
  {
    "savol": "DMSA skan qaysi holat uchun qo'llaniladi?",
    "variantlar": ["VUR diagnostikasi uchun", "Buyrak to'qimasi chaqiqlari va differensial funksiyani aniqlash uchun", "UPJ to'siqlanishini davolash uchun", "PUV diagnostikasi uchun"],
    "togri": 1,
    "izoh": "DMSA skan buyrak to'qimasida chaqiqlarni (renal scar) nozik aniqlash va har bir buyrakning differensial (alohida) funksiyasini baholash uchun qo'llaniladi."
  },
  {
    "savol": "ALARA tamoyili nima va nima uchun bolalarda ayniqsa muhim?",
    "variantlar": ["Antibiotikni minimal dozada berish tamoyili — infeksiyani oldini olish uchun", "Ion nurlanishini imkon qadar minimallashtirish tamoyili — bolalar umr davomida ko'p marta tekshirilishi mumkin", "Jarrohlik aralashuvini kechiktirish tamoyili", "Siydik tahlilini tez-tez o'tkazmaslik tamoyili"],
    "togri": 1,
    "izoh": "ALARA (As Low As Reasonably Achievable) — ion nurlanishini imkon qadar kamaytirish tamoyili. Bolalarda ayniqsa muhim, chunki ular umr davomida ko'p marta tekshirilishi va nurlanishning kumulyativ ta'siri bo'lishi mumkin."
  }
]$tugma_savollar$::jsonb
WHERE dars_slug = 'siydik-tanosil-tugma-anomaliyalar';
