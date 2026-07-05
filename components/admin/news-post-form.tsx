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
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { NewsPost } from "@/types/site";

interface Props {
  post?: NewsPost;
}

export function NewsPostForm({ post }: Props) {
  const router = useRouter();
  const { canEdit } = useAdminPermissions();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_sv: post?.title_sv ?? "",
    content_sv: post?.content_sv ?? "",
    excerpt_sv: post?.excerpt_sv ?? "",
    image_url: post?.image_url ?? "",
    is_published: post?.is_published ?? false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setLoading(true);
    const supabase = createClient();

    const payload = {
      ...form,
      excerpt_sv: form.excerpt_sv || null,
      image_url: form.image_url || null,
      published_at: form.is_published
        ? post?.published_at ?? new Date().toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = post
      ? await supabase.from("news_posts").update(payload).eq("id", post.id)
      : await supabase.from("news_posts").insert(payload);

    setLoading(false);
    if (error) {
      toast.error("Kunde inte spara");
      return;
    }
    toast.success(post ? "Uppdaterad" : "Skapad");
    router.push("/admin/news");
    router.refresh();
  }

  async function handleDelete() {
    if (!post || !confirm("Ta bort detta nyhetsinlägg?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("news_posts").delete().eq("id", post.id);
    if (error) {
      toast.error("Kunde inte ta bort");
      return;
    }
    toast.success("Borttagen");
    router.push("/admin/news");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <fieldset disabled={!canEdit} className="space-y-4">
        <div className="space-y-2">
          <Label>Titel *</Label>
          <Input
            value={form.title_sv}
            onChange={(e) => setForm({ ...form, title_sv: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Utdrag</Label>
          <Input
            value={form.excerpt_sv}
            onChange={(e) => setForm({ ...form, excerpt_sv: e.target.value })}
          />
        </div>
        <ImagePicker
          label="Bild"
          showAlt={false}
          previewClassName="max-w-xs"
          value={{
            url: form.image_url,
            alt: form.title_sv || "Nyhetsbild",
          }}
          onChange={(image) => setForm({ ...form, image_url: image.url })}
        />
        <div className="space-y-2">
          <Label>Innehåll *</Label>
          <Textarea
            rows={6}
            value={form.content_sv}
            onChange={(e) => setForm({ ...form, content_sv: e.target.value })}
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) =>
              setForm({ ...form, is_published: e.target.checked })
            }
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
            {post ? (
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
