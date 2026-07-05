"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPrimaryButton } from "@/components/admin/admin-ui";
import { useAdminPermissions } from "@/components/admin/layout/admin-permissions-provider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { SiteSettings } from "@/types/site";

interface Props {
  settings: SiteSettings;
}

export function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const { canEdit } = useAdminPermissions();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    contact_email: settings.contact_email,
    contact_phone: settings.contact_phone,
    banner_text: settings.banner_text ?? "",
    banner_enabled: settings.banner_enabled,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.from("site_settings").upsert([
      {
        key: "contact",
        value: { email: form.contact_email, phone: form.contact_phone },
        updated_at: new Date().toISOString(),
      },
      {
        key: "banner",
        value: { text: form.banner_text || null, enabled: form.banner_enabled },
        updated_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      toast.error("Kunde inte spara inställningarna");
      return;
    }

    toast.success("Inställningar sparade");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <fieldset disabled={!canEdit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-semibold">Kontakt</h3>
          <div className="space-y-2">
            <Label>E-post</Label>
            <Input
              type="email"
              value={form.contact_email}
              onChange={(e) =>
                setForm({ ...form, contact_email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Telefon</Label>
            <Input
              value={form.contact_phone}
              onChange={(e) =>
                setForm({ ...form, contact_phone: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-semibold">Banner</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.banner_enabled}
              onChange={(e) =>
                setForm({ ...form, banner_enabled: e.target.checked })
              }
            />
            Visa banner på startsidan
          </label>
          <div className="space-y-2">
            <Label>Bannertext</Label>
            <Textarea
              value={form.banner_text}
              onChange={(e) =>
                setForm({ ...form, banner_text: e.target.value })
              }
              placeholder="T.ex. Stängt idag pga..."
            />
          </div>
        </div>
      </fieldset>
      {canEdit ? (
        <AdminPrimaryButton type="submit" disabled={loading}>
          {loading ? "Sparar..." : "Spara inställningar"}
        </AdminPrimaryButton>
      ) : null}
    </form>
  );
}
