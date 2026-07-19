-- Telegram Mini App avto-login: foydalanuvchining Telegram user ID'si.
-- initData imzosi tekshirilgach shu ID bo'yicha mavjud hisob topiladi yoki
-- yangi hisob yaratiladi (parolsiz, magic-link orqali sessiya ochiladi).
-- Eslatma: telegram_chat_id (bot xabar yuborish uchun) va telegram_user_id
-- (login uchun) private chatda bir xil qiymatga ega, lekin maqsadlari boshqa.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telegram_user_id text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_telegram_user_idx
  ON public.profiles (telegram_user_id)
  WHERE telegram_user_id IS NOT NULL;
