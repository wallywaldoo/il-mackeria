-- Contact form submissions

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

create policy "Anyone can create contact submissions" on public.contact_submissions
  for insert with check (true);

create policy "Panel users read contact submissions" on public.contact_submissions
  for select using (public.is_panel_user());

create policy "Editors update contact submissions" on public.contact_submissions
  for update using (public.can_edit_content());
