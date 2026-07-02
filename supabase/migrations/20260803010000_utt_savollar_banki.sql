-- 4-dars: UTT (ultratovush) — 40 ta amaliy test savoli (shuffle 15)
UPDATE public.dars_tarkibi
SET savollar_banki = $savollar$[
  {
    "savol": "Ultratovush tekshiruvi (UTT) qanday chastotali tovush to'lqinlaridan foydalanadi?",
    "variantlar": ["20–200 Gts", "200–2000 Gts", "3.5–20 MGts", "100–500 MGts"],
    "togri": 2,
    "izoh": "UTT eshitish chegarasidan yuqori chastotali (3.5–20 MGts) tovush to'lqinlaridan foydalanadi."
  },
  {
    "savol": "UTT urologiyada nima uchun 'urologning stetoskopi' deb ataladi?",
    "variantlar": ["Juda qimmat texnologiya bo'lgani uchun", "Nurlanishsiz, arzon va real vaqtda natija bergani uchun", "Faqat prostata tekshirishda qo'llanilgani uchun", "Faqat shoshilinch holatlarda ishlatilgani uchun"],
    "togri": 1,
    "izoh": "UTT nurlanishsiz, arzon va real vaqtda natija beradigan usul bo'lib, urologiyada keng qo'llaniladi."
  },
  {
    "savol": "Ultratovush datchigi (transducer) qanday ikki vazifani bajaradi?",
    "variantlar": ["Qon bosimini o'lchash va haroratni aniqlash", "Tovush to'lqinini yuborish va qaytgan to'lqinni qabul qilish", "Nurlanish yuborish va tasvirni chop etish", "Qon oqimini to'xtatish va yo'naltirish"],
    "togri": 1,
    "izoh": "Datchik tovush to'lqinlarini to'qimaga yuboradi va qaytgan to'lqinni qabul qilib elektr signaliga aylantiradi."
  },
  {
    "savol": "Akustik empedans farqi katta bo'lganda (masalan, to'qima va tosh orasida) nima hosil bo'ladi?",
    "variantlar": ["Tasvir yo'qoladi", "Kuchli aks etish va akustik soya", "Tasvir rang-barang bo'ladi", "Datchik ishlamay qoladi"],
    "togri": 1,
    "izoh": "Akustik empedans farqi katta bo'lsa, kuchli aks etish va orqasida akustik soya (acoustic shadow) hosil bo'ladi."
  },
  {
    "savol": "Giperexogen tuzilmalar ultratovush tasvirida qanday ko'rinadi?",
    "variantlar": ["To'liq qora", "Qorong'iroq (to'q)", "Yorqin (oq)", "Ko'rinmaydi"],
    "togri": 2,
    "izoh": "Giperexogen (hyperechoic) tuzilmalar — yorqin ko'rinadi: suyak, yog', fastsiya."
  },
  {
    "savol": "Anexogen tuzilma nima?",
    "variantlar": ["Suyak kabi qattiq to'qima", "Signal aks etmaydigan, to'liq qora ko'rinadigan — suyuqlik", "Yog' to'qimasi", "Mushak to'qimasi"],
    "togri": 1,
    "izoh": "Anexogen (anechoic) — to'liq qora, signal aks etmaydigan: suyuqlik (siydik, kista)."
  },
  {
    "savol": "Angiomiolipoma ultratovushda odatda qanday ko'rinadi?",
    "variantlar": ["Anexogen", "Gipoexogen", "Giperexogen", "Izoexogen"],
    "togri": 2,
    "izoh": "Angiomiolipoma yog' to'qimasidan boy o'sma bo'lib, odatda giperexogen ko'rinishga ega."
  },
  {
    "savol": "Nima uchun faqat exogenlikka qarab buyrak o'simtasi haqida yakuniy xulosa chiqarib bo'lmaydi?",
    "variantlar": ["Chunki barcha o'simtalar bir xil exogenlikka ega", "Chunki ba'zi buyrak saratonlari ham giperexogen bo'lishi mumkin", "Chunki ultratovush o'simtani umuman ko'rsatmaydi", "Chunki faqat KT aniq ko'rsatadi"],
    "togri": 1,
    "izoh": "Ba'zi buyrak hujayrali saratonlari (RCC) ham giperexogen bo'lishi mumkin — qo'shimcha tekshiruvlar (Doppler, KT) zarur."
  },
  {
    "savol": "Rezolyutsiya va datchik chastotasi o'rtasidagi bog'liqlik qanday?",
    "variantlar": ["Chastota yuqori — rezolyutsiya past", "Chastota yuqori — rezolyutsiya yaxshi, lekin chuqurlik kamayadi", "Chastota past — rezolyutsiya yaxshi", "Bog'liqlik yo'q"],
    "togri": 1,
    "izoh": "Chastota qancha yuqori bo'lsa, rezolyutsiya shuncha yaxshi, lekin to'qimaga kirish chuqurligi kamayadi."
  },
  {
    "savol": "Buyrak ultratovushi uchun odatda qanday chastotali datchik ishlatiladi?",
    "variantlar": ["1–2 MGts", "3.5–5 MGts", "7–18 MGts", "29 MGts"],
    "togri": 1,
    "izoh": "Buyrak chuqur joylashgani uchun past chastotali (3.5–5 MGts) egilgan datchik qo'llaniladi."
  },
  {
    "savol": "Moshok (skrotum) ultratovushi uchun qanday chastotali datchik ishlatiladi?",
    "variantlar": ["1–3 MGts", "3.5–5 MGts", "7–18 MGts", "29 MGts"],
    "togri": 2,
    "izoh": "Moshok yuza joylashgani uchun yuqori chastotali (7–18 MGts) datchik bilan ajoyib aniqlikda tekshiriladi."
  },
  {
    "savol": "Mikroultratovush taxminan qanday chastotada ishlaydi?",
    "variantlar": ["5 MGts", "12 MGts", "~29 MGts", "50 MGts"],
    "togri": 2,
    "izoh": "Mikroultratovush taxminan 29 MGts chastotadan foydalanib, juda yuqori detal bilan tasvir beradi."
  },
  {
    "savol": "B-rejim (gray-scale B-mode) nimani ko'rsatadi?",
    "variantlar": ["Qon oqimi tezligini", "Real vaqtdagi 2D kulrang shkala tasvirni", "Faqat suyak tuzilishini", "3D hajmli tasvirni"],
    "togri": 1,
    "izoh": "B-rejim eng ko'p qo'llaniladigan, real vaqtdagi ikki o'lchovli tasvirni kulrang tuslarda ko'rsatadigan asosiy rejim."
  },
  {
    "savol": "Rangli Doppler nimani baholashda ishlatiladi?",
    "variantlar": ["To'qima zichligini", "Qon oqimi yo'nalishi va tezligini", "Suyak qalinligini", "Siydik pH darajasini"],
    "togri": 1,
    "izoh": "Rangli Doppler qon oqimi yo'nalishi va tezligini rang orqali ko'rsatadigan rejim."
  },
  {
    "savol": "Quvvat Doppleri rangli Dopplerdan nimasi bilan farq qiladi?",
    "variantlar": ["Arzonroq", "Qon oqimi yo'nalishini ko'rsatmaydi, lekin perfuziyaga 3–5 marta sezgirroq", "Faqat bolalarda ishlatiladi", "Faqat prostatada qo'llaniladi"],
    "togri": 1,
    "izoh": "Quvvat Doppleri yo'nalishni ko'rsatmasa-da, perfuziyaga ancha sezgir (3–5 marta) bo'lib, moyak torsiyasini aniqlashda qo'llaniladi."
  },
  {
    "savol": "Rezistiv indeks (RI) formulasi qanday?",
    "variantlar": ["RI = diastolik / sistolik", "RI = (sistolik − diastolik) / sistolik", "RI = sistolik + diastolik", "RI = sistolik × diastolik"],
    "togri": 1,
    "izoh": "RI = (sistolik tezlik − diastolik tezlik) / sistolik tezlik — periferik qarshilikni ifodalovchi ko'rsatkich."
  },
  {
    "savol": "Moyak burama (testicular torsion)da Doppler tekshiruvida qanday belgi xarakterli?",
    "variantlar": ["Kuchaygan qon oqimi", "Qon oqimining yo'qligi", "Normal qon oqimi", "Faqat venoz oqim ko'rinadi"],
    "togri": 1,
    "izoh": "Moyak buramaning asosiy belgisi — moyak ichidagi qon oqimining yo'qligi."
  },
  {
    "savol": "Klinik shubha kuchli, lekin ultratovushda moyak torsiyasi belgisi topilmasa nima qilish kerak?",
    "variantlar": ["Takroriy UTT 24 soatdan keyin", "Hech narsa qilmaslik", "Shoshilinch jarrohlik konsultatsiyasi", "Antibiotik boshlash"],
    "togri": 2,
    "izoh": "UTT torsiyani tasdiqlay yoki rad eta olmaydi — klinik shubha kuchli bo'lsa, shoshilinch jarrohlik konsultatsiyasi kechiktirilmasligi kerak."
  },
  {
    "savol": "Epididimit/orxitda Doppler tekshiruvida nima kuzatiladi?",
    "variantlar": ["Qon oqimi yo'qligi", "Kuchaygan qon oqimi (hiperemiya)", "Normal qon oqimi", "Akustik soya"],
    "togri": 1,
    "izoh": "Yallig'lanish natijasida qon oqimi kuchayadi (hiperemiya) — bu epididimit/orxit belgisi."
  },
  {
    "savol": "Buyrak ultratovushida gidronefroz nima?",
    "variantlar": ["Buyrak toshining yorilishi", "Buyrak jomi va kosachalarining kengayishi", "Buyrak hajmining kichrayishi", "Buyrak parenximasining qalinlashishi"],
    "togri": 1,
    "izoh": "Gidronefroz — buyrak jomi va kosachalarining siydik to'planishi natijasida kengayishi."
  },
  {
    "savol": "Bolalar urologiyasida siydik yo'li kengayishini baholash uchun qaysi tasnif tizimi qo'llaniladi?",
    "variantlar": ["TNM tasnifi", "Gleason shkala", "UTD (Urinary Tract Dilation) tasnifi", "RIFLE tasnifi"],
    "togri": 2,
    "izoh": "UTD tasnifi buyrak jomi APD, kosachalar kengayishi, parenxima qalinligi asosida xavf darajasini aniqlaydi."
  },
  {
    "savol": "UTD tasnifida P1 (past xavf) darajasida APD qancha?",
    "variantlar": ["<5 mm", "<10 mm", "≥10 mm", "≥15 mm"],
    "togri": 1,
    "izoh": "P1 (past xavf) — APD <10 mm, kosachalar kengaymagan, ko'p hollarda o'z-o'zidan tuzaladi."
  },
  {
    "savol": "UTD tasnifida P3 (yuqori xavf) darajasida qanday qo'shimcha belgilar mavjud?",
    "variantlar": ["Faqat APD <10 mm", "APD ≥15 mm, parenxima yupqalashishi, siydik yo'li/qovuq anomaliyasi", "Faqat bir tomonlama gidronefroz", "Normal buyrak tuzilishi"],
    "togri": 1,
    "izoh": "P3 — APD ≥15 mm, parenxima yupqalashishi, siydik yo'li/qovuq anomaliyasi — to'liq tekshiruv va jarrohlik zarur bo'lishi mumkin."
  },
  {
    "savol": "Qovuq ultratovushi eng yaxshi natija berishi uchun qovuq qanday holatda bo'lishi kerak?",
    "variantlar": ["Bo'sh", "To'liq (to'ldirilgan)", "Yarim to'liq", "Farqi yo'q"],
    "togri": 1,
    "izoh": "Transabdominal qovuq ultratovushi qovuqni to'liq holatda eng yaxshi ko'rsatadi."
  },
  {
    "savol": "PVR (postvoid residual) nima?",
    "variantlar": ["Prostata hajmi", "Siydik chiqargandan keyin qovuqda qolgan siydik hajmi", "Buyrak filtratsiya tezligi", "Siydik yo'li diametri"],
    "togri": 1,
    "izoh": "PVR — siydik chiqargandan keyin qovuqda qolgan siydik hajmi, siydik chiqarish buzilishini baholashda muhim."
  },
  {
    "savol": "Qovuq devorining qalinlashishi va trabekulali ko'rinishi nimaning bilvosita belgisi?",
    "variantlar": ["Buyrak toshi", "Qovuq bo'yni to'siqlanishi (masalan, BPH)", "Siydik yo'li infeksiyasi", "Buyrak yetishmovchiligi"],
    "togri": 1,
    "izoh": "Qalinlashgan, traberkulali devor qovuq bo'yni to'siqlanishi (masalan, BPH sababli) bilvosita belgisi."
  },
  {
    "savol": "'Ureteral jet' nima va u nimani tasdiqlaydi?",
    "variantlar": ["Qon oqimini ko'rsatadi", "Siydik yo'lidan qovuqqa kiruvchi siydik oqimi — to'siqlanish yo'qligini tasdiqlaydi", "Prostata sekretsiyasini ko'rsatadi", "Buyrak arteriyasi oqimini ifodalaydi"],
    "togri": 1,
    "izoh": "Ureteral jet — siydik yo'li teshigidan qovuqqa kiruvchi siydik oqimi, siydik yo'li to'siqlanishi yo'qligini bilvosita tasdiqlaydi."
  },
  {
    "savol": "Avtomatlashtirilgan qovuq skaneri (bladder scanner) to'liq diagnostik UTT o'rnini bosa oladimi?",
    "variantlar": ["Ha, to'liq o'rnini bosadi", "Yo'q, u faqat hajmni hisoblovchi yordamchi vosita", "Ha, lekin faqat erkaklarda", "Ha, lekin faqat bolalarda"],
    "togri": 1,
    "izoh": "Bladder scanner faqat hajmni hisoblovchi vosita bo'lib, to'liq diagnostik ultratovush tekshiruvi o'rnini bosa olmaydi."
  },
  {
    "savol": "TRUS nima?",
    "variantlar": ["Transabdominal ultratovush", "Transrektal ultratovush — prostatani to'g'ri ichak orqali tekshirish", "Transvaginal ultratovush", "Transuretral ultratovush"],
    "togri": 1,
    "izoh": "TRUS (transrectal ultrasound) — prostatani to'g'ri ichak orqali yuqori aniqlikda tekshirish usuli."
  },
  {
    "savol": "Prostata hajmini hisoblash formulasida qaysi koeffitsient ishlatiladi?",
    "variantlar": ["0.123", "0.523", "1.000", "3.14"],
    "togri": 1,
    "izoh": "Prostata hajmi (ml) = kenglik × balandlik × uzunlik × 0.523 (ellipsoid formula)."
  },
  {
    "savol": "Mikroultratovush an'anaviy qaysi tekshiruv bilan taqqoslanadigan natija ko'rsatadi?",
    "variantlar": ["Rentgen", "KT", "MRI", "PET"],
    "togri": 2,
    "izoh": "Mikroultratovush prostata ichidagi kichik o'simtalarni aniqlashda an'anaviy MRI bilan taqqoslanadigan natija ko'rsatadi."
  },
  {
    "savol": "Ultratovushning eng muhim afzalligi nima?",
    "variantlar": ["Eng arzon tekshiruv", "Ionlashtiruvchi nurlanish yo'q", "Eng aniq tekshiruv", "Faqat bitta a'zoni tekshiradi"],
    "togri": 1,
    "izoh": "Ionlashtiruvchi nurlanish yo'qligi — bolalar va homilador ayollarda xavfsiz qo'llanishni ta'minlaydi."
  },
  {
    "savol": "UTT natijasi nimaga juda bog'liq bo'lgani uchun 'operator-dependent' deyiladi?",
    "variantlar": ["Datchik narxiga", "Tekshiruvchi shifokor malakasiga", "Bemorning yoshiga", "Xona haroratiga"],
    "togri": 1,
    "izoh": "UTT natijasi tekshiruvchi (operator) malakasiga juda bog'liq — bu usulning asosiy cheklovlaridan biri."
  },
  {
    "savol": "Qaysi holatlarda UTT tasvir sifati pasayadi?",
    "variantlar": ["Bemor yosh bo'lganda", "Semizlik yoki gaz to'planishida", "Qovuq to'liq bo'lganda", "Bemor yotgan holatda"],
    "togri": 1,
    "izoh": "Semizlik yoki gaz to'planishi tasvirni qiyinlashtiradi — suyak va havo orqali ham tasvir sifati pasayadi."
  },
  {
    "savol": "ALARA tamoyili nima?",
    "variantlar": ["Eng yuqori chastotada tekshirish", "Bemorga berilgan energiyani imkon qadar kamaytirish", "Eng uzoq vaqt tekshirish", "Faqat bolalarda qo'llaniladigan qoida"],
    "togri": 1,
    "izoh": "ALARA (As Low As Reasonably Achievable) — bemorga berilgan umumiy energiyani imkon qadar kamaytirish tamoyili."
  },
  {
    "savol": "Mexanik indeks va termal indeks nimani ifodalaydi?",
    "variantlar": ["Qat'iy xavfsizlik chegaralari", "Nisbiy xavf ko'rsatkichlari", "Tasvir aniqligi ko'rsatkichlari", "Datchik sifati ko'rsatkichlari"],
    "togri": 1,
    "izoh": "Bular qat'iy xavfsizlik chegaralari emas, balki nisbiy xavf ko'rsatkichlaridir."
  },
  {
    "savol": "Buyrak ultratovushida bemor odatda qaysi holatda tekshiriladi?",
    "variantlar": ["Tik turgan holatda", "Orqasidan yoki yon tomonidan (flank)", "Qorin ustidan yotgan holatda", "O'tirgan holatda"],
    "togri": 1,
    "izoh": "Buyrak ultratovushi odatda bemor orqasidan yoki yon tomonidan (flank) o'tkaziladi."
  },
  {
    "savol": "Moshok ultratovushida ortiqcha bosim nima uchun qo'llanilmasligi kerak?",
    "variantlar": ["Datchik buzilib qoladi", "Moyak shaklini va exogenligini o'zgartirishi mumkin", "Bemor og'riq sezmaydi", "Tasvir sifatiga ta'sir qilmaydi"],
    "togri": 1,
    "izoh": "Ortiqcha bosim moyak shaklini va exogenligini o'zgartirishi mumkin — yengil, ammo to'liq kontakt saqlanishi muhim."
  },
  {
    "savol": "1963-yilda prostatani ultratovush bilan birinchi tekshirishga uringan yapon urologlari kim?",
    "variantlar": ["Vatanabe va Tanaka", "Takahashi va Ouchi", "Suzuki va Yamamoto", "Honda va Matsuda"],
    "togri": 1,
    "izoh": "1963-yilda Takahashi va Ouchi prostatani ultratovush yordamida birinchi marta tekshirishga urinishgan."
  }
]$savollar$
WHERE dars_slug = 'utt-asosiy-tekshiruv';
