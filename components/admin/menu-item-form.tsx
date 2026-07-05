"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPrimaryButton } from "@/components/admin/admin-ui";
import { useAdminPermissions } from "@/components/admin/layout/admin-permissions-provider";
import { ImagePicker } from "@/components/admin/page-builder/image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { MenuItem } from "@/types/site";

interface Props {
  item?: MenuItem;
}

export function MenuItemForm({ item }: Props) {
  const router = useRouter();
  const { canEdit } = useAdminPermissions();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name_sv: item?.name_sv ?? "",
    name_en: item?.name_en ?? "",
    description_sv: item?.description_sv ?? "",
    description_en: item?.description_en ?? "",
    temperature: item?.temperature ?? "varm",
    price_full: item?.price_full ?? 125,
    price_half: item?.price_half ?? 75,
    sort_order: item?.sort_order ?? 0,
    image_url: item?.image_url ?? "",
    is_published: item?.is_published ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setLoading(true);
    const supabase = createClient();

    const payload = {
      ...form,
      name_en: form.name_en || null,
      description_en: form.description_en || null,
      image_url: form.image_url || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = item
      ? await supabase.from("menu_items").update(payload).eq("id", item.id)
      : await supabase.from("menu_items").insert(payload);

    setLoading(false);

    if (error) {
      toast.error("Kunde inte spara");
      return;
    }

    toast.success(item ? "Uppdaterad" : "Skapad");
    router.push("/admin/menu");
    router.refresh();
  }

  async function handleDelete() {
    if (!item || !confirm("Ta bort detta menyobjekt?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("menu_items").delete().eq("id", item.id);
    if (error) {
      toast.error("Kunde inte ta bort");
      return;
    }
    toast.success("Borttagen");
    router.push("/admin/menu");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <fieldset disabled={!canEdit} className="space-y-4">
        <div className="space-y-2">
          <Label>Namn (sv) *</Label>
          <Input
            value={form.name_sv}
            onChange={(e) => setForm({ ...form, name_sv: e.target.value })}
            required
          />
        </div>
      <div className="space-y-2">
        <Label>Beskrivning (sv) *</Label>
        <Textarea
          value={form.description_sv}
          onChange={(e) => setForm({ ...form, description_sv: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Temperatur</Label>
          <Select
            value={form.temperature}
            onValueChange={(v) =>
              setForm({ ...form, temperature: (v ?? "varm") as "varm" | "kall" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="varm">Varm</SelectItem>
              <SelectItem value="kall">Kall</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Ordning</Label>
          <Input
            type="number"
            value={form.sort_order}
            onChange={(e) =>
              setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Pris hel (kr)</Label>
          <Input
            type="number"
            value={form.price_full}
            onChange={(e) =>
              setForm({ ...form, price_full: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Pris halv (kr)</Label>
          <Input
            type="number"
            value={form.price_half}
            onChange={(e) =>
              setForm({ ...form, price_half: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>
      <ImagePicker
        label="Bild"
        showAlt={false}
        previewClassName="max-w-xs"
        value={{
          url: form.image_url,
          alt: form.name_sv || "Menybild",
        }}
        onChange={(image) => setForm({ ...form, image_url: image.url })}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
        />
        Publicerad
      </label>
      </fieldset>
      <div className="flex gap-3">
        {canEdit ? (
          <>
            <AdminPrimaryButton type="submit" disabled={loading}>
              {loading ? "Sparar..." : "Spara"}
            </AdminPrimaryButton>
            {item ? (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Ta bort
              </Button>
            ) : null}
          </>
        ) : null}
      </div>
    </form>
  );
}
