# REJA — UROLOGIYA FAZA 4: IMPLEMENTATSIYA

> **Doira:** Faza 4 = *«migratsiya va admin skeleti»*. Bu hujjat kod emas —
> implementatsiya rejasi. Migratsiya, API, admin panel yozilishi **keyingi
> tasdiqdan keyin** boshlanadi. Pilot kontent (SYI), viewer qayta qurish,
> kontent merge, L2/L3 paywall **bu fazaga kirmaydi**.
>
> **Worktree:** `C:\Urosfera-faza4` · **Branch:** `feature/urologiya-kurs-faza4`
> (base: `origin/main` @ `a8f1439`). Eski `C:\Urosfera` ga tegilmaydi.
>
> Poydevor: [REJA-UROLOGIYA-3LEVEL.md](REJA-UROLOGIYA-3LEVEL.md) ·
> [REJA-UROLOGIYA-KONTENT.md](REJA-UROLOGIYA-KONTENT.md) ·
> [REJA-UROLOGIYA-FAZA3-ARXITEKTURA.md](REJA-UROLOGIYA-FAZA3-ARXITEKTURA.md)

---

## 0. Mavjud poydevor — tekshiruv natijasi (read-only)

### 0.1 O'qilgan fayllar va holati

| Obyekt | Joylashuv | Holati |
|--------|-----------|--------|
| `kurs_darslar` jadvali | `supabase/migrations/20260916000000_kurs_darslar_3level.sql` | ✅ mavjud — sxema quyida |
| `kurs_natijalar` (legacy) | o'sha migratsiya | ✅ mavjud, klient INSERT/UPDATE RLS bilan |
| 126 skelet seed | `supabase/migrations/20260916010000_kurs_darslar_urologiya_skelet.sql` | ✅ 34 modul, 126 dars, `ON CONFLICT (slug) DO NOTHING` |
| `dars_qadam_progress` | `supabase/migrations/20260820000000_dars_qadam_progress.sql` | ✅ mavjud (eski nazariya qadam progressi) |
| `is_admin()` | `supabase/migrations/20260617010000_fix_profiles_admin_policy_recursion.sql` | ✅ mavjud, `public.is_admin()` |
| `createServerSupabase()` | `src/lib/supabaseServer.ts` | ✅ cookie-asos auth klient |
| `createAdminClient()` | `src/lib/supabaseAdmin.ts` | ✅ service-role, RLS bypass |
| Server-authoritative route namunasi | `src/app/api/sertifikat/ber/route.ts` | ✅ auth→admin→server-hisob→idempotent naqsh |
| Admin dars muharriri | `src/app/admin/urologiya-darslar/page.tsx` | ✅ klient CRUD (RLS admin), `modul_no`/`modul_nom` erkin kiritiladi |
| Talaba urologiya sahifalari | `src/app/student/urologiya/darslar/{page,bosqich/[bosqich],[slug]}` | ✅ `kurs_darslar.faol` bo'yicha o'qiydi |
| Obuna helperi | `src/lib/talim/useObuna.ts` | ✅ `obunalar` jadvali, `egami(bosqich)` |
| Tarif helperi | `src/lib/talim/tariflar.ts` | ✅ `tariflar` jadvali, bosqich-narx |

