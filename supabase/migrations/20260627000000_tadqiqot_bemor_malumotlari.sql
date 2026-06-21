-- Klinik qaror moduli endi bemorni to'liq kiritadi (ism, telefon),
-- shu yozuv Bemorlar bazasi va Statistikaga ham asos bo'ladi.
ALTER TABLE public.varikotsele_tadqiqot
  ADD COLUMN fio text,
  ADD COLUMN telefon text;
