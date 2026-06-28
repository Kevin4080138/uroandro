-- Har bosqichdan bir nechta dars "bepul namuna" sifatida obunasiz ham to'liq ko'rinadi
-- (talaba bosqichni sotib olishdan oldin sifatini ko'rib bilsin).
ALTER TABLE public.dars_tarkibi ADD COLUMN IF NOT EXISTS bepul_namuna boolean NOT NULL DEFAULT false;

UPDATE public.dars_tarkibi SET bepul_namuna = true WHERE dars_slug = 'h-varikotsele-kasalligi';

DROP POLICY IF EXISTS "Faqat tegishli bosqichni xarid qilgan talaba (yoki admin) tarkibni ko'radi" ON public.dars_tarkibi;

CREATE POLICY "Bosqich sotib olingan, bepul namuna yoki admin bo'lsa tarkibni ko'radi"
  ON public.dars_tarkibi FOR SELECT
  USING (
    public.is_admin()
    OR bosqich IS NULL
    OR bepul_namuna
    OR EXISTS (
      SELECT 1 FROM public.obunalar o
      WHERE o.student_id = auth.uid()
        AND o.bosqich = dars_tarkibi.bosqich
        AND o.faol
        AND (o.tugash_sanasi IS NULL OR o.tugash_sanasi > now())
    )
  );
