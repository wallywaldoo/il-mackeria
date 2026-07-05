# Lansering: Supabase, Vercel och Resend

Steg-för-steg för att koppla upp il mackeria i produktion.

## 1. Supabase

**Projekt:** `pqqepbqdnggtrkcmkezb` (`https://pqqepbqdnggtrkcmkezb.supabase.co`)

Migrationer är redan länkade i repot. Kör vid behov:

```bash
npx supabase link --project-ref pqqepbqdnggtrkcmkezb
npx supabase db push
```

### Auth-inställningar (Supabase Dashboard → Authentication → URL Configuration)

| Fält | Värde |
|------|-------|
| Site URL | `https://ilmackeria.se` |
| Redirect URLs | `https://ilmackeria.se/admin/update-password`, `https://ilmackeria.se/admin/login`, `http://localhost:3000/admin/update-password` |

### Viktigt: stäng av öppen registrering

Dashboard → Authentication → Providers → Email → **Disable sign ups** (eller använd enbart inbjudan via admin).

Nya användare skapas via `/admin/anvandare` (inbjudan).

### Nycklar (Settings → API)

Kopiera till `.env.local` och Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only — publicera aldrig i klienten)

---

## 2. Resend

1. Skapa konto på [resend.com](https://resend.com)
2. Verifiera domänen `ilmackeria.se` (DNS: SPF, DKIM enligt Resend)
3. Skapa API-nyckel → `RESEND_API_KEY`
4. Avsändare i appen: `noreply@ilmackeria.se`

| Variabel | Värde |
|----------|-------|
| `RESEND_API_KEY` | Din Resend API-nyckel |
| `BOOKING_TO_EMAIL` | E-post som tar emot bokningar |
| `CONTACT_TO_EMAIL` | E-post som tar emot kontaktformulär |

Utan `RESEND_API_KEY`:

- Kontaktformulär returnerar fel (inget sparas)
- Bokning sparas i databasen men skickar inget bekräftelsemail

---

## 3. Vercel

### Första gången

```bash
pnpm install
cp .env.example .env.local   # fyll i alla värden
pnpm check:env

npx vercel link --scope wallywaldoos-projects --project il-mackeria
bash scripts/sync-vercel-env.sh
pnpm deploy:vercel
```

### Miljövariabler i Vercel (Settings → Environment Variables)

Alla från `.env.example` ska finnas för **Production**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
BOOKING_TO_EMAIL
CONTACT_TO_EMAIL
NEXT_PUBLIC_SITE_URL=https://ilmackeria.se
```

### Domän (Loopia)

Om domänen är köpt via **Loopia** och DNS ska ligga kvar där (t.ex. för e-post):

#### Steg 1 — Lägg till domän i Vercel

1. Öppna [Vercel Dashboard](https://vercel.com) → projektet **il-mackeria**
2. **Settings → Domains**
3. Lägg till:
   - `ilmackeria.se`
   - `www.ilmackeria.se`
4. Vercel visar exakt vilka DNS-poster som behövs — **använd dessa värden** (de kan skilja sig något från standard).

Typiskt:

| Subdomän | Typ | Värde |
|----------|-----|-------|
| `@` | A | `76.76.21.21` |
| `www` | CNAME | `cname.vercel-dns.com` |

#### Steg 2 — DNS-editorn i Loopia

1. Logga in på [Loopia Kundzon](https://www.loopia.se)
2. Välj domänen **ilmackeria.se**
3. Öppna **DNS-editor**
4. Kontrollera att domänen använder **Loopias namnservrar**

Under `@` och `www`:

- Ta bort befintliga **A**- och **CNAME**-poster som pekar till gammal webbhotell/placeholder
- **Rör inte MX-poster** om e-post ska ligga kvar hos Loopia

Lägg till:

**För `@` (ilmackeria.se utan www):**
- Typ: **A**
- Data: IP-adressen från Vercel (ofta `76.76.21.21`)
- TTL: `3600`

**För `www`:**
- Typ: **CNAME**
- Data: värdnamnet från Vercel (ofta `cname.vercel-dns.com`)
- TTL: `3600`

> Loopia tillåter **inte CNAME på `@`** — därför behövs A-post för huvuddomänen.

#### Steg 3 — Vänta och verifiera

- DNS kan ta **5 minuter till 24 timmar** (oftast under 1 timme)
- I Vercel → Domains ska status bli **Valid**
- Vercel skapar **SSL-certifikat** automatiskt

#### Steg 4 — Vercel redirect (rekommenderat)

I Vercel → Domains: välj att antingen `www` redirectar till `ilmackeria.se`, eller tvärtom — så att besökare alltid hamnar på en adress.

#### E-post via Loopia?

Behåll MX-posterna i Loopia. Du ändrar bara A/CNAME för webben (`@` och `www`), inte e-postposterna.

---

### Domän (generellt)

---

## 4. Verifiering efter deploy

- [ ] `/admin/login` — logga in
- [ ] `/admin` — dashboard laddar utan mock-data
- [ ] `/admin/pages/home` — spara utkast + publicera
- [ ] `/admin/menu` — skapa/redigera menyobjekt
- [ ] `/admin/gallery` — ladda upp och radera bild
- [ ] `/booking` — skicka testbokning (kolla DB + mail)
- [ ] Kontaktformulär — skicka test (kolla mail)
- [ ] Lösenordsåterställning — `/admin/update-password`

---

## Användbara kommandon

```bash
node scripts/check-env.mjs          # Kontrollera lokal miljö
npx supabase db push                # Kör migrationer
bash scripts/sync-vercel-env.sh     # Synka .env.local → Vercel
npx vercel deploy --prod            # Produktionsdeploy
pnpm build                          # Lokal build-kontroll
```
