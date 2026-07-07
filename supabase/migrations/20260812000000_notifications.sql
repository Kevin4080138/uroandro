CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL DEFAULT 'info', -- info | success | warning | urgent
  target_role text, -- null = hammaga, yoki 'student' | 'doctor' | 'patient'
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_reads (
  notification_id uuid NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (notification_id, user_id)
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Foydalanuvchilar o'z roli uchun bildirishnomalarni ko'ra oladi
DO $$ BEGIN
  CREATE POLICY "notifications_select" ON public.notifications
    FOR SELECT USING (
      target_role IS NULL OR
      target_role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Adminlar yarata oladi
DO $$ BEGIN
  CREATE POLICY "notifications_insert_admin" ON public.notifications
    FOR INSERT WITH CHECK (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- O'qilganlarni saqlash
DO $$ BEGIN
  CREATE POLICY "notification_reads_insert" ON public.notification_reads
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "notification_reads_select" ON public.notification_reads
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
