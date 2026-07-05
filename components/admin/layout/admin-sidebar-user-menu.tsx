"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, LogOut, UserCog } from "lucide-react";

import { UserAvatar } from "@/components/admin/layout/user-avatar";

type AdminSidebarUserMenuProps = {
  displayName: string;
  email: string;
  canManageUsers?: boolean;
};

export function AdminSidebarUserMenu({
  displayName,
  email,
  canManageUsers = false,
}: AdminSidebarUserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  async function signOut() {
    setOpen(false);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative mt-3 shrink-0">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-100 p-2.5 text-left transition hover:bg-neutral-200/70"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <UserAvatar name={displayName} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {displayName}
          </p>
          <p className="truncate text-xs text-neutral-500">{email}</p>
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-neutral-400" aria-hidden />
      </button>

      {open ? (
        <div
          className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
          role="menu"
        >
          {canManageUsers ? (
            <Link
              href="/admin/anvandare"
              role="menuitem"
              className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              onClick={() => setOpen(false)}
            >
              <UserCog className="size-4 shrink-0 text-neutral-500" aria-hidden />
              Hantera användare
            </Link>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
            onClick={() => void signOut()}
          >
            <LogOut className="size-4 shrink-0 text-neutral-500" aria-hidden />
            Logga ut
          </button>
        </div>
      ) : null}
    </div>
  );
}
