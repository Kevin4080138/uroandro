# Kalkulyatorlar bo'limi — takomillashtirish rejasi

Audit bahosi: kalkulyatorlar ~7/10. Ginekologiya urologiyadan yaxshiroq tuzilgan.
Bu reja auditdagi kamchiliklar va takliflarni bosqichlarga ajratadi.

## Shu sessiyada bajarilgan (✅)

- **Rigid tibbiy jumlalar yumshatildi** (urologiya):
  - IPSS — ball o'zi davolashni boshlamaydi; bezovtalik/QoL, asorat, tekshiruv, bemor xohishi.
  - eGFR — bitta past eGFR CKD tashxisi emas; KDIGO bo'yicha ≥3 oy yoki boshqa buyrak shikasti belgisi kerak.
  - R.E.N.A.L. — anatomik murakkablikni tavsiflaydi, operatsiya turini bir o'zi hal qilmaydi.
  - PSA zichligi 0.15 — mutlaq biopsiya chegarasi emas; MRT/hajm/yosh/anamnez bilan birga.
  - Uroflowmetriya Qmax — yosh/jins/siyilgan hajm/oqim egri chizig'isiz tashxis emas; <150 mL ishonchsiz.
  - (Clavien–Dindo IIIb allaqachon to'g'ri edi — "umumiy anesteziya ostidagi aralashuv", o'zgartirilmadi.)
- **Klaviatura/a11y** — kalkulyator kartalari `role="button"` + `tabIndex` + `onKeyDown` (Enter/Space) + `aria-label` (urologiya va ginekologiya).

## Faza 1 — Talaba tajribasini ajratish (eng yuqori ustuvorlik)

**Kamchilik #1: urologiya kalkulyatori talabani `/doctor/calculators/...` ga olib o'tadi.**

- Talaba uchun alohida sahifa qobig'i: `/student/kalkulyatorlar/[slug]` (yoki har biriga sahifa),
  ginekologiyadagi `GinekologiyaKalkulyatorQobiq` uslubida.
- Hisoblash mantig'ini `src/lib/` ga (masalan `urologiyaHisoblash.ts`) ko'chirib, doctor va
  student sahifalari bitta funksiyani ulashsin (takror bo'lmasin).
- Talaba qobig'ida bemor-panel (`KalkulyatorBemorPaneli`), saqlash va shifokor navigatsiyasi bo'lmasin.
- Kartadagi "NIMA O'RGANASIZ" o'quv izohi kalkulyator ichida ham ko'rinsin.
- 22 urologiya vositasi bosqichma-bosqich ko'chiriladi (avval eng ko'p ishlatiladiganlari: IPSS, PSA, eGFR, prostata hajmi, uroflowmetriya).

## Faza 2 — Yagona klinik izoh standarti (barcha kalkulyatorlar) 🟡 BOSHLANDI

Bajarildi:
- Umumiy `KlinikIzoh` komponenti (`src/components/KlinikIzoh.tsx`) — 5 qism + `ChegaraviyBelgi`.
- Urologiya talaba sahifalari (IPSS, PSA, eGFR) to'liq standartga o'tkazildi (chegaraviy belgi bilan).
- Ginekologiya kontent modeli 5 qism bilan kengaytirildi (`buNimaEmas`, `keyingiQadam`,
  `klinikMisol`, `kopUchraydiganXato`); `KalkulyatorKontent`/`KalkulyatorInfoSahifa` ularni ko'rsatadi;
  3 jonli gin kalkulyatori (homiladorlik-muddati, gestatsion-yosh-utt, homila-vazni) to'ldirildi.

Qoldi:
- Qolgan gin kalkulyator/ma'lumot sahifalarini 5 qism bilan to'ldirish.
- Yangi urologiya talaba sahifalari qo'shilganda shu standartni qo'llash.

Standart (eslatma uchun):

Har bir talaba kalkulyatori bir xil besh qismli tuzilishga ega bo'lsin:

1. **Natija** — son yoki kategoriya.
2. **Bu nimani anglatadi?** — sodda klinik talqin.
3. **Bu nimani anglatmaydi?** — masalan "tashxisni tasdiqlamaydi".
4. **Keyingi qadam** — qanday tekshiruv yoki mutaxassis bahosi.
5. **Klinik misol** — bitta qisqa vaziyat va javobi.

Qo'shimcha:
- **Chegaraviy natija** — natija ball/qiymat chegarasiga yaqin bo'lsa alohida ko'rsatish.
- **"Ko'p uchraydigan xato"** bloki har bir kalkulyatorda.
- Ginekologiyadagi yaxshi tuzilish (Klinik izoh / Natija talqini / Cheklovlar / Manbalar) urologiyaga ham ko'chiriladi.
- Amalga oshirish: `ginekologiyaKalkulyatorKontenti.ts` tipini kengaytirish (`buNimaEmas`, `keyingiQadam`, `klinikMisol`, `kopUchraydiganXato`, `chegaraIzoh`) va `KalkulyatorKontent`/`KalkulyatorInfoSahifa` ni yangilash.

## Faza 3 — Avtomatik testlar (kamchilik #5) ✅ BAJARILDI

- Test freymvorki: **Vitest** o'rnatildi (`vitest.config.ts`, `npm test` / `npm run test:watch`).
- 36 test o'tdi: `src/lib/ginekologiyaHisoblash.test.ts` (19) va `src/lib/urologiyaHisoblash.test.ts` (17).
- Qamrab olingan: kabisa/oy oxiri sanalari, sikl tuzatishi, embrion yoshi, INTERGROWTH CRL,
  Hadlock (golden ~3305 g), CKD-EPI 2021 (golden 104/78), birlik almashishi (mmol↔mg/dL),
  vergul/nuqta o'nlik, ball chegaralari (egfrBosqich, ipssDaraja, fpsaXavf, RMI U/M, psaYoshMezoni).
- Keyingi: Cockcroft–Gault qo'shilganda test qo'shish; CI'ga `npm test` ulash.

Tarixiy reja (bajarildi):
- Sof funksiyalarni sinash (`src/lib/ginekologiyaHisoblash.ts` va bo'lajak `urologiyaHisoblash.ts`):
  - kabisa yili va oy oxiri (sana o'tishi);
  - sikl uzunligi tuzatishi (21–35);
  - noto'g'ri / bo'sh / manfiy qiymat;
  - birlik almashishi (mmol↔mg/dL, ng/mL↔pmol/L, mm↔sm);
  - Hadlock, INTERGROWTH CRL, embrion yoshi;
  - eGFR (CKD-EPI 2021), Cockcroft–Gault;
  - ball chegarasining aynan ikki tomonidagi qiymatlar (masalan RMI 199/200, Bishop 5/8, Apgar 3/4/6/7).
- Har bir formula uchun kamida 1 ta ma'lum "oltin" qiymat (nashrdagi misol) bilan solishtirish.

## Faza 4 — Manba versiyalash va litsenziya auditi (kamchilik #3, #6)

**Manba metadatasi** — har bir kalkulyator/tasnif manbasida:
- gayd nomi, nashr/versiya, to'g'ridan-to'g'ri havola;
- "oxirgi tibbiy tekshiruv" sanasi; mas'ul muharrir; litsenziya holati.
- `manbalar` tipini `{ nom, url, versiya?, tekshirilgan?, muharrir?, litsenziya? }` ga kengaytirish.

**Litsenziya/tarjima auditi** (anketalar) — ICIQ-UI SF, IPSS, IIEF, OAB-V8, PFIQ-7, PFDI-20, MRS:
- foydalanish huquqi; o'zbekcha rasmiy tarjima; elektron shaklga ruxsat; tarjimaning klinik validatsiyasi.
- ⚠️ ICIQ materiallari mualliflik huquqi bilan himoyalangan — tijoriy platformada alohida litsenziya kerak bo'lishi mumkin.
  Havolalar: iciq.net/licences, iciq.net/validation-methodology.
- Har bir anketa sahifasida litsenziya holati ko'rsatilsin; ruxsat olinmaguncha savollar to'liq ko'chirilmasin
  (hozir ginekologiyada PFIQ/PFDI/ICIQ/MRS ma'lumot sahifasi sifatida — savolsiz — qoldirilgan).

## Faza 5 — UX yaxshilanishlari (takliflar)

- "**Nega shunday hisoblandi?**" tugmasi — formulani bosqichma-bosqich ko'rsatish.
- Natijadan keyin **1–2 ta mini-test**.
- **Tayyor misol ma'lumotlari** — bir bosishda kiritish.
- **Yaqinda ishlatilgan** va **sevimli** kalkulyatorlar ro'yxati (localStorage).
- **O'nlik son** — nuqta bilan birga **vergul**ni ham qabul qilish (input parser: `,` → `.`).

## Faza 6 — Yangi vositalar (mavjudlar mustahkamlangach)

> Ustuvorlik: avval Faza 1–4 (talaba qobig'i + standart izoh + testlar + manba/litsenziya)
> yakunlansin, keyin yangi vosita sonini oshirish.

Ginekologiya / akusherlik:
- IVF / embrion ko'chirish sanasi bo'yicha TTS;
- OHS va UTT farqi asosida muddatni qayta belgilash yordamchisi;
- homila vaznini gestatsion yoshga nisbatan percentilda ko'rsatish;
- obstetrik shok indeksi;
- homiladorlikda tavsiya etilgan vazn ortishi.

Urologiya:
- postvoid qoldiq siydik / qovuq hajmi nisbati;
- siydik toshi hajmi va taxminiy zichligi;
- prostata o'sish dinamikasi.

Umumiy: QT yoki dori dozasiga o'xshash vositalar qo'shilsa — **alohida xavfsizlik tekshiruvi** shart.

## Amalga oshirish tartibi (xulosa)

1. Faza 1 (talaba qobig'i) — eng katta talaba tajribasi ta'siri.
2. Faza 2 (standart izoh) — sifatni bir tekisga keltiradi.
3. Faza 3 (testlar) — tibbiy ishonchlilik.
4. Faza 4 (manba/litsenziya) — huquqiy va ilmiy mustahkamlik.
5. Faza 5 (UX) va Faza 6 (yangi vositalar) — yuqoridagilardan keyin.
