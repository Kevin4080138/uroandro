-- Bemor ismini alohida qismlarga ajratish + avtomatik tartib raqami.
ALTER TABLE public.bemorlar
  ADD COLUMN familiya text,
  ADD COLUMN ism text,
  ADD COLUMN otasi text,
  ADD COLUMN raqam bigint;

-- Avtomatik ketma-ket raqam (1001 dan boshlanadi)
CREATE SEQUENCE IF NOT EXISTS public.bemor_raqam_seq START 1001;
ALTER TABLE public.bemorlar ALTER COLUMN raqam SET DEFAULT nextval('public.bemor_raqam_seq');

-- Mavjud bemorlarga raqam berish
UPDATE public.bemorlar SET raqam = nextval('public.bemor_raqam_seq') WHERE raqam IS NULL;
