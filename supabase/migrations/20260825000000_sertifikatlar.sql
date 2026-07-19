-- Sertifikatlar va bob nishonlari.
--
-- Ikki xil hujjat:
--   'bosqich' — bosqich (O'rta / Qiyin) yakunlangani uchun to'liq sertifikat.
--               Unikal kod, QR va ochiq tekshirish sahifasi bilan.
--   'bob'     — bosqich ichidagi bitta bob tugallangani uchun nishon.
--               Ulashish uchun (Instagram/Telegram), sertifikat darajasida emas.
--
-- Ishonchlilik: hujjat FAQAT server tomonidan (/api/sertifikat/ber) beriladi —
-- u talabaning natijalarini qayta tekshiradi. Shu sabab bu jadvalga
-- foydalanuvchi uchun INSERT/UPDATE siyosati berilmaydi.

CREATE TABLE public.sertifikatlar (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kod            text NOT NULL UNIQUE,          -- URS-XXXX-XXXX ko'rinishida, QR shu kodga ishora qiladi
  student_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  turi           text NOT NULL CHECK (turi IN ('bosqich', 'bob')),
  bosqich        text NOT NULL CHECK (bosqich IN ('oson', 'o''rta', 'qiyin')),
  kategoriya     text,                          -- faqat 'bob' uchun to'ldiriladi
  -- Ism berilgan paytdagi holatda muzlatiladi: keyin profilda o'zgartirilsa ham
  -- berilgan hujjat va uni tekshirish sahifasi bir xil qoladi.
  ism            text NOT NULL,
  foiz           numeric,                       -- bosqich bo'yicha o'rtacha nazorat natijasi
  dars_soni      int NOT NULL DEFAULT 0,
  bekor_qilingan boolean NOT NULL DEFAULT false,
  bekor_sababi   text,
  created_at     timestamptz NOT NULL DEFAULT now(),

  -- Bir talabaga bir bosqich/bob uchun bitta hujjat
  UNIQUE (student_id, turi, bosqich, kategoriya)
);

CREATE INDEX sertifikatlar_student_idx ON public.sertifikatlar (student_id);
CREATE INDEX sertifikatlar_kod_idx ON public.sertifikatlar (kod);

ALTER TABLE public.sertifikatlar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talaba o'z sertifikatlarini ko'radi"
  ON public.sertifikatlar FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin sertifikatlarni boshqaradi"
  ON public.sertifikatlar FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Ochiq tekshirish sahifasi (/sertifikat/[kod]) service-role bilan o'qiydi —
-- anonim SELECT siyosati ochilmaydi, aks holda butun ro'yxatni ko'chirib olish mumkin bo'lardi.

-- Ism sertifikatga tushgach qulflanadi: talaba o'zi o'zgartira olmaydi (admin o'zgartira oladi).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ism_qulflangan boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.ismni_qulfda_saqla()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.ism_qulflangan
     AND NEW.full_name IS DISTINCT FROM OLD.full_name
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Sertifikat berilgan — ismni o''zgartirish uchun administratorga murojaat qiling';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_ism_qulf ON public.profiles;

CREATE TRIGGER profiles_ism_qulf
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.ismni_qulfda_saqla();
