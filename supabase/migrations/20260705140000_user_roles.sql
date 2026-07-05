-- Three account types: admin, editor, viewer

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'editor', 'viewer'));

alter table public.profiles
  alter column role set default 'viewer';

-- Panel access helpers
create or replace function public.is_panel_user()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor', 'viewer')
      and is_active = true
  );
$$;

create or replace function public.can_edit_content()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
      and is_active = true
  );
$$;

-- is_admin() already requires admin + is_active from prior migration

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer');
  return new;
end;
$$;

-- Profiles: panel users can read all profiles (for listing), admins can update
drop policy if exists "Admins can read profiles" on public.profiles;
create policy "Panel users can read profiles" on public.profiles
  for select using (public.is_panel_user());

-- Menu items
drop policy if exists "Admins full access menu items" on public.menu_items;
create policy "Panel users read menu items" on public.menu_items
  for select using (public.is_panel_user());
create policy "Editors manage menu items" on public.menu_items
  for all using (public.can_edit_content());

-- News posts
drop policy if exists "Admins full access news" on public.news_posts;
create policy "Panel users read news posts" on public.news_posts
  for select using (public.is_panel_user());
create policy "Editors manage news posts" on public.news_posts
  for all using (public.can_edit_content());

-- Opening hours
drop policy if exists "Admins full access opening hours" on public.opening_hours;
create policy "Panel users read opening hours" on public.opening_hours
  for select using (public.is_panel_user());
create policy "Editors manage opening hours" on public.opening_hours
  for all using (public.can_edit_content());

-- Gallery images
drop policy if exists "Admins full access gallery" on public.gallery_images;
create policy "Panel users read gallery images" on public.gallery_images
  for select using (public.is_panel_user());
create policy "Editors manage gallery images" on public.gallery_images
  for all using (public.can_edit_content());

-- Booking requests
drop policy if exists "Admins can read booking requests" on public.booking_requests;
drop policy if exists "Admins can update booking requests" on public.booking_requests;
create policy "Panel users read booking requests" on public.booking_requests
  for select using (public.is_panel_user());
create policy "Editors update booking requests" on public.booking_requests
  for update using (public.can_edit_content());

-- Site settings (write admin only)
drop policy if exists "Admins full access site settings" on public.site_settings;
create policy "Panel users read site settings" on public.site_settings
  for select using (public.is_panel_user());
create policy "Admins manage site settings" on public.site_settings
  for all using (public.is_admin());

-- Pages
drop policy if exists "Admins full access pages" on public.pages;
create policy "Panel users read pages" on public.pages
  for select using (public.is_panel_user());
create policy "Editors manage pages" on public.pages
  for all using (public.can_edit_content());

-- Page sections
drop policy if exists "Admins full access page sections" on public.page_sections;
create policy "Panel users read page sections" on public.page_sections
  for select using (public.is_panel_user());
create policy "Editors manage page sections" on public.page_sections
  for all using (public.can_edit_content());

-- Storage
drop policy if exists "Admins can upload gallery images" on storage.objects;
drop policy if exists "Admins can update gallery images" on storage.objects;
drop policy if exists "Admins can delete gallery images" on storage.objects;
create policy "Editors can upload gallery images" on storage.objects
  for insert with check (bucket_id = 'gallery' and public.can_edit_content());
create policy "Editors can update gallery images" on storage.objects
  for update using (bucket_id = 'gallery' and public.can_edit_content());
create policy "Editors can delete gallery images" on storage.objects
  for delete using (bucket_id = 'gallery' and public.can_edit_content());

-- list_managed_users: admin only (already uses is_admin)

create or replace function public.list_managed_users()
returns table (
  id uuid,
  email text,
  full_name text,
  role text,
  is_active boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  return query
  select
    u.id,
    u.email::text,
    coalesce(
      nullif(trim(p.full_name), ''),
      nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
      split_part(u.email, '@', 1),
      'Användare'
    ) as full_name,
    coalesce(p.role, 'viewer') as role,
    coalesce(p.is_active, true) as is_active,
    coalesce(p.created_at, u.created_at) as created_at,
    u.last_sign_in_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  order by coalesce(p.created_at, u.created_at) desc;
end;
$$;
