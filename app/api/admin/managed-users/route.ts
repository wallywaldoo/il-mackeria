import { NextResponse } from "next/server";
import {
  getCurrentUserProfile,
  isActiveAdminProfile,
} from "@/lib/auth/profile";
import { listManagedUsers } from "@/lib/users/managed-users-data";

export async function GET() {
  const { user, profile } = await getCurrentUserProfile();

  if (!user) {
    return NextResponse.json(
      { error: "Du måste vara inloggad." },
      { status: 401 },
    );
  }

  if (!isActiveAdminProfile(profile)) {
    return NextResponse.json({ error: "Du saknar behörighet." }, { status: 403 });
  }

  const { users, error } = await listManagedUsers();
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ users });
}
