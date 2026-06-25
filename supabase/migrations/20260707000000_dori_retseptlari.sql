-- Shifokor yozgan dori retseptlarini bemor ilovasida ko'rsatish va qabul qilish eslatmalari uchun.
CREATE TABLE public.dori_retseptlari (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tashrif_id         uuid REFERENCES public.tashriflar(id) ON DELETE CASCADE,
  bemor_id           uuid REFERENCES public.bemorlar(id) ON DELETE CASCADE,
  bemor_user_id      uuid REFERENCES public.profiles(id) ON DELETE CASCADE, -- telefon orqali topilgan bemor hisobi (bo'lsa)
  doctor_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nomi               text NOT NULL,
  dozasi             text,
  kuniga_marta       int NOT NULL DEFAULT 1,
  muddat_kun         int NOT NULL DEFAULT 7,
  boshlanish_sanasi  date NOT NULL DEFAULT current_date,
  izoh               text,
  faol               boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dori_retseptlari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shifokor o'z retseptlarini ko'radi, bemor o'zinikini ko'radi"
  ON public.dori_retseptlari FOR SELECT
  USING (doctor_id = auth.uid() OR bemor_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor retsept yozadi"
  ON public.dori_retseptlari FOR INSERT
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor retseptni tahrirlaydi/o'chiradi"
  ON public.dori_retseptlari FOR UPDATE
  USING (doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor retseptni o'chiradi"
  ON public.dori_retseptlari FOR DELETE
  USING (doctor_id = auth.uid() OR public.is_admin());

CREATE INDEX dori_retseptlari_bemor_user_idx ON public.dori_retseptlari (bemor_user_id, faol);

-- Bemorning har bir dozani qabul qilgani haqida belgisi.
CREATE TABLE public.dori_qabullari (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retsept_id      uuid NOT NULL REFERENCES public.dori_retseptlari(id) ON DELETE CASCADE,
  bemor_user_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sana            date NOT NULL,
  vaqt_tartibi    int NOT NULL, -- kuniga nechanchi doza (1, 2, 3...)
  qabul_vaqti     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (retsept_id, sana, vaqt_tartibi)
);

ALTER TABLE public.dori_qabullari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bemor o'z qabullarini ko'radi"
  ON public.dori_qabullari FOR SELECT
  USING (bemor_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Bemor qabul belgisini qo'shadi"
  ON public.dori_qabullari FOR INSERT
  WITH CHECK (bemor_user_id = auth.uid());

CREATE POLICY "Bemor o'z belgisini o'chiradi"
  ON public.dori_qabullari FOR DELETE
  USING (bemor_user_id = auth.uid());
