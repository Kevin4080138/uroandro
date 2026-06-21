-- Tekshiruv turiga xos (PSA, uroflowmetriya, gormonlar va h.k.) qo'shimcha
-- natija qiymatlarini saqlash uchun moslashuvchan ustun.
ALTER TABLE public.tashriflar
  ADD COLUMN natija_json jsonb;
