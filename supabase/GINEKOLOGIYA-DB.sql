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

-- Kelajakda (Bosqich 2) ginekologiya kontenti uchun SQL shu yerga qo'shiladi.
