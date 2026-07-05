#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env.local ]]; then
  echo "Saknar .env.local. Skapa filen från .env.example först."
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Använder npx vercel..."
  VERCEL=(npx vercel)
else
  VERCEL=(vercel)
fi

echo "Synkar miljövariabler till Vercel (production)..."
echo "Se till att projektet är länkat: npx vercel link --scope wallywaldoos-projects"

SCOPE="${VERCEL_SCOPE:-wallywaldoos-projects}"

while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  key="${line%%=*}"
  value="${line#*=}"
  [[ -z "$key" || -z "$value" ]] && continue
  [[ "$key" == VERCEL_* ]] && continue

  printf '%s' "$value" | "${VERCEL[@]}" env add "$key" production --force --scope "$SCOPE" >/dev/null
  echo "✓ $key"
done < .env.local

echo "Klart. Kör sedan: npx vercel deploy --prod"
