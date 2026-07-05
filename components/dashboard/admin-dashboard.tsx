import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Home,
  Image,
  Mail,
  Newspaper,
  UtensilsCrossed,
} from "lucide-react";

import {
  AdminAttentionCard,
  adminPanelIconClass,
} from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { RecentNewsPanel } from "@/components/dashboard/recent-news-panel";
import { getCurrentUserProfile } from "@/lib/auth/profile";
import {
  getAdminDashboardOverview,
  getRecentNewsPosts,
} from "@/lib/dashboard/admin-data";
import { cn } from "@/lib/utils";

type AttentionItem = {
  label: string;
  description: string;
  value: number;
  href: string;
  icon: LucideIcon;
};

const quickLinks = [
  {
    href: "/admin/pages/home",
    label: "Startsidan",
    description: "Redigera och publicera sektioner",
    icon: Home,
  },
  {
    href: "/admin/menu",
    label: "Meny",
    description: "Hantera schiacciata-mackor",
    icon: UtensilsCrossed,
  },
  {
    href: "/admin/opening-hours",
    label: "Redigera öppettider",
    description: "Uppdatera tider på startsidan",
    icon: Clock,
  },
  {
    href: "/admin/news",
    label: "Nyheter",
    description: "Publicera nyheter",
    icon: Newspaper,
  },
  {
    href: "/admin/bookings",
    label: "Bokningar",
    description: "Se bokningsförfrågningar",
    icon: CalendarDays,
  },
  {
    href: "/admin/messages",
    label: "Meddelanden",
    description: "Se kontaktmeddelanden",
    icon: Mail,
  },
] as const;

function greetingForHour(hour: number) {
  if (hour < 10) return "God morgon";
  if (hour < 17) return "God dag";
  return "God kväll";
}

function greetingName(fullName: string | null | undefined, email: string) {
  const trimmed = fullName?.trim();
  if (trimmed) {
    return trimmed.split(/\s+/)[0] ?? trimmed;
  }

  const local = email.split("@")[0] ?? "";
  const part = local.split(/[._-]/)[0];
  if (!part) return "admin";
  return part.charAt(0).toUpperCase() + part.slice(1);
}

export async function AdminDashboard() {
  const [{ profile }, overview, recentNews] = await Promise.all([
    getCurrentUserProfile(),
    getAdminDashboardOverview(),
    getRecentNewsPosts(3),
  ]);

  const userName = greetingName(profile?.full_name, profile?.email ?? "");
  const greeting = greetingForHour(new Date().getHours());

  const attentionCandidates = [
    {
      label: "Nya bokningsförfrågningar",
      description: "Förfrågningar som ännu inte har hanterats.",
      value: overview.newBookingRequests,
      href: "/admin/bookings",
      icon: CalendarDays,
    },
    {
      label: "Nya kontaktmeddelanden",
      description: "Meddelanden som ännu inte har lästs.",
      value: overview.newContactSubmissions,
      href: "/admin/messages",
      icon: Mail,
    },
    {
      label: "Nyheter i utkast",
      description: "Inlägg som inte är publicerade ännu.",
      value: overview.draftNewsPosts,
      href: "/admin/news",
      icon: Newspaper,
    },
    {
      label: "Opublicerade menyobjekt",
      description: "Menyrätter som inte visas på sajten.",
      value: overview.unpublishedMenuItems,
      href: "/admin/menu",
      icon: UtensilsCrossed,
    },
    {
      label: "Opublicerade galleribilder",
      description: "Bilder som inte visas på sajten.",
      value: overview.unpublishedGalleryImages,
      href: "/admin/gallery",
      icon: Image,
    },
    {
      label: "Opublicerade startsidesändringar",
      description: "Sektioner med osparade eller opublicerade ändringar.",
      value: overview.homePageUnpublishedChanges,
      href: "/admin/pages/home",
      icon: Home,
    },
  ] satisfies AttentionItem[];

  const attentionItems = attentionCandidates.filter((item) => item.value > 0);
  const attentionTotal = attentionItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <AdminPageContainer className="space-y-4">
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--admin-accent,#9E1728)]">
            {greeting}, {userName}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-neutral-900">
            Hur är läget?
          </h2>
        </div>

        <div className="mt-5 border-t border-neutral-100 pt-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
            Snabblänkar
          </p>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex max-w-full items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-[var(--admin-accent,#9E1728)] hover:bg-white hover:text-[var(--admin-accent,#9E1728)]"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--admin-accent,#9E1728)] shadow-sm ring-1 ring-neutral-200 transition",
                      "group-hover:bg-[var(--admin-accent,#9E1728)] group-hover:text-white group-hover:ring-[var(--admin-accent,#9E1728)]",
                    )}
                    aria-hidden
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block leading-tight">{link.label}</span>
                    <span className="block text-xs font-normal text-neutral-500 group-hover:text-neutral-600">
                      {link.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Menyrätter"
          value={overview.publishedMenuItems}
          description="Publicerade på sajten"
        />
        <DashboardStatCard
          label="Nyheter"
          value={overview.publishedNewsPosts}
          description="Publicerade inlägg"
        />
        <DashboardStatCard
          label="Galleribilder"
          value={overview.publishedGalleryImages}
          description="Publicerade bilder"
        />
        <DashboardStatCard
          label="Nya bokningsförfrågningar"
          value={overview.newBookingRequests}
          description="Ohanterade förfrågningar"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <section className="flex h-full min-h-0 flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="shrink-0">
            <div className="flex min-w-0 items-start gap-2">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-info-bg,rgba(158,23,40,0.08))] text-[var(--admin-accent,#9E1728)]"
                aria-hidden
              >
                <AlertTriangle className="size-4" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Behöver åtgärd
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {attentionTotal > 0
                    ? `${attentionTotal} ${attentionTotal === 1 ? "post" : "poster"} väntar på uppföljning.`
                    : "Inget akut just nu — bra läge att förbereda innehåll."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            {attentionItems.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {attentionItems.map((item) => (
                  <li key={item.label}>
                    <AdminAttentionCard {...item} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex min-h-0 flex-1 flex-col space-y-2">
                <li className="flex min-h-0 flex-1">
                  <article className="flex h-full w-full gap-3 rounded-lg border border-emerald-200/80 bg-emerald-50/60 px-3 py-2">
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${adminPanelIconClass}`}
                    >
                      <CheckCircle2 className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-snug text-emerald-950">
                        Allt ser bra ut
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-emerald-900/80">
                        Inga nya bokningar, utkast eller opublicerade ändringar
                        just nu.
                      </p>
                    </div>
                  </article>
                </li>
              </ul>
            )}
          </div>
        </section>

        <RecentNewsPanel posts={recentNews} />
      </div>
    </AdminPageContainer>
  );
}
