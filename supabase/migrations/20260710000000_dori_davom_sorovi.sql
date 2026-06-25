-- Dori kursi tugayotganda bemor shifokordan davom ettirishni so'rashi uchun.
ALTER TABLE public.dori_retseptlari
  ADD COLUMN davom_sorovi_yuborilgan boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.dori_davom_sorovi(retsept_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  SELECT * INTO r FROM public.dori_retseptlari WHERE id = retsept_id AND bemor_user_id = auth.uid();
  IF r.id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.murojaatlar (patient_id, target_doctor_id, shikoyatlar, taxminiy_tashxis)
  VALUES (
    auth.uid(),
    r.doctor_id,
    'Dori retseptini davom ettirish so''rovi: ' || r.nomi,
    'Dori kursi tugayotgani/tugagani sababli bemor qayta retsept yozishni so''ramoqda.'
  );

  UPDATE public.dori_retseptlari SET davom_sorovi_yuborilgan = true WHERE id = retsept_id;
END;
$$;
