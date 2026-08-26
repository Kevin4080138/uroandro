-- Yangiliklarni saralash va Telegram matnini alohida boshqarish.
ALTER TABLE public.yangiliklar
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS telegram_post_uz text;

UPDATE public.yangiliklar
SET updated_at = COALESCE(updated_at, created_at, now())
WHERE updated_at IS NULL;

CREATE INDEX IF NOT EXISTS yangiliklar_admin_yangilangan_idx
  ON public.yangiliklar(updated_at DESC, created_at DESC);
