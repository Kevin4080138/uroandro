-- ============================================================
-- SUPABASE SQL RUNNER — kutilayotgan migratsiya
-- Joylashtirish: SQL Editor > New query > Ctrl+A > Run
--
-- 2026-07-20: bildirishnoma tizimi (uchta jadval + trigger)
-- Manba: supabase/migrations/20260829000000_bildirishnoma_tizimi.sql
-- ============================================================

-- Bildirishnoma tizimi: sozlamalar, yuborilganlar jurnali va takrorlash rejasi.
--
-- Muammo: bot orqali kuniga bir nechta xabar kelsa, foydalanuvchi botni
-- o'chiradi — keyin muhim xabar ham yetib bormaydi. Shuning uchun uchta
-- himoya qatlami:
--   1. sozlamalar   — foydalanuvchi turini o'zi yoqib-o'chiradi
--   2. jurnal       — bir xil eslatma ikki marta ketmaydi (idempotentlik)
--   3. kunlik cheklov — "turtki" turidagi xabarlar kuniga bittadan oshmaydi
--
-- Sana hisoblari Toshkent vaqti bo'yicha: UTC'da kechqurun yuborilgan xabar
-- ertangi kunga tegishli bo'lib qolmasligi kerak.

-- ── 1. Foydalanuvchi sozlamalari ────────────────────────────────────────────
CREATE TABLE public.bildirishnoma_sozlamalari (
  user_id     uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  navbat      boolean NOT NULL DEFAULT true,  -- navbat eslatmasi (bemor va shifokor)
  dori        boolean NOT NULL DEFAULT true,  -- dori ichish vaqti
  operatsiya  boolean NOT NULL DEFAULT true,  -- operatsiyadan keyingi bosqichlar
  seriya      boolean NOT NULL DEFAULT true,  -- kunlik seriya xavf ostida
  takrorlash  boolean NOT NULL DEFAULT true,  -- flashcard takrorlash vaqti
  yarim_dars  boolean NOT NULL DEFAULT true,  -- tugallanmagan dars turtkisi
  murojaat    boolean NOT NULL DEFAULT true,  -- murojaat bilan bog'liq xabarlar
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bildirishnoma_sozlamalari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "O'z sozlamasini ko'radi"
  ON public.bildirishnoma_sozlamalari FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "O'z sozlamasini yaratadi"
  ON public.bildirishnoma_sozlamalari FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "O'z sozlamasini o'zgartiradi"
  ON public.bildirishnoma_sozlamalari FOR UPDATE
  USING (user_id = auth.uid());

-- ── 2. Yuborilganlar jurnali ────────────────────────────────────────────────
-- Cron bir kunda bir necha marta ishga tushsa ham (qayta urinish, qo'lda
-- chaqirish) bir xil eslatma takrorlanmaydi — UNIQUE kalit shuni ta'minlaydi.
CREATE TABLE public.bildirishnoma_yuborilgan (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  turi       text NOT NULL,                  -- 'navbat' | 'takrorlash' | 'yarim_dars' | ...
  manba_id   text NOT NULL DEFAULT '',       -- navbat id / dars slug / sana
  sana       date NOT NULL,                  -- Toshkent kuni
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, turi, manba_id, sana)
);

CREATE INDEX bildirishnoma_yuborilgan_user_sana_idx
  ON public.bildirishnoma_yuborilgan (user_id, sana);

ALTER TABLE public.bildirishnoma_yuborilgan ENABLE ROW LEVEL SECURITY;

-- Yozuvni faqat server (service role) qo'shadi — RLS'ni chetlab o'tadi.
-- Foydalanuvchiga policy berilmaydi; admin ko'ra oladi.
CREATE POLICY "Admin jurnalni ko'radi"
  ON public.bildirishnoma_yuborilgan FOR SELECT
  USING (public.is_admin());

-- ── 3. Flashcard takrorlash rejasi ──────────────────────────────────────────
-- Intervalli takrorlash (spaced repetition): dars flashcardlari birinchi marta
-- ko'rilgach 1, 3, 7 va 30-kunlarda takrorlashga chaqiriladi. Har chaqiruvdan
-- keyin bosqich oshadi; to'rttasi tugagach reja yopiladi.
CREATE TABLE public.takrorlash_rejasi (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dars_slug    text NOT NULL,
  bosqich      int  NOT NULL DEFAULT 0,      -- 0,1,2,3 → 1, 3, 7, 30 kun
  keyingi_sana date NOT NULL,
  tugadi       boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, dars_slug)
);

CREATE INDEX takrorlash_rejasi_sana_idx
  ON public.takrorlash_rejasi (keyingi_sana) WHERE tugadi = false;

ALTER TABLE public.takrorlash_rejasi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talaba o'z rejasini ko'radi"
  ON public.takrorlash_rejasi FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

-- Yozish faqat trigger va server orqali — talaba rejani o'zgartira olmaydi.

-- ── 4. Flashcard qadami yakunlanganda reja ochiladi ─────────────────────────
CREATE OR REPLACE FUNCTION public.takrorlash_rejasini_boshla()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.qadam <> 'flashcard' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.takrorlash_rejasi (student_id, dars_slug, bosqich, keyingi_sana)
  VALUES (
    NEW.student_id,
    NEW.dars_slug,
    0,
    ((now() AT TIME ZONE 'Asia/Tashkent')::date + 1)
  )
  ON CONFLICT (student_id, dars_slug) DO NOTHING;  -- qayta ko'rsa reja tiklanmaydi

  RETURN NEW;
END;
$$;

CREATE TRIGGER dars_qadam_flashcard_takrorlash
  AFTER INSERT ON public.dars_qadam_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.takrorlash_rejasini_boshla();
