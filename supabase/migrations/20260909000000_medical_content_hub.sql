-- Ko'p manbali Medical Content Hub, deduplication, reyting va cron auditi.

ALTER TABLE public.yangilik_manbalari
  ADD COLUMN IF NOT EXISTS source_key text,
  ADD COLUMN IF NOT EXISTS base_url text,
  ADD COLUMN IF NOT EXISTS specialties text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_enabled boolean,
  ADD COLUMN IF NOT EXISTS fetch_interval interval NOT NULL DEFAULT interval '12 hours',
  ADD COLUMN IF NOT EXISTS last_checked_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_success_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_error text;

ALTER TABLE public.yangilik_manbalari DROP CONSTRAINT IF EXISTS yangilik_manbalari_source_type_check;
ALTER TABLE public.yangilik_manbalari ADD CONSTRAINT yangilik_manbalari_source_type_check
  CHECK (source_type IN ('api','rss','atom','jsonld','html','pubmed','unavailable'));

UPDATE public.yangilik_manbalari SET
  source_key = COALESCE(source_key, lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))),
  base_url = COALESCE(base_url, source_url),
  specialties = CASE WHEN cardinality(specialties) = 0 THEN ARRAY[category] ELSE specialties END,
  is_enabled = COALESCE(is_enabled, enabled);

ALTER TABLE public.yangilik_manbalari
  ALTER COLUMN source_key SET NOT NULL,
  ALTER COLUMN is_enabled SET NOT NULL,
  ALTER COLUMN is_enabled SET DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS yangilik_manbalari_source_key_unique
  ON public.yangilik_manbalari(source_key);
CREATE INDEX IF NOT EXISTS yangilik_manbalari_faol_priority_idx
  ON public.yangilik_manbalari(is_enabled, priority);

ALTER TABLE public.yangiliklar
  ADD COLUMN IF NOT EXISTS source_key text,
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'news',
  ADD COLUMN IF NOT EXISTS specialty text,
  ADD COLUMN IF NOT EXISTS audience text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS importance_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS importance_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS telegram_auto_eligible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS telegram_selected_at timestamptz,
  ADD COLUMN IF NOT EXISTS telegram_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS banner_approval_status text NOT NULL DEFAULT 'not_created',
  ADD COLUMN IF NOT EXISTS source_published_at timestamptz,
  ADD COLUMN IF NOT EXISTS source_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

DO $$ BEGIN
  ALTER TABLE public.yangiliklar ADD CONSTRAINT yangiliklar_content_type_check CHECK
    (content_type IN ('news','research_summary','guideline_update','educational_article','clinical_review','event'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.yangiliklar ADD CONSTRAINT yangiliklar_specialty_check CHECK
    (specialty IS NULL OR specialty IN ('urology','gynecology','andrology','urogynecology','mixed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.yangiliklar ADD CONSTRAINT yangiliklar_banner_approval_check CHECK
    (banner_approval_status IN ('not_created','pending','active','failed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE UNIQUE INDEX IF NOT EXISTS yangiliklar_source_external_unique
  ON public.yangiliklar(source_key, external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS yangiliklar_importance_idx
  ON public.yangiliklar(telegram_auto_eligible, importance_score DESC, source_published_at DESC);

CREATE TABLE IF NOT EXISTS public.yangilik_source_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id uuid NOT NULL REFERENCES public.yangiliklar(id) ON DELETE CASCADE,
  source_key text NOT NULL,
  external_id text,
  canonical_url text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(news_id, canonical_url)
);

ALTER TABLE public.yangilik_ishlari
  ADD COLUMN IF NOT EXISTS started_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS finished_at timestamptz,
  ADD COLUMN IF NOT EXISTS run_slot text,
  ADD COLUMN IF NOT EXISTS checked_sources integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS found_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS duplicate_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS eligible_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS selected_article_id uuid REFERENCES public.yangiliklar(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS telegram_result jsonb,
  ADD COLUMN IF NOT EXISTS skipped_reason text,
  ADD COLUMN IF NOT EXISTS error_summary text;
CREATE UNIQUE INDEX IF NOT EXISTS yangilik_ishlari_run_slot_unique
  ON public.yangilik_ishlari(run_slot) WHERE run_slot IS NOT NULL;

ALTER TABLE public.yangilik_source_references ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_yangilik_source_references" ON public.yangilik_source_references;
CREATE POLICY "admin_yangilik_source_references" ON public.yangilik_source_references FOR SELECT USING
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

INSERT INTO public.yangilik_manbalari
  (source_key, name, feed_url, source_url, base_url, category, specialties, enabled, is_enabled, priority,
   may_reuse_official_images, source_type, fetch_interval)
VALUES
  ('niddk-news', 'NIH/NIDDK News', 'https://www.niddk.nih.gov/rss/news', 'https://www.niddk.nih.gov/news',
   'https://www.niddk.nih.gov', 'urologiya', ARRAY['urology'], true, true, 5, false, 'rss', interval '12 hours'),
  ('nichd-news', 'NIH/NICHD News', 'https://www.nichd.nih.gov/newsroom/news', 'https://www.nichd.nih.gov/newsroom/news',
   'https://www.nichd.nih.gov', 'ginekologiya', ARRAY['gynecology'], false, false, 40, false, 'unavailable', interval '12 hours'),
  ('eau-news', 'EAU', 'https://uroweb.org/news', 'https://uroweb.org/news',
   'https://uroweb.org', 'urologiya', ARRAY['urology','andrology'], false, false, 50, false, 'unavailable', interval '12 hours'),
  ('aua-news', 'AUA', 'https://www.auanet.org/about-us/media-center/press-center', 'https://www.auanet.org/about-us/media-center/press-center',
   'https://www.auanet.org', 'urologiya', ARRAY['urology','andrology'], false, false, 60, false, 'unavailable', interval '12 hours'),
  ('acog-news', 'ACOG', 'https://www.acog.org/news', 'https://www.acog.org/news',
   'https://www.acog.org', 'ginekologiya', ARRAY['gynecology'], false, false, 70, false, 'unavailable', interval '12 hours')
ON CONFLICT (source_key) DO UPDATE SET
  name=EXCLUDED.name, base_url=EXCLUDED.base_url, specialties=EXCLUDED.specialties,
  priority=EXCLUDED.priority, updated_at=now();

UPDATE public.yangilik_manbalari SET last_error = CASE source_key
  WHEN 'nichd-news' THEN 'Tekshirilgan barqaror RSS/API topilmadi; public HTML parser yoqilmagan'
  WHEN 'eau-news' THEN 'Barqaror rasmiy RSS/API tasdiqlanmadi'
  WHEN 'aua-news' THEN 'Foydalanish shartlari bot/AI qayta ishlashini cheklaydi'
  WHEN 'acog-news' THEN 'Barqaror rasmiy RSS/API tasdiqlanmadi'
END
WHERE source_key IN ('nichd-news','eau-news','aua-news','acog-news');

UPDATE public.yangilik_manbalari SET
  source_key = CASE category
    WHEN 'urologiya' THEN 'pubmed-urology'
    WHEN 'andrologiya' THEN 'pubmed-andrology'
    WHEN 'ginekologiya' THEN 'pubmed-gynecology'
  END,
  base_url='https://pubmed.ncbi.nlm.nih.gov', specialties=ARRAY[CASE category
    WHEN 'urologiya' THEN 'urology' WHEN 'andrologiya' THEN 'andrology' ELSE 'gynecology' END],
  is_enabled=enabled
WHERE source_type='pubmed';
