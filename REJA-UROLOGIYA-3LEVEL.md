# Reja — Urologiya darslarini 3-Level modul tizimiga o'tkazish

> Urologiya darslarini ginekologiya modelida qayta qurish:
> **Foundation → Clinical → Advanced**, har bosqich raqamlangan **modul**larga bo'linadi.
> Katta ish — bosqichma-bosqich bajariladi. Yonaki: kelajakda Andrologiya/Akusherlik ham shu tizimda.

*Yaratilgan: 2026-09-02. Manba: Dr. Arabboyev modul rejasi (2026-08-21).*

---

## 0. Qabul qilingan qarorlar (2026-09-02)

| Qaror | Tanlov |
|-------|--------|
| **Baza modeli** | Umumiy **`kurs_darslar`** jadvali — `gin_darslar` umumlashtiriladi (`yonalish` + `bosqich` + **`modul`**). Andrologiya/akusherlik keyin shunga tushadi. |
| **Eski `/student/darslar`** | **Admin-only** qilinadi (rol gate). Kontent saqlanadi, yangi modullarga **manba** sifatida ishlatiladi. Sluglar o'zgarmaydi — progress buzilmaydi. |
| **Modul qatlami** | Yangi: bosqich → **modullar** (akkordeon) → darslar. Ginekologiyada bu qatlam yo'q edi. |

---

## 1. Arxitektura — `kurs_darslar` (umumiy jadval)

`gin_darslar` sxemasini umumlashtiramiz. Farq — ikki yangi ustun: `yonalish`, `modul`.

```
kurs_darslar
  id            uuid PK
  yonalish      text   -- 'urologiya' | 'ginekologiya' | 'andrologiya'…
  bosqich       text   -- 'oson' | 'orta' | 'qiyin'  (= Level 1/2/3)
  modul_no      int    -- modul tartibi (1..N) — akkordeon guruhi
  modul_nom     text   -- 'Urologiyaga kirish'
  slug          text UNIQUE
  sarlavha      text
  kategoriya    text
  qisqa         text
  nazariya_html text
  video_url     text
  daqiqa        int
  sort_order    int    -- modul ichidagi dars tartibi
  bolim         text   -- 'darslar' | 'klassifikatsiyalar' | 'operativ'
  test_savollar jsonb
  faol          boolean
  created_at / updated_at
```

**Migratsiya yo'li:**
- `kurs_darslar` yangi jadval sifatida yaratiladi (RLS: select = kirgan+faol, admin = ALL — `gin_darslar` kabi).
- `gin_darslar` ni ham keyin shunga ko'chirish mumkin (`yonalish='ginekologiya'`), lekin bu **majburiy emas** — birinchi bosqichda urologiya bilan boshlaymiz, ginekologiya o'z jadvalida qoladi.
- Natijalar: `kurs_natijalar` (yoki mavjud `gin_natijalar` ni `natijalar`ga umumlashtirish) — `yonalish` ustuni bilan.

**Nega alohida jadval emas:** Andrologiya + Akusherlik kelmoqda. Har biriga jadval + admin panel + viewer + progress = 4× takror. Bitta jadval `?yonalish=` bilan hammasiga xizmat qiladi.

## 2. Modul qatlami — yangi UX

- Bosqich sahifasi (`/student/urologiya/darslar/bosqich/[bosqich]`) endi **akkordeon**: har modul yopiladi/ochiladi, ichida darslar ketma-ket.
- Level 1'da 7 modul, har birida 3-6 dars — tekis ro'yxat juda uzun bo'ladi, guruhlash shart.
- Modul sarlavhasida: raqam, nom, dars soni, progress halqasi.

## 3. Yo'nalish (routing)

```
/student/urologiya/darslar                     → 3 karta (Level 1/2/3) — landing
/student/urologiya/darslar/bosqich/[bosqich]   → modullar akkordeoni
/student/urologiya/darslar/[slug]              → dars viewer
/admin/urologiya-darslar                        → admin CRUD (modul boshqaruvi bilan)
/admin/darslar (eski)                           → ADMIN-ONLY arxiv (kontent manbasi)
```

Talaba dashboard'idagi "Darslar" tugmasi `/student/darslar` → `/student/urologiya/darslar` ga yo'naltiriladi.

---

## 4. MODUL XARITASI

### 🟢 LEVEL 1 — UROLOGY FOUNDATION (bepul, ochiq)
*Maqsad: anatomiya → fiziologiya → simptom → tekshiruv zanjiri. "Men urologiyani tushunaman."*

