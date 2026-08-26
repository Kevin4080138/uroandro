-- Nashr qilingan tibbiy yangiliklar login qilmagan foydalanuvchilarga ham ochiq bo'lsin.
DROP POLICY IF EXISTS "published_yangiliklarni_oqish" ON public.yangiliklar;

CREATE POLICY "published_yangiliklarni_oqish"
ON public.yangiliklar
FOR SELECT
TO anon, authenticated
USING (status = 'published');
