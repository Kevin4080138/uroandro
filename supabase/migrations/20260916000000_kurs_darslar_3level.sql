-- ============================================================
-- KURS_DARSLAR — 3-Level modul tizimi (umumiy dvigatel)
-- Urologiyani Foundation/Clinical/Advanced modul modeliga o'tkazish.
-- Ginekologiya (gin_darslar) umumlashtiriladi: qo'shimcha `yonalish` va
-- `modul` qatlami. Andrologiya/akusherlik ham keyin shu jadvalga tushadi.
--
-- Supabase → SQL Editor → butun faylni Run qiling. Qayta Run qilsa ham xatosiz.
-- Reja: REJA-UROLOGIYA-3LEVEL.md
-- ============================================================

-- ── Darslar jadvali ──
-- gin_darslar sxemasidan farqi: yonalish + modul_no + modul_nom.
CREATE TABLE IF NOT EXISTS public.kurs_darslar (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  yonalish      text NOT NULL DEFAULT 'urologiya',  -- 'urologiya' | 'ginekologiya' | 'andrologiya'…
  bosqich       text NOT NULL DEFAULT 'oson',       -- 'oson' | 'orta' | 'qiyin'  (Level 1/2/3)
  modul_no      int  NOT NULL DEFAULT 1,            -- modul tartibi (akkordeon guruhi)
  modul_nom     text,                                -- 'Urologiyaga kirish'
  slug          text NOT NULL UNIQUE,
  sarlavha      text NOT NULL,
  kategoriya    text,
  qisqa         text,
  nazariya_html text,
  video_url     text,
  daqiqa        int  NOT NULL DEFAULT 10,
  sort_order    int  NOT NULL DEFAULT 0,            -- modul ICHIDAGI dars tartibi
  bolim         text NOT NULL DEFAULT 'darslar',    -- 'darslar' | 'klassifikatsiyalar' | 'operativ'
  test_savollar jsonb NOT NULL DEFAULT '[]'::jsonb,
  faol          boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kurs_darslar ENABLE ROW LEVEL SECURITY;

-- O'qish: tizimga kirgan har kim faol darslarni ko'radi
DROP POLICY IF EXISTS "kurs_darslar_select" ON public.kurs_darslar;
CREATE POLICY "kurs_darslar_select" ON public.kurs_darslar
  FOR SELECT USING (auth.uid() IS NOT NULL AND faol = true);

-- Boshqarish: faqat admin
DROP POLICY IF EXISTS "kurs_darslar_admin" ON public.kurs_darslar;
CREATE POLICY "kurs_darslar_admin" ON public.kurs_darslar
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS kurs_darslar_yonalish_bosqich_idx ON public.kurs_darslar (yonalish, bosqich);
CREATE INDEX IF NOT EXISTS kurs_darslar_modul_idx ON public.kurs_darslar (yonalish, bosqich, modul_no, sort_order);
CREATE INDEX IF NOT EXISTS kurs_darslar_bolim_idx ON public.kurs_darslar (yonalish, bolim);

-- ── Natijalar (test) — yo'nalishga qarab reyting/progress ──
CREATE TABLE IF NOT EXISTS public.kurs_natijalar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  yonalish    text NOT NULL DEFAULT 'urologiya',
  dars_slug   text NOT NULL,
  ball        int  NOT NULL,   -- to'g'ri javoblar soni
  jami        int  NOT NULL,   -- jami savol
  foiz        int  NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, dars_slug)   -- slug global unique bo'lgani uchun yetarli
);

ALTER TABLE public.kurs_natijalar ENABLE ROW LEVEL SECURITY;

-- O'qish: reyting uchun tizimga kirgan hamma ko'radi
DROP POLICY IF EXISTS "kurs_natijalar_select" ON public.kurs_natijalar;
CREATE POLICY "kurs_natijalar_select" ON public.kurs_natijalar
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Yozish: faqat o'z natijasini
DROP POLICY IF EXISTS "kurs_natijalar_insert" ON public.kurs_natijalar;
CREATE POLICY "kurs_natijalar_insert" ON public.kurs_natijalar
  FOR INSERT WITH CHECK (student_id = auth.uid());
DROP POLICY IF EXISTS "kurs_natijalar_update" ON public.kurs_natijalar;
CREATE POLICY "kurs_natijalar_update" ON public.kurs_natijalar
  FOR UPDATE USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

CREATE INDEX IF NOT EXISTS kurs_natijalar_student_idx ON public.kurs_natijalar (student_id, yonalish);
