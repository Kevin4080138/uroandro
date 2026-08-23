-- ============================================================
-- GINEKOLOGIYA KENGAYTIRISH — BARCHA DB O'ZGARISHLARI (bitta fayl)
-- Supabase → SQL Editor → butun faylni Run qiling. Qayta Run qilsa ham xatosiz.
-- ============================================================

-- ── Bosqich 0: profiles ga jins va yo'nalish ──
-- Ikkalasi ham CHEKLAMAYDI — faqat birinchi ko'rinishni moslaydi.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS jins     text,   -- 'ayol' | 'erkak'  (asosan bemor)
  ADD COLUMN IF NOT EXISTS yonalish text;   -- 'urologiya' | 'ginekologiya' (asosan talaba)

-- ── Bosqich 1: darslar ro'yxati kodda (darslar.ts) — SQL kerak emas.
--    Ginekologiya darslari kontenti keyin qo'shilganda, dars_tarkibi ga
--    odatdagidek (dars_slug bo'yicha) yoziladi. Alohida ustun shart emas.

-- ── Bosqich 2: ginekologiya darslari (admin panel orqali, deploy'siz) ──
-- Izolyatsiya qilingan modul — urologiya darslar dvigatelига tegmaydi.
-- Ginekolog admin paneldan dars qo'shadi/tahrirlaydi, talaba ko'radi.
CREATE TABLE IF NOT EXISTS public.gin_darslar (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  sarlavha      text NOT NULL,
  kategoriya    text,
  bosqich       text NOT NULL DEFAULT 'oson',   -- 'oson' | 'orta' | 'qiyin'
  qisqa         text,
  nazariya_html text,
  daqiqa        int NOT NULL DEFAULT 10,
  sort_order    int NOT NULL DEFAULT 0,
  faol          boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gin_darslar ENABLE ROW LEVEL SECURITY;

-- O'qish: tizimga kirgan har kim faol darslarni ko'radi
DROP POLICY IF EXISTS "gin_darslar_select" ON public.gin_darslar;
CREATE POLICY "gin_darslar_select" ON public.gin_darslar
  FOR SELECT USING (auth.uid() IS NOT NULL AND faol = true);

-- Boshqarish: faqat admin
DROP POLICY IF EXISTS "gin_darslar_admin" ON public.gin_darslar;
CREATE POLICY "gin_darslar_admin" ON public.gin_darslar
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS gin_darslar_bosqich_idx ON public.gin_darslar (bosqich);
