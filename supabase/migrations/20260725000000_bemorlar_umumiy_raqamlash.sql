-- Oldingi migratsiyada bemorlar tartib raqami har bir shifokor uchun
-- alohida (1, 2, 3...) qilib o'zgartirilgan edi. Bu bekor qilinadi —
-- raqam yana umumiy (global) ketma-ketlik bo'lib qoladi, faqat KO'RISH
-- huquqi (RLS) o'zgarishsiz qoladi: shifokor hali ham faqat o'z
-- bemorlarini ko'radi, admin esa barchasini ko'radi.

DROP TRIGGER IF EXISTS bemor_shifokor_raqami_trigger ON public.bemorlar;
DROP FUNCTION IF EXISTS public.bemor_shifokor_raqami();

-- Mavjud yozuvlarni globalcha (qo'shilgan vaqti bo'yicha) qayta raqamlaymiz.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) + 1000 AS rn
  FROM public.bemorlar
)
UPDATE public.bemorlar b SET raqam = r.rn FROM ranked r WHERE b.id = r.id;

CREATE SEQUENCE IF NOT EXISTS public.bemor_raqam_seq;
SELECT setval('public.bemor_raqam_seq', (SELECT COALESCE(MAX(raqam), 1000) FROM public.bemorlar));

ALTER TABLE public.bemorlar ALTER COLUMN raqam SET DEFAULT nextval('public.bemor_raqam_seq');
