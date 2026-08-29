-- Europe PMC manbalari (Bosqich 1): ochiq, bot-doʻst JSON API — PubMed'ni toʻldiradi.
-- Adapter: src/lib/newsSources/adapters/europepmc.ts (source_key 'europepmc-' bilan boshlanadi).

INSERT INTO public.yangilik_manbalari
  (source_key, name, feed_url, source_url, base_url, category, specialties, enabled, is_enabled,
   priority, may_reuse_official_images, source_type, search_query, lookback_days, trust_tier, license_type, fetch_interval)
VALUES
  (
    'europepmc-urology', 'Europe PMC — Urologiya',
    'https://www.ebi.ac.uk/europepmc/webservices/rest/search?urosfera=urologiya',
    'https://europepmc.org/search?query=urology', 'https://europepmc.org',
    'urologiya', ARRAY['urology'], true, true, 12, false, 'api',
    '(TITLE:urology OR TITLE:urologic OR TITLE:prostate OR TITLE:bladder OR TITLE:urinary OR TITLE:kidney OR TITLE:renal OR ABSTRACT:urology)',
    30, 1, 'indexed', interval '12 hours'
  ),
  (
    'europepmc-andrology', 'Europe PMC — Andrologiya',
    'https://www.ebi.ac.uk/europepmc/webservices/rest/search?urosfera=andrologiya',
    'https://europepmc.org/search?query=andrology', 'https://europepmc.org',
    'andrologiya', ARRAY['andrology'], true, true, 22, false, 'api',
    '(TITLE:andrology OR TITLE:"male infertility" OR TITLE:"erectile dysfunction" OR TITLE:sperm OR TITLE:testicular OR ABSTRACT:andrology)',
    30, 1, 'indexed', interval '12 hours'
  ),
  (
    'europepmc-gynecology', 'Europe PMC — Ginekologiya',
    'https://www.ebi.ac.uk/europepmc/webservices/rest/search?urosfera=ginekologiya',
    'https://europepmc.org/search?query=gynecology', 'https://europepmc.org',
    'ginekologiya', ARRAY['gynecology'], true, true, 32, false, 'api',
    '(TITLE:gynecology OR TITLE:gynaecology OR TITLE:ovarian OR TITLE:uterine OR TITLE:cervical OR TITLE:endometriosis OR TITLE:menopause OR ABSTRACT:gynecology)',
    30, 1, 'indexed', interval '12 hours'
  )
ON CONFLICT (source_key) DO UPDATE SET
  name = EXCLUDED.name, feed_url = EXCLUDED.feed_url, source_url = EXCLUDED.source_url,
  base_url = EXCLUDED.base_url, specialties = EXCLUDED.specialties, enabled = true, is_enabled = true,
  priority = EXCLUDED.priority, source_type = 'api', search_query = EXCLUDED.search_query,
  lookback_days = EXCLUDED.lookback_days, trust_tier = 1, license_type = 'indexed', updated_at = now();
