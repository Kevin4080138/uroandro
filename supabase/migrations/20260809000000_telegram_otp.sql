-- Telegram OTP: shifokor/talaba ro'yxatdan o'tishda telefon tasdiqlanishi uchun
CREATE TABLE IF NOT EXISTS public.telegram_otp (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       text NOT NULL,
  code        text NOT NULL,
  chat_id     text,
  expires_at  timestamptz NOT NULL,
  used        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS telegram_otp_phone_idx ON public.telegram_otp(phone);

-- Faqat service role kirishi mumkin (RLS yo'q, API orqali admin client ishlatiladi)
ALTER TABLE public.telegram_otp ENABLE ROW LEVEL SECURITY;

-- Eski OTPlarni avtomatik tozalash uchun (ixtiyoriy — cron orqali)
-- DELETE FROM public.telegram_otp WHERE expires_at < now() - interval '1 hour';
