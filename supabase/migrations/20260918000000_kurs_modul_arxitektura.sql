-- ============================================================
-- KURS MODUL ARXITEKTURASI — Faza 4.1 (schema/migratsiya)
-- Reja: REJA-UROLOGIYA-FAZA4-IMPLEMENTATSIYA.md
--
-- Normalizatsiya: kurs_darslar.modul_no/modul_nom denormalizatsiyasidan
-- kurs_modullar jadvaliga. Yangi: modul/savol/flashcard/case/progress/urinish.
--
-- IDEMPOTENT: butun faylni Supabase → SQL Editor da Run qiling; qayta Run
-- qilsa ham xatosiz va dublikatsiz (IF NOT EXISTS, DROP…IF EXISTS,
-- ON CONFLICT, IS DISTINCT FROM).
--
-- MUHIM (Faza 4 chegarasi):
--   • Barcha 34 modul DRAFT yaratiladi — AUTO-PUBLISH YO'Q.
--   • L2/L3 (orta/qiyin) nashri DB CHECK bilan bloklangan (vaqtinchalik).
--   • 126 skelet SAQLANADI — fizik merge yo'q, faqat modulga bog'lanadi.
--   • kurs_darslar.faol ustuni qoladi; SELECT policy parent modul nashr'ini tekshiradi.
--   • Rollback: supabase/rollback/20260918000000_..._rollback.sql (avtomatik EMAS).
-- ============================================================

-- ── Kursga xos updated_at trigger funksiyasi ──
-- Umumiy public.set_updated_at() ni ko'r-ko'rona almashtirmaymiz — kursga xos.
CREATE OR REPLACE FUNCTION public.set_kurs_updated_at() RETURNS trigger
  LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

-- ════════════════════════════════════════════════════════════
-- 1) kurs_modullar — normallashtirilgan modul jadvali
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.kurs_modullar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  yonalish    text NOT NULL DEFAULT 'urologiya',
  bosqich     text NOT NULL DEFAULT 'oson',
  modul_no    int  NOT NULL,
  nom         text NOT NULL,
  tavsif      text,
  track       text,
  majburiy    boolean NOT NULL DEFAULT true,
  bepul       boolean NOT NULL DEFAULT false,
  kredit      int  NOT NULL DEFAULT 1,
  holat       text NOT NULL DEFAULT 'draft',
  sort_order  int  NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Named constraintlar — DROP/ADD naqshi (idempotent; qayta Run xavfsiz)
ALTER TABLE public.kurs_modullar DROP CONSTRAINT IF EXISTS kurs_modullar_bosqich_chk;
ALTER TABLE public.kurs_modullar ADD  CONSTRAINT kurs_modullar_bosqich_chk
  CHECK (bosqich IN ('oson','orta','qiyin'));
ALTER TABLE public.kurs_modullar DROP CONSTRAINT IF EXISTS kurs_modullar_holat_chk;
ALTER TABLE public.kurs_modullar ADD  CONSTRAINT kurs_modullar_holat_chk
  CHECK (holat IN ('draft','nashr'));
ALTER TABLE public.kurs_modullar DROP CONSTRAINT IF EXISTS kurs_modullar_kredit_chk;
ALTER TABLE public.kurs_modullar ADD  CONSTRAINT kurs_modullar_kredit_chk
  CHECK (kredit > 0);
