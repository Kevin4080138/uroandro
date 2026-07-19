-- EASY bosqich uchun namunaviy dars: Prostata adenomasi (BPH) — asoslari.
--
-- Bu dars yangi EASY qoidalari bo'yicha yozilgan (AGENTS.md, "Nazariya yozish qoidalari"):
--   · "Bu nima va nega muhim?" savoliga javob beradi — darslik bobi qisqartirilmagan
--   · sarlavhalar savol shaklida
--   · ~690 so'z, 5 ta bo'lim, jadval yo'q
--   · IPSS bali, dori nomi/dozasi, operatsiya nomi, statistik foizlar — YO'Q
--   · oxirida "keyingi bosqich" va'dasi — o'chirilgan mazmun yo'qolmaydi, unga ishora qilinadi
--
-- Sxemalar hali chizilmagan: ikkita `figure.rasm-orni` joy egasi turibdi, har
-- birida nima chizilishi kerakligi yozilgan. Chizilgach ular inline SVG bilan
-- almashtiriladi (o'zbekcha yozuvli). Uslub globals.css dagi `.maqola-html` dan
-- keladi — nazariya o'z <style> blokini olib kelmaydi.

INSERT INTO public.dars_tarkibi (dars_slug, nazariya_html)
VALUES (
  'prostata-adenomasi-asoslari',
  $easy_bph_html$
<main class="site-main">
<article class="lesson">

  <div class="article-hero">
    <span class="article-hero__eyebrow">🟢 Boshlang'ich daraja · Prostata</span>
    <h1>Prostata adenomasi — bu nima?</h1>
    <p>Yoshi ulg'aygan erkaklarda prostata bezi asta-sekin kattayadi va siydik yo'lini siqib qo'yadi. Bu dars kasallikni tanib olish va qachon shoshilinch yordam kerakligini bilish uchun.</p>
    <div class="article-hero__meta">
      <span>⏱️ 6 daqiqa</span>
      <span>🎯 Tanib olish va yo'naltirish</span>
      <span>🎓 Boshlang'ich bosqich</span>
    </div>
  </div>

  <nav class="toc" aria-label="Mavzu ichidagi navigatsiya">
    <p class="toc__title">📑 Mavzu xaritasi</p>
    <ol>
      <li><a href="#nima">Bu nima?</a></li>
      <li><a href="#kimda">Kimda uchraydi?</a></li>
      <li><a href="#belgilar">Qanday bilinadi?</a></li>
      <li><a href="#xavfli">Qachon xavfli?</a></li>
      <li><a href="#nima-qilish">Nima qilish kerak?</a></li>
    </ol>
  </nav>

  <section class="section" id="nima">
    <h2><span class="num">1</span>Bu nima?</h2>

    <p><strong>Prostata</strong> — faqat erkaklarda bo'ladigan, yong'oq kattaligidagi bez. U siydik pufagining (qovuq) tagida joylashgan va siydik chiqarish nayini — <strong>uretrani</strong> — halqa kabi o'rab turadi.</p>

    <p>Sog'lom holatda bu bez urug' suyuqligining bir qismini ishlab chiqaradi. Ya'ni u siydik chiqarish tizimiga emas, ko'payish tizimiga xizmat qiladi — lekin joylashuvi tufayli kasallanganda birinchi navbatda <em>siyish</em> buziladi.</p>

    <p>Yosh o'tgan sari bu bez asta-sekin kattayadi. Kattayish ko'proq uretraga yaqin, ichki qismidan boshlanadi — shuning uchun bez unchalik katta bo'lmasa ham siydik yo'liga bosim tushishi mumkin. Kattaygan bez uretrani ichkaridan siqadi va siydikning erkin oqishiga xalaqit beradi. Ana shu holat <strong>prostata adenomasi</strong> deb ataladi.</p>

    <figure class="rasm-orni" data-rasm="bph-normal-vs-kattalashgan">
      <span class="rasm-orni__belgi">Sxema 1 — chizilishi kerak</span>
      <span class="rasm-orni__nom">Normal va kattalashgan prostata</span>
      <p class="rasm-orni__izoh">Yonma-yon ikki panel: qovuq, prostata va uretra. O'ngdagisida bez kattalashgan va uretrani siqib turibdi. Yozuvlar o'zbekcha, inline SVG.</p>
    </figure>

    <p>Muhim nuqta: bu <strong>o'sma emas</strong>, saraton ham emas. Bez to'qimasining xavfsiz ko'payishi. Nomidagi "adenoma" so'zi ko'pchilikni qo'rqitadi, lekin bu holat saratonga aylanmaydi.</p>

    <div class="callout callout--note">
      <strong class="callout-title">Nima uchun aynan siyish buziladi?</strong>
      Chunki prostata uretrani o'rab turadi. Tanadagi boshqa bez kattayganda odam buni sezmasligi ham mumkin, prostata esa kattayishi bilanoq siydik yo'liga bosim beradi.
    </div>
  </section>

  <section class="section" id="kimda">
    <h2><span class="num">2</span>Kimda uchraydi?</h2>

    <p>Asosan <strong>50 yoshdan oshgan erkaklarda</strong>. Yosh ulg'aygan sari uchrash ehtimoli ortib boradi: keksa yoshdagi erkaklarning aksariyatida bezning u yoki bu darajada kattalashgani topiladi.</p>

    <p>Nega bunday bo'ladi? Bezning o'sishi yosh bilan bog'liq gormonal o'zgarishlarga bog'langan — shuning uchun u deyarli barcha erkaklarda vaqt o'tib boshlanadi. Sovuq qotish, ko'p suyuqlik ichish yoki jinsiy hayot bilan bog'liq emas: bemorlar ko'pincha shu narsalarni o'zlarini ayblab keladi, ularni tinchlantirish kerak bo'ladi.</p>

    <p>Lekin bu yerda talaba ko'pincha yanglishadigan nuqta bor: <strong>bez kattalashgani — kasallik degani emas.</strong> Ba'zi erkaklarda bez ancha katta bo'lsa ham hech qanday shikoyat bo'lmaydi. Boshqalarida esa nisbatan kichik bez kuchli bezovtalik beradi.</p>

    <p>Shuning uchun bemorga yordam kerak yoki kerak emasligi <strong>bezning o'lchamiga qarab emas, odamning shikoyatiga qarab</strong> hal qilinadi.</p>
  </section>

  <section class="section" id="belgilar">
    <h2><span class="num">3</span>Qanday bilinadi?</h2>

    <p>Shikoyatlarning deyarli hammasi siyish bilan bog'liq. Ularni ikki guruhga ajratib eslab qolish oson.</p>

    <h3>To'sqinlik belgilari — siydik chiqishi qiyinlashadi</h3>
    <ul>
      <li>siydik oqimi susayadi, ingichkalashadi</li>
      <li>siyish darrov boshlanmaydi — bir oz kutish kerak</li>
      <li>siyish uzoq davom etadi, oxirida tomchilaydi</li>
      <li>qovuq to'liq bo'shamagandek tuyuladi</li>
    </ul>

    <h3>Bezovtalik belgilari — qovuq o'zini tutolmaydi</h3>
    <ul>
      <li>tez-tez siygisi keladi</li>
      <li>kechasi siyish uchun uyg'onadi</li>
      <li>siygisi kelganda chidash qiyin bo'ladi</li>
    </ul>

    <figure class="rasm-orni" data-rasm="bph-siydik-oqimi">
      <span class="rasm-orni__belgi">Sxema 2 — chizilishi kerak</span>
      <span class="rasm-orni__nom">Kuchli va sust siydik oqimi</span>
      <p class="rasm-orni__izoh">Chapda: kuchli oqim, qovuq to'liq bo'shaydi. O'ngda: sust oqim va tomchilash, qovuqda siydik qoladi. Yozuvlar o'zbekcha, inline SVG.</p>
    </figure>

    <p>Kechasi siyish uchun uyg'onish — ko'pincha bemorni birinchi bo'lib shifokorga olib keladigan shikoyat, chunki u uyquni buzadi va kunduzgi holatga ta'sir qiladi.</p>
  </section>

  <section class="section" id="xavfli">
    <h2><span class="num">4</span>Qachon xavfli?</h2>

    <p>Ko'pincha bu holat sekin rivojlanadi va shoshilinch emas. Lekin quyidagi belgilar bo'lsa, kutib turish mumkin emas.</p>

    <div class="callout callout--warning">
      <strong class="callout-title">Shoshilinch yordam kerak bo'ladigan holatlar</strong>
      · Siydik umuman kelmay qolgan, qovuq to'lgan va pastki qorinda og'riq bor — bu <strong>o'tkir siydik ushlanishi</strong><br/>
      · Siydikda qon ko'ringan<br/>
      · Isitma bilan birga siyishda achishish paydo bo'lgan<br/>
      · Holsizlik, ko'ngil aynishi, oyoqlarda shish — buyrak zararlangan bo'lishi mumkin
    </div>

    <p>O'tkir siydik ushlanishi ko'pincha allaqachon to'sqinligi bor erkakda to'satdan boshlanadi: uzoq vaqt siyishni ushlab turish, sovuq qotish, spirtli ichimlik yoki ba'zi dorilarni qabul qilish turtki bo'lishi mumkin. Bemor siygisi kelib turadi, lekin siya olmaydi — bu holat juda og'riqli va o'z-o'zidan o'tib ketishini kutib bo'lmaydi.</p>

    <p>Uzoq vaqt e'tiborsiz qolgan to'sqinlik qovuq devoriga va vaqt o'tib buyraklarga zarar yetkazishi mumkin. Shuning uchun "yoshi shunaqa-da, o'zi shunday bo'ladi" deb qo'yib berish to'g'ri emas.</p>
  </section>

  <section class="section" id="nima-qilish">
    <h2><span class="num">5</span>Nima qilish kerak?</h2>

    <p>Bu bosqichda sizdan operatsiya qilish yoki dori tanlash talab qilinmaydi. Vazifa — <strong>tanib olish va to'g'ri yo'naltirish</strong>.</p>

    <ol class="steps">
      <li><strong>Shikoyatni aniqlang</strong> Shikoyat siyish bilan bog'liqmi? Qachondan beri davom etyapti va kundalik hayotga xalaqit beryaptimi?</li>
      <li><strong>Xavfli belgilarni tekshiring</strong> Siydikda qon, isitma, siydik umuman kelmasligi — shulardan biri bormi?</li>
      <li><strong>Xavfli belgi bo'lsa — darhol yo'naltiring</strong> Shoshilinch urologik yordamga jo'nating, kutib turmang.</li>
      <li><strong>Xavfli belgi bo'lmasa — rejali ko'rikka</strong> Bemorni urolog qabuliga yozdiring va shikoyati kuchaysa darrov murojaat qilishni tayinlang.</li>
    </ol>

    <div class="callout callout--note">
      <strong class="callout-title">Bemorga aytish kerak bo'lgan gap</strong>
      Ko'p erkaklar bu shikoyatlarni saraton belgisi deb qo'rqib, shifokordan qochadi. Prostataning bu kattalashishi saraton emasligini va tekshiruv aynan shuni aniqlashtirish uchun kerakligini tushuntirish murojaatni tezlashtiradi.
    </div>

    <div class="callout callout--guide">
      <strong class="callout-title">O'rta bosqichda bu mavzuda nima bor</strong>
      Shikoyatlarni ball tizimi bilan o'lchash · qanday tekshiruvlar buyuriladi va ular nimani ko'rsatadi · dori bilan davolashni tanlash · qachon operatsiya haqida o'ylash kerak bo'ladi.
    </div>
  </section>

</article>
</main>
$easy_bph_html$
)
ON CONFLICT (dars_slug) DO UPDATE SET nazariya_html = EXCLUDED.nazariya_html;
