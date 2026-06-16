-- Fix "infinite recursion detected in policy for relation profiles".
-- The "Admin hammani ko'radi" policy queried the profiles table from
-- within its own USING clause, which re-triggers RLS evaluation on
-- every row check. Move the role check into a SECURITY DEFINER
-- function so it bypasses RLS instead of recursing into it.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

ALTER POLICY "Admin hammani ko'radi"
ON public.profiles
USING (public.is_admin());
