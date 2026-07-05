-- User management: extend profiles and list_managed_users RPC

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists is_active boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

-- Active admin check
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

-- Users can read their own profile
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

-- Admins can update all profiles
drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles" on public.profiles
  for update using (public.is_admin());

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
    coalesce(p.role, 'admin') as role,
    coalesce(p.is_active, true) as is_active,
    coalesce(p.created_at, u.created_at) as created_at,
    u.last_sign_in_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  order by coalesce(p.created_at, u.created_at) desc;
end;
$$;

revoke all on function public.list_managed_users() from public;
grant execute on function public.list_managed_users() to authenticated;
