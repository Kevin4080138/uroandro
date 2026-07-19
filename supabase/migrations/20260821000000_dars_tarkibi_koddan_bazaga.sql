-- darslar.ts dagi og'ir tarkib (nazariya, savol banklari) dars_tarkibi jadvaliga ko'chirildi.
-- Kodda faqat yengil metama'lumot (slug, sarlavha, bosqich, iframe yo'li) qoldi.
-- Idempotent: mavjud qatorlarning to'ldirilgan maydonlari USTIDAN YOZILMAYDI.

-- Benign prostata giperplaziyasi (BPH) va pastki siydik yo'llari simptomlari (qiyin)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('bph-luts', $dt_naz$
  <h2>1. BPH nima?</h2>
  <p>Benign prostata giperplaziyasi (BPH — Benign Prostatic Hyperplasia) — prostata bezining stromal va epitelial hujayralarining saratonsiz (benign) ko'payishi natijasida hajmi kattalashishi. Bu yosh ulg'aygan erkaklarda fiziologik jarayon hisoblanadi: 60 yoshdan keyin erkaklarning taxminan 50%ida, 80 yoshdan keyin esa 80%dan ortig'ida gistologik BPH belgilari topiladi.</p>
  <p>BPH o'zi xavfli emas va saraton bilan bog'liq emas, biroq kattalashgan prostata siydik chiqarish kanalini (uretrani) toraytirib, pastki siydik yo'llari simptomlarini (LUTS — Lower Urinary Tract Symptoms) keltirib chiqaradi.</p>
  <h2>2. Simptomlar — saqlanish va bo'shatish guruhlari</h2>
  <p>LUTS ikki katta guruhga bo'linadi. Saqlanish (storage) simptomlari: tez-tez siyish, nokturiya (tungi siyish), to'satdan kuchli siyish ehtiyoji (urgency). Bo'shatish (voiding) simptomlari: siyishni boshlashda kuchanish, oqim kuchsizligi, uzilib-uzilib siyish, to'liq bo'shamaslik hissi va siyishdan keyin tomchilash.</p>
  <p>Bu simptomlar standartlashtirilgan tarzda IPSS (International Prostate Symptom Score) anketasi orqali baholanadi — 7 savol, 0–35 ball: 0–7 yengil, 8–19 o'rtacha, 20–35 og'ir simptomlar.</p>
  <h2>3. Tashxis</h2>
  <p>Asosiy tekshiruvlar: anamnez va IPSS anketasi, jismoniy ko'rik (shu jumladan rektal palpatsiya — DRE), umumiy siydik tahlili (infeksiya/gematuriyani istisno qilish uchun), PSA (prostata saratonini istisno qilish va davolash strategiyasini tanlash uchun), prostata USI (hajmni o'lchash) va uroflowmetriya (Qmax — maksimal oqim tezligini baholash).</p>
  <p>Prostata hajmi ellipsoid formula (V = 0.52 × uzunlik × kenglik × balandlik) bo'yicha hisoblanadi va davolash usulini tanlashda muhim omil hisoblanadi: 30 sm³dan kichik prostatalarda dorivor davo ko'pincha yetarli, 80–100 sm³dan katta prostatalarda esa jarrohlik (ayniqsa ochiq yoki lazer enukleatsiyasi) ko'rib chiqiladi.</p>
  <h2>4. Davolash bosqichlari</h2>
  <p>1-bosqich — kuzatuv (watchful waiting): yengil simptomli (IPSS ≤7), hayot sifatiga sezilarli ta'sir qilmaydigan holatlarda faqat hayot tarzini o'zgartirish (suyuqlik rejimini tartibga solish, kechqurun kam suyuqlik ichish, kofein/alkoldan saqlanish) tavsiya etiladi.</p>
  <p>2-bosqich — dorivor davo: alfa-1-blokatorlar (tamsulozin, alfuzozin) prostata va qovuq bo'yni silliq mushaklarini bo'shashtirib tezkor simptomatik yengillik beradi. 5-alfa-reduktaza inhibitorlari (finasterid, dutasterid) prostata hajmini asta-sekin kichraytiradi, ayniqsa katta prostatali (>40 sm³) bemorlarda samarali, ta'siri 3–6 oyda namoyon bo'ladi. Ikkalasining kombinatsiyasi katta prostatali va og'ir simptomli bemorlarda tavsiya etiladi.</p>
  <p>3-bosqich — jarrohlik davo: dorivor davo samara bermaganda yoki asoratlar (qaytalanuvchi siydik to'lib qolishi, qon ketish, toshlar, buyrak funksiyasi pasayishi) rivojlanganda ko'rib chiqiladi. TURP (transuretral rezeksiya) — oltin standart, kichik-o'rta prostatalar uchun. Katta prostatalar uchun lazer enukleatsiyasi (HoLEP) yoki ochiq prostatektomiya.</p>
  <h2>Manbalar</h2>
  <ul>
    <li>EAU Guidelines on Non-neurogenic Male LUTS (2024)</li>
    <li>AUA Guideline: Surgical Management of BPH (2020, 2023 yangilanish)</li>
    <li>Oesterling JE va boshq. — yoshga moslashgan PSA me'zonlari</li>
  </ul>
$dt_naz$, $dt_bank$[
 {
  "savol": "BPH nima uchun \"benign\" deb ataladi?",
  "variantlar": [
   "Chunki u hech qachon simptom bermaydi",
   "Chunki u saraton emas, to'qima saratonsiz ko'payadi",
   "Chunki u faqat yosh erkaklarda uchraydi",
   "Chunki u doim operatsiyasiz o'tib ketadi"
  ],
  "togri": 1,
  "izoh": "BPH prostata to'qimasining saratonsiz (benign) giperplaziyasi — bu uning saraton bilan bog'liq emasligini, lekin baribir simptom berishi mumkinligini bildiradi."
 },
 {
  "savol": "IPSS bo'yicha 8–19 ball qaysi darajaga to'g'ri keladi?",
  "variantlar": [
   "Yengil simptomlar",
   "O'rtacha simptomlar",
   "Og'ir simptomlar",
   "Simptom yo'q"
  ],
  "togri": 1,
  "izoh": "IPSS shkalasi: 0–7 yengil, 8–19 o'rtacha, 20–35 og'ir simptomlarni bildiradi."
 },
 {
  "savol": "Quyidagilardan qaysi biri 'saqlanish' (storage) simptomiga misol?",
  "variantlar": [
   "Siyish oqimi kuchsizligi",
   "Nokturiya (tungi siyish)",
   "Siyishni boshlashda kuchanish",
   "To'liq bo'shamaslik hissi"
  ],
  "togri": 1,
  "izoh": "Nokturiya saqlanish guruhiga kiradi; oqim kuchsizligi, kuchanish va to'liq bo'shamaslik — bo'shatish (voiding) simptomlari."
 },
 {
  "savol": "5-alfa-reduktaza inhibitorlari (finasterid) qaysi mexanizm orqali ta'sir qiladi?",
  "variantlar": [
   "Qovuq mushaklarini darhol bo'shashtiradi",
   "Prostata hajmini vaqt o'tishi bilan kichraytiradi",
   "Siydikni darhol chiqarib tashlaydi",
   "Faqat infeksiyani yo'qotadi"
  ],
  "togri": 1,
  "izoh": "5-alfa-reduktaza inhibitorlari testosteronning dihidrotestosteronga aylanishini bloklab, prostata hajmini 3–6 oy davomida asta-sekin kichraytiradi — alfa-blokatorlardan farqli, tezkor emas."
 },
 {
  "savol": "Qaysi prostata hajmi ko'rsatkichi katta prostatali bemorlarda lazer enukleatsiyasini ko'rib chiqishga asos bo'ladi?",
  "variantlar": [
   "10 sm³ dan kichik",
   "20-30 sm³",
   "80-100 sm³ dan katta",
   "Hajm ahamiyatsiz"
  ],
  "togri": 2,
  "izoh": "80-100 sm³ dan katta prostatalarda HoLEP (Holmium Laser Enucleation of the Prostate) yoki ochiq prostatektomiya ko'rib chiqiladi, chunki TURP bunday hollarda texnik jihatdan murakkablashadi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Surunkali prostatit va kichik chanoq og'rig'i sindromi (CP/CPPS) (qiyin)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('prostatit-cpps', $dt_naz$
  <h2>1. NIH klassifikatsiyasi</h2>
  <p>AQSh Milliy sog'liqni saqlash instituti (NIH) prostatitni 4 turga bo'ladi: I tur — o'tkir bakterial prostatit (yuqori harorat, og'ir intoksikatsiya bilan kechadigan o'tkir infeksiya); II tur — surunkali bakterial prostatit (qaytalanuvchi siydik yo'li infeksiyasi, prostata sekretida bakteriya aniqlanadi); III tur — surunkali prostatit/kichik chanoq og'rig'i sindromi (CP/CPPS) — eng ko'p uchraydigan tur, bakteriya aniqlanmaydi; IV tur — asimptomatik yallig'lanuvchi prostatit (simptomsiz, faqat tasodifan aniqlanadi).</p>
  <p>III tur o'z ichida yana ikkiga bo'linadi: IIIA — yallig'lanuvchi (prostata sekretida/spermada leykotsitlar ko'p), IIIB — noyallig'lanuvchi (leykotsitlar yo'q).</p>
  <h2>2. Klinik ko'rinish</h2>
  <p>Asosiy shikoyat — kichik chanoq sohasidagi (oraliq, moyaklar, jinsiy a'zo, pastki qorin) surunkali og'riq, kamida 3 oy davomida. Bunga siyish simptomlari (tez-tez siyish, to'liq bo'shamaslik) va jinsiy funksiya buzilishlari (ejakulyatsiyadan keyingi og'riq, erektil disfunksiya) qo'shilishi mumkin.</p>
  <p>Bu holat bemorning hayot sifatiga sezilarli salbiy ta'sir ko'rsatadi va ko'pincha uzoq muddatli, qaytalanuvchi kechishga ega.</p>
  <h2>3. Tashxis</h2>
  <p>NIH-CPSI (Chronic Prostatitis Symptom Index) anketasi — 3 domen (og'riq, siyish, hayot sifati) bo'yicha 0–43 ball orasida standartlashtirilgan baholash vositasi.</p>
  <p>Bakterial va abakterial turlarni farqlash uchun Meares-Stamey 4-stakan testi yoki soddalashtirilgan oldin-keyin (pre/post-massage) siydik testi qo'llaniladi: prostata massajidan keyin siydikda leykotsit/bakteriya sonining oshishi yallig'lanish yoki infeksiyani ko'rsatadi.</p>
  <h2>4. Davolash</h2>
  <p>II tur (bakterial): uzoq muddatli (4–6 hafta) antibiotikoterapiya — odatda ftorxinolonlar yoki trimetoprim-sulfametoksazol, chunki bu dorilar prostata to'qimasiga yaxshi o'tadi.</p>
  <p>III tur (CP/CPPS): multimodal yondashuv tavsiya etiladi — alfa-blokatorlar (siyish simptomlarini yengillashtirish uchun), og'riqsizlantiruvchilar, tazo tubi mushaklarini bo'shashtirish mashqlari (pelvik floor terapiya), ba'zan past dozali antibiotik sinovi (4 haftagacha, agar yallig'lanish belgilari bo'lsa). Yagona "sehrli" davo yo'q — individuallashtirilgan, fenotipga asoslangan yondashuv (UPOINT tasnifi) zamonaviy standart hisoblanadi.</p>
  <h2>Manbalar</h2>
  <ul>
    <li>EAU Guidelines on Chronic Pelvic Pain (2024)</li>
    <li>NIH Chronic Prostatitis Classification (Krieger va boshq., 1999)</li>
    <li>Litwin MS va boshq. — NIH-CPSI validatsiyasi (1999)</li>
  </ul>
$dt_naz$, $dt_bank$[
 {
  "savol": "NIH klassifikatsiyasi bo'yicha eng ko'p uchraydigan prostatit turi qaysi?",
  "variantlar": [
   "I tur — o'tkir bakterial",
   "II tur — surunkali bakterial",
   "III tur — CP/CPPS",
   "IV tur — asimptomatik"
  ],
  "togri": 2,
  "izoh": "III tur (CP/CPPS) prostatit hollarining 90% dan ortig'ini tashkil qiladi va bakteriya aniqlanmaydi."
 },
 {
  "savol": "IIIA va IIIB turlarini bir-biridan nima farqlaydi?",
  "variantlar": [
   "IIIA da bakteriya bor, IIIB da yo'q",
   "IIIA da prostata sekretida leykotsitlar ko'p, IIIB da yo'q",
   "IIIA faqat yosh erkaklarda",
   "IIIA o'tkir, IIIB surunkali"
  ],
  "togri": 1,
  "izoh": "IIIA — yallig'lanuvchi (leykotsitlar ko'p), IIIB — noyallig'lanuvchi (leykotsitlar yo'q); ikkalasida ham bakteriya aniqlanmaydi."
 },
 {
  "savol": "NIH-CPSI anketasi necha balldan iborat shkala bo'yicha baholanadi?",
  "variantlar": [
   "0-10",
   "0-25",
   "0-43",
   "0-100"
  ],
  "togri": 2,
  "izoh": "NIH-CPSI 3 domen (og'riq 0-21, siyish 0-10, hayot sifati 0-12) bo'yicha jami 0-43 ball oralig'ida natija beradi."
 },
 {
  "savol": "II tur (surunkali bakterial prostatit) uchun standart davolash davomiyligi qancha?",
  "variantlar": [
   "3-5 kun",
   "7-10 kun",
   "4-6 hafta",
   "6 oy"
  ],
  "togri": 2,
  "izoh": "Surunkali bakterial prostatit prostata to'qimasiga dori yaxshi o'tishi uchun uzoq (4-6 hafta) antibiotikoterapiya talab qiladi."
 },
 {
  "savol": "CP/CPPS (III tur) davolashda zamonaviy standart yondashuv qaysi?",
  "variantlar": [
   "Faqat bitta uzoq antibiotik kursi",
   "Faqat jarrohlik",
   "Multimodal, fenotipga asoslangan (UPOINT) yondashuv",
   "Hech qanday davolash kerak emas"
  ],
  "togri": 2,
  "izoh": "CP/CPPS heterogen sindrom bo'lgani uchun yagona davo yo'q — UPOINT fenotiplashtirish asosida individuallashtirilgan multimodal davolash tavsiya etiladi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Erektil disfunksiya: sabablari, baholash va davolash (qiyin)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('erektil-disfunksiya', $dt_naz$
  <h2>1. Ta'rif va fiziologiya</h2>
  <p>Erektil disfunksiya (ED) — jinsiy aloqa uchun yetarli erektsiyani doimiy ravishda erisha olmaslik yoki saqlab qola olmaslik holati, kamida 3 oy davomida saqlanishi kerak (o'tkir/vaqtinchalik holatlar istisno).</p>
  <p>Erektsiya neyrovaskulyar jarayon: jinsiy qo'zg'alish → kavernoz sinuslarda azot oksidi (NO) ajralishi → siklik GMF (cGMF) darajasi oshishi → kavernoz tana silliq mushaklarining bo'shashishi → qon to'lishi va erektsiya. Fosfodiesteraza-5 (PDE5) fermenti cGMF'ni parchalab erektsiyani tugatadi — shu sababli PDE5 inhibitorlari (sildenafil va boshq.) bu fermentni bloklab erektsiyani uzaytiradi.</p>
  <h2>2. Sabablari</h2>
  <p>Organik sabablar: vaskulyar (ateroskleroz, qandli diabet — eng ko'p uchraydigan sabab guruhi), neyrogen (orqa miya shikastlanishi, Parkinson, multipl skleroz, prostatektomiyadan keyingi nerv shikastlanishi), gormonal (gipogonadizm/testosteron tanqisligi), dorilar (antidepressantlar, antigipertenzivlar).</p>
  <p>Psixogen sabablar: stress, tashvishlanish, depressiya, munosabatlardagi muammolar. Amaliyotda ko'pincha aralash (organik + psixogen) tabiat kuzatiladi.</p>
  <p>ED ko'pincha kardiovaskulyar kasalliklarning erta belgisi hisoblanadi — penis arteriyalari koronar arteriyalardan kichikroq bo'lgani uchun ateroskleroz birinchi bo'lib shu yerda namoyon bo'lishi mumkin ('penis koronar muammosining erta signali' kontsepsiyasi).</p>
  <h2>3. Baholash</h2>
  <p>IIEF-5 (SHIM) anketasi — 5 savollik standart skrining vositasi, 1-25 ball: 1-7 og'ir, 8-11 o'rtacha-og'ir, 12-16 o'rtacha, 17-21 yengil, 22-25 ED yo'q.</p>
  <p>Asosiy laboratoriya tekshiruvlari: ertalabki umumiy testosteron, glyukoza/HbA1c (diabet skrining), lipid profil (kardiovaskulyar xavf). ADAM anketasi testosteron tanqisligi ehtimolini skrining qilishda qo'shimcha vosita bo'lib xizmat qiladi.</p>
  <h2>4. Davolash bosqichlari</h2>
  <p>1-bosqich — hayot tarzi o'zgartirish: jismoniy faollik, vazn nazorati, chekishni tashlash, qandli diabet/gipertoniyani nazorat qilish — bularning barchasi erektil funksiyani yaxshilaydi.</p>
  <p>2-bosqich — PDE5 inhibitorlari (sildenafil, tadalafil, vardenafil) — birinchi qatordagi dorivor davo, samaradorligi 60-80%.</p>
  <p>3-bosqich — vakuum-erektsion qurilmalar, intrakavernoz inyeksiyalar (alprostadil) — PDE5 inhibitorlari samara bermaganda.</p>
  <p>4-bosqich — penil protezlash (implantatsiya) — boshqa usullar samarasiz bo'lganda, eng yuqori bemor qoniqishi ko'rsatkichiga ega yakuniy yechim.</p>
  <h2>Manbalar</h2>
  <ul>
    <li>EAU Guidelines on Sexual and Reproductive Health — Erectile Dysfunction (2024)</li>
    <li>ISSM Clinical Guidelines for ED</li>
    <li>Rosen RC va boshq. — IIEF va IIEF-5 validatsiyasi (1997, 1999)</li>
  </ul>
$dt_naz$, $dt_bank$[
 {
  "savol": "Erektsiya jarayonida PDE5 fermenti qanday rol o'ynaydi?",
  "variantlar": [
   "cGMF hosil qiladi",
   "cGMF ni parchalaydi va erektsiyani tugatadi",
   "Testosteron ishlab chiqaradi",
   "Qon bosimini oshiradi"
  ],
  "togri": 1,
  "izoh": "PDE5 cGMF ni parchalab kavernoz tana mushaklarining qayta qisqarishiga olib keladi; PDE5 inhibitorlari shu fermentni bloklab erektsiyani uzaytiradi."
 },
 {
  "savol": "ED nima uchun ko'pincha kardiovaskulyar kasalliklarning erta belgisi hisoblanadi?",
  "variantlar": [
   "Chunki yurak va penis bog'liq emas",
   "Penis arteriyalari kichikroq bo'lgani uchun ateroskleroz birinchi shu yerda namoyon bo'ladi",
   "ED faqat yosh erkaklarda uchraydi",
   "Bu tasodifiy bog'liqlik"
  ],
  "togri": 1,
  "izoh": "Penis arteriyalarining kichik diametri tufayli aterosklerotik o'zgarishlar koronar arteriyalardan oldinroq klinik namoyon bo'lishi mumkin."
 },
 {
  "savol": "IIEF-5 bo'yicha 22-25 ball nimani bildiradi?",
  "variantlar": [
   "Og'ir ED",
   "O'rtacha ED",
   "ED belgilari yo'q",
   "Aniqlash mumkin emas"
  ],
  "togri": 2,
  "izoh": "IIEF-5 shkalasida 22-25 ball ED belgilari yo'qligini bildiradi."
 },
 {
  "savol": "ED davolashda birinchi qatordagi dorivor davo qaysi guruh?",
  "variantlar": [
   "Antibiotiklar",
   "PDE5 inhibitorlari",
   "Antidepressantlar",
   "Diuretiklar"
  ],
  "togri": 1,
  "izoh": "PDE5 inhibitorlari (sildenafil, tadalafil, vardenafil) hayot tarzi o'zgarishidan keyingi birinchi qatordagi dorivor davo hisoblanadi."
 },
 {
  "savol": "Boshqa usullar samarasiz bo'lganda eng yuqori bemor qoniqishini beradigan yakuniy davolash usuli qaysi?",
  "variantlar": [
   "Vakuum qurilma",
   "Intrakavernoz inyeksiya",
   "Penil protezlash",
   "Faqat psixoterapiya"
  ],
  "togri": 2,
  "izoh": "Penil protezlash (implantatsiya) boshqa konservativ usullar samarasiz bo'lganda eng yuqori uzoq muddatli bemor qoniqishi ko'rsatkichiga ega."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Siydik yo'li toshlari (urolitiaz): patogenez, tashxis va davolash (qiyin)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('urolitiaz', $dt_naz$
  <h2>1. Tosh turlari va patogenez</h2>
  <p>Eng ko'p uchraydigan tosh turi — kalsiy oksalat (taxminan 70-80% hollar), so'ngra kalsiy fosfat, siydik kislotasi (uric acid) toshlari (odatda giperurikemiya holatlarida, podagrada uchraydi), struvit (infeksion toshlar, urea-parchalovchi bakteriyalar — Proteus — bilan bog'liq) va sistin toshlari (genetik, sistinuriya kasalligida).</p>
  <p>Toshlanishga moyillik omillari: yetarli suyuqlik iste'mol qilmaslik, ovqatlanish xususiyatlari (yuqori tuz/oqsil, past sitrat), metabolik buzilishlar (giperkalsiuriya, giperoksaluriya, gipositraturiya), anatomik anomaliyalar (siydik oqimi turg'unligi) va oilaviy moyillik.</p>
  <h2>2. Klinik ko'rinish va tashxis</h2>
  <p>Klassik klinik ko'rinish — renal kolika: to'satdan boshlangan, juda kuchli, to'lqinsimon bel/yon qorin og'rig'i, ko'ngil aynishi/qusish bilan birga, bemor tinch joy topa olmaydi (bu boshqa qorin og'riqlaridan farqlovchi xususiyat). Og'riq toshning siljishiga qarab pastga, chov sohasiga tarqalishi mumkin.</p>
  <p>STONE skori (Sex, Time, Origin, Nausea, Erythrocytes) — 5 oddiy klinik parametr asosida toshlik ehtimolini bashorat qiladi va KT zarurligini kamaytirishga yordam beradi. Tasdiqlash uchun oltin standart — kontrastsiz spiral KT (sezuvchanlik >95%), birinchi qatorda esa USI ko'pincha radiatsiyasiz dastlabki baholash uchun qo'llaniladi.</p>
  <h2>3. O'tkir davolash</h2>
  <p>Kichik toshlar (≤5-6 mm) ko'pincha o'z-o'zidan chiqib ketadi (spontan chiqish ehtimoli yuqori) — analgeziya (NSAID birinchi tanlov) va alfa-blokatorlar (MET — Medical Expulsive Therapy, siydik yo'li silliq mushaklarini bo'shashtirib tosh chiqishini osonlashtiradi) bilan kuzatuv tavsiya etiladi.</p>
  <p>Katta toshlar, og'riqni nazorat qilib bo'lmasligi, infeksiya bilan birga keluvchi obstruksiya (septik holat xavfi) yoki yagona buyrakda obstruksiya — bularning barchasi shoshilinch dekompressiya (stent qo'yish yoki nefrostomiya) uchun ko'rsatma hisoblanadi.</p>
  <h2>4. Rejalashtirilgan davolash usullari</h2>
  <p>ESWL (Extracorporeal Shock Wave Lithotripsy — tashqi zarba to'lqin litotripsiyasi): noinvaziv, kichik-o'rta (<2 sm) toshlar uchun, ayniqsa buyrak kosachasida joylashganda samarali.</p>
  <p>URS (Ureteroscopy — ureteroskopiya): endoskopik usul, siydik yo'lidagi toshlarda, lazer (Holmium:YAG) bilan toshni maydalash imkonini beradi, yuqori muvaffaqiyat darajasiga ega.</p>
  <p>PCNL (Percutaneous Nephrolithotomy — perkutan nefrolitotomiya): katta (>2 sm) yoki murakkab (koral shaklidagi) buyrak toshlari uchun standart usul, teri orqali to'g'ridan-to'g'ri buyrak kollektor tizimiga kirish orqali bajariladi.</p>
  <p>Metabolik baholash (24 soatlik siydik tahlili) qaytalanuvchi toshlanishning oldini olish uchun muhim — suyuqlik rejimi (kuniga ≥2.5 L siydik hajmi), tuz/oqsil cheklash va tosh turiga qarab maxsus dietetik tavsiyalar beriladi.</p>
  <h2>Manbalar</h2>
  <ul>
    <li>EAU Guidelines on Urolithiasis (2024)</li>
    <li>Moore CL va boshq. — STONE score validatsiyasi, BMJ (2014)</li>
    <li>AUA/Endourological Society Surgical Management of Stones Guideline</li>
  </ul>
$dt_naz$, $dt_bank$[
 {
  "savol": "Siydik yo'li toshlarining eng ko'p uchraydigan turi qaysi?",
  "variantlar": [
   "Struvit",
   "Sistin",
   "Kalsiy oksalat",
   "Uric acid"
  ],
  "togri": 2,
  "izoh": "Kalsiy oksalat toshlari barcha urolitiaz hollarining 70-80% ni tashkil qiladi."
 },
 {
  "savol": "Struvit toshlari odatda qaysi holat bilan bog'liq?",
  "variantlar": [
   "Yuqori oqsil iste'moli",
   "Urea-parchalovchi bakteriyalar (masalan, Proteus) bilan infeksiya",
   "Genetik kasallik",
   "Past suyuqlik iste'moli"
  ],
  "togri": 1,
  "izoh": "Struvit (infeksion) toshlar urea-parchalovchi bakteriyalar (eng ko'p Proteus) ajratadigan urease fermenti tufayli hosil bo'ladi."
 },
 {
  "savol": "Renal kolikani boshqa qorin og'riqlaridan ajratuvchi klassik xususiyati nima?",
  "variantlar": [
   "Bemor harakatsiz yotadi",
   "Bemor tinch joy topa olmaydi, to'lqinsimon og'riq",
   "Og'riq doim past haroratli",
   "Og'riq faqat tunda paydo bo'ladi"
  ],
  "togri": 1,
  "izoh": "Renal kolikada bemor doimiy harakatda bo'lib qulay holat topa olmaydi — bu peritonit kabi holatlardan farqli xususiyat (ularda bemor harakatsiz yotadi)."
 },
 {
  "savol": "Siydik yo'li toshini tasdiqlashda oltin standart tekshiruv qaysi?",
  "variantlar": [
   "Umumiy qon tahlili",
   "Kontrastsiz spiral KT",
   "Rentgen",
   "Faqat USI"
  ],
  "togri": 1,
  "izoh": "Kontrastsiz spiral KT sezuvchanligi 95% dan yuqori bo'lib, urolitiaz tasdiqlashda oltin standart hisoblanadi."
 },
 {
  "savol": "Katta (>2 sm) yoki koral shaklidagi buyrak toshlari uchun standart davolash usuli qaysi?",
  "variantlar": [
   "ESWL",
   "URS",
   "PCNL",
   "Faqat kuzatuv"
  ],
  "togri": 2,
  "izoh": "PCNL (perkutan nefrolitotomiya) katta va murakkab buyrak toshlarini davolashning standart usuli hisoblanadi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Prostata saratoni: erta aniqlash va asosiy davolash strategiyasi (qiyin)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('prostata-saraton-asoslari', $dt_naz$
  <h2>1. Epidemiologiya va xavf omillari</h2>
  <p>Prostata saratoni erkaklarda eng ko'p tashxislanadigan saraton turlaridan biri, asosan 50 yoshdan keyin uchraydi va yosh bilan xavf sezilarli oshadi. Asosiy xavf omillari: yosh, oilaviy anamnez (1-darajali qarindoshda prostata saratoni xavfni 2 baravar oshiradi), irqiy/etnik moyillik va genetik omillar (BRCA2 mutatsiyasi xavfni oshiradi).</p>
  <h2>2. PSA skrining va uning cheklovlari</h2>
  <p>PSA (Prostate-Specific Antigen) skrining tortishuvli mavzu — u sezgir, lekin spesifik emas (BPH, prostatit, jinsiy aloqadan keyin ham ko'tarilishi mumkin). Shu sababli yoshga moslashgan me'zonlar, PSA zichligi (PSAD) va erkin/umumiy PSA nisbati (%fPSA) kabi qo'shimcha ko'rsatkichlar spesifikani oshirish uchun ishlatiladi.</p>
  <p>Zamonaviy EAU/AUA qo'llanmalari individuallashtirilgan, bemor bilan muhokama qilingan ('shared decision-making') skrining yondashuvini tavsiya etadi — har bir erkakka ommaviy skrining emas.</p>
  <h2>3. Biopsiya va Gleason tasnifi</h2>
  <p>Shubhali PSA yoki rektal palpatsiya natijalarida multiparametrik MRT (mpMRI) va PI-RADS tasnifi qo'llaniladi — bu shubhali o'choqlarni aniqlashtirib, keraksiz biopsiyalarni kamaytiradi. MRT-yo'naltirilgan (fusion) biopsiya zamonaviy standart hisoblanadi.</p>
  <p>Gleason tasnifi gistologik agressivlik darajasini baholaydi (2 dan 5 gacha har bir naqsh uchun ball, eng ko'p uchraydigan + ikkinchi eng ko'p naqsh ballari qo'shiladi). Gleason 6 (3+3) — past darajali, 7 (3+4 yoki 4+3) — o'rta darajali, 8-10 — yuqori darajali agressivlikni bildiradi. Zamonaviy amaliyotda Gleason Grade Group (1-5) tasnifi ham qo'llaniladi.</p>
  <h2>4. Xavf guruhlariga asoslangan davolash</h2>
  <p>Past xavfli (PSA <10, Gleason ≤6, T1-T2a): faol kuzatuv (active surveillance) ko'pincha birinchi tanlov — muntazam PSA, MRT va qayta biopsiya bilan kuzatib boriladi, darhol davolash shart emas.</p>
  <p>O'rta xavfli: radikal prostatektomiya yoki nurli terapiya (ba'zan gormonal terapiya bilan birga) asosiy variantlar.</p>
  <p>Yuqori xavfli va metastatik holatlar: nurli terapiya + uzoq muddatli androgen deprivatsiya terapiyasi (ADT), yoki ilg'or holatlarda kimyoterapiya/yangi gormonal agentlar bilan kombinatsiya. Davolash qarori har doim multidisciplinar jamoa (urolog, onkolog-radiolog, kimyoterapevt) tomonidan qabul qilinishi tavsiya etiladi.</p>
  <h2>Manbalar</h2>
  <ul>
    <li>EAU-EANM-ESTRO-ESUR-ISUP-SIOG Guidelines on Prostate Cancer (2024)</li>
    <li>NCCN Clinical Practice Guidelines — Prostate Cancer</li>
    <li>Epstein JI va boshq. — Gleason Grade Group tasnifi (2016, ISUP)</li>
  </ul>
$dt_naz$, $dt_bank$[
 {
  "savol": "PSA skrining nima uchun tortishuvli mavzu hisoblanadi?",
  "variantlar": [
   "PSA hech qachon noto'g'ri natija bermaydi",
   "PSA sezgir, lekin spesifik emas — BPH/prostatit ham uni oshiradi",
   "PSA faqat ayollarda o'lchanadi",
   "PSA testi juda qimmat"
  ],
  "togri": 1,
  "izoh": "PSA yuqori sezuvchanlikka ega, lekin past spesifiklik tufayli benign holatlarda ham (BPH, prostatit) ko'tariladi, bu ortiqcha biopsiyalarga olib kelishi mumkin."
 },
 {
  "savol": "mpMRI va PI-RADS tasnifining asosiy maqsadi nima?",
  "variantlar": [
   "PSA o'rnini butunlay almashtirish",
   "Shubhali o'choqlarni aniqlab, keraksiz biopsiyalarni kamaytirish",
   "Faqat metastazlarni aniqlash",
   "Gleason ballini hisoblash"
  ],
  "togri": 1,
  "izoh": "mpMRI/PI-RADS shubhali o'choqlarni aniqlashtirib, MRT-yo'naltirilgan biopsiyaga yo'l ochadi va keraksiz biopsiyalar sonini kamaytiradi."
 },
 {
  "savol": "Gleason 3+4=7 qaysi agressivlik darajasiga to'g'ri keladi?",
  "variantlar": [
   "Past darajali",
   "O'rta darajali",
   "Yuqori darajali",
   "Aniqlanmagan"
  ],
  "togri": 1,
  "izoh": "Gleason 7 (3+4 yoki 4+3) o'rta darajali agressivlikni bildiradi; Gleason 6 past, Gleason 8-10 yuqori darajali hisoblanadi."
 },
 {
  "savol": "Past xavfli prostata saratonida birinchi tanlov sifatida nima tavsiya etiladi?",
  "variantlar": [
   "Darhol radikal prostatektomiya",
   "Faol kuzatuv (active surveillance)",
   "Darhol kimyoterapiya",
   "Hech qanday tekshiruv kerak emas"
  ],
  "togri": 1,
  "izoh": "Past xavfli guruhda faol kuzatuv ko'pincha birinchi tanlov bo'lib, muntazam PSA/MRT/biopsiya bilan progressiya kuzatiladi, darhol agressiv davolash shart emas."
 },
 {
  "savol": "Yuqori xavfli prostata saratonida nurli terapiyaga odatda qaysi davolash qo'shiladi?",
  "variantlar": [
   "Faqat vitaminlar",
   "Uzoq muddatli androgen deprivatsiya terapiyasi (ADT)",
   "Faqat fizioterapiya",
   "Hech narsa qo'shilmaydi"
  ],
  "togri": 1,
  "izoh": "Yuqori xavfli holatlarda nurli terapiya bilan birga uzoq muddatli ADT qo'llanilishi natijalarni sezilarli yaxshilaydi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Urologiyaning predmeti va asosiy tushunchalari (oson)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('urologiya-predmeti', $dt_naz$
  <h2>1. Urologiya nima?</h2>
  <p>Urologiya — buyrak, siydik yo'llari (siydik naychalari, siydik pufagi, uretra) kasalliklarini, shuningdek erkaklarda qo'shimcha ravishda jinsiy-tanosil a'zolari (prostata, moyak, urug' yo'llari) kasalliklarini o'rganadigan va davolaydigan tibbiyot sohasi. Ayollarda urolog faqat siydik chiqarish tizimi bilan shug'ullanadi, erkaklarda esa jinsiy-tanosil tizimi ham uning vakolat doirasiga kiradi.</p>
  <p>Urologiya ichida bir necha tor yo'nalish mavjud: andrologiya (erkak reproduktiv salomatligi), onkourologiya (siydik-tanosil a'zolari saratoni), pediatrik urologiya (bolalar), funksional urologiya (siydik tutolmaslik va qovuq faoliyati buzilishi) va endourologiya (kam invaziv, endoskopik usullar).</p>
  <h2>Manbalar</h2>
  <ul>
    <li>Campbell-Walsh Urology, 12th ed. — Kirish bobi</li>
    <li>EAU Guidelines — Umumiy kirish</li>
  </ul>
$dt_naz$, $dt_bank$[
 {
  "savol": "Urologiya fanining asosiy predmeti nima?",
  "variantlar": [
   "Yurak-qon tomir tizimi kasalliklari",
   "Buyrak va siydik yo'llari kasalliklari",
   "Markaziy asab tizimi kasalliklari",
   "Suyak-mushak tizimi kasalliklari"
  ],
  "togri": 1,
  "izoh": "Urologiya — buyrak va siydik yo'llari kasalliklarini o'rganadigan va davolaydigan tibbiyot sohasi."
 },
 {
  "savol": "Erkaklarda urologiya vakolat doirasiga siydik tizimidan tashqari yana nima kiradi?",
  "variantlar": [
   "Ovqat hazm qilish a'zolari",
   "Jinsiy-tanosil a'zolari",
   "Nafas olish a'zolari",
   "Endokrin bezlarning barchasi"
  ],
  "togri": 1,
  "izoh": "Erkaklarda urolog qo'shimcha ravishda jinsiy-tanosil a'zolari (prostata, moyak, urug' yo'llari) bilan ham shug'ullanadi."
 },
 {
  "savol": "Ayollarda urolog asosan qaysi tizim bilan shug'ullanadi?",
  "variantlar": [
   "Faqat siydik chiqarish tizimi",
   "Siydik va jinsiy tizim birgalikda",
   "Faqat reproduktiv tizim",
   "Butun endokrin tizim"
  ],
  "togri": 0,
  "izoh": "Ayollarda urologning vakolat doirasi faqat siydik chiqarish tizimi bilan chegaralanadi."
 },
 {
  "savol": "Quyidagilardan qaysi biri siydik yo'llari tarkibiga kiradi?",
  "variantlar": [
   "Prostata",
   "Siydik pufagi (qovuq)",
   "Moyak",
   "Urug' pufakchasi"
  ],
  "togri": 1,
  "izoh": "Siydik yo'llari — siydik naychalari, siydik pufagi va uretradan iborat."
 },
 {
  "savol": "Urologiyada erkaklarga xos qo'shimcha a'zolarga quyidagilardan qaysi biri kiradi?",
  "variantlar": [
   "Buyrak",
   "Ureter (siydik naychasi)",
   "Prostata",
   "Qovuq"
  ],
  "togri": 2,
  "izoh": "Prostata — erkaklarda urologiya vakolat doirasiga qo'shimcha kiruvchi jinsiy-tanosil a'zosi."
 },
 {
  "savol": "Andrologiya urologiyaning qanday yo'nalishi?",
  "variantlar": [
   "Bolalar kasalliklari",
   "Erkak reproduktiv salomatligi",
   "Endoskopik davolash usullari",
   "Saraton kasalliklari"
  ],
  "togri": 1,
  "izoh": "Andrologiya — erkak reproduktiv va jinsiy salomatligini o'rganadigan tor yo'nalish."
 },
 {
  "savol": "Onkourologiya nimani o'rganadi?",
  "variantlar": [
   "Siydik-tanosil a'zolari saratonini",
   "Bolalar urologik kasalliklarini",
   "Siydik tutolmaslikni",
   "Endoskopik jarrohlikni"
  ],
  "togri": 0,
  "izoh": "Onkourologiya — siydik-tanosil a'zolari saratoni bilan shug'ullanadigan yo'nalish."
 },
 {
  "savol": "Pediatrik urologiya qaysi bemorlar guruhi bilan shug'ullanadi?",
  "variantlar": [
   "Keksa yoshdagi bemorlar",
   "Bolalar",
   "Homilador ayollar",
   "Sportchilar"
  ],
  "togri": 1,
  "izoh": "Pediatrik urologiya — bolalardagi urologik kasalliklar bilan shug'ullanadigan yo'nalish."
 },
 {
  "savol": "Funksional urologiya asosan nimani o'rganadi?",
  "variantlar": [
   "Siydik-tanosil a'zolari saratonini",
   "Siydik tutolmaslik va qovuq faoliyati buzilishini",
   "Bolalar tug'ma anomaliyalarini",
   "Erkak bepushtligini"
  ],
  "togri": 1,
  "izoh": "Funksional urologiya — siydik tutolmaslik va qovuq faoliyati buzilishi bilan shug'ullanadi."
 },
 {
  "savol": "Endourologiya usullarining asosiy xususiyati nima?",
  "variantlar": [
   "Ochiq keng kesma jarrohlik",
   "Faqat dori-darmon bilan davolash",
   "Kam invaziv, endoskopik yondashuv",
   "Faqat diagnostika, davolash yo'q"
  ],
  "togri": 2,
  "izoh": "Endourologiya — kam invaziv, endoskopik usullarga asoslangan yo'nalish."
 },
 {
  "savol": "Urologiya qaysi ikkita asosiy tizimni birgalikda qamrab oladi (erkaklarda)?",
  "variantlar": [
   "Siydik chiqarish va jinsiy-tanosil tizimlari",
   "Nafas olish va yurak-qon tomir tizimlari",
   "Asab va endokrin tizimlari",
   "Ovqat hazm qilish va tayanch-harakat tizimlari"
  ],
  "togri": 0,
  "izoh": "Erkaklarda urologiya siydik chiqarish tizimi va jinsiy-tanosil tizimini birgalikda qamrab oladi."
 },
 {
  "savol": "Quyidagilardan qaysi biri urologiyaning tor (subspesialist) yo'nalishi emas?",
  "variantlar": [
   "Andrologiya",
   "Onkourologiya",
   "Kardiologiya",
   "Endourologiya"
  ],
  "togri": 2,
  "izoh": "Kardiologiya — yurak kasalliklari bilan shug'ullanadigan alohida soha, urologiyaga tegishli emas."
 },
 {
  "savol": "Urug' yo'llari qaysi tizimga tegishli?",
  "variantlar": [
   "Erkak jinsiy-tanosil tizimiga",
   "Nafas olish tizimiga",
   "Ovqat hazm qilish tizimiga",
   "Asab tizimiga"
  ],
  "togri": 0,
  "izoh": "Urug' yo'llari — erkak jinsiy-tanosil a'zolari tarkibiga kiradi."
 },
 {
  "savol": "Ayollarda urologning vakolat doirasi erkaklarnikiga nisbatan qanday?",
  "variantlar": [
   "Kengroq, chunki reproduktiv a'zolarni ham qamraydi",
   "Tor, faqat siydik chiqarish tizimi bilan chegaralangan",
   "Ayollarda umuman urolog kerak emas",
   "Farqi yo'q, ikkalasida ham bir xil"
  ],
  "togri": 1,
  "izoh": "Ayollarda urologning vakolat doirasi erkaklarnikidan tor — faqat siydik chiqarish tizimi bilan chegaralanadi."
 },
 {
  "savol": "Moyak (testis) urologiyada qaysi guruhga kiradi?",
  "variantlar": [
   "Siydik yo'llari a'zolari",
   "Erkak jinsiy-tanosil a'zolari",
   "Faqat gormonal endokrin bez",
   "Hech qaysi guruhga kirmaydi"
  ],
  "togri": 1,
  "izoh": "Moyak — erkaklarda urologiya vakolat doirasiga kiruvchi jinsiy-tanosil a'zosi."
 },
 {
  "savol": "Quyidagi yo'nalishlardan qaysi biri bevosita saraton kasalliklari bilan shug'ullanadi?",
  "variantlar": [
   "Funksional urologiya",
   "Onkourologiya",
   "Pediatrik urologiya",
   "Andrologiya"
  ],
  "togri": 1,
  "izoh": "Onkourologiya — siydik-tanosil a'zolari saratoni bilan bevosita shug'ullanadigan yo'nalish."
 },
 {
  "savol": "Erkak bepushtligi va jinsiy funksiya buzilishlari asosan qaysi yo'nalish predmeti hisoblanadi?",
  "variantlar": [
   "Onkourologiya",
   "Andrologiya",
   "Endourologiya",
   "Pediatrik urologiya"
  ],
  "togri": 1,
  "izoh": "Andrologiya erkak reproduktiv salomatligi, jumladan bepushtlik va jinsiy funksiya buzilishlarini o'rganadi."
 },
 {
  "savol": "Siydik pufagi (qovuq) qaysi tizim tarkibiga kiradi?",
  "variantlar": [
   "Erkak jinsiy-tanosil tizimi",
   "Siydik chiqarish tizimi",
   "Endokrin tizim",
   "Limfa tizimi"
  ],
  "togri": 1,
  "izoh": "Siydik pufagi — siydik chiqarish tizimining bir qismi."
 },
 {
  "savol": "Quyidagilardan qaysi biri faqat erkaklarga xos a'zo emas (ya'ni siydik tizimiga tegishli, umumiy)?",
  "variantlar": [
   "Prostata",
   "Moyak",
   "Buyrak",
   "Urug' pufakchasi"
  ],
  "togri": 2,
  "izoh": "Buyrak — ham erkaklarda, ham ayollarda mavjud bo'lgan siydik chiqarish tizimi a'zosi."
 },
 {
  "savol": "Bolalarda uchraydigan tug'ma siydik-tanosil anomaliyalari bilan qaysi yo'nalish shug'ullanadi?",
  "variantlar": [
   "Pediatrik urologiya",
   "Onkourologiya",
   "Andrologiya",
   "Funksional urologiya"
  ],
  "togri": 0,
  "izoh": "Pediatrik urologiya bolalardagi tug'ma anomaliyalar va boshqa urologik muammolar bilan shug'ullanadi."
 },
 {
  "savol": "Kam invaziv, mini-teshikli yoki teshiksiz endoskopik operatsiyalar qaysi yo'nalishga tegishli?",
  "variantlar": [
   "Pediatrik urologiya",
   "Endourologiya",
   "Andrologiya",
   "Onkourologiya"
  ],
  "togri": 1,
  "izoh": "Endourologiya — kam invaziv, endoskopik operatsiya usullariga ixtisoslashgan yo'nalish."
 },
 {
  "savol": "Qovuq faoliyati buzilishi (masalan, neyrogen qovuq) qaysi yo'nalish doirasida o'rganiladi?",
  "variantlar": [
   "Funksional urologiya",
   "Onkourologiya",
   "Pediatrik urologiya",
   "Andrologiya"
  ],
  "togri": 0,
  "izoh": "Funksional urologiya qovuq faoliyati buzilishi va siydik tutolmaslik bilan shug'ullanadi."
 },
 {
  "savol": "Quyidagi ta'riflardan qaysi biri \"urologiya\" so'ziga to'g'ri keladi?",
  "variantlar": [
   "Faqat bolalar kasalliklarini o'rganuvchi fan",
   "Buyrak, siydik yo'llari va (erkaklarda) jinsiy-tanosil a'zolari kasalliklarini o'rganuvchi va davolovchi soha",
   "Faqat saraton kasalliklarini o'rganuvchi soha",
   "Faqat endoskopik jarrohlik usullarini o'rganuvchi soha"
  ],
  "togri": 1,
  "izoh": "Urologiya — buyrak, siydik yo'llari va erkaklarda qo'shimcha jinsiy-tanosil a'zolari kasalliklarini o'rganuvchi va davolovchi tibbiyot sohasi."
 },
 {
  "savol": "Prostata bezi qaysi a'zolar guruhiga kiradi?",
  "variantlar": [
   "Siydik yo'llari a'zosi",
   "Erkak jinsiy-tanosil a'zosi",
   "Endokrin bez, gormonal tizim",
   "Limfa tugunlari guruhi"
  ],
  "togri": 1,
  "izoh": "Prostata — erkak jinsiy-tanosil a'zolariga kiradi."
 },
 {
  "savol": "Urologiyaning tor yo'nalishlaridan bo'lmagan variantni toping.",
  "variantlar": [
   "Andrologiya",
   "Onkourologiya",
   "Pediatrik urologiya",
   "Gastroenterologiya"
  ],
  "togri": 3,
  "izoh": "Gastroenterologiya — ovqat hazm qilish tizimi bilan shug'ullanadigan alohida soha, urologiyaga tegishli emas."
 },
 {
  "savol": "Funksional urologiya ko'proq qaysi bemorlar bilan ishlaydi?",
  "variantlar": [
   "Siydik tutolmasligi bo'lgan bemorlar",
   "Saraton kasalligi bo'lgan bemorlar",
   "Tug'ma anomaliyasi bo'lgan bolalar",
   "Faqat erkak bepushtligi bo'lgan bemorlar"
  ],
  "togri": 0,
  "izoh": "Funksional urologiya asosan siydik tutolmasligi va qovuq faoliyati buzilgan bemorlar bilan ishlaydi."
 },
 {
  "savol": "Onkourologiya doirasida saraton nuqtai nazaridan qaysi a'zo O'RGANILMAYDI?",
  "variantlar": [
   "Buyrak",
   "Qovuq",
   "Prostata",
   "Yurak"
  ],
  "togri": 3,
  "izoh": "Yurak — kardiologiya vakolat doirasiga tegishli, onkourologiya siydik-tanosil a'zolari saratoni bilan shug'ullanadi."
 },
 {
  "savol": "Endourologik usullarning an'anaviy ochiq jarrohlikdan asosiy afzalligi nima?",
  "variantlar": [
   "Kamroq invaziv, tezroq tiklanish",
   "Har doim arzonroq bo'ladi",
   "Faqat bolalarda qo'llaniladi",
   "Dori-darmonsiz davolash imkonini beradi"
  ],
  "togri": 0,
  "izoh": "Endourologiya kam invaziv bo'lgani uchun bemor tezroq tiklanadi."
 },
 {
  "savol": "\"Erkak reproduktiv salomatligi\" ta'rifi qaysi tor yo'nalishga tegishli?",
  "variantlar": [
   "Onkourologiya",
   "Andrologiya",
   "Pediatrik urologiya",
   "Funksional urologiya"
  ],
  "togri": 1,
  "izoh": "Andrologiya — erkak reproduktiv salomatligini o'rganadigan yo'nalish."
 },
 {
  "savol": "Siydik-tanosil a'zolari saratoni bilan shug'ullanadigan mutaxassis qanday nomlanadi?",
  "variantlar": [
   "Androlog",
   "Onkourolog",
   "Pediatr-urolog",
   "Funksional urolog"
  ],
  "togri": 1,
  "izoh": "Onkourolog — siydik-tanosil a'zolari saratoni bilan shug'ullanadigan mutaxassis."
 },
 {
  "savol": "Quyidagilardan qaysi biri \"siydik yo'llari\" tarkibiga KIRMAYDI?",
  "variantlar": [
   "Siydik naychalari (ureterlar)",
   "Siydik pufagi",
   "Uretra",
   "Urug' pufakchasi"
  ],
  "togri": 3,
  "izoh": "Urug' pufakchasi — erkak jinsiy-tanosil a'zosi, siydik yo'llariga emas."
 },
 {
  "savol": "Erkaklarda qo'shimcha jinsiy-tanosil a'zolarini o'z ichiga olgan urologiya, ayollarga nisbatan qanday tavsiflanadi?",
  "variantlar": [
   "Ayollardagidan tor doirali",
   "Ayollardagidan kengroq doirali",
   "Aynan bir xil",
   "Umuman bog'liq emas"
  ],
  "togri": 1,
  "izoh": "Erkaklarda urologiya jinsiy-tanosil a'zolarini ham qamragani uchun ayollardagiga nisbatan kengroq."
 },
 {
  "savol": "Bola yoshidagi bemorlarda uchraydigan siydik-tanosil kasalliklari bilan kim shug'ullanadi?",
  "variantlar": [
   "Androlog",
   "Pediatrik urolog",
   "Onkourolog",
   "Kardiolog"
  ],
  "togri": 1,
  "izoh": "Pediatrik urolog bolalardagi siydik-tanosil kasalliklari bilan shug'ullanadi."
 },
 {
  "savol": "Quyidagi yo'nalishlardan qaysi biri \"kam invaziv, endoskopik usullar\" ta'rifiga mos keladi?",
  "variantlar": [
   "Andrologiya",
   "Endourologiya",
   "Pediatrik urologiya",
   "Onkourologiya"
  ],
  "togri": 1,
  "izoh": "Endourologiya kam invaziv, endoskopik usullar bilan tavsiflanadi."
 },
 {
  "savol": "Urologiya sohasida \"predmet\" (o'rganish ob'yekti) sifatida eng to'g'ri ta'rifni tanlang.",
  "variantlar": [
   "Faqat buyrak kasalliklari",
   "Buyrak, siydik yo'llari va erkaklarda jinsiy-tanosil a'zolari kasalliklari",
   "Faqat jinsiy-tanosil a'zolari kasalliklari",
   "Faqat siydik pufagi kasalliklari"
  ],
  "togri": 1,
  "izoh": "Urologiyaning predmeti — buyrak, siydik yo'llari va erkaklarda qo'shimcha jinsiy-tanosil a'zolari kasalliklari."
 },
 {
  "savol": "Quyidagilardan qaysi biri erkak jinsiy-tanosil a'zolariga tegishli EMAS?",
  "variantlar": [
   "Prostata",
   "Moyak",
   "Urug' pufakchasi",
   "Siydik pufagi"
  ],
  "togri": 3,
  "izoh": "Siydik pufagi — siydik chiqarish tizimi a'zosi, jinsiy-tanosil a'zosi emas."
 },
 {
  "savol": "Siydik tutolmaslik muammosi bo'yicha ixtisoslashgan urolog qanday ataladi?",
  "variantlar": [
   "Funksional urolog",
   "Onkourolog",
   "Androlog",
   "Pediatrik urolog"
  ],
  "togri": 0,
  "izoh": "Funksional urolog siydik tutolmaslik va qovuq faoliyati buzilishi bo'yicha ixtisoslashgan."
 },
 {
  "savol": "Urologiya sohasidagi besh tor yo'nalishni to'g'ri sanab bering.",
  "variantlar": [
   "Andrologiya, onkourologiya, pediatrik urologiya, funksional urologiya, endourologiya",
   "Kardiologiya, nevrologiya, gastroenterologiya, pulmonologiya, endokrinologiya",
   "Travmatologiya, oftalmologiya, otorinolaringologiya, dermatologiya, psixiatriya",
   "Ftiziatriya, infeksionist, gematologiya, revmatologiya, allergologiya"
  ],
  "togri": 0,
  "izoh": "Urologiya ichidagi besh tor yo'nalish: andrologiya, onkourologiya, pediatrik urologiya, funksional urologiya va endourologiya."
 },
 {
  "savol": "Prostata, moyak va urug' yo'llari birgalikda qanday umumiy nom bilan ataladi?",
  "variantlar": [
   "Jinsiy-tanosil a'zolari",
   "Siydik yo'llari a'zolari",
   "Endokrin bezlar",
   "Limfa a'zolari"
  ],
  "togri": 0,
  "izoh": "Prostata, moyak va urug' yo'llari — erkaklarda urologiya vakolat doirasiga kiruvchi jinsiy-tanosil a'zolari."
 },
 {
  "savol": "Umumiy qilib aytganda, urologiya qaysi ta'rifga to'g'ri mos keladi?",
  "variantlar": [
   "Faqat erkaklar kasalliklarini davolovchi soha",
   "Buyrak va siydik yo'llari, shuningdek erkaklarda qo'shimcha jinsiy-tanosil a'zolari kasalliklarini o'rganuvchi va davolovchi tibbiyot sohasi",
   "Faqat bolalar kasalliklarini davolovchi soha",
   "Faqat diagnostika bilan shug'ullanuvchi soha (davolamaydi)"
  ],
  "togri": 1,
  "izoh": "Urologiya — buyrak va siydik yo'llari, shuningdek erkaklarda qo'shimcha jinsiy-tanosil a'zolari kasalliklarini o'rganuvchi va davolovchi tibbiyot sohasi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Asosiy urologik simptomlar: dizuriya, gematuriya, og'riq, siydik ushlanishi (oson)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('urologik-simptomlar', NULL, $dt_bank$[
 {
  "savol": "Dizuriya nima?",
  "variantlar": [
   "Siydikda qon bo'lishi",
   "Siyish vaqtidagi og'riq yoki achishish",
   "Siydik tutolmaslik",
   "Tez-tez siyish"
  ],
  "togri": 1,
  "izoh": "Dizuriya — siydik chiqarish vaqtida og'riq yoki achishish hissi."
 },
 {
  "savol": "Dizuriyaning eng ko'p uchraydigan sababi qaysi?",
  "variantlar": [
   "Buyrak toshi",
   "Sistit (qovuq yallig'lanishi)",
   "Prostata saratoni",
   "Gidronefroz"
  ],
  "togri": 1,
  "izoh": "Sistit — dizuriyaning eng ko'p uchraydigan sababi, ayniqsa ayollarda."
 },
 {
  "savol": "Gematuriya nima?",
  "variantlar": [
   "Siyishda og'riq",
   "Siydikda qon bo'lishi",
   "Siydik hajmining ko'payishi",
   "Siydik rangining sariq bo'lishi"
  ],
  "togri": 1,
  "izoh": "Gematuriya — siydikda qizil qon hujayralari (eritrotsitlar) borligini bildiradi."
 },
 {
  "savol": "Makrogematuriya va mikrogematuriyaning farqi nimada?",
  "variantlar": [
   "Makro — ko'z bilan ko'rinadi, mikro — faqat tahlilda aniqlanadi",
   "Ular orasida farq yo'q",
   "Mikrogematuriya har doim xavfliroq",
   "Makrogematuriya faqat erkaklarda uchraydi"
  ],
  "togri": 0,
  "izoh": "Makrogematuriya ko'z bilan ko'rinadigan qonli siydikni, mikrogematuriya esa faqat mikroskopik tahlilda aniqlanadigan eritrotsitlarni bildiradi."
 },
 {
  "savol": "Og'riqsiz makrogematuriyada eng birinchi qanday kasallikni istisno qilish kerak?",
  "variantlar": [
   "Sistit",
   "Urologik saraton (o'sma)",
   "Pielonefrit",
   "Prostatit"
  ],
  "togri": 1,
  "izoh": "Og'riqsiz makrogematuriya — urologik saratonning (ayniqsa qovuq saratoni) birinchi va ba'zan yagona belgisi bo'lishi mumkin."
 },
 {
  "savol": "O'tkir siydik ushlanishi qanday holat?",
  "variantlar": [
   "Asta-sekin rivojlanadi va og'riqsiz kechadi",
   "To'satdan boshlanadi, juda og'riqli va shoshilinch yordam talab qiladi",
   "Faqat ayollarda uchraydi",
   "Davolanishi shart emas"
  ],
  "togri": 1,
  "izoh": "O'tkir siydik ushlanishi to'satdan boshlanadi, kuchli og'riq va qovuqning to'lib-toshishi bilan kechadi — bu shoshilinch urologik holat."
 },
 {
  "savol": "Surunkali siydik ushlanishi qanday farq qiladi?",
  "variantlar": [
   "Asta-sekin rivojlanadi, ko'pincha og'riqsiz",
   "To'satdan boshlanadi, juda og'riqli",
   "Faqat bolalarda uchraydi",
   "Hech qachon davolanmaydi"
  ],
  "togri": 0,
  "izoh": "Surunkali siydik ushlanishi asta-sekin rivojlanadi, ko'pincha og'riqsiz kechadi va qovuqda doimiy qoldiq siydik bilan tavsiflanadi."
 },
 {
  "savol": "Buyrak og'rig'i odatda qaysi sohadа seziladi?",
  "variantlar": [
   "Suprapubik soha",
   "Bel-qovurg'a burchagi (kostovertebral burchak)",
   "Ko'krak qafasi",
   "Bo'yin sohasi"
  ],
  "togri": 1,
  "izoh": "Buyrak og'rig'i odatda bel-qovurg'a burchagida (12-qovurg'adan past, umurtqa yon tomonida) seziladi."
 },
 {
  "savol": "Siydik yo'li toshi og'rig'i ko'pincha qayerga aks etadi (irradiyatsiya)?",
  "variantlar": [
   "Yelka va qo'lga",
   "Moyak (erkaklarda) yoki labiya (ayollarda)ga",
   "Orqaga va bo'yinga",
   "Oyoq panjasiga"
  ],
  "togri": 1,
  "izoh": "Siydik yo'li og'rig'i umumiy nerv ta'minoti (T11–L1) tufayli moyak yoki labiyaga aks etishi mumkin."
 },
 {
  "savol": "Kolikasimon (to'siqli) og'riq va parenximatoz og'riqning asosiy farqi nima?",
  "variantlar": [
   "Kolika — bemor tinch turolmaydi; parenximatoz — bemor harakatsiz yotadi",
   "Ikkalasi ham bir xil kechadi",
   "Kolika faqat erkaklarda bo'ladi",
   "Parenximatoz og'riq faqat bolalarda uchraydi"
  ],
  "togri": 0,
  "izoh": "Kolikasimon og'riqda bemor qulay holat izlab harakat qiladi, parenximatoz og'riqda esa bemor harakatsiz yotishga harakat qiladi."
 },
 {
  "savol": "Stranguriya nima?",
  "variantlar": [
   "Siydikda qon",
   "Siydik chiqarish oxirida kuchli, achishtiruvchi og'riq",
   "Tez-tez siyish",
   "Siydik tutolmaslik"
  ],
  "togri": 1,
  "izoh": "Stranguriya — siydik chiqarish oxirida his qilinadigan kuchli, achishtiruvchi og'riq, ko'pincha qovuq yallig'lanishi belgisi."
 },
 {
  "savol": "Uretrit ko'pincha qanday infeksiyalar natijasida yuzaga keladi?",
  "variantlar": [
   "Nafas yo'llari infeksiyalari",
   "Jinsiy yo'l bilan yuqadigan infeksiyalar (gonoreya, xlamidiya)",
   "Teri infeksiyalari",
   "Ichak infeksiyalari"
  ],
  "togri": 1,
  "izoh": "Uretrit ko'pincha jinsiy yo'l bilan yuqadigan infeksiyalar (gonoreya, xlamidiya, gerpes) natijasida yuzaga keladi."
 },
 {
  "savol": "Dizuriya bilan birga uretral ajralma bo'lsa, eng ehtimoliy tashxis nima?",
  "variantlar": [
   "Sistit",
   "Uretrit",
   "Pielonefrit",
   "Buyrak toshi"
  ],
  "togri": 1,
  "izoh": "Dizuriya + uretral ajralma birikishi uretrit (ko'pincha JYI tufayli)ga xos belgi hisoblanadi."
 },
 {
  "savol": "Ayollarda dizuriyaga o'xshash shikoyat beruvchi, lekin siydik yo'li infeksiyasi bo'lmagan holat qaysi?",
  "variantlar": [
   "Pielonefrit",
   "Vaginit",
   "Gidronefroz",
   "Buyrak yetishmovchiligi"
  ],
  "togri": 1,
  "izoh": "Vaginit ayollarda dizuriyaga o'xshash og'riq berishi mumkin, lekin aslida qin sohasidan keladigan og'riq."
 },
 {
  "savol": "Mikroskopik gematuriya qanday aniqlanadi?",
  "variantlar": [
   "Bemor siydik rangini o'zi ko'radi",
   "Faqat mikroskop tekshiruvida (HPF da 3 tadan ortiq eritrotsit)",
   "Siydik hidi o'zgarishi bilan",
   "Faqat qon tahlili orqali"
  ],
  "togri": 1,
  "izoh": "Mikroskopik gematuriya ko'zga ko'rinmaydi, faqat mikroskop ostida yuqori quvvatli maydonda (HPF) 3 tadan ortiq eritrotsit aniqlansa tashxislanadi."
 },
 {
  "savol": "Gematuriyani siydik oqimining boshlang'ich qismida ko'rish nimani ko'rsatadi?",
  "variantlar": [
   "Buyrak manbali qon ketishni",
   "Uretra yoki prostata manbali qon ketishni",
   "Qovuq saratonini",
   "Normal fiziologik holatni"
  ],
  "togri": 1,
  "izoh": "Boshlang'ich (initial) gematuriya uretra yoki prostata manbai haqida dalolat beradi."
 },
 {
  "savol": "Total gematuriya (butun oqim davomida qon) qaysi manba haqida ma'lumot beradi?",
  "variantlar": [
   "Faqat uretra",
   "Faqat prostata",
   "Yuqori siydik yo'llari yoki qovuq",
   "Moyak"
  ],
  "togri": 2,
  "izoh": "Total gematuriya — yuqori siydik yo'llari (buyrak, ureter) yoki qovuq manbasini ko'rsatadi."
 },
 {
  "savol": "AUA tasnifiga ko'ra, mikroskopik gematuriyali bemorlar qanday guruhlarga bo'linadi?",
  "variantlar": [
   "Past, o'rta va yuqori xavf",
   "Faqat yuqori va past xavf",
   "Xavf guruhlarga bo'linmaydi",
   "Yoshga qarab faqat ikki guruh"
  ],
  "togri": 0,
  "izoh": "AUA qo'llanmasi bo'yicha bemorlar yosh, jins, chekish tarixi va gematuriya darajasiga qarab past, o'rta va yuqori xavf guruhlariga bo'linadi."
 },
 {
  "savol": "Qovuq og'rig'i odatda qaysi sohadа seziladi?",
  "variantlar": [
   "Bel-qovurg'a burchagida",
   "Suprapubik sohadа",
   "Tos sohasida",
   "Ko'krak qafasida"
  ],
  "togri": 1,
  "izoh": "Qovuq og'rig'i suprapubik sohadа seziladi, qovuq to'lganda kuchayadi va bo'shagandan keyin yengillashadi."
 },
 {
  "savol": "O'tkir siydik ushlanishida birinchi qilinishi kerak bo'lgan amaliy qadam nima?",
  "variantlar": [
   "Qovuq ultratovushi",
   "Kechiktirmasdan kateterizatsiya (qovuqni bo'shatish)",
   "Antibiotik berish",
   "Bemor kuzatish"
  ],
  "togri": 1,
  "izoh": "O'tkir siydik ushlanishida birinchi navbatda qovuqni kateterizatsiya orqali bo'shatish kerak — bu shoshilinch holat."
 },
 {
  "savol": "Agar uretral kateterizatsiya imkonsiz bo'lsa, nima qilinadi?",
  "variantlar": [
   "Hech narsa qilinmaydi",
   "Suprapubik kateter qo'yiladi",
   "Faqat antibiotik beriladi",
   "Bemor uyga yuboriladi"
  ],
  "togri": 1,
  "izoh": "Uretral kateterizatsiya imkonsiz bo'lsa (masalan, uretra jarohati shubhasi), suprapubik kateter qo'yiladi — qorin old devori orqali to'g'ridan-to'g'ri qovuqqa."
 },
 {
  "savol": "PVR (postvoid residual) nima?",
  "variantlar": [
   "Siydik chiqargandan keyin qovuqda qolgan siydik hajmi",
   "Buyrakda filtratsiyadagi qoldiq",
   "Siydikdagi oqsil miqdori",
   "Qovuq hajmining umumiy sig'imi"
  ],
  "togri": 0,
  "izoh": "PVR — siydik chiqargandan keyin qovuqda qolgan siydik miqdori, ultratovush yoki kateterizatsiya yordamida o'lchanadi."
 },
 {
  "savol": "Prostata kattalashishi (BPH) asosan qanday simptomga sabab bo'ladi?",
  "variantlar": [
   "Gematuriya",
   "Siydik ushlanishi",
   "Dizuriya",
   "Buyrak og'rig'i"
  ],
  "togri": 1,
  "izoh": "BPH uretrani toraytirib, siydik ushlanishi va pastki siydik yo'llari simptomlarini keltirib chiqaradi."
 },
 {
  "savol": "Pielonefritda og'riq qanday xarakterga ega?",
  "variantlar": [
   "Kolikasimon, intermittent",
   "Doimiy, bel sohasida, CVAT bilan birga",
   "Suprapubik sohadа, tez-tez siyish bilan",
   "Og'riqsiz kechadi"
  ],
  "togri": 1,
  "izoh": "Pielonefritda og'riq doimiy xarakterda bo'lib, bel-qovurg'a burchagi og'riqliligi (CVAT) bilan birga kechadi."
 },
 {
  "savol": "CVAT nima va qaysi kasallikda aniqlanadi?",
  "variantlar": [
   "Bel-qovurg'a burchagida palpatsiyada og'riqlilik — pielonefrit belgisi",
   "Suprapubik og'riq — sistit belgisi",
   "Moyak og'rig'i — orxoepididimit belgisi",
   "Uretra og'rig'i — uretrit belgisi"
  ],
  "togri": 0,
  "izoh": "CVAT (Costovertebral Angle Tenderness) — bel-qovurg'a burchagida palpatsiyada og'riqlilik, pielonefrit belgisi."
 },
 {
  "savol": "Katta yoshdagi chekuvchi bemorda davom etuvchi dizuriya qanday kasallik belgisi bo'lishi mumkin?",
  "variantlar": [
   "Oddiy sistit",
   "Yashirin qovuq saratoni (carcinoma in situ)",
   "Gidronefroz",
   "Kriptorxizm"
  ],
  "togri": 1,
  "izoh": "50 yoshdan katta, chekish tarixi bo'lgan bemorlarda davom etuvchi dizuriya qovuq saratoni (CIS) belgisi bo'lishi mumkin."
 },
 {
  "savol": "Siydik yo'li toshlariga xos og'riq qanday boshlanadi?",
  "variantlar": [
   "Asta-sekin, kunlar davomida",
   "To'satdan, o'tkir boshlanish bilan",
   "Faqat tungi paytda",
   "Og'riqsiz kechadi"
  ],
  "togri": 1,
  "izoh": "Siydik yo'li toshiga xos og'riq o'tkir boshlanadi, kolikasimon xarakterda bo'ladi."
 },
 {
  "savol": "Quyidagi simptomlardan qaysi biri saqlanish (storage) simptomlari guruhiga kiradi?",
  "variantlar": [
   "Siyish oqimining kuchsizligi",
   "Tez-tez siyish (frequency) va nokturiya",
   "Siyishni boshlashda kuchanish",
   "Uzilib-uzilib siyish"
  ],
  "togri": 1,
  "izoh": "Tez-tez siyish va nokturiya — saqlanish (storage) simptomlari guruhiga kiradi."
 },
 {
  "savol": "Quyidagilardan qaysi biri bo'shatish (voiding) simptomi?",
  "variantlar": [
   "To'satdan kuchli siyish ehtiyoji (urgency)",
   "Siyish oqimining kuchsizligi",
   "Nokturiya (tungi siyish)",
   "Tez-tez siyish"
  ],
  "togri": 1,
  "izoh": "Siyish oqimining kuchsizligi — bo'shatish (voiding) simptomlariga kiradi."
 },
 {
  "savol": "Og'riq va og'riqlilik (tenderness) orasidagi farq nima?",
  "variantlar": [
   "Og'riq — bemorning subyektiv tuyg'usi, og'riqlilik — shifokor palpatsiyasida aniqlanadigan ob'ektiv belgi",
   "Ular bir xil narsa",
   "Og'riqlilik faqat laboratoriyada aniqlanadi",
   "Og'riq faqat bolalarda bo'ladi"
  ],
  "togri": 0,
  "izoh": "Og'riq bemorning o'zi his qiladigan subyektiv tuyg'u, og'riqlilik esa shifokor tekshiruvida aniqlanadigan ob'ektiv belgi."
 },
 {
  "savol": "Siydik ushlanishining nevrologik sabablari qaysi?",
  "variantlar": [
   "Orqa miya jarohati, ko'p tarqalgan skleroz, diabetik neyropatiya",
   "Faqat BPH",
   "Faqat uretra torayishi",
   "Faqat prostatit"
  ],
  "togri": 0,
  "izoh": "Nevrologik sabablar: orqa miya jarohati, ko'p tarqalgan skleroz va diabetga bog'liq neyropatiya siydik ushlanishiga olib kelishi mumkin."
 },
 {
  "savol": "Qaysi dori-darmonlar siydik ushlanishiga sabab bo'lishi mumkin?",
  "variantlar": [
   "Antibiotiklar",
   "Antikolinergik vositalar, simpatomimetiklar, opioidlar",
   "Vitaminlar",
   "Antigipertenziv vositalarning barchasi"
  ],
  "togri": 1,
  "izoh": "Antikolinergik va simpatomimetik vositalar, hamda opioidlar qovuq faoliyatini buzib, siydik ushlanishiga sabab bo'lishi mumkin."
 },
 {
  "savol": "Yuqori xavfli mikroskopik gematuriya bemorida qanday tekshiruv tavsiya etiladi?",
  "variantlar": [
   "Faqat qayta siydik tahlili",
   "Sistoskopiya + kompyuter tomografiya urografiyasi (CTU)",
   "Faqat antibiotik berish",
   "Hech qanday tekshiruv kerak emas"
  ],
  "togri": 1,
  "izoh": "Yuqori xavfli guruhdagi bemorlarga sistoskopiya va CTU tavsiya etiladi."
 },
 {
  "savol": "Terminal gematuriya (siydik oqimining oxirida qon) qaysi manba haqida gapiradi?",
  "variantlar": [
   "Buyrak manbasi",
   "Qovuq bo'yni manbasi",
   "Uretra manbasi",
   "Moyak manbasi"
  ],
  "togri": 1,
  "izoh": "Terminal gematuriya qovuq bo'yni manbasini ko'rsatadi."
 },
 {
  "savol": "Dizuriya bilan birga isitma va bel og'rig'i bo'lsa, eng ehtimoliy tashxis nima?",
  "variantlar": [
   "Sistit",
   "Pielonefrit",
   "Uretrit",
   "Qovuq saratoni"
  ],
  "togri": 1,
  "izoh": "Dizuriya + isitma + bel og'rig'i (CVAT) — pielonefritga xos klassik uchlik."
 },
 {
  "savol": "Siydik ekinmasi (urine culture) qachon zarur bo'ladi?",
  "variantlar": [
   "Har doim, barcha bemorlarda",
   "Klinik belgilarga mos kelmagan hollarda, dipstick natijasini tasdiqlash uchun",
   "Faqat erkaklarda",
   "Hech qachon kerak emas"
  ],
  "togri": 1,
  "izoh": "Klinik belgilarga mos kelmagan holatlarda siydik ekinmasi bilan bakterial infeksiyani tasdiqlash kerak."
 },
 {
  "savol": "Qovuq og'rig'i qachon kuchayadi?",
  "variantlar": [
   "Qovuq bo'shagandan keyin",
   "Qovuq to'lganda",
   "Faqat tungi paytda",
   "Faqat erta tongda"
  ],
  "togri": 1,
  "izoh": "Qovuq og'rig'i suprapubik sohadа qovuq to'lganda kuchayadi va bo'shagandan keyin yengillashadi."
 },
 {
  "savol": "To'rtta asosiy urologik simptomni to'g'ri sanab bering.",
  "variantlar": [
   "Dizuriya, gematuriya, og'riq, siydik ushlanishi",
   "Isitma, yo'tal, bosh og'rig'i, ko'ngil aynishi",
   "Terlash, holsizlik, ishtaha yo'qolishi, og'riq",
   "Qichishish, shishish, qizarish, issiqlik"
  ],
  "togri": 0,
  "izoh": "Urologiyada to'rtta asosiy simptom: dizuriya, gematuriya, og'riq va siydik ushlanishi."
 },
 {
  "savol": "Uretra torayishi (stricture) qanday simptomga sabab bo'ladi?",
  "variantlar": [
   "Gematuriya",
   "Siydik oqimining kuchsizligi va siydik ushlanishi",
   "Buyrak og'rig'i",
   "Tez-tez siyish"
  ],
  "togri": 1,
  "izoh": "Uretra torayishi siydik oqimini mexanik ravishda to'sib, siydik ushlanishi va oqim kuchsizligiga sabab bo'ladi."
 },
 {
  "savol": "Bemor anamnezida (HPI) qaysi ma'lumotlar aniqlash shart?",
  "variantlar": [
   "Og'riq joylashuvi, xarakteri, boshlanish vaqti, kuchaytiruvchi/yengillashtiruvchi omillar",
   "Faqat bemor ismi va yoshi",
   "Faqat laboratoriya natijalari",
   "Faqat oilaviy anamnez"
  ],
  "togri": 0,
  "izoh": "HPI (kasallik anamnezi) da alomatning joylashuvi, xarakteri, boshlanish vaqti va kuchayish/pasayish omillarini aniqlash shart."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Gidronefroz — nima va nima uchun yuzaga keladi (oson)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('gidronefroz-asoslari', NULL, $dt_bank$[
 {
  "savol": "Gidronefroz qanday ta'riflanadi?",
  "variantlar": [
   "Buyrak to'qimasining yallig'lanishi",
   "Buyrak jomi va kosachalarning siydik bilan to'lib kengayishi",
   "Siydik yo'lining infeksiyasi",
   "Prostata bezining kattalashishi"
  ],
  "togri": 1,
  "izoh": "Gidronefroz (hydronephrosis) — buyrak jomi (renal pelvis) va kosachalarning (calyces) siydik bilan to'lib, kengayishi. Siydik oqimi to'silganda yuzaga keladi."
 },
 {
  "savol": "Gidronefroz mustaqil kasallikmi?",
  "variantlar": [
   "Ha, alohida nozologik kasallik",
   "Yo'q, u radiologik belgi (belgisi boshqa sababning)",
   "Ha, lekin faqat bolalarda kasallik",
   "Yo'q, u faqat funksional o'zgarish"
  ],
  "togri": 1,
  "izoh": "Gidronefroz mustaqil kasallik emas, balki radiologik belgi. U har doim ham haqiqiy to'siqni anglatmaydi — VURda yoki hatto normal variantda ham kuzatilishi mumkin."
 },
 {
  "savol": "Koff (1987) ta'rifiga ko'ra 'to'siq' (obstruction) nima?",
  "variantlar": [
   "Siydik yo'lining anatomik torayishi",
   "Davolanmasa progressiv buyrak shikastlanishiga olib keladigan siydik oqimining har qanday cheklanishi",
   "Buyrak jomining 10 mm dan ortiq kengayishi",
   "Siydik yo'lida toshning mavjudligi"
  ],
  "togri": 1,
  "izoh": "Koff to'siqni shunday ta'riflagan: 'davolanmasa progressiv buyrak shikastlanishiga olib keladigan siydik oqimining har qanday cheklanishi'. Ya'ni buyrak funksiyasiga ta'siri asosiy mezon."
 },
 {
  "savol": "Siydik yo'li ham kengaygan bo'lsa, holat qanday ataladi?",
  "variantlar": [
   "Gidronefroz",
   "Gidroureteronefroz",
   "Megaureter",
   "Pielonefrit"
  ],
  "togri": 1,
  "izoh": "Buyrak jomi bilan birga siydik yo'li ham kengaygan bo'lsa, holat gidroureteronefroz (hydroureteronephrosis) deyiladi — bu to'siq siydik yo'lining pastroq qismida joylashganini ko'rsatadi."
 },
 {
  "savol": "Bolalarda gidronefrozning eng ko'p sababi qaysi?",
  "variantlar": [
   "Siydik yo'li toshi",
   "BPH (prostata kattalashishi)",
   "UPJ (buyrak jomi-siydik yo'li tutashuvi) to'siqlanishi",
   "Siydik yo'li infeksiyasi"
  ],
  "togri": 2,
  "izoh": "Bolalarda va yangi tug'ilganlarda gidronefrozning eng ko'p sababi — UPJ to'siqlanishi, ko'pincha UPJ segmentining ichki torayishi tufayli."
 },
 {
  "savol": "Kattalarda gidronefrozning eng ko'p o'tkir sababi qaysi?",
  "variantlar": [
   "UPJ to'siqlanishi",
   "BPH",
   "Siydik yo'li toshi",
   "O'sma bosimi"
  ],
  "togri": 2,
  "izoh": "Kattalarda gidronefrozning eng ko'p o'tkir sababi — siydik yo'li toshi. BPH esa katta yoshli erkaklarda sekin rivojlanuvchi ikki tomonlama gidronefrozga olib kelishi mumkin."
 },
 {
  "savol": "To'liq siydik yo'li to'sig'idan qancha vaqt o'tgach buyrakda yallig'lanish, tubulyar atrofiya va interstitsial fibroz boshlanishi mumkin?",
  "variantlar": [
   "24 soat ichida",
   "Atigi 2 soat ichida",
   "1 hafta ichida",
   "1 oy ichida"
  ],
  "togri": 1,
  "izoh": "To'liq to'siqdan atigi 2 soat ichida yallig'lanish, tubulyar atrofiya va interstitsial fibroz boshlanishi mumkin — shu sababli o'tkir to'siq shoshilinch yordam talab qiladi."
 },
 {
  "savol": "Ikki tomonlama siydik yo'li to'siqlanishi qanday jiddiy oqibatga olib kelishi mumkin?",
  "variantlar": [
   "Faqat og'riqqa",
   "O'tkir buyrak yetishmovchiligi (AKI)",
   "Faqat gipertoniyaga",
   "Hech qanday jiddiy oqibatga"
  ],
  "togri": 1,
  "izoh": "Ikki tomonlama siydik yo'li to'siqlanishi yoki yagona buyrakning to'silishi o'tkir buyrak yetishmovchiligi (AKI) rivojlanishiga olib kelishi mumkin — bu shoshilinch aralashuvni talab qiladi."
 },
 {
  "savol": "Antenatal gidronefroz odatda qachon aniqlanadi?",
  "variantlar": [
   "Tug'ruq paytida",
   "Homiladorlikning ~20-haftasidagi ultratovush skriningida",
   "Tug'ruqdan 1 oy keyin",
   "Homiladorlikning 1-trimestrida"
  ],
  "togri": 1,
  "izoh": "Antenatal gidronefroz — homiladorlikning ~20-haftasidagi ultratovush skriningida eng ko'p aniqlanadigan urogenital anomaliya."
 },
 {
  "savol": "APD nima va u nimani o'lchaydi?",
  "variantlar": [
   "Arterial qon bosimi darajasi",
   "Buyrak jomi old-orqa o'lchami",
   "Siydik yo'lining diametri",
   "Buyrak parenximasining qalinligi"
  ],
  "togri": 1,
  "izoh": "APD (anteroposterior diameter) — buyrak jomi old-orqa o'lchami. Antenatal gidronefrozning og'irligini baholashda asosiy parametr."
 },
 {
  "savol": "SFU darajalash tizimi qanday tizim va faqat qachon qo'llaniladi?",
  "variantlar": [
   "6 darajali, prenatal davrda",
   "5 darajali (0-4), faqat postnatal davrda",
   "3 darajali, prenatal va postnatal davrda",
   "10 darajali, faqat kattalarda"
  ],
  "togri": 1,
  "izoh": "SFU — buyrak jomi/kosacha kengayishi va parenxima holatiga asoslangan subyektiv 5 darajali (0-4) tizim. Faqat tug'ruqdan keyin (postnatal) qo'llaniladi."
 },
 {
  "savol": "UTD darajalash tizimi kimlar tomonidan ishlab chiqilgan?",
  "variantlar": [
   "Bitta olim tomonidan",
   "Sakkizta ilmiy jamiyat hamkorligida",
   "AUA yagona tashkilot tomonidan",
   "EAU yagona tashkilot tomonidan"
  ],
  "togri": 1,
  "izoh": "UTD tizimi sakkizta ilmiy jamiyat hamkorligida ishlab chiqilgan yagona tizim bo'lib, prenatal va postnatal davrni birlashtiradi."
 },
 {
  "savol": "Postnatal APD qanday qiymatda klinik ahamiyatsiz o'tkinchi kengayish hisoblanadi?",
  "variantlar": [
   "<5 mm",
   "<10 mm (kosacha/siydik yo'li kengayishisiz)",
   "<15 mm",
   "<20 mm"
  ],
  "togri": 1,
  "izoh": "Postnatal APD <10 mm (kosacha yoki siydik yo'li kengayishisiz) — normal, klinik ahamiyatsiz o'tkinchi kengayish hisoblanadi."
 },
 {
  "savol": "Gidronefroz tufayli ikkilamchi gipertoniya qanday mexanizm orqali rivojlanadi?",
  "variantlar": [
   "Buyrak infeksiyasi tufayli",
   "Renin-angiotenzin-aldosteron tizimi (RAAS) faollashishi tufayli",
   "To'g'ridan-to'g'ri qon bosimiga ta'sir qilish orqali",
   "Siydik orqali natriy yo'qolishi tufayli"
  ],
  "togri": 1,
  "izoh": "Siydik yo'li to'siqlanishi RAAS tizimini faollashtiradi — bu ikkilamchi gipertoniyaning asosiy mexanizmi."
 },
 {
  "savol": "Ikkilamchi gipertoniya ikki tomonlama va bir tomonlama to'siqda qanday uchraydi?",
  "variantlar": [
   "Ikkalasida bir xil (50%)",
   "Ikki tomonlamada ko'proq (77%) va bir tomonlamada kamroq (<20%)",
   "Bir tomonlamada ko'proq (80%)",
   "Faqat bir tomonlama to'siqda"
  ],
  "togri": 1,
  "izoh": "Ikki tomonlama to'siqda gipertoniya (77%) bir tomonlamaga (<20%) nisbatan ko'proq uchraydi."
 },
 {
  "savol": "Postobstruktiv diurez nima?",
  "variantlar": [
   "To'siq paytida siydik chiqishining to'xtashi",
   "To'siq bartaraf etilgandan keyin ko'p miqdorda siydik chiqishi",
   "Buyrak yetishmovchiligi natijasida siydik kamayishi",
   "Infeksiya tufayli siydik miqdorining oshishi"
  ],
  "togri": 1,
  "izoh": "Postobstruktiv diurez — to'siq bartaraf etilgandan keyin ba'zi bemorlarda kuzatiladigan ko'p miqdorda siydik chiqishi holati. Suyuqlik va elektrolit muvozanatini diqqat bilan kuzatishni talab qiladi."
 },
 {
  "savol": "Antenatal gidronefrozda og'ir holatlarda tug'ruqdan keyin patologiya topilishi ehtimoli qanchani tashkil etadi?",
  "variantlar": [
   "~12% gacha",
   "~50% gacha",
   "~88% gacha",
   "~100%"
  ],
  "togri": 2,
  "izoh": "Antenatal gidronefroz og'irligi bilan patologiya topilishi bog'liq: yengil holatda ~12%, og'ir holatda ~88% gacha. Eng ko'p bog'liq patologiya — UPJ to'siqlanishi."
 },
 {
  "savol": "Gidronefrozni baholashning 'oltin standarti' qaysi tekshiruv usuli?",
  "variantlar": [
   "Oddiy ultratovush",
   "Kompyuter tomografiyasi (KT)",
   "Diuretik renografiya",
   "Vena urografiyasi"
  ],
  "togri": 2,
  "izoh": "Diuretik renografiya gidronefrozni baholashning oltin standarti hisoblanadi — u to'siqning funksional ahamiyatini va buyrak drenazhini aniqlaydi."
 },
 {
  "savol": "Ikki tomonlama gidroureteronefroz + qalinlashgan qovuq + yomon bo'shalish topilganda nima istisno qilinishi kerak?",
  "variantlar": [
   "Pielonefrit",
   "Orqa uretra valvalari (PUV)",
   "UPJ to'siqlanishi",
   "Siydik toshi"
  ],
  "togri": 1,
  "izoh": "Ikki tomonlama gidroureteronefroz + qalinlashgan qovuq + yomon bo'shalish topilganda — VCUG orqali orqa uretra valvalari (PUV) istisno qilinishi kerak."
 },
 {
  "savol": "To'siq natijasida buyrak perfuziyasi va GFR qanday o'zgaradi?",
  "variantlar": [
   "Ortadi",
   "Pasayadi",
   "O'zgarmaydi",
   "Avval ortadi, keyin pasayadi"
  ],
  "togri": 1,
  "izoh": "Yig'uvchi tizimdagi yuqori bosim buyrak perfuziyasi (qon ta'minoti) va glomerulyar filtratsiya tezligi (GFR)ni pasaytiradi — bu ishemik shikastlanishga olib keladi."
 },
 {
  "savol": "Gidronefroz atamasining so'zma-so'z ma'nosi nima?",
  "variantlar": [
   "Buyrak yallig'lanishi",
   "Buyrakda suv (hydro — suv, nephros — buyrak)",
   "Siydik yo'li kengayishi",
   "Buyrak toshi"
  ],
  "togri": 1,
  "izoh": "Hydronephrosis — yunoncha hydro (suv) + nephros (buyrak) + osis (holat) so'zlaridan. Buyrak jomida siydik (suv) to'planishini anglatadi."
 },
 {
  "savol": "VUR (vezikoureteral reflyuks)da gidronefroz qanday yuzaga keladi?",
  "variantlar": [
   "To'siq tufayli",
   "Siydikni qovuqdan buyrakkka teskari oqishi tufayli",
   "Infeksiya tufayli",
   "Tosh tufayli"
  ],
  "togri": 1,
  "izoh": "VURda gidronefroz to'siq bo'lmagan holda ham kuzatilishi mumkin — siydik qovuqdan ureter orqali buyrakkka qayta oqishi natijasida kengayish yuzaga keladi."
 },
 {
  "savol": "Gidronefrozda siydik yig'uvchi tizimidagi bosim oshishi qaysi strukturani kengaytiradi?",
  "variantlar": [
   "Faqat siydik naychasini",
   "Buyrak jomi va kosachalarni",
   "Faqat qovuqni",
   "Uretra va qovuqni"
  ],
  "togri": 1,
  "izoh": "Oshgan bosim buyrak jomi (renal pelvis) va kosachalarni (calyces) asta-sekin kengaytiradi — bu gidronefroz ko'rinishidir."
 },
 {
  "savol": "Qaysi holat 'normal variant' sifatida baholanib, gidronefrozga o'xshash ko'rinishi mumkin?",
  "variantlar": [
   "Siydik yo'li toshi",
   "Hech qanday to'siq bo'lmagan holda siydik yo'lining kengayishi",
   "BPH",
   "Pielonefrit"
  ],
  "togri": 1,
  "izoh": "Gidronefroz har doim ham haqiqiy to'siqni anglatmaydi — ba'zan siydik yo'lining kengayishi normal variant bo'lishi mumkin, bu ayniqsa bolalarda diqqatni talab qiladi."
 },
 {
  "savol": "Koff ta'rifiga ko'ra to'siqda asosiy mezon nima?",
  "variantlar": [
   "Siydik yo'li diametrining kattaligi",
   "Buyrak funksiyasiga ta'siri",
   "Gidronefrozning darajasi",
   "Og'riqning kuchliligi"
  ],
  "togri": 1,
  "izoh": "Koff ta'rifiga ko'ra to'siqda asosiy mezon — buyrak funksiyasiga ta'siri: 'davolanmasa progressiv buyrak shikastlanishiga olib keladigan' cheklanish."
 },
 {
  "savol": "UPJ to'siqlanishi nima?",
  "variantlar": [
   "Ureter-qovuq tutashuvi to'siqlanishi",
   "Buyrak jomi-siydik yo'li tutashuvi to'siqlanishi",
   "Uretra to'siqlanishi",
   "Qovuq bo'yni to'siqlanishi"
  ],
  "togri": 1,
  "izoh": "UPJ (ureteropelvic junction) — buyrak jomi va siydik naychasi tutashadigan nuqta. Bu yerning to'silishi bolalarda gidronefrozning eng ko'p sababi."
 },
 {
  "savol": "Katta yoshli erkaklarda sekin rivojlanuvchi ikki tomonlama gidronefrozning eng ko'p sababi qaysi?",
  "variantlar": [
   "Siydik yo'li toshi",
   "UPJ to'siqlanishi",
   "BPH (prostata giperplaziyasi)",
   "Siydik yo'li saraton"
  ],
  "togri": 2,
  "izoh": "Katta yoshli erkaklarda BPH — prostata kattalashishi siydik chiqishini sekin-asta qiyinlashtirib, ikki tomonlama gidronefrozga olib kelishi mumkin."
 },
 {
  "savol": "To'liq siydik yo'li to'sig'ida interstitsial fibroz qachon boshlanishi mumkin?",
  "variantlar": [
   "24 soatdan keyin",
   "1 haftadan keyin",
   "Atigi 2 soat ichida",
   "1 oydan keyin"
  ],
  "togri": 2,
  "izoh": "To'liq to'siqdan atigi 2 soat ichida yallig'lanish, tubulyar atrofiya va interstitsial fibroz boshlanishi mumkin — bu to'siq urologiyada shoshilinch holat ekanini belgilaydi."
 },
 {
  "savol": "Yagona buyrakning to'silishi nima uchun ayniqsa xavfli?",
  "variantlar": [
   "Og'riq kuchliroq bo'ladi",
   "Ikkinchi buyrak zaxira yo'q — AKI rivojlanishi muqarrar",
   "Operatsiya qiyinroq",
   "Dori kam yordam qiladi"
  ],
  "togri": 1,
  "izoh": "Yagona buyrak to'silsa, kompensatsiya qiladigan ikkinchi buyrak yo'q — o'tkir buyrak yetishmovchiligi (AKI) muqarrar ravishda tez rivojlanadi."
 },
 {
  "savol": "Antenatal gidronefrozda 'APD' ning to'liq nomi nima?",
  "variantlar": [
   "Arterial-pulmonar diametr",
   "Buyrak jomi old-orqa o'lchami (anteroposterior diameter)",
   "Aminokislota pelvikalikeal diametr",
   "Antenatal postnatal darajalash"
  ],
  "togri": 1,
  "izoh": "APD — anteroposterior diameter, ya'ni buyrak jomining old-orqa o'lchami. Antenatal gidronefrozni og'irlik darajasi bo'yicha tasniflashda asosiy parametr."
 },
 {
  "savol": "2-trimestrda APD qancha mm bo'lsa o'rtacha (moderate) antenatal gidronefroz deyiladi?",
  "variantlar": [
   "2–4 mm",
   "4–7 mm",
   "7–10 mm",
   ">10 mm"
  ],
  "togri": 2,
  "izoh": "2-trimestrda APD 7–10 mm bo'lsa o'rtacha (moderate) antenatal gidronefroz. Yengil: 4–<7 mm, og'ir: >10 mm."
 },
 {
  "savol": "SFU tizimida nechta daraja mavjud?",
  "variantlar": [
   "3 ta (1–3)",
   "5 ta (0–4)",
   "6 ta (0–5)",
   "10 ta (1–10)"
  ],
  "togri": 1,
  "izoh": "SFU (Society for Fetal Urology) tizimi 5 darajali: 0 (normal) dan 4 (og'ir, parenxima ingichka) gacha."
 },
 {
  "savol": "UTD tizimining SFU tizimidan asosiy ustunligi nima?",
  "variantlar": [
   "Oddiyroq",
   "Prenatal va postnatal davrni birlashtiradi",
   "Faqat og'ir holatlarni aniqlaydi",
   "Kamroq parametr baholaydi"
  ],
  "togri": 1,
  "izoh": "UTD (Urinary Tract Dilation) tizimi prenatal va postnatal davrni birlashtirib, 6 ta parametrni baholaydi va bemorni xavf guruhlariga ajratadi."
 },
 {
  "savol": "Bolalarda ikkilamchi gipertoniyaning qancha foizi buyrak parenxima kasalligi sababli?",
  "variantlar": [
   "20–30%",
   "40–50%",
   "60–80%",
   "90–100%"
  ],
  "togri": 2,
  "izoh": "Bolalarda ikkilamchi gipertoniyaning 60–80% sababi buyrak parenxima kasalligi (jumladan obstruktiv uropatiyadagi gidronefrozda RAAS faollashishi)."
 },
 {
  "savol": "Postobstruktiv diurezda asosiy xavf nima?",
  "variantlar": [
   "Infeksiya",
   "Suyuqlik va elektrolit muvozanatining buzilishi",
   "Gipertoniya",
   "Buyrak toshi hosil bo'lishi"
  ],
  "togri": 1,
  "izoh": "Postobstruktiv diurezda ko'p siydik chiqishi suyuqlik va elektrolit (natriy, kaliy) muvozanatini buzadi — diqqat bilan kuzatish va to'ldirish talab qilinadi."
 },
 {
  "savol": "Antenatal gidronefrozda yengil holatlarda tug'ruqdan keyin patologiya topilish ehtimoli qancha?",
  "variantlar": [
   "~12%",
   "~30%",
   "~50%",
   "~88%"
  ],
  "togri": 0,
  "izoh": "Yengil antenatal gidronefrozda tug'ruqdan keyin patologiya topilishi ehtimoli ~12%, og'irda esa ~88% gacha ko'tariladi."
 },
 {
  "savol": "Antenatal gidronefrozda eng ko'p uchraydigan patologiya qaysi?",
  "variantlar": [
   "Siydik toshi",
   "UPJ to'siqlanishi",
   "VUR",
   "BPH"
  ],
  "togri": 1,
  "izoh": "Antenatal gidronefrozda eng ko'p bog'liq patologiya — UPJ to'siqlanishi (buyrak jomi-ureter tutashuvi stenozi)."
 },
 {
  "savol": "VCUG tekshiruvi qaysi holatda zarur?",
  "variantlar": [
   "Barcha gidronefrozlarda",
   "Bir tomonlama gidronefrozda",
   "Ikki tomonlama gidroureteronefroz + qalinlashgan qovuq topilganda",
   "Faqat og'riq bo'lganda"
  ],
  "togri": 2,
  "izoh": "Ikki tomonlama gidroureteronefroz + qalinlashgan qovuq + yomon bo'shalish topilganda VCUG orqali orqa uretra valvalari (PUV) istisno qilinishi kerak."
 },
 {
  "savol": "Gidronefrozda diagnostikaning asosiy savoli nima?",
  "variantlar": [
   "Qaysi buyrak katta?",
   "Gidronefroz to'siq, reflyuks yoki normal variant tufaylimi?",
   "Og'riq qayerda?",
   "Qon bosimi qancha?"
  ],
  "togri": 1,
  "izoh": "Asosiy klinik savol: gidronefroz to'siq, reflyuks yoki normal variant tufaylimi? — chunki har biri tubdan farqli davolash yondashuvini talab qiladi."
 },
 {
  "savol": "Gidronefroz ba'zan simptomsiz (asimptomatik) kechishi mumkinmi?",
  "variantlar": [
   "Yo'q, har doim og'riq bilan kechadi",
   "Ha, simptom bermay ham kuzatilishi mumkin",
   "Faqat bolalarda asimptomatik bo'ladi",
   "Faqat og'ir darajada asimptomatik bo'ladi"
  ],
  "togri": 1,
  "izoh": "Gidronefroz o'zi belgi bermasligi (asimptomatik) mumkin — bu ko'p jihatdan sababga, rivojlanish tezligiga va to'siq joylashuviga bog'liq."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Siydik tutolmaslik — asosiy turlari (oson)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('siydik-tutolmaslik-turlari', NULL, $dt_bank$[
 {
  "savol": "Siydik tutolmaslik (urinary incontinence) qanday ta'riflanadi?",
  "variantlar": [
   "Siydik yo'lining infeksiyasi",
   "Qovuqning haddan tashqari faolligi",
   "Siydikning ixtiyorsiz oqib chiqishi",
   "Buyrak funksiyasining pasayishi"
  ],
  "togri": 2,
  "izoh": "Siydik tutolmaslik (UI) — siydikning ixtiyorsiz oqib chiqishi. Bu nafaqat tibbiy, balki ijtimoiy muammo — bemorlar uyat tufayli ko'pincha shifokorga murojaat qilmaydi."
 },
 {
  "savol": "Siydik tutolmaslikning umumiy mexanizmi nima?",
  "variantlar": [
   "Buyrak filtratsiyasining oshishi",
   "Qovuq ichidagi bosim uretradagi qarshilikdan oshib ketishi",
   "Siydik yo'lining torayishi",
   "Hormonlar muvozanatining buzilishi"
  ],
  "togri": 1,
  "izoh": "Umumiy mexanizm: qovuq ichidagi bosim uretradagi qarshilikdan oshib ketganda yoki uretra anatomik jihatdan chetlab o'tilganda siydik tashqariga chiqadi."
 },
 {
  "savol": "Campbell-Walsh-Wein bo'yicha siydik tutolmaslikning nechta kategoriyasi ajratiladi?",
  "variantlar": [
   "Yettita",
   "Uchtasi",
   "Beshtasi",
   "To'rttasi"
  ],
  "togri": 0,
  "izoh": "Kitob yettita kategoriyani ajratadi: stressli (SUI), shoshilinch (UUI), aralash (MUI), toshuvchi, doimiy, enürez va funksional tutolmaslik."
 },
 {
  "savol": "Stressli siydik tutolmaslik (SUI) qachon yuzaga keladi?",
  "variantlar": [
   "Faqat tunda uxlash vaqtida",
   "Faqat infeksiya paytida",
   "Tinch holatda, sababsiz",
   "Yo'tal, hapshiriq, kulish yoki og'ir ko'tarish vaqtida"
  ],
  "togri": 3,
  "izoh": "SUI — qorin ichida bosim oshtiradigan har qanday harakat (yo'tal, hapshiriq, kulish, og'ir narsa ko'tarish) vaqtida siydikning ixtiyorsiz chiqishi."
 },
 {
  "savol": "SUIda asosiy patofizologik mexanizm nima?",
  "variantlar": [
   "Qovuq mushaklarining haddan tashqari qisqarishi",
   "Sfinkter va tos tubi mushaklari zaiflashishi natijasida uretradagi qarshilik pasayishi",
   "Siydik yo'lining anatomik torayishi",
   "Buyrak tubulalarining shikastlanishi"
  ],
  "togri": 1,
  "izoh": "SUIda sabab — sfinkter va tos tubi mushaklari zaiflashishi natijasida uretradagi qarshilik pasayishi, shu sababli bosim oshganda siydik chiqib ketadi."
 },
 {
  "savol": "SUIning erkaklar uchun xos xavf omili qaysi?",
  "variantlar": [
   "Ko'p marta tug'ish",
   "Menopauza",
   "Radikal prostatektomiya yoki agressiv TURP dan keyin sfinkter shikastlanishi",
   "Semizlik"
  ],
  "togri": 2,
  "izoh": "Erkaklar uchun SUIning asosiy sababi — radikal prostatektomiya yoki TURP dan keyin tashqi sfinkterning shikastlanishi."
 },
 {
  "savol": "SUIni UUIdan farqlovchi asosiy klinik belgi nima?",
  "variantlar": [
   "Siydik rangi o'zgarishi",
   "Shoshilinch istagi yo'qligi",
   "Tunda ko'p siyish",
   "Qon aralashuvi"
  ],
  "togri": 1,
  "izoh": "SUIda shoshilinch istak bo'lmaydi — bemor 'yo'talganida siydik chiqib qoladi' deydi, ammo tuvaletga shoshilish yo'q. Bu UUIdan farqlovchi asosiy belgi."
 },
 {
  "savol": "Tos tubi mushaklarini mustahkamlash uchun tavsiya etiladigan mashq qaysi?",
  "variantlar": [
   "Yugurish mashqlari",
   "Kegel mashqlari",
   "Suzish mashqlari",
   "Nafas mashqlari"
  ],
  "togri": 1,
  "izoh": "Kegel mashqlari — tos tubi mushaklarini mustahkamlashga qaratilgan SUI davolashning birinchi qatordagi konservativ usuli."
 },
 {
  "savol": "Shoshilinch siydik tutolmaslik (UUI) qanday ta'riflanadi?",
  "variantlar": [
   "Yo'tal vaqtida siydik chiqishi",
   "Tunda siydik chiqishi",
   "Kuchli siydik chiqarish istagi bilan bir vaqtda yoki undan darhol keyin siydikning ixtiyorsiz oqib chiqishi",
   "Siydikda qon bo'lishi"
  ],
  "togri": 2,
  "izoh": "UUI — to'satdan kuchli siydik chiqarish istagi paydo bo'lishi bilan bir vaqtda yoki undan darhol keyin siydikning ixtiyorsiz oqib chiqishi."
 },
 {
  "savol": "UUI ko'pincha qaysi sindromning bir qismi sifatida namoyon bo'ladi?",
  "variantlar": [
   "BPH sindromi",
   "Nefrotik sindrom",
   "Giperaqtiv qovuq (OAB) sindromi",
   "Neyrogen qovuq sindromi"
  ],
  "togri": 2,
  "izoh": "UUI ko'pincha giperaqtiv qovuq (overactive bladder, OAB) sindromining bir qismi sifatida namoyon bo'ladi."
 },
 {
  "savol": "50 yoshdan katta va chekuvchi bemorlarda UUI belgilari bo'lsa nima istisno qilinishi kerak?",
  "variantlar": [
   "Buyrak toshi",
   "Qovuq saratoni (ayniqsa CIS)",
   "BPH",
   "Siydik yo'li infeksiyasi"
  ],
  "togri": 1,
  "izoh": "UUI ba'zan yashirin qovuq saratoni (ayniqsa carcinoma in situ — CIS)ning yagona belgisi bo'lishi mumkin. 50 yoshdan katta va chekuvchilarda sistoskopiya o'tkazish chegarasi past bo'lishi kerak."
 },
 {
  "savol": "UUI davolashda ishlatiladigan beta-3 agonist dori qaysi?",
  "variantlar": [
   "Oksibutinin",
   "Solifenasin",
   "Mirabegron",
   "Onabotulinumtoxin A"
  ],
  "togri": 2,
  "izoh": "Mirabegron — beta-3 agonist, qovuq bo'shashishini kuchaytirib, UUI davolashda antikolinergik dorularga alternativa sifatida ishlatiladi."
 },
 {
  "savol": "Intravesikal Botox (onabotulinumtoxinA) UUI davolashda qanday ishlaydi?",
  "variantlar": [
   "Qovuqni kengaytiradi",
   "Qovuq devorini vaqtincha falajlaydi",
   "Uretrani tarayтирadi",
   "Sfinkter tonusini oshiradi"
  ],
  "togri": 1,
  "izoh": "Intravesikal Botox qovuq devorini vaqtincha falajlaydi — detrusor giperaktivligini kamaytiradi. Antikolinergik dorular samarasiz bo'lganda qo'llaniladi."
 },
 {
  "savol": "Aralash siydik tutolmaslik (MUI) nima?",
  "variantlar": [
   "Faqat kechasi siydik tutolmaslik",
   "SUI va UUI belgilarining bir vaqtda mavjud bo'lishi",
   "Toshuvchi va doimiy tutolmaslik kombinatsiyasi",
   "Funksional va enürez kombinatsiyasi"
  ],
  "togri": 1,
  "izoh": "MUI (mixed urinary incontinence) — stressli (SUI) va shoshilinch (UUI) siydik tutolmaslik belgilarining bir vaqtda mavjud bo'lishi. Klinik amaliyotda keng tarqalgan, ayollarda ko'proq uchraydi."
 },
 {
  "savol": "MUI davolashda qaysi yondashuv tavsiya etiladi?",
  "variantlar": [
   "Ikkala mexanizmni bir vaqtda davolash",
   "Faqat SUI komponentini davolash",
   "Avval ustun simptomga e'tibor qaratiladi",
   "Faqat UUI komponentini davolash"
  ],
  "togri": 2,
  "izoh": "MUI davolashda umumiy yondashuv: avval ustun (dominant) simptomga e'tibor qaratiladi. Faqat bittasini davolash ikkinchi komponentni kuchaytirishi mumkin."
 },
 {
  "savol": "Toshuvchi siydik tutolmaslik (overflow incontinence) boshqacha qanday nomlanadi?",
  "variantlar": [
   "Neyrogen tutolmaslik",
   "Paradoksal siydik tutolmaslik",
   "Funksional tutolmaslik",
   "Doimiy tutolmaslik"
  ],
  "togri": 1,
  "izoh": "Toshuvchi tutolmaslik 'paradoksal siydik tutolmaslik' ham deyiladi — chunki to'siq sabab bo'ladi, ammo siydik chiqadi (qovuq to'lib-toshadi)."
 },
 {
  "savol": "Toshuvchi siydik tutolmaslikda qovuqda nima sodir bo'ladi?",
  "variantlar": [
   "Qovuq mutlaqo bo'sh bo'ladi",
   "Qovuq haddan tashqari to'lib, bosim uretradagi qarshilikdan oshib siydiк tomchilab chiqadi",
   "Qovuq qisqarish qobiliyatini yo'qotadi",
   "Qovuq hajmi kichrayadi"
  ],
  "togri": 1,
  "izoh": "Overflow — qovuq haddan tashqari to'lib, intravesikal bosim uretradagi qarshilikdan oshganda siydikning tomchilab chiqishi. Ko'pincha kechasi kuzatiladi."
 },
 {
  "savol": "Toshuvchi tutolmaslikda PVR o'lchash nima uchun muhim?",
  "variantlar": [
   "Buyrak funksiyasini aniqlash uchun",
   "Qovuqdagi qolgan siydik hajmini aniqlash uchun",
   "Qon bosimini baholash uchun",
   "Infeksiya belgilarini aniqlash uchun"
  ],
  "togri": 1,
  "izoh": "PVR (post-void residual) — siydik chiqargandan keyin qovuqda qolgan siydik hajmi. Toshuvchi tutolmaslikda bu ko'p bo'ladi. PVR o'lchash barcha UI baholashining bir qismi bo'lishi kerak."
 },
 {
  "savol": "Doimiy siydik tutolmaslikda bemorning asosiy shikoyati nima?",
  "variantlar": [
   "Siydik chiqarish vaqtida og'riq",
   "Perineum sohasida doimiy namlik (shoshilinch istak va bosimdan mustaqil)",
   "Siydikda qon bo'lishi",
   "Tunda ko'p siyish"
  ],
  "togri": 1,
  "izoh": "Doimiy tutolmaslikda bemor perineum sohasida doimiy namlikdan shikoyat qiladi — bu shoshilinch istaqqa yoki qorin bosimiga bog'liq emas."
 },
 {
  "savol": "Doimiy siydik tutolmaslikning asosiy sababi nima?",
  "variantlar": [
   "BPH",
   "Qovuq giperaktivligi",
   "Siydik yo'lini chetlab o'tuvchi fistula (vesicovaginal, ureterovaginal)",
   "Neyrogen buzilish"
  ],
  "togri": 2,
  "izoh": "Doimiy tutolmaslikning asosiy sababi — siydik yo'lini chetlab o'tuvchi fistula (vesicovaginal yoki ureterovaginal). Ayollarda ginekologik operatsiya, nurlanish yoki qiyin tug'ruq tarixi so'ralishi kerak."
 },
 {
  "savol": "Ektopik ureter doimiy tutolmaslikka qanday olib keladi?",
  "variantlar": [
   "Qovuqni kichraytirish orqali",
   "Sfinkter tonusini pasaytirish orqali",
   "Uretra sfinkterini chetlab, vaginaga ochilishi tufayli",
   "Qovuq bosimini oshirish orqali"
  ],
  "togri": 2,
  "izoh": "Ektopik ureter sfinkterdan pastga — vaginaga ochiladigan bo'lsa, siydik sfinkterdan o'tmay doim oqadi. Klassik ko'rinish: kunduz doim tomchilab, kechasi kamroq."
 },
 {
  "savol": "Funksional siydik tutolmaslik nima?",
  "variantlar": [
   "Qovuq mushaklari buzilishi tufayli tutolmaslik",
   "Siydik chiqarish a'zolari sog'lom, lekin jismoniy yoki kognitiv cheklovlar tufayli tualetga yetib bora olmaslik",
   "Neyrogen sabab tufayli tutolmaslik",
   "Uretra torayishi tufayli tutolmaslik"
  ],
  "togri": 1,
  "izoh": "Funksional tutolmaslikda siydik chiqarish a'zolari sog'lom — muammo jismoniy (harakatlanish qiyinligi) yoki kognitiv (demensiya) cheklovlarda. Qariyalarda ko'p uchraydi."
 },
 {
  "savol": "UI diagnostikasida eng muhim bosqich qaysi?",
  "variantlar": [
   "Ultratovush tekshiruvi",
   "Anamnez (to'g'ri savol berish)",
   "Qon tahlili",
   "Kompyuter tomografiyasi"
  ],
  "togri": 1,
  "izoh": "UI diagnostikasida anamnez eng muhim qadam — tutolmaslik turi, davomiyligi, og'irlik darajasi, hayot sifatiga ta'siri va dori-darmonlar aniqlanadi."
 },
 {
  "savol": "Ko'pchilik bemorlar UI haqida o'zlari gapirmasligi sababi nima?",
  "variantlar": [
   "Alomatlar ularni bezovta qilmaydi",
   "Uyat yoki bu holat 'keksalik belgisi' deb qabul qilish",
   "Kasallik o'z-o'zidan tuzaladi deb biladi",
   "Kasallikdan bexabar bo'ladi"
  ],
  "togri": 1,
  "izoh": "Ko'pchilik bemorlar uyat yoki bu holat 'keksalik belgisi' deb qabul qilishidan qo'rqib shifokorga murojaat qilmaydi. Shu sababli urolog barcha katta yoshli bemorlarga faol savol berishi kerak."
 },
 {
  "savol": "Urodinamik tekshiruv UI diagnostikasida nima uchun qo'llaniladi?",
  "variantlar": [
   "Infeksiyani aniqlash uchun",
   "Qovuq bosimi, sig'imi va sfinkter faoliyatini obyektiv baholash uchun",
   "Buyrak funksiyasini aniqlash uchun",
   "Siydik toshi mavjudligini aniqlash uchun"
  ],
  "togri": 1,
  "izoh": "Urodinamik tekshiruv qovuq bosimi, sig'imi, doldurilish va bo'shalish fazasidagi o'zgarishlar hamda sfinkter faoliyatini obyektiv baholash imkonini beradi."
 },
 {
  "savol": "Sun'iy siydik sfinkteri (AUS) kimga ko'proq qo'llaniladi?",
  "variantlar": [
   "Ayollar — tug'ruqdan keyin",
   "Erkaklar — prostatektomiyadan keyin SUI uchun",
   "Bolalar — enürez uchun",
   "Keksa bemorlar — funksional UI uchun"
  ],
  "togri": 1,
  "izoh": "Sun'iy siydik sfinkteri (artificial urinary sphincter, AUS) asosan erkaklar uchun — radikal prostatektomiyadan keyin yuzaga kelgan og'ir SUI davolashda qo'llaniladi."
 },
 {
  "savol": "Uretra sling operatsiyasi qanday ishlaydi?",
  "variantlar": [
   "Uretra devorini qalinlashtiradi",
   "Uretra ostiga tayanch lenta qo'yib uretrani ko'taradi",
   "Qovuq mushaklarini falajlaydi",
   "Uretrani to'sib qo'yadi"
  ],
  "togri": 1,
  "izoh": "Uretra sling — uretra ostiga sintetik yoki biologik lenta qo'yib, uretrani ko'tarish va bosim paytida siydik chiqmasligi uchun mexanik tayanch hosil qilish operatsiyasi. SUI davolashda asosiy jarrohlik usuli."
 },
 {
  "savol": "Neyromodulyatsiya UUI davolashda qanday mexanizm orqali ishlaydi?",
  "variantlar": [
   "Qovuq devorini kuchaytiradi",
   "Sakral yoki tibial nervlarni stimulyatsiya qilib qovuq faoliyatini tartibga soladi",
   "Hormon balansini tiklaydi",
   "Uretrani kengaytiradi"
  ],
  "togri": 1,
  "izoh": "Neyromodulyatsiya — sakral nerv stimulyatsiyasi (SNS) yoki tibial nerv stimulyatsiyasi orqali qovuq faoliyatini tartibga soladi. Dori samarasiz bo'lganda qo'llaniladi."
 },
 {
  "savol": "Antikolinergik dorilar UUI davolashda qanday ta'sir ko'rsatadi?",
  "variantlar": [
   "Qovuq hajmini oshiradi",
   "Qovuq qisqarishini (detrusor aktivligini) kamaytiradi",
   "Sfinkter tonusini oshiradi",
   "Siydik ishlab chiqarishni kamaytiradi"
  ],
  "togri": 1,
  "izoh": "Oksibutinin, solifenasin kabi antikolinergik dorilar muskarin retseptorlarini bloklaydi — bu detrusor mushaklarining ixtiyorsiz qisqarishlarini kamaytiradi."
 },
 {
  "savol": "Toshuvchi tutolmaslikda diabetik neyropatiya qanday rol o'ynaydi?",
  "variantlar": [
   "Sfinkter tonusini oshiradi",
   "Qovuq sezuvchanligini yo'qotib, to'la qovuqni sezmay qolishga olib keladi",
   "Buyrak filtratsiyasini oshiradi",
   "Qovuq mushaklarini kuchaytiradi"
  ],
  "togri": 1,
  "izoh": "Qandli diabet neyropatiyasi qovuqning afferent sezuvchanligini buzadi — bemor qovuq to'lganini sezmaydi, natijada qovuq haddan oshib, toshuvchi tutolmaslik rivojlanadi."
 },
 {
  "savol": "Enürez (bedwetting) qaysi guruhda ko'proq uchraydi?",
  "variantlar": [
   "Faqat katta yoshli erkaklarda",
   "Bolalarda va o'smirlarda",
   "Faqat keksa ayollarda",
   "Faqat erkak sportchilarda"
  ],
  "togri": 1,
  "izoh": "Enürez (nocturnal enuresis) — kechasi uxlash vaqtida ixtiyorsiz siydik chiqishi. Asosan bolalarda uchraydi, ammo kattalar ham ta'sirlanishi mumkin."
 },
 {
  "savol": "Menopauza SUIga qanday ta'sir qiladi?",
  "variantlar": [
   "Ta'sir qilmaydi",
   "Uretra shilliq qavatini qalinlashtiradi",
   "Estrogen kamayishi natijasida uretra shilliq qavati yupqalashib, sfinkter funksiyasi buziladi",
   "Tos tubi mushaklarini mustahkamlaydi"
  ],
  "togri": 2,
  "izoh": "Menopauzada estrogen kamayishi natijasida uretra shilliq qavati yupqalashadi va submukozal venoz pleksus atrofiyalanadi — bu sfinkter mexanizmini zaiflashtirib SUIga olib keladi."
 },
 {
  "savol": "Semizlik SUI uchun xavf omili hisoblanishining sababi nima?",
  "variantlar": [
   "Semizlik qovuqni kichraytiradi",
   "Semizlik doimiy oshirilgan qorin ichi bosimini keltirib chiqaradi",
   "Semizlik sfinkter tonusini pasaytiradi",
   "Semizlik qovuq giperaktivligini keltirib chiqaradi"
  ],
  "togri": 1,
  "izoh": "Semizlik — doimiy oshirilgan qorin ichi bosimi sababi. Bu doimiy bosim tos tubi muskullari va sfinkterga surunkali yuklanish yaratib, vaqt o'tib SUIga olib keladi."
 },
 {
  "savol": "Vesicovaginal fistulada siydik qayerdan chiqadi?",
  "variantlar": [
   "Uretra orqali normal yo'ldan",
   "Qovuqdan vaginaga ochilgan teshik orqali",
   "Ureter orqali",
   "Buyrak jomidan bevosita"
  ],
  "togri": 1,
  "izoh": "Vesicovaginal fistulada — qovuq va vagina orasida patologik yo'l (teshik) hosil bo'lib, siydik vaginaga oqadi. Bu doimiy tutolmaslikning klassik sababi."
 },
 {
  "savol": "UI bilan og'rigan bemorda shifokor nima uchun barcha dori-darmonlar ro'yxatini so'rashi kerak?",
  "variantlar": [
   "Allergiyani aniqlash uchun",
   "Ba'zi dorilar (diuretiklar, alfa-blokatorlar) UI belgilerini kuchaytirishi yoki keltirib chiqarishi mumkin",
   "Buyrak funksiyasini baholash uchun",
   "Gormonal holatni aniqlash uchun"
  ],
  "togri": 1,
  "izoh": "Bir qator dorilar UI ga ta'sir qiladi: diuretiklar siydik miqdorini oshiradi, alfa-blokatorlar sfinkter tonusini kamaytiradi, antipsixotiklar qovuq faoliyatini o'zgartiradi."
 },
 {
  "savol": "UI diagnostikasida jismoniy tekshiruvda nima baholanadi?",
  "variantlar": [
   "Faqat qon bosimi",
   "Qorin, tos, uretra va ginekolojik ko'rik, nerv holati, PVR o'lchash",
   "Faqat siydik tahlili",
   "Faqat ultratovush"
  ],
  "togri": 1,
  "izoh": "Jismoniy tekshiruvda qorin (to'lib turgan qovuq?), tos tubi holati, uretra va ginekologik ko'rik, nerv holati va PVR o'lchash baholanadi."
 },
 {
  "savol": "Uretra bulking agentlar SUI davolashda qanday ishlaydi?",
  "variantlar": [
   "Uretra mushaklarini qisqartiradi",
   "Uretra devorini injeksiya orqali qalinlashtirib, siydik oqishiga qarshilik yaratadi",
   "Qovuq hajmini kamaytiradi",
   "Sfinkter nerv ta'minini yaxshilaydi"
  ],
  "togri": 1,
  "izoh": "Uretra bulking agentlar — uretra atrofiga injeksiya qilinib, devorni qalinlashtiradi va shu orqali uretradagi qarshilikni oshiradi. Kam invaziv SUI davolash usuli."
 },
 {
  "savol": "Ko'p marta tug'ish (multiparous) SUIga qanday olib keladi?",
  "variantlar": [
   "Qovuq hajmini kichraytiradi",
   "Tos tubi mushaklari va nervlarini shikastlaydi",
   "Estrogen darajasini kamaytiradi",
   "Siydik yo'li infeksiyasiga moyillik yaratadi"
  ],
  "togri": 1,
  "izoh": "Ko'p marta tug'ish tos tubi mushaklari va pudendal nervga mexanik shikast yetkazadi — bu sfinkter va uretra qo'llab-quvvatlash apparatini zaiflashtirib SUIga olib keladi."
 },
 {
  "savol": "Giperaqtiv qovuq (OAB) sindromining asosiy belgilari qaysilar?",
  "variantlar": [
   "Siydikda qon va og'riq",
   "Shoshilinch istak, tez-tez siyish, kechasi siyish (nocturia) va UUI",
   "Siydik chiqarish qiyinligi va to'liq bo'shamaslik",
   "Doimiy namlik va fistula belgilari"
  ],
  "togri": 1,
  "izoh": "OAB sindromi — shoshilinch istak (urgency), tez-tez siyish (frequency), kechasi siyish (nocturia) va ixtiyorsiz siydik chiqishi (UUI) belgilari kombinatsiyasi."
 },
 {
  "savol": "UI davolashning birinchi qatordagi konservativ usullari qaysilar?",
  "variantlar": [
   "Darhol jarrohlik",
   "Kegel mashqlari, hayot tarzi o'zgarishlari va suyuqlik nazorati",
   "Darhol Botox injeksiyasi",
   "Darhol neyromodulyatsiya"
  ],
  "togri": 1,
  "izoh": "Birinchi qatorda konservativ davolash: Kegel mashqlari (tos tubi), hayot tarzi o'zgarishlari (vazn kamaytirish, kofein cheklash), suyuqlik nazorati va qovuq trenirovkasi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Prostata adenomasi (BPH) — asosiy belgilar (oson)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('prostata-adenomasi-asosiy-belgilar', NULL, $dt_bank$[
 {
  "savol": "BPH — benign prostata giperplaziyasi — qanday jarayon?",
  "variantlar": [
   "Prostata bezining saraton o'sishi",
   "Prostataning xavfsiz, saraton bo'lmagan o'sishi",
   "Prostata bezining bakterial yallig'lanishi",
   "Prostata to'qimasining tug'ma anomaliyasi"
  ],
  "togri": 1,
  "izoh": "BPH — prostataning xavfsiz (benign) o'sishi. U saraton emas, ammo uretraga bosim o'tkazib klinik simptomlar beradi."
 },
 {
  "savol": "BPH asosan prostata to'qimasining qaysi zonasida rivojlanadi?",
  "variantlar": [
   "Periferik zonada (PZ)",
   "Markaziy zonada (CZ)",
   "O'tish zonasida (TZ)",
   "Fibromushak stromasida"
  ],
  "togri": 2,
  "izoh": "BPH o'tish zonasida (transition zone, TZ) rivojlanadi. Periferik zona esa prostata saratorining 70–80% manbai hisoblanadi."
 },
 {
  "savol": "McNeal tizimiga ko'ra prostata anatomik jihatdan nechtа asosiy zonaga bo'linadi?",
  "variantlar": [
   "Ikkita zonaga",
   "Beshtа zonaga",
   "To'rttа zonaga",
   "Uchtа zonaga"
  ],
  "togri": 2,
  "izoh": "McNeal (1968) prostata to'rttа zonaga bo'lgan: periferik (PZ), o'tish (TZ), markaziy (CZ) va fibromushak stroma."
 },
 {
  "savol": "50 yoshli erkaklarning qancha foizida gistologik BPH aniqlanadi?",
  "variantlar": [
   "~10 foizida",
   "~25 foizida",
   "~50 foizida",
   "~90 foizida"
  ],
  "togri": 2,
  "izoh": "BPH yoshga bog'liq: 50 yoshda ~50%, 70 yoshda ~75% erkakda gistologik BPH aniqlanadi. Bu prostataning fiziologik qarish jarayoniga bog'liq."
 },
 {
  "savol": "BPH rivojlanishi uchun qaysi ikki omil zarur?",
  "variantlar": [
   "Surunkali infeksiya va semizlik",
   "Funksional moyaklar (androgen) va yosh",
   "Gipertoniya va qandli diabet",
   "Chekish va kam harakatlilik"
  ],
  "togri": 1,
  "izoh": "BPH rivojlanishi uchun funksional moyaklar (androgen ishlab chiqarish) va yosh — ikki zaruriy shart. Kastratsiya qilingan erkaklarda BPH rivojlanmaydi."
 },
 {
  "savol": "BPH patogenezida asosiy rol o'ynaydigan gormon qaysi?",
  "variantlar": [
   "Testosteron (T)",
   "Dihidrotestosteron (DHT)",
   "Luteinlovchi gormon (LH)",
   "Kortizol (kortikosteroid)"
  ],
  "togri": 1,
  "izoh": "DHT (dihidrotestosteron) — testosteron 5α-reduktaza fermenti tomonidan prostatada hosil bo'lib, prostata hujayralarini o'sishga rag'batlantiradi. BPH patogenezida asosiy rol o'ynaydi."
 },
 {
  "savol": "5α-reduktaza inhibitorlari BPH davolashda qanday mexanizm orqali ishlaydi?",
  "variantlar": [
   "Prostata silliq mushaklarini bo'shashtiradi",
   "DHT ishlab chiqarishni bloklaydi va prostata hajmini kamaytiradi",
   "Qovuq bo'ynidagi α-retseptorlarni inhibe qiladi",
   "Prostata beziga qon oqimini cheklaydi"
  ],
  "togri": 1,
  "izoh": "5α-reduktaza inhibitorlari (finasterid, dutasterid) DHT sintezini bloklab, prostata hajmini asta-sekin kamaytiradi (~25%). Katta prostata (>40 ml)da samarali."
 },
 {
  "savol": "BPH ning mexanik komponenti qanday obstruksiya hosil qiladi?",
  "variantlar": [
   "α₁-retseptorlar orqali mushaklarni qisqartiradi",
   "Kattalashgan to'qima uretraga to'g'ridan-to'g'ri bosim o'tkazadi",
   "Qovuq sezuvchanligi pasayib kuzatuv qiyinlashadi",
   "Siydik ishlab chiqarish hajmi oshib qoladi"
  ],
  "togri": 1,
  "izoh": "Mexanik komponent — kattalashgan prostata to'qimasi uretraga bevosita bosim o'tkazib, siydik oqimini qiyinlashtiradi. Bu α-blokerlar emas, jarrohlik yoki 5α-RI bilan davolanadi."
 },
 {
  "savol": "BPH ning dinamik komponenti qaysi dori guruhiga javob beradi?",
  "variantlar": [
   "5α-reduktaza inhibitorlariga",
   "PDE-5 inhibitorlariga",
   "α₁-adrenergik blokerlariga",
   "Antikolinergik dorилаriga"
  ],
  "togri": 2,
  "izoh": "Dinamik komponent — prostata va qovuq bo'yni silliq mushaklaridagi α₁-adrenergik retseptorlarning faollashishi. Bu komponentga α-blokerlar (tamsulozin va h.k.) ta'sir qiladi."
 },
 {
  "savol": "LUTS — Lower Urinary Tract Symptoms — deganda nima tushuniladi?",
  "variantlar": [
   "Buyrak tuzilishi kasalliklari",
   "Quyi siydik yo'llari simptomlar majmuasi",
   "Prostata saratorining ilk belgilari",
   "Siydik yo'li infeksiyasining klinik ko'rinishi"
  ],
  "togri": 1,
  "izoh": "LUTS — quyi siydik yo'llari simptomlarining majmuasi. BPHda ko'p uchraydi, lekin sabab har doim BPH bo'lavermaydi."
 },
 {
  "savol": "BPH obstruktiv belgilariga qaysi guruh kiradi?",
  "variantlar": [
   "Tez-tez siyish, urgency va nocturia",
   "Siydik oqimi zaifligi, hesitancy va to'liq bo'shamaslik hissi",
   "Siydikda qon, og'riq va isitma",
   "Bel og'rig'i, ko'ngil aynishi va qayt qilish"
  ],
  "togri": 1,
  "izoh": "Obstruktiv belgilar: siydik oqimi zaifligi, boshlanish kechikishi (hesitancy), zo'riqish, kesik-kesik chiqish, to'liq bo'shamaslik hissi — bularning sababi uretraga mexanik bosim."
 },
 {
  "savol": "Nocturia BPH ning qaysi belgilar guruhiga kiradi?",
  "variantlar": [
   "Obstruktiv belgilar guruhiga",
   "Infeksion belgilar guruhiga",
   "Irritativ belgilar guruhiga",
   "Neyrogen belgilar guruhiga"
  ],
  "togri": 2,
  "izoh": "Nocturia — kechasi bir va undan ko'p marta siydikka turish. Irritativ belgi — qovuqning ikkilamchi o'zgarishi (detruzor giperaqtivligi) natijasi."
 },
 {
  "savol": "IPSS anketasi nechtа savol va qancha ball diapazoni bilan ishlaydi?",
  "variantlar": [
   "5 ta savol, 0–25 ball",
   "7 ta savol, 0–35 ball",
   "10 ta savol, 0–50 ball",
   "7 ta savol, 1–21 ball"
  ],
  "togri": 1,
  "izoh": "IPSS — 1992-yilda AUA tomonidan ishlab chiqilgan 7 ta savoldan iborat anket, ballar 0 dan 35 gacha. Dunyo bo'yicha BPH simptomlarini baholashning standart vositasi."
 },
 {
  "savol": "IPSS bo'yicha 0–7 ball qaysi darajaga to'g'ri keladi?",
  "variantlar": [
   "Og'ir darajaga",
   "O'rtacha darajaga",
   "Yengil darajaga",
   "Juda og'ir darajaga"
  ],
  "togri": 2,
  "izoh": "IPSS: 0–7 yengil (watchful waiting), 8–19 o'rtacha (dori ko'rib chiqiladi), 20–35 og'ir (dori yoki jarrohlik ko'rsatiladi)."
 },
 {
  "savol": "BPH da o'tkir siydik ushlanishi (AUR) qanday holat hisoblanadi?",
  "variantlar": [
   "Siydik hajmining ortib ketishi",
   "To'satdan siydik chiqara olmaslik — shoshilinch kateterizatsiya kerak",
   "Siydikda qon paydo bo'lishi va og'riq",
   "Siydik oqimining asta-sekin zaiflashishi"
  ],
  "togri": 1,
  "izoh": "AUR — to'satdan siydik chiqara olmaslik. Kateterizatsiya va keyinchalik jarrohlik ko'rsatiladi. BPH ning mutlaq jarrohlik ko'rsatmalaridan biri."
 },
 {
  "savol": "BPH da qaysi holatlarda mutlaq jarrohlik ko'rsatiladi?",
  "variantlar": [
   "IPSS ≥8 va bemorning istagi bo'lsa",
   "AUR, buyrak yetishmovchiligi, qovuq toshlari, takroriy UTI bo'lsa",
   "Dori bir oydan ortiq ichilgan bo'lsa",
   "PSA ikki birlikdan oshganda"
  ],
  "togri": 1,
  "izoh": "Mutlaq jarrohlik ko'rsatmalari: o'tkir siydik ushlanishi (AUR), BPH tufayli buyrak yetishmovchiligi, qovuq toshlari, qayta uchraydigan UTI, davolanmayan gematuriya."
 },
 {
  "savol": "Periferik zona (PZ) haqida qaysi bayonot to'g'ri?",
  "variantlar": [
   "Bu yerdan BPH rivojlanadi asosan",
   "Bu zonada saraton rivojlanadi (70–80%)",
   "Bu zona bez to'qimasidan mahrum",
   "Bu zonada eyakulyator kanallar o'tadi"
  ],
  "togri": 1,
  "izoh": "Periferik zona (PZ) prostata hajmining ~70%ini tashkil qiladi va prostata saratorining 70–80% shu yerdan kelib chiqadi. BPH esa o'tish zonasida rivojlanadi."
 },
 {
  "savol": "α₁-blokerlar BPH davolashda qanday ta'sir qiladi?",
  "variantlar": [
   "Prostata hajmini kamaytirib obstruksiyani yo'q qiladi",
   "Siydik ishlab chiqarishni kamaytiradi va qovuqni bo'shatadi",
   "Prostata va qovuq bo'ynidagi silliq mushaklarni bo'shashtiradi",
   "DHT ishlab chiqarishni bloklab prostata o'sishini to'xtatadi"
  ],
  "togri": 2,
  "izoh": "α₁-blokerlar (tamsulozin, alfuzosin) prostata va qovuq bo'ynidagi silliq mushaklarni bo'shashtiradi — bu dinamik komponentga ta'sir qilib, siydik oqimini yaxshilaydi. 2–4 haftada ta'sir qiladi."
 },
 {
  "savol": "α-blokerlar va 5α-RI ni solishtirganda qaysi bayonot to'g'ri?",
  "variantlar": [
   "Ikkalasi ham prostata hajmini bir xilda kamaytiradi",
   "α-bloker tez (2–4 hafta), 5α-RI sekin (6 oy) ta'sir qiladi va prostata hajmini kamaytiradi",
   "5α-RI tez ta'sir qiladi, α-bloker esa 6 oyda ishlaydi",
   "Ikkalasi ham faqat kichik prostata uchun ko'rsatilgan"
  ],
  "togri": 1,
  "izoh": "α-blokerlar 2–4 haftada simptomni yaxshilaydi, hajmni o'zgartirmaydi. 5α-RI to'liq samara 6 oyda ko'rinadi, prostata hajmini ~25% kamaytiradi — lekin faqat katta prostata (>40 ml)da samarali."
 },
 {
  "savol": "BOO (Bladder Outlet Obstruction) qanday usulda tasdiqlanadi?",
  "variantlar": [
   "Gistologik tekshiruv bilan",
   "Klinik ko'rik bilan",
   "Urodinamik tekshiruv bilan",
   "Radiolojik tekshiruv bilan"
  ],
  "togri": 2,
  "izoh": "BOO — urodinamik tashxis (yuqori bosim, past oqim). BPH esa gistologik tashxis. LUTS esa klinik belgilar. Bu uchala har doim birga bo'lavermaydi."
 },
 {
  "savol": "TURP BPH jarrohligida qanday ahamiyatga ega?",
  "variantlar": [
   "Minimal invaziv yo'nalishdagi usul",
   "Jarrohlik davolashning oltin standarti",
   "Faqat juda katta prostata uchun mo'ljallangan",
   "Faqat yosh bemorlarda qo'llaniladigan usul"
  ],
  "togri": 1,
  "izoh": "TURP (transuretra prostatektomiya) — BPH jarrohligining oltin standarti. Uretrotrop orqali prostata to'qimasi rezeksiya qilinadi. HoLEP esa katta prostata (>80 ml)da ham samarali."
 },
 {
  "savol": "Uroflowmetriyada Qmax qancha bo'lsa kuchli obstruksiya belgisi?",
  "variantlar": [
   "25 ml/s dan yuqori bo'lsa",
   "15 ml/s dan yuqori bo'lsa",
   "10 ml/s dan past bo'lsa",
   "5 ml/s dan past bo'lsa"
  ],
  "togri": 2,
  "izoh": "Uroflowmetriya — siydik oqim tezligini o'lchaydi. Qmax <10 ml/s — kuchli to'siqlanish (obstruksiya) belgisi. Normal Qmax odatda >15 ml/s."
 },
 {
  "savol": "BPH diagnostikasida PSA qanday maqsadda o'lchanadi?",
  "variantlar": [
   "Buyrak filtrasiyasini baholash uchun",
   "Infeksiyani laboratoriyada aniqlash uchun",
   "Saratorni istisno qilish va prostata hajmini baholash uchun",
   "Qon bosimi dinamikasini kuzatish uchun"
  ],
  "togri": 2,
  "izoh": "PSA prostata saratorini istisno qilish va prostata hajmini baholashda yordam beradi. BPHda ham PSA oshishi mumkin — har 1 ml prostata to'qimasi taxminan 0.1 ng/ml PSA qo'shadi."
 },
 {
  "savol": "PVR (post-void residual) o'lchash nima uchun zarur?",
  "variantlar": [
   "Prostata hajmini aniqlash uchun",
   "Infeksiyani dastlabki aniqlash uchun",
   "Siydik chiqargandan keyin qovuqda qolgan miqdorni baholash uchun",
   "PSA dinamikasini kuzatish uchun"
  ],
  "togri": 2,
  "izoh": "PVR — siydik chiqargandan keyin qovuqda qolgan siydik hajmi. Ko'p PVR qovuq detruzori toliqishini va surunkali siydik ushlanishi xavfini ko'rsatadi."
 },
 {
  "savol": "BPH da IPSS ≤7 bo'lganda qanday taktika tavsiya etiladi?",
  "variantlar": [
   "Darhol TURP jarrohligini rejalashtirish",
   "Dori davolashni boshlash kerak",
   "Kuzatuv va hayot tarzi o'zgarishlari tavsiya etiladi",
   "Lazer terapiyasini boshlash zarur"
  ],
  "togri": 2,
  "izoh": "IPSS ≤7 — yengil daraja. Ko'pincha kuzatuv (watchful waiting) tavsiya etiladi: suyuqlik tartibini boshqarish, kechqurun suyuqlikni kamaytirish, diuretiklar vaqtini o'zgartirish."
 },
 {
  "savol": "Finasterid BPH davolashda qancha vaqt ichida to'liq samara beradi?",
  "variantlar": [
   "2–4 hafta ichida",
   "1–2 oy ichida",
   "6 oy ichida",
   "2 yildan keyin"
  ],
  "togri": 2,
  "izoh": "Finasterid (5α-RI) — to'liq samara 6 oyda ko'rinadi. U prostata hajmini ~25% kamaytiradi va AUR xavfini 50% dan ko'proq kamaytiradi. Lekin faqat katta prostata (>40 ml)da samarali."
 },
 {
  "savol": "BPH tufayli yuqori siydik yo'li shikastlanishi qanday belgilarni beradi?",
  "variantlar": [
   "Siydikda qon va kuchli og'riq",
   "Ikki tomonlama gidronefroz va buyrak yetishmovchiligi",
   "Faqat siydik chiqarish tezlashishi",
   "Pastki qorin va bel og'rig'i"
  ],
  "togri": 1,
  "izoh": "Uzoq davom etgan BPH obstruksiyasi yuqori siydik yo'llariga ham zarar yetkazishi mumkin — ikki tomonlama gidronefroz va buyrak yetishmovchiligi rivojlanadi. Bu mutlaq jarrohlik ko'rsatmasi."
 },
 {
  "savol": "BPH da qovuq toshlarining asosiy hosil bo'lish sababi nima?",
  "variantlar": [
   "Kalsiy almashinuvining genetik buzilishi",
   "Qovuqdagi turg'un siydikda mineral kristallanishi",
   "Buyrak toshining pastga tushib qolishi",
   "Bakterial infeksiyadan kelib chiqadigan kaltsifikatsiya"
  ],
  "togri": 1,
  "izoh": "Qovuqda to'liq bo'shalmay qoladigan turg'un siydik fond kristallanish uchun qulay muhit yaratadi — bu qovuq toshlarining asosiy mexanizmi. Mutlaq jarrohlik ko'rsatmasi."
 },
 {
  "savol": "Hesitancy (siydikni boshlash kechikishi) BPH ning qaysi guruhiga kiradi?",
  "variantlar": [
   "Irritativ belgilar guruhiga",
   "Obstruktiv belgilar guruhiga",
   "Neyrogen buzilishlar guruhiga",
   "Infeksion belgilar guruhiga"
  ],
  "togri": 1,
  "izoh": "Hesitancy — siydikni boshlash uchun kutish, zo'riqish kerakligi. Bu obstruktiv belgi — uretraga mexanik bosim tufayli oqim boshlash qiyinlashadi."
 },
 {
  "savol": "Kombinatsiya terapiya (α-bloker + 5α-RI) BPH da qachon ko'rsatiladi?",
  "variantlar": [
   "Barcha BPH bemorlarda birinchi tanlov sifatida",
   "IPSS 7 dan past bo'lganda va yosh bemorda",
   "Katta prostata (>40 ml) va o'rtacha-og'ir simptomlar bo'lganda",
   "Faqat 50 yoshdan kichik bemorlarda"
  ],
  "togri": 2,
  "izoh": "Kombinatsiya terapiya — katta prostata (>40 ml) va o'rtacha-og'ir simptomli bemorlarda. α-bloker tez simptom yengillik beradi, 5α-RI esa prostata hajmini uzoq muddatda kamaytiradi."
 },
 {
  "savol": "BPH da sistoskopiya qanday holatda qo'llaniladi?",
  "variantlar": [
   "Har bir BPH bemorida majburiy tekshiruv",
   "Qovuq va uretrani baholash zarur bo'lganda",
   "PSA oshgan barcha bemorlarda",
   "IPSS ≥8 barcha bemorlarda majburiy"
  ],
  "togri": 1,
  "izoh": "Sistoskopiya — qo'shimcha (tanlangan) tekshiruv. Qovuq toshlarini ko'rish, uretraning holati va qovuq ichini baholash zarur bo'lganda qo'llaniladi."
 },
 {
  "savol": "70 yoshli erkaklarning qancha foizida gistologik BPH aniqlanadi?",
  "variantlar": [
   "~25 foizida",
   "~50 foizida",
   "~75 foizida",
   "~95 foizida"
  ],
  "togri": 2,
  "izoh": "BPH yoshga bog'liq: 50 yoshda ~50%, 70 yoshda ~75% erkakda gistologik BPH aniqlanadi. Klinik simptomlar esa 65 yoshdagi erkaklarning ~25 foizida davolanishni talab etadi."
 },
 {
  "savol": "Siydik tahlili BPH diagnostikasida nima uchun o'tkaziladi?",
  "variantlar": [
   "Prostata hajmini aniqlash uchun",
   "Infeksiya, gematuriya va glyukozuriyani istisno qilish uchun",
   "PSA darajasini aniqlash uchun",
   "Buyrak ultratovushini almashtirish uchun"
  ],
  "togri": 1,
  "izoh": "Siydik tahlili BPH diagnostikasida majburiy tekshiruv — infeksiya (UTI), gematuriya (qovuq saratoni?) va glyukozuriyani (diabet) istisno qilish uchun."
 },
 {
  "savol": "BPH ga bog'liq gematuriyani davolashda finasteridning roli nima?",
  "variantlar": [
   "Gematuriyaga hech qanday ta'siri yo'q",
   "Qovuq qon tomirlarini kengaytiradi va to'xtatadi",
   "Prostata qon tomirlarini qisqartirib gematuriyani davolaydi",
   "Faqat infeksion kelib chiqishli gematuriyani davolaydi"
  ],
  "togri": 2,
  "izoh": "Finasterid prostata qon tomirlarini qisqartirish orqali BPH ga bog'liq gematuriyani ~90% da davolaydi. Shu sababli davolanmayan gematuriyada finasterid ko'rsatiladi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Fimoz va parafimoz — nima va qanday yordam kerak (oson)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('fimoz-parafimoz-asoslari', NULL, $dt_bank$[
 {
  "savol": "Preputsiy (foreskin) anatomik jihatdan nima?",
  "variantlar": [
   "Olatning boshchasini qoplab turuvchi teri burmasi",
   "Olatning asosini qoplab turuvchi mushak",
   "Uretrani himoya qiluvchi shilliq qavat",
   "Siydik chiqaruvchi kanal devori"
  ],
  "togri": 0,
  "izoh": "Preputsiy (prepuce/foreskin) — olatning boshchasini (glans penis) qoplab turuvchi teri burmasi. Xatna qilinmagan erkaklarda boshchani erkin ochib va yopib turishi kerak."
 },
 {
  "savol": "Fimoz qanday ta'riflanadi?",
  "variantlar": [
   "Orqaga tortilgan preputsiyning qaytolmasligi",
   "Preputsiyni boshchadan orqaga tortib bo'lmaslik",
   "Boshchaning to'liq ko'rinmasligi tug'ma holat",
   "Preputsiyning yallig'lanishi"
  ],
  "togri": 1,
  "izoh": "Fimoz — preputsiyni boshchadan orqaga tortib bo'lmaslik holati. Ikki turga bo'linadi: birlamchi (fiziologik) va ikkilamchi (patologik)."
 },
 {
  "savol": "Fiziologik fimoz nima va u qanday holat?",
  "variantlar": [
   "Patologik jarayon — darhol davolash kerak",
   "Tug'ma yopishqoqlik natijasida yuzaga keladigan normal rivojlanish jarayoni",
   "Faqat katta yoshlilarda uchraydigan kasallik",
   "Infeksiya natijasida rivojlanadigan holat"
  ],
  "togri": 1,
  "izoh": "Fiziologik fimoz — tug'ma yopishqoqlik natijasida normal rivojlanish jarayoni. 3 yoshli bolalarning 90% da preputsiy to'liq orqaga tortiladigan bo'ladi, 17 yoshda 1% dan kamida qoladi."
 },
 {
  "savol": "Bolalarda preputsiyni zo'rlab orqaga tortish nima uchun man etiladi?",
  "variantlar": [
   "Og'riq keltirib chiqarishi mumkin",
   "Chandiq hosil qilib ikkilamchi fimozga olib keladi",
   "Infeksiya xavfini oshiradi",
   "Qon ketishiga sabab bo'ladi"
  ],
  "togri": 1,
  "izoh": "Zo'rlab retraksiya yopishqoqlikni sindirmaydi, aksincha chandiq (cicatrix) hosil qilib ikkilamchi fimozga olib keladi. Ota-onalarga fiziologik fimoz o'z-o'zidan tuzilishini tushuntirish kerak."
 },
 {
  "savol": "Ikkilamchi (patologik) fimozning eng muhim sababi qaysi?",
  "variantlar": [
   "Takroriy siydik yo'li infeksiyasi",
   "Qandli diabet",
   "Balanit kserotika obliterans (BXO/lichen sclerosis)",
   "Zo'rlab retraksiya natijasidagi chandiq"
  ],
  "togri": 2,
  "izoh": "BXO (Balanit kserotika obliterans / lichen sclerosis) — preputsiyda oq, sklerotik o'zgarish hosil qiladigan eng muhim patologik sabab. Topikal steroid ko'pincha samarasiz — xatna ko'rsatiladi."
 },
 {
  "savol": "Fimozning klinik belgilari qaysilar?",
  "variantlar": [
   "Boshchaning kengayishi va qizarishi",
   "Preputsiyni orqaga tortib bo'lmaslik, siydik chiqarganda balon kabi shishish, dizuriya",
   "Faqat og'riq va isitma",
   "Faqat kechasi og'riq"
  ],
  "togri": 1,
  "izoh": "Fimoz belgilari: preputsiyni orqaga tortib bo'lmaslik, siydik chiqarganda preputsiy 'balon' kabi shishishi, dizuriya, siydik oqimi zaifligi, ereksiya paytida og'riq."
 },
 {
  "savol": "Fimoz davolashda birinchi tanlov usuli qaysi?",
  "variantlar": [
   "Darhol xatna (sirkumziya)",
   "Topikal kortikosteroid krem (betametazon 0.05%)",
   "Antibiotik kursi",
   "Jarrohlik plastikasi"
  ],
  "togri": 1,
  "izoh": "Topikal kortikosteroid krem (betametazon 0.05%) — 2 marta/kun, 4–8 hafta davomida; 70–85% da samarali. Fiziologik fimozda birinchi tanlash usuli."
 },
 {
  "savol": "Preputioplastika nima?",
  "variantlar": [
   "Preputsiyni to'liq olib tashlash",
   "Xatnaga muqobil — preputsiyni saqlab kengaytiruvchi jarrohlik",
   "Preputsiyga steroid injeksiyasi",
   "Preputsiyni lazer bilan davolash"
  ],
  "togri": 1,
  "izoh": "Preputioplastika — preputsiyni olib tashlamas balki kengaytiruvchi plastik jarrohlik. Xatnaga muqobil variant sifatida, ayniqsa preputsiyni saqlamoqchi bo'lgan bemorlarda."
 },
 {
  "savol": "Parafimoz qanday ta'riflanadi?",
  "variantlar": [
   "Preputsiyni orqaga tortib bo'lmaslik",
   "Orqaga tortilgan preputsiyning boshcha ortida qolib, o'z joyiga qaytolmasligi",
   "Preputsiyning surunkali yallig'lanishi",
   "Boshchaning tug'ma kengayishi"
  ],
  "togri": 1,
  "izoh": "Parafimoz — orqaga tortilgan preputsiyning boshcha ortida qolib, o'z joyiga qaytolmasligi. Preputsiy tor halqasi boshcha tagida qoladi va limfa oqimini to'sadi."
 },
 {
  "savol": "Parafimozda 'yopiq doira mexanizmi' qanday ishlaydi?",
  "variantlar": [
   "Infeksiya tezda tarqaladi",
   "Shish halqaning yanada qattiqroq tiqilishiga olib keladi, bu esa ko'proq shishga sabab bo'ladi",
   "Siydik chiqishi to'xtatiladi",
   "Qon bosimi oshib ketadi"
  ],
  "togri": 1,
  "izoh": "Preputsiy halqasi limfa oqimini to'sib shish paydo qiladi → shish halqani yanada qattiqroq qiladi → halqa yanada ko'proq shishga olib keladi. Shu sababli tezda davolanish zarur."
 },
 {
  "savol": "Parafimoz nima uchun shoshilinch holat?",
  "variantlar": [
   "Infeksiya tez tarqaladi",
   "Siydik to'xtab qoladi",
   "O'z vaqtida davolanmasa boshcha nekrozi va gangrena rivojlanishi mumkin",
   "Qon ketishi xavfi bor"
  ],
  "togri": 2,
  "izoh": "Parafimoz shoshilinch holat — o'z vaqtida davolanmasa boshcha (glans) nekrozi va gangrena rivojlanishi mumkin. Har qanday kechikish xavf tug'diradi."
 },
 {
  "savol": "Parafimoz qanday yuzaga kelishi mumkin?",
  "variantlar": [
   "Faqat tug'ma anomaliya sifatida",
   "Kateter qo'yilgandan keyin preputsiy qaytarilmay qolganda, jinsiy aloqadan keyin",
   "Faqat BXO kasalligida",
   "Faqat diabetik bemorlarda"
  ],
  "togri": 1,
  "izoh": "Parafimoz tibbiy muolaja (kateterizatsiya)dan keyin preputsiy qaytarilmaganda, jinsiy aloqa/masturbatsiyadan keyin tor preputsiy qaytolmay qolganda yuzaga keladi."
 },
 {
  "savol": "Fimoz va parafimozning asosiy farqi nima?",
  "variantlar": [
   "Fimoz og'riqli, parafimoz og'riqsiz",
   "Fimoz — preputsiy orqaga tortilmaydi; parafimoz — orqaga tortilgan preputsiy qaytolmaydi",
   "Fimoz shoshilinch, parafimoz emas",
   "Fimoz katta yoshlilarda, parafimoz faqat bolalarda"
  ],
  "togri": 1,
  "izoh": "Asosiy farq: fimoz — preputsiy orqaga tortilmaydi (old tomonda tor); parafimoz — preputsiy orqaga tortilgan, lekin qaytolmaydi (boshcha ortida qolib qoladi). Parafimoz shoshilinch holat."
 },
 {
  "savol": "Parafimozda davolashning birinchi bosqichi nima?",
  "variantlar": [
   "Darhol jarrohlik",
   "Og'riqni boshqarish — anesteziya berish",
   "Muz qo'llash",
   "Antibiotik boshlash"
  ],
  "togri": 1,
  "izoh": "Parafimozda davolash bosqichlari: 1) Anesteziya (topikal krem, penile blok yoki sedatsiya) → 2) Shishni kamaytirish → 3) Manual reduction. Protsedura og'riqli — anesteziya majburiy."
 },
 {
  "savol": "Granulated sugar (donador shakar) parafimozda qanday mexanizm orqali ishlaydi?",
  "variantlar": [
   "Infeksiyaga qarshi ta'sir qiladi",
   "Osmotik mexanizm orqali suvni tortib shishni kamaytiradi",
   "Qon aylanishini yaxshilaydi",
   "Halqani yumshatadi"
  ],
  "togri": 1,
  "izoh": "Donador shakar 1–2 soat preputsiyga qo'yiladi. Osmotik mexanizm orqali to'qimadan suvni tortib oladi va shishni kamaytiradi — bu manual reductionni osonlashtiradi."
 },
 {
  "savol": "Parafimozda manual reduction (qo'lda qaytarish) qanday amalga oshiriladi?",
  "variantlar": [
   "Bir barmoq bilan halqani kesib ochish",
   "Ikki bosh barmoq bilan boshchaga bosib siqish, qolgan barmoqlar bilan halqani qaytarish",
   "Faqat muz qo'llash kifoya",
   "Jarrohlik asboblari bilan majburiy tortish"
  ],
  "togri": 1,
  "izoh": "Manual reduction: ikki bosh barmoq bilan boshchaga bosim o'tkazib siqiladi, qolgan barmoqlar bilan preputsiy halqasi boshcha ustiga 'surib' qaytariladi. ~5 daqiqa barqaror bosim."
 },
 {
  "savol": "Dorsal yiriq (dorsal slit) parafimozda qachon qo'llaniladi?",
  "variantlar": [
   "Har doim birinchi usul sifatida",
   "Manual reduction muvaffaqiyatsiz bo'lganda",
   "Faqat bolalarda",
   "Faqat BXO kasalligida"
  ],
  "togri": 1,
  "izoh": "Dorsal slit — manual reduction muvaffaqiyatsiz bo'lganda tor halqani kesib ochish. Bu darhol boshchaga bosimni kamaytiradi. Keyin rejalantirilgan xatna bajariladi."
 },
 {
  "savol": "Soch tourniquet sindromi parafimozdan qanday farqlanadi?",
  "variantlar": [
   "Tourniquet faqat katta yoshlilarda uchraydi",
   "Tourniquet — soch yoki ip olat atrofiga o'ralib to'qimani siqadi; tashqi ko'rinish o'xshash bo'lishi mumkin",
   "Tourniquet faqat og'riqsiz kechadi",
   "Tourniquet faqat xatna qilingan bolalarda"
  ],
  "togri": 1,
  "izoh": "Soch tourniquet sindromi — soch yoki ip olat atrofiga o'ralib, parafimozga o'xshash shish va qizarishga olib keladi. Bolalarda differensial tashxisga qo'shilishi kerak — batafsil ko'rik zarur."
 },
 {
  "savol": "BXO (Balanit kserotika obliterans) qanday ko'rinishga ega?",
  "variantlar": [
   "Boshchada qizil, yarali o'zgarish",
   "Preputsiyda oq, sklerotik (chandiqli) o'zgarish",
   "Faqat yallig'lanish belgisi",
   "Preputsiyning qalinlashishi"
  ],
  "togri": 1,
  "izoh": "BXO (lichen sclerosis) — preputsiyda oq, sklerotik o'zgarish. Eng muhim patologik fimoz sababi. Topikal steroid ko'pincha samarasiz, xatna ko'rsatiladi."
 },
 {
  "savol": "Xatna (sirkumziya) fimozda qachon ko'rsatiladi?",
  "variantlar": [
   "Barcha fimoz holatlarida darhol",
   "Topikal davolash muvaffaqiyatsiz bo'lganda yoki BXO mavjud bo'lganda",
   "Faqat 18 yoshdan katta bemorlarda",
   "Faqat parafimozdan keyin"
  ],
  "togri": 1,
  "izoh": "Xatna ko'rsatiladi: topikal kortikosteroid krem samarasiz bo'lganda, BXO mavjud bo'lganda, yoki surunkali balanit/balanopostit bo'lganda."
 },
 {
  "savol": "Parafimozda penile blok qanday amalga oshiriladi?",
  "variantlar": [
   "Boshchaga to'g'ridan-to'g'ri injeksiya",
   "Dorsal penile nerv bloki — lidokain bilan",
   "Umurtqa pog'onasiga anesteziya",
   "Faqat topikal krem qo'llaniladi"
  ],
  "togri": 1,
  "izoh": "Penile blok — dorsal penile nerv bloki lidokain bilan. Parafimoz davolashda protsedural og'riqni boshqarish uchun qo'llaniladi. Bolalarda ketamin sedatsiyasi ham ko'rib chiqilishi mumkin."
 },
 {
  "savol": "17 yoshda fiziologik fimoz qancha foizda qoladi?",
  "variantlar": [
   "~10% da",
   "~5% da",
   "1% dan kamroqda",
   "~25% da"
  ],
  "togri": 2,
  "izoh": "3 yoshda xatna qilinmagan bolalarning 90% da preputsiy to'liq orqaga tortiladigan bo'ladi. 17 yoshda fiziologik fimoz 1% dan kamroq bolada qoladi — ya'ni aksariyati o'z-o'zidan tuziladi."
 },
 {
  "savol": "Parafimozda muz qo'llash qanday ishlaydi?",
  "variantlar": [
   "Infeksiyani to'xtatadi",
   "5 daqiqa muzli qo'lqop boshcha va preputsiyga qo'yiladi — sovuq shishni kamaytiradi",
   "Halqani yumshatib qaytarishga yordam beradi",
   "Qon aylanishini kamaytiradi"
  ],
  "togri": 1,
  "izoh": "Muz (muzli qo'lqop) 5 daqiqa qo'yiladi — sovuq ta'sir orqali shishni kamaytiradi va manual reductionni osonlashtiradi. Shishni kamaytirish — qaytarish uchun birinchi qadam."
 },
 {
  "savol": "Fimozda 'ballooning' simptomu nima?",
  "variantlar": [
   "Boshchaning ballon kabi kattalashishi",
   "Siydik chiqarganda preputsiyning siydik bilan to'lib balon kabi shishishi",
   "Uretraning kengayishi",
   "Qovuqning ortiqcha to'lishi"
  ],
  "togri": 1,
  "izoh": "Ballooning — fimozda preputsiy so'lqilgan bo'lgani uchun siydik chiqayotganda preputsiy bo'shlig'i siydik bilan to'lib, balon kabi shishadi. Bu siydik oqimi qiyinlashganining belgisi."
 },
 {
  "savol": "Qandli diabet fimoz xavfini nima uchun oshiradi?",
  "variantlar": [
   "Insulin preputsiyga ta'sir qiladi",
   "Glyukozuriya va immunosupressiya infeksiya va chandiq xavfini oshiradi",
   "Diabet gormonal muvozanatni buzadi",
   "Diabet preputsiy to'qimasini kengaytiradi"
  ],
  "togri": 1,
  "izoh": "Qandli diabetda glyukozuriya (siydikda shakar) bakteriyalar uchun qulay muhit yaratadi, immunosupressiya esa infeksiyaga moyillikni oshiradi — bu surunkali balanit va chandiqlanish xavfini kuchaytiradi."
 },
 {
  "savol": "Parafimoz davolashda Coban (elastik bog'lam) qanday ishlatiladi?",
  "variantlar": [
   "Halqani kesib ochish uchun",
   "15–30 daqiqa siqib o'rab shishni kamaytirish uchun",
   "Boshchani himoya qilish uchun",
   "Anesteziya berish uchun"
  ],
  "togri": 1,
  "izoh": "Coban (elastik bog'lam) 15–30 daqiqa preputsiy va boshchaga o'ralib, mexanik siqish orqali shishni kamaytiradi. Shakar yoki muz bilan birga ishlatilishi mumkin."
 },
 {
  "savol": "Ko'p ignali punksiya parafimozda qanday maqsadda qo'llaniladi?",
  "variantlar": [
   "Infeksiyaga qarshi dori kiritish uchun",
   "Shishgan teriga mayda teshiklar ochib to'planган suyuqlikni chiqarish uchun",
   "Anesteziya berish uchun",
   "Preputsiy halqasini kengaytirish uchun"
  ],
  "togri": 1,
  "izoh": "Ko'p ignali punksiya — shishgan teriga ko'p mayda teshik ochib to'plangan limfa suyuqligini chiqarish usuli. Shishni tezda kamaytiradi va manual reductionni osonlashtiradi."
 },
 {
  "savol": "Parafimozda kuchli shishda xatna qilingan olat bilan adashmaslik uchun nima so'raladi?",
  "variantlar": [
   "So'nggi taom iste'moli vaqti",
   "Xatna holati — anamnezda so'raladi",
   "Allergiyalar ro'yxati",
   "Qon guruhi"
  ],
  "togri": 1,
  "izoh": "Kuchli shishda parafimoz xatna qilingan olat bilan adashishi mumkin (preputsiy ko'rinmaydi). Shu sababli anamnezda xatna holati so'ralishi shart — preputsiy halqasini qidirish kerak."
 },
 {
  "savol": "Xatna qilingan bemorlarda parafimoz uchrashi mumkinmi?",
  "variantlar": [
   "Yo'q, mutlaqo mumkin emas",
   "Ha, sirkumziyadan keyin chandiq bo'lsa kamdan-kam holatlarda",
   "Ha, har doim sirkumziyadan keyin",
   "Faqat bolalarda xatna bo'lsa"
  ],
  "togri": 1,
  "izoh": "Xatna qilingan bemorlarda ham kamdan-kam holatlarda parafimoz yuzaga kelishi mumkin — sirkumziyadan keyin chandiq bo'lsa yoki qisman xatna bo'lsa."
 },
 {
  "savol": "Fimozda betametazon krem qanchalik samarali?",
  "variantlar": [
   "20–30% da samarali",
   "50% da samarali",
   "70–85% da samarali",
   "95–100% da samarali"
  ],
  "togri": 2,
  "izoh": "Topikal betametazon 0.05% kremi 4–8 hafta davomida 2 marta/kun qo'llanilganda 70–85% da samarali — bu xatnaning muqobili sifatida birinchi qatordagi davolash."
 },
 {
  "savol": "Parafimoz davolash bosqichlarining to'g'ri tartibi qaysi?",
  "variantlar": [
   "Jarrohlik → anesteziya → muz",
   "Anesteziya → shishni kamaytirish → manual reduction → dorsal slit (zarur bo'lsa)",
   "Muz → jarrohlik → anesteziya",
   "Antibiotik → anesteziya → xatna"
  ],
  "togri": 1,
  "izoh": "To'g'ri tartib: 1) Anesteziya → 2) Shishni kamaytirish (muz/shakar/Coban/punksiya) → 3) Manual reduction → 4) Dorsal slit (reduction muvaffaqiyatsiz bo'lsa) → 5) Rejalantirilgan xatna."
 },
 {
  "savol": "Balanopostit nima va u fimozga qanday olib keladi?",
  "variantlar": [
   "Boshcha saratori — fimozga bevosita olib kelmaydi",
   "Boshcha va preputsiy yallig'lanishi — takroriy epizodlar chandiqlanishga olib keladi",
   "Siydik yo'li infeksiyasi — fimoz bilan bog'liq emas",
   "Prostata yallig'lanishi — fimozga olib kelmaydi"
  ],
  "togri": 1,
  "izoh": "Balanopostit — boshcha (balanit) va preputsiy (posthit)ning yallig'lanishi. Takroriy epizodlar chandiqlanishga, chandiqlanish esa ikkilamchi (patologik) fimozga olib keladi."
 },
 {
  "savol": "Parafimozda shishni kamaytirmasdan darhol manual reduction urinishi nima uchun noto'g'ri?",
  "variantlar": [
   "Vaqt yo'qoladi",
   "Shish kamaymasa halqani qaytarish qiyin va to'qimaga qo'shimcha shikast yetishi mumkin",
   "Anesteziya kerak emas",
   "Muvaffaqiyat ehtimoli bir xil"
  ],
  "togri": 1,
  "izoh": "Shish kamaymagan holda manual reduction urinishi qiyin va to'qimaga qo'shimcha travma yetkazishi mumkin. Asosiy tamoyil: 'avval shishni kamaytir, keyin qaytarish osonlashadi'."
 },
 {
  "savol": "Smegma to'planishi fiziologik fimozda qanday rol o'ynaydi?",
  "variantlar": [
   "Infeksiya keltirib chiqaradi",
   "Preputsiy ajralishini (separatsiya) tabiiy ravishda ta'minlashga yordam beradi",
   "Chandiqlanishga olib keladi",
   "Hech qanday roli yo'q"
  ],
  "togri": 1,
  "izoh": "Smegma to'planishi (1–4 yil davomida) va intermittent ereksiyalar preputsiyning boshchadan tabiiy ravishda asta-sekin ajralishini (separatsiya) ta'minlaydi — bu fiziologik jarayon."
 },
 {
  "savol": "Fimoz va parafimoz qaysi guruh erkaklarda ko'proq uchraydi?",
  "variantlar": [
   "Xatna qilingan erkaklarda",
   "Xatna qilinmagan erkaklarda",
   "Faqat diabetik bemorlarda",
   "Faqat immunosupressiv bemorlarda"
  ],
  "togri": 1,
  "izoh": "Fimoz va parafimoz xatna qilinmagan erkaklarda uchraydigan, preputsiy bilan bog'liq holat. Xatna qilingan erkaklarda bu holatlar deyarli kuzatilmaydi."
 },
 {
  "savol": "Ereksiya paytida og'riq fimozning qaysi belgisi hisoblanadi?",
  "variantlar": [
   "Bu fimozga xos emas",
   "Ereksiyada preputsiy kengayishga to'sqinlik qilib og'riq beradi",
   "Bu parafimozning belgisi",
   "Bu BXO ning xos belgisi"
  ],
  "togri": 1,
  "izoh": "Ereksiya paytida og'riq — fimozning klinik belgisi. Ereksiyada olatning hajmi kattalashadi, lekin tor preputsiy kengayishga to'sqinlik qiladi, bu esa og'riq keltirib chiqaradi."
 },
 {
  "savol": "Parafimozda boshchaning klinik ko'rinishi qanday?",
  "variantlar": [
   "Boshcha normal ko'rinadi",
   "Boshcha shishgan, qizargan, og'riqli; ortida tor preputsiy halqasi ko'rinadi",
   "Boshcha oqargan va sezuvchanlik yo'q",
   "Boshcha kattalashgan, ammo og'riqsiz"
  ],
  "togri": 1,
  "izoh": "Parafimozda klassik ko'rinish: boshcha (glans) shishgan, qizargan, og'riqli; boshcha ortida tor preputsiy halqasi ko'rinadi. Shish tezda ortib boradi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Varikotsele va gidrotsele — asosiy farqlari (oson)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('varikotsele-gidrotsele-farqi', NULL, $dt_bank$[
 {
  "savol": "Varikotsele qanday ta'riflanadi?",
  "variantlar": [
   "Tunica vaginalis orasida suyuqlik to'planishi",
   "Pampiniform venoz pleksus venalarining kengayishi va buralishi",
   "Moyak pardalarining yallig'lanishi",
   "Epididimisning kengayishi"
  ],
  "togri": 1,
  "izoh": "Varikotsele — pampiniform venoz pleksus (moyak ustidagi vena tarmog'i) venalarining varikoz tarzda kengayishi va buralishi. Klassik tavsif: palpatsiyada 'qurt qopi' hissi."
 },
 {
  "savol": "Varikotsele qaysi tomonda ko'proq uchraydi?",
  "variantlar": [
   "O'ng tomonda (85–90%)",
   "Chap tomonda (85–90%)",
   "Ikkala tomonda teng (50/50)",
   "Faqat ikki tomonlama uchraydi"
  ],
  "togri": 1,
  "izoh": "Varikotsele 85–90% chap tomonda uchraydi. Sababi: chap ichki spermatik vena chap buyrak venasiga to'g'ri burchak ostida quyiladi — qon oqimi qiyinroq."
 },
 {
  "savol": "O'ng tomonlama varikotsele yotgan holatda ham yo'qolmasa nima shubhali?",
  "variantlar": [
   "O'ng tomonlama gidrosele",
   "Retroperitoneal o'sma yoki qorin ichida vena to'siq",
   "O'ng buyrak toshi",
   "Normal holat — hech narsa shubhali emas"
  ],
  "togri": 1,
  "izoh": "O'ng tomonlama varikotsele, ayniqsa yotganda ham yo'qolmasa — retroperitoneal o'sma yoki pastki kovak venaga bosim shubhasi. Qorin UTT yoki KT majburiy."
 },
 {
  "savol": "Varikotsele I darajasi qanday aniqlanadi?",
  "variantlar": [
   "Ko'rikda ko'zga tashlanadi",
   "Tinch holatda palpatsiyada aniqlanadi",
   "Faqat Valsalva paytida palpatsiyada aniqlanadi",
   "UTT da tasodifan aniqlanadi (subklinik)"
  ],
  "togri": 2,
  "izoh": "Varikotsele I daraja: faqat Valsalva manеvri (kuchanish) paytida palpatsiyada aniqlanadi, tinch holatda va ko'rikda ko'rinmaydi. II daraja — tinch palpatsiyada. III daraja — ko'rikda ko'rinadi."
 },
 {
  "savol": "Subklinik varikotsele nima?",
  "variantlar": [
   "I daraja varikotsele",
   "Faqat UTT (Doppler) da aniqlanadigan, klinik ko'rikda topilmaydigan varikotsele",
   "Og'riqsiz o'tadigan varikotsele",
   "Davolashga muhtoj bo'lmagan varikotsele"
  ],
  "togri": 1,
  "izoh": "Subklinik varikotsele — klinik ko'rikda (palpatsiya, Valsalva) aniqlanmaydi, faqat Doppler UTT da aniqlangan. Subklinik varikotsele davolanmaydi."
 },
 {
  "savol": "Varikotsele spermatogenezga qanday ta'sir qiladi?",
  "variantlar": [
   "Sperma ishlab chiqarishni oshiradi",
   "Skrotal harorat ko'tarilib oksidativ stress orqali spermatogenezni buzadi",
   "Testosterone darajasini oshiradi",
   "Spermatogenezga hech qanday ta'siri yo'q"
  ],
  "togri": 1,
  "izoh": "Varikotsele skrotal haroratni ko'taradi → oksidativ stress (ROS) → Sertoli va Leydig hujayralar zarar ko'radi → spermatogenez buzilishi va testosteron ishlab chiqarish kamayishi."
 },
 {
  "savol": "Varikotsele davolash uchun asosiy ko'rsatmalar qaysilar?",
  "variantlar": [
   "Har qanday varikotsele topilsa darhol davolash kerak",
   "Klinik varikotsele + bepushtlik + anormal spermogramma; yoki o'smirda moyak atrofiyasi",
   "Faqat og'riq bo'lsa davolash kerak",
   "Faqat subklinik varikotsele davolanadi"
  ],
  "togri": 1,
  "izoh": "Davolash ko'rsatmalari: 1) Klinik varikotsele (I–III) + bepushtlik + anormal spermogramma; 2) O'smirda varikotsele + moyak atrofiyasi (>2 ml yoki >20% hajm farqi); 3) Og'riqli varikotsele konservativ davolashga javob bermasa."
 },
 {
  "savol": "Varikotseleда oltin standart davolash usuli qaysi?",
  "variantlar": [
   "Laparoskopik Palomo usuli",
   "Perkutan embolizatsiya",
   "Mikrojarrohlik varikotselectomiya (inguinal/subinguinal)",
   "Skrotal varikotselectomiya"
  ],
  "togri": 2,
  "izoh": "Mikrojarrohlik varikotselectomiya — oltin standart. Operatsion mikroskop ostida arteriya, limfa tomirlarini saqlab faqat venalar bog'lanadi. Asorat kamroq: gidrosele xavfi <1%, qaytalash kam."
 },
 {
  "savol": "Palomo usuli varikotsele davolashda qachon afzal?",
  "variantlar": [
   "Birinchi qatordagi davolash usuli sifatida",
   "Ikki tomonlama varikotsele uchun laparoskopik yondашув",
   "Faqat bolalarda qo'llaniladi",
   "Mikrojarrohlikdan keyin qaytalashda"
  ],
  "togri": 1,
  "izoh": "Palomo usuli — laparoskopik spermatik vena ligatsiyasi. Ikki tomonlama varikotsele uchun qulay. Kamchiligi: gidrosele asorat xavfi mikrojarrohlikdan yuqoriroq (limfa tomirlari ham bog'lanishi mumkin)."
 },
 {
  "savol": "Gidrosele qanday ta'riflanadi?",
  "variantlar": [
   "Pampiniform venoz pleksus venalarining kengayishi",
   "Tunica vaginalis ikki qavati orasida suyuqlik to'planishi",
   "Epididimisda kista hosil bo'lishi",
   "Moyak pardalarining yallig'lanishi"
  ],
  "togri": 1,
  "izoh": "Gidrosele — moyakni o'rab turuvchi tunica vaginalis ikki qavati orasida suyuqlik to'planishi natijasida skrotumning shishishi. Odatda og'riqsiz."
 },
 {
  "savol": "Kommunikatsiyadagi gidrosele nima?",
  "variantlar": [
   "Ikkilamchi gidrosele — moyak o'smasidan keyin",
   "Processus vaginalis yopilmagan — qorin bo'shlig'i bilan aloqa bor",
   "Faqat katta yoshlilarda uchraydigan tur",
   "Infeksiya natijasida yuzaga keladigan tur"
  ],
  "togri": 1,
  "izoh": "Kommunikatsiyadagi gidrosele — processus vaginalis (qorindan skrotumga cho'zilgan kanal) yopilmagan holat. Qorin suyuqligi erkin o'tadi. Bolalarda tik turish bilan o'lchami ortadi."
 },
 {
  "savol": "Katta yoshlilarda yangi paydo bo'lgan gidroseleda nima majburiy?",
  "variantlar": [
   "Darhol operatsiya",
   "UTT — moyak o'smasini istisno qilish uchun",
   "Antibiotik kursi",
   "Faqat kuzatish"
  ],
  "togri": 1,
  "izoh": "Katta yoshlilarda yangi paydo bo'lgan gidroseleda UTT MAJBURIY — reaktiv gidrosele moyak o'smasining dastlabki belgisi bo'lishi mumkin. O'smani istisno qilmasdan operatsiya noto'g'ri."
 },
 {
  "savol": "Transilluminatsiya sinovida qanday natija gidroseleni ko'rsatadi?",
  "variantlar": [
   "Nuri o'tmaydi (salbiy natija)",
   "Nuri o'tadi (ijobiy natija)",
   "O'zgaruvchan natija",
   "Transilluminatsiya gidroseleda ishlatilmaydi"
  ],
  "togri": 1,
  "izoh": "Transilluminatsiya ijobiy (nuri o'tadi) — suyuqlik borligini ko'rsatadi → gidrosele, spermatotsele. Salbiy (nuri o'tmaydi) — qattiq massa, qon tomirlari (varikotsele, o'sma). Muhim farqlash usuli."
 },
 {
  "savol": "Varikotsele va gidroselening asosiy klinik farqi nima?",
  "variantlar": [
   "Varikotsele og'riqsiz, gidrosele og'riqli",
   "Varikotsele Valsalvada kuchayadi, gidrosele transilluminatsiya ijobiy",
   "Varikotsele faqat o'smirda, gidrosele faqat katta yoshlilarda",
   "Varikotsele faqat o'ng tomonda, gidrosele faqat chap tomonda"
  ],
  "togri": 1,
  "izoh": "Asosiy farq: varikotsele Valsalva paytida kuchayadi (venalar qon bilan to'ladi); gidrosele esa transilluminatsiya ijobiy (suyuqlik nuri o'tkazadi). Varikotsele — bepushtlik; gidrosele — odatda bepushtlik bilan bog'liq emas."
 },
 {
  "savol": "Spermogramma qachon varikotsele davolash qaroriga ta'sir qiladi?",
  "variantlar": [
   "Har doim spermogramma davolashga ko'rsatma bo'ladi",
   "Reproduktiv yoshdagi bepusht bemorlarda — anormal spermogramma davolash ko'rsatmalaridan biri",
   "Spermogramma varikotsele davolashda ishlatilmaydi",
   "Faqat subklinik varikotsele uchun zarur"
  ],
  "togri": 1,
  "izoh": "Reproduktiv yoshdagi bepusht bemorlarda varikotsele + anormal spermogramma birgalikda davolash ko'rsatmasi. Agar spermogramma normal va bolalar bo'lsa — davolash ko'rsatilmaydi."
 },
 {
  "savol": "Lambert formulasi nimani hisoblashda ishlatiladi?",
  "variantlar": [
   "Sperma konsentratsiyasini hisoblash",
   "Moyak hajmini hisoblash (uzunlik × kenglik × balandlik × 0.71)",
   "Varikotsele darajasini hisoblash",
   "Gidrosele suyuqlik hajmini hisoblash"
  ],
  "togri": 1,
  "izoh": "Lambert formulasi: moyak hajmi = uzunlik × kenglik × balandlik × 0.71. O'smirda varikotsele tarafidagi moyak ikkinchi moyakdan >2 ml yoki >20% kichik bo'lsa — atrofiya belgisi va davolash ko'rsatmasi."
 },
 {
  "savol": "Varikotsele qaysi usul bilan aniq tasvirlanadi?",
  "variantlar": [
   "Sado-UTT oddiy rejimda",
   "Doppler UTT — venalar diametri >3 mm va Valsalvada teskari qon oqimi",
   "KT skan",
   "MRT tekshiruvi"
  ],
  "togri": 1,
  "izoh": "Doppler UTT — venalar diametri >3 mm bo'lsa va Valsalva paytida qon oqimining teskari yo'nalishi (reflux) aniqlanasa — varikotsele tasdiqlangan. Bu oltin standart tasvirlash usuli."
 },
 {
  "savol": "Gidrosele jarrohligida qaysi usullar qo'llaniladi?",
  "variantlar": [
   "Bottleneck (Lord) usuli yoki gidroselectomiya",
   "Varikotselectomiya",
   "Palomo ligatsiyasi",
   "Embolizatsiya"
  ],
  "togri": 0,
  "izoh": "Gidrosele davolash jarrohligida bottleneck usuli (Lord plastikasi) yoki gidroselectomiya qo'llaniladi. Varikotselectomiya esa varikotsele uchun — boshqa holat."
 },
 {
  "savol": "Kommunikatsiyadagi gidrosele bolalarda qanday boshqariladi?",
  "variantlar": [
   "Tug'ilgandan darhol operatsiya",
   "1–2 yoshgacha kuzatish (spontan yopilishi mumkin), keyin jarrohlik",
   "Faqat kuzatish — operatsiya zarur emas",
   "Dori bilan davolash"
  ],
  "togri": 1,
  "izoh": "Kommunikatsiyadagi gidrosele bolalarda 1–2 yoshgacha kuzatiladi — processus vaginalis spontan yopilishi mumkin. Yopilmasa yoki og'riqli bo'lsa — jarrohlik (inguinal yo'nдosh)."
 },
 {
  "savol": "Varikotsele bemorda tekshiruvni qanday holatda o'tkazish to'g'ri?",
  "variantlar": [
   "Faqat yotgan holatda",
   "Tik turgan holatda — yotganda varikotsele yo'qolishi mumkin",
   "Yon yotgan holatda",
   "Holat muhim emas"
  ],
  "togri": 1,
  "izoh": "Varikotsele tekshiruvi tik turgan holatda o'tkazilishi shart — yotganda venalar bo'shalib varikotsele yo'qolishi yoki kamayishi mumkin. Valsalva manevri ham tik turgan holatda bajariladi."
 },
 {
  "savol": "Pampiniform venoz pleksus qayerda joylashgan?",
  "variantlar": [
   "Prostata glandulasida",
   "Spermatik kanat ichida — moyak ustida tarmoqlangan vena tarmog'i",
   "Epididimis ichida",
   "Tunica albuginea ostida"
  ],
  "togri": 1,
  "izoh": "Pampiniform venoz pleksus — spermatik kanat ichida moyak venalarining tarmoqli tarmog'i. Ular birlashib ichki spermatik venaga quyiladi. Varikotsele aynan shu pleksusda rivojlanadi."
 },
 {
  "savol": "Protsessus vaginalis nima va u qanday kasallikka olib kelishi mumkin?",
  "variantlar": [
   "Moyak qobiqlari — varikotsele sababi",
   "Qorin bo'shlig'idan skrotumga cho'zilgan kanal — ochiq qolsa kommunikatsiyadagi gidrosele yoki chov churrasiga olib keladi",
   "Spermatik kanat devori — epididimis kistasiga olib keladi",
   "Tunica vaginalis tashqi qavati — gidrosele sababi emas"
  ],
  "togri": 1,
  "izoh": "Protsessus vaginalis — homiladorlikda qorindan skrotumga cho'zilgan kanal. Tug'ilgandan keyin yopilishi kerak. Yopilmasa: kichik ochilish → kommunikatsiyadagi gidrosele; katta ochilish → chov churras."
 },
 {
  "savol": "Varikotsele spermatogenezga ta'sirini baholash uchun qaysi tekshiruv zarur?",
  "variantlar": [
   "Qon testosteron darajasi",
   "Spermogramma (semen analysis)",
   "Skrotal UTT",
   "Qon UZI"
  ],
  "togri": 1,
  "izoh": "Spermogramma (semen analysis) — varikotsele spermatogenezga ta'sirini baholashda zarur tekshiruv. Oligospermiya, astеноspermiya, teratospermiya aniqlanadi."
 },
 {
  "savol": "Asimptomatik varikotsele (normal spermogramma, bola bor) davolanishi kerakmi?",
  "variantlar": [
   "Ha, har qanday varikotsele davolanishi shart",
   "Yo'q — subklinik yoki simptomsiz varikotsele spermogramma normal bo'lsa davolanmaydi",
   "Ha, lekin faqat dori bilan",
   "Faqat ikki tomonlama bo'lsa davolanadi"
  ],
  "togri": 1,
  "izoh": "Subklinik varikotsele yoki klinik varikotsele bor, lekin spermogramma normal va bola ko'ra olgan bo'lsa — davolash ko'rsatilmaydi. Kuzatish tavsiya etiladi."
 },
 {
  "savol": "Tunica vaginalis nima?",
  "variantlar": [
   "Spermatik kanat pardasi",
   "Moyakni ikki qavatda o'rab turuvchi parda — gidrosele shu yerda rivojlanadi",
   "Epididimis qobig'i",
   "Skrotum teri osti qavati"
  ],
  "togri": 1,
  "izoh": "Tunica vaginalis — moyakni (va epididimisni) o'rab turuvchi ikki qavatli parda (parietal va visseral qavat). Ikki qavat orasida normada ozgina suyuqlik bor. Ko'p to'plansa — gidrosele."
 },
 {
  "savol": "Perkutan embolizatsiya varikotsele davolashda qachon ko'rib chiqiladi?",
  "variantlar": [
   "Har doim birinchi tanlov usuli",
   "Minimal invaziv usul sifatida; jarrohlikdan keyin qaytalashda ham qo'llaniladi",
   "Faqat bolalarda",
   "Faqat ikki tomonlama varikotsele uchun"
  ],
  "togri": 1,
  "izoh": "Perkutan venoz embolizatsiya — minimal invaziv usul. Umumiy anesteziya shart emas. Jarrohlikdan keyin qaytalashda (recurrence) qulay muqobil. Muvaffaqiyat darajasi mikrojarrohlikka yaqin."
 },
 {
  "savol": "Bolalarda gidrosele jarrohligida qaysi yo'nalish ishlatiladi?",
  "variantlar": [
   "Skrotal yondashув",
   "Inguinal yondashув — processus vaginalisni yopish",
   "Laparoskopik yondashув",
   "Retroperitoneal yondashув"
  ],
  "togri": 1,
  "izoh": "Bolalarda kommunikatsiyadagi gidroseleda inguinal yondashув — processus vaginalisni yuqori tomondan bog'lab yopish zarur. Faqat skrotal yondashув yetarli emas — kanal ochiq qoladi."
 },
 {
  "savol": "Reaktiv (ikkilamchi) gidrosele qanday yuzaga keladi?",
  "variantlar": [
   "Processus vaginalis ochiq qolishidan",
   "Epididimoorxit, moyak torsiyasi yoki o'sma kabi jarayonlarga reaktsiya sifatida",
   "Faqat jarrohlikdan keyin",
   "Tug'ma anomaliya sifatida"
  ],
  "togri": 1,
  "izoh": "Reaktiv (ikkilamchi) gidrosele — epididimoorxit, moyak torsiyasi, jarohat yoki moyak o'smasi kabi jarayonlarga javoban suyuqlik to'planishi. Sababni aniqlash zarur — UTT majburiy."
 },
 {
  "savol": "Varikotsele bilan kelgan bemorlarda skrotal ko'rik qanday boshlanadi?",
  "variantlar": [
   "Yotgan holatda palpatsiya",
   "Tik turgan holatda ko'zdan kechirish va palpatsiya, keyin Valsalva manеvri",
   "Avval UTT, keyin ko'rik",
   "Ko'zdan kechirish o'tkazilmaydi — UTT yetarli"
  ],
  "togri": 1,
  "izoh": "Varikotsele ko'rigi: 1) Tik turish; 2) Ko'zdan kechirish; 3) Palpatsiya (moyak, epididimis, spermatik kanat); 4) Valsalva manеvri — pampiniform pleksus to'lishi. Yotgan holatda yo'qolishi — varikotsele belgisi."
 },
 {
  "savol": "Katta yoshlilarda gidrosele davolash qachon ko'rsatiladi?",
  "variantlar": [
   "Har qanday gidrosele topilsa darhol operatsiya",
   "Noqulaylik, og'riq yoki katta hajm bo'lganda; moyak o'smasini istisno qilgandan keyin",
   "Faqat ikkilamchi gidroseleda",
   "Faqat kommunikatsiyadagi gidroseleda"
  ],
  "togri": 1,
  "izoh": "Katta yoshlilarda gidrosele operatsiyasi ko'rsatmalari: noqulaylik, og'riq, katta hajm — moyak o'smasini UTT bilan istisno qilgandan keyin. Asimptomatik kichik gidrosele kuzatilishi mumkin."
 },
 {
  "savol": "Chap ichki spermatik vena qayerga quyiladi?",
  "variantlar": [
   "To'g'ridan-to'g'ri pastki kovak venaga",
   "Chap buyrak venasiga to'g'ri burchak ostida",
   "Aortaga",
   "O'ng buyrak venasiga"
  ],
  "togri": 1,
  "izoh": "Chap ichki spermatik vena chap buyrak venasiga to'g'ri burchak ostida quyiladi — bu anatomik xususiyat qon oqimini qiyinlashtiradi va chap tomonda varikotsele ko'proq uchraydigan sabab."
 },
 {
  "savol": "Varikotsele va gidrosele qaysi tekshiruv yordamida aniqlanadi?",
  "variantlar": [
   "Faqat palpatsiya yetarli",
   "Skrotal Doppler UTT — ikkalasini ham baholaydi",
   "Faqat KT skan",
   "Faqat MRT"
  ],
  "togri": 1,
  "izoh": "Skrotal Doppler UTT — varikotsele (venalar >3 mm, Valsalvada reflux) va gidrosele (echo-salbiy suyuqlik) ni baholaydi. Shuningdek moyak va epididimisni ko'rsatadi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- Kriptorxizm — nima va nega muhim (oson)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('kriptorxizm-asoslari', NULL, $dt_bank$[
 {
  "savol": "Kriptorxizm qanday ta'riflanadi?",
  "variantlar": [
   "Moyak yallig'lanishi",
   "Moyakning tug'ilish paytida skrotumga tushmagan holati",
   "Moyak atrofida suyuqlik to'planishi",
   "Moyak venalarining kengayishi"
  ],
  "togri": 1,
  "izoh": "Kriptorxizm (cryptorchidism) — moyakning tug'ilish paytida skrotumga tushmagan holati. Urologiyada eng ko'p uchraydigan tug'ma anomaliyalardan biri."
 },
 {
  "savol": "Muddatida tug'ilgan chaqaloqlarda kriptorxizm qancha foizda uchraydi?",
  "variantlar": [
   "~0.5% da",
   "~2–3% da",
   "~15% da",
   "~30% da"
  ],
  "togri": 1,
  "izoh": "Muddatida tug'ilganlarda kriptorxizm ~2–3% da uchraydi. Chala tug'ilganlarda esa ~30% — tez tug'ilish moyak tushish jarayonini to'xtatadi."
 },
 {
  "savol": "Yangi tug'ilgan bolada kriptorxizm aniqlansa qancha vaqt kuzatiladi?",
  "variantlar": [
   "Darhol operatsiya qilinadi",
   "3–6 oy kuzatiladi — spontan tushishi mumkin",
   "2 yoshgacha kuzatiladi",
   "Hech qachon kuzatilmaydi — darhol davolash"
  ],
  "togri": 1,
  "izoh": "Yangi tug'ilganda kriptorxizm aniqlansa 3–6 oy kuzatiladi. Bu vaqt ichida spontan tushishi mumkin. 6 oydan (to'g'rilanmagan yosh — adjusted age) keyin ham tushmasa davolash boshlanadi."
 },
 {
  "savol": "Orxiopeksiya (orchiopexy) qachon — qaysi yoshda o'tkazilishi tavsiya etiladi?",
  "variantlar": [
   "6 oydan keyin darhol, 12–18 oylik yoshda",
   "3–5 yoshda",
   "10 yoshda",
   "Balog'at yoshiga yetganda"
  ],
  "togri": 0,
  "izoh": "Joriy standart: orxiopeksiyani 6–18 oylik yoshda o'tkazish. 1 yoshgacha operatsiya germ hujayra yo'qolishini minimallashtirishda eng muhim vaqt oynasi."
 },
 {
  "savol": "Kech orxiopeksiya (2 yosh va katta) nima uchun kamroq samarali?",
  "variantlar": [
   "Bolalar anesteziyani yaxshi ko'taradi",
   "Kechikish bepushtlik xavfini kamaytirish samaradorligini pasaytiradi",
   "Katta yoshda operatsiya xavfliroq",
   "Kech operatsiya saraton xavfini yo'q qiladi"
  ],
  "togri": 1,
  "izoh": "Kech operatsiya (2 yosh va undan katta) bepushtlik xavfini kamaytirish samaradorligini pasaytiradi. Germ hujayralar yuqori harorat ta'sirida sezilarli zarar ko'radi."
 },
 {
  "savol": "Retraktor moyak kriptorxizmdan qanday farqlanadi?",
  "variantlar": [
   "Retraktor moyak hech qachon skrotumda bo'lmaydi",
   "Retraktor moyak kremasteric refleks ta'sirida chiqib turadi, lekin isitilgan xonada qo'l bilan skrotumga tushiriladi",
   "Retraktor moyak operatsiya talab qiladi",
   "Farqi yo'q — bir xil holat"
  ],
  "togri": 1,
  "izoh": "Retraktor moyak — kremasteric refleks tufayli skrotumdan chiqib turadi, ammo isitilgan xonada bemor chalqancha yotganda yoki cho'nqayib o'tirganda refleks bo'shashadi va moyak skrotumga tushadi. Kuzatish talab qiladi."
 },
 {
  "savol": "Palpatsiyalanmaydigan moyakda qaysi tekshiruv ham diagnostik, ham davolovchi usul?",
  "variantlar": [
   "UTT (ultratovush)",
   "KT skan",
   "Diagnostik laparoskopiya",
   "MRT tekshiruvi"
  ],
  "togri": 2,
  "izoh": "Palpatsiyalanmaydigan moyakda laparoskopiya — ham diagnostik (moyak qaerda ekanligini aniqlash), ham davolovchi (laparoskopik orxiopeksiya bajarish). AUA rutina UTT ni tavsiya etmaydi — sezuvchanligi past."
 },
 {
  "savol": "Kriptorxizmda moyak saratoni xavfi nechaga ortadi?",
  "variantlar": [
   "2 marta",
   "3–10 marta",
   "50 marta",
   "Hech qanday ortmaydi"
  ],
  "togri": 1,
  "izoh": "Kriptorxid erkakda moyak saratoni xavfi normal erkakga nisbatan 3–10 marta yuqori. Orxiopeksiya bu xavfni yo'q qilmaydi, lekin kamaytirishi mumkin va moyakni kuzatish uchun qulay joylashuvga keltiradi."
 },
 {
  "savol": "Kriptorxizmning bepushtlikka ta'siri qanday?",
  "variantlar": [
   "Bir tomonlama — ~10–15%; ikki tomonlama — ~40–70% bepushtlik xavfi",
   "Bir tomonlama — ~50%; ikki tomonlama — ~100%",
   "Bepushtlik xavfi yo'q",
   "Faqat ikki tomonlamada xavf bor, bir tomonlamada yo'q"
  ],
  "togri": 0,
  "izoh": "Bir tomonlama kriptorxizmda bepushtlik xavfi ~10–15%; ikki tomonlamada ~40–70%. Shu sababli erta orxiopeksiya germ hujayra saqlanishi uchun zarur."
 },
 {
  "savol": "Chov (inguinal) kriptorxizmida qaysi jarrohlik usuli qo'llaniladi?",
  "variantlar": [
   "Fowler-Stephens ikki bosqichli usul",
   "Chov orxiopeksiyasi (inguinal orchiopexy)",
   "Faqat laparoskopiya",
   "Skrotal orxiopeksiya"
  ],
  "togri": 1,
  "izoh": "Palpatsiyada aniqlangan chov yoki yuqori skrotal moyak uchun chov orxiopeksiyasi (inguinal orchiopexy) — eng ko'p qo'llaniladigan usul. Qorin ichidagi moyak uchun Fowler-Stephens usuli qo'llaniladi."
 },
 {
  "savol": "Fowler-Stephens usuli qanday holatda qo'llaniladi?",
  "variantlar": [
   "Barcha kriptorxizm holatlarida",
   "Qorin ichidagi moyak — bir bosqichli yoki ikki bosqichli laparoskopik orxiopeksiya",
   "Faqat ikki tomonlama kriptorxizmda",
   "Retraktor moyakda"
  ],
  "togri": 1,
  "izoh": "Fowler-Stephens usuli — qorin ichidagi moyak uchun. Ikki bosqichli: birinchi bosqichda spermatik arteriya kesib qo'yiladi (6 oy oldin), ikkinchi bosqichda moyak skrotumga tushiriladi. Kollateral qon ta'minoti saqlanadi."
 },
 {
  "savol": "Kriptorxizmda rutina ultratovush tekshiruvi nima uchun tavsiya etilmaydi?",
  "variantlar": [
   "Juda qimmat",
   "Sezuvchanligi past — taktikani o'zgartirmaydi; laparoskopiya ham diagnostik",
   "Bolalar uchun xavfli",
   "UTT varikotsele uchun ishlatiladi"
  ],
  "togri": 1,
  "izoh": "AUA 'Choosing Wisely' qo'llanmasiga ko'ra, rutina kriptorxizm baholashida ultratovush tavsiya etilmaydi — sezuvchanligi past (palpatsiyalanmaydigan moyakni aniqlamaydi) va taktikani o'zgartirmaydi."
 },
 {
  "savol": "Laparoskopiyada spermatik tomir va vas deferens ko'r tugasa (blind-ending) nima ma'nosi bor?",
  "variantlar": [
   "Moyak skrotumda yashiringan",
   "Moyak yo'q — anorxizm (prenatal torsiya yoki rivojlanmagan)",
   "Moyak qorin ichida chuqur",
   "Qo'shimcha operatsiya kerak"
  ],
  "togri": 1,
  "izoh": "Ko'r tugaydigan tomir va vas deferens — moyak yo'q (anorxizm). Prenatal torsiya yoki tug'ma rivojlanmaslik sababi bo'lishi mumkin. Laparoskopiya yakunlanadi — qo'shimcha aralashuv kerak emas."
 },
 {
  "savol": "Gormonoterapiya (hCG yoki GnRH) kriptorxizmda qanday baholanadi?",
  "variantlar": [
   "Birinchi qatordagi davolash — orxiopeksiyadan oldin",
   "Cheklangan samaradorlik — ko'pchilik ko'rsatmalarda tavsiya etilmaydi",
   "Operatsiyaning muqobili sifatida keng ishlatiladi",
   "Faqat ikki tomonlama kriptorxizmda qo'llaniladi"
  ],
  "togri": 1,
  "izoh": "hCG va GnRH gormonoterapiyasi cheklangan samaradorlikka ega. Ko'pchilik zamonaviy ko'rsatmalarda (AUA, EAU) birlamchi davolash sifatida tavsiya etilmaydi — orxiopeksiya birinchi tanlov."
 },
 {
  "savol": "Orttirilgan kriptorxizm (ascending testis) nima?",
  "variantlar": [
   "Tug'ma kriptorxizm turi",
   "Avval skrotumda bo'lgan moyakning keyinchalik yuqoriga ko'tarilishi",
   "Retraktor moyak bilan bir xil",
   "Jarrohlik asorати sifatida moyak ko'tarilishi"
  ],
  "togri": 1,
  "izoh": "Ascending testis (orttirilgan kriptorxizm) — avval normal joylashgan yoki retraktor moyak bo'lgan, ammo keyinchalik spermatik kanat qisqarishi tufayli yuqoriga ko'tarilib qolgan moyak. Balog'at yoshida moyil."
 },
 {
  "savol": "Moyak skrotumga tushish ikki qanday bosqichda amalga oshadi?",
  "variantlar": [
   "I: arteriyalar o'sishi, II: venalar o'sishi",
   "I: transabdominal faza (gubernakulum va CSL ta'sirida); II: chov-skrotal faza (androgen va CGRP ta'sirida)",
   "I: gormonal bosqich, II: mexanik bosqich",
   "I: chov bosqichi, II: skrotal bosqich"
  ],
  "togri": 1,
  "izoh": "Tushish ikki bosqichda: 1) Transabdominal faza (8–15 hafta) — gubernakulum va CSL (cranial suspensory ligament) ta'sirida; 2) Chov-skrotal faza (25–35 hafta) — androgen va CGRP ta'sirida."
 },
 {
  "savol": "Laparoskopiyada spermatik tomir va vas deferens skrotumga kirsa — bu nima ma'nosi?",
  "variantlar": [
   "Moyak qorin ichida — davom ettiriladi",
   "Moyak skrotumda yashiringan yoki atrofiyalangan — qo'shimcha aralashuv shart emas",
   "Fowler-Stephens usuli qo'llaniladi",
   "Blind-ending — moyak yo'q"
  ],
  "togri": 1,
  "izoh": "Spermatik tomir va vas deferens skrotumga kirsa — moyak skrotumda yashiringan (ektopik) yoki atrofiyalangan. Qo'shimcha laparoskopik aralashuv shart emas."
 },
 {
  "savol": "Kriptorxizmda ektopik moyak qayerda joylashishi mumkin?",
  "variantlar": [
   "Faqat chov kanalida",
   "Femoral, perineal, kontralateral skrotal — normal tushish yo'lidan tashqarida",
   "Faqat qorin bo'shlig'ida",
   "Faqat orqa qorin bo'shlig'ida"
  ],
  "togri": 1,
  "izoh": "Ektopik moyak normal tushish yo'lidan tashqarida joylashgan: femoral uchburchak, perineum, kontralateral skrotum yoki qorin oldi devori. Inguinal kanaldan o'tgan, ammo noto'g'ri yo'nalishga ketgan."
 },
 {
  "savol": "Kriptorxizmda moyak torsiyasi xavfi nima uchun yuqori?",
  "variantlar": [
   "Moyak kattaroq bo'ladi",
   "Normal kremasetrik va gubernakular fiksatsiya bo'lmagani uchun moyak erkin aylanishi mumkin",
   "Yuqori harorat torsiyaga olib keladi",
   "Kriptorxizm torsiya bilan bog'liq emas"
  ],
  "togri": 1,
  "izoh": "Kriptorxid moyakda normal fiksatsiya mexanizmlari etishmaydi — gubernakulum va kremasteric tolalар normal rivojlanmagan. Bu moyakni erkin aylanishga moyil qiladi va torsiya xavfini oshiradi."
 },
 {
  "savol": "Ikki tomonlama palpatsiyalanmaydigan kriptorxizmda gormonal baholash (FSH, LH, testosteron) nima uchun o'tkaziladi?",
  "variantlar": [
   "Operatsiya tayyorgarligini ko'rish uchun",
   "Ikki tomonlama anorxizmni va interseks holatlarni istisno qilish uchun",
   "Orxiopeksiya vaqtini aniqlash uchun",
   "Saraton xavfini baholash uchun"
  ],
  "togri": 1,
  "izoh": "Ikki tomonlama palpatsiyalanmaydigan moyakda gormonal baholash zarur — ikki tomonlama anorxizmni (moyaklar yo'q) va interseks holatlarni istisno qilish uchun. Inhibin B va AMH ham qo'shilishi mumkin."
 },
 {
  "savol": "Orxiopeksiyani o'z vaqtida o'tkazishning asosiy maqsadi nima?",
  "variantlar": [
   "Saraton xavfini to'liq yo'q qilish",
   "Germ hujayra yo'qolishini minimallashtirish va moyakni kuzatish imkonini berish",
   "Bepushtlikni to'liq davolash",
   "Gormonoterapiya samarasini oshirish"
  ],
  "togri": 1,
  "izoh": "Orxiopeksiyaning asosiy maqsadlari: 1) Germ hujayra yo'qolishini kamaytirish (erta operatsiya); 2) Moyakni palpatsiya va o'z-kuzatish uchun qulay holatga keltirish; 3) Torsiya xavfini kamaytirish."
 },
 {
  "savol": "Kriptorxizm uchun qaysi tekshiruv birinchi qatorda va diagnostik jihatdan eng muhim?",
  "variantlar": [
   "Ultratovush (UTT)",
   "Klinik ko'rik — palpatsiya",
   "KT skan",
   "MRT tekshiruvi"
  ],
  "togri": 1,
  "izoh": "Kriptorxizm tashxisida birinchi va asosiy tekshiruv — klinik ko'rik va palpatsiya. AUA rutina UTT ni tavsiya etmaydi — sezuvchanligi past. Palpatsiyalanmaydigan moyakda — laparoskopiya."
 },
 {
  "savol": "Gubernakulum kriptorxizmda qanday rol o'ynaydi?",
  "variantlar": [
   "Sperma ishlab chiqarishga yordam beradi",
   "Transabdominal faza davomida moyakni qorindan chov kanaliga yo'naltiradi",
   "Kremasteric refleksni boshqaradi",
   "Moyak venalarini tarang ushlab turadi"
  ],
  "togri": 1,
  "izoh": "Gubernakulum — moyakni transabdominal faza (8–15 hafta) davomida qorin bo'shlig'idan chov kanaliga yo'naltiruvchi to'qima. Rivojlanish anomaliyasi moyakning to'g'ri tushmasligiga olib keladi."
 },
 {
  "savol": "Retraktor moyak kuzatuv talab qilishining asosiy sababi nima?",
  "variantlar": [
   "U har doim o'z-o'zidan tuzaladi",
   "Balog'at yoshida 'ascending testis' (orttirilgan kriptorxizm) ga aylanish xavfi bor",
   "Saraton xavfi yuqori",
   "Bepushtlik xavfi juda yuqori"
  ],
  "togri": 1,
  "izoh": "Retraktor moyak kuzatuvga muhtoj — balog'at yoshida spermatik kanat qisqarishi sababli 'ascending testis' ga (orttirilgan kriptorxizmga) aylanishi mumkin. Yillik kuzatuv tavsiya etiladi."
 },
 {
  "savol": "Laparoskopik orxiopeksiyada qorin ichidagi moyak skrotumga tushurilishi uchun qanday texnika qo'llaniladi?",
  "variantlar": [
   "Moyak to'g'ridan-to'g'ri skrotumga tortiladi",
   "Fowler-Stephens — spermatik arteriya stagatsiya qilinib kollateral qon ta'minoti asosida moyak tushiriladi",
   "Faqat açiq jarrohlik usuli mumkin",
   "Bir bosqichda hech qachon mumkin emas"
  ],
  "togri": 1,
  "izoh": "Qorin ichidagi moyak uchun Fowler-Stephens usuli: spermatik arteriya band qilinib, moyak vas deferens atrofidagi kollateral qon ta'minoti asosida skrotumga tushiriladi. Bir yoki ikki bosqichda amalga oshiriladi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();

-- O'tkir moyak burilishi (torsiya) va o'tkir yorg'oq sindromi — shoshilinch belgilar (oson)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html, savollar_banki)
VALUES ('moyak-torsiyasi-asoslari', NULL, $dt_bank$[
 {
  "savol": "Moyak torsiyasi qanday ta'riflanadi?",
  "variantlar": [
   "Moyak yallig'lanishi",
   "Spermatik kanatning buralishi natijasida moyakka qon oqimi to'xtashi",
   "Moyak atrofida suyuqlik to'planishi",
   "Epididimis kistasining yorilishi"
  ],
  "togri": 1,
  "izoh": "Moyak torsiyasi — spermatik kanatning o'z o'qi atrofida buralishi natijasida moyakka qon oqimi to'xtab ishemiya va nekroz xavfi. Urologik shoshilinch holat."
 },
 {
  "savol": "'Time is testicle' iborasi nima ma'noni anglatadi?",
  "variantlar": [
   "Moyak torsiyasini kech aniqlash yaxshiroq",
   "Har o'tgan soat moyakni saqlab qolish imkoniyatini kamaytiradi — tezkor harakatlanish zarur",
   "Ultratovushni kutib jarrohlikni keyinga qo'yish to'g'ri",
   "Moyak torsiyasida vaqt muhim emas"
  ],
  "togri": 1,
  "izoh": "'Time is testicle' — torsiyada har o'tgan soat kritik. <6 soat: 90–100% saqlanish; 12 soat: ~50%; >24 soat: <10%. Klinik shubhada ultratovushni kutmasdan darhol jarrohlik ko'rik xonasiga."
 },
 {
  "savol": "Torsiyadan so'ng <6 soatda jarrohlik qilinsa moyakni saqlab qolish imkoniyati qancha?",
  "variantlar": [
   "~30%",
   "~50%",
   "90–100%",
   "~70%"
  ],
  "togri": 2,
  "izoh": "Torsiya muddati va saqlanish: <6 soat = 90–100%; 6–12 soat = ~50%; 12–24 soat = ~25%; >24 soat = <10%. Bu nisbatlar qanchalik tez harakat qilish zarurligini ko'rsatadi."
 },
 {
  "savol": "O'tkir yorg'oq sindromi sabablari orasida eng ko'p uchraydigan holat qaysi?",
  "variantlar": [
   "Moyak torsiyasi",
   "Appendiks testis torsiyasi",
   "Epididimoorxit",
   "Gidrosele"
  ],
  "togri": 1,
  "izoh": "Appendiks testis torsiyasi — o'tkir yorg'oq sindromi sabablarida eng ko'p uchraydigan. Lekin moyak torsiyasi — eng xavflisi. O'tkir skrotal og'riqda avval torsiya istisno qilinishi shart."
 },
 {
  "savol": "O'tkir skrotal og'riqda davolash tamoyili qanday?",
  "variantlar": [
   "Avval UTT, keyin jarrohlik",
   "Avval antibiotik, keyin kuzatuv",
   "Torsiya istisno qilinguncha shoshilinch holat — klinik shubhada ultratovushsiz darhol jarrohlik",
   "Avval paracetamol berish"
  ],
  "togri": 2,
  "izoh": "Oltin qoida: 'o'tkir skrotal og'riqda torsiya istisno qilinguncha shoshilinch holat'. Klinik shubha kuchli bo'lsa ultratovushni kutmasdan jarrohlik ko'rik xonasiga yo'naltirish. 'Time is testicle'."
 },
 {
  "savol": "Kremasteric reflex torsiyada qanday o'zgaradi?",
  "variantlar": [
   "Kuchayadi",
   "O'zgarmaydi",
   "Yo'qoladi — eng ishonchli klinik belgi",
   "Avval kuchayadi, keyin yo'qoladi"
  ],
  "togri": 2,
  "izoh": "Kremasteric reflex yo'qligi — torsiyaning eng ishonchli klinik belgisi. Son ichki yuzasini siqishda moyak ko'tarilmasa — refleks yo'q. Lekin reflex borligи torsiyani istisno qilmaydi."
 },
 {
  "savol": "Bell-clapper deformity nima va u torsiyaga qanday olib keladi?",
  "variantlar": [
   "Kremasteric mushak anomaliyasi",
   "Tunica vaginalining moyakni yuqoridan o'rab olishi — moyakni erkin aylanishiga sharoit yaratadi",
   "Spermatik kanatning qisqaligi",
   "Gubernakulumning etishmasligi"
  ],
  "togri": 1,
  "izoh": "Bell-clapper deformity — tunica vaginalis moyak va epididimisni o'rab, yuqori qutbdan biriktiradi. Bu moyakni skrotal 'qo'ng'iroq tokmog'i' kabi erkin aylanishiga sharoit yaratib torsiya xavfini oshiradi."
 },
 {
  "savol": "TWIST skori nima va u qanday ishlatiladi?",
  "variantlar": [
   "Sperma sifatini baholovchi skор",
   "Torsiya xavfini baholovchi klinik skор (maks. 7 ball) — 0 = past; 1–5 = o'rta (UTT); 6–7 = yuqori (darhol jarrohlik)",
   "Moyak o'smasini aniqlash skori",
   "Epididimoorxit tashxis skori"
  ],
  "togri": 1,
  "izoh": "TWIST (Testicular Workup for Ischemia and Suspected Torsion) — 7 balli klinik skор: 0 = past xavf (kuzatuv); 1–5 = o'rta xavf (Doppler UTT ko'rsatiladi); 6–7 = yuqori xavf (ultratovushsiz darhol jarrohlik)."
 },
 {
  "savol": "Moyak torsiyasi eng ko'p qaysi yosh guruhida uchraydi?",
  "variantlar": [
   "0–2 yosh (chaqaloqlar)",
   "12–18 yosh (o'smirlar)",
   "30–40 yosh",
   "60 yosh va katta"
  ],
  "togri": 1,
  "izoh": "Moyak torsiyasi eng ko'p o'smirlik davrida (12–18 yosh) uchraydi — bu yoshda skrotum o'sishi va gormonal o'zgarishlar bilan bog'liq. Ikkinchi cho'qqi — yangi tug'ilganlar (neonatal torsiya)."
 },
 {
  "savol": "Appendiks testis torsiyasida 'ko'k nuqta' (blue dot sign) belgisi nima?",
  "variantlar": [
   "Moyak nekrozining belgisi",
   "Teriga orqali nekrotik appendiksning ko'k-qora rangda ko'rinishi — erta davrda spetsifik belgi",
   "Venoz to'siqning belgisi",
   "Gidrosele belgisi"
  ],
  "togri": 1,
  "izoh": "'Ko'k nuqta' belgisi — appendiks testis torsiyasida teriga orqali nekrotik appendiks ko'k-qora rangda ko'rinishi. Erta davrda spetsifik, lekin kech davrda shish tufayli ko'rinmaydi."
 },
 {
  "savol": "Torsiyadan keyin operatsiyada nima qilinadi?",
  "variantlar": [
   "Faqat torsiyalangan moyak fiksatsiyalanadi",
   "Torsiyalangan moyak detorisiya qilinadi va ikki tomonda orxiopeksiya bajariladi",
   "Moyak olib tashlanadi",
   "Faqat antibiotik beriladi, operatsiya yo'q"
  ],
  "togri": 1,
  "izoh": "Jarrohlikda: 1) Torsiyalangan moyakni detorisiya qilish (qaytarish); 2) Viabiliteni baholash; 3) Saqlanishi mumkin bo'lsa ikki tomonda orxiopeksiya. Ikkinchi moyakni ham fiksatsiyalamaslik xato — uning ham anatomik predispozitsiyasi bor."
 },
 {
  "savol": "Qo'lda detorisiya (manual detorsion) qachon va qanday bajariladi?",
  "variantlar": [
   "Operatsiya o'rniga doimiy usul",
   "Operator uchun shifokor tomonidan, 'kitob ochish' yo'nalishida — vaqtincha qon oqimini tiklash uchun",
   "Faqat anesteziya ostida bajariladi",
   "Faqat appendiks torsiyasida"
  ],
  "togri": 1,
  "izoh": "Manual detorisiya — 'kitob ochish' yo'nalishida (tashqi tomonga): qon oqimini vaqtincha tiklash uchun jarrohlikka tayyorgarlik davomida bajarilishi mumkin. Lekin bu jarrohlik o'rnini BOSMASDI — darhol operatsiya zarur."
 },
 {
  "savol": "Prenatal neonatal torsiya va postnatal neonatal torsiyaning farqi nima?",
  "variantlar": [
   "Farqi yo'q — bir xil davolash",
   "Prenatal — ona qornida sodir bo'lgan, saqlanish deyarli nol; postnatal — tug'ilgandan keyin, ~44% saqlanish, shoshilinch jarrohlik kerak",
   "Prenatal — shoshilinch; postnatal — kuzatuv",
   "Ikkalasi ham konservativ davolanadi"
  ],
  "togri": 1,
  "izoh": "Prenatal torsiya — ona qornida sodir bo'lgan; tug'ilganda moyak qoraygan, qattiq, og'riqsiz. Saqlanish ehtimoli deyarli nol. Postnatal torsiya — tug'ilgandan keyin; eritem, shish, tenderness bor; ~44% saqlanish — shoshilinch jarrohlik."
 },
 {
  "savol": "Neonatal torsiyada kontralateral orxiopeksiya nima uchun bajariladi?",
  "variantlar": [
   "Torsiyalangan moyakni saqlab qolish uchun",
   "Ikkinchi moyakni asinxron (keyingi) torsiyadan himoya qilish uchun",
   "Gidrosele oldini olish uchun",
   "Qon oqimini tiklash uchun"
  ],
  "togri": 1,
  "izoh": "Neonatal torsiyada kontralateral orxiopeksiya ko'pincha shoshilinch tarzda bajariladi — ikkinchi moyakda ham anatomik predispozitsiya bo'lishi mumkin va asinxron torsiya xavfi bor. Pediatrik urologlarning 93% postnatal torsiyani shoshilinch hisoblaydi."
 },
 {
  "savol": "Moyak torsiyasi va epididimoorxitni farqlashda qaysi belgi muhim?",
  "variantlar": [
   "Og'riq joylashuvi",
   "Kremasteric reflex: torsiyada yo'q; epididimoorxitda odatda bor; isitma epididimoorxitga xos",
   "Yoshning ahamiyati yo'q",
   "UTT farqlashda ishlatilmaydi"
  ],
  "togri": 1,
  "izoh": "Farqlash: torsiyada kremasteric reflex yo'q, isitma odatda yo'q, to'satdan boshlanadi; epididimoorxitda kremasteric reflex bor, isitma, leykositoz, siyish shikoyatlari bo'lishi mumkin. Doppler UTT — qon oqimi torsiyada yo'q."
 },
 {
  "savol": "Appendiks testis torsiyasi epididimoorxitdan qanday farqlanadi?",
  "variantlar": [
   "Appendiks — katta yoshlilarda, epididimoorxit — bolalarda",
   "Appendiks — prepubertal, 'ko'k nuqta' belgisi, qon oqimi Dopplerde bor (giperemia); epididimoorxit — epididimis giperemi",
   "Farqi yo'q — bir xil davolash",
   "Appendiks — shoshilinch; epididimoorxit — emas"
  ],
  "togri": 1,
  "izoh": "Appendiks torsiyasi: prepubertal, og'riq epididimis yoki moyak qutbida, 'ko'k nuqta' belgisi, Doppler UTT da giperemia (torsiyadan farqli). Epididimoorxit: kattaroq yoshda, isitma, leykositoz, epididimis giperemi."
 },
 {
  "savol": "Doppler UTT torsiyada qanday natija ko'rsatadi?",
  "variantlar": [
   "Moyakda qon oqimi kuchaygan",
   "Torsiyalangan moyakda qon oqimi yo'q yoki sezilarli kamaygan",
   "Moyakda suyuqlik to'plangan",
   "Normal qon oqimi"
  ],
  "togri": 1,
  "izoh": "Doppler UTT torsiyada: torsiyalangan moyakda qon oqimi yo'q yoki sezilarli kamaygan. Appendiks torsiyasida esa giperemia (kuchaygan qon oqimi). Lekin klinik shubhada UTT ni kutmasdan jarrohlik."
 },
 {
  "savol": "O'tkir yorg'oq sindromi sabablarini xavf darajasiga ko'ra to'g'ri tartib qaysi?",
  "variantlar": [
   "Epididimoorxit > appendiks torsiya > moyak torsiyasi",
   "Moyak torsiyasi (eng xavfli) > appendiks torsiyasi (eng ko'p) > epididimoorxit",
   "Appendiks torsiyasi > moyak torsiyasi > epididimoorxit",
   "Barcha sabablar teng xavfli"
  ],
  "togri": 1,
  "izoh": "O'tkir yorg'oq sindromi: moyak torsiyasi — eng xavfli (tezkor harakatlanish zarur); appendiks testis torsiyasi — eng ko'p uchraydigan; epididimoorxit — keng tarqalgan, lekin torsiyadan farqlash zarur."
 },
 {
  "savol": "Torsiyadan so'ng moyak viabiliteni qanday baholashadi?",
  "variantlar": [
   "UTT bilan baholash",
   "Detorisiyadan keyin issiq sochiq o'rovda 5–10 daqiqa kutib rangi va qon oqimini kuzatish",
   "Gistologik tekshiruv",
   "Testosteron darajasi bilan"
  ],
  "togri": 1,
  "izoh": "Viabilite baholash: detorisiyadan keyin moyak issiq sochiq bilan o'rab 5–10 daqiqa kutiladi. Rang qaytib qon oqimi tiklanса — saqlanadi va orxiopeksiya qilinadi. Rangi qaytmasa, qoraygan bo'lsa — orxiektomiya."
 },
 {
  "savol": "Ekstravaginal torsiya nima va qayerda uchraydi?",
  "variantlar": [
   "Tunica vaginalis ichida buralish — katta yoshlilarda",
   "Tunica vaginalis tashqarisida buralish — yangi tug'ilganlarga xos (neonatal torsiya)",
   "Faqat qorin ichidagi moyakda",
   "Ikki tomonlama torsiya turi"
  ],
  "togri": 1,
  "izoh": "Ekstravaginal torsiya — tunica vaginalis tashqarisida, butun spermatik kanat bilan birga buralish. Yangi tug'ilganlarga (neonatal torsiya) xos. Sababi: tunica vaginalis hali skrotal to'qimaga mustahkam birikmaganligi."
 },
 {
  "savol": "Torsiyadan keyin moyak orxiektomiya qilinganda ikkinchi moyak orxiopeksiyalanishi kerakmi?",
  "variantlar": [
   "Yo'q — ikkinchi moyak normal bo'lsa teginilmaydi",
   "Ha — ikkinchi moyakda ham anatomik predispozitsiya bor, orxiopeksiya bajarilishi kerak",
   "Faqat katta yoshlilarda",
   "Faqat ikki tomonlama torsiyada"
  ],
  "togri": 1,
  "izoh": "Torsiyadan keyin ikkinchi moyakni fiksatsiyalamaslik xato. Bell-clapper deformity va predispozitsiya ikki tomonda bo'lishi mumkin. Orxiektomiya yoki orxiopeksiyadan qat'iy nazar — kontralateral moyakni ham orxiopeksiya qilish standart."
 },
 {
  "savol": "TWIST ballida qaysi belgilar baholanadi?",
  "variantlar": [
   "Faqat og'riq va isitma",
   "Shish, qattiqlik (induration), moyak yuqori joylashuvi, kremasteric reflex yo'qligi va to'satdan boshlanish",
   "Faqat ultratovush ma'lumotlari",
   "Faqat yosh va og'riq davomiyligi"
  ],
  "togri": 1,
  "izoh": "TWIST ballida: shish (+2), qattiqlik/induration (+2), moyak yuqori joylashuvi (+1), kremasteric reflex yo'qligi (+1), to'satdan boshlanish (+1). Maks. 7 ball. 6–7 = yuqori xavf → darhol jarrohlik."
 },
 {
  "savol": "Appendiks testis (appendix testis) nima?",
  "variantlar": [
   "Moyak ilova kanalchasi",
   "Moyakning rudimentar Myuller kanalidan qolgan ilovasi — buralishi mumkin va og'riq beradi",
   "Epididimis kisti",
   "Spermatik kanat qoldig'i"
  ],
  "togri": 1,
  "izoh": "Appendix testis — moyak yuqori qutbida joylashgan rudimentar Myuller kanalidan qolgan kichik ilova. Buralishi mumkin va o'tkir og'riq beradi. Eng ko'p uchraydigan o'tkir yorg'oq sindromi sababi."
 },
 {
  "savol": "Appendiks testis torsiyasi qanday davolanadi?",
  "variantlar": [
   "Darhol jarrohlik — shoshilinch holat",
   "Konservativ — NSAIDs, dam olish; og'riq 1–2 haftada o'tadi",
   "Antibiotik kursi",
   "Ultratovush bilan drenaj"
  ],
  "togri": 1,
  "izoh": "Appendiks testis torsiyasi konservativ davolanadi: NSAIDs (ibuprofen va h.k.), skrotumni ko'tarish, dam olish. Og'riq 5–14 kunda o'tadi. Jarrohlik kўrsatilmaydi — moyak xavf ostida emas."
 },
 {
  "savol": "Moyak torsiyasi qanday holatda konservativ davolanishi mumkin?",
  "variantlar": [
   "Hech qachon — har doim operatsiya kerak",
   "Faqat kichik bolalarda",
   "Faqat og'riq 24 soatdan ortiq bo'lsa",
   "Manual detorisiya muvaffaqiyatli bo'lsa ham keyin operatsiya zarur"
  ],
  "togri": 3,
  "izoh": "Moyak torsiyasi hech qachon konservativ davolanmaydi — har doim jarrohlik kerak. Manual detorisiya faqat vaqtincha chora — darhol keyin operatsiyaga borish zarur. Konservativ davolash orxiektomiyaga olib keladi."
 }
]$dt_bank$::jsonb)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html  = COALESCE(dars_tarkibi.nazariya_html, EXCLUDED.nazariya_html),
  savollar_banki = CASE WHEN jsonb_array_length(dars_tarkibi.savollar_banki) = 0
                        THEN EXCLUDED.savollar_banki ELSE dars_tarkibi.savollar_banki END,
  updated_at = now();
