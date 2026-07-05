import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Admin-klient med service_role-nyckeln. Kringgår Row Level Security.
 * Får ENDAST användas server-side (route handlers, server actions, cron).
 * Importera aldrig den här filen i klientkod.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
