# il mackeria

Webbplats och admin för il mackeria i Strömstad — Next.js, Supabase, Vercel och Resend.

## Kom igång lokalt

```bash
pnpm install
cp .env.example .env.local
# Fyll i nycklar i .env.local
pnpm check:env
pnpm dev
```

Öppna [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

## Produktion

Se **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** för fullständig guide.

Snabbversion:

```bash
pnpm check:env
npx supabase db push
bash scripts/sync-vercel-env.sh
pnpm deploy:vercel
```

## Stack

- **Next.js 16** — App Router
- **Supabase** — Auth, databas, storage
- **Vercel** — Hosting
- **Resend** — E-post (bokning, kontakt)

## Supabase-projekt

`pqqepbqdnggtrkcmkezb` → `https://pqqepbqdnggtrkcmkezb.supabase.co`

## Vercel-projekt

`wallywaldoos-projects/il-mackeria`
