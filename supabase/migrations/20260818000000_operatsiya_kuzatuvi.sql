-- Operatsiyadan keyingi kuzatuv: shifokor bemorga operatsiya rejasini biriktiradi,
-- tizim belgilangan bosqichlarda (1-kun, 7-kun, 1-oy, 3-oy, 6-oy) bemorga push eslatma yuboradi.
-- Push infratuzilmasi (push_obunalari, pushSend) allaqachon mavjud — bu shunga tayanadi.

-- 1) Operatsiya kuzatuvi
CREATE TABLE public.operatsiya_kuzatuvi (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bemor_id         uuid REFERENCES public.bemorlar(id) ON DELETE SET NULL, -- ro'yxatdagi bemor (ixtiyoriy)
  bemor_user_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- push yuborish uchun bemor hisobi
  bemor_ismi       text NOT NULL,          -- ko'rsatish uchun (bemor_id bo'lmasa ham)
  operatsiya_slug  text,                   -- katalogdagi operatsiya (ixtiyoriy)
  operatsiya_nomi  text NOT NULL,
  operatsiya_sanasi date NOT NULL,
  izoh             text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX operatsiya_kuzatuvi_doctor_idx ON public.operatsiya_kuzatuvi (doctor_id);
CREATE INDEX operatsiya_kuzatuvi_bemor_user_idx ON public.operatsiya_kuzatuvi (bemor_user_id);

ALTER TABLE public.operatsiya_kuzatuvi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shifokor o'z kuzatuvlarini ko'radi"
ON public.operatsiya_kuzatuvi FOR SELECT
USING (doctor_id = auth.uid() OR bemor_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor kuzatuv qo'shadi"
ON public.operatsiya_kuzatuvi FOR INSERT
WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor o'z kuzatuvini o'zgartiradi"
ON public.operatsiya_kuzatuvi FOR UPDATE
USING (doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor o'z kuzatuvini o'chiradi"
ON public.operatsiya_kuzatuvi FOR DELETE
USING (doctor_id = auth.uid() OR public.is_admin());

-- 2) Eslatma yuborilganini kafolatlash — bir bosqich bir marta yuboriladi
CREATE TABLE public.operatsiya_eslatma_yuborilgan (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kuzatuv_id  uuid NOT NULL REFERENCES public.operatsiya_kuzatuvi(id) ON DELETE CASCADE,
  bosqich     text NOT NULL,     -- '1kun' / '7kun' / '1oy' / '3oy' / '6oy'
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kuzatuv_id, bosqich)
);

ALTER TABLE public.operatsiya_eslatma_yuborilgan ENABLE ROW LEVEL SECURITY;
-- Faqat server (admin client, RLS bypass) yozadi; oddiy foydalanuvchiga ochiq siyosat yo'q.
