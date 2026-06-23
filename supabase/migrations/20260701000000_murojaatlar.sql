-- Bemor shifokorlar ro'yxatini ko'rishi va shifokor bemor ismini ko'rishi uchun.
CREATE POLICY "Shifokor va bemor profillari ko'rinadi"
ON public.profiles FOR SELECT
USING (role IN ('doctor', 'patient') AND auth.uid() IS NOT NULL);

-- Bemor murojaatlari: bemor shikoyatini yuboradi, shifokor (tanlangan yoki
-- umumiy navbatdan birinchi bo'sh) qabul qiladi va javob yozadi.
CREATE TABLE public.murojaatlar (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_doctor_id  uuid REFERENCES public.profiles(id),   -- bemor tanlagan shifokor (ixtiyoriy)
  doctor_id         uuid REFERENCES public.profiles(id),   -- murojaatni qabul qilgan shifokor
  organlar          text,
  shikoyatlar       text NOT NULL,
  taxminiy_tashxis  text,
  sabablar          text,
  tavsiya           text,
  shoshilinch       boolean NOT NULL DEFAULT false,
  javob             text,
  holat             text NOT NULL DEFAULT 'kutilmoqda',  -- kutilmoqda / qabul_qilindi / javob_berildi
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.murojaatlar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bemor o'z murojaatini ko'radi"
ON public.murojaatlar FOR SELECT
USING (
  patient_id = auth.uid()
  OR doctor_id = auth.uid()
  OR target_doctor_id = auth.uid()
  OR (target_doctor_id IS NULL AND holat = 'kutilmoqda')
  OR public.is_admin()
);

CREATE POLICY "Bemor murojaat yuboradi"
ON public.murojaatlar FOR INSERT
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Shifokor murojaatni qabul qiladi yoki javob yozadi"
ON public.murojaatlar FOR UPDATE
USING (
  doctor_id = auth.uid()
  OR target_doctor_id = auth.uid()
  OR (target_doctor_id IS NULL AND doctor_id IS NULL)
  OR public.is_admin()
);
