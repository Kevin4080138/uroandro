UPDATE dars_tarkibi
SET savollar_banki = $qovuq_savollar$[
  {
    "savol": "Quyi siydik yo'li (LUT) qaysi ikki a'zodan iborat?",
    "variantlar": ["Buyrak va siydik yo'li", "Qovuq va uretra", "Prostata va qovuq", "Uretra va siydik yo'li"],
    "togri": 1,
    "izoh": "LUT (Lower Urinary Tract) qovuq va uretradan iborat bo'lib, siydikni saqlash va chiqarish vazifasini bajaradi."
  },
  {
    "savol": "LUT ning asosiy vazifasi nimadan iborat?",
    "variantlar": ["Siydikni filtrlash", "Siydikni past bosim ostida saqlash va ixtiyoriy ravishda chiqarish", "Elektrolitlarni qayta so'rish", "Qonni tozalash"],
    "togri": 1,
    "izoh": "LUT siydikni past bosim ostida saqlaydi va ixtiyoriy nazorat ostida chiqaradi — bu uni boshqa ichki a'zolardan farqlaydi."
  },
  {
    "savol": "Quyi siydik yo'lini boshqa ichki a'zolardan (masalan, ichak) farqlaydigan xususiyat nima?",
    "variantlar": ["Faqat simpatik innervatsiya borligi", "Ixtiyoriy nazorat ostida bo'lishi", "Epiteliy turi", "Qon ta'minoti manbai"],
    "togri": 1,
    "izoh": "LUT ixtiyoriy nazorat ostida bo'lishi bilan boshqa ichki a'zolardan (masalan, ichak peristaltikasi beixtiyor) farqlanadi."
  },
  {
    "savol": "Qovuq kattalarda qaysi sohada joylashgan?",
    "variantlar": ["Yolg'on chanoq (false pelvis)", "Haqiqiy chanoq (true pelvis)", "Qorin bo'shlig'ining yuqori qismi", "Retroperitoneal fazo"],
    "togri": 1,
    "izoh": "Kattalarning qovug'i haqiqiy chanoq (true pelvis) ichida joylashgan."
  },
  {
    "savol": "Qovuqning qaysi qismi qorin parda bilan qoplangan?",
    "variantlar": ["Asos (base)", "Trigone", "Gumbaz (dome)", "Qovuq bo'yni"],
    "togri": 2,
    "izoh": "Qovuqning gumbaz (dome) qismi qorin parda (peritoneum) bilan qoplangan."
  },
  {
    "savol": "Urakus (urachus) nima?",
    "variantlar": ["Qovuqning asab tolasi", "Embrional davrda mavjud bo'lgan naysimon tuzilma, normada kindik darajasida yo'qoladi", "Qovuqning qon tomiri", "Uretraning bir qismi"],
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
    "variantlar": ["Detruzor mushagida", "Lamina propriada", "Urotelium yuza qismida", "Adventitsiyada"],
    "togri": 2,
    "izoh": "Soyabon hujayralar uroteliumning eng yuza qismida joylashgan bo'lib, himoya baryerini ta'minlaydi."
  },
  {
    "savol": "Detruzor mushagi necha qavatdan iborat?",
    "variantlar": ["Ikki qavat", "Uch qavat", "To'rt qavat", "Bitta qavat"],
    "togri": 1,
    "izoh": "Detruzor uch qavatli silliq mushakdan iborat: ichki uzunasiga, o'rta halqasimon va tashqi uzunasiga."
  },
  {
    "savol": "Qovuqning \"asos (base)\" qismi nimalardan tashkil topgan?",
    "variantlar": ["Tana (body) va gumbaz", "Trigone va qovuq bo'yni", "Urotelium va detruzor", "Prostatik va membranoz qismlar"],
    "togri": 1,
    "izoh": "Qovuqning asosi (base) trigone va qovuq bo'ynidan iborat."
  },
  {
    "savol": "Trigone haqida qaysi ma'lumot noto'g'ri?",
    "variantlar": ["Ikki siydik yo'li teshigi va qovuq bo'yni orasida joylashgan", "Detruzorning eng qalin qismi", "Eng kam qon bilan ta'minlangan soha", "Sistoskopiyada atrofdan to'qroq rangda ko'rinadi"],
    "togri": 2,
    "izoh": "Trigone qovuqning eng yaxshi qon bilan ta'minlangan sohasidirmas, balki \"eng kam qon bilan ta'minlangan\" degan ma'lumot noto'g'ri emas — trigone haqida 'eng kam qon bilan ta'minlangan' iborasi xato."
  },
  {
    "savol": "Erkaklarda qovuq bo'yni qanday tuzilishga ega?",
    "variantlar": ["To'liq halqasimon silliq mushak qatlami (ichki sfinkter)", "Ko'ndalang-targ'il mushak halqasi", "Mushaksiz biriktiruvchi to'qima", "Ayollardagi kabi to'liq bo'lmagan halqa"],
    "togri": 0,
    "izoh": "Erkaklarda qovuq bo'yni to'liq halqasimon silliq mushak (ichki sfinkter) bilan o'ralgan bo'lib, bu ejakulyatsiya va siydik saqlashda muhim rol o'ynaydi."
  },
  {
    "savol": "Erkaklarda qovuq bo'ynidagi to'liq mushak halqasining jinsiy funksiyadagi roli nima?",
    "variantlar": ["Ereksiyani ta'minlaydi", "Urug' otish vaqtida yopilib, antegrad ejakulyatsiyani ta'minlaydi", "Testosteron ishlab chiqarishni boshqaradi", "Spermani saqlaydi"],
    "togri": 1,
    "izoh": "Ichki sfinkter ejakulyatsiya vaqtida yopilib, spermaning qovuqqa qaytishini (retrograd ejakulyatsiya) oldini oladi."
  },
  {
    "savol": "UVJ (ureterovesical junction) qaysi parda bilan o'ralgan holda trigonega birlashadi?",
    "variantlar": ["Denonvillye pardasi", "Waldeyer pardasi", "Buck pardasi", "Colles pardasi"],
    "togri": 1,
    "izoh": "Ureter Waldeyer pardasi bilan o'ralgan holda qovuq devoridan o'tib trigonega birlashadi."
  },
  {
    "savol": "UVJ ning bir tomonlama klapan vazifasi nimaning oldini oladi?",
    "variantlar": ["Siydik tutolmaslik", "Detruzor giperaktivligi", "Vezikoureteral reflyuks", "Bladder outlet obstruction"],
    "togri": 2,
    "izoh": "UVJ bir tomonlama klapan vazifasini bajarib, siydikning qovuqdan buyrakka qaytishini (vezikoureteral reflyuks) oldini oladi."
  },
  {
    "savol": "Qovuq asosan qaysi arteriya tarmoqlaridan qon oladi?",
    "variantlar": ["Tashqi chov arteriyasi", "Ichki chov (hypogastric/internal iliac) arteriyasi", "Renal arteriya", "Pudendal arteriya"],
    "togri": 1,
    "izoh": "Qovuqning qon ta'minoti asosan ichki chov (internal iliac) arteriyasining tarmoqlari orqali amalga oshiriladi."
  },
  {
    "savol": "Qovuqda ustun innervatsiya turi qaysi va uning vazifasi nima?",
    "variantlar": ["Simpatik — qovuq bo'ynini yopadi", "Parasimpatik — detruzorni qisqarishga undaydi", "Somatik — sfinkterni boshqaradi", "Afferent — faqat og'riqni his qiladi"],
    "togri": 1,
    "izoh": "Parasimpatik innervatsiya (S2-S4) detruzor mushaklarini qisqarishga undab, siydik chiqarishni ta'minlaydi."
  },
  {
    "savol": "Simpatik (adrenergik) innervatsiya erkaklarda qayerda zich joylashgan va vazifasi nima?",
    "variantlar": ["Trigoneda — siydishni boshlaydi", "Detruzorda — qisqarishni kuchaytiradi", "Qovuq bo'ynida — uni yopishga yordam beradi (saqlash va antegrad ejakulyatsiya uchun)", "Uretrada — sezuvchanlikni oshiradi"],
    "togri": 2,
    "izoh": "Simpatik innervatsiya qovuq bo'ynida zich bo'lib, saqlash fazasida bo'yinni yopiq ushlab turadi va ejakulyatsiyada muhim rol o'ynaydi."
  },
  {
    "savol": "Afferent (sezuvchi) tolalarning vazifasi nima?",
    "variantlar": ["Detruzorni qisqartirish", "Qovuq to'lganligi haqida signalni orqa miya va miyaga uzatish", "Sfinkterni bo'shashtirish", "Qon ta'minotini boshqarish"],
    "togri": 1,
    "izoh": "Afferent tolalar qovuq to'lganligi, og'riq va boshqa sezgilar haqida signallarni markaziy nerv tizimiga uzatadi."
  },
  {
    "savol": "Saqlash fazasida qovuq va uretra qanday holatda bo'lishi kerak?",
    "variantlar": ["Qovuq qisqargan, uretra ochiq", "Qovuq bo'sh (qisqarmagan), uretra yopiq", "Ikkalasi ham qisqargan", "Ikkalasi ham bo'shashgan"],
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
    "variantlar": ["Chanoq tubi mushaklaridan o'tadi", "Prostata bezi ichidan o'tadi, urug' otish kanallari shu yerga ochiladi", "Corpus spongiosum ichida joylashgan", "Cooper bezlari shu yerga ochiladi"],
    "togri": 1,
    "izoh": "Prostatik uretra prostata bezi ichidan o'tadi va urug' otish kanallari (ductus ejaculatorius) shu segmentga ochiladi."
  },
  {
    "savol": "Tashqi siydik sfinkteri qaysi segmentda joylashgan?",
    "variantlar": ["Prostatik uretra", "Membranoz uretra", "Bulbar uretra", "Penil uretra"],
    "togri": 1,
    "izoh": "Tashqi siydik sfinkteri (rabdosfinkter) membranoz uretra atrofida joylashgan — bu eng tor va eng himoyasiz segment."
  },
  {
    "savol": "Cooper bezlari qaysi segmentga ochiladi?",
    "variantlar": ["Prostatik uretra", "Membranoz uretra", "Bulbar uretra", "Penil uretra"],
    "togri": 2,
    "izoh": "Cooper (bulbouretral) bezlari bulbar uretraga ochiladi."
  },
  {
    "savol": "Penil (osma) uretraning taxminiy uzunligi qancha va qayerda joylashgan?",
    "variantlar": ["~2 sm, membranoz uretrada", "~15 sm, corpus spongiosum ichida", "~3–4 sm, prostata ichida", "~5 sm, chanoq tubida"],
    "togri": 1,
    "izoh": "Penil uretra eng uzun segment (~15 sm) bo'lib, corpus spongiosum ichida joylashgan."
  },
  {
    "savol": "Ichki siydik sfinkteri haqida qaysi ma'lumot noto'g'ri?",
    "variantlar": ["Joylashuvi — qovuq bo'yni", "Mushak turi — silliq mushak (detruzorning davomi)", "Nazorat turi — ixtiyoriy", "Avtonom nazorat ostida"],
    "togri": 2,
    "izoh": "Ichki sfinkter avtonom (beixtiyor) nazorat ostida, ixtiyoriy emas. Ixtiyoriy nazorat tashqi sfinkterga tegishli."
  },
  {
    "savol": "Tashqi siydik sfinkteri (rabdosfinkter) qanday mushak turidan iborat va nazorati qanday?",
    "variantlar": ["Silliq mushak, avtonom", "Ko'ndalang-targ'il mushak, ixtiyoriy", "Silliq mushak, ixtiyoriy", "Ko'ndalang-targ'il mushak, avtonom"],
    "togri": 1,
    "izoh": "Tashqi sfinkter ko'ndalang-targ'il (skelet) mushakdan iborat va ixtiyoriy (pudendal nerv orqali somatik) nazorat ostida."
  },
  {
    "savol": "Prostatektomiya operatsiyasi vaqtida qaysi tuzilmaga shikast yetishi siydik tutolmaslikning muhim sababi bo'ladi?",
    "variantlar": ["Ichki siydik sfinkteri", "Tashqi siydik sfinkteri", "Trigone", "Detruzor mushagi"],
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
    "variantlar": ["Qov suyagi orqasidan o'tib, oldingi qin devori bo'ylab vestibulga ochiladi", "To'g'ridan-to'g'ri qovuqdan orqa qin devoriga", "Prostata orqali o'tadi", "Faqat chanoq suyagi ichida joylashgan"],
    "togri": 0,
    "izoh": "Ayol uretrasi qov suyagi orqasidan o'tib, oldingi qin devori bo'ylab pastga tushadi va vestibulga (tashqi jinsiy a'zolar) ochiladi."
  },
  {
    "savol": "Ayol uretrasi distal qismida epiteliy turi qanday o'zgaradi?",
    "variantlar": ["O'tish epiteliysidan yassi epiteliyga", "Yassi epiteliydan o'tish epiteliysiga", "Bezli epiteliydan silindrsimon epiteliyga", "O'zgarmaydi"],
    "togri": 0,
    "izoh": "Ayol uretrasining proksimal qismi o'tish epiteliysi (urotelium), distal qismi esa yassi (squamous) epiteliy bilan qoplangan."
  },
  {
    "savol": "Ayollarda uretraning yopilishiga yordam beradigan tuzilmalar qaysilar?",
    "variantlar": ["Faqat ichki sfinkter", "Uretrovaginal sfinkter va pubokoksigeus mushagi", "Faqat detruzor mushagi", "Verumontanum"],
    "togri": 1,
    "izoh": "Ayollarda uretra yopilishiga uretrovaginal sfinkter va chanoq tubi mushaklari (pubokoksigeus) yordam beradi."
  },
  {
    "savol": "Ayollarda siydik yo'li infeksiyalarining erkaklarga nisbatan ko'proq uchrashining asosiy anatomik sababi nima?",
    "variantlar": ["Uretraning uzunligi va yopiq bo'lishi", "Uretraning qisqaligi va to'g'ridan-to'g'ri tashqariga ochilishi", "Qovuq hajmining kattaligi", "Trigonening yo'qligi"],
    "togri": 1,
    "izoh": "Ayol uretrasi qisqa (~4-5 sm) va tashqi muhitga yaqin ochiladi, shuning uchun bakteriyalar qovuqqa osonroq yetib boradi."
  },
  {
    "savol": "Mikturisiya sikli necha asosiy fazaga bo'linadi?",
    "variantlar": ["Bitta", "Ikki (to'planish/saqlash va chiqarish/bo'shatish)", "Uch", "To'rt"],
    "togri": 1,
    "izoh": "Mikturisiya sikli ikki fazadan iborat: saqlash (to'planish) fazasi va chiqarish (bo'shatish) fazasi."
  },
  {
    "savol": "Chiqarish/bo'shatish fazasida qanday jarayonlar sodir bo'ladi?",
    "variantlar": ["Tashqi sfinkter qisqaradi, detruzor bo'shashadi", "Tashqi sfinkter bo'shashadi, detruzor muvofiqlashtirilgan tarzda qisqaradi", "Ikkalasi ham qisqaradi", "Ikkalasi ham bo'shashadi"],
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
    "variantlar": ["Saqlash fazasida detruzorning beixtiyor qisqarishi", "Detruzor qisqarishi bilan bir vaqtda sfinkterning beixtiyor qisqarishi (odatda nevrologik kasalliklarda)", "Chiqarish fazasida qisqarish kuchining yetarli emasligi", "Uretra qarshiligining oshishi"],
    "togri": 1,
    "izoh": "Detruzor-sfinkter dissinergiyasi — detruzor va sfinkterning bir vaqtda qisqarishi, odatda orqa miya shikastlanishida uchraydi."
  },
  {
    "savol": "Sistoskopiyada trigone asosini qaysi tuzilma tashkil etadi?",
    "variantlar": ["Verumontanum", "Interureteral tizma (Mercier tizmasi)", "Bulbar uretra", "Urakus"],
    "togri": 1,
    "izoh": "Interureteral tizma (Mercier tizmasi) — ikki ureter teshigini bir-biriga bog'laydigan tizma bo'lib, trigonening yuqori chegarasini tashkil etadi."
  },
  {
    "savol": "BOO (Bladder Outlet Obstruction) qanday holatni bildiradi?",
    "variantlar": ["Saqlash fazasida detruzorning beixtiyor qisqarishi", "Uretra/qovuq bo'yni qarshiligi oshishi natijasida siydik oqimiga to'siq", "Chiqarish fazasida qisqarish kuchining yetarli emasligi", "Qovuq va uretraning bir-biriga qarama-qarshi ishlashi"],
    "togri": 1,
    "izoh": "BOO — qovuq chiqish joyi (bo'yin yoki uretra) darajasida siydik oqimiga mexanik yoki funksional to'siq."
  }
]$qovuq_savollar$
WHERE dars_slug = 'qovuq-uretra-tuzilishi';
