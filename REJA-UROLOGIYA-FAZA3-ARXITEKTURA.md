# Faza 3 — Texnik arxitektura (loyiha)

> Urologiya 3-Level kurs. Kontent modeli tasdiqlangan: [REJA-UROLOGIYA-KONTENT.md](REJA-UROLOGIYA-KONTENT.md) (commit `5139d99`).
> **Bu hujjat — faqat dizayn.** Migratsiya, admin panel yoki production kod YOZILMAYDI.
> Doktor tasdiqlagach → Faza 4 (implementatsiya) alohida ish rejasi bilan boshlanadi.

*Yaratilgan: 2026-09-02.*

---

## 0. Doira va tamoyillar

- **Server-authoritative:** progress, test bahosi, sertifikat — hech qachon klientga ishonilmaydi. Mavjud namuna: `src/app/api/nazorat/urinish/route.ts` (`createServerSupabase` + `createAdminClient`, idempotent guard `.is('yakunlangan_at', null)`).
- **Additiv migratsiya:** eski jadval/ustunlar darrov o'chirilmaydi (orqaga moslik). Cleanup — alohida keyingi migratsiya.
- **RLS default:** `is_admin()` mavjud (`supabase/…/is_admin`). Talaba faqat o'z ma'lumotini va **nashr** qilingan kontentni ko'radi.
- **Javob maxfiyligi:** `togri` (to'g'ri variant) hech qachon talabaga RLS orqali oqib chiqmaydi — savollar server route orqali `togri`siz beriladi, baho serverda qo'yiladi.

---

## 1. Mavjud kod bilan to'qnashuvlar (avval hal qilinadigan)

| Joy | Hozir | To'qnashuv / rejalashtirilgan |
|-----|-------|-------------------------------|
| `src/app/student/urologiya/darslar/bosqich/[bosqich]/page.tsx` | `kurs_darslar` ni to'g'ridan o'qiydi, `modul_no`/`modul_nom` bo'yicha guruhlaydi | Modullar `kurs_modullar` dan olinadi, darslar `modul_id` bo'yicha. `modul_no` backfill saqlanmaguncha eski sahifa ishlaydi |
| `src/app/student/urologiya/darslar/[slug]/page.tsx` (viewer) | Per-dars `test_savollar`, submitda `kurs_natijalar` ga yozadi | Test → **modul** darajasiga; darsda tezkor savol (`kurs_savollar`, `dars_id`) route orqali. Progress `kurs_progress` + server route |
| `src/app/admin/urologiya-darslar/page.tsx` | Bitta forma, `modul_no`/`modul_nom` qo'lda; KebabMenu (commit qilingan) | 3 muharrir; `modul_id` picker. O'tish davrida ikkalasi ishlaydi |
| `src/app/student/urologiya/darslar/page.tsx` (landing) | `kurs_darslar` `bolim=darslar` sanoq | Modul sanoq `kurs_modullar` dan olinishi mumkin (ixtiyoriy) |
| `src/app/student/dashboard/page.tsx` | "Yangi darslar" + "Eski darslar" 2 karta | §8: bitta "Urologiya kursi" + "Arxiv" (keyingi commit) |
| `kurs_natijalar` (mavjud jadval) | Per-dars test natijasi | Legacy bo'ladi — yozish to'xtaydi, ma'lumot saqlanadi |

**Xulosa:** barcha to'qnashuvlar **additiv o'tish** bilan hal bo'ladi — `modul_no`/`modul_nom` va `kurs_natijalar` migratsiya davomida saqlanadi, sahifalar bosqichma-bosqich `kurs_modullar`/`kurs_progress` ga o'tkaziladi.

---

## 2. Jadval sxemalari (to'liq)

Barchasi `IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` — idempotent. RLS nomlari `kurs_*` oilasi bilan izchil (inglizcha), `gin_darslar` kabi.

**Umumiy konvensiyalar (barcha jadval):** `id uuid primary key default gen_random_uuid()` · `created_at timestamptz not null default now()` · `updated_at` bo'lgan jadvallarda (`kurs_modullar`, `kurs_darslar`, `kurs_progress`) — **umumiy `set_updated_at()` trigger funksiyasi** `BEFORE UPDATE` da `updated_at=now()` qo'yadi · `sort_order int not null default 0`. **JSON maydonlar** (`variantlar`, `natijalar`, `savol_ids`, `bosqichlar`, `notogri_izoh`) shakli **server validatsiyasida** tekshiriladi (DB faqat `jsonb` turini kafolatlaydi).

