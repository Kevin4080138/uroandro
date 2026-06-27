-- Bosqichlar (EASY/MEDIUM/HARD) bo'yicha pullik obuna tizimi.
-- Har bir talaba har bir bosqichni alohida sotib olishi mumkin (kumulyativ emas —
-- "oson" sotib olgan odam avtomatik "o'rta"ga ega bo'lmaydi).
CREATE TABLE public.obunalar (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bosqich         text NOT NULL CHECK (bosqich IN ('oson', 'o''rta', 'qiyin')),
  faol            boolean NOT NULL DEFAULT true,
  tugash_sanasi   timestamptz, -- NULL = muddatsiz
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, bosqich)
);

ALTER TABLE public.obunalar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talaba o'z obunasini ko'radi"
  ON public.obunalar FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin obunani boshqaradi"
  ON public.obunalar FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE INDEX obunalar_student_idx ON public.obunalar (student_id);

-- dars_tarkibi'ga bosqich ustuni — RLS shu yerga qarab tekshiradi (kod ichidagi
-- darslar.ts'dagi bosqich bilan sinxron bo'lishi kerak, admin panel buni avtomatik yozadi).
ALTER TABLE public.dars_tarkibi ADD COLUMN bosqich text;

-- Mavjud qatorni to'g'rilash (varikotsele — qiyin bosqich).
UPDATE public.dars_tarkibi SET bosqich = 'qiyin' WHERE dars_slug = 'h-varikotsele-kasalligi';

-- Eski qoidani almashtirib, faqat tegishli bosqichga faol obunasi bor talaba (yoki admin) ko'radi.
DROP POLICY IF EXISTS "Tizimga kirgan har bir foydalanuvchi tarkibni ko'radi" ON public.dars_tarkibi;

CREATE POLICY "Faqat tegishli bosqichni xarid qilgan talaba (yoki admin) tarkibni ko'radi"
  ON public.dars_tarkibi FOR SELECT
  USING (
    public.is_admin()
    OR bosqich IS NULL
    OR EXISTS (
      SELECT 1 FROM public.obunalar o
      WHERE o.student_id = auth.uid()
        AND o.bosqich = dars_tarkibi.bosqich
        AND o.faol
        AND (o.tugash_sanasi IS NULL OR o.tugash_sanasi > now())
    )
  );
