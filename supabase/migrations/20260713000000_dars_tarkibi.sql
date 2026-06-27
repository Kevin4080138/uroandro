-- Dars tarkibi (nazariya HTML, video, konspekt, test banklari) — kodda emas, bazada saqlanadi.
-- Sabab: bu tarkib (ayniqsa HTML/test banklari) hajmi katta bo'lib, agar darslar.ts ichida
-- saqlansa, har bir dars sahifasi BARCHA darslarning tarkibini client bundle'ga yuklaydi.
-- Bazada saqlash — faqat so'ralgan darsning tarkibi yuklanadi va kelajakda admin panel orqali
-- tahrirlash imkonini ham ochib beradi.
CREATE TABLE public.dars_tarkibi (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dars_slug               text NOT NULL UNIQUE,
  nazariya_html           text,
  video_linklar           jsonb NOT NULL DEFAULT '[]'::jsonb,
  konspekt_url            text,
  prezentatsiya_url       text,
  savollar_banki          jsonb NOT NULL DEFAULT '[]'::jsonb,
  usmle_savollar          jsonb NOT NULL DEFAULT '[]'::jsonb,
  nazorat_savollar        jsonb NOT NULL DEFAULT '[]'::jsonb,
  nazorat_savol_soni      int NOT NULL DEFAULT 20,
  nazorat_vaqt_daqiqa     int NOT NULL DEFAULT 15,
  sertifikat_otish_foizi  int NOT NULL DEFAULT 70,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dars_tarkibi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tizimga kirgan har bir foydalanuvchi tarkibni ko'radi"
  ON public.dars_tarkibi FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin tarkibni boshqaradi"
  ON public.dars_tarkibi FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE INDEX dars_tarkibi_slug_idx ON public.dars_tarkibi (dars_slug);
