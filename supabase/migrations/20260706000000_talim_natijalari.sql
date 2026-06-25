-- Talaba dars/test natijalarini saqlash (progress kuzatish uchun)
CREATE TABLE public.talim_natijalari (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dars_slug   text NOT NULL,
  dars_nomi   text NOT NULL,
  togri_son   int NOT NULL,
  jami_savol  int NOT NULL,
  foiz        numeric NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.talim_natijalari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talaba o'z natijalarini ko'radi"
  ON public.talim_natijalari FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Talaba natija qo'shadi"
  ON public.talim_natijalari FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE INDEX talim_natijalari_student_idx ON public.talim_natijalari (student_id, created_at DESC);
