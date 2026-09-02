# Reja — Talaba bo'limini mustahkamlash

> Talaba bo'limining 6 ta zaif tomonini bartaraf etish. Tahlil: 2026-09-01.
> Admin mustahkamlash ishi ([REJA-ADMIN-YAXSHILASH.md](REJA-ADMIN-YAXSHILASH.md)) bilan
> bir uslubda — mavjud kodni tuzatish, yangi funksiya emas.
> Bajarilgani sari `[ ]` → `[x]`.

Ustuvorlik: **T1 (rang manbasi) → T2 (fayl bo'lish) → T3 (xatolik) → T4 (a11y) → T5 (anti-cheat) → T6 (kontent)**.
T1 birinchi — kichik, xavfsiz va T2/T4 ni osonlashtiradi.

---

## T1 — Bosqich rang/emoji: bitta manba 🟡 (avval bajariladi)

**Muammo.** Qattiq-kodlangan hex (`#16a34a`/`#d97706`/`#dc2626`) va emoji (🟢🟡🔴)
14+ faylda takrorlanadi — `darslar/page.tsx` da 19, `bosqich/[bosqich]` da 16,
[DarsClient.tsx](src/app/student/darslar/[slug]/DarsClient.tsx) da **62** marta.
[BOSQICHLAR](src/lib/talim/darslar.ts#L48) da `emoji` bor, lekin **rang yo'q** —
shuning uchun har fayl o'zi hex yozadi. Bitta ranni o'zgartirish uchun 14 fayl kerak.

- [x] [`darslar.ts`](src/lib/talim/darslar.ts) — `BOSQICH_RANG: Record<Bosqich, { token; accent; gradient }>`
      yagona manba: `token` (tekis fon/matn — temaga moslashadi), `accent` (banner gradientiga mos
      vivid hex — alfa-qo'shimcha `accent+'16'` va gradientlar uchun kerak), `gradient` (banner).
      Emoji [BOSQICHLAR] da yagona manbada qoladi.
- [x] **5 data-driven fayl** yagona manbaga ko'chirildi (asosiy "4-5 faylda takror" muammosi):
      [bosqich/[bosqich]](src/app/student/darslar/bosqich/[bosqich]/page.tsx) (gradient+accent),
      [DarsClient](src/app/student/darslar/[slug]/DarsClient.tsx) (accent — alfa/gradient bilan),
      [dashboard](src/app/student/dashboard/page.tsx) (GB + BOSQICH_MA → `.token`, tekis progress),
      [ginekologiya bosqich](src/app/student/ginekologiya/darslar/bosqich/[bosqich]/page.tsx) (gin matni qoladi, rang manbadan),
      [sertifikatlar](src/app/student/profil/sertifikatlar/page.tsx) (`.token`; `#ca8a04→var(--warn)` birlashdi).
- [x] Tekis fillar `.token` (temaga moslashadi), banner hero'lar `.accent`+`.gradient` (aynan avvalgi ko'rinish).
- [ ] **Ataylab qoldirildi** — [darslar/page.tsx](src/app/student/darslar/page.tsx): bespoke 3-tarif
      marketing hero (2-stop gradient, glow, dashed border, 🎁🟢 badge). Kanonik 3-stop gradientga
      majburlash ko'rinishni buzadi (admin donut hex kabi). Ixtiyoriy keyingi ish.
- [ ] **T2 ga qoldirildi** — DarsClient'dagi ~80 test javob-fikri hexi (yashil=to'g'ri/qizil=xato)
      bosqich rangi emas, alohida semantik; bo'lim ajratishda (`TestBlok` va b.) tokenlarga o'tadi.
- [ ] Emoji→matn (bosqich belgisiga `Oson/O'rta/Qiyin`) — T4 (a11y) da ko'rib chiqiladi.

---

## T2 — DarsClient.tsx (2116 qator) ni bo'limlarga bo'lish 🔴 eng jiddiy

**Muammo.** Bitta faylda: banklar hook, asosiy `DarsClient`, `NazariyaBolimi`,
`AdabiyotlarBloki`, `VideoBolimi`, `YuklabOlishBolimi`, `TestBlok` (umumiy quiz dvigatel),
`AmaliyTestBolimi`, `UsmleTestBolimi`, `FlashcardBolimi`, `KlinikHolatlarBolimi`,
`NazoratTestBolimi`, `InteraktivCaseBolimi`, `XatolarTahlilyBolimi`, `VaziyatliMasalaBolimi`.
Qo'llab-quvvatlash va sinov qiyin.

> Yaxshi tomoni: bo'limlar **allaqachon mustaqil komponentlar** — ajratish mexanik,
> mantiq o'zgarmaydi (past xavf).

- [x] Yangi papka `src/app/student/darslar/[slug]/bolimlar/`. **Kohesiv guruhlash** tanlandi
      (12 mayda fayl emas — import-yuzasi va xato ehtimolini kamaytiradi):
  - [x] `types.ts` — `Tab`, `Adabiyot`, `TestNatija`.
  - [x] `BoshUlash.tsx` — umumiy bo'sh-holat (ko'p bo'lim ishlatadi).
  - [x] `TestBlok.tsx` — umumiy quiz dvigateli + anti-cheat (visibilitychange/fullscreen). T5 shu yerga tegadi.
  - [x] `MateriallarBolimlari.tsx` — Nazariya (+Adabiyot), Video (+VideoKartasi), Yuklab, Flashcard.
  - [x] `TestBolimlari.tsx` — Amaliy, USMLE, Nazorat (TestBlok ustidagi qobiqlar).
  - [x] `CaseBolimlari.tsx` — Klinik, Interaktiv (+TUR_RANG/NOMI), Xatolar, Vaziyatli.
- [x] `DarsClient.tsx` **2116 → 513 qator** — faqat orkestratsiya (tab holati, `qadamgaOt`,
      `yakunlaVaDavom`, `qadamChip`, `Tarkib` panel, bo'limlarni import qilib render).
      `DarsMatni` eksporti saqlandi (page.tsx import qiladi).
- [x] `tsc --noEmit` toza (0 xato); `next build` tekshirilmoqda.
  ⚠️ **Slug/DB kalitlariga tegilmadi** — faqat fayl tuzilishi, mantiq o'zgarmadi (kod ko'chirildi).
  > Eslatma: test javob-fikri hexi (yashil/qizil) bo'limlar bilan birga ko'chdi — T1 da aytilgan
  > tokenlarga o'tkazish keyingi kichik tozalash (hozircha aynan saqlandi, xavfsizlik uchun).

---

## T3 — Xatolik holatlari: fire-and-forget tugatiladi 🟡

**Muammo.** `yonalishAlmashtir` ([dashboard:145-150](src/app/student/dashboard/page.tsx#L145))
optimistik `setYonalish` qiladi-yu, `supabase.update` ni **`await` qilmaydi va xatoni ushlamaydi** —
tarmoq uzilса foydalanuvchi bilmaydi, UI noto'g'ri holatda qoladi. Progress yakunlash
(`yakunlaVaDavom`, test `saqla`) ham ko'pi shunday.

- [ ] `yonalishAlmashtir`: `await` + `error` tekshiruvi; xato bo'lsa `setYonalish` ni
      eski qiymatga **rollback** + kichik xato bildirish (admin'dagi banner namunasi).
- [ ] Test/nazorat `saqla` funksiyalari ([DarsClient](src/app/student/darslar/[slug]/DarsClient.tsx#L1092)
      va b.): natija saqlanmasa foydalanuvchiga bildirish ("natija saqlanmadi, qayta urinib ko'ring"),
      chunki bu progress/sertifikatga ta'sir qiladi.
- [ ] Progress qadam yakunlash (`useDarsProgress.yakunla`) — jadval xatosida jimgina o'tib
      ketmasin; hech bo'lmasa konsolga emas, holatga yozilsin.
- [ ] Kichik umumiy toast/banner yordamchisi (admin `amalXato` naqshi) — talaba bo'limi bo'ylab.

---

## T4 — Accessibility 🟡

**Muammo.** Admin bilan bir xil: karta va qadamlar `<div onClick>`, tugma emas;
klaviatura/aria yo'q. Qulflangan qadamda `cursor: not-allowed` bor, lekin ekran-o'quvchi
holatni bilmaydi.

- [ ] Bosiladigan `<div onClick>` (dars kartalari, bosqich kartalari, qadam chiplari) →
      `<button>` yoki navigatsiya bo'lsa `<Link>`.
- [ ] Qulflangan qadam: `disabled` + `aria-disabled="true"` + `title`/`aria-label`
      ("Avval oldingi qadamni yakunlang"). `cursor: not-allowed` yolg'iz yetarli emas.
- [ ] Faol/tugallangan/qulflangan holat `aria-label` yoki `aria-current` bilan bildiriladi.
- [ ] Test variant tugmalari: `<button>` + tanlangan holat `aria-pressed`.
- [ ] Global `:focus-visible` allaqachon qo'shilgan ([globals.css](src/app/globals.css)) — yangi
      tugmalar undan foydalanadi.

---

## T5 — Anti-cheat: chegaralarni tan olish + oqilona mustahkamlash 🟢

**Muammo.** Faqat brauzer hodisalari (`visibilitychange`, `fullscreenchange`,
[TestBlok:877](src/app/student/darslar/[slug]/DarsClient.tsx#L877)) — ikkinchi qurilma yoki
devtools'ni to'smaydi. Jiddiy imtihon uchun yetarli emas.

- [ ] **Haqiqatni hujjatlashtirish** — nazorat/USMLE bloki "nazorat, imtihon emas" degan
      taxminni kod izohida va (kerak bo'lsa) UI'da aniq qilish. Soxta xavfsizlik va'da qilinmasin.
- [ ] Server tomonida oqilona chek: bir nazoratni **qayta topshirish oralig'i**, urinishlar
      soni va vaqt tamg'asi `talim_natijalari` da (allaqachon `created_at` bor) — anomaliyani
      keyin ko'rish uchun. Klient-only bloklashga ishonilmaydi.
- [ ] Serverga savol/javob to'g'riligini ko'chirish g'oyasi (hozir to'g'ri javob klientda) —
      bu **katta ish**, alohida band sifatida belgilab qo'yiladi, bu rejada bajarilmaydi.
- [ ] Hozircha: mavjud brauzer-hodisa nazorati qoladi, lekin "buzilish" hodisasi
      `talim_natijalari` ga (yoki audit'ga) yoziladi — o'qituvchi ko'rishi uchun.

---

## T6 — "Tez orada" kontent (alohida — kontent ishi)

**Muammo.** Interaktiv case, vaziyatli masala, xatolar tahlili, ginekologiya kalkulyatorlari —
interfeys tayyor, bank bo'sh bo'lsa faqat "tez orada" ko'rsatadi.

- [ ] Bu **kod emas, kontent** kamchiligi — bank to'ldirilishi kerak (`AGENTS.md` daraja
      matritsasi va bank hajmlariga muvofiq).
- [ ] Bu reja doirasida **bajarilmaydi**; kontent rejasi bilan yuritiladi.
- [ ] Faqat texnik tomon: bank bo'sh bo'lganda "tez orada" holati **a11y-to'g'ri** va
      dizayn-token bilan ko'rsatilishini T1/T4 doirasida tekshirish.

---

## Bosqichma-bosqich yetkazish

1. **PR-1 (T1):** bosqich rang/emoji bitta manbaga; 14 faylda hexlarni almashtirish.
2. **PR-2 (T2):** DarsClient'ni `bolimlar/` ga bo'lish (mantiq o'zgarmaydi). Har qadamda build.
3. **PR-3 (T3+T4):** xatolik boshqaruvi + a11y (UI qatlami, birga).
4. **PR-4 (T5):** anti-cheat halolligi + buzilish hodisasini yozish.
   T6 — kontent rejasida, bu yerda emas.

Har PR push→production'da tekshiriladi. Migratsiya bo'lsa foydalanuvchi Run qiladi.