-- Vaqtinchalik: L2/L3 nashrini DB darajasida bloklaydi (paywall tayyor bo'lganda almashtiriladi)
ALTER TABLE public.kurs_modullar DROP CONSTRAINT IF EXISTS kurs_modullar_nashr_bloki;
ALTER TABLE public.kurs_modullar ADD  CONSTRAINT kurs_modullar_nashr_bloki
  CHECK (holat = 'draft' OR bosqich = 'oson');
-- Tabiiy kalit — backfill idempotentligi
ALTER TABLE public.kurs_modullar DROP CONSTRAINT IF EXISTS kurs_modullar_natural_key;
ALTER TABLE public.kurs_modullar ADD  CONSTRAINT kurs_modullar_natural_key
  UNIQUE (yonalish, bosqich, modul_no);

CREATE INDEX IF NOT EXISTS kurs_modullar_royxat_idx
  ON public.kurs_modullar (yonalish, bosqich, sort_order);

ALTER TABLE public.kurs_modullar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kurs_modullar_select" ON public.kurs_modullar;
CREATE POLICY "kurs_modullar_select" ON public.kurs_modullar
  FOR SELECT USING (
    public.is_admin()
    OR (auth.uid() IS NOT NULL AND holat = 'nashr')
  );
DROP POLICY IF EXISTS "kurs_modullar_admin" ON public.kurs_modullar;
CREATE POLICY "kurs_modullar_admin" ON public.kurs_modullar
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS kurs_modullar_set_updated_at ON public.kurs_modullar;
CREATE TRIGGER kurs_modullar_set_updated_at BEFORE UPDATE ON public.kurs_modullar
  FOR EACH ROW EXECUTE FUNCTION public.set_kurs_updated_at();

-- ════════════════════════════════════════════════════════════
-- 2) kurs_darslar — yangi ustunlar (skelet saqlanadi)
-- ════════════════════════════════════════════════════════════
ALTER TABLE public.kurs_darslar ADD COLUMN IF NOT EXISTS modul_id uuid;
ALTER TABLE public.kurs_darslar ADD COLUMN IF NOT EXISTS bepul_namuna boolean NOT NULL DEFAULT false;
ALTER TABLE public.kurs_darslar ADD COLUMN IF NOT EXISTS tur text NOT NULL DEFAULT 'asosiy';
ALTER TABLE public.kurs_darslar ADD COLUMN IF NOT EXISTS klinik_kirish text;
ALTER TABLE public.kurs_darslar ADD COLUMN IF NOT EXISTS xulosa text;
ALTER TABLE public.kurs_darslar ADD COLUMN IF NOT EXISTS dars_natijalari jsonb NOT NULL DEFAULT '[]'::jsonb;

-- modul_id FK — ON DELETE RESTRICT (modul o'chsa darslar yetim qolmasin)
ALTER TABLE public.kurs_darslar DROP CONSTRAINT IF EXISTS kurs_darslar_modul_fk;
ALTER TABLE public.kurs_darslar ADD  CONSTRAINT kurs_darslar_modul_fk
  FOREIGN KEY (modul_id) REFERENCES public.kurs_modullar(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS kurs_darslar_modul_id_idx ON public.kurs_darslar (modul_id);

-- ════════════════════════════════════════════════════════════
-- 3) kurs_savollar — tezkor (dars) + test/usmle (modul) banki
--    SELECT FAQAT admin — talaba `togri` ni hech qachon ko'rmaydi.
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.kurs_savollar (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tur                text NOT NULL,
  modul_id           uuid REFERENCES public.kurs_modullar(id) ON DELETE CASCADE,
  dars_id            uuid REFERENCES public.kurs_darslar(id)  ON DELETE CASCADE,
  savol              text NOT NULL,
  variantlar         jsonb NOT NULL,
  togri              int  NOT NULL,
  izoh               text,
  notogri_izoh       jsonb NOT NULL DEFAULT '{}'::jsonb,
  qayta_kor_dars_id  uuid REFERENCES public.kurs_darslar(id) ON DELETE SET NULL,
  xato_kategoriya    text,
  sort_order         int  NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kurs_savollar DROP CONSTRAINT IF EXISTS kurs_savollar_tur_chk;
ALTER TABLE public.kurs_savollar ADD  CONSTRAINT kurs_savollar_tur_chk
  CHECK (tur IN ('tezkor','test','usmle'));
ALTER TABLE public.kurs_savollar DROP CONSTRAINT IF EXISTS kurs_savollar_togri_chk;
ALTER TABLE public.kurs_savollar ADD  CONSTRAINT kurs_savollar_togri_chk
  CHECK (togri >= 0);
-- Eksklyuziv bog'lanish: bir savol ham darsga, ham modulga bog'lanmaydi
ALTER TABLE public.kurs_savollar DROP CONSTRAINT IF EXISTS kurs_savollar_bogliq_chk;
ALTER TABLE public.kurs_savollar ADD  CONSTRAINT kurs_savollar_bogliq_chk
  CHECK (
    (tur = 'tezkor'          AND dars_id  IS NOT NULL AND modul_id IS NULL)
    OR
    (tur IN ('test','usmle') AND modul_id IS NOT NULL AND dars_id  IS NULL)
  );

CREATE INDEX IF NOT EXISTS kurs_savollar_modul_tur_idx ON public.kurs_savollar (modul_id, tur);
CREATE INDEX IF NOT EXISTS kurs_savollar_dars_idx      ON public.kurs_savollar (dars_id);

ALTER TABLE public.kurs_savollar ENABLE ROW LEVEL SECURITY;
-- SELECT faqat admin (talaba route orqali `togri`siz oladi)
DROP POLICY IF EXISTS "kurs_savollar_admin" ON public.kurs_savollar;
CREATE POLICY "kurs_savollar_admin" ON public.kurs_savollar
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ════════════════════════════════════════════════════════════
-- 4) kurs_flashcardlar
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.kurs_flashcardlar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modul_id    uuid NOT NULL REFERENCES public.kurs_modullar(id) ON DELETE CASCADE,
  old         text NOT NULL,
  yangi       text NOT NULL,
  kategoriya  text,
  sort_order  int  NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kurs_flashcardlar_modul_idx
  ON public.kurs_flashcardlar (modul_id, sort_order);

ALTER TABLE public.kurs_flashcardlar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kurs_flashcardlar_select" ON public.kurs_flashcardlar;
CREATE POLICY "kurs_flashcardlar_select" ON public.kurs_flashcardlar
  FOR SELECT USING (
    public.is_admin()
    OR (
      auth.uid() IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.kurs_modullar m
        WHERE m.id = kurs_flashcardlar.modul_id AND m.holat = 'nashr'
      )
    )
  );
