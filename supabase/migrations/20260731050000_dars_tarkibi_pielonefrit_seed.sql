-- Pielonefrit — 10-dars nazariya tarkibi
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'pielonefrit-asoslari',
  $pielo_html$
<main class="site-main">
<article class="lesson">

  <!-- HERO -->
  <div class="article-hero">
    <span class="article-hero__eyebrow">📘 10-mavzu · Yallig'lanish kasalliklari</span>
    <h1>Pielonefrit — sistitdan farqi, belgilari va davolash yondashuvi</h1>
    <p class="article-hero__lead">
      Pielonefrit — buyrak parenximasi va buyrak jomining yallig'lanishi. U sistitdan tubdan farq
      qiladi: oddiy qovuq infeksiyasidan farqli ravishda, pielonefrit buyrak to'qimasini shikastlashi,
      surunkali buyrak kasalligiga va hayotni xavf ostiga qo'yadigan urosepsisga olib kelishi mumkin.
      Ushbu darsda o'tkir va surunkali pielonefrit, uning asoratlari, diagnostika va davolash tamoyillari
      <em>Campbell-Walsh-Wein Urology</em> darsligi (bob 26) asosida yoritiladi.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~22 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr, Bob 26</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ul class="toc__list">
      <li><a href="#tarif">1. Ta'rif va sistitdan farqi</a></li>
      <li><a href="#patofiziologiya">2. Patofiziologiya va xavf omillari</a></li>
      <li><a href="#klinik">3. Klinik belgilar</a></li>
      <li><a href="#diagnostika">4. Diagnostika</a></li>
      <li><a href="#davolash">5. Davolash algoritmi</a></li>
      <li><a href="#asoratlar">6. Asoratlar va og'ir shakllar</a></li>
      <li><a href="#surunkali">7. Surunkali pielonefrit</a></li>
      <li><a href="#xulosa">8. Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">9. Qisqartmalar va atamalar lug'ati</a></li>
    </ul>
  </nav>

  <!-- 1. TA'RIF -->
  <section class="section" id="tarif">
    <h2><span class="num">1</span>Ta'rif va sistitdan farqi</h2>
    <p>
      <span class="term">O'tkir pielonefrit (acute pyelonephritis)</span> — qaltirash, isitma (≥38°C)
      va bir yoki ikki tomonlama bel-qovurg'a burchagi og'rig'i bilan namoyon bo'ladigan, bakteriuriya
      va piyuriya bilan kechadigan klinik sindrom. Tashxis klinik belgilar asosida qo'yiladi — rentgenologik
      belgilar yoki tasvirlash natijalari yagona mezon hisoblanmaydi.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>1-jadval. Sistit va pielonefritning asosiy farqlari</caption>
        <thead>
          <tr><th>Belgi</th><th>Sistit</th><th>Pielonefrit</th></tr>
        </thead>
        <tbody>
          <tr><td>Infeksiya joylashuvi</td><td>Qovuq (quyi siydik yo'li)</td><td>Buyrak va buyrak jomi (yuqori siydik yo'li)</td></tr>
          <tr><td>Isitma</td><td>Odatda yo'q yoki past</td><td>≥38°C — asosiy belgi</td></tr>
          <tr><td>Bel-qovurg'a burchagi og'rig'i (CVAT)</td><td>Yo'q</td><td>Bor, odatda bir tomonlama</td></tr>
          <tr><td>Dizuriya, siydik tezligi</td><td>Asosiy belgilar</td><td>Ba'zida mavjud, ba'zida yo'q</td></tr>
          <tr><td>Ko'ngil aynashi, qusish</td><td>Odatda yo'q</td><td>Ko'pincha bor</td></tr>
          <tr><td>Davolash muddati</td><td>3–5 kun (og'iz orqali)</td><td>7–14 kun; og'ir hollarda kasalxonada</td></tr>
          <tr><td>Buyrak chaqiqi xavfi</td><td>Past</td><td>Mavjud, ayniqsa bolalarda va VUR bilan</td></tr>
        </tbody>
      </table>
    </div>

    <p>
      <span class="term">Surunkali pielonefrit (chronic pyelonephritis)</span> — atrofik va fibrozlangan
      buyrak, shuningdek radiologik yoki funksional buyrak kasalligi belgilari bilan tavsiflanadi.
      Bu holat ko'pincha faol (joriy) infeksiya bilan bog'liq bo'lmaydi; balki oldingi infeksiyalar
      yoki VURning uzoq muddatli oqibati hisoblanadi.
    </p>
  </section>

  <!-- 2. PATOFIZIOLOGIYA -->
  <section class="section" id="patofiziologiya">
    <h2><span class="num">2</span>Patofiziologiya va xavf omillari</h2>
    <p>
      Pielonefritning aksariyati qovuqdagi bakteriyalarning siydik yo'li orqali buyrakka ko'tarilishi
      (asending yo'l) natijasida yuzaga keladi. Qon orqali tarqalish (gematogen yo'l) kamroq uchraydi.
    </p>

    <h3>2.1. Xavf omillari</h3>
    <ul>
      <li><strong>To'siqlanish (obstruction)</strong> — tosh, UPJ to'siqlanishi, BPH; siydik turg'unligi bakteriya o'sishini tezlashtiradi</li>
      <li><strong>Vezikouretal reflyuks (VUR)</strong> — siydikning buyrakka qayta oqishi; bolalarda buyrak chaqiqlari rivojlanishiga olib keladi</li>
      <li><strong>Qandli diabet (DM)</strong> — neytrofil funksiyasi buzilishi, neyrogeniya tufayli to'liq bo'shalmaslik; emfizematoz pielonefrit va absess xavfini oshiradi</li>
      <li><strong>Homiladorlik</strong> — siydik yo'li tonusining pasayishi siydik turg'unligiga olib keladi</li>
      <li><strong>Immunosupressiya</strong> — HIV, transplantatsiya, uzoq muddatli steroid</li>
      <li><strong>Kateter va asbob-uskunalar bilan bog'liq</strong> — nosokomial pielonefrit xavfi</li>
    </ul>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! To'siqlanish + pielonefrit = shoshilinch holat</strong>
        <p>
          Siydik yo'li to'siqlanishi fonida rivojlangan pielonefrit
          (<span class="term">to'silgan pielonefrit, obstructed pyelonephritis</span>) — hayot uchun
          xavfli holat. Yagona buyrak yoki ikki tomonlama to'siq o'tkir buyrak yetishmovchiligiga olib
          keladi. Bunday hollarda to'siqni zudlik bilan bartaraf etish (ureteral stent yoki
          perkutan nefrostomiya) antibiotikdan muhimroq birinchi qadam hisoblanadi.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. KLINIK BELGILAR -->
  <section class="section" id="klinik">
    <h2><span class="num">3</span>Klinik belgilar</h2>
    <p>
      O'tkir pielonefritning klassik triadasi:
    </p>
    <ul>
      <li><strong>Isitma</strong> — ≥38°C, ko'pincha qaltirash bilan</li>
      <li><strong>Bel-qovurg'a burchagi og'rig'i</strong> — bir yoki ikki tomonlama, odatda keskin boshlanuvchi</li>
      <li><strong>Qusish / ko'ngil aynashi</strong> — hazm tizimi belgilari ham kuzatilishi mumkin</li>
    </ul>
    <p>
      Quyi siydik yo'li simptomlari (dizuriya, siydik tezligi) ba'zan birga uchraydi, ba'zan esa
      umuman bo'lmaydi. Jismoniy tekshiruvda bel-qovurg'a burchagini palpatsiya yoki urishda
      (<span class="term">CVAT — costovertebral angle tenderness</span>) og'riqlilik aniqlanadi.
    </p>
    <p>
      Klinik ko'rinish atipik bo'lishi ham mumkin:
    </p>
    <ul>
      <li>Qorin og'rig'i, diareya — oshqozon-ichak yo'li kasalligi bilan adashish mumkin</li>
      <li>Orqa miya jarohati bo'lgan bemorlarda belgilash qiyin — og'riq lokalizatsiyasi bo'lmasligi mumkin</li>
      <li>Asimptomatik rivojlanib, surunkali pielonefritga o'tishi mumkin (ayniqsa immunosupressiyada)</li>
    </ul>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma — davolash boshlanganidan keyin isitma</strong>
        <p>
          Muvaffaqiyatli antibiotik davolanishi boshlangandan keyin ham bemor bir necha kun davomida
          isitma, qaltirash va bel og'rig'ini his qilishi mumkin. Bu normal holat. Ammo <strong>72
          soatdan oshganda</strong> isitma davom etsa — KT tekshiruvi majburiy: to'siqlanish, buyrak
          yoki perinefrik absess istisno qilinishi kerak.
        </p>
      </div>
    </div>
  </section>

  <!-- 4. DIAGNOSTIKA -->
  <section class="section" id="diagnostika">
    <h2><span class="num">4</span>Diagnostika</h2>

    <h3>4.1. Laborator tekshiruvlar</h3>
    <ul>
      <li><strong>Umumiy siydik tahlili</strong> — ko'p leykotsitlar (ko'pincha topcha — clumps shaklida), bakteriyalar, ba'zan eritrotsitlar</li>
      <li><strong>Umumiy qon tahlili (CBC)</strong> — leykotsitoz, neytrofillar ustunligi</li>
      <li><strong>Siydik ekinmasi</strong> — majburiy; kasallik kelib chiquvchi bakteriya va antibiotik sezuvchanligini aniqlash uchun</li>
      <li><strong>Qon ekinmasi (blood culture)</strong> — kasalxonaga yotqizish talab etiladigan og'ir holatlarda, sepsis gumonida</li>
      <li><strong>Kreatinin, elektrolitlar</strong> — buyrak funksiyasini baholash va dori dozasini moslash uchun</li>
    </ul>

    <h3>4.2. Tasvirlash tekshiruvlari</h3>
    <p>
      Tasvirlash tekshiruvi asoratlanmagan o'tkir pielonefritda <strong>darhol talab etilmaydi</strong>.
      Ammo quyidagi holatlarda majburiy:
    </p>
    <div class="table-wrap">
      <table class="data-table">
        <caption>2-jadval. Pielonefritda tasvirlash tekshiruvlari ko'rsatkichlari</caption>
        <thead>
          <tr><th>Holat</th><th>Tavsiya etilgan tekshiruv</th></tr>
        </thead>
        <tbody>
          <tr><td>72 soatdan oshganda isitma davom etsa</td><td>KT (kontrast bilan) — absess, to'siqlanish istisno qilish</td></tr>
          <tr><td>Tosh shubhasi, to'siqlanish belgilari</td><td>Ultratovush (birinchi), zarur bo'lsa KT</td></tr>
          <tr><td>Erkaklar, bolalar, yangi tug'ilganlar</td><td>To'liq urologik baholash + UTT</td></tr>
          <tr><td>Qandli diabet, immunosupressiya</td><td>KT — emfizematoz pielonefrit istisno qilish</td></tr>
          <tr><td>Asoratlangan yoki qayta infeksiya</td><td>KT urografiyasi yoki ultratovush</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 5. DAVOLASH -->
  <section class="section" id="davolash">
    <h2><span class="num">5</span>Davolash algoritmi</h2>
    <p>
      Davolash yondashuvi bemorning klinik og'irligiga — kasalxonaga yotqizish zarurmi yoki
      ambulatoria davolash mumkinmi — asosan bog'liq.
    </p>

    <h3>5.1. Ambulatoria davolash (og'ir bo'lmagan holat)</h3>
    <p>
      Qusish yo'q, sepsis belgisi yo'q, og'iz orqali dori qabul qila oladigan bemorlarda:
    </p>
    <ul>
      <li><strong>Siprofloksatsin</strong> 500 mg × 2/kun, 7 kun — mahalliy ftorokinolon rezistentligi 10% dan past bo'lsa birinchi tanlash</li>
      <li><strong>TMP-SMX</strong> 160/800 mg × 2/kun, 14 kun — organizm sezuvchanligi ma'lum bo'lsa</li>
      <li>Davolash boshlashdan avval bir martalik IV/IM doza (seftriakson 1 g yoki aminoglikozid) berish ixtiyoriy, lekin foydali</li>
    </ul>

    <h3>5.2. Kasalxona davolashi (og'ir holat)</h3>
    <p>
      Quyidagi holatlarda kasalxonaga yotqizish talab etiladi:
    </p>
    <ul>
      <li>Yuqori isitma, kuchli leykotsitoz, qusish yoki dehidratatsiya</li>
      <li>Sepsis belgilari mavjud bo'lsa</li>
      <li>Ambulatoria davolash 72 soat ichida natija bermasa</li>
      <li>Homiladorlik, immunosupressiya yoki to'siqlanish gumonida</li>
    </ul>
    <p>
      Kasalxonada IV antibiotiklardan boshlanadi (ftorokinolon IV, aminoglikozid ± ampitsillin,
      keng spektrli sefalosporin yoki karbapenem). Gramm-musbat organizm aniqlansa —
      ampitsillin/sulbaktam qo'shiladi. Bemorning holati barqarorlashgandan keyin og'iz orqali
      davolashga o'tiladi va jami 10–14 kunga yetkaziladi.
    </p>

    <div class="callout callout--guide">
      <div class="callout__icon">📋</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          Ekinma natijalari kelib tushgandan keyin (48–72 soat) antibiotik sezuvchanlikka qarab
          maqsadli davolashga o'tilishi kerak — aminoglikozid kabi potensial toksik dorilar imkon
          qadar tezroq kamroq toksik preparatlar (aztreonam, sefalosporinlar) bilan almashtirilishi
          tavsiya etiladi.
        </p>
      </div>
    </div>
  </section>

  <!-- 6. ASORATLAR -->
  <section class="section" id="asoratlar">
    <h2><span class="num">6</span>Asoratlar va og'ir shakllar</h2>

    <h3>6.1. Buyrak abssessi (renal abscess)</h3>
    <p>
      Buyrak parenximasida yiringli suyuqlik to'planishi. Belgilari pielonefritga o'xshash, ammo odatda
      og'irroq va 5 kundan uzun davomli. Asosiy sabab — asending gramm-manfiy infeksiya (E. coli,
      Klebsiella, Proteus, Pseudomonas). KT — diagnostika usuli. 3 sm dan kichik abssess ko'pincha
      antibiotik bilan hal bo'ladi; kattaroqlarda perkutan drenaj kerak bo'ladi.
    </p>

    <h3>6.2. Perinefrik absess (perinephric abscess)</h3>
    <p>
      Buyrak kapsulasi atrofidagi yog' to'qimasida yiringli to'planish. 5 kundan uzun simptomlar
      va antibiotikdan keyin ham 4 kundan ko'p davom etadigan isitma — perinefrik abssess
      o'tkir pielonefritdan farqlaydigan asosiy mezon. KT bilan tasdiqlanadi; perkutan yoki jarrohlik
      drenaji talab etiladi.
    </p>

    <h3>6.3. Emfizematoz pielonefrit (emphysematous pyelonephritis)</h3>
    <p>
      Gaz hosil qiluvchi bakteriyalar (asosan E. coli) tomonidan kelib chiqariladigan o'tkir
      nekrozlashtiruvchi buyrak infeksiyasi — <strong>urologik shoshilinch holat</strong>.
      Deyarli barcha hollarda katta yoshli bemorlarda va qandli diabet bilan bog'liq uchraydi.
      Klassik triada: isitma, qusish va bel og'rig'i. KTda buyrak to'qimasida gaz aniqlanishi
      diagnostik hisoblanadi. O'lim darajasi 19–43%. Davolash: suyuqlik va keng spektrli antibiotiklar,
      glyukoza nazorati, perkutan drenaj; keng tarqalgan shakllarda nefektomiya ko'rsatilishi mumkin.
    </p>

    <h3>6.4. Ksantogranulematoz pielonefrit (XGP)</h3>
    <p>
      Tosh kasalligi va to'siqlanish bilan bog'liq, buyrak parenximasini lipid yukli makrofaglar (köpük
      hujayralar) bilan almashtiruvchi surunkali yallig'lanish. Ko'pincha bir tomonlama, nofaol buyrak
      va buyrak hujayra sarataoniga taqlid qilishi mumkin. Nefrektomiya — asosiy davolash.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>3-jadval. Pielonefritning og'ir shakllari qiyosiy ko'rinishi</caption>
        <thead>
          <tr><th>Holat</th><th>Asosiy xavf omili</th><th>Asosiy diagnostika</th><th>Davolash</th></tr>
        </thead>
        <tbody>
          <tr><td>Buyrak absessi</td><td>UTI, tosh, DM</td><td>KT (kontrast bilan)</td><td>AB; &gt;3 sm: perkutan drenaj</td></tr>
          <tr><td>Perinefrik absess</td><td>Buyrak absessining tarqalishi</td><td>KT</td><td>Perkutan/jarrohlik drenaji + AB</td></tr>
          <tr><td>Emfizematoz pielonefrit</td><td>Qandli diabet (asosan)</td><td>KT — gaz topilishi</td><td>AB + drenaj; og'irda nefektomiya</td></tr>
          <tr><td>Ksantogranulematoz (XGP)</td><td>Tosh + to'siq + surunkali infeksiya</td><td>KT (saraton taqlidi)</td><td>Nefektomiya</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 7. SURUNKALI PIELONEFRIT -->
  <section class="section" id="surunkali">
    <h2><span class="num">7</span>Surunkali pielonefrit va buyrak chaqiqlari</h2>
    <p>
      Surunkali pielonefrit — buyrak korteksida maydon yo'qolishi va kalitsiyalarning kengayishi
      bilan tavsiflanuvchi uzoq muddatli holat. Infeksiya va VUR birgalikda bo'lganida buyrak
      chaqiqi (renal scar) rivojlanish xavfi ancha yuqori.
    </p>
    <p>
      Muhim ma'lumotlar:
    </p>
    <ul>
      <li>O'tkir pielonefritdan 10–20 yil o'tgach DMSA skanida bemorlarning taxminan 50 foizida
      buyrak chaqiqlari aniqlanadi — ammo buyrak funksiyasi ko'pincha sezilarli darajada
      kamaymasdi</li>
      <li>Bolalarda antibiotikni har bir soat kechiktirish buyrak chaqiqi xavfini 0,8% ga oshiradi</li>
      <li>Antibiotik 72 soatdan kech boshlanganida buyrak chaqiqi xavfi 48 soatgacha boshlanganiga
      nisbatan ikki marta yuqori</li>
    </ul>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma — buyrak chaqiqlari</strong>
        <p>
          Radiologik jihatdan buyrak chaqig'ini tug'ma displaziyadan farqlash qiyin. Kichik buyrak,
          tarqoq kamaygani izoton absorbsiyasi va kamaygani differensial buyrak funksiyasi ko'pincha
          tug'ma displaziyani ko'rsatadi. Chaqiqlar va displaziya o'rtasidagi farq davolash
          taktikasiga ta'sir qilishi mumkin.
        </p>
      </div>
    </div>
  </section>

  <!-- 8. XULOSA -->
  <section class="section" id="xulosa">
    <h2><span class="num">8</span>Xulosa va asosiy fikrlar</h2>
    <div class="keypoints">
      <p class="keypoints__title">⭐ Asosiy xulosalar</p>
      <ul>
        <li>Pielonefrit — isitma (≥38°C), qaltirash va CVAT klassik triadasi bilan namoyon bo'ladigan yuqori siydik yo'li infeksiyasi; sistit kabi LUTS mavjud bo'lmasligi mumkin.</li>
        <li>Isitma pielonefritning asosiy belgisi; isitmasiz "pielonefrit" — bu ko'pincha sistitdir.</li>
        <li>To'siqlanish + pielonefrit kombinatsiyasi shoshilinch holat: to'siqni bartaraf etish antibiotikdan muhimroq birinchi qadam.</li>
        <li>Asoratlanmagan holatlarda 7–14 kunlik antibiotiik davolash; kasalxona ko'rsatkichlari: sepsis, qusish, 72 soatda javob yo'qligi.</li>
        <li>72 soatdan oshganda isitma davom etsa — KT majburiy: absess va to'siq istisno qilinsin.</li>
        <li>Emfizematoz pielonefrit — urologik shoshilinch, deyarli har doim qandli diabet bilan bog'liq.</li>
        <li>Bolalarda va VUR bilan kechgan pielonefrit buyrak chaqiqi xavfini oshiradi; tezkor antibiotiik boshlash bu xavfni sezilarli kamaytirishda muhim.</li>
      </ul>
    </div>
    <p class="source-note">
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr (2026), Bob 26 — Infections of the Urinary Tract
      asosida tayyorlangan va faqat ta'lim maqsadlarida foydalanish uchun mo'ljallangan.
      Aniq klinik qarorlar uchun dolzarb AUA/EAU/IDSA qo'llanmalariga murojaat qiling.
    </p>
  </section>

  <!-- 9. LUG'AT -->
  <section class="section" id="lugat">
    <h2><span class="num">9</span>Qisqartmalar va atamalar lug'ati</h2>
    <p>Mavzuda ishlatilgan barcha qisqartma va murakkab atamalarning to'liq izohi quyidagi jadvalda keltirilgan:</p>
    <div class="table-wrap">
      <table class="data-table glossary-table">
        <thead>
          <tr><th>Qisqartma / Atama</th><th>Inglizcha to'liq nomi</th><th>O'zbekcha izohi</th></tr>
        </thead>
        <tbody>
          <tr><td>Pielonefrit</td><td>Pyelonephritis</td><td>Buyrak parenximasi va buyrak jomining yallig'lanishi</td></tr>
          <tr><td>CVAT</td><td>Costovertebral Angle Tenderness</td><td>Bel-qovurg'a burchagini palpatsiyada yoki urishda og'riqlilik — pielonefrit belgisi</td></tr>
          <tr><td>XGP</td><td>Xanthogranulomatous Pyelonephritis</td><td>Ksantogranulematoz pielonefrit — lipid yukli makrofaglar bilan buyrak to'qimasining almashinuvi</td></tr>
          <tr><td>VUR</td><td>Vesicoureteral Reflux</td><td>Siydikning qovuqdan siydik yo'liga teskari oqishi</td></tr>
          <tr><td>DM</td><td>Diabetes Mellitus</td><td>Qandli diabet — og'ir pielonefrit asoratlari uchun asosiy xavf omili</td></tr>
          <tr><td>KT</td><td>Computed Tomography</td><td>Kompyuter tomografiyasi — absess va emfizematoz pielonefritni aniqlashda asosiy usul</td></tr>
          <tr><td>DMSA</td><td>Dimercaptosuccinic Acid</td><td>Buyrak chaqiqlarini aniqlashda ishlatiladigan radionuklid tekshiruvi</td></tr>
          <tr><td>TMP-SMX</td><td>Trimethoprim-Sulfamethoxazole</td><td>Ko-trimoksazol — pielonefritda sezuvchanlik tasdiqlanganda og'iz orqali davo</td></tr>
          <tr><td>UTI</td><td>Urinary Tract Infection</td><td>Siydik yo'li infeksiyasi</td></tr>
          <tr><td>IV</td><td>Intravenous</td><td>Tomir ichiga — og'ir pielonefritda dori yuborish yo'li</td></tr>
          <tr><td>AB</td><td>Antibiotics</td><td>Antibiotiklar</td></tr>
          <tr><td>CBC</td><td>Complete Blood Count</td><td>Umumiy qon tahlili</td></tr>
          <tr><td>BPH</td><td>Benign Prostatic Hyperplasia</td><td>Prostata bezining kattalashishi — to'siqlanish sabablaridan biri</td></tr>
        </tbody>
      </table>
    </div>
  </section>

</article>
</main>
$pielo_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
