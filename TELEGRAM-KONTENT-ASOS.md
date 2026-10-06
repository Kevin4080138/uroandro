# Telegram kontent — 1-bosqich

## Tayyor imkoniyatlar

- `/admin/maqolalar` ichida Maqolalar, Telegram postlar va Quizlar navigatsiyasi.
- `/admin/maqolalar/telegram` va `/admin/maqolalar/quizlar`: mavzu qoralamalarini yaratish, so'nggi 50 yozuvni ko'rish, holat bo'yicha filtrlash.
- Ikkala sahifada umumiy kanal/guruh sozlamalari: nom, chat ID yoki @username, tur, vazifa va faollik; yaratish va tahrirlash.
- API har so'rovda admin rolini tekshiradi va foydalanuvchining Supabase sessiyasi bilan ishlaydi. Bazada ham admin RLS amal qiladi.
- Bot tokeni brauzerga yoki yangi jadvallarga chiqarilmaydi. Interfeys faqat serverda TELEGRAM_BOT_TOKEN borligini ko'rsatadi; bu Telegram ruxsatlari tekshirilganini anglatmaydi.

## Bazani tayyorlash

Loyihaning odatdagi Supabase migratsiya jarayonida `supabase/migrations/20261005000000_telegram_content_foundation.sql` ni qo'llang. U mavjud `public.is_admin()` va `auth.users` ga tayanadi. Mavjud maqolalar yoki bot sozlamalarini ko'chirmaydi.

Yangi jadvallar: `telegram_destinations`, `telegram_posts`, `telegram_quizzes`, `telegram_quiz_questions`, `telegram_delivery_jobs`, `telegram_delivery_parts`.

Kanal/guruh ID si matn sifatida saqlanadi. @username kichik harfga keltiriladi. Bir xil manzil takror qo'shilmaydi. Sozlamani saqlash Telegram API ga murojaat qilmaydi. `TELEGRAM_CHANNEL_ID` asosidagi eski maqola yuborish oqimi o'zgarishsiz ishlaydi.

## Navbat shartnomasi — keyingi bosqich uchun

- Navbat va yuborilgan qismlarni faqat serverdagi service-role worker yozadi; admin brauzeri faqat o'qishi mumkin.
- Har ish aynan bitta post yoki quizga, bitta manzilga va kontent versiyasiga bog'langan; takror ishga unique indeks yo'l qo'ymaydi.
- `payload` ichida tasdiqlangan kontent va yuboriladigan manzilning o'sha paytdagi nusxasi saqlanishi kerak. Keyingi tahrirlar navbatdagi nusxani yashirin o'zgartirmasligi kerak.
- `scheduled_at` timestamptz; foydalanuvchi vaqtni Asia/Tashkent bo'yicha ko'radi.
- Rasm, matn va poll uchun alohida `part_key` va Telegram identifikatorlari saqlanadi.
- Worker atomik band qilishni, ruxsat/faollikni qayta tekshirishni va yuborilgan qismlarni o'tkazib yuborishni amalga oshirishi kerak.
- Telegram javobi yo'qolgan yuborish `uncertain` holatiga o'tishi kerak: ko'r-ko'rona qayta urinish dublikat chiqarishi mumkin.
- Bu bosqich worker, cron, Telegramga xabar yuborish yoki AI generatsiyasini ishga tushirmaydi.

## Telegram postlar — tayyor