DROP POLICY IF EXISTS "kurs_flashcardlar_admin" ON public.kurs_flashcardlar;
CREATE POLICY "kurs_flashcardlar_admin" ON public.kurs_flashcardlar
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ════════════════════════════════════════════════════════════
-- 5) kurs_caselar — SELECT FAQAT admin (JSON ichidagi `togri` sizmasin)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.kurs_caselar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modul_id    uuid NOT NULL REFERENCES public.kurs_modullar(id) ON DELETE CASCADE,
  sarlavha    text NOT NULL,
  bosqichlar  jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order  int  NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kurs_caselar_modul_idx
  ON public.kurs_caselar (modul_id, sort_order);

ALTER TABLE public.kurs_caselar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kurs_caselar_admin" ON public.kurs_caselar;
CREATE POLICY "kurs_caselar_admin" ON public.kurs_caselar
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ════════════════════════════════════════════════════════════
-- 6) kurs_progress — dars progressi (server-authoritative)
--    Klient INSERT/UPDATE YO'Q — faqat service-role route yozadi.
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.kurs_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    uuid NOT NULL REFERENCES public.profiles(id)    ON DELETE CASCADE,
  dars_id       uuid NOT NULL REFERENCES public.kurs_darslar(id) ON DELETE CASCADE,
  korildi       boolean NOT NULL DEFAULT false,
  tugatdim      boolean NOT NULL DEFAULT false,
  tezkor_togri  int,
  tezkor_jami   int,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kurs_progress DROP CONSTRAINT IF EXISTS kurs_progress_uniq;
ALTER TABLE public.kurs_progress ADD  CONSTRAINT kurs_progress_uniq
  UNIQUE (student_id, dars_id);
-- DB invariantlar (server asosiy nazorat, DB kod xatosidan himoya)
ALTER TABLE public.kurs_progress DROP CONSTRAINT IF EXISTS kurs_progress_tezkor_chk;
ALTER TABLE public.kurs_progress ADD  CONSTRAINT kurs_progress_tezkor_chk
  CHECK (
    (tezkor_togri IS NULL AND tezkor_jami IS NULL)
    OR (tezkor_togri IS NOT NULL AND tezkor_jami = 3 AND tezkor_togri BETWEEN 0 AND tezkor_jami)
  );
ALTER TABLE public.kurs_progress DROP CONSTRAINT IF EXISTS kurs_progress_tugatdim_chk;
ALTER TABLE public.kurs_progress ADD  CONSTRAINT kurs_progress_tugatdim_chk
  CHECK (NOT tugatdim OR (korildi AND tezkor_jami = 3 AND tezkor_togri >= 2));

