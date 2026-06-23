-- Admin panel: foydalanuvchilarni boshqarish (faollik holati + admin yangilash huquqi)
ALTER TABLE public.profiles
  ADD COLUMN faol boolean NOT NULL DEFAULT true;

CREATE POLICY "Admin profillarni yangilaydi"
ON public.profiles FOR UPDATE
USING (public.is_admin());

-- Admin kutubxona fayllarini ham o'chira oladi (storage darajasida)
CREATE POLICY "Admin kutubxonadan istalgan faylni o'chiradi"
ON storage.objects FOR DELETE
USING (bucket_id = 'kutubxona' AND public.is_admin());

-- Protokollarni bazaga ko'chirish (admin panel orqali boshqarish uchun)
CREATE TABLE public.protokollar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  nom         text NOT NULL,
  toifa       text NOT NULL,
  qisqa       text NOT NULL,
  korsatma    text NOT NULL,
  tashxis     text[] NOT NULL DEFAULT '{}',
  davolash    text[] NOT NULL DEFAULT '{}',
  manba       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.protokollar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hamma protokollarni ko'radi"
ON public.protokollar FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin protokol qo'shadi"
ON public.protokollar FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admin protokolni yangilaydi"
ON public.protokollar FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admin protokolni o'chiradi"
ON public.protokollar FOR DELETE
USING (public.is_admin());

INSERT INTO public.protokollar (slug, nom, toifa, qisqa, korsatma, tashxis, davolash, manba) VALUES
('varikotsele', 'Varikotsele', 'Andrologiya',
 'Urug''don venalarining patologik kengayishi — erkak bepushtligining eng ko''p uchraydigan tuzatiluvchi sababi.',
 'Spermogramma yomonlashgan bepushtlik, urug''don hajmi kichrayishi (o''smirlarda), og''riq, katta simptomatik varikotsele.',
 ARRAY[
   'Fizik ko''rik (Valsalva sinamasi bilan), Dubin–Amelar bo''yicha daraja aniqlash',
   'Skrotal Doppler USI — vena diametri va reflux tasdiqlash',
   'Spermogramma (WHO 2021 me''zonlari) — kamida 2 marta, 2-4 hafta orasida',
   'Gormonal panel (testosteron, FSH, LH) — ayniqsa gipogonadizm shubhasida'
 ],
 ARRAY[
   'I daraja, simptomsiz, spermogramma me''zonida — dinamik kuzatuv',
   'Bepushtlik/og''riq/gipotrofiya bilan birga II-III daraja — jarrohlik davolash ko''rsatilgan',
   'Mikrojarrohlik subingvinal (Marmar) — eng past retsidiv (1-2%) va gidrotsele (0-1%) darajasi, oltin standart',
   'Laparoskopik — ikki tomonlama holatlarda bitta yondashuv afzalligi',
   'Skleroterapiya/Palomo/Ivanissevich — mikrojarrohlik imkoni bo''lmaganda alternativ'
 ],
 'EAU Guidelines on Sexual and Reproductive Health (Male Infertility)'),

('bph', 'Benign prostata giperplaziyasi (BPH)', 'Urologiya',
 'Prostata bezining yoshga bog''liq benign kattalashishi, pastki siydik yo''llari simptomlariga (PSYS) olib keladi.',
 'O''rta-og''ir PSYS (IPSS>=8), siydik tutilishi, retsidivlanuvchi infeksiya, gematuriya, buyrak funksiyasi buzilishi.',
 ARRAY[
   'IPSS (xalqaro prostata simptomlari indeksi) so''rovnomasi',
   'Rektal raqamli tekshiruv (DRE) va PSA (saraton xavfini istisno qilish uchun)',
   'Siydik tahlili, uroflowmetriya (Qmax), qoldiq siydik hajmi (USI)',
   'Prostata hajmi — transrektal USI (TRUS) zarur bo''lganda'
 ],
 ARRAY[
   'Yengil simptomlar (IPSS<8) — dinamik kuzatuv, hayot tarzi tuzatishlari',
   'Alfa-blokatorlar (tamsulozin va h.k.) — tez simptomatik yengillik',
   '5-alfa-reduktaza inhibitorlari — katta prostata (>40ml) hajmida, uzoq muddatli',
   'Kombinatsiyalangan davolash — og''ir simptomlar yoki katta hajmda',
   'Jarrohlik (TURP, lazer enukleatsiya/vaporizatsiya) — dori-darmonga javob bermaganda yoki asoratlarda'
 ],
 'EAU Guidelines on Management of Non-Neurogenic Male LUTS'),

