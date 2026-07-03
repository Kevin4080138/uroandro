-- Prostatit — 12-dars nazariya tarkibi
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'prostatit-umumiy-tasniflash',
  $prostatit_html$
<main class="site-main">
<article class="lesson">

  <!-- HERO -->
  <div class="article-hero">
    <span class="article-hero__eyebrow">📘 12-mavzu · Yallig'lanish kasalliklari</span>
    <h1>Prostatit — NIH tasnifi va to'rt kategoriyaning klinik belgilari</h1>
    <p class="article-hero__lead">
      Prostatit — faqat bakterial infeksiya emas, balki klinik sindromlar majmuasi. Milliy Sog'liqni
      Saqlash Instituti (NIH) tomonidan qabul qilingan to'rt kategoriyali tasnif har bir turni
      to'g'ri tashxislash va davolash uchun asos bo'lib xizmat qiladi. Ushbu darsda NIH tasnifi,
      har bir kategoriyaning belgilari va dastlabki davolash yondashuvi
      <em>Campbell-Walsh-Wein Urology</em> darsligi (bob 27) asosida yoritiladi.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~22 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr, Bob 27</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ul class="toc__list">
      <li><a href="#tasnif">1. NIH tasnifi — umumiy ko'rinish</a></li>
      <li><a href="#kat1">2. Kategoriya I — O'tkir bakterial prostatit</a></li>
      <li><a href="#kat2">3. Kategoriya II — Surunkali bakterial prostatit</a></li>
      <li><a href="#kat3">4. Kategoriya III — CP/CPPS</a></li>
      <li><a href="#kat4">5. Kategoriya IV — Asimptomatik</a></li>
      <li><a href="#qiyosiy">6. To'rt kategoriya qiyosiy jadvali</a></li>
      <li><a href="#diagnostika">7. Diagnostika yondashuvi</a></li>
      <li><a href="#davolash">8. Davolash tamoyillari</a></li>
      <li><a href="#xulosa">9. Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">10. Qisqartmalar va atamalar lug'ati</a></li>
    </ul>
  </nav>

  <!-- 1. TASNIF -->
  <section class="section" id="tasnif">
    <h2><span class="num">1</span>NIH tasnifi — umumiy ko'rinish</h2>
    <p>
      Prostatit tasnifining zamonaviy tizimi 1995 va 1998-yillardagi konsensus konferensiyalarida
      ishlab chiqilib, 1999-yilda <span class="term">NIH (National Institutes of Health)</span>
      tomonidan nashr etildi. Undan oldingi Drach (1978) tasnifiga asoslangan bo'lsa-da, u
      klinik amaliyotda yuzaga kelgan muammolarni bartaraf etish maqsadida sezilarli darajada
      takomillashtirildi.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>1-jadval. Prostatitning NIH tasnifi (Krieger et al., 1999)</caption>
        <thead>
          <tr><th>Kategoriya</th><th>Nomi</th><th>Asosiy xususiyat</th><th>Ulushi</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>I</strong></td>
            <td>O'tkir bakterial prostatit (ABP)</td>
            <td>O'tkir bakterial infeksiya — isitma, LUTS, og'riq</td>
            <td>Kam (&lt;5%)</td>
          </tr>
          <tr>
            <td><strong>II</strong></td>
            <td>Surunkali bakterial prostatit (CBP)</td>
            <td>Bir xil bakteriya bilan qayta uchraydigan UTI — epizodlar oralig'ida asimptomatik</td>
            <td>5–10%</td>
          </tr>
          <tr>
            <td><strong>IIIA</strong></td>
            <td>CP/CPPS — yallig'lanishli</td>
            <td>Surunkali chanoq og'rig'i ≥3 oy; EPS/VB3/sperma suyuqligida leykotsitlar bor</td>
            <td rowspan="2">~90%</td>
          </tr>
          <tr>
            <td><strong>IIIB</strong></td>
            <td>CP/CPPS — yallig'lanishsiz</td>
            <td>Surunkali chanoq og'rig'i ≥3 oy; yallig'lanish hujayralari yo'q</td>
          </tr>
          <tr>
            <td><strong>IV</strong></td>
            <td>Asimptomatik yallig'lanishli prostatit</td>
            <td>Og'riq yo'q; boshqa tekshiruv davomida tasodifan topiladi</td>
            <td>Noma'lum</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--guide">
      <div class="callout__icon">💡</div>
      <div class="callout__body">
        <strong class="callout-title">Muhim eslatma</strong>
        <p>
          Bakterial prostatit (I va II kategoriya) barcha prostatit holatlarining faqat <strong>5–10
          foizini</strong> tashkil etadi. Qolgan 90 foiz — CP/CPPS (III kategoriya), ya'ni
          infeksiya emas, balki surunkali og'riq sindromi. Bu farqni anglash davolash
          taktikasini belgilashda hal qiluvchi ahamiyatga ega.
        </p>
      </div>
    </div>
  </section>

  <!-- 2. KATEGORIYA I -->
  <section class="section" id="kat1">
    <h2><span class="num">2</span>Kategoriya I — O'tkir bakterial prostatit (ABP)</h2>
    <p>
      <span class="term">O'tkir bakterial prostatit (acute bacterial prostatitis, ABP)</span> —
      20–40 yoshlarda va 60 yoshdan keyin ikkinchi cho'qqisi bo'lgan ikki fazali tarqalishga ega.
      Asosiy yo'l — uretradan ko'tariladigan infeksiya; prostat biopsiyasi, kateter va instrumentatsiya
      xavf omillari hisoblanadi.
    </p>

    <h3>2.1. Klinik belgilar</h3>
    <ul>
      <li>UTI belgilari: siydik tezligi, dizuriya</li>
      <li>Tizimli infeksiya belgilari: isitma, qaltirash, umumiy holsizlik, miyalgia</li>
      <li>Og'riq: qorin pasti, perineum sohasida</li>
      <li>O'tkir siydik ushlanishi — shishgan prostata tufayli</li>
      <li>Og'ir hollarda: septik shok, tomir barqarorligi buzilishi, ong holati o'zgarishi</li>
    </ul>

    <h3>2.2. Asosiy qo'zg'atuvchilar</h3>
    <p>
      E. coli — 65–80% hollarda asosiy sabab. Boshqa gramm-manfiy organizmlar:
      Pseudomonas aeruginosa, Proteus mirabilis, Klebsiella, Serratia spp. Enterococcus —
      10% gacha. Jinsiy faol yoshlarda N. gonorrhoeae ko'rib chiqilishi kerak.
    </p>

    <div class="callout callout--warning">
      <div class="callout__icon">🚨</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! — Prostat massaji YASAQ</strong>
        <p>
          O'tkir prostatitda <strong>prostat massaji mutlaq kontrindikatsiyadir</strong> —
          massaj sepsis va bakteriemiyaga olib kelishi mumkin. Qon ekinmasi
          isitma yoki qaltirash bo'lganda antibiotik berishdan oldin olinishi kerak.
          PSA testini buyurish ham tavsiya etilmaydi — o'tkir fazada PSA doim yuqori bo'ladi
          va u prostat saratorni ko'rsatmaydi.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. KATEGORIYA II -->
  <section class="section" id="kat2">
    <h2><span class="num">3</span>Kategoriya II — Surunkali bakterial prostatit (CBP)</h2>
    <p>
      <span class="term">Surunkali bakterial prostatit (chronic bacterial prostatitis, CBP)</span> —
      prostatada doimiy bakteria manbai bo'lib, bir xil organizm tomonidan qayta-qayta kelib
      chiqadigan UTI bilan tavsiflanadi. Bemorlar epizodlar oralig'ida nisbatan asimptomatik
      bo'ladi — bu kat. I va CP/CPPS dan farqlaydigan muhim xususiyat.
    </p>

    <h3>3.1. Klinik belgilar</h3>
    <ul>
      <li>Qayta uchraydigan UTI — bir xil bakteriya bilan (ekinmada tasdiqlanadi)</li>
      <li>Dizuriya va og'riq — antibiotik davomida yaxshilanadi, to'xtatilgandan keyin qaytadi</li>
      <li>Epizodlar oralig'ida bemorlar odatda o'zini yaxshi his qiladi</li>
    </ul>

    <h3>3.2. Davolash xususiyatlari</h3>
    <p>
      CBP davolash uchun prostata to'qimasiga yaxshi singadigan antibiotiklar zarur.
      <strong>Ftorokinolonlar</strong> prostata suyuqligiga mukammal kirib boradi
      (zwitterion tuzilishi va yuqori lipid eruvchanlik tufayli). Davolash muddati —
      4 dan 12 haftaga qadar. Qaytuvchi holatlarda uzoq muddatli antibiotik suppressiv
      davolash yoki <span class="term">TURP (prostataning transuretal rezeksiyasi)</span>
      ko'rib chiqilishi mumkin.
    </p>
  </section>

  <!-- 4. KATEGORIYA III -->
  <section class="section" id="kat3">
    <h2><span class="num">4</span>Kategoriya III — Surunkali prostatit / surunkali chanoq og'rig'i sindromi (CP/CPPS)</h2>
    <p>
      Barcha prostatit holatlarining ~90 foizini tashkil etuvchi eng keng tarqalgan kategoriya.
      <span class="term">CP/CPPS</span>ning NIH ta'rifi: so'nggi 6 oyning kamida 3 oyida
      chanoqda og'riq yoki noqulaylik; standart mikrobiologik usullar bilan uropatogen bakteriya
      topilmagan holat.
    </p>
    <p>
      Muhim: og'riq manbai doim prostata emas. "Prostatit" atamasi tarixiy bo'lib,
      zamonaviy tushunchaga ko'ra og'riq chanoq tubi, nevrolog yoki psixologik omillardan
      ham kelib chiqishi mumkin.
    </p>

    <h3>4.1. Klinik belgilar — CPSI bo'yicha uch soha</h3>
    <p>
      NIH <span class="term">Surunkali Prostatit Simptom Indeksi (NIH-CPSI)</span> uch sohani
      qamrab oladi:
    </p>
    <ul>
      <li><strong>Og'riq (Pain domain):</strong> perineum (63%), moyaklar (58%), suprapubik soha (42%), penis uchi (32%), ejakulyatsiya paytida og'riq (48%)</li>
      <li><strong>Siydik simptomlari (Urinary domain):</strong> siydik tezligi, to'siqli belgilar</li>
      <li><strong>Hayot sifati (QOL domain):</strong> kundalik faoliyatga ta'sir</li>
    </ul>

    <h3>4.2. IIIA va IIIB — farqi muhimmi?</h3>
    <p>
      IIIA — EPS/VB3 da leykotsitlar bor (yallig'lanishli); IIIB — yo'q (yallig'lanishsiz).
      Ammo klinik amaliyotda ikkisi o'rtasida <strong>sezilarli klinik farq ko'rsatilmagan</strong>.
      Shu sababli hozirgi qo'llanmalar bu ikki subkategoriyani mikroskopiya asosida farqlashni
      tavsiya etmaydi.
    </p>

    <h3>4.3. UPOINT fenotiplashtirish tizimi</h3>
    <p>
      CP/CPPS turli sabablar kombinatsiyasi natijasida yuzaga kelishi mumkin. <span class="term">UPOINT</span>
      tizimi bemorni 6 soha bo'yicha tavsiflaydi — har bir bemor o'ziga xos "qor parchasi"
      (snowflake) kabi noyob profil ko'rsatadi:
    </p>
    <ul>
      <li><strong>U</strong> — Urinary (siydik simptomlari)</li>
      <li><strong>P</strong> — Psychosocial (psixosocial omillar)</li>
      <li><strong>O</strong> — Organ-specific (prostataga xos belgilar)</li>
      <li><strong>I</strong> — Infection (infeksiya belgilari)</li>
      <li><strong>N</strong> — Neurologic/Systemic (nevrologik/tizimli)</li>
      <li><strong>T</strong> — Tenderness (muskuloskeletal og'riqlilik)</li>
    </ul>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma</strong>
        <p>
          CP/CPPS — istisno qilish tashxisi. Diagnoz qo'yishdan oldin aktiv uretrit, urogenital
          saraton, siydik yo'li kasalligi, funksional ahamiyatli uretra torayishi va qovuqqa
          ta'sir qiluvchi nevrologik kasallik istisno qilinishi shart.
        </p>
      </div>
    </div>
  </section>

  <!-- 5. KATEGORIYA IV -->
  <section class="section" id="kat4">
    <h2><span class="num">5</span>Kategoriya IV — Asimptomatik yallig'lanishli prostatit</h2>
    <p>
      Bemorning hech qanday og'riq yoki noqulaylik shikoyati yo'q. Yallig'lanish —
      EPS, VB3, sperma suyuqligi yoki biopsiya namunasida leykotsitlar borligi bilan
      tavsiflanadi. Ko'pincha boshqa sabab bilan amalga oshirilgan tekshiruv (prostata saratoni
      biopsiyasi, bepushtlik uchun sperma tahlili) davomida tasodifan aniqlanadi.
    </p>
    <p>
      Histologik jihatdan prostata yallig'lanishi juda keng tarqalgan — katta yoshdagi
      erkaklarda o'tkazilgan autopsiya tadqiqotlarida 70% dan ko'proqida surunkali
      yallig'lanish topilgan. Bu klinik ahamiyati hali to'liq aniqlanmagan topilma hisoblanadi.
    </p>
  </section>

  <!-- 6. QIYOSIY JADVAL -->
  <section class="section" id="qiyosiy">
    <h2><span class="num">6</span>To'rt kategoriya qiyosiy jadvali</h2>
    <div class="table-wrap">
      <table class="data-table">
        <caption>2-jadval. NIH prostatit kategoriyalarining klinik qiyosiy ko'rinishi</caption>
        <thead>
          <tr><th>Xususiyat</th><th>Kat. I (ABP)</th><th>Kat. II (CBP)</th><th>Kat. III (CP/CPPS)</th><th>Kat. IV</th></tr>
        </thead>
        <tbody>
          <tr><td>Isitma</td><td>Bor (ko'pincha yuqori)</td><td>Ba'zida</td><td>Yo'q</td><td>Yo'q</td></tr>
          <tr><td>Og'riq</td><td>Qorin pasti, perineum</td><td>Kam, epizodlarda</td><td>Surunkali, ≥3 oy, chanoq</td><td>Yo'q</td></tr>
          <tr><td>Siydik ekinmasi</td><td>Musbat</td><td>Musbat (qayta)</td><td>Manfiy</td><td>Manfiy</td></tr>
          <tr><td>EPS/VB3 da WBC</td><td>Bor</td><td>Bor</td><td>IIIA: bor; IIIB: yo'q</td><td>Bor</td></tr>
          <tr><td>Prostat massaji</td><td>MUTLAQ YASAQ</td><td>Diagnostika uchun</td><td>Diagnostika uchun</td><td>Diagnostika uchun</td></tr>
          <tr><td>Asosiy davo</td><td>IV antibiotik, kasalxona</td><td>Ftorokinolonlar 4–12 hafta</td><td>Multimodal; antibiotik + α-bloker</td><td>Ko'pincha davo shart emas</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 7. DIAGNOSTIKA -->
  <section class="section" id="diagnostika">
    <h2><span class="num">7</span>Diagnostika yondashuvi</h2>

    <h3>7.1. Siydik namunalari — bo'lingan tekshiruv usuli</h3>
    <p>
      Klassik <span class="term">Meares-Stamey to'rt stakan usuli</span> — VB1 (birinchi qism),
      VB2 (o'rta qism), EPS (ekspressiv prostata sekrti) va VB3 (massaj keyingi siydik) —
      lokalizatsiya uchun "oltin standart" edi. Hozirgi amaliyotda soddalashtirilgan
      <strong>ikki stakan usuli</strong> (VB2 + VB3) ko'proq qo'llaniladi.
    </p>

    <h3>7.2. Asosiy tekshiruvlar kategoriyaga qarab</h3>
    <div class="table-wrap">
      <table class="data-table">
        <caption>3-jadval. Prostatit diagnostikasida asosiy tekshiruvlar</caption>
        <thead>
          <tr><th>Tekshiruv</th><th>Ko'rsatkich</th></tr>
        </thead>
        <tbody>
          <tr><td>Siydik tahlili + ekinma</td><td>Barcha kategoriyalarda; kat. I va II da majburiy</td></tr>
          <tr><td>Qon ekinmasi</td><td>Kat. I — isitma yoki qaltirash bor bo'lsa, antibiotikdan oldin</td></tr>
          <tr><td>Kreatinin, elektrolitlar</td><td>Kat. I — septik holat, antibiotik dozasini moslash</td></tr>
          <tr><td>PVR (ultratovush)</td><td>Barcha kategoriyalarda — siydik ushlanishini istisno qilish</td></tr>
          <tr><td>TRUS yoki KT</td><td>Prostat absessi shubhasi bo'lganda (kat. I — 48 soatda javob yo'q)</td></tr>
          <tr><td>PSA</td><td>Kat. I da buyurish tavsiya etilmaydi — doim yuqori; III da ko'rsatilmaydi</td></tr>
          <tr><td>Siydik sitologiyasi</td><td>Kat. III da — irritativ simptomlar va gematuriyada qovuq CIS istisno qilish</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 8. DAVOLASH -->
  <section class="section" id="davolash">
    <h2><span class="num">8</span>Davolash tamoyillari</h2>

    <h3>8.1. Kategoriya I (ABP)</h3>
    <p>
      Tizimli infeksiya belgilari (sepsis, yuqori isitma, qusish) bo'lsa — kasalxonaga yotqizish,
      IV antibiotiklar (aminoglikozid + ampitsillin, 2–3 avlod sefalosporin yoki karbapenem),
      gidratatsiya va laborator kuzatuv. Siydik ushlanishida suprapubik kateter — uretral kateterni
      qisqa muddatli qo'llash ham mumkin, ammo uzoq muddatli drenajda suprapubik yo'l afzal.
      2 haftadan so'ng og'iz orqali davom ettiriladi.
    </p>

    <h3>8.2. Kategoriya II (CBP)</h3>
    <p>
      Ftorokinolonlar — prostata to'qimasiga eng yaxshi singadigani sababli birinchi tanlash.
      Davolash muddati 4–12 hafta. Chlamydial prostatitda azitromitsin siprofloksatsinga
      nisbatan afzal. Rezistentlik holatlarida TURP ko'rib chiqilishi mumkin.
    </p>

    <h3>8.3. Kategoriya III (CP/CPPS)</h3>
    <p>
      Multimodal yondashuv eng yaxshi natija beradi. Meta-tahlillar antibiotik va α-bloker
      kombinatsiyasi NIH-CPSI ballini 13,8 ballga kamaytirishi — monoterapiyaga nisbatan
      ancha yuqori ekanini ko'rsatdi. UPOINT tizimiga asoslangan fenotiplashtirish orqali
      individual davolash rejasi tuziladi:
    </p>
    <ul>
      <li>Antibiotiklar (qisqa kurs) — infeksiya sohasida</li>
      <li>α-blokerlar — siydik sohasida</li>
      <li>Psixologik yordam/antidepressantlar — psixosocial sohada</li>
      <li>Chanoq tubi davolash mashqlari — muskuloskeletal sohada</li>
      <li>NSAIDlar — og'riq va yallig'lanishga qarshi</li>
    </ul>

    <div class="callout callout--guide">
      <div class="callout__icon">📋</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya — CP/CPPS</strong>
        <p>
          Qisqa muddatli simptomi bo'lgan bemorlarda antibiotik davolash uzoq muddatlilarga
          nisbatan ko'proq foyda beradi. Antibiotiklar CP/CPPSda infeksiya bo'lmagan
          holatlarda ham yallig'lanishga qarshi ta'sir (IL-6 va TNF-α pasaytirish) orqali
          qisman yordam berishi mumkin — bu empirik davolash uchun ilmiy asoslanish.
        </p>
      </div>
    </div>
  </section>

  <!-- 9. XULOSA -->
  <section class="section" id="xulosa">
    <h2><span class="num">9</span>Xulosa va asosiy fikrlar</h2>
    <div class="keypoints">
      <p class="keypoints__title">⭐ Asosiy xulosalar</p>
      <ul>
        <li>Prostatit NIH tomonidan 4 kategoriyaga tasniflanadi: I (o'tkir bakterial), II (surunkali bakterial), III (CP/CPPS) va IV (asimptomatik).</li>
        <li>Barcha prostatit holatlarining 90% dan ko'pi — CP/CPPS (kat. III); faqat 5–10% haqiqiy bakterial infeksiya.</li>
        <li>O'tkir prostatitda (kat. I) prostat massaji MUTLAQ YASAQ — sepsis xavfi.</li>
        <li>PSA o'tkir prostatitda doim yuqori bo'ladi — u prostat saratoni ko'rsatkichi sifatida ishlatilmaydi.</li>
        <li>Kat. II davolashda prostata to'qimasiga yaxshi singaydigan antibiotiklar (ftorokinolonlar) zarur — oddiy antibiotiklar etarli emas.</li>
        <li>CP/CPPS — istisno qilish tashxisi; multimodal, UPOINT asosida fenotiplashtirish eng yaxshi natija beradi.</li>
        <li>Kat. IV — tasodifan topiladi, ko'pincha davo talab etmaydi.</li>
      </ul>
    </div>
    <p class="source-note">
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr (2026), Bob 27 — Inflammatory and Pain Conditions
      of the Lower Genitourinary Tract asosida tayyorlangan.
      Aniq klinik qarorlar uchun dolzarb AUA/EAU qo'llanmalariga murojaat qiling.
    </p>
  </section>

  <!-- 10. LUG'AT -->
  <section class="section" id="lugat">
    <h2><span class="num">10</span>Qisqartmalar va atamalar lug'ati</h2>
    <p>Mavzuda ishlatilgan barcha qisqartma va murakkab atamalarning to'liq izohi quyidagi jadvalda keltirilgan:</p>
    <div class="table-wrap">
      <table class="data-table glossary-table">
        <thead>
          <tr><th>Qisqartma / Atama</th><th>Inglizcha to'liq nomi</th><th>O'zbekcha izohi</th></tr>
        </thead>
        <tbody>
          <tr><td>ABP</td><td>Acute Bacterial Prostatitis</td><td>O'tkir bakterial prostatit — NIH kategoriya I</td></tr>
          <tr><td>CBP</td><td>Chronic Bacterial Prostatitis</td><td>Surunkali bakterial prostatit — NIH kategoriya II</td></tr>
          <tr><td>CP/CPPS</td><td>Chronic Prostatitis / Chronic Pelvic Pain Syndrome</td><td>Surunkali prostatit / surunkali chanoq og'rig'i sindromi — NIH kategoriya III</td></tr>
          <tr><td>NIH</td><td>National Institutes of Health</td><td>AQSh Milliy Sog'liqni Saqlash Institutlari</td></tr>
          <tr><td>NIH-CPSI</td><td>NIH Chronic Prostatitis Symptom Index</td><td>NIH Surunkali Prostatit Simptom Indeksi — og'riq, siydik va hayot sifatini baholash</td></tr>
          <tr><td>EPS</td><td>Expressed Prostatic Secretions</td><td>Massaj orqali olingan prostata suyuqligi</td></tr>
          <tr><td>VB3</td><td>Voided Bladder 3 (post-massage urine)</td><td>Massajdan keyingi siydik namunasi</td></tr>
          <tr><td>UPOINT</td><td>Urinary, Psychosocial, Organ-specific, Infection, Neurologic, Tenderness</td><td>CP/CPPS fenotiplashtirish tizimi — 6 soha</td></tr>
          <tr><td>TURP</td><td>Transurethral Resection of the Prostate</td><td>Prostataning transuretal rezeksiyasi</td></tr>
          <tr><td>PVR</td><td>Postvoid Residual</td><td>Siydik chiqargandan keyin qovuqda qolgan siydik hajmi</td></tr>
          <tr><td>TRUS</td><td>Transrectal Ultrasound</td><td>Transrektal ultratovush tekshiruvi</td></tr>
          <tr><td>PSA</td><td>Prostate-Specific Antigen</td><td>Prostata-spetsifik antigen — prostataga xos, lekin saraton spetsifik bo'lmagan marker</td></tr>
          <tr><td>QOL</td><td>Quality of Life</td><td>Hayot sifati</td></tr>
          <tr><td>ESBL</td><td>Extended-Spectrum Beta-Lactamase</td><td>Keng spektrli beta-laktamaza — rezistentlik markeri</td></tr>
        </tbody>
      </table>
    </div>
  </section>

</article>
</main>
$prostatit_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
