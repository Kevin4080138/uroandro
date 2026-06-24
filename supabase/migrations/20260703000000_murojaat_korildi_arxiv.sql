-- Murojaatlarga "bemor ko'rdi" va "arxiv" holatlari.
ALTER TABLE public.murojaatlar
  ADD COLUMN bemor_korgan boolean NOT NULL DEFAULT false,
  ADD COLUMN arxiv boolean NOT NULL DEFAULT false;

-- Bemor o'z murojaatidagi shifokor javobini ko'rganini belgilaydi (xavfsiz RPC).
CREATE OR REPLACE FUNCTION public.murojaat_korildi(m_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.murojaatlar
  SET bemor_korgan = true
  WHERE id = m_id AND patient_id = auth.uid();
$$;
