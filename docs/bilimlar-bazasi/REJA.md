# Bilimlar bazasi — yoʻl xaritasi

> Tasdiqlangan tibbiy manbalardan yangilik va maqolalarni avtomatik yigʻish, tarjima
> qilish, tekshirish, teglash va talaba/shifokor boʻlimlarida alohida feʼd qilib
> koʻrsatadigan tizim. Vizual versiya: [`yangiliklar-reja.html`](./yangiliklar-reja.html).

## Maqsad

Hozir qandaydir yangilikni bilish uchun internetdan qidirish, uning tasdiqlangan
yoki tasdiqlanmaganini aniqlash kerak. Bu jarayonni avtomatlashtiramiz: tizim oʻzi
ishonchli manbalardan material topib, tarjima qilib, ishonch darajasini koʻrsatib,
boʻlim ichida toʻplanadigan arxiv qiladi.

## Diagnoz — hozirgi holat

**Tayyor poydevor:**
- Adapter arxitekturasi — `src/lib/newsSources/registry.ts` har manba uchun modul
- Saralash (`newsRanking.ts`), dedup, relevance, xato-izolyatsiya ishlaydi
- Gemini tarjima uch auditoriya (talaba/shifokor/bemor) uchun
- Rol boʻyicha banner + Telegram + public `/yangiliklar`
- GitHub Actions cron, kuniga 2 marta

**Tor joylar:**
- Faqat PubMed + NIDDK ishlaydi; ACOG/AUA/EAU/NICHD adapterlari "unavailable"
- Har run'da faqat 1 ta maqola (`eligible[0]`) — baza sekin toʻladi
- Kontent boʻlim ichida faqat banner'da — alohida feʼd/arxiv yoʻq
- Avto-tasdiq "hammasi yoki hech nima" (env flag)
- Tarjimada sifat darvozasi yoʻq; teglash / taksonomiya yoʻq

## Beshta ustun (asosiy tavsiya)

1. **"Tasdiqlangan manba" = ishonch darajali roʻyxat + koʻrinadigan belgi** —
   foydalanuvchi izlanmaydi, ishonch darajasini bir qarashda koʻradi.
2. **Bosqichli avto-tasdiqlash** — yuqori ball + ishonchli manba + validatsiya →
   avto-nashr; past ishonch → admin navbati. Avtomatik, ammo javobgarlik nazoratda.
3. **Boʻlim ichida alohida "Bilimlar bazasi" feʼdi** — `audience` boʻyicha filtr.
4. **Koʻp-maqola oqimi + avto-teglash** — baza tez toʻladi, browsable boʻladi.
5. **Sifat va huquqiy darvoza** — faqat annotatsiyadan tarjima, bemor koʻrinishida
   doza yoʻq, majburiy disclaimer, oʻz SVG/rasmlari.

## Toʻliq oqim

```
Manbalar → Ingestion → Tarjima+sifat → Teglash → Avto-tasdiq → Baza → Boʻlim feʼd
(tier 1–3) (top-N·dedup) (Gemini·lint)  (mavzu)    (ball+tier)  (arxiv) (talaba·shifokor)
```

## Bosqichlar

### Bosqich 0 — Poydevor: maʼlumotlar modeli (~2–3 kun)
Baza va belgilar tizimi uchun ustunlar. UI oʻzgarishisiz, keyingi hammasi shunga tayanadi.
- `yangiliklar` ga: `trust_tier`, `verification_status`, `auto_published`, `tags text[]`, `reading_level`
- `yangilik_manbalari` ga: `trust_tier` (1–3) va litsenziya turi
- Yangi `saqlangan_maqolalar` jadvali (bookmark)
- Yangi `yangilik_teglari` lugʻati (mavzu taksonomiyasi + oʻzbekcha nom)

**Holat:** ✅ migratsiya tayyor — `supabase/migrations/20260910000000_bilimlar_bazasi_poydevor.sql`
(admin panelda **Run** qilinishi kutilmoqda). `NewsRow` turi yangilandi (`newsTypes.ts`).

### Bosqich 1 — Ingestion'ni kuchaytirish (~3–5 kun)
Koʻp-maqola va koʻp-manba. Bloklangan sayt scraping emas — bot-doʻst, ochiq litsenziya.
- ✅ `newsRun.ts` — bitta oʻrniga eng yaxshi top-N ingest qiladi (sikl + `maqolaniYarat`)
- ✅ `NEWS_MAX_PER_RUN` env (default 3, 1–10 oraligʻi) — `newsConfig.ts`
- ✅ Har maqolaga manbadan `trust_tier` koʻchiriladi; avto-nashrda `verification_status='tasdiqlangan'`
- ✅ Telegram faqat eng yuqori maqola uchun (kanal spam boʻlmasin)
- ✅ Europe PMC adapteri — `newsSources/adapters/europepmc.ts` (ochiq JSON API, jonli tasdiqlangan);
  PMID/DOI orqali PubMed bilan avtomatik dedup; 3 manba seed: `20260911000000_europepmc_manbalari.sql`
