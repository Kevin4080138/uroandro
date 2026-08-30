-- EAU va AUA kontentini flagman jurnallari orqali Europe PMC'dan olish.
-- Ularning saytini scrape qilmaymiz (AUA ToS bot/AI'ni cheklaydi, EAU'da barqaror API yo'q) —
-- lekin ilmiy kontenti va guideline'lari indekslangan jurnallarda ochiq abstract bilan mavjud.
-- Adapter: europepmc.ts (source_key 'europepmc-' bilan boshlanadi). Tier 1.

INSERT INTO public.yangilik_manbalari
  (source_key, name, feed_url, source_url, base_url, category, specialties, enabled, is_enabled,
   priority, may_reuse_official_images, source_type, search_query, lookback_days, trust_tier, license_type, fetch_interval)
VALUES
  ('europepmc-eau', 'EAU — European Urology',
   'https://www.ebi.ac.uk/europepmc/webservices/rest/search?urosfera=eau-journal', 'https://www.europeanurology.com',
   'https://europepmc.org', 'urologiya', ARRAY['urology'], true, true, 8, false, 'api',
   'JOURNAL:"European Urology"', 45, 1, 'indexed', interval '12 hours'),
  ('europepmc-aua', 'AUA — The Journal of Urology',
   'https://www.ebi.ac.uk/europepmc/webservices/rest/search?urosfera=aua-journal', 'https://www.auajournals.org',
   'https://europepmc.org', 'urologiya', ARRAY['urology'], true, true, 9, false, 'api',
   'JOURNAL:"The Journal of Urology"', 45, 1, 'indexed', interval '12 hours')
ON CONFLICT (source_key) DO UPDATE SET
  name = EXCLUDED.name, feed_url = EXCLUDED.feed_url, source_url = EXCLUDED.source_url, base_url = EXCLUDED.base_url,
  specialties = EXCLUDED.specialties, enabled = true, is_enabled = true, priority = EXCLUDED.priority,
  source_type = 'api', search_query = EXCLUDED.search_query, lookback_days = EXCLUDED.lookback_days,
  trust_tier = 1, license_type = 'indexed', updated_at = now();
