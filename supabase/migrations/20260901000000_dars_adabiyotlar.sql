-- Nazariyaga qo'shimcha adabiyotlar (kitob/maqola havolalari) biriktirish.
-- Video havolalari kabi, lekin har biri nom + url: talaba nazariyani o'qib
-- bo'lgach chuqurroq manbaga o'tishi uchun.
--
-- Format: [{ "nom": "Campbell-Walsh Urology, 12-bob", "url": "https://..." }, ...]
ALTER TABLE public.dars_tarkibi
  ADD COLUMN adabiyotlar jsonb NOT NULL DEFAULT '[]'::jsonb;
