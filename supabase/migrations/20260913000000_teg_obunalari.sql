-- Tegga obuna va yangilik digesti (Bosqich 5): foydalanuvchi mavzuga obuna
-- boʻladi, kunlik cron shu mavzudagi yangi materiallarni bitta digestda yuboradi.

CREATE TABLE IF NOT EXISTS public.teg_obunalari (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  teg_slug text NOT NULL REFERENCES public.yangilik_teglari(slug) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, teg_slug)
);
CREATE INDEX IF NOT EXISTS teg_obunalari_teg_idx ON public.teg_obunalari(teg_slug);

ALTER TABLE public.teg_obunalari ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "oz_obunasini_boshqaradi" ON public.teg_obunalari;
CREATE POLICY "oz_obunasini_boshqaradi" ON public.teg_obunalari
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Yangilik digestini foydalanuvchi oʻzi yoqib-oʻchiradi.
ALTER TABLE public.bildirishnoma_sozlamalari
  ADD COLUMN IF NOT EXISTS yangilik boolean NOT NULL DEFAULT true;
