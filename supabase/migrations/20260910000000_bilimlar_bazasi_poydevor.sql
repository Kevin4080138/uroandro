-- Bilimlar bazasi poydevori (Bosqich 0):
-- manba ishonch darajasi, tasdiqlash holati, mavzu teglari, oʻqish darajasi,
-- foydalanuvchi bookmark'lari. Faqat ustun va jadval — UI oʻzgarishisiz.

-- 1) yangiliklar: ishonch, tasdiq, teg va daraja ustunlari
ALTER TABLE public.yangiliklar
  ADD COLUMN IF NOT EXISTS trust_tier integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'kutilmoqda',
  ADD COLUMN IF NOT EXISTS auto_published boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reading_level text;

DO $$ BEGIN
  ALTER TABLE public.yangiliklar ADD CONSTRAINT yangiliklar_trust_tier_check
    CHECK (trust_tier BETWEEN 1 AND 3);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.yangiliklar ADD CONSTRAINT yangiliklar_verification_check
    CHECK (verification_status IN ('kutilmoqda', 'tasdiqlangan', 'rad_etilgan'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.yangiliklar ADD CONSTRAINT yangiliklar_reading_level_check
    CHECK (reading_level IS NULL OR reading_level IN ('easy', 'orta', 'qiyin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Mavzu boʻyicha filtr uchun (boʻlim feʼdi) va tasdiq holati boʻyicha saralash uchun.
CREATE INDEX IF NOT EXISTS yangiliklar_tags_idx ON public.yangiliklar USING gin (tags);
CREATE INDEX IF NOT EXISTS yangiliklar_verification_idx
  ON public.yangiliklar(verification_status, published_at DESC);

-- 2) yangilik_manbalari: ishonch darajasi va litsenziya turi
ALTER TABLE public.yangilik_manbalari
  ADD COLUMN IF NOT EXISTS trust_tier integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS license_type text;

DO $$ BEGIN
  ALTER TABLE public.yangilik_manbalari ADD CONSTRAINT manbalar_trust_tier_check
    CHECK (trust_tier BETWEEN 1 AND 3);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Ishonchli indekslangan/rasmiy manbalar tier 1.
UPDATE public.yangilik_manbalari
SET trust_tier = 1, license_type = COALESCE(license_type, 'indexed')
WHERE source_key LIKE 'pubmed-%' OR source_key IN ('niddk-news', 'nichd-news');
-- Rasmiy jamiyatlar (hozircha unavailable) — sifatli, ammo bot cheklovi bor: tier 3.
UPDATE public.yangilik_manbalari
SET trust_tier = 3, license_type = COALESCE(license_type, 'restricted')
WHERE source_key IN ('eau-news', 'aua-news', 'acog-news');

-- Mavjud nashr qilingan yangiliklarga ishonch darajasi va tasdiq holatini koʻchirish.
UPDATE public.yangiliklar y
SET trust_tier = m.trust_tier
FROM public.yangilik_manbalari m
WHERE y.source_key = m.source_key AND y.trust_tier = 3;
UPDATE public.yangiliklar
SET verification_status = 'tasdiqlangan'
WHERE status = 'published' AND verification_status = 'kutilmoqda';

-- 3) Mavzu teglari lugʻati (browsable taksonomiya)
CREATE TABLE IF NOT EXISTS public.yangilik_teglari (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nom_uz text NOT NULL,
  category text CHECK (category IS NULL OR category IN ('urologiya', 'andrologiya', 'ginekologiya')),
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.yangilik_teglari (slug, nom_uz, category) VALUES
  ('prostata', 'Prostata', 'urologiya'),
  ('buyrak', 'Buyrak', 'urologiya'),
  ('siydik-pufagi', 'Siydik pufagi', 'urologiya'),
  ('tosh-kasalligi', 'Buyrak-siydik toshi', 'urologiya'),
  ('onkologiya', 'Onkologiya', 'urologiya'),
  ('infeksiya', 'Siydik yoʻllari infeksiyasi', 'urologiya'),
  ('erektil-disfunksiya', 'Erektil disfunksiya', 'andrologiya'),
  ('bepushtlik', 'Erkaklar bepushtligi', 'andrologiya'),
  ('menopauza', 'Menopauza', 'ginekologiya'),
  ('tuxumdon', 'Tuxumdon', 'ginekologiya'),
  ('bachadon', 'Bachadon', 'ginekologiya'),
  ('gaydlar', 'Klinik qoʻllanma', NULL),
  ('tadqiqot', 'Tadqiqot xulosasi', NULL)
ON CONFLICT (slug) DO NOTHING;

-- 4) Foydalanuvchi bookmark'lari
CREATE TABLE IF NOT EXISTS public.saqlangan_maqolalar (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  yangilik_id uuid NOT NULL REFERENCES public.yangiliklar(id) ON DELETE CASCADE,
  saqlangan_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, yangilik_id)
);
CREATE INDEX IF NOT EXISTS saqlangan_maqolalar_user_idx
  ON public.saqlangan_maqolalar(user_id, saqlangan_at DESC);

-- RLS
ALTER TABLE public.yangilik_teglari ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saqlangan_maqolalar ENABLE ROW LEVEL SECURITY;

-- Teglar lugʻati — oddiy yorliqlar, hamma oʻqiy oladi; faqat admin oʻzgartiradi.
DROP POLICY IF EXISTS "teglarni_hamma_oqiydi" ON public.yangilik_teglari;
CREATE POLICY "teglarni_hamma_oqiydi" ON public.yangilik_teglari
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "teglarni_admin_boshqaradi" ON public.yangilik_teglari;
CREATE POLICY "teglarni_admin_boshqaradi" ON public.yangilik_teglari
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Bookmark — faqat oʻz yozuvini koʻradi va boshqaradi.
DROP POLICY IF EXISTS "oz_bookmarklarini_boshqaradi" ON public.saqlangan_maqolalar;
CREATE POLICY "oz_bookmarklarini_boshqaradi" ON public.saqlangan_maqolalar
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
