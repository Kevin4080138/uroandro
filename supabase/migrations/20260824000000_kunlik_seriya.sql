-- Kunlik seriya (streak): talaba har kuni kamida bitta dars qadamini yakunlasa
-- seriya davom etadi, bir kun o'tkazib yuborilsa uziladi va 1 dan qayta boshlanadi.
-- Retention mexanikasi: seriya talabani har kuni qaytishga undaydi, uzilish arafasida
-- bot orqali eslatma yuboriladi (/api/cron/kunlik-seriya).

CREATE TABLE public.kunlik_seriya (
  student_id        uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  joriy             int  NOT NULL DEFAULT 0,   -- hozirgi uzluksiz kunlar soni
  eng_uzun          int  NOT NULL DEFAULT 0,   -- shaxsiy rekord
  oxirgi_sana       date,                      -- oxirgi faol kun (Toshkent vaqti bo'yicha)
  jami_faol_kun     int  NOT NULL DEFAULT 0,   -- umuman nechta kun faol bo'lgan
  eslatma_sanasi    date,                      -- "seriya xavf ostida" eslatmasi yuborilgan kun
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kunlik_seriya ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talaba o'z seriyasini ko'radi"
  ON public.kunlik_seriya FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

-- Yozish faqat quyidagi funksiya orqali (SECURITY DEFINER) — talaba seriyasini
-- qo'lda oshira olmasligi uchun INSERT/UPDATE policy berilmaydi.

-- Sana Toshkent vaqti bo'yicha hisoblanadi: kechqurun 23:30 da yakunlangan qadam
-- o'sha kunga tegishli bo'lishi kerak, UTC'da esa u ertangi kun bo'lib ketardi.
CREATE OR REPLACE FUNCTION public.seriya_belgila()
RETURNS public.kunlik_seriya
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bugun  date := (now() AT TIME ZONE 'Asia/Tashkent')::date;
  natija public.kunlik_seriya;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Ruxsat yo''q';
  END IF;

  INSERT INTO public.kunlik_seriya AS k (student_id, joriy, eng_uzun, oxirgi_sana, jami_faol_kun)
  VALUES (auth.uid(), 1, 1, bugun, 1)
  ON CONFLICT (student_id) DO UPDATE SET
    joriy = CASE
      WHEN k.oxirgi_sana = bugun THEN k.joriy                    -- bugun allaqachon sanalgan
      WHEN k.oxirgi_sana = bugun - 1 THEN k.joriy + 1            -- ketma-ket kun
      ELSE 1                                                      -- uzilgan yoki birinchi kun
    END,
    eng_uzun = GREATEST(k.eng_uzun, CASE
      WHEN k.oxirgi_sana = bugun THEN k.joriy
      WHEN k.oxirgi_sana = bugun - 1 THEN k.joriy + 1
      ELSE 1
    END),
    jami_faol_kun = k.jami_faol_kun + CASE WHEN k.oxirgi_sana = bugun THEN 0 ELSE 1 END,
    oxirgi_sana = bugun,
    updated_at = now()
  RETURNING k.* INTO natija;

  RETURN natija;
END;
$$;

REVOKE ALL ON FUNCTION public.seriya_belgila() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.seriya_belgila() TO authenticated;

-- Cron eslatmasini ikki marta yubormaslik uchun belgilash (service_role chaqiradi).
CREATE OR REPLACE FUNCTION public.seriya_eslatma_belgila(p_student_id uuid, p_sana date)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.kunlik_seriya
  SET eslatma_sanasi = p_sana, updated_at = now()
  WHERE student_id = p_student_id;
$$;

-- Bu funksiya ixtiyoriy student_id qabul qiladi va SECURITY DEFINER — shu sabab
-- oddiy foydalanuvchilarga berilmaydi (aks holda birov boshqasining eslatmasini
-- "yuborilgan" deb belgilab, uni o'chirib qo'yishi mumkin edi).
REVOKE ALL ON FUNCTION public.seriya_eslatma_belgila(uuid, date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.seriya_eslatma_belgila(uuid, date) TO service_role;
