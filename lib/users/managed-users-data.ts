import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ManagedUser } from "@/lib/users/managed-users-types";

export async function listManagedUsers(): Promise<{
  users: ManagedUser[];
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_managed_users");

  if (error) {
    return { users: [], error: "Kunde inte hämta användare." };
  }

  return { users: (data ?? []) as ManagedUser[], error: null };
}
