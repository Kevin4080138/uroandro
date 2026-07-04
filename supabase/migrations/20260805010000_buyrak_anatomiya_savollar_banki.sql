UPDATE dars_tarkibi
SET savollar_banki = $buyrak_savollar$[
  {
    "savol": "Buyrak va siydik yo'li qaysi bo'shliqda joylashgan?",
    "variantlar": ["Intraperitoneal bo'shliq", "Retroperitoneal bo'shliq", "Ekstraperitoneal chanoq bo'shlig'i", "Subperitoneal (parda osti) bo'shliq"],
    "togri": 1,
    "izoh": "Buyrak va siydik yo'li retroperitoneal bo'shliqda — qorin pardasining orqasida joylashgan."
  },
  {
    "savol": "\"Retroperitoneal\" atamasi qanday ma'noni anglatadi?",
    "variantlar": ["Qorin pardasining bevosita ichida joylashgan", "Qorin pardasining orqasida (ortida) joylashgan", "Qorin pardasining ustki qismida joylashgan", "Qorin pardasidan yon (lateral) tomonda joylashgan"],
    "togri": 1,
    "izoh": "Retro (orqada) + peritoneum (qorin parda) = qorin pardasining orqasida joylashgan."
  },
  {
    "savol": "Quyidagilardan qaysi biri \"birlamchi retroperitoneal\" tuzilma HISOBLANMAYDI?",
    "variantlar": ["Buyrak (ren)", "Siydik yo'li (ureter)", "Qorin aortasi (aorta)", "Yo'g'on ichak (kolon)"],
    "togri": 3,
    "izoh": "Yo'g'on ichak ikkilamchi retroperitoneal tuzilma — dastlab intraperitoneal rivojlanib, keyin retroperitoneal holatga o'tadi."
  },
  {
    "savol": "Buyraklar qaysi mushak ustida yotadi?",
    "variantlar": ["Kvadrat bel mushagi (quadratus lumborum)", "Bel mushagi (psoas major)", "To'g'ri qorin mushagi (rectus)", "Diafragma (ko'krak-qorin pardasi)"],
    "togri": 1,
    "izoh": "Buyraklar bel mushagi (psoas major) ustida yotadi, shu sababli ularning o'qi qiyalashgan."
  },
  {
    "savol": "Buyraklarning uzunlamasiga o'qi qanday yo'nalishda qiyalashgan?",
    "variantlar": ["Yuqori qutub pastkiga nisbatan lateral va oldinroq", "Yuqori qutub pastkiga nisbatan medial va orqaroq", "Ikkala qutub ham bir xil vertikal chiziqda", "Pastki qutub yuqori qutubdan medialroq joylashgan"],
    "togri": 1,
    "izoh": "Psoas mushagi ustida yotgani uchun yuqori qutub pastki qutubga nisbatan ko'proq medial va orqaroq joylashgan."
  },
  {
    "savol": "O'ng buyrakning yuqori qutubi qaysi qovurg'a darajasida joylashgan?",
    "variantlar": ["10-qovurg'a", "11-qovurg'a", "12-qovurg'a", "9-qovurg'a"],
    "togri": 2,
    "izoh": "O'ng buyrakning yuqori qutubi 12-qovurg'a darajasida, chap buyrakniki esa 11-12-qovurg'a darajasida."
  },
  {
    "savol": "Chap buyrak o'ng buyrakka nisbatan qanday joylashgan?",
    "variantlar": ["O'ng buyrakka nisbatan biroz pastroqda", "O'ng buyrakka nisbatan biroz yuqoriroqda", "O'ng buyrak bilan aynan bir xil darajada", "O'ng buyrakdan sezilarli pastroqda (5 sm)"],
    "togri": 1,
    "izoh": "Chap buyrak o'ng buyrakka nisbatan biroz yuqoriroq joylashgan, chunki o'ng tomonda jigar bosim o'tkazadi."
  },
  {
    "savol": "O'ng buyrak nima sababdan chap buyrakdan pastroq joylashgan?",
    "variantlar": ["O'pka bosimi tufayli", "Jigar bosimi tufayli", "Taloq bosimi tufayli", "Ichak bosimi tufayli"],
    "togri": 1,
    "izoh": "O'ng tomondagi jigar bosimi tufayli o'ng buyrak chap buyrakdan 1-2 sm pastroq joylashgan."
  },
  {
    "savol": "Buyrak darvozasi (hilum) taxminan qaysi umurtqa darajasida joylashgan?",
    "variantlar": ["T12", "L1", "L3", "L4"],
    "togri": 1,
    "izoh": "Buyrak darvozasi (hilum) taxminan L1 umurtqa darajasida joylashgan."
  },
  {
    "savol": "O'ng buyrakning medial tomonida qaysi a'zolar joylashgan?",
    "variantlar": ["Oshqozon va taloq (chap tomon a'zolari)", "O'n ikki barmoq ichak va me'daosti bezi boshi", "Yo'g'on ichakning taloq (chap) burilishi", "O'ng buyrak usti bezi (adrenal bez)"],
    "togri": 1,
    "izoh": "O'ng buyrakning medial tomonida o'n ikki barmoq ichagi (duodenum) va oshqozonosti bezi boshi joylashgan."
  },
  {
    "savol": "Chap buyrakning yuqorisida qaysi a'zolar joylashgan (splenorenal bog'lam orqali)?",
    "variantlar": ["Jigar va o'ng buyrak usti (adrenal) bezi", "Oshqozon va taloq (splenorenal bog'lam)", "O'n ikki barmoq ichak (duodenum)", "Yo'g'on ichakning jigar (o'ng) burilishi"],
    "togri": 1,
    "izoh": "Chap buyrakning yuqorisida oshqozon va taloq (splenorenal bog'lam orqali) joylashgan."
  },
  {
    "savol": "Buyrakka ortiqcha pastga tortish kuchi qo'llanilganda o'ng tomonda qaysi a'zo shikastlanish xavfi yuqori?",
    "variantlar": ["Taloq (chap tomon)", "Jigar (o'ng tomon)", "Oshqozon (me'da)", "O'pka (chap-o'ng)"],
    "togri": 1,
    "izoh": "O'ng tomonda jigar kapsulasi yorilishi xavfi, chap tomonda esa taloq kapsulasi yorilishi xavfi mavjud."
  },
  {
    "savol": "Gerota fastsiyasi retroperitoneal bo'shliqni necha qismga ajratadi?",
    "variantlar": ["Ikki", "Uch", "To'rt", "Beshta"],
    "togri": 1,
    "izoh": "Gerota fastsiyasi retroperitoneal bo'shliqni uchga ajratadi: orqa pararenal, o'rta (perirenal), old pararenal."
  },
  {
    "savol": "O'rta (perirenal) bo'shliqda qaysi tuzilmalar joylashgan?",
    "variantlar": ["Yo'g'on ichak va o'n ikki barmoq ichak", "Faqat yog' to'qimasi (klechatka)", "Buyrak usti bezi, buyrak, proksimal ureter, yog'", "Oshqozonosti bezi (pankreas) va taloq"],
    "togri": 2,
    "izoh": "Perirenal bo'shliqda buyrak usti bezi, buyrak, proksimal siydik yo'li va perirenal yog' joylashgan."
  },
  {
    "savol": "Bir buyrakdagi infeksiya yoki gematoma odatda qarama-qarshi tomonga o'tmasligi nimaning natijasi?",
    "variantlar": ["Perirenal yog'ning yuqori zichligi", "Gerota fastsiyasining ajratuvchi vazifasi", "Haqiqiy buyrak kapsulasining qalinligi", "Buyrak arteriyasining o'ziga xos joylashuvi"],
    "togri": 1,
    "izoh": "Gerota fastsiyasi har bir buyrakning perirenal bo'shlig'ini bir-biridan ajratib turadi."
  },
  {
    "savol": "Buyrakning tashqaridan ichkariga qarab qoplamalari to'g'ri ketma-ketligi qaysi?",
    "variantlar": ["Gerota fastsiyasi → perirenal yog' → paranefrik yog' → haqiqiy kapsula", "Paranefrik yog' → Gerota fastsiyasi → perirenal yog' → haqiqiy kapsula", "Haqiqiy kapsula → perirenal yog' → Gerota fastsiyasi → paranefrik yog'", "Perirenal yog' → haqiqiy kapsula → paranefrik yog' → Gerota fastsiyasi"],
    "togri": 1,
    "izoh": "Ichkaridan tashqariga: haqiqiy kapsula → perirenal yog' → Gerota fastsiyasi → paranefrik yog'. Tashqaridan ichkariga esa aksincha (B varianti)."
  },
  {
    "savol": "Kattalarda har bir buyrakning o'rtacha uzunligi qancha?",
    "variantlar": ["5–7 sm", "8–9 sm", "10–12 sm", "14–16 sm"],
    "togri": 2,
    "izoh": "Kattalarda buyrak o'rtacha 10-12 sm uzunlikda — taxminan musht kattaligida."
  },
  {
    "savol": "Buyraklar nafas olish va tana holati o'zgarishi bilan vertikal yo'nalishda taxminan qancha siljishi mumkin?",
    "variantlar": ["1 sm", "3 sm", "6 sm", "10 sm"],
    "togri": 1,
    "izoh": "Buyraklar vertikal yo'nalishda taxminan 3 sm (bir umurtqa tanasi balandligiga teng) siljishi mumkin."
  },
  {
    "savol": "Buyrakni kesib ko'rilganda ajratiladigan ikki asosiy soha qaysilar?",
    "variantlar": ["Hilum va sinus", "Korteks va medulla", "Papilla va piramida", "Kosacha va jom"],
    "togri": 1,
    "izoh": "Buyrak kesimida ikki asosiy soha: tashqi korteks (po'stloq) va ichki medulla (miya qism)."
  },
  {
    "savol": "Buyrak medullasi necha ta konus shaklidagi piramidadan iborat?",
    "variantlar": ["2–5 ta", "8–18 ta", "20–30 ta", "40–50 ta"],
    "togri": 1,
    "izoh": "Buyrak medullasi 8-18 ta konus shaklidagi buyrak piramidasidan iborat."
  },
  {
    "savol": "Bertin ustunlari (columns of Bertin) nima?",
    "variantlar": ["Buyrak medulla piramidalarining uchki qismi", "Korteksning piramidalar orasiga kirgan qismi", "Kichik kosachalarning o'zaro birlashgan joyi", "Buyrak jomining (pelvis) bir qismi"],
    "togri": 1,
    "izoh": "Bertin ustunlari — korteks to'qimasining piramidalar orasiga kirib turgan qismlari."
  },
  {
    "savol": "Har bir buyrak piramidasining uchi nima deb ataladi va u nima bilan qoplangan?",
    "variantlar": ["Bertin ustuni, korteks to'qimasi bilan qoplangan", "Buyrak so'rg'ichi (papilla), kichik kosacha bilan", "Buyrak sinusi, katta kosacha bilan qoplangan", "Hilum (darvoza), adventitsiya bilan qoplangan"],
    "togri": 1,
    "izoh": "Piramidaning uchi buyrak so'rg'ichi (papilla) deb ataladi va har bir papilla bitta kichik kosacha bilan qoplangan."
  },
  {
    "savol": "Buyrak jomining odatdagi siydik sig'imi qancha?",
    "variantlar": ["1–2 mL", "3–10 mL", "15–25 mL", "30–50 mL"],
    "togri": 1,
    "izoh": "Buyrak jomi (renal pelvis) odatda 3-10 mL siydik sig'imiga ega."
  },
  {
    "savol": "VAUA yodlash usuliga ko'ra, buyrak darvozasida oldindan orqaga qarab joylashuv tartibi qanday?",
    "variantlar": ["Arteriya → Vena → Ureter → Arteriya", "Vena → Arteriya → Ureter → Arteriya", "Ureter → Arteriya → Vena → Arteriya", "Vena → Ureter → Arteriya → Arteriya"],
    "togri": 1,
    "izoh": "VAUA: Vena → Arteriya → Ureter/jom → Arteriya (orqa segmentar) — oldindan orqaga qarab."
  },
  {
    "savol": "Kattalar buyragida taxminan nechta nefron mavjud?",
    "variantlar": ["10 000–50 000", "100 000–200 000", "0.4–1.2 million", "5–10 million"],
    "togri": 2,
    "izoh": "Har bir kattalar buyragida taxminan 0.4-1.2 million nefron mavjud."
  },
  {
    "savol": "Nefron qaysi ikki asosiy tuzilmadan boshlanadi?",
    "variantlar": ["Proksimal kanalcha va Genle qovuzlog'i", "Glomerula va Bowman kapsulasi", "Distal va to'plovchi kanalcha", "Kichik va katta kosacha"],
    "togri": 1,
    "izoh": "Nefron glomerula (qon tomirlari to'plami) va uni o'rab turgan Bowman kapsulasidan boshlanadi."
  },
  {
    "savol": "GFR (glomerulyar filtratsiya tezligi) odatda qancha tezlikni bildiradi?",
    "variantlar": ["50 mL/min", "90 mL/min", "125 mL/min", "180 mL/min"],
    "togri": 2,
    "izoh": "GFR odatda 125 mL/min tezlikni bildiradi — bu buyrak funksiyasining asosiy ko'rsatkichi."
  },
  {
    "savol": "Har bir buyrak qaysi arteriya orqali qon oladi va u qorin aortasidan qaysi darajada chiqadi?",
    "variantlar": ["Buyrak arteriyasi, L1–L2 darajasida chiqadi", "Buyrak usti arteriyasi, T12 darajasida chiqadi", "Bel arteriyasi, L3–L4 darajasida chiqadi", "Ichki chov arteriyasi, S1 darajasida chiqadi"],
    "togri": 0,
    "izoh": "Har bir buyrak buyrak arteriyasi (renal artery) orqali qon oladi, u qorin aortasidan L1-L2 darajasida chiqadi."
  },
  {
    "savol": "Arterial tarmoqlanishda segmentar arteriyalardan keyingi bosqich qaysi?",
    "variantlar": ["Yoysimon (arcuate) arteriyalar", "Lobar (bo'lakli) arteriyalar", "Interlobulyar arteriyalar", "Afferent arteriolalar"],
    "togri": 1,
    "izoh": "Tarmoqlanish tartibi: buyrak arteriyasi → segmentar → lobar → interlobar → yoysimon → interlobulyar → afferent arteriolalar."
  },
  {
    "savol": "Yoysimon (arcuate) arteriyalar qayerda joylashadi?",
    "variantlar": ["Buyrak sinusi (darvoza) sohasida", "Piramidalar asosida, korteks-medulla chegarasi", "Korteks ichida radial (nurli) yo'nalishda", "Bertin ustunlarining markaziy qismida"],
    "togri": 1,
    "izoh": "Yoysimon arteriyalar piramidalar asosida, korteks va medulla chegarasida joylashadi."
  },
  {
    "savol": "Brodel chizig'i (line of Brodel) nima uchun muhim?",
    "variantlar": ["Nefronlarning aniq joylashuvini belgilaydi", "Tomirsiz chiziq — kam qon yo'qotib kesish imkoni", "Buyrak jomining (pelvis) hajmini aniqlaydi", "Siydik yo'lining torayish nuqtasini bildiradi"],
    "togri": 1,
    "izoh": "Brodel chizig'i — old va orqa segmentar arteriyalar orasidagi nisbatan tomirlarsiz zona, perkutan kirish uchun muhim."
  },
  {
    "savol": "Qo'shimcha (supernumerary) buyrak arteriyalari holatlarning taxminan necha qismida uchraydi?",
    "variantlar": ["Taxminan o'ndan bir qismida", "Taxminan to'rtdan bir qismida", "Taxminan yarmida (50%)", "Taxminan uchdan ikki qismida"],
    "togri": 1,
    "izoh": "Taxminan to'rtdan bir qismida (25%) qo'shimcha buyrak arteriyalari uchraydi."
  },
  {
    "savol": "Kattalarda siydik yo'lining umumiy uzunligi taxminan qancha?",
    "variantlar": ["10–15 sm", "22–30 sm", "35–40 sm", "45–50 sm"],
    "togri": 1,
    "izoh": "Siydik yo'lining umumiy uzunligi kattalarda 22-30 sm, diametri 1.5-6 mm atrofida."
  },
  {
    "savol": "Siydik yo'lining qorin (abdominal) segmenti qayerdan qayergacha davom etadi?",
    "variantlar": ["Chov tomirlaridan boshlab qovuqgacha", "Buyrak jomidan chov tomirlarigacha", "Qovuq devoridan boshlab tashqariga", "UPJ dan boshlab UVJ gacha davom etadi"],
    "togri": 1,
    "izoh": "Qorin segmenti buyrak jomidan chov tomirlarigacha davom etadi — umumiy uzunlikning yarmidan ko'prog'i."
  },
  {
    "savol": "Siydik yo'lining devor ichi (intramural) segmenti taxminan qancha uzunlikda?",
    "variantlar": ["0.2–0.5 sm", "1.2–2.5 sm", "5–7 sm", "10–12 sm"],
    "togri": 1,
    "izoh": "Devor ichi (intramural) segmenti — qovuq devori ichidan o'tadigan qism, uzunligi 1.2-2.5 sm."
  },
  {
    "savol": "Siydik yo'lining uchta fiziologik torayish nuqtasiga KIRMAYDIGAN qaysi?",
    "variantlar": ["UPJ (ureteropelvic junction)", "Chov tomirlari bilan kesishgan joy", "UVJ (ureterovesical junction)", "Buyrak sinusi (renal sinus)"],
    "togri": 3,
    "izoh": "Uchta torayish nuqtasi: UPJ, chov tomirlari kesishgan joy va UVJ. Buyrak sinusi torayish nuqtasi emas."
  },
  {
    "savol": "Siydik yo'li mushak qavati qanday harakatni ta'minlaydi?",
    "variantlar": ["Segmentar (bo'lakli) qisqarish", "Peristaltik (to'lqinsimon) harakat", "Tonik (doimiy) qisqarish", "Refleks (javob) qisqarish"],
    "togri": 1,
    "izoh": "Siydik yo'li mushak qavati peristaltik (to'lqinsimon) harakatni ta'minlab, siydikni faol harakatga keltiradi."
  },
  {
    "savol": "Siydik yo'li peristaltikasini boshqaruvchi \"pacemaker\" hujayralar qayerda joylashgan?",
    "variantlar": ["Buyrak jomida (renal pelvis)", "Kichik kosachalarda (calyces)", "UVJ (qovuq birikmasi)da", "Qovuq (siydik pufagi) devorida"],
    "togri": 1,
    "izoh": "Pacemaker hujayralar kichik kosachalarda joylashgan va asab tizimidan nisbatan mustaqil ishlaydi."
  },
  {
    "savol": "Perkutan buyrak kirishda pleura va o'pka shikastlanishi xavfini kamaytirish uchun qaysi kirish nuqtasi afzal ko'riladi?",
    "variantlar": ["10-qovurg'alar oralig'idan yuqoriroqdan", "12-qovurg'adan past yoki 11–12 oralig'idan", "9-qovurg'adan yuqoriroq soha orqali", "To'g'ridan-to'g'ri diafragma orqali"],
    "togri": 1,
    "izoh": "12-qovurg'adan past yoki 11-12-qovurg'alar orasidan kirish pleura/o'pka shikastlanishi xavfini kamaytiradi."
  },
  {
    "savol": "Siydik toshi og'rig'i odatda qaysi soha(lar)ga aks etadi (referred pain)?",
    "variantlar": ["Ko'krak qafasi va yelka kamari sohasiga", "Bel/yon, chov yoki moshonka/labiya sohasiga", "Qorin yuqori qismi va epigastriy sohasiga", "Orqa (bel-dumg'aza) va bosh sohasiga"],
    "togri": 1,
    "izoh": "Buyrak/siydik yo'li og'rig'i simpatik nervlar orqali bel/yon qism, chov va moshonka/labiya sohasiga aks etadi."
  }
]$buyrak_savollar$
WHERE dars_slug = 'buyrak-siydik-yollari-anatomiyasi';
