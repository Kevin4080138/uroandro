-- Admin paneldagi nozik amallarni (foydalanuvchi tahrirlash/o'chirish, rol
-- o'zgartirish) qayd qilish uchun audit log. Admin sessiyasi o'g'irlansa
-- yoki xato yuz bersa, nima o'zgartirilgani ko'rinib turadi.

CREATE TABLE public.admin_audit_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id        uuid REFERENCES public.profiles(id),
  amal            text NOT NULL,
  maqsad_user_id  uuid,
  tafsilot        jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin audit logni ko'radi"
ON public.admin_audit_log FOR SELECT
USING (public.is_admin());

-- Rol o'zgarishi (eng nozik amal) qayerdan amalga oshirilishidan qat'i nazar
-- avtomatik qayd qilinadi.
CREATE OR REPLACE FUNCTION public.log_rol_ozgarishi()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    INSERT INTO public.admin_audit_log (admin_id, amal, maqsad_user_id, tafsilot)
    VALUES (auth.uid(), 'rol_ozgartirish', NEW.id, jsonb_build_object('eski_rol', OLD.role, 'yangi_rol', NEW.role));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;
CREATE TRIGGER on_profile_role_change
AFTER UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.log_rol_ozgarishi();
