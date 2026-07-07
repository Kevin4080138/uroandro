-- Profil rasmi uchun avatar_url ustuni
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Avatarlar uchun public storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatarlar', 'avatarlar', true)
ON CONFLICT (id) DO NOTHING;

-- Har kim o'z avatarini yuklashi mumkin
DO $$ BEGIN
  CREATE POLICY "Avatar yuklash"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatarlar' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Hamma ko'ra oladi (public bucket)
DO $$ BEGIN
  CREATE POLICY "Avatar ko'rish"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatarlar');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Faqat o'zi o'zgartira/o'chira oladi
DO $$ BEGIN
  CREATE POLICY "Avatar yangilash"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatarlar' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Avatar o'chirish"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatarlar' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
