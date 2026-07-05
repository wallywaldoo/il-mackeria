import { LoginForm } from "@/components/admin/login-form";
import { SiteLogo } from "@/components/site/site-logo";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <SiteLogo className="mx-auto h-20 w-auto" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
