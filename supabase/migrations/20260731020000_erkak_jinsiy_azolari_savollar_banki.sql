UPDATE dars_tarkibi
SET savollar_banki = $erkak_jinsiy_savollar$[
  {
    "savol": "Erkak jinsiy a'zolari tizimi ikki asosiy vazifani bajaradi. Qaysilar?",
    "variantlar": ["Testosteron va estrogen gormonlarini ishlab chiqarish", "Spermatozoid ishlab chiqarish va urug'ni ayolga yetkazish", "Siydik hosil qilish va uni tashqariga chiqarib yuborish", "Semenni saqlash va uni kerakli haroratda isitib turish"],
    "togri": 1,
    "izoh": "Erkak jinsiy tizimining ikki asosiy vazifasi: spermatozoidlar ishlab chiqarish (spermatogenez) va ularni ayol tanasiga yetkazish (ejakulyatsiya)."
  },
  {
    "savol": "Sperma yo'lining to'g'ri ketma-ketligi qaysi?",
    "variantlar": ["Epididim → Moyak → Vas deferens → Prostatik uretra", "Moyak → Epididim → Vas deferens → Otish kanali → Uretra", "Moyak → Vas deferens → Epididim → Urug' otish kanali", "Prostatik uretra → Vas deferens → Epididim → Moyak"],
    "togri": 1,
    "izoh": "To'g'ri ketma-ketlik: Moyak (ishlab chiqarish) → Epididim (yetilish/saqlash) → Vas deferens → Urug' otish kanali → Prostatik uretra."
  },
  {
    "savol": "Moyak va urug' tizimchasi moshonkaga necha qatlam bilan o'ralgan?",
    "variantlar": ["To'rt qatlam", "Besh qatlam", "Olti qatlam", "Yetti qatlam"],
    "togri": 2,
    "izoh": "Moyak va urug' tizimchasi moshonkada oltita qatlam bilan o'ralgan: teri, dartos, tashqi urug' fastsiyasi, kremaster fastsiyasi, ichki urug' fastsiyasi va tunika vaginalis."
  },
  {
    "savol": "Dartos fastsiyasi qorindagi qaysi fastsiyaning davomi?",
    "variantlar": ["Kamper fastsiyasi", "Skarpa fastsiyasi", "Buck fastsiyasi", "Kolles fastsiyasi"],
    "togri": 1,
    "izoh": "Dartos fastsiyasi qorin devorining yuzaki fastsiyasi — Skarpa fastsiyasining to'g'ridan-to'g'ri davomi hisoblanadi."
  },
  {
    "savol": "Kremaster fastsiyasining asosiy vazifasi nima?",
    "variantlar": ["Spermatozoidlarni epididimga tashib berish", "Moyakni tortib termoregulyatsiyani ta'minlash", "Asosiy gormon testosteronni ishlab chiqarish", "Ejakulyatsiyadan oldin semenni suyultirish"],
    "togri": 1,
    "izoh": "Kremaster mushagi moyakni yuqoriga tortib, haroratni tartibga solishda ishtirok etadi — sovuqda qisqaradi, issiqda bo'shashadi."
  },
  {
    "savol": "Moyakni bevosita o'rab turuvchi seroz parda qanday nomlanadi?",
    "variantlar": ["Tunika albuginea", "Tunika vaskuloza", "Tunika vaginalis", "Kremaster fastsiyasi"],
    "togri": 2,
    "izoh": "Tunika vaginalis — moyakni bevosita o'rab turuvchi ikki qavatli seroz (parietal va visseral qavat) parda."
  },
  {
    "savol": "Moyak parenximasini o'rab turgan qalin, fibroelastik kapsula qaysi?",
    "variantlar": ["Tunika vaginalis (seroz parda)", "Tunika albuginea (fibroz kapsula)", "Tunika vaskuloza (tomirli qavat)", "Ichki urug' fastsiyasi (fascia)"],
    "togri": 1,
    "izoh": "Tunika albuginea — moyak parenximasini o'rab turuvchi qalin, oqish fibroelastik kapsula. U ichkariga septalar yuboritib, moyakni bo'lakchalariga ajratadi."
  },
  {
    "savol": "Moyak septalar bilan taxminan nechta bo'lakchaga bo'linadi?",
    "variantlar": ["50 ta", "100 ta", "250 ta", "500 ta"],
    "togri": 2,
    "izoh": "Tunika albugineadan chiquvchi septalar moyakni taxminan 250 ta konussimon bo'lakchaga ajratadi."
  },
  {
    "savol": "Bir moyakda taxminan nechta seminifer naycha joylashgan?",
    "variantlar": ["100–300 ta", "600–1200 ta", "2000–3000 ta", "5000 tadan ortiq"],
    "togri": 1,
    "izoh": "Har bir moyakda taxminan 600–1200 ta seminifer naycha bo'lib, ularda spermatogenez sodir bo'ladi."
  },
  {
    "savol": "Testosteron ishlab chiqaruvchi hujayralar qaysilar va qayerda joylashgan?",
    "variantlar": ["Sertoli hujayralari — seminifer naycha devorida", "Leydig hujayralari — naychalar orasi interstitsiyda", "Urug' (germ) hujayralari — naycha ichi bo'shlig'ida", "Leydig hujayralari — epididim boshi (caput)da"],
    "togri": 1,
    "izoh": "Leydig hujayralari seminifer naychalar orasidagi interstitsial to'qimada joylashib, testosteron sintez qiladi."
  },
  {
    "savol": "Qon-moyak to'sig'ining anatomik asosini qaysi hujayralar orasidagi zich birikmalar tashkil etadi?",
    "variantlar": ["Leydig hujayralari", "Urug' (germ) hujayralari", "Sertoli hujayralari", "Epididim epiteliy hujayralari"],
    "togri": 2,
    "izoh": "Qon-moyak to'sig'i Sertoli hujayralari orasidagi tight junction (zich birikma)lar orqali hosil bo'ladi va rivojlanayotgan spermatozoidlarni immunologik hujumdan himoya qiladi."
  },
  {
    "savol": "Moyak qon ta'minotining asosiy manbai qaysi?",
    "variantlar": ["Defferensial arteriya orqali ta'minlanadi", "Tashqi urug' (kremaster) arteriyasi orqali", "Ichki urug' arteriyasi — aortadan bevosita", "Ichki pudendal arteriya tarmog'i orqali"],
    "togri": 2,
    "izoh": "Ichki urug' (testicular) arteriyasi — moyakning asosiy qon manbai bo'lib, qorin aortasidan to'g'ridan-to'g'ri chiqadi."
  },
  {
    "savol": "Pampiniform venoz pleksus bilan arteriya orasidagi yaqin joylashuv nimani ta'minlaydi?",
    "variantlar": ["Spermatozoidlar tashish tezligini oshirishni", "Qarama-qarshi issiqlik almashinuvi (harorat 2–4°C past)", "Qon orqali testosteron miqdorini oshirishni", "Qon-moyak to'sig'ini yanada mustahkamlashni"],
    "togri": 1,
    "izoh": "Pampiniform pleksus venalari va ichki urug' arteriyasining yonma-yon joylashuvi qarama-qarshi oqim issiqlik almashinuvini ta'minlab, moyak haroratini tana haroratidan 2–4°C past saqlaydi."
  },
  {
    "savol": "Epididim necha qismdan iborat?",
    "variantlar": ["Ikki qism (bosh va dum)", "Uch qism (caput, corpus, cauda)", "To'rt qism (turli bo'lim)", "Beshta alohida qism"],
    "togri": 1,
    "izoh": "Epididim uch qismdan iborat: caput (bosh) — moyak ustida, corpus (tana) — moyak orqasida, cauda (dum) — moyak pastida."
  },
  {
    "savol": "Epididim boshi (caput)da rete testisdan nechta chiqaruv naychasi birlashadi?",
    "variantlar": ["2–4 ta", "8–12 ta", "20–25 ta", "30–40 ta"],
    "togri": 1,
    "izoh": "Rete testisdan 8–12 ta efferent naycha chiqib, epididim boshini tashkil etadi."
  },
  {
    "savol": "Epididim dumi (cauda) qanday vazifani bajaradi?",
    "variantlar": ["Yangi spermatozoidlarni ishlab chiqaradi", "Sperma 'ombori' (saqlash) vazifasini bajaradi", "Asosiy gormon testosteronni sintez qiladi", "Urug' pufakchasi bilan bevosita qo'shiladi"],
    "togri": 1,
    "izoh": "Epididim dumi yetilgan spermatozoidlarni saqlash (omborxona) vazifasini bajaradi va ejakulyatsiyaga qadar ularni ushlab turadi."
  },
  {
    "savol": "Epididim naychasi caput-corpus chegarasidan keyin qanday tuzilishga ega bo'ladi?",
    "variantlar": ["Barcha naychalar birlashib yagona uzluksiz naychaga", "Bir necha parallel naychaga ajralib bo'linadi", "To'liq yo'qolib, o'rniga bo'sh joy qoladi", "Ikkiga bo'linib, so'ng qayta birlashadi"],
    "togri": 0,
    "izoh": "Caput-corpus chegarasidan keyin barcha efferent naychalar birlashib yagona, juda uzun (6–7 m) va uzluksiz epididim naychasiga aylanadi."
  },
  {
    "savol": "Vas deferens faqat qaysi arteriyadan qon oladi?",
    "variantlar": ["Ichki urug' (testicular) arteriyasidan qon oladi", "Tashqi urug' (kremaster) arteriyasidan qon oladi", "Faqat defferensial arteriyadan qon oladi", "Ichki pudendal arteriya tarmog'idan qon oladi"],
    "togri": 2,
    "izoh": "Vas deferens qon ta'minotini faqat defferensial arteriyadan oladi — bu jarrohlik uchun muhim anatomik jihat."
  },
  {
    "savol": "Vas deferens ikki nuqtada kesilsa yoki tiqilsa, oradagi segmentga nima bo'ladi?",
    "variantlar": ["O'z-o'zidan qayta tiklanib bitib ketadi", "Qon ta'minotsiz qolib fibrozga uchraydi", "Kengayib, ichida kista hosil qiladi", "Hech qanday o'zgarishsiz saqlanib qoladi"],
    "togri": 1,
    "izoh": "Vas deferens yagona qon manbasiga (defferensial arteriya) bog'liqligi sababli, ikki nuqtada to'siq bo'lsa oradagi segment ishemiyaga uchradi va fibrozlashadi."
  },
  {
    "savol": "Urug' pufakchalari qayerda joylashgan?",
    "variantlar": ["Moyakning orqa yuzasida", "Qovuq va prostata orqasida", "Prostata bezining ostida", "Epididim boshi yonida"],
    "togri": 1,
    "izoh": "Urug' pufakchalari juft organ bo'lib, qovuq posteriorida va prostata yuqorisida joylashgan."
  },
  {
    "savol": "Urug' pufakchasining taxminiy uzunligi qancha?",
    "variantlar": ["1–2 sm", "5–7 sm", "10–12 sm", "15–20 sm"],
    "togri": 1,
    "izoh": "Urug' pufakchasi taxminan 5–7 sm uzunlikda bo'lib, ichki yuzasi sekretsiya qiladigan mukosal burmalar bilan qoplangan."
  },
  {
    "savol": "Urug' otish kanali qanday hosil bo'ladi?",
    "variantlar": ["Faqat vas deferensning kengayishidan hosil bo'ladi", "Vas deferens ampulasi va pufakcha naychasi qo'shilib", "Bevosita prostata bez to'qimasidan hosil bo'ladi", "Epididim dumi va moyak birikishidan hosil bo'ladi"],
    "togri": 1,
    "izoh": "Urug' otish kanali (ejaculatory duct) — vas deferens ampulasi va urug' pufakchasi chiqaruv naychasining birlashuvidan hosil bo'ladi."
  },
  {
    "savol": "Urug' otish kanali qayerda prostatik uretraga ochiladi?",
    "variantlar": ["Bulbar uretra segmentida", "Verumontanum darajasida", "Membranoz uretra qismida", "Penil (olat) uretrada"],
    "togri": 1,
    "izoh": "Urug' otish kanali prostatadan o'tib, verumontanum (seminal colliculus) darajasida prostatik uretraga ochiladi."
  },
  {
    "savol": "Urug' otish kanalida siydikning teskari oqishi qanday oldi olinadi?",
    "variantlar": ["Kuchli haqiqiy mushak sfinkteri yordamida", "Kanalning uretraga o'tkir burchak ostida kirishi", "Verumontanumdagi maxsus klapan yordamida", "Prostata bezining doimiy bosimi yordamida"],
    "togri": 1,
    "izoh": "Urug' otish kanali prostatik uretraga o'tkir burchak ostida kiradi — bu geometrik jihat siydikni kanalga teskari oqishini mexanik tarzda to'xtatadi."
  },
  {
    "savol": "Urug' pufakchalari semen hajmining taxminan necha foizini ishlab chiqaradi?",
    "variantlar": ["20–30%", "50%", "~70%", "90%"],
    "togri": 2,
    "izoh": "Urug' pufakchalari semen hajmining taxminan 70%ini ishlab chiqaradi. Sekreti fruktoza, prostaglandinlar va semenogelin oqsilini o'z ichiga oladi."
  },
  {
    "savol": "Semenogelin oqsili qanday vazifani bajaradi?",
    "variantlar": ["Spermatozoidlarni harakat energiyasi bilan ta'minlaydi", "Ejakulyatsiyadan keyin semenni gel-shaklga keltiradi", "Ejakulyatsiyadan keyin semenni tez suyultiradi", "Qondagi testosteron darajasini oshirib beradi"],
    "togri": 1,
    "izoh": "Urug' pufakchasi ishlab chiqaradigan semenogelin ejakulyatsiyadan so'ng semenni gel-shaklga keltiradi. Keyinchalik PSA bu gelatinni parchalab suyuqlashtiradi."
  },
  {
    "savol": "Prostata bezi semen hajmiga taxminan qancha ulush qo'shadi va asosiy tarkibi nima?",
    "variantlar": ["~70%, asosan fruktoza va prostaglandinlar", "~20–30%, sink, sitrat, PSA, proteolitik ferment", "~10%, deyarli faqat spermatozoidlardan iborat", "~50%, asosan semenogelin oqsilidan iborat"],
    "togri": 1,
    "izoh": "Prostata semen hajmining ~20–30%ini tashkil etadi. Sekreti sink, sitrat, PSA (prostatik spetsifik antigen) va proteolitik fermentlarni o'z ichiga oladi."
  },
  {
    "savol": "Normal prostata hajmi taxminan qancha?",
    "variantlar": ["10 mL", "15 mL", "25 mL", "40 mL"],
    "togri": 2,
    "izoh": "Kattalar erkakda normal prostata hajmi taxminan 20–25 mL (chexnut — yong'oq kabi)."
  },
  {
    "savol": "McNeal tasnifiga ko'ra prostata necha zonaga bo'linadi?",
    "variantlar": ["Ikki", "Uch", "To'rt", "Beshta"],
    "togri": 2,
    "izoh": "McNeal tasnifiga ko'ra prostata to'rtta zonaga bo'linadi: periferik zona (~70%), markaziy zona (~25%), o'tish zonasi (~5%) va old fibromuskulyar zona."
  },
  {
    "savol": "Prostata saratonining ko'pchiligi qaysi zonadan boshlanadi?",
    "variantlar": ["Markaziy zona (central zone)", "O'tish zonasi (transition)", "Periferik zona (peripheral)", "Old fibromuskulyar zona"],
    "togri": 2,
    "izoh": "Prostata saratonining taxminan 70–80%i periferik zonadan boshlanadi — bu zona TRUS biopsiyas uchun eng muhim zona."
  },
  {
    "savol": "Yosh bilan eng tez o'sadigan va BPH ga olib keladigan zona qaysi?",
    "variantlar": ["Periferik zona (peripheral)", "Markaziy zona (central)", "O'tish zonasi (transition)", "Old fibromuskulyar zona"],
    "togri": 2,
    "izoh": "O'tish zonasi (transition zone) yosh bilan kengayib, benign prostata giperplaziyasi (BPH) rivojlanishiga olib keladi va siydik chiqarishni qiyinlashtiradi."
  },
  {
    "savol": "Markaziy zona (central zone) qanday tuzilmani o'rab turadi?",
    "variantlar": ["Verumontanum tuzilmasini", "Urug' otish kanallarini", "Prostatik utrikulusni", "Prostatik uretra kanalini"],
    "togri": 1,
    "izoh": "Markaziy zona urug' otish kanallarini (ejaculatory ducts) o'rab turadi va asosida verumontanumga tutashadi."
  },
  {
    "savol": "Old fibromuskulyar zonaning tarkibi qanday?",
    "variantlar": ["Asosan sekretor bez to'qimasidan iborat", "Faqat biriktiruvchi va mushak to'qimasidan", "Faqat bez to'qimasi va qon tomirlaridan", "Verumontanum bilan bevosita bog'liq to'qima"],
    "togri": 1,
    "izoh": "Old (anterior) fibromuskulyar zona prostataning old yuzasini qoplab, faqat biriktiruvchi to'qima va silliq mushakdan iborat — bez elementi yo'q."
  },
  {
    "savol": "Verumontanumga qaysi tuzilmalar ochiladi?",
    "variantlar": ["Faqat vas deferens kanali", "Ikkala otish kanali va utrikulus", "Faqat prostatik utrikulus", "Cooper (bulbouretral) bezlari"],
    "togri": 1,
    "izoh": "Verumontanumga ikkala urug' otish kanali (ejaculatory ducts) va prostatik utrikulus (Myuller kanalining qoldig'i) ochiladi."
  },
  {
    "savol": "PSA (prostate-specific antigen) ning vazifasi nima?",
    "variantlar": ["Asosiy erkaklik gormoni testosteronni sintez qilish", "Ejakulyatdan keyin semenni parchalab suyultirish", "Ejakulyatsiyadan keyin semenni gelga aylantirish", "Spermatozoidlarni harakat energiyasi bilan ta'minlash"],
    "togri": 1,
    "izoh": "PSA — prostata epiteli ishlab chiqaradigan serin proteaza. Asosiy vazifasi: ejakulyatsiyadan keyin semenogelin gelatinini parchalab, semenni suyuqlashtirish."
  },
  {
    "savol": "PSA darajasining oshishi haqida qaysi fikr TO'G'RI?",
    "variantlar": ["Faqat prostata saratoniga xos ko'rsatkich", "Faqat BPH (adenoma) holatiga xos ko'rsatkich", "Saraton, BPH va yallig'lanishda ko'tarilishi mumkin", "Faqat yosh ortishi bilan bog'liq o'zgaradigan ko'rsatkich"],
    "togri": 2,
    "izoh": "PSA prostata-spetsifik, lekin saraton-spetsifik emas. BPH, prostatit, travma va hatto rektual tekshiruv ham PSAni ko'tarishi mumkin."
  },
  {
    "savol": "Olat uch silindrsimon to'qimadan iborat. Ular qaysilar?",
    "variantlar": ["Ikkita corpus spongiosum va bitta cavernosum", "Ikkita corpus cavernosum va bitta spongiosum", "Uchta corpus cavernosum (erektil to'qima)", "Uchta corpus spongiosum (uretra atrofi)"],
    "togri": 1,
    "izoh": "Olat ikkita corpus cavernosum (yuqorida, juft) va bitta corpus spongiosum (pastda, juft emas, uretrani o'rab turadi)dan iborat."
  },
  {
    "savol": "Corpus spongiosum qanday vazifani bajaradi?",
    "variantlar": ["Ereksiyaning asosiy qon manbai bo'lib xizmat qiladi", "Uretrani o'rab, boshcha (glans penis)ni hosil qiladi", "Asosiy gormon testosteronni ishlab chiqaradi", "Yetilgan spermatozoidlarni saqlab turadi"],
    "togri": 1,
    "izoh": "Corpus spongiosum penile uretrani o'rab himoya qiladi va distal uchida kengayib boshcha (glans penis)ni hosil qiladi."
  },
  {
    "savol": "Erektil to'qima (corpus cavernosum) qaysi arteriya tarmoqlaridan qon oladi?",
    "variantlar": ["Tashqi pudendal yuzaki tomirlaridan qon oladi", "Ichki pudendal arteriya tarmoqlaridan qon oladi", "Defferensial arteriya tarmoqlaridan qon oladi", "Ichki urug' arteriyasi tarmoqlaridan qon oladi"],
    "togri": 1,
    "izoh": "Corpus cavernosum qon ta'minotini ichki pudendal arteriyaning tarmoqlari — dorsal va kavernoz arteriyalardan oladi."
  },
  {
    "savol": "Zinner sindromi qaysi uch holat uyg'unligidan iborat?",
    "variantlar": ["Varikosele + gidrosele + kriptorxizm uyg'unligi", "BPH + prostata saratoni + prostatit uyg'unligi", "Pufakcha kistasi + buyrak agenezi + kanal to'sig'i", "Epididimit + orxit + varikosele uyg'unligi"],
    "togri": 2,
    "izoh": "Zinner sindromi — urug' pufakchasi kistasi, ipsilateral buyrak agenezi va urug' otish kanali to'siqligi uchligidan iborat nadir embriologik anomaliya."
  }
]$erkak_jinsiy_savollar$::jsonb
WHERE dars_slug = 'erkak-jinsiy-azolari-tuzilishi';
