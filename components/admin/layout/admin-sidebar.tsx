"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminSidebarBrand } from "@/components/admin/layout/admin-sidebar-brand";
import { AdminSidebarUserMenu } from "@/components/admin/layout/admin-sidebar-user-menu";
import {
  filterAdminNavItems,
  isAdminNavGroup,
  isAdminNavLinkActive,
} from "@/lib/admin/navigation";
import type { UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

const navActiveClass =
  "bg-[var(--admin-accent,#9E1728)]/10 text-[var(--admin-accent,#9E1728)]";

type AdminSidebarProps = {
  displayName: string;
  email: string;
  role: UserRole;
  canManageUsers: boolean;
};

export function AdminSidebar({
  displayName,
  email,
  role,
  canManageUsers,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const visibleNavItems = filterAdminNavItems(role);

  return (
    <aside
      className="relative z-30 hidden min-h-0 w-64 shrink-0 flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm lg:flex"
      aria-label="Sidomeny"
    >
      <AdminSidebarBrand className="mb-3" />

      <nav className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {visibleNavItems.map((item) => {
          if (isAdminNavGroup(item)) {
            const GroupIcon = item.icon;

            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center gap-1.5 px-3 pb-0.5 pt-0.5">
                  <GroupIcon
                    className="size-3 shrink-0 text-neutral-400"
                    aria-hidden
                  />
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                    {item.label}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isActive = isAdminNavLinkActive(pathname, child.href);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? navActiveClass
                            : "text-neutral-700 hover:bg-neutral-100",
                        )}
                      >
                        <ChildIcon className="size-4 shrink-0" />
                        <span>{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = isAdminNavLinkActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? navActiveClass
                  : "text-neutral-700 hover:bg-neutral-100",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <AdminSidebarUserMenu
        displayName={displayName}
        email={email}
        canManageUsers={canManageUsers}
      />
    </aside>
  );
}
