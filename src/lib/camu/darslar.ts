export type CamuDars = {
  slug: string
  sarlavha: string
  semestr: 7 | 8
  n: number
  klinik: number
  amaliy: number
  icon: string
  nazariya: string
  adabiyot: { sarlavha: string; muallif: string; yil?: string }[]
  testlar: { savol: string; variantlar: string[]; togri: number; izoh: string }[]
}

export const CAMU_DARSLAR: CamuDars[] = [
  // ── 7-SEMESTR ──────────────────────────────────────────────────────────────
  {
    slug: 'buyrak-anatomiyasi',
    sarlavha: "Buyraklar va siydik yo'llari funksional anatomiyasi va fiziologiyasi",
    semestr: 7, n: 1, klinik: 4, amaliy: 2, icon: '🫁',
    nazariya: `
<h2>Buyraklarning anatomiyasi</h2>
<p>Buyraklar qorin bo'shlig'ining orqa qismida, retroperitoneal joylashgan juft organ. O'rtacha og'irligi 120–170 g, uzunligi 10–12 sm. O'ng buyrak jigar ostida, chap buyrak taloq yonida joylashgan.</p>

<h3>Tuzilishi</h3>
<ul>
  <li><strong>Po'stloq qatlam (cortex)</strong> — glomerulalar va kanalchalar joylashgan</li>
  <li><strong>Mag'iz qatlam (medulla)</strong> — Henle ilmoqlari va yig'uvchi kanalchalar</li>
  <li><strong>Buyrak konus (papilla)</strong> — siydik kichik kosachaga oqadi</li>
</ul>

<h3>Nefron — asosiy funksional birlik</h3>
<p>Har bir buyrakda 1–1,2 mln nefron mavjud. Nefron quyidagi qismlardan iborat:</p>
<ol>
  <li>Bowman kapsulasi + glomerula → <strong>filtratsiya</strong></li>
  <li>Proksimal buralgan kanalcha → <strong>reabsorbsiya</strong> (Na, glukoza, aminokislotalar)</li>
  <li>Henle ilmog'i → <strong>kontsentratsiya</strong></li>
  <li>Distal buralgan kanalcha → <strong>sekretsiya</strong> (H⁺, K⁺)</li>
  <li>Yig'uvchi kanalcha → ADH ta'sirida suv reabsorbsiyasi</li>
</ol>

<h3>Buyrak funksiyalari</h3>
<ul>
  <li>Filtratsiya: sutka bo'yi 180 L ultrafiltrat hosil bo'ladi, 1,5–2 L siydik chiqadi</li>
  <li>Gormonal: renin (RAAS), eritropoietin, D vitamini aktivatsiyasi</li>
  <li>Kislota-ishqor muvozanatini saqlash</li>
</ul>

<h2>Siydik yo'llari</h2>
<p>Siydik yo'llari buyrak kosachasidan boshlanib, siydik chiqaruv teshigigacha davom etadi:</p>
<p><strong>Buyrak kosachasi → siydik pufagi → siydik nayi (ureter) → qovuq (vesica urinaria) → siydik chiqaruv kanali (urethra)</strong></p>

<h3>Ureter</h3>
<ul>
  <li>Uzunligi 25–30 sm, diametri 3–5 mm</li>
  <li>3 ta anatomik torayish: buyrak darvozasi, tos suyagi chekkasi, qovuqqa kirish joyi</li>
  <li>Toshlар ko'pincha shu torayishlarda qolib ketadi</li>
</ul>

<h3>Qovuq (vesica urinaria)</h3>
<ul>
  <li>Sig'imi 250–500 ml</li>
  <li>Trigonum Lieutaudi — ureterlar va uretra oralig'idagi uchburchak</li>
  <li>Ichki sfinkter — silliq muskul (istemsiz), tashqi sfinkter — ko'ndalang muskul (ixtiyoriy)</li>
</ul>
    `,
    adabiyot: [
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
      { sarlavha: "Smith va Tanagho's General Urology", muallif: "Jack McAninch, Tom Lue", yil: "2020" },
      { sarlavha: "Urologiya (darslik)", muallif: "N.A. Lopatkin", yil: "2011" },
      { sarlavha: "Gray's Anatomy — Urinary System", muallif: "Susan Standring", yil: "2016" },
    ],
    testlar: [
      {
        savol: "Har bir buyrakda nechta nefron mavjud?",
        variantlar: ["500 000 tagacha", "1–1,2 million", "2–3 million", "100 000 tagacha"],
        togri: 1,
        izoh: "Har bir buyrakda o'rtacha 1–1,2 million nefron mavjud. Bu buyrakning filtratsiya quvvatini ta'minlaydi.",
      },
      {
        savol: "Sutka bo'yi buyraklarda hosil bo'ladigan ultrafiltrat hajmi qancha?",
        variantlar: ["1–2 litr", "10–20 litr", "180 litr", "500 litr"],
        togri: 2,
        izoh: "Glomerulada sutka bo'yi 180 L ultrafiltrat hosil bo'ladi, lekin kanalchalarda reabsorbsiya natijasida faqat 1,5–2 L siydik chiqadi.",
      },
      {
        savol: "Ureterning anatomik torayishlari qayerda joylashgan?",
        variantlar: [
          "Buyrak darvozasi, tos suyagi chekkasi, qovuqqa kirish joyi",
          "Buyrak kosachasi, Henle ilmog'i, siydik kanali",
          "Proksimal kanalcha, distal kanalcha, yig'uvchi kanalcha",
          "Bowman kapsulasi, glomerula, ureteropelvik birikmada",
        ],
        togri: 0,
        izoh: "Ureterda 3 ta anatomik torayish mavjud: buyrak darvozasi, tos suyagi chekkasi va qovuqqa kirish joyi. Toshlar ko'pincha shu joylarda qolib ketadi.",
      },
      {
        savol: "Qovuqning me'yoriy sig'imi qancha?",
        variantlar: ["50–100 ml", "250–500 ml", "1–2 litr", "100–150 ml"],
        togri: 1,
        izoh: "Qovuqning me'yoriy sig'imi 250–500 ml. 150–200 ml suyuqlik to'planganda siydik qilish istagi paydo bo'ladi.",
      },
      {
        savol: "Buyrak qaysi gormonni ishlab chiqaradi va u qon ishlab chiqarishga ta'sir qiladi?",
        variantlar: ["Aldosteron", "ADH (vazopresin)", "Eritropoietin", "Kortizol"],
        togri: 2,
        izoh: "Buyrak peritubular hujayralarida ishlab chiqariladigan eritropoietin (EPO) suyak ko'migida eritrotsitlar hosil bo'lishini rag'batlantiradi.",
      },
    ],
  },

  {
    slug: 'urologik-kasalliklar',
    sarlavha: "Urologik kasalliklar simptomlari, tashxislash usullari, davolash va asoratlari",
    semestr: 7, n: 2, klinik: 4, amaliy: 2, icon: '🔬',
    nazariya: `
<h2>Urologik kasalliklarning asosiy simptomlari</h2>

<h3>Siydik chiqarish buzilishlari (LUTS)</h3>
<ul>
  <li><strong>Dizuriya</strong> — siydik chiqarishda og'riq yoki achishish</li>
  <li><strong>Pollakiuriya</strong> — tez-tez siydik chiqarish (&gt;8 marta/kun)</li>
  <li><strong>Nikturiya</strong> — tungi siydik chiqarish (&gt;2 marta)</li>
  <li><strong>Urgensiya</strong> — to'satdan kuchli siydik qilish istagi</li>
  <li><strong>Ishuriya</strong> — siydik ushlash (to'liq yoki qisman)</li>
  <li><strong>Enurез</strong> — siydik tutilmaslik</li>
</ul>

<h3>Og'riq sindromlari</h3>
<ul>
  <li><strong>Buyrak og'rig'i (kolik)</strong> — bel sohasida kuchli, to'lqinsimon og'riq, chov va jinsiy a'zolarga tarqaladi</li>
  <li><strong>Qovuq og'rig'i</strong> — qorinning pastki qismida, siydik qilgandan keyin kuchayadi</li>
  <li><strong>Prostat og'rig'i</strong> — chanoq sohasida, to'g'ri ichak va urethraga tarqalishi mumkin</li>
</ul>

<h3>Siydik o'zgarishlari</h3>
<ul>
  <li><strong>Gematuriya</strong> — siydikda qon (mikroskopik: ≥3 eritrotsit/maydon; makroskopik: ko'zga ko'rinadi)</li>
  <li><strong>Piuriya</strong> — siydikda yiring (≥10 leykotsit/maydon)</li>
  <li><strong>Proteinuriya</strong> — siydikda oqsil (&gt;150 mg/kun patologik)</li>
  <li><strong>Silindruriya</strong> — siydikda silindrlar (glomerulonefrit belgisi)</li>
</ul>

<h2>Tashxislash usullari</h2>

<h3>Laborator tekshiruvlar</h3>
<ul>
  <li>Umumiy siydik tahlili (UST) + siydik madaniyati</li>
  <li>Qon kreatinini, siydik kislotasi, elektrolitar</li>
  <li>PSA (prostata spetsifik antigeni)</li>
</ul>

<h3>Instrumental tekshiruvlar</h3>
<ul>
  <li><strong>USI (ultratovush)</strong> — birinchi qadam, xavfsiz, arzon</li>
  <li><strong>KT (kompyuter tomografiya)</strong> — toshlar, o'smalar, jarohatlar</li>
  <li><strong>MRT</strong> — yumshoq to'qimalar, prostata, qovuq</li>
  <li><strong>Tsistoskopiya</strong> — qovuq ichini ko'rish, biopSiya</li>
  <li><strong>Uroflowmetriya</strong> — siydik oqimining tezligi va hajmi</li>
</ul>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Urological Infections", muallif: "European Association of Urology", yil: "2024" },
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
      { sarlavha: "Oxford Handbook of Urology", muallif: "Reynard, Brewster, Bhatt", yil: "2019" },
    ],
    testlar: [
      {
        savol: "Makroskopik gematuriya uchun siydikdagi eng kam eritrotsit soni qancha?",
        variantlar: ["1 ta/maydon", "3 ta/maydon", "Ko'zga ko'rinadi", "10 ta/maydon"],
        togri: 2,
        izoh: "Makroskopik gematuriya — ko'zga ko'rinadigan qonli siydik. Mikroskopik gematuriya esa mikroskop ostida ≥3 eritrotsit/maydon topilganda aniqlanadi.",
      },
      {
        savol: "Buyrak kolik og'rig'ining xarakterli belgilari qaysilar?",
        variantlar: [
          "Doimiy, o'tkir og'riq, tana harorati ko'tariladi",
          "To'lqinsimon, kuchli og'riq, chov va jinsiy a'zolarga tarqaladi",
          "Faqat siydik qilganda og'riq",
          "Qorinning o'rta qismida, ovqatdan keyin kuchayadi",
        ],
        togri: 1,
        izoh: "Buyrak koligi to'lqinsimon, o'ta kuchli og'riq bo'lib, bel sohasidan chov, tos va jinsiy a'zolarga tarqaladi. Bemorlar tinchi yo'qolib u yoqdan bu yoqqa o'giriladi.",
      },
      {
        savol: "Urologik tekshiruvlarda birinchi navbatda qo'llaniladigan instrumental usul qaysi?",
        variantlar: ["KT", "MRT", "USI (ultratovush)", "Tsistoskopiya"],
        togri: 2,
        izoh: "USI (ultratovush) xavfsizligi, arzonligi va keng mavjudligi tufayli birinchi qadam hisoblanadi. Radiatsiyasiz va tezda ko'proq ma'lumot beradi.",
      },
    ],
  },

  {
    slug: 'pielonefrit',
    sarlavha: "O'tkir pielonefrit. Pielonefritning asoratlari. Surunkali pielonefrit",
    semestr: 7, n: 3, klinik: 4, amaliy: 2, icon: '🦠',
    nazariya: `
<h2>O'tkir pielonefrit</h2>
<p>O'tkir pielonefrit — buyrak to'qimasi va buyrak tos-kosachasi tizimining bakterial yallig'lanishi.</p>

<h3>Epidemiologiya</h3>
<ul>
  <li>Ayollarda 5 baravar ko'p (qisqa uretra)</li>
  <li>Asosiy qo'zg'atuvchi: E. coli (80%), Klebsiella, Proteus, Enterococcus</li>
</ul>

<h3>Klassifikatsiya</h3>
<ul>
  <li><strong>Asoratlanmagan</strong> — anatomik o'zgarishsiz, sog'lom immunitet</li>
  <li><strong>Asoratlangan</strong> — tosh, to'siq, qandli diabet, homiladorlik, immunosupressiya</li>
</ul>

<h3>Klinik manzara</h3>
<ul>
  <li>Tana harorati &gt;38°C (titroq bilan)</li>
  <li>Bel og'rig'i (bir tomonlama yoki ikki tomonlama)</li>
  <li>Dizuriya, pollakiuriya</li>
  <li>Ko'ngil aynish, qusish</li>
  <li>Pasternatsky simptomi musbat (qovurg'a-umurtqa burchagida urilganda og'riq)</li>
</ul>

<h3>Diagnostika</h3>
<ul>
  <li>UST: leykotsitoz, piuriya, bakteriuriya (&gt;10⁵ KOE/ml)</li>
  <li>Qon: leykotsitoz, CRP ko'tarilgan, ESR tezlashgan</li>
  <li>USI: buyrak kattalashgan, parenxima zichligi pasaygan</li>
  <li>KT (kontrast): absess, obstruksiyani aniqlash uchun</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li>Asoratlanmagan: og'iz yo'li antibiotik 7–14 kun (fluoroxinolon, amoksiklav)</li>
  <li>Asoratlangan: vena ichiga antibiotik + to'siqni bartaraf etish</li>
</ul>

<h2>Asoratlar</h2>
<h3>Buyrak absessi</h3>
<p>Buyrak to'qimasida yiringli bo'shliq. KT da yumaloq, suyuq ichli tuzilma. Davolash: KT ostida drenaj yoki jarrohlik.</p>

<h3>Karbunkul</h3>
<p>Buyrak po'stlog'idagi ko'p markazli yiringli-nekrotik yallig'lanish. Ko'pincha staphylococcus aureus. Jarrohlik kerak.</p>

<h3>Paranefrit</h3>
<p>Perinefral yog' to'qimasining yallig'lanishi. Birlamchi (hematogen) yoki ikkilamchi (buyrakdan tarqalgan). USI va KT da perirenал infiltrat ko'rinadi.</p>

<h2>Surunkali pielonefrit</h2>
<p>O'tkir pielonefritning 3 oydan ortiq davom etishi yoki takrorlanishi. Buyrak to'qimasining progressiv fibrozi va atrofiyasi rivojlanadi.</p>
<ul>
  <li>Klinik: past darajali isitma, bel og'rig'i, proteinuriya, arterial gipertenziya</li>
  <li>Oqibat: surunkali buyrak yetishmovchiligi (CKD)</li>
</ul>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Urological Infections", muallif: "European Association of Urology", yil: "2024" },
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
      { sarlavha: "Urologiya (darslik)", muallif: "N.A. Lopatkin", yil: "2011" },
    ],
    testlar: [
      {
        savol: "O'tkir pielonefritning eng keng tarqalgan qo'zg'atuvchisi?",
        variantlar: ["Staphylococcus aureus", "Klebsiella pneumoniae", "Escherichia coli", "Pseudomonas aeruginosa"],
        togri: 2,
        izoh: "E. coli barcha o'tkir pielonefrit hollrining 80% sababchisi. U uretradan ascend yo'l bilan ko'tariladi.",
      },
      {
        savol: "Pasternatsky simptomi nima?",
        variantlar: [
          "Qorin palpatsiyasida og'riq",
          "Qovurg'a-umurtqa burchagini urilganda og'riq",
          "Siydik qilganda kuchli og'riq",
          "Tana harorati ko'tarilishi",
        ],
        togri: 1,
        izoh: "Pasternatsky simptomi — qovurg'a-umurtqa burchagiga mushtlab urilganda paydo bo'ladigan og'riq. Bu buyrak yallig'lanishi uchun xarakterli.",
      },
      {
        savol: "Asoratlanmagan o'tkir pielonefritda antibiotik kursi qancha davom etishi kerak?",
        variantlar: ["3 kun", "5 kun", "7–14 kun", "1 oy"],
        togri: 2,
        izoh: "EAU qo'llanmasiga ko'ra asoratlanmagan o'tkir pielonefrit 7–14 kun davomida antibiotik bilan davolanadi. Qisqa kurs yetarli emas.",
      },
      {
        savol: "Buyrak karbunkuli uchun qaysi qo'zg'atuvchi eng xarakterli?",
        variantlar: ["E. coli", "Staphylococcus aureus", "Proteus mirabilis", "Enterococcus faecalis"],
        togri: 1,
        izoh: "Karbunkul ko'pincha Staphylococcus aureus tomonidan kelib chiqadi va hematogen yo'l bilan tarqaladi (teri infeksiyasi, furunkulez).",
      },
    ],
  },

  {
    slug: 'sistit-prostatit',
    sarlavha: "O'tkir va surunkali sistit. Prostatit kasalliklari",
    semestr: 7, n: 4, klinik: 2, amaliy: 4, icon: '🧫',
    nazariya: `
<h2>Sistit</h2>
<p>Sistit — qovuq shilliq pardasining yallig'lanishi. Ayollarda juda keng tarqalgan (50% ayol umrida kamida bir marta o'tkazadi).</p>

<h3>Klassifikatsiya</h3>
<ul>
  <li>O'tkir / surunkali</li>
  <li>Asoratlanmagan / asoratlangan</li>
  <li>Birlamchi / ikkilamchi</li>
</ul>

<h3>Klinik belgilari</h3>
<ul>
  <li>Dizuriya (siydik qilganda achishish)</li>
  <li>Pollakiuriya (tez-tez siydik)</li>
  <li>Urgensiya (keskin siydik istagi)</li>
  <li>Suprapubik og'riq</li>
  <li>Makroskopik gematuriya (oxirgi tomchilar qonli)</li>
  <li>Isitma ODAтДА YO'Q (bo'lsa pielonefrit shubhasi)</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li>Ayollarda uncomplicated: Fosfomitsin 3 g bir marta yoki Nitrofurantoin 5–7 kun</li>
  <li>Erkaklar va asoratlangan: 7–14 kun fluoroxinolon</li>
</ul>

<h2>Prostatit</h2>
<p>NIH klassifikatsiyasi (1999):</p>
<ul>
  <li><strong>I tur</strong> — O'tkir bakterial prostatit</li>
  <li><strong>II tur</strong> — Surunkali bakterial prostatit</li>
  <li><strong>III tur</strong> — Surunkali chanoq og'rig'i sindromi (CPPS): IIIa yallig'langan, IIIb yallig'lanmagan</li>
  <li><strong>IV tur</strong> — Asimptomatik yallig'langan prostatit</li>
</ul>

<h3>O'tkir bakterial prostatit (I tur)</h3>
<ul>
  <li>Klinik: yuqori isitma, tütrоq, chov og'rig'i, dizuriya, siydik to'xtashi</li>
  <li>Rektal tekshiruvda: prostata og'riqli, bo'rtgan, qaynoq</li>
  <li>MASSAJ QILMANG — bakteriemiya xavfi!</li>
  <li>Davolash: vena ichiga antibiotik (ftorxinolon + metronidazol)</li>
</ul>

<h3>NIH-CPSI (Surunkali Prostatit Simptom Indeksi)</h3>
<p>Og'riq (0–21) + Siydik (0–10) + Sifat (0–12) = Jami 0–43 ball</p>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Urological Infections", muallif: "EAU", yil: "2024" },
      { sarlavha: "NIH Classification of Prostatitis", muallif: "Krieger et al.", yil: "1999" },
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
    ],
    testlar: [
      {
        savol: "O'tkir bakterial prostatitda rektal massaj nima uchun man etiladi?",
        variantlar: [
          "Og'riqni kuchaytiradi",
          "Bakteriemiya va sepsis xavfi tug'diradi",
          "Siydik to'xtashiga olib keladi",
          "Diagnostik ahamiyati yo'q",
        ],
        togri: 1,
        izoh: "O'tkir prostatitda massaj prostata tarkibidagi bakteriyalarni qon oqimiga chiqarib yuborishi mumkin — bu sepsis va septik shok xavfini oshiradi.",
      },
      {
        savol: "NIH prostatit klassifikatsiyasida III tur nima?",
        variantlar: [
          "O'tkir bakterial prostatit",
          "Surunkali bakterial prostatit",
          "Surunkali chanoq og'rig'i sindromi (CPPS)",
          "Asimptomatik yallig'langan prostatit",
        ],
        togri: 2,
        izoh: "III tur — CPPS (Chronic Pelvic Pain Syndrome) — bakteriyalar aniqlanmaydi, lekin chanoq og'rig'i va siydik buzilishlari 3 oydan ortiq davom etadi.",
      },
      {
        savol: "Asoratlanmagan sistitda ayollar uchun birinchi tanlov antibiotigi?",
        variantlar: ["Amoksisilin", "Fosfomitsin 3 g bir marta", "Siprofloksatsin 14 kun", "Azitromitsin"],
        togri: 1,
        izoh: "Fosfomitsin trometamol 3 g bir martalik doza — asoratlanmagan tsistit uchun samarali, qulay va rezistentlik kam. EAU qo'llanmasida birinchi qatorda.",
      },
    ],
  },

  {
    slug: 'uretrit-orxit',
    sarlavha: "Uretrit, orxit va epididimit kasalliklari",
    semestr: 7, n: 5, klinik: 4, amaliy: 2, icon: '🩺',
    nazariya: `
<h2>Uretrit</h2>
<p>Uretra shilliq pardasining yallig'lanishi. Asosan jinsiy yo'l bilan yuqadigan infeksiyalar.</p>

<h3>Turlari</h3>
<ul>
  <li><strong>Gonoreyli uretrit</strong> — Neisseria gonorrhoeae; inkubatsiya 2–5 kun; quyuq sariq-yashil oqindi</li>
  <li><strong>Gonoreyasiz uretrit (NGU)</strong> — Chlamydia trachomatis (50%), Ureaplasma, Mycoplasma; suvsimon oqindi</li>
</ul>

<h3>Klinik</h3>
<ul>
  <li>Dizuriya, achishish</li>
  <li>Uretradan oqindi</li>
  <li>Ertalab "tomchi" belgisi (gonoreya)</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li>Gonoreya: Seftriakson 500 mg i/m bir marta + Azitromitsin 1 g</li>
  <li>NGU (xlamidiya): Azitromitsin 1 g bir marta yoki Doksisiklin 7 kun</li>
</ul>

<h2>Epididimit</h2>
<p>Uydirmaning yallig'lanishi. Yoshlarda &lt;35 yosh — ko'pincha xlamidiya/gonoreya. Kattalarda &gt;35 yosh — E. coli, gram-manfiy bakteriyalar.</p>

<h3>Klinik</h3>
<ul>
  <li>Asta-sekin boshlanadigan uydirma og'rig'i va shishi</li>
  <li>Prehn belgisi musbat (uydirmani ko'targanda og'riq kamayadi) — orxitdan farqi</li>
  <li>Isitma, piuriya</li>
</ul>

<h2>Orxit</h2>
<p>Moya to'qimasining yallig'lanishi. Ko'pincha epididimitdan tarqaladi (epididimo-orxit). Izolyatsiyalangan orxit — virusli (parotit — "bolalar kasalligi").</p>

<h3>Parotit orxiti</h3>
<ul>
  <li>Balog'atga yetgan erkaklar parotit o'tkazsa 20–30% orxit rivojlanadi</li>
  <li>Bilateral bo'lsa bepushtlik xavfi bor</li>
  <li>Davolash: simptomatik (NSAIDs, ко'tarish)</li>
</ul>

<h3>Prehn va Brunzel belgilarini farqlash</h3>
<table>
  <tr><th>Belgi</th><th>Epididimit</th><th>Moya buralishi</th></tr>
  <tr><td>Prehn belgisi</td><td>Musbat (og'riq kamayadi)</td><td>Manfiy (og'riq kuchayadi)</td></tr>
  <tr><td>Boshlanishi</td><td>Asta-sekin</td><td>To'satdan</td></tr>
  <tr><td>Yoshi</td><td>Har qanday</td><td>Ko'pincha o'smirlar</td></tr>
</table>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Urological Infections", muallif: "EAU", yil: "2024" },
      { sarlavha: "WHO Guidelines for the Treatment of Neisseria gonorrhoeae", muallif: "WHO", yil: "2016" },
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
    ],
    testlar: [
      {
        savol: "Gonoreyli uretrit uchun birinchi tanlov davolash rejimi?",
        variantlar: [
          "Azitromitsin 1 g bir marta",
          "Seftriakson 500 mg i/m + Azitromitsin 1 g",
          "Doksisiklin 7 kun",
          "Siprofloksatsin 3 kun",
        ],
        togri: 1,
        izoh: "Hozirda gonoreya seftriaksonga sezgir, shuning uchun seftriakson 500 mg i/m + azitromitsin 1 g kombinatsiyasi tavsiya etiladi. Xlamidiyani ham qoplash maqsadida birgalikda beriladi.",
      },
      {
        savol: "Prehn belgisi musbat bo'lganda qaysi kasallik ehtimoli yuqori?",
        variantlar: ["Moya buralishi (torsiya)", "Epididimit", "Orxialgiya", "Gidrosele"],
        togri: 1,
        izoh: "Prehn belgisi — uydirmani ko'tarvganda og'riq kamayishi — epididimit uchun xarakterli. Moya buralishida esa ko'targanda og'riq kuchayadi (manfiy Prehn).",
      },
      {
        savol: "Izolyatsiyalangan virusli orxitning eng keng tarqalgan sababi?",
        variantlar: ["Chlamydia trachomatis", "E. coli", "Parotit virusi (epidemik parotit)", "Herpes simplex"],
        togri: 2,
        izoh: "Epidemik parotit (svinya grippi) virusi balog'atga yetgan erkak uchun xavfli — 20–30% hollarda orxit rivojlanadi. Bilateral bo'lsa bepushtlikka olib kelishi mumkin.",
      },
    ],
  },

  // ── 8-SEMESTR ──────────────────────────────────────────────────────────────
  {
    slug: 'varikotsele-peyroni',
    sarlavha: "Varikotsele. Peyroni kasalligi. Orxialgiya",
    semestr: 8, n: 1, klinik: 4, amaliy: 2, icon: '🔵',
    nazariya: `
<h2>Varikotsele</h2>
<p>Moyaning venoz chigal (pampiniform plexus) varикоzli kengayishi. Chapda 90% hollarda (chap testis venasi 90° burchak ostida chap buyrak venasiga quyiladi).</p>

<h3>Klinik klassifikatsiya</h3>
<ul>
  <li><strong>I daraja</strong> — faqat Valsalva sinamasi paytida seziladi</li>
  <li><strong>II daraja</strong> — palpatsiyada (tik turganida) aniqlanadi</li>
  <li><strong>III daraja</strong> — ko'zga ko'rinadi ("qurt to'dasi" manzarasi)</li>
</ul>

<h3>Muammolar</h3>
<ul>
  <li>Bepushtlik (35–40% infertil erkaklarda varikotsele bor)</li>
  <li>Moya atrofiyasi</li>
  <li>Og'riq (chov, uydirma sohasida)</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li>Varikotselectomiya — laparoskopik yoki Marmara usuli (inguinal)</li>
  <li>Perkutan embolizatsiya</li>
  <li>Ko'rsatma: og'riq, atrofiya, bepushtlik, o'spirin (<18 yosh, atrofiya bor)</li>
</ul>

<h2>Peyroni kasalligi</h2>
<p>Olatning oq pardasi (tunica albuginea) fibroplazmasi — qattiq fibrotik plaklar hosil bo'ladi, bu ereksiyada egrilishga olib keladi.</p>

<h3>Klinik</h3>
<ul>
  <li>Ereksiyada og'riq (o'tkir faza)</li>
  <li>Olat egrilishi &gt;30° — jinsiy aloqa qiyinlashadi</li>
  <li>Palpatsiyada qattiq plak</li>
  <li>Erektil disfunksiya bilan birgalikda bo'lishi mumkin</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li>O'tkir faza (&lt;12 oy): kollagenaza Clostridium histolyticum (Xiapex) injeksiyasi</li>
  <li>Surunkali faza: jarrohlik (Nesbit plastikasi, incision/grafting)</li>
</ul>

<h2>Orxialgiya</h2>
<p>Uydirma og'rig'i &gt;3 oy davom etsa surunkali orxialgiya. Ko'pincha sababsiz (idiopatik). Differensial tashxis: torsiya, epididimit, varikotsele, kasiqda siydik toshi.</p>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Male Infertility", muallif: "EAU", yil: "2024" },
      { sarlavha: "EAU Guidelines on Peyronie's Disease", muallif: "EAU", yil: "2024" },
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
    ],
    testlar: [
      {
        savol: "Nima uchun varikotsele chapda ko'proq uchraydi?",
        variantlar: [
          "Chap moya kattaroq bo'ladi",
          "Chap testis venasi 90° burchak ostida chap buyrak venasiga quyiladi",
          "Chap tomonda qon bosimi yuqori",
          "O'ng tomondan limfa tugunlari siqadi",
        ],
        togri: 1,
        izoh: "Chap testis venasi to'g'ri burchak (90°) ostida chap buyrak venasiga quyilgani sababli venoz bosim yuqori bo'ladi va qon oqimi qiyinlashadi. O'ng testis venasi qiya burchakda pastki kovak venaga quyiladi.",
      },
      {
        savol: "Peyroni kasalligida birinchi tanlov dori davolash (o'tkir fazada) qaysi?",
        variantlar: [
          "Sildenanil (Viagra)",
          "Kollagenaza Clostridium histolyticum (Xiapex) injeksiyasi",
          "Testosteron terapiyasi",
          "NSAIDs monoterapiyasi",
        ],
        togri: 1,
        izoh: "O'tkir fazada (&lt;12 oy) plak hali yumshoq bo'lganda kollagenaza injeksiyasi (Xiapex) FDA tomonidan tasdiqlangan birinchi tanlov davodir.",
      },
    ],
  },

  {
    slug: 'bepushtlik-erektil',
    sarlavha: "Erkaklar bepushtligi. Erektil disfunksiya",
    semestr: 8, n: 2, klinik: 4, amaliy: 2, icon: '🧬',
    nazariya: `
<h2>Erkaklar bepushtligi</h2>
<p>Juftlik 12 oy himoyasiz jinsiy aloqadan keyin homila bo'lmasa bepushtlik deyiladi. 50% hollarda erkaklar omili mavjud.</p>

<h3>Sabablar (WHO klassifikatsiyasi)</h3>
<ul>
  <li><strong>Pretestikular</strong> — gipotalamus/gipofiz buzilishi (FSH, LH kamligi)</li>
  <li><strong>Testikular</strong> — spermatogenez buzilishi (azoospermiya, oligozoospermiya)</li>
  <li><strong>Posttestikular</strong> — obstruksiya (vas deferens yo'qligi, epididimit asoratlari)</li>
</ul>

<h3>Spermogramma normasi (WHO 2021)</h3>
<ul>
  <li>Hajm: ≥1,4 ml</li>
  <li>Soni: ≥16 mln/ml (jami ≥39 mln)</li>
  <li>Harakatchanlik: ≥42% (progressiv ≥30%)</li>
  <li>Morfologiya: ≥4% normal shakl (Kruger)</li>
</ul>

<h2>Erektil Disfunksiya (ED)</h2>
<p>Ereksiyani qo'lga kiritish yoki saqlashning doimiy qobiliyatsizligi (≥6 oy). 40–70 yosh erkaklar orasida 52% da uchraydi.</p>

<h3>Etiologiya</h3>
<ul>
  <li><strong>Organik</strong> (80%): vaskulyar (eng keng tarqalgan), neyrogen, gormonal, anatomik</li>
  <li><strong>Psixogen</strong> (20%): tashvish, depressiya, munosabat muammolari</li>
</ul>

<h3>IIEF-5 so'rovnomasi (0–25 ball)</h3>
<ul>
  <li>22–25: Normal</li>
  <li>17–21: Yengil ED</li>
  <li>12–16: Yengil-o'rtacha</li>
  <li>8–11: O'rtacha</li>
  <li>5–7: Og'ir ED</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li>1-bosqich: PDE5 ingibitorlari (sildenanil, tadalanil, vardenanil)</li>
  <li>2-bosqich: Vakuum qurilma, intrakaverner injeksiya</li>
  <li>3-bosqich: Penile implant</li>
</ul>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Male Infertility", muallif: "EAU", yil: "2024" },
      { sarlavha: "EAU Guidelines on Erectile Dysfunction", muallif: "EAU", yil: "2024" },
      { sarlavha: "WHO Laboratory Manual for Semen Examination", muallif: "WHO", yil: "2021" },
    ],
    testlar: [
      {
        savol: "WHO 2021 spermogramma normasi bo'yicha minimal spermatozoid soni qancha?",
        variantlar: ["5 mln/ml", "10 mln/ml", "16 mln/ml", "20 mln/ml"],
        togri: 2,
        izoh: "WHO 2021 yangilangan normada minimal spermatozoid soni ≥16 mln/ml (jami ejakulatda ≥39 mln). Oldingi norma 20 mln/ml edi.",
      },
      {
        savol: "IIEF-5 = 14 ball. Bu qaysi darajadagi ED?",
        variantlar: ["Normal", "Yengil", "Yengil-o'rtacha", "Og'ir"],
        togri: 2,
        izoh: "IIEF-5 bo'yicha: 12–16 ball = yengil-o'rtacha ED. 17–21 = yengil, 8–11 = o'rtacha, 5–7 = og'ir.",
      },
      {
        savol: "Erektil disfunksiyada eng keng tarqalgan sabab?",
        variantlar: ["Psixogen omil", "Vaskulyar omil", "Gormonal omil", "Neyrogen omil"],
        togri: 1,
        izoh: "Organik ED ning 80%ini vaskulyar sabab tashkil etadi — arteriyalar aterosklerozi va venoz yetishmovchilik. Shuning uchun ED yurak-qon tomir kasalliklarining erta belgisi hisoblanishi mumkin.",
      },
    ],
  },

  {
    slug: 'prostata-giperplaziyasi',
    sarlavha: "Prostata bezi xavfsiz giperplaziyasi (BPG/BPH)",
    semestr: 8, n: 3, klinik: 2, amaliy: 4, icon: '🫘',
    nazariya: `
<h2>Prostata bezi xavfsiz giperplaziyasi</h2>
<p>BPH — prostataning tranzitor zonasida bezli va fibromushakli elementlarning ko'payishi. 50 yoshdan so'ng 50%, 80 yoshga kelib 90% erkakda uchraydi.</p>

<h3>Patogenez</h3>
<ul>
  <li>Dihidrotestosteron (DHT) — 5α-reduktaza ta'sirida testosterondan hosil bo'ladi</li>
  <li>DHT prostatada stromal va bezli o'sishni rag'batlantiradi</li>
  <li>Simptomlar: mexanik (uretra siqilishi) + dinamik (alfa-adrenergik tonus)</li>
</ul>

<h3>LUTS simptomlari</h3>
<ul>
  <li>Obstruktiv: kuchlanib siydik qilish, kech boshlash, uziq-uziq oqish, to'liq bo'shalmaslik hissi</li>
  <li>Irritatif: pollakiuriya, nikturiya, urgensiya</li>
</ul>

<h3>IPSS so'rovnomasi</h3>
<ul>
  <li>0–7: Yengil</li>
  <li>8–19: O'rtacha</li>
  <li>20–35: Og'ir</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li><strong>Kuzatish</strong> — IPSS &lt;8, hayot sifati yaxshi</li>
  <li><strong>Alpha-1-blokerlar</strong> (tamsulosin, alfuzosin) — tez ta'sir, siydik oqimini yaxshilaydi</li>
  <li><strong>5α-reduktaza ingibitorlari</strong> (finasterid, dutasterid) — prostata hajmini kamaytiradi, sekin ta'sir (3–6 oy)</li>
  <li><strong>Kombinatsiya</strong> — katta prostata, og'ir simptomlar</li>
  <li><strong>Jarrohlik: TURP</strong> (transurethral resection) — oltin standart</li>
</ul>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Non-neurogenic Male LUTS", muallif: "EAU", yil: "2024" },
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
      { sarlavha: "AUA Guideline: BPH/LUTS", muallif: "American Urological Association", yil: "2023" },
    ],
    testlar: [
      {
        savol: "BPH patogenezida asosiy rol o'ynaydigan gormon?",
        variantlar: ["Testosteron", "Estrogen", "Dihidrotestosteron (DHT)", "FSH"],
        togri: 2,
        izoh: "DHT (dihidrotestosteron) 5α-reduktaza fermenti yordamida testosterondan hosil bo'ladi va prostatadagi androgen retseptorlarga bog'lanib o'sishni rag'batlantiradi.",
      },
      {
        savol: "IPSS = 22 ball. Davolash taktikasi?",
        variantlar: [
          "Faqat kuzatish",
          "Alfa-bloker monoterapiyasi",
          "Faol medikamentoz yoki jarrohlik davolash",
          "Hayot tarzi o'zgartirishlar",
        ],
        togri: 2,
        izoh: "IPSS 20–35 = og'ir simptomlar. Bu holda faol davolash — kombinatsion medikamentoz yoki TURP jarrohlik tavsiya etiladi.",
      },
      {
        savol: "BPH da jarrohlik oltin standarti qaysi?",
        variantlar: ["Laparoskopik prostatektomiya", "TURP (transurethral resection)", "Ochiq prostatektomiya", "Lazer ablatsiya"],
        togri: 1,
        izoh: "TURP (transurethral resection of the prostate) — dünyo bo'ylab BPH jarrohligining oltin standarti. Minimal invaziv, samarali, kam asorat.",
      },
    ],
  },

  {
    slug: 'siydik-tosh',
    sarlavha: "Siydik tosh kasalligi (urolitiaz)",
    semestr: 8, n: 4, klinik: 2, amaliy: 4, icon: '💎',
    nazariya: `
<h2>Siydik tosh kasalligi (Urolitiaz)</h2>
<p>Siydik yo'llarida mineral tuzlar va organik moddalar yig'ilishi natijasida toshlar hosil bo'lishi. Umumiy aholi orasida 10–12% tarqalgan, erkaklar 3 marta ko'p.</p>

<h3>Tosh tarkibi</h3>
<ul>
  <li><strong>Kalsiy oksalat</strong> (80%) — eng keng tarqalgan, KT da ko'rinadi</li>
  <li><strong>Struvit</strong> (infeksiya toshi) — Mg-NH4-PO4, shoxsimon tosh, infeksiya bilan bog'liq</li>
  <li><strong>Siydik kislotasi</strong> (10%) — KT da ko'rinmaydi, ishqorlash bilan eriydi</li>
  <li><strong>Sistein</strong> (1%) — irsiy, yoshlarda</li>
</ul>

<h3>Buyrak kolik — klinik</h3>
<ul>
  <li>To'satdan boshlanuvchi o'ta kuchli bel og'rig'i</li>
  <li>Chov, son ichki tomoni, jinsiy a'zolarga tarqaladi</li>
  <li>Ko'ngil aynish, qusish</li>
  <li>Bemor tinchhamas, u yoqdan bu yoqqa o'giriladi (peritonit bemoridan farqi)</li>
  <li>Gematuriya (makro yoki mikro)</li>
</ul>

<h3>Tashxis</h3>
<ul>
  <li><strong>KT (kontrast bermasdan)</strong> — oltin standart, barcha tosh turlarini ko'rsatadi</li>
  <li>USI — homilador ayollarda, bolalarda birinchi tanlov</li>
  <li>Rentgen — siydik kislotasi toshini ko'rsatmaydi</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li>&lt;5 mm: kutish (70–80% o'z-o'zidan tushadi) + alfa-bloker (tamsulosin)</li>
  <li>5–10 mm: ESWL (extracorporeal shock wave lithotripsy)</li>
  <li>&gt;10 mm: ureteroskopiya yoki PCNL (buyrak uchun)</li>
</ul>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Urolithiasis", muallif: "EAU", yil: "2024" },
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
    ],
    testlar: [
      {
        savol: "Eng keng tarqalgan siydik toshi turi?",
        variantlar: ["Struvit", "Siydik kislotasi", "Kalsiy oksalat", "Sistein"],
        togri: 2,
        izoh: "Kalsiy oksalat toshi barcha urolitiazning 80% ini tashkil etadi. KT da yaqqol ko'rinadi va soya beradi.",
      },
      {
        savol: "Urolitiaz tashxisida oltin standart qaysi?",
        variantlar: ["Ko'krak qafasi rentgeni", "USI", "Kontrastsiz KT", "MRT"],
        togri: 2,
        izoh: "Kontrastsiz KT (non-contrast CT) barcha tosh turlarini ko'rsatadi (siydik kislotasi toshini ham), sezgirligi 97%, o'ziga xosligi 96%. Hozirgi oltin standart.",
      },
      {
        savol: "5 mm ureter toshida birinchi davolash taktikasi?",
        variantlar: [
          "Darhol ureteroskopiya",
          "Kutish + alfa-bloker (tamsulosin)",
          "ESWL",
          "Ochiq jarrohlik",
        ],
        togri: 1,
        izoh: "&lt;5 mm toshlarning 70–80% i 4 hafta ichida o'z-o'zidan tushadi. Alfa-bloker (tamsulosin) ureter silliq muskulini bo'shashtiradi va tosh tushishini tezlashtiradi.",
      },
    ],
  },

  {
    slug: 'urologik-jarohatlar',
    sarlavha: "Buyraklar, siydik yo'llari va erkaklar jinsiy a'zolari jarohatlari",
    semestr: 8, n: 5, klinik: 4, amaliy: 2, icon: '🏥',
    nazariya: `
<h2>Buyrak jarohatlari</h2>
<p>AAST klassifikatsiyasi (I–V daraja):</p>
<ul>
  <li><strong>I</strong> — kontuziya yoki subkapsular gematoma, laserasiya &lt;1 sm</li>
  <li><strong>II</strong> — gematoma, laserasiya 1–3 sm, kolleksion sistemaga yetmaydi</li>
  <li><strong>III</strong> — laserasiya &gt;3 sm</li>
  <li><strong>IV</strong> — kolleksion sistemaga yetadi, buyrak arteriya/venasiga yetadi</li>
  <li><strong>V</strong> — buyrak parchalanishi, hilum jarohati</li>
</ul>

<h3>Tashxis</h3>
<ul>
  <li>KT (kontrast bilan) — oltin standart</li>
  <li>Gematuriya jarohat darajasiga to'g'ri kelmaydi (I darajada ham kuchli, V darajada ham yo'q bo'lishi mumkin)</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li>I–III daraja: konservativ (kuzatish, yotoq rejimi)</li>
  <li>IV–V daraja yoki gemodinamik beqarorlik: angioembolizatsiya yoki jarrohlik</li>
</ul>

<h2>Siydik pufagi jarohati</h2>
<ul>
  <li><strong>Ekstraperitoneal</strong> (80%): tos suyagi sinishi bilan, ko'pincha drenaj bilan davolanadi</li>
  <li><strong>Intraperitoneal</strong> (20%): qoringa siydik to'kiladi, darhol jarrohlik kerak</li>
</ul>

<h2>Ureter jarohati</h2>
<p>Ko'pincha iatrogen (ginekologik operatsiya paytida). Belgi: operatsiyadan keyin siydik oqishi. Tashxis: KT-urografiya yoki retrograd pielografiya.</p>

<h2>Jinsiy a'zolar jarohatlari</h2>
<ul>
  <li><strong>Olat sinishi (fraktura)</strong> — ereksiya paytida to'satdan "qarsillagan" ovoz, derhal tekshiruv va jarrohlik</li>
  <li><strong>Moya jarohati</strong> — USI (albugineya yirtilishini aniqlash), yirtilsa jarrohlik</li>
</ul>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Urological Trauma", muallif: "EAU", yil: "2024" },
      { sarlavha: "AAST Organ Injury Scaling — Kidney", muallif: "Moore et al.", yil: "2018" },
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
    ],
    testlar: [
      {
        savol: "Buyrak jarohati AAST klassifikatsiyasida qaysi daraja kolleksion sistemagacha yetadi?",
        variantlar: ["I daraja", "II daraja", "III daraja", "IV daraja"],
        togri: 3,
        izoh: "IV daraja — laserasiya kolleksion sistemaga (buyrak kosachasi va siydik nayi) yetadi yoki buyrak hilumidagi qon tomirlar shikastlanadi.",
      },
      {
        savol: "Intraperitoneal siydik pufagi jarohati uchun to'g'ri davolash taktikasi?",
        variantlar: [
          "Kateter drenaj + kuzatish",
          "Antibiotik monoterapiyasi",
          "Darhol jarrohlik (laparotomiya)",
          "ESWL",
        ],
        togri: 2,
        izoh: "Intraperitoneal jarohatda siydik qorin bo'shlig'iga to'kiladi — bu peritonit rivojlanishiga olib keladi. Darhol jarrohlik ko'rsatma.",
      },
    ],
  },

  {
    slug: 'gidrosele',
    sarlavha: "Gidrosele klinikasi, tashxisi, davolash va asoratlari",
    semestr: 8, n: 6, klinik: 2, amaliy: 0, icon: '💧',
    nazariya: `
<h2>Gidrosele</h2>
<p>Moya qinli pardasi (tunica vaginalis) bo'shliqida seroz suyuqlik to'planishi. Erkaklar orasida 1% da uchraydi.</p>

<h3>Klassifikatsiya</h3>
<ul>
  <li><strong>Birlamchi (idiopatik)</strong> — sababi noma'lum, katta yoshlilarda keng tarqalgan</li>
  <li><strong>Ikkilamchi</strong> — epididimit, orxit, jarohat, o'sma natijasida</li>
  <li><strong>Kommunikatsiyalovchi</strong> — qorin pardasi jarayoni ochiq bo'lib qolgan (chaqaloqlarda)</li>
</ul>

<h3>Klinik manzara</h3>
<ul>
  <li>Ko'tarilmaydigan, og'riqsiz moya shishi</li>
  <li>Suyuqlik mavjudligi: transilluminatsiya musbat (yorug'lik o'tadi)</li>
  <li>Diafanoskopiya: suyuqlik yaxshi o'tkazadi</li>
</ul>

<h3>Tashxis</h3>
<ul>
  <li><strong>USI</strong> — birinchi tanlov, xavfli kasalliklarni (o'sma) istisno qilish uchun majburiy</li>
  <li>Transilluminatsiya — qo'shimcha usul</li>
</ul>

<h3>Davolash</h3>
<ul>
  <li><strong>Kuzatish</strong> — kichik, asimptomatik</li>
  <li><strong>Aspiratsiya ± skleroterapiya</strong> — yuqori takrorlanish xavfi (50%)</li>
  <li><strong>Jarrohlik (Lord yoki Jaboulay operatsiyasi)</strong> — radikal davolash, eng samarali</li>
</ul>

<h3>Asoratlar</h3>
<ul>
  <li>Infeksiyalanish (piyogidrosele)</li>
  <li>Gemogidrosele (suyuqlikda qon)</li>
  <li>Moyadagi bosim — uzoq muddatli atrofiya xavfi</li>
</ul>
    `,
    adabiyot: [
      { sarlavha: "EAU Guidelines on Scrotal Pain and Swelling", muallif: "EAU", yil: "2024" },
      { sarlavha: "Campbell-Walsh-Wein Urology", muallif: "Alan Partin et al.", yil: "2021" },
    ],
    testlar: [
      {
        savol: "Gidroseleni diagnostika qilishda asosiy instrumental usul?",
        variantlar: ["KT", "MRT", "USI (ultratovush)", "Rentgenografiya"],
        togri: 2,
        izoh: "USI gidrosele tashxisida birinchi tanlov. Suyuqlikni aniq ko'rsatadi va moya o'smasini istisno qilish imkonini beradi — bu majburiy qadam.",
      },
      {
        savol: "Gidroselening transilluminatsiya natijaisi qanday?",
        variantlar: ["Manfiy (yorug'lik o'tmaydi)", "Musbat (yorug'lik o'tadi)", "Ikki tomonlama", "Faqat bolalarda musbat"],
        togri: 1,
        izoh: "Suyuqlik yorug'likni o'tkazadi, shuning uchun transilluminatsiya musbat. Qattiq to'qima (o'sma) yorug'likni bloklaydi — manfiy natija.",
      },
      {
        savol: "Gidrosele uchun radikal davolash usuli qaysi?",
        variantlar: [
          "Aspiratsiya",
          "Skleroterapiya",
          "Lord yoki Jaboulay operatsiyasi",
          "Antibiotik kursi",
        ],
        togri: 2,
        izoh: "Jarrohlik (Lord yoki Jaboulay) — gidroselening radikal va eng samarali davolash usuli. Aspiratsiya 50% hollarda takrorlanadi.",
      },
    ],
  },
]

export function getCamuDars(slug: string): CamuDars | undefined {
  return CAMU_DARSLAR.find(d => d.slug === slug)
}

export function getCamuSemestrDarslar(semestr: 7 | 8): CamuDars[] {
  return CAMU_DARSLAR.filter(d => d.semestr === semestr)
}
