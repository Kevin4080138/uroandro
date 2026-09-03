-- ############################################################
-- ##  STAGING/TEST ONLY — PRODUCTION'DA RUN QILMANG          ##
-- ##  RLS sessiya-testlari (talaba/admin JWT simulyatsiyasi) ##
-- ############################################################
--
-- OLDIN bajarilgan bo'lsin: bootstrap → 3level → skelet → asosiy migratsiya
-- (20260918100000). Bu fayl migratsiyadan KEYIN Run qilinadi.
--
-- Har test ALOHIDA tranzaksiyada (BEGIN…ROLLBACK): hech narsa saqlanmaydi,
-- role/JWT claim bir testdan boshqasiga SIZMAYDI. Talaba va admin — alohida
-- tranzaksiyalar. auth.uid() simulyatsiyasi request.jwt claim'lari orqali.
--
-- ASSERT ishlatilmaydi (plpgsql.check_asserts=off da jim o'tishi mumkin) —
-- barcha tekshiruv explicit IF NOT (...) THEN RAISE EXCEPTION.
--
-- Soxta UUID'lar (bootstrap bilan bir xil):
--   admin  : aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa
--   talaba : bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb
-- ============================================================


-- ══════════════════════════════════════════════════════════
-- G0 — PREFLIGHT: authenticated kerakli GRANT'larga egami?
--   Agar yo'q bo'lsa, RLS testlari "yashil" bo'lishi RLS sabab EMAS,
--   balki jadval GRANT yo'qligi sabab bo'lardi. Shuni oldini olamiz.
-- ══════════════════════════════════════════════════════════
DO $$
BEGIN
  IF NOT has_table_privilege('authenticated','public.kurs_darslar','SELECT') THEN
    RAISE EXCEPTION 'PREFLIGHT: authenticated kurs_darslar SELECT grantga ega emas — Supabase default grantlari yo''q; RLS testlari noaniq'; END IF;
  IF NOT has_table_privilege('authenticated','public.kurs_savollar','SELECT') THEN
    RAISE EXCEPTION 'PREFLIGHT: authenticated kurs_savollar SELECT grantga ega emas'; END IF;
  IF NOT has_table_privilege('authenticated','public.kurs_caselar','SELECT') THEN
    RAISE EXCEPTION 'PREFLIGHT: authenticated kurs_caselar SELECT grantga ega emas'; END IF;
  IF NOT has_table_privilege('authenticated','public.kurs_progress','INSERT') THEN
    RAISE EXCEPTION 'PREFLIGHT: authenticated kurs_progress INSERT grantga ega emas — R5 RLS testi noaniq'; END IF;
  IF NOT has_table_privilege('authenticated','public.kurs_urinishlar','INSERT') THEN
    RAISE EXCEPTION 'PREFLIGHT: authenticated kurs_urinishlar INSERT grantga ega emas'; END IF;
  RAISE NOTICE 'G0 PREFLIGHT OK: authenticated kerakli GRANT''larga ega — denial RLS sabab bo''ladi';
END $$;


-- ══════════════════════════════════════════════════════════
-- R1 — TALABA draft darslarni KO'RMAYDI
-- ══════════════════════════════════════════════════════════
BEGIN;
  SELECT set_config('request.jwt.claims',
    json_build_object('sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','role','authenticated')::text, true);
  SELECT set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', true);
  SET LOCAL ROLE authenticated;
  DO $$
  DECLARE n int := (SELECT count(*) FROM public.kurs_darslar);
  BEGIN
    IF NOT (n = 0) THEN
      RAISE EXCEPTION 'R1 XATO: talaba draft modul darslarini ko''rdi (topildi: %)', n; END IF;
    RAISE NOTICE 'R1 OK: talaba 0 dars ko''radi (hamma modul draft)';
  END $$;
ROLLBACK;


-- ══════════════════════════════════════════════════════════
-- R2 — ADMIN barcha darslarni KO'RADI (draft bo'lsa ham)
-- ══════════════════════════════════════════════════════════
BEGIN;
  SELECT set_config('request.jwt.claims',
    json_build_object('sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','role','authenticated')::text, true);
  SELECT set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true);
  SET LOCAL ROLE authenticated;
  DO $$
  DECLARE n int := (SELECT count(*) FROM public.kurs_darslar);
  BEGIN
    IF NOT (n = 126) THEN
      RAISE EXCEPTION 'R2 XATO: admin 126 dars ko''rmadi (topildi: %)', n; END IF;
    RAISE NOTICE 'R2 OK: admin 126 dars ko''radi (is_admin bypass)';
  END $$;
ROLLBACK;


-- ══════════════════════════════════════════════════════════
-- R3 — Foundation (oson) modulini NASHR qilish MUMKIN, va shundan
--      keyin talaba o'sha modul darslarini ko'radi (uchidan-uchiga)
-- ══════════════════════════════════════════════════════════
BEGIN;
  -- (postgres) oson 1-modulni nashr qilish — CHECK ruxsat berishi kerak
  UPDATE public.kurs_modullar SET holat = 'nashr' WHERE bosqich = 'oson' AND modul_no = 1;
  -- talaba sifatida shu modul darslari ko'rinadimi
  SELECT set_config('request.jwt.claims',
    json_build_object('sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','role','authenticated')::text, true);
  SELECT set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', true);
  SET LOCAL ROLE authenticated;
  DO $$
  DECLARE n int;
  BEGIN
    SELECT count(*) INTO n
    FROM public.kurs_darslar d
    JOIN public.kurs_modullar m ON m.id = d.modul_id
    WHERE m.bosqich = 'oson' AND m.modul_no = 1;
    IF NOT (n > 0) THEN
      RAISE EXCEPTION 'R3 XATO: Foundation nashridan keyin ham talaba darsni ko''rmadi'; END IF;
    RAISE NOTICE 'R3 OK: Foundation nashr → talaba % ta dars ko''rdi', n;
  END $$;
