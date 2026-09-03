-- ############################################################
-- ##  STAGING/TEST ONLY — PRODUCTION'DA RUN QILMANG          ##
-- ##  ------------------------------------------------------  ##
-- ##  Bu fayl Faza 4.1 migratsiyasini ALOHIDA staging/dev    ##
-- ##  Supabase loyihasida sinash uchun MINIMAL bog'liqliklarni ##
-- ##  tayyorlaydi. Production bazada ishlatilsa — soxta test  ##
-- ##  profillarini va profiles stub'ini kiritib qo'yadi.     ##
-- ##  supabase/migrations/ GA QO'YMANG. CLI qo'llamaydi.     ##
-- ############################################################
--
-- Bootstrap NIMANI tayyorlaydi (read-only tahlil asosida — taxmin emas):
--   • profiles STUB — dependency migratsiyalarda FAQAT `id` (FK nishoni) va
--     `role` (is_admin) ishlatiladi. Boshqa ustunlar (full_name, email, jins…)
--     bu testlar uchun KERAK EMAS — minimal sxema.
--   • public.is_admin() — 20260617010000 dan (faqat funksiya; o'sha migratsiyaning
--     ALTER POLICY qismi bu yerda YO'Q, chunki u prod policy'ga tayanadi).
--   • 2 ta soxta test profili (admin + talaba) — qat'iy belgilangan UUID.
--
-- Bootstrap NIMANI QILMAYDI:
--   • kurs_darslar / kurs_natijalar / 126 seed — bular MAVJUD migratsiya
--     fayllaridan qo'llanadi (nusxa ko'chirilmaydi — yagona manba):
--       1) supabase/migrations/20260916000000_kurs_darslar_3level.sql
--       2) supabase/migrations/20260916010000_kurs_darslar_urologiya_skelet.sql
--   • Faza 4.1 asosiy migratsiyasi bu faylga NUSXALANMAGAN — alohida oqim.
--
-- TO'LIQ ISHLATISH KETMA-KETLIGI (staging SQL Editor'da, birma-bir):
--   [1] BU fayl (bootstrap)
--   [2] 20260916000000_kurs_darslar_3level.sql
--   [3] 20260916010000_kurs_darslar_urologiya_skelet.sql
--   [4] 20260918100000_kurs_modul_arxitektura.sql        (asosiy migratsiya)
--   [5] 20260918100000_kurs_modul_tekshiruv.sql          (assert: A sanoq + B constraint)
--   [6] urologiya_faza4_rls_tekshiruv.sql                (RLS talaba/admin sessiyalari)
--   [7] 20260918100000_kurs_modul_arxitektura_rollback.sql
--   [8] Rollback tekshiruvi: eski kurs_darslar_select policy tiklandimi
--   [9] Toza qayta qo'llash: [2]→[6] qayta (idempotentlik)
--
-- Qayta ishlatish xavfsiz: IF NOT EXISTS / ON CONFLICT / DROP…IF EXISTS.
-- ============================================================

-- ── Qat'iy belgilangan SOXTA test UUID'lari (haqiqiy foydalanuvchi EMAS) ──
--   admin  : aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa
--   talaba : bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb

-- ── 1) profiles STUB (minimal: id + role) ──
-- DIQQAT: bu test stub — prod profiles'da auth.users(id) ga FK va boshqa
-- ustunlar bor. Bu yerda faqat testga zarur ustunlar.
CREATE TABLE IF NOT EXISTS public.profiles (
  id    uuid PRIMARY KEY,
  role  text
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ── 2) is_admin() — SECURITY DEFINER (recursiyasiz), 20260617010000 nusxasi ──
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- profiles SELECT policy — is_admin() orqali (recursiyasiz), prod niyatiga mos
DROP POLICY IF EXISTS "profiles_stub_select" ON public.profiles;
CREATE POLICY "profiles_stub_select" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin());

-- ── 3) Soxta test profillari (idempotent) ──
INSERT INTO public.profiles (id, role) VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'admin'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'student')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;

-- ── Xabar ──
DO $$
BEGIN
  RAISE NOTICE 'BOOTSTRAP OK: profiles stub + is_admin() + 2 test profili tayyor.';
  RAISE NOTICE 'Keyingi: [2] kurs_darslar_3level → [3] skelet → [4] asosiy migratsiya.';
END $$;
