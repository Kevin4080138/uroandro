-- ============================================================
-- FOUNDATION MERGE — 35 skelet → 21 asosiy dars
-- Reja: REJA-UROLOGIYA-KONTENT.md §10 (doktor tasdiqi, 2026-09-02)
--
-- Asosiy darslar: SLUG SAQLANADI (qoida — slug o'zgarmaydi); faqat sarlavha,
-- sort_order, daqiqa yangilanadi, faol=true.
-- Birlashgan/arxiv darslar: faol=false — o'chirilmaydi (mazmuni keyin asosiy
-- darsga qo'shiladi; qoralama modulda talabaga ko'rinmaydi).
--
-- IDEMPOTENT: slug bo'yicha UPDATE — qayta Run xavfsiz.
-- Supabase → SQL Editor → butun faylni Run qiling.
-- ============================================================

-- ── 21 ASOSIY DARS (rename + tartib) ──
-- 1-modul: Urologiyaga kirish (5→2)
UPDATE public.kurs_darslar SET sarlavha=$$Urologiya, yo'nalishlari va urolog–nefrolog farqi$$, sort_order=0, daqiqa=12, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$urologiya-nima$$;
UPDATE public.kurs_darslar SET sarlavha=$$Urologik yordam turlari va anatomiyaning klinik ahamiyati$$, sort_order=1, daqiqa=10, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$urologik-davolash-turlari$$;

-- 2-modul: Buyrak anatomiyasi va gistologiyasi (5→3)
UPDATE public.kurs_darslar SET sarlavha=$$Buyrakning tuzilishi va topografiyasi$$, sort_order=0, daqiqa=10, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$buyrak-anatomiyasi$$;
UPDATE public.kurs_darslar SET sarlavha=$$Buyrak qon ta'minoti va klinik ahamiyati$$, sort_order=1, daqiqa=7, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$buyrak-qon-taminoti$$;
UPDATE public.kurs_darslar SET sarlavha=$$Nefronning soddalashtirilgan tuzilishi va vazifasi$$, sort_order=2, daqiqa=10, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$buyrak-gistologiyasi$$;

-- 3-modul: Siydik yo'llari anatomiyasi (4→2; siydik-hosil-bolishi 2-modulga ko'chdi)
UPDATE public.kurs_darslar SET sarlavha=$$Yuqori siydik yo'llari: buyrak jomi va ureter$$, sort_order=0, daqiqa=7, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$ureter-anatomiyasi$$;
UPDATE public.kurs_darslar SET sarlavha=$$Pastki siydik yo'llari: siydik pufagi va uretra$$, sort_order=1, daqiqa=10, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$siydik-pufagi-anatomiyasi$$;

-- 4-modul: Siydik chiqarish fiziologiyasi (5→2)
UPDATE public.kurs_darslar SET sarlavha=$$Siydik pufagining to'lishi va saqlash fazasi$$, sort_order=0, daqiqa=10, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$mikturitsiya-nima$$;
UPDATE public.kurs_darslar SET sarlavha=$$Siyish refleksi, bo'shatish fazasi va sog'lom siyish$$, sort_order=1, daqiqa=12, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$siyish-refleksi$$;

-- 5-modul: Erkak reproduktiv tizimi (7→4)
UPDATE public.kurs_darslar SET sarlavha=$$Moyak, epididimis va urug' yo'llari$$, sort_order=0, daqiqa=10, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$moyak-anatomiyasi$$;
UPDATE public.kurs_darslar SET sarlavha=$$Spermatogenez va gormonal boshqaruv asoslari$$, sort_order=1, daqiqa=10, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$spermatogenez$$;
UPDATE public.kurs_darslar SET sarlavha=$$Prostata, urug' pufakchalari va yordamchi bezlar$$, sort_order=2, daqiqa=10, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$prostata-asoslari$$;
UPDATE public.kurs_darslar SET sarlavha=$$Jinsiy olat anatomiyasi$$, sort_order=3, daqiqa=7, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$jinsiy-olat-anatomiyasi$$;

-- 6-modul: Urologik bemorni tekshirish (5→4; fizik-korik 14 va 15 ga bo'linadi)
UPDATE public.kurs_darslar SET sarlavha=$$Urologik anamnez va umumiy fizik ko'rik$$, sort_order=0, daqiqa=9, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$urologik-anamnez$$;
UPDATE public.kurs_darslar SET sarlavha=$$Mahalliy urologik ko'rik va DRE$$, sort_order=1, daqiqa=9, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$dre-asoslari$$;
UPDATE public.kurs_darslar SET sarlavha=$$Asosiy laborator tekshiruvlarni tanlash$$, sort_order=2, daqiqa=7, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$urologik-laborator-tekshiruvlar$$;
UPDATE public.kurs_darslar SET sarlavha=$$Urologik tasviriy tekshiruvlarni tanlash$$, sort_order=3, daqiqa=7, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$urologik-tasvirlash-kirish$$;

-- 7-modul: Urologik simptomlar (4→4; birlashish yo'q, faqat sarlavha sayqali)
UPDATE public.kurs_darslar SET sarlavha=$$Siyish bilan bog'liq simptomlar$$, sort_order=0, daqiqa=7, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$siydik-simptomlari$$;
UPDATE public.kurs_darslar SET sarlavha=$$Siydikdagi patologik o'zgarishlar$$, sort_order=1, daqiqa=7, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$siydik-patologik-ozgarishlari$$;
UPDATE public.kurs_darslar SET sarlavha=$$Urologik og'riq$$, sort_order=2, daqiqa=7, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$urologik-ogriq$$;
UPDATE public.kurs_darslar SET sarlavha=$$Erkak jinsiy simptomlari$$, sort_order=3, daqiqa=6, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$erkak-jinsiy-simptomlar$$;

-- ── 14 BIRLASHGAN/ARXIV DARS (faol=false) ──
UPDATE public.kurs_darslar SET faol=false, updated_at=now()
WHERE yonalish='urologiya' AND slug IN (
  $$urologiya-yonalishlari$$, $$urolog-nefrolog-farqi$$,   -- → 1-dars
  $$urologik-anatomiya-ahamiyat$$,                          -- → 2-dars
  $$buyrak-topografiyasi$$,                                 -- → 3-dars
  $$siydik-hosil-bolishi$$,                                 -- → 5-dars
  $$juxtaglomerular-apparat$$,                              -- arxiv (JGA — Foundation'dan olindi)
  $$uretra-anatomiyasi$$,                                   -- → 7-dars
  $$pufak-tolishi$$,                                        -- → 8-dars
  $$siyish-nerv-boshqaruvi$$, $$soglom-siyish$$,            -- → 9-dars
  $$epididimis-vas-deferens$$,                              -- → 10-dars
  $$testosteron-fiziologiyasi$$,                            -- → 11-dars
  $$urug-pufakchalari$$,                                    -- → 12-dars
  $$urologik-fizik-korik$$                                  -- 14 va 15 ga bo'lindi
);

-- ── VERIFIKATSIYA ──
DO $$
DECLARE v_faol int; v_arxiv int;
BEGIN
  SELECT count(*) INTO v_faol  FROM public.kurs_darslar WHERE yonalish='urologiya' AND bosqich='oson' AND faol=true;
  SELECT count(*) INTO v_arxiv FROM public.kurs_darslar WHERE yonalish='urologiya' AND bosqich='oson' AND faol=false;
  RAISE NOTICE 'Foundation faol darslar: % (kutilgan 21)', v_faol;
  RAISE NOTICE 'Foundation arxiv darslar: % (kutilgan 14)', v_arxiv;
END $$;
