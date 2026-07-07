CREATE TABLE IF NOT EXISTS public.bannerlar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sarlavha text NOT NULL,
  tavsif text,
  image_url text,
  link_href text,
  type text NOT NULL DEFAULT 'yangilik', -- yangilik | reklama | elon | bildirishnoma
  target_role text, -- null = hammaga
  rang text DEFAULT '#2563eb', -- gradient uchun asosiy rang (rasm bo'lmasa)
  faol boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bannerlar ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "bannerlar_select" ON public.bannerlar
    FOR SELECT USING (
      faol = true AND (
        target_role IS NULL OR
        target_role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "bannerlar_admin_all" ON public.bannerlar
    FOR ALL USING (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('bannerlar', 'bannerlar', true) ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "bannerlar_storage_select" ON storage.objects FOR SELECT USING (bucket_id = 'bannerlar');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "bannerlar_storage_insert" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'bannerlar' AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "bannerlar_storage_delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'bannerlar' AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
