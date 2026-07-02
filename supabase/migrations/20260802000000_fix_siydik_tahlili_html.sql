-- Fix 3-dars nazariya HTML: remove wrapper tags, fix callout structure, fix class names
UPDATE public.dars_tarkibi
SET nazariya_html = $siydik_html$<div class="article-hero">
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

  <nav class="toc" aria-label="Dars ichidagi navigatsiya">
    <p class="toc__title">📑 Dars mazmuni</p>
    <ol>
      <li><a href="#kirish">Kirish va namuna olish</a></li>
      <li><a href="#tashqi">Tashqi ko'rinishni baholash</a></li>
      <li><a href="#tasma">Tasma (dipstick) tahlili</a></li>
      <li><a href="#mikroskopiya">Siydik mikroskopiyasi (sediment)</a></li>
      <li><a href="#qontahlil">Buyrak funksiyasi: qon ko'rsatkichlari</a></li>
      <li><a href="#ekinma">Siydik ekinmasi (urine culture)</a></li>
      <li><a href="#xulosa">Xulosa va asosiy fikrlar</a></li>
      <li><a href="#lugat">Qisqartmalar va atamalar lug'ati</a></li>
    </ol>
  </nav>

  <section class="section" id="kirish">
    <h2><span class="num">1</span>Kirish va namuna olish</h2>
    <p>
      <span class="en-term">Umumiy siydik tahlili (urinalysis, UA)</span> uch qismdan iborat: siydikning
      <strong>tashqi ko'rinishini baholash</strong>, <strong>kimyoviy tasma (dipstick) tahlili</strong> va
      <strong>mikroskopik tekshiruv (siydik sedimenti)</strong>. Bu uchtasi birgalikda qo'llanilganda eng
      yuqori diagnostik qiymatga ega bo'ladi — faqat tasma tahlili mikroskopiya o'rnini bosa olmaydi.
    </p>

    <h3>1.1. To'g'ri namuna olish qoidalari</h3>
    <p>
      Eng ishonchli natija <span class="en-term">o'rta oqim, toza tutilgan namuna (clean-catch midstream urine)</span>
      orqali olinadi. Erkaklarda xatna qilinmagan bo'lsa, oldindan terlik (prepuce) orqaga tortilib, boshcha
      tozalanishi kerak. Ayollarda kontaminatsiya (begona aralashma) ehtimoli yuqoriroq, chunki siydik
      yo'lining tashqi qismi (introitus) atrofidagi leykotsit va bakteriyalar namunaga aralashishi mumkin.
    </p>
    <p>
      Agar klinik shubha kuchli bo'lib natija aniq bo'lmasa, <span class="en-term">kateter orqali olingan
      namuna (catheterized specimen)</span> tavsiya etiladi. Namuna olingandan keyin 1 soat ichida (xona
      haroratida) yoki 4 soat ichida (sovutilgan holatda) tekshirilishi kerak — aks holda natijalar
      noto'g'ri chiqishi mumkin.
    </p>

    <div class="callout callout--guide">
      <strong class="callout-title">Klinik eslatma</strong>
      <p>
        Siydik ekinmasi (urine culture) "oltin standart" hisoblansa-da, natija olish uchun kamida 18 soat,
        to'liq antibiotikka sezuvchanlikni aniqlash uchun 2–3 kun kerak bo'ladi. Shu sababli umumiy siydik
        tahlili tezkor klinik qaror qabul qilish uchun muhim ahamiyatga ega.
      </p>
    </div>
  </section>

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
      <strong class="callout-title">Diqqat!</strong>
      <p>
        "Pseudogematuriya (pseudo-hematuria)" — siydikning dehidratatsiya, ayrim oziq-ovqat (lavlagi) yoki
        dorilar (fenazopiridin) tufayli qizarib ko'rinishi. Haqiqiy gematuriyani aniqlash uchun albatta
        mikroskopik tekshiruvda eritrotsitlar borligini tasdiqlash kerak — faqat rangga qarab xulosa
        chiqarish noto'g'ri.
      </p>
    </div>
  </section>

  <section class="section" id="tasma">
    <h2><span class="num">3</span>Tasma (dipstick) tahlili</h2>
    <p>
      Kimyoviy reagent bilan qoplangan tasma siydikka botirilib, bir necha soniya-daqiqa ichida rang
      o'zgarishi orqali turli ko'rsatkichlarni aniqlash mumkin. Quyida eng muhim parametrlar keltirilgan.
    </p>

    <h3>3.1. Solishtirma og'irlik (specific gravity) va pH</h3>
    <p>
      <span class="en-term">Solishtirma og'irlik (specific gravity)</span> — siydikning suvga nisbatan
      zichligi, organizmning suyultirish/konsentratsiyalash qobiliyatini ko'rsatadi. Yuqori qiymat
      dehidratatsiya yoki glyukozuriya (qandli diabet)da, past qiymat esa ko'p suv ichish yoki buyrak
      konsentratsiyalash funksiyasi buzilishida kuzatiladi.
    </p>
    <p>
      <span class="en-term">Siydik pH</span> normal holatda 4.5–8.0 oralig'ida (o'rtacha 5.5–6.5) bo'ladi.
      pH qiymati siydik toshlari turini bashorat qilishda va infeksiya turini taxmin qilishda foydali:
      ishqorli siydik (pH&gt;7.5) ko'pincha ureaza ishlab chiqaruvchi bakteriyalar (masalan, <em>Proteus</em>)
      bilan bog'liq infeksiyani ko'rsatadi.
    </p>

    <h3>3.2. Leykotsit esteraza va nitrit</h3>
    <p>
      Bu ikki ko'rsatkich birgalikda siydik yo'li infeksiyasini (UTI) skrining qilish uchun ishlatiladi.
      <span class="en-term">Leykotsit esteraza (leukocyte esterase)</span> — parchalangan leykotsitlardan
      chiqadigan ferment, piyuriya (siydikda leykotsit ko'pligi) belgisi. <span class="en-term">Nitrit</span> —
      ko'pgina gramm-manfiy bakteriyalar (Enterobacteriaceae oilasi) tarkibidagi ferment orqali
      nitratlarning nitritga aylanishi natijasida hosil bo'ladi.
    </p>

    <div class="table-wrap">
      <table>
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
      <strong class="callout-title">Klinik eslatma</strong>
      <p>
        Agar tasma faqat leykotsit esterazaga musbat, nitritga manfiy bo'lsa — bu nafaqat infeksiyani,
        balki boshqa yallig'lanish sabablarini ham ko'rsatishi mumkin. Bunday holatda antibiotik
        boshlashdan oldin mikroskopik tekshiruv va, zarur bo'lsa, siydik ekinmasi o'tkazilishi tavsiya
        etiladi.
      </p>
    </div>

    <h3>3.3. Glyukoza, oqsil, bilirubin va keton</h3>
    <ul>
      <li><strong>Glyukozuriya (glucosuria)</strong> — qandli diabet yoki buyrak tubulalari patologiyasida kuzatiladi</li>
      <li><strong>Proteinuriya (proteinuria)</strong> — sog'lom kattalar kuniga 80–150 mg oqsil chiqaradi; bundan ko'p miqdor buyrak (glomerulyar) kasalligi belgisi bo'lishi mumkin</li>
      <li><strong>Bilirubin</strong> — jigarda yoki o't yo'llarida patologiya mavjudligini ko'rsatadi</li>
      <li><strong>Keton tanachalari</strong> — ochlik, qandli diabet dekompensatsiyasi yoki past uglevodli parhezda ko'tariladi</li>
    </ul>
  </section>

  <section class="section" id="mikroskopiya">
    <h2><span class="num">4</span>Siydik mikroskopiyasi (sediment tahlili)</h2>
    <p>
      Siydik mikroskopiyasi — siydik namunasi sentrifugadan o'tkazilib, cho'kma (sediment)ni maxsus
      mikroskop ostida ko'rib chiqish usuli. Bu usul piyuriya, gematuriya, kristallar va bakteriyalarni
      bevosita ko'rish imkonini beradi va ko'pincha tasma tahlilidan ko'ra ishonchliroq hisoblanadi.
    </p>

    <h3>4.1. Asosiy aniqlanadigan elementlar</h3>
    <div class="table-wrap">
      <table>
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
      <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
      <p>
        Asimptomatik mikroskopik gematuriya (AMH) — toza yig'ilgan namunada, oson aniqlanadigan
        benign sabab bo'lmagan holatda yuqori quvvatli maydonda 3 va undan ortiq eritrotsit borligi
        sifatida ta'riflanadi. Bu ko'rsatkich keyingi to'liq urologik tekshiruv zarurligini belgilashda
        asosiy mezon hisoblanadi.
      </p>
    </div>
  </section>

  <section class="section" id="qontahlil">
    <h2><span class="num">5</span>Buyrak funksiyasini baholashda qon ko'rsatkichlari</h2>
    <p>
      Siydik tahlilidan tashqari, urologik bemorlarda buyrak funksiyasini va umumiy metabolik holatni
      baholash uchun bir qancha qon ko'rsatkichlari muhim ahamiyat kasb etadi.
    </p>

    <h3>5.1. Kreatinin va glomerulyar filtratsiya tezligi (GFR)</h3>
    <p>
      <span class="en-term">Zardob kreatinini (serum creatinine)</span> — mushak metabolizmi natijasida hosil
      bo'ladigan modda, buyraklar orqali filtrlanadi va chiqariladi. Bu ko'rsatkich
      <span class="en-term">glomerulyar filtratsiya tezligi (glomerular filtration rate, GFR)</span>ning eng
      keng qo'llaniladigan, ammo mukammal bo'lmagan ko'rsatkichidir — chunki uning darajasi yosh, jins,
      bo'y va, ayniqsa, mushak massasiga bog'liq.
    </p>
    <p>
      GFR — buyraklarning bir daqiqada qonni qancha hajmda filtrlay olishini ko'rsatadi va surunkali buyrak
      kasalligi (CKD) bosqichlarini aniqlashda asosiy mezon hisoblanadi.
    </p>

    <div class="table-wrap">
      <table>
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
      <strong class="callout-title">Diqqat!</strong>
      <p>
        Zardob kreatinini past mushak massasiga ega bemorlarda (masalan, surunkali kasalliklarda yoki
        bolalarda) GFR pasayishini to'liq aks ettira olmasligi mumkin. Bunday holatlarda muqobil
        ko'rsatkich — <span class="en-term">cystatin C</span> — ko'proq aniqlik berishi mumkin.
      </p>
    </div>
  </section>

  <section class="section" id="ekinma">
    <h2><span class="num">6</span>Siydik ekinmasi (urine culture)</h2>
    <p>
      <span class="en-term">Siydik ekinmasi (urine culture)</span> — siydik yo'li infeksiyasi (UTI)ni
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
      <strong class="callout-title">Yo'naltiruvchi tavsiya</strong>
      <p>
        Barcha bemorlarda siydik ekinmasini rutina tarzda buyurish tavsiya etilmaydi. Bu, ayniqsa, doimiy
        kateter qo'ygan yoki intermittent kateterizatsiya qiluvchi bemorlarda ortiqcha aniqlash va
        keraksiz antibiotik davolanishiga olib kelishi mumkin — bunday bemorlarning siydigida bakteriya
        bo'lishi (kolonizatsiya) ko'pincha klinik infeksiya emas.
      </p>
    </div>
  </section>

  <section class="section" id="xulosa">
    <h2><span class="num">7</span>Xulosa va asosiy fikrlar</h2>
    <div class="callout callout--note">
      <strong class="callout-title">Asosiy xulosalar</strong>
      <ul>
        <li>To'liq siydik tahlili uch qismdan iborat: tashqi ko'rinish, tasma (dipstick) tahlili va mikroskopiya — faqat birini emas, barchasini birgalikda baholash kerak.</li>
        <li>Leykotsit esteraza va nitrit birgalikda yuqori diagnostik qiymatga ega, ammo har biri alohida cheklovlarga ega (yolg'on musbat/manfiy natijalar).</li>
        <li>Siydik mikroskopiyasida 3 tadan ortiq eritrotsit/HPF — gematuriya, 5 tadan ortiq leykotsit/HPF — piyuriya mezoni hisoblanadi.</li>
        <li>Zardob kreatinini va GFR — buyrak funksiyasini baholashning asosiy ko'rsatkichlari, lekin mushak massasiga bog'liqligini unutmaslik kerak.</li>
        <li>Siydik ekinmasi infeksiyani tasdiqlovchi "oltin standart" bo'lsa-da, barcha bemorlarda emas, faqat klinik ko'rsatkich bo'lganda buyuriladi.</li>
        <li>Faqat siydik rangiga qarab xulosa chiqarish noto'g'ri — gematuriyani har doim mikroskopik tasdiqlash zarur.</li>
      </ul>
    </div>
    <p>
      Ushbu material Campbell-Walsh-Wein Urology, 13-nashr asosida tayyorlangan va faqat ta'lim
      maqsadlarida foydalanish uchun mo'ljallangan.
    </p>
  </section>

  <section class="section" id="lugat">
    <h2><span class="num">8</span>Qisqartmalar va atamalar lug'ati</h2>
    <p>Mavzuda ishlatilgan barcha qisqartma va murakkab atamalarning to'liq izohi quyidagi jadvalda keltirilgan:</p>

    <div class="table-wrap">
      <table>
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
  </section>$siydik_html$
WHERE dars_slug = 'siydik-tahlili-asoslari';
