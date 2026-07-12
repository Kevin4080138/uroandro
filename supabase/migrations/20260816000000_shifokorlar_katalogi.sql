-- Farg'ona shifokorlar katalogi: klinikalar, shifokorning ochiq profili,
-- bemorlarning 4 mezonli baholari. Katalog sahifasi loginsiz ko'riladi,
-- shuning uchun select siyosatlari anon uchun ham ochiq.

-- 1) Klinikalar
CREATE TABLE public.klinikalar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom         text NOT NULL,
  manzil      text,
  telefon     text,
  hudud       text NOT NULL DEFAULT 'Farg''ona',
  created_by  uuid REFERENCES public.profiles(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.klinikalar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Klinikalar hammaga ko'rinadi"
ON public.klinikalar FOR SELECT
USING (true);

CREATE POLICY "Tizimga kirgan foydalanuvchi klinika qo'shadi"
ON public.klinikalar FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Qo'shgan foydalanuvchi yoki admin klinikani tahrirlaydi"
ON public.klinikalar FOR UPDATE
USING (created_by = auth.uid() OR public.is_admin());

-- 2) Shifokorning ochiq profili (katalogda ko'rinadigan ma'lumotlar).
-- full_name/telefon ataylab nusxalanadi — profiles jadvalini anon'ga
-- ochmaslik uchun (u yerda email bor).
CREATE TABLE public.shifokor_profillari (
  doctor_id      uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name      text NOT NULL,
  klinika_id     uuid REFERENCES public.klinikalar(id) ON DELETE SET NULL,
  mutaxassislik  text,
  ilmiy_daraja   text,
  tajriba_yil    int,
  bio            text,
  xizmatlar      jsonb NOT NULL DEFAULT '[]',   -- [{nom, narx}]
  qabul_narxi    text,
  ish_vaqti      text,
  telefon        text,
  ochiq          boolean NOT NULL DEFAULT false,
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shifokor_profillari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ochiq profillar hammaga, o'ziniki har doim ko'rinadi"
ON public.shifokor_profillari FOR SELECT
USING (ochiq = true OR doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor o'z ochiq profilini yaratadi"
ON public.shifokor_profillari FOR INSERT
WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor o'z ochiq profilini yangilaydi"
ON public.shifokor_profillari FOR UPDATE
USING (doctor_id = auth.uid() OR public.is_admin());

-- 3) Baholar — faqat shu shifokor bilan haqiqiy aloqasi bo'lgan
-- (javob olgan yoki qabulga olingan) bemor baho bera oladi.
CREATE TABLE public.baholar (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  muomala       smallint NOT NULL CHECK (muomala BETWEEN 1 AND 5),
  samara        smallint NOT NULL CHECK (samara BETWEEN 1 AND 5),
  tushuntirish  smallint NOT NULL CHECK (tushuntirish BETWEEN 1 AND 5),
  kutish        smallint NOT NULL CHECK (kutish BETWEEN 1 AND 5),
  izoh          text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (doctor_id, patient_id)
);

CREATE INDEX baholar_doctor_idx ON public.baholar (doctor_id);

ALTER TABLE public.baholar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Baholar hammaga ko'rinadi"
ON public.baholar FOR SELECT
USING (true);

CREATE POLICY "Faqat davolangan bemor baho beradi"
ON public.baholar FOR INSERT
WITH CHECK (
  patient_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.murojaatlar m
    WHERE m.patient_id = auth.uid()
      AND m.doctor_id = baholar.doctor_id
      AND (m.holat IN ('javob_berildi', 'qabulda') OR m.javob IS NOT NULL)
  )
);

CREATE POLICY "Bemor o'z bahosini yangilaydi"
ON public.baholar FOR UPDATE
USING (patient_id = auth.uid());
