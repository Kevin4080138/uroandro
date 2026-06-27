-- Test turini ajratish: amaliy (oddiy mashq), usmle (klinik vinyetka), nazorat (yopiq, sertifikatga bog'langan).
-- Nazorat natijalari Natijalarim sahifasida ko'rsatilmaydi (alohida, rasmiy baholash sifatida saqlanadi).
ALTER TABLE public.talim_natijalari
  ADD COLUMN turi text NOT NULL DEFAULT 'amaliy'
  CHECK (turi IN ('amaliy', 'usmle', 'nazorat'));

CREATE INDEX talim_natijalari_turi_idx ON public.talim_natijalari (dars_slug, turi);
