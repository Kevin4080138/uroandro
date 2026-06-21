-- Birinchi ko'ruvda buyurilgan tekshiruvlarni saqlash uchun ustunlar.
ALTER TABLE public.tashriflar
  ADD COLUMN organlar text,
  ADD COLUMN buyurilgan_tekshiruvlar text;
