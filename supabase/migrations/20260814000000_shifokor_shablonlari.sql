-- Shifokorning shaxsiy kasallik tarixi shablonlari.
-- Tuzilma JSONB da saqlanadi (guruhlar + hujjatlar, deklarativ format) —
-- keyinchalik eksport/integratsiya (masalan DMED) uchun toza tuzilgan ko'rinishda.
-- Har bir shablon faqat egasiga ko'rinadi (RLS).
CREATE TABLE public.shifokor_shablonlari (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kasallik    text NOT NULL,
  tuzilma     jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX shifokor_shablonlari_doctor_idx ON public.shifokor_shablonlari (doctor_id);

ALTER TABLE public.shifokor_shablonlari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shifokor o'z shablonlarini ko'radi"
ON public.shifokor_shablonlari FOR SELECT
USING (doctor_id = auth.uid());

CREATE POLICY "Shifokor shablon qo'shadi"
ON public.shifokor_shablonlari FOR INSERT
WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor o'z shablonini yangilaydi"
ON public.shifokor_shablonlari FOR UPDATE
USING (doctor_id = auth.uid());

CREATE POLICY "Shifokor o'z shablonini o'chiradi"
ON public.shifokor_shablonlari FOR DELETE
USING (doctor_id = auth.uid());
