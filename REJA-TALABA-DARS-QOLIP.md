# Reja — Talaba dars/modul qolipini qayta qurish

> Yangi urologiya viewerini Faza 4 backendiga ulash: **dars yengil, mashqlar modul
> darajasida markazda, sertifikat bosqich yakunida**. Maqsad — eski darslardagi 11
> majburiy qadam zerikarliligini yo'qotib, imkoniyatlarni saqlab qolish.
>
> Yaratilgan: 2026-09-09. Poydevor: [REJA-UROLOGIYA-FAZA4-IMPLEMENTATSIYA.md](REJA-UROLOGIYA-FAZA4-IMPLEMENTATSIYA.md) ·
> [REJA-UROLOGIYA-3LEVEL.md](REJA-UROLOGIYA-3LEVEL.md) · [AGENTS.md](AGENTS.md).

---

## 0. Hozirgi holat — tekshiruv natijasi (read-only)

| Obyekt | Joylashuv | Holati |
|--------|-----------|--------|
| Xavfsiz jadvallar | `kurs_modullar`, `kurs_savollar`, `kurs_flashcardlar`, `kurs_caselar`, `kurs_progress`, `kurs_urinishlar` | ✅ main'da, jonli bazada (34 modul / 126 dars) |
| Xavfsiz API | `src/app/api/kurs/{progress,test,case}/route.ts` | ✅ `togri` klientга chiqmaydi |
| Kirish helperi | `src/lib/kurs/kirish.ts` | ✅ `darsgaKirishBormi`, `modulgaKirishBormi`, `bosqichMap` |
| Admin muharrirlar | `src/app/admin/kurs/{modullar,darslar,praktikum}/page.tsx` | ✅ CRUD |
| **Talaba viewer** | `src/app/student/urologiya/darslar/[slug]/page.tsx` | ❌ **eski, xavfsiz-emas** — `test_savollar` jsonb'ni klientda solishtiradi, `kurs_natijalar`ga to'g'ridan yozadi |
| Modul mashq markazi | — | ❌ yo'q |
| Bosqich nazorati + sertifikat (kurs tizimi) | — | ❌ yo'q (eski `nazorat` tizimi alohida) |

**Xulosa:** backend tayyor, faqat **old (talaba interfeysi)** yetishmaydi. Bu reja aynan
shu bo'shliqni to'ldiradi.

### Qabul qilingan qarorlar (2026-09-09)

1. **Backend:** viewer darrov xavfsiz API'ga ulanadi (`test_savollar` jsonb yo'li tashlanadi).
2. **Materiallar + qo'shimcha videolar (YT/IG/FB):** hozircha DB qo'shilmaydi; bo'lim bo'sh bo'lsa
   **ko'rsatilmaydi**. Alohida migratsiya keyin.
3. **Adaptiv bo'lim:** avtomatik (mavzu turi + bosqich → AGENTS matritsasi) + admin override.
   Shell fazasida **mavjudlik** bo'yicha (bank bo'sh bo'lmasa ko'rinadi); matritsa keyingi fazada.
4. **Mashq darajasi:** flashcard / amaliy test / USMLE / case — **MODUL darajasida** (qurilganidek).
   Dars ichida faqat **3 tezkor savol**. Migratsiya kerak emas.

---

## 1. Maqsadli tuzilma

```
MODUL (bosqich → modul_no)
├── MAVZU 1 (dars)  ← yengil sahifa
│   ├── Yuqori qism: modul · mavzu · bosqich · vaqt · o'quv natijalari · progress
│   ├── Asosiy video (bor bo'lsa)
│   ├── Nazariya (video ostida)
│   ├── [Qo'shimcha videolar]   ← keyin (DB yo'q → yashirin)
│   ├── [Materiallar]           ← keyin (DB yo'q → yashirin)
│   ├── Tezkor test (3 savol, izohli, cheksiz urinish)  → /api/kurs/progress
│   └── Xulosa + keyingi mavzu
├── MAVZU 2 …
│
└── BILIMNI MUSTAHKAMLASH (modul markazi)  ← yangi sahifa
    ├── Flashcard        (kurs_flashcardlar, RLS to'g'ridan o'qish)
    ├── Amaliy test      → /api/kurs/test (tur='test', 70% o'tish)
    ├── USMLE            → /api/kurs/test (tur='usmle')
    └── Klinik/interaktiv case → /api/kurs/case
        · Har karta faqat bank bo'sh bo'lmasa ko'rinadi (adaptiv)

BOSQICH YAKUNI
└── Nazorat + sertifikat  ← keyingi faza (modul testlaridan o'tish → bosqich sertifikati)
```

