-- Admin panel kengaytmasi: FAQ, sayt kontenti (Biz haqimizda), tariflar,
-- push broadcast tarixi. Hammasi admin tomonidan boshqariladi.

-- 1) Savol-javoblar (FAQ)
CREATE TABLE public.faq (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  savol       text NOT NULL,
  javob       text NOT NULL,
  tartib      int NOT NULL DEFAULT 0,
  faol        boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faol FAQ hammaga ko'rinadi"
ON public.faq FOR SELECT
USING (faol OR public.is_admin());

CREATE POLICY "Admin FAQ boshqaradi"
ON public.faq FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 2) Sayt kontenti — kalit-qiymat (Biz haqimizda va kelajakdagi statik matnlar)
CREATE TABLE public.sayt_kontenti (
  kalit       text PRIMARY KEY,
  qiymat      jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sayt_kontenti ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kontent hammaga ko'rinadi"
ON public.sayt_kontenti FOR SELECT
USING (true);

CREATE POLICY "Admin kontentni boshqaradi"
ON public.sayt_kontenti FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3) Tariflar — bosqichlar narxi (talaba tomonda ko'rsatiladi, obuna berishda ishlatiladi)
CREATE TABLE public.tariflar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bosqich     text NOT NULL CHECK (bosqich IN ('oson', 'o''rta', 'qiyin')),
  nom         text NOT NULL,
  narx        bigint NOT NULL,          -- so'mda
  muddat_oy   int,                      -- NULL = muddatsiz
  tavsif      text,
  faol        boolean NOT NULL DEFAULT true,
  tartib      int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tariflar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faol tariflar hammaga ko'rinadi"
ON public.tariflar FOR SELECT
USING (faol OR public.is_admin());

CREATE POLICY "Admin tariflarni boshqaradi"
ON public.tariflar FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4) Push broadcast tarixi
CREATE TABLE public.push_xabarlar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  body        text NOT NULL,
  url         text,
  auditoriya  text NOT NULL DEFAULT 'hammasi',  -- 'hammasi' / 'student' / 'doctor' / 'patient'
  yuborildi   int NOT NULL DEFAULT 0,           -- nechta qurilmaga yetib bordi
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.push_xabarlar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin push tarixini ko'radi va yozadi"
ON public.push_xabarlar FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
