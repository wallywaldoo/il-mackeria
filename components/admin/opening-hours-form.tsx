"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPrimaryButton } from "@/components/admin/admin-ui";
import { useAdminPermissions } from "@/components/admin/layout/admin-permissions-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { OpeningHour } from "@/types/site";

interface Props {
  hours: OpeningHour[];
}

export function OpeningHoursForm({ hours }: Props) {
  const router = useRouter();
  const { canEdit } = useAdminPermissions();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(
    hours.length
      ? hours.map((h) => ({
          id: h.id,
          label_sv: h.label_sv,
          open_time: h.open_time?.slice(0, 5) ?? "",
          close_time: h.close_time?.slice(0, 5) ?? "",
          note_sv: h.note_sv ?? "",
          is_closed: h.is_closed,
        }))
      : [
          {
            id: "",
            label_sv: "Måndag–Söndag",
            open_time: "11:00",
            close_time: "19:00",
            note_sv: "Hela sommaren",
            is_closed: false,
          },
        ],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setLoading(true);
    const supabase = createClient();

    for (const row of form) {
      const payload = {
        day_of_week: 0,
        label_sv: row.label_sv,
        open_time: row.is_closed ? null : row.open_time,
        close_time: row.is_closed ? null : row.close_time,
        note_sv: row.note_sv || null,
        is_closed: row.is_closed,
        sort_order: 1,
      };

      const { error } = row.id
        ? await supabase.from("opening_hours").update(payload).eq("id", row.id)
        : await supabase.from("opening_hours").insert(payload);

      if (error) {
        setLoading(false);
        toast.error("Kunde inte spara öppettiderna");
        return;
      }
    }

    setLoading(false);
    toast.success("Öppettider sparade");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <fieldset disabled={!canEdit} className="space-y-6">
        {form.map((row, i) => (
          <div key={i} className="space-y-4 rounded-lg border border-line/60 p-4">
            <div className="space-y-2">
              <Label>Etikett</Label>
              <Input
                value={row.label_sv}
                onChange={(e) => {
                  const next = [...form];
                  next[i] = { ...next[i], label_sv: e.target.value };
                  setForm(next);
                }}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={row.is_closed}
                onChange={(e) => {
                  const next = [...form];
                  next[i] = { ...next[i], is_closed: e.target.checked };
                  setForm(next);
                }}
              />
              Stängt
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Öppnar</Label>
                <Input
                  type="time"
                  value={row.open_time}
                  disabled={row.is_closed}
                  onChange={(e) => {
                    const next = [...form];
                    next[i] = { ...next[i], open_time: e.target.value };
                    setForm(next);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Stänger</Label>
                <Input
                  type="time"
                  value={row.close_time}
                  disabled={row.is_closed}
                  onChange={(e) => {
                    const next = [...form];
                    next[i] = { ...next[i], close_time: e.target.value };
                    setForm(next);
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Anteckning</Label>
              <Input
                value={row.note_sv}
                onChange={(e) => {
                  const next = [...form];
                  next[i] = { ...next[i], note_sv: e.target.value };
                  setForm(next);
                }}
              />
            </div>
          </div>
        ))}
      </fieldset>
      {canEdit ? (
        <AdminPrimaryButton type="submit" disabled={loading}>
          {loading ? "Sparar..." : "Spara öppettider"}
        </AdminPrimaryButton>
      ) : null}
    </form>
  );
}
