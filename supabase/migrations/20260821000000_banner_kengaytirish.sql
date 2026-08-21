-- Bannerlar kengaytirish:
--   1) Sana oralig'i (boshlanish / tugash) + arxiv bayrog'i — har banner uchun
--   2) Bo'lim (rol) bo'yicha ko'rsatish sozlamalari: soni, interval, effekt
--
-- Qayta-ishga-tushiriladigan (idempotent): bir necha marta Run qilsa ham xato bermaydi.

-- ── 1) Yangi ustunlar ────────────────────────────────────────────────
ALTER TABLE public.bannerlar
  ADD COLUMN IF NOT EXISTS boshlanish timestamptz,
  ADD COLUMN IF NOT EXISTS tugash    timestamptz,
  ADD COLUMN IF NOT EXISTS arxiv     boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS bannerlar_arxiv_idx ON public.bannerlar (arxiv);

-- ── 2) Bo'lim sozlamalari ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.banner_sozlamalar (
  role            text PRIMARY KEY,              -- student | doctor | patient | landing
  max_soni        int  NOT NULL DEFAULT 5,       -- shu bo'limda ko'pi bilan nechta banner
  interval_soniya int  NOT NULL DEFAULT 6,       -- har banner necha soniya turadi
  effekt          text NOT NULL DEFAULT 'fade',  -- fade | slide | zoom
  updated_at      timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.banner_sozlamalar (role) VALUES
  ('student'), ('doctor'), ('patient'), ('landing')
ON CONFLICT (role) DO NOTHING;

ALTER TABLE public.banner_sozlamalar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "banner_sozlamalar_select" ON public.banner_sozlamalar;
CREATE POLICY "banner_sozlamalar_select" ON public.banner_sozlamalar
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "banner_sozlamalar_admin_all" ON public.banner_sozlamalar;
CREATE POLICY "banner_sozlamalar_admin_all" ON public.banner_sozlamalar
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── 3) Ko'rsatish siyosatini yangilash ───────────────────────────────
-- Prod'dagi mavjud select siyosati "Faol bannerlarni hamma ko'ra oladi" (faol = true).
-- Uni o'sha nom bilan qayta yaratamiz — endi arxivlangan va muddati o'tgan/hali
-- boshlanmagan bannerlar ham chiqmaydi. Rol filtri qo'shilmaydi (avvalgidek rol
-- client tomonda tanlanadi). Eski nomlarning ikkalasini ham tozalaymiz.
DROP POLICY IF EXISTS "Faol bannerlarni hamma ko'ra oladi" ON public.bannerlar;
DROP POLICY IF EXISTS "bannerlar_select" ON public.bannerlar;
CREATE POLICY "Faol bannerlarni hamma ko'ra oladi" ON public.bannerlar
  FOR SELECT USING (
    faol = true
    AND arxiv = false
    AND (boshlanish IS NULL OR boshlanish <= now())
    AND (tugash IS NULL OR tugash >= now())
  );
