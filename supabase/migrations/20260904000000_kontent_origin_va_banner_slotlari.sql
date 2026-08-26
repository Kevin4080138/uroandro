-- Qo'lda va avtomatik kontentni qat'iy ajratish, banner slotlari va saralash.
ALTER TABLE public.yangiliklar
  ADD COLUMN IF NOT EXISTS content_origin text NOT NULL DEFAULT 'manual'
    CHECK (content_origin IN ('manual', 'automation'));

ALTER TABLE public.bannerlar
  ADD COLUMN IF NOT EXISTS content_origin text NOT NULL DEFAULT 'manual'
    CHECK (content_origin IN ('manual', 'automation')),
  ADD COLUMN IF NOT EXISTS priority integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- Ushbu modulning oldingi versiyasi yaratgan yozuvlarni to'g'ri tasniflash.
UPDATE public.yangiliklar SET content_origin = 'automation'
WHERE content_origin = 'manual' AND dedup_hash IS NOT NULL AND source_name IS NOT NULL;
UPDATE public.bannerlar
SET content_origin = 'automation', priority = 10
WHERE yangilik_id IS NOT NULL;

-- Manual va automation bir-birining dedup hududini band qilmasin.
ALTER TABLE public.yangiliklar DROP CONSTRAINT IF EXISTS yangiliklar_source_url_key;
ALTER TABLE public.yangiliklar DROP CONSTRAINT IF EXISTS yangiliklar_dedup_hash_key;
CREATE UNIQUE INDEX IF NOT EXISTS yangiliklar_origin_source_unique ON public.yangiliklar(content_origin, source_url);
CREATE UNIQUE INDEX IF NOT EXISTS yangiliklar_origin_dedup_unique ON public.yangiliklar(content_origin, dedup_hash);
CREATE INDEX IF NOT EXISTS yangiliklar_origin_status_idx ON public.yangiliklar(content_origin, status, created_at DESC);
CREATE INDEX IF NOT EXISTS bannerlar_tanlash_idx ON public.bannerlar(target_role, content_origin, is_pinned DESC, priority DESC, created_at DESC);

ALTER TABLE public.banner_sozlamalar
  ADD COLUMN IF NOT EXISTS max_visible integer,
  ADD COLUMN IF NOT EXISTS auto_banner_slots integer NOT NULL DEFAULT 1;

UPDATE public.banner_sozlamalar SET max_visible = COALESCE(max_visible, max_soni);
UPDATE public.banner_sozlamalar SET auto_banner_slots = 1 WHERE role IN ('student', 'doctor', 'patient');
UPDATE public.banner_sozlamalar SET auto_banner_slots = 0 WHERE role = 'landing';
ALTER TABLE public.banner_sozlamalar ALTER COLUMN max_visible SET DEFAULT 5;
ALTER TABLE public.banner_sozlamalar ALTER COLUMN max_visible SET NOT NULL;
ALTER TABLE public.banner_sozlamalar ADD CONSTRAINT banner_sozlamalar_max_visible_check CHECK (max_visible >= 0);
ALTER TABLE public.banner_sozlamalar ADD CONSTRAINT banner_sozlamalar_auto_slots_check CHECK (auto_banner_slots >= 0);