- Europe PMC orqali mavzuga mos annotatsiyali ilmiy manbalar qidiriladi.
- Gemini manbalarga tayangan o'zbekcha qoralama va inglizcha rasm qidiruv iborasini yaratadi.
- Pixabay, Pexels va Unsplash'dan litsenziya/manba ko'rsatilgan rasm variantlari chiqadi; tanlangan rasm 1600 px gacha va taxminan 150 KB WebP qilib `bannerlar/telegram-postlar` yo'liga ko'chiriladi. Pixabay qidiruv javobi API talabiga muvofiq 24 soat keshlanadi.
- Pinterest RapidAPI alohida qidiruv sifatida ishlaydi. Muallif tasdig‘i mavjud deb qabul qilinadi; admin rasmni bevosita tanlaydi, pin manbasi va tasdiq yozuvi Storage ma'lumotlarida saqlanadi.
- Pinterest natijalari `nextBookmark` orqali davom ettiriladi. Rasm pinlari asl nisbatda ko'rsatiladi; video pinlari alohida qidiruvda Pinterest manbasiga havola bilan chiqadi.
- Pinterest provayderi 5xx ichki xato qaytarsa so'rov avtomatik takrorlanmaydi (RapidAPI kvotasini bekorga sarflamaslik uchun); mavjud ochiq rasm provayderlari natijalari ogohlantirish bilan ko'rsatiladi.
- Matn, sarlavha, auditoriya va holat tahrirlanadi; eski versiya revision jadvaliga yoziladi.
- Ilmiy manbasiz post tasdiqlanmaydi. Telegramga faqat tasdiqlangan post va faol post manzili yuboriladi.
- Uzun matnda rasm va matn alohida xabar bo'ladi. Yuborish ishi va har bir qism qayd etilib, noaniq natijada dublikat yuborish bloklanadi.

Qo'shimcha migratsiya: `supabase/migrations/20261005010000_telegram_posts_delivery.sql`.

Kerakli server muhit o'zgaruvchilari: `GEMINI_API_KEY`, `GEMINI_MODEL`, ochiq rasm qidiruvi uchun kamida bittasi `PIXABAY_API_KEY`, `PEXELS_API_KEY` yoki `UNSPLASH_ACCESS_KEY`, hamda `TELEGRAM_BOT_TOKEN`. Pinterest uchun [Scrappa Pinterest Scraper](https://rapidapi.com/scrappa/api/pinterest-scraper6) xizmatiga kirish huquqi bo'lgan RapidAPI kaliti `PINTEREST_RAPIDAPI_KEY` nomi bilan qo'shiladi. Endpoint: `GET https://pinterest-scraper6.p.rapidapi.com/api/pinterest/search?query=...&limit=30`; javob `pins[].id`, `pins[].image_url`, `pins[].is_video` bo'yicha o'qiladi. Eski EaseApi3 obunasi yangi xizmatga kirish bermaydi. Kalitni almashtirgandan so'ng Vercel redeploy kerak.

## Quizlar — 3-bosqich

Yangi migratsiya: `supabase/migrations/20261005020000_telegram_quizzes.sql`.
Oldingi ikki Telegram migratsiyasidan keyin qo'llanadi; ularni qayta bajarish shart emas.

`/admin/maqolalar/quizlar` da qo'lda yoki Gemini bilan 1–5 ta savoldan iborat to'plam yaratiladi.
Bu Telegram uchun qisqa to'plam; darslarning 40/45/50 savollik amaliy banklariga tegishli emas.
Har savol 4–5 variant, bitta to'g'ri javob va majburiy izohga ega. Savol 300, variant 100,
izoh 200 belgi bilan cheklangan. Variantlar harflarini muvozanatlashda to'g'ri javob indeksi ham ko'chadi.

Vaziyatli masala faqat QIYIN klinik darajada. Normalogiyada klinik vaziyat bloklanadi.
AI manbalarni Europe PMC'dan oladi, savollar bilan manba havolalarini beradi va avtomatik
tasdiqlamaydi. Qo'lda yozilgan savol uchun manba ixtiyoriy, izoh majburiy.

Rasm yuklash JPG/PNG/WebP (4 MB gacha), muallif, nashrga ruxsat/litsenziya va shaxsiy ma'lumotlar
olib tashlangani tasdig'ini talab qiladi. Rasm 1600 px va 150 KB dan oshmaydigan WebP sifatida
Supabase `bannerlar/telegram-quizlar/<quiz-id>/<random-id>.webp` ga saqlanadi.

Savollarni ko'rib chiqing → "Tekshirdim, tasdiqlash" → faol guruh/kanalni tanlang → yuboring.
Avval rasm/vaziyat, keyin native Telegram quiz yuboriladi. Izoh umumiy matnda ochiq yuborilmaydi.
Botga guruhda xabar va poll yuborish, kanalda esa nashr qilish huquqi kerak.
Uzun to'plam qismlari Telegram cheklovlariga mos tanaffus bilan ketadi; sahifani ochiq tuting.

