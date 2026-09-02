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

- [x] `yonalishAlmashtir` ([dashboard](src/app/student/dashboard/page.tsx)): `await` + `error`
      tekshiruvi; xato bo'lsa eski yo'nalishga **rollback** + `role="alert"` bildirish.
- [x] Test `saqla` funksiyalari ([TestBolimlari](src/app/student/darslar/[slug]/bolimlar/TestBolimlari.tsx)):
      amaliy/USMLE — saqlanmasa test tepasida ogohlantirish; **nazorat** — natija ekranida
      qattiq ogohlantirish (sertifikatga bog'liq, "admin/shifokorga murojaat qiling").
- [x] Progress qadam yakunlash (`useDarsProgress.yakunla`) — optimistik yozuv xato bersa
      rollback qiladi va `false` qaytaradi; DarsClient keyingi qadamga o'tmaydi, `role="alert"`
      bilan qayta urinish xabarini ko'rsatadi. Saqlash vaqtida FAB/tugma bloklanadi.
- [x] Umumiy xato ko'rsatish naqshi (`role="alert"` banner) talaba bo'limida qo'llandi.

---

## T4 — Accessibility 🟡

**Muammo.** Admin bilan bir xil: karta va qadamlar `<div onClick>`, tugma emas;
klaviatura/aria yo'q. Qulflangan qadamda `cursor: not-allowed` bor, lekin ekran-o'quvchi
holatni bilmaydi.

- [x] Qadam chiplari ([DarsClient](src/app/student/darslar/[slug]/DarsClient.tsx) `Tarkib`)
      `<div onClick>` → `<button disabled={!ochiq}>` + `aria-current="step"` (faol) + `aria-label`.
- [x] Qulflangan qadam: `disabled` + `aria-label` ("qulflangan, avval oldingi qadamni yakunlang").
      `cursor:not-allowed` endi yolg'iz emas.
- [x] Test variant tugmalari ([TestBlok](src/app/student/darslar/[slug]/bolimlar/TestBlok.tsx)): `aria-pressed`.
- [x] Case-runner javob variantlari (Interaktiv/Xatolar/Vaziyatli `<div>`): `role="button"` +
      `tabIndex` + `onKeyDown` (Enter/Space) + `aria-pressed`/`aria-disabled`. Klinik allaqachon `<button>`.
- [x] Case-menyu tanlash kartalari (4) va flashcard flip-kartasi: `role="button"` + klaviatura + `aria-label`.
- [x] Yo'nalish almashtirgichi ([dashboard](src/app/student/dashboard/page.tsx)): `aria-pressed`.
- [x] Global `:focus-visible` ([globals.css](src/app/globals.css)) — yangi tugmalar undan foydalanadi.
- [x] Dars ro'yxati kartalari ([darslar/page.tsx](src/app/student/darslar/page.tsx),
      [bosqich/[bosqich]](src/app/student/darslar/bosqich/[bosqich]/page.tsx)): `role="link"`,
      `tabIndex`, Enter/Space klaviatura navigatsiyasi va mazmunli `aria-label`; ketma-ket qulflangan
      karta `aria-disabled` bilan fokusdan chiqariladi.

---

## T5 — Anti-cheat: chegaralarni tan olish + oqilona mustahkamlash 🟢

**Muammo.** Faqat brauzer hodisalari (`visibilitychange`, `fullscreenchange`,
[TestBlok:877](src/app/student/darslar/[slug]/DarsClient.tsx#L877)) — ikkinchi qurilma yoki
devtools'ni to'smaydi. Jiddiy imtihon uchun yetarli emas.

- [x] **Haqiqat hujjatlashtirildi** — [TestBlok](src/app/student/darslar/[slug]/bolimlar/TestBlok.tsx)
      izohi va migratsiya izohi "brauzer OS darajasida bloklay olmaydi, jiddiy imtihon kafolati emas"
      deb aniq aytadi. UI ham soxta va'da bermaydi (ogohlantirib → avtomatik yakunlaydi).
- [x] **Buzilish hodisasi yoziladi** — migratsiya [`20260917000000_nazorat_qoidabuzarlik.sql`](supabase/migrations/20260917000000_nazorat_qoidabuzarlik.sql)
      `talim_natijalari.qoidabuzarlik` ustunini qo'shadi. TestBlok buzilish sababli yakunlanganda
      `qoidabuzarlik: true` uzatadi; Nazorat `saqla` uni bazaga yozadi.
- [x] **O'qituvchiga ko'rinadi** — talaba batafsil sahifasida
      ([[id]/page.tsx](src/app/admin/talabalar-nazorati/[id]/page.tsx)) urinish yonida
      "⚠️ Qoidabuzarlik" badge.
- [x] **Server-authoritative nazorat** — `nazorat_urinishlari` yopiq jadvali va
      `/api/nazorat/urinish` route: server savollar/variantlarni aralashtiradi, klientga `togri`
      indeksini bermaydi, deadline va bir urinishni server tekshiradi, ballni server hisoblaydi.
      Klient endi nazorat bankini yuklamaydi va `talim_natijalari`ga bevosita yozmaydi.
- [x] **Bir urinish** — `(student_id, dars_slug)` unique constraint bilan serverda; qayta
      topshirish uchun admin urinish yozuvini rasmiy qayta ochishi/o'chirishi kerak.

> Fizik cheklov: oddiy veb-ilova ikkinchi qurilmani ko'ra olmaydi. Server-authoritative ball,
> deadline va bir urinish soxtalashtirishni yopadi; masofaviy proktoringsiz shaxsni 100% nazorat
> qilish va'da qilinmaydi.

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
