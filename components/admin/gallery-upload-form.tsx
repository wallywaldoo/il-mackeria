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

export function GalleryUploadForm() {
  const router = useRouter();
  const { canEdit } = useAdminPermissions();
  const [loading, setLoading] = useState(false);
  const [alt, setAlt] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canEdit) return;
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    if (!file?.size) {
      toast.error("Välj en bild");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(path, file);

    if (uploadError) {
      setLoading(false);
      toast.error("Uppladdning misslyckades");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(path);

    const { error: dbError } = await supabase.from("gallery_images").insert({
      url: publicUrl,
      alt_sv: alt || null,
      sort_order: Date.now(),
    });

    setLoading(false);
    if (dbError) {
      toast.error("Kunde inte spara bild");
      return;
    }

    toast.success("Bild uppladdad");
    setAlt("");
    router.refresh();
  }

  if (!canEdit) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label>Bild</Label>
        <Input name="file" type="file" accept="image/*" required />
      </div>
      <div className="space-y-2">
        <Label>Alt-text</Label>
        <Input value={alt} onChange={(e) => setAlt(e.target.value)} />
      </div>
      <AdminPrimaryButton type="submit" disabled={loading}>
        {loading ? "Laddar upp..." : "Ladda upp"}
      </AdminPrimaryButton>
    </form>
  );
}
