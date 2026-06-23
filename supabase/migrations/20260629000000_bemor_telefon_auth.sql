-- Bemorlar uchun telefon+parol orqali kirish: profiles jadvaliga telefon
-- ustuni qo'shiladi va ro'yxatdan o'tish triggeri shu ma'lumotni saqlaydi.
ALTER TABLE public.profiles
  ADD COLUMN telefon text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role, telefon)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'telefon'
  );
  RETURN NEW;
END;
$$;
