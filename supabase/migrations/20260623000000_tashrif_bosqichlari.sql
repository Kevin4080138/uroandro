-- Tashrifni bosqichli qabul jarayoniga moslashtirish:
-- yangi (shikoyat/anamnez) -> natija_kiritildi (tekshiruv natijalari + tavsiya) -> yakunlandi (dori/muolaja yozilgan)

ALTER TABLE public.tashriflar
  ADD COLUMN shikoyat text,
  ADD COLUMN anamnez text,
  ADD COLUMN dori_muolaja text,
  ADD COLUMN holat text NOT NULL DEFAULT 'yangi';

-- Mavjud yozuvlar allaqachon klinik natijaga ega bo'lganligi sababli "natija_kiritildi" deb belgilanadi.
UPDATE public.tashriflar SET holat = 'natija_kiritildi' WHERE tavsiya IS NOT NULL;

-- Endi klinik maydonlar (daraja, vena_diametri va h.k.) bosqich davomida to'ldirilishi mumkin,
-- shu sabab ular ixtiyoriy bo'lishi kerak (bemorlar.fio kabi NOT NULL emas).
ALTER TABLE public.tashriflar ALTER COLUMN tomon DROP NOT NULL;
