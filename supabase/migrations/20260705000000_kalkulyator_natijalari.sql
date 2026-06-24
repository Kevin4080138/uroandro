-- Bemorga bog'langan kalkulyator natijalarini saqlash (IPSS, PSA, Prostata hajmi, Spermogramma va b.)
CREATE TABLE public.kalkulyator_natijalari (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bemor_id    uuid NOT NULL REFERENCES public.bemorlar(id) ON DELETE CASCADE,
  doctor_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kalkulyator text NOT NULL,        -- 'ipss' | 'psa' | 'prostata-hajmi' | 'spermogramma' | ...
  sarlavha    text NOT NULL,        -- ko'rsatuvchi nom, masalan "IPSS / AUA-SS"
  xulosa      text NOT NULL,        -- qisqa xulosa matni, masalan "Jami: 14 — o'rtacha simptomlar"
  malumot     jsonb NOT NULL DEFAULT '{}', -- to'liq kiritilgan/hisoblangan qiymatlar
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kalkulyator_natijalari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shifokor o'z natijalarini ko'radi"
  ON public.kalkulyator_natijalari FOR SELECT
  USING (doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Shifokor natija qo'shadi"
  ON public.kalkulyator_natijalari FOR INSERT
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor o'z natijasini o'chiradi"
  ON public.kalkulyator_natijalari FOR DELETE
  USING (doctor_id = auth.uid() OR public.is_admin());

CREATE INDEX kalkulyator_natijalari_bemor_idx ON public.kalkulyator_natijalari (bemor_id, created_at DESC);