### Statistika

Bir marta "Statistikani Telegramga ulash" tugmasini bosing. Bu mavjud `/api/telegram/webhook`
manzilini `poll` yangilanishlariga ulaydi, kutilayotgan yangilanishlarni o'chirmaydi, mavjud
allowed_updates turlarini saqlaydi. Boshqa webhook manzili bo'lsa, uni avtomatik almashtirmaydi.
Sayt manzili `NEXT_PUBLIC_SITE_URL`, keyin `WEBSITE_URL`, so'ng `https://www.urosfera.uz` dan olinadi.
Lokal HTTP manzilda webhook ulash mumkin emas.

Yangi API kaliti kerak emas: `TELEGRAM_WEBHOOK_SECRET` berilmasa, server bot tokenidan maxfiy
HMAC qiymat hosil qiladi. Telegram poll yangilanishi shu header bilan tasdiqlanadi.
Eski login/OTP oqimi saqlangan; shaxsiy menyu guruh muhokamalariga javob bermaydi.
Webhook bazaga yoza olmasa 503 qaytaradi — Telegram qayta yetkazishi mumkin.

Statistika anonim: har savolda ovozlar, javob variantlari foizi va to'g'ri variant ko'rsatiladi.
Shaxsiy reyting yoki qatnashchi ismi yig'ilmaydi. "Yangilash" natijalarni qayta o'qiydi.
Birinchi poll yangilanishigacha "statistika kutilmoqda" ko'rinadi; bu 0 ta ovoz degani emas.
Takroriy/eski update_id yangilanishi yangi natijani almashtirmaydi.

### Yuborish yaxlitligi

Quizni saqlash va yuborishni boshlash PostgreSQL tranzaksiyasi va bir xil row lock orqali
ketadi. Yuborish boshlangan to'plam tahrirlanmaydi; savollar immutable snapshot sifatida qoladi.
Bir manzil/versiya uchun yuborish takrorlanmaydi. Telegram aniq 4xx yoki 429 bilan rad etsa,
"davom ettirish" avval yuborilgan qismlarni tashlab o'tadi. Timeout, yaroqsiz Telegram javobi,
yuborilgandan keyingi DB xatosi yoki uzilgan server jarayoni noaniq holat sifatida bloklanadi.
Bunday vaziyatda Telegramdagi holatni tekshirmay yuborish yozuvlarini tiklamang.

### Tekshiruvlar

Avtomatik testlar: savol limitlari, daraja cheklovlari, javob indeksining muvozanatlashda
saqlanishi, caption ajratish, admin API ruxsati, qisman yuborishdan davom etish va noaniq
yuborishni takrorlamaslik. Testlar haqiqiy guruhlarga xabar yubormaydi.
Yangi migratsiya va native poll ko'rinishi jonli Supabase/Telegram muhitida alohida sinovdan o'tkaziladi.

## Keyingi ishlar

4-bosqich: rejalashtirish UI, vaqt bo'yicha ro'yxat va worker qo'shildi.
Ishga tushirish: [TELEGRAM-REJALASHTIRISH.md](TELEGRAM-REJALASHTIRISH.md).
Takrorlanuvchi rejalar va mavzular ro'yxatidan ommaviy generatsiya keyingi ishlar bo'lib qoladi.

## Tekshirish

- `npm test` — admin API ruxsatlari, noto'g'ri kiritish, takroriy manzil va mavjud hisoblash testlari.
- `npx tsc --noEmit` va o'zgargan fayllar uchun ESLint.
- Migratsiyadan keyin admin bilan har ikki tabda mavzu va manzil saqlab, sahifani yangilab tekshirish; boshqa rollarga kirish taqiqlanganini tekshirish.
- Haqiqiy PostgreSQL muhitida migratsiya, RLS va navbat unique cheklovlari alohida tekshirilishi kerak.
