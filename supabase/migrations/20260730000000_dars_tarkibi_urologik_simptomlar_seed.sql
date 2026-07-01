-- "Asosiy urologik simptomlar" darsining nazariya tarkibi — mualliflik HTML
-- (urologik_simptomlar_dars.html) Urosfera nazariya formatiga (maqola-html) moslashtirilib joylandi.
INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'urologik-simptomlar',
  $urologik_simptomlar_html$<div class="article-hero">
    <span class="article-hero__eyebrow">📘 2-mavzu · Klinik simptomlar</span>
    <h1>Asosiy urologik simptomlar: dizuriya, gematuriya, og'riq, siydik ushlanishi</h1>
    <p>
      Urologik bemorlarning aksariyati shifokorga to'rtta asosiy shikoyat bilan murojaat qiladi: og'riqli siydik
      chiqarish, siydikda qon, og'riq va siydikni chiqara olmaslik. Bu darsda har bir simptomning mexanizmi,
      ehtimoliy sabablari va diagnostik yondashuvi <em>Campbell-Walsh-Wein Urology</em> darsligi asosida,
      talabalar uchun tushunarli tilda yoritiladi.
    </p>
    <div class="article-hero__meta">
      <span class="pill">⏱ O'qish vaqti: ~20 daqiqa</span>
      <span class="pill">🎓 Daraja: Boshlang'ich</span>
      <span class="pill">📚 Manba: Campbell-Walsh-Wein Urology, 13-nashr</span>
    </div>
  </div>

  <!-- TOC -->
  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ol>
      <li><a href="#kirish">1. Kirish: simptomdan tashxisga</a></li>
      <li><a href="#dizuriya">2. Dizuriya (og'riqli siydik chiqarish)</a></li>
      <li><a href="#gematuriya">3. Gematuriya (siydikda qon)</a></li>
      <li><a href="#ogriq">4. Urologik og'riq</a></li>
      <li><a href="#ushlanish">5. Siydik ushlanishi (retentsiya)</a></li>
      <li><a href="#qiyosiy">6. Qiyosiy jadval va klinik fikrlash</a></li>
      <li><a href="#xulosa">7. Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">8. Qisqartmalar va atamalar lug'ati</a></li>
    </ol>
  </nav>

  <!-- 1. KIRISH -->
  <section id="kirish" class="section">
    <h2><span class="num">1</span>Kirish: simptomdan tashxisga</h2>
    <p>
      Urologiyada to'g'ri tashxis qo'yishning birinchi qadami — bemor shikoyatini aniq tasniflashdir. Ko'pincha
      bitta belgi (masalan, og'riq) bir qancha turli kasalliklarda uchraydi, shu sababli shifokor
      <strong>asosiy shikoyat</strong> (<span class="en-term">chief complaint</span>) va
      <strong>kasallik anamnezi</strong> (<span class="en-term">history of present illness, HPI</span>) orqali alomatning
      joylashuvi, xarakteri, boshlanish vaqti va kuchayish/pasayish omillarini aniqlashi shart.
    </p>
    <p>
      Ushbu darsda to'rtta eng tez-tez uchraydigan urologik simptom — <strong>dizuriya</strong>,
      <strong>gematuriya</strong>, <strong>og'riq</strong> va <strong>siydik ushlanishi</strong> —
      alohida-alohida ko'rib chiqiladi. Har birining ortida turtuvchi fiziologik mexanizm va eng ehtimoliy
      sabablar tahlil qilinadi.
    </p>
    <div class="callout callout--guide">
      <strong class="callout-title">Klinik eslatma</strong>
      Og'riq va sezilgan og'riqlilik (tenderness) — bu ikki xil narsa. Og'riq bemorning o'zi his qiladigan
      subyektiv tuyg'u, sezilgan og'riqlilik esa shifokor palpatsiya vaqtida aniqlaydigan ob'ektiv belgi.
      Ba'zida ular bir-biriga to'g'ri kelmaydi — masalan, moyak og'rig'i bo'lib, moyak palpatsiyasida
      og'riqlilik bo'lmasligi mumkin (bu holda og'riq aks etgan, ya'ni boshqa a'zodan — masalan, siydik
      yo'lidagi toshdan kelayotgan bo'lishi mumkin).
    </div>
  </section>

  <!-- 2. DIZURIYA -->
  <section id="dizuriya" class="section">
    <h2><span class="num">2</span>Dizuriya (og'riqli siydik chiqarish)</h2>
    <p>
      <strong>Dizuriya</strong> (<span class="en-term">dysuria</span>) — siydik chiqarish vaqtida achishish yoki og'riq sezilishi.
      Bu alomat odatda qovuq yoki siydik chiqarish kanali shilliq qavatining yallig'lanishi natijasida paydo
      bo'ladi va og'riq ko'pincha uretra bo'ylab yoki uretra teshigida (meatus) seziladi.
    </p>

    <h3>2.1. Dizuriyaning asosiy sabablari</h3>
    <ul>
      <li><strong>Sistit</strong> (<span class="en-term">cystitis</span>) — qovuqning yallig'lanishi, ayollarda ko'proq uchraydi, ko'pincha siydik tezligi (frequency) bilan birga keladi</li>
      <li><strong>Uretrit</strong> (<span class="en-term">urethritis</span>) — jinsiy yo'l bilan yuqadigan infeksiyalar (gonoreya, xlamidiya, gerpes) natijasida, ko'pincha uretral ajralma bilan kechadi</li>
      <li><strong>Vaginit</strong> (<span class="en-term">vaginitis</span>) — ayollarda dizuriyaga o'xshash, lekin aslida qin sohasidan keladigan og'riq</li>
      <li><strong>Uretraning kimyoviy yoki mexanik jarohati</strong> — jinsiy aloqa, kimyoviy ta'sirlovchi moddalar</li>
      <li><strong>Yashirin saraton</strong> — ayniqsa katta yoshdagi, chekuvchi bemorlarda qovuq saratoni (<span class="en-term">carcinoma in situ</span>) dizuriya bilan namoyon bo'lishi mumkin</li>
    </ul>

    <div class="table-wrap">
      <table>
        <caption>1-jadval. Dizuriya sabablarini farqlash uchun yo'naltiruvchi belgilar</caption>
        <thead>
          <tr><th>Holat</th><th>Qo'shimcha xarakterli belgilar</th></tr>
        </thead>
        <tbody>
          <tr><td>Sistit</td><td>Siydik tezligi, shoshilishi, suprapubik og'riq, ayollarda ko'proq</td></tr>
          <tr><td>Uretrit (JYI tufayli)</td><td>Uretral ajralma, yangi/bir nechta jinsiy hamroh tarixi, subakut boshlanish</td></tr>
          <tr><td>Vaginit</td><td>Qindan ajralma yoki hid, frequency/gematuriya yo'q</td></tr>
          <tr><td>Pielonefrit</td><td>Isitma, bel-qovurg'a burchagi og'rig'i (<span class="en-term">CVAT</span>), umumiy holsizlik</td></tr>
          <tr><td>Yashirin qovuq saratoni</td><td>50 yoshdan katta, chekish tarixi, davom etuvchi irritativ simptomlar</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--warning">
      <strong class="callout-title">Diqqat!</strong>
      Faqat siydik tahlili tasmasi (dipstick) natijasiga asoslanib dizuriya sababini aniqlash mumkin emas.
      Klinik belgilarga mos kelmagan holatlarda siydik mikroskopiyasi va, zarur bo'lsa, siydik ekinmasi
      (<span class="en-term">urine culture</span>) bilan tasdiqlash kerak.
    </div>
  </section>

  <!-- 3. GEMATURIYA -->
  <section id="gematuriya" class="section">
    <h2><span class="num">3</span>Gematuriya (siydikda qon)</h2>
    <p>
      <strong>Gematuriya</strong> (<span class="en-term">hematuria</span>) — siydikda eritrotsitlar (qizil qon tana) borligi.
      Bu alomat kattalar urologiyasida juda muhim hisoblanadi, chunki u urologik saraton, jumladan qovuq
      saratonining birinchi va ba'zan yagona belgisi bo'lishi mumkin.
    </p>

    <h3>3.1. Gematuriya turlari</h3>
    <ul>
      <li><strong>Ko'zga ko'rinadigan gematuriya</strong> (<span class="en-term">gross/visible hematuria</span>) — siydik rangi qizil yoki "choy rangi"da bo'ladi, bemorning o'ziga ko'rinadi va ko'pincha qo'rqinch uyg'otadi</li>
      <li><strong>Mikroskopik gematuriya</strong> (<span class="en-term">microscopic hematuria, MH</span>) — siydik tashqi ko'rinishi normal, faqat mikroskop tekshiruvida (yuqori quvvatli maydonda 3 tadan ortiq eritrotsit) aniqlanadi</li>
    </ul>
    <p>
      Gematuriyani siydik oqimining qaysi qismida ko'rinishi bo'yicha ham farqlash mumkin: boshlang'ich
      qismda (<span class="en-term">initial</span>) — uretra/prostata manbai haqida, oxirgi qismda (<span class="en-term">terminal</span>) — qovuq bo'yni manbai
      haqida, butun oqim davomida (<span class="en-term">total</span>) — yuqori siydik yo'llari yoki qovuq manbai haqida ma'lumot beradi.
    </p>

    <h3>3.2. Xavf darajasiga asoslangan baholash</h3>
    <p>
      Amerika Urologlar Assotsiatsiyasi (<span class="en-term">AUA</span>) qo'llanmasiga ko'ra, mikroskopik gematuriyali bemorlar
      yosh, jins, chekish tarixi va gematuriya darajasiga qarab past, o'rta va yuqori xavf guruhlariga
      bo'linadi — bu tekshiruv intensivligini saraton aniqlash xavfiga moslashtirish imkonini beradi.
    </p>

    <div class="table-wrap">
      <table>
        <caption>2-jadval. Mikroskopik gematuriyani xavf darajasiga ko'ra baholash (AUA tasnifi asosida)</caption>
        <thead>
          <tr><th>Xavf darajasi</th><th>Mezonlar</th><th>Tavsiya etilgan tekshiruv</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Past xavf</strong></td><td>Ayollar &lt;50, erkaklar &lt;40 yosh; chekmaydigan yoki &lt;10 paket-yil; 3–10 eritrotsit/maydon</td><td>6 oy ichida qayta tahlil YOKI sistoskopiya + UTT</td></tr>
          <tr><td><strong>O'rta xavf</strong></td><td>Ayollar 50–59, erkaklar 40–59 yosh; 10–30 paket-yil; 11–25 eritrotsit/maydon</td><td>Sistoskopiya + buyrak ultratovush tekshiruvi (UTT)</td></tr>
          <tr><td><strong>Yuqori xavf</strong></td><td>60 yosh va undan katta; &gt;30 paket-yil; &gt;25 eritrotsit/maydon; ko'zga ko'rinadigan gematuriya tarixi</td><td>Sistoskopiya + kompyuter tomografiya urografiyasi (<span class="en-term">CTU</span>)</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--note">
      <strong class="callout-title">Klinik eslatma</strong>
      Gematuriya bilan murojaat qilgan, og'riqsiz bemorlarda doimo to'liq urologik tekshiruv (yuqori va
      quyi siydik yo'llari) o'tkazilishi kerak — og'riqsiz makro- yoki mikrogematuriya urologik
      malignite (yomon sifatli o'simta)ni istisno qilish uchun jiddiy signal hisoblanadi.
    </div>
  </section>

  <!-- 4. OG'RIQ -->
  <section id="ogriq" class="section">
    <h2><span class="num">4</span>Urologik og'riq</h2>
    <p>
      Urologik og'riq, asosan, ikki mexanizm orqali yuzaga keladi: <strong>to'siqli (obstruktiv) og'riq</strong> —
      bo'shliqli a'zoning (masalan, siydik yo'li yoki buyrak jomi) to'lib-toshib cho'zilishi natijasida, va
      <strong>parenximatoz og'riq</strong> — a'zo to'qimasining yallig'lanishi, infeksiyasi yoki qon
      ketishi (qon to'planishi) natijasida paydo bo'ladi.
    </p>
    <p>
      Bu ikki turdagi og'riqning klinik ko'rinishi farqlanadi: to'siqli og'riq <em>kolikasimon</em> (<span class="en-term">intermittent</span>)
      bo'lib, bemor tinch turolmay, qulay holat izlab harakat qiladi. Parenximatoz og'riq esa
      <em>doimiy</em> (<span class="en-term">constant</span>) bo'lib, bemor harakatdan qochib, harakatsiz yotishga harakat qiladi
      (masalan, pielonefritda).
    </p>

    <h3>4.1. Og'riq joylashuvi bo'yicha tasnif</h3>
    <div class="table-wrap">
      <table>
        <caption>3-jadval. Urologik og'riqning joylashuvi va xarakteristikasi</caption>
        <thead>
          <tr><th>Og'riq turi</th><th>Tipik joylashuvi</th><th>Xarakteri va aks etishi</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Buyrak og'rig'i</strong> (<span class="en-term">renal pain</span>)</td><td>Bel-qovurg'a burchagi (12-qovurg'adan past, umurtqa yon tomonida)</td><td>To'siqda — kolikasimon; yallig'lanishda (pielonefrit) — doimiy, CVAT bilan birga</td></tr>
          <tr><td><strong>Siydik yo'li og'rig'i</strong> (<span class="en-term">ureteral pain</span>)</td><td>Qorin pasti qismi, tomir bo'ylab</td><td>O'tkir boshlanish, moyak/labiyaga aks etishi mumkin (umumiy nerv ta'minoti tufayli)</td></tr>
          <tr><td><strong>Qovuq og'rig'i</strong> (<span class="en-term">vesical pain</span>)</td><td>Suprapubik soha</td><td>Qovuq to'lganda kuchayadi, bo'shagandan keyin yengillashadi; siydik chiqarish oxirida kuchli og'riq — <em>stranguriya</em></td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--guide">
      <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
      Buyrak va siydik yo'li og'rig'ini bog'liq asab tugunlari (T11–L1) orqali tushunish foydali: shu
      sababli siydik yo'li to'siqlanishi ko'pincha bir tomonlama moyak (erkaklarda) yoki labiya
      (ayollarda) og'rig'i bilan namoyon bo'ladi, garchi bu a'zolarning o'zida hech qanday patologiya
      bo'lmasa ham.
    </div>

    <h3>4.2. Og'riq darajasini baholash</h3>
    <p>
      Og'riq intensivligi yengil, o'rta va kuchli darajalarga, yoki 1 dan 10 gacha bo'lgan shkala bo'yicha
      baholanadi. Bu baholash davolashdan oldin va keyingi natijani solishtirish uchun zarur.
    </p>
  </section>

  <!-- 5. SIYDIK USHLANISHI -->
  <section id="ushlanish" class="section">
    <h2><span class="num">5</span>Siydik ushlanishi (retentsiya)</h2>
    <p>
      <strong>Siydik ushlanishi</strong> (<span class="en-term">urinary retention</span>) — qovuqda siydik to'planganiga
      qaramay, uni to'liq yoki qisman chiqarib bo'lmasligi. Bu holat ikki shaklda namoyon bo'ladi:
    </p>
    <ul>
      <li>
        <strong>O'tkir siydik ushlanishi</strong> (<span class="en-term">acute urinary retention, AUR</span>) — to'satdan, og'riqli
        siydik chiqara olmaslik; bu shoshilinch tibbiy yordam talab qiladigan holat hisoblanadi
      </li>
      <li>
        <strong>Surunkali siydik ushlanishi</strong> (<span class="en-term">chronic urinary retention</span>) — asta-sekin rivojlanadigan,
        ko'pincha og'riqsiz, qovuqda doimiy ravishda yuqori qoldiq siydik hajmi (postvoid residual, PVR) bilan
        kechadigan holat
      </li>
    </ul>

    <h3>5.1. Asosiy sabablar</h3>
    <div class="table-wrap">
      <table>
        <caption>4-jadval. Siydik ushlanishining asosiy sabablari</caption>
        <thead>
          <tr><th>Sabab toifasi</th><th>Misollar</th></tr>
        </thead>
        <tbody>
          <tr><td>Mexanik to'siq</td><td>Prostata kattalashishi (<span class="en-term">BPH</span>), uretra torayishi (<span class="en-term">stricture</span>), qovuq bo'yni skleroz, og'ir fimoz</td></tr>
          <tr><td>Infeksiya / yallig'lanish</td><td>O'tkir prostatit, og'ir sistit, jinsiy a'zo yallig'lanishi (balanopostit)</td></tr>
          <tr><td>Nevrologik sabab</td><td>Orqa miya jarohati, ko'p tarqalgan skleroz, qanddiqand diabetga bog'liq neyropatiya</td></tr>
          <tr><td>Dori-darmon ta'siri</td><td>Antikolinergik va simpatomimetik vositalar, opioidlar</td></tr>
          <tr><td>Operatsiya/instrumentatsiyadan keyin</td><td>Jarrohlik amaliyoti, kateterizatsiya yoki anesteziyadan keyingi vaqtinchalik holat</td></tr>
          <tr><td>Funksional sabablar</td><td>Tos tubi mushaklari disfunksiyasi, qabziyat (ayniqsa bolalarda)</td></tr>
        </tbody>
      </table>
    </div>

    <div class="callout callout--warning">
      <strong class="callout-title">Diqqat! O'tkir siydik ushlanishi — shoshilinch holat</strong>
      O'tkir siydik ushlanishi aniqlangan bemorda kechiktirmasdan qovuqni bo'shatish (kateterizatsiya)
      amalga oshirilishi kerak. Agar uretral kateterizatsiya imkonsiz bo'lsa (masalan, uretra jarohati
      shubhasi mavjud bo'lsa), <strong>suprapubik kateter</strong> (<span class="en-term">suprapubic tube</span>) qo'yilishi
      kerak — qorin old devori orqali to'g'ridan-to'g'ri qovuqqa kiritiladigan naycha.
    </div>

    <h3>5.2. Qoldiq siydik hajmi (PVR) haqida</h3>
    <p>
      <strong>Qoldiq siydik hajmi</strong> (<span class="en-term">postvoid residual, PVR</span>) — siydik chiqargandan keyin
      qovuqda qolgan siydik miqdori, ultratovush yoki kateterizatsiya yordamida o'lchanadi. Aniq bir PVR
      qiymati "o'tkir ushlanish" deb belgilanmaydi — shifokor PVR tendensiyasini va boshqa omillarni
      (bemor noqulayligi, qovuq toshlari, gematuriya, infeksiya, buyrak shikastlanishi) birgalikda baholaydi.
    </p>
  </section>

  <!-- 6. QIYOSIY JADVAL -->
  <section id="qiyosiy" class="section">
    <h2><span class="num">6</span>Qiyosiy jadval va klinik fikrlash</h2>
    <p>
      Quyidagi jadval to'rtta simptomni bir-biriga solishtirib, ularning asosiy mexanizmi va dastlabki
      diagnostik qadamini umumlashtiradi — bu klinik fikrlashni tezlashtirishga yordam beradi.
    </p>
    <div class="table-wrap">
      <table>
        <caption>5-jadval. To'rt asosiy urologik simptomning qiyosiy xulosasi</caption>
        <thead>
          <tr><th>Simptom</th><th>Asosiy mexanizm</th><th>Birinchi diagnostik qadam</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Dizuriya</strong></td><td>Shilliq qavat yallig'lanishi/ta'sirlanishi</td><td>Siydik tahlili (<span class="en-term">urinalysis</span>) ± ekinma</td></tr>
          <tr><td><strong>Gematuriya</strong></td><td>Siydik yo'li shilliq qavati yoki to'qimasidan qon ketishi</td><td>Xavf darajasini aniqlash, so'ng sistoskopiya/UTT yoki CTU</td></tr>
          <tr><td><strong>Og'riq</strong></td><td>To'siq (cho'zilish) yoki yallig'lanish (parenxima)</td><td>Og'riq joylashuvi va xarakterini aniqlash + ultratovush/CT</td></tr>
          <tr><td><strong>Siydik ushlanishi</strong></td><td>Mexanik to'siq, nevrologik yoki funksional buzilish</td><td>Qovuq ultratovushi (PVR) + zudlik bilan bo'shatish (agar o'tkir bo'lsa)</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 7. XULOSA -->
  <section id="xulosa" class="section">
    <h2><span class="num">7</span>Xulosa va asosiy fikrlar</h2>
    <div class="callout callout--note">
      <strong class="callout-title">⭐ Asosiy xulosalar</strong>
      <ul>
        <li>Dizuriya ko'pincha qovuq yoki uretra yallig'lanishi natijasida paydo bo'ladi, biroq katta yoshdagi va chekuvchi bemorlarda yashirin saraton belgisi bo'lishi mumkin.</li>
        <li>Gematuriya — ko'zga ko'rinadigan va mikroskopik turlarga bo'linadi; baholash bemorning yosh, jins, chekish tarixi va gematuriya darajasiga asoslangan xavf-tasnif tizimi orqali amalga oshiriladi.</li>
        <li>Urologik og'riq to'siqli (kolikasimon, harakat bilan kuchaymaydigan) va parenximatoz (doimiy, harakatdan saqlanish bilan) turlarga bo'linadi.</li>
        <li>Siydik yo'li og'rig'i bir xil nerv ta'minoti tufayli moyak yoki labiyaga aks etishi mumkin.</li>
        <li>O'tkir siydik ushlanishi shoshilinch tibbiy aralashuvni — qovuqni zudlik bilan bo'shatishni — talab qiladi.</li>
        <li>Har bir simptomni baholashda anamnez (boshlanish vaqti, xarakteri, kuchaytiruvchi/yengillashtiruvchi omillar) tashxisning asosiy poydevori hisoblanadi.</li>
      </ul>
    </div>
    <p>
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr (2026) asosida tayyorlangan va faqat ta'lim
      maqsadlarida foydalanish uchun mo'ljallangan. Aniq klinik qarorlar uchun har doim dolzarb klinik
      qo'llanmalar (AUA, EAU Guidelines) va malakali shifokor maslahatiga murojaat qiling.
    </p>
  </section>

  <!-- 8. LUG'AT -->
  <section id="lugat" class="section">
    <h2><span class="num">8</span>Qisqartmalar va atamalar lug'ati</h2>
    <p>Mavzuda ishlatilgan barcha qisqartma va murakkab atamalarning to'liq izohi quyidagi jadvalda keltirilgan:</p>

    <div class="table-wrap">
      <table>
        <caption>6-jadval. Qisqartmalar va atamalar lug'ati</caption>
        <thead>
          <tr><th>Qisqartma / Atama</th><th>Inglizcha to'liq nomi</th><th>O'zbekcha izohi</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Dizuriya</strong></td><td>Dysuria</td><td>Siydik chiqarish vaqtida og'riq yoki achishish hissi</td></tr>
          <tr><td><strong>Gematuriya</strong></td><td>Hematuria</td><td>Siydikda qon (eritrotsitlar) borligi</td></tr>
          <tr><td><strong>MH</strong></td><td>Microhematuria</td><td>Mikroskopik gematuriya — faqat mikroskop ostida aniqlanadigan qon aralashmasi</td></tr>
          <tr><td><strong>HPF</strong></td><td>High-Power Field</td><td>Mikroskopning yuqori quvvatli ko'rish maydoni — eritrotsitlar shu maydonda sanaladi</td></tr>
          <tr><td><strong>AUA</strong></td><td>American Urological Association</td><td>Amerika Urologlar Assotsiatsiyasi — klinik qo'llanmalar ishlab chiqaruvchi tashkilot</td></tr>
          <tr><td><strong>CTU</strong></td><td>CT Urography</td><td>Kompyuter tomografiyasi yordamida siydik yo'llarini tekshirish usuli</td></tr>
          <tr><td><strong>UTT</strong></td><td>Ultratovush tekshiruvi</td><td>Ultrasound — nurlanishsiz tasvirlash usuli</td></tr>
          <tr><td><strong>CVAT</strong></td><td>Costovertebral Angle Tenderness</td><td>Bel-qovurg'a burchagida palpatsiyada og'riqlilik — pielonefrit belgisi</td></tr>
          <tr><td><strong>Stranguriya</strong></td><td>Strangury</td><td>Siydik chiqarish oxirida his qilinadigan kuchli, achishtiruvchi og'riq</td></tr>
          <tr><td><strong>AUR</strong></td><td>Acute Urinary Retention</td><td>O'tkir siydik ushlanishi — to'satdan siydik chiqara olmaslik holati</td></tr>
          <tr><td><strong>PVR</strong></td><td>Postvoid Residual (volume)</td><td>Siydik chiqargandan keyin qovuqda qolgan siydik hajmi</td></tr>
          <tr><td><strong>BPH</strong></td><td>Benign Prostatic Hyperplasia</td><td>Prostata bezining xavfsiz (saraton bo'lmagan) kattalashishi</td></tr>
          <tr><td><strong>JYI</strong></td><td>Jinsiy yo'l bilan yuqadigan infeksiya (STI)</td><td>Jinsiy aloqa orqali yuqadigan infeksiyalar guruhi</td></tr>
          <tr><td><strong>CIS</strong></td><td>Carcinoma in Situ</td><td>Saratonning boshlang'ich, faqat shilliq qavat ichida joylashgan bosqichi</td></tr>
        </tbody>
      </table>
    </div>

    <p style="text-align:center; margin-top: 18px;">
      <a class="back-to-top" href="#kirish">⬆ Mavzu boshiga qaytish</a>
    </p>
  </section>$urologik_simptomlar_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET
  nazariya_html = EXCLUDED.nazariya_html,
  updated_at = now();