('prostatit', 'Prostatit', 'Urologiya',
 'Prostata bezining yallig''lanishi — o''tkir bakterial, surunkali bakterial yoki surunkali tos og''rig'' sindromi (CPPS) shaklida bo''ladi.',
 'Tos sohasidagi og''riq, siyish buzilishlari, ba''zan isitma (o''tkir holatda) — kamida 3 oy davom etsa surunkali deb hisoblanadi.',
 ARRAY[
   'Anamnez va simptomlar (NIH-CPSI so''rovnomasi)',
   'Siydik tahlili va bakposevi, jinsiy yo''l bilan yuqadigan infeksiyalarni istisno qilish',
   'DRE — o''tkir holatda ehtiyotkorlik bilan (massaj qilish mumkin emas)',
   'Prostata sekretini/siydikni tekshirish (4-stakan sinamasi) — surunkali holatda'
 ],
 ARRAY[
   'O''tkir bakterial — fluorxinolon yoki trimetoprim-sulfametoksazol, 2-4 hafta antibiotik',
   'Surunkali bakterial — antibiotik 4-6 hafta, alfa-blokatorlar bilan birga',
   'CPPS (bakterial bo''lmagan) — alfa-blokatorlar, og''riqni boshqarish, fizioterapiya, psixologik qo''llab-quvvatlash',
   'Antibiotikka javob bo''lmasa — qayta baholash, surunkali og''riq protokoliga o''tish'
 ],
 'EAU Guidelines on Urological Infections'),

('urolitiaz', 'Siydik-tosh kasalligi (Urolitiaz)', 'Urologiya',
 'Siydik yo''llarida tosh hosil bo''lishi — kolikasimon og''riq bilan namoyon bo''ladigan eng ko''p uchraydigan urologik holatlardan biri.',
 'O''tkir bel/qorin og''rig''i (buyrak kolikasi), gematuriya, infeksiya belgilari, siydik oqimi to''siqi.',
 ARRAY[
   'Past dozali KT (qorin/chanoq) — oltin standart tashxis usuli',
   'USI — homiladorlikda yoki nurlanishni cheklash kerak bo''lganda birinchi qadam',
   'Siydik tahlili (gematuriya, infeksiya), qon kreatinin/elektrolitlar',
   'Tosh tarkibini tahlil qilish (chiqgan tosh bo''lsa) — metabolik sabablarni aniqlash uchun'
 ],
 ARRAY[
   '<10mm tosh, og''riq nazorat qilinadigan — konservativ kuzatuv (MET — alfa-blokator bilan chiqishni tezlashtirish)',
   'Og''ir og''riq, infeksiya, to''siq — shoshilinch dekompressiya (stent yoki nefrostomiya)',
   'ESWL (zarba to''lqini bilan parchalash) — kichik-o''rta tosh, qulay joylashganda',
   'Ureteroskopiya (URS) — ureter toshlari uchun birinchi tanlov ko''pincha',
   'PCNL (perkutan nefrolitotomiya) — katta (>20mm) buyrak toshlari',
   'Metabolik tekshiruv va profilaktika — retsidivni kamaytirish uchun suyuqlik/diyeta tavsiyalari'
 ],
 'EAU Guidelines on Urolithiasis'),

('erektil-disfunksiya', 'Erektil disfunksiya', 'Andrologiya',
 'Jinsiy aloqa uchun yetarli ereksiyaga erishish yoki uni saqlab turishning doimiy qiyinligi.',
 '>=3 oy davom etgan ereksiya muammosi; yurak-qon tomir xavf omillarini baholash muhim (ED ko''pincha erta belgi).',
 ARRAY[
   'Anamnez (IIEF so''rovnomasi), psixogen/organik sabablarni farqlash',
   'Testosteron, qon glyukozasi/HbA1c, lipid profili — metabolik sabablarni istisno qilish',
   'Yurak-qon tomir xavfini baholash (ED — erta kardiovaskulyar belgi bo''lishi mumkin)',
   'Penil doppler USI — vaskulyar sababdan shubhalanilganda'
 ],
 ARRAY[
   'Hayot tarzi tuzatishlari (vazn, jismoniy faollik, chekishni tashlash) — birinchi qadam',
   'PDE5 inhibitorlari (sildenafil va h.k.) — birinchi qatordagi dori davolash',
   'Testosteron almashtirish — tasdiqlangan gipogonadizmda',
   'Vakuum qurilmalar, intrakavernoz in''ektsiyalar — dori-darmon samarasiz bo''lganda',
   'Penil protez implantatsiyasi — refrakter holatlarda'
 ],
 'EAU Guidelines on Sexual and Reproductive Health (Erectile Dysfunction)'),

