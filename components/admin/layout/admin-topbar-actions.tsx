"use client";

import { AdminMobileMenu } from "@/components/admin/layout/admin-mobile-menu";
import { AdminSignOutButton } from "@/components/admin/layout/admin-sign-out-button";
import type { UserRole } from "@/types/auth";

export function AdminTopbarActions({ role }: { role: UserRole }) {
  return (
    <>
      <AdminSignOutButton variant="topbar" className="hidden sm:inline-flex" />
      <AdminMobileMenu role={role} />
    </>
  );
}
