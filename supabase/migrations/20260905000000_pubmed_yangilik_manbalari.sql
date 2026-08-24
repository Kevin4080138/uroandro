-- NIH News sahifasini RSS sifatida o'qish o'rniga NCBI PubMed E-utilities API.

ALTER TABLE public.yangilik_manbalari
  ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'rss'
    CHECK (source_type IN ('rss', 'pubmed')),
  ADD COLUMN IF NOT EXISTS search_query text,
  ADD COLUMN IF NOT EXISTS lookback_days integer NOT NULL DEFAULT 30
    CHECK (lookback_days BETWEEN 1 AND 90);

UPDATE public.yangilik_manbalari
SET enabled = false
WHERE feed_url = 'https://www.nih.gov/news-events/news-releases/rss.xml';

INSERT INTO public.yangilik_manbalari
  (name, feed_url, source_url, category, enabled, priority, may_reuse_official_images, source_type, search_query, lookback_days)
VALUES
  (
    'PubMed — Urologiya',
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&urosfera=urologiya',
    'https://pubmed.ncbi.nlm.nih.gov/?term=urology',
    'urologiya', true, 10, false, 'pubmed',
    '(urology[Title/Abstract] OR urologic[Title/Abstract] OR prostate[Title] OR bladder[Title] OR urinary[Title] OR kidney[Title] OR renal[Title])',
    30
  ),
  (
    'PubMed — Andrologiya',
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&urosfera=andrologiya',
    'https://pubmed.ncbi.nlm.nih.gov/?term=andrology',
    'andrologiya', true, 20, false, 'pubmed',
    '(andrology[Title/Abstract] OR male infertility[Title] OR erectile dysfunction[Title] OR sperm[Title])',
    30
  ),
  (
    'PubMed — Ginekologiya',
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&urosfera=ginekologiya',
    'https://pubmed.ncbi.nlm.nih.gov/?term=gynecology',
    'ginekologiya', true, 30, false, 'pubmed',
    '(gynecology[Title/Abstract] OR gynaecology[Title/Abstract] OR ovarian[Title] OR uterine[Title] OR cervical[Title] OR endometriosis[Title])',
    30
  )
ON CONFLICT (feed_url) DO UPDATE SET
  name = EXCLUDED.name,
  source_url = EXCLUDED.source_url,
  category = EXCLUDED.category,
  enabled = true,
  priority = EXCLUDED.priority,
  may_reuse_official_images = false,
  source_type = 'pubmed',
  search_query = EXCLUDED.search_query,
  lookback_days = EXCLUDED.lookback_days,
  updated_at = now();
