UPDATE dars_tarkibi
SET savollar_banki = $erkak_jinsiy_savollar$[
  {
    "savol": "Erkak jinsiy a'zolari tizimi ikki asosiy vazifani bajaradi. Qaysilar?",
    "variantlar": ["Testosteron va estrogen ishlab chiqarish", "Spermatozoidlar ishlab chiqarish va urug'ni ayol tanasiga yetkazish", "Siydik hosil qilish va uni chiqarish", "Semen saqlash va uni isitish"],
    "togri": 1,
    "izoh": "Erkak jinsiy tizimining ikki asosiy vazifasi: spermatozoidlar ishlab chiqarish (spermatogenez) va ularni ayol tanasiga yetkazish (ejakulyatsiya)."
  },
  {
    "savol": "Sperma yo'lining to'g'ri ketma-ketligi qaysi?",
    "variantlar": ["Epididim → Moyak → Vas deferens → Prostatik uretra", "Moyak → Epididim → Vas deferens → Urug' otish kanali → Prostatik uretra", "Moyak → Vas deferens → Epididim → Urug' otish kanali", "Prostatik uretra → Vas deferens → Epididim → Moyak"],
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
    "variantlar": ["Spermani tashish", "Moyakni tortib olish orqali termoregulyatsiyani ta'minlash", "Testosteron ishlab chiqarish", "Semenni suyultirish"],
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
    "variantlar": ["Tunika vaginalis", "Tunika albuginea", "Tunika vaskuloza", "Ichki urug' fastsiyasi"],
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
    "variantlar": ["Sertoli hujayralari — seminifer naycha devorida", "Leydig hujayralari — naychalar orasidagi interstitsial to'qimada", "Urug' hujayralari — naycha ichida", "Leydig hujayralari — epididim boshida"],
    "togri": 1,
    "izoh": "Leydig hujayralari seminifer naychalar orasidagi interstitsial to'qimada joylashib, testosteron sintez qiladi."
  },
  {
    "savol": "Qon-moyak to'sig'ining anatomik asosini qaysi hujayralar orasidagi zich birikmalar tashkil etadi?",
    "variantlar": ["Leydig hujayralari", "Urug' hujayralari", "Sertoli hujayralari", "Epididim hujayralari"],
    "togri": 2,
    "izoh": "Qon-moyak to'sig'i Sertoli hujayralari orasidagi tight junction (zich birikma)lar orqali hosil bo'ladi va rivojlanayotgan spermatozoidlarni immunologik hujumdan himoya qiladi."
  },
  {
    "savol": "Moyak qon ta'minotining asosiy manbai qaysi?",
    "variantlar": ["Defferensial arteriya", "Tashqi urug' (kremaster) arteriyasi", "Ichki urug' (testicular) arteriyasi, qorin aortasidan to'g'ridan-to'g'ri chiqadi", "Ichki pudendal arteriya"],
    "togri": 2,
    "izoh": "Ichki urug' (testicular) arteriyasi — moyakning asosiy qon manbai bo'lib, qorin aortasidan to'g'ridan-to'g'ri chiqadi."
  },
  {
    "savol": "Pampiniform venoz pleksus bilan arteriya orasidagi yaqin joylashuv nimani ta'minlaydi?",
    "variantlar": ["Spermani tashish tezligini", "Qarama-qarshi oqim issiqlik almashinuvini (moyak haroratini 2–4°C past saqlash)", "Testosteron miqdorini oshirishni", "Qon-moyak to'sig'ini mustahkamlashni"],
    "togri": 1,
    "izoh": "Pampiniform pleksus venalari va ichki urug' arteriyasining yonma-yon joylashuvi qarama-qarshi oqim issiqlik almashinuvini ta'minlab, moyak haroratini tana haroratidan 2–4°C past saqlaydi."
  },
  {
    "savol": "Epididim necha qismdan iborat?",
    "variantlar": ["Ikki", "Uch (caput, corpus, cauda)", "To'rt", "Beshta"],
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
    "variantlar": ["Spermani ishlab chiqaradi", "Sperma 'ombori' vazifasini bajaradi", "Testosteron sintez qiladi", "Urug' pufakchasi bilan bevosita qo'shiladi"],
    "togri": 1,
    "izoh": "Epididim dumi yetilgan spermatozoidlarni saqlash (omborxona) vazifasini bajaradi va ejakulyatsiyaga qadar ularni ushlab turadi."
  },
  {
    "savol": "Epididim naychasi caput-corpus chegarasidan keyin qanday tuzilishga ega bo'ladi?",
    "variantlar": ["Bir nechta parallel naychaga bo'linadi", "Yagona, uzluksiz naychaga aylanadi", "To'liq yo'qoladi", "Ikkiga bo'linib qayta birlashadi"],
    "togri": 1,
    "izoh": "Caput-corpus chegarasidan keyin barcha efferent naychalar birlashib yagona, juda uzun (6–7 m) va uzluksiz epididim naychasiga aylanadi."
  },
  {
    "savol": "Vas deferens faqat qaysi arteriyadan qon oladi?",
    "variantlar": ["Ichki urug' arteriyasi", "Tashqi urug' (kremaster) arteriyasi", "Defferensial arteriya", "Ichki pudendal arteriya"],
    "togri": 2,
    "izoh": "Vas deferens qon ta'minotini faqat defferensial arteriyadan oladi — bu jarrohlik uchun muhim anatomik jihat."
  },
  {
    "savol": "Vas deferens ikki nuqtada kesilsa yoki tiqilsa, oradagi segmentga nima bo'ladi?",
    "variantlar": ["Qayta tiklanadi", "Qon ta'minotsiz qolib fibrozga uchraydi", "Kengayadi va kista hosil qiladi", "O'zgarishsiz qoladi"],
    "togri": 1,
    "izoh": "Vas deferens yagona qon manbasiga (defferensial arteriya) bog'liqligi sababli, ikki nuqtada to'siq bo'lsa oradagi segment ishemiyaga uchradi va fibrozlashadi."
  },
  {
    "savol": "Urug' pufakchalari qayerda joylashgan?",
    "variantlar": ["Moyak orqasida", "Qovuq va prostata orqasida", "Prostata ostida", "Epididim yonida"],
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
    "variantlar": ["Faqat vas deferensdan", "Urug' pufakchasi chiqaruv naychasi vas deferens ampulasi bilan qo'shilib", "Prostata to'qimasidan bevosita", "Epididim dumi va moyak birikishidan"],
    "togri": 1,
    "izoh": "Urug' otish kanali (ejaculatory duct) — vas deferens ampulasi va urug' pufakchasi chiqaruv naychasining birlashuvidan hosil bo'ladi."
  },
  {
    "savol": "Urug' otish kanali qayerda prostatik uretraga ochiladi?",
    "variantlar": ["Bulbar segmentda", "Verumontanum darajasida", "Membranoz uretrada", "Penil uretrada"],
    "togri": 1,
    "izoh": "Urug' otish kanali prostatadan o'tib, verumontanum (seminal colliculus) darajasida prostatik uretraga ochiladi."
  },
  {
    "savol": "Urug' otish kanalida siydikning teskari oqishi qanday oldi olinadi?",
    "variantlar": ["Haqiqiy mushak sfinkteri orqali", "Kanalning uretraga o'tkir burchak ostida kirishi orqali", "Verumontanumdagi klapan orqali", "Prostata bosimi orqali"],
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
    "variantlar": ["Spermatozoidlarni energiya bilan ta'minlaydi", "Ejakulyatsiyadan keyin semenni gel-shaklga keltiradi (koagulyatsiya)", "Semenni suyultiradi", "Testosteron darajasini oshiradi"],
    "togri": 1,
    "izoh": "Urug' pufakchasi ishlab chiqaradigan semenogelin ejakulyatsiyadan so'ng semenni gel-shaklga keltiradi. Keyinchalik PSA bu gelatinni parchalab suyuqlashtiradi."
  },
  {
    "savol": "Prostata bezi semen hajmiga taxminan qancha ulush qo'shadi va asosiy tarkibi nima?",
    "variantlar": ["~70%, fruktoza va prostaglandinlar", "~20–30%, sink, sitrat, PSA va proteolitik fermentlar", "~10%, faqat spermatozoidlar", "~50%, semenogelin"],
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
    "variantlar": ["Markaziy zona", "O'tish zonasi", "Periferik zona", "Old fibromuskulyar zona"],
    "togri": 2,
    "izoh": "Prostata saratonining taxminan 70–80%i periferik zonadan boshlanadi — bu zona TRUS biopsiyas uchun eng muhim zona."
  },
  {
    "savol": "Yosh bilan eng tez o'sadigan va BPH ga olib keladigan zona qaysi?",
    "variantlar": ["Periferik zona", "Markaziy zona", "O'tish zonasi", "Old fibromuskulyar zona"],
    "togri": 2,
    "izoh": "O'tish zonasi (transition zone) yosh bilan kengayib, benign prostata giperplaziyasi (BPH) rivojlanishiga olib keladi va siydik chiqarishni qiyinlashtiradi."
  },
  {
    "savol": "Markaziy zona (central zone) qanday tuzilmani o'rab turadi?",
    "variantlar": ["Verumontanumni", "Urug' otish kanallarini", "Prostatik utrikulusni", "Prostatik uretrani"],
    "togri": 1,
    "izoh": "Markaziy zona urug' otish kanallarini (ejaculatory ducts) o'rab turadi va asosida verumontanumga tutashadi."
  },
  {
    "savol": "Old fibromuskulyar zonaning tarkibi qanday?",
    "variantlar": ["Bez to'qimasidan iborat", "Faqat biriktiruvchi va mushak to'qimasidan iborat, bez to'qimasi yo'q", "Faqat bez to'qimasi va qon tomirlaridan iborat", "Verumontanum bilan bevosita bog'liq"],
    "togri": 1,
    "izoh": "Old (anterior) fibromuskulyar zona prostataning old yuzasini qoplab, faqat biriktiruvchi to'qima va silliq mushakdan iborat — bez elementi yo'q."
  },
  {
    "savol": "Verumontanumga qaysi tuzilmalar ochiladi?",
    "variantlar": ["Faqat vas deferens", "Ikkala urug' otish kanali va prostatik utrikulus", "Faqat prostatik utrikulus", "Cooper bezlari"],
    "togri": 1,
    "izoh": "Verumontanumga ikkala urug' otish kanali (ejaculatory ducts) va prostatik utrikulus (Myuller kanalining qoldig'i) ochiladi."
  },
  {
    "savol": "PSA (prostate-specific antigen) ning vazifasi nima?",
    "variantlar": ["Testosteron ishlab chiqarish", "Semenni suyultirishga yordam berish", "Semenni gel-shaklga keltirish", "Spermatozoidlarga energiya berish"],
    "togri": 1,
    "izoh": "PSA — prostata epiteli ishlab chiqaradigan serin proteaza. Asosiy vazifasi: ejakulyatsiyadan keyin semenogelin gelatinini parchalab, semenni suyuqlashtirish."
  },
  {
    "savol": "PSA darajasining oshishi haqida qaysi fikr TO'G'RI?",
    "variantlar": ["Faqat saratonga xos", "Faqat BPH ga xos", "Saraton, BPH va yallig'lanish kabi bir nechta holatlarda ko'tarilishi mumkin", "Faqat yosh o'zgarishi bilan bog'liq"],
    "togri": 2,
    "izoh": "PSA prostata-spetsifik, lekin saraton-spetsifik emas. BPH, prostatit, travma va hatto rektual tekshiruv ham PSAni ko'tarishi mumkin."
  },
  {
    "savol": "Olat uch silindrsimon to'qimadan iborat. Ular qaysilar?",
    "variantlar": ["Ikkita corpus spongiosum va bitta corpus cavernosum", "Ikkita corpus cavernosum va bitta corpus spongiosum", "Uchta corpus cavernosum", "Uchta corpus spongiosum"],
    "togri": 1,
    "izoh": "Olat ikkita corpus cavernosum (yuqorida, juft) va bitta corpus spongiosum (pastda, juft emas, uretrani o'rab turadi)dan iborat."
  },
  {
    "savol": "Corpus spongiosum qanday vazifani bajaradi?",
    "variantlar": ["Ereksiyaning asosiy manbai bo'ladi", "Uretrani o'rab turadi va boshcha (glans penis)ni hosil qiladi", "Testosteron ishlab chiqaradi", "Spermani saqlaydi"],
    "togri": 1,
    "izoh": "Corpus spongiosum penile uretrani o'rab himoya qiladi va distal uchida kengayib boshcha (glans penis)ni hosil qiladi."
  },
  {
    "savol": "Erektil to'qima (corpus cavernosum) qaysi arteriya tarmoqlaridan qon oladi?",
    "variantlar": ["Tashqi pudendal tomirlar", "Ichki pudendal arteriyaning tarmoqlari", "Defferensial arteriya", "Ichki urug' arteriyasi"],
    "togri": 1,
    "izoh": "Corpus cavernosum qon ta'minotini ichki pudendal arteriyaning tarmoqlari — dorsal va kavernoz arteriyalardan oladi."
  },
  {
    "savol": "Zinner sindromi qaysi uch holat uyg'unligidan iborat?",
    "variantlar": ["Varikosele + gidrosele + kriptorxizm", "BPH + prostata saratoni + prostatit", "Urug' pufakchasi kistasi + buyrak agenezi + urug' otish kanali to'siqligi", "Epididimit + orxit + varikosele"],
    "togri": 2,
    "izoh": "Zinner sindromi — urug' pufakchasi kistasi, ipsilateral buyrak agenezi va urug' otish kanali to'siqligi uchligidan iborat nadir embriologik anomaliya."
  }
]$erkak_jinsiy_savollar$::jsonb
WHERE dars_slug = 'erkak-jinsiy-azolari-tuzilishi';
