-- Online navbat: bemor katalogdagi shifokorga vaqt slotini band qiladi.
-- Shifokor ish jadvalini (kunlar, soatlar, slot uzunligi) o'zi belgilaydi.

-- 1) Shifokor ish jadvali (ochiq profilga qo'shimcha)
ALTER TABLE public.shifokor_profillari
  ADD COLUMN IF NOT EXISTS qabul_kunlari jsonb NOT NULL DEFAULT '[1,2,3,4,5,6]',  -- 1=Dush ... 7=Yak
  ADD COLUMN IF NOT EXISTS qabul_boshlanish text NOT NULL DEFAULT '09:00',
  ADD COLUMN IF NOT EXISTS qabul_tugash text NOT NULL DEFAULT '17:00',
  ADD COLUMN IF NOT EXISTS slot_daqiqa int NOT NULL DEFAULT 30;

-- 2) Navbatlar
CREATE TABLE public.navbatlar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sana        date NOT NULL,
  vaqt        text NOT NULL,                      -- '09:30'
  holat       text NOT NULL DEFAULT 'kutilmoqda', -- kutilmoqda / tasdiqlandi / bekor / yakunlandi
  izoh        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Bir slot bir bemorga: bekor qilingan navbat slotni bo'shatadi
CREATE UNIQUE INDEX navbatlar_slot_unique
  ON public.navbatlar (doctor_id, sana, vaqt) WHERE holat <> 'bekor';

CREATE INDEX navbatlar_doctor_sana_idx ON public.navbatlar (doctor_id, sana);

ALTER TABLE public.navbatlar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bemor va shifokor o'z navbatlarini ko'radi"
ON public.navbatlar FOR SELECT
USING (patient_id = auth.uid() OR doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Bemor navbat oladi"
ON public.navbatlar FOR INSERT
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Bemor yoki shifokor navbatni o'zgartiradi"
ON public.navbatlar FOR UPDATE
USING (patient_id = auth.uid() OR doctor_id = auth.uid() OR public.is_admin());

-- 3) Band slotlar — bemor boshqalarning navbatini ko'rmasdan bandlikni bilishi uchun
CREATE OR REPLACE FUNCTION public.band_slotlar(d_id uuid, s date)
RETURNS TABLE (vaqt text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT n.vaqt FROM public.navbatlar n
  WHERE n.doctor_id = d_id AND n.sana = s AND n.holat <> 'bekor'
$$;
