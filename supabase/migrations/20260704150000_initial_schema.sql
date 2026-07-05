-- il mackeria database schema

-- Profiles (admin users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- Menu items
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name_sv text not null,
  name_en text,
  description_sv text not null,
  description_en text,
  temperature text not null check (temperature in ('varm', 'kall')),
  price_full integer not null default 125,
  price_half integer not null default 75,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- News posts
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title_sv text not null,
  title_en text,
  content_sv text not null,
  content_en text,
  excerpt_sv text,
  excerpt_en text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Opening hours
create table if not exists public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null check (day_of_week between 0 and 6),
  label_sv text not null,
  label_en text,
  open_time time,
  close_time time,
  is_closed boolean not null default false,
  note_sv text,
  note_en text,
  sort_order integer not null default 0
);

-- Gallery images
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_sv text,
  alt_en text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Booking requests
create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  requested_date date not null,
  requested_time time not null,
  number_of_guests integer not null,
  booking_type text not null,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'declined')),
  created_at timestamptz not null default now()
);

-- Site settings (key-value)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Admin check helper
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'admin');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.menu_items enable row level security;
alter table public.news_posts enable row level security;
alter table public.opening_hours enable row level security;
alter table public.gallery_images enable row level security;
alter table public.booking_requests enable row level security;
alter table public.site_settings enable row level security;

-- Profiles policies
create policy "Admins can read profiles" on public.profiles
  for select using (public.is_admin());

-- Menu items policies
create policy "Public can read published menu items" on public.menu_items
  for select using (is_published = true);
create policy "Admins full access menu items" on public.menu_items
  for all using (public.is_admin());

-- News posts policies
create policy "Public can read published news" on public.news_posts
  for select using (is_published = true);
create policy "Admins full access news" on public.news_posts
  for all using (public.is_admin());

-- Opening hours policies
create policy "Public can read opening hours" on public.opening_hours
  for select using (true);
create policy "Admins full access opening hours" on public.opening_hours
  for all using (public.is_admin());

-- Gallery policies
create policy "Public can read published gallery" on public.gallery_images
  for select using (is_published = true);
create policy "Admins full access gallery" on public.gallery_images
  for all using (public.is_admin());

-- Booking requests policies
create policy "Anyone can create booking requests" on public.booking_requests
  for insert with check (true);
create policy "Admins can read booking requests" on public.booking_requests
  for select using (public.is_admin());
create policy "Admins can update booking requests" on public.booking_requests
  for update using (public.is_admin());

-- Site settings policies
create policy "Public can read site settings" on public.site_settings
  for select using (true);
create policy "Admins full access site settings" on public.site_settings
  for all using (public.is_admin());

-- Storage bucket for gallery
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "Public can view gallery images" on storage.objects
  for select using (bucket_id = 'gallery');
create policy "Admins can upload gallery images" on storage.objects
  for insert with check (bucket_id = 'gallery' and public.is_admin());
create policy "Admins can update gallery images" on storage.objects
  for update using (bucket_id = 'gallery' and public.is_admin());
create policy "Admins can delete gallery images" on storage.objects
  for delete using (bucket_id = 'gallery' and public.is_admin());

-- Seed data
insert into public.menu_items (name_sv, description_sv, temperature, sort_order) values
  ('Coppa Koster', 'Coppa di Parma, mozzarella, röd pesto, tomat, parmesan, basilikaolja och svartpeppar.', 'varm', 1),
  ('Sopressa Öddö', 'Vitlökssalami, mozzarella, grön pesto, rucola, tomat, parmesan, basilikaolja och svartpeppar.', 'varm', 2),
  ('Mortadella Saltö', 'Mortadella, burrata, machésallad, tomat, pecorino, basilikaolja, pistagenötter och svartpeppar.', 'kall', 3),
  ('Spicy Alaska', 'Salami ventricina, mozzarella, nduja, rucola, pecorino, picklad rödlök och svartpeppar.', 'varm', 4),
  ('Caprese di Bufala', 'Buffelmozzarella, tomat, olivolja, färsk basilika, grön pesto, balsamicoglaze och grovsalt.', 'kall', 5),
  ('Chianino di Capri', 'Salami av chianino oxe, tomat, olivolja, rucola, pecorino, pistagenötter och svartpeppar.', 'kall', 6)
on conflict do nothing;

insert into public.opening_hours (day_of_week, label_sv, label_en, open_time, close_time, note_sv, sort_order) values
  (0, 'Måndag–Söndag', 'Monday–Sunday', '11:00', '19:00', 'Hela sommaren', 1)
on conflict do nothing;

insert into public.site_settings (key, value) values
  ('contact', '{"email": "stellan@mackerian.se", "phone": ""}'::jsonb),
  ('banner', '{"text": null, "enabled": false}'::jsonb)
on conflict (key) do nothing;

insert into public.news_posts (title_sv, content_sv, excerpt_sv, is_published, published_at) values
  ('Välkommen till il mackeria!', 'Vi har öppnat dörrarna på Södra Hamngatan 20 i Strömstad. Kom förbi och prova våra schiacciata – varma och kalla, med fina italienska råvaror.', 'Vi har öppnat dörrarna på Södra Hamngatan 20 i Strömstad.', true, now())
on conflict do nothing;

insert into public.gallery_images (url, alt_sv, sort_order) values
  ('/images/exterior.jpg', 'il mackeria utifrån på Södra Hamngatan', 1),
  ('/images/interior-counter.jpg', 'Disken med deli och schiacciata', 2),
  ('/images/interior-window.jpg', 'Mysig sittplats vid fönstret', 3),
  ('/images/interior-shelves.jpg', 'Italienska produkter på hyllorna', 4)
on conflict do nothing;
