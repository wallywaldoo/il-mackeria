alter table public.gallery_images
  add column if not exists show_on_homepage boolean not null default false;

update public.gallery_images
set show_on_homepage = true
where is_published = true;
