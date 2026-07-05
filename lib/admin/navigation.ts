import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types/auth";
import {
  CalendarDays,
  Clock,
  Home,
  Image,
  LayoutDashboard,
  Mail,
  Newspaper,
  Settings,
  UtensilsCrossed,
} from "lucide-react";

export type AdminNavLeaf = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  label: string;
  icon: LucideIcon;
  children: AdminNavLeaf[];
};

export type AdminNavItem = AdminNavLeaf | AdminNavGroup;

export function isAdminNavGroup(item: AdminNavItem): item is AdminNavGroup {
  return "children" in item;
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Översikt", icon: LayoutDashboard },
  {
    label: "Webbplats",
    icon: Home,
    children: [
      { href: "/admin/pages/home", label: "Startsidan", icon: Home },
    ],
  },
  {
    label: "Redigera databaser",
    icon: UtensilsCrossed,
    children: [
      { href: "/admin/menu", label: "Meny", icon: UtensilsCrossed },
      { href: "/admin/news", label: "Nyheter", icon: Newspaper },
      { href: "/admin/gallery", label: "Galleri", icon: Image },
    ],
  },
  {
    label: "Drift",
    icon: Settings,
    children: [
      { href: "/admin/opening-hours", label: "Öppettider", icon: Clock },
      { href: "/admin/bookings", label: "Bokningar", icon: CalendarDays },
      { href: "/admin/messages", label: "Meddelanden", icon: Mail },
      { href: "/admin/settings", label: "Inställningar", icon: Settings },
    ],
  },
];

const pageTitles: Record<string, string> = {
  "/admin": "Översikt",
  "/admin/pages/home": "Startsidan",
  "/admin/menu": "Redigera databaser",
  "/admin/menu/new": "Nytt menyobjekt",
  "/admin/news": "Nyheter",
  "/admin/news/new": "Nytt nyhetsinlägg",
  "/admin/opening-hours": "Öppettider",
  "/admin/gallery": "Galleri",
  "/admin/bookings": "Bokningar",
  "/admin/messages": "Meddelanden",
  "/admin/settings": "Inställningar",
  "/admin/anvandare": "Hantera användare",
};

export function filterAdminNavItems(role: UserRole): AdminNavItem[] {
  return adminNavItems
    .map((item) => {
      if (!isAdminNavGroup(item)) return item;

      const children = item.children.filter((child) => {
        if (child.href === "/admin/settings") {
          return role === "admin";
        }
        return true;
      });

      if (children.length === 0) return null;
      return { ...item, children };
    })
    .filter((item): item is AdminNavItem => item !== null);
}

export function isAdminNavLinkActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/menu") {
    return (
      pathname === "/admin/menu" ||
      (pathname.startsWith("/admin/menu/") && pathname !== "/admin/menu/new")
    );
  }
  if (href === "/admin/news") {
    return (
      pathname === "/admin/news" ||
      (pathname.startsWith("/admin/news/") && pathname !== "/admin/news/new")
    );
  }
  return pathname.startsWith(`${href}/`);
}

export function resolveAdminPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/admin/menu/")) return "Redigera menyobjekt";
  if (pathname.startsWith("/admin/news/")) return "Redigera nyhet";
  return "Admin";
}
