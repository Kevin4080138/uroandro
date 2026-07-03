-- Sistit — 9-dars nazariya tarkibi
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'sistit-asoslari',
  $sistit_html$
<main class="site-main">
<article class="lesson">

  <!-- HERO -->
  <div class="article-hero">
    <span class="article-hero__eyebrow">📘 9-mavzu · Yallig'lanish kasalliklari</span>
    <h1>Sistit — siydik pufagining yallig'lanishi: asosiy belgilar va davolash</h1>
    <p class="article-hero__lead">
      Sistit — siydik pufagi shilliq qavatining, ko'pincha bakterial infeksiya natijasida, yallig'lanishi.
      Bu — antibiotiklar buyurilishining eng keng tarqalgan sabablaridan biri. Ushbu darsda sistitning
      ta'rifi, patofiziologiyasi, klinik ko'rinishi, laborator diagnostikasi va davolash tamoyillari
      <em>Campbell-Walsh-Wein Urology</em> darsligi (bob 26) asosida yoritiladi.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~20 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr, Bob 26</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ul class="toc__list">
      <li><a href="#tarif">1. Ta'rif va tasnif</a></li>
      <li><a href="#epidemiologiya">2. Epidemiologiya</a></li>
      <li><a href="#patofiziologiya">3. Patofiziologiya</a></li>
      <li><a href="#klinik">4. Klinik belgilar</a></li>
      <li><a href="#diagnostika">5. Diagnostika</a></li>
      <li><a href="#davolash">6. Davolash</a></li>
      <li><a href="#qayta">7. Qayta uchraydigan sistit (rUTI)</a></li>
      <li><a href="#xulosa">8. Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">9. Qisqartmalar va atamalar lug'ati</a></li>
    </ul>
  </nav>

  <!-- 1. TA'RIF -->
  <section class="section" id="tarif">
    <h2><span class="num">1</span>Ta'rif va tasnif</h2>
    <p>
      <span class="term">Sistit (cystitis)</span> — siydik pufagi uroteliyining bakterial invaziyaga
      yallig'lanish javobi bo'lib, odatda bakteriuriya va piyuriya bilan kechadi. Klinik jihatdan
      dizuriya, siydik tezligi, siydik shoshilishi va ba'zan suprapubik og'riq majmuasi sifatida
      namoyon bo'ladi. Bu belgilar bakterial sistitni ko'rsatsa-da, ular uretra/vaginaning yallig'lanishi
      yoki interstitial sistit (IC/BPS) kabi infeksiyasiz holatlarda ham kuzatilishi mumkin.
    </p>

    <h3>1.1. Asosiy tasnif</h3>
    <div class="table-wrap">
      <table class="data-table">
        <caption>1-jadval. Sistit/UTI asosiy tasnifi</caption>
        <thead>
          <tr><th>Tur</th><th>Ta'rifi</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Asoratlanmagan sistit (uncomplicated cystitis)</strong></td><td>Tuzilishi va funksiyasi normal siydik yo'liga ega, homilador bo'lmagan, sog'lom ayollarda uchraydigan infeksiya</td></tr>
          <tr><td><strong>Asoratlangan sistit (complicated cystitis)</strong></td><td>Siydik yo'li tuzilish/funksiya anomaliyasi, kateterizatsiya, immunosupressiya, homiladorlik, qandli diabet yoki erkaklar bilan bog'liq infeksiya</td></tr>
          <tr><td><strong>Qayta uchraydigan UTI (recurrent UTI, rUTI)</strong></td><td>6 oy ichida 2 ta yoki 1 yil ichida 3 ta tasdiqlangan epizod</td></tr>
          <tr><td><strong>Rezort infeksiya (bacterial persistence)</strong></td><td>Xuddi shu bakteriya muolajadan keyin ham siydik yo'lida qolishi (masalan, tosh, prostata yoki kateter ichida)</td></tr>
          <tr><td><strong>Nosokomial UTI / CAUTI</strong></td><td>Kasalxonada yoki kateter bilan bog'liq infeksiya — eng ko'p uchraydigan nosokomial infeksiya</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 2. EPIDEMIOLOGIYA -->
  <section class="section" id="epidemiologiya">
    <h2><span class="num">2</span>Epidemiologiya</h2>
    <p>
      UTI — eng keng tarqalgan bakterial infeksiyalar qatoriga kiradi va antibiotiklar buyurilishining
      asosiy sabablaridan biridir. Ayollarda umr davomida kamida bir marta UTI o'tkazish ehtimoli
      juda yuqori — bu asosan uretraning erkaklarga nisbatan qisqaligiga bog'liq. Bakteriuriya
      chastotasi yosh bilan, shuningdek kasalxonaga yotish va kateter bilan ortadi.
    </p>
    <ul>
      <li>Qayta uchraydigan UTI xavfi oldingi infeksiyalar soni bilan to'g'ri mutanosib ravishda ortadi</li>
      <li>Jinsiy faol yosh ayollar — eng ko'p ta'sirlanadigan guruh</li>
      <li>Menopauza davrida va undan keyin UTI chastotasi ham ortadi</li>
      <li>CAUTI — nosokomial (kasalxona) infeksiyalarining 80 foizidan ko'pini tashkil etadi</li>
    </ul>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma</strong>
        <p>
          Erkaklarda har qanday UTI "asoratlangan" deb qabul qilinishi kerak, chunki u ko'pincha
          funksional yoki anatomik patologiya bilan bog'liq bo'ladi. Ko'pincha to'liq bo'shalmaslik
          (incomplete emptying) asosiy omil hisoblanadi.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. PATOFIZIOLOGIYA -->
  <section class="section" id="patofiziologiya">
    <h2><span class="num">3</span>Patofiziologiya</h2>
    <p>
      UTI ko'pincha ichakdan va teri yuzasidan keladigan bakteriyalarning uretra orqali ko'tarilishi
      (<span class="term">asending yo'l, ascending route</span>) natijasida rivojlanadi. Pielonefritning
      aksariyati ham siydik yo'lidan buyrakka ko'tarilib boruvchi bakteriyalar tomonidan keltirib chiqariladi.
    </p>

    <h3>3.1. Asosiy qo'zg'atuvchilar</h3>
    <p>
      <span class="term">Uropatogen Escherichia coli (UPEC)</span> — siydik yo'li infeksiyalarining
      80 foizini qamrab oluvchi asosiy qo'zg'atuvchi. UPEC bir qator virulentlik omillariga ega:
    </p>
    <ul>
      <li><strong>Fimbriyalar (fimbriae/pili)</strong> — bakteriyaning uroteliy hujayralariga yopishishini ta'minlovchi ipi-nay o'simtalar</li>
      <li><strong>Biofilm hosil qilish</strong> — antibiotik va immunitet ta'siridan himoyalovchi plyonka; qayta infeksiyalar sabablaridan biri</li>
      <li><strong>Siderofori (siderophore)</strong> — temir tortib olib, kam temirli muhitda ham o'sishni ta'minlash</li>
      <li><strong>Toksinlar</strong> — alfa-gemolisin, sitotoksik nekrozlashtiruvchi omil-1 (CNF1) — uroteliy hujayralarini shikastlaydi</li>
      <li><strong>Kapsulyar polisaxaridlar</strong> — fagositozdan himoya qiluvchi K-antigens</li>
    </ul>

    <div class="callout callout--guide">
      <div class="callout__icon">💡</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          Siydik haqiqatda steril emas. Sogʻlom kishilarda ham siydikda ozgina bakteriya mavjud
          bo'lishi mumkin. Klinik qaror qabul qilishda faqat bakteriya soniga emas, balki piyuriya va
          klinik belgilar majmuasiga asoslanish zarur.
        </p>
      </div>
    </div>
  </section>

  <!-- 4. KLINIK BELGILAR -->
  <section class="section" id="klinik">
    <h2><span class="num">4</span>Klinik belgilar</h2>
    <p>
      O'tkir asoratlanmagan sistitning klassik belgilari:
    </p>
    <ul>
      <li><strong>Dizuriya (dysuria)</strong> — siydik chiqarish vaqtida achishish yoki og'riq</li>
      <li><strong>Siydik tezligi (frequency)</strong> — kuniga odatdagidan ko'proq siydik chiqarish</li>
      <li><strong>Siydik shoshilishi (urgency)</strong> — to'satdan kuchli siydik chiqarish istagi</li>
      <li><strong>Suprapubik og'riq</strong> — qov usti sohasida og'riq yoki bosim</li>
      <li><strong>Gematuriya</strong> — ba'zi hollarda siydikda qon ko'rinishi</li>
    </ul>
    <p>
      Muhim: <strong>isitma, qaltirash va bel og'rig'i sistit belgisi emas</strong> — bu belgilar
      mavjud bo'lsa, pielonefrit yoki asoratlangan infeksiyani ko'rsatadi va boshqacha yondashuvni talab
      qiladi.
    </p>
    <p>
      Tadqiqotlar shuni ko'rsatadiki, dizuriya va siydik tezligi kombinatsiyasi vaginal ajralma yoki
      ta'sirlanish bo'lmaganda, 90 foizdan ortiq hollarda UTI mavjudligini oldindan aytish imkonini beradi.
    </p>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! Sistitni boshqa holatlardan farqlash</strong>
        <p>
          Sistit simptomlarini <strong>interstitial sistit/qovuq og'rig'i sindromi (IC/BPS)</strong>,
          <strong>vaginit</strong>, <strong>jinsiy a'zo sindromi (GSM)</strong> va
          <strong>qovuq saratoni</strong>dan farqlash zarur — bu holatlarning barchasida dizuriya va
          siydik tezligi kuzatilishi mumkin, ammo ularni davolash tamomila boshqacha.
        </p>
      </div>
    </div>
  </section>

  <!-- 5. DIAGNOSTIKA -->
  <section class="section" id="diagnostika">
    <h2><span class="num">5</span>Diagnostika</h2>
    <p>
      Sistit tashxisi klinik belgilar va laborator tekshiruvlar asosida qo'yiladi.
    </p>

    <h3>5.1. Siydik tahlili (urinalysis)</h3>
    <p>
      Tasma tahlilida leykotsit esteraza va nitrit musbatligini aniqlash — tezkor skrining usuli.
      Leykotsit esteraza va nitrit birgalikda musbat bo'lsa, UTI ehtimoli kamida 90 foizga etadi.
      Mikroskopiya siydikda leykotsitlar, eritrotsitlar va bakteriyalarni bevosita aniqlash imkonini beradi.
    </p>

    <h3>5.2. Siydik ekinmasi (urine culture)</h3>
    <p>
      <span class="term">Siydik ekinmasi (urine culture)</span> — UTI tasdiqlashning va antibiotik
      sezuvchanligini aniqlashning "oltin standarti". Ammo:
    </p>
    <ul>
      <li>Asoratlanmagan o'tkir sistitda ayollar uchun <strong>rutina ekinma shart emas</strong> — klinik belgilar etarli</li>
      <li>Ekinma <strong>majburiy</strong>: erkaklar, homilador ayollar, asoratlangan UTI, davolashga javob bermaydigan holat, qayta uchraydigan UTI va bosqichma-bosqich UTI kuzatuvida</li>
    </ul>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma</strong>
        <p>
          Doimiy kateter qo'yilgan yoki intermittent kateterizatsiya qiladiagan bemorlarda siydikda
          bakteriya borligi (kolonizatsiya) ko'pincha <strong>klinik infeksiya emas</strong>. Simptom
          bo'lmasa, bu bemorlarni davolash antibiotiklarning ortiqcha qo'llanilishiga olib keladi va
          rezistentlikni oshiradi.
        </p>
      </div>
    </div>
  </section>

  <!-- 6. DAVOLASH -->
  <section class="section" id="davolash">
    <h2><span class="num">6</span>Davolash</h2>
    <p>
      Antibiotiklarni tanlashda IDSA va EAU qo'llanmalariga asoslaniladi. Tanlash bemorning
      allergiya tarixiga, mahalliy rezistentlik darajasiga, dori mavjudligi va narxiga ko'ra
      individuallashtirilaidi.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>2-jadval. Asoratlanmagan o'tkir sistitda birinchi qator antibiotiklar (IDSA qo'llanmasi asosida)</caption>
        <thead>
          <tr><th>Dori</th><th>Dozalanishi</th><th>Izoh</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Nitrofurantoin</strong></td><td>100 mg, 2 marta/kun, 5 kun</td><td>Birinchi tanlash; minimal rezistentlik; erta pielonefrit gumonida qo'llamang</td></tr>
          <tr><td><strong>TMP-SMX (Trimetoprim-sulfametoksazol)</strong></td><td>160/800 mg, 2 marta/kun, 3 kun</td><td>Mahalliy rezistentlik 20% dan kam bo'lsa va so'nggi 3 oyda ishlatilmagan bo'lsa</td></tr>
          <tr><td><strong>Fosfomitsin trometamol</strong></td><td>3 g bir martalik doza</td><td>Bitta dozada; boshqa variantlarga nisbatan samaradorligi biroz past</td></tr>
          <tr><td><strong>Pivmecillinam</strong></td><td>400 mg, 2 marta/kun, 5 kun</td><td>Ba'zi mamlakatlarda mavjud; minimal kollateral zarar</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! Ftorokinolonlar — so'nggi chora</strong>
        <p>
          Ftorokinolonlar (siprofloksatsin, levofloksatsin) o'tkir asoratlanmagan sistit uchun
          <strong>oxirgi chora sifatida</strong> saqlanishi kerak. Ular yuqori kollateral zarar
          (rezistentlikni oshirish, "ekologik zararlar") va yon ta'sirlari tufayli FDA tomonidan
          ham ogohlantirilgan. Birinchi qator vositalar mavjud bo'lsa, ularni ishlatmang.
        </p>
      </div>
    </div>

    <h3>6.1. Davolash muddati va kuzatuv</h3>
    <p>
      Davolashdan keyin simsiz bo'lgan ayollarda <strong>kuzatuv viziti yoki ekinma shart emas</strong>.
      Ammo: davolashga javob bermagan holatlarda, qayta infeksiyada va erkak bemorlarda to'liq
      urologik baholash o'tkazilishi kerak.
    </p>
  </section>

  <!-- 7. QAYTA UCHRAYDIGAN SISTIT -->
  <section class="section" id="qayta">
    <h2><span class="num">7</span>Qayta uchraydigan sistit (rUTI)</h2>
    <p>
      6 oy ichida 2 ta yoki 1 yil ichida 3 ta tasdiqlangan UTI epizodi <span class="term">qayta
      uchraydigan UTI (recurrent UTI, rUTI)</span> deb tasniflanadi. Davolashda antibiotik
      profilaktikasi bilan birga <strong>antibiotikdan tashqari strategiyalar</strong>ga ustuvorlik
      beriladi.
    </p>

    <h3>7.1. Antibiotikdan tashqari profilaktik chora-tadbirlar</h3>
    <ul>
      <li><strong>Gidratsiya</strong> — ko'proq suyuqlik ichish siydikni suyultirib, bakteriyani chiqarib yuboradi</li>
      <li><strong>Xushk'oqayning siydik yo'liga kirishini kamaytirish</strong> — siydikdan keyin orqa tomondan emas, oldinga qarab artish</li>
      <li><strong>Spermitisidal moddalar va diafragmadan voz kechish</strong> — bular UTI xavfini oshiradi</li>
      <li><strong>Klukranberry (lingon va cranberry) mahsulotlari</strong> — UPEC yopishishini kamaytirishi mumkin bo'lsa-da, dalillar cheklangan</li>
      <li><strong>D-mannoz</strong> — UPEC fimbriyalarining uroteliyga yopishishini tormozlashi mumkin</li>
      <li><strong>Menopauza davrida vaginal estrogen</strong> — shilliq qavat himoyasini tiklab, UTI xavfini kamaytirishi mumkin</li>
    </ul>

    <div class="callout callout--guide">
      <div class="callout__icon">📋</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          Asoratlanmagan qayta uchraydigan UTI uchun sistoskopiya va tasvirlash tekshiruvlari
          <strong>rutina tavsiya etilmaydi</strong>. Bu tekshiruvlar faqat xavf omillari mavjud
          bo'lsa (gematuriya, tosh shubhasi, obstruksiya belgilari) ko'rsatiladi.
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
        <li>Sistit — uroteliyning yallig'lanishi bo'lib, dizuriya, siydik tezligi va shoshilishi klassik triada hisoblanadi; isitma sistit belgisi emas — bu pielonefritga ishora.</li>
        <li>UPEC — siydik yo'li infeksiyalarining asosiy qo'zg'atuvchisi (80 foiz); yopishish, biofilm va toksinlar uning asosiy virulentlik omillari.</li>
        <li>Erkaklarda har qanday UTI asoratlangan deb qabul qilinadi.</li>
        <li>Asoratlanmagan sistitli ayollarda klinik belgilar asosida davolash mumkin — rutina ekinma shart emas.</li>
        <li>Nitrofurantoin va TMP-SMX — birinchi qator vositalar; ftorokinolonlar so'nggi chora sifatida saqlanishi kerak.</li>
        <li>rUTI profilaktikasida antibiotikdan tashqari strategiyalar (gidratsiya, D-mannoz, vaginal estrogen) ustuvor o'rinda turadi.</li>
        <li>Doimiy kateter bilan yuruvchi bemorlarda asimptomatik bakteriuriya davolashni talab qilmaydi.</li>
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
          <tr><td>Sistit</td><td>Cystitis</td><td>Siydik pufagi shilliq qavatining yallig'lanishi</td></tr>
          <tr><td>UTI</td><td>Urinary Tract Infection</td><td>Siydik yo'li infeksiyasi</td></tr>
          <tr><td>rUTI</td><td>Recurrent Urinary Tract Infection</td><td>Qayta uchraydigan UTI (6 oyda ≥2 ta yoki yilda ≥3 ta epizod)</td></tr>
          <tr><td>UPEC</td><td>Uropathogenic Escherichia coli</td><td>Siydik yo'li infeksiyasining asosiy qo'zg'atuvchisi</td></tr>
          <tr><td>CAUTI</td><td>Catheter-Associated Urinary Tract Infection</td><td>Kateter bilan bog'liq siydik yo'li infeksiyasi</td></tr>
          <tr><td>IC/BPS</td><td>Interstitial Cystitis / Bladder Pain Syndrome</td><td>Interstitial sistit / qovuq og'rig'i sindromi — infeksiyasiz surunkali qovuq og'rig'i</td></tr>
          <tr><td>GSM</td><td>Genitourinary Syndrome of Menopause</td><td>Menopauza jinsiy-siydik sindromi</td></tr>
          <tr><td>TMP-SMX</td><td>Trimethoprim-Sulfamethoxazole</td><td>Ko-trimoksazol — birinchi qator antibiotik</td></tr>
          <tr><td>IDSA</td><td>Infectious Diseases Society of America</td><td>Amerika Yuqumli Kasalliklar Jamiyati — qo'llanmalar mualliflari</td></tr>
          <tr><td>EAU</td><td>European Association of Urology</td><td>Yevropa Urologiya Assotsiatsiyasi</td></tr>
          <tr><td>MDR</td><td>Multidrug-Resistant</td><td>Ko'p dori rezistentligi — bir necha antibiotikka chidamli bakteriyalar</td></tr>
          <tr><td>CFU</td><td>Colony-Forming Unit</td><td>Koloniya hosil qiluvchi birlik — bakteriya sonini o'lchash birligi</td></tr>
          <tr><td>ASB</td><td>Asymptomatic Bacteriuria</td><td>Asimptomatik bakteriuriya — simptom bo'lmagan holda siydikda bakteriya borligi</td></tr>
        </tbody>
      </table>
    </div>
  </section>

</article>
</main>
$sistit_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
