-- Talabalardan kelgan izoh/fikr-mulohazalarni saqlash (Profil → Izoh bo'limi).
CREATE TABLE public.fikrlar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matn        text NOT NULL,
  korildi     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fikrlar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talaba o'z fikrini qo'shadi"
  ON public.fikrlar FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Talaba o'z fikrlarini ko'radi, admin hammasini ko'radi"
  ON public.fikrlar FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin fikrni ko'rilgan deb belgilaydi"
  ON public.fikrlar FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE INDEX fikrlar_student_idx ON public.fikrlar (student_id, created_at DESC);
