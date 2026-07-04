UPDATE dars_tarkibi
SET savollar_banki = $orxo_savollar$[
  {
    "savol": "Epididimit qanday ta'riflanadi?",
    "variantlar": ["Moyakning izolyatsiyalangan yallig'lanishi (orxit)", "Epididimisning og'riq, shish va yallig'lanish holati", "Prostata bezining o'tkir bakterial yallig'lanishi", "Skrotum terisining shikastlanishi va yallig'lanishi"],
    "togri": 1,
    "izoh": "Epididimit — epididimisning og'riq, shish va yallig'lanishi. Agar moyak ham jalb bo'lsa — orxoepididimit. Alohida moyak yallig'lanishi (orxit) kamroq uchraydi."
  },
  {
    "savol": "Orxoepididimit nima?",
    "variantlar": ["Faqat epididimisning izolyatsiyalangan yallig'lanishi", "Faqat moyakning izolyatsiyalangan yallig'lanishi", "Epididimis va moyakning birgalikda yallig'lanishi", "Prostata va epididimisning birgalikda yallig'lanishi"],
    "togri": 2,
    "izoh": "Orxoepididimit — epididimis va moyakning birgalikda yallig'lanishi. Epididimit zo'rayib moyakka o'tganda yoki moyak ham birlamchi jalb bo'lganda shakllanadi."
  },
  {
    "savol": "AQShda yiliga ambulatoria amaliyotda epididimit qancha holat qayd etiladi?",
    "variantlar": ["100,000 dan ortiq", "600,000 dan ortiq", "1 million dan ortiq", "50,000 dan ortiq"],
    "togri": 1,
    "izoh": "AQShda yiliga ambulatoria amaliyotda 600,000 dan ortiq epididimit holati qayd etiladi. Tarqalish chastotasi: 10,000 kishi-yilida 25–65 ta holat."
  },
  {
    "savol": "O'tkir skrotal og'riqda dastlabki va eng muhim qadam nima?",
    "variantlar": ["Darhol keng spektrli antibiotik terapiyani boshlash", "Skrotum ultratovush tekshiruvini o'tkazish", "Moyak torsiyasini birinchi navbatda istisno qilish", "Siydik ekinmasi uchun namuna olib yuborish"],
    "togri": 2,
    "izoh": "O'tkir skrotal og'riqda DASTLABKI QADAM — moyak torsiyasini istisno qilish. Torsiya jarrohlik shoshilinchi: 6 soat ichida davolanmasa 90–100%, 24 soatdan keyin faqat 10% saqlanib qolish ehtimoli."
  },
  {
    "savol": "Moyak torsiyasida 6 soat ichida davolanmasa moyak saqlanib qolish ehtimoli qancha?",
    "variantlar": ["10%", "50%", "70%", "90–100%"],
    "togri": 3,
    "izoh": "Moyak torsiyasida 6 soat ichida davolanmasa moyak saqlanib qolish ehtimoli 90–100%. 24 soatdan keyin esa bu ko'rsatkich faqat 10% ga tushadi. Torsiya — jarrohlik shoshilinchi."
  },
  {
    "savol": "Epididimitda infeksiya ko'pincha qaysi yo'l bilan epididimisga tarqaladi?",
    "variantlar": ["Qon oqimi orqali (gematogen yo'l)", "Uretradan ko'tariluvchi yo'l (asending)", "Limfa tomirlari orqali (limfogen yo'l)", "To'g'ridan-to'g'ri trauma orqali kirish"],
    "togri": 1,
    "izoh": "Infeksiya ko'pincha uretradan ko'tariluvchi yo'l orqali epididimisga tarqaladi. 1927-yilda Campbell tomonidan tasvirlangan; keyingi tadqiqotlarda uretral va epididimal izolyatlar o'rtasida ~80% moslik aniqlangan."
  },
  {
    "savol": "35 yoshdan kichik jinsiy faol erkaklarda epididimitning asosiy qo'zg'atuvchilari qaysilar?",
    "variantlar": ["E. coli va Klebsiella (enterik organizmlar)", "C. trachomatis va N. gonorrhoeae (JYYI)", "Pseudomonas va Proteus (uropatogenlar)", "Mycobacterium tuberculosis (sil tayoqchasi)"],
    "togri": 1,
    "izoh": "35 yoshdan kichik jinsiy faol erkaklarda asosiy qo'zg'atuvchilar — C. trachomatis va N. gonorrhoeae. Bu yoshda barcha bemorlarda JYYIga skrining majburiy."
  },
  {
    "savol": "35 yoshdan katta erkaklarda epididimitning asosiy qo'zg'atuvchilari qaysilar?",
    "variantlar": ["C. trachomatis va N. gonorrhoeae (jinsiy JYYI)", "Uropatogenlar — E. coli, Pseudomonas, Klebsiella", "Parotit (mumps) virusi va boshqa viruslar", "Mycobacterium tuberculosis (sil qo'zg'atuvchisi)"],
    "togri": 1,
    "izoh": "35 yoshdan katta erkaklarda asosiy qo'zg'atuvchilar — uropatogenlar (E. coli, Pseudomonas, Klebsiella). Xavf omillari: BPH, uretra torayishi, siydik yo'li instrumentatsiyasi."
  },
  {
    "savol": "Pilatz va boshqalarning tadqiqotida 35 yoshdan kichik bemorlarda qancha foizida enterik organizmlar aniqlangan?",
    "variantlar": ["5%", "15%", "42%", "70%"],
    "togri": 2,
    "izoh": "Pilatz tadqiqotida 35 yoshdan kichik bemorlarda 42% da enterik organizmlar aniqlangan — bu '35 yoshdan kichik = faqat JYYI' qoidasining qat'iy emas ekanini ko'rsatadi. Barcha faol bemorlarda skrining kerak."
  },
  {
    "savol": "Viral epididimit/orxitning eng keng tarqalgan sababi qaysi virus?",
    "variantlar": ["Herpes simplex virusi (HSV-2)", "SARS-CoV-2 (koronavirus)", "Epshteyn-Barr virusi (EBV)", "Parotit (mumps) virusi"],
    "togri": 3,
    "izoh": "Parotit (mumps) virusi — viral orxitning eng keng tarqalgan sababi. Parotit orxiti moyak atrofiyasi va subfertillikka olib kelishi mumkin."
  },
  {
    "savol": "O'tkir epididimitda og'riq qaysi yerdan boshlanadi?",
    "variantlar": ["Moyakning markaziy o'rta qismidan boshlanadi", "Epididimis quyrug'idan (cauda), keyin moyakka tarqaladi", "Skrotum terisi yuzasidan boshlanib ichkariga o'tadi", "Qorinning pastki qismidan chov orqali pastga tushadi"],
    "togri": 1,
    "izoh": "Og'riq odatda epididimisning quyruq qismida (cauda) boshlanib, asta-sekin qolgan epididimis va moyakka tarqaladi. Bu anatomik yo'nalish asending infeksiyani tasdiqlaydi."
  },
  {
    "savol": "O'tkir epididimitda Pilatz tadqiqotiga ko'ra qancha foizida isitma kuzatilgan?",
    "variantlar": ["5%", "26%", "50%", "80%"],
    "togri": 1,
    "izoh": "Pilatz tadqiqotida 26% bemorlarda isitma (38°C dan yuqori) kuzatilgan. Isitma moyak torsiyasida odatda bo'lmaydi — bu farqlovchi belgilardan biri."
  },
  {
    "savol": "O'tkir epididimitda holatlarning qancha foizi bir tomonlama bo'ladi?",
    "variantlar": ["50%", "70%", "90%", "96%"],
    "togri": 3,
    "izoh": "O'tkir epididimit holatlarining 96% da bir tomonlama kuzatiladi. Ikki tomonlama epididimit kamroq uchraydi va boshqa sabablarni o'ylash kerak."
  },
  {
    "savol": "Prehn belgisi (Prehn sign) nima va u qanday ahamiyatga ega?",
    "variantlar": ["Kremasterik refleks yo'qolishi — moyak torsiyasi belgisiga ishora", "Skrotum ko'tarilganda og'riq kamaymay qolsa — torsiyaga ishora qiladi", "Skrotum ko'tarilganda og'riq kamaysa — epididimit belgisi (yolg'iz emas)", "Doppler UTTda qon oqimi kuchayishi — epididimitning bevosita belgisi"],
    "togri": 2,
    "izoh": "Prehn belgisi: skrotumni ko'tarishda og'riq kamaysa — epididimitga ishora (torsiyada foyda yo'q yoki og'riq kuchayadi). Ammo bu belgi yetarli aniqlikka ega emas — mustaqil diagnostik mezon sifatida ishlatilmasligi kerak."
  },
  {
    "savol": "Moyak torsiyasida kremasteric refleks odatda qanday bo'ladi?",
    "variantlar": ["Sezilarli darajada kuchaygan bo'ladi", "O'zgarishsiz saqlanib qoladi (normal)", "Ko'pincha yo'qoladi — muhim klinik belgi", "Umuman o'zgarmasdan qolaveradi"],
    "togri": 2,
    "izoh": "Kremasteric refleks moyak torsiyasida ko'pincha yo'q bo'ladi — bu muhim klinik belgi. Epididimitda esa odatda saqlanib qoladi."
  },
  {
    "savol": "Moyak torsiyasida og'riq qanday boshlanadi?",
    "variantlar": ["Asta-sekin, soatlar yoki kunlar davomida kuchayadi", "To'satdan va keskin — daqiqalar ichida boshlanadi", "Faqat jismoniy harakat paytida paydo bo'ladi", "Faqat siydik chiqarish paytida seziladi"],
    "togri": 1,
    "izoh": "Moyak torsiyasida og'riq to'satdan, keskin boshlanadi — daqiqalar ichida. Epididimitda esa asta-sekin, soatlar yoki kunlar davomida rivojlanadi. Bu farq klinik ahamiyatga ega."
  },
  {
    "savol": "Doppler ultratovushda epididimit va moyak torsiyasini qanday farqlash mumkin?",
    "variantlar": ["Epididimitda qon oqimi kamayadi; torsiyada aksincha kuchayadi", "Epididimitda qon oqimi kuchayadi (hiperemiya); torsiyada kamayadi", "Ikkala holatda ham qon oqimi mutlaqo bir xil bo'lib qoladi", "Doppler ultratovush bu ikki holatni umuman farqlay olmaydi"],
    "togri": 1,
    "izoh": "Doppler ultratovushda: epididimitda kuchaygan qon oqimi (hiperemiya); moyak torsiyasida kamaygan yoki yo'q qon oqimi. Ammo normal qon oqimi ham torsiyani istisno qilmaydi."
  },
  {
    "savol": "\"Manfiy ultratovush torsiyani yo'q qilmaydi\" tamoyili nimani anglatadi?",
    "variantlar": ["Ultratovush umuman keraksiz, ortiqcha tekshiruv ekanini", "Qon oqimi normal ko'rinsa ham kuchli shubhada jarrohlik kerakligini", "Ultratovush har doim torsiyani aniq aniqlab berishini", "Manfiy ultratovushda operatsiya butunlay shart emasligini"],
    "togri": 1,
    "izoh": "Doppler ultratovushda qon oqimi normal yoki kuchaygan ko'rinsa ham torsiyani to'liq istisno qilib bo'lmaydi. Klinik shubha kuchli bo'lganda ultratovush natijasiga qaramasdan shoshilinch jarrohlik konsultatsiyasi kerak."
  },
  {
    "savol": "Epididimitni tasdiqlash uchun CDC 2021 mezonlaridan biri qaysi?",
    "variantlar": ["Qon ekinmasida qo'zg'atuvchi bakteriyaning topilishi", "Uretra Gram bo'yog'ida ≥2 leykotsit/immersion maydoni", "Ultratovushda epididimis hajmining kattalashishi", "Tana haroratining 38°C dan yuqori bo'lishi (isitma)"],
    "togri": 1,
    "izoh": "CDC 2021 epididimit mezonlari (kamida bittasi kerak): uretra surtmasida ≥2 WBC/HPF; birinchi qism siydikda leykotsit esteraza musbat; yoki birinchi qism siydikda ≥10 leykotsit/HPF."
  },
  {
    "savol": "Epididimitda NAAT nima uchun o'tkaziladi va qaysi namuna qo'llaniladi?",
    "variantlar": ["Siydik enterik bakteriyalarini aniqlash; o'rta qism siydik", "C. trachomatis va N. gonorrhoeae aniqlash; birinchi qism siydik", "Viral infeksiya qo'zg'atuvchisini aniqlash; venoz qon namunasi", "Enterik organizmlarni aniqlash; najas (ahlat) namunasi"],
    "togri": 1,
    "izoh": "NAAT barcha epididimit gumonlarida C. trachomatis va N. gonorrhoeae aniqlash uchun o'tkaziladi. Birinchi qism siydik yoki uretra surtmasi — afzal namuna."
  },
  {
    "savol": "Doppler ultratovush epididimitda asosan nima uchun qo'llaniladi?",
    "variantlar": ["Epididimit tashxisini bevosita tasdiqlash maqsadida", "Torsiya va absessni istisno qilish — tasdiqlash uchun emas", "Mos antibiotikni to'g'ri tanlab olish maqsadida", "Qondagi PSA darajasini aniqlab olish maqsadida"],
    "togri": 1,
    "izoh": "Ultratovush epididimitni tasdiqlash uchun emas — torsiya, absess yoki infarktni istisno qilish uchun qo'llaniladi. Klinik belgilar epididimit tashxisi uchun yetarli. Salbiy ultratovush klinik menejmentni o'zgartirmaydi."
  },
  {
    "savol": "Epididimitda simptomatik davolash qanday amalga oshiriladi?",
    "variantlar": ["Kechiktirmasdan darhol jarrohlik aralashuvi qilish", "Yotoq rejimi, skrotumni ko'tarish, sovutish va NSAIDlar", "Faqat og'iz orqali antibiotikning o'zi bilan davolash", "Birinchi tanlov sifatida kortikosteroidlar buyurish"],
    "togri": 1,
    "izoh": "Simptomatik davo: posteli rejimi, skrotumni ko'tarish (elevation) va mahalliy sovutish og'riqni yengillashtiradi. NSAIDlar foydali. Ko'pchilik ambulatoria davolanadi."
  },
  {
    "savol": "Xlamidiya yoki gonorey sababli epididimitda CDC 2021 tavsiyasi bo'yicha davolash sxemasi qaysi?",
    "variantlar": ["Faqat doksisiklin 100 mg × 2/kun, 7 kunlik kurs bilan", "Seftriakson 500 mg IM + doksisiklin 100 mg × 2/kun, 10 kun", "Azitromitsin 1 g bir martalik yagona doza sifatida", "Levofloksatsin 500 mg/kun, 7 kunlik kurs sifatida"],
    "togri": 1,
    "izoh": "JYYI sababli epididimitda CDC 2021: seftriakson 500 mg IM yagona doza + doksisiklin 100 mg × 2/kun, 10 kun. Og'irligi ≥150 kg da seftriakson 1 g beriladi."
  },
  {
    "savol": "Anal jinsiy aloqa bilan bog'liq epididimitda (xlamidiya, gonorey yoki enterik organizmlar) qaysi sxema tavsiya etiladi?",
    "variantlar": ["Faqat doksisiklin 100 mg × 2/kun, 14 kunlik kurs bilan", "Seftriakson 500 mg IM + levofloksatsin 500 mg/kun, 10 kun", "Faqat azitromitsin 1 g bir martalik yagona doza bilan", "Amoksitsillin + klavulanat 875 mg × 2/kun, 10 kun bilan"],
    "togri": 1,
    "izoh": "Anal jinsiy aloqa bilan bog'liq epididimitda (enterik organizmlar ham mumkin): seftriakson 500 mg IM yagona doza + levofloksatsin 500 mg/kun, 10 kun — CDC 2021 tavsiyasi."
  },
  {
    "savol": "Faqat enterik organizmlar sababli epididimitda (gonorey istisno qilingan) qaysi davo tavsiya etiladi?",
    "variantlar": ["Seftriakson 500 mg IM + doksisiklin 100 mg, 10 kun", "Levofloksatsin 500 mg/kun, 10 kunlik kurs bilan", "Azitromitsin 1 g bir martalik yagona doza sifatida", "Nitrofurantoin 100 mg × 2/kun, 5 kunlik kurs bilan"],
    "togri": 1,
    "izoh": "Gonorey istisno qilingan va faqat enterik organizmlar (E. coli va h.k.) bilan bog'liq epididimitda: levofloksatsin 500 mg/kun, 10 kun — CDC 2021 tavsiyasi."
  },
  {
    "savol": "Epididimitda antibiotikka javob bermaganida 72 soatda qanday qadam qo'yiladi?",
    "variantlar": ["Hech qanday tekshiruvsiz antibiotikni darhol almashtirish", "Qayta baholash majburiy; UTT — absess va infarktni istisno", "Tekshiruvsiz bemorni zudlik bilan kasalxonaga yotqizish", "Tekshiruvsiz to'g'ridan-to'g'ri jarrohlik konsultatsiyasi"],
    "togri": 1,
    "izoh": "72 soatda simptomlar yaxshilanmasa — qayta baholash majburiy. Ultratovush — absess yoki moyak infarkti istisno qilish uchun o'tkaziladi. Ftorokinolonga rezistentlikni inobatga olish kerak."
  },
  {
    "savol": "Bemorga o'tkir epididimitda qanday ma'lumot berish kerak?",
    "variantlar": ["Kasallik atigi 1–2 kun ichida to'liq tuzalib ketadi", "Og'riq 1–3 kunda kamayadi, ammo shish 2–4 hafta saqlanadi", "Antibiotik to'xtatilishi bilanoq darhol butunlay tuzaladi", "Bir necha soat ichida barcha belgilar butunlay yo'qoladi"],
    "togri": 1,
    "izoh": "O'tkir og'riq 1–3 kunda yaxshilanishi mumkin, ammo yallig'lanish belgilari (shish, diskomfort) 2–4 hafta davomida to'liq yo'qolmaydi — bemorga buni oldindan tushuntirish uyda noto'g'ri xavotirni oldini oladi."
  },
  {
    "savol": "C. trachomatis yoki N. gonorrhoeae tasdiqlanganda jinsiy hamrohlar bilan nima qilish kerak?",
    "variantlar": ["Hech qanday qo'shimcha chora ko'rish talab etilmaydi", "Jinsiy hamrohlar ham baholash va davolashga yuboriladi", "Faqat bemorning o'zi davolanadi, hamrohlar tekshirilmaydi", "Hamrohlarga profilaktik antibiotik umuman buyurilmaydi"],
    "togri": 1,
    "izoh": "JYYI tasdiqlanganda jinsiy hamrohlar ham baholash va davolash uchun yuborilishi shart — infeksiyaning tarqalishini oldini olish va qayta infeksiyadan himoya qilish uchun."
  },
  {
    "savol": "Surunkali epididimit qanday ta'riflanadi?",
    "variantlar": ["Bir hafta davom etuvchi o'tkir skrotal og'riq holati", "Kamida 3 oy davom etuvchi epididimis diskomfort/og'rig'i", "Olti oy davomida davom etuvchi doimiy yuqori isitma", "Ikki hafta davom etuvchi skrotum shishi va qizarishi"],
    "togri": 1,
    "izoh": "Surunkali epididimit — bir yoki ikkala epididimisda kamida 3 oy davomida diskomfort va/yoki og'riq. Uch toifaga bo'linadi: yallig'lanishli, obstruktiv va epididimalgia."
  },
  {
    "savol": "Surunkali epididimitning eng keng tarqalgan yuqumli sababi qaysi?",
    "variantlar": ["Chlamydia trachomatis (JYYI qo'zg'atuvchisi)", "Escherichia coli (enterik uropatogen)", "Mycobacterium tuberculosis (sil tayoqchasi)", "Neisseria gonorrhoeae (gonorey qo'zg'atuvchisi)"],
    "togri": 2,
    "izoh": "Mycobacterium tuberculosis — surunkali epididimitning eng keng tarqalgan yuqumli sababi. Boshqa surunkali sabablar: amiodarone, postvasektomiya obstruksiyasi va epididimalgia."
  },
  {
    "savol": "Parotit orxitida klassik klinik ko'rinish qanday?",
    "variantlar": ["Parotit boshlanishi bilan bir vaqtda moyak og'rig'i paydo", "Parotitdan 4–6 kun o'tib isitma va bir tomonlama moyak og'rig'i", "Faqat ikki tomonlama, simmetrik moyak og'rig'i bilan kechadi", "Parotit o'tganidan taxminan 1 oy keyin moyak og'rig'i paydo"],
    "togri": 1,
    "izoh": "Parotit orxitida klassik ko'rinish: parotit boshlanganidan 4–6 kun o'tib isitma va bir tomonlama (kamdan-kam ikki tomonlama) moyak og'rig'i. Holat 1 haftada yaxshilanadi."
  },
  {
    "savol": "Parotit orxitida moyak atrofiyasi qancha foiz hollarda kuzatiladi?",
    "variantlar": ["5%", "20%", "50%", "90%"],
    "togri": 2,
    "izoh": "Parotit orxitida moyak atrofiyasi holatlarning 50% da kuzatiladi va oligospermiyaga olib kelishi mumkin. Interferon davolash atrofiyani oldini olishda har doim ham samarali emas."
  },
  {
    "savol": "SARS-CoV-2 orxoepididimitga qanday mexanizm orqali ta'sir qiladi?",
    "variantlar": ["Virus moyak to'qimasiga to'g'ridan-to'g'ri fizik hujum qiladi", "Sertoli va Leydig hujayralaridagi ACE2 retseptoriga birikadi", "Virus faqat qon oqimi orqali bilvosita ta'sir ko'rsatadi", "Ta'sir mexanizmi hozircha to'liq noma'lum bo'lib qolmoqda"],
    "togri": 1,
    "izoh": "SARS-CoV-2 Sertoli va Leydig hujayralarida mavjud ACE2 retseptorlariga birikishi orqali moyak to'qimasiga ta'sir qiladi deb taxmin qilinadi."
  },
  {
    "savol": "COVID-19 vaksinatsiyasining orxoepididimit xavfiga ta'siri qanday aniqlangan?",
    "variantlar": ["Vaksinatsiya orxoepididimit xavfini biroz oshiradi", "Vaksinatsiya xavfni sezilarli kamaytiradi (OR 0.57)", "Vaksinatsiya bu xavfga umuman ta'sir ko'rsatmaydi", "Bu boradagi ma'lumotlar qarama-qarshi va noaniq"],
    "togri": 1,
    "izoh": "COVID-19 vaksinatsiyasi orxoepididimit xavfini sezilarli kamaytirishi (OR 0.57) aniqlangan — bu vaksinatsiyaning yana bir foydasini ko'rsatadi."
  },
  {
    "savol": "Bolalarda epididimitda qaysi qo'shimcha tekshiruv ko'rib chiqilishi kerak?",
    "variantlar": ["Prostata-spetsifik antigen (PSA) qon tahlili o'tkazish", "VCUG — anatomik anomaliyani aniqlash uchun rentgen tekshiruvi", "NAAT tekshiruvi — istisnosiz barcha bolalar holatlarida", "Prostata bezini barmoq bilan massaj qilish muolajasi"],
    "togri": 1,
    "izoh": "Bolalarda epididimit ko'pincha JYYIsiz anatomik anomaliya sababli bo'ladi. VCUG (Voiding Cystourethrogram) anatomik anomaliyani aniqlash uchun ko'rib chiqilishi kerak."
  },
  {
    "savol": "Epididimitning xulosa bo'yicha qaysi fikr TO'G'RI?",
    "variantlar": ["Ultratovush epididimitni tasdiqlashda asosiy diagnostik usul", "Doppler qon oqimi kuchaygan bo'lsa torsiya to'liq rad etiladi", "Manfiy ultratovush torsiyani rad etmaydi; shubhada jarrohlik", "35 yoshdan kichik erkaklarda enterik organizmlar umuman yo'q"],
    "togri": 2,
    "izoh": "\"Manfiy ultratovush torsiyani yo'q qilmaydi\" — asosiy tamoyil. Klinik shubha kuchli bo'lganda ultratovush natijasiga qaramasdan shoshilinch jarrohlik konsultatsiyasi kerak."
  },
  {
    "savol": "Epididimitda kasalxonaga yotqizish qachon ko'rib chiqilishi kerak?",
    "variantlar": ["Hech qachon emas — barcha holatlar ambulator davolanadi", "Yuqori leykotsitoz va isitma kuzatilgan og'ir holatlarda", "Faqat 35 yoshdan katta bo'lgan barcha bemorlarda majburiy", "Faqat jarrohlik aralashuvi zarur bo'lib qolgan holatlarda"],
    "togri": 1,
    "izoh": "Ko'pchilik ambulatoria davolanadi, ammo yuqori leykotsitoz va isitma bo'lgan holatlarda kasalxonaga yotqizish ko'rib chiqilishi kerak."
  },
  {
    "savol": "Epididimit diagnostikasida siydik ekinmasi qachon ko'rsatilgan?",
    "variantlar": ["Istisnosiz barcha epididimit holatlarida majburiy tarzda", "Enterik organizm shubhasida va 35 yoshdan katta erkaklarda", "Faqat 35 yoshdan kichik jinsiy faol bemorlarda o'tkaziladi", "Hech qanday holatda umuman talab qilinmaydigan tekshiruv"],
    "togri": 1,
    "izoh": "Siydik ekinmasi enterik organizmlar bilan bog'liq holatlarda va 35 yoshdan katta erkakda ko'rsatilgan — qo'zg'atuvchi va antibiotik sezuvchanligini aniqlash uchun."
  }
]$orxo_savollar$::jsonb
WHERE dars_slug = 'orxoepididimit-asoslari';
