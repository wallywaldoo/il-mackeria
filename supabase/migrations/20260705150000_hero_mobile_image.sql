-- Update hero mobile background to new asset
update public.page_sections
set
  content = jsonb_set(
    content,
    '{mobileImage}',
    '{"url": "/images/hero-mobile.png", "alt": "Italian schiacciata – il mackeria"}'::jsonb
  ),
  draft_content = case
    when draft_content is not null then jsonb_set(
      draft_content,
      '{mobileImage}',
      '{"url": "/images/hero-mobile.png", "alt": "Italian schiacciata – il mackeria"}'::jsonb
    )
    else draft_content
  end,
  updated_at = now()
where type = 'hero';