CREATE INDEX IF NOT EXISTS kurs_progress_student_idx ON public.kurs_progress (student_id);

ALTER TABLE public.kurs_progress ENABLE ROW LEVEL SECURITY;
-- Faqat SELECT policy (own+admin). INSERT/UPDATE/DELETE — policy yo'q → klient bloklangan;
-- service-role (route) RLS'ni chetlab yozadi.
DROP POLICY IF EXISTS "kurs_progress_select" ON public.kurs_progress;
CREATE POLICY "kurs_progress_select" ON public.kurs_progress
  FOR SELECT USING (student_id = auth.uid() OR public.is_admin());

DROP TRIGGER IF EXISTS kurs_progress_set_updated_at ON public.kurs_progress;
CREATE TRIGGER kurs_progress_set_updated_at BEFORE UPDATE ON public.kurs_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_kurs_updated_at();

-- ════════════════════════════════════════════════════════════
-- 7) kurs_urinishlar — modul test/usmle/case urinishlari (attempt lifecycle)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.kurs_urinishlar (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     uuid NOT NULL REFERENCES public.profiles(id)     ON DELETE CASCADE,
  modul_id       uuid NOT NULL REFERENCES public.kurs_modullar(id) ON DELETE CASCADE,
  case_id        uuid REFERENCES public.kurs_caselar(id) ON DELETE CASCADE,
  tur            text NOT NULL,
  savol_ids      jsonb,
  boshlangan_at  timestamptz NOT NULL DEFAULT now(),
  yakunlangan_at timestamptz,
  ball           int,
  jami           int,
  foiz           int,
  otdi           boolean NOT NULL DEFAULT false,
  javoblar       jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kurs_urinishlar DROP CONSTRAINT IF EXISTS kurs_urinishlar_tur_chk;
ALTER TABLE public.kurs_urinishlar ADD  CONSTRAINT kurs_urinishlar_tur_chk
  CHECK (tur IN ('test','usmle','case'));
-- Turga mos bog'lanish
ALTER TABLE public.kurs_urinishlar DROP CONSTRAINT IF EXISTS kurs_urinishlar_case_chk;
ALTER TABLE public.kurs_urinishlar ADD  CONSTRAINT kurs_urinishlar_case_chk
  CHECK (
    (tur IN ('test','usmle') AND case_id IS NULL)
    OR (tur = 'case' AND case_id IS NOT NULL)
  );
-- Attempt holati: ochiq urinishda natija bo'sh
ALTER TABLE public.kurs_urinishlar DROP CONSTRAINT IF EXISTS kurs_urinishlar_ochiq_chk;
ALTER TABLE public.kurs_urinishlar ADD  CONSTRAINT kurs_urinishlar_ochiq_chk
  CHECK (
    yakunlangan_at IS NOT NULL
    OR (ball IS NULL AND jami IS NULL AND foiz IS NULL AND otdi = false)
  );
ALTER TABLE public.kurs_urinishlar DROP CONSTRAINT IF EXISTS kurs_urinishlar_ball_chk;
ALTER TABLE public.kurs_urinishlar ADD  CONSTRAINT kurs_urinishlar_ball_chk
  CHECK (ball IS NULL OR (jami IS NOT NULL AND ball >= 0 AND ball <= jami));
ALTER TABLE public.kurs_urinishlar DROP CONSTRAINT IF EXISTS kurs_urinishlar_jami_chk;
ALTER TABLE public.kurs_urinishlar ADD  CONSTRAINT kurs_urinishlar_jami_chk
  CHECK (jami IS NULL OR jami > 0);
ALTER TABLE public.kurs_urinishlar DROP CONSTRAINT IF EXISTS kurs_urinishlar_foiz_chk;
ALTER TABLE public.kurs_urinishlar ADD  CONSTRAINT kurs_urinishlar_foiz_chk
  CHECK (foiz IS NULL OR foiz BETWEEN 0 AND 100);

CREATE INDEX IF NOT EXISTS kurs_urinishlar_modul_idx ON public.kurs_urinishlar (student_id, modul_id, tur);
CREATE INDEX IF NOT EXISTS kurs_urinishlar_case_idx  ON public.kurs_urinishlar (student_id, case_id);
-- Partial UNIQUE — bir vaqtda faqat bitta OCHIQ urinish (turga qarab)
CREATE UNIQUE INDEX IF NOT EXISTS kurs_urinishlar_ochiq_test_uniq
  ON public.kurs_urinishlar (student_id, modul_id, tur)
  WHERE yakunlangan_at IS NULL AND tur IN ('test','usmle');
CREATE UNIQUE INDEX IF NOT EXISTS kurs_urinishlar_ochiq_case_uniq
  ON public.kurs_urinishlar (student_id, case_id)
  WHERE yakunlangan_at IS NULL AND tur = 'case';

ALTER TABLE public.kurs_urinishlar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kurs_urinishlar_select" ON public.kurs_urinishlar;
CREATE POLICY "kurs_urinishlar_select" ON public.kurs_urinishlar
  FOR SELECT USING (student_id = auth.uid() OR public.is_admin());

-- ════════════════════════════════════════════════════════════
-- 8) kurs_darslar SELECT policy — parent modul holatiga bog'lash (KRITIK)
--    Draft modul darsi faol=true bo'lsa ham sizib chiqmaydi.
-- ════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "kurs_darslar_select" ON public.kurs_darslar;
CREATE POLICY "kurs_darslar_select" ON public.kurs_darslar
  FOR SELECT USING (
    public.is_admin()
    OR (
      auth.uid() IS NOT NULL
      AND kurs_darslar.faol = true
      AND kurs_darslar.modul_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.kurs_modullar m
        WHERE m.id = kurs_darslar.modul_id AND m.holat = 'nashr'
      )
    )
  );

