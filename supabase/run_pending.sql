-- ============================================================
-- SUPABASE SQL RUNNER — barcha kutilayotgan migrationlar
-- Joylashtirish: SQL Editor > New query > Ctrl+A > Run
-- ============================================================

-- 1) Umumiy siydik tahlili — nazariya HTML
-- Umumiy siydik tahlili va asosiy laborator ko'rsatkichlar — 3-dars nazariya tarkibi
-- HTML manbasi: umumiy_siydik_tahlili_dars.html (converted to Urosfera class conventions)
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  '3-dars - umumiy siydik taxlili va assiy labarator ko''rsatkichlar',
  $siydik_tahlili_html$<main class="site-main">
<article class="lesson">

  <!-- HERO -->
  <div class="article-hero">
    <span class="article-hero__eyebrow">📘 3-mavzu · Diagnostika asoslari</span>
    <h1>Umumiy siydik tahlili va asosiy laborator ko'rsatkichlar</h1>
    <p class="article-hero__lead">
      Umumiy siydik tahlili (urinalysis) — urologik amaliyotda eng tez-tez qo'llaniladigan, arzon va tezkor
      diagnostik usul bo'lib, ko'p hollarda tashxisga yo'l ochadi. Bu darsda siydik tahlilining uchta asosiy
      komponenti — tashqi ko'rinish, tasma (dipstick) tahlili va mikroskopiya — hamda buyrak funksiyasini
      baholashda qo'llaniladigan asosiy qon ko'rsatkichlari <em>Campbell-Walsh-Wein Urology</em> darsligi
      asosida tushuntiriladi.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~22 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ul class="toc__list">
      <li><a href="#kirish">1. Kirish va namuna olish</a></li>
      <li><a href="#tashqi">2. Tashqi ko'rinishni baholash</a></li>
      <li><a href="#tasma">3. Tasma (dipstick) tahlili</a></li>
      <li><a href="#mikroskopiya">4. Siydik mikroskopiyasi (sediment)</a></li>
      <li><a href="#qontahlil">5. Buyrak funksiyasi: qon ko'rsatkichlari</a></li>
      <li><a href="#ekinma">6. Siydik ekinmasi (urine culture)</a></li>
      <li><a href="#xulosa">7. Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">8. Qisqartmalar va atamalar lug'ati</a></li>
    </ul>
  </nav>

  <!-- 1. KIRISH -->
  <section class="section" id="kirish">
    <h2><span class="num">1</span>Kirish va namuna olish</h2>
    <p>
      <span class="term">Umumiy siydik tahlili (urinalysis, UA)</span> uch qismdan iborat: siydikning
      <strong>tashqi ko'rinishini baholash</strong>, <strong>kimyoviy tasma (dipstick) tahlili</strong> va
      <strong>mikroskopik tekshiruv (siydik sedimenti)</strong>. Bu uchtasi birgalikda qo'llanilganda eng
      yuqori diagnostik qiymatga ega bo'ladi — faqat tasma tahlili mikroskopiya o'rnini bosa olmaydi.
    </p>

    <h3>1.1. To'g'ri namuna olish qoidalari</h3>
    <p>
      Eng ishonchli natija <span class="term">o'rta oqim, toza tutilgan namuna (clean-catch midstream urine)</span>
      orqali olinadi. Erkaklarda xatna qilinmagan bo'lsa, oldindan terlik (prepuce) orqaga tortilib, boshcha
      tozalanishi kerak. Ayollarda kontaminatsiya (begona aralashma) ehtimoli yuqoriroq, chunki siydik
      yo'lining tashqi qismi (introitus) atrofidagi leykotsit va bakteriyalar namunaga aralashishi mumkin.
    </p>
    <p>
      Agar klinik shubha kuchli bo'lib natija aniq bo'lmasa, <span class="term">kateter orqali olingan
      namuna (catheterized specimen)</span> tavsiya etiladi. Namuna olingandan keyin 1 soat ichida (xona
      haroratida) yoki 4 soat ichida (sovutilgan holatda) tekshirilishi kerak — aks holda natijalar
      noto'g'ri chiqishi mumkin.
    </p>

    <div class="callout callout--guide">
      <div class="callout__icon">💡</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma</strong>
        <p>
          Siydik ekinmasi (urine culture) "oltin standart" hisoblansa-da, natija olish uchun kamida 18 soat,
          to'liq antibiotikka sezuvchanlikni aniqlash uchun 2–3 kun kerak bo'ladi. Shu sababli umumiy siydik
          tahlili tezkor klinik qaror qabul qilish uchun muhim ahamiyatga ega.
        </p>
      </div>
    </div>
  </section>

  <!-- 2. TASHQI KO'RINISH -->
  <section class="section" id="tashqi">
    <h2><span class="num">2</span>Tashqi ko'rinishni baholash</h2>
    <p>
      Siydikning rangi, tiniqligi va hidi dastlabki, ammo muhim klinik ma'lumot beradi.
    </p>
    <ul>
      <li><strong>Rangi:</strong> normal siydik och sariqdan to to'q sariq ranggacha bo'lishi mumkin (suyuqlik holatiga bog'liq). Qizil yoki "choy rangi" siydik gematuriya yoki boshqa pigmentlar (masalan, ayrim dorilar, lavlagi) sababli bo'lishi mumkin.</li>
      <li><strong>Tiniqligi:</strong> loylanish (xiralashish) piyuriya (leykotsitlar) yoki ishqorli/konsentrlangan siydikda cho'kma hosil bo'lgan fosfat kristallar sababli bo'lishi mumkin.</li>
      <li><strong>Hidi:</strong> yoqimsiz hid o'z-o'zidan infeksiya belgisi hisoblanmaydi — bu ko'rsatkich sezuvchanligi va aniqligi past.</li>
    </ul>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat!</strong>
        <p>
          "Pseudogematuriya (pseudo-hematuria)" — siydikning dehidratatsiya, ayrim oziq-ovqat (lavlagi) yoki
          dorilar (fenazopiridin) tufayli qizarib ko'rinishi. Haqiqiy gematuriyani aniqlash uchun albatta
          mikroskopik tekshiruvda eritrotsitlar borligini tasdiqlash kerak — faqat rangga qarab xulosa
          chiqarish noto'g'ri.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. TASMA TAHLILI -->
  <section class="section" id="tasma">
    <h2><span class="num">3</span>Tasma (dipstick) tahlili</h2>
    <p>
      Kimyoviy reagent bilan qoplangan tasma siydikka botirilib, bir necha soniya-daqiqa ichida rang
      o'zgarishi orqali turli ko'rsatkichlarni aniqlash mumkin. Quyida eng muhim parametrlar keltirilgan.
    </p>

    <h3>3.1. Solishtirma og'irlik (specific gravity) va pH</h3>
    <p>
      <span class="term">Solishtirma og'irlik (specific gravity)</span> — siydikning suvga nisbatan
      zichligi, organizmning suyultirish/konsentratsiyalash qobiliyatini ko'rsatadi. Yuqori qiymat
      dehidratatsiya yoki glyukozuriya (qandli diabet)da, past qiymat esa ko'p suv ichish yoki buyrak
      konsentratsiyalash funksiyasi buzilishida kuzatiladi.
    </p>
    <p>
      <span class="term">Siydik pH</span> normal holatda 4.5–8.0 oralig'ida (o'rtacha 5.5–6.5) bo'ladi.
      pH qiymati siydik toshlari turini bashorat qilishda va infeksiya turini taxmin qilishda foydali:
      ishqorli siydik (pH&gt;7.5) ko'pincha ureaza ishlab chiqaruvchi bakteriyalar (masalan, <em>Proteus</em>)
      bilan bog'liq infeksiyani ko'rsatadi.
    </p>

    <h3>3.2. Leykotsit esteraza va nitrit</h3>
    <p>
      Bu ikki ko'rsatkich birgalikda siydik yo'li infeksiyasini (UTI) skrining qilish uchun ishlatiladi.
      <span class="term">Leykotsit esteraza (leukocyte esterase)</span> — parchalangan leykotsitlardan
      chiqadigan ferment, piyuriya (siydikda leykotsit ko'pligi) belgisi. <span class="term">Nitrit</span> —
      ko'pgina gramm-manfiy bakteriyalar (Enterobacteriaceae oilasi) tarkibidagi ferment orqali
      nitratlarning nitritga aylanishi natijasida hosil bo'ladi.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>1-jadval. Leykotsit esteraza va nitrit tasma tahlilining diagnostik xususiyatlari</caption>
        <thead>
          <tr><th>Ko'rsatkich</th><th>Sezuvchanlik (sensitivity)</th><th>Aniqlik (specificity)</th><th>Izoh</th></tr>
        </thead>
        <tbody>
          <tr><td>Leykotsit esteraza</td><td>~79%</td><td>~87%</td><td>Yolg'on manfiy: yuqori solishtirma og'irlik, glyukozuriya, askorbin kislota</td></tr>
          <tr><td>Nitrit</td><td>~49%</td><td>~98%</td><td>Yuqori aniqlik, lekin past sezuvchanlik; gram-musbat bakteriyalarda ko'pincha manfiy</td></tr>
          <tr><td>Ikkisi birgalikda (har qaysisi musbat)</td><td>~88%</td><td>~79%</td><td>Birgalikda qo'llanilganda UTI ehtimolini yaxshi bashorat qiladi</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma</strong>
        <p>
          Agar tasma faqat leykotsit esterazaga musbat, nitritga manfiy bo'lsa — bu nafaqat infeksiyani,
          balki boshqa yallig'lanish sabablarini ham ko'rsatishi mumkin. Bunday holatda antibiotik
          boshlashdan oldin mikroskopik tekshiruv va, zarur bo'lsa, siydik ekinmasi o'tkazilishi tavsiya
          etiladi.
        </p>
      </div>
    </div>

    <h3>3.3. Glyukoza, oqsil, bilirubin va keton</h3>
    <ul>
      <li><strong>Glyukozuriya (glucosuria)</strong> — qandli diabet yoki buyrak tubulalari patologiyasida kuzatiladi</li>
      <li><strong>Proteinuriya (proteinuria)</strong> — sog'lom kattalar kuniga 80–150 mg oqsil chiqaradi; bundan ko'p miqdor buyrak (glomerulyar) kasalligi belgisi bo'lishi mumkin</li>
      <li><strong>Bilirubin</strong> — jigarda yoki o't yo'llarida patologiya mavjudligini ko'rsatadi</li>
      <li><strong>Keton tanachalari</strong> — ochlik, qandli diabet dekompensatsiyasi yoki past uglevodli parhezda ko'tariladi</li>
    </ul>
  </section>

  <!-- 4. MIKROSKOPIYA -->
  <section class="section" id="mikroskopiya">
    <h2><span class="num">4</span>Siydik mikroskopiyasi (sediment tahlili)</h2>
    <p>
      Siydik mikroskopiyasi — siydik namunasi sentrifugadan o'tkazilib, cho'kma (sediment)ni maxsus
      mikroskop ostida ko'rib chiqish usuli. Bu usul piyuriya, gematuriya, kristallar va bakteriyalarni
      bevosita ko'rish imkonini beradi va ko'pincha tasma tahlilidan ko'ra ishonchliroq hisoblanadi.
    </p>

    <h3>4.1. Asosiy aniqlanadigan elementlar</h3>
    <div class="table-wrap">
      <table class="data-table">
        <caption>2-jadval. Siydik sedimentida aniqlanadigan asosiy elementlar</caption>
        <thead>
          <tr><th>Element</th><th>Normal chegarasi</th><th>Klinik ahamiyati</th></tr>
        </thead>
        <tbody>
          <tr><td>Eritrotsitlar (RBC)</td><td>&lt;3 ta / yuqori quvvatli maydon (HPF)</td><td>Undan ko'pi gematuriya — buyrak, siydik yo'li yoki qovuq patologiyasi belgisi</td></tr>
          <tr><td>Leykotsitlar (WBC)</td><td>&lt;5 ta / HPF</td><td>Undan ko'pi piyuriya — infeksiya yoki yallig'lanish belgisi</td></tr>
          <tr><td>Bakteriyalar</td><td>Yo'q yoki kam</td><td>Ko'p miqdor — infeksiya yoki namuna kontaminatsiyasi</td></tr>
          <tr><td>Kristallar</td><td>Holatga bog'liq</td><td>Kalsiy oksalat, uric acid, struvit (uchqirsimon fosfat) — tosh hosil bo'lish xavfi haqida ma'lumot beradi</td></tr>
          <tr><td>Silindrlar (cast)</td><td>Yo'q</td><td>Eritrotsit silindrlari — glomerulyar kasallik belgisi; bu holat urolog emas, nefrolog konsultatsiyasini talab qiladi</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--guide">
      <div class="callout__icon">🔬</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          Asimptomatik mikroskopik gematuriya (AMH) — toza yig'ilgan namunada, oson aniqlanadigan
          benign sabab bo'lmagan holatda yuqori quvvatli maydonda 3 va undan ortiq eritrotsit borligi
          sifatida ta'riflanadi. Bu ko'rsatkich keyingi to'liq urologik tekshiruv zarurligini belgilashda
          asosiy mezon hisoblanadi.
        </p>
      </div>
    </div>
  </section>

  <!-- 5. QON KO'RSATKICHLARI -->
  <section class="section" id="qontahlil">
    <h2><span class="num">5</span>Buyrak funksiyasini baholashda qon ko'rsatkichlari</h2>
    <p>
      Siydik tahlilidan tashqari, urologik bemorlarda buyrak funksiyasini va umumiy metabolik holatni
      baholash uchun bir qancha qon ko'rsatkichlari muhim ahamiyat kasb etadi.
    </p>

    <h3>5.1. Kreatinin va glomerulyar filtratsiya tezligi (GFR)</h3>
    <p>
      <span class="term">Zardob kreatinini (serum creatinine)</span> — mushak metabolizmi natijasida hosil
      bo'ladigan modda, buyraklar orqali filtrlanadi va chiqariladi. Bu ko'rsatkich
      <span class="term">glomerulyar filtratsiya tezligi (glomerular filtration rate, GFR)</span>ning eng
      keng qo'llaniladigan, ammo mukammal bo'lmagan ko'rsatkichidir — chunki uning darajasi yosh, jins,
      bo'y va, ayniqsa, mushak massasiga bog'liq.
    </p>
    <p>
      GFR — buyraklarning bir daqiqada qonni qancha hajmda filtrlay olishini ko'rsatadi va surunkali buyrak
      kasalligi (CKD) bosqichlarini aniqlashda asosiy mezon hisoblanadi.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>3-jadval. Asosiy qon ko'rsatkichlari va ularning urologik ahamiyati</caption>
        <thead>
          <tr><th>Ko'rsatkich</th><th>Nima uchun o'lchanadi</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Zardob kreatinini</strong></td><td>Buyrak funksiyasini (GFR) bilvosita baholash uchun asosiy ko'rsatkich</td></tr>
          <tr><td><strong>Qon urea azoti (BUN)</strong></td><td>Buyrak funksiyasi va suyuqlik holatini baholashda kreatinin bilan birga qo'llaniladi</td></tr>
          <tr><td><strong>Elektrolitlar (Na, K)</strong></td><td>Siydik yo'li to'siqlanishidan keyingi diurez yoki buyrak yetishmovchiligida muvozanat buzilishini aniqlash</td></tr>
          <tr><td><strong>Umumiy qon tahlili (CBC)</strong></td><td>Operatsiyadan oldin, infeksiya yoki saraton kuzatuvida; gemoglobin, leykotsit va trombotsit darajasini baholash</td></tr>
          <tr><td><strong>PSA (prostata-spetsifik antigen)</strong></td><td>Prostata bezi holatini baholashda qo'llaniladigan, lekin faqat prostataga xos bo'lmagan (saraton bo'lmagan holatlarda ham ko'tarilishi mumkin) ko'rsatkich</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat!</strong>
        <p>
          Zardob kreatinini past mushak massasiga ega bemorlarda (masalan, surunkali kasalliklarda yoki
          bolalarda) GFR pasayishini to'liq aks ettira olmasligi mumkin. Bunday holatlarda muqobil
          ko'rsatkich — <span class="en-term">cystatin C</span> — ko'proq aniqlik berishi mumkin.
        </p>
      </div>
    </div>
  </section>

  <!-- 6. EKINMA -->
  <section class="section" id="ekinma">
    <h2><span class="num">6</span>Siydik ekinmasi (urine culture)</h2>
    <p>
      <span class="term">Siydik ekinmasi (urine culture)</span> — siydik yo'li infeksiyasi (UTI)ni
      tasdiqlashning "oltin standarti" bo'lib, qo'zg'atuvchi bakteriya turini va unga ta'sir qiluvchi
      antibiotiklarni (sezuvchanlik) aniqlash imkonini beradi. Lekin natija olish vaqti (18 soatdan 2–3
      kungacha) tufayli klinik qarorlar ko'pincha tezkor siydik tahlili asosida qabul qilinadi, so'ngra
      ekinma natijasi bilan tasdiqlanadi.
    </p>
    <p>
      Bakteriya soni kamida 100,000 koloniya hosil qiluvchi birlik/ml (CFU/mL) bo'lganda natija
      "musbat" hisoblanadi va bu klinik simptomlar bilan birgalikda baholanadi.
    </p>

    <div class="callout callout--guide">
      <div class="callout__icon">📋</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          Barcha bemorlarda siydik ekinmasini rutina tarzda buyurish tavsiya etilmaydi. Bu, ayniqsa, doimiy
          kateter qo'ygan yoki intermittent kateterizatsiya qiluvchi bemorlarda ortiqcha aniqlash va
          keraksiz antibiotik davolanishiga olib kelishi mumkin — bunday bemorlarning siydigida bakteriya
          bo'lishi (kolonizatsiya) ko'pincha klinik infeksiya emas.
        </p>
      </div>
    </div>
  </section>

  <!-- 7. XULOSA -->
  <section class="section" id="xulosa">
    <h2><span class="num">7</span>Xulosa va asosiy fikrlar</h2>
    <div class="keypoints">
      <p class="keypoints__title">⭐ Asosiy xulosalar</p>
      <ul>
        <li>To'liq siydik tahlili uch qismdan iborat: tashqi ko'rinish, tasma (dipstick) tahlili va mikroskopiya — faqat birini emas, barchasini birgalikda baholash kerak.</li>
        <li>Leykotsit esteraza va nitrit birgalikda yuqori diagnostik qiymatga ega, ammo har biri alohida cheklovlarga ega (yolg'on musbat/manfiy natijalar).</li>
        <li>Siydik mikroskopiyasida 3 tadan ortiq eritrotsit/HPF — gematuriya, 5 tadan ortiq leykotsit/HPF — piyuriya mezoni hisoblanadi.</li>
        <li>Zardob kreatinini va GFR — buyrak funksiyasini baholashning asosiy ko'rsatkichlari, lekin mushak massasiga bog'liqligini unutmaslik kerak.</li>
        <li>Siydik ekinmasi infeksiyani tasdiqlovchi "oltin standart" bo'lsa-da, barcha bemorlarda emas, faqat klinik ko'rsatkich bo'lganda buyuriladi.</li>
        <li>Faqat siydik rangiga qarab xulosa chiqarish noto'g'ri — gematuriyani har doim mikroskopik tasdiqlash zarur.</li>
      </ul>
    </div>
    <p class="source-note">
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr (2026) asosida tayyorlangan va faqat ta'lim
      maqsadlarida foydalanish uchun mo'ljallangan. Aniq klinik qarorlar uchun har doim dolzarb klinik
      qo'llanmalar (AUA, EAU Guidelines) va malakali shifokor maslahatiga murojaat qiling.
    </p>
  </section>

  <!-- 8. LUG'AT -->
  <section class="section" id="lugat">
    <h2><span class="num">8</span>Qisqartmalar va atamalar lug'ati</h2>
    <p>Mavzuda ishlatilgan barcha qisqartma va murakkab atamalarning to'liq izohi quyidagi jadvalda keltirilgan:</p>

    <div class="table-wrap">
      <table class="data-table glossary-table">
        <thead>
          <tr><th>Qisqartma / Atama</th><th>Inglizcha to'liq nomi</th><th>O'zbekcha izohi</th></tr>
        </thead>
        <tbody>
          <tr><td>UA</td><td>Urinalysis</td><td>Umumiy siydik tahlili</td></tr>
          <tr><td>HPF</td><td>High-Power Field</td><td>Mikroskopning yuqori quvvatli ko'rish maydoni</td></tr>
          <tr><td>RBC</td><td>Red Blood Cell</td><td>Eritrotsit (qizil qon hujayrasi)</td></tr>
          <tr><td>WBC</td><td>White Blood Cell</td><td>Leykotsit (oq qon hujayrasi)</td></tr>
          <tr><td>UTI</td><td>Urinary Tract Infection</td><td>Siydik yo'li infeksiyasi</td></tr>
          <tr><td>CFU</td><td>Colony-Forming Unit</td><td>Koloniya hosil qiluvchi birlik — bakteriya sonini o'lchash birligi</td></tr>
          <tr><td>GFR</td><td>Glomerular Filtration Rate</td><td>Glomerulyar filtratsiya tezligi — buyrak funksiyasining asosiy ko'rsatkichi</td></tr>
          <tr><td>BUN</td><td>Blood Urea Nitrogen</td><td>Qon urea azoti — buyrak funksiyasi ko'rsatkichi</td></tr>
          <tr><td>CKD</td><td>Chronic Kidney Disease</td><td>Surunkali buyrak kasalligi</td></tr>
          <tr><td>AKI</td><td>Acute Kidney Injury</td><td>O'tkir buyrak shikastlanishi</td></tr>
          <tr><td>CBC</td><td>Complete Blood Count</td><td>Umumiy qon tahlili</td></tr>
          <tr><td>PSA</td><td>Prostate-Specific Antigen</td><td>Prostata-spetsifik antigen — prostata holatini baholashda qo'llaniladigan oqsil</td></tr>
          <tr><td>AMH</td><td>Asymptomatic Microhematuria</td><td>Asimptomatik mikroskopik gematuriya</td></tr>
          <tr><td>RTA</td><td>Renal Tubular Acidosis</td><td>Buyrak tubulalari atsidozi — siydik pH buzilishi bilan kechadigan holat</td></tr>
        </tbody>
      </table>
    </div>
  </section>

</article>
</main>
$siydik_tahlili_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;


-- 2) Erkak jinsiy a'zolari — nazariya HTML
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


-- 3) Erkak jinsiy a'zolari — 40 ta amaliy test
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


