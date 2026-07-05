alter table public.menu_items
  add column if not exists image_url text;

update public.menu_items
set image_url = '/images/menu/coppa-koster.png'
where name_sv = 'Coppa Koster';

update public.menu_items
set image_url = '/images/menu/sopressa-oddö.png'
where name_sv = 'Sopressa Öddö';

update public.menu_items
set image_url = '/images/menu/mortadella-saltö.png'
where name_sv = 'Mortadella Saltö';

update public.menu_items
set image_url = '/images/menu/spicy-alaska.png'
where name_sv = 'Spicy Alaska';

update public.menu_items
set image_url = '/images/menu/caprese-di-bufala.png'
where name_sv = 'Caprese di Bufala';

update public.menu_items
set image_url = '/images/menu/chianino-di-capri.png'
where name_sv = 'Chianino di Capri';
