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

## PROMPT (shu yerdan nusxa oling)

```
Urosfera platformasi uchun urologiya darsining nazariya qismini yoz.

DARS
  Mavzu:    {mavzu nomi}
  Slug:     {dars-slug}
  Bosqich:  O'RTA
  Kategoriya: {kategoriya}

BOSQICHNING VAZIFASI
O'RTA bosqich "Qanday tashxis qo'yaman?" degan savolga javob beradi.
Dars tugagach talaba tekshiruv buyura olishi va boshlang'ich davolashni
boshlay olishi kerak. Bu darslik bobining qisqartmasi EMAS — u boshqa
savolga javob beradi.

HAJM (qat'iy)
  So'z:      1500–2200
  Bo'lim H2: 6–8
  Jadval:    2–3
  Rasm o'rni: 3–5
  O'qish:    12–15 daqiqa

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
  <span class="article-hero__eyebrow">🟡 O'rta bosqich · {kategoriya}</span>
  <h1>{sarlavha}</h1>
  <p>{2-3 jumlalik kirish}</p>
  <div class="article-hero__meta">
    <span>⏱️ {N} daqiqa</span><span>🎯 {maqsad}</span><span>🎓 O'rta bosqich</span>
  </div>
</div>

<nav class="toc" aria-label="Mavzu ichidagi navigatsiya">
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
  {uchta punkt — EASY darsida nima bo'lgani}
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

## Joylashtirish

Nazariya `dars_tarkibi.nazariya_html` ustuniga tushadi. Ikki yo'l:

1. **Admin panel** (tavsiya, agar qo'shilgan bo'lsa) — `/admin/darslar`
   sahifasidan darsni tanlab, HTML ni qo'yib saqlash. Deploy kerak emas.
2. **Migratsiya fayli** — `supabase/migrations/` ga
   `INSERT ... ON CONFLICT (dars_slug) DO UPDATE` bilan.

## Hajm nazorati

Yozilgan HTML ni joylashdan oldin tekshiring:

- **25–40 KB** — normal (O'RTA darsi uchun)
- **100 KB dan katta** — ichida `<style>`, logotip yoki base64 rasm bor,
  ularni olib tashlang

Tez tekshiruv: faylda `base64`, `<style`, `<html` so'zlari bo'lmasin.
