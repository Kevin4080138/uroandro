-- Brauzer push-bildirishnomalari uchun obunalar
CREATE TABLE public.push_obunalari (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint    text NOT NULL UNIQUE,
  p256dh      text NOT NULL,
  auth        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.push_obunalari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Foydalanuvchi o'z obunalarini boshqaradi"
  ON public.push_obunalari FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Cron route uchun service-role orqali o'qish (RLS service role'ni chetlab o'tadi, qo'shimcha policy kerak emas).

-- Har bir dozaga yuborilgan eslatmani belgilash — cron qanchalik tez-tez ishlamasin, takror yubormaslik uchun.
CREATE TABLE public.dori_eslatma_yuborilgan (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retsept_id    uuid NOT NULL REFERENCES public.dori_retseptlari(id) ON DELETE CASCADE,
  sana          date NOT NULL,
  vaqt_tartibi  int NOT NULL,
  yuborilgan_vaqt timestamptz NOT NULL DEFAULT now(),
  UNIQUE (retsept_id, sana, vaqt_tartibi)
);

ALTER TABLE public.dori_eslatma_yuborilgan ENABLE ROW LEVEL SECURITY;
-- Faqat service-role (cron route) yozadi/o'qiydi, oddiy foydalanuvchi uchun policy ochilmaydi.
