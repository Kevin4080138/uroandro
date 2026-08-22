# Urosfera — Loyiha strukturasi

> Bu hujjat saytning umumiy tuzilishini tushuntiradi — dizayner yoki
> dasturchiga uzatish uchun. Kod tafsilotlari emas, **umumiy xarita**.

---

## 1. Urosfera nima?

O'zbek tilidagi **urologiya ekotizimi** — bitta platformada uch xil foydalanuvchi:

- **Talaba** — bosqichli darslar, testlar, flashcard, sertifikat
- **Shifokor** — kasbiy vositalar (kalkulyatorlar), bemor boshqaruvi, ochiq profil
- **Bemor** — shifokorga murojaat, navbat, dori eslatmalari, o'z-o'zini tekshirish

Ustidan **admin** butun tizimni boshqaradi.

## 2. Texnologiyalar

| Qatlam | Texnologiya |
|--------|-------------|
| Framework | **Next.js 16** (App Router) + **React 19** |
| Til | **TypeScript** |
| Uslub (CSS) | Tailwind CSS 4 + inline `style` + `globals.css` (CSS o'zgaruvchilari: `--bg`, `--surface`, `--accent`, `--ink` ...) |
| Baza + Auth | **Supabase** (PostgreSQL + RLS + Storage + Auth) |
| Animatsiya | framer-motion |
| Grafika | recharts (statistika), lucide-react (ikonkalar) |
| Push bildirishnoma | web-push (VAPID) |
| Bot | Telegram Bot (webhook) |
| Hosting | Vercel |

> ⚠️ **Muhim dizayn qoidasi:** platforma **telefon-uchun** mo'ljallangan.
> Asosiy tajriba ≤ **680px** kenglikda. Desktop ikkilamchi.

## 3. Foydalanuvchi rollari

`profiles.role` maydoni: `student` · `doctor` · `patient` · `admin`.
Har bir rol o'z **dashboard**'iga yo'naltiriladi.

## 4. Kirish va ro'yxatdan o'tish (`/auth/*`)

| Sahifa | Vazifa |
|--------|--------|
| `/auth/login` | Kirish — **Shifokor/Talaba** (login+parol) yoki **Bemor** (telefon+parol) |
| `/auth/register` | Ro'yxatdan o'tish — rol tanlash → ma'lumot → (shifokor/talaba: Telegram OTP) → parol |
| `/auth/parol-tiklash` | Parolni tiklash — **email orqali** yoki **telefon (Telegram bot) orqali** |
| `/auth/parol-yangilash` | Email havolasidan kelib yangi parol o'rnatish |

**Autentifikatsiya usullari:**
- **Bemor:** telefon raqami → sintetik email (`p<raqam>@patient.urosfera.uz`) + parol
- **Shifokor/Talaba:** login (`<login>@urosfera.uz`) yoki haqiqiy email + parol; telefon Telegram OTP bilan tasdiqlanadi
- **Telegram Mini App:** bot ichida avto-login (imzo tekshiriladi → sessiya)
- Shifokor hisobi admin tomonidan **tasdiqlanishi** kerak (`doctor_holati`)

## 5. Bo'limlar bo'yicha struktura

### 🌐 Ochiq (login talab qilmaydi)
| Route | Nima |
|-------|------|
| `/` | Landing (bosh sahifa) — hero, imkoniyatlar, e'lonlar/banner |
| `/bemor` | Bemor "eshigi" — yordam tugmalari (shifokor topish, o'z-tekshiruv, savollar ...) |
| `/shifokorlar` | Shifokorlar katalogi (ochiq profillar, reyting) |
| `/darslar`, `/darslar/[slug]` | Ochiq darslar (SEO) |
| `/kasbiy` | Kasbiy taqdimot sahifasi |
| `/sertifikat/[kod]` | Sertifikatni commonda tekshirish |

### 🧑 Bemor (`/patient/*`)
| Route | Nima |
|-------|------|
| `/patient/dashboard` | Bosh panel |
| `/patient/murojaat`, `/murojaatlarim` | Shifokorga shikoyat yozish va tarix |
| `/patient/navbat` | Navbatga yozilish |
| `/patient/dorilarim` | Retsept va dori qabul eslatmalari |
| `/patient/operatsiya-kuzatuvim` | O'z operatsiyasini kuzatish |
| `/patient/operatsiyalar`, `/[slug]` | Operatsiyalar haqida oddiy tilda |
| `/patient/oz-tekshiruv`, `/[slug]` | O'z-o'zini tekshirish (belgilar bo'yicha) |
| `/patient/qaysi-tahlil` | Qaysi tahlil kerakligi |
| `/patient/savollar` | Ko'p so'raladigan savollar |

### 🎓 Talaba (`/student/*`)
| Route | Nima |
|-------|------|
| `/student/dashboard` | Bosh panel |
| `/student/darslar`, `/[slug]`, `/bosqich/[bosqich]` | Bosqichli darslar (Easy / O'rta / Qiyin) |
| `/student/camu`, `/camu/darslar/[slug]` | CAMU bo'limi |
| `/student/andrologiya`, `/operativ-urologiya`, `/klassifikatsiyalar` | Maxsus bo'limlar |
| `/student/kalkulyatorlar`, `/kutubxona` | Vositalar va materiallar |
| `/student/ozingizni-tekshiring` | Bilim sinovi |
| `/student/natijalarim`, `/reyting` | Progress va reyting |
| `/student/sertifikat/[kod]` | Sertifikat |
| `/student/profil/*` | Profil, bildirishnomalar, feedback, oferta, taklif (referral) ... |

### 👨‍⚕️ Shifokor (`/doctor/*`)
| Route | Nima |
|-------|------|
| `/doctor/dashboard` | Bosh panel |
| `/doctor/patients`, `/[id]`, `/[id]/natija`, `/[id]/hujjatlar` | Bemorlar bazasi |
| `/doctor/murojaatlar`, `/navbatlar` | Kelgan murojaat va navbatlar |
| `/doctor/calculators/*` | **25+ tibbiy kalkulyator** (IPSS, PSA, eGFR, spermogramma, varikotsele ...) |
| `/doctor/operatsiya-kuzatuvi` | Operatsiya kuzatuvi |
| `/doctor/protokollar`, `/qollanmalar`, `/kutubxona` | Kasbiy materiallar |
| `/doctor/shablonlarim`, `/[id]` | Shaxsiy shablonlar |
| `/doctor/ochiq-profil`, `/faoliyat`, `/statistika` | Ochiq profil va statistika |
| `/doctor/print/[tashrifId]`, `/print/referral/...` | Chop etish (retsept, yo'llanma) |

### 🛡 Admin (`/admin/*`)
Kontent va foydalanuvchilarni boshqarish: `dashboard`, `oquvchilar`, `users`,
`shifokorlar` (tasdiqlash), `darslar`, `testbank`, `maqolalar`, `adabiyotlar`,
`bannerlar`, `bildirishnomalar`, `push`, `sertifikatlar`, `obunalar`, `tariflar`,
`klinikalar`, `katalog`, `statistika`, `talabalar-nazorati`, `fikrlar`, `audit`, `faq`.

## 6. Server (API) — `/api/*`

- **auth:** `verify-otp`, `reset-password`
- **telegram:** `webhook` (bot xabarlari), `auth` (Mini App login)
- **push:** `subscribe`, `broadcast`, va hodisaga oid xabarnomalar (murojaat, retsept, operatsiya ...)
- **cron:** kunlik eslatmalar (dori, navbat, operatsiya, javobsiz murojaat, talaba seriyasi)
- **admin:** foydalanuvchi boshqaruvi, shifokor tasdiqlash
- **referral, sertifikat:** taklif kodi va sertifikat berish

## 7. Ma'lumotlar bazasi (Supabase)

- **Auth:** Supabase Auth (sessiya cookie orqali, RLS bilan himoyalangan)
- **Asosiy jadvallar:** `profiles`, `dars_tarkibi` (dars kontenti), `talim_natijalari`
  (progress), `bannerlar` + `banner_sozlamalar`, `telegram_otp`, murojaat/navbat/
  retsept jadvallari va h.k.
- **Storage:** `bannerlar` (rasm) va boshqa bucket'lar
- **Xavfsizlik:** har jadvalda **RLS siyosatlari** (rol asosida kim nima ko'radi)

> ⚠️ Dars **kontenti kodda emas** — `dars_tarkibi` jadvalida saqlanadi.
> Yangi dars deploy'siz qo'shiladi.

## 8. Papka strukturasi (qisqa)

```
src/
├── app/            # Next.js sahifalar (route'lar) — yuqoridagi bo'limlar
│   ├── auth/       # kirish, ro'yxat, parol
│   ├── patient/    # bemor bo'limi
│   ├── student/    # talaba bo'limi
│   ├── doctor/     # shifokor bo'limi
│   ├── admin/      # admin panel
│   ├── api/        # server endpointlar
│   ├── page.tsx    # landing (/)
│   └── globals.css # global uslub + CSS o'zgaruvchilari
├── components/     # qayta ishlatiladigan UI (Header, BannerCarousel, Hero ...)
└── lib/            # yordamchi mantiq (supabase, auth, kalkulyatorlar, push ...)
supabase/           # SQL sxema va migratsiyalar
```

## 9. Dizayner uchun muhim eslatmalar

- **Telefon birinchi** — barcha ekran ≤680px da mukammal ko'rinishi shart
- **Yorug'/Tungi tema** — CSS o'zgaruvchilari orqali (`--bg`, `--surface`, `--accent` ...)
- **Ikonkalar:** UI "chrome" da `lucide-react` (SVG); xabar/kontentda emoji
- **Ranglar:** asosiy aksent `--accent` (ko'k `#2563eb`); iliq palitra varianti
  ham muhokamada
- Kontent tili — **o'zbekcha** (lotin)
