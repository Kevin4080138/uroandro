UPDATE dars_tarkibi
SET savollar_banki = $qovuq_savollar$[
  {
    "savol": "Quyi siydik yo'li (LUT) qaysi ikki a'zodan iborat?",
    "variantlar": ["Buyrak va siydik yo'li (ureter)", "Qovuq va uretra", "Prostata bezi va qovuq", "Uretra va ureter"],
    "togri": 1,
    "izoh": "LUT (Lower Urinary Tract) qovuq va uretradan iborat bo'lib, siydikni saqlash va chiqarish vazifasini bajaradi."
  },
  {
    "savol": "LUT ning asosiy vazifasi nimadan iborat?",
    "variantlar": ["Qonni filtrlab, birlamchi siydik hosil qilish", "Siydikni past bosimda saqlash va ixtiyoriy chiqarish", "Elektrolit va suvni qayta so'rib olish (reabsorbsiya)", "Qonni zararli moddalardan tozalab berish"],
    "togri": 1,
    "izoh": "LUT siydikni past bosim ostida saqlaydi va ixtiyoriy nazorat ostida chiqaradi — bu uni boshqa ichki a'zolardan farqlaydi."
  },
  {
    "savol": "Quyi siydik yo'lini boshqa ichki a'zolardan (masalan, ichak) farqlaydigan xususiyat nima?",
    "variantlar": ["Faqat simpatik innervatsiyaga ega bo'lishi", "Ixtiyoriy (irodaviy) nazorat ostida bo'lishi", "O'ziga xos epiteliy turiga ega bo'lishi", "Alohida qon ta'minoti manbaiga ega bo'lishi"],
    "togri": 1,
    "izoh": "LUT ixtiyoriy nazorat ostida bo'lishi bilan boshqa ichki a'zolardan (masalan, ichak peristaltikasi beixtiyor) farqlanadi."
  },
  {
    "savol": "Qovuq kattalarda qaysi sohada joylashgan?",
    "variantlar": ["Yolg'on chanoq (false pelvis)", "Haqiqiy chanoq (true pelvis)", "Qorin bo'shlig'ining yuqori qismi", "Retroperitoneal (orqa) fazo"],
    "togri": 1,
    "izoh": "Kattalarning qovug'i haqiqiy chanoq (true pelvis) ichida joylashgan."
  },
  {
    "savol": "Qovuqning qaysi qismi qorin parda bilan qoplangan?",
    "variantlar": ["Asos (base) qismi", "Trigone sohasi", "Gumbaz (dome) qismi", "Qovuq bo'yni qismi"],
    "togri": 2,
    "izoh": "Qovuqning gumbaz (dome) qismi qorin parda (peritoneum) bilan qoplangan."
  },
  {
    "savol": "Urakus (urachus) nima?",
    "variantlar": ["Qovuqni innervatsiya qiluvchi asab tolasi", "Embrional naysimon tuzilma, kindik darajasida yo'qoladi", "Qovuqni qon bilan ta'minlovchi asosiy tomir", "Uretraning prostatik segmentining bir qismi"],
    "togri": 1,
    "izoh": "Urakus — embrional davrda qovuqni kindikka bog'laydigan naysimon tuzilma, normada tug'ilgunga qadar obliteratsiyalanadi."
  },
  {
    "savol": "Qovuq devorining ichkaridan tashqariga qarab qatlamlari to'g'ri ketma-ketligi qaysi?",
    "variantlar": ["Detruzor → lamina propria → urotelium", "Urotelium → lamina propria → detruzor", "Lamina propria → urotelium → detruzor", "Detruzor → urotelium → lamina propria"],
    "togri": 1,
    "izoh": "Ichkaridan tashqariga: urotelium (shilliq qavat) → lamina propria (biriktiruvchi to'qima) → detruzor (mushak qavati)."
  },
  {
    "savol": "\"Soyabon hujayralar (umbrella cells)\" qaysi qatlamda joylashgan?",
    "variantlar": ["Detruzor mushak qavatida", "Lamina propria qavatida", "Urotelium yuza qismida", "Tashqi adventitsiya qavatida"],
    "togri": 2,
    "izoh": "Soyabon hujayralar uroteliumning eng yuza qismida joylashgan bo'lib, himoya baryerini ta'minlaydi."
  },
  {
    "savol": "Detruzor mushagi necha qavatdan iborat?",
    "variantlar": ["Ikki qavatdan iborat", "Uch qavatdan iborat", "To'rt qavatdan iborat", "Bitta qavatdan iborat"],
    "togri": 1,
    "izoh": "Detruzor uch qavatli silliq mushakdan iborat: ichki uzunasiga, o'rta halqasimon va tashqi uzunasiga."
  },
  {
    "savol": "Qovuqning \"asos (base)\" qismi nimalardan tashkil topgan?",
    "variantlar": ["Tana (body) va gumbaz (dome)", "Trigone va qovuq bo'yni", "Urotelium va detruzor", "Prostatik va membranoz qism"],
    "togri": 1,
    "izoh": "Qovuqning asosi (base) trigone va qovuq bo'ynidan iborat."
  },
  {
    "savol": "Trigone haqida qaysi ma'lumot noto'g'ri?",
    "variantlar": ["Ikki ureter teshigi va qovuq bo'yni orasida joylashgan", "Detruzor mushagining eng qalin qismi hisoblanadi", "Eng kam qon bilan ta'minlangan soha hisoblanadi", "Sistoskopiyada atrofdan to'qroq rangda ko'rinadi"],
    "togri": 2,
    "izoh": "Trigone aslida qovuqning yaxshi qon bilan ta'minlangan sohalaridan biri — shuning uchun 'eng kam qon bilan ta'minlangan' degan ma'lumot noto'g'ri."
  },
  {
    "savol": "Erkaklarda qovuq bo'yni qanday tuzilishga ega?",
    "variantlar": ["To'liq halqasimon silliq mushak (ichki sfinkter)", "Ko'ndalang-targ'il mushakdan iborat halqa", "Mushaksiz, faqat biriktiruvchi to'qima", "Ayollardagi kabi to'liq bo'lmagan halqa"],
    "togri": 0,
    "izoh": "Erkaklarda qovuq bo'yni to'liq halqasimon silliq mushak (ichki sfinkter) bilan o'ralgan bo'lib, bu ejakulyatsiya va siydik saqlashda muhim rol o'ynaydi."
  },
  {
    "savol": "Erkaklarda qovuq bo'ynidagi to'liq mushak halqasining jinsiy funksiyadagi roli nima?",
    "variantlar": ["Jinsiy olat ereksiyasini bevosita ta'minlaydi", "Urug' otishda yopilib antegrad ejakulyatsiyani", "Asosiy gormon testosteronni ishlab chiqaradi", "Yetilgan spermatozoidlarni saqlab turadi"],
    "togri": 1,
    "izoh": "Ichki sfinkter ejakulyatsiya vaqtida yopilib, spermaning qovuqqa qaytishini (retrograd ejakulyatsiya) oldini oladi."
  },
  {
    "savol": "UVJ (ureterovesical junction) qaysi parda bilan o'ralgan holda trigonega birlashadi?",
    "variantlar": ["Denonvillye pardasi (fascia)", "Waldeyer pardasi (fascia)", "Buck pardasi (fascia)", "Colles pardasi (fascia)"],
    "togri": 1,
    "izoh": "Ureter Waldeyer pardasi bilan o'ralgan holda qovuq devoridan o'tib trigonega birlashadi."
  },
  {
    "savol": "UVJ ning bir tomonlama klapan vazifasi nimaning oldini oladi?",
    "variantlar": ["Siydikni tutolmaslik holatini", "Detruzor mushagi giperaktivligini", "Vezikoureteral reflyuksni (VUR)", "Qovuq chiqishi to'siqlanishini"],
    "togri": 2,
    "izoh": "UVJ bir tomonlama klapan vazifasini bajarib, siydikning qovuqdan buyrakka qaytishini (vezikoureteral reflyuks) oldini oladi."
  },
  {
    "savol": "Qovuq asosan qaysi arteriya tarmoqlaridan qon oladi?",
    "variantlar": ["Tashqi chov (external iliac) arteriyasidan", "Ichki chov (internal iliac) arteriyasidan", "Buyrak (renal) arteriyasi tarmoqlaridan", "Ichki pudendal arteriya tarmoqlaridan"],
    "togri": 1,
    "izoh": "Qovuqning qon ta'minoti asosan ichki chov (internal iliac) arteriyasining tarmoqlari orqali amalga oshiriladi."
  },
  {
    "savol": "Qovuqda ustun innervatsiya turi qaysi va uning vazifasi nima?",
    "variantlar": ["Simpatik — qovuq bo'ynini yopib turadigan", "Parasimpatik — detruzorni qisqarishga undaydigan", "Somatik — tashqi sfinkterni boshqaradigan", "Afferent — faqat og'riq sezgisini uzatadigan"],
    "togri": 1,
    "izoh": "Parasimpatik innervatsiya (S2-S4) detruzor mushaklarini qisqarishga undab, siydik chiqarishni ta'minlaydi."
  },
  {
    "savol": "Simpatik (adrenergik) innervatsiya erkaklarda qayerda zich joylashgan va vazifasi nima?",
    "variantlar": ["Trigone sohasida — siydik chiqishni boshlaydi", "Detruzor mushagida — qisqarishni kuchaytiradi", "Qovuq bo'ynida — uni yopishga yordam beradi", "Uretra devorida — sezuvchanlikni oshiradi"],
    "togri": 2,
    "izoh": "Simpatik innervatsiya qovuq bo'ynida zich bo'lib, saqlash fazasida bo'yinni yopiq ushlab turadi va ejakulyatsiyada muhim rol o'ynaydi."
  },
  {
    "savol": "Afferent (sezuvchi) tolalarning vazifasi nima?",
    "variantlar": ["Detruzor mushagini qisqartirish vazifasini bajaradi", "Qovuq to'lganligi haqida signalni miyaga uzatadi", "Tashqi sfinkter mushagini bo'shashtiradi", "Qovuqning qon ta'minotini boshqarib turadi"],
    "togri": 1,
    "izoh": "Afferent tolalar qovuq to'lganligi, og'riq va boshqa sezgilar haqida signallarni markaziy nerv tizimiga uzatadi."
  },
  {
    "savol": "Saqlash fazasida qovuq va uretra qanday holatda bo'lishi kerak?",
    "variantlar": ["Qovuq qisqargan, uretra ochiq holatda", "Qovuq bo'sh (qisqarmagan), uretra yopiq", "Qovuq va uretra ikkalasi ham qisqargan", "Qovuq va uretra ikkalasi ham bo'shashgan"],
    "togri": 1,
    "izoh": "Saqlash fazasida detruzor bo'shashgan (qisqarmagan) va sfinkterlar yopiq bo'lib, siydik to'planishini ta'minlaydi."
  },
  {
    "savol": "Erkak uretrasining umumiy uzunligi taxminan qancha?",
    "variantlar": ["4–5 sm", "10 sm", "20 sm", "25 sm"],
    "togri": 2,
    "izoh": "Erkak uretrasi taxminan 20 sm (18-22 sm oralig'ida) uzunlikka ega."
  },
  {
    "savol": "Erkak uretrasi necha segmentga bo'linadi?",
    "variantlar": ["Ikki", "Uch", "To'rt", "Besh"],
    "togri": 2,
    "izoh": "Erkak uretrasi 4 segmentga bo'linadi: prostatik, membranoz, bulbar va penil (osma)."
  },
  {
    "savol": "Prostatik uretra haqida qaysi ma'lumot to'g'ri?",
    "variantlar": ["Chanoq tubi (diafragma) mushaklaridan o'tadi", "Prostata ichidan o'tadi, otish kanallari ochiladi", "Corpus spongiosum to'qimasi ichida joylashgan", "Cooper (bulbouretral) bezlari shu yerga ochiladi"],
    "togri": 1,
    "izoh": "Prostatik uretra prostata bezi ichidan o'tadi va urug' otish kanallari (ductus ejaculatorius) shu segmentga ochiladi."
  },
  {
    "savol": "Tashqi siydik sfinkteri qaysi segmentda joylashgan?",
    "variantlar": ["Prostatik uretra segmentida", "Membranoz uretra segmentida", "Bulbar uretra segmentida", "Penil (osma) uretra segmentida"],
    "togri": 1,
    "izoh": "Tashqi siydik sfinkteri (rabdosfinkter) membranoz uretra atrofida joylashgan — bu eng tor va eng himoyasiz segment."
  },
  {
    "savol": "Cooper bezlari qaysi segmentga ochiladi?",
    "variantlar": ["Prostatik uretra segmentiga", "Membranoz uretra segmentiga", "Bulbar uretra segmentiga", "Penil (osma) uretra segmentiga"],
    "togri": 2,
    "izoh": "Cooper (bulbouretral) bezlari bulbar uretraga ochiladi."
  },
  {
    "savol": "Penil (osma) uretraning taxminiy uzunligi qancha va qayerda joylashgan?",
    "variantlar": ["~2 sm, membranoz uretra darajasida joylashgan", "~15 sm, corpus spongiosum ichida joylashgan", "~3–4 sm, prostata bezi ichida joylashgan", "~5 sm, chanoq tubi diafragmasida joylashgan"],
    "togri": 1,
    "izoh": "Penil uretra eng uzun segment (~15 sm) bo'lib, corpus spongiosum ichida joylashgan."
  },
  {
    "savol": "Ichki siydik sfinkteri haqida qaysi ma'lumot noto'g'ri?",
    "variantlar": ["Joylashuvi — qovuq bo'yni sohasida", "Mushak turi — silliq mushak (detruzor davomi)", "Nazorat turi — ixtiyoriy (irodaviy)", "Avtonom (beixtiyor) nazorat ostida"],
    "togri": 2,
    "izoh": "Ichki sfinkter avtonom (beixtiyor) nazorat ostida, ixtiyoriy emas. Ixtiyoriy nazorat tashqi sfinkterga tegishli."
  },
  {
    "savol": "Tashqi siydik sfinkteri (rabdosfinkter) qanday mushak turidan iborat va nazorati qanday?",
    "variantlar": ["Silliq mushakdan iborat, avtonom nazoratda", "Ko'ndalang-targ'il mushak, ixtiyoriy nazoratda", "Silliq mushakdan iborat, ixtiyoriy nazoratda", "Ko'ndalang-targ'il mushak, avtonom nazoratda"],
    "togri": 1,
    "izoh": "Tashqi sfinkter ko'ndalang-targ'il (skelet) mushakdan iborat va ixtiyoriy (pudendal nerv orqali somatik) nazorat ostida."
  },
  {
    "savol": "Prostatektomiya operatsiyasi vaqtida qaysi tuzilmaga shikast yetishi siydik tutolmaslikning muhim sababi bo'ladi?",
    "variantlar": ["Ichki siydik sfinkteri", "Tashqi siydik sfinkteri", "Trigone sohasi", "Detruzor mushagi"],
    "togri": 1,
    "izoh": "Prostatektomiyada tashqi sfinkterga shikast yetishi siydik tutolmaslikning asosiy sababi — chunki ichki sfinkter allaqachon olib tashlanadi."
  },
  {
    "savol": "Ayol uretrasining uzunligi taxminan qancha?",
    "variantlar": ["2–3 sm", "4–5 sm", "8–10 sm", "15–20 sm"],
    "togri": 1,
    "izoh": "Ayol uretrasi taxminan 4–5 sm uzunlikda."
  },
  {
    "savol": "Ayol uretrasi qaysi yo'nalishda joylashgan?",
    "variantlar": ["Qov suyagi orqasidan o'tib qin oldiga, vestibulga", "To'g'ridan-to'g'ri qovuqdan orqa qin devoriga", "Prostata bezi ichidan o'tib pastga tushadi", "Faqat chanoq suyagi ichida joylashib qoladi"],
    "togri": 0,
    "izoh": "Ayol uretrasi qov suyagi orqasidan o'tib, oldingi qin devori bo'ylab pastga tushadi va vestibulga (tashqi jinsiy a'zolar) ochiladi."
  },
  {
    "savol": "Ayol uretrasi distal qismida epiteliy turi qanday o'zgaradi?",
    "variantlar": ["O'tish epiteliysidan yassi epiteliyga o'zgaradi", "Yassi epiteliydan o'tish epiteliysiga o'zgaradi", "Bezli epiteliydan silindrsimon epiteliyga", "Umuman o'zgarmay, bir xil bo'lib qoladi"],
    "togri": 0,
    "izoh": "Ayol uretrasining proksimal qismi o'tish epiteliysi (urotelium), distal qismi esa yassi (squamous) epiteliy bilan qoplangan."
  },
  {
    "savol": "Ayollarda uretraning yopilishiga yordam beradigan tuzilmalar qaysilar?",
    "variantlar": ["Faqat ichki (silliq mushak) sfinkter yordamida", "Uretrovaginal sfinkter va pubokoksigeus mushagi", "Faqat detruzor mushagining o'zi yordamida", "Verumontanum tuzilmasi yordamida"],
    "togri": 1,
    "izoh": "Ayollarda uretra yopilishiga uretrovaginal sfinkter va chanoq tubi mushaklari (pubokoksigeus) yordam beradi."
  },
  {
    "savol": "Ayollarda siydik yo'li infeksiyalarining erkaklarga nisbatan ko'proq uchrashining asosiy anatomik sababi nima?",
    "variantlar": ["Uretraning uzunligi va yopiq bo'lib turishi", "Uretraning qisqaligi va tashqariga yaqin ochilishi", "Qovuqning hajmi katta bo'lishi va kengligi", "Trigone tuzilmasining butunlay yo'qligi"],
    "togri": 1,
    "izoh": "Ayol uretrasi qisqa (~4-5 sm) va tashqi muhitga yaqin ochiladi, shuning uchun bakteriyalar qovuqqa osonroq yetib boradi."
  },
  {
    "savol": "Mikturisiya sikli necha asosiy fazaga bo'linadi?",
    "variantlar": ["Bitta yagona faza", "Ikki faza (saqlash va chiqarish)", "Uch faza (turli bosqichlar)", "To'rt faza (bosqichma-bosqich)"],
    "togri": 1,
    "izoh": "Mikturisiya sikli ikki fazadan iborat: saqlash (to'planish) fazasi va chiqarish (bo'shatish) fazasi."
  },
  {
    "savol": "Chiqarish/bo'shatish fazasida qanday jarayonlar sodir bo'ladi?",
    "variantlar": ["Tashqi sfinkter qisqaradi, detruzor bo'shashadi", "Tashqi sfinkter bo'shashadi, detruzor qisqaradi", "Sfinkter va detruzor ikkalasi ham qisqaradi", "Sfinkter va detruzor ikkalasi ham bo'shashadi"],
    "togri": 1,
    "izoh": "Chiqarish fazasida detruzor qisqaradi va bir vaqtda sfinkterlar bo'shashadi — bu muvofiqlashtirilgan jarayon."
  },
  {
    "savol": "Mikturisiyaning markaziy nazorati orqa miyaning qaysi segmentlari bilan bog'liq?",
    "variantlar": ["T10–T12", "L1–L2", "S2–S4", "C1–C4"],
    "togri": 2,
    "izoh": "S2-S4 segmentlari mikturisiya markaziy nazoratida muhim rol o'ynaydi (parasimpatik va somatik innervatsiya markazi)."
  },
  {
    "savol": "Detruzor-sfinkter dissinergiyasi nima?",
    "variantlar": ["Saqlash fazasida detruzorning beixtiyor qisqarishi", "Detruzor bilan bir vaqtda sfinkterning qisqarishi", "Chiqarishda qisqarish kuchining yetarli emasligi", "Uretra qarshiligining patologik oshib ketishi"],
    "togri": 1,
    "izoh": "Detruzor-sfinkter dissinergiyasi — detruzor va sfinkterning bir vaqtda qisqarishi, odatda orqa miya shikastlanishida uchraydi."
  },
  {
    "savol": "Sistoskopiyada trigone asosini qaysi tuzilma tashkil etadi?",
    "variantlar": ["Verumontanum tuzilmasi", "Interureteral tizma (Mercier)", "Bulbar uretra segmenti", "Urakus (naysimon) qoldig'i"],
    "togri": 1,
    "izoh": "Interureteral tizma (Mercier tizmasi) — ikki ureter teshigini bir-biriga bog'laydigan tizma bo'lib, trigonening yuqori chegarasini tashkil etadi."
  },
  {
    "savol": "BOO (Bladder Outlet Obstruction) qanday holatni bildiradi?",
    "variantlar": ["Saqlash fazasida detruzorning beixtiyor qisqarishi", "Uretra/bo'yin qarshiligi oshib siydik oqimiga to'siq", "Chiqarishda detruzor qisqarish kuchining yetishmasligi", "Qovuq va uretraning bir-biriga qarama-qarshi ishlashi"],
    "togri": 1,
    "izoh": "BOO — qovuq chiqish joyi (bo'yin yoki uretra) darajasida siydik oqimiga mexanik yoki funksional to'siq."
  }
]$qovuq_savollar$
WHERE dars_slug = 'qovuq-uretra-tuzilishi';
