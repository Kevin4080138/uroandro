# Nazariya HTML yozdirish uchun prompt

Bu promptni Claude Project'ga (adabiyot yuklangan joyga) tashlang.
`{...}` qavslarini o'z darsingiz bilan almashtiring.

Har bosqich uchun raqamlar boshqacha — pastdagi jadvaldan oling.

| O'lchov | EASY | O'RTA | QIYIN |
|---|---|---|---|
| So'z | 600–900 | 1 500–2 200 | 3 500–6 000 |
| Bo'lim (H2) | 4–5 | 6–8 | 9–12 |
| Jadval | 0–1 | 2–3 | 4–6 |
| Rasm o'rni | 2–3 | 3–5 | 5–8 |
| Daqiqa | 5–7 | 12–15 | 25–35 |

---

## Boshlashdan oldin uchta narsani tayyorlang

Promptni to'ldirish uchun shular kerak — ularsiz natija yomon chiqadi.

**1. Adabiyot — aniq bob va sahifagacha.**
"Campbell-Walsh" deb yozish yetarli emas. Qaysi nashr, qaysi bob —
shuni yozing. Model kitobning butunini emas, o'sha bo'limni o'qiydi va
darsda qaysi manbadan olingani ko'rinib turadi.

**2. Quyi bosqichdagi (EASY) darsning uchta asosiy punkti.**
O'RTA darsi boshida "asosiy bosqichda o'rganilgan edi" izohi bo'ladi.
Model EASY darsini ko'rmaydi — uchta punktni siz berasiz. Bermasangiz,
u o'zi o'ylab topadi va EASY darsi bilan mos kelmaydi.

**3. Dars slug'i — `MAVZULAR-XARITASI.md` dan.**
U yerda O'RTA uchun 33 ta mavzu belgilangan, har birining slug'i tayyor.
Yangi slug o'ylab topmang.

---

## PROMPT (shu yerdan nusxa oling)

