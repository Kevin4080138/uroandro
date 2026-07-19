-- EASY bosqich, 1-dars: Urologiya nimani o'rganadi?
--
-- "Kirish va semiotika" bobining birinchi darsi — butun kursning ochilishi.
-- AGENTS.md dagi EASY qoidalari bo'yicha: sarlavhalar savol shaklida,
-- ~700 so'z, 5 ta bo'lim, bitta jadval.
--
-- Bu dars normalogiya/kirish turkumiga kiradi, shuning uchun "Qachon xavfli?"
-- kabi klinik shoshilinch bo'limi yo'q (AGENTS.md: normalogiya → klinik
-- format yo'q). Uning o'rniga soha chegaralari va shikoyat guruhlari beriladi —
-- bular keyingi darslarning skeletini tashkil qiladi.
--
-- Sxemalar hali chizilmagan: `figure.rasm-orni` joy egalari turibdi.

INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'urologiya-asoslari',
  $easy_urologiya_html$
<main class="site-main">
<article class="lesson">

  <div class="article-hero">
    <span class="article-hero__eyebrow">🟢 Boshlang'ich daraja · Kirish</span>
    <h1>Urologiya nimani o'rganadi?</h1>
    <p>Kursning birinchi darsi. Bu yerda sohaning chegaralarini, urolog qaysi a'zolar bilan ishlashini va bemorlar qanday shikoyat bilan kelishini ko'rib chiqamiz.</p>
    <div class="article-hero__meta">
      <span>⏱️ 5 daqiqa</span>
      <span>🎯 Sohaga kirish</span>
      <span>🎓 Boshlang'ich bosqich</span>
    </div>
  </div>

  <nav class="toc" aria-label="Mavzu ichidagi navigatsiya">
    <p class="toc__title">📑 Mavzu xaritasi</p>
    <ol>
      <li><a href="#nimani">Urologiya nimani o'rganadi?</a></li>
      <li><a href="#azolar">Qaysi a'zolar urolog zimmasida?</a></li>
      <li><a href="#shikoyat">Bemor qanday shikoyat bilan keladi?</a></li>
      <li><a href="#yonalish">Soha qanday yo'nalishlarga bo'linadi?</a></li>
      <li><a href="#nega">Nega bu soha muhim?</a></li>
    </ol>
  </nav>

  <section class="section" id="nimani">
    <h2><span class="num">1</span>Urologiya nimani o'rganadi?</h2>

    <p><strong>Urologiya</strong> — siydik hosil bo'lishidan to tashqariga chiqarilishigacha bo'lgan butun yo'lni, shuningdek erkak jinsiy a'zolarini o'rganadigan jarrohlik sohasi.</p>

    <p>Bu ta'rifda ikkita muhim nuqta bor:</p>

    <ul>
      <li>Sohaning siydik tizimiga oid qismi <strong>ham erkaklarga, ham ayollarga</strong> tegishli. "Urologiya — faqat erkaklar shifokori" degan keng tarqalgan tushuncha noto'g'ri.</li>
      <li>Erkak jinsiy a'zolariga oid qismi esa faqat erkaklarga tegishli — bu yerda urologiya andrologiya bilan tutashadi.</li>
    </ul>

    <p>Buyrak ikki sohaning chegarasida turadi va talabalar ko'pincha shu yerda chalkashadi. Farqni bir marta aniq eslab qolish kifoya: <strong>nefrolog buyrakning ichki, filtrlash faoliyatini dori bilan davolaydi; urolog esa tuzilish va to'siq muammosini hal qiladi</strong> — tosh, siydik yo'lining berkilishi, o'sma.</p>

    <div class="callout callout--note">
      <strong class="callout-title">Oddiy tekshirish savoli</strong>
      Muammo siydikning <em>yo'lida</em> (to'siq, tosh, tuzilish) bo'lsa — urolog. Muammo buyrakning <em>ishida</em> (filtrlash, qon bosimi, oqsil yo'qotish) bo'lsa — nefrolog.
    </div>
  </section>

  <section class="section" id="azolar">
    <h2><span class="num">2</span>Qaysi a'zolar urolog zimmasida?</h2>

    <p>Siydik yo'lini tepadan pastga qarab eslab qolish qulay — keyingi barcha darslar shu tartibda quriladi.</p>

    <figure class="rasm-orni" data-rasm="siydik-tizimi-umumiy">
      <span class="rasm-orni__belgi">Sxema 1 — chizilishi kerak</span>
      <span class="rasm-orni__nom">Siydik ajratish tizimi — umumiy ko'rinish</span>
      <p class="rasm-orni__izoh">Tepadan pastga: ikkita buyrak, siydik naylari, qovuq, uretra. Yonida erkak va ayol uretrasining uzunlik farqi ko'rsatilsin. Yozuvlar o'zbekcha, inline SVG.</p>
    </figure>

    <ul>
      <li><strong>Buyrak</strong> — qonni filtrlab siydik hosil qiladi</li>
      <li><strong>Siydik nayi (ureter)</strong> — siydikni buyrakdan qovuqqa tushiradi</li>
      <li><strong>Siydik pufagi (qovuq)</strong> — siydikni to'playdi va ushlab turadi</li>
      <li><strong>Uretra</strong> — siydikni tashqariga chiqaradi</li>
    </ul>

    <p>Erkaklarda bularga qo'shimcha ravishda <strong>prostata</strong>, moyaklar, quymalar (epididimis), urug' tizimchasi va olat qo'shiladi.</p>

    <p>Bitta anatomik fakt keyingi o'nlab darslarni tushuntiradi: <strong>erkak uretrasi uzun va prostatadan o'tadi, ayol uretrasi esa kalta.</strong> Shuning uchun ayollarda infeksiya yuqoriga osonroq ko'tariladi, erkaklarda esa siydik chiqishi to'siqqa uchraydi.</p>
  </section>

  <section class="section" id="shikoyat">
    <h2><span class="num">3</span>Bemor qanday shikoyat bilan keladi?</h2>

    <p>Urologik shikoyatlar juda xilma-xil ko'rinsa ham, aslida to'rt guruhga sig'adi. Shu to'rttasini bilsangiz, bemorni tinglaganda o'zingizni yo'qotmaysiz.</p>

    <div class="table-wrap">
      <table>
        <caption>Urologik shikoyatlarning to'rt asosiy guruhi</caption>
        <thead>
          <tr><th>Shikoyat guruhi</th><th>Bemor nima deydi</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Siyish buzilishi</strong></td><td>tez-tez siyaman, kechasi turaman, oqim sust, siya olmayapman</td></tr>
          <tr><td><strong>Og'riq</strong></td><td>belim og'riyapti, pastki qorinda og'riq, yorg'oqda og'riq</td></tr>
          <tr><td><strong>Siydik ko'rinishi</strong></td><td>siydigimda qon bor, loyqa, hidi o'zgargan</td></tr>
          <tr><td><strong>Jinsiy va reproduktiv</strong></td><td>erkaklik faoliyati, farzand ko'rmaslik</td></tr>
        </tbody>
      </table>
    </div>

    <p>Bu to'rt guruh kursning tuzilishini ham belgilaydi: keyingi darslar aynan shu shikoyatlar ortida qanday kasalliklar turishini ochib boradi.</p>
  </section>

  <section class="section" id="yonalish">
    <h2><span class="num">4</span>Soha qanday yo'nalishlarga bo'linadi?</h2>

    <figure class="rasm-orni" data-rasm="urologiya-yonalishlari">
      <span class="rasm-orni__belgi">Sxema 2 — chizilishi kerak</span>
      <span class="rasm-orni__nom">Urologiyaning yo'nalishlari</span>
      <p class="rasm-orni__izoh">Markazda "Urologiya", undan beshta tarmoq: umumiy urologiya, andrologiya, onkourologiya, bolalar urologiyasi, shoshilinch urologiya. Sodda tarmoqli sxema, inline SVG.</p>
    </figure>

    <ul>
      <li><strong>Umumiy urologiya</strong> — infeksiya, tosh kasalligi, siyish buzilishlari</li>
      <li><strong>Andrologiya</strong> — erkaklar salomatligi, bepushtlik, jinsiy faoliyat</li>
      <li><strong>Onkourologiya</strong> — buyrak, qovuq, prostata va moyak o'smalari</li>
      <li><strong>Bolalar urologiyasi</strong> — tug'ma anomaliyalar</li>
      <li><strong>Shoshilinch urologiya</strong> — siydik ushlanishi, travma, o'tkir holatlar</li>
    </ul>

    <p>Boshlang'ich bosqichda bularning hammasi bir vaqtda o'rganilmaydi. Avval umumiy urologiya — chunki amaliyotda eng ko'p uchraydigan holatlar shu yerda.</p>
  </section>

  <section class="section" id="nega">
    <h2><span class="num">5</span>Nega bu soha muhim?</h2>

    <p>Urologik kasalliklarning ko'pi darhol hayotga xavf solmaydi, lekin hayot sifatini kuchli pasaytiradi: uyqu buziladi, ish qobiliyati tushadi, odam uydan uzoqqa chiqishdan qo'rqadi.</p>

    <p>Ikkinchi tomondi ham bor: bir qism kasalliklar erta aniqlansa to'liq tuzaladi, kech qolsa buyrakni yo'qotishgacha olib boradi. Shuning uchun urologda <strong>"bu shoshilinchmi?"</strong> degan savol doim birinchi o'rinda turadi — keyingi darslarda buni har bir mavzu bo'yicha alohida ko'rib chiqamiz.</p>

    <div class="callout callout--note">
      <strong class="callout-title">Kasbning alohida qiyinligi</strong>
      Urologik shikoyatlar ko'pchilik uchun uyatli mavzu. Bemorlar oylab, ba'zan yillab kechikib keladi va kelganda ham asosiy shikoyatini oxirida aytadi. Shuning uchun urologda suhbatni to'g'ri boshlash — alohida o'rganiladigan ko'nikma.
    </div>

    <div class="callout callout--guide">
      <strong class="callout-title">O'rta bosqichda bu mavzuda nima bor</strong>
      Tekshiruv usullari va ular nimani ko'rsatadi · qaysi tekshiruvni qachon buyurish kerak · shikoyatdan tashxisga o'tishning amaliy yo'li.
    </div>
  </section>

</article>
</main>
$easy_urologiya_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
