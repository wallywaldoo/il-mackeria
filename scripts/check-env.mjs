import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "BOOKING_TO_EMAIL",
  "CONTACT_TO_EMAIL",
];

const recommended = ["RESEND_API_KEY"];

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const values = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    values[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return values;
}

const envPath = resolve(process.cwd(), ".env.local");
const fileEnv = loadEnvFile(envPath);
const get = (key) => process.env[key] || fileEnv[key] || "";

let failed = false;

console.log("Miljövariabler\n");

for (const key of required) {
  const value = get(key);
  if (!value) {
    console.log(`✗ ${key} (krävs)`);
    failed = true;
  } else {
    console.log(`✓ ${key}`);
  }
}

for (const key of recommended) {
  const value = get(key);
  if (!value) {
    console.log(`! ${key} (rekommenderas för e-post)`);
  } else {
    console.log(`✓ ${key}`);
  }
}

if (failed) {
  console.log("\nSaknade variabler. Kopiera .env.example till .env.local och fyll i värden.");
  process.exit(1);
}

console.log("\nGrundkonfigurationen ser bra ut.");