| # | Modul | Darslar (taxminiy sluglar) |
|---|-------|-----------------------------|
| 1 | Urologiyaga kirish | urologiya-nima, siydik-tizimi-umumiy, erkak-reproduktiv-kirish, anatomiya-klinik-ahamiyat |
| 2 | Buyrak anatomiyasi va gistologiyasi | buyrak-anatomiya, buyrak-qon-taminoti, buyrak-topografiya, buyrak-gistologiya, jga |
| 3 | Siydik yo'llari anatomiyasi va fiziologiyasi | ureter, siydik-pufagi-anatomiya, uretra, siydik-hosil-bolishi |
| 4 | Siydik chiqarish fiziologiyasi | micturition, pufak-tolishi, siyish-refleksi, nerv-boshqaruvi, soglom-siyish |
| 5 | Erkak reproduktiv tizimi | moyak, epididimis, vas-deferens, urug-pufakchalari, prostata-asos, jinsiy-olat, spermatogenez, testosteron |
| 6 | Urologik bemorni tekshirish | urologik-anamnez, fizik-korik, dre-asos, laborator-tekshiruvlar, tasvirlash-umumiy |
| 7 | Urologik simptomlar va sindromlar | siydik-simptomlari, siydik-ozgarishlari, urologik-ogriq, erkak-jinsiy-simptomlar |

