-- Page builder: pages + page_sections

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  content jsonb not null default '{}'::jsonb,
  draft_content jsonb,
  updated_at timestamptz not null default now(),
  unique (page_id, type)
);

create index if not exists page_sections_page_id_sort_idx
  on public.page_sections (page_id, sort_order);

alter table public.pages enable row level security;
alter table public.page_sections enable row level security;

create policy "Public can read published pages" on public.pages
  for select using (status = 'published');

create policy "Admins full access pages" on public.pages
  for all using (public.is_admin());

create policy "Public can read visible sections on published pages" on public.page_sections
  for select using (
    is_visible = true
    and exists (
      select 1 from public.pages p
      where p.id = page_sections.page_id and p.status = 'published'
    )
  );

create policy "Admins full access page sections" on public.page_sections
  for all using (public.is_admin());

-- Seed home page with current site content
insert into public.pages (slug, status, published_at)
values ('home', 'published', now())
on conflict (slug) do nothing;

insert into public.page_sections (page_id, type, sort_order, is_visible, content)
select p.id, s.type, s.sort_order, true, s.content::jsonb
from public.pages p
cross join (
  values
    (0, 'hero', '{
      "badge": "Öppet 11–19 hela sommaren",
      "titleLine1": "Italienska",
      "titleLine2": "schiacciata",
      "titleLine3": "i Strömstad",
      "description": "Varmt, enkelt och gott – italienska mackor, deli och takeaway på Södra Hamngatan 20.",
      "srOnlyTitle": "Italienska schiacciata i hjärtat av Strömstad",
      "mobileImage": { "url": "/images/sandwich-closeup.jpg", "alt": "Italiensk schiacciata med fina råvaror" },
      "desktopImage": { "url": "/images/hero-desktop.png", "alt": "Italienska schiacciata i hjärtat av Strömstad" },
      "bookingButtonLabel": "Boka catering",
      "findUsButtonLabel": "Hitta hit"
    }'),
    (1, 'flag_band', '{}'),
    (2, 'intro', '{
      "label": "Välkommen",
      "heading": "En liten bit av Italien i Strömstad",
      "paragraphs": [
        "il mackeria är en schiacciateria, mackbar och deli på Södra Hamngatan 20 – mitt i sommarstaden Strömstad. Vi bakar schiacciata, ett italienskt plattbröd med luftbubblor och krispig yta, och fyller det med fina råvaror från Italien.",
        "Här handlar det om enkla, varma smaker – som en riktig italiensk macka ska smaka. Ta med dig en schiacciata till havet, eller stanna en stund i vår lilla deli."
      ],
      "image": { "url": "/images/fasad.png", "alt": "il mackeria utifrån på Södra Hamngatan i Strömstad" }
    }'),
    (3, 'schiacciata', '{
      "label": "Om vårt upplägg",
      "heading": "Vad är schiacciata?",
      "paragraphs": [
        "Schiacciata betyder \"plattad\" på italienska. Det är ett plattbröd från Toscana med mycket luftbubblor, lätt salt och en krispig yta – som focaccia, men plattare och med sin egen karaktär.",
        "Hos il mackeria fyller vi schiacciatan med fina råvaror – från coppa di Parma och burrata till nduja och färsk basilika. Varm värms den i ugnen, kall serveras den färsk."
      ],
      "image": { "url": "/images/sandwich-display.png", "alt": "Schiacciata upplagd i disken på il mackeria" }
    }'),
    (4, 'menu', '{
      "label": "Meny",
      "heading": "Vår meny",
      "priceLine": "Hel 125 kr · Halv 75 kr"
    }'),
    (5, 'instagram', '{
      "label": "Sociala medier",
      "heading": "En titt in hos oss",
      "linkLabel": "Följ @ilmackeria",
      "elfsightAppId": "2c9003f0-39a0-4c60-abf1-321e7ac4e7e2"
    }'),
    (6, 'booking', '{
      "label": "Event",
      "heading": "Privata bokningar",
      "description": "Vill du boka il mackeria för ett privat event, företagslunch eller firande? Vi tar gärna emot er – fyll i formuläret så återkommer vi.",
      "buttonLabel": "Boka nu",
      "image": { "url": "/images/private-booking.png", "alt": "Välkomnande personal bakom disken på il mackeria" }
    }'),
    (7, 'location', '{
      "label": "Besök oss",
      "heading": "Hitta hit"
    }')
) as s(sort_order, type, content)
where p.slug = 'home'
on conflict (page_id, type) do nothing;
