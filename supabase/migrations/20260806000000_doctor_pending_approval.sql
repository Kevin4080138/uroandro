-- Shifokor ro'yxatdan o'tishi uchun qo'shimcha maydonlar va kutish holati

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS mutaxassislik text,
  ADD COLUMN IF NOT EXISTS ish_joyi text,
  -- 'kutish' | 'tasdiqlandi' | 'rad_etildi' | NULL
  ADD COLUMN IF NOT EXISTS doctor_holati text;

-- handle_new_user yangilandi:
-- doctor ro'yxatdan o'tsa → student sifatida saqlanadi + doctor_holati='kutish'
-- Admin tasdiqlasa → role='doctor', doctor_holati='tasdiqlandi'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_doctor_holati text;
BEGIN
  IF NEW.raw_user_meta_data->>'role' = 'patient' THEN
    v_role := 'patient';
    v_doctor_holati := NULL;
  ELSIF NEW.raw_user_meta_data->>'role' = 'doctor' THEN
    v_role := 'student';
    v_doctor_holati := 'kutish';
  ELSE
    v_role := 'student';
    v_doctor_holati := NULL;
  END IF;

  INSERT INTO profiles (id, full_name, role, email, telefon, mutaxassislik, ish_joyi, doctor_holati)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    v_role,
    NEW.email,
    NEW.raw_user_meta_data->>'telefon',
    NEW.raw_user_meta_data->>'mutaxassislik',
    NEW.raw_user_meta_data->>'ish_joyi',
    v_doctor_holati
  );
  RETURN NEW;
END;
$$;

-- Admin shifokorni tasdiqlaganda: role='doctor', doctor_holati='tasdiqlandi'
-- Bu trigger orqali namuna bemor avtomatik qo'shiladi (mavjud trigger saqlanadi)
