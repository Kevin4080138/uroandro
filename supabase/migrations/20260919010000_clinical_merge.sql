-- ============================================================
-- CLINICAL MERGE — 42 skelet → 36 asosiy dars (KLINIK MANTIQ)
-- Faqat BIR kasallik ichidagi qismlar birlashtiriladi; turli kasalliklar
-- (sistit, pielonefrit, uretrit, AUR, gematuriya, travma turlari, bolalar
-- patologiyalari) ALOHIDA qoladi — klinik xavfsizlik.
--
-- Asosiy: slug SAQLANADI, sarlavha+tartib+daqiqa yangilanadi, faol=true.
-- Birlashgan: faol=false (arxiv) — mazmuni keyin asosiyga qo'shiladi.
-- IDEMPOTENT (slug bo'yicha UPDATE). SQL Editor'da Run qiling.
-- ============================================================

-- 8-modul: SYI (5→5, faqat sayqal)
UPDATE public.kurs_darslar SET sarlavha=$$UTI tasnifi va klinik yondashuv$$, sort_order=0, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$uti-asoslari$$;
UPDATE public.kurs_darslar SET sarlavha=$$Sistit$$, sort_order=1, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$sistit$$;
UPDATE public.kurs_darslar SET sarlavha=$$Uretrit$$, sort_order=2, daqiqa=13, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$uretrit$$;
UPDATE public.kurs_darslar SET sarlavha=$$Pielonefrit$$, sort_order=3, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$pielonefrit$$;
UPDATE public.kurs_darslar SET sarlavha=$$UTI diagnostikasi, davolash va murakkab UTI$$, sort_order=4, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$uti-diagnostika-davolash$$;

-- 9-modul: Urolitiaz (6→4)
UPDATE public.kurs_darslar SET sarlavha=$$Buyrak toshlari: turlari va hosil bo'lish mexanizmi$$, sort_order=0, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$siydik-toshi-turlari$$;
UPDATE public.kurs_darslar SET sarlavha=$$Buyrak sanchig'i (renal kolika) va klinika$$, sort_order=1, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$renal-kolika$$;
UPDATE public.kurs_darslar SET sarlavha=$$Tosh diagnostikasi$$, sort_order=2, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$tosh-diagnostika$$;
UPDATE public.kurs_darslar SET sarlavha=$$Tosh davolash va profilaktika$$, sort_order=3, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$tosh-davolash-asoslari$$;

-- 10-modul: BPH (4→3)
UPDATE public.kurs_darslar SET sarlavha=$$BPH: etiologiya, patofiziologiya va LUTS$$, sort_order=0, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$bph-etiologiya$$;
UPDATE public.kurs_darslar SET sarlavha=$$BPH diagnostikasi (IPSS, PSA, uroflow, PVR)$$, sort_order=1, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$bph-diagnostika$$;
UPDATE public.kurs_darslar SET sarlavha=$$BPH davolash prinsiplari$$, sort_order=2, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$bph-davolash$$;

-- 11-modul: Prostatit (4→3; umumiy dx/davolash o'tkir va surunkaliga qo'shiladi)
UPDATE public.kurs_darslar SET sarlavha=$$O'tkir bakterial prostatit: klinika, diagnostika, davolash$$, sort_order=0, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$otkir-bakterial-prostatit$$;
UPDATE public.kurs_darslar SET sarlavha=$$Surunkali prostatit va CPPS: klinika, diagnostika, davolash$$, sort_order=1, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$surunkali-prostatit$$;
UPDATE public.kurs_darslar SET sarlavha=$$Prostatit, BPH va prostata saratoni: differensial$$, sort_order=2, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$prostatit-bph-ca-differensial$$;

-- 12-modul: LUTS va tutolmaslik (3→2)
UPDATE public.kurs_darslar SET sarlavha=$$LUTS va siydik tutolmaslik turlari$$, sort_order=0, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$luts-tasnifi$$;
UPDATE public.kurs_darslar SET sarlavha=$$Tutolmaslik diagnostikasi va davolash$$, sort_order=1, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$tutolmaslik-diagnostika-davolash$$;

-- 13-modul: Siydik tutilishi (3→3; AUR alohida)
UPDATE public.kurs_darslar SET sarlavha=$$O'tkir siydik tutilishi (AUR)$$, sort_order=0, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$otkir-siydik-tutilishi$$;
UPDATE public.kurs_darslar SET sarlavha=$$Surunkali siydik tutilishi$$, sort_order=1, daqiqa=13, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$surunkali-siydik-tutilishi$$;
UPDATE public.kurs_darslar SET sarlavha=$$Kateterizatsiya asoslari$$, sort_order=2, daqiqa=13, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$kateterizatsiya-asoslari$$;

-- 14-modul: Torayishlar (2→2)
UPDATE public.kurs_darslar SET sarlavha=$$Uretra torayishi (stricture)$$, sort_order=0, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$uretra-torayishi$$;
UPDATE public.kurs_darslar SET sarlavha=$$Ureter obstruksiyasi$$, sort_order=1, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$ureter-obstruksiyasi$$;

-- 15-modul: Jinsiy disfunksiya (3→2)
UPDATE public.kurs_darslar SET sarlavha=$$Erektil disfunksiya: sabab, diagnostika va davolash$$, sort_order=0, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$erektil-disfunksiya$$;
UPDATE public.kurs_darslar SET sarlavha=$$Ejakulyatsiya buzilishlari$$, sort_order=1, daqiqa=13, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$ejakulyatsiya-buzilishlari$$;

-- 16-modul: Scrotal (3→3)
UPDATE public.kurs_darslar SET sarlavha=$$Varikotsele$$, sort_order=0, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$varikotsele$$;
UPDATE public.kurs_darslar SET sarlavha=$$Gidrotsele$$, sort_order=1, daqiqa=13, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$gidrotsele$$;
UPDATE public.kurs_darslar SET sarlavha=$$Epididimit va orxit$$, sort_order=2, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$epididimit-orxit$$;

-- 17-modul: Gematuriya (2→2; alohida)
UPDATE public.kurs_darslar SET sarlavha=$$Gematuriya: gross va mikroskopik$$, sort_order=0, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$gematuriya-turlari$$;
UPDATE public.kurs_darslar SET sarlavha=$$Gematuriya: diagnostik algoritm$$, sort_order=1, daqiqa=15, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$gematuriya-algoritm$$;

-- 18-modul: Travma (3→3)
UPDATE public.kurs_darslar SET sarlavha=$$Buyrak travmasi$$, sort_order=0, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$buyrak-travmasi$$;
UPDATE public.kurs_darslar SET sarlavha=$$Ureter va siydik pufagi travmasi$$, sort_order=1, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$ureter-pufak-travmasi$$;
UPDATE public.kurs_darslar SET sarlavha=$$Uretra va tashqi jinsiy a'zolar travmasi$$, sort_order=2, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$uretra-genital-travma$$;

-- 19-modul: Bolalar (4→4)
UPDATE public.kurs_darslar SET sarlavha=$$Kriptorxizm$$, sort_order=0, daqiqa=13, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$kriptorxizm-kirish$$;
UPDATE public.kurs_darslar SET sarlavha=$$Gipospadiya$$, sort_order=1, daqiqa=13, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$gipospadiya-kirish$$;
UPDATE public.kurs_darslar SET sarlavha=$$Fimoz$$, sort_order=2, daqiqa=12, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$fimoz-kirish$$;
UPDATE public.kurs_darslar SET sarlavha=$$VUR va gidronefroz$$, sort_order=3, daqiqa=14, faol=true, updated_at=now() WHERE yonalish='urologiya' AND slug=$$vur-gidronefroz-kirish$$;

-- ── 6 BIRLASHGAN/ARXIV DARS (faol=false) ──
UPDATE public.kurs_darslar SET faol=false, updated_at=now()
WHERE yonalish='urologiya' AND slug IN (
  $$tosh-hosil-mexanizmi$$,            -- → tosh turlari
  $$tosh-profilaktika$$,               -- → tosh davolash
  $$bph-luts$$,                        -- → BPH etiologiya
  $$prostatit-diagnostika-davolash$$,  -- → o'tkir va surunkali prostatit
  $$siydik-tutolmaslik-turlari$$,      -- → LUTS turlari
  $$ed-diagnostika-davolash$$          -- → erektil disfunksiya
);

-- ── VERIFIKATSIYA ──
DO $$
DECLARE v_faol int; v_arxiv int;
BEGIN
  SELECT count(*) INTO v_faol  FROM public.kurs_darslar WHERE yonalish='urologiya' AND bosqich='orta' AND faol=true;
  SELECT count(*) INTO v_arxiv FROM public.kurs_darslar WHERE yonalish='urologiya' AND bosqich='orta' AND faol=false;
  RAISE NOTICE 'Clinical faol darslar: % (kutilgan 36)', v_faol;
  RAISE NOTICE 'Clinical arxiv darslar: % (kutilgan 6)', v_arxiv;
END $$;
