# Reja — Ginekologiya bilan kengaytirish

> Urosfera'ga urologiya yonida **ginekologiya** yo'nalishini qo'shish.
> Katta strategik ish — bosqichma-bosqich bajariladi.

## 1. Asosiy tamoyil — CHEKLAMASLIK

`jins` (bemor) va `yonalish` (talaba/shifokor) hech kimni **cheklamaydi** —
faqat **birinchi ko'rinishni** moslaydi. Har kim menyu/almashtirgich orqali
ikkala bo'limga ham kiradi. "Ayol ham urologga muhtoj" muammosi shu bilan hal.

## 2. Yaxshiroq alternativlar (handoff'dan ustun)

### Bemor: mutaxassislik nomi emas, MUAMMO bo'yicha yo'naltirish
Bemor "urolog"/"ginekolog" degan atamani bilmaydi. Shuning uchun tanlovni
**shikoyat/tana sohasi** bilan ko'rsatamiz (jins faqat tartiblaydi):
- 👩 Ayollar salomatligi (→ ginekologiya)
- 💧 Siydik / buyrak muammosi (→ urologiya) — ayolga ham ochiq
- 👨 Erkaklar salomatligi (→ urologiya/andrologiya)

Shunda ayol "Siydik/buyrak" ni tanlab urologiyaga tabiiy tushadi — atamani
bilishi shart emas.

### Shifokor: bitta emas, bir nechta mutaxassislik
Ba'zi shifokorlar uroginekolog yoki ikkalasini ham qiladi. Ro'yxatda
"Urolog / Ginekolog / Ikkalasi" tanlansin (`mutaxassislik` yoki alohida bayroq).

### Uroginekologiya — kesishma bo'lim
Ikkala yo'nalishga tegishli mavzular (ayollarda siydik tutolmaslik, tos a'zolari
tushishi...) alohida **Uroginekologiya** bo'limida — takrorlanmaydi.

### Brend
"Urosfera" nomi saqlanadi (SEO/domen qiymati). Faqat **tagline** yangilanadi:
"Urologiya va Andrologiya" → "Urologiya · Andrologiya · Ginekologiya" yoki
"Siydik-tanosil va ayollar salomatligi platformasi".

## 3. Bosqichli reja

### Bosqich 0 — Poydevor (kod, kontentsiz)
- [ ] Migratsiya: `profiles.jins` ('ayol'|'erkak'), `profiles.yonalish`
      ('urologiya'|'ginekologiya'); shifokor mutaxassisligini ko'p tanlovli qilish
- [ ] `globals.css`: `--gyn` / `--gyn-soft` ni **asosiy `:root` + dark** ga qo'shish
      (faqat `.talaba-palitra` ga emas — aks holda patient/register'da ishlamaydi)
- [ ] `register`: bemor uchun **jins** qadami (handoff snippet + tuzatish)
- [ ] `/student/yonalish` — ro'yxatdan keyin yo'nalish tanlash (handoff, tayyor)
- [ ] `/patient/yonalish` — MUAMMO bo'yicha yo'naltirish (handoff + ranng buglarini tuzatib)
- [ ] `student/dashboard`: yo'nalish almashtirgich — **nuqtali tahrir** bilan (to'liq
      almashtirish emas), gin kartalari

### Bosqich 1 — Yo'nalishga qarab filtr
- [ ] `dars_tarkibi` / klassifikatsiya / testbank ga `yonalish` maydoni
- [ ] Talaba bo'limlari yo'nalishga qarab filtrlansin (gin bo'sh boshlanadi)

### Bosqich 2 — Ginekologiya kontenti (izolyatsiya modul)
- [x] **Darslar moduli** — admin CRUD (/admin/ginekologiya-darslar) + talaba viewer
      (/student/ginekologiya/darslar[/slug]). Deploy'siz, HTML nazariya. (2026-08-23)
- [x] **Dars ichida test** — gin_darslar.test_savollar, admin JSON, talaba yechadi
- [x] **Klassifikatsiyalar (gin)** — gin_darslar.bolim orqali (admin to'ldiradi)
- [x] **Operativ ginekologiya** — gin_darslar.bolim orqali (admin to'ldiradi)
- [ ] Kalkulyatorlar (gin) — katta (urologiyada 25+ ta, real formulalar); alohida ish
- [ ] qaysi-tahlil (ayollar), savollar (gin)
- [ ] Uroginekologiya kesishma bo'limi
- [ ] **Haqiqiy dars/test matni** — ginekolog yozadi (admin paneldan, deploy'siz)

### Bosqich 3 — Bemor tomoni
- [x] Shifokor yo'nalishi (shifokor_profillari.yonalish) + doctor ochiq-profilda tanlash
- [x] /shifokorlar katalog — yo'nalish filtri (Urolog/Ginekolog)
- [x] /patient/yonalish — jinsga qarab yo'naltirish (Bosqich 0 da)
- [ ] Murojaat/navbatni patient yonalishiga qarab avto-filtr (kelajak)

### Bosqich 4 — Brend / marketing
- [x] Tagline (login/Hero/manifest) → "Urologiya · Andrologiya · Ginekologiya"
- [ ] Landing'da alohida ginekologiya bloki, SEO matnlari

## 4. Handoff fayllardagi tuzatiladigan xatolar

1. `--gyn` faqat `.talaba-palitra` da → `:root`+dark ga ko'chirilsin (patient/register uchun)
2. `patient-yonalish`: asosiy karta `var(--gyn-soft)` va CTA `var(--gyn)` qattiq
   kodlangan → `asosiy.soft` / `asosiy.c` bo'lsin (erkak bemorda ko'k chiqsin)
3. `patient-yonalish`: yuqori jins yorlig'i doim plum → neytral yoki jinsga qarab
4. `patient-yonalish` `?bolim=` param — dashboard uni o'qiydigan qilinsin
5. `student-dashboard` — to'liq almashtirish emas, nuqtali tahrir

## 5. Kirish (jins/yo'nalish so'rash) — qayerda

- **Shifokor** ro'yxatdan o'tishda: mutaxassislik (Urolog/Ginekolog/Ikkalasi)
- **Talaba** ro'yxatdan keyin: `/student/yonalish` (Urologiya/Ginekologiya)
- **Bemor** ro'yxatda: jins → keyin `/patient/yonalish` (muammo bo'yicha)

---

*Yaratilgan: 2026-08-23. Handoff fayllar: zip "Urosfera ... ginekologiya bilan kengaytirish".*
