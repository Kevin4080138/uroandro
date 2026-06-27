-- Dars materiallari (konspekt/prezentatsiya) uchun YOPIQ (private) bucket.
-- 'kutubxona' bucket'idan farqli — bu yerga yuklangan fayllar ochiq link orqali
-- olinmaydi, faqat tizimga kirgan foydalanuvchi uchun vaqtinchalik (signed) havola
-- generatsiya qilinadi, shu bilan to'g'ridan-to'g'ri yuklab olish/ulashishni qiyinlashtiradi.
INSERT INTO storage.buckets (id, name, public)
VALUES ('dars-materiallari', 'dars-materiallari', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Tizimga kirgan foydalanuvchi vaqtinchalik havola ola oladi"
ON storage.objects FOR SELECT
USING (bucket_id = 'dars-materiallari' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin dars materiallarini yuklaydi"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dars-materiallari' AND public.is_admin());

CREATE POLICY "Admin dars materiallarini o'chiradi"
ON storage.objects FOR DELETE
USING (bucket_id = 'dars-materiallari' AND public.is_admin());