('gidrosele', 'Gidrosele', 'Andrologiya',
 'Tunika vaginalis ichida suyuqlik to''planishi, moshonka kattalashishiga olib keladi.',
 'Simptomatik (og''riq, noqulaylik, kattalashish) gidrosele yoki tashxisni murakkablashtiruvchi katta hajm.',
 ARRAY[
   'Fizik ko''rik — transilluminatsiya musbat (suyuqlik belgisi)',
   'Skrotal USI — tuxumdon patologiyasini (o''sma, varikotsele) istisno qilish uchun majburiy',
   'Ikkilamchi sabablarni qidirish (infeksiya, travma, o''sma)'
 ],
 ARRAY[
   'Kichik, simptomsiz — kuzatuv',
   'Simptomatik kattalashgan — jarrohlik (gidrosellektomiya) asosiy davolash usuli',
   'Aspiratsiya/skleroterapiya — jarrohlikka nomzod bo''lmagan bemorlarda muqobil, retsidiv darajasi yuqoriroq'
 ],
 'EAU Guidelines on Paediatric Urology / general andrology references'),

('epididimit-orxit', 'Epididimit / Orxit', 'Andrologiya',
 'Epididim va/yoki tuxumdonning o''tkir yallig''lanishi, ko''pincha infeksion sabab bilan.',
 'O''tkir moshonka og''rig''i va shishi — testikulyar torsiyani shoshilinch istisno qilish kerak.',
 ARRAY[
   'Shoshilinch: testikulyar torsiyani istisno qilish (Doppler USI, kremaster refleksi)',
   'Siydik tahlili va bakposevi, jinsiy yo''l infeksiyalari skriningi (yosh faol erkaklarda)',
   'Skrotal Doppler USI — qon oqimi (epididimitda kuchaygan, torsiyada pasaygan)'
 ],
 ARRAY[
   'Jinsiy yo''l infeksiyasiga bog''liq (yosh) — ceftriakson + doksitsiklin/azitromisin',
   'Siydik yo''li infeksiyasiga bog''liq (keksa) — fluorxinolon',
   'Simptomatik: dam olish, moshonkani ko''tarib turish, og''riqsizlantirish, sovuq kompres',
   'Abssess yoki javob bo''lmasa — jarrohlik konsultatsiyasi'
 ],
 'EAU Guidelines on Urological Infections'),

('erkak-bepushtligi', 'Erkak faktori bepushtlik', 'Andrologiya',
 'Juftlikning 12 oylik himoyalanmagan jinsiy aloqadan keyin homiladorlikka erisha olmasligida erkak faktorini baholash.',
 '1 yildan ortiq bepushtlik (yoki ayol faktori bilan bog''liq omillar bo''lsa ertaroq), spermogramma anomaliyasi.',
 ARRAY[
   'Spermogramma (WHO 2021) — kamida 2 marta, 2-4 hafta orasida',
   'Gormonal panel: testosteron, FSH, LH, prolaktin',
   'Skrotal USI — varikotsele, obstruksiya belgilarini aniqlash',
   'Genetik tekshiruv (karyotip, Y-mikrodeletsiya) — og''ir oligo/azoospermiyada'
 ],
 ARRAY[
   'Varikotsele aniqlansa — mikrojarrohlik varikotselektomiya (spermogramma/homiladorlik natijalarini yaxshilaydi)',
   'Gormonal sabab (gipogonadotrop gipogonadizm) — gormonal davolash',
   'Obstruktiv azoospermiya — jarrohlik korreksiyasi yoki sperma olish + IVF/ICSI',
   'Idiopatik holatlar — antioksidantlar (ma''lumotlar cheklangan), yordamchi reproduktiv texnologiyalar'
 ],
 'EAU Guidelines on Sexual and Reproductive Health (Male Infertility)');
