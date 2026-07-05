"use client";

import { createContext, useContext } from "react";

import type { UserRole } from "@/types/auth";

type AdminPermissionsContextValue = {
  role: UserRole;
  canEdit: boolean;
  canManageUsers: boolean;
};

const AdminPermissionsContext = createContext<AdminPermissionsContextValue>({
  role: "viewer",
  canEdit: false,
  canManageUsers: false,
});

export function AdminPermissionsProvider({
  role,
  canEdit,
  canManageUsers,
  children,
}: AdminPermissionsContextValue & { children: React.ReactNode }) {
  return (
    <AdminPermissionsContext.Provider
      value={{ role, canEdit, canManageUsers }}
    >
      {children}
    </AdminPermissionsContext.Provider>
  );
}

export function useAdminPermissions() {
  return useContext(AdminPermissionsContext);
}
