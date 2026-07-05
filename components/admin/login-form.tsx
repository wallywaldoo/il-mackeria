"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminPrimaryButton } from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validations";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: { email: string; password: string }) {
    setError("");
    setMessage("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword(data);

    if (authError) {
      setError("Fel e-post eller lösenord");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function requestPasswordReset() {
    setError("");
    setMessage("");
    const email = getValues("email")?.trim();

    if (!email) {
      setError("Fyll i din e-postadress först.");
      return;
    }

    setIsResettingPassword(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/admin/update-password`,
      },
    );
    setIsResettingPassword(false);

    if (resetError) {
      setError("Kunde inte skicka återställningslänk. Kontrollera e-postadressen.");
      return;
    }

    setMessage("Om e-postadressen finns skickas en länk för nytt lösenord.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">E-post</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor="password">Lösenord</Label>
        <Input id="password" type="password" {...register("password")} />
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
      <AdminPrimaryButton
        type="submit"
        disabled={isSubmitting || isResettingPassword}
        className="mt-6 w-full"
      >
        {isSubmitting ? "Loggar in..." : "Logga in"}
      </AdminPrimaryButton>
      <button
        type="button"
        onClick={requestPasswordReset}
        disabled={isSubmitting || isResettingPassword}
        className="mt-4 w-full text-center text-sm font-medium text-[var(--admin-accent,#9E1728)] transition hover:text-[var(--admin-accent-hover,#76101D)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isResettingPassword ? "Skickar länk..." : "Glömt lösenord?"}
      </button>
    </form>
  );
}
