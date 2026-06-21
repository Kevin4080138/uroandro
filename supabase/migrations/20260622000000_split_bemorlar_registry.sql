-- Bemorlar reestrini ajratish:
-- 1) "bemorlar" endi umumiy pasport reestriga aylanadi (hamma shifokor ko'radi/qo'shadi).
-- 2) Eski klinik yozuvlar "tashriflar" jadvaliga ko'chadi (faqat yozgan shifokorga ko'rinadi).

ALTER TABLE public.bemorlar RENAME TO tashriflar;
ALTER TABLE public.kuzatuv RENAME COLUMN bemor_id TO tashrif_id;

-- Yangi umumiy bemorlar reestri (faqat pasport darajasidagi ma'lumot).
CREATE TABLE public.bemorlar (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fio             text NOT NULL,
  passport_seria  text,
  passport_raqam  text,
  tugilgan_sana   date,
  telefon         text,
  manzil          text,
  created_by      uuid REFERENCES public.profiles(id),
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bemorlar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Har qanday shifokor reestrni ko'radi"
ON public.bemorlar FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Har qanday shifokor bemor qo'shadi"
ON public.bemorlar FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Qo'shgan shifokor yoki admin tahrirlaydi"
ON public.bemorlar FOR UPDATE
USING (created_by = auth.uid() OR public.is_admin());

-- Tashriflarni reestrdagi bemorga bog'lash.
ALTER TABLE public.tashriflar ADD COLUMN bemor_id uuid REFERENCES public.bemorlar(id);

-- Mavjud tashriflarni (eski "fio" maydoni orqali) reestrga ko'chirish.
INSERT INTO public.bemorlar (fio, created_by)
SELECT DISTINCT fio, doctor_id FROM public.tashriflar WHERE bemor_id IS NULL;

UPDATE public.tashriflar t
SET bemor_id = b.id
FROM public.bemorlar b
WHERE t.bemor_id IS NULL AND t.fio = b.fio AND t.doctor_id = b.created_by;
