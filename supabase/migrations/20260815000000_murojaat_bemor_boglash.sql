-- Murojaat → Qabul zanjiri: shifokor murojaatni qabulga olganda
-- bemorlar reestrida karta ochiladi va murojaat unga bog'lanadi.
-- Yangi holat qiymati: 'qabulda' (karta ochilgan, shifokor ko'rigida).
ALTER TABLE public.murojaatlar
  ADD COLUMN IF NOT EXISTS bemor_id uuid REFERENCES public.bemorlar(id) ON DELETE SET NULL;
