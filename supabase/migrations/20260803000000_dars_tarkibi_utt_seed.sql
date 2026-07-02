-- 4-dars: UTT (ultratovush) — urologiyada asosiy tekshiruv usuli — nazariya HTML
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'utt-asosiy-tekshiruv',
  $utt_html$<div class="article-hero">
    <span class="article-hero__eyebrow">📘 4-mavzu · Tasvirlash usullari</span>
    <h1>UTT (ultratovush) — urologiyada asosiy tekshiruv usuli</h1>
    <p class="article-hero__lead">
      Ultratovush tekshiruvi (UTT, ultrasound) urologiyada shu qadar keng va chuqur qo'llaniladiki, u ba'zan
      <em>"urologning stetoskopi"</em> deb ataladi. Nurlanishsiz, arzon va real vaqtda natija beradigan bu usul
      buyrak, qovuq, prostata va moyaklarni baholashda birinchi qatorda turadi. Ushbu dars UTTning fizik
      asoslari, asosiy qo'llanish sohalari va klinik ahamiyatini <em>Campbell-Walsh-Wein Urology</em> darsligi
      asosida, talabalar uchun tushunarli tilda yoritadi.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~22 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr</span>
    </div>
  </div>

  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ol>
      <li><a href="#kirish">Kirish va qisqacha tarix</a></li>
      <li><a href="#fizika">Ultratovush fizikasi: asosiy tushunchalar</a></li>
      <li><a href="#rezolyutsiya">Rezolyutsiya va chastota</a></li>
      <li><a href="#rejimlar">Tekshiruv rejimlari (B-rejim, Doppler)</a></li>
      <li><a href="#buyrak">Buyrak ultratovushi</a></li>
      <li><a href="#qovuq">Qovuq va kichik chanoq ultratovushi</a></li>
      <li><a href="#moshok">Moshok (skrotum) ultratovushi</a></li>
      <li><a href="#prostata">Prostata ultratovushi (TRUS)</a></li>
      <li><a href="#xavfsizlik">Afzalliklari, cheklovlari va xavfsizlik</a></li>
      <li><a href="#xulosa">Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">Qisqartmalar va atamalar lug'ati</a></li>
    </ol>
  </nav>

  <section class="section" id="kirish">
    <h2><span class="num">1</span>Kirish va qisqacha tarix</h2>
    <p>
      <span class="en-term">Ultratovush tekshiruvi (ultrasonography, UTT)</span> — eshitish chegarasidan
      yuqori chastotali (3.5–20 MGts) tovush to'lqinlaridan foydalanib, to'qimalar tasvirini hosil qiluvchi
      tibbiy tasvirlash usuli. Urologiyada bu usul shunchalik keng tarqalganki, ko'pgina urologlar buyrak,
      qovuq va moshokni klinik qabul vaqtida o'zlari tekshiradi.
    </p>

    <h3>1.1. Qisqacha tarixiy ma'lumot</h3>
    <p>
      1963-yilda yapon urologlari Takahashi va Ouchi prostatani ultratovush yordamida birinchi marta
      tekshirishga urinishgan, ammo tasvir sifati past bo'lgan. 1974-yilda Vatanabe transrektal (to'g'ri ichak
      orqali) skanerlash usulini joriy qilib, prostata va qovuq patologiyasini aniqlashda muhim yutuqqa
      erishdi. Shundan beri biplane, yuqori chastotali datchiklar rivojlanishi natijasida transrektal
      ultratovush prostata kasalliklari diagnostikasining standart usuliga aylandi.
    </p>

    <div class="callout callout--guide">
      <strong class="callout-title">Klinik eslatma</strong>
      <p>
        Ultratovushning urologiya uchun noyob afzalligi shundaki, tekshiruvni o'tkazuvchi va natijani talqin
        qiluvchi shaxs — ko'pincha bir xil shifokor (urolog)ning o'zi bo'ladi. Bu urologning anatomik va
        klinik bilimini real vaqtdagi tasvir bilan birlashtirib, tezkor va aniq diagnostik qarorlar qabul
        qilish imkonini beradi.
      </p>
    </div>
  </section>

  <section class="section" id="fizika">
    <h2><span class="num">2</span>Ultratovush fizikasi: asosiy tushunchalar</h2>
    <p>
      Ultratovush datchigi (transducer/probe) ikki vazifani bajaradi: tovush to'lqinini yuboruvchi va
      qaytgan to'lqinni qabul qiluvchi. Datchik tovush to'lqinlarini qisqa impulslar shaklida to'qimaga
      yuboradi, to'lqinlar turli tuzilmalardan qisman qaytadi (aks etadi) va datchik tomonidan qayta qabul
      qilinib, elektr signaliga aylantiriladi — natijada monitorda kulrang shkala (gray-scale) tasviri hosil
      bo'ladi.
    </p>

    <h3>2.1. Akustik empedans va aks etish (reflection)</h3>
    <p>
      Tovush to'lqini ikki xil to'qima orasidagi chegara (interfeys)ga duch kelganda, qisman aks etadi.
      Aks etish miqdori ikki to'qimaning <span class="en-term">akustik empedansi (impedance)</span> — zichlik
      va qattiqlikka bog'liq xususiyat — farqiga bog'liq. Agar farq katta bo'lsa (masalan, to'qima va tosh
      orasida), kuchli aks etish va orqasida <em>akustik soya (acoustic shadow)</em> hosil bo'ladi. Agar
      farq kichik bo'lsa (masalan, buyrak va jigar orasida), chegarani aniqlash qiyinlashadi.
    </p>

    <h3>2.2. Exogenlik tushunchasi</h3>
    <p>
      To'qimalarning tasvirdagi yorqinligi <span class="en-term">exogenlik (echogenicity)</span> deb ataladi:
    </p>
    <ul>
      <li><strong>Giperexogen (hyperechoic)</strong> — yorqin ko'rinadigan to'qimalar: suyak, yog', fastsiya</li>
      <li><strong>Gipoexogen (hypoechoic)</strong> — qorong'iroq ko'rinadigan to'qimalar: mushak, ba'zi o'simtalar</li>
      <li><strong>Anexogen (anechoic)</strong> — to'liq qora, signal aks etmaydigan: suyuqlik (siydik, kista)</li>
    </ul>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      <p>
        Angiomiolipoma (yog' to'qimasidan boy o'sma) odatda giperexogen ko'rinishga ega, ammo ba'zi
        buyrak hujayrali saratonlari (renal cell carcinoma) ham giperexogen bo'lishi mumkin. Shu sababli
        faqat exogenlikka qarab to'liq ishonchli tashxis qo'yib bo'lmaydi — qo'shimcha tekshiruvlar
        (Doppler, KT) zarur bo'lishi mumkin.
      </p>
    </div>
  </section>

  <section class="section" id="rezolyutsiya">
    <h2><span class="num">3</span>Rezolyutsiya va chastota</h2>
    <p>
      <span class="en-term">Rezolyutsiya (resolution)</span> — tasvirda ikki yaqin joylashgan obyektni
      bir-biridan ajratib ko'rsatish qobiliyati. Bu ko'rsatkich datchik chastotasiga bevosita bog'liq:
      chastota qancha yuqori bo'lsa, rezolyutsiya shuncha yaxshi bo'ladi, lekin to'qimaga kirish chuqurligi
      kamayadi.
    </p>

    <div class="table-wrap">
      <table>
        <caption>1-jadval. Datchik chastotasi, kirish chuqurligi va rezolyutsiya o'rtasidagi bog'liqlik</caption>
        <thead>
          <tr><th>Chastota oralig'i</th><th>Kirish chuqurligi</th><th>Tipik qo'llanilishi</th></tr>
        </thead>
        <tbody>
          <tr><td>Past chastota (3.5–5 MGts)</td><td>Yuqori (chuqur tuzilmalarga yetib boradi)</td><td>Buyrak, qorin bo'shlig'i, qovuq (kattalarda)</td></tr>
          <tr><td>Yuqori chastota (7–18 MGts)</td><td>Past (sayoz tuzilmalar uchun)</td><td>Moshok, bolalar buyragi, sayoz tuzilmalar</td></tr>
          <tr><td>Juda yuqori chastota — mikroultratovush (~29 MGts)</td><td>Juda past, ammo eng yuqori detal</td><td>Prostata ichidagi kichik o'simtalarni aniqlash</td></tr>
        </tbody>
      </table>
    </div>

    <p>
      Shu sababli, har bir tekshiruvda optimal natija olish uchun <strong>rezolyutsiya va kirish chuqurligi
      o'rtasida muvozanat (trade-off)</strong> tanlanadi — chuqur joylashgan buyrakni past chastotali,
      sayoz joylashgan moshokni yuqori chastotali datchik bilan tekshirish maqsadga muvofiq.
    </p>
  </section>

  <section class="section" id="rejimlar">
    <h2><span class="num">4</span>Tekshiruv rejimlari (B-rejim, Doppler)</h2>

    <h3>4.1. Kulrang shkala B-rejimi (gray-scale B-mode)</h3>
    <p>
      Bu — eng ko'p qo'llaniladigan, real vaqtdagi ikki o'lchovli (2D) tasvirni kulrang tuslarda
      ko'rsatadigan asosiy rejim. Har bir piksel yorqinligi qaytgan tovush to'lqini amplitudasiga mos
      keladi.
    </p>

    <h3>4.2. Doppler rejimlari</h3>
    <p>
      <span class="en-term">Rangli Doppler (color Doppler)</span> — qon oqimi yo'nalishi va tezligini rang
      orqali ko'rsatadigan rejim. Bu buyrak, moshok, penis va prostatadagi qon ta'minotini baholashda,
      shuningdek siydik yo'lidan qovuqqa kiruvchi siydik oqimini ("ureteral jet") aniqlashda foydalidir.
    </p>
    <p>
      <span class="en-term">Quvvat Doppleri (power Doppler)</span> — qon oqimi yo'nalishini ko'rsatmasa-da,
      perfuziyaga ancha sezgir (rangli Dopplerga nisbatan 3–5 marta sezgirroq) bo'lib, moyak burama
      (torsiya) holatini va prostatadagi gipervaskulyar (qon tomirlari ko'p) joylarni aniqlashda
      qo'llaniladi.
    </p>
    <p>
      <span class="en-term">Rezistiv indeks (resistive index, RI)</span> — qon tomiridagi periferik
      qarshilikni ifodalovchi ko'rsatkich, quyidagi formula bilan hisoblanadi:
    </p>
    <p style="text-align:center; font-weight:600; padding:10px; border-radius:8px;">
      RI = (sistolik tezlik − diastolik tezlik) / sistolik tezlik
    </p>
    <p>
      Bu ko'rsatkich buyrak arteriyasi torayishi, siydik yo'li to'siqlanishi va penisning arterial
      yetishmovchiligini baholashda foydali.
    </p>

    <div class="callout callout--warning">
      <strong class="callout-title">Diqqat!</strong>
      <p>
        Moyak burama (testicular torsion)ning asosiy belgisi — moyak ichidagi qon oqimining yo'qligi. Biroq
        ultratovushning o'zi torsiyani <strong>"tasdiqlay" yoki "rad eta" olmaydi</strong> — bu faqat
        jarrohlik (yoki patomorfologik) tekshiruv orqali yakuniy aniqlanadi. Klinik shubha kuchli bo'lsa,
        ultratovush natijasi salbiy bo'lsa ham, shoshilinch jarrohlik konsultatsiyasi kechiktirilmasligi
        kerak.
      </p>
    </div>
  </section>

  <section class="section" id="buyrak">
    <h2><span class="num">5</span>Buyrak ultratovushi</h2>
    <p>
      Buyrak ultratovushi odatda 3.5–5.0 MGts chastotali egilgan (curvilinear) datchik bilan, bemor
      orqasidan yoki yon tomonidan (flank) o'tkaziladi. Bolalarda yuqori chastotali datchiklar qo'llaniladi.
    </p>

    <h3>5.1. Asosiy ko'rsatkichlar</h3>
    <ul>
      <li>Gidronefroz (buyrak jomi va kosachalarining kengayishi) borligini aniqlash</li>
      <li>Buyrak hajmi, parenximasi qalinligi va tuzilishini baholash</li>
      <li>Buyrak toshlari (akustik soya bilan) va kistalarni aniqlash</li>
      <li>Buyrakdagi hajmli tuzilmalar (o'simtalar)ni dastlabki baholash</li>
    </ul>

    <h3>5.2. Gidronefrozni baholash (bolalarda UTD/SFU tasnifi)</h3>
    <p>
      Bolalar urologiyasida tug'ma yoki erta paydo bo'lgan siydik yo'li kengayishini baholash uchun
      <span class="en-term">siydik yo'li kengayishi tasnifi (Urinary Tract Dilation, UTD)</span> tizimi
      qo'llaniladi — bu tizim buyrak jomi old-orqa o'lchami (APD), kosachalar kengayishi, parenxima
      qalinligi, siydik yo'li va qovuq holatini baholab, bemorni past, o'rta va yuqori xavf guruhlariga
      ajratadi.
    </p>

    <div class="table-wrap">
      <table>
        <caption>2-jadval. Bolalarda postnatal siydik yo'li kengayishi (UTD) xavf darajalari</caption>
        <thead>
          <tr><th>Daraja</th><th>Asosiy mezon</th><th>Tavsiya</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>P1 (past xavf)</strong></td><td>APD &lt;10 mm, kosachalar kengaymagan</td><td>Ko'p hollarda o'z-o'zidan tuzaladi, faol kuzatuv</td></tr>
          <tr><td><strong>P2 (o'rta xavf)</strong></td><td>APD ≥10 mm, periferik kosacha kengayishi</td><td>Qo'shimcha tekshiruv (VCUG) zarurligi individual baholanadi</td></tr>
          <tr><td><strong>P3 (yuqori xavf)</strong></td><td>APD ≥15 mm, parenxima yupqalashishi, siydik yo'li/qovuq anomaliyasi</td><td>To'liq tekshiruv va, zarur bo'lsa, jarrohlik rejasi</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="section" id="qovuq">
    <h2><span class="num">6</span>Qovuq va kichik chanoq ultratovushi</h2>
    <p>
      Qorin old devori orqali (transabdominal) qovuq ultratovushi qovuqni to'liq holatda eng yaxshi
      ko'rsatadi. Bu usul ayollarda qovuqni, erkaklarda esa qovuq ostidagi prostatani ham qisman baholash
      imkonini beradi.
    </p>

    <h3>6.1. Asosiy qo'llanilish sohalari</h3>
    <div class="table-wrap">
      <table>
        <caption>3-jadval. Qovuq ultratovushining asosiy klinik ko'rsatkichlari</caption>
        <thead>
          <tr><th>Ko'rsatkich</th><th>Izoh</th></tr>
        </thead>
        <tbody>
          <tr><td>Qoldiq siydik hajmini (PVR) o'lchash</td><td>Siydik chiqarish buzilishini baholashda asosiy, tezkor usul</td></tr>
          <tr><td>Qovuq devori qalinligi va shakli</td><td>Qovuq bo'yni to'siqlanishi (masalan, BPH) bilvosita belgisi — qalinlashgan, traberkulali devor</td></tr>
          <tr><td>Qovuq toshlari va o'simtalarini aniqlash</td><td>Akustik soya bilan tosh, devorga yopishgan massa — o'simta shubhasi</td></tr>
          <tr><td>Siydik yo'li teshigidan siydik oqimi ("ureteral jet")</td><td>Siydik yo'li to'siqlanishi yo'qligini bilvosita tasdiqlash</td></tr>
          <tr><td>Kateter holatini tasdiqlash</td><td>Kateter to'g'ri joylashganini tekshirish va suprapubik kateter qo'yishga yo'naltirish</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--guide">
      <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
      <p>
        Qoldiq siydik hajmini avtomatlashtirilgan qovuq skaneri (bladder scanner) yordamida o'lchash
        tasvirlash tekshiruvi emas, balki hajmni hisoblovchi yordamchi vositadir — u to'liq diagnostik
        ultratovush tekshiruvi o'rnini bosa olmaydi.
      </p>
    </div>
  </section>

  <section class="section" id="moshok">
    <h2><span class="num">7</span>Moshok (skrotum) ultratovushi</h2>
    <p>
      Moshok yuza joylashgani uchun yuqori chastotali (7–18 MGts) datchik bilan ajoyib aniqlikda
      tekshiriladi. Bu — urologiyada ultratovush eng samarali qo'llaniladigan soha hisoblanadi, chunki
      jismoniy tekshiruv natijalarini tasvir bilan to'g'ridan-to'g'ri solishtirish mumkin.
    </p>

    <h3>7.1. Texnika va asosiy ko'rsatkichlar</h3>
    <p>
      Bemor chalqancha yotgan holatda, moshok sochiq yoki son ustida tutib turiladi. Datchikka teri bilan
      yaxshi aloqa uchun mo'l miqdorda gel qo'llaniladi (havo moshok sochlari orasida sun'iy artefakt hosil
      qilishi mumkin). Ortiqcha bosim moyak shaklini va exogenligini o'zgartirishi mumkinligi uchun
      yengil, ammo to'liq kontakt saqlanishi muhim.
    </p>
    <ul>
      <li><strong>Moyak burama (testicular torsion)</strong> — shoshilinch holat; Doppler tekshiruvida qon oqimi yo'qligi xarakterli</li>
      <li><strong>Epididimit / orxit</strong> — yallig'lanish natijasida kuchaygan qon oqimi (hiperemiya)</li>
      <li><strong>Moyak o'simtalari</strong> — gipoexogen yoki notekis tuzilma sifatida ko'rinadi</li>
      <li><strong>Gidrotsele, varikotsele, spermatotsele</strong> — suyuqlik yig'ilishi yoki tomir kengayishi</li>
    </ul>
  </section>

  <section class="section" id="prostata">
    <h2><span class="num">8</span>Prostata ultratovushi (TRUS)</h2>
    <p>
      <span class="en-term">Transrektal ultratovush (transrectal ultrasound, TRUS)</span> — prostatani to'g'ri
      ichak orqali yuqori aniqlikda tekshirish usuli. Bu usul prostata hajmini hisoblash, tuzilishini
      baholash va biopsiya (to'qima namunasi olish)ni aniq nishonga yo'naltirishda qo'llaniladi.
    </p>
    <p>
      Prostata hajmi quyidagi formula bilan hisoblanadi:
    </p>
    <p style="text-align:center; font-weight:600; padding:10px; border-radius:8px;">
      Prostata hajmi (ml) = kengligi (sm) × balandligi (sm) × uzunligi (sm) × 0.523
    </p>

    <h3>8.1. Mikroultratovush — yangi avlod texnologiyasi</h3>
    <p>
      Oddiy ultratovush 3.5–12 MGts chastotada ishlasa, <span class="en-term">mikroultratovush
      (micro-ultrasound)</span> taxminan 29 MGts chastotadan foydalanib, ancha yuqori detal bilan, ammo
      kamroq chuqurlikka kirib boradigan tasvir beradi. Bu texnologiya prostata ichidagi kichik
      o'simtalarni aniqlashda an'anaviy MRI bilan taqqoslanadigan natija ko'rsatib, ammo ancha arzonroq
      hisoblanadi.
    </p>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      <p>
        TRUS o'tkazishdan oldin ba'zida ichakni tozalash talab etilishi mumkin. Bemorning tana tuzilishi
        (masalan, semizlik) prostata asosi, urug' pufakchalari va qovuqni aniq tasvirlashni qiyinlashtirishi
        mumkin — bu usulning bir cheklovi hisoblanadi.
      </p>
    </div>
  </section>

  <section class="section" id="xavfsizlik">
    <h2><span class="num">9</span>Afzalliklari, cheklovlari va xavfsizlik</h2>

    <div class="table-wrap">
      <table>
        <caption>4-jadval. Ultratovushning asosiy afzalliklari va cheklovlari</caption>
        <thead>
          <tr><th>Afzalliklari</th><th>Cheklovlari</th></tr>
        </thead>
        <tbody>
          <tr><td>Ionlashtiruvchi nurlanish yo'q — bolalar va homilador ayollarda xavfsiz</td><td>Operator (tekshiruvchi)ning malakasiga juda bog'liq</td></tr>
          <tr><td>Arzon va keng tarqalgan</td><td>Suyak va havo (gaz) orqali tasvir sifati pasayadi</td></tr>
          <tr><td>Real vaqtda natija — kasalxonada ham, klinikada ham qo'llanish mumkin</td><td>Semizlik yoki gaz to'planishi tasvirni qiyinlashtiradi</td></tr>
          <tr><td>Funksional ma'lumot (qon oqimi, harakat) berish imkoniyati</td><td>Chuqur joylashgan tuzilmalar uchun rezolyutsiya pastroq</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--warning">
      <strong class="callout-title">Diqqat! Xavfsizlik haqida tushunchalar</strong>
      <p>
        <strong>Mexanik indeks (mechanical index)</strong> va <strong>termal indeks (thermal index)</strong>
        — bular qat'iy "xavfsizlik chegaralari" emas, balki nisbiy xavf ko'rsatkichlaridir.
        <span class="en-term">ALARA tamoyili (As Low As Reasonably Achievable)</span> — bemorga berilgan
        umumiy energiyani imkon qadar kamaytirish tamoyili. Ultratovush xavfsizligida eng muhim omil —
        <strong>bilimli, malakali operator</strong> hisoblanadi.
      </p>
    </div>
  </section>

  <section class="section" id="xulosa">
    <h2><span class="num">10</span>Xulosa va asosiy fikrlar</h2>
    <div class="callout callout--note">
      <strong class="callout-title">Asosiy xulosalar</strong>
      <ul>
        <li>Ultratovush — urologiyada nurlanishsiz, real vaqtda natija beruvchi, klinik amaliyotning ajralmas qismi hisoblangan tasvirlash usuli.</li>
        <li>Datchik chastotasi va rezolyutsiya/chuqurlik o'rtasidagi muvozanat har bir tekshiruv uchun to'g'ri tanlanishi kerak: chuqur a'zolar uchun past, sayoz a'zolar uchun yuqori chastota.</li>
        <li>Rangli va quvvat Doppler rejimlari qon oqimini baholash, moyak burama va buyrak arteriyasi torayishini aniqlashda muhim ahamiyatga ega.</li>
        <li>Buyrak, qovuq, moshok va prostata — har biri o'ziga xos texnika va chastota talab qiladi.</li>
        <li>Bolalarda gidronefrozni baholashda standartlashtirilgan UTD/SFU tasniflari qo'llaniladi.</li>
        <li>Ultratovush ba'zi holatlarni (masalan, moyak torsiyasini) "tasdiqlay" yoki "rad eta" olmaydi — klinik fikrlash hamisha birinchi o'rinda turishi kerak.</li>
        <li>Eng muhim xavfsizlik omili — bilimli, malakali operator, ALARA tamoyiliga rioya qilish.</li>
      </ul>
    </div>
    <p>
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr asosida tayyorlangan va faqat ta'lim
      maqsadlarida foydalanish uchun mo'ljallangan.
    </p>
  </section>

  <section class="section" id="lugat">
    <h2><span class="num">11</span>Qisqartmalar va atamalar lug'ati</h2>
    <p>Mavzuda ishlatilgan barcha qisqartma va murakkab atamalarning to'liq izohi quyidagi jadvalda keltirilgan:</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Qisqartma / Atama</th><th>Inglizcha to'liq nomi</th><th>O'zbekcha izohi</th></tr>
        </thead>
        <tbody>
          <tr><td>UTT</td><td>Ultrasound / Ultrasonography</td><td>Ultratovush tekshiruvi</td></tr>
          <tr><td>MGts (MHz)</td><td>Megahertz</td><td>Tovush to'lqini chastotasi o'lchov birligi</td></tr>
          <tr><td>TRUS</td><td>Transrectal Ultrasound</td><td>Transrektal (to'g'ri ichak orqali) ultratovush — prostatani tekshirish usuli</td></tr>
          <tr><td>PVR</td><td>Postvoid Residual (volume)</td><td>Siydik chiqargandan keyin qovuqda qolgan siydik hajmi</td></tr>
          <tr><td>RI</td><td>Resistive Index</td><td>Rezistiv indeks — qon tomiridagi periferik qarshilikni ifodalovchi Doppler ko'rsatkichi</td></tr>
          <tr><td>UTD</td><td>Urinary Tract Dilation</td><td>Siydik yo'li kengayishi tasnifi (bolalar urologiyasida)</td></tr>
          <tr><td>SFU</td><td>Society for Fetal Urology (grading)</td><td>Fetal Urologiya Jamiyati tomonidan ishlab chiqilgan gidronefroz tasnifi</td></tr>
          <tr><td>APD</td><td>Anteroposterior Diameter</td><td>Buyrak jomining old-orqa o'lchami</td></tr>
          <tr><td>BPH</td><td>Benign Prostatic Hyperplasia</td><td>Prostata bezining xavfsiz kattalashishi</td></tr>
          <tr><td>ALARA</td><td>As Low As Reasonably Achievable</td><td>"Imkon qadar past" tamoyili — nurlanish/energiya ta'sirini minimallashtirish qoidasi</td></tr>
          <tr><td>2D</td><td>Two-Dimensional</td><td>Ikki o'lchovli tasvir</td></tr>
          <tr><td>VCUG</td><td>Voiding Cystourethrogram</td><td>Siydik chiqarish jarayonida qovuq-uretrani kontrastli rentgen bilan tekshirish</td></tr>
        </tbody>
      </table>
    </div>
  </section>$utt_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
