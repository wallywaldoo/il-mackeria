import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminTopbar } from "@/components/admin/layout/admin-topbar";
import { AdminTopbarActions } from "@/components/admin/layout/admin-topbar-actions";
import { AdminPermissionsProvider } from "@/components/admin/layout/admin-permissions-provider";
import { getAdminThemeRootStyle } from "@/lib/admin/admin-theme-style";
import type { UserRole } from "@/types/auth";

type AdminShellProps = {
  children: React.ReactNode;
  displayName: string;
  email: string;
  role: UserRole;
  canEdit: boolean;
  canManageUsers: boolean;
};

export function AdminShell({
  children,
  displayName,
  email,
  role,
  canEdit,
  canManageUsers,
}: AdminShellProps) {
  return (
    <AdminPermissionsProvider
      role={role}
      canEdit={canEdit}
      canManageUsers={canManageUsers}
    >
      <div className="min-h-screen bg-neutral-100">
        <div
          className="admin-theme-root flex h-screen gap-3 overflow-x-hidden p-3"
          style={getAdminThemeRootStyle()}
        >
          <AdminSidebar
            displayName={displayName}
            email={email}
            role={role}
            canManageUsers={canManageUsers}
          />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <AdminTopbar actions={<AdminTopbarActions role={role} />} />
            <main className="min-h-0 min-w-0 flex-1 overflow-auto p-4 sm:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminPermissionsProvider>
  );
}