```
Urosfera platformasi uchun urologiya darsining nazariya qismini yoz.

DARS
  Mavzu:      {mavzu nomi}
  Slug:       {dars-slug}
  Bosqich:    O'RTA
  Kategoriya: {kategoriya}

BOSQICHNING VAZIFASI
O'RTA bosqich "Qanday tashxis qo'yaman?" degan savolga javob beradi.
Dars tugagach talaba tekshiruv buyura olishi va boshlang'ich davolashni
boshlay olishi kerak. Bu darslik bobining qisqartmasi EMAS — u boshqa
savolga javob beradi.

ADABIYOT — faqat men yuklagan fayllardan
  Asosiy manba:  {kitob nomi, nashr — qaysi boblar}
  Qo'shimcha:    {gayd yoki maqola, yil — qaysi bo'lim}

  · Faktni faqat shu manbalardan ol. O'zing eslab qolganingdan yozma:
    manbada yo'q raqam, chegara qiymat yoki doza kiritilmasin.
  · Manbalar zid bo'lsa: gayd (EAU/AUA) darslikdan ustun turadi.
    Zidlikning O'ZINI darsda muhokama qilma — u QIYIN bosqichniki.
  · Manbada topilmagan narsani to'qib yozma.
  · Hero chiplarida qaysi kitob va qaysi boblardan foydalanganingni yoz.

AVVALGI BOSQICH (dars boshidagi eslatma uchun)
  EASY darsi: {slug} — {sarlavha}
  Unda o'rganilgan:
    · {punkt 1}
    · {punkt 2}
    · {punkt 3}
  Shu uchtasini qisqa takrorlab, ustiga yangi klinik qatlam qur.
  Ularni qaytadan tushuntirma — talaba bilishini nazarda tut.

HAJM (qat'iy)
  So'z:       1500–2200
  Bo'lim H2:  6–8
  Jadval:     2–3
  Rasm o'rni: 3–5
  O'qish:     12–15 daqiqa

  Daqiqani so'z sonidan hisobla: so'z ÷ 130. Tibbiy matn sekin o'qiladi,
  jadval va sxemani ko'zdan kechirish ham vaqt oladi. Hero chipidagi
  daqiqa haqiqiy hajmga mos bo'lsin — talabaga yolg'on vaqt aytilmasin.

BO'LMASIN
  · operatsiya texnikasi bosqichlari
  · intraoperatsion asoratlar
  · gaydlar o'rtasidagi qarama-qarshiliklar
  · nodir uchraydigan variantlar
  (bular QIYIN bosqichniki)

BO'LSIN
  · diagnostika algoritmi va tekshiruv tanlash mantig'i
  · differensial tashxis
  · ball/tasnif tizimlari (IPSS, NIH va h.k.)
  · dori guruhlari va birinchi qator davolash
  · qachon yuqori bosqichga yo'naltirish kerak

MUALLIFLIK HUQUQI — MUHIM
Kitobdagi faktlarni O'Z SO'ZING bilan qayta yoz. Jumlalarni ko'chirma.
Kitobning rasm, sxema va jadval TASVIRLARINI umuman olma — ular
himoyalangan. Jadval kerak bo'lsa, ma'lumotni o'zing qayta tuzib yoz.

CHIQISH FORMATI — faqat HTML bo'lagi
Quyidagilarni QO'SHMA:
  ✗ <!DOCTYPE>, <html>, <head>, <body>
  ✗ <style> bloki yoki style="" atributlari
  ✗ logotip, sarlavha rasmi, kolontitul
  ✗ base64 rasm (data:image/...)
  ✗ tashqi CSS yoki shrift havolasi

Sabab: uslub platformada `.maqola-html` da bir marta turadi, logotip esa
sahifa shablonida bor. Ular HTML ichida takrorlansa, dars hajmi 25 KB
o'rniga 300 KB bo'lib ketadi va telefonda sekin ochiladi.

ISHLATILADIGAN KLASSLAR (boshqasini o'ylab topma)

<div class="article-hero">
  <div class="article-hero__eyebrow">🟡 {N}-mavzu · {kategoriya} · O'rta bosqich</div>
  <h1>{sarlavha}</h1>
  <p class="article-hero__lead">{3-4 jumlalik kirish}</p>
  <div class="article-hero__meta">
    <span class="pill">⏱ ~{N} daqiqa</span>
    <span class="pill">📚 {kitob nomi, nashr}</span>
    <span class="pill">📖 {boblar}</span>
    <span class="pill">🎓 Talabalar va rezidentlar uchun</span>
  </div>
</div>

<nav class="toc">
  <p class="toc__title">📑 Mavzu xaritasi</p>
  <ol><li><a href="#id">Bo'lim nomi</a></li>…</ol>
</nav>

<section class="section" id="id">
  <h2><span class="num">1</span>Bo'lim nomi</h2>
  <p>…</p>
  <h3>Kichik sarlavha</h3>
  <ul><li>…</li></ul>
</section>

Jadval:
<div class="table-wrap">
  <table>
    <caption>Jadval nomi</caption>
    <thead><tr><th>…</th></tr></thead>
    <tbody><tr><td>…</td></tr></tbody>
  </table>
</div>

Izohlar (uch xil):
<div class="callout callout--note">     — foydali eslatma 💡
<div class="callout callout--warning">  — xavf, ehtiyot ⚠️
<div class="callout callout--guide">    — yo'naltiruvchi tavsiya 🧭
Ichida: <strong class="callout-title">Sarlavha</strong> so'ng matn.

Bosqichma-bosqich ro'yxat:
<ol class="steps"><li><strong>Qadam nomi</strong> Izoh matni</li></ol>

Inglizcha atama: <span class="en-term">(term)</span>

RASM O'RNI — rasm chizilmagan, faqat joy qoldiriladi
Har bir rasm o'rniga shuni yoz (3–5 ta):

<figure class="rasm-orni" data-rasm="{qisqa-nom}">
  <span class="rasm-orni__belgi">Sxema N — chizilishi kerak</span>
  <span class="rasm-orni__nom">{Rasm nomi}</span>
  <p class="rasm-orni__izoh">{Nima chizilishi kerakligi: qaysi tuzilmalar,
  qaysi belgilar, nima solishtiriladi. O'zbekcha yozuvlar bilan.}</p>
</figure>

MAJBURIY IKKI IZOH (progressni ko'rsatish uchun)

1) Dars BOSHIDA — quyi bosqich eslatmasi:
<div class="callout callout--note">
  <strong class="callout-title">Asosiy bosqichda o'rganilgan edi</strong>
  {yuqorida berilgan uchta punkt}
</div>

2) Dars OXIRIDA — keyingi bosqich va'dasi:
<div class="callout callout--guide">
  <strong class="callout-title">Qiyin bosqichda bu mavzuda nima bor</strong>
  {operatsiya, asoratlar, murakkab holatlar — sanab o't}
</div>

TIL
O'zbekcha, lotin yozuvida. Tibbiy atamaning inglizchasi birinchi
ishlatilganda qavs ichida <span class="en-term"> bilan berilsin.
Talabaga murojaat "siz" emas, neytral ohangda.

Faqat HTML bo'lagini qaytar, boshqa izohsiz.
```

---

## Yozilgandan keyin — tekshiruv ro'yxati

Joylashdan oldin shu beshtasini ko'ring:

1. **Hajm 25–40 KB.** 100 KB dan katta bo'lsa ichida `<style>`, logotip
   yoki base64 rasm bor. Tez tekshiruv: faylda `base64`, `<style`,
   `<html` so'zlari bo'lmasin.
2. **So'z soni 1500–2200.** Kam bo'lsa — EASY ga o'xshab qolgan.
   Ko'p bo'lsa — QIYIN mazmuni aralashgan, ortiqchasini o'sha bosqichga
   ajratib qo'ying.
3. **Taqiqlangan mazmun yo'qmi.** Matnda operatsiya texnikasi
   bosqichlari yoki intraoperatsion asorat tilga olinmasin.
4. **Daqiqa mos.** Hero chipidagi daqiqa `darslar.ts` dagi `daqiqa`
   maydoniga ham yozilsin — ikkalasi bir xil bo'lsin.
5. **Ikkita majburiy izoh bormi** — dars boshida "asosiy bosqichda" va
   oxirida "qiyin bosqichda".

---

## Joylashtirish

Nazariya `dars_tarkibi.nazariya_html` ustuniga tushadi. Ikki yo'l:

1. **Admin panel** (tavsiya) — `/admin/darslar` sahifasidan darsni
   tanlab, HTML ni qo'yib saqlash. Deploy kerak emas.
2. **Migratsiya fayli** — `supabase/migrations/` ga
   `INSERT ... ON CONFLICT (dars_slug) DO UPDATE` bilan.

Dars `darslar.ts` da hali yo'q bo'lsa, avval o'sha yerga qo'shiladi
(slug, sarlavha, kategoriya, bosqich, qisqa, daqiqa) — aks holda
tarkib bazaga tushsa ham ro'yxatda ko'rinmaydi.