⚠️ **EASY qoidasi (AGENTS.md):** Level 1'da bo'lmasin — dori dozasi, IPSS/Gleason/TNM ballari, algoritm sxemasi, operatsiya nomi. Sarlavhalar savol shaklida ("Bu nima?", "Qachon xavfli?").
⚠️ **Gistologiyani yengillashtirish:** 2-modul (nefron/glomerulus/JGA) deyarli nefrologiya — EASY falsafasiga (tanib olish, yo'naltirish) og'ir. Chuqur gistologiyani Level 2/3 ga surish tavsiya etiladi.
✅ Level 1'da **nazorat/sertifikat yo'q** (AGENTS.md).

### 🟡 LEVEL 2 — CLINICAL UROLOGY (pullik)
*Maqsad: Symptom → Differential → Investigation → Diagnosis → Initial treatment.*

| # | Modul | Izoh |
|---|-------|------|
| 8 | Siydik yo'llari infeksiyalari | UTI, cystitis, urethritis, pyelonephritis, complicated vs uncomplicated |
| 9 | Urolitiaz | tosh turlari, mexanizm, renal colic, diagnostika, davolash asoslari, profilaktika |
| 10 | BPH | etiologiya, LUTS, IPSS/DRE/PSA/uroflow/PVR, davolash. **Slug: `bph-luts`** |
| 11 | Prostatit | acute/chronic bacterial, CPPS + **Prostatit vs BPH vs Ca differensiali** |
| 12 | LUTS va siydik tutolmaslik | incontinence turlari, bladder diary, davolash prinsiplari |
| 13 | Siydik tutilishi | acute/chronic retention, kateterizatsiya asoslari |
| 14 | Torayishlar | urethral stricture, ureteral obstruction |
| 15 | Erektil disfunksiya | ED (QIYIN'dan boshlanadi — EASY bazasi yo'q), ejaculatory disorders |
| 16 | Varikotsele va scrotal patologiya | varicocele, hydrocele, epididymitis, orchitis |
| 17 | Gematuriya | gross/microscopic, glomerular vs non, diagnostik algoritm |
| 18 | Urologik travma asoslari | kidney/ureter/bladder/urethra/genital trauma |
| 19 | Bolalar urologiyasiga kirish | cryptorchidism, hypospadias, phimosis, VUR, hydronephrosis (asosiy tushuncha) |

✅ Level 2 = **bosqich sertifikati** (barcha nazoratlardan o'tish). Har darsga **nazorat banki** shart (aks holda sertifikat arzonlashadi — AGENTS.md).

### 🔴 LEVEL 3 — ADVANCED & COMPREHENSIVE (premium)
*Maqsad: Presentation → Ddx → Investigation → Interpretation → Diagnosis → Strategy → Follow-up.*

| # | Modul |
|---|-------|
| 20 | Murakkab urolitiaz va endourologiya (metabolic eval, staghorn, ESWL/URS/RIRS/PCNL, obstructed infected) |
| 21 | Advanced BPH (urodynamics, TURP/HoLEP/prostatectomy, asoratlar). **Slug: `bph-jarrohlik`** |
| 22 | Prostata saratoni (PSA turlari, PI-RADS, biopsy, Gleason/Grade Group, staging, davolash) |
| 23 | Buyrak o'smalari (RCC turlari, imaging, staging, nefrektomiya) |
| 24 | Siydik pufagi o'smalari (NMIBC/MIBC, TURBT, intravesical, cystectomy) |
| 25 | Yuqori siydik yo'llari patologiyalari (hydronephrosis, UPJ, MAG3/DTPA) |
| 26 | Neuro-urologiya (neurogenic bladder, urodynamics, botulinum, neuromodulation) |
| 27 | Erkaklar bepushtligi (spermogramma, gormonal eval, azoospermia, ART/IUI/IVF/ICSI) |
| 28 | Erkaklar gormonal patologiyalari (hypogonadism, TRT ko'rsatma/monitoring) |
| 29 | Moyak o'smalari (germ cell, markerlar AFP/β-hCG/LDH, staging) |
| 30 | Urologik onkologiya — umumiy klinik yondashuv (case-based fikrlash) |
| 31 | Urologik shoshilinch holatlar (urosepsis, torsion, Fournier, priapism) |
| 32 | Advanced pediatric urology (VUR, PUV, epispadias, pediatric stone) |
| 33 | Minimal invaziv/endourologik texnologiyalar (skoplar, lazerlar, stentlar) |
| 34 | Advanced urologik diagnostika (decision-tree: qaysi bemorga qaysi tekshiruv) |

✅ Level 3 = premium sertifikat + interaktiv case (AGENTS.md QIYIN formatlari).

---

## 5. Takrorlanish intizomi (slug)

Bir mavzu bosqichlar bo'ylab **chuqurlashadi, takrorlanmaydi** (AGENTS.md). Sluglar farqli:
- BPH: `bph-luts` (L2, klinik) · `bph-jarrohlik` (L3, operativ)
- Urolitiaz: `siydik-toshi-klinik` (L2) · `murakkab-urolitiaz` (L3)
- Pediatriya: `bolalar-urologiya-kirish` (L2) · `pediatric-urology-advanced` (L3)

Eski `dars_tarkibi` darslari **o'z slug'ini saqlaydi** (progress bog'langan). Yangi modulga joylashtirilganda slug o'zgarmaydi.

## 6. Mavjud resurslarni qayta ishlatish

- **Kalkulyatorlar** (IPSS, OAB-V8, Dubin-Amelar allaqachon bor) → BPH/LUTS darslaridan havola.
- **Eski `dars_tarkibi` kontenti** (sistit, prostatit, siydik toshi, UTT, pielonefrit…) → Level 2 modullariga manba.
- **SVG sxemalar** (AGENTS.md): prostata zonalari, gidronefroz, varikotsele gradlari — inline SVG, o'zbekcha yozuvli.

---

## 7. Bosqichli ish rejasi

### Bosqich A — Poydevor (kod) ✅ (2026-09-02, migratsiya Run kutilmoqda)
- [x] Migratsiya: `kurs_darslar` + `kurs_natijalar` — `supabase/migrations/20260916000000_kurs_darslar_3level.sql` (⏳ Supabase'da Run qilish kerak)
- [x] Admin panel `/admin/urologiya-darslar` — modul (modul_no/modul_nom) boshqaruvi bilan; AdminSidebar → Ta'lim
- [x] Talaba routing: `/student/urologiya/darslar` (landing 3 karta) + `bosqich/[b]` (modul **akkordeon**) + `[slug]` (viewer)
- [~] Dashboard "Darslar" — **hozircha eski sahifada** qoldirildi (yangi sahifa bo'sh; talabani bo'sh sahifaga yubormaslik uchun). Kontent tayyor bo'lgach Bosqich B da o'zgartiriladi.

### Bosqich B — Eski sahifani admin-only
- [ ] `/student/darslar` va `bosqich/[b]` va `[slug]` — rol gate (faqat admin) yoki `/admin/darslar-arxiv` ga ko'chirish
- [ ] Sluglar/progress buzilmasin — `talim_natijalari` tegilmaydi

### Bosqich C — Modul skeletlari (kontentsiz) ✅ (2026-09-02, migratsiya Run kutilmoqda)
- [x] 34 modul + **126 dars** skeleti — seed `supabase/migrations/20260916010000_kurs_darslar_urologiya_skelet.sql` (bo'sh `nazariya_html`, `ON CONFLICT DO NOTHING`). Taqsimot: L1=35, L2=42, L3=49. Modul raqamlari global (1–34). ⏳ Supabase'da Run qilish kerak.
- [ ] Level 1 to'liq bepul, Level 2/3 gate — pullik gate hali ulanmagan (Bosqich D / ochiq savol 1)

### Bosqich D — Kontent (deploy'siz, admin panel)
- [ ] Level 1 darslari (EASY qoidasi bilan) — birinchi navbat, bepul hook
- [ ] Level 2 darslari + **nazorat banklari** (sertifikat uchun majburiy)
- [ ] Level 3 darslari + interaktiv case

### Bosqich E — Kelajak
- [ ] `gin_darslar` ni `kurs_darslar` ga ko'chirish (ixtiyoriy, birlashtirish)
- [ ] Andrologiya / Akusherlik shu tizimda

---

## 8. Ochiq savollar (keyin hal qilinadi)

1. **Pullik gate:** Level 2/3 mavjud `tariflar` tizimidan foydalanadimi (urologiya bilan bir xil obuna), yoki alohida?
2. **Bepul namuna:** har Level'da nechta namuna dars ochiq bo'ladi?
3. **Progress:** modul-darajali progress halqasi + level unlock mantiqini `kurs_natijalar` bilan bog'lash.
4. **`gin_darslar` birlashtirish:** hozir tegmaymizmi yoki bir vaqtda umumlashtiramizmi?
