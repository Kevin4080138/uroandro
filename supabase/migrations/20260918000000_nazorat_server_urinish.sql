-- Nazorat imtihonini server-authoritative qilish: to'g'ri javoblar va server
-- deadline klientga ishonilmaydi. Har talaba/dars uchun bitta urinish.
CREATE TABLE IF NOT EXISTS public.nazorat_urinishlari (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dars_slug text NOT NULL,
  dars_nomi text NOT NULL,
  savollar jsonb NOT NULL,
  boshlangan_at timestamptz NOT NULL DEFAULT now(),
  tugash_at timestamptz NOT NULL,
  yakunlangan_at timestamptz,
  togri_son integer,
  jami_savol integer,
  foiz integer,
  qoidabuzarlik boolean NOT NULL DEFAULT false,
  UNIQUE (student_id, dars_slug)
);

ALTER TABLE public.nazorat_urinishlari ENABLE ROW LEVEL SECURITY;

-- Jadvaldagi yopiq javob kalitlari klientga ochilmaydi; faqat server route
-- service-role orqali ishlatadi. authenticated uchun hech qanday policy yo'q.
REVOKE ALL ON public.nazorat_urinishlari FROM anon, authenticated;

CREATE INDEX IF NOT EXISTS nazorat_urinish_student_idx
  ON public.nazorat_urinishlari (student_id, boshlangan_at DESC);
