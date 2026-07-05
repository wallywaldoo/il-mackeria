import { Suspense } from "react";
import Link from "next/link";
import { UpdatePasswordForm } from "@/components/admin/update-password-form";
import { SiteLogo } from "@/components/site/site-logo";

export default function AdminUpdatePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <SiteLogo className="mx-auto h-20 w-auto" />
          <h1 className="mt-6 text-lg font-semibold text-neutral-900">
            Välj nytt lösenord
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Ange ett nytt lösenord för ditt adminkonto.
          </p>
        </div>
        <Suspense
          fallback={
            <p className="text-center text-sm text-neutral-500">
              Laddar återställning...
            </p>
          }
        >
          <UpdatePasswordForm />
        </Suspense>
        <Link
          href="/admin/login"
          className="mt-5 block text-center text-sm font-medium text-neutral-500 transition hover:text-[var(--admin-accent,#9E1728)]"
        >
          Tillbaka till inloggning
        </Link>
      </div>
    </div>
  );
}
