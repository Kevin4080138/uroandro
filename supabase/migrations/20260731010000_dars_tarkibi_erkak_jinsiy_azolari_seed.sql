-- Erkak jinsiy a'zolari tuzilishi — nazariya tarkibi seed
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'erkak-jinsiy-azolari-tuzilishi',
  $erkak_jinsiy_html$
<main class="site-main">
<article class="article">

  <div class="article-hero">
    <span class="article-hero__eyebrow">🎓 Kirish kursi · Erkak reproduktiv tizimi anatomiyasi</span>
    <h1>Erkak jinsiy a'zolari — umumiy tuzilishi</h1>
    <p>Urologiya bilan endigina tanishayotgan talabalar uchun moshonka, moyak, epididim, urug' otish kanali, urug' pufakchasi, prostata va olatning tuzilishi, qon ta'minoti hamda asosiy vazifalari bo'yicha kirish darsi.</p>
    <div class="article-hero__meta">
      <span>📚 Campbell-Walsh-Wein Urology, 13-nashr, 2-jild</span>
      <span>📖 66, 67 va 85-boblar</span>
      <span>🩺 1-bosqich talabalari uchun</span>
    </div>
  </div>

  <!-- Manba izohi -->
  <div class="src-legend">
    <span><span class="src src--book">📚 Kitobda</span> — Campbell-Walsh-Wein 2-jildida bevosita tasdiqlangan ma'lumot</span>
    <span><span class="src src--guide">🧭 Yo'naltiruvchi</span> — umumlashtirilgan/kontekstual ma'lumot, faqat yo'nalish uchun</span>
  </div>

  <!-- Gorizontal anatomik oqim TOC -->
  <nav class="flow-toc" aria-label="Mavzu ichidagi navigatsiya">
    <p class="flow-toc__title">📑 Anatomik yo'l bo'yicha navigatsiya</p>
    <div class="flow-toc__track">
      <a href="#tarif"><span class="dot">1</span>Umumiy nazar</a>
      <span class="arrow">→</span>
      <a href="#moshonka"><span class="dot">2</span>Moshonka/moyak</a>
      <span class="arrow">→</span>
      <a href="#epididim"><span class="dot">3</span>Epididim</a>
      <span class="arrow">→</span>
      <a href="#urug-pufakchasi"><span class="dot">4</span>Urug' pufakchasi</a>
      <span class="arrow">→</span>
      <a href="#prostata"><span class="dot">5</span>Prostata</a>
      <span class="arrow">→</span>
      <a href="#olat"><span class="dot">6</span>Olat</a>
      <span class="arrow">→</span>
      <a href="#klinik"><span class="dot">7</span>Klinik</a>
      <span class="arrow">→</span>
      <a href="#lugat"><span class="dot">8</span>Lug'at</a>
    </div>
  </nav>

  <!-- ============ 1. UMUMIY NAZAR ============ -->
  <section id="tarif" class="section">
    <h2><span class="num">1</span>Umumiy nazar <span class="src src--book">📚 Kitobda</span></h2>

    <p>
      Erkak jinsiy a'zolari (<span class="en-term">male reproductive system</span>) ikki
      asosiy vazifani bajaradi: <strong>spermatozoidlar ishlab chiqarish</strong> va
      <strong>urug'ni ayol tanasiga yetkazib berish</strong>. Bu tizim quyidagi asosiy
      a'zolardan iborat: moyak (testis), epididim, urug' otish kanali (vas deferens),
      urug' pufakchasi (seminal vesicle), prostata bezi va olat (penis).
    </p>

    <p>
      Spermaning yo'li — moyakdan boshlanib, tashqariga chiqishigacha — bir nechta
      bosqichdan iborat:
    </p>

    <div class="chain">
      <span class="chain__step">Moyak (sperma ishlab chiqarish)</span>
      <span class="chain__arrow">→</span>
      <span class="chain__step">Epididim (yetilish va saqlanish)</span>
      <span class="chain__arrow">→</span>
      <span class="chain__step">Vas deferens (tashilish)</span>
      <span class="chain__arrow">→</span>
      <span class="chain__step">Urug' otish kanali</span>
      <span class="chain__arrow">→</span>
      <span class="chain__step">Prostatik uretra (qo'shilish)</span>
      <span class="chain__arrow">→</span>
      <span class="chain__step">Tashqariga chiqish</span>
    </div>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      Bu anatomik zanjirni yodlab olish juda foydali: erkak infertilligi yoki og'riq
      sindromini tekshirishda, qaysi bosqichda muammo borligini aniqlash uchun aynan
      shu ketma-ketlik bo'yicha fikr yuritish kerak.
    </div>
  </section>

  <!-- ============ 2. MOSHONKA VA MOYAK ============ -->
  <section id="moshonka" class="section">
    <h2><span class="num">2</span>Moshonka va moyak (scrotum va testis) <span class="src src--book">📚 Kitobda</span></h2>

    <h3>2.1. Moshonka qatlamlari</h3>
    <p>
      Moyak va urug' tizimchasi (spermatic cord) rivojlanish davomida qorin parda
      ortidan moshonkaga tushishi natijasida, ular <strong>olti qatlam</strong> bilan
      o'ralgan bo'ladi (tashqaridan ichkariga):
    </p>
    <ol class="steps">
      <li><strong>Teri (skin)</strong> — tuk bilan qoplangan, pigmentlangan, burmali (rugae) teri.</li>
      <li><strong>Dartos fastsiyasi</strong> — qorindagi Skarpa fastsiyasining davomi, harorat nazoratida ishtirok etadi.</li>
      <li><strong>Tashqi urug' fastsiyasi</strong> — qorin tashqi qiya mushagi fastsiyasining davomi.</li>
      <li><strong>Kremaster fastsiyasi</strong> — kremaster mushagini o'z ichiga oladi, moyakni tortib olishga (termoregulyatsiya uchun) yordam beradi.</li>
      <li><strong>Ichki urug' fastsiyasi</strong> — qorin ko'ndalang fastsiyasining davomi.</li>
      <li><strong>Tunika vaginalis</strong> — moyakni bevosita o'rab turuvchi seroz parda.</li>
    </ol>

    <h3>2.2. Moyakning tashqi tuzilishi</h3>
    <p>
      Moyak parenximasi quyidagi qoplamalar bilan o'ralgan (tashqaridan ichkariga):
      tunika vaginalisning visseral qavati, <strong>tunika albuginea</strong> — qalin,
      fibroelastik biriktiruvchi to'qima kapsulasi, va eng ichki qavat —
      <strong>tunika vaskuloza</strong>.
    </p>

    <h3>2.3. Moyakning ichki (mikroskopik) tuzilishi</h3>
    <p>
      Moyak <strong>septalar (to'siqlar)</strong> bilan taxminan 250 ta bo'lakchaga
      (lobulalarga) bo'linadi. Har bir bo'lakchada uzun, ichakka o'xshash buralgan
      <strong>seminifer naychalar (seminiferous tubules)</strong> joylashgan — bir
      moyakda 600–1200 ta naycha bo'lib, umumiy uzunligi taxminan 250 metrga yetadi.
    </p>

    <div class="table-wrap">
      <table>
        <caption>1-jadval. Moyakning asosiy hujayra turlari va vazifalari</caption>
        <thead><tr><th>Hujayra turi</th><th>Joylashuvi</th><th>Vazifasi</th></tr></thead>
        <tbody>
          <tr><td><strong>Leydig hujayralari</strong></td><td>Naychalar orasidagi interstitsial to'qimada</td><td>Testosteron ishlab chiqaradi</td></tr>
          <tr><td><strong>Sertoli hujayralari</strong></td><td>Seminifer naycha devorida</td><td>Urug' hujayralarining rivojlanishini qo'llab-quvvatlaydi, qon-moyak to'sig'ini hosil qiladi</td></tr>
          <tr><td><strong>Urug' hujayralari (germ cells)</strong></td><td>Seminifer naycha ichida</td><td>Spermatozoid hosil bo'lishining boshlang'ich materiali</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      Sertoli hujayralari orasidagi <strong>zich birikmalar (tight junctions)</strong>
      — qon-moyak to'sig'i (<span class="en-term">blood-testis barrier</span>)ning
      anatomik asosini tashkil etadi. Bu to'siq rivojlanayotgan urug' hujayralarini
      immun tizimdan himoya qiladi.
    </div>

    <h3>2.4. Qon ta'minoti</h3>
    <p>
      Moyak uchta manbadan qon oladi: <strong>ichki urug' arteriyasi (testicular
      artery)</strong> — asosiy manba, qorin aortasidan to'g'ridan-to'g'ri chiqadi;
      <strong>defferensial arteriya</strong> — vas deferensga ergashadi; va
      <strong>tashqi urug' (kremaster) arteriyasi</strong>.
    </p>
    <p>
      Pampiniform venoz pleksus bilan arteriya orasidagi yaqin joylashuv
      <strong>qarama-qarshi oqim issiqlik almashinuvi (countercurrent heat
      exchange)</strong>ni ta'minlaydi — bu moyakka kiruvchi qon haroratini tana
      haroratidan <strong>2–4°C past</strong> saqlashga yordam beradi, bu esa normal
      spermatogenez uchun zarur.
    </p>

    <div class="callout callout--guide">
      <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
      Bu harorat farqining yo'qolishi (masalan, varikosele yoki tushmagan moyak —
      kriptorxizm holatlarida) moyak funksiyasining buzilishi bilan bog'liq deb
      hisoblanadi, garchi aniq mexanizm to'liq o'rganilmagan bo'lsa ham.
    </div>
  </section>

  <!-- ============ 3. EPIDIDIM VA VAS DEFERENS ============ -->
  <section id="epididim" class="section">
    <h2><span class="num">3</span>Epididim va urug' otish kanali (vas deferens) <span class="src src--book">📚 Kitobda</span></h2>

    <h3>3.1. Epididim tuzilishi</h3>
    <p>
      Epididim — moyakning orqa-yuqori qismiga yopishgan, uch qismdan iborat
      tuzilma:
    </p>
    <div class="organ-grid">
      <div class="organ-card">
        <h4>Boshi (caput)</h4>
        <p>Rete testisdan kelgan 8–12 ta chiqaruv naychasi (efferent ducts) shu yerda birlashadi</p>
      </div>
      <div class="organ-card">
        <h4>Tanasi (corpus)</h4>
        <p>Bitta uzun, buralgan naychadan iborat, kengroq diametrga ega</p>
      </div>
      <div class="organ-card">
        <h4>Dumi (cauda)</h4>
        <p>Sperma "ombori" vazifasini bajaradi, keyin vas deferensga davom etadi</p>
      </div>
    </div>

    <div class="callout callout--warning">
      <strong class="callout-title">Diqqat!</strong>
      Epididim naychasi caput-corpus chegarasidan keyin <strong>yagona, uzluksiz
      naycha</strong>ga aylanadi. Shu sababli, epididimning istalgan joyida tasodifiy
      shikastlanish yoki tikilish (masalan, gidrosele/spermatosele operatsiyasida)
      shu tomondagi butun tizimning <strong>to'liq tiqilib qolishi</strong>ga olib
      kelishi mumkin.
    </div>

    <h3>3.2. Vas deferens (urug' otish kanali)</h3>
    <p>
      Vas deferens — epididim dumidan boshlanib, urug' pufakchasi bilan qo'shilib
      urug' otish kanaliga (ejaculatory duct) aylanguncha davom etuvchi mushakli
      naycha. U faqat <strong>defferensial arteriyadan</strong> qon oladi — atrofdagi
      kremaster mushagi yoki urug' tizimchasining boshqa qon tomirlaridan emas.
    </p>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      Vas deferensning qon ta'minoti yagona manbadan bo'lgani uchun, agar u ikki
      nuqtada kesilsa yoki tiqilsa, oradagi segment qon ta'minotsiz qolib fibrozga
      uchraydi — bu vazovazostomiya (vas deferensni qayta tiklash operatsiyasi)
      rejalashtirishda muhim amaliy ahamiyatga ega.
    </div>
  </section>

  <!-- ============ 4. URUG' PUFAKCHASI ============ -->
  <section id="urug-pufakchasi" class="section">
    <h2><span class="num">4</span>Urug' pufakchasi va urug' otish kanallari <span class="src src--book">📚 Kitobda</span></h2>

    <h3>4.1. Joylashuvi va o'lchamlari</h3>
    <p>
      Urug' pufakchalari (<span class="en-term">seminal vesicles</span>) — juft,
      uzunchoq, bo'sh organlar, qovuq va prostata orqasida joylashgan. Har biri
      taxminan <strong>5–7 sm uzunlik</strong>da va 1.5 sm kenglikda, lekin agar
      yoyilsa, naycha o'zi 15 sm gacha cho'ziladi.
    </p>

    <h3>4.2. Urug' otish kanallari (ejaculatory ducts)</h3>
    <p>
      Urug' pufakchasining chiqaruv naychasi vas deferensning ampula qismi bilan
      qo'shilib, <strong>urug' otish kanali</strong>ni hosil qiladi. Bu kanal
      prostata ichidan o'tib, <strong>verumontanum</strong> darajasida prostatik
      uretraga ochiladi.
    </p>

    <div class="callout callout--guide">
      <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
      Urug' otish kanalida haqiqiy mushak "sfinkteri" mavjud emas — siydikning teskari
      oqishining oldini olish va ejakulyatsiya kontinensini ta'minlash, kanalning
      uretraga <strong>o'tkir burchak ostida</strong> kirishi orqali amalga oshadi.
    </div>

    <h3>4.3. Urug' pufakchasining vazifasi</h3>
    <p>
      Urug' pufakchalari semen suyuqligining <strong>taxminan 70%</strong>ini ishlab
      chiqaradi. Bu suyuqlik ishqoriy (alkali) muhitga ega va quyidagilarni o'z
      ichiga oladi: fruktoza (spermatozoidlar uchun energiya manbai), prostaglandinlar,
      va <strong>semenogelin</strong> oqsili — bu oqsil ejakulyatsiyadan keyin
      semenni gel-shaklga keltiradi (koagulyatsiya).
    </p>

    <div class="table-wrap">
      <table>
        <caption>2-jadval. Semen tarkibiga asosiy hissa qo'shuvchi a'zolar</caption>
        <thead><tr><th>A'zo</th><th>Semen hajmiga ulushi</th><th>Asosiy tarkib</th></tr></thead>
        <tbody>
          <tr><td><strong>Urug' pufakchasi</strong></td><td>~70%</td><td>Fruktoza, prostaglandinlar, semenogelin</td></tr>
          <tr><td><strong>Prostata bezi</strong></td><td>~20–30%</td><td>Sink, sitrat, PSA, proteolitik fermentlar</td></tr>
          <tr><td><strong>Moyak/epididim</strong></td><td>Kichik hajm</td><td>Spermatozoidlarning o'zi</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- ============ 5. PROSTATA ============ -->
  <section id="prostata" class="section">
    <h2><span class="num">5</span>Prostata bezi <span class="src src--book">📚 Kitobda</span></h2>

    <h3>5.1. Joylashuvi va o'lchamlari</h3>
    <p>
      Prostata — qovuq ostida, qovuq bo'ynidan to'g'ridan-to'g'ri pastda joylashgan
      bez. Normal prostata hajmi taxminan <strong>25 mL</strong>, o'lchamlari esa
      ~3×3×5 sm atrofida. Yosh ortishi bilan prostata kattalashadi —
      50 yoshda o'rtacha 28 mL, 75 yoshdan keyin esa 46 mL gacha.
    </p>

    <h3>5.2. Zonal anatomiya (McNeal tasnifi)</h3>
    <p>
      Prostata to'rt zonaga bo'linadi, bu klinik amaliyotda (ayniqsa onkologiyada)
      muhim ahamiyatga ega:
    </p>

    <div class="table-wrap">
      <table>
        <caption>3-jadval. Prostataning zonal anatomiyasi (McNeal tasnifi)</caption>
        <thead><tr><th>Zona</th><th>Bez to'qimasi ulushi</th><th>Klinik ahamiyati</th></tr></thead>
        <tbody>
          <tr><td><strong>Periferik zona (peripheral zone)</strong></td><td>~70%</td><td>Prostata saratonining ko'pchiligi shu yerdan boshlanadi</td></tr>
          <tr><td><strong>Markaziy zona (central zone)</strong></td><td>~25%</td><td>Urug' otish kanallarini o'rab turadi</td></tr>
          <tr><td><strong>O'tish zonasi (transitional zone)</strong></td><td>Qolgan qismi</td><td>Yosh bilan eng tez o'sadigan zona; benign prostata giperplaziyasi (BPH) va siydik chiqarish to'siqligiga olib keladi</td></tr>
          <tr><td><strong>Old fibromuskulyar zona</strong></td><td>Bez to'qimasi yo'q</td><td>Faqat biriktiruvchi va mushak to'qimasidan iborat</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--warning">
      <strong class="callout-title">Diqqat!</strong>
      Talaba uchun muhim klinik bog'lanish: <strong>periferik zona</strong> —
      saratonning asosiy manbai (shuning uchun barmoq orqali tekshiruv, DRE, aynan
      shu zonani his qiladi), <strong>o'tish zonasi</strong> esa — yosh bilan
      kattalashib, siydik chiqarishga to'siq bo'ladigan zona (BPH).
    </div>

    <h3>5.3. Prostatik uretra va verumontanum</h3>
    <p>
      Siydik chiqarish kanali prostata ichidan o'tadi va shu segment
      <strong>prostatik uretra</strong> deyiladi. Uning orqa devorida
      <strong>urug' tepachasi (verumontanum)</strong> joylashgan — bu yerga
      ikkala urug' otish kanali va prostatik utrikulus (Müller qoldig'i) ochiladi.
    </p>

    <h3>5.4. PSA — prostata-spetsifik antigen</h3>
    <p>
      Prostata bezi <strong>PSA (prostate-specific antigen)</strong> ishlab chiqaradi
      — bu ferment semenni suyultirishga yordam beradi. Normal holatda PSA epiteliy
      asosiy membranasidan o'tmaydi, lekin yallig'lanish yoki malign o'zgarishlarda
      qonga oqib chiqib, <strong>qon PSA darajasining oshishi</strong>ga olib keladi.
    </p>

    <div class="callout callout--guide">
      <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
      PSA darajasining oshishi faqat saratonga xos emas — yallig'lanish (prostatit),
      BPH va boshqa noonkologik holatlarda ham ko'tarilishi mumkin. Shu sababli PSA
      yagona diagnostik mezon emas, balki keng kompleks tekshiruv tarkibidagi bir
      ko'rsatkichdir.
    </div>
  </section>

  <!-- ============ 6. OLAT ============ -->
  <section id="olat" class="section">
    <h2><span class="num">6</span>Olat (penis) — qisqacha tuzilishi <span class="src src--book">📚 Kitobda</span></h2>

    <h3>6.1. Asosiy tuzilmalar</h3>
    <p>
      Olat uch silindrsimon to'qimadan iborat: ikkita <strong>g'ovaksimon
      jism (corpus cavernosum)</strong> — erektil to'qima, va bitta
      <strong>g'ovaksimon uretra jismi (corpus spongiosum)</strong> — uretrani
      o'rab turadi va uning uchida boshcha (glans penis)ni hosil qiladi.
    </p>

    <h3>6.2. Uretra olat ichida</h3>
    <p>
      Penil uretra (uretraning olat ichidagi qismi) corpus spongiosum ichida
      joylashgan, normal diametri 8–9 mm. Uning umumiy uzunligi taxminan
      <strong>15 sm</strong>ga yetadi va olat osma bog'lamidan (suspensory ligament)
      boshcha uchidagi tashqi teshikkacha (meatus) davom etadi.
    </p>

    <h3>6.3. Qon ta'minoti</h3>
    <p>
      Olat terisi <strong>tashqi pudendal tomirlar</strong>dan, erektil to'qima esa
      ichki pudendal arteriyaning tarmoqlaridan qon oladi. Bu qon ta'minoti
      erektil funksiyaning fiziologik asosini tashkil etadi.
    </p>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      Olat anatomiyasi va erektil funksiya fiziologiyasi alohida, chuqurroq mavzu
      bo'lib, andrologiya kursida batafsil yoritiladi — bu yerda faqat asosiy
      tanishtiruv ma'lumoti berilgan.
    </div>
  </section>

  <!-- ============ 7. KLINIK AHAMIYATI ============ -->
  <section id="klinik" class="section">
    <h2><span class="num">7</span>Klinik ahamiyati <span class="src src--book">📚 Kitobda</span></h2>

    <h3>7.1. Asosiy klinik tushunchalar</h3>
    <div class="table-wrap">
      <table>
        <caption>4-jadval. Erkak jinsiy a'zolari bilan bog'liq asosiy klinik holatlar</caption>
        <thead><tr><th>Holat</th><th>Qisqacha tavsifi</th></tr></thead>
        <tbody>
          <tr><td><strong>Varikosele</strong></td><td>Pampiniform pleksusning patologik kengayishi, harorat regulyatsiyasini buzadi</td></tr>
          <tr><td><strong>Gidrosele/Spermatosele</strong></td><td>Tunika vaginalis yoki epididim sohasida suyuqlik to'planishi</td></tr>
          <tr><td><strong>Benign prostata giperplaziyasi (BPH)</strong></td><td>O'tish zonasining yosh bilan kattalashishi, siydik chiqarishga to'siq</td></tr>
          <tr><td><strong>Prostata saratoni</strong></td><td>Ko'pincha periferik zonadan boshlanadi</td></tr>
          <tr><td><strong>Zinner sindromi</strong></td><td>Urug' pufakchasi kistasi + buyrak agenezi + urug' otish kanali to'siqligi uchligi</td></tr>
        </tbody>
      </table>
    </div>

    <h3>7.2. Tasvirlash usullari</h3>
    <ul>
      <li><strong>Moshonka ultratovushi</strong> — moyak va epididim patologiyasini baholashning asosiy usuli;</li>
      <li><strong>Transrektal ultratovush (TRUS)</strong> — prostata va urug' pufakchalarini baholash uchun;</li>
      <li><strong>Multiparametrik MRT (mpMRI)</strong> — prostata zonalarini aniq farqlash va saraton shubhasini baholash uchun ortib boruvchi ahamiyatga ega usul.</li>
    </ul>

    <div class="callout callout--warning">
      <strong class="callout-title">Diqqat!</strong>
      Talaba uchun muhim klinik tamoyil: erkak reproduktiv tizimidagi har qanday
      tuzilma (moyak, epididim, prostata, urug' pufakchasi) — bir-biri bilan
      anatomik va funksional jihatdan chambarchas bog'liq. Bir bo'g'indagi muammo
      (masalan, urug' otish kanali to'siqligi) butun zanjirga ta'sir qilishi mumkin.
    </div>
  </section>

  <!-- ============ 8. LUG'AT ============ -->
  <section id="lugat" class="section">
    <h2><span class="num">8</span>Qisqartmalar va atamalar lug'ati</h2>
    <div class="table-wrap">
      <table>
        <caption>5-jadval. Mavzuda ishlatilgan qisqartmalar va atamalar</caption>
        <thead>
          <tr>
            <th>Qisqartma / Atama</th>
            <th>Inglizcha to'liq nomi</th>
            <th>O'zbekcha izohi</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Moyak</strong></td><td>Testis</td><td>Spermatozoid va testosteron ishlab chiqaruvchi juft jinsiy bez</td></tr>
          <tr><td><strong>Epididim</strong></td><td>Epididymis</td><td>Moyakka yopishgan, sperma yetiladigan va saqlanadigan naysimon tuzilma</td></tr>
          <tr><td><strong>Vas deferens</strong></td><td>Vas deferens (ductus deferens)</td><td>Spermani epididimdan urug' otish kanaliga olib boruvchi naycha</td></tr>
          <tr><td><strong>Urug' pufakchasi</strong></td><td>Seminal vesicle</td><td>Semen suyuqligining katta qismini ishlab chiqaruvchi juft bez</td></tr>
          <tr><td><strong>Urug' otish kanali</strong></td><td>Ejaculatory duct</td><td>Vas deferens va urug' pufakchasi qo'shilib hosil bo'lgan, prostatik uretraga ochiladigan kanal</td></tr>
          <tr><td><strong>Tunika albuginea</strong></td><td>Tunica albuginea</td><td>Moyakni o'rab turuvchi qalin, fibroelastik kapsula</td></tr>
          <tr><td><strong>Pampiniform pleksus</strong></td><td>Pampiniform plexus</td><td>Moyakdan qon oqib chiqadigan venalar to'plami</td></tr>
          <tr><td><strong>Leydig hujayralari</strong></td><td>Leydig cells</td><td>Testosteron ishlab chiqaruvchi hujayralar</td></tr>
          <tr><td><strong>Sertoli hujayralari</strong></td><td>Sertoli cells</td><td>Urug' hujayralari rivojlanishini qo'llab-quvvatlovchi hujayralar</td></tr>
          <tr><td><strong>Qon-moyak to'sig'i</strong></td><td>Blood-testis barrier</td><td>Sertoli hujayralari orasidagi zich birikmalar hosil qilgan himoya to'sig'i</td></tr>
          <tr><td><strong>Prostata</strong></td><td>Prostate gland</td><td>Qovuq ostida joylashgan, semen tarkibiga hissa qo'shuvchi bez</td></tr>
          <tr><td><strong>Verumontanum</strong></td><td>Verumontanum (seminal colliculus)</td><td>Prostatik uretra orqa devoridagi ko'tarilma, urug' otish kanallari shu yerga ochiladi</td></tr>
          <tr><td><strong>PSA</strong></td><td>Prostate-specific antigen</td><td>Prostata ishlab chiqaradigan, diagnostik ahamiyatga ega oqsil</td></tr>
          <tr><td><strong>BPH</strong></td><td>Benign prostatic hyperplasia</td><td>Prostataning yoshga bog'liq, benign (zararsiz) kattalashishi</td></tr>
          <tr><td><strong>TRUS</strong></td><td>Transrectal ultrasonography</td><td>Prostata va urug' pufakchalarini to'g'ri ichak orqali ultratovush bilan tekshirish</td></tr>
          <tr><td><strong>mpMRI</strong></td><td>Multiparametric magnetic resonance imaging</td><td>Prostata zonalarini batafsil tasvirlash usuli</td></tr>
          <tr><td><strong>DRE</strong></td><td>Digital rectal examination</td><td>Prostata bezini barmoq orqali to'g'ri ichakdan tekshirish usuli</td></tr>
          <tr><td><strong>Corpus cavernosum</strong></td><td>Corpus cavernosum</td><td>Olatdagi erektil (qonga to'luvchi) g'ovaksimon to'qima</td></tr>
          <tr><td><strong>Corpus spongiosum</strong></td><td>Corpus spongiosum</td><td>Uretrani o'rab turuvchi g'ovaksimon to'qima</td></tr>
        </tbody>
      </table>
    </div>

    <p style="text-align:center; margin-top: 18px;">
      <a class="back-to-top" href="#tarif">⬆ Mavzu boshiga qaytish</a>
    </p>
  </section>

</article>
</main>
$erkak_jinsiy_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
