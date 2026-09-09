-- ════════════════════════════════════════════════════════════
-- Dars-darajali mustahkamlash banki (EASY «Mavzuni mustahkamlash»)
--   • kurs_savollar: yangi `amaliy` turi — darsga bog'langan formativ test
--     (baholanmaydi, izohli, cheksiz urinish — tezkor kabi, lekin N savol).
--   • kurs_flashcardlar: `dars_id` — flashcard endi MODUL yoki DARS darajasida.
-- Idempotent. Modul-darajali test/usmle/case (nazorat) o'zgarmaydi.
-- ════════════════════════════════════════════════════════════

-- ── kurs_savollar: 'amaliy' turi (dars-darajali) ──
ALTER TABLE public.kurs_savollar DROP CONSTRAINT IF EXISTS kurs_savollar_tur_chk;
ALTER TABLE public.kurs_savollar ADD  CONSTRAINT kurs_savollar_tur_chk
  CHECK (tur IN ('tezkor','amaliy','test','usmle'));

-- Bog'lanish: tezkor/amaliy → dars_id; test/usmle → modul_id YOKI dars_id (biri)
ALTER TABLE public.kurs_savollar DROP CONSTRAINT IF EXISTS kurs_savollar_bogliq_chk;
ALTER TABLE public.kurs_savollar ADD  CONSTRAINT kurs_savollar_bogliq_chk
  CHECK (
    (tur IN ('tezkor','amaliy') AND dars_id IS NOT NULL AND modul_id IS NULL)
    OR
    (tur IN ('test','usmle') AND (
        (modul_id IS NOT NULL AND dars_id IS NULL)
     OR (dars_id  IS NOT NULL AND modul_id IS NULL)
    ))
  );

-- ── kurs_flashcardlar: dars-darajali qo'llab-quvvatlash ──
ALTER TABLE public.kurs_flashcardlar ADD COLUMN IF NOT EXISTS dars_id uuid
  REFERENCES public.kurs_darslar(id) ON DELETE CASCADE;
ALTER TABLE public.kurs_flashcardlar ALTER COLUMN modul_id DROP NOT NULL;

ALTER TABLE public.kurs_flashcardlar DROP CONSTRAINT IF EXISTS kurs_flashcardlar_bogliq_chk;
ALTER TABLE public.kurs_flashcardlar ADD  CONSTRAINT kurs_flashcardlar_bogliq_chk
  CHECK ((modul_id IS NOT NULL AND dars_id IS NULL) OR (dars_id IS NOT NULL AND modul_id IS NULL));

CREATE INDEX IF NOT EXISTS kurs_flashcardlar_dars_idx ON public.kurs_flashcardlar (dars_id, sort_order);

-- SELECT: modul-darajali (nashr modul) YOKI dars-darajali (faol dars + nashr modul)
DROP POLICY IF EXISTS "kurs_flashcardlar_select" ON public.kurs_flashcardlar;
CREATE POLICY "kurs_flashcardlar_select" ON public.kurs_flashcardlar
  FOR SELECT USING (
    public.is_admin()
    OR (
      auth.uid() IS NOT NULL AND (
        (kurs_flashcardlar.modul_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.kurs_modullar m
          WHERE m.id = kurs_flashcardlar.modul_id AND m.holat = 'nashr'
        ))
        OR (kurs_flashcardlar.dars_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.kurs_darslar d
          JOIN public.kurs_modullar m ON m.id = d.modul_id
          WHERE d.id = kurs_flashcardlar.dars_id AND d.faol = true AND m.holat = 'nashr'
        ))
      )
    )
  );
