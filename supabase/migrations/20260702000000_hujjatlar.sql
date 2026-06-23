-- Bemorning kasallik tarixi hujjatlari uchun ma'lumotlar (moslashuvchan JSON).
-- Har bir bemor uchun bitta yozuv; shablon (kasallik) bo'yicha maydonlar JSONda.
CREATE TABLE public.hujjat_malumotlari (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bemor_id    uuid NOT NULL REFERENCES public.bemorlar(id) ON DELETE CASCADE,
  doctor_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shablon     text NOT NULL,        -- 'prostatit', 'varikotsele', ...
  malumot     jsonb NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bemor_id, doctor_id, shablon)
);

ALTER TABLE public.hujjat_malumotlari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shifokor o'z hujjat ma'lumotlarini ko'radi"
ON public.hujjat_malumotlari FOR SELECT
USING (doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor hujjat ma'lumoti qo'shadi"
ON public.hujjat_malumotlari FOR INSERT
WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor o'z hujjat ma'lumotini yangilaydi"
ON public.hujjat_malumotlari FOR UPDATE
USING (doctor_id = auth.uid());
