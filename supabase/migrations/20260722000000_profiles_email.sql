-- Email'ni profiles jadvalida saqlash — admin panelda email ko'rsatish uchun
-- Supabase Admin API (SERVICE_ROLE_KEY)ga bog'liqlikni olib tashlaymiz, chunki
-- u sozlanmagan/ishlamagan holatlarda hamma email "—" bo'lib qolardi.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Mavjud foydalanuvchilarni auth.users'dan bir martalik to'ldirish.
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE u.id = p.id AND p.email IS NULL;

-- Yangi ro'yxatdan o'tishda email avtomatik profiles'ga yozilsin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'role',
    NEW.email
  );
  RETURN NEW;
END;
$$;
