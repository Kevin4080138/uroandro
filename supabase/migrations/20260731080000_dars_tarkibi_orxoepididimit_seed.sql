-- Orxoepididimit — 13-dars nazariya tarkibi
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'orxoepididimit-asoslari',
  $orxo_html$
<main class="site-main">
<article class="lesson">

  <!-- HERO -->
  <div class="article-hero">
    <span class="article-hero__eyebrow">📘 13-mavzu · Yallig'lanish kasalliklari</span>
    <h1>Orxoepididimit — moyak va quyma yallig'lanishi: sabablari, belgilari va torsiyadan farqlash</h1>
    <p class="article-hero__lead">
      Orxoepididimit — epididimis va moyakning birgalikda yallig'lanishi bo'lib, o'tkir skrotal og'riqning
      eng keng tarqalgan sabablaridan biri. Klinik ahamiyati shundaki, u hayot uchun xavfli
      moyak torsiyasiga juda o'xshab ko'rinadi. Ushbu dars orxoepididimitning etiologiyasi,
      yoshga ko'ra qo'zg'atuvchi farqlari, diagnostikasi, torsiyadan farqlash usullari va davolash
      tamoyillarini <em>Campbell-Walsh-Wein Urology</em> darsligi (bob 27, 29) asosida yoritadi.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~20 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr, Bob 27, 29</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ul class="toc__list">
      <li><a href="#tarif">1. Ta'rif va epidemiologiya</a></li>
      <li><a href="#etiologiya">2. Etiologiya va yoshga qarab qo'zg'atuvchilar</a></li>
      <li><a href="#klinik">3. Klinik belgilar</a></li>
      <li><a href="#torsiya">4. Moyak torsiyasidan farqlash — muhim qadam</a></li>
      <li><a href="#diagnostika">5. Diagnostika</a></li>
      <li><a href="#davolash">6. Davolash</a></li>
      <li><a href="#surunkali">7. Surunkali epididimit va orxit</a></li>
      <li><a href="#xulosa">8. Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">9. Qisqartmalar va atamalar lug'ati</a></li>
    </ul>
  </nav>

  <!-- 1. TA'RIF -->
  <section class="section" id="tarif">
    <h2><span class="num">1</span>Ta'rif va epidemiologiya</h2>
    <p>
      <span class="term">Epididimit (epididymitis)</span> — epididimisning og'riq, shish va yallig'lanishi
      bilan kechadigan holat. Agar moyak ham jarayonga qo'shilsa —
      <span class="term">orxoepididimit (epididymo-orchitis)</span> deyiladi. Alohida moyak
      yallig'lanishi — <span class="term">orxit (orchitis)</span> — kamroq uchraydi va ko'pincha
      qo'shni epididimis ham jalb bo'ladi.
    </p>
    <p>
      Epididimit — o'tkir skrotal og'riqning eng keng tarqalgan sabablaridan biri.
      AQShda yiliga ambulatoria amaliyotda 600,000 dan ortiq holat qayd etiladi.
      Tarqalish chastotasi: 10,000 kishi-yilida 25–65 ta holat. Holat har qanday yoshda,
      jumladan bolalarda ham uchraydi, ammo asosiy guruhlar — jinsiy faol yosh erkaklar
      va 35 yoshdan katta erkaklar.
    </p>

    <div class="callout callout--warning">
      <div class="callout__icon">🚨</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! — Har doim torsiyani istisno qiling</strong>
        <p>
          O'tkir skrotal og'riqda dastlabki qadam — <strong>moyak torsiyasini istisno qilish</strong>.
          Torsiya jarrohlik shoshilinchi: 6 soat ichida davolanmasa moyak saqlanib qolish
          ehtimoli 90–100%, 24 soatdan keyin faqat 10%. Klinik belgilar epididimitga o'xshab
          ko'rinishi mumkin — bu farqni anglash hayotiy muhim ahamiyatga ega.
        </p>
      </div>
    </div>
  </section>

  <!-- 2. ETIOLOGIYA -->
  <section class="section" id="etiologiya">
    <h2><span class="num">2</span>Etiologiya va yoshga qarab qo'zg'atuvchilar</h2>
    <p>
      Infeksiya ko'pincha uretradan ko'tariluvchi yo'l (asending route) orqali epididimisga
      tarqaladi — bu 1927-yildayoq Campbell tomonidan tasvirlangan va keyingi tadqiqotlarda
      uretral va epididimal izolyatlar o'rtasida ~80% mos kelishi bilan tasdiqlanган.
      Qo'zg'atuvchi turi bemorning yoshiga va jinsiy hayot xususiyatlariga bog'liq.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>1-jadval. Yoshga va xavf omillariga qarab epididimit qo'zg'atuvchilari</caption>
        <thead>
          <tr><th>Guruh</th><th>Asosiy qo'zg'atuvchilar</th><th>Izoh</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>35 yoshdan kichik, jinsiy faol</strong></td>
            <td><em>C. trachomatis</em> va <em>N. gonorrhoeae</em></td>
            <td>JYYIga skrining majburiy; ammo 42% da enterik organizmlar ham aniqlangan</td>
          </tr>
          <tr>
            <td><strong>Anal jinsiy aloqa amaliyotchilari</strong></td>
            <td><em>C. trachomatis</em>, <em>N. gonorrhoeae</em> va enterik organizmlar (E. coli)</td>
            <td>Kombinatsiyalangan davolash tavsiya etiladi</td>
          </tr>
          <tr>
            <td><strong>35 yoshdan katta</strong></td>
            <td>Uropatogenlar — <em>E. coli</em>, <em>Pseudomonas</em>, <em>Klebsiella</em></td>
            <td>BPH, uretra torayishi, siydik yo'li instrumentatsiyasi xavf omillari</td>
          </tr>
          <tr>
            <td><strong>Bolalar</strong></td>
            <td>Enterik organizmlar; ba'zan JYYIsiz anatomik anomaliya</td>
            <td>Bolalarda anatomik tekshiruv (VCUG) ko'rib chiqilishi kerak</td>
          </tr>
          <tr>
            <td><strong>Viral (har qanday yosh)</strong></td>
            <td>Parotit (mumps) virusi — eng keng tarqalgan viral sabab; SARS-CoV-2, HSV-2, EBV</td>
            <td>Parotit orxiti — moyak atrofiyasi va subfertillikka olib kelishi mumkin</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma — yoshi chegarasi qat'iy emas</strong>
        <p>
          "35 yoshdan kichik = JYYI, katta = enterik" qoidasi faqat yo'naltiruvchi hisoblanadi.
          Pilatz va boshqalarning tadqiqotida 35 yoshdan kichik bemorlarda 42% da enterik organizmlar
          aniqlangan. Shu sababli <strong>barcha jinsiy faol bemorlarda JYYIga skrining
          o'tkazilishi kerak</strong> — yoshidan qat'i nazar.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. KLINIK BELGILAR -->
  <section class="section" id="klinik">
    <h2><span class="num">3</span>Klinik belgilar</h2>
    <p>
      O'tkir epididimitning klassik ko'rinishi:
    </p>
    <ul>
      <li><strong>Bir tomonlama skrotal og'riq va shish</strong> — holatlarning 96% da bir tomonlama</li>
      <li>Og'riq odatda <strong>epididimisning quyruq qismida (cauda)</strong> boshlanib, asta-sekin
      qolgan epididimis va moyakka tarqaladi</li>
      <li><strong>Reaktiv gidrotsele</strong> — epididimis atrofida suyuqlik to'planishi</li>
      <li>Palpatsiyada epididimisning og'riqli kattalashishi</li>
      <li><strong>Isitma</strong> — 38°C dan yuqori Pilatz tadqiqotida 26% bemorlarda kuzatilgan</li>
      <li>Ko'pincha birga kechadigan (ba'zida asimptomatik) uretrit belgilari</li>
    </ul>

    <h3>3.1. Og'riqni engillashtiradigan va kuchaytiradigan holat</h3>
    <p>
      <span class="term">Prehn belgisi (Prehn sign)</span> — skrotumni ko'tarish (elevation) og'riqni
      kamaytirsa — epididimitga ishora (torsiyada aksincha, ko'tarishdan foyda yo'q yoki
      og'riq kuchayadi). Ammo bu belgi yetarli aniqlikka ega emas va mustaqil diagnostik mezon
      sifatida ishlatilmasligi kerak.
    </p>
  </section>

  <!-- 4. TORSIYADAN FARQLASH -->
  <section class="section" id="torsiya">
    <h2><span class="num">4</span>Moyak torsiyasidan farqlash — muhim qadam</h2>
    <p>
      O'tkir skrotal og'riqda epididimit va moyak torsiyasini farqlash klinik amaliyotda eng muhim
      qadam hisoblanadi. Ikkalasida ham kuchli og'riq, shish va qizarish bo'lishi mumkin.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>2-jadval. Epididimit va moyak torsiyasining klinik farqi</caption>
        <thead>
          <tr><th>Xususiyat</th><th>Epididimit</th><th>Moyak torsiyasi</th></tr>
        </thead>
        <tbody>
          <tr><td>Boshlanish tezligi</td><td>Asta-sekin (soatlar/kunlar)</td><td>To'satdan, keskin (daqiqalar)</td></tr>
          <tr><td>Ko'p uchraydigan yosh</td><td>Jinsiy faol yoshlar (JYYI) va 35+ (UTI)</td><td>O'smirlar (12–18 yosh) — cho'qqisi</td></tr>
          <tr><td>Isitma</td><td>Ko'pincha bor (26%)</td><td>Odatda yo'q</td></tr>
          <tr><td>Kremasteric reflex</td><td>Odatda saqlanadi</td><td>Ko'pincha yo'q — muhim belgi</td></tr>
          <tr><td>Moyak joylashuvi</td><td>Normal</td><td>Ko'tarilgan, ko'ndalang joylashgan bo'lishi mumkin</td></tr>
          <tr><td>Doppler UTT</td><td>Kuchaygan qon oqimi (hiperemiya)</td><td>Kamaygan yoki yo'q qon oqimi</td></tr>
          <tr><td>Prehn belgisi</td><td>Ko'tarishdan og'riq kamayishi mumkin</td><td>Ko'tarishdan foyda yo'q (ishonchsiz belgi)</td></tr>
          <tr><td>Davo</td><td>Antibiotiklar</td><td>Shoshilinch jarrohlik!</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! — Ultratovush torsiyani rad eta olmaydi</strong>
        <p>
          Doppler ultratovushda qon oqimi normal yoki kuchaygan ko'rinsa ham torsiyani to'liq
          istisno qilib bo'lmaydi. Klinik shubha kuchli bo'lganda — <strong>ultratovush natijasiga
          qaramasdan shoshilinch jarrohlik konsultatsiyasi</strong> kerak. "Manfiy ultratovush
          torsiyani yo'q qilmaydi" — bu tamoyilni har doim esda tutish lozim.
        </p>
      </div>
    </div>
  </section>

  <!-- 5. DIAGNOSTIKA -->
  <section class="section" id="diagnostika">
    <h2><span class="num">5</span>Diagnostika</h2>

    <h3>5.1. Epididimitni tasdiqlash mezonlari (CDC, 2021)</h3>
    <p>Quyidagilardan <strong>kamida bittasi</strong> bo'lishi kerak:</p>
    <ul>
      <li>Uretra ajralmasining Gram bo'yog'ida yog' immersion maydonida ≥2 leykotsit</li>
      <li>Birinchi qism siydikda leykotsit esteraza musbat</li>
      <li>Birinchi qism siydik mikroskopiyasida ≥10 leykotsit/HPF</li>
    </ul>

    <h3>5.2. Zaruriy tekshiruvlar</h3>
    <ul>
      <li><strong>NAAT</strong> — barcha gumonlarda C. trachomatis va N. gonorrhoeae uchun; birinchi qism siydik yoki uretra surtmasi</li>
      <li><strong>Siydik ekinmasi</strong> — enterik organizmlar bilan bog'liq holatda va 35 yoshdan katta erkakda</li>
      <li><strong>Siydik tahlili</strong> — leykotsit va bakteriyalarni aniqlash</li>
      <li><strong>Doppler ultratovush</strong> — torsiya shubhasi bo'lganda, absess yoki torsiyani istisno qilish uchun; epididimitni tasdiqlash uchun emas (klinik belgilar etarli)</li>
    </ul>

    <div class="callout callout--guide">
      <div class="callout__icon">📋</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          Ultratovush epididimitni <em>tashxislash</em> uchun emas, balki <em>asoratlarni</em>
          (absess, torsiya, infarkt) istisno qilish va kuzatuv uchun qo'llaniladi.
          Mos klinik kontekstda salbiy ultratovush klinik menejmentni o'zgartirmaydi.
        </p>
      </div>
    </div>
  </section>

  <!-- 6. DAVOLASH -->
  <section class="section" id="davolash">
    <h2><span class="num">6</span>Davolash</h2>

    <h3>6.1. Simptomatik davo</h3>
    <p>
      Posteli rejimi, skrotumni ko'tarish (elevation) va mahalliy sovutish og'riqni yengillashtiradi.
      NSAIDlar foydali. Ko'pchilik ambulatoria davolanadi; lekin yuqori leykotsitoz va isitma
      bo'lgan hollarda kasalxonaga yotqizish ko'rib chiqilishi kerak.
    </p>

    <h3>6.2. Antibiotik davolash (CDC, 2021)</h3>
    <div class="table-wrap">
      <table class="data-table">
        <caption>3-jadval. O'tkir epididimitda antibiotik tanlash (CDC 2021 asosida)</caption>
        <thead>
          <tr><th>Ehtimoliy sabab</th><th>Tavsiya etilgan rejim</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Xlamidiya yoki gonorey</td>
            <td>Seftriakson 500 mg IM yagona doza <strong>+</strong> Doksisiklin 100 mg × 2/kun, 10 kun<br><small>(≥150 kg da seftriakson 1 g)</small></td>
          </tr>
          <tr>
            <td>Xlamidiya, gonorey yoki enterik organizmlar (anal jinsiy aloqa)</td>
            <td>Seftriakson 500 mg IM yagona doza <strong>+</strong> Levofloksatsin 500 mg/kun, 10 kun</td>
          </tr>
          <tr>
            <td>Faqat enterik organizmlar (gonorey istisno qilingan)</td>
            <td>Levofloksatsin 500 mg/kun, 10 kun</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>6.3. Kuzatuv</h3>
    <p>
      Simptomlar <strong>72 soat ichida yaxshilanmasa</strong> — qayta baholash majburiy.
      Antibiotikka javob bermagan hollarda ultratovush — absess yoki moyak infarkti istisno
      qilish uchun. Ftorokinolonga rezistentlik ortayotganini inobatga olib, ekinma
      natijalariga asoslanib davolashni moslashtirish muhim.
    </p>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma — bemor maslahat</strong>
        <p>
          O'tkir og'riq 1–3 kunda yaxshilanishi mumkin, ammo yallig'lanish belgilari
          (shish, diskomfort) <strong>2–4 hafta davomida</strong> to'liq yo'qolmaydi — bemorga
          buni oldindan tushuntirish kerak. C. trachomatis yoki N. gonorrhoeae tasdiqlanganda
          jinsiy hamrohlar ham baholash va davolash uchun yuborilishi shart.
        </p>
      </div>
    </div>
  </section>

  <!-- 7. SURUNKALI -->
  <section class="section" id="surunkali">
    <h2><span class="num">7</span>Surunkali epididimit va orxit</h2>

    <h3>7.1. Surunkali epididimit</h3>
    <p>
      <span class="term">Surunkali epididimit (chronic epididymitis)</span> — bir yoki ikkala
      epididimisda kamida 3 oy davomida diskomfort va/yoki og'riq. Uch toifaga bo'linadi:
      yallig'lanishli (xlamidiya, TB, amiodarone), obstruktiv (postinfeksion/postvasektomiya)
      va epididimalgia (aniq sabab yo'q). Surunkali epididimitning eng keng tarqalgan yuqumli
      sababi — <em>Mycobacterium tuberculosis</em>.
    </p>

    <h3>7.2. Parotit (mumps) orxiti</h3>
    <p>
      Parotit virus orxitining klassik ko'rinishi: parotit boshlanganidan 4–6 kun o'tib
      isitma va bir tomonlama (kamdan-kam ikki tomonlama) moyak og'rig'i paydo bo'ladi.
      Holat 1 haftada yaxshilanadi, ammo moyak atrofiyasi holllarning 50% da kuzatiladi
      va oligospermiyaga olib kelishi mumkin. Interferon davolash atrofiyani oldini olishda
      har doim ham samarali emas.
    </p>

    <h3>7.3. SARS-CoV-2 va orxoepididimit</h3>
    <p>
      COVID-19 va orxoepididimit bog'liqligi aniqlangan. Taklif etilgan mexanizm —
      SARS-CoV-2 virusi moyakdagi Sertoli va Leydig hujayralarida ACE2 retseptorlariga
      birikishi. Mavjud ma'lumotlar asosan konservativ davolash bilan yaxshi kechuvchi holatlarga
      taalluqli; biroq necrotikal orxoepididimit va orxektomiya talab etilgan individual
      holatlar ham qayd etilgan. COVID-19 vaksinatsiyasi orxoepididimit xavfini sezilarli
      kamaytirishi (OR 0.57) aniqlangan.
    </p>
  </section>

  <!-- 8. XULOSA -->
  <section class="section" id="xulosa">
    <h2><span class="num">8</span>Xulosa va asosiy fikrlar</h2>
    <div class="keypoints">
      <p class="keypoints__title">⭐ Asosiy xulosalar</p>
      <ul>
        <li>Epididimit — o'tkir skrotal og'riqning eng keng tarqalgan sababi; 96% hollarda bir tomonlama.</li>
        <li>Qo'zg'atuvchi yoshga bog'liq: 35 yoshdan kichikda JYYI (C. trachomatis, N. gonorrhoeae), kattalarda enterik organizmlar — ammo bu chegara qat'iy emas, barcha faol bemorlarda skrining kerak.</li>
        <li>Moyak torsiyasini istisno qilish — har doim birinchi qadam: kremasteric reflex yo'qligi, to'satdan boshlanish va ultratovushda qon oqimi pasayishi torsiyaga ishora.</li>
        <li>Ultratovush epididimitni tasdiqlash uchun emas — torsiya va absessni istisno qilish uchun qo'llaniladi; salbiy ultratovush torsiyani to'liq rad etmaydi.</li>
        <li>NAAT — C. trachomatis va N. gonorrhoeae tasdiqlash uchun barcha holatlarda o'tkaziladi.</li>
        <li>Davolash sababga qarab: JYYI = seftriakson + doksisiklin; enterik = levofloksatsin.</li>
        <li>72 soatda yaxshilanmasa — qayta baholash va ultratovush (absess/infarkt).</li>
        <li>Parotit orxiti — moyak atrofiyasiga olib kelishi mumkin; COVID-19 ham orxoepididimit sababchisi.</li>
      </ul>
    </div>
    <p class="source-note">
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr (2026), Bob 27 va Bob 29 asosida tayyorlangan
      va faqat ta'lim maqsadlarida foydalanish uchun mo'ljallangan.
      Aniq klinik qarorlar uchun dolzarb CDC/EAU qo'llanmalariga murojaat qiling.
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
          <tr><td>Epididimit</td><td>Epididymitis</td><td>Epididimisning og'riq, shish va yallig'lanishi</td></tr>
          <tr><td>Orxit</td><td>Orchitis</td><td>Moyakning yallig'lanishi</td></tr>
          <tr><td>Orxoepididimit</td><td>Epididymo-orchitis</td><td>Epididimis va moyakning birgalikda yallig'lanishi</td></tr>
          <tr><td>JYYI</td><td>Sexually Transmitted Infection (STI)</td><td>Jinsiy yo'l bilan yuqadigan infeksiya</td></tr>
          <tr><td>NAAT</td><td>Nucleic Acid Amplification Test</td><td>Nukleik kislota amplifikatsiya testi — eng sezuvchan diagnostik usul</td></tr>
          <tr><td>HPF</td><td>High-Power Field</td><td>Mikroskopning yuqori quvvatli ko'rish maydoni</td></tr>
          <tr><td>BPH</td><td>Benign Prostatic Hyperplasia</td><td>Prostata bezining xavfsiz kattalashishi — katta yoshli erkakda epididimit xavf omili</td></tr>
          <tr><td>VCUG</td><td>Voiding Cystourethrogram</td><td>Siydik chiqarish paytida qovuq-uretra rentgeni — bolalarda anomaliyani aniqlash</td></tr>
          <tr><td>NSAIDlar</td><td>Non-Steroidal Anti-Inflammatory Drugs</td><td>Steroid bo'lmagan yallig'lanishga qarshi dorilar — og'riq va yallig'lanish uchun</td></tr>
          <tr><td>Prehn belgisi</td><td>Prehn Sign</td><td>Skrotumni ko'tarishda og'riq kamayishi — epididimitga ishora (ishonchsiz belgi)</td></tr>
          <tr><td>Kremasteric reflex</td><td>Cremasteric Reflex</td><td>Son ichki yuzasiga ta'sirda moyakning ko'tarilishi refleksi — torsiyada yo'qoladi</td></tr>
          <tr><td>ACE2</td><td>Angiotensin-Converting Enzyme 2</td><td>SARS-CoV-2 birikaydigan retseptor — moyak hujayralarida ham mavjud</td></tr>
          <tr><td>TB</td><td>Tuberculosis</td><td>Sil kasalligi — surunkali epididimitning eng keng tarqalgan yuqumli sababi</td></tr>
          <tr><td>EAU</td><td>European Association of Urology</td><td>Yevropa Urologiya Assotsiatsiyasi</td></tr>
        </tbody>
      </table>
    </div>
  </section>

</article>
</main>
$orxo_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
