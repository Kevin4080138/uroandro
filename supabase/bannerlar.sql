-- Bannerlar jadvali yaratish
-- Supabase Dashboard > SQL Editor da ishga tushiring

create table if not exists public.bannerlar (
  id           uuid primary key default gen_random_uuid(),
  sarlavha     text not null,
  tavsif       text,
  image_url    text,
  link_href    text,
  type         text not null default 'yangilik',   -- yangilik | reklama | elon | bildirishnoma
  target_role  text,                                -- null = hammaga | student | doctor | patient
  rang         text not null default '#2563eb',
  faol         boolean not null default true,
  sort_order   integer not null default 0,
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- RLS yoqish
alter table public.bannerlar enable row level security;

-- Hamma o'qiy oladi (faol bannerlar)
create policy "Faol bannerlarni hamma ko'ra oladi"
  on public.bannerlar for select
  using (faol = true);

-- Faqat admin yoza oladi
create policy "Admin bannerlarni boshqaradi"
  on public.bannerlar for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Storage bucket (rasm yuklash uchun)
insert into storage.buckets (id, name, public)
values ('bannerlar', 'bannerlar', true)
on conflict (id) do nothing;

-- Storage uchun policy
create policy "Bannerlar rasmini hamma ko'ra oladi"
  on storage.objects for select
  using (bucket_id = 'bannerlar');

create policy "Admin bannerlar rasmini yuklaydi"
  on storage.objects for insert
  with check (
    bucket_id = 'bannerlar' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
