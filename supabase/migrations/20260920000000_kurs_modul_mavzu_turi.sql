-- ════════════════════════════════════════════════════════════
-- Kurs modul — mavzu turi + bo'lim adaptiv nazorati
--   `mavzu_turi`     : anatomiya/fiziologiya/simptom/diagnostika/kasallik/
--                      dori/jarrohlik/shoshilinch/profilaktika (NULL = filtrsiz)
--   `bolim_override` : admin qo'lda yoqib/o'chirgan bo'limlar
--                      { flashcard|test|usmle|case : true|false }
--                      kalit yo'q → avtomatik (matritsa + bosqich qoidasi)
-- Idempotent. RLS o'zgarmaydi. Talaba markazida ko'rinadigan bo'limlar =
-- (matritsa tavsiyasi, override bilan ustma-ust) ∩ (bank bo'sh emas).
-- ════════════════════════════════════════════════════════════

ALTER TABLE public.kurs_modullar ADD COLUMN IF NOT EXISTS mavzu_turi text;
ALTER TABLE public.kurs_modullar ADD COLUMN IF NOT EXISTS bolim_override jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Ma'lum turlar bilan cheklaymiz (NULL ham ruxsat — filtrsiz)
ALTER TABLE public.kurs_modullar DROP CONSTRAINT IF EXISTS kurs_modullar_mavzu_turi_chk;
ALTER TABLE public.kurs_modullar ADD  CONSTRAINT kurs_modullar_mavzu_turi_chk
  CHECK (mavzu_turi IS NULL OR mavzu_turi IN (
    'anatomiya','fiziologiya','simptom','diagnostika','kasallik',
    'dori','jarrohlik','shoshilinch','profilaktika'
  ));
