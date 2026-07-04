-- 4-dars: UTT (ultratovush) — 40 ta amaliy test savoli (shuffle 15)
-- Variantlar uzunligi muvozanatlangan (uzunlik teli yo'q).
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
    "variantlar": ["Juda qimmat va murakkab texnologiya bo'lgani uchun", "Nurlanishsiz, arzon va real vaqtda natija bergani uchun", "Faqat prostatani tekshirishda qo'llanilishi uchun", "Faqat shoshilinch holatlarda ishlatilishi uchun"],
    "togri": 1,
    "izoh": "UTT nurlanishsiz, arzon va real vaqtda natija beradigan usul bo'lib, urologiyada keng qo'llaniladi."
  },
  {
    "savol": "Ultratovush datchigi (transducer) qanday ikki vazifani bajaradi?",
    "variantlar": ["Qon bosimini o'lchash va tana haroratini aniqlash", "Tovush to'lqinini yuborish va qaytgan to'lqinni qabul qilish", "Ionlashtiruvchi nurlanish yuborish va tasvirni chop etish", "To'qimadagi qon oqimini to'xtatish va uni yo'naltirish"],
    "togri": 1,
    "izoh": "Datchik tovush to'lqinlarini to'qimaga yuboradi va qaytgan to'lqinni qabul qilib elektr signaliga aylantiradi."
  },
  {
    "savol": "Akustik empedans farqi katta bo'lganda (masalan, to'qima va tosh orasida) nima hosil bo'ladi?",
    "variantlar": ["Tasvir butunlay yo'qolib, ekran qorayib qoladi", "Kuchli aks etish va orqasida akustik soya hosil bo'ladi", "Tasvir rang-barang tovlanib turadigan holatga keladi", "Datchik signal bermay butunlay ishlamay qoladi"],
    "togri": 1,
    "izoh": "Akustik empedans farqi katta bo'lsa, kuchli aks etish va orqasida akustik soya (acoustic shadow) hosil bo'ladi."
  },
  {
    "savol": "Giperexogen tuzilmalar ultratovush tasvirida qanday ko'rinadi?",
    "variantlar": ["Butunlay qora (signalsiz)", "Qorong'iroq, to'q kulrang", "Yorqin, oq rangda", "Umuman ko'rinmaydi"],
    "togri": 2,
    "izoh": "Giperexogen (hyperechoic) tuzilmalar — yorqin ko'rinadi: suyak, yog', fastsiya."
  },
  {
    "savol": "Anexogen tuzilma nima?",
    "variantlar": ["Suyak kabi qattiq va zich to'qima tuzilmasi", "Signal aks etmaydigan, to'liq qora — suyuqlik", "Yog' to'qimasidan iborat yumshoq tuzilma", "Mushak to'qimasidan iborat zich tuzilma"],
    "togri": 1,
    "izoh": "Anexogen (anechoic) — to'liq qora, signal aks etmaydigan: suyuqlik (siydik, kista)."
  },
  {
    "savol": "Angiomiolipoma ultratovushda odatda qanday ko'rinadi?",
    "variantlar": ["Anexogen (qora)", "Gipoexogen (to'q)", "Giperexogen (yorqin)", "Izoexogen (bir xil)"],
    "togri": 2,
    "izoh": "Angiomiolipoma yog' to'qimasidan boy o'sma bo'lib, odatda giperexogen ko'rinishga ega."
  },
  {
    "savol": "Nima uchun faqat exogenlikka qarab buyrak o'simtasi haqida yakuniy xulosa chiqarib bo'lmaydi?",
    "variantlar": ["Chunki barcha o'simtalar bir xil exogenlikka ega bo'ladi", "Chunki ba'zi buyrak saratonlari ham giperexogen bo'lishi mumkin", "Chunki ultratovush o'simtalarni umuman ko'rsata olmaydi", "Chunki faqat kompyuter tomografiya aniq ko'rsatib beradi"],
    "togri": 1,
    "izoh": "Ba'zi buyrak hujayrali saratonlari (RCC) ham giperexogen bo'lishi mumkin — qo'shimcha tekshiruvlar (Doppler, KT) zarur."
  },
  {
    "savol": "Rezolyutsiya va datchik chastotasi o'rtasidagi bog'liqlik qanday?",
    "variantlar": ["Chastota yuqori bo'lsa rezolyutsiya pasayib ketadi", "Chastota yuqori — rezolyutsiya yaxshi, chuqurlik kamayadi", "Chastota past bo'lsa rezolyutsiya yaxshilanib boradi", "Ular o'rtasida hech qanday bog'liqlik mavjud emas"],
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
    "variantlar": ["Real vaqtdagi 2D kulrang shkala tasvirni ko'rsatadi", "To'qimalardagi qon oqimi tezligini rang bilan ko'rsatadi", "Faqat suyak va zich tuzilmalar konturini ko'rsatadi", "Hajmli uch o'lchovli (3D) rekonstruksiyani ko'rsatadi"],
    "togri": 0,
    "izoh": "B-rejim eng ko'p qo'llaniladigan, real vaqtdagi ikki o'lchovli tasvirni kulrang tuslarda ko'rsatadigan asosiy rejim."
  },
  {
    "savol": "Rangli Doppler nimani baholashda ishlatiladi?",
    "variantlar": ["To'qimalarning zichligi va tuzilishini baholashda", "Qon oqimining yo'nalishi va tezligini baholashda", "Suyak to'qimasi qalinligini o'lchab baholashda", "Siydik muhitining pH darajasini baholashda"],
    "togri": 1,
    "izoh": "Rangli Doppler qon oqimi yo'nalishi va tezligini rang orqali ko'rsatadigan rejim."
  },
  {
    "savol": "Quvvat Doppleri rangli Dopplerdan nimasi bilan farq qiladi?",
    "variantlar": ["An'anaviy Dopplerga qaraganda ancha arzonroq bo'ladi", "Yo'nalishni ko'rsatmaydi, ammo perfuziyaga 3–5 barobar sezgir", "Faqat go'dak va o'smir bolalar tekshiruvida qo'llaniladi", "Faqat prostata bezini tekshirishda qo'llaniladigan usul"],
    "togri": 1,
    "izoh": "Quvvat Doppleri yo'nalishni ko'rsatmasa-da, perfuziyaga ancha sezgir (3–5 marta) bo'lib, moyak torsiyasini aniqlashda qo'llaniladi."
  },
  {
    "savol": "Rezistiv indeks (RI) formulasi qanday?",
    "variantlar": ["RI = diastolik / sistolik tezlik", "RI = (sistolik − diastolik) / sistolik", "RI = sistolik + diastolik tezlik", "RI = sistolik × diastolik tezlik"],
    "togri": 1,
    "izoh": "RI = (sistolik tezlik − diastolik tezlik) / sistolik tezlik — periferik qarshilikni ifodalovchi ko'rsatkich."
  },
  {
    "savol": "Moyak burama (testicular torsion)da Doppler tekshiruvida qanday belgi xarakterli?",
    "variantlar": ["Sezilarli kuchaygan qon oqimi", "Qon oqimining butunlay yo'qligi", "O'zgarishsiz normal qon oqimi", "Faqat venoz qon oqimi ko'rinishi"],
    "togri": 1,
    "izoh": "Moyak buramaning asosiy belgisi — moyak ichidagi qon oqimining yo'qligi."
  },
  {
    "savol": "Klinik shubha kuchli, lekin ultratovushda moyak torsiyasi belgisi topilmasa nima qilish kerak?",
    "variantlar": ["Takroriy UTT ni 24 soatdan keyin qaytadan o'tkazish", "Hech qanday chora ko'rmasdan bemorni kuzatib turish", "Shoshilinch jarrohlik konsultatsiyasiga yuborish", "Empirik keng spektrli antibiotik terapiyani boshlash"],
    "togri": 2,
    "izoh": "UTT torsiyani tasdiqlay yoki rad eta olmaydi — klinik shubha kuchli bo'lsa, shoshilinch jarrohlik konsultatsiyasi kechiktirilmasligi kerak."
  },
  {
    "savol": "Epididimit/orxitda Doppler tekshiruvida nima kuzatiladi?",
    "variantlar": ["Qon oqimining butunlay yo'qligi", "Kuchaygan qon oqimi (hiperemiya)", "O'zgarishsiz normal qon oqimi", "Toshdan orqadagi akustik soya"],
    "togri": 1,
    "izoh": "Yallig'lanish natijasida qon oqimi kuchayadi (hiperemiya) — bu epididimit/orxit belgisi."
  },
  {
    "savol": "Buyrak ultratovushida gidronefroz nima?",
    "variantlar": ["Buyrak toshining yorilib parchalanishi holati", "Buyrak jomi va kosachalarining kengayishi", "Buyrakning umumiy hajmi kichrayib qolishi", "Buyrak parenximasining qalinlashib ketishi"],
    "togri": 1,
    "izoh": "Gidronefroz — buyrak jomi va kosachalarining siydik to'planishi natijasida kengayishi."
  },
  {
    "savol": "Bolalar urologiyasida siydik yo'li kengayishini baholash uchun qaysi tasnif tizimi qo'llaniladi?",
    "variantlar": ["TNM tasnifi (o'sma bosqichlari)", "Gleason shkala (prostata bezi)", "UTD (Urinary Tract Dilation) tasnifi", "RIFLE tasnifi (o'tkir buyrak)"],
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
    "variantlar": ["Faqat buyrak jomi APD sining <10 mm bo'lishi", "APD ≥15 mm, parenxima yupqalashishi, qovuq anomaliyasi", "Faqat bir tomonlama yengil gidronefroz mavjudligi", "Butunlay normal buyrak tuzilishi va o'lchamlari"],
    "togri": 1,
    "izoh": "P3 — APD ≥15 mm, parenxima yupqalashishi, siydik yo'li/qovuq anomaliyasi — to'liq tekshiruv va jarrohlik zarur bo'lishi mumkin."
  },
  {
    "savol": "Qovuq ultratovushi eng yaxshi natija berishi uchun qovuq qanday holatda bo'lishi kerak?",
    "variantlar": ["To'liq to'ldirilgan (to'la) holatda", "Butunlay bo'shatib olingan holatda", "Faqat yarim to'ldirilgan holatda", "Qovuq holatining hech qanday ahamiyati yo'q"],
    "togri": 0,
    "izoh": "Transabdominal qovuq ultratovushi qovuqni to'liq holatda eng yaxshi ko'rsatadi."
  },
  {
    "savol": "PVR (postvoid residual) nima?",
    "variantlar": ["Prostata bezining umumiy hajmi ko'rsatkichi", "Siydik chiqargach qovuqda qolgan siydik hajmi", "Buyrak koptokchali filtratsiya tezligi (SKF)", "Siydik yo'lining ko'ndalang kesim diametri"],
    "togri": 1,
    "izoh": "PVR — siydik chiqargandan keyin qovuqda qolgan siydik hajmi, siydik chiqarish buzilishini baholashda muhim."
  },
  {
    "savol": "Qovuq devorining qalinlashishi va trabekulali ko'rinishi nimaning bilvosita belgisi?",
    "variantlar": ["Buyrakda yirik tosh hosil bo'lganligining belgisi", "Qovuq bo'yni to'siqlanishi (masalan, BPH) belgisi", "Siydik yo'li o'tkir infeksiyasining bevosita belgisi", "Surunkali buyrak yetishmovchiligining erta belgisi"],
    "togri": 1,
    "izoh": "Qalinlashgan, traberkulali devor qovuq bo'yni to'siqlanishi (masalan, BPH sababli) bilvosita belgisi."
  },
  {
    "savol": "'Ureteral jet' nima va u nimani tasdiqlaydi?",
    "variantlar": ["To'qimadagi arterial qon oqimini ko'rsatib beradi", "Siydik yo'lidan qovuqqa oqim — to'siqlanish yo'qligini", "Prostata bezi sekretsiya suyuqligini ko'rsatib beradi", "Buyrak arteriyasidagi qon oqimini ifodalab beradi"],
    "togri": 1,
    "izoh": "Ureteral jet — siydik yo'li teshigidan qovuqqa kiruvchi siydik oqimi, siydik yo'li to'siqlanishi yo'qligini bilvosita tasdiqlaydi."
  },
  {
    "savol": "Avtomatlashtirilgan qovuq skaneri (bladder scanner) to'liq diagnostik UTT o'rnini bosa oladimi?",
    "variantlar": ["Ha, to'liq diagnostik UTT o'rnini bosa oladi", "Yo'q, u faqat hajmni hisoblovchi yordamchi vosita", "Ha, lekin bu faqat erkak bemorlarda o'rin bosadi", "Ha, lekin bu faqat go'dak va bolalarda o'rin bosadi"],
    "togri": 1,
    "izoh": "Bladder scanner faqat hajmni hisoblovchi vosita bo'lib, to'liq diagnostik ultratovush tekshiruvi o'rnini bosa olmaydi."
  },
  {
    "savol": "TRUS nima?",
    "variantlar": ["Qorin devori orqali o'tkaziladigan transabdominal UTT", "Transrektal UTT — prostatani to'g'ri ichak orqali tekshirish", "Qin (vagina) orqali o'tkaziladigan transvaginal UTT", "Uretra kanali orqali o'tkaziladigan transuretral UTT"],
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
    "variantlar": ["Rentgen tekshiruvi", "KT (tomografiya)", "MRI (magnit-rezonans)", "PET tekshiruvi"],
    "togri": 2,
    "izoh": "Mikroultratovush prostata ichidagi kichik o'simtalarni aniqlashda an'anaviy MRI bilan taqqoslanadigan natija ko'rsatadi."
  },
  {
    "savol": "Ultratovushning eng muhim afzalligi nima?",
    "variantlar": ["Barcha usullar orasida eng arzon tekshiruv bo'lishi", "Ionlashtiruvchi nurlanishning umuman yo'qligi", "Barcha usullar orasida eng aniq tekshiruv bo'lishi", "Bir vaqtning o'zida faqat bitta a'zoni tekshirishi"],
    "togri": 1,
    "izoh": "Ionlashtiruvchi nurlanish yo'qligi — bolalar va homilador ayollarda xavfsiz qo'llanishni ta'minlaydi."
  },
  {
    "savol": "UTT natijasi nimaga juda bog'liq bo'lgani uchun 'operator-dependent' deyiladi?",
    "variantlar": ["Ishlatilayotgan datchikning narxi va sifatiga", "Tekshiruvchi shifokorning malaka va tajribasiga", "Bemorning yoshi va jismoniy holatiga", "Tekshiruv o'tkazilayotgan xona haroratiga"],
    "togri": 1,
    "izoh": "UTT natijasi tekshiruvchi (operator) malakasiga juda bog'liq — bu usulning asosiy cheklovlaridan biri."
  },
  {
    "savol": "Qaysi holatlarda UTT tasvir sifati pasayadi?",
    "variantlar": ["Bemor yosh va sog'lom bo'lgan holatlarda", "Semizlik yoki ichak gazlari to'planishida", "Qovuq to'liq to'ldirilgan holat bo'lganda", "Bemor gorizontal yotgan holatda bo'lganda"],
    "togri": 1,
    "izoh": "Semizlik yoki gaz to'planishi tasvirni qiyinlashtiradi — suyak va havo orqali ham tasvir sifati pasayadi."
  },
  {
    "savol": "ALARA tamoyili nima?",
    "variantlar": ["Har doim eng yuqori chastotada tekshirish tamoyili", "Bemorga berilgan energiyani imkon qadar kamaytirish", "Tekshiruvni imkon qadar uzoq vaqt davom ettirish", "Faqat bolalar tekshiruvida qo'llaniladigan qoida"],
    "togri": 1,
    "izoh": "ALARA (As Low As Reasonably Achievable) — bemorga berilgan umumiy energiyani imkon qadar kamaytirish tamoyili."
  },
  {
    "savol": "Mexanik indeks va termal indeks nimani ifodalaydi?",
    "variantlar": ["Qat'iy va o'zgarmas xavfsizlik chegaralarini", "Nisbiy (taxminiy) xavf-xatar ko'rsatkichlarini", "Olingan tasvirning aniqlik ko'rsatkichlarini", "Ishlatilayotgan datchik sifati ko'rsatkichlarini"],
    "togri": 1,
    "izoh": "Bular qat'iy xavfsizlik chegaralari emas, balki nisbiy xavf ko'rsatkichlaridir."
  },
  {
    "savol": "Buyrak ultratovushida bemor odatda qaysi holatda tekshiriladi?",
    "variantlar": ["Tik turgan (vertikal) holatda", "Orqasidan yoki yon (flank) tomonidan", "Qorni bilan pastga yotgan holatda", "Stulda o'tirgan holatda"],
    "togri": 1,
    "izoh": "Buyrak ultratovushi odatda bemor orqasidan yoki yon tomonidan (flank) o'tkaziladi."
  },
  {
    "savol": "Moshok ultratovushida ortiqcha bosim nima uchun qo'llanilmasligi kerak?",
    "variantlar": ["Datchik apparati bosim ostida buzilib qolishi mumkin", "Moyak shakli va exogenligini o'zgartirib yuborishi mumkin", "Bemor og'riqni umuman sezmay qolishi mumkin bo'lgani", "Olingan tasvir sifatiga hech qanday ta'sir ko'rsatmaydi"],
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
