-- "Oʻqilgan" holati (Bosqich 5): foydalanuvchi feʼdda oʻqigan maqolalarini
-- belgilaydi — oʻqilmaganlar "🆕 Yangi" sifatida ajralib turadi.

CREATE TABLE IF NOT EXISTS public.oqilgan_maqolalar (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  yangilik_id uuid NOT NULL REFERENCES public.yangiliklar(id) ON DELETE CASCADE,
  oqilgan_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, yangilik_id)
);
CREATE INDEX IF NOT EXISTS oqilgan_maqolalar_user_idx
  ON public.oqilgan_maqolalar(user_id, oqilgan_at DESC);

ALTER TABLE public.oqilgan_maqolalar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "oz_oqilganini_boshqaradi" ON public.oqilgan_maqolalar;
CREATE POLICY "oz_oqilganini_boshqaradi" ON public.oqilgan_maqolalar
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
