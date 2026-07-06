-- Bemor natijalar jadvali: har bir kasallik/muolaja bo'yicha kuzatuv natijalari
CREATE TABLE public.bemor_natijalar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bemor_id    uuid NOT NULL REFERENCES public.bemorlar(id) ON DELETE CASCADE,
  doctor_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mavzu       text NOT NULL,   -- 'varikotsele', 'bph', 'prostatit', ...
  malumot     jsonb NOT NULL DEFAULT '{}',
  yaratilgan  timestamptz NOT NULL DEFAULT now(),
  yangilangan timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bemor_id, doctor_id, mavzu)
);

ALTER TABLE public.bemor_natijalar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shifokor o'z natijalarini ko'radi"
ON public.bemor_natijalar FOR SELECT
USING (doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor natija qo'shadi"
ON public.bemor_natijalar FOR INSERT
WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor natijani yangilaydi"
ON public.bemor_natijalar FOR UPDATE
USING (doctor_id = auth.uid());
