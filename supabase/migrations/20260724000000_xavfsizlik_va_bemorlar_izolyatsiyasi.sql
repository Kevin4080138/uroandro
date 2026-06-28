-- XAVFSIZLIK TUZATISHLARI
--
-- 1) handle_new_user(): ro'yxatdan o'tishda klient yuborgan "role" maydoniga
--    ishonib bo'lmaydi (har kim o'zini "doctor"/"admin" deb ro'yxatdan
--    o'tkazishi mumkin edi). Endi faqat "patient" qiymati o'tkaziladi,
--    qolgan barcha holatlarda "student" beriladi. Shifokor/admin huquqi
--    faqat admin panel orqali (mavjud "Admin profillarni yangilaydi" RLS
--    qoidasi bilan) beriladi.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    CASE WHEN NEW.raw_user_meta_data->>'role' = 'patient' THEN 'patient' ELSE 'student' END,
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- 2) bemorlar reestri: "har qanday tizimga kirgan" emas, faqat
--    yozgan shifokor (yoki admin) o'z bemorlarini ko'rishi/qo'shishi kerak.
--    Shu bilan har bir shifokor faqat o'z bemorlarini ko'radi.
DROP POLICY IF EXISTS "Har qanday shifokor reestrni ko'radi" ON public.bemorlar;
DROP POLICY IF EXISTS "Har qanday shifokor bemor qo'shadi" ON public.bemorlar;

CREATE POLICY "Shifokor faqat o'z bemorlarini ko'radi"
ON public.bemorlar FOR SELECT
USING (created_by = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor o'ziga bemor qo'shadi"
ON public.bemorlar FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Qo'shgan shifokor yoki admin tahrirlaydi" ON public.bemorlar;
CREATE POLICY "Qo'shgan shifokor yoki admin tahrirlaydi"
ON public.bemorlar FOR UPDATE
USING (created_by = auth.uid() OR public.is_admin());

CREATE POLICY "Qo'shgan shifokor yoki admin o'chiradi"
ON public.bemorlar FOR DELETE
USING (created_by = auth.uid() OR public.is_admin());

-- 3) Pasport ma'lumotlari endi yig'ilmaydi/saqlanmaydi (shaxsiy ma'lumotni
--    kamaytirish — passport seriya/raqami kabi nozik ma'lumotni saqlash
--    shart emas, bemorni ism+telefon+tug'ilgan sana bilan aniqlash kifoya).
ALTER TABLE public.bemorlar DROP COLUMN IF EXISTS passport_seria;
ALTER TABLE public.bemorlar DROP COLUMN IF EXISTS passport_raqam;

-- 4) Tartib raqami endi har bir shifokor uchun alohida (1, 2, 3...), umumiy
--    ketma-ketlik o'rniga. Avval mavjud yozuvlarni shifokor bo'yicha qayta
--    raqamlaymiz, keyin yangi yozuvlar uchun trigger qo'yamiz.
ALTER TABLE public.bemorlar ALTER COLUMN raqam DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.bemor_raqam_seq;

WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created_at, id) AS rn
  FROM public.bemorlar
)
UPDATE public.bemorlar b SET raqam = r.rn FROM ranked r WHERE b.id = r.id;

CREATE OR REPLACE FUNCTION public.bemor_shifokor_raqami()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.raqam IS NULL THEN
    SELECT COALESCE(MAX(raqam), 0) + 1 INTO NEW.raqam
    FROM public.bemorlar
    WHERE created_by = NEW.created_by;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bemor_shifokor_raqami_trigger ON public.bemorlar;
CREATE TRIGGER bemor_shifokor_raqami_trigger
BEFORE INSERT ON public.bemorlar
FOR EACH ROW EXECUTE FUNCTION public.bemor_shifokor_raqami();

-- 5) Yangi shifokor ro'yxatdan o'tganda (yoki admin uni "doctor" qilib
--    belgilaganda) tizim bilan tanishish uchun avtomatik bitta to'liq
--    to'ldirilgan NAMUNA bemor yozuvi yaratiladi — faqat shu shifokorga
--    tegishli (boshqa shifokorlarga ko'rinmaydi).
ALTER TABLE public.bemorlar ADD COLUMN IF NOT EXISTS namuna boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.shifokorga_namuna_bemor_qoshish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'doctor' AND (OLD IS NULL OR OLD.role IS DISTINCT FROM 'doctor') THEN
    IF NOT EXISTS (SELECT 1 FROM public.bemorlar WHERE created_by = NEW.id AND namuna) THEN
      INSERT INTO public.bemorlar (
        fio, familiya, ism, otasi, tugilgan_sana, telefon, manzil, created_by, namuna
      ) VALUES (
        'Namuna Aliyev Vali Akmal o''g''li', 'Aliyev', 'Vali', 'Akmal o''g''li',
        '1990-05-12', '+998 90 000 00 00', 'Toshkent sh., Namuna ko''chasi 1',
        NEW.id, true
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_doctor_profile_namuna_bemor ON public.profiles;
CREATE TRIGGER on_doctor_profile_namuna_bemor
AFTER INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.shifokorga_namuna_bemor_qoshish();