ROLLBACK;   -- nashr holati saqlanmaydi


-- ══════════════════════════════════════════════════════════
-- R4 — TALABA savol `togri` va case JSON ni KO'RMAYDI (admin-only)
-- ══════════════════════════════════════════════════════════
BEGIN;
  -- (postgres) sinov uchun 1 tezkor savol + 1 case seed
  INSERT INTO public.kurs_savollar (tur, dars_id, savol, variantlar, togri)
    SELECT 'tezkor', d.id, 'Sinov savoli', '["A","B"]'::jsonb, 1
    FROM public.kurs_darslar d LIMIT 1;
  INSERT INTO public.kurs_caselar (modul_id, sarlavha, bosqichlar)
    SELECT m.id, 'Sinov case', '[{"togri":0}]'::jsonb
    FROM public.kurs_modullar m LIMIT 1;
  -- talaba sifatida
  SELECT set_config('request.jwt.claims',
    json_build_object('sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','role','authenticated')::text, true);
  SELECT set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', true);
  SET LOCAL ROLE authenticated;
  DO $$
  DECLARE ns int := (SELECT count(*) FROM public.kurs_savollar);
          nc int := (SELECT count(*) FROM public.kurs_caselar);
  BEGIN
    IF NOT (ns = 0) THEN
      RAISE EXCEPTION 'R4 XATO: talaba kurs_savollar (togri) ni ko''rdi (topildi: %)', ns; END IF;
    IF NOT (nc = 0) THEN
      RAISE EXCEPTION 'R4 XATO: talaba kurs_caselar (JSON) ni ko''rdi (topildi: %)', nc; END IF;
    RAISE NOTICE 'R4 OK: savol togri va case JSON talabaga RLS bilan yopiq';
  END $$;
ROLLBACK;   -- seed saqlanmaydi


-- ══════════════════════════════════════════════════════════
-- R5 — TALABA kurs_progress / kurs_urinishlar ga YOZA OLMAYDI
--   MUHIM: denial aynan RLS sabab (GRANT bor) ekanini tekshiramiz —
--   has_table_privilege + xato xabarida 'row-level security'.
-- ══════════════════════════════════════════════════════════
BEGIN;
  -- (postgres) haqiqiy id'larni tranzaksiya-lokal settingga saqlash
  SELECT set_config('test.dars_id',  (SELECT id::text FROM public.kurs_darslar  LIMIT 1), true);
  SELECT set_config('test.modul_id', (SELECT id::text FROM public.kurs_modullar LIMIT 1), true);
  SELECT set_config('request.jwt.claims',
    json_build_object('sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','role','authenticated')::text, true);
  SELECT set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', true);
  SET LOCAL ROLE authenticated;
  DO $$
  DECLARE
    did uuid := current_setting('test.dars_id')::uuid;
    mid uuid := current_setting('test.modul_id')::uuid;
    sid uuid := current_setting('request.jwt.claim.sub')::uuid;
  BEGIN
    -- GRANT bor (aks holda denial GRANT sabab bo'lardi, RLS emas)
    IF NOT has_table_privilege('authenticated','public.kurs_progress','INSERT') THEN
      RAISE EXCEPTION 'R5 SHART: authenticated kurs_progress INSERT grantga ega emas — test noaniq'; END IF;
    IF NOT has_table_privilege('authenticated','public.kurs_urinishlar','INSERT') THEN
      RAISE EXCEPTION 'R5 SHART: authenticated kurs_urinishlar INSERT grantga ega emas — test noaniq'; END IF;

    -- kurs_progress — GRANT bor, lekin INSERT policy yo'q → RLS rad etadi
    BEGIN
      INSERT INTO public.kurs_progress (student_id, dars_id, korildi) VALUES (sid, did, true);
      RAISE EXCEPTION 'R5a XATO: talaba kurs_progress ga yozdi — RLS ishlamadi';
    EXCEPTION WHEN insufficient_privilege THEN
      IF position('row-level security' in lower(SQLERRM)) = 0 THEN
        RAISE EXCEPTION 'R5a XATO: denial RLS sabab emas (xabar: %)', SQLERRM; END IF;
      RAISE NOTICE 'R5a OK: kurs_progress RLS policy yo''qligi sabab rad etildi';
    END;

    -- kurs_urinishlar — xuddi shunday
    BEGIN
      INSERT INTO public.kurs_urinishlar (student_id, modul_id, tur) VALUES (sid, mid, 'test');
      RAISE EXCEPTION 'R5b XATO: talaba kurs_urinishlar ga yozdi — RLS ishlamadi';
    EXCEPTION WHEN insufficient_privilege THEN
      IF position('row-level security' in lower(SQLERRM)) = 0 THEN
        RAISE EXCEPTION 'R5b XATO: denial RLS sabab emas (xabar: %)', SQLERRM; END IF;
      RAISE NOTICE 'R5b OK: kurs_urinishlar RLS policy yo''qligi sabab rad etildi';
    END;
  END $$;
ROLLBACK;


-- ── Yakuniy xabar ──
DO $$ BEGIN RAISE NOTICE 'RLS TEKSHIRUVI TUGADI — G0 + R1..R5 (har biri alohida tranzaksiyada)'; END $$;
