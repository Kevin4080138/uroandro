-- Reytingda boshqa talabalar "Noma'lum talaba" bo'lib ko'rinardi, chunki
-- profiles jadvalining SELECT qoidasi talabaga faqat o'z profilini (va
-- doctor/patient rollarini) ko'rsatadi — boshqa talabalar ismi RLS bilan
-- to'silgan edi.
--
-- Yechim: butun profiles qatorini ochish (telefon/email ham ochilib ketardi)
-- o'rniga faqat id + full_name qaytaradigan SECURITY DEFINER funksiya.
-- Shunda reyting ismlarni ko'rsatadi, ammo nozik maydonlar yopiq qoladi.

CREATE OR REPLACE FUNCTION public.reyting_ismlari(ids uuid[])
RETURNS TABLE (id uuid, full_name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name
  FROM public.profiles p
  WHERE p.id = ANY(ids)
    AND p.role = 'student';
$$;

-- Faqat tizimga kirgan foydalanuvchilar chaqira oladi.
REVOKE ALL ON FUNCTION public.reyting_ismlari(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reyting_ismlari(uuid[]) TO authenticated;
