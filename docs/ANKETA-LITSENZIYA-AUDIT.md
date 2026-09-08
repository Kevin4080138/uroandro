# Anketa va model litsenziya auditi

Kalkulyatorlarda ishlatiladigan validatsiyalangan so'rovnoma va tashqi modellarning
huquqiy holati. Urosfera **tijoriy** platforma bo'lgani uchun bu jiddiy huquqiy masala:
faktlar (chegara qiymatlar, formulalar) himoyalanmaydi, ammo **so'rovnoma savollari
matni, rasmiy tarjimalar va ayrim modellar** mualliflik huquqi bilan himoyalangan.

Holat belgilari: ✅ erkin ishlatsa bo'ladi · ⚠️ ruxsat/validatsiya kerak · ⛔ ruxsatsiz savol matni ishlatilmaydi

## So'rovnomalar

| Anketa | Bo'lim | Foydalanish huquqi | O'zbek tarjimasi | Validatsiya | Holat | Harakat |
|--------|--------|--------------------|------------------|-------------|-------|---------|
| **ICIQ-UI SF** | Uroginekologiya | Himoyalangan (iciq.net/licences) | Rasmiy talab | Rasmiy metodika talab | ⛔ | Hozircha faqat ma'lumot sahifasi (savolsiz). Ro'yxatdan o'tish + litsenziya + validatsiyalangan tarjima olinmaguncha savollar joylanmaydi |
| **PFIQ-7** | Uroginekologiya | Himoyalangan (Barber 2005) | Ruxsat kerak | Kerak | ⛔ | Ma'lumot sahifasi; savollar litsenziyasiz kiritilmaydi |
| **PFDI-20** | Uroginekologiya | Himoyalangan (Barber 2005) | Ruxsat kerak | Kerak | ⛔ | Ma'lumot sahifasi; savollar litsenziyasiz kiritilmaydi |
| **MRS (Menopauza)** | Reproduktiv | Rasmiy manual | Rasmiy tarjima ro'yxati bor | Rasmiy | ⚠️ | Ma'lumot sahifasi; rasmiy tarjimadan foydalanilsa savol banki qo'shiladi |
| **IPSS / AUA-SS** | Urologiya | Keng tarqalgan, erkin ishlatiladi | Mavjud (tekshirish tavsiya) | — | ✅/⚠️ | Talaba sahifasida savollar bilan ishlaydi; rasmiy tarjimani tekshirish tavsiya |
| **IIEF-5 / SHIM** | Urologiya (doctor) | Himoyalangan (Pfizer/IIEF) | Ruxsat masalasi | — | ⚠️ | Shifokor sahifasida; tijoriy foydalanishda huquqni tekshirish |
| **OAB-V8** | Urologiya (doctor) | Himoyalangan (Pfizer) | Ruxsat masalasi | — | ⚠️ | Shifokor sahifasida; huquqni tekshirish |
| **NIH-CPSI** | Urologiya (doctor) | Erkin (NIH) | Tekshirish | — | ✅ | Erkin, lekin tarjimani tekshirish |
| **ADAM / AMS / PEDT / EHS** | Urologiya (doctor) | Har biri alohida | Tekshirish | — | ⚠️ | Har biri uchun manba huquqini alohida tekshirish |

## Modellar / vositalar (algoritm litsenziyasi)

| Vosita | Holat | Harakat |
|--------|-------|---------|
| **FRAX** | ⚠️ nomi va algoritmi litsenziyaga ega | Rasmiy vosita/APIga havola; formulani qayta yozmaslik |
| **IOTA ADNEX** | ⚠️ rasmiy model | Foydalanish shartlari; koeffitsiyentlarni qayta yozmaslik |
| **ROMA** | ⚠️ assay platformasiga bog'liq | Ishlab chiqaruvchi cutoff/yo'riqnomasi |
| **ASCCP risk** | ⚠️ rasmiy web ilova | Rasmiy ilovaga havola; statik nusxa eskiradi |
| **AMH referens** | ⚠️ assay ishlab chiqaruvchisiga bog'liq | Mos jadval manbasini ko'rsatish |
| FIGO / WHO / rASRM / Bishop / Apgar / RMI / IOTA Simple Rules | ✅ ochiq klinik gayd/formula | Faktlarni o'z so'zi bilan; rasmiy hujjatga havola |

## Amalga oshirilgan (shu sessiya)

- Ginekologiya kontent modeliga `litsenziya` maydoni qo'shildi; himoyalangan
  anketa/modellarga holat yozildi va sahifada `ManbaMeta` orqali ⚖️ belgisi bilan ko'rsatiladi.
- Barcha kalkulyator sahifalarida **oxirgi tibbiy tekshiruv sanasi + mas'ul muharrir**
  (`ManbaMeta`) ko'rsatiladi.
- Himoyalangan so'rovnomalar (ICIQ, PFIQ-7, PFDI-20, MRS) hozircha **savolsiz ma'lumot
  sahifasi** sifatida qoldirilgan.

## Qoladi

- Har bir ⚠️/⛔ anketa uchun rasmiy litsenziya/ruxsatni yozma olish va faylga biriktirish.
- Ruxsat olingach: validatsiyalangan o'zbek tarjimasi bilan savol bankini qo'shish.
- Manbalarga to'g'ridan-to'g'ri (versiyali) havolalarni bosqichma-bosqich qo'shish
  (hozir manba nomi + yil bor; URL keyingi bosqichda).
- Shifokor bo'limidagi IIEF-5, OAB-V8, ADAM, AMS, PEDT, EHS sahifalariga ham litsenziya izohi.
