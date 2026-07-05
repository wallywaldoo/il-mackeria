import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { canEditContent } from "@/lib/auth/permissions";
import {
  parseSectionContent,
  parseSectionSettings,
} from "@/lib/cms/merge-sections";
import { getDefaultSectionTitle } from "@/lib/cms/defaults";
import { validateHomePageSections } from "@/lib/cms/validate-sections";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { HomePageSection } from "@/types/cms";
import type { SectionType } from "@/lib/cms/schemas";
import type { UserProfile } from "@/types/auth";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, created_at")
    .eq("id", user.id)
    .single();

  if (!canEditContent(profile as UserProfile | null)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  const { data: page, error: pageError } = await admin
    .from("pages")
    .select("id")
    .eq("slug", "home")
    .single();

  if (pageError || !page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const { data: sections, error: sectionsError } = await admin
    .from("page_sections")
    .select(
      "id, type, title, sort_order, is_visible, draft_content, content, draft_settings, settings",
    )
    .eq("page_id", page.id)
    .order("sort_order");

  if (sectionsError || !sections) {
    return NextResponse.json({ error: "Sections not found" }, { status: 404 });
  }

  const sectionsToPublish: HomePageSection[] = sections.map((section) => {
    const type = section.type as SectionType;
    const rawContent = section.draft_content ?? section.content;
    const rawSettings = section.draft_settings ?? section.settings;

    return {
      id: section.id,
      type,
      title: section.title ?? getDefaultSectionTitle(type),
      sort_order: section.sort_order,
      is_visible: section.is_visible,
      settings: parseSectionSettings(rawSettings),
      content: parseSectionContent(type, rawContent),
    };
  });

  const validationErrors = validateHomePageSections(sectionsToPublish);
  if (validationErrors.length > 0) {
    return NextResponse.json({ error: validationErrors[0] }, { status: 400 });
  }

  for (const section of sections) {
    const nextContent = section.draft_content ?? section.content;
    const nextSettings = section.draft_settings ?? section.settings;
    const { error } = await admin
      .from("page_sections")
      .update({
        content: nextContent,
        draft_content: nextContent,
        settings: nextSettings,
        draft_settings: nextSettings,
        title: section.title,
        updated_at: new Date().toISOString(),
      })
      .eq("id", section.id);

    if (error) {
      return NextResponse.json({ error: "Publish failed" }, { status: 500 });
    }
  }

  const { error: publishError } = await admin
    .from("pages")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", page.id);

  if (publishError) {
    return NextResponse.json({ error: "Publish failed" }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/en");

  return NextResponse.json({ success: true });
}
