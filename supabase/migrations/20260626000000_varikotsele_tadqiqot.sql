-- VariCompare moduli uchun tadqiqot bazasi: qaysi shifokor qaysi usulni
-- qo'llagani va natijalarini qayd etadi (statistik tahlil uchun).
CREATE TABLE public.varikotsele_tadqiqot (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pid         text,
  age         int,
  method      text NOT NULL,   -- lap / micro / sklero / palomo / ivan
  grade       int,
  followup    int DEFAULT 0,
  recur       boolean DEFAULT false,
  hydro       boolean DEFAULT false,
  semen       boolean DEFAULT false,
  preg        boolean DEFAULT false,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.varikotsele_tadqiqot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shifokor o'z tadqiqot yozuvlarini ko'radi"
ON public.varikotsele_tadqiqot FOR SELECT
USING (doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor tadqiqot yozuvi qo'shadi"
ON public.varikotsele_tadqiqot FOR INSERT
WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor o'z yozuvini o'chiradi"
ON public.varikotsele_tadqiqot FOR DELETE
USING (doctor_id = auth.uid() OR public.is_admin());
