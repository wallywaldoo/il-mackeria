-- Page builder V2: instansbaserade sektioner, title och settings

alter table public.page_sections
  drop constraint if exists page_sections_page_id_type_key;

alter table public.page_sections
  add column if not exists title text,
  add column if not exists settings jsonb not null default '{}'::jsonb,
  add column if not exists draft_settings jsonb;

-- Backfill admin-titlar från typ
update public.page_sections
set title = case type
  when 'hero' then 'Hero'
  when 'flag_band' then 'Flagglinje'
  when 'intro' then 'Välkommen'
  when 'schiacciata' then 'Schiacciata'
  when 'menu' then 'Meny'
  when 'instagram' then 'Instagram'
  when 'booking' then 'Bokning'
  when 'location' then 'Hitta hit'
  else type
end
where title is null;
