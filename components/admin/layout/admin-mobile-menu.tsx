"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

import { AdminSidebarBrand } from "@/components/admin/layout/admin-sidebar-brand";
import { Button } from "@/components/ui/button";
import {
  filterAdminNavItems,
  isAdminNavGroup,
  isAdminNavLinkActive,
} from "@/lib/admin/navigation";
import type { UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

const navActiveClass =
  "bg-[var(--admin-accent,#9E1728)]/10 text-[var(--admin-accent,#9E1728)]";

export function AdminMobileMenu({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const visibleNavItems = filterAdminNavItems(role);

  async function handleSignOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Öppna meny"
        className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 lg:hidden"
      >
        <Menu className="size-5 shrink-0" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Stäng meny"
            className="absolute inset-0 bg-black/45"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col border-r border-neutral-200 bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
              <AdminSidebarBrand
                href="/admin"
                className="min-w-0 flex-1 border-none bg-transparent p-0 hover:bg-transparent"
                onClick={() => setOpen(false)}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Stäng meny"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav
              className="flex-1 space-y-3 overflow-y-auto p-3"
              aria-label="Adminnavigering"
            >
              {visibleNavItems.map((item) => {
                if (isAdminNavGroup(item)) {
                  const GroupIcon = item.icon;
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-1">
                        <GroupIcon className="size-3.5 text-neutral-400" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                          {item.label}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isActive = isAdminNavLinkActive(
                            pathname,
                            child.href,
                          );
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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

            <div className="border-t border-neutral-200 p-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSignOut}
                className="min-h-11 w-full justify-start text-neutral-700 hover:bg-neutral-100"
              >
                <LogOut className="size-4" />
                <span>Logga ut</span>
              </Button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
