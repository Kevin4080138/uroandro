-- Bemorlar (patients) va kuzatuv (follow-up) jadvallari.
-- Har bir bemor uni qo'shgan shifokorga bog'lanadi (doctor_id).

CREATE TABLE public.bemorlar (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sana              timestamptz NOT NULL DEFAULT now(),
  fio               text NOT NULL,
  yosh              int,
  tomon             text,   -- chap / o'ng / ikki tomonlama
  daraja            text,   -- I / II / III
  vena_diametri     numeric,
  reflux            text,   -- bor / yo'q
  ogriq             text,   -- bor / yo'q
  oldin_operatsiya  text,   -- ha / yo'q
  sperm_konts       numeric,
  sperm_harakat     numeric,
  sperm_morf        numeric,
  testosteron       numeric,
  fsh               numeric,
  lh                numeric,
  tavsiya           text,
  izoh              text
);

CREATE TABLE public.kuzatuv (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bemor_id        uuid NOT NULL REFERENCES public.bemorlar(id) ON DELETE CASCADE,
  sana            timestamptz NOT NULL DEFAULT now(),
  oy              int,
  usul            text,
  sperm_konts     numeric,
  sperm_harakat   numeric,
  asorat          text,
  homiladorlik    text,
  izoh            text
);

ALTER TABLE public.bemorlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kuzatuv ENABLE ROW LEVEL SECURITY;

-- Shifokor faqat o'zi qo'shgan bemorlarni ko'radi/boshqaradi.
CREATE POLICY "Shifokor o'z bemorlarini ko'radi"
ON public.bemorlar FOR SELECT
USING (doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor bemor qo'shadi"
ON public.bemorlar FOR INSERT
WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor o'z bemorini tahrirlaydi"
ON public.bemorlar FOR UPDATE
USING (doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor o'z bemorini o'chiradi"
ON public.bemorlar FOR DELETE
USING (doctor_id = auth.uid() OR public.is_admin());

-- Kuzatuv yozuvlari tegishli bemorning shifokoriga bog'liq holda boshqariladi.
CREATE POLICY "Shifokor kuzatuvni ko'radi"
ON public.kuzatuv FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bemorlar b
    WHERE b.id = kuzatuv.bemor_id AND (b.doctor_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "Shifokor kuzatuv qo'shadi"
ON public.kuzatuv FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bemorlar b
    WHERE b.id = kuzatuv.bemor_id AND b.doctor_id = auth.uid()
  )
);
