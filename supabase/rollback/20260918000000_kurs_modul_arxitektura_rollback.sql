-- ============================================================
-- ROLLBACK — 20260918000000_kurs_modul_arxitektura.sql uchun
--
-- ⚠️ BU FAYL MIGRATSIYA EMAS. Supabase migration pipeline uni AVTOMATIK
-- ISHLATMAYDI (shu sabab supabase/migrations/ EMAS, supabase/rollback/ da).
-- Faqat QO'LDA, ongli ravishda Supabase → SQL Editor da Run qiling.
--
-- Tartib muhim: (1) yangi policy'ni o'chirib ESKI kurs_darslar policy'ni
-- tiklash → (2) kurs_darslar trigger/ustunlar → (3) yangi jadvallar
-- dependency tartibida → (4) kursga xos funksiya.
--
-- SAQLANADI: kurs_darslar, kurs_natijalar, dars_qadam_progress, 126 dars.
-- ============================================================

-- ── 1) kurs_darslar SELECT policy — eski holatga aniq qaytarish ──
DROP POLICY IF EXISTS "kurs_darslar_select" ON public.kurs_darslar;
CREATE POLICY "kurs_darslar_select" ON public.kurs_darslar
  FOR SELECT USING (auth.uid() IS NOT NULL AND faol = true);   -- migratsiyadan oldingi holat

-- ── 2) kurs_darslar: shu migratsiya qo'shgan trigger va ustunlar ──
DROP TRIGGER IF EXISTS kurs_darslar_set_updated_at ON public.kurs_darslar;  -- faqat shu migratsiya qo'shgan bo'lsa
ALTER TABLE public.kurs_darslar DROP CONSTRAINT IF EXISTS kurs_darslar_modul_fk;
ALTER TABLE public.kurs_darslar
  DROP COLUMN IF EXISTS modul_id,
  DROP COLUMN IF EXISTS bepul_namuna,
  DROP COLUMN IF EXISTS tur,
  DROP COLUMN IF EXISTS klinik_kirish,
  DROP COLUMN IF EXISTS xulosa,
  DROP COLUMN IF EXISTS dars_natijalari;

-- ── 3) Yangi jadvallar — dependency tartibida (bog'liqlar avval) ──
DROP TABLE IF EXISTS public.kurs_urinishlar;    -- → kurs_modullar, kurs_caselar, profiles
DROP TABLE IF EXISTS public.kurs_progress;      -- → kurs_darslar, profiles
DROP TABLE IF EXISTS public.kurs_caselar;       -- → kurs_modullar
DROP TABLE IF EXISTS public.kurs_flashcardlar;  -- → kurs_modullar
DROP TABLE IF EXISTS public.kurs_savollar;      -- → kurs_modullar, kurs_darslar
DROP TABLE IF EXISTS public.kurs_modullar;      -- oxirgi (boshqalar unga tayanadi)

-- ── 4) Kursga xos trigger funksiyasi (boshqa hech kim ishlatmasa) ──
DROP FUNCTION IF EXISTS public.set_kurs_updated_at();
