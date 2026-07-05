"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminPrimaryButton } from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPreparingSession, setIsPreparingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function prepareRecoverySession() {
      const supabase = createClient();
      const code = searchParams.get("code");

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (!cancelled && exchangeError) {
          setError("Återställningslänken kunde inte verifieras. Begär en ny länk.");
        }
      } else if (window.location.hash) {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!cancelled && sessionError) {
            setError("Återställningslänken kunde inte verifieras. Begär en ny länk.");
          }
        }
      }

      if (!cancelled) {
        setIsPreparingSession(false);
        router.replace("/admin/update-password");
      }
    }

    prepareRecoverySession();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (updateError) {
      setError("Kunde inte uppdatera lösenordet. Begär en ny återställningslänk.");
      return;
    }

    setMessage("Lösenordet är uppdaterat. Du skickas till adminpanelen.");
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="password">Nytt lösenord</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          disabled={isPreparingSession || isSubmitting}
        />
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor="confirm-password">Upprepa lösenord</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          disabled={isPreparingSession || isSubmitting}
        />
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}

      <AdminPrimaryButton
        type="submit"
        disabled={isPreparingSession || isSubmitting}
        className="mt-6 w-full"
      >
        {isPreparingSession
          ? "Verifierar länk..."
          : isSubmitting
            ? "Sparar..."
            : "Spara nytt lösenord"}
      </AdminPrimaryButton>
    </form>
  );
}
