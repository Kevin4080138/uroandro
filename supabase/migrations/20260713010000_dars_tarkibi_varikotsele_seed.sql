-- Varikotsele (HARD) darsining nazariya tarkibini bazaga ko'chirish — avval darslar.ts
-- ichida saqlangan edi (varikosele_2.html dan o'zgartirilmasdan olingan), endi shu yerda.
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'h-varikotsele-kasalligi',
  $varikosele_html$<div class="article-hero">
    <span class="article-hero__eyebrow">🩺 Andrologiya · Erkak infertilligi</span>
    <h1>Varikosele (Varicocele)</h1>
    <p>Urug' tizimchasi (spermatic cord) ichidagi pampiniform pleksusning (pampiniform plexus) patologik kengayishi va varikoz transformatsiyasi — erkak infertilligining eng ko'p uchraydigan va jarrohlik yo'li bilan tuzatiladigan sababi.</p>
    <div class="article-hero__meta">
      <span>📚 Campbell-Walsh-Wein Urology, 13-nashr, 2-jild</span>
      <span>📖 66 va 70-boblar</span>
      <span>🎓 Talabalar va rezidentlar uchun</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Mavzu ichidagi navigatsiya">
    <p class="toc__title">📑 Mavzu xaritasi</p>
    <ol>
      <li><a href="#tarif">Ta'rif va tasniflash</a></li>
      <li><a href="#epidemiologiya">Epidemiologiya va etiologiya</a></li>
      <li><a href="#patofiziologiya">Patofiziologiya</a></li>
      <li><a href="#klinik">Klinik belgilar</a></li>
      <li><a href="#diagnostika">Diagnostika</a></li>
      <li><a href="#davolash">Davolash</a></li>
      <li><a href="#asoratlar">Asoratlar va prognoz</a></li>
      <li><a href="#lugat">Qisqartmalar va atamalar lug'ati</a></li>
    </ol>
  </nav>

  <!-- ============ 1. TA'RIF VA TASNIFLASH ============ -->
  <section id="tarif" class="section">
    <h2><span class="num">1</span>Ta'rif va tasniflash</h2>

    <h3>Ta'rif</h3>
    <p>
      <strong>Varikosele</strong> — urug' tizimchasi (<span class="en-term">spermatic cord</span>) ichidagi
      pampiniform venoz pleksusning (<span class="en-term">pampiniform plexus</span>) patologik kengayishi,
      cho'zilishi va varikoz transformatsiyasidir. Bu holat venalar klapanlarining
      yetishmovchiligi (<span class="en-term">valvular incompetence</span>) natijasida vena qonining orqaga
      qaytishi — venoz reflyuks (<span class="en-term">venous reflux</span>) tufayli yuzaga keladi.
    </p>
    <p>
      Varikosele — erkaklarda jarrohlik yo'li bilan tuzatiladigan, reproduktiv salohiyatga ta'sir
      qiluvchi eng ko'p uchraydigan patologik holat hisoblanadi. Biroq, varikoseleli har bir erkak
      infertil bo'lavermaydi — bu andrologiyaning hozirgacha to'liq yechilmagan muammolaridan biridir.
    </p>

    <h3>Klinik tasniflash (gradatsiya)</h3>
    <p>
      Tarixan varikoselening og'irlik darajasini baholashda bir nechta tasniflash tizimlari
      qo'llanilgan, biroq hozirgi kunda eng ko'p qabul qilingan klinik tasniflash quyidagicha
      (Dubin va Amelar, 1970-yil tasnifi asosida):
    </p>

    <div class="table-wrap">
      <table>
        <caption>1-jadval. Varikoselening klinik gradatsiyasi</caption>
        <thead>
          <tr>
            <th>Daraja</th>
            <th>Klinik nomi</th>
            <th>Aniqlash usuli</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Subklinik</strong></td>
            <td>Palpatsiya qilinmaydi, ko'rinmaydi</td>
            <td>Faqat instrumental tekshiruvda (Doppler UTT) aniqlanadi</td>
          </tr>
          <tr>
            <td><strong>I daraja</strong></td>
            <td>Yengil (mild)</td>
            <td>Faqat bemor tik turgan holatda <strong>Valsalva sinamasi</strong> vaqtida palpatsiya qilinadi</td>
          </tr>
          <tr>
            <td><strong>II daraja</strong></td>
            <td>O'rtacha (moderate)</td>
            <td>Valsalva sinamasisiz ham palpatsiya qilinadi, lekin ko'zga ko'rinmaydi</td>
          </tr>
          <tr>
            <td><strong>III daraja</strong></td>
            <td>Og'ir (severe)</td>
            <td>Moshonka terisi (rugae) orqali ko'zga ko'rinadi va osongina palpatsiya qilinadi</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      Ko'pchilik tadqiqotlar shuni ko'rsatadiki, <strong>subklinik varikoselelarni davolash</strong>
      erkak reproduktiv salohiyatini sezilarli darajada yaxshilamaydi — shuning uchun bu guruh
      odatda jarrohlik aralashuvisiz kuzatiladi.
    </div>

    <h3>Lokalizatsiya bo'yicha tasniflash</h3>
    <ul>
      <li><strong>Chap tomonlama (90%)</strong> — eng ko'p uchraydigan shakl, anatomik sabablarga bog'liq.</li>
      <li><strong>Ikki tomonlama</strong> — diagnostik usulga qarab 80%gacha bo'lgan hollarda aniqlanishi mumkin (kontakt termografiya, Doppler, venografiya).</li>
      <li><strong>O'ng tomonlama izolyatsiyalangan</strong> — juda kam uchraydi; agar aniqlansa, ayniqsa keskin boshlangan bo'lsa, <strong>retroperitoneal patologiya (masalan, buyrak o'smasi)</strong>ni inkor etish zarur.</li>
    </ul>
  </section>

  <!-- ============ 2. EPIDEMIOLOGIYA VA ETIOLOGIYA ============ -->
  <section id="epidemiologiya" class="section">
    <h2><span class="num">2</span>Epidemiologiya va etiologiya</h2>

    <h3>Tarqalishi</h3>
    <div class="table-wrap">
      <table>
        <caption>2-jadval. Varikoselening tarqalishi turli populyatsiyalarda</caption>
        <thead>
          <tr><th>Populyatsiya</th><th>Tarqalish chastotasi</th></tr>
        </thead>
        <tbody>
          <tr><td>Umumiy erkaklar populyatsiyasi</td><td>~15% (taxminan har 5–6 erkakdan 1 tasi)</td></tr>
          <tr><td>Birinchi darajali (primar) infertillik bilan murojaat qiluvchilar</td><td>~35%</td></tr>
          <tr><td>Ikkinchi darajali (sekundar) infertillik bilan murojaat qiluvchilar</td><td>75–81%</td></tr>
          <tr><td>Infertil erkaklar (umumiy)</td><td>~1/3 – 1/2 (33–50%)</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Etiologiya va anatomik asos</h3>
    <p>
      Varikoselening rivojlanishi asosan venoz klapanlar yetishmovchiligi natijasida yuzaga
      keladi, lekin chap tomonning ustunligi quyidagi anatomik xususiyatlar bilan izohlanadi:
    </p>
    <ul>
      <li>
        <strong>Chap urug' venasi</strong> (<span class="en-term">left internal spermatic vein</span>)
        chap buyrak venasiga (<span class="en-term">left renal vein</span>) to'g'ri burchak ostida,
        o'ng tomondagidan 8–10 sm yuqorida quyiladi — bu uzunroq gidrostatik ustun bosimini yaratadi.
      </li>
      <li>
        <strong>O'ng urug' venasi</strong> esa pastki kovak venaga (<span class="en-term">inferior vena cava</span>)
        qiya burchak ostida quyiladi, bu "tabiiy klapan" effektini yaratadi va reflyuksdan himoya qiladi.
      </li>
      <li>
        <strong>Genetik moyillik</strong> — varikoseleli erkaklarning birinchi darajali qarindoshlarida
        bu holat ko'proq uchraydi, bu venoz klapan defektiga genetik moyillik borligini ko'rsatadi.
      </li>
    </ul>

    <div class="callout callout--warning">
      <strong class="callout-title">Diqqat!</strong>
      Izolyatsiyalangan <strong>o'ng tomonlama varikosele</strong>, ayniqsa keskin boshlangan bo'lsa,
      retroperitoneal massa (masalan, buyrak hujayrali karsinoma) tomonidan venoz drenajning
      bosilishi natijasida yuzaga kelishi mumkin — bu holatda qo'shimcha tasvirlash tekshiruvlari
      (UTT, KT) shart.
    </div>
  </section>

  <!-- ============ 3. PATOFIZIOLOGIYA ============ -->
  <section id="patofiziologiya" class="section">
    <h2><span class="num">3</span>Patofiziologiya</h2>

    <p>
      Varikoselening urug' bezi (testis) funksiyasiga zararli ta'sir mexanizmlari to'liq
      aniqlanmagan bo'lsa-da, bir nechta asosiy patofiziologik yo'llar taklif qilingan:
    </p>

    <h3>1. Intratestikulyar haroratning oshishi (asosiy mexanizm)</h3>
    <p>
      Normada pampiniform pleksus urug' bezi arteriyasi atrofida <strong>qarama-qarshi oqim
      issiqlik almashinuvi</strong> (<span class="en-term">countercurrent heat exchange</span>)
      mexanizmini ta'minlaydi, bu esa moshonka haroratini tana haroratidan 2–4°C past saqlashga
      yordam beradi (spermatogenez uchun zarur). Varikoselede bu mexanizm buziladi va
      intratestikulyar harorat ko'tariladi, bu spermatogenezni bevosita buzadi.
    </p>

    <h3>2. Venoz turg'unlik va gipoksiya</h3>
    <p>
      Qonning turg'un holda to'planishi (<span class="en-term">venous stasis</span>) urug' bezida
      gipoksiya va toksik metabolitlarning to'planishiga olib keladi.
    </p>

    <h3>3. Oksidativ stress va DNK fragmentatsiyasi</h3>
    <p>
      Varikoseleli bemorlarning urug'ida <strong>oksidativ stress</strong> darajasi yuqori bo'ladi,
      bu spermatozoidlar DNKsining fragmentatsiyasini kuchaytiradi va apoptozga moyilligini oshiradi.
    </p>

    <h3>4. Boshqa mexanizmlar</h3>
    <ul>
      <li>Spermatozoidlarda aneuploidiyaga moyillik;</li>
      <li>Hujayra ichi metabolik va ion almashinuvining buzilishi;</li>
      <li>Apoptozga aloqador mikroRNK darajasining oshishi (seminal suyuqlikda).</li>
    </ul>

    <h3>Klinik oqibat</h3>
    <p>
      Bu mexanizmlar natijasida urug' bezi to'qimasida <strong>progressiv, davomiylikka bog'liq
      zararlanish</strong> (<span class="en-term">progressive, duration-dependent injury</span>) yuzaga
      keladi: urug' bezi hajmi kichrayishi (atrofiya), spermatogenez bosqichma-bosqich pasayishi va
      Leydig hujayralari funksiyasining buzilishi (androgen yetishmovchiligi) kuzatiladi. Yirikroq
      varikoseleler odatda kichikroqlariga nisbatan ko'proq zararlanishga olib keladi.
    </p>
  </section>

  <!-- ============ 4. KLINIK BELGILAR ============ -->
  <section id="klinik" class="section">
    <h2><span class="num">4</span>Klinik belgilar (klinik manzara)</h2>

    <p>
      Varikoselening klinik kechishi keng diapazonda bo'lib, ko'pchilik bemorlarda u
      <strong>asimptomatik</strong> kechadi va tasodifan tibbiy ko'rikda yoki infertillik bo'yicha
      tekshirish jarayonida aniqlanadi.
    </p>

    <h3>Asosiy shikoyatlar va topilmalar</h3>
    <ul>
      <li><strong>Bezovtalanish yo'q (asimptomatik)</strong> — eng ko'p uchraydigan variant.</li>
      <li><strong>Moshonkada og'riq yoki noqulaylik</strong> — tortuvchi, og'riluvchi xususiyatga ega, uzoq tik turish yoki jismoniy zo'riqishdan keyin kuchayadi, yotgan holatda kamayadi.</li>
      <li><strong>Moshonkada "tuguncha" yoki shishish</strong> — og'ir darajalarda ko'zga ko'rinadigan venalar to'plami ("qurt to'plami" — <span class="en-term">"bag of worms"</span> ko'rinishi).</li>
      <li><strong>Infertillik</strong> — erkaklar reproduktologiya bo'limiga murojaat qilishning eng ko'p sababi.</li>
      <li><strong>Urug' bezi hajmining kichrayishi</strong> — uzoq muddatli varikoseleda, ayniqsa o'smirlik davrida boshlangan bo'lsa, ipsilateral testis atrofiyasi kuzatilishi mumkin.</li>
    </ul>

    <h3>Fizik tekshiruv</h3>
    <p>
      Bemor <strong>tik turgan holatda</strong>, issiq xonada tekshiriladi (sovuqda kremaster
      mushagi qisqarib, varikoseleni yashirib qo'yishi mumkin):
    </p>
    <ul>
      <li>Urug' tizimchasi yuzasi ko'zdan kuzatiladi — kengaygan, varikoz venalar ko'rinishi mumkin;</li>
      <li>Palpatsiya qo'l bilan, avval tinch holatda, keyin <strong>Valsalva sinamasi</strong> (zo'riqib nafas tutish) bilan o'tkaziladi;</li>
      <li>Ikkala moshonka taqqoslanadi, urug' bezi hajmi orkidometr yordamida baholanadi.</li>
    </ul>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      Varikoseleni klinik jihatdan to'g'ri aniqlash uchun bemorni albatta <strong>tik turgan
      holatda va Valsalva sinamasi</strong> bilan tekshirish zarur — yotgan holatda kichik
      varikoseleler osongina o'tkazib yuborilishi mumkin.
    </div>
  </section>

  <!-- ============ 5. DIAGNOSTIKA ============ -->
  <section id="diagnostika" class="section">
    <h2><span class="num">5</span>Diagnostika</h2>

    <h3>5.1. Klinik diagnostika (asosiy usul)</h3>
    <p>
      Varikoselening diagnostikasi birinchi navbatda <strong>klinik diagnoz</strong> hisoblanadi —
      ya'ni fizik tekshiruv (ko'rish va palpatsiya) asosiy diagnostik usul bo'lib qoladi.
    </p>

    <h3>5.2. Instrumental diagnostika</h3>
    <h4>Moshonka Doppler ultratovush tekshiruvi (Scrotal Doppler US)</h4>
    <p>
      Yuqori chastotali datchiklar (7.5–10 MHz) yordamida o'tkaziladi. Quyidagi holatlarda
      ko'rsatma hisoblanadi:
    </p>
    <ul>
      <li>Klinik tekshiruv noaniq bo'lganda (masalan, urug' tizimchasi lipomasi yoki yog' to'qimasi infiltratsiyasi tufayli);</li>
      <li>Jarrohlik amaliyotidan keyin <strong>qoldiq yoki qaytalangan varikoseleni</strong> baholash uchun;</li>
      <li>Bemor tik turgan holatda, Valsalva sinamasi bilan venoz reflyuksni aniqlash uchun o'tkaziladi.</li>
    </ul>

    <div class="callout callout--guide">
      <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
      Varikoselening ultratovushda aniqlanishi uchun vena diametri bo'yicha yagona, universal
      qabul qilingan chegara qiymati mavjud emas — bu masala adabiyotlarda hali munozarali.
      Shu sababli, varikosele tashxisi birinchi navbatda <strong>klinik (palpatsiya orqali)</strong>
      qo'yiladi, ultratovush esa noaniq holatlar uchun yordamchi vosita sifatida ishlatiladi.
    </div>

    <h4>Boshqa tasvirlash usullari</h4>
    <ul>
      <li><strong>Kompyuter tomografiya (KT)</strong> — odatda birinchi tanlov usuli emas, lekin chov sohasi va urug' tizimchasi patologiyasini baholashda foydali bo'lishi mumkin.</li>
      <li><strong>Magnit-rezonans tomografiya (MRT)</strong> — noaniq UTT topilmalarida ikkinchi qatorli tasvirlash usuli sifatida qo'llaniladi.</li>
      <li><strong>Venografiya</strong> — asosan radiologik embolizatsiyadan oldin yoki davomida diagnostik/davolash maqsadida qo'llaniladi.</li>
    </ul>

    <h3>5.3. Laborator tekshiruvlar (infertillik nuqtai nazaridan)</h3>
    <p>Varikoseleli erkak infertillik bilan murojaat qilganda standart tekshiruv kompleksiga quyidagilar kiradi:</p>
    <ul>
      <li><strong>Spermogramma (semen analizi)</strong> — konsentratsiya, harakatchanlik, morfologiya baholanadi;</li>
      <li><strong>Endokrin tekshiruv</strong> — serum testosteron darajasi (odatda 280–300 ng/dL dan past bo'lsa androgen yetishmovchiligi haqida gap boradi);</li>
      <li><strong>Genomik tekshiruv</strong> — kerak bo'lganda (masalan, og'ir oligo-/azoospermiyada).</li>
    </ul>

    <h3>5.4. Differensial diagnostika</h3>
    <div class="table-wrap">
      <table>
        <caption>3-jadval. Moshonka tuguncha-shishlarining differensial diagnostikasi</caption>
        <thead><tr><th>Holat</th><th>Asosiy farqlovchi belgi</th></tr></thead>
        <tbody>
          <tr><td><strong>Gidrosele</strong></td><td>Transilluminatsiya pozitiv, suyuqlik to'planishi, venalar tugunchasi yo'q</td></tr>
          <tr><td><strong>Spermatosele</strong></td><td>Epididim ustida joylashgan, alohida kista, Valsalvaga bog'liq emas</td></tr>
          <tr><td><strong>Chov churrasi (ingvinal gerniya)</strong></td><td>Chov kanali bo'ylab joylashgan, ko'pincha qo'l bilan joyiga qaytariladigan (reduktabel)</td></tr>
          <tr><td><strong>Urug' tizimchasi lipomasi</strong></td><td>Zich, Valsalvada o'lchami o'zgarmaydi</td></tr>
          <tr><td><strong>Buyrak o'smasi (ayniqsa o'ng tomonlama varikoseleda)</strong></td><td>Keskin boshlanish, yoshi katta bemor, qorin/bel sohasida qo'shimcha topilmalar</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- ============ 6. DAVOLASH ============ -->
  <section id="davolash" class="section">
    <h2><span class="num">6</span>Davolash</h2>

    <h3>6.1. Kuzatuv (konservativ yondashuv)</h3>
    <p>
      Quyidagi holatlarda faol jarrohlik aralashuvisiz <strong>dinamik kuzatuv</strong> tavsiya etiladi:
    </p>
    <ul>
      <li>Subklinik varikosele (faqat instrumental usulda aniqlangan);</li>
      <li>Asimptomatik bemor, normal spermogramma ko'rsatkichlari, hozircha bola tug'dirish rejasi yo'q;</li>
      <li>O'smirlarda — agar urug' bezi hajmi va o'sishi normal bo'lsa, muntazam kuzatuv (har 6–12 oyda orkidometriya/UTT) maqsadga muvofiq.</li>
    </ul>

    <h3>6.2. Medikamentoz davolash</h3>
    <p>
      Varikoselening o'zini bartaraf etish uchun samarali dori vositasi mavjud emas — bu
      <strong>faqat anatomik/jarrohlik muammosi</strong> hisoblanadi. Medikamentoz davolash yordamchi
      ahamiyatga ega bo'lishi mumkin:
    </p>
    <ul>
      <li>Og'riq sindromini yengillashtirish uchun NSPVD (og'riqsizlantiruvchi, yallig'lanishga qarshi vositalar);</li>
      <li>Operatsiyadan keyin androgen yetishmovchiligi mavjud bemorlarda — testosteron darajasini kuzatish va zarur bo'lsa endokrinolog bilan birgalikda davolash.</li>
    </ul>

    <h3>6.3. Jarrohlik davolash — varikoselektomiya</h3>
    <p>
      <strong>Varikoselektomiya</strong> (<span class="en-term">varicocelectomy</span>) — erkak
      infertilligi uchun eng ko'p bajariladigan jarrohlik amaliyoti. Maqsad — patologik vena
      reflyuksini bartaraf etish, urug' bezi arteriyasini, limfa tomirlarini va vas deferensni
      saqlab qolgan holda.
    </p>

    <h4>Ko'rsatmalar (jarrohlik uchun)</h4>
    <ol class="steps">
      <li><strong>Klinik (palpatsiya bilan aniqlanadigan) varikosele</strong> + patologik spermogramma ko'rsatkichlari + er-xotinning bola ko'rishga intilishi.</li>
      <li><strong>Moshonkada og'riq yoki noqulaylik</strong> — konservativ chora-tadbirlarga javob bermaydigan.</li>
      <li><strong>O'smirlarda</strong> — progressiv urug' bezi hajmi kichrayishi yoki ikkala tomon o'rtasida sezilarli farq (asimmetriya) mavjud bo'lganda.</li>
      <li><strong>Androgen yetishmovchiligi</strong> (yosh bog'liq past testosteron) bilan birga keladigan klinik varikosele — tanlangan holatlarda.</li>
    </ol>

    <div class="callout callout--warning">
      <strong class="callout-title">Diqqat!</strong>
      Faqat <strong>ultratovushda aniqlangan, palpatsiya qilinmaydigan (subklinik) varikosele</strong>
      uchun varikoselektomiya tavsiya etilmaydi — chunki bunday holatlarda semen ko'rsatkichlari
      yoki homiladorlik chastotasiga ishonchli ijobiy ta'sir isbotlanmagan.
    </div>

    <h4>Jarrohlik usullari (yondashuvlar)</h4>
    <div class="table-wrap">
      <table>
        <caption>4-jadval. Varikoselektomiya usullarining qiyosiy tahlili</caption>
        <thead>
          <tr>
            <th>Usul</th>
            <th>Arteriya saqlanadi?</th>
            <th>Gidrosele xavfi</th>
            <th>Qaytalanish xavfi</th>
            <th>Jiddiy asorat xavfi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Retroperitoneal (Palomo usuli)</strong></td>
            <td>Yo'q</td>
            <td>~7%</td>
            <td>15–25%</td>
            <td>Yo'q</td>
          </tr>
          <tr>
            <td><strong>Konvensional ingvinal (klassik chov)</strong></td>
            <td>Yo'q</td>
            <td>3–30%</td>
            <td>5–15%</td>
            <td>Yo'q</td>
          </tr>
          <tr>
            <td><strong>Laparoskopik</strong></td>
            <td>Ha</td>
            <td>~12%</td>
            <td>3–15%</td>
            <td>Bor (ichak/tomir shikastlanishi, havo emboliyasi)</td>
          </tr>
          <tr>
            <td><strong>Radiologik (embolizatsiya)</strong></td>
            <td>Ha</td>
            <td>0%</td>
            <td>15–25%</td>
            <td>Bor (qon tomir punksiyasi bilan bog'liq)</td>
          </tr>
          <tr>
            <td><strong>Mikroxirurgik ingvinal/subingvinal</strong></td>
            <td><strong>Ha</strong></td>
            <td><strong>0%</strong></td>
            <td><strong>0.5–1.0%</strong></td>
            <td>Yo'q</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h4>Davolashning bosqichma-bosqich yondashuvi (klinik algoritm)</h4>
    <ol class="steps">
      <li><strong>1-bosqich — Tashxis va baholash.</strong> Klinik tekshiruv (Valsalva bilan), zarur bo'lsa Doppler UTT, spermogramma, endokrin profil.</li>
      <li><strong>2-bosqich — Davolash zarurligini aniqlash.</strong> Subklinik yoki asimptomatik, normal fertillik — kuzatuv. Klinik varikosele + patologik spermogramma/og'riq/androgen yetishmovchiligi — jarrohlikka yo'naltirish.</li>
      <li><strong>3-bosqich — Usulni tanlash.</strong> Hozirgi oltin standart — <strong>mikroxirurgik subingvinal/ingvinal varikoselektomiya</strong> (eng past qaytalanish va gidrosele ko'rsatkichlari tufayli).</li>
      <li><strong>4-bosqich — Operatsiya.</strong> Mikroskop yoki katta kattalashtiruvchi linzalar (loupe) yordamida urug' bezi arteriyasi, limfa tomirlari va vas deferens saqlanadi; barcha kengaygan ichki urug' venalari bog'lanadi.</li>
      <li><strong>5-bosqich — Operatsiyadan keyingi davr.</strong> Og'riqsizlantirish (asosan parasetamol/ibuprofen), moshonka tayanchi, sovuq qo'yish; jinsiy aloqa — 1 hafta, yengil jismoniy yuklama — 2 hafta, to'liq faollik — 4 hafta ichida tiklanadi.</li>
      <li><strong>6-bosqich — Kuzatuv.</strong> 3–6 oydan keyin spermogramma nazorati; qaytalanishni aniqlash uchun klinik tekshiruv va kerak bo'lsa Doppler UTT.</li>
    </ol>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      <strong>Mikroxirurgik subingvinal varikoselektomiya</strong> hozirgi kunda eng ustun usul
      hisoblanadi, chunki u urug' bezi arteriyasi va limfa tomirlarini eng yaxshi tarzda
      vizualizatsiya qilish va saqlash imkonini beradi — bu gidrosele va qaytalanish
      ko'rsatkichlarini minimal darajaga tushiradi.
    </div>
  </section>

  <!-- ============ 7. ASORATLAR VA PROGNOZ ============ -->
  <section id="asoratlar" class="section">
    <h2><span class="num">7</span>Asoratlar va prognoz</h2>

    <h3>Jarrohlikdan keyingi asoratlar</h3>
    <div class="table-wrap">
      <table>
        <caption>5-jadval. Varikoselektomiyaning asosiy asoratlari</caption>
        <thead><tr><th>Asorat</th><th>Sabab / mexanizm</th><th>Chastotasi</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>Gidrosele</strong></td>
            <td>Limfa tomirlarining bog'lanishi (limfostaz)</td>
            <td>Mikroxirurgik usulda 0%, klassik usullarda 3–30% (o'rtacha ~7%)</td>
          </tr>
          <tr>
            <td><strong>Urug' bezi arteriyasi shikastlanishi</strong></td>
            <td>1.0–1.5 mm diametrli ingichka arteriyani aniqlashning qiyinligi</td>
            <td>Mikroskopsiz usullarda yuqori, mikroxirurgiyada minimal</td>
          </tr>
          <tr>
            <td><strong>Urug' bezi atrofiyasi / spermatogenez buzilishi</strong></td>
            <td>Arteriya shikastlanishi/bog'lanishi natijasi</td>
            <td>Arteriya bog'langanda 20–100% (hayvon modellarida)</td>
          </tr>
          <tr>
            <td><strong>Qaytalanish (retsidiv)</strong></td>
            <td>Periarterial mayda venalar, kollaterallar saqlanib qolishi</td>
            <td>Usulga bog'liq: 0.5% (mikroxirurgiya) dan 25% gacha (radiologik/retroperitoneal)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>Prognoz</h3>
    <ul>
      <li>Varikoselektomiyadan keyin ko'pchilik bemorlarda <strong>spermogramma ko'rsatkichlari yaxshilanadi</strong> va homiladorlik/tirik tug'ilish chastotasi oshadi.</li>
      <li><strong>Operatsiya yoshi qanchalik erta bo'lsa</strong>, shunchalik yaxshi natija va spermatogenez tiklanishi ehtimoli yuqori bo'ladi.</li>
      <li>Past testosteron darajasi bilan murojaat qilgan bemorlarda mikroxirurgik varikoselektomiya <strong>serum testosteron darajasini sezilarli darajada oshirishi</strong> mumkin (Leydig hujayralari funksiyasining yaxshilanishi hisobiga).</li>
      <li>Yirik varikoseleler kichiklariga nisbatan ko'proq boshlang'ich zararlanishga ega bo'lsa-da, jarrohlikdan keyingi umumiy homiladorlik chastotasi varikosele kattaligidan qat'i nazar taqqoslanadigan darajada bo'ladi.</li>
    </ul>

    <div class="callout callout--guide">
      <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
      Varikoselening homiladorlik, abort va tug'ilish ko'rsatkichlariga aniq ta'sirini baholash
      ayol omillarining (partner fertilligi) ta'siri tufayli murakkablashadi. Shu sababli,
      varikoselektomiyani rejalashtirishda er-xotin juftligini kompleks baholash va qaror
      qabul qilishda individual yondashuv tavsiya etiladi.
    </div>
  </section>

  <!-- ============ 8. LUG'AT ============ -->
  <section id="lugat" class="section">
    <h2><span class="num">8</span>Qisqartmalar va atamalar lug'ati</h2>
    <div class="table-wrap">
      <table>
        <caption>6-jadval. Mavzuda ishlatilgan qisqartmalar va atamalar</caption>
        <thead>
          <tr>
            <th>Qisqartma / Atama</th>
            <th>Inglizcha to'liq nomi</th>
            <th>O'zbekcha izohi</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Varikosele</strong></td><td>Varicocele</td><td>Urug' tizimchasidagi pampiniform venoz pleksusning patologik kengayishi va varikoz transformatsiyasi</td></tr>
          <tr><td><strong>Pampiniform pleksus</strong></td><td>Pampiniform plexus</td><td>Urug' bezidan qon oqib chiqadigan venalar to'plami (chigal ko'rinishidagi venoz tuzilma)</td></tr>
          <tr><td><strong>Spermatik kord</strong></td><td>Spermatic cord</td><td>Urug' bezi arteriyasi, venalari, limfa tomirlari, nervlar va vas deferensni o'z ichiga olgan tizimcha</td></tr>
          <tr><td><strong>Vas deferens</strong></td><td>Vas deferens (ductus deferens)</td><td>Spermani epididimdan urug' otish kanaliga olib boruvchi naysimon tuzilma</td></tr>
          <tr><td><strong>Valsalva sinamasi</strong></td><td>Valsalva maneuver</td><td>Yopiq havo yo'lida zo'riqib nafas tutish — qorin ichi bosimini oshirib venoz reflyuksni aniqlashtiradi</td></tr>
          <tr><td><strong>Venoz reflyuks</strong></td><td>Venous reflux</td><td>Venoz klapanlar yetishmovchiligi tufayli qonning normaldan teskari yo'nalishda oqishi</td></tr>
          <tr><td><strong>UTT (UZI)</strong></td><td>Ultrasound (US) / Doppler ultrasonography</td><td>Ultratovush tomografiyasi — to'qima va qon oqimini tasvirlash usuli</td></tr>
          <tr><td><strong>KT</strong></td><td>Computed Tomography (CT)</td><td>Kompyuter tomografiyasi</td></tr>
          <tr><td><strong>MRT</strong></td><td>Magnetic Resonance Imaging (MRI)</td><td>Magnit-rezonans tomografiyasi</td></tr>
          <tr><td><strong>Orkidometriya</strong></td><td>Orchidometry</td><td>Urug' bezi (testis) hajmini o'lchash usuli (masalan, Prader orkidometri yordamida)</td></tr>
          <tr><td><strong>Gidrosele</strong></td><td>Hydrocele</td><td>Tunika vaginalis bo'shlig'ida suyuqlik to'planishi</td></tr>
          <tr><td><strong>Spermatosele</strong></td><td>Spermatocele</td><td>Epididim sohasida joylashgan, urug' suyuqligi bilan to'lgan kista</td></tr>
          <tr><td><strong>Leydig hujayralari</strong></td><td>Leydig cells</td><td>Urug' bezida testosteron ishlab chiqaruvchi endokrin hujayralar</td></tr>
          <tr><td><strong>Spermatogenez</strong></td><td>Spermatogenesis</td><td>Urug' bezida spermatozoidlarning hosil bo'lish jarayoni</td></tr>
          <tr><td><strong>Oligospermiya</strong></td><td>Oligospermia (oligozoospermia)</td><td>Ejakulyatda spermatozoidlar sonining normadan past bo'lishi</td></tr>
          <tr><td><strong>Azoospermiya</strong></td><td>Azoospermia</td><td>Ejakulyatda spermatozoidlarning umuman aniqlanmasligi</td></tr>
          <tr><td><strong>Varikoselektomiya</strong></td><td>Varicocelectomy</td><td>Varikoseleni bartaraf etish maqsadida kengaygan venalarni bog'lash/kesib olib tashlash jarrohlik amaliyoti</td></tr>
          <tr><td><strong>Mikroxirurgiya</strong></td><td>Microsurgery</td><td>Operatsion mikroskop yordamida bajariladigan, mayda anatomik tuzilmalarni aniq ajratish imkonini beruvchi jarrohlik usuli</td></tr>
          <tr><td><strong>Embolizatsiya</strong></td><td>Embolization</td><td>Qon tomirini radiologik nazorat ostida maxsus moddalar (spiral, kley) yordamida berkitish usuli</td></tr>
          <tr><td><strong>Laparoskopiya</strong></td><td>Laparoscopy</td><td>Qorin bo'shlig'iga kichik kesimlar orqali kamera va instrumentlar kiritib bajariladigan minimal invaziv jarrohlik usuli</td></tr>
          <tr><td><strong>Retroperitoneal yondashuv (Palomo usuli)</strong></td><td>Retroperitoneal approach (Palomo technique)</td><td>Ichki chov teshigi darajasida, qorin parda ortida urug' venasi va arteriyasiga kirish usuli</td></tr>
          <tr><td><strong>NSPVD</strong></td><td>NSAIDs (Non-Steroidal Anti-Inflammatory Drugs)</td><td>Nosteroid yallig'lanishga qarshi vositalar</td></tr>
          <tr><td><strong>ASRM</strong></td><td>American Society for Reproductive Medicine</td><td>Amerika Reproduktiv Tibbiyot Jamiyati — andrologiya/reproduktologiya bo'yicha amaliy tavsiyalar ishlab chiquvchi tashkilot</td></tr>
        </tbody>
      </table>
    </div>

    <p style="text-align:center; margin-top: 18px;">
      <a class="back-to-top" href="#tarif">⬆ Mavzu boshiga qaytish</a>
    </p>
  </section>$varikosele_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html = EXCLUDED.nazariya_html,
  updated_at = now();
