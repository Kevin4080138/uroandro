-- Kutubxona: PDF materiallarni yuklash va ro'yxatga olish.

INSERT INTO storage.buckets (id, name, public)
VALUES ('kutubxona', 'kutubxona', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Kutubxona fayllarini hamma ko'radi"
ON storage.objects FOR SELECT
USING (bucket_id = 'kutubxona');

CREATE POLICY "Shifokor kutubxonaga fayl yuklaydi"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'kutubxona' AND auth.uid() IS NOT NULL);

CREATE POLICY "Shifokor o'z faylini o'chiradi"
ON storage.objects FOR DELETE
USING (bucket_id = 'kutubxona' AND owner = auth.uid());

CREATE TABLE public.kutubxona_fayllar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nom         text NOT NULL,
  izoh        text,
  file_path   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kutubxona_fayllar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hamma kutubxona yozuvlarini ko'radi"
ON public.kutubxona_fayllar FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Shifokor kutubxonaga yozuv qo'shadi"
ON public.kutubxona_fayllar FOR INSERT
WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Shifokor o'z yozuvini o'chiradi"
ON public.kutubxona_fayllar FOR DELETE
USING (doctor_id = auth.uid() OR public.is_admin());
