# Telegram postlar va quizlarni rejalashtirish

Admin → Maqolalar → Rejalashtirish. Avval post yoki quizni o'z bo'limida saqlang va tasdiqlang.
Rejada kontent, Telegram manzili va Toshkent vaqti (UTC+5) tanlanadi. Brauzer boshqa vaqt
mintaqasida bo'lsa ham, kiritilgan vaqt Toshkent vaqti deb olinadi.

## Bir martalik ishga tushirish

1. Supabase SQL Editor'da `supabase/migrations/20261005030000_telegram_schedules.sql` ni bajaring.
   Avvalgi Telegram postlar/quiz migratsiyalari allaqachon bajarilgan bo'lishi kerak.
2. Kodni production'ga joylang. Vercel Production muhitida `TELEGRAM_BOT_TOKEN` va kamida
   16 belgili tasodifiy `CRON_SECRET` bo'lsin. Mavjud CRON_SECRET ishlatiladi; uni almashtirsangiz
   shu kalitdan foydalanayotgan boshqa cron xizmatlarini ham yangilash kerak.
3. Supabase Database → Extensions orqali `pg_cron` va `pg_net` ni yoqing.
4. Supabase Vault'da quyidagi nomli ikkita secret yarating:
   - `telegram_scheduler_url`: `https://www.urosfera.uz/api/cron/telegram-kontent`
     (boshqa production domeni bo'lsa o'shani yozing; yo'naltirishsiz to'g'ridan-to'g'ri URL).
   - `telegram_scheduler_secret`: Vercel'dagi **aynan CRON_SECRET qiymati**.
5. `supabase/telegram-scheduler-setup.sql` ni SQL Editor'da bajaring. U har daqiqada
   worker'ni chaqiradigan `urosfera-telegram-scheduler` nomli vazifani yaratadi.
   Shu faylni qayta bajarish nomlangan cron'ni yangilaydi; qo'shimcha nusxa yaratmaydi.
6. Bir necha daqiqadan so'ng Rejalashtirish sahifasida **Yangilash** ni bosing.
   "Avtomatik tekshiruv ishlayapti" va oxirgi tekshiruv vaqti ko'rinishi kerak.

Vercel Hobby cron'i kuniga bir marta ishlashi sababli har daqiqalik tekshiruv uchun Supabase
Cron ishlatiladi. `vercel.json` dagi mavjud kunlik vazifalar o'zgarmaydi. Pro'da ham shu usul ishlaydi;
bir vaqtda ikkinchi scheduler ulash kerak emas.

Rasmiy hujjatlar: [Supabase Cron](https://supabase.com/docs/guides/cron/quickstart),
[Vault bilan rejalashtirish](https://supabase.com/docs/guides/functions/schedule-functions),
[Vercel cron cheklovlari](https://vercel.com/docs/cron-jobs/usage-and-pricing).

## Ishlash tartibi

- Rejani yuborish boshlanmaguncha boshqa vaqtga ko'chirish yoki bekor qilish mumkin.
- Faol reja kontentning tasdiqlangan versiyasini o'zgartirishni va manzil chat_id'sini
  almashtirishni bloklaydi. Tahrir kerak bo'lsa, avval rejani bekor qiling.
- Avval yuborish boshlangan kontent yangi rejaga olinmaydi. Bu qisman yuborilgan yoki
  noma'lum natijali kontentning tasodifan qayta yuborilishini cheklaydi.
- Bir cron murojaati navbatdagi bitta post yoki ko'pi bilan 5 savolli quizni yuboradi.
  Bir xil vaqtga bir nechta reja qo'yilsa, ular navbat bilan ketadi; aynan o'sha soniyada
  yuborish kafolatlanmaydi. Xizmat ishlamagan paytdagi kechikkan rejalar qaytgach yuboriladi.
- Parallel cron murojaatlari umumiy 5 daqiqalik lease va atomar SQL claim bilan ajratiladi.
  Server uzilib qolsa, keyingi tekshiruv lease tugagach rejani "Tekshirish kerak" holatiga o'tkazadi.
  Xatoli yoki natijasi noaniq xabar avtomatik qayta yuborilmaydi.
- Telegram va kontentdagi yuborish yozuvlarini tekshiring. Quizda aniq rad etilgan qismlarni
  Quizlar bo'limining mavjud davom ettirish amali bilan yuborish mumkin; reja tarixi o'z holatini saqlaydi.
- Reja vaqti kamida 1 daqiqa kelajakda, ko'pi bilan 366 kun ichida bo'lishi kerak.

## Tekshirish va diagnostika

Avtomatik testlar vaqt mintaqasi, noto'g'ri sana, admin va cron ruxsatlari, bekor qilish,
worker bandligi, o'zgargan manzil va noaniq yuborishni qaytarmaslikni tekshiradi.
Testlar real Telegram xabarlarini yubormaydi; SQL migratsiyasi jonli bazaga avtomatik qo'llanmaydi.

Oxirgi tekshiruv yangilanmasa: Supabase Cron job faolmi, Vault secret nomlari va URL to'g'rimi,
Vercel production deploy tugaganmi, CRON_SECRET mosmi — tekshiring. pg_net HTTP javobida 401
kalit mos emasligini, 503 migratsiya/bot sozlamasi yo'qligini ko'rsatishi mumkin.
Supabase project pauza holatida bo'lsa, cron ishlamaydi.

Avtomatik tekshiruvni o'chirish:

```sql
select cron.unschedule('urosfera-telegram-scheduler');
```

Bu pending rejalarni o'chirmaydi. Keyin qayta yoqilganda ular yuboriladi; kerak bo'lmaganlarini
admin panelida oldindan bekor qiling.