### 2.1 `kurs_modullar` (YANGI)
| Ustun | Turi | Cheklov |
|-------|------|---------|
| id | uuid | PK, default `gen_random_uuid()` |
| yonalish | text | NOT NULL, default `'urologiya'` |
| bosqich | text | NOT NULL, CHECK in (`oson`,`orta`,`qiyin`) |
| tartib | int | NOT NULL — global modul № (1–34, capstone 35) |
| slug | text | NOT NULL, UNIQUE — barqaror id (masalan `uro-orta-m8`) |
| nom | text | NOT NULL |
| maqsad | text | NULL |
| natijalar | jsonb | NOT NULL, default `'[]'` (modul natijalari) |
| majburiy | boolean | NOT NULL, default `true` |
| track | text | NULL (`endourologiya`/`uroonkologiya`/… — faqat advanced) |
| kredit | int | NOT NULL, default `1`, CHECK `kredit > 0` |
| bepul | boolean | NOT NULL, default `false` |
| daqiqa | int | NOT NULL, default `0` (hisoblanadi) |
| ikonka | text | NULL |
| holat | text | NOT NULL, default `'draft'`, CHECK in (`draft`,`nashr`) |
| sort_order | int | NOT NULL, default `0` |
| created_at / updated_at | timestamptz | NOT NULL, default `now()` |

- **UNIQUE:** `(yonalish, bosqich, tartib)` + `slug` unique.
- **Index:** `(yonalish, bosqich, sort_order)`; `(track)`.
- **RLS:** SELECT `USING (public.is_admin() OR (auth.uid() IS NOT NULL AND holat='nashr'))`; ALL (admin) `USING/ WITH CHECK (public.is_admin())`.

### 2.2 `kurs_darslar` (MAVJUD → kengaytiriladi)
Qo'shiladigan ustunlar:
| Ustun | Turi | Cheklov |
|-------|------|---------|
| modul_id | uuid | REFERENCES `kurs_modullar(id)` ON DELETE **RESTRICT** (dars yetim qolmasin) |
| tur | text | NOT NULL, default `'asosiy'`, CHECK in (`asosiy`,`bolim`) |
| dars_natijalari | jsonb | NOT NULL, default `'[]'` |
| klinik_kirish | text | NULL |
| xulosa | text | NULL |
| bepul_namuna | boolean | NOT NULL, default `false` |
| holat | text | NOT NULL, default `'draft'`, CHECK in (`draft`,`nashr`) |

> ⚠️ **`tezkor_savollar` `kurs_darslar` da SAQLANMAYDI** — talaba `kurs_darslar` ni to'g'ridan SELECT qilib `togri` javobni oladi. Tezkor savollar ham `kurs_savollar` da (`dars_id` bilan, `tur='tezkor'`), faqat server route orqali `togri`siz (§2.4).

- **Eskiradi (saqlanadi):** `modul_no`, `modul_nom` (backfill manbasi); `test_savollar` (per-dars test — endi modul darajasida).
- **Index:** `(modul_id, sort_order)`.
- **RLS (yangilanadi):** talabaga faqat `holat='nashr'` darslar. Joriy `faol` bilan birga: SELECT `USING (public.is_admin() OR (auth.uid() IS NOT NULL AND faol AND holat='nashr'))`.