**Nega flashcard modulda, darsda emas:** `kurs_flashcardlar` schema'da `modul_id` ga bog'langan
(dars emas). Har darsda ko'rsatilsa bir bank takrorlanadi. Shuning uchun modul markazida turadi.
Agar keyin darsga ham kerak bo'lsa — qo'shish oson (dars belgisi bilan filtr).

---

## 2. Faza A — Dars viewerini xavfsiz qayta qurish ✅ (PR-1, 2026-09-09)

> **Bajarildi.** `[slug]/page.tsx` xavfsiz qayta yozildi (`test_savollar` jsonb + klient `togri`
> tashlandi). Tezkor test `/api/kurs/progress` orqali; `yakunla` javob YUBORILGANDAN keyin
> izoh+to'g'ri indeksni qaytaradi (formativ, cheksiz urinish). `korildi` — IntersectionObserver
> sentineli. Bosqich akkordeoni progressni `kurs_progress.korildi` dan o'qiydi (`kurs_natijalar` emas).
> Admin dars muharririga `dars_natijalari` (o'quv natijalari, har qatorda bitta) qo'shildi.
> `tsc` toza, `next build` o'tdi. Qarorlar: tezkor test ixtiyoriy (2), modul markazi alohida sahifa (1).
> Qolgan: jonli tekshiruv (admin login + nashr modul + kontent) — production'da.

**Fayl:** `src/app/student/urologiya/darslar/[slug]/page.tsx` (qayta yozildi).

- [ ] `test_savollar` jsonb + klient `togri` solishtirish + `kurs_natijalar` to'g'ridan yozuv — **olib tashlanadi**.
- [ ] `kurs_darslar` dan qo'shimcha maydonlar o'qiladi: `klinik_kirish`, `xulosa`, `dars_natijalari`, `modul_id`.
      Modul konteksti uchun `kurs_modullar` (nom, bosqich) `modul_id` orqali olinadi.
- [ ] **Yuqori qism:** modul nomi · mavzu · bosqich chip · `daqiqa` · `dars_natijalari` (o'quv natijalari) · progress.
- [ ] **Video → Nazariya** tartibi (video bor bo'lsa tepada; yo'q bo'lsa nazariya darrov). Nazariya `.maqola-html`.
- [ ] **Tezkor test (3 savol):**
  - `POST /api/kurs/progress {amal:'tezkor', dars_id}` → savollar (`togri`siz). `409 TEZKOR_BANK_NOT_READY` → bo'lim yashiriladi.
  - Javob → `{amal:'yakunla', dars_id, javoblar:[{savol_id,tanlov}]}` → server bahosi (`togri`, `otdi`, `tugatdim`).
  - Izoh ko'rsatiladi, cheksiz qayta urinish.
- [ ] **Nazariya oxiri:** `{amal:'korildi', dars_id}` (idempotent, `IntersectionObserver` yoki tugma).
- [ ] **Xulosa + keyingi mavzu:** `xulosa` + modul ichidagi keyingi darsga havola (`sort_order`).
- [ ] **Kirish/holat:** 403/404/409 lar toza ko'rsatiladi (bo'sh/pullik/nashr-emas). Bo'sh bo'lim **ko'rsatilmaydi**.
- [ ] **Xato boshqaruvi** (T3 naqshi): `await` + `role="alert"`, saqlanmasa rollback.
- [ ] **A11y** (T4 naqshi): variantlar `<button>` + `aria-pressed`; fokus.
- [ ] `dangerouslySetInnerHTML` faqat `nazariya_html` (admin-yozgan, mavjud naqsh).

**Tekshiruv:** klient `togri` yoki `kurs_savollar` bevosita ololmaydi (RLS); progress serverda; build+tsc.

---

## 3. Faza B — Modul mashq markazi ✅ (PR-2, 2026-09-09)

> **Bajarildi.** `modul/[modulId]/page.tsx` — adaptiv kartalar (Eslab qolish / Qo'llash / Tahlil),
> faqat bank bo'sh bo'lmaganda ko'rinadi. Yangi `/api/kurs/modul` summary route (bank sanoqlari +
> case ro'yxati; `togri`/`bosqichlar` mazmuni chiqmaydi). Flashcard `kurs_flashcardlar` dan
> to'g'ridan (RLS); test/USMLE `/api/kurs/test`; case `/api/kurs/case` bosqichma-bosqich
> (joriy bosqich fikri to'g'ri ko'rsatiladi, keyin keyingi bosqich). Test/USMLE eng yaxshi natija
> `kurs_urinishlar` dan (own RLS) kartada. Kirish: bosqich akkordeonida har modulda «Bilimni
> mustahkamlash» tugmasi + oxirgi darsning tugash tugmasi. `tsc` toza, `next build` o'tdi.
> Qolgan: jonli tekshiruv (nashr modul + flashcard/test/case banklari) — production'da.

**Fayl:** `src/app/student/urologiya/darslar/modul/[modulId]/page.tsx` + `src/app/api/kurs/modul/route.ts`.

- [ ] **Adaptiv kartalar** (faqat bank bo'sh bo'lmaganda):
  - **Flashcard** — `kurs_flashcardlar` (modul, RLS). Flip-karta, shuffle (AGENTS bank hajmlari).
  - **Amaliy test** — `/api/kurs/test {amal:'boshlash', modul_id, tur:'test'}` → savollar; `{amal:'topshirish', urinish_id, javoblar}` → ball/foiz/otdi (70%). `409` → yashirin.
  - **USMLE** — xuddi shu, `tur:'usmle'`.
  - **Klinik/interaktiv case** — `/api/kurs/case` (bosqichma-bosqich, keyingi bosqich serverdan).
- [ ] **Uch guruh** (AGENTS ruhida): Eslab qolish (flashcard) · Qo'llash (test, case) · Tahlil (USMLE, interaktiv).
- [ ] **Ochiq urinish** bo'lsa davom ettiriladi (server partial-unique guardi bor).
- [ ] **Mobil:** kartalar (uzun tab qatori emas), telefon-only 680px.

**Tekshiruv:** `togri` sizmaydi; ikki marta topshirish bitta natija; bo'sh bank 409 → karta yo'q.

---

## 4. Faza C — Adaptiv matritsa (avto + admin override) ✅ (PR-3, 2026-09-09)

> **Bajarildi.** Migratsiya `20260920000000_kurs_modul_mavzu_turi.sql` — `kurs_modullar` ga
> `mavzu_turi` (CHECK bilan 9 tur) + `bolim_override jsonb`. ⏳ **Supabase'da Run kerak.**
> `src/lib/kurs/matritsa.ts` — `tavsiyaBolimlar(mavzu_turi, bosqich)` (AGENTS matritsasi + EASY da
> USMLE/case yo'q qoidasi) va `bolimKorinadi(...)` (override ustma-ust). Summary route
> `mavzu_turi`+`bolim_override` qaytaradi; modul markazi kartani **tavsiya ∩ bank-mavjud − override**
> bo'yicha ko'rsatadi. Admin modullar muharririga mavzu turi selecti + 4 bo'lim uchun
> Avto/Ko'rsat/Yashir boshqaruvi qo'shildi (Avto qiymati jonli ko'rsatiladi). `tsc` toza, `next build` o'tdi.
> `mavzu_turi` NULL bo'lsa eski xatti-harakat (bank bo'yicha) saqlanadi — orqaga mos.

**Fayllar:** migratsiya + `src/lib/kurs/matritsa.ts` + `api/kurs/modul/route.ts` +
`student/.../modul/[modulId]/page.tsx` + `admin/kurs/modullar/page.tsx`.

---

## 5. Faza D — Bosqich sertifikati ✅ (PR-4, 2026-09-09)

> **Bajarildi.** Yangi `/api/kurs/sertifikat` route (`amal: 'holat'|'ber'`) — loyiqlik FAQAT
> serverda, modul testlaridan (`kurs_urinishlar.otdi`, tur='test', 70%) hisoblanadi. Mavjud
> `sertifikatlar` jadvali + `/sertifikat/[kod]` tekshiruv sahifasi qayta ishlatiladi (yangi jadval
> yo'q). AGENTS qoidalari: sertifikat faqat O'rta/Qiyin (EASY da yo'q); majburiy modulda test
> banki yo'q yoki nashr emas bo'lsa → bosqich **tayyorlanmoqda**, sertifikat berilmaydi (qadrini
> saqlash). Bosqich sahifasida progress + holat kartasi (o'tildi / tayyorlanmoqda / olish / ko'rish).
> `sertifikatlar` bosqichi apostrofli ("o'rta") — `bosqichMap` bilan moslashtirildi. `tsc` toza,
> `next build` o'tdi (to'liq).
>
> ⚠️ Hozir L2/L3 modullari `draft` (paywall CHECK) — shu sabab orta/qiyin sertifikati **tabiiy
> ravishda "tayyorlanmoqda"** holatida turadi; modullar nashr qilingach ochiladi (kutilgan xatti-harakat).

**Fayllar:** `src/app/api/kurs/sertifikat/route.ts` + `student/.../bosqich/[bosqich]/page.tsx`
(SertifikatKarti). Yangi migratsiya YO'Q.

### 5.1 Keyingi (ixtiyoriy)
- [ ] Alohida bosqich yakuniy imtihoni (hozir modul testlari yig'indisi sertifikat sharti).
- [ ] Sertifikatlar sahifasida (`profil/sertifikatlar`) yangi kurs sertifikatini ko'rsatish.

---

## 6. Faza E — Yashirin bo'limlarni ochish (DB bilan) 🔵 (keyin)

- [ ] **Qo'shimcha videolar:** `kurs_videolar` (modul_id/dars_id, platforma, url, sarlavha, tavsif, davomiylik, sabab).
      Tashqi embed majburiy emas; ishlamasa sahifa buzilmaydi; progressга ta'sir qilmaydi; manba/huquq majburiy.
- [ ] **Materiallar:** `kurs_materiallar` (Supabase Storage, WebP/PDF; AGENTS: Google Drive/base64 yo'q).
- [ ] Asosiy videoga subtitr/transkript (mobil trafik + ovozsiz ko'rish).

---

## 7. Bosqichma-bosqich yetkazish

| PR | Faza | Asosiy fayllar |
|----|------|----------------|
| PR-1 | A — dars viewer | `student/urologiya/darslar/[slug]/page.tsx` (+ kichik hook fayllar) |
| PR-2 | B — modul markazi | `student/urologiya/darslar/modul/[modulId]/*` |
| PR-3 | C — adaptiv matritsa | migratsiya + `lib/kurs/matritsa.ts` + admin praktikum |
| PR-4 | D — nazorat/sertifikat | server route + bosqich sahifasi |
| PR-5 | E — video/material DB | migratsiya + admin + viewer bo'limlari |

Har PR push→production'da tekshiriladi (loyiha qoidasi). Migratsiyani foydalanuvchi Run qiladi.

---

## 8. Ochiq kichik qarorlar

1. Modul markazi alohida route (`modul/[id]`) bo'lsinmi yoki bosqich akkordeonida kengayuvchi bo'limmi?
2. Tezkor test dars progressiga (`tugatdim`) qanchalik bog'lansin — majburiymi yoki ixtiyoriy?
3. `dars_natijalari` (o'quv natijalari) admin muharririda hozir to'ldiriladimi yoki keyin?
