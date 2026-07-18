-- Telegram integratsiyasi: foydalanuvchining bot bilan suhbat ID'si.
-- Bu bo'lsa — platformadagi har qanday xabarnomani (navbat, javob, obuna,
-- dars eslatmasi) push bilan birga Telegram orqali ham yuborish mumkin.
-- Eslatma: chat_id har bot uchun alohida — faqat Urosfera boti uchun amal qiladi.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telegram_chat_id text;

CREATE INDEX IF NOT EXISTS profiles_telegram_chat_idx
  ON public.profiles (telegram_chat_id)
  WHERE telegram_chat_id IS NOT NULL;

-- Ro'yxatdan o'tish tartibi: avval botda telefon tasdiqlanadi (telegram_otp'ga
-- chat_id yoziladi), keyin profil yaratiladi. Shu sabab profil paydo bo'lgach
-- chat_id'ni telefon raqami bo'yicha avtomatik bog'lab qo'yamiz.
CREATE OR REPLACE FUNCTION public.telegram_chatni_bogla()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.telefon IS NOT NULL AND NEW.telegram_chat_id IS NULL THEN
    SELECT o.chat_id INTO NEW.telegram_chat_id
    FROM public.telegram_otp o
    WHERE o.phone = regexp_replace(NEW.telefon, '\D', '', 'g')
      AND o.chat_id IS NOT NULL
    ORDER BY o.created_at DESC
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_telegram_bogla ON public.profiles;

CREATE TRIGGER profiles_telegram_bogla
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.telegram_chatni_bogla();