-- kurs_darslar updated_at trigger — PREFLIGHT: faqat mavjud bo'lmasa qo'shiladi
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE c.relname = 'kurs_darslar' AND NOT t.tgisinternal
      AND t.tgname = 'kurs_darslar_set_updated_at'
  ) THEN
    EXECUTE 'CREATE TRIGGER kurs_darslar_set_updated_at BEFORE UPDATE ON public.kurs_darslar
             FOR EACH ROW EXECUTE FUNCTION public.set_kurs_updated_at()';
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════
-- 9) BACKFILL — 34 modul (DRAFT) yaratish + darslarga modul_id bog'lash
--    Barcha modul draft; bepul=oson; auto-publish YO'Q.
-- ════════════════════════════════════════════════════════════
INSERT INTO public.kurs_modullar (yonalish, bosqich, modul_no, nom, holat, bepul, majburiy, kredit, sort_order)
SELECT d.yonalish, d.bosqich, d.modul_no,
       COALESCE(MAX(d.modul_nom), 'Modul '||d.modul_no),
       'draft',
       CASE WHEN d.bosqich = 'oson' THEN true ELSE false END,
       true, 1, d.modul_no
FROM public.kurs_darslar d
WHERE d.modul_no IS NOT NULL
GROUP BY d.yonalish, d.bosqich, d.modul_no
ON CONFLICT (yonalish, bosqich, modul_no) DO NOTHING;

UPDATE public.kurs_darslar d
SET modul_id = m.id
FROM public.kurs_modullar m
WHERE m.yonalish = d.yonalish AND m.bosqich = d.bosqich AND m.modul_no = d.modul_no
  AND d.modul_id IS DISTINCT FROM m.id;

-- ════════════════════════════════════════════════════════════
-- 10) VERIFIKATSIYA — Run natijasida NOTICE chiqaradi
-- ════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_modul   int;
  v_orphan  int;
  v_draft   int;
  v_bepul   int;
BEGIN
  SELECT count(*) INTO v_modul  FROM public.kurs_modullar;
  SELECT count(*) INTO v_orphan FROM public.kurs_darslar WHERE modul_id IS NULL;
  SELECT count(*) INTO v_draft  FROM public.kurs_modullar WHERE holat = 'draft';
  SELECT count(*) INTO v_bepul  FROM public.kurs_modullar WHERE bepul = true;
  RAISE NOTICE 'kurs_modullar: % (kutilgan 34)', v_modul;
  RAISE NOTICE 'modul_id IS NULL darslar: % (kutilgan 0)', v_orphan;
  RAISE NOTICE 'draft modullar: % (kutilgan 34)', v_draft;
  RAISE NOTICE 'bepul modullar: % (kutilgan 7)', v_bepul;
END $$;
