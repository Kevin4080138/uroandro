-- ============================================================
-- TEKSHIRUV / ASSERT — 20260918000000_kurs_modul_arxitektura.sql
--
-- Migratsiya Run qilingandan KEYIN bu faylni Supabase → SQL Editor da
-- Run qiling. Barcha ASSERT o'tsa oxirida "HAMMA TEKSHIRUV O'TDI" chiqadi;
-- birortasi yiqilsa RAISE EXCEPTION bilan to'xtaydi.
--
-- A qism — o'qish (read-only): sanoq va katalog invariantlari.
-- B qism — salbiy testlar (RESTRICT / nashr CHECK): TRANZAKSIYA ichida,
--          oxirida ROLLBACK — hech narsa o'zgarmaydi.
-- ============================================================

-- ── A) READ-ONLY ASSERTLAR ──
DO $$
DECLARE n int;
BEGIN
  ASSERT (SELECT count(*) FROM public.kurs_modullar) = 34, '34 modul kutilgan';
  ASSERT (SELECT count(*) FROM public.kurs_darslar WHERE modul_id IS NULL) = 0, 'modul_id IS NULL bo''lmasin';
  ASSERT (SELECT count(*) FROM public.kurs_modullar WHERE holat = 'draft') = 34, 'hammasi draft';
  ASSERT (SELECT count(*) FROM public.kurs_modullar WHERE bepul = true) = 7, '7 bepul (oson) modul';
  ASSERT (SELECT count(*) FROM public.kurs_modullar WHERE holat = 'nashr') = 0, 'auto-publish yo''q';

  -- Katalog: constraint/policy/index mavjudligi
  ASSERT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kurs_modullar_nashr_bloki'), 'nashr_bloki CHECK bor';
  ASSERT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kurs_darslar_modul_fk'), 'modul_fk (RESTRICT) bor';
  ASSERT (SELECT confdeltype FROM pg_constraint WHERE conname = 'kurs_darslar_modul_fk') = 'r', 'FK ON DELETE RESTRICT bo''lsin';
  ASSERT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kurs_savollar_bogliq_chk'), 'savol eksklyuziv CHECK bor';
  ASSERT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kurs_darslar' AND policyname = 'kurs_darslar_select'), 'kurs_darslar_select policy bor';
  ASSERT (SELECT count(*) FROM pg_policies WHERE tablename = 'kurs_savollar') = 1, 'kurs_savollar faqat admin policy (SELECT public yo''q)';
  ASSERT (SELECT count(*) FROM pg_policies WHERE tablename = 'kurs_caselar') = 1, 'kurs_caselar faqat admin policy';
  ASSERT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'kurs_urinishlar_ochiq_test_uniq'), 'ochiq test partial unique bor';
  ASSERT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'kurs_urinishlar_ochiq_case_uniq'), 'ochiq case partial unique bor';

  RAISE NOTICE 'A qism: READ-ONLY assertlar OK';
END $$;

-- ── B) SALBIY TESTLAR — tranzaksiya ichida, oxirida ROLLBACK ──
BEGIN;

-- B1) orta/qiyin modulni nashr qilish → CHECK rad etishi kerak
DO $$
BEGIN
  UPDATE public.kurs_modullar SET holat = 'nashr'
  WHERE bosqich = 'orta' AND modul_no = 8;   -- L2 modul
  RAISE EXCEPTION 'XATO: orta modul nashr qilindi — CHECK ishlamadi';
EXCEPTION
  WHEN check_violation THEN
    RAISE NOTICE 'B1 OK: orta modul nashri DB CHECK bilan rad etildi';
END $$;

-- B2) darsi bor modulni DELETE → RESTRICT rad etishi kerak
DO $$
DECLARE mid uuid;
BEGIN
  SELECT modul_id INTO mid FROM public.kurs_darslar WHERE modul_id IS NOT NULL LIMIT 1;
  DELETE FROM public.kurs_modullar WHERE id = mid;
  RAISE EXCEPTION 'XATO: darsi bor modul o''chirildi — RESTRICT ishlamadi';
EXCEPTION
  WHEN foreign_key_violation THEN
    RAISE NOTICE 'B2 OK: darsi bor modul DELETE RESTRICT bilan rad etildi';
END $$;

-- B3) progress invariant: tugatdim=true, tezkor_togri<2 → CHECK rad etishi kerak
DO $$
DECLARE sid uuid; did uuid;
BEGIN
  SELECT id INTO sid FROM public.profiles LIMIT 1;
  SELECT id INTO did FROM public.kurs_darslar LIMIT 1;
  IF sid IS NULL OR did IS NULL THEN
    RAISE NOTICE 'B3 SKIP: profiles/kurs_darslar bo''sh';
  ELSE
    INSERT INTO public.kurs_progress (student_id, dars_id, korildi, tugatdim, tezkor_togri, tezkor_jami)
    VALUES (sid, did, true, true, 1, 3);
    RAISE EXCEPTION 'XATO: tugatdim=true, togri=1 kiritildi — CHECK ishlamadi';
  END IF;
EXCEPTION
  WHEN check_violation THEN
    RAISE NOTICE 'B3 OK: tugatdim>=2/3 invariant DB CHECK bilan himoyalangan';
END $$;

ROLLBACK;   -- B qism hech narsani o'zgartirmaydi

-- ── Yakuniy xabar ──
DO $$ BEGIN RAISE NOTICE 'HAMMA TEKSHIRUV O''TDI (A read-only + B salbiy testlar)'; END $$;
