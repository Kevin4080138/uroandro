-- ============================================================
-- TEKSHIRUV — 20260918100000_kurs_modul_arxitektura.sql
--
-- Migratsiya Run qilingandan KEYIN bu faylni Supabase → SQL Editor da
-- Run qiling. Hammasi o'tsa oxirida "HAMMA TEKSHIRUV O'TDI" chiqadi;
-- birortasi yiqilsa RAISE EXCEPTION bilan to'xtaydi.
-- ASSERT ishlatilmaydi (check_asserts=off da jim o'tishi mumkin) — IF/RAISE.
--
-- A qism — o'qish (read-only): sanoq va katalog invariantlari.
-- B qism — salbiy testlar (RESTRICT / nashr CHECK): TRANZAKSIYA ichida,
--          oxirida ROLLBACK — hech narsa o'zgarmaydi.
-- ============================================================

-- ── A) READ-ONLY TEKSHIRUVLAR (explicit IF/RAISE — ASSERT emas) ──
-- ASSERT ishlatilmaydi: plpgsql.check_asserts=off bo'lsa jim o'tib, testlar
-- yolg'on yashil ko'rinishi mumkin. IF NOT (...) THEN RAISE EXCEPTION doim ishlaydi.
DO $$
BEGIN
  IF NOT ((SELECT count(*) FROM public.kurs_modullar WHERE yonalish='urologiya') = 34) THEN
    RAISE EXCEPTION '34 modul kutilgan (topildi: %)', (SELECT count(*) FROM public.kurs_modullar WHERE yonalish='urologiya'); END IF;
  IF NOT ((SELECT count(*) FROM public.kurs_darslar WHERE yonalish='urologiya' AND modul_no IS NOT NULL AND modul_id IS NULL) = 0) THEN
    RAISE EXCEPTION 'modul_id IS NULL bo''lmasin (topildi: %)', (SELECT count(*) FROM public.kurs_darslar WHERE yonalish='urologiya' AND modul_no IS NOT NULL AND modul_id IS NULL); END IF;
  IF NOT ((SELECT count(*) FROM public.kurs_modullar WHERE yonalish='urologiya' AND holat = 'draft') = 34) THEN
    RAISE EXCEPTION 'hammasi draft bo''lishi kerak (draft: %)', (SELECT count(*) FROM public.kurs_modullar WHERE yonalish='urologiya' AND holat = 'draft'); END IF;
  IF NOT ((SELECT count(*) FROM public.kurs_modullar WHERE yonalish='urologiya' AND bepul = true) = 7) THEN
    RAISE EXCEPTION '7 bepul (oson) modul kutilgan (topildi: %)', (SELECT count(*) FROM public.kurs_modullar WHERE yonalish='urologiya' AND bepul = true); END IF;
  IF NOT ((SELECT count(*) FROM public.kurs_modullar WHERE yonalish='urologiya' AND holat = 'nashr') = 0) THEN
    RAISE EXCEPTION 'auto-publish yo''q bo''lishi kerak (nashr: %)', (SELECT count(*) FROM public.kurs_modullar WHERE yonalish='urologiya' AND holat = 'nashr'); END IF;

  -- Katalog: constraint/policy/index mavjudligi
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kurs_modullar_nashr_bloki') THEN
    RAISE EXCEPTION 'nashr_bloki CHECK topilmadi'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kurs_darslar_modul_fk') THEN
    RAISE EXCEPTION 'kurs_darslar_modul_fk topilmadi'; END IF;
  IF NOT ((SELECT confdeltype FROM pg_constraint WHERE conname = 'kurs_darslar_modul_fk') = 'r') THEN
    RAISE EXCEPTION 'FK ON DELETE RESTRICT bo''lishi kerak (confdeltype: %)', (SELECT confdeltype FROM pg_constraint WHERE conname = 'kurs_darslar_modul_fk'); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kurs_savollar_bogliq_chk') THEN
    RAISE EXCEPTION 'savol eksklyuziv CHECK topilmadi'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kurs_darslar' AND policyname = 'kurs_darslar_select') THEN
    RAISE EXCEPTION 'kurs_darslar_select policy topilmadi'; END IF;
  IF NOT ((SELECT count(*) FROM pg_policies WHERE tablename = 'kurs_savollar') = 1) THEN
    RAISE EXCEPTION 'kurs_savollar faqat admin policy bo''lishi kerak (policy soni: %)', (SELECT count(*) FROM pg_policies WHERE tablename = 'kurs_savollar'); END IF;
  IF NOT ((SELECT count(*) FROM pg_policies WHERE tablename = 'kurs_caselar') = 1) THEN
    RAISE EXCEPTION 'kurs_caselar faqat admin policy bo''lishi kerak (policy soni: %)', (SELECT count(*) FROM pg_policies WHERE tablename = 'kurs_caselar'); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'kurs_urinishlar_ochiq_test_uniq') THEN
    RAISE EXCEPTION 'ochiq test partial unique topilmadi'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'kurs_urinishlar_ochiq_case_uniq') THEN
    RAISE EXCEPTION 'ochiq case partial unique topilmadi'; END IF;

  RAISE NOTICE 'A qism: READ-ONLY tekshiruvlar OK';
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