- ⏳ Qolgan adapterlar: medRxiv/bioRxiv, DOAJ, WHO
- ⏳ PubMed qidiruvlarini kengaytirish
- NCBI rate-limit (3 req/s) va fetch izolyatsiyasini hurmat qilish (mavjud)

### Bosqich 2 — Tarjima sifati + avto-teglash (~3–4 kun) ✅
- ✅ `newsContent.ts` — Gemini javobiga `tags`, `reading_level`, `confidence` qoʻshildi
- ✅ Xavfsizlik lint (`xavfsizlikTekshir`): bemor matnida doza/individual koʻrsatma → confidence ≤ 40
- ✅ Teglar `yangilik_teglari` lugʻatidan tanlanadi (prompt'ga ruxsat etilgan slug'lar beriladi, kod validatsiya qiladi)
- ✅ `newsRun.ts` — tags/reading_level saqlanadi, confidence+safety `source_metadata`da
- ⏳ Past-confidence'ni avto-tasdiqdan tiyish — Bosqich 3 da (chegara qoidasi)

### Bosqich 3 — Bosqichli avto-tasdiqlash (~2–3 kun)
- Qoida: `ball ≥ chegara` + `trust_tier = 1` + validatsiya → avto-publish + banner
- Aks holda → `draft` navbati
- Har avto-nashr audit log'ga (`auto_published` + sabab)
- "✔ Tasdiqlangan manba" belgisi `verification_status`'dan

### Bosqich 4 — Boʻlim ichida feʼd (asosiy maqsad) (~5–7 kun) ✅
- ✅ `/student/yangiliklar` va `/doctor/yangiliklar` — umumiy `YangiliklarFeed` komponenti, `audience` filtri
- ✅ Mavzu (teg) va yoʻnalish boʻyicha filtr, sarlavha boʻyicha qidiruv
- ✅ Har kartada: "✔ Tasdiqlangan" belgisi, oʻqish darajasi, manba, sana
- ✅ Saqlash (bookmark → `saqlangan_maqolalar`), "Saqlangan" filtri; telefon-first
- ✅ Ikkala dashboard'ga "Yangiliklar" kartasi qoʻshildi
- ⏳ "oʻqildi" holati — keyingi (alohida jadval kerak)

### Bosqich 5 — Personalizatsiya va yetkazish (keyingi toʻlqin)
- Haftalik/kunlik digest (push + Telegram)
- Tegga obuna
- Darsga bogʻlash: tegga mos yangilik dars sahifasida
- Oʻqish tarixiga asoslangan tavsiya

## Manba ishonch darajalari

| Manba | Daraja | Nega |
|-------|--------|------|
| PubMed · Europe PMC · NIDDK | Tier 1 | Indekslangan, API-li, annotatsiya ochiq |
| DOAJ ochiq jurnallar · WHO | Tier 1 | Ochiq litsenziya (CC BY), tijoriy ruxsat |
| medRxiv / bioRxiv preprint | Tier 2 | Yangi, ammo peer-review'siz — belgi bilan |
| AUA · EAU · ACOG | Tier 3 | Bot/AI cheklovi — faqat qoʻlda havola |

## Xavflar va yumshatish

| Xavf | Yumshatish |
|------|-----------|
| Tibbiy javobgarlik | Bosqichli avto-tasdiq; disclaimer; bemor koʻrinishida doza yoʻq |
| Gemini xarajati | Faqat top-N tarjima; dedup nashrdan oldin; token limiti |
| Sifat "drift"i | `confidence` maydoni; xavfsizlik lint; past-ball → admin |
| Rate-limit / uzilish | Mavjud fetch izolyatsiyasi; per-manba interval; xato log |
| Mualliflik huquqi | Faqat annotatsiyadan qayta yozish; rasm — oʻz SVG yoki CC BY |

## Boshlash tartibi

**Bosqich 0 + 4 ni birinchi.** Bosqich 0 (schema) — poydevor. Undan keyin Bosqich 4
(boʻlim feʼdi) mavjud published maqolalar bilan bugunoq ishlaydi. Avtomatizatsiya
(1–3) feʼd tayyor boʻlgach uni toʻldiradi.
