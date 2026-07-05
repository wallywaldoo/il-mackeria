"use server";

import { revalidatePath } from "next/cache";
import { USER_ROLES } from "@/lib/auth/permissions";
import {
  getCurrentUserProfile,
  isActiveAdminProfile,
} from "@/lib/auth/profile";
import { SITE } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/types/auth";

const MANAGED_USERS_PATH = "/admin/anvandare";

type ActionResult =
  | { ok: true; invited?: boolean; existing?: boolean }
  | { ok: false; error: string };

async function requireAdminActor() {
  const { user, profile } = await getCurrentUserProfile();
  if (!user || !isActiveAdminProfile(profile)) {
    return {
      ok: false as const,
      error: "Du har inte behörighet att hantera användare.",
    };
  }
  return { ok: true as const, user, profile };
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidRole(role: string): role is UserRole {
  return USER_ROLES.includes(role as UserRole);
}

async function findAuthUserIdByEmail(
  service: ReturnType<typeof createAdminClient>,
  email: string,
): Promise<string | null> {
  let page = 1;
  while (page <= 20) {
    const { data, error } = await service.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error || !data.users.length) return null;

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === email,
    );
    if (match?.id) return match.id;

    if (data.users.length < 200) return null;
    page += 1;
  }
  return null;
}

function mapInviteError(error: { message?: string }) {
  const message = error.message?.toLowerCase() ?? "";
  if (message.includes("already")) {
    return "Användaren finns redan.";
  }
  return error.message || "Kunde inte skicka inbjudan.";
}

function revalidateManagedUsers() {
  revalidatePath(MANAGED_USERS_PATH);
  revalidatePath("/admin");
}

export async function inviteManagedUserAction(payload: {
  email: string;
  full_name: string;
  role: UserRole;
}): Promise<ActionResult> {
  const actor = await requireAdminActor();
  if (!actor.ok) return actor;

  const email = payload.email.trim().toLowerCase();
  const fullName = payload.full_name.trim();
  const role = payload.role;

  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "En giltig e-postadress krävs." };
  }
  if (!fullName) {
    return { ok: false, error: "Visningsnamn krävs." };
  }
  if (!isValidRole(role)) {
    return { ok: false, error: "Ogiltig roll." };
  }

  const service = createAdminClient();
  const { data: existingProfile } = await service
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  let userId = existingProfile?.id ?? (await findAuthUserIdByEmail(service, email));
  let invited = false;

  if (!userId) {
    const { data, error } = await service.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName, role },
      redirectTo: `${SITE.url}/admin/login`,
    });

    if (error || !data.user?.id) {
      const fallbackId = await findAuthUserIdByEmail(service, email);
      if (!fallbackId) {
        return { ok: false, error: mapInviteError(error ?? { message: "Okänt fel." }) };
      }
      userId = fallbackId;
    } else {
      userId = data.user.id;
      invited = true;
    }
  }

  if (!userId) {
    return { ok: false, error: "Kunde inte skapa eller hitta användaren." };
  }

  const { error: upsertError } = await service.from("profiles").upsert(
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

  if (upsertError) {
    return { ok: false, error: "Kunde inte spara användarprofilen." };
  }

  revalidateManagedUsers();
  return { ok: true, invited, existing: !invited };
}

export async function updateManagedUserAction(
  userId: string,
  payload: { full_name?: string; is_active?: boolean; role?: UserRole },
): Promise<ActionResult> {
  const actor = await requireAdminActor();
  if (!actor.ok) return actor;

  if (!userId) {
    return { ok: false, error: "Ogiltig användare." };
  }

  if (actor.user.id === userId) {
    if (payload.is_active === false) {
      return {
        ok: false,
        error: "Du kan inte inaktivera ditt eget konto.",
      };
    }
    if (payload.role && payload.role !== "admin") {
      return {
        ok: false,
        error: "Du kan inte ändra din egen roll.",
      };
    }
  }

  if (payload.full_name !== undefined && !payload.full_name.trim()) {
    return { ok: false, error: "Visningsnamn kan inte vara tomt." };
  }

  if (payload.role !== undefined && !isValidRole(payload.role)) {
    return { ok: false, error: "Ogiltig roll." };
  }

  const service = createAdminClient();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (payload.full_name !== undefined) {
    updates.full_name = payload.full_name.trim();
  }
  if (payload.is_active !== undefined) {
    updates.is_active = payload.is_active;
  }
  if (payload.role !== undefined) {
    updates.role = payload.role;
  }

  const { error } = await service.from("profiles").update(updates).eq("id", userId);
  if (error) {
    return { ok: false, error: "Kunde inte uppdatera användaren." };
  }

  revalidateManagedUsers();
  return { ok: true };
}

export async function deleteManagedUserAction(
  userId: string,
): Promise<ActionResult> {
  const actor = await requireAdminActor();
  if (!actor.ok) return actor;

  if (!userId) {
    return { ok: false, error: "Ogiltig användare." };
  }

  if (actor.user.id === userId) {
    return { ok: false, error: "Du kan inte ta bort ditt eget konto." };
  }

  const service = createAdminClient();
  const { error } = await service.auth.admin.deleteUser(userId);
  if (error) {
    return { ok: false, error: error.message || "Kunde inte ta bort användaren." };
  }

  revalidateManagedUsers();
  return { ok: true };
}
