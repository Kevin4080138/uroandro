# Reja — Admin panelini mustahkamlash

> Admin sahifalarining 6 ta zaif tomonini bartaraf etish. Tahlil: 2026-09-01.
> Bu fayl CRM/yangi-funksiya rejasi ([REJA-ADMIN-BOLIMI.md](REJA-ADMIN-BOLIMI.md)) dan
> **alohida** — bu yerda mavjud kodni tuzatish, u yerda yangi bo'limlar.
> Bajarilgani sari `[ ]` → `[x]`.

Ustuvorlik: **F1 (ko'lam) → F2 (xatolik+audit) → F3 (dizayn birligi) → F4 (a11y) → F5 (kichik) → F6 (CRM, alohida rejada)**.

---

## F1 — Ko'lam: agregatsiyani serverga ko'chirish 🔴 eng jiddiy

**Muammo.** `talabalar-nazorati` butun `dars_qadam_progress`, `talim_natijalari`,
`obunalar` jadvallarini **limit'siz** brauzerga tortadi va agregatsiyani `useMemo`'da
JS'da qiladi ([page.tsx:67-81](src/app/admin/talabalar-nazorati/page.tsx#L67)).
Dashboard bitta `useEffect`'da **~14 parallel** so'rov yuboradi
([dashboard/page.tsx:60-73](src/app/admin/dashboard/page.tsx#L60)).
Foydalanuvchi ko'paysa — sekinlashadi va uziladi.

**Yechim: Postgres RPC (`SECURITY DEFINER`) — agregatsiya bazada.**
Loyihada RPC namunasi bor (`src/lib/talim/seriya.ts`, `patient/dorilarim` `.rpc(...)`).

- [x] Migratsiya [`20260916000000_admin_analitika_rpc.sql`](supabase/migrations/20260916000000_admin_analitika_rpc.sql):
  - [x] `admin_talabalar_xulosa()` → har talaba uchun bitta qator (`GROUP BY` bazada).
        `darslar[]` (tegilgan slug'lar) ham qaytadi — bosqich filtri klient tarafda ishlashi uchun.
  - [x] `admin_dashboard_kpi()` → bitta qatorda barcha KPI + rol taqsimoti. 14 so'rov → 1.
  - [x] `admin_yangi_azolar_7kun()` → `generate_series` + LEFT JOIN (bo'sh kunlar 0).
  - [x] Har funksiyada boshida `is_admin()` guard (loyihadagi mavjud helper), aks holda `RAISE`.
        `REVOKE ... FROM PUBLIC` + `GRANT EXECUTE ... TO authenticated`.
- [x] `talabalar-nazorati/page.tsx`: 4 ta `.from().select()` → 1 ta `.rpc('admin_talabalar_xulosa')`.
      Katta agregatsiya `useMemo` olib tashlandi; xato holati (`xatolik`) qo'shildi.
      Umumiy o'rtacha foiz — urinishlar soniga tortilgan o'rtacha bilan qayta hisoblandi.
- [x] `dashboard/page.tsx`: `Promise.all([...14])` → 2 `.rpc` + 2 yengil so'rov (profil, so'nggi a'zolar).
- [ ] **Server-side pagination** `talabalar-nazorati` — kechiktirildi. Sabab: bir talaba = bir
      qator agregatsiyasi ko'lam muammosini allaqachon hal qildi (event-jadvallar endi tortilmaydi);
      bosqich filtri klient slug→bosqich xaritasiga tayanadi. Kerak bo'lsa RPC'ga `limit/offset` +
      `p_bosqich` qo'shiladi. (`users` da `range()` allaqachon bor.)
- [x] `.xlsx` eksport butun natijadan — RPC barcha talabalarni qaytargani uchun `korinadigan`
      (filtrlangan to'liq to'plam) eksport qilinadi, sahifalanmagan.

**Kutilgan natija.** Sahifa yuklovi O(foydalanuvchi soni) o'rniga O(1) so'rovga tushadi;
JS tarafda katta massiv yo'q.

---

## F2 — Mutatsiyalar: xatolik boshqaruvi + audit + xavfsizlik 🔴

**Muammo.** `changeRole`, `toggleFaol`, `toggleArxiv`, `obunaBer`, `obunaniBekorQil`
klientdan **to'g'ridan-to'g'ri** `supabase.update/upsert/delete` qiladi
([users/page.tsx:109-146](src/app/admin/users/page.tsx#L109)) — optimistik UI yangilanadi,
lekin `.update()` xato bersa **catch/rollback yo'q**, UI "muvaffaqiyat" ko'rsatib qolaveradi.
Rol o'zgartirish (privilege escalation) klientdan, **audit yozuvisiz**.

> Infratuzilma tayyor: `admin_audit_log` jadvali va audit sahifasidagi
> `rol_ozgartirish/faol_ozgartirish/obuna_berish` yorliqlari mavjud — faqat
> mutatsiyalar server orqali o'tkazilmagani uchun yozuv tushmaydi.

- [x] Yagona server route [`POST /api/admin/foydalanuvchi-amal`](src/app/api/admin/foydalanuvchi-amal/route.ts):
  - [x] `amal`: `rol_ozgartirish` | `faol_ozgartirish` | `arxiv_ozgartirish` | `obuna_berish` | `obuna_bekor`.
  - [x] Admin guard → yozuv → xato bo'lsa `500 { error }`; obuna/bosqich/rol qiymatlari validatsiya qilinadi.
  - [x] **Audit yozuv ikki client bilan to'g'ri taqsimlandi:** profiles/obunalar yozuvi
        `createServerSupabase` (foydalanuvchi konteksti — RLS + trigger `auth.uid()`), audit INSERT
        esa `createAdminClient` (service role — audit jadvalida INSERT siyosati yo'q).
  - [x] `rol_ozgartirish` — mavjud AFTER UPDATE trigger'i eski→yangi rolni **avtomatik** yozadi,
        shuning uchun route qo'lda insert qilmaydi (takror bo'lmasin). Qolgan amallar qo'lda yoziladi.
  - [x] Oxirgi adminni himoya: rol'ni admin'dan tushirish yoki oxirgi faol adminni bloklash to'siladi;
        o'zini bloklash ham to'siladi.
- [x] Klientda ([users/page.tsx](src/app/admin/users/page.tsx)): 5 mutatsiya route orqali,
      optimistik yangilash **qoladi**, `res.ok` bo'lmasa eski holatga **rollback**.
- [x] Xato banneri (`amalXato` state, `role="alert"`, fixed pastki banner + "Yopish").

---

## F3 — Dizayn birligi: emoji+hex → tokenlar+lucide 🟡

**Muammo.** Dashboard toza (dizayn tokenlari + `lucide-react`), lekin
`users` va `talabalar-nazorati` emoji (🎓💳🔥✅🟢🟡🔴) va qattiq-kodlangan hex
(`#16a34a`, `#dc2626`, `#d97706`) bilan to'lgan — ikki xil "ovoz".
Obuna bosqichi **faqat rang-emoji** bilan farqlanadi, matnli belgi yo'q
(rang ko'rmaydiganlar uchun tushunarsiz).

- [x] Qattiq hex/`rgba` → tokenlar: `faollikRang`/`foizRang` (`--good`/`--warn`/`--danger`/`--muted`),
      nazorat belgisi, obuna chip, `users` holat/o'chirish tugmalari, tasdiqlash `#059669→var(--good)`.
      Yumshoq fon uchun `color-mix(in srgb, var(--good) 12%, transparent)` (loyihada ishlatiladigan usul).
  > Eslatma: recharts SVG `fill` CSS var'ni o'qimaydi — donut'dagi `ROLE_HEX` **hex qoldirildi**, bu to'g'ri.
- [x] KPI emojilari (🎓💳🔥✅🎯) → `GraduationCap/CreditCard/Flame/CheckCircle2/Target` (dashboard bilan bir tilda).
      Sarlavha 📈→`TrendingUp`, eksport ⬇→`Download`, nazorat 🎓→`GraduationCap`.
  > `ROLLAR` select emojilari (🎓👨‍⚕️🧑🛠️) **qoldi** — `<option>` ichida SVG render qilib bo'lmaydi.
      Amal tugmalaridagi ✎🗄️🗑️ ham qoldi (yonida matn bor, a11y'ga xalal bermaydi).
- [x] **Obuna bosqichi belgisiga matn** — `Oson/O'rta/Qiyin` chip (rang nuqta + matn + `aria-label`),
      ikkala sahifada (`users` toggle va `talabalar-nazorati` ko'rsatkich). Rang-only muammosi hal.

---

## F4 — Accessibility 🟡

**Muammo.** KPI kartalar va tez-havolalar `<div onClick>` — tugma emas, klaviatura/aria yo'q
([dashboard:168](src/app/admin/dashboard/page.tsx#L168), [dashboard:267](src/app/admin/dashboard/page.tsx#L267)).
Jadval qatorlari bosiladi lekin fokuslanmaydi
([talabalar-nazorati:296](src/app/admin/talabalar-nazorati/page.tsx#L296)).

- [x] Bosiladigan `<div onClick>` → element: dashboard KPI kartalari → `<button>` (reset stillar bilan),
      "Boshqaruv paneli" havolalari → `<Link>`.
- [x] Jadval qatori (`talabalar-nazorati`): `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter/Space) + `aria-label`.
- [x] Ikonka-only obuna pill'iga `aria-label` + `aria-pressed`.
- [x] Fokus ko'rinishi: global `:focus-visible` outline ([globals.css](src/app/globals.css)).
- [x] Dashboard KPI tugmalariga `aria-label` (masalan "7 kunda faol talabalar: 12").

---

## F5 — Kichik yetishmovchiliklar 🟢

- [x] **Saralash** — `talabalar-nazorati` da ustun sarlavhasini bosib saralash: ism ·
      tugallangan · qadamlar · urinishlar · o'rtacha · nazorat · oxirgi faollik.
      Yo'nalish (▲/▼) toggle, klient tarafda (xulosalar allaqachon kichik massiv).
- [x] **Qidiruv xavfsizligi** — kiritma `.or()` ga kirishdan oldin tozalanadi:
      `.replace(/[,()*\\]/g, ' ')` (vergul/qavs/wildcard grammatikani buzmasin).
- [x] **Bulk amallar** — `users` da tanlash checkbox'lari (+ select-all) va ommaviy
      Arxivlash / Chiqarish. Route har id uchun chaqiriladi (`Promise.all`); biror amal
      muvaffaqiyatsiz bo'lsa ro'yxat qayta yuklanadi.
- [x] Obuna muddat popover'i tashqariga bosilganda yopiladi (`useRef` + `mousedown` listener).

---

## F6 — Chala bo'limlar (alohida rejada)

Nav'dagi "Tez orada": CRM/qo'ng'iroqlar, buyurtmalar, promokodlar, o'qituvchilar, yo'nalishlar.
To'liq reja allaqachon bor → [REJA-ADMIN-BOLIMI.md](REJA-ADMIN-BOLIMI.md) (CRM asosiy keyingi ish).
Bu fayl faqat mavjud kodni mustahkamlashga qaratilgan; F6 shu yerda kuzatilmaydi.

---

## Bosqichma-bosqich yetkazish

1. **PR-1 (F1):** RPC migratsiyalari + `talabalar-nazorati` va `dashboard` ni RPC'ga o'tkazish.
   *Eng katta ta'sir, mustaqil.*
2. **PR-2 (F2):** server mutatsiya route + audit + klient rollback.
3. **PR-3 (F3+F4):** dizayn birligi + a11y (birga, chunki ikkalasi ham UI qatlami).
4. **PR-4 (F5):** saralash, bulk, qidiruv escape, popover.

Har PR push'dan keyin production'da tekshiriladi (ish jarayoni qoidasi).
Migratsiyalarni foydalanuvchi o'zi Supabase'da Run qiladi.
