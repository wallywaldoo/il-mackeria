"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

type AdminSignOutButtonProps = {
  variant?: "topbar" | "sidebar";
  className?: string;
};

export function AdminSignOutButton({
  variant = "sidebar",
  className,
}: AdminSignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium text-neutral-700 transition hover:bg-neutral-100",
        variant === "topbar" &&
          "h-8 border border-neutral-200 bg-white px-3 hover:bg-neutral-50",
        variant === "sidebar" && "w-full px-3 py-2",
        className,
      )}
    >
      <LogOut className="size-4 shrink-0" />
      <span>Logga ut</span>
    </button>
  );
}
