-- Uretrit — 11-dars nazariya tarkibi
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'uretrit-asoslari',
  $uretrit_html$
<main class="site-main">
<article class="lesson">

  <!-- HERO -->
  <div class="article-hero">
    <span class="article-hero__eyebrow">📘 11-mavzu · Jinsiy yo'l bilan yuqadigan kasalliklar</span>
    <h1>Uretrit: gonokokkli va nogonokokkli — ikkita tur, ikkita yondashuv</h1>
    <p class="article-hero__lead">
      Uretrit — uretranin g epiteli qoplamining infeksiya yoki yallig'lanishi. U klinik ahamiyatiga
      ko'ra ikki asosiy turga bo'linadi: gonokokkli (gonorey qo'zg'atuvchisi) va nogonokokkli
      (xlamidiya va boshqa qo'zg'atuvchilar). Ular o'rtasidagi farqni bilish — to'g'ri davo
      tanlashning kaliti. Ushbu dars <em>Campbell-Walsh-Wein Urology</em> darsligi (bob 29) asosida
      tayyorlangan.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~20 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr, Bob 29</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ul class="toc__list">
      <li><a href="#tarif">1. Ta'rif va diagnostik mezonlar</a></li>
      <li><a href="#gu">2. Gonokokkli uretrit (GU)</a></li>
      <li><a href="#ngu">3. Nogonokokkli uretrit (NGU)</a></li>
      <li><a href="#xlamidiya">4. Xlamidiya</a></li>
      <li><a href="#mgen">5. Mycoplasma genitalium</a></li>
      <li><a href="#farq">6. GU va NGU qiyosiy jadvali</a></li>
      <li><a href="#davolash">7. Davolash tamoyillari</a></li>
      <li><a href="#xulosa">8. Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">9. Qisqartmalar va atamalar lug'ati</a></li>
    </ul>
  </nav>

  <!-- 1. TA'RIF -->
  <section class="section" id="tarif">
    <h2><span class="num">1</span>Ta'rif va diagnostik mezonlar</h2>
    <p>
      <span class="term">Uretrit (urethritis)</span> — uretra epiteli qoplamining yallig'lanishi,
      ko'pincha bakterial yoki viral infeksiya natijasida yuzaga keladi. Klinik belgilari:
      uretral ajralma (discharge), dizuriya va ba'zida uretra teshigida achishish.
    </p>

    <h3>1.1. Uretritni tasdiqlash mezonlari (CDC, 2021)</h3>
    <p>
      Quyidagilardan <strong>kamida bittasi</strong> bo'lishi kifoya:
    </p>
    <ul>
      <li>Ko'rikda shilliq, shilliq-yiringli yoki yiringli ajralma</li>
      <li>Uretra ajralmasining Gram bo'yoqli surtmasida yog' immersion maydonida ≥2 ta leykotsit</li>
      <li>Birinchi qism siydikda leykotsit esteraza musbat</li>
      <li>Birinchi qism siydikda mikroskopda ≥10 leykotsit/ko'rish maydoni (HPF)</li>
    </ul>

    <div class="callout callout--note">
      <div class="callout__icon">🔬</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma — 2 ta leykotsit</strong>
        <p>
          Avvalgi CDC qo'llanmalarida ≥5 leykotsit/HPF mezon edi. Tadqiqotlar ≥5 WBC/HPF
          chegarasi Chlamydia trachomatis, N. gonorrhoeae va M. genitalium holatlarining
          sezilarli qismini o'tkazib yuborishini ko'rsatgach, <strong>2021 CDC qo'llanmasi yog'
          immersion maydonida ≥2 WBC</strong>ni yangi mezon sifatida qabul qildi.
        </p>
      </div>
    </div>
  </section>

  <!-- 2. GONOKOKKLI URETRIT -->
  <section class="section" id="gu">
    <h2><span class="num">2</span>Gonokokkli uretrit (GU)</h2>
    <p>
      <span class="term">Gonokokkli uretrit (gonococcal urethritis, GU)</span> —
      <em>Neisseria gonorrhoeae</em> tomonidan keltirib chiqariladigan infeksiya. N. gonorrhoeae —
      grамm-manfiy diplococcus bo'lib, 3–14 kunlik inkubatsiya davriga ega.
    </p>

    <h3>2.1. Klinik ko'rinish</h3>
    <ul>
      <li><strong>Erkaklar:</strong> ko'pincha simptomli — yiringli ajralma, dizuriya, uretrit, epididimit, prostatit</li>
      <li><strong>Ayollar:</strong> ko'pincha asimptomatik va kasallik asoratlari bilan namoyon bo'ladi: chanoq yallig'lanish kasalligi (PID), fallop nay chandiqlanishi, bepushtlik, ektopik homiladorlik</li>
    </ul>

    <h3>2.2. Diagnostika</h3>
    <ul>
      <li><strong>Gram bo'yog'i:</strong> erkak uretra surtmasida hujayra ichidagi grамm-manfiy diplokokklar — simptomli erkakda diagnostik</li>
      <li><strong>NAAT (nukleik kislota amplifikatsiya testi)</strong> — eng sezuvchan usul; birinchi qism siydik — afzal namuna; uretra surtmasidan ham bo'ladi</li>
      <li><strong>Ekinma (culture):</strong> antibiotiklargarezistentlikni monitoring qilish uchun, NAAT bilan bir qatorda qo'llaniladi</li>
    </ul>

    <h3>2.3. Davolash (CDC, 2021)</h3>
    <ul>
      <li><strong>Seftriakson 500 mg IM — yagona doza</strong> (≥150 kg og'irlikda 1 g) — birinchi tanlash</li>
      <li>Seftriakson mavjud bo'lmasa: gentamitsin 240 mg IM + azitromitsin 2 g og'iz orqali (yagona doza) <strong>yoki</strong> sefiksim 800 mg og'iz orqali yagona doza</li>
    </ul>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! Rezistentlik muammosi</strong>
        <p>
          N. gonorrhoeae tarixiy antibiotiklarning aksariyatiga (penitsyllin, tetratsikllin,
          ftorokinolonlar) tez rezistentlik hosil qildi. Shu sababli CDC 2021 yildan boshlab
          kombinatsiyalangan (seftriakson + azitromitsin) sxemadan voz kechib, <strong>seftriakson
          monoterapiyasiga</strong> o'tdi — lekin dozani oshirdi. Ftorokinolonlar gonorey uchun
          endi tavsiya etilmaydi.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. NOGONOKOKKLI URETRIT -->
  <section class="section" id="ngu">
    <h2><span class="num">3</span>Nogonokokkli uretrit (NGU)</h2>
    <p>
      <span class="term">Nogonokokkli uretrit (nongonococcal urethritis, NGU)</span> — uretrit
      holatlarining 80–95 foizini tashkil etadi. N. gonorrhoeae aniqlanmagan barcha uretrit
      holatlari NGU deb tasniflanadi. NGU ko'plab qo'zg'atuvchilar tomonidan keltirib
      chiqarilishi mumkin:
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <caption>1-jadval. NGU qo'zg'atuvchilari va ulushlar</caption>
        <thead>
          <tr><th>Qo'zg'atuvchi</th><th>NGU ichidagi ulushi</th><th>Izoh</th></tr>
        </thead>
        <tbody>
          <tr><td><em>Chlamydia trachomatis</em></td><td>15–40%</td><td>Eng keng tarqalgan, yoshlar orasida ko'proq</td></tr>
          <tr><td><em>Mycoplasma genitalium</em></td><td>15–25%</td><td>Qayta va surunkali NGUning asosiy sababi</td></tr>
          <tr><td><em>Ureaplasma urealyticum</em></td><td>Kam (zaiflashgan aloqa)</td><td>Boshqa qo'zg'atuvchi yo'qligida ko'rib chiqiladi</td></tr>
          <tr><td><em>Trichomonas vaginalis</em></td><td>O'zgaruvchan</td><td>Yuqori tarqalgan joylarda yoki dastlabki davolash muvaffaqiyatsiz bo'lganda</td></tr>
          <tr><td>HSV-1, HSV-2, adenovirus</td><td>Kam</td><td>Viral sabablar; ko'pincha og'iz-tanosil aloqadan keyin</td></tr>
          <tr><td>Aniqlanmagan</td><td>&gt;50%</td><td>Keng tekshiruvdan keyin ham qo'zg'atuvchi topilmaydi</td></tr>
        </tbody>
      </table>
    </div>

    <h3>3.1. NGU davolash (CDC, 2021)</h3>
    <ul>
      <li><strong>Doksisiklin 100 mg × 2/kun, 7 kun</strong> — birinchi tanlash (xlamidiya va M. genitaliumga qarshi yaxshi faollik)</li>
      <li>Alternativ: azitromitsin 1 g og'iz orqali yagona doza <em>yoki</em> azitromitsin 500 mg yagona doza, keyin 250 mg × 4 kun</li>
    </ul>
  </section>

  <!-- 4. XLAMIDIYA -->
  <section class="section" id="xlamidiya">
    <h2><span class="num">4</span>Xlamidiya (Chlamydia trachomatis)</h2>
    <p>
      <em>C. trachomatis</em> — obligat hujayra ichida yashovchi grамm-manfiy bakteriya.
      AQShda eng ko'p xabar qilinadigan infeksion kasallik bo'lib, 24 yoshdan kichik yoshlarda
      eng yuqori tarqalish darajasiga ega. Inkubatsiya davri 3–14 kun.
    </p>
    <p>
      Erkaklar asosan simptomli (NGU belgisi), lekin ayollarda ko'pincha asimptomatik kechadi.
      Ayollarda asoratlari jiddiy: fallopiy naylari chandiqlanishi, PID, surunkali chanoq og'rig'i
      va bepushtlik.
    </p>
    <ul>
      <li><strong>Diagnostika:</strong> birinchi qism siydikdan NAAT — eng sezuvchan usul</li>
      <li><strong>Davolash:</strong> doksisiklin 100 mg × 2/kun, 7 kun (afzal); alternativ: azitromitsin</li>
      <li><strong>3 oy qayta tekshiruv:</strong> davolash tugagandan keyin 3 oy o'tib takroriy NAAT tavsiya etiladi</li>
      <li><strong>Hamroh shifokorlari:</strong> so'nggi 60 kun ichidagi jinsiy hamrohlar baholash va davolash uchun yuborilishi shart</li>
    </ul>

    <div class="callout callout--guide">
      <div class="callout__icon">📋</div>
      <div class="callout__body">
        <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
        <p>
          Xlamidiya tasdiqlanganda bir vaqtning o'zida <strong>gonorey, HIV va sifilis</strong>
          uchun ham tekshiruv o'tkazish tavsiya etiladi — bu infeksiyalar ko'pincha birgalikda
          uchraydi.
        </p>
      </div>
    </div>
  </section>

  <!-- 5. MYCOPLASMA GENITALIUM -->
  <section class="section" id="mgen">
    <h2><span class="num">5</span>Mycoplasma genitalium</h2>
    <p>
      <em>M. genitalium</em> 1980-yillarning boshida birinchi marta aniqlangan va NGU holatlarining
      15–25 foizini tashkil etadi. Qayta yoki surunkali uretritning asosiy sabablaridan biri.
      Asosiy yuqish yo'li — to'g'ridan-to'g'ri tanosil-tanosil shilliq qavat aloqasi.
    </p>
    <h3>Diagnostika va davolash xususiyatlari</h3>
    <ul>
      <li>Hujayra devori yo'qligi sababli Gram bo'yog'i bilan bo'yab bo'lmaydi</li>
      <li>Ekinmada o'sish 6 oygacha davom etishi mumkin — amaliy emas</li>
      <li><strong>NAAT</strong> — yagona klinik foydali diagnostik usul (FDA tomonidan tasdiqlangan)</li>
      <li>Davolash: doksisiklin dastlab, keyin azitromitsin; <strong>makrolid rezistentligi</strong> keng tarqalgan (AQShda 44–90%) — rezistentlik-yo'naltirilgan davolash eng yuqori samaradorlik beradi</li>
      <li>Surunkali/qayta NGUda M. genitaliumga alohida tekshiruv o'tkazilishi kerak</li>
    </ul>

    <div class="callout callout--warning">
      <div class="callout__icon">⚠️</div>
      <div class="callout__body">
        <strong class="callout-title">Diqqat! M. genitalium rezistentligi</strong>
        <p>
          M. genitalium azitromitsinga nisbatan jiddiy rezistentlik hosil qildi — AQShda
          molekulyar rezistentlik markerlari 44–90 foiz holatda aniqlanmoqda. Shu sababli
          <strong>rezistentlikni aniqlash testidan keyin maqsadli davolash</strong> 90 foizdan
          yuqori davolash samaradorligini ta'minlaydi. Empirik azitromitsin endi yetarli emas.
        </p>
      </div>
    </div>
  </section>

  <!-- 6. QIYOSIY JADVAL -->
  <section class="section" id="farq">
    <h2><span class="num">6</span>GU va NGU qiyosiy jadvali</h2>
    <div class="table-wrap">
      <table class="data-table">
        <caption>2-jadval. Gonokokkli va nogonokokkli uretritning asosiy farqlari</caption>
        <thead>
          <tr><th>Xususiyat</th><th>Gonokokkli (GU)</th><th>Nogonokokkli (NGU)</th></tr>
        </thead>
        <tbody>
          <tr><td>Asosiy qo'zg'atuvchi</td><td><em>N. gonorrhoeae</em></td><td><em>C. trachomatis</em>, <em>M. genitalium</em> va boshqalar</td></tr>
          <tr><td>Uretrit holatlarida ulushi</td><td>5–20%</td><td>80–95%</td></tr>
          <tr><td>Ajralma xarakteri</td><td>Ko'pincha yiringli (yashil-sariq, ko'p)</td><td>Ko'pincha shilliq yoki kam miqdorli</td></tr>
          <tr><td>Gram bo'yog'i</td><td>Hujayra ichidagi grамm-manfiy diplokokklar — diagnostik</td><td>Diagnostik emas (hujayra ichidagi diplokokk yo'q)</td></tr>
          <tr><td>Asosiy diagnostik usul</td><td>NAAT (birinchi qism siydik)</td><td>NAAT (birinchi qism siydik)</td></tr>
          <tr><td>Birinchi qator davo</td><td>Seftriakson 500 mg IM, yagona doza</td><td>Doksisiklin 100 mg × 2/kun, 7 kun</td></tr>
          <tr><td>Hamroh davolash</td><td>Majburiy — so'nggi 60 kunlik hamrohlar</td><td>Majburiy — so'nggi 60 kunlik hamrohlar</td></tr>
          <tr><td>Kuzatuv</td><td>3 oy qayta tekshiruv; farengeal infeksiyada davoga erishtirish testi</td><td>3 oy qayta tekshiruv</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 7. DAVOLASH TAMOYILLARI -->
  <section class="section" id="davolash">
    <h2><span class="num">7</span>Davolash tamoyillari</h2>

    <h3>7.1. Umumiy tamoyillar</h3>
    <ul>
      <li>Iloji bo'lsa, qo'zg'atuvchiga asoslangan davolash (targeted therapy) afzal</li>
      <li>Qo'zg'atuvchi aniqlanmagan bo'lsa — empirik davolash boshlanadi</li>
      <li>Davolash tugaguncha va simptomlar yo'qolguncha jinsiy aloqadan tiyilish</li>
      <li>So'nggi 60 kun ichidagi barcha jinsiy hamrohlar baholash va davolash uchun yuborilishi shart</li>
      <li>Xlamidiya va gonorey mavjud bo'lganda HIV va sifilis uchun ham tekshirish</li>
    </ul>

    <div class="table-wrap">
      <table class="data-table">
        <caption>3-jadval. Uretrit davolashining xulosa jadvali (CDC 2021 asosida)</caption>
        <thead>
          <tr><th>Holat</th><th>Birinchi tanlash</th><th>Muqobil</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Gonokokkli uretrit (GU)</strong></td><td>Seftriakson 500 mg IM, yagona doza</td><td>Gentamitsin 240 mg IM + Azitromitsin 2 g og'iz; <em>yoki</em> Sefiksim 800 mg og'iz, yagona doza</td></tr>
          <tr><td><strong>Nogonokokkli uretrit (NGU) / Xlamidiya</strong></td><td>Doksisiklin 100 mg × 2/kun, 7 kun</td><td>Azitromitsin 1 g og'iz, yagona doza</td></tr>
          <tr><td><strong>M. genitalium (rezistentlik aniqlangan)</strong></td><td>Rezistentlik testiga asoslangan maqsadli davo</td><td>Moksifioksatsin yoki boshqa yo'riqnoma ko'rsatmalari</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--note">
      <div class="callout__icon">🩺</div>
      <div class="callout__body">
        <strong class="callout-title">Klinik eslatma — davoga erishtirish testi</strong>
        <p>
          Asoratlanmagan urogenital va rektal gonorey uchun <strong>davoga erishtirish testi
          (test of cure) rutina tavsiya etilmaydi</strong>. Ammo faringeal infeksiyada 7–14 kun
          o'tgach test of cure majburiy, chunki bu joydagi davolash muvaffaqiyati past.
          Gonorey aniqlangan barcha bemorlarda 3 oy o'tib qayta tekshiruv tavsiya etiladi.
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
        <li>Uretritning 80–95 foizi nogonokokkli (NGU); asosiy qo'zg'atuvchilar — C. trachomatis va M. genitalium.</li>
        <li>Diagnostik mezon: uretra ajralmasida ≥2 WBC/yog' immersion maydoni — bu 2021 CDC qo'llanmasidagi yangi past chegara.</li>
        <li>NAAT — ham gonorey, ham NGU diagnostikasining birinchi tanlash usuli; birinchi qism siydik afzal namuna.</li>
        <li>GU davolashi: seftriakson 500 mg IM yagona doza — ftorokinolonlar va penitsyllinlar endi tavsiya etilmaydi (rezistentlik).</li>
        <li>NGU davolashi: doksisiklin 100 mg × 2/kun, 7 kun — azitromitsinga nisbatan afzal (M. genitalium rezistentligi sababli).</li>
        <li>So'nggi 60 kunlik barcha jinsiy hamrohlarni baholash va davolash — har doim majburiy qadam.</li>
        <li>Xlamidiya yoki gonorey tasdiqlanganda HIV va sifilis uchun ham tekshiruv o'tkazilishi shart.</li>
        <li>Surunkali/qayta NGUda M. genitalium uchun alohida NAAT va rezistentlik testi zarur.</li>
      </ul>
    </div>
    <p class="source-note">
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr (2026), Bob 29 — Sexually Transmitted Diseases
      asosida tayyorlangan va faqat ta'lim maqsadlarida foydalanish uchun mo'ljallangan.
      Aniq klinik qarorlar uchun dolzarb CDC/EAU STI qo'llanmalariga murojaat qiling.
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
          <tr><td>Uretrit</td><td>Urethritis</td><td>Uretra epiteli qoplamining yallig'lanishi</td></tr>
          <tr><td>GU</td><td>Gonococcal Urethritis</td><td>Gonokokkli uretrit — N. gonorrhoeae tomonidan</td></tr>
          <tr><td>NGU</td><td>Nongonococcal Urethritis</td><td>Nogonokokkli uretrit — boshqa qo'zg'atuvchilar tomonidan</td></tr>
          <tr><td>NAAT</td><td>Nucleic Acid Amplification Test</td><td>Nukleik kislota amplifikatsiya testi — eng sezuvchan diagnostik usul</td></tr>
          <tr><td>STI</td><td>Sexually Transmitted Infection</td><td>Jinsiy yo'l bilan yuqadigan infeksiya (JYYI)</td></tr>
          <tr><td>PID</td><td>Pelvic Inflammatory Disease</td><td>Chanoq yallig'lanish kasalligi — ayollarda xlamidiya/gonorey asosiy asorati</td></tr>
          <tr><td>CDC</td><td>Centers for Disease Control and Prevention</td><td>AQSh Kasalliklarni Nazorat va Oldini Olish Markazlari — STI qo'llanmalari mualliflari</td></tr>
          <tr><td>HPF</td><td>High-Power Field</td><td>Mikroskopning yuqori quvvatli ko'rish maydoni</td></tr>
          <tr><td>IM</td><td>Intramuscular</td><td>Mushak ichiga — seftriakson yuborish yo'li</td></tr>
          <tr><td>WBC</td><td>White Blood Cell</td><td>Leykotsit (oq qon hujayrasi)</td></tr>
          <tr><td>HSV</td><td>Herpes Simplex Virus</td><td>Gerpes simplex virusi — NGUning viral sababi</td></tr>
          <tr><td>EAU</td><td>European Association of Urology</td><td>Yevropa Urologiya Assotsiatsiyasi</td></tr>
        </tbody>
      </table>
    </div>
  </section>

</article>
</main>
$uretrit_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
