-- Qoʻshimcha manbalar (Bosqich 1 yakuni):
--   • DOAJ — ochiq litsenziyali jurnal maqolalari (tier 1)
--   • Europe PMC preprintlari (medRxiv/bioRxiv, SRC:PPR) — tier 2, avto-tasdiqdan tashqarida
--     (trust_tier 2 > NEWS_AUTO_MAX_TRUST_TIER 1, shu bois admin koʻrigiga tushadi).

INSERT INTO public.yangilik_manbalari
  (source_key, name, feed_url, source_url, base_url, category, specialties, enabled, is_enabled,
   priority, may_reuse_official_images, source_type, search_query, lookback_days, trust_tier, license_type, fetch_interval)
VALUES
  -- DOAJ
  ('doaj-urology', 'DOAJ — Urologiya',
   'https://doaj.org/api/v3/search/articles?urosfera=urologiya', 'https://doaj.org/search/articles?source=urology',
   'https://doaj.org', 'urologiya', ARRAY['urology'], true, true, 15, false, 'api',
   'bibjson.title:urology OR bibjson.title:prostate OR bibjson.title:bladder OR bibjson.title:kidney OR bibjson.title:renal OR bibjson.title:urinary',
   30, 1, 'cc-by', interval '12 hours'),
  ('doaj-andrology', 'DOAJ — Andrologiya',
   'https://doaj.org/api/v3/search/articles?urosfera=andrologiya', 'https://doaj.org/search/articles?source=andrology',
   'https://doaj.org', 'andrologiya', ARRAY['andrology'], true, true, 25, false, 'api',
   'bibjson.title:andrology OR bibjson.title:sperm OR bibjson.title:infertility OR bibjson.title:erectile OR bibjson.title:testicular',
   30, 1, 'cc-by', interval '12 hours'),
  ('doaj-gynecology', 'DOAJ — Ginekologiya',
   'https://doaj.org/api/v3/search/articles?urosfera=ginekologiya', 'https://doaj.org/search/articles?source=gynecology',
   'https://doaj.org', 'ginekologiya', ARRAY['gynecology'], true, true, 35, false, 'api',
   'bibjson.title:gynecology OR bibjson.title:ovarian OR bibjson.title:uterine OR bibjson.title:endometriosis OR bibjson.title:menopause OR bibjson.title:cervical',
   30, 1, 'cc-by', interval '12 hours'),
  -- Europe PMC preprintlari (medRxiv/bioRxiv) — tier 2
  ('europepmc-urology-preprint', 'medRxiv/bioRxiv — Urologiya (preprint)',
   'https://www.ebi.ac.uk/europepmc/webservices/rest/search?urosfera=urologiya-ppr', 'https://europepmc.org',
   'https://europepmc.org', 'urologiya', ARRAY['urology'], true, true, 45, false, 'api',
   '(TITLE:urology OR TITLE:prostate OR TITLE:bladder OR TITLE:kidney OR TITLE:renal OR TITLE:urinary) AND (SRC:PPR)',
   30, 2, 'preprint', interval '12 hours'),
  ('europepmc-andrology-preprint', 'medRxiv/bioRxiv — Andrologiya (preprint)',
   'https://www.ebi.ac.uk/europepmc/webservices/rest/search?urosfera=andrologiya-ppr', 'https://europepmc.org',
   'https://europepmc.org', 'andrologiya', ARRAY['andrology'], true, true, 55, false, 'api',
   '(TITLE:andrology OR TITLE:"male infertility" OR TITLE:"erectile dysfunction" OR TITLE:sperm OR TITLE:testicular) AND (SRC:PPR)',
   30, 2, 'preprint', interval '12 hours'),
  ('europepmc-gynecology-preprint', 'medRxiv/bioRxiv — Ginekologiya (preprint)',
   'https://www.ebi.ac.uk/europepmc/webservices/rest/search?urosfera=ginekologiya-ppr', 'https://europepmc.org',
   'https://europepmc.org', 'ginekologiya', ARRAY['gynecology'], true, true, 65, false, 'api',
   '(TITLE:gynecology OR TITLE:gynaecology OR TITLE:ovarian OR TITLE:uterine OR TITLE:cervical OR TITLE:endometriosis OR TITLE:menopause) AND (SRC:PPR)',
   30, 2, 'preprint', interval '12 hours')
ON CONFLICT (source_key) DO UPDATE SET
  name = EXCLUDED.name, feed_url = EXCLUDED.feed_url, source_url = EXCLUDED.source_url, base_url = EXCLUDED.base_url,
  specialties = EXCLUDED.specialties, enabled = true, is_enabled = true, priority = EXCLUDED.priority,
  source_type = 'api', search_query = EXCLUDED.search_query, lookback_days = EXCLUDED.lookback_days,
  trust_tier = EXCLUDED.trust_tier, license_type = EXCLUDED.license_type, updated_at = now();
