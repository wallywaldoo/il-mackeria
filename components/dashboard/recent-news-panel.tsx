import Link from "next/link";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Newspaper } from "lucide-react";

import type { NewsPost } from "@/types/site";

type RecentNewsPanelProps = {
  posts: NewsPost[];
};

export function RecentNewsPanel({ posts }: RecentNewsPanelProps) {
  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex shrink-0 items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-info-bg,rgba(158,23,40,0.08))] text-[var(--admin-accent,#9E1728)]"
            aria-hidden
          >
            <Newspaper className="size-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900">
              Senaste nyheter
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Senast skapade nyhetsinlägg.
            </p>
          </div>
        </div>
        <Link
          href="/admin/news"
          className="shrink-0 text-xs font-medium text-[var(--admin-accent,#9E1728)] hover:underline"
        >
          Alla
        </Link>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        {posts.length > 0 ? (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/admin/news/${post.id}`}
                  className="group block rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 transition hover:border-neutral-200 hover:bg-white"
                >
                  <p className="line-clamp-2 text-sm font-medium leading-snug text-neutral-900 group-hover:text-[var(--admin-accent,#9E1728)]">
                    {post.title_sv}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-neutral-500">
                    <span
                      className={
                        post.is_published
                          ? "text-emerald-700"
                          : "text-neutral-500"
                      }
                    >
                      {post.is_published ? "Publicerad" : "Utkast"}
                    </span>
                    {post.created_at ? (
                      <>
                        <span> · </span>
                        <span className="shrink-0">
                          {format(new Date(post.created_at), "d MMM yyyy", {
                            locale: sv,
                          })}
                        </span>
                      </>
                    ) : null}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">
            Inga nyhetsinlägg ännu.{" "}
            <Link
              href="/admin/news/new"
              className="text-[var(--admin-accent,#9E1728)] hover:underline"
            >
              Skapa första inlägget
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