-- 4) Siydik-tanosil tug'ma anomaliyalari — nazariya HTML
-- Siydik-tanosil tugma anomaliyalari — 8-dars nazariya tarkibi
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'siydik-tanosil-tugma-anomaliyalar',
  $tugma_html$
<main class="site-main">
<article class="lesson">

  <!-- HERO -->
  <div class="article-hero">
    <span class="article-hero__eyebrow">📘 8-mavzu · Tug'ma kasalliklar</span>
    <h1>Siydik-tanosil a'zolarining tug'ma anomaliyalari haqida umumiy tushuncha</h1>
    <p class="article-hero__lead">
      Tug'ma siydik-tanosil anomaliyalari (congenital anomalies of the kidney and urinary tract, CAKUT) —
      urologik amaliyotda keng uchraydigan va ko'pincha prenatal (tug'ruqdan oldin) ultratovushda birinchi
      marta aniqlanadigan holatilar guruhi. Ushbu darsda embriologik asoslar, asosiy anomaliya turlari va
      ularning klinik ahamiyati <em>Campbell-Walsh-Wein Urology</em> darsligi (bob 32, 42, 43, 45, 49, 50, 52)
      asosida yoritiladi.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~25 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr, I jild, Part V</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ul class="toc__list">
      <li><a href="#kirish">1. Kirish va tasnif</a></li>
      <li><a href="#embriologiya">2. Embriologik asoslar (qisqacha)</a></li>
      <li><a href="#buyrak">3. Buyrak anomaliyalari</a></li>
      <li><a href="#sistik">4. Sistik va displastik buyrak kasalliklari</a></li>
      <li><a href="#siydikyo">5. Siydik yo'li anomaliyalari</a></li>
      <li><a href="#qovuq">6. Qovuq anomaliyalari</a></li>
      <li><a href="#uretra">7. Uretra anomaliyalari (PUV, gipospadiya)</a></li>
      <li><a href="#vur">8. Vezikouretal reflyuks (VUR)</a></li>
      <li><a href="#diagnostika">9. Diagnostika yondashuvi</a></li>
      <li><a href="#xulosa">10. Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">11. Qisqartmalar va atamalar lug'ati</a></li>
    </ul>
  </nav>

  <!-- 1. KIRISH -->
  <section class="section" id="kirish">
    <h2><span class="num">1</span>Kirish va tasnif</h2>
    <p>
      <span class="term">CAKUT (congenital anomalies of the kidney and urinary tract)</span> —
      buyrak, siydik yo'llari, qovuq va uretraning tug'ma tuzilish yoki funksiya buzilishlari majmuasi.
      Bu anomaliyalar bolalardagi surunkali buyrak kasalligi (CKD) sabablarining yarmidan ko'pini tashkil etadi
      va dunyoda eng ko'p uchraydigan tug'ma nuqsonlar guruhlaridan biri hisoblanadi.
    </p>
    <p>
      Anomaliyalar quyidagi keng toifalarga bo'linadi:
    </p>
    <ul>
      <li><strong>Soni anomaliyalari</strong> — ageneziya (buyrak yo'qligi), qo'shimcha buyrak</li>
      <li><strong>Joylashuv va rotatsiya anomaliyalari</strong> — ektopik buyrak, ot-nalcha buyrak</li>
      <li><strong>Tuzilish anomaliyalari</strong> — displaziya, kistik kasalliklar, duplikatsiya</li>
      <li><strong>To'siq (obstruktiv) anomaliyalar</strong> — UPJ to'siqlanishi, megaureter, PUV</li>
      <li><strong>Reflyuks anomaliyalari</strong> — vezikouretal reflyuks (VUR)</li>
      <li><strong>Qovuq va uretra anomaliyalari</strong> — ekssrofiya, urachal anomaliyalar, gipospadiya</li>
    </ul>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma</strong>
        <p>
          Barcha CAKUT holatlari bir xil klinik og'irlikka ega emas. Ko'pchiligi (masalan, past darajali
          VUR yoki kichik ot-nalcha buyrak) hech qachon simptom bermay, tasodifan aniqlanadi.
          Boshqalari (masalan, ikki tomonlama buyrak ageneziyasi yoki PUV) hayot uchun xavfli bo'lishi mumkin.
        </p>
      </div>
    </div>
  </section>

  <!-- 2. EMBRIOLOGIYA -->
  <section class="section" id="embriologiya">
    <h2><span class="num">2</span>Embriologik asoslar (qisqacha)</h2>
    <p>
      Siydik tizimi embrion hayotida uch bosqichli rivojlanish orqali shakllanadi:
      <span class="term">pronefros → mezonefros → metanefros</span>. Doimiy buyrak bo'ladigan metanefros
      5-haftadan boshlab shakllanadi — ikki tuzilmaning birgalikdagi ta'siri natijasida:
    </p>
    <ul>
      <li>
        <strong>Ureter kurtagi (ureteric bud)</strong> — mezonefrik kanaldan o'sib chiqib, buyrak yig'uvchi
        sistemasiga, siydik yo'liga va qovuqning bir qismiga aylanadi
      </li>
      <li>
        <strong>Metanefrik mezoderm (metanephric mesenchyme)</strong> — ureter kurtagi bilan induktiv
        aloqa orqali nefronlar va buyrak stromasiga aylanadi
      </li>
    </ul>
    <p>
      Bu ikki tuzilma o'rtasidagi aloqa buzilishi CAKUT anomaliyalarining asosiy sababidir. Masalan,
      ureter kurtagi juda baland chiqsa — buyrak displaziyasi, juda past chiqsa — VUR ehtimoli ortadi.
    </p>
    <p>
      Qovuq va uretra esa 4–6-haftada kloakaning urorektal septum tomonidan bo'linishi natijasida
      <span class="term">urogenital sinus (urogenital sinus)</span>dan shakllanadi.
    </p>

    <div class="callout callout--guide">
      <div class="callout__icon">💡</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          CAKUT bilan bog'liq ko'plab genetik sindromar aniqlangan. Masalan, PAX2 geni mutatsiyasi —
          buyrak hipodisplaziyasi va VUR bilan, PKD1/PKD2 geni — politistik buyrak kasalligi (ADPKD) bilan
          bog'liq. Klinik amaliyotda oilaviy anamnez CAKUT xavfini baholashda muhim ahamiyat kasb etadi.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. BUYRAK ANOMALIYALARI -->
  <section class="section" id="buyrak">
    <h2><span class="num">3</span>Buyrak soni va joylashuv anomaliyalari</h2>

    <h3>3.1. Buyrak ageneziyasi (renal agenesis)</h3>
    <p>
      Buyrak to'qimasining mutlaq yo'qligi. Ikki tomonlama ageneziya (Potter sindromi) — amniotik
      suyuqlik ishlab chiqarilmasligiga olib kelib, o'pka gipoplaziyasini keltirib chiqaradi va
      deyarli 100% hollarda o'lim bilan tugaydi. Bir tomonlama ageneziya (1:1200) esa ko'pincha
      asimptomatik bo'lib, qarama-qarshi buyrak kompensator gipertrofiyaga uchraydi; biroq uzoq
      muddatda buyrak filtratsiyasi kamayishi (CKD belgilari) 30% hollarda kuzatilishi mumkin.
    </p>

    <h3>3.2. Ektopik buyrak (renal ectopia)</h3>
    <p>
      Embrion davrida buyrak to'g'ri ko'tarilmasa, ektopik joylashuvda qoladi (ko'pincha chanoqda).
      Ektopik buyrak ko'pincha normal aylanmagan (malrotated) bo'ladi va gidronefroz yoki toshlarga
      moyil hisoblanadi.
    </p>

    <h3>3.3. Ot-nalcha buyrak (horseshoe kidney)</h3>
    <p>
      Buyraklarning quyi qutblari o'rta chiziqda birlashishi — eng keng tarqalgan qo'shilish anomaliyasi
      (1:400). Erkaklarda ikki marta ko'proq uchraydi. Birlashgan to'qima (isthmus) aorta oldida,
      past chayrali arteriya darajasida ko'tarilishni to'xtatib qoladi. Ko'pchilik hollarda asimptomatik,
      ammo UPJ to'siqlanishi (13–34%), siydik yo'li toshlari va VUR bilan birga uchraydi.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>1-jadval. Buyrak soni va joylashuv anomaliyalarining qiyosiy xulosasi</caption>
        <thead>
          <tr><th>Anomaliya</th><th>Uchraish chastotasi</th><th>Asosiy klinik ahamiyati</th></tr>
        </thead>
        <tbody>
          <tr><td>Ikki tomonlama buyrak ageneziyasi</td><td>1:5000</td><td>Deyarli 100% o'lim (o'pka gipoplaziyasi, Potter sindromi)</td></tr>
          <tr><td>Bir tomonlama buyrak ageneziyasi</td><td>1:1200</td><td>Ko'pincha asimptomatik; 30% da uzoq muddatli CKD xavfi</td></tr>
          <tr><td>Chanoq buyrak (simple renal ectopia)</td><td>1:900</td><td>Gidronefroz xavfi; reproduktiv anomaliyalar ~15%</td></tr>
          <tr><td>Ot-nalcha buyrak (horseshoe kidney)</td><td>1:400</td><td>Ko'pincha asimptomatik; UPJ to'siqlanishi, toshlar xavfi</td></tr>
          <tr><td>Ko'krak qafasi buyrak (thoracic kidney)</td><td>1:13,000</td><td>Ko'pincha asimptomatik; ko'krak rentgenida tasodifan topiladi</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 4. SISTIK VA DISPLASTIK -->
  <section class="section" id="sistik">
    <h2><span class="num">4</span>Sistik va displastik buyrak kasalliklari</h2>

    <h3>4.1. Buyrak displaziyasi (renal dysplasia)</h3>
    <p>
      Buyrak to'qimasining noto'g'ri differensiyalanishi — ibtidoiy kanallar, yetilmagan glomerullar va
      ko'pincha tog'ay to'qimasining buyrakda borligi bilan tavsiflanadi. Ko'pincha uriner to'siqlanish
      yoki ureter kurtagi anomaliyasi tufayli yuzaga keladi. Eng og'ir ko'rinishi —
      <span class="term">multilokullyar kistik displastik buyrak (multicystic dysplastic kidney, MCDK)</span>,
      unda buyrak faoliyatsiz kistalar majmuasiga aylanadi. MCDK ko'pincha spontan involüsiyaga uchraydi.
    </p>

    <h3>4.2. Politistik buyrak kasalliklari</h3>
    <ul>
      <li>
        <strong>Autosomal dominant (ADPKD)</strong> — kattalar politistik buyrak kasalligi, PKD1/PKD2 gen
        mutatsiyasi; ko'pincha 30–50 yoshda belgilanadi, buyrak yetishmovchiligiga olib kelishi mumkin
      </li>
      <li>
        <strong>Autosomal retsessiv (ARPKD)</strong> — 1:20,000 tug'ilishda; og'ir shakli yangi tug'ilganda
        o'pka gipoplaziyasi va buyrak yetishmovchiligiga olib keladi
      </li>
    </ul>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat!</strong>
        <p>
          MCDK va UPJ to'siqlanishi prenatal ultratovushda o'xshash ko'rinishi mumkin. Farqlash uchun
          postnatal kuzatuv va diuretik renografiya (MAG3 skan) talab etilishi mumkin — chunki bu ikki holatning
          klinik oqibatlari va davolash taktikasi butunlay farq qiladi.
        </p>
      </div>
    </div>
  </section>

  <!-- 5. SIYDIK YO'LI ANOMALIYALARI -->
  <section class="section" id="siydikyo">
    <h2><span class="num">5</span>Siydik yo'li anomaliyalari</h2>

    <h3>5.1. UPJ to'siqlanishi (ureteropelvic junction obstruction, UPJO)</h3>
    <p>
      Buyrak jomi bilan siydik yo'li tutashadigan joyda siydik oqimining sekinlashishi yoki
      to'xtatilishi. Urologik anomaliyalar ichida eng ko'p operatsiya talab qiladigan holat hisoblanadi.
      Sabablari: ichki tor (intrinsik stenoz — ko'pincha apristaltik segment), tashqi bosim
      (kesib o'tuvchi tomir), yuqori kirish nuqtasi. Davolashda
      <span class="term">piyeloplastika (pyeloplasty)</span> — buyrak jomi va siydik yo'lini
      qayta birlashtiradigan jarrohlik amaliyoti — "oltin standart" hisoblanadi.
    </p>

    <h3>5.2. Siydik yo'li duplikatsiyasi (ureteral duplication)</h3>
    <p>
      Ikki ureter kurtagi bitta buyrakdan o'sib chiqsa yoki bitta kurtakdan erta ajralsa,
      <span class="term">duplikat siydik yo'li (duplex system)</span> hosil bo'ladi.
      <span class="term">Vayger-Meyer qoidasi (Weigert-Meyer rule)</span>ga ko'ra, yuqori qutb uretri
      qovuqqa pastroqda va mediaroqda kiradi; pastki qutb uretri esa oddiy holatga yaqinroq.
      Yuqori qutb uretri ko'pincha ektopik yoki ureterotselga moyil; pastki qutb uretri esa
      VURga moyilroq hisoblanadi.
    </p>

    <h3>5.3. Ureterotsel va ektopik ureter</h3>
    <p>
      <span class="term">Ureterotsel (ureterocele)</span> — siydik yo'lining distal qismining sista
      kabi kengayishi; ko'pincha duplikat tizimning yuqori qutb uretri bilan bog'liq.
      <span class="term">Ektopik ureter (ectopic ureter)</span> — siydik yo'li trigondan tashqarida,
      masalan, prostatik uretra yoki vaginaga kiradigan holat. Ayollarda doimiy siydik tomchilashi
      (continuous dribbling) — qovuq tutish saqlangan holda tomchilash — ektopik ureterning
      klassik belgisi hisoblanadi.
    </p>
  </section>

  <!-- 6. QOVUQ ANOMALIYALARI -->
  <section class="section" id="qovuq">
    <h2><span class="num">6</span>Qovuq anomaliyalari</h2>

    <h3>6.1. Qovuq ekssrofiyasi (bladder exstrophy)</h3>
    <p>
      1:30,000 tug'ilishda uchraydigan, qorin pastki devori va qovuq oldingi devori defekti bo'lib, qovuq
      ichkisi tashqariga ochiq holda tug'iladi. Erkakda epispadiya (dorsalda joylashgan siydik teshigi)
      bilan birga kechadi. Bu holat ko'p bosqichli jarrohlik rekonstruktsiyasini talab qiladi.
    </p>

    <h3>6.2. Urachus anomaliyalari (urachal anomalies)</h3>
    <p>
      Embrion davrida allantois kanalidan hosil bo'lgan urachus tug'ilish paytida qorin devori
      bo'ylab qalin tolali ip (o'rta kindik boylamiga) aylanishi kerak. Agar yopilmasa, turli
      anomaliyalar vujudga keladi:
    </p>
    <ul>
      <li><strong>Patent urachus (fistula)</strong> — kindikdan siydik oqishi</li>
      <li><strong>Urachus sinusi</strong> — kindikka ochiq, qovuqqa yopiq</li>
      <li><strong>Urachus kistasi</strong> — ikki tomondan yopiq, o'rtada suyuqlik to'planishi (ko'pincha infeksiyalanishi mumkin)</li>
    </ul>
  </section>

  <!-- 7. URETRA ANOMALIYALARI -->
  <section class="section" id="uretra">
    <h2><span class="num">7</span>Uretra anomaliyalari</h2>

    <h3>7.1. Orqa uretra valvalari (posterior urethral valves, PUV)</h3>
    <p>
      Faqat erkak go'daklarda uchraydigan, orqa uretra bo'shlig'iga to'siq yasaydigan membranoz
      burmalar. PUV — yangi tug'ilgan va go'dak erkaklarda eng ko'p uchraydigan obstruktiv
      uropatiya sababi va bolalardagi CKDning asosiy oldini olish mumkin bo'lgan sabablaridan biri.
      VCUG tekshiruvida kengaygan orqa uretra klassik ko'rinish beradi.
    </p>

    <div class="callout callout--warning">
      <div class="callout__icon">🚨</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! PUV — shoshilinch holat</strong>
        <p>
          Yangi tug'ilgan o'g'il bola prenatal ultratovushda ikki tomonlama gidronefroz, kengaygan
          qovuq va "kalit teshigi belgisi" (keyhole sign — kengaygan orqa uretra va qovuq birgalikda)
          ko'rsatsa, PUV kuchli gumon qilinishi va zudlik bilan urologik baholash o'tkazilishi kerak.
          PUV davolanmasdan qolsa, buyrak to'qimasi qaytmas zararlanishi mumkin.
        </p>
      </div>
    </div>

    <h3>7.2. Gipospadiya (hypospadias)</h3>
    <p>
      Erkak go'daklarda uretra teshigining normal holatdan (glans uchi) orqaroqda — korpus bo'ylab
      joylashishi. Uchraish chastotasi taxminan 1:300 yangi tug'ilgan erkak go'daklarda.
      Uretra teshigining joylashuviga qarab uch darajaga bo'linadi:
      <em>distal (engil)</em> — eng ko'p, <em>o'rta</em> va <em>proksimal (og'ir)</em>.
      Ko'pchilik hollarda bir bosqichli yoki ikki bosqichli jarrohlik yordamida tuzatiladi.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>2-jadval. Uretra anomaliyalarining asosiy xususiyatlari</caption>
        <thead>
          <tr><th>Anomaliya</th><th>Faqat erkak?</th><th>Uchraish chastotasi</th><th>Dastlabki tekshiruv</th></tr>
        </thead>
        <tbody>
          <tr><td>Orqa uretra valvalari (PUV)</td><td>Ha</td><td>Taxminan 1:5000 erkak</td><td>Ultratovush + VCUG</td></tr>
          <tr><td>Gipospadiya</td><td>Ha</td><td>1:300 yangi tug'ilgan erkak</td><td>Klinik ko'rik, operatsiyagacha vizual baholash</td></tr>
          <tr><td>Qovuq ekssrofiyasi</td><td>Yo'q (ikki jinsda ham)</td><td>1:30,000</td><td>Klinik ko'rik, ko'p mutaxassis konsultatsiyasi</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 8. VUR -->
  <section class="section" id="vur">
    <h2><span class="num">8</span>Vezikouretal reflyuks (VUR)</h2>
    <p>
      <span class="term">Vezikouretal reflyuks (vesicoureteral reflux, VUR)</span> —
      siydikning qovuqdan siydik yo'liga teskari yo'nalishda oqishi. 1:500 dan 1:1000 tug'ilishda
      uchraydi. Asosiy mexanizm — siydik yo'lining qovuq devorida joylashgan intramural
      segmenti (ventil mexanizmi) etarlicha rivojlanmagan yoki juda qisqa bo'lishi.
    </p>

    <h3>8.1. Xalqaro tasnif (I–V darajalar)</h3>
    <div class="table-wrap">
      <table class="data-table">
        <caption>3-jadval. VURning xalqaro tasnifi (International Classification of VUR)</caption>
        <thead>
          <tr><th>Daraja</th><th>Tavsifi</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>I</strong></td><td>Reflyuks siydik yo'liga kirib, buyrak jomiga etib bormaydi (kengayish yo'q)</td></tr>
          <tr><td><strong>II</strong></td><td>Reflyuks buyrak jomigacha yetadi, kengayish yo'q, kosachalar normal</td></tr>
          <tr><td><strong>III</strong></td><td>Siydik yo'li, buyrak jomi va kosachalar yengil-o'rtacha kengaygan; forniks biroz o'tmas</td></tr>
          <tr><td><strong>IV</strong></td><td>O'rtacha kengayish, siydik yo'li buralgan, kosachalar o'tmas</td></tr>
          <tr><td><strong>V</strong></td><td>Kuchli kengayish va buralish, buyrak papillalarining izi yo'qolgan</td></tr>
        </tbody>
      </table>
    </div>

    <h3>8.2. Klinik ahamiyati</h3>
    <p>
      VURning asosiy xavfi — siydik yo'li infeksiyasi (UTI) paytida bakteriyalarning buyrak to'qimasiga
      ko'tarilishi va buyrak chaqiqlari (renal scar) hosil bo'lishi. Reflyuks infeksiyasiz kam asorat
      beradi. Past darajali VUR (I–III) ko'pincha spontan tuziladi; yuqori darajali VUR (IV–V) esa
      ko'pincha jarrohlik yoki endoskopik davolashni talab qiladi.
    </p>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma</strong>
        <p>
          VUR diangozini tasdiqlashning "oltin standarti" — <span class="en-term">voiding
          cystourethrogram (VCUG)</span> — siydik chiqarish jarayonida qovuq va uretrani kontrastli
          rentgen bilan tekshirish. Ammo bu nurlanish manbayi bo'lganligi uchun, bolalarda takroriy
          baholash uchun <span class="en-term">radionuklid sistografiya (RNC)</span> afzal ko'rilishi mumkin.
        </p>
      </div>
    </div>
  </section>

  <!-- 9. DIAGNOSTIKA -->
  <section class="section" id="diagnostika">
    <h2><span class="num">9</span>Diagnostika yondashuvi</h2>
    <p>
      CAKUT holatlari ko'pincha prenatal ultratovushda birinchi marta aniqlanadi. Postnatal (tug'ruqdan
      keyin) batafsil baholash rejimi anomaliyaning turiga bog'liq.
    </p>
    <div class="table-wrap">
      <table class="data-table">
        <caption>4-jadval. CAKUT diagnostikasida asosiy tekshiruv usullari</caption>
        <thead>
          <tr><th>Tekshiruv</th><th>Qo'llanilishi</th><th>Asosiy afzallik</th></tr>
        </thead>
        <tbody>
          <tr><td>Ultratovush (UTT)</td><td>Birinchi navbatdagi tekshiruv — har qanday CAKUT gumonida</td><td>Nurlanishsiz, arzon, real vaqtda</td></tr>
          <tr><td>VCUG</td><td>VUR, PUV, uretra anomaliyalari</td><td>Reflyuksni to'g'ridan-to'g'ri ko'rsatish</td></tr>
          <tr><td>MAG3 diuretik renografiya</td><td>UPJ to'siqlanishi darajasini aniqlash</td><td>Buyrak funksiyasini va oqim dinamikasini baholash</td></tr>
          <tr><td>DMSA skan</td><td>Buyrak chaqiqlari va differensial funksiya</td><td>Buyrak to'qimasi yo'qolishini nozik aniqlash</td></tr>
          <tr><td>MR urografiya (MRU)</td><td>Murakkab anomaliyalar, jarrohlikka tayyorgarlik</td><td>Nurlanishsiz, anatomik va funksional ma'lumot birga</td></tr>
          <tr><td>KT urografiya (CTU)</td><td>Murakkab holat, jarrohlik rejalashtirish</td><td>Yuqori aniqlik; lekin nurlanish bor</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--guide">
      <div class="callout__icon">📋</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          ALARA tamoyiliga amal qilish — ayniqsa bolalarda — hal qiluvchi ahamiyatga ega: ion
          nurlanishini minimallashtirish maqsadida ultratovush va MRU birinchi navbatda, KT faqat zarur
          hollarda tanlanadi. Bolalar umr davomida ko'p marta tekshirilishi mumkin bo'lganligi uchun
          nurlanish yukini boshidan pasaytirish zarur.
        </p>
      </div>
    </div>
  </section>

  <!-- 10. XULOSA -->
  <section class="section" id="xulosa">
    <h2><span class="num">10</span>Xulosa va asosiy fikrlar</h2>
    <div class="keypoints">
      <p class="keypoints__title">⭐ Asosiy xulosalar</p>
      <ul>
        <li>CAKUT — bolalardagi CKDning yarmidan ko'p sababini tashkil etuvchi, keng tarqalgan tug'ma anomaliyalar guruhi.</li>
        <li>Embriologik asosni tushunish — ureter kurtagi va metanefrik mezoderm o'rtasidagi induktiv aloqa — CAKUT mexanizmlarini anglab yetishda muhim.</li>
        <li>Ot-nalcha buyrak eng keng tarqalgan qo'shilish anomaliyasi (1:400) bo'lib, ko'pincha asimptomatik.</li>
        <li>Ikki tomonlama buyrak ageneziyasi (Potter sindromi) deyarli har doim o'lim bilan tugaydi.</li>
        <li>VUR I–V darajada tasniflanadi; past darajali ko'pincha spontan tuziladi, yuqori darajali davolashni talab qiladi.</li>
        <li>PUV faqat erkak go'daklarda uchraydi va zudlik bilan endoskopik davolashni talab qiladi.</li>
        <li>Weigert-Meyer qoidasi duplikat siydik yo'li va uretrotsel holatlarini tushuntirishda asos bo'ladi.</li>
        <li>Diagnostikada ultratovush birinchi qadam; VUR uchun VCUG, to'siq uchun MAG3, chaqiq uchun DMSA qo'llaniladi.</li>
        <li>Bolalarda KT nurlanishini kamaytirish uchun ALARA tamoyiliga rioya qilish shart.</li>
      </ul>
    </div>
    <p class="source-note">
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr (2026), I jild, Part V (boblar 32, 42, 43, 45, 49, 50, 52)
      asosida tayyorlangan va faqat ta'lim maqsadlarida foydalanish uchun mo'ljallangan.
      Aniq klinik qarorlar uchun dolzarb AUA/EAU qo'llanmalariga murojaat qiling.
    </p>
  </section>

  <!-- 11. LUG'AT -->
  <section class="section" id="lugat">
    <h2><span class="num">11</span>Qisqartmalar va atamalar lug'ati</h2>
    <p>Mavzuda ishlatilgan barcha qisqartma va murakkab atamalarning to'liq izohi quyidagi jadvalda keltirilgan:</p>

    <div class="table-wrap">
      <table class="data-table glossary-table">
        <thead>
          <tr><th>Qisqartma / Atama</th><th>Inglizcha to'liq nomi</th><th>O'zbekcha izohi</th></tr>
        </thead>
        <tbody>
          <tr><td>CAKUT</td><td>Congenital Anomalies of the Kidney and Urinary Tract</td><td>Buyrak va siydik yo'llarining tug'ma anomaliyalari</td></tr>
          <tr><td>UPJO</td><td>Ureteropelvic Junction Obstruction</td><td>Buyrak jomi–siydik yo'li birikish joyidagi to'siqlanish</td></tr>
          <tr><td>VUR</td><td>Vesicoureteral Reflux</td><td>Siydikning qovuqdan siydik yo'liga teskari oqishi</td></tr>
          <tr><td>PUV</td><td>Posterior Urethral Valves</td><td>Orqa uretra valvalari — erkak go'daklarda uchraydigan to'siq</td></tr>
          <tr><td>MCDK</td><td>Multicystic Dysplastic Kidney</td><td>Ko'p kistali displastik buyrak — faoliyatsiz kistalar to'plami</td></tr>
          <tr><td>ADPKD</td><td>Autosomal Dominant Polycystic Kidney Disease</td><td>Autosomal dominant politistik buyrak kasalligi (kattalar)</td></tr>
          <tr><td>ARPKD</td><td>Autosomal Recessive Polycystic Kidney Disease</td><td>Autosomal retsessiv politistik buyrak kasalligi (bolalar)</td></tr>
          <tr><td>VCUG</td><td>Voiding Cystourethrogram</td><td>Siydik chiqarish jarayonida qovuq-uretrani kontrastli rentgen bilan tekshirish</td></tr>
          <tr><td>MAG3</td><td>Mercaptoacetyltriglycine (renal scan)</td><td>Diuretik renografiya — buyrak oqim dinamikasini baholovchi radionuklid tekshiruv</td></tr>
          <tr><td>DMSA</td><td>Dimercaptosuccinic Acid (renal scan)</td><td>Buyrak to'qimasini va chaqiqlarini aniqlovchi radionuklid tekshiruv</td></tr>
          <tr><td>MRU</td><td>Magnetic Resonance Urography</td><td>Magnit-rezonans urografiyasi — nurlanishsiz anatomik va funksional tekshiruv</td></tr>
          <tr><td>CTU</td><td>Computed Tomography Urography</td><td>Kompyuter tomografiyasi urografiyasi</td></tr>
          <tr><td>RNC</td><td>Radionuclide Cystography</td><td>Radionuklid sistografiya — VUR kuzatuvida nurlanish kamaytirish uchun</td></tr>
          <tr><td>CKD</td><td>Chronic Kidney Disease</td><td>Surunkali buyrak kasalligi</td></tr>
          <tr><td>ALARA</td><td>As Low As Reasonably Achievable</td><td>"Imkon qadar past" tamoyili — nurlanishni minimallashtirish qoidasi</td></tr>
          <tr><td>Piyeloplastika</td><td>Pyeloplasty</td><td>UPJ to'siqlanishini bartaraf etish uchun jarrohlik amaliyoti</td></tr>
          <tr><td>Weigert-Meyer qoidasi</td><td>Weigert-Meyer Rule</td><td>Duplikat tizimda yuqori qutb ureterining pastga, pastki qutbnikining yuqoriga kirishi qoidasi</td></tr>
        </tbody>
      </table>
    </div>
  </section>

</article>
</main>
$tugma_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;