> ⚠️ **`kurs` API route hali yo'q.** `nazorat/urinish` server route `origin/main` da
> mavjud emas (u `c8623e6` da bo'lgan — bu commit ataylab tashqarida qoldirilgan).
> Server-route namunasi sifatida `sertifikat/ber` ishlatiladi.

### 0.2 `kurs_darslar` HAQIQIY sxemasi (Faza 3 hujjati taxminidan farqi)

Haqiqiy ustunlar: `id, yonalish, bosqich, modul_no, modul_nom, slug (UNIQUE),
sarlavha, kategoriya, qisqa, nazariya_html, video_url, daqiqa, sort_order,
bolim, test_savollar jsonb, faol, created_at, updated_at`.

RLS: `kurs_darslar_select = auth.uid() IS NOT NULL AND faol = true`; `kurs_darslar_admin = is_admin()`.

**Faza 3 hujjati bilan nomlar farqi** (rejada moslashtiriladi — hujjat ideal nom,
migratsiya HAQIQIY ustun bilan ishlaydi, slug/ustun kod bilan bog'langani uchun **rename yo'q**):

| Faza 3 hujjatidagi nom | Haqiqiy ustun | Qaror |
|------------------------|---------------|-------|
| `nom` | `sarlavha` | `sarlavha` qoladi (rename yo'q) |
| `klinik_kirish` | `qisqa` (yaqin) | `qisqa` qoladi; kerak bo'lsa `klinik_kirish` alohida qo'shiladi |
| `holat` (draft/nashr) | `faol` boolean | **Modul darajasida** `holat` (kontent tayyorligi); dars darajasida mavjud `faol` (alohida dars tayyorligi). `kurs_darslar` SELECT policy **parent modul `holat='nashr'` ni tekshirishga o'zgartiriladi** (§1.10) |
| `bepul_namuna` | yo'q | qo'shiladi (`kurs_darslar`) |
| `tur`, `dars_natijalari`, `xulosa` | yo'q | ixtiyoriy, qo'shiladi (nullable) |
| `tezkor_savollar` | yo'q (to'g'ri — himoyalangan) | `kurs_savollar` (`tur='tezkor'`, `dars_id`) |

### 0.3 Muhim ziddiyat — `bosqich` qiymati

- `kurs_darslar.bosqich` = **`'orta'`** (apostrofsiz).
- `obunalar` / `tariflar` / `useObuna` = **`"o'rta"`** (apostrof bilan).

→ Access helperi `'orta' ↔ "o'rta"` mapping qilishi **shart**. `kurs_modullar.bosqich`
`kurs_darslar` bilan bir xil (`'oson'|'orta'|'qiyin'`) bo'ladi — toza backfill uchun;
obuna tekshiruvida faqat helper ichida map qilinadi.

### 0.4 Migratsiya versiyasi va to'qnashuvlar

- **Eng oxirgi migratsiya:** `20260917000000_nazorat_qoidabuzarlik.sql`.
- ⚠️ **Mavjud to'qnashuv:** `20260916000000` **ikki** faylda ishlatilgan
  (`admin_analitika_rpc` + `kurs_darslar_3level`). Yangi faylda bu takrorlanmaydi.
- **Taklif etilgan yangi nom:** **`20260918000000_kurs_modul_arxitektura.sql`**
  (barcha mavjuddan katta, takrorlanmaydigan timestamp).
- **Nom to'qnashuvi tekshiruvi (TOZA):** `kurs_modullar`, `kurs_savollar`,
  `kurs_flashcardlar`, `kurs_caselar`, `kurs_progress`, `kurs_urinishlar` — hech
  qaysi migratsiyada mavjud emas. `modul_id` ustuni yo'q (grep faqat
  `kurs_darslar_modul_idx` indeks nomiga urildi). Policy/index/funksiya nomlari
  `kurs_*` prefiksi bilan yangi — mavjudlar bilan urishmaydi.

---

## 1. Faza 4.1 — Schema va migratsiya

**Fayl:** `supabase/migrations/20260918000000_kurs_modul_arxitektura.sql`
(bitta idempotent migratsiya; Supabase SQL Editor'da Run — **bu fazada Run QILINMAYDI**).

### 1.1 Umumiy konvensiyalar
`gen_random_uuid()` PK · `created_at timestamptz default now()` ·
`updated_at` bo'lgan jadvalda kursga xos `set_kurs_updated_at()` trigger (§1.6, idempotent) ·
`IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` (idempotent) · policy `DROP … IF EXISTS`
keyin `CREATE` · RLS nomlari inglizcha `kurs_*` oilasi.

### 1.2 Yangi jadvallar (Faza 3 §2 ga muvofiq, real sxemaga moslab)

| Jadval | Asosiy maydonlar | Muhim constraint / RLS |
|--------|------------------|------------------------|
| `kurs_modullar` | id, yonalish, bosqich(`oson\|orta\|qiyin`), modul_no, nom, tavsif, track, majburiy bool, bepul bool, kredit int, holat(`draft\|nashr`), sort_order | UNIQUE `(yonalish,bosqich,modul_no)` · `kredit>0` · **CHECK `holat='draft' OR bosqich='oson'`** (vaqtinchalik — L2/L3 nashrini DB darajasida bloklaydi, §1.12) · SELECT `is_admin() OR (auth.uid() IS NOT NULL AND holat='nashr')`; ALL admin |
| `kurs_savollar` | id, tur(`tezkor\|test\|usmle`), modul_id?, dars_id?, savol, variantlar jsonb, togri int, izoh, notogri_izoh jsonb, qayta_kor_dars_id?, xato_kategoriya, sort_order | **eksklyuziv CHECK** (`tezkor→dars_id NOT NULL & modul_id NULL`; `test/usmle→modul_id NOT NULL & dars_id NULL`) · `togri>=0` · **SELECT faqat `is_admin()`** |
| `kurs_flashcardlar` | id, modul_id, old, yangi, kategoriya, sort_order | SELECT `is_admin() OR (auth.uid() IS NOT NULL AND EXISTS nashr-modul)`; ALL admin |
| `kurs_caselar` | id, modul_id, sarlavha, bosqichlar jsonb, sort_order | **SELECT faqat `is_admin()`** (JSON ichidagi `togri` sizmasin — talaba `/api/kurs/case` orqali) |
| `kurs_progress` | id, student_id, dars_id, korildi bool, tugatdim bool, tezkor_togri?, tezkor_jami?, created_at, updated_at | UNIQUE `(student_id,dars_id)` · DB invariantlar (1.4) · SELECT own+admin, **INSERT/UPDATE yo'q** |
| `kurs_urinishlar` | id, student_id, modul_id, case_id?, tur(`test\|usmle\|case`), savol_ids jsonb?, boshlangan_at, yakunlangan_at?, ball?, jami?, foiz?, otdi bool, javoblar jsonb? | turga-mos CHECK + attempt-holat CHECK (1.4) · partial UNIQUE (1.5) · SELECT own+admin, yozuv faqat route |

### 1.3 `kurs_darslar` ga qo'shiladigan ustunlar (ADD COLUMN IF NOT EXISTS)

| Ustun | Turi | Izoh |
|-------|------|------|
| `modul_id` | `uuid REFERENCES kurs_modullar(id) ON DELETE RESTRICT` | backfill bilan to'ldiriladi; modul o'chirilsa darslar **yetim bo'lib qolmaydi** — avval darslar ko'chiriladi yoki ongli o'chiriladi |
| `bepul_namuna` | `boolean NOT NULL DEFAULT false` | modul pullik bo'lsa ham ochiq namuna |
| `tur` | `text NOT NULL DEFAULT 'asosiy'` | `asosiy` (majburiy) / kelajakda boshqa turlar |
| `klinik_kirish` | `text NULL` | ixtiyoriy (hujjat §2.2) |
| `xulosa` | `text NULL` | ixtiyoriy |
| `dars_natijalari` | `jsonb NOT NULL DEFAULT '[]'` | ixtiyoriy o'quv natijalari |

> **`kurs_darslar.faol` ustuni saqlanadi** (dars-darajali tayyorlik), lekin **SELECT policy
> parent modul `holat='nashr'` ni tekshiradi (§1.10)** — aks holda `draft` modul darsi
> `faol=true` bo'lsa talaba to'g'ridan SELECT qilib olardi (kritik teshik). Eski statik
> `/student/darslar` `kurs_darslar` ga bog'liq emas (tekshirilgan) — regressiya yo'q.
> Index: `kurs_darslar (modul_id)` qo'shiladi.

### 1.4 DB invariantlari (server route asosiy nazorat, DB kod xatosidan himoya)

**`kurs_progress`:**
```sql
CHECK ( (tezkor_togri IS NULL AND tezkor_jami IS NULL)
        OR (tezkor_togri IS NOT NULL AND tezkor_jami = 3 AND tezkor_togri BETWEEN 0 AND tezkor_jami) ),
CHECK ( NOT tugatdim OR (korildi AND tezkor_jami = 3 AND tezkor_togri >= 2) )
```
**`kurs_urinishlar`:**
```sql
CHECK ( (tur IN ('test','usmle') AND case_id IS NULL)
        OR (tur = 'case' AND case_id IS NOT NULL) ),
CHECK ( yakunlangan_at IS NOT NULL
        OR (ball IS NULL AND jami IS NULL AND foiz IS NULL AND otdi = false) ),
CHECK ( ball IS NULL OR (jami IS NOT NULL AND ball >= 0 AND ball <= jami) ),
CHECK ( jami IS NULL OR jami > 0 ),
CHECK ( foiz IS NULL OR foiz BETWEEN 0 AND 100 )
```

### 1.5 Index va partial UNIQUE
- `kurs_modullar (yonalish, bosqich, sort_order)` · UNIQUE `(yonalish, bosqich, modul_no)`
- `kurs_savollar (modul_id, tur)`, `(dars_id)`
- `kurs_flashcardlar (modul_id, sort_order)`
- `kurs_progress (student_id)` · UNIQUE `(student_id, dars_id)`
- `kurs_urinishlar (student_id, modul_id, tur)`, `(student_id, case_id)`
- **Partial UNIQUE (bitta ochiq urinish):**
  `(student_id, modul_id, tur) WHERE yakunlangan_at IS NULL` (test/usmle) va
  `(student_id, case_id) WHERE yakunlangan_at IS NULL` (case)

### 1.6 `updated_at` trigger — kursga xos, idempotent

Umumiy `public.set_updated_at()` ni ko'r-ko'rona `CREATE OR REPLACE` **qilmaymiz** (boshqa modul
o'ziniki bilan tayanayotgan bo'lishi mumkin). **Preflight:** avval `pg_proc` da mavjudligi va
tanasi tekshiriladi. Eng xavfsizi — **kursga xos** funksiya:
```sql
CREATE OR REPLACE FUNCTION public.set_kurs_updated_at() RETURNS trigger
  LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
```
Trigger'lar migratsiya 2× ishlaganda **ko'paymasligi** uchun har biri `DROP … IF EXISTS` keyin `CREATE`:
```sql
DROP TRIGGER IF EXISTS kurs_modullar_set_updated_at ON public.kurs_modullar;
CREATE TRIGGER kurs_modullar_set_updated_at BEFORE UPDATE ON public.kurs_modullar
  FOR EACH ROW EXECUTE FUNCTION public.set_kurs_updated_at();
-- kurs_progress uchun ham xuddi shunday.
```
- **Yangi jadvallar** (`kurs_modullar`, `kurs_progress`) → shu trigger.
- **Mavjud `kurs_darslar`** → **preflight:** trigger allaqachon bormi tekshiriladi; **yo'q bo'lsagina**
  qo'shiladi (mavjud migratsiya xatti-harakati buzilmasin). Bu fazada `kurs_darslar` triggeri
  majburiy emas — faqat yo'q bo'lsa qo'shiladi.

### 1.7 34 modulni yaratish + `modul_id` backfill (idempotent)

**Skeletni fizik merge QILMAYMIZ** — 126 dars saqlanadi, faqat modulga bog'lanadi.
Kontent merge (21+37) keyingi kontent fazasida.

```sql
-- 1) Mavjud darslardan modullarni tiklab yaratish
--    MUHIM: barcha modul DRAFT yaratiladi — auto-publish YO'Q.
--    `bepul` = narx holati; `holat` = kontent tayyorligi. Bu ikkisi ARALASHMAYDI.
INSERT INTO public.kurs_modullar (yonalish, bosqich, modul_no, nom, holat, bepul, majburiy, kredit, sort_order)
SELECT d.yonalish, d.bosqich, d.modul_no,
       COALESCE(MAX(d.modul_nom), 'Modul '||d.modul_no),
       'draft',                                                -- BARCHA modul draft (kontent hali tayyor emas)
       CASE WHEN d.bosqich = 'oson' THEN true ELSE false END,  -- Foundation bepul (narx), L2/L3 pullik
       true, 1, d.modul_no
FROM public.kurs_darslar d
GROUP BY d.yonalish, d.bosqich, d.modul_no
ON CONFLICT (yonalish, bosqich, modul_no) DO NOTHING;

-- 2) Darslarga modul_id ni bog'lash
UPDATE public.kurs_darslar d SET modul_id = m.id
FROM public.kurs_modullar m
WHERE m.yonalish = d.yonalish AND m.bosqich = d.bosqich AND m.modul_no = d.modul_no
  AND d.modul_id IS DISTINCT FROM m.id;
```
Natija: **34 modul, hammasi `draft`**; barcha 126 dars `modul_id` bilan; `bepul`: oson(1–7)=`true`
(7 ta), orta/qiyin(8–34)=`false` (27 ta). **Auto-publish yo'q** — Foundation modullari kontent
tayyorligi tekshirilgach, admin paneldan **modulma-modul** `nashr` qilinadi (§1.8).

### 1.8 Holat va nashr siyosati — auto-publish YO'Q

- **Barcha 34 modul `draft` yaratiladi.** Foundation 35 skeletning `nazariya_html` maydonlari
  hali bo'sh — birdan `nashr` qilinsa talabaga **ichi bo'sh kurs** ko'rinadi. Shuning uchun
  migratsiyada **avtomatik nashr yo'q**.
- **`bepul` (narx) ≠ `holat` (kontent tayyorligi).** Foundation `bepul=true`, lekin `draft`;
  L2/L3 `bepul=false` va `draft`.
- **Foundation:** kontent tayyorligi tekshirilgach, admin paneldan **modulma-modul** `nashr` qilinadi.
- **L2/L3 (orta/qiyin):** `draft` qoladi; **paywall access-helper tayyor bo'lmaguncha nashr
  BLOKLANADI** (admin nashr amali ham tekshiradi — §Qo'shimcha talab 4). Eski statik kurs
  `kurs_darslar` ga bog'liq emas — regressiya yo'q.
- **L2/L3 paywall enforcement — Faza 4 da YO'Q**, faqat mos arxitektura (§2.0 access helper skeleti).

### 1.9 Idempotentlik, verifikatsiya va rollback SQL

**Idempotentlik:** `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`,
`ON CONFLICT DO NOTHING`, `UPDATE … WHERE IS DISTINCT FROM`, policy `DROP…IF EXISTS`.
Ikki marta Run — xatosiz, dublikatsiz.

**Verifikatsiya SQL (migratsiya oxirida `RAISE NOTICE` yoki qo'lda):**
```sql
SELECT count(*) FROM kurs_modullar;                                   -- = 34
SELECT count(*) FROM kurs_darslar WHERE modul_id IS NULL;             -- = 0 (126 dars bog'langan)
SELECT bosqich, count(*) FROM kurs_modullar GROUP BY bosqich;         -- oson 7 / orta 12 / qiyin 15
SELECT holat, count(*) FROM kurs_modullar GROUP BY holat;             -- draft 34 (nashr 0 — auto-publish yo'q)
SELECT bepul, count(*) FROM kurs_modullar GROUP BY bepul;             -- true 7 / false 27
```

**Rollback SQL — executable migratsiyalar katalogiga QO'YILMAYDI.**
`supabase/rollback/20260918000000_kurs_modul_arxitektura_rollback.sql` da saqlanadi, boshida aniq
izoh: *«Bu fayl migratsiya emas — Supabase avtomatik ishlatmaydi; faqat qo'lda, ongli ravishda Run qilinadi»*.
```sql
-- QO'LDA ROLLBACK — avtomatik ishlamaydi. Tartib muhim.

-- 1) Yangi kurs_darslar SELECT policy'ni o'chirib, ESKI policy'ni aniq tiklash
DROP POLICY IF EXISTS "kurs_darslar_select" ON public.kurs_darslar;
CREATE POLICY "kurs_darslar_select" ON public.kurs_darslar
  FOR SELECT USING (auth.uid() IS NOT NULL AND faol = true);   -- migratsiyadan oldingi holat

-- 2) kurs_darslar ga qo'shilgan trigger (agar shu migratsiya qo'shgan bo'lsa) va ustunlar
DROP TRIGGER IF EXISTS kurs_darslar_set_updated_at ON public.kurs_darslar;  -- faqat shu migratsiya qo'shgan bo'lsa
ALTER TABLE public.kurs_darslar
  DROP COLUMN IF EXISTS modul_id,        -- ON DELETE RESTRICT FK ham shu bilan ketadi
  DROP COLUMN IF EXISTS bepul_namuna, DROP COLUMN IF EXISTS tur,
  DROP COLUMN IF EXISTS klinik_kirish, DROP COLUMN IF EXISTS xulosa, DROP COLUMN IF EXISTS dars_natijalari;

-- 3) Yangi jadvallar — dependency tartibida (bog'liqlar avval)
DROP TABLE IF EXISTS public.kurs_urinishlar;   -- → kurs_modullar, kurs_caselar, profiles
DROP TABLE IF EXISTS public.kurs_progress;     -- → kurs_darslar, profiles
DROP TABLE IF EXISTS public.kurs_caselar;      -- → kurs_modullar
DROP TABLE IF EXISTS public.kurs_flashcardlar; -- → kurs_modullar
DROP TABLE IF EXISTS public.kurs_savollar;     -- → kurs_modullar, kurs_darslar
DROP TABLE IF EXISTS public.kurs_modullar;     -- oxirgi (boshqalar unga tayanadi)

-- 4) Kursga xos trigger funksiyasi (boshqa hech kim ishlatmasa)
DROP FUNCTION IF EXISTS public.set_kurs_updated_at();
```
> `kurs_darslar`, `kurs_natijalar`, `dars_qadam_progress`, 126 dars — rollback'da **saqlanadi**;
> eski `kurs_darslar` SELECT policy aniq qayta ishlaydi.

### 1.10 `kurs_darslar` SELECT policy — parent modul holatiga bog'lash (KRITIK)

Migratsiyada eski policy almashtiriladi (`draft` modul darsi sizib chiqmasin):
```sql
DROP POLICY IF EXISTS "kurs_darslar_select" ON public.kurs_darslar;
CREATE POLICY "kurs_darslar_select" ON public.kurs_darslar
FOR SELECT USING (
  public.is_admin()
  OR (
    auth.uid() IS NOT NULL
    AND kurs_darslar.faol = true
    AND kurs_darslar.modul_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.kurs_modullar m
      WHERE m.id = kurs_darslar.modul_id AND m.holat = 'nashr'
    )
  )
);
```
- Admin barcha darsni ko'radi; talaba faqat `faol=true` + `modul_id` bor + parent modul `nashr`.
- **`modul_id IS NULL` legacy darslarni avtomatik ochmaydi** (fail-closed). Bu fazada bunday
  dars yo'q (audit: 126 dars hammasi `modul_no` ga ega), lekin kelajakda paydo bo'lsa yopiq qoladi.
- Barcha modul dastlab `draft` bo'lgani uchun urologiya talaba sahifalari **nashrgacha bo'sh** —
  bu kutilgan (bo'sh skelet ko'rsatilmaydi). Eski statik `/student/darslar` ta'sirlanmaydi.

### 1.11 Duplicate timestamp preflight (`20260916000000`)

- Mavjud duplicate (`admin_analitika_rpc` + `kurs_darslar_3level`) **rename/tahrir QILINMAYDI**.
- Faza 4.1 dan oldin **preflight:** lokal va remote migration history yangi `20260918000000`
  ni qabul qilishini tekshirish (`supabase migration list` yoki `schema_migrations` tekshiruvi).
  Duplicate versiya yangi migratsiyani bloklamasligiga ishonch hosil qilmasdan **remote Run tavsiya etilmaydi**.

### 1.12 L2/L3 nashr bloki — DB darajasida (vaqtinchalik invariant)

Admin interfeys guardi **yetarli emas** — kimdir Supabase orqali to'g'ridan `UPDATE holat='nashr'`
qilib L2/L3 modulini ochib yuborishi mumkin (paywall hali yo'q). Shuning uchun `kurs_modullar` da
**vaqtinchalik CHECK:**
```sql
ALTER TABLE public.kurs_modullar
  ADD CONSTRAINT kurs_modullar_nashr_bloki CHECK (holat = 'draft' OR bosqich = 'oson');
```
- `orta`/`qiyin` modulni `nashr` qilib bo'lmaydi (DB rad etadi) — bevosita SQL orqali ham.
- Foundation (`oson`) modulini `nashr` qilish mumkin (kontent tayyor bo'lganda).
- **Paywall tayyor bo'lganda** bu constraint **alohida migratsiyada** olib tashlanadi/almashtiriladi
  (Faza 4 doirasidan tashqari).

---

## 2. Faza 4.2 — Server API skeletlari

Naqsh (`sertifikat/ber` dan): `createServerSupabase()` → `auth.getUser()` (401) →
JSON parse/validatsiya (400) → access helper (403) → `createAdminClient()` bilan
server-hisob → idempotent yozuv. `togri` javoblar **hech qachon** klientга chiqmaydi.

### 2.0 Umumiy access helper — `src/lib/kurs/kirish.ts` (server)
```
darsgaKirishBormi(admin, userId, dars, modul): Promise<boolean>
bosqichMap(b): 'oson' | "o'rta" | 'qiyin'    // markazlashgan, fail-closed
```
- **Nashr sharti (birinchi darvoza):** admin bo'lmasa — modul `holat='nashr'` **VA** dars `faol=true`.
  Ikkalasi ham tekshiriladi; biri yetishmasa → **403** (`/progress`,`/test`,`/case` faqat nashr modulda ishlaydi).
- **Kirish huquqi:** modul `bepul` YOKI dars `bepul_namuna` YOKI (obuna faol shu bosqich uchun) YOKI admin.
- **`bosqichMap` (markazlashgan):** `oson→oson`, `orta→"o'rta"`, `qiyin→qiyin`. **Noma'lum qiymat →
  fail-closed** (access bermaydi; 403 yoki validatsiya xatosi). Unit test majburiy.
- **Admin preview:** admin `draft` modulni ko'radi; oddiy talaba ko'rmaydi.
- **Bu fazada:** `draft` (L2/L3 va nashr qilinmagan Foundation) → 403.

### 2.1 `POST /api/kurs/progress`
| | |
|---|---|
| **Amal** | `korildi` (nazariya oxiri) · `yakunla` (3 tezkor savol bahosi) |
| **Request** | `{ amal, dars_id, javoblar?: number[] }` |
| **Auth** | `getUser()` yo'q → 401 |
| **Access** | `darsgaKirishBormi` false → 403 |
| **Validatsiya** | `dars_id` mavjud/nashr modul; `yakunla` da aynan 3 javob |
| **Server hisob** | tezkor savollar `kurs_savollar(tur='tezkor',dars_id)` admin bilan o'qiladi; `togri` serverda taqqoslanadi; ≥2 → `tugatdim=true` |
| **Idempotentlik** | `(student_id,dars_id)` upsert; `korildi` yengil, qayta yuborishda dublikat yo'q |
| **O'qish/yozish** | R: `kurs_darslar`,`kurs_modullar`,`kurs_savollar` · W: `kurs_progress` |
| **Status** | 200 / 400 / 401 / 403 / 500 |
| **Test** | tezkor javob serverda baholanishi; `togri` chiqmasligi; `tugatdim` invariant (≥2/3) |

### 2.2 `POST /api/kurs/test` (attempt lifecycle)
| | |
|---|---|
| **Amal** | `boshlash` · `topshirish` |
| **Request** | `boshlash: { modul_id, tur:'test'\|'usmle' }` · `topshirish: { attempt_id, javoblar }` |
| **Access** | modul `nashr` + kirish huquqi; aks holda 403 |
| **boshlash** | **bo'sh/yetarsiz bank guard →** `409 {code:'TEST_BANK_NOT_READY'}` (savol yo'q → test boshlanmaydi); ochiq urinish bormi (partial UNIQUE) — bor bo'lsa o'shani qaytaradi; savol tanlab `savol_ids` (tartib) saqlaydi; savollarni **`togri`siz** qaytaradi |
| **topshirish** | aynan shu `savol_ids` baholanadi; `UPDATE…WHERE id=attempt AND yakunlangan_at IS NULL` (bir marta); qayta → mavjud natija; **o'tish chegarasi 70%** |
| **O'qish/yozish** | R: `kurs_savollar(tur,modul_id)`,`kurs_modullar` · W: `kurs_urinishlar` |
| **Status** | 200 / 400 / 401 / 403 / **409** (`TEST_BANK_NOT_READY` yoki band ochiq urinish) / 500 |
| **Test** | `togri` chiqmasligi; ikki marta `topshirish` bitta natija; bo'sh bank 409; ball/foiz serverda |

### 2.3 `POST /api/kurs/case` (bosqichma-bosqich)
| | |
|---|---|
| **Amal** | `boshlash` · `javob` (har bosqich) |
| **Request** | `boshlash: { case_id }` · `javob: { attempt_id, bosqich_no, tanlov }` |
| **Access** | case → modul `nashr` + kirish; 403 aks holda |
| **Server** | `kurs_caselar` **admin bilan** o'qiladi; route faqat joriy bosqich savolini beradi; javob serverda tekshiriladi; **keyingi bosqich shundan keyin** qaytariladi (oldindan yubormaydi) |
| **Ball** | oddiy case: `yakunlangan_at` saqlanadi, ball/foiz NULL bo'lishi mumkin. Capstone case: ball/jami/foiz/`otdi` |
| **O'qish/yozish** | R: `kurs_caselar`,`kurs_modullar` · W: `kurs_urinishlar(tur='case',case_id)` |
| **Status** | 200 / 400 / 401 / 403 / 500 |
| **Test** | keyingi bosqich javoblari oldindan sizmasligi; `kurs_caselar` RLS talabaga yopiq |

> Bu fazada **to'liq pedagogik kontent shart emas** — xavfsiz ishlaydigan skelet + guardlar yetarli.

---

## 3. Faza 4.3 — Admin uch muharrir skeleti

**Additiv:** eski `src/app/admin/urologiya-darslar/page.tsx` **saqlanadi va tegilmaydi**.
Yangi muharrirlar alohida route'da; navigatsiya havolasi faqat ishlagach qo'shiladi.

| Muharrir | Route | Komponent(lar) | Jadval | CRUD | Asosiy form maydonlari |
|----------|-------|----------------|--------|------|------------------------|
| **1. Modul** | `/admin/kurs/modullar` | `page.tsx` + `ModulForm` | `kurs_modullar` | list/create/update/delete | yonalish, bosqich, modul_no, nom, tavsif, track, majburiy, bepul, kredit, holat, sort_order |
| **2. Dars** | `/admin/kurs/darslar` | `page.tsx` + `DarsForm` + `TezkorSavolPanel` | `kurs_darslar` (+ `kurs_savollar` `tur='tezkor'`) | list/create/update/delete | modul (picker→modul_id), nom(`sarlavha`), slug, tur, klinik_kirish, nazariya_html, video_url, **tezkor savollar (2–3 → kurs_savollar)**, xulosa, daqiqa, bepul_namuna, holat*, sort_order |
| **3. Praktikum** | `/admin/kurs/praktikum` | `page.tsx` + `FlashcardPanel` + `SavolBankPanel` + `CasePanel` | `kurs_flashcardlar`, `kurs_savollar(test/usmle)`, `kurs_caselar` | list/create/update/delete | modul picker; flashcard(old/yangi/kategoriya); test/usmle savol(savol/variantlar/togri/izoh/notogri_izoh); case(sarlavha/bosqichlar) |

\* dars `holat` ixtiyoriy; asosiy nashr-nazorati modul darajasida.

**Har muharrir uchun umumiy talab:**
- **Validatsiya:** majburiy maydonlar, slug unique (klient tekshiruv + DB xato ushlash),
  `togri` variant indeksi diapazonda, tezkor 2–3 savol, JSON shakli.
- **draft → preview → nashr:** `holat` toggle; *preview* = admin sifatida talaba
  ko'rinishini ochish (admin RLS bypass); *nashr* = `holat='nashr'`.
- **Holatlar:** loading (skeleton), error (xabar + retry), empty (bo'sh ro'yxat CTA).
- **Mobil:** telefon-only 680px (loyiha qoidasi), `KebabMenu` amallar, `inp`/`lab` uslublari.
- **CRUD yo'li:** admin RLS (`is_admin()`) orqali klient `createClient()` bilan
  (mavjud admin sahifa naqshi) — server route shart emas, chunki `togri` admin uchun ochiq.

**Additiv o'tish:** eski sahifa birdan almashtirilmaydi; yangi muharrirlar to'liq
ishlab, tekshirilgach admin menyusiga havola qo'shiladi. Eski sahifa keyingi (kontent) fazada olib tashlanadi.

---

## 4. Faza 4.4 — Integratsiya va tekshiruv

| # | Tekshiruv | Kutilgan natija |
|---|-----------|-----------------|
| 1 | Migratsiyani 2× Run | xatosiz, dublikatsiz (idempotent) |
| 2 | `modul_id IS NULL` | = 0 |
| 3 | `count(kurs_modullar)` + holat/bepul | 34 modul; **draft 34** / nashr 0; **bepul 7** / pullik 27; bosqich oson 7 / orta 12 / qiyin 15 |
| 4 | Darslar backfill | 126 dars modulga bog'langan (`modul_id IS NULL = 0`) |
| 5 | Talaba `draft` modul darsini to'g'ridan SELECT | **ololmaydi** — `kurs_darslar` RLS parent modul `nashr` ni talab qiladi (§1.10) |
| 6 | Talaba `kurs_savollar.togri` / `kurs_caselar` | **hech qanday yo'l bilan** ololmaydi (RLS + route testi) |
| 7 | Klient `korildi`/`tugatdim`/`otdi` to'g'ridan yozish | RLS rad etadi |
| 8 | Admin CRUD (3 muharrir) | modul/dars/praktikum yaratish, draft→nashr ishlaydi |
| 9 | Nashr cheklovi | hammasi draft; **L2/L3 nashr bloklangan**; Foundation draft nashr qilinishi mumkin; nashr modul + `faol` dars talabaga ko'rinadi |
| 10 | Eski talaba/admin sahifalari | buzilmaydi (`faol` bilan avvalgidek) |
| 11 | `npm test`, `tsc --noEmit`, `next build` | o'tadi |
| 12 | Darsi bor modulni DELETE | **rad etiladi** (`modul_id` FK `ON DELETE RESTRICT`) |
| 13 | `orta`/`qiyin` modulni `nashr` qilish (bevosita SQL) | **rad etiladi** (`kurs_modullar_nashr_bloki` CHECK) |
| 14 | Rollback'dan keyin `kurs_darslar` SELECT | eski `faol=true` policy **qayta ishlaydi** |
| 15 | Migratsiyani 2× bajarish | trigger'lar **ko'paymaydi** (`DROP TRIGGER IF EXISTS` + `CREATE`) |

---

## 5. Commitlar ketma-ketligi

Taklif etilgan 6 commit **texnik jihatdan to'g'ri va saqlanadi** (har biri mustaqil
deploy, o'z testi bilan, eski tizimni buzmaydi, faqat shu vazif fayllari):

| # | Commit | Fayllar (asosiy) | Testlar |
|---|--------|------------------|---------|
| 1 | `feat(db): add normalized course module schema` | `supabase/migrations/20260918000000_kurs_modul_arxitektura.sql` (+ rollback SQL fayli) | migratsiya idempotentligi, backfill, RLS, `modul_id IS NULL=0` |
| 2 | `feat(api): add secure course progress and assessment routes` | `src/app/api/kurs/{progress,test,case}/route.ts`, `src/lib/kurs/kirish.ts`, TS turlari | `togri` sizmasligi, baho serverda, idempotentlik, access 403 |
| 3 | `feat(admin): add course module editor` | `src/app/admin/kurs/modullar/*` | CRUD, draft→nashr |
| 4 | `feat(admin): add structured lesson editor` | `src/app/admin/kurs/darslar/*` (+ tezkor savol panel) | modul picker, slug unique, tezkor 2–3 |
| 5 | `feat(admin): add module practicum editor` | `src/app/admin/kurs/praktikum/*` | flashcard/savol/case CRUD |
| 6 | `test(course): verify RLS, progress and admin flows` | integratsion/e2e testlar | RLS matritsasi, progress oqimi, admin oqimi |

**Testlar oxirgi commitga qoldirilmaydi:** 1–5 har biri o'z unit/integratsion testi bilan
keladi; 6-commit faqat uchidan-uchiga va RLS matritsa tekshiruvlari. Bu prior kelishuvga mos.

**Chegara aniqligi:** `20260916000000` duplicate timestamp'ini bu commitlar **tuzatmaydi**
(mavjud, aralashmaydi) — yangi fayl `20260918000000` bilan qochiladi.

---

## 6. Har subfaza uchun acceptance criteria

### 4.1 Schema
- **Kirish sharti:** worktree toza, migratsiya versiyasi bo'sh (`20260918000000`).
- **Fayllar:** 1 migratsiya + 1 rollback SQL.
- **Vazifalar:** 6 jadval, `kurs_darslar` ustunlari, **`kurs_darslar` SELECT policy parent-modul
  tekshiruvi (§1.10)**, index, trigger, 34 modul (**hammasi draft**) + backfill.
- **Tugallanganlik:** verifikatsiya SQL (§1.9) mahalliy/staging da o'tadi; 2× Run toza; duplicate preflight (§1.11).
- **Testlar:** idempotentlik (2× Run, trigger ko'paymaydi), backfill soni, **draft modul darsi
  SELECT bloklangan**, RLS matritsasi, **modul DELETE RESTRICT**, **L2/L3 nashr CHECK rad etadi**,
  **rollback eski policy tiklaydi**.
- **Xavf:** RLS teshigi (draft dars sizishi — §1.10 yopadi); modul o'chirilsa yetim dars
  (§1.3 RESTRICT yopadi); backfill xato modul biriktirishi.
- **Rollback:** `supabase/rollback/…` (§1.9, avtomatik emas); 126 dars saqlanadi.
- **O'tish sharti:** `modul_id IS NULL=0`, 34 draft modul, draft-dars SELECT testi yashil.

### 4.2 API
- **Kirish sharti:** 4.1 merge (jadvallar mavjud).
- **Fayllar:** 3 route + `kirish.ts` + turlar.
- **Vazifalar:** auth/access/validatsiya/idempotentlik guardlari; server-baho.
- **Tugallanganlik:** har route 401/400/403/200 to'g'ri; `togri` hech qachon javobda yo'q.
- **Testlar:** route unit (mock admin), `togri` sizmasligi, ikki-marta topshirish idempotent.
- **Xavf:** access helper bosqich mapping xatosi (`orta`/`o'rta`); attempt race (partial unique bilan yopilgan).
- **Rollback:** route fayllarini olib tashlash (DB tegilmaydi).
- **O'tish sharti:** RLS+route testi yashil, build o'tadi.

### 4.3 Admin (3 muharrir — 4.3a modul, 4.3b dars, 4.3c praktikum)
- **Kirish sharti:** 4.1 (+ dars/praktikum uchun 4.2 access tushunchasi).
- **Fayllar:** yangi `/admin/kurs/*` route va komponentlar (eski sahifaga tegilmaydi).
- **Vazifalar:** CRUD, validatsiya, draft→preview→nashr, loading/error/empty, mobil.
- **Tugallanganlik:** admin modul/dars/praktikum yaratadi, nashr qiladi; eski sahifa ishlayapti.
- **Testlar:** komponent/oqim testi (CRUD, slug unique, tezkor 2–3, JSON shakli).
- **Xavf:** eski sahifa regressiyasi (additiv bo'lgani uchun past); slug o'zgarishi (taqiqlanadi).
- **Rollback:** yangi route papkalarini olib tashlash.
- **O'tish sharti:** uchala muharrir CRUD+nashr yashil; eski sahifa buzilmagan.

### 4.4 Integratsiya
- **Kirish sharti:** 4.1–4.3 merge.
- **Fayllar:** test fayllari.
- **Vazifalar:** §4 jadvalidagi 11 tekshiruv.
- **Tugallanganlik:** barcha 11 yashil; `npm test`/`tsc`/`build` o'tadi.
- **Testlar:** e2e + RLS matritsa.
- **Xavf:** integratsion teshiklar (masalan draft modul dars viewer'da ko'rinishi).
- **Rollback:** —
- **O'tish sharti:** Faza 4 acceptance (Faza 3 §13) to'liq.

---

## 7. Muhim chegaralar (bu fazada QILINMAYDI)

- ❌ SYI pilot modul kontentini yaratmaslik.
- ❌ Talaba viewer'ni to'liq qayta qurmaslik (mavjud viewer `faol` bilan qoladi).
- ❌ Eski darslarni arxivga ko'chirmaslik; 126 skeletni fizik merge qilmaslik.
- ❌ L2/L3 paywall'ni implementatsiya qilmaslik — faqat kelajakdagi access helper bilan mos arxitektura.
- ❌ Supabase migratsiyasini remote bazada Run qilmaslik.
- ❌ Vercel deploy qilmaslik.
- ❌ Commit/push qilmaslik (bu hujjat untracked qoladi).
- ❌ Original `C:\Urosfera` worktree'sidagi begona fayllarga tegmaslik.

---

## 8. Qarorlar — YOPILGAN *(doktor tasdiqladi, 2026-09-03)*

1. **`holat` joylashuvi:** asosiy `holat` **modul darajasida**. Dars darajasida mavjud `faol`
   ishlatiladi (modul `draft/nashr` = butun modul tayyorligi; dars `faol` = alohida dars tayyorligi).
   Yangi dars muharriri darsni odatda **`faol=false`** yaratadi; admin tayyor darsni faol qiladi.
   Talabaga ko'rinish uchun **modul `nashr` VA dars `faol`** shart. **Darsga alohida `holat` ustuni
   qo'shilmaydi.**
2. **Admin route prefiksi:** `/admin/kurs/modullar` · `/admin/kurs/darslar` · `/admin/kurs/praktikum`.
   Ginekologiya va boshqa yo'nalishlar uchun qayta ishlatiladi — **har sahifada `yonalish` filtri** bo'ladi.
3. **`bosqich` mapping:** bazadagi `kurs_darslar.bosqich` qiymatlari **o'zgartirilmaydi**. Bitta
   markazlashgan server helper: `oson→oson`, `orta→"o'rta"`, `qiyin→qiyin`. Unit test majburiy.
   **Noma'lum qiymatda fail-closed** — access berilmaydi (403 yoki validatsiya xatosi).
4. **`kurs_natijalar` legacy:** Faza 4 da **tegilmaydi**, migrate/drop yo'q; yangi tizim unga
   yozmaydi. Keyingi cleanup oldidan real ma'lumot auditi.
5. **Test banki va o'tish foizi:** modul testi o'tish chegarasi **70%**; tavsiya bank **10–15 savol/modul**;
   real urinishdagi savol soni keyingi kontent fazasida; **tezkor dars savollari — aynan 3 ta, ≥2 to'g'ri**;
   **bo'sh bankda test boshlanmaydi**. Bo'sh/yetarsiz bank *noto'g'ri request emas* → `400` o'rniga
   **`409 {code:'TEST_BANK_NOT_READY'}`**.

### 8.1 Qo'shimcha implementatsiya talablari (tasdiqlangan)

1. Access tekshiruvida **`kurs_modullar.holat` VA `kurs_darslar.faol` ikkalasi** ishlatiladi.
2. `/api/kurs/progress`, `/api/kurs/test`, `/api/kurs/case` — **faqat modul nashr qilingandan keyin** ishlaydi (aks holda 403).
3. **Admin preview** `draft` modulni ko'radi; oddiy talaba ko'rmaydi.
4. **L2/L3 nashrini bloklash — ikki qatlam:** (a) admin interfeys guardi; (b) **DB CHECK
   `holat='draft' OR bosqich='oson'`** (§1.12) — bevosita Supabase SQL orqali ham L2/L3 nashr
   qilib bo'lmaydi. **Foundation `draft` modulini nashr qilish mumkin.** Paywall tayyor bo'lganda
   constraint alohida migratsiyada almashtiriladi.
5. **Rollback SQL** executable migratsiyalar katalogiga qo'yilmaydi — `supabase/rollback/` da,
   avtomatik ishlamasligi aniq yozilgan (§1.9).
6. **Duplicate `20260916000000` preflight** (§1.11) Faza 4.1 dan oldin; rename/tahrir yo'q; migration
   history yangi `20260918000000` ni qabul qilishini tekshirmasdan remote Run yo'q.

---

## 9. Eng katta xavfsizlik xavflari

1. **`kurs_savollar` / `kurs_caselar` RLS teshigi** — talaba `togri` yoki case ichki
   javoblarини olishi. Yumshatish: SELECT **faqat `is_admin()`**; talabaga faqat route
   `togri`siz beradi; e2e testda anonim/talaba token bilan to'g'ridan SELECT bloklanishi tekshiriladi.
2. **Klient progress soxtalashtirish** — `tugatdim`/`otdi` ni to'g'ridan yozish.
   Yumshatish: `kurs_progress`/`kurs_urinishlar` ga klient INSERT/UPDATE **yo'q**; faqat
   service-role route; DB invariant (`tugatdim ⇒ ≥2/3`).
3. **Draft (pullik L2/L3) kontent sizishi** — nashr qilinmagan modul darsini talaba
   `kurs_darslar` dan to'g'ridan SELECT qilishi (eski policy `faol=true` bilan ochiq edi — **kritik**).
   Yumshatish: `kurs_darslar` SELECT policy **parent modul `holat='nashr'`** ni tekshiradi (§1.10);
   access helper 403; L2/L3 nashr bloklangan; `modul_id IS NULL` fail-closed.
4. **Attempt race / dublikat baho** — bir vaqtda ikki urinish yoki ikki topshirish.
   Yumshatish: partial UNIQUE (ochiq urinish) + `UPDATE…WHERE yakunlangan_at IS NULL` bir-martalik guard.
5. **`bosqich` mapping xatosi** — `'orta'` ≠ `"o'rta"` sabab obuna tekshiruvi noto'g'ri
   ochib/yopib qo'yishi. Yumshatish: helperda markazlashgan map + unit test.

---

## 10. Yakuniy taqdimot (xulosa)

1. **Migratsiya fayli nomi:** `supabase/migrations/20260918000000_kurs_modul_arxitektura.sql`.
2. **Subfaza/commit jadvali:** §5 (6 commit) — 4.1 db → 4.2 api → 4.3a/b/c admin → 4.4 test.
3. **O'zgaradigan/yangi fayllar:**
   - Yangi: migratsiya + rollback SQL; `src/app/api/kurs/{progress,test,case}/route.ts`;
     `src/lib/kurs/kirish.ts` (+ turlar); `src/app/admin/kurs/{modullar,darslar,praktikum}/*`; test fayllari.
   - O'zgaradi: `kurs_darslar` (ADD COLUMN) — jadval; kod tomonda **eski fayllar tegilmaydi**.
4. **To'qnashuvlar:** `kurs_*` 6 jadval — TOZA. `20260916000000` duplicate timestamp mavjud
   (yangi fayl qochadi + preflight §1.11). `bosqich` `'orta'` vs `"o'rta"` — helperda fail-closed map.
   **`kurs_darslar` SELECT policy o'zgartiriladi** (parent modul `nashr`, §1.10) — eski statik kurs
   ta'sirlanmaydi (u `kurs_darslar` ga bog'liq emas).
5. **Yopilgan qarorlar:** §8 (5 ta) + §8.1 (6 qo'shimcha talab) — hammasi tasdiqlangan; ochiq qaror qolmadi.
6. **Eng katta xavflar:** §9 (5 ta) — savol/case RLS, progress soxtalashtirish, draft sizishi,
   attempt race, bosqich mapping.
