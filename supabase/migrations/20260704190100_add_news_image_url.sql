alter table public.news_posts
  add column if not exists image_url text;

update public.news_posts
set image_url = '/images/exterior.jpg'
where image_url is null;