### 2.3 `kurs_flashcardlar` (YANGI)
| id uuid PK default gen_random_uuid() | modul_id uuid NOT NULL REFERENCES `kurs_modullar(id)` ON DELETE **CASCADE** | old text NOT NULL | yangi text NOT NULL | kategoriya text | sort_order int NOT NULL default 0 | created_at timestamptz NOT NULL default now() |
- **Index:** `(modul_id, sort_order)`.
- **RLS:** SELECT `USING (public.is_admin() OR (auth.uid() IS NOT NULL AND EXISTS(SELECT 1 FROM kurs_modullar m WHERE m.id=modul_id AND m.holat='nashr')))`; ALL admin.
  *(Anonim `auth.uid() IS NOT NULL` bilan aniq bloklanadi. Foundation'ni login qilmaganга ochish — kelajakda alohida ongli policy.)*

### 2.4 `kurs_savollar` (YANGI — tezkor + modul test + USMLE banki)
| Ustun | Turi | Cheklov |
|-------|------|---------|
| id | uuid | PK, default `gen_random_uuid()` |
| tur | text | NOT NULL, CHECK in (`tezkor`,`test`,`usmle`) |
| modul_id | uuid | NULL, REFERENCES `kurs_modullar(id)` ON DELETE CASCADE |
| dars_id | uuid | NULL, REFERENCES `kurs_darslar(id)` ON DELETE CASCADE |
| savol | text | NOT NULL |
| variantlar | jsonb | NOT NULL |
| togri | int | NOT NULL, CHECK `togri >= 0` |
| izoh | text | NULL |
| notogri_izoh | jsonb | NOT NULL, default `'{}'` (variant→sabab) |
| qayta_kor_dars_id | uuid | NULL, REFERENCES `kurs_darslar(id)` ON DELETE **SET NULL** |
| xato_kategoriya | text | NULL |
| sort_order | int | NOT NULL, default `0` |
| created_at | timestamptz | NOT NULL, default `now()` |

- **CHECK (eksklyuziv bog'lanish)** — savol bir vaqtda ham darsga, ham modulga bog'lanmaydi:
  ```sql
  CHECK (
    (tur = 'tezkor'          AND dars_id  IS NOT NULL AND modul_id IS NULL)
    OR
    (tur IN ('test','usmle') AND modul_id IS NOT NULL AND dars_id  IS NULL)
  )
  ```
- **`qayta_kor_dars_id`** (slug emas — ID): dars slug'i o'zgarsa xatolar xaritasi buzilmaydi. Talaba interfeysiga slug kerak bo'lsa JOIN bilan olinadi.
- **Index:** `(modul_id, tur)`; `(dars_id)`.
- **RLS (MUHIM):** SELECT **faqat `is_admin()`** — talaba `togri` ni hech qachon ko'rmaydi. Tezkor savollar `/api/kurs/progress`, modul test/USMLE `/api/kurs/test` orqali `togri`siz beriladi. ALL admin.

### 2.5 `kurs_caselar` (YANGI)
| id uuid PK default gen_random_uuid() | modul_id uuid NOT NULL REFERENCES `kurs_modullar(id)` ON DELETE CASCADE | sarlavha text NOT NULL | bosqichlar jsonb NOT NULL default '[]' (interaktiv qadamlar: matn, variantlar, `togri`, izoh) | sort_order int NOT NULL default 0 | created_at timestamptz NOT NULL default now() |
- **RLS (MUHIM):** SELECT **faqat `is_admin()`**. PostgreSQL RLS JSON ichidagi `togri` ni alohida yashira olmaydi — butun qator ko'rinadi. Shuning uchun talaba case'ni **`/api/kurs/case` orqali** oladi: route `togri`, ichki scoring va **keyingi bosqich javoblarini yubormaydi**; har bosqich javobi serverda tekshiriladi, keyingi bosqich **shundan keyin** qaytariladi. ALL admin.
  *(Muqobil: public narrativ + private bosqichlar alohida jadval — MVP uchun admin-only + server route soddaroq.)*

### 2.6 `kurs_progress` (YANGI — dars darajasi)
| Ustun | Turi | Cheklov |
|-------|------|---------|
| id | uuid | PK, default `gen_random_uuid()` |
| student_id | uuid | NOT NULL REFERENCES `profiles(id)` ON DELETE CASCADE |
| dars_id | uuid | NOT NULL REFERENCES `kurs_darslar(id)` ON DELETE CASCADE |
| korildi | boolean | NOT NULL, default `false` (nazariya oxirigacha) |
| tugatdim | boolean | NOT NULL, default `false` (dars yakunlandi) |
| tezkor_togri | int | NULL |
| tezkor_jami | int | NULL |
| created_at | timestamptz | NOT NULL, default `now()` |
| updated_at | timestamptz | NOT NULL, default `now()` (trigger) |
- **CHECK (DB invariantlari)** — server route asosiy nazorat, DB constraint kod xatosidan himoya:
  ```sql
  CHECK (
    (tezkor_togri IS NULL AND tezkor_jami IS NULL)
    OR (tezkor_togri IS NOT NULL AND tezkor_jami = 3 AND tezkor_togri BETWEEN 0 AND tezkor_jami)
  ),
  CHECK (
    NOT tugatdim
    OR (korildi AND tezkor_jami = 3 AND tezkor_togri >= 2)
  )
  ```
  (tugallangan darsda tezkor natija NULL bo'la olmaydi; `tugatdim` ⇒ `korildi` va ≥2/3.)
- **UNIQUE:** `(student_id, dars_id)`.
- **Index:** `(student_id)`.
- **RLS:** SELECT `USING (student_id=auth.uid() OR public.is_admin())`. **INSERT/UPDATE yo'q** (klient yozmaydi) — barcha yozuv `/api/kurs/progress` orqali `createAdminClient` (service role) bilan. Sabab: `korildi` va `tugatdim` ikkalasi ham server-authoritative.
- **`korildi` haqida:** brauzer faqat "oxiriga yetildi" deydi — mutlaq isbot emas. Sertifikatning asosiy isboti — tezkor savol + modul testi + yakuniy nazorat. `korildi` route **idempotent va yengil**: `(student_id,dars_id)` upsert, qayta yuborilganda yangi qator yaratmaydi.

### 2.7 `kurs_urinishlar` (YANGI — modul test/case urinishlari, attempt-lifecycle)
| Ustun | Turi | Cheklov |
|-------|------|---------|
| id (attempt_id) | uuid | PK, default `gen_random_uuid()` |
| student_id | uuid | NOT NULL REFERENCES `profiles(id)` ON DELETE CASCADE |
| modul_id | uuid | NOT NULL REFERENCES `kurs_modullar(id)` ON DELETE CASCADE |
| case_id | uuid | NULL, REFERENCES `kurs_caselar(id)` ON DELETE CASCADE |
| tur | text | NOT NULL, CHECK in (`test`,`usmle`,`case`) |
| savol_ids | jsonb | NULL (test/usmle da tanlangan savol ID'lari + tartib; case da bo'sh/NULL) |
| boshlangan_at | timestamptz | NOT NULL, default `now()` |
| yakunlangan_at | timestamptz | NULL |
| ball | int | NULL |
| jami | int | NULL |
| foiz | int | NULL |
| otdi | boolean | NOT NULL, default `false` |
| javoblar | jsonb | NULL (xatolar xaritasi) |
| created_at | timestamptz | NOT NULL, default `now()` |

- **CHECK (turga mos bog'lanish):**
  ```sql
  CHECK (
    (tur IN ('test','usmle') AND case_id IS NULL)
    OR (tur = 'case' AND case_id IS NOT NULL)
  )
  ```
- **CHECK (attempt holati):** ochiq urinishda natija bo'sh; ballanadigan yakunlangan urinishda to'ldirilgan; oddiy o'quv case yakunlanganda ball/foiz NULL qolishi mumkin:
  ```sql
  CHECK ( yakunlangan_at IS NOT NULL
          OR (ball IS NULL AND jami IS NULL AND foiz IS NULL AND otdi = false) ),  -- ochiq attempt
  CHECK ( ball IS NULL OR (jami IS NOT NULL AND ball >= 0 AND ball <= jami) ),
  CHECK ( jami IS NULL OR jami > 0 ),
  CHECK ( foiz IS NULL OR foiz BETWEEN 0 AND 100 )
  ```
  *(Ballanadigan yakunlangan attempt ball'ga ega bo'lishi — server route majburiyati; DB berilgan case Capstone/balli ekanini bilmaydi.)*
- **Idempotentlik (bitta ochiq urinish, turga qarab):**
  - test/USMLE: **partial UNIQUE** `(student_id, modul_id, tur) WHERE yakunlangan_at IS NULL`.
  - case: **partial UNIQUE** `(student_id, case_id) WHERE yakunlangan_at IS NULL`.
  - `boshlash` → attempt yaratadi (test/usmle da `savol_ids` tartib bilan), `togri`siz qaytaradi.
  - `topshirish` → aynan shu attempt baholanadi; yakunlash guard: `UPDATE ... WHERE id=attempt AND yakunlangan_at IS NULL` (bir marta), aks holda mavjud natija qaytariladi.
- Retry cheklanmagan → yakunlangan urinishlar **tarix** (partial unique faqat ochiqni cheklaydi). "Modul o'tildi" = `EXISTS urinish WHERE otdi` (test); oddiy case = `EXISTS urinish WHERE yakunlangan_at IS NOT NULL`.
- **Index:** `(student_id, modul_id, tur)`; `(student_id, case_id)`.
- **RLS:** SELECT own+admin; yozuv **faqat server route** (baho serverda). Klient INSERT yo'q.

### 2.8 `kurs_xatolar` — **JADVAL EMAS**
`kurs_urinishlar.javoblar` + `kurs_savollar.xato_kategoriya`/`qayta_kor_dars_id` dan **hisoblanadi** (kuchsiz mavzu, takror xato, qayta ko'rish darsi). Qo'lda yozilmaydi.

---

## 3. Orqaga moslik va migratsiya

1. **`modul_no`/`modul_nom` umri:** Faza 4–6 davomida saqlanadi. Talaba bosqich sahifasi + admin muharrir + landing `kurs_modullar`/`modul_id` ga to'liq o'tib, to'liq re-seed tekshirilgach → **alohida cleanup migratsiya** ustunlarni `DROP` qiladi. Darrov o'chirilmaydi.
2. **`kurs_modullar` ni 126 skeletdan yaratish:**
   ```
   INSERT INTO kurs_modullar (yonalish, bosqich, tartib, slug, nom, holat, sort_order)
   SELECT DISTINCT yonalish, bosqich, modul_no,
          yonalish||'-'||bosqich||'-m'||modul_no  AS slug,
          modul_nom, 'draft', modul_no
   FROM kurs_darslar
   ON CONFLICT (slug) DO NOTHING;
   ```
3. **`modul_id` backfill:**
   ```
   UPDATE kurs_darslar d SET modul_id = m.id
   FROM kurs_modullar m
   WHERE d.modul_id IS NULL
     AND m.yonalish=d.yonalish AND m.bosqich=d.bosqich AND m.tartib=d.modul_no;
   ```
4. **Qayta bajarilganda dublikat yo'q:** jadval/ustun `IF NOT EXISTS`; seed `ON CONFLICT (slug) DO NOTHING`; backfill `WHERE modul_id IS NULL`. Idempotent.
5. **`kurs_natijalar` (legacy):** o'chirilmaydi, yozish to'xtaydi. Yangi progress `kurs_progress`/`kurs_urinishlar` da. **"Bo'sh" deb taxmin qilinmaydi** — cleanup oldidan tekshiriladi: qatorlar soni, distinct studentlar, dars sluglari, yangi tizimga moslashtirish mumkinligi. Faqat tekshiruvdan keyin **migrate / archive / drop** qarori qabul qilinadi.

---

## 4. Progress holatlari

Faqat **dars-daraja** saqlanadi (`kurs_progress`); modul/bosqich holati **o'qishda hisoblanadi**.

| Holat | Ta'rif (manba) |
|-------|----------------|
| **boshlanmagan** | `kurs_progress` qatori yo'q yoki `korildi=false, tugatdim=false` |
| **davom etmoqda** | `korildi=true, tugatdim=false` |
| **dars tugallangan** | `tugatdim=true` |
| **modul tugallangan** | moduldagi barcha `majburiy` (tur=`asosiy`) darslar `tugatdim=true` **VA** `EXISTS kurs_urinishlar(otdi=true, tur=test)` **VA** (zarur bo'lsa) case **yakunlangan** (o'quv case — balli emas, faqat yakunlangan holati) |
| **bosqich tugallangan** | bosqichdagi barcha `majburiy` modullar tugallangan **VA** yakuniy nazorat ≥70% (Foundation'da nazorat/sertifikat yo'q — faqat badge/progress; nazorat L2/L3 da) |

Hisoblash o'qish paytida (yoki keshlangan ko'rinish/RPC) — alohida "modul tugadi" ustuni saqlanmaydi (yagona manba printsipi).

---

## 5. Gating — server tomondagi yagona manba

Barcha "o'tish/tugatish" qarorlari serverda:

| Qoida | Manba | Amalga oshirish |
|-------|-------|-----------------|
| Dars: 3 tezkor savoldan ≥2 to'g'ri | `kurs_savollar` (`tur='tezkor'`, `dars_id`) | `/api/kurs/progress` (amal=`yakunla`): savollarni `togri`siz beradi, javoblarni serverda tekshiradi, `tugatdim` qo'yadi |
| Modul testi ≥70% | `kurs_savollar` | `/api/kurs/test` (amal=`topshirish`): baho serverda, `kurs_urinishlar.otdi` |
| Zarur case yakunlangan | `kurs_caselar` | `/api/kurs/case` (ballanadigan bo'lsa) |
| Obuna + bepul namuna | `profiles`/obuna + `kurs_darslar.bepul_namuna`, `kurs_modullar.bepul` | Kirish modeli: **bepul modul YOKI bepul namuna dars YOKI faol obuna** (§quyida) |
| Advanced kredit talabi | `kurs_modullar.kredit`, `track`, `majburiy` | Sertifikat hisoblash server helperi (§6) |

**Klientga ishonmaslik:** `togri` javoblar hech qachon klientга yuborilmaydi; savollar route orqali `togri`siz keladi; `korildi`/`tugatdim`/`otdi` faqat server yozadi (RLS klient yozuvini bloklaydi).

**Paywall chegarasi (hozirdan arxitekturada):** Hozirgi RLS faqat `holat='nashr'` ni tekshiradi — pullik dars **nashr** qilinganda kontenti to'g'ridan Supabase orqali ochilib ketadi. Shuning uchun L2/L3 enforcement keyingi commitda bo'lsa ham:
- **Faza 4 da Foundation'dan boshqa (L2/L3) kontent `draft` bo'lib qoladi** — nashr qilinmaydi;
- L2/L3 ni `nashr` qilish **paywall policy/server-access helper tayyor bo'lmaguncha bloklanadi** (admin nashr amali ham shu shartni tekshiradi);
- **Kirish modeli** (kelajakda server-access helperda): dars ochiladi ⇐ modul `bepul` **YOKI** dars `bepul_namuna` **YOKI** talaba faol obunaga ega. Foundation bepul ishlaydi.

---

## 6. `kredit` va Advanced sertifikat hisobi

- Har modulda `kredit int not null default 1` (katta modul 2–3).
- **Foundation yakuni (sertifikat YO'Q):** barcha majburiy Foundation modullari + yakuniy bilim tekshiruvi → **rasmiy sertifikat berilmaydi**, faqat bosqich tugallangan **badge/progress**. (§KONTENT: sertifikat Foundation'dan tashqari.)
- **Clinical sertifikati:** Foundation yakunlangan + barcha Clinical majburiy modullari + Clinical yakuniy nazorati ≥70%.
- **Advanced sertifikati:** `31` + `34` + `Capstone` majburiy tugallangan **VA** ≥2 xil `track` dan jami ≥4 tanlov moduli tugallangan. Batafsil merge'dan keyin talab **kredit yig'indisi** bo'yicha qayta ko'riladi (masalan Σkredit ≥ N) — shuning uchun `kredit` maydoni oldindan saqlanadi.
- Hisob **server helperida** (`lib/kurs/sertifikat.ts`), klient faqat natijani ko'radi.
- **Case va ball:** oddiy modul case'i o'quv (yakunlangan holati, 70% ga qo'shilmaydi); **faqat Advanced Capstone** ballanadigan case (`kurs_urinishlar` `tur='case'`).

---

## 7. Admin arxitekturasi

| Muharrir | Jadval | Maydonlar |
|----------|--------|-----------|
| **Modul muharriri** | `kurs_modullar` | yonalish, bosqich, tartib, slug, nom, maqsad, natijalar, majburiy, track, kredit, bepul, ikonka, holat, sort_order |
| **Dars muharriri** | `kurs_darslar` (+ `kurs_savollar` `tur='tezkor'`) | modul (picker → modul_id), nom, slug, tur, dars_natijalari, klinik_kirish, nazariya_html, video_url, **tezkor savollar (2–3 — `kurs_savollar` da, `dars_id` bilan)**, xulosa, daqiqa, bepul_namuna, holat, sort_order |
| **Praktikum muharriri** | `kurs_flashcardlar`, `kurs_savollar`, `kurs_caselar` | tablar: Flashcard · Test · USMLE · Case. Egasi — modul |

- **Draft → Preview → Nashr:** `holat` (modul va dars). "Talaba ko'rinishida ko'rish" (preview) — nashrsiz. Nashr = talabaga ochiladi.
- **Tayyorlik o'lchagichi:** modul bo'yicha hisoblanadi (nazariya N/N, tezkor savol, flashcard, modul testi, case) → foiz + [Nashr] tugmasi.
- **Kirish:** faqat admin (`role='admin'`), joriy sahifadagidek route guard.

---

## 8. Talaba interfeysi

- **Modul kartasi (yopiq):** `tartib`-modul · nom · N dars • daqiqa • % bajarildi. Ochilganda darslar (✓/▶/🔒) + [Modul praktikumi].
- **Dars viewer (5 qism):** natija · klinik kirish · nazariya (`.maqola-html`) · 3 tezkor savol (route bahoi) · xulosa. Test yo'q (u modulda).
- **Praktikum:** modul sahifasida — flashcard, modul testi, USMLE, case; "Xatolar xaritasi" (hisoblangan).
- **Qulf:** dars — oldingi dars `tugatdim` bo'lsa ochiladi (server progress). Modul — oldingi modul tugallanganda.
- **"Davom ettirish" manzili:** oxirgi `kurs_progress.updated_at` bo'yicha keyingi tugallanmagan dars → `/student/urologiya/darslar/[slug]`.
- **Arxiv:** eski `/student/darslar` → "Qo'shimcha materiallar / Arxiv" (dashboard bitta "Urologiya kursi" kartasi — keyingi commit).

---

## 9. API va server amallari

**To'g'ridan-to'g'ri Supabase (RLS, o'qish):**
- Nashr modul/dars ro'yxati va kontenti (bepul yoki obunali) — `kurs_modullar`, `kurs_darslar` SELECT.
- Flashcard (nashr modul) — `kurs_flashcardlar` SELECT.
- Talaba o'z progressi — `kurs_progress`, `kurs_urinishlar` SELECT.

**Server route orqali (mutatsiya / maxfiy):**
| Route | Amal | Nega server |
|-------|------|-------------|
| `/api/kurs/progress` | `korildi`, `yakunla` (tezkor savol bahoi → `tugatdim`) | Klient tugatdim yoza olmaydi; javob serverda tekshiriladi |
| `/api/kurs/test` | `boshlash` (savollar `togri`siz), `topshirish` (baho, `kurs_urinishlar`) | `togri` sizmaydi; foiz serverda; idempotent guard |
| `/api/kurs/case` | ballanadigan case bahoi | Yuqoridagidek |
| `/api/kurs/sertifikat` (o'qish) | kredit/track hisobi | Yagona manba serverda |

**Modul test attempt hayotiy sikli** (`/api/kurs/test`, `nazorat_urinishlari` naqshi):
1. **`boshlash`** → ochiq urinish bormi tekshiradi (partial unique); yo'q bo'lsa savollarni tanlaydi, `savol_ids` (tartib bilan) saqlaydi, attempt yaratadi.
2. **savollarni `togri`siz qaytaradi** (klient `togri` ni ko'rmaydi).
3. **`topshirish`** → aynan shu attemptning `savol_ids` bo'yicha baholaydi.
4. **bir marta yakunlash** → `UPDATE ... WHERE id=attempt AND yakunlangan_at IS NULL`; qayta yuborilsa mavjud natija qaytariladi (dublikat urinish yaratilmaydi).

- **Naqsh:** `createServerSupabase()` (auth) + `createAdminClient()` (service role), `nazorat/urinish/route.ts` kabi.
- **Validatsiya/xato:** 401 (kirilmagan), 400 (noto'g'ri javob shakli), 403 (obuna yo'q), 404 (kontent yo'q), 409 (allaqachon yakunlangan / vaqt tugagan). Idempotentlik: `.is(...null)` guard.
- **Muhim natijaga klient ishonchsiz:** sertifikat/otdi/tugatdim — faqat server.

---

## 10. Implementatsiya — mustaqil commitlar

1. **schema/migratsiya** — `kurs_modullar` + `ALTER kurs_darslar` + `kurs_flashcardlar`/`kurs_savollar`/`kurs_caselar`/`kurs_progress`/`kurs_urinishlar` + RLS + seed/backfill (idempotent)
2. **server API va progress** — `/api/kurs/progress`, `/api/kurs/test`, (case), `lib/kurs/sertifikat.ts` + validatsiya
3. **admin modul muharriri**
4. **admin dars muharriri** (modul_id picker + shablon maydonlari)
5. **praktikum muharriri** (flashcard/test/usmle/case)
6. **talaba modul sahifasi** (akkordeon `kurs_modullar` dan + praktikum kirishi)
7. **dars viewer + gating** (5 qism + tezkor savol route)
8. **integratsion / end-to-end testlar**

**Testlar oxirgi commitga qoldirilmaydi:** har implementatsiya commiti (1–7) o'ziga tegishli testlar bilan birga keladi (masalan schema commiti — RLS/backfill testi; server API commiti — baho/idempotentlik testi). 8-commitda faqat integratsion va uchidan-uchiga tekshiruvlar qoladi.
Har commit mustaqil deploy bo'la oladi (additiv; eski sahifa buzilmaydi).

---

## 11. Qarorlar — YOPILGAN *(doktor, 2026-09-02)*
1. **Modul/bosqich holati:** MVP'da har o'qishda **server helper** orqali hisoblanadi. Materialized view/cache hozir yo'q — yagona manba muhimroq. Og'irlashsa keyin RPC/cache qo'shiladi.
2. **L2/L3 paywall:** alohida keyingi commitda; ungacha L2/L3 kontent **nashr qilinmaydi** (draft). Foundation bepul ishlaydi.
3. **Case baholanishi:** oddiy modul case'i **o'quv formatida** — foizli imtihon emas; qarorlar serverda tekshiriladi; **yakunlangan/yakunlanmagan** saqlanadi; noto'g'ri javobdan keyin izoh berilib davom etishga ruxsat. Clinical/Advanced'da zarur case modulni tugatish sharti bo'lishi mumkin, lekin **balli modul testidagi 70% ga qo'shilmaydi**. **Faqat Advanced Capstone** alohida ballanadigan case.
4. **`kurs_progress` yozuvi:** `korildi` ham, `tugatdim` ham **server route** orqali (tasdiqlangan). `korildi` yengil/idempotent.

### Qolgan texnik savollar (Faza 4/5 da hal)
- `kurs_natijalar` (legacy) taqdiri — §3.5/§9 tekshiruvidan keyin (migrate/archive/drop).
- Advanced sertifikat kredit chegarasi (Σkredit) — Advanced batafsil merge'dan keyin aniq son.

## 12. Xavflar va rollback
- **Additiv migratsiya** — rollback = yangi jadval/ustunlarni `DROP` (ma'lumot yangi, yo'qotish yo'q). `kurs_darslar` eski ustunlari tegilmaydi.
- **RLS xatosi** (maxfiylik) — eng katta xavf. `kurs_savollar` SELECT faqat admin ekani migratsiyada va testda tasdiqlanadi (talaba `togri` ni ololmasin).
- **Backfill xatosi** — `modul_id` NULL qolgan darslar; guard: migratsiya oxirida `SELECT count(*) WHERE modul_id IS NULL` = 0 tekshiruvi.
- **Ikki tizim parallel** — eski `modul_no` sahifasi va yangi `modul_id` sahifasi bir vaqtda; backfill sinxron bo'lsa xavf yo'q.

## 13. Faza chegarasi va acceptance criteria

**Faza 4 = "migratsiya va admin skeleti"** (pilot modul BU FAZAGA KIRMAYDI):
- Sxema + backfill: migratsiya idempotent (2× Run — xatosiz, dublikatsiz); `modul_id IS NULL` = 0.
- RLS: talaba `kurs_savollar.togri` / `kurs_caselar` / draft kontentni **hech qanday yo'l bilan** ololmaydi (RLS + route testi); `korildi`/`tugatdim`/`otdi` klientdan yozib bo'lmaydi.
- Server route **skeletlari** (`/api/kurs/progress`, `/api/kurs/test`, `/api/kurs/case`) — asosiy oqim + guardlar.
- Admin **uch muharrir skeleti** (modul/dars/praktikum) — CRUD, draft→nashr.
- **Eski sahifa buzilmaydi** (additiv o'tish).

**Keyingi faza (pilot):** SYI (8-modul) admindan talabagacha to'liq ishlaydi — bu **alohida faza acceptance criteria'si**, Faza 4 ga qo'shilmaydi.

## 14. O'zgaradigan/yangi fayllar (taxminiy)
- `supabase/migrations/2026xxxx_kurs_modul_arxitektura.sql` (yangi)
- `src/lib/kurs/sertifikat.ts`, `src/lib/kurs/progress.ts` (yangi helperlar)
- `src/app/api/kurs/progress/route.ts`, `.../test/route.ts`, `.../case/route.ts` (yangi)
- `src/app/admin/urologiya-darslar/…` — modul/dars/praktikum muharrirlariga bo'linadi
- `src/app/student/urologiya/darslar/bosqich/[bosqich]/page.tsx` — `kurs_modullar` dan o'qish
- `src/app/student/urologiya/darslar/[slug]/page.tsx` — 5 qism + tezkor savol route
- `src/app/student/urologiya/darslar/modul/[slug]/…` — praktikum sahifasi (yangi)
- `src/app/student/dashboard/page.tsx` — bitta kurs kartasi + arxiv (keyingi)

## 15. Test strategiyasi
- **Migratsiya:** idempotentlik (2× Run), backfill to'liqligi, RLS (talaba `togri`/draft ololmasligi) — SQL/manual.
- **Server route:** tezkor savol bahoi (≥2/3), modul test foizi, idempotent guard, 401/403/409 holatlari.
- **Gating:** dars/modul/bosqich qulfi to'g'ri hisoblanishi.
- **Admin:** draft ko'rinmasligi, nashrdan keyin ko'rinishi.
- Loyihada `tests/*.test.mjs` mavjud — shu uslubda progress/gating uchun test qo'shiladi.
