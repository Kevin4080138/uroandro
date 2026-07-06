-- Bir bemor bir kasallik bilan bir necha marta yotishi uchun yotish_soni qo'shildi

ALTER TABLE public.hujjat_malumotlari
  ADD COLUMN IF NOT EXISTS yotish_soni integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS yotish_sana date;

-- Eski unique constraint'ni olib tashlab yangi qo'yamiz
ALTER TABLE public.hujjat_malumotlari
  DROP CONSTRAINT IF EXISTS hujjat_malumotlari_bemor_id_doctor_id_shablon_key;

ALTER TABLE public.hujjat_malumotlari
  ADD CONSTRAINT hujjat_malumotlari_bemor_doctor_shablon_yotish_key
  UNIQUE (bemor_id, doctor_id, shablon, yotish_soni);
