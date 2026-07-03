-- Siydik tosh kasalligi — 14-dars nazariya tarkibi
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'siydik-tosh-kasalligi-asoslari',
  $tosh_html$
<main class="site-main">
<article class="lesson">

  <!-- HERO -->
  <div class="article-hero">
    <span class="article-hero__eyebrow">📘 14-mavzu · Toshbogʻlanish kasalliklari</span>
    <h1>Siydik tosh kasalligi — asosiy tushunchalar va klinika</h1>
    <p class="article-hero__lead">
      Siydik tosh kasalligi (urolithiasis) — buyrak yoki siydik yo'llarida qattiq kristall
      to'planmalarining (toshlarning) hosil bo'lishi. Bu — urologiyada eng ko'p uchraydigan va
      qaytalanuvchi holatlardan biri bo'lib, siydik minerallar almashinuvi buzilishi natijasi
      sifatida qaraladi. Ushbu darsda tosh hosil bo'lish mexanizmi, tosh turlari, klinik ko'rinish
      va dastlabki diagnostika <em>Campbell-Walsh-Wein Urology</em> darsligi (bob 40, 54) asosida
      yoritiladi.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~22 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr, Bob 40, 54</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ul class="toc__list">
      <li><a href="#tarif">1. Ta'rif va ahamiyati</a></li>
      <li><a href="#hosil">2. Tosh qanday hosil bo'ladi</a></li>
      <li><a href="#turlari">3. Tosh turlari va tarkibi</a></li>
      <li><a href="#metabolik">4. Metabolik xavf omillari</a></li>
      <li><a href="#klinik">5. Klinik ko'rinish — buyrak sanchig'i</a></li>
      <li><a href="#diagnostika">6. Diagnostika va tasvirlash</a></li>
      <li><a href="#davolash">7. Davolash tamoyillari (umumiy)</a></li>
      <li><a href="#xulosa">8. Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">9. Qisqartmalar va atamalar lug'ati</a></li>
    </ul>
  </nav>

  <!-- 1. TA'RIF -->
  <section class="section" id="tarif">
    <h2><span class="num">1</span>Ta'rif va ahamiyati</h2>
    <p>
      <span class="term">Siydik tosh kasalligi (urolithiasis / nephrolithiasis)</span> — siydik
      tarkibidagi kristall hosil qiluvchi moddalarning (kalsiy, oksalat, siydik kislotasi va boshqalar)
      to'yingan darajadan oshib, qattiq to'planma — <span class="term">tosh (calculus)</span> hosil
      qilishi. Toshlar buyrakda, siydik yo'lida yoki qovuqda joylashishi mumkin.
    </p>
    <p>
      Zamonaviy tushunchaga ko'ra, tosh kasalligi shunchaki mahalliy urologik muammo emas, balki
      <strong>mineral almashinuvi buzilishi</strong> (a disorder of mineral metabolism) sifatida
      qaraladi va u yurak-qon tomir kasalliklari, surunkali buyrak kasalligi (CKD) hamda suyak
      mineral zichligining pasayishi bilan bog'liq.
    </p>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma — yuqori qaytalanish</strong>
        <p>
          Tosh kasalligining eng muhim xususiyati — <strong>yuqori qaytalanish darajasi</strong>.
          Bolalikda tosh o'tkazgan bemorlarning taxminan 50 foizida 3–5 yil ichida yangi tosh
          rivojlanadi. Shu sababli tosh chiqargan bemorda metabolik baholash va profilaktika
          uzoq muddatli strategiyaning muhim qismi hisoblanadi.
        </p>
      </div>
    </div>
  </section>

  <!-- 2. HOSIL BO'LISH -->
  <section class="section" id="hosil">
    <h2><span class="num">2</span>Tosh qanday hosil bo'ladi</h2>
    <p>
      Tosh hosil bo'lishining asosiy sharti — <span class="term">siydikning to'yinishi
      (supersaturation)</span>. Siydikda kristall hosil qiluvchi moddalar konsentratsiyasi
      eruvchanlik chegarasidan oshganda, kristallar cho'kadi va asta-sekin o'sib toshga aylanadi.
    </p>

    <h3>2.1. Asosiy bosqichlar</h3>
    <ul>
      <li><strong>To'yinish (supersaturation)</strong> — siydikda modda konsentratsiyasining ortishi (masalan, kam suyuqlik ichish, ko'p tuz)</li>
      <li><strong>Yadrolanish (nucleation)</strong> — birinchi kristal yadrosining paydo bo'lishi</li>
      <li><strong>Kristal o'sishi va agregatsiyasi</strong> — kristallarning birlashib kattalashishi</li>
      <li><strong>Ushlanish (retention)</strong> — kristalning buyrak to'qimasiga yopishishi</li>
    </ul>

    <h3>2.2. Randall plyakalari</h3>
    <p>
      Ko'pchilik idiopatik kalsiy oksalat toshlari buyrak so'rg'ichlari (papilla) yuzasida
      <span class="term">Randall plyakalari (Randall's plaques)</span> — gidroksiapatitdan iborat
      oq to'planmalar — ustida o'sadi. Bu plyakalar kalsiy oksalat toshining birikadigan "poydevori"
      bo'lib xizmat qiladi.
    </p>

    <div class="callout callout--guide">
      <div class="callout__icon">💡</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          Siydikda tabiiy <strong>inhibitorlar (tormozlovchi moddalar)</strong> ham mavjud — masalan,
          sitrat va magniy. Ular kristal hosil bo'lishini sekinlashtiradi. Sitrat kamayishi
          (gipositraturiya) tosh xavfini oshiradi — shuning uchun davolashda ko'pincha
          kaliy sitrat qo'llaniladi.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. TOSH TURLARI -->
  <section class="section" id="turlari">
    <h2><span class="num">3</span>Tosh turlari va tarkibi</h2>
    <p>
      Toshlar kimyoviy tarkibiga qarab bir necha turga bo'linadi. Kattalarda tosh tarkibi taqsimoti
      quyidagicha:
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>1-jadval. Siydik toshlarining asosiy turlari va xususiyatlari</caption>
        <thead>
          <tr><th>Tosh turi</th><th>Ulushi (kattalar)</th><th>Asosiy xususiyatlar</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Kalsiy oksalat</strong></td>
            <td>75–80%</td>
            <td>Eng keng tarqalgan; KTda zich (600–1200 HU); siydik pH ga kam bog'liq</td>
          </tr>
          <tr>
            <td><strong>Kalsiy fosfat</strong></td>
            <td>~5%</td>
            <td>Ishqorli siydikda (yuqori pH) hosil bo'ladi; RTA bilan bog'liq bo'lishi mumkin</td>
          </tr>
          <tr>
            <td><strong>Struvit (infeksion)</strong></td>
            <td>10–20%</td>
            <td>Ureaza ishlab chiqaruvchi bakteriyalar (Proteus) infeksiyasida; "shox tosh" (staghorn) hosil qiladi</td>
          </tr>
          <tr>
            <td><strong>Siydik kislotasi (urat)</strong></td>
            <td>~5%</td>
            <td>Kislotali siydikda (past pH); KTda rentgen o'tkazuvchi (radiolusent); 200–400 HU</td>
          </tr>
          <tr>
            <td><strong>Sistin</strong></td>
            <td>&lt;2%</td>
            <td>Sistinuriya (nasliy kasallik)da; ko'pincha yoshlarda va shox tosh shaklida</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! — Struvit va shox tosh</strong>
        <p>
          Struvit toshlari (magniy-ammoniy-fosfat) siydik infeksiyasi bilan bog'liq bo'lib,
          tez o'sadi va butun buyrak jomini to'ldiradigan <strong>shox tosh (staghorn calculus)</strong>
          hosil qilishi mumkin. Bu toshlar buyrak funksiyasini yo'qotish va sepsis xavfi tug'diradi,
          shu sababli faol davolashni talab qiladi.
        </p>
      </div>
    </div>
  </section>

  <!-- 4. METABOLIK XAVF OMILLARI -->
  <section class="section" id="metabolik">
    <h2><span class="num">4</span>Metabolik xavf omillari</h2>
    <p>
      Tosh hosil bo'lishiga olib keluvchi asosiy metabolik buzilishlar 24 soatlik siydik tahlili
      orqali aniqlanadi:
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>2-jadval. Asosiy metabolik xavf omillari</caption>
        <thead>
          <tr><th>Buzilish</th><th>Nima anglatadi</th><th>Bog'liq tosh turi</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Giperkaltsiuriya</strong> (hypercalciuria)</td><td>Siydikda kalsiy ko'payishi — eng keng tarqalgan buzilish (tosh bemorlarining 30–50%)</td><td>Kalsiy oksalat/fosfat</td></tr>
          <tr><td><strong>Giperoksaluriya</strong> (hyperoxaluria)</td><td>Siydikda oksalat ko'payishi — ovqat yoki ichak so'rilishi buzilishi tufayli</td><td>Kalsiy oksalat</td></tr>
          <tr><td><strong>Giperurikozuriya</strong> (hyperuricosuria)</td><td>Siydikda siydik kislotasi ko'payishi — go'sht ovqat, purin almashinuvi buzilishi</td><td>Siydik kislotasi; kalsiy oksalat (epitaksi)</td></tr>
          <tr><td><strong>Gipositraturiya</strong> (hypocitraturia)</td><td>Siydikda sitrat kamayishi — tormozlovchi omil yo'qolishi</td><td>Kalsiy toshlari</td></tr>
          <tr><td><strong>Past siydik hajmi</strong></td><td>Kam suyuqlik ichish — barcha moddalar konsentratsiyasini oshiradi</td><td>Barcha turlar</td></tr>
        </tbody>
      </table>
    </div>

    <p>
      Bundan tashqari, gen omillari ham muhim: egizaklar tadqiqotida tosh kasalligining nasliy
      moyilligi ayollarda 46%, erkaklarda 56–57% ni tashkil etadi. Kam suyuqlik ichish va ko'p tuz
      iste'moli — g'arb parhezining eng muhim ikki oziq-ovqat xavf omili hisoblanadi.
    </p>
  </section>

  <!-- 5. KLINIK KO'RINISH -->
  <section class="section" id="klinik">
    <h2><span class="num">5</span>Klinik ko'rinish — buyrak sanchig'i (renal colic)</h2>
    <p>
      Tosh siydik yo'lini to'sib qo'yganda o'tkir, kuchli og'riq — <span class="term">buyrak sanchig'i
      (renal colic)</span> paydo bo'ladi. Bu og'riq buyrak jomi va siydik yo'lining to'lib-toshib
      cho'zilishi natijasida yuzaga keladi.
    </p>

    <h3>5.1. Asosiy belgilar</h3>
    <ul>
      <li><strong>Kolikasimon og'riq</strong> — to'lqinsimon, kuchayib-susayib turadigan; bemor tinch turolmay, qulay holat izlaydi</li>
      <li><strong>Og'riq joylashuvi va tarqalishi</strong> — bel-qovurg'a burchagidan boshlanib, tosh pastga tushgani sari qov, moyak yoki labiyaga tarqaladi</li>
      <li><strong>Gematuriya</strong> — mikroskopik yoki ko'zga ko'rinadigan; ko'pincha og'riq bilan birga</li>
      <li><strong>Ko'ngil aynishi va qusish</strong> — umumiy nerv ta'minoti tufayli</li>
      <li><strong>Dizuriya va siydik tezligi</strong> — tosh siydik yo'lining pastki qismiga yaqinlashganda</li>
    </ul>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma — og'riqsiz gematuriya</strong>
        <p>
          To'siqli tosh kasalligida <strong>og'riqsiz gematuriya odatiy emas</strong>. Agar bemorda
          og'riqsiz gematuriya bo'lsa, boshqa sabablar (ayniqsa urologik saraton) ehtimoli
          e'tibordan chetda qolmasligi kerak. Tosh og'riq bilan namoyon bo'ladigan holat hisoblanadi.
        </p>
      </div>
    </div>

    <div class="callout callout--warning">
      <div class="callout__icon">🚨</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! — To'silgan + infeksiyalangan tosh</strong>
        <p>
          Isitma bilan kechayotgan to'silgan tosh — <strong>shoshilinch urologik holat</strong>
          (obstructed infected stone / urosepsis). Bunday holatda siydik yo'lini zudlik bilan
          dekompressiya qilish (ureteral stent yoki perkutan nefrostomiya) — antibiotikdan muhimroq
          birinchi qadam hisoblanadi.
        </p>
      </div>
    </div>
  </section>

  <!-- 6. DIAGNOSTIKA -->
  <section class="section" id="diagnostika">
    <h2><span class="num">6</span>Diagnostika va tasvirlash</h2>

    <h3>6.1. Laborator tekshiruvlar</h3>
    <ul>
      <li><strong>Siydik tahlili</strong> — gematuriya, kristalluriya, infeksiya belgilari (leykotsit, nitrit)</li>
      <li><strong>Siydik ekinmasi</strong> — infeksiya shubhasi bo'lganda</li>
      <li><strong>Qon tahlili</strong> — kreatinin (buyrak funksiyasi), kalsiy, siydik kislotasi</li>
      <li><strong>24 soatlik siydik tahlili</strong> — metabolik baholash uchun (kalsiy, oksalat, sitrat, siydik kislotasi, hajm, pH)</li>
    </ul>

    <h3>6.2. Tasvirlash usullari</h3>
    <div class="table-wrap">
      <table class="data-table">
        <caption>3-jadval. Tosh kasalligida tasvirlash usullari</caption>
        <thead>
          <tr><th>Usul</th><th>Sezuvchanlik/aniqlik</th><th>Izoh</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Kontrastsiz KT (NCCT)</strong></td>
            <td>94–95% / 95–98%</td>
            <td>Kattalar uchun "oltin standart" (AUA); deyarli barcha tosh turlarini aniqlaydi (indinavir toshlaridan tashqari); nurlanish kamchiligi</td>
          </tr>
          <tr>
            <td><strong>Ultratovush (UTT)</strong></td>
            <td>Pastroq sezuvchanlik</td>
            <td>EAU birinchi tanlash; nurlanishsiz — bolalar va homiladorlar uchun afzal; "twinkle artefakt" va akustik soya toshni aniqlaydi</td>
          </tr>
          <tr>
            <td><strong>Rentgen (KUB)</strong></td>
            <td>O'zgaruvchan</td>
            <td>Kalsiyli toshlar ko'rinadi; siydik kislotasi toshlari ko'rinmaydi; kuzatuvda foydali</td>
          </tr>
          <tr>
            <td><strong>DECT (ikki energiyali KT)</strong></td>
            <td>~99% (urat farqlash)</td>
            <td>Tosh tarkibini (urat va urat bo'lmagan) yuqori aniqlik bilan farqlaydi</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--guide">
      <div class="callout__icon">📋</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya — nurlanish va yosh</strong>
        <p>
          KT nurlanishi (10–20 mSv) — ayniqsa yosh va qaytalanuvchi tosh bemorlarida jiddiy masala.
          EAU bolalar va homiladorlarda birinchi navbatda ultratovushni tavsiya etadi; KT faqat
          ultratovush aniq natija bermaganda qo'llaniladi. Bolalarda "Image Gently" tashabbusi
          nurlanishni kamaytirishga qaratilgan.
        </p>
      </div>
    </div>
  </section>

  <!-- 7. DAVOLASH -->
  <section class="section" id="davolash">
    <h2><span class="num">7</span>Davolash tamoyillari (umumiy)</h2>
    <p>
      Davolash tosh o'lchami, joylashuvi, tarkibi va bemorning klinik holatiga bog'liq. Bu darsda
      faqat umumiy tamoyillar keltirilgan (batafsil jarrohlik usullari alohida mavzu).
    </p>

    <h3>7.1. O'tkir epizodni boshqarish</h3>
    <ul>
      <li><strong>Og'riqni yengish</strong> — NSAIDlar (masalan, diklofenak) birinchi tanlash; ba'zan opioidlar</li>
      <li><strong>Suyuqlik va kuzatuv</strong> — kichik toshlar (odatda &lt;5–6 mm) ko'pincha o'z-o'zidan chiqadi</li>
      <li><strong>Medikal ekspulsiv terapiya (MET)</strong> — α-blokerlar (tamsulozin) distal siydik yo'li toshining chiqishiga yordam berishi mumkin</li>
      <li><strong>Shoshilinch dekompressiya</strong> — infeksiya + to'siq bo'lsa (yuqoridagi ogohlantirishga qarang)</li>
    </ul>

    <h3>7.2. Uzoq muddatli profilaktika</h3>
    <ul>
      <li><strong>Ko'p suyuqlik ichish</strong> — kuniga kamida 2–2.5 L siydik hajmiga erishish</li>
      <li><strong>Tuz va hayvon oqsilini kamaytirish</strong></li>
      <li><strong>Kaliy sitrat</strong> — gipositraturiya va urat toshlarida (siydikni ishqorlash)</li>
      <li><strong>Tiazid diuretiklar</strong> — giperkaltsiuriyada</li>
      <li>Kalsiy oksalat toshlarida <strong>C vitamini qo'shimchasini to'xtatish</strong> (giperoksaluriyani kuchaytiradi)</li>
    </ul>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma — parhez kalsiyni cheklamang</strong>
        <p>
          Kalsiy toshli bemorlarda ovqatdagi kalsiyni <strong>keskin cheklash tavsiya etilmaydi</strong> —
          bu paradoksal ravishda ichakda oksalat so'rilishini oshirib, tosh xavfini kuchaytiradi.
          To'g'ri yondashuv — normal kalsiy iste'moli, ammo natriy (tuz) va oksalatga boy ovqatlarni
          kamaytirish.
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
        <li>Tosh kasalligi — mineral almashinuvi buzilishi; CKD, yurak kasalligi va suyak zichligi pasayishi bilan bog'liq.</li>
        <li>Tosh hosil bo'lish asosi — siydikning to'yinishi (supersaturation); ko'p idiopatik kalsiy oksalat toshlari Randall plyakalari ustida o'sadi.</li>
        <li>Kalsiy oksalat — eng keng tarqalgan tur (75–80%); struvit toshlari infeksiya bilan bog'liq va shox tosh hosil qilishi mumkin.</li>
        <li>Buyrak sanchig'i — kolikasimon og'riq bo'lib, bel-qovurg'a burchagidan qov/moyakka tarqaladi; og'riqsiz gematuriya toshga xos emas.</li>
        <li>Isitmali to'silgan tosh — shoshilinch holat: zudlik bilan dekompressiya kerak.</li>
        <li>Kattalar uchun kontrastsiz KT — oltin standart (94–95% sezuvchanlik); bolalar va homiladorlarda ultratovush afzal.</li>
        <li>Profilaktikada ko'p suyuqlik, tuz kamaytirish va (kerak bo'lsa) kaliy sitrat/tiazid; parhez kalsiyini keskin cheklamaslik.</li>
        <li>Yuqori qaytalanish (3–5 yilda 50%) — metabolik baholash va uzoq muddatli profilaktikani zarur qiladi.</li>
      </ul>
    </div>
    <p class="source-note">
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr (2026), Bob 40 (Urinary Lithiasis) va Bob 54
      (Pediatric Kidney Stone Disease) asosida tayyorlangan. Aniq klinik qarorlar uchun dolzarb
      AUA/EAU urolitiaz qo'llanmalariga murojaat qiling.
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
          <tr><td>Urolitiaz</td><td>Urolithiasis</td><td>Siydik yo'llarida tosh hosil bo'lish kasalligi</td></tr>
          <tr><td>Nefrolitiaz</td><td>Nephrolithiasis</td><td>Buyrakda tosh hosil bo'lishi</td></tr>
          <tr><td>Buyrak sanchig'i</td><td>Renal colic</td><td>Tosh to'sig'i tufayli o'tkir kolikasimon og'riq</td></tr>
          <tr><td>Supersaturatsiya</td><td>Supersaturation</td><td>Siydikda modda konsentratsiyasining eruvchanlik chegarasidan oshishi</td></tr>
          <tr><td>Randall plyakasi</td><td>Randall's Plaque</td><td>Buyrak so'rg'ichidagi gidroksiapatit to'planmasi — tosh o'sish poydevori</td></tr>
          <tr><td>Struvit</td><td>Struvite</td><td>Magniy-ammoniy-fosfat toshi — infeksiya bilan bog'liq</td></tr>
          <tr><td>Shox tosh</td><td>Staghorn calculus</td><td>Buyrak jomini to'ldiradigan katta shoxsimon tosh</td></tr>
          <tr><td>HU</td><td>Hounsfield Unit</td><td>KTda to'qima/tosh zichligini o'lchash birligi</td></tr>
          <tr><td>NCCT</td><td>Non-Contrast Computed Tomography</td><td>Kontrastsiz kompyuter tomografiyasi — tosh diagnostikasining oltin standarti</td></tr>
          <tr><td>DECT</td><td>Dual-Energy CT</td><td>Ikki energiyali KT — tosh tarkibini farqlash uchun</td></tr>
          <tr><td>KUB</td><td>Kidney-Ureter-Bladder (X-ray)</td><td>Buyrak-siydik yo'li-qovuq rentgeni</td></tr>
          <tr><td>MET</td><td>Medical Expulsive Therapy</td><td>Toshning chiqishiga yordam beruvchi dori davolash (α-blokerlar)</td></tr>
          <tr><td>NSAIDlar</td><td>Non-Steroidal Anti-Inflammatory Drugs</td><td>Steroid bo'lmagan yallig'lanishga qarshi dorilar — og'riqni yengish</td></tr>
          <tr><td>RTA</td><td>Renal Tubular Acidosis</td><td>Buyrak tubulalari atsidozi — kalsiy fosfat toshi bilan bog'liq</td></tr>
          <tr><td>CKD</td><td>Chronic Kidney Disease</td><td>Surunkali buyrak kasalligi</td></tr>
        </tbody>
      </table>
    </div>
  </section>

</article>
</main>
$tosh_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
