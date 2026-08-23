-- Ginekologiya kengaytirish — Bosqich 0
-- profiles ga ikki ustun: jins (bemor) va yonalish (talaba).
-- Ikkalasi ham CHEKLAMAYDI — faqat birinchi ko'rinishni moslaydi.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS jins     text,   -- 'ayol' | 'erkak'  (asosan bemor)
  ADD COLUMN IF NOT EXISTS yonalish text;   -- 'urologiya' | 'ginekologiya' (asosan talaba)
