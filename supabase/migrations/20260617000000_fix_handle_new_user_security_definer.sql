-- Fix "Database error saving new user" during signup.
-- The on_auth_user_created trigger ran handle_new_user() without
-- SECURITY DEFINER, so the insert into profiles was blocked by RLS
-- when executed under the auth signup role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'role'
  );
  RETURN NEW;
END;
$$;
