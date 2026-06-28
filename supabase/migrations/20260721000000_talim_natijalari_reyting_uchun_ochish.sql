-- Reyting (leaderboard) ishlashi uchun talim_natijalari'ni har bir tizimga kirgan
-- foydalanuvchi o'qiy olishi kerak — avvalgi qoida faqat o'z natijasini ko'rishga
-- ruxsat berardi, shu sabab har bir talaba reytingda faqat o'zini ko'rardi.
-- Yozish (INSERT) hamon faqat o'z nomidan bo'ladi — bu o'zgarmaydi.
DROP POLICY IF EXISTS "Talaba o'z natijalarini ko'radi" ON public.talim_natijalari;

CREATE POLICY "Tizimga kirgan har kim natijalarni ko'radi (reyting uchun)"
  ON public.talim_natijalari FOR SELECT
  USING (auth.uid() IS NOT NULL);
