UPDATE dars_tarkibi
SET savollar_banki = $orxo_savollar$[
  {
    "savol": "Epididimit qanday ta'riflanadi?",
    "variantlar": ["Moyakning yallig'lanishi", "Epididimisning og'riq, shish va yallig'lanishi bilan kechadigan holat", "Prostata bezining yallig'lanishi", "Skrotumning shikastlanishi"],
    "togri": 1,
    "izoh": "Epididimit — epididimisning og'riq, shish va yallig'lanishi. Agar moyak ham jalb bo'lsa — orxoepididimit. Alohida moyak yallig'lanishi (orxit) kamroq uchraydi."
  },
  {
    "savol": "Orxoepididimit nima?",
    "variantlar": ["Faqat epididimisning yallig'lanishi", "Faqat moyakning yallig'lanishi", "Epididimis va moyakning birgalikda yallig'lanishi", "Prostata va epididimisning yallig'lanishi"],
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
    "variantlar": ["Darhol antibiotik boshlash", "Ultratovush tekshiruvi o'tkazish", "Moyak torsiyasini istisno qilish", "Siydik ekinmasini olish"],
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
    "variantlar": ["Qon orqali (gematogen)", "Uretradan ko'tariluvchi yo'l (asending route)", "Limfa orqali", "To'g'ridan-to'g'ri trauma orqali"],
    "togri": 1,
    "izoh": "Infeksiya ko'pincha uretradan ko'tariluvchi yo'l orqali epididimisga tarqaladi. 1927-yilda Campbell tomonidan tasvirlangan; keyingi tadqiqotlarda uretral va epididimal izolyatlar o'rtasida ~80% moslik aniqlangan."
  },
  {
    "savol": "35 yoshdan kichik jinsiy faol erkaklarda epididimitning asosiy qo'zg'atuvchilari qaysilar?",
    "variantlar": ["E. coli va Klebsiella", "C. trachomatis va N. gonorrhoeae", "Pseudomonas va Proteus", "Mycobacterium tuberculosis"],
    "togri": 1,
    "izoh": "35 yoshdan kichik jinsiy faol erkaklarda asosiy qo'zg'atuvchilar — C. trachomatis va N. gonorrhoeae. Bu yoshda barcha bemorlarda JYYIga skrining majburiy."
  },
  {
    "savol": "35 yoshdan katta erkaklarda epididimitning asosiy qo'zg'atuvchilari qaysilar?",
    "variantlar": ["C. trachomatis va N. gonorrhoeae", "Uropatogenlar — E. coli, Pseudomonas, Klebsiella", "Parotit virusi", "Mycobacterium tuberculosis"],
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
    "variantlar": ["HSV-2", "SARS-CoV-2", "EBV", "Parotit (mumps) virusi"],
    "togri": 3,
    "izoh": "Parotit (mumps) virusi — viral orxitning eng keng tarqalgan sababi. Parotit orxiti moyak atrofiyasi va subfertillikka olib kelishi mumkin."
  },
  {
    "savol": "O'tkir epididimitda og'riq qaysi yerdan boshlanadi?",
    "variantlar": ["Moyak o'rtasidan", "Epididimisning quyruq qismidan (cauda), keyin qolgan epididimis va moyakka tarqaladi", "Skrotum terisidan", "Qorin pastidan"],
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
    "variantlar": ["Kremasteric refleksning yo'qligi — torsiyaga ishora", "Skrotumni ko'tarishda og'riq kamaymasa — torsiyaga ishora; ishonchsiz belgi sifatida birgina mezon bo'la olmaydi", "Skrotumni ko'tarishda og'riq kamaysa — epididimitga ishora; ammo mustaqil diagnostik mezon sifatida ishlatilmasligi kerak", "Ultratovushda qon oqimining kuchayishi — epididimitga ishora"],
    "togri": 2,
    "izoh": "Prehn belgisi: skrotumni ko'tarishda og'riq kamaysa — epididimitga ishora (torsiyada foyda yo'q yoki og'riq kuchayadi). Ammo bu belgi yetarli aniqlikka ega emas — mustaqil diagnostik mezon sifatida ishlatilmasligi kerak."
  },
  {
    "savol": "Moyak torsiyasida kremasteric refleks odatda qanday bo'ladi?",
    "variantlar": ["Kuchaygan bo'ladi", "Saqlanib qoladi", "Ko'pincha yo'q bo'ladi — muhim belgi", "O'zgarmaydi"],
    "togri": 2,
    "izoh": "Kremasteric refleks moyak torsiyasida ko'pincha yo'q bo'ladi — bu muhim klinik belgi. Epididimitda esa odatda saqlanib qoladi."
  },
  {
    "savol": "Moyak torsiyasida og'riq qanday boshlanadi?",
    "variantlar": ["Asta-sekin, soatlar yoki kunlar davomida", "To'satdan, keskin — daqiqalar ichida", "Faqat harakatda paydo bo'ladi", "Faqat siydik chiqarishda paydo bo'ladi"],
    "togri": 1,
    "izoh": "Moyak torsiyasida og'riq to'satdan, keskin boshlanadi — daqiqalar ichida. Epididimitda esa asta-sekin, soatlar yoki kunlar davomida rivojlanadi. Bu farq klinik ahamiyatga ega."
  },
  {
    "savol": "Doppler ultratovushda epididimit va moyak torsiyasini qanday farqlash mumkin?",
    "variantlar": ["Epididimitda qon oqimi kamayadi; torsiyada kuchayadi", "Epididimitda qon oqimi kuchayadi (hiperemiya); torsiyada kamayadi yoki yo'q bo'ladi", "Ikkalasida ham bir xil qon oqimi bo'ladi", "Ultratovush farqlay olmaydi"],
    "togri": 1,
    "izoh": "Doppler ultratovushda: epididimitda kuchaygan qon oqimi (hiperemiya); moyak torsiyasida kamaygan yoki yo'q qon oqimi. Ammo normal qon oqimi ham torsiyani istisno qilmaydi."
  },
  {
    "savol": "\"Manfiy ultratovush torsiyani yo'q qilmaydi\" tamoyili nimani anglatadi?",
    "variantlar": ["Ultratovush keraksiz tekshiruv", "Doppler UTTda qon oqimi normal ko'rinsa ham klinik shubha kuchli bo'lganda shoshilinch jarrohlik konsultatsiyasi kerak", "Ultratovush har doim torsiyani aniqlaydi", "Manfiy ultratovushda operatsiya shart emas"],
    "togri": 1,
    "izoh": "Doppler ultratovushda qon oqimi normal yoki kuchaygan ko'rinsa ham torsiyani to'liq istisno qilib bo'lmaydi. Klinik shubha kuchli bo'lganda ultratovush natijasiga qaramasdan shoshilinch jarrohlik konsultatsiyasi kerak."
  },
  {
    "savol": "Epididimitni tasdiqlash uchun CDC 2021 mezonlaridan biri qaysi?",
    "variantlar": ["Qon ekinmasida bakteriya topilishi", "Uretra ajralmasining Gram bo'yog'ida ≥2 leykotsit/yog' immersion maydoni", "Ultratovushda epididimis kattalashishi", "Isitma ≥38°C"],
    "togri": 1,
    "izoh": "CDC 2021 epididimit mezonlari (kamida bittasi kerak): uretra surtmasida ≥2 WBC/HPF; birinchi qism siydikda leykotsit esteraza musbat; yoki birinchi qism siydikda ≥10 leykotsit/HPF."
  },
  {
    "savol": "Epididimitda NAAT nima uchun o'tkaziladi va qaysi namuna qo'llaniladi?",
    "variantlar": ["Siydik bakteriyalarini aniqlash uchun; o'rta qism siydik", "C. trachomatis va N. gonorrhoeae aniqlash uchun; birinchi qism siydik yoki uretra surtmasi", "Viral infeksiyani aniqlash uchun; qon", "Enterik organizmlarni aniqlash uchun; najas"],
    "togri": 1,
    "izoh": "NAAT barcha epididimit gumonlarida C. trachomatis va N. gonorrhoeae aniqlash uchun o'tkaziladi. Birinchi qism siydik yoki uretra surtmasi — afzal namuna."
  },
  {
    "savol": "Doppler ultratovush epididimitda asosan nima uchun qo'llaniladi?",
    "variantlar": ["Epididimitni tasdiqlash uchun", "Torsiya va absessni istisno qilish uchun — epididimitni tasdiqlash uchun emas", "Antibiotik tanlash uchun", "PSA darajasini aniqlash uchun"],
    "togri": 1,
    "izoh": "Ultratovush epididimitni tasdiqlash uchun emas — torsiya, absess yoki infarktni istisno qilish uchun qo'llaniladi. Klinik belgilar epididimit tashxisi uchun yetarli. Salbiy ultratovush klinik menejmentni o'zgartirmaydi."
  },
  {
    "savol": "Epididimitda simptomatik davolash qanday amalga oshiriladi?",
    "variantlar": ["Darhol jarrohlik", "Posteli rejimi, skrotumni ko'tarish, mahalliy sovutish va NSAIDlar", "Faqat antibiotik yetarli", "Kortikosteroidlar birinchi tanlov"],
    "togri": 1,
    "izoh": "Simptomatik davo: posteli rejimi, skrotumni ko'tarish (elevation) va mahalliy sovutish og'riqni yengillashtiradi. NSAIDlar foydali. Ko'pchilik ambulatoria davolanadi."
  },
  {
    "savol": "Xlamidiya yoki gonorey sababli epididimitda CDC 2021 tavsiyasi bo'yicha davolash sxemasi qaysi?",
    "variantlar": ["Faqat doksisiklin 100 mg × 2/kun, 7 kun", "Seftriakson 500 mg IM yagona doza + doksisiklin 100 mg × 2/kun, 10 kun", "Azitromitsin 1 g yagona doza", "Levofloksatsin 500 mg/kun, 7 kun"],
    "togri": 1,
    "izoh": "JYYI sababli epididimitda CDC 2021: seftriakson 500 mg IM yagona doza + doksisiklin 100 mg × 2/kun, 10 kun. Og'irligi ≥150 kg da seftriakson 1 g beriladi."
  },
  {
    "savol": "Anal jinsiy aloqa bilan bog'liq epididimitda (xlamidiya, gonorey yoki enterik organizmlar) qaysi sxema tavsiya etiladi?",
    "variantlar": ["Faqat doksisiklin, 14 kun", "Seftriakson 500 mg IM + levofloksatsin 500 mg/kun, 10 kun", "Faqat azitromitsin", "Amoksitsillin + klavulanat"],
    "togri": 1,
    "izoh": "Anal jinsiy aloqa bilan bog'liq epididimitda (enterik organizmlar ham mumkin): seftriakson 500 mg IM yagona doza + levofloksatsin 500 mg/kun, 10 kun — CDC 2021 tavsiyasi."
  },
  {
    "savol": "Faqat enterik organizmlar sababli epididimitda (gonorey istisno qilingan) qaysi davo tavsiya etiladi?",
    "variantlar": ["Seftriakson + doksisiklin", "Levofloksatsin 500 mg/kun, 10 kun", "Azitromitsin yagona doza", "Nitrofurantoin 5 kun"],
    "togri": 1,
    "izoh": "Gonorey istisno qilingan va faqat enterik organizmlar (E. coli va h.k.) bilan bog'liq epididimitda: levofloksatsin 500 mg/kun, 10 kun — CDC 2021 tavsiyasi."
  },
  {
    "savol": "Epididimitda antibiotikka javob bermaganida 72 soatda qanday qadam qo'yiladi?",
    "variantlar": ["Antibiotikni almashtirish — hech qanday tekshiruvsiz", "Qayta baholash majburiy; ultratovush — absess yoki moyak infarkti istisno qilish uchun", "Kasalxonaga yotqizish — tekshiruvsiz", "Jarrohlik konsultatsiyasi — tekshiruvsiz"],
    "togri": 1,
    "izoh": "72 soatda simptomlar yaxshilanmasa — qayta baholash majburiy. Ultratovush — absess yoki moyak infarkti istisno qilish uchun o'tkaziladi. Ftorokinolonga rezistentlikni inobatga olish kerak."
  },
  {
    "savol": "Bemorga o'tkir epididimitda qanday ma'lumot berish kerak?",
    "variantlar": ["1–2 kunda to'liq tuzaladi", "1–3 kunda og'riq yaxshilanishi mumkin, ammo shish va diskomfort 2–4 hafta davomida saqlanishi mumkin", "Antibiotik to'xtatilgandan keyin darhol tuzaladi", "Bir necha soatda yaxshilanadi"],
    "togri": 1,
    "izoh": "O'tkir og'riq 1–3 kunda yaxshilanishi mumkin, ammo yallig'lanish belgilari (shish, diskomfort) 2–4 hafta davomida to'liq yo'qolmaydi — bemorga buni oldindan tushuntirish uyda noto'g'ri xavotirni oldini oladi."
  },
  {
    "savol": "C. trachomatis yoki N. gonorrhoeae tasdiqlanganda jinsiy hamrohlar bilan nima qilish kerak?",
    "variantlar": ["Hech qanday chora kerak emas", "Jinsiy hamrohlar ham baholash va davolash uchun yuborilishi shart", "Faqat bemor davolanadi", "Hamrohlarga antibiotik buyurilmaydi"],
    "togri": 1,
    "izoh": "JYYI tasdiqlanganda jinsiy hamrohlar ham baholash va davolash uchun yuborilishi shart — infeksiyaning tarqalishini oldini olish va qayta infeksiyadan himoya qilish uchun."
  },
  {
    "savol": "Surunkali epididimit qanday ta'riflanadi?",
    "variantlar": ["1 hafta davomida og'riq", "Kamida 3 oy davomida bir yoki ikkala epididimisda diskomfort va/yoki og'riq", "6 oy davomida isitma", "2 hafta davomida shish"],
    "togri": 1,
    "izoh": "Surunkali epididimit — bir yoki ikkala epididimisda kamida 3 oy davomida diskomfort va/yoki og'riq. Uch toifaga bo'linadi: yallig'lanishli, obstruktiv va epididimalgia."
  },
  {
    "savol": "Surunkali epididimitning eng keng tarqalgan yuqumli sababi qaysi?",
    "variantlar": ["C. trachomatis", "E. coli", "Mycobacterium tuberculosis (TB)", "N. gonorrhoeae"],
    "togri": 2,
    "izoh": "Mycobacterium tuberculosis — surunkali epididimitning eng keng tarqalgan yuqumli sababi. Boshqa surunkali sabablar: amiodarone, postvasektomiya obstruksiyasi va epididimalgia."
  },
  {
    "savol": "Parotit orxitida klassik klinik ko'rinish qanday?",
    "variantlar": ["Parotit boshlanganida darhol moyak og'rig'i", "Parotit boshlanganidan 4–6 kun o'tib isitma va bir tomonlama moyak og'rig'i", "Faqat ikki tomonlama moyak og'rig'i", "Parotitdan 1 oy keyin moyak og'rig'i"],
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
    "variantlar": ["Virus to'g'ridan-to'g'ri moyakka hujum qiladi", "SARS-CoV-2 moyakdagi Sertoli va Leydig hujayralarida ACE2 retseptorlariga birikadi", "Virus faqat qon orqali ta'sir qiladi", "Mexanizm hali noma'lum"],
    "togri": 1,
    "izoh": "SARS-CoV-2 Sertoli va Leydig hujayralarida mavjud ACE2 retseptorlariga birikishi orqali moyak to'qimasiga ta'sir qiladi deb taxmin qilinadi."
  },
  {
    "savol": "COVID-19 vaksinatsiyasining orxoepididimit xavfiga ta'siri qanday aniqlangan?",
    "variantlar": ["Vaksinatsiya xavfni oshiradi", "Vaksinatsiya xavfni sezilarli kamaytiradi (OR 0.57)", "Vaksinatsiya ta'sir qilmaydi", "Ma'lumotlar qarama-qarshi"],
    "togri": 1,
    "izoh": "COVID-19 vaksinatsiyasi orxoepididimit xavfini sezilarli kamaytirishi (OR 0.57) aniqlangan — bu vaksinatsiyaning yana bir foydasini ko'rsatadi."
  },
  {
    "savol": "Bolalarda epididimitda qaysi qo'shimcha tekshiruv ko'rib chiqilishi kerak?",
    "variantlar": ["PSA tahlili", "VCUG (siydik chiqarish paytida qovuq-uretra rentgeni) — anatomik anomaliyani aniqlash uchun", "NAAT — barcha holatlarda", "Prostata massaji"],
    "togri": 1,
    "izoh": "Bolalarda epididimit ko'pincha JYYIsiz anatomik anomaliya sababli bo'ladi. VCUG (Voiding Cystourethrogram) anatomik anomaliyani aniqlash uchun ko'rib chiqilishi kerak."
  },
  {
    "savol": "Epididimitning xulosa bo'yicha qaysi fikr TO'G'RI?",
    "variantlar": ["Ultratovush epididimitni tasdiqlash uchun asosiy usul", "Doppler ultratovushda qon oqimi kuchaygan bo'lsa torsiyani to'liq istisno qilsa bo'ladi", "Salbiy ultratovush torsiyani to'liq rad etmaydi; klinik shubha kuchli bo'lsa shoshilinch jarrohlik kerak", "35 yoshdan kichik erkaklarda enterik organizmlar bo'lmaydi"],
    "togri": 2,
    "izoh": "\"Manfiy ultratovush torsiyani yo'q qilmaydi\" — asosiy tamoyil. Klinik shubha kuchli bo'lganda ultratovush natijasiga qaramasdan shoshilinch jarrohlik konsultatsiyasi kerak."
  },
  {
    "savol": "Epididimitda kasalxonaga yotqizish qachon ko'rib chiqilishi kerak?",
    "variantlar": ["Hech qachon — har doim ambulatoria davolanadi", "Yuqori leykotsitoz va isitma bo'lgan holatlarda", "Faqat 35 yoshdan katta bemorlarda", "Faqat jarrohlik kerak bo'lganda"],
    "togri": 1,
    "izoh": "Ko'pchilik ambulatoria davolanadi, ammo yuqori leykotsitoz va isitma bo'lgan holatlarda kasalxonaga yotqizish ko'rib chiqilishi kerak."
  },
  {
    "savol": "Epididimit diagnostikasida siydik ekinmasi qachon ko'rsatilgan?",
    "variantlar": ["Barcha holatlarda majburiy", "Enterik organizmlar bilan bog'liq holatlarda va 35 yoshdan katta erkaklarda", "Faqat 35 yoshdan kichik bemorlarda", "Hech qachon kerak emas"],
    "togri": 1,
    "izoh": "Siydik ekinmasi enterik organizmlar bilan bog'liq holatlarda va 35 yoshdan katta erkakda ko'rsatilgan — qo'zg'atuvchi va antibiotik sezuvchanligini aniqlash uchun."
  }
]$orxo_savollar$::jsonb
WHERE dars_slug = 'orxoepididimit-asoslari';
