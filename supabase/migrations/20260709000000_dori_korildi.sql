-- Bemor yangi dori retseptini ko'rganini belgilash (bosh sahifadagi bildirishnoma uchun)
ALTER TABLE public.dori_retseptlari
  ADD COLUMN bemor_korgan boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.dori_korildi(retsept_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.dori_retseptlari
  SET bemor_korgan = true
  WHERE id = retsept_id AND bemor_user_id = auth.uid();
END;
$$;
