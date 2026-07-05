import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  return Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

const email = (process.argv[2] ?? "").trim().toLowerCase();
const password = process.argv[3] ?? "";
const fullName = process.argv[4] ?? "Stellan";
const role = process.argv[5] ?? "admin";

if (!email || !password) {
  console.error(
    "Användning: npx tsx scripts/create-admin-user.mts <email> <lösenord> [namn] [roll]",
  );
  process.exit(1);
}

const env = loadEnv();
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const { data: existing } = await supabase
  .from("profiles")
  .select("id")
  .ilike("email", email)
  .maybeSingle();

let userId = existing?.id;

if (!userId) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (error || !data.user?.id) {
    console.error("Kunde inte skapa användare:", error?.message ?? "Okänt fel");
    process.exit(1);
  }

  userId = data.user.id;
  console.log("Skapade ny auth-användare.");
} else {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Kunde inte uppdatera lösenord:", error.message);
    process.exit(1);
  }

  console.log("Användaren fanns redan – lösenord uppdaterat.");
}

const { error: profileError } = await supabase.from("profiles").upsert(
  {
    id: userId,
    email,
    full_name: fullName,
    role,
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  { onConflict: "id" },
);

if (profileError) {
  console.error("Kunde inte spara profil:", profileError.message);
  process.exit(1);
}

console.log(`Klart: ${email} (${role}) kan logga in på /admin/login`);
