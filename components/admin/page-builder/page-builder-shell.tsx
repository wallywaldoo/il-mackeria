"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Monitor, Smartphone, ChevronLeft } from "lucide-react";
import { AdminPrimaryButton } from "@/components/admin/admin-ui";
import { useAdminPermissions } from "@/components/admin/layout/admin-permissions-provider";
import { Button } from "@/components/ui/button";
import { AddSectionButton } from "@/components/admin/page-builder/add-section-dialog";
import { PagePreview } from "@/components/admin/page-builder/page-preview";
import { SectionEditor } from "@/components/admin/page-builder/section-editor";
import { SectionList } from "@/components/admin/page-builder/section-list";
import { SECTION_TYPE_META } from "@/lib/cms/section-types";
import {
  createSectionFromTemplate,
  type SectionTemplate,
} from "@/lib/cms/section-templates";
import { normalizeSectionSettings } from "@/lib/cms/section-presets";
import { isNewSectionId } from "@/lib/cms/merge-sections";
import { validateHomePageSections } from "@/lib/cms/validate-sections";
import { createClient } from "@/lib/supabase/client";
import type { HomePageSection, PageRecord } from "@/types/cms";
import type { MenuItem, NewsPost, OpeningHour } from "@/types/site";
import type { SectionSettings } from "@/lib/cms/schemas";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PageBuilderShellProps {
  initialPage: PageRecord;
  menuItems: MenuItem[];
  openingHours: OpeningHour[];
  contactEmail: string;
  newsPosts: NewsPost[];
}

type SaveState = "idle" | "saving" | "saved" | "error";
type SidebarView = "list" | "edit";

export function PageBuilderShell({
  initialPage,
  menuItems,
  openingHours,
  contactEmail,
  newsPosts,
}: PageBuilderShellProps) {
  const router = useRouter();
  const { canEdit } = useAdminPermissions();
  const [sections, setSections] = useState<HomePageSection[]>(initialPage.sections);
  const [activeId, setActiveId] = useState(initialPage.sections[0]?.id ?? "");
  const [sidebarView, setSidebarView] = useState<SidebarView>("list");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isDirty, setIsDirty] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const initialSectionIdsRef = useRef(
    new Set(initialPage.sections.map((section) => section.id)),
  );
  const deletedSectionIdsRef = useRef<string[]>([]);

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) ?? sections[0],
    [sections, activeId],
  );

  const markDirty = useCallback(() => {
    setIsDirty(true);
    setSaveState("idle");
  }, []);

  const saveDraft = useCallback(async (): Promise<boolean> => {
    if (initialPage.id === "default-home") {
      setSaveState("error");
      toast.error("Supabase är inte konfigurerat");
      return false;
    }

    setSaveState("saving");
    const supabase = createClient();

    for (const sectionId of deletedSectionIdsRef.current) {
      const { error } = await supabase
        .from("page_sections")
        .delete()
        .eq("id", sectionId);
      if (error) {
        setSaveState("error");
        toast.error("Kunde inte ta bort sektion");
        return false;
      }
    }

    const idReplacements = new Map<string, string>();

    for (const section of sections) {
      const payload = {
        page_id: initialPage.id,
        type: section.type,
        title: section.title,
        sort_order: section.sort_order,
        is_visible: section.is_visible,
        draft_content: section.content,
        draft_settings: section.settings,
        updated_at: new Date().toISOString(),
      };

      if (isNewSectionId(section.id)) {
        const { data, error } = await supabase
          .from("page_sections")
          .insert(payload)
          .select("id")
          .single();

        if (error || !data) {
          setSaveState("error");
          toast.error("Kunde inte skapa ny sektion");
          return false;
        }

        idReplacements.set(section.id, data.id);
        initialSectionIdsRef.current.add(data.id);
      } else {
        const { error } = await supabase
          .from("page_sections")
          .update(payload)
          .eq("id", section.id);

        if (error) {
          setSaveState("error");
          toast.error("Kunde inte spara utkast");
          return false;
        }
      }
    }

    if (idReplacements.size > 0) {
      setSections((current) =>
        current.map((section) => {
          const nextId = idReplacements.get(section.id);
          return nextId ? { ...section, id: nextId } : section;
        }),
      );
      const activeReplacement = idReplacements.get(activeId);
      if (activeReplacement) setActiveId(activeReplacement);
    }

    deletedSectionIdsRef.current = [];

    await supabase
      .from("pages")
      .update({
        status: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", initialPage.id);

    setSaveState("saved");
    setIsDirty(false);
    toast.success("Utkast sparat");
    return true;
  }, [sections, initialPage.id, activeId]);

  function updateSection(
    id: string,
    patch: Partial<Pick<HomePageSection, "content" | "title" | "settings">>,
  ) {
    setSections((current) =>
      current.map((section) =>
        section.id === id ? { ...section, ...patch } : section,
      ),
    );
    markDirty();
  }

  function handleReorder(nextSections: HomePageSection[]) {
    setSections(nextSections);
    markDirty();
  }

  function handleToggleVisible(id: string) {
    setSections((current) =>
      current.map((section) =>
        section.id === id
          ? { ...section, is_visible: !section.is_visible }
          : section,
      ),
    );
    markDirty();
  }

  function handleSelectSection(id: string) {
    setActiveId(id);
    setSidebarView("edit");
  }

  function handleBackToList() {
    setSidebarView("list");
  }

  function handleAddTemplate(template: SectionTemplate) {
    const nextSection = createSectionFromTemplate(template, sections.length);
    setSections((current) => [...current, nextSection]);
    setActiveId(nextSection.id);
    setSidebarView("edit");
    markDirty();
  }

  function handleDuplicate(id: string) {
    const source = sections.find((section) => section.id === id);
    if (!source) return;

    const copy: HomePageSection = {
      ...structuredClone(source),
      id: `new-${crypto.randomUUID()}`,
      title: `${source.title} (kopia)`,
      settings: normalizeSectionSettings(source.type, source.settings),
    };

    const index = sections.findIndex((section) => section.id === id);
    const next = [...sections];
    next.splice(index + 1, 0, copy);
    setSections(
      next.map((section, sortIndex) => ({ ...section, sort_order: sortIndex })),
    );
    setActiveId(copy.id);
    setSidebarView("edit");
    markDirty();
  }

  function handleDelete(id: string) {
    const section = sections.find((item) => item.id === id);
    if (!section) return;

    const confirmed = window.confirm(
      `Ta bort sektionen "${section.title}"? Detta gäller utkastet tills du publicerar.`,
    );
    if (!confirmed) return;

    if (!isNewSectionId(id)) {
      deletedSectionIdsRef.current.push(id);
      initialSectionIdsRef.current.delete(id);
    }

    const next = sections
      .filter((item) => item.id !== id)
      .map((item, index) => ({ ...item, sort_order: index }));

    setSections(next);
    if (activeId === id) {
      setActiveId(next[0]?.id ?? "");
      setSidebarView("list");
    }
    markDirty();
  }

  async function handlePublish() {
    const validationErrors = validateHomePageSections(sections);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const confirmed = window.confirm(
      "Publicera ändringarna? Detta syns direkt på den riktiga startsidan.",
    );
    if (!confirmed) return;

    setPublishing(true);
    const saved = await saveDraft();
    if (!saved) {
      setPublishing(false);
      return;
    }

    const response = await fetch("/api/admin/pages/home/publish", {
      method: "POST",
    });

    setPublishing(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      toast.error(body?.error ?? "Kunde inte publicera");
      return;
    }

    toast.success("Startsidan är publicerad");
    router.refresh();
  }

  async function handleResetSection() {
    if (!activeSection || isNewSectionId(activeSection.id)) {
      toast.error("Nya sektioner kan inte återställas");
      return;
    }

    const confirmed = window.confirm(
      "Återställa den här sektionen till senast publicerat innehåll?",
    );
    if (!confirmed) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("page_sections")
      .select("content, settings, title")
      .eq("id", activeSection.id)
      .single();

    if (error || !data) {
      toast.error("Kunde inte återställa sektionen");
      return;
    }

    updateSection(activeSection.id, {
      content: data.content,
      settings: data.settings,
      title: data.title ?? activeSection.title,
    });
    toast.success("Sektion återställd");
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            {canEdit ? "Redigera startsidan" : "Visa startsidan"}
          </h1>
          <p className="text-sm text-neutral-500">
            {canEdit
              ? sidebarView === "list"
                ? "Välj en sektion att redigera. Förhandsgranskningen uppdateras till höger."
                : "Redigera sektionen. Den markeras i förhandsgranskningen."
              : "Förhandsgranskning av startsidans sektioner."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canEdit ? (
            <>
              <span
                className={cn(
                  "text-xs font-medium",
                  saveState === "saving" && "text-neutral-500",
                  saveState === "saved" && "text-emerald-700",
                  saveState === "error" && "text-destructive",
                  saveState === "idle" && isDirty && "text-amber-700",
                  saveState === "idle" && !isDirty && "text-neutral-500",
                )}
              >
                {saveState === "saving" && "Sparar utkast..."}
                {saveState === "saved" && "Utkast sparat"}
                {saveState === "error" && "Kunde inte spara"}
                {saveState === "idle" && isDirty && "Osparade ändringar"}
                {saveState === "idle" && !isDirty && "Inga osparade ändringar"}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={!isDirty || saveState === "saving" || publishing}
                onClick={() => void saveDraft()}
              >
                {saveState === "saving" ? "Sparar..." : "Spara utkast"}
              </Button>
              <AdminPrimaryButton
                type="button"
                disabled={publishing}
                onClick={handlePublish}
              >
                {publishing ? "Publicerar..." : "Publicera"}
              </AdminPrimaryButton>
            </>
          ) : null}
        </div>
      </div>

      <div className={cn("grid min-h-0 flex-1", canEdit ? "lg:grid-cols-[24rem_minmax(0,1fr)]" : "")}>
        {canEdit ? (
        <aside className="flex min-h-0 flex-col border-r border-neutral-200 bg-neutral-50">
          {sidebarView === "list" ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
              <h2 className="text-sm font-semibold text-neutral-900">Sektioner</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Klicka på en sektion för att redigera innehåll och inställningar.
              </p>
              <div className="mt-4 space-y-3">
                <AddSectionButton onSelect={handleAddTemplate} />
                <SectionList
                  sections={sections}
                  activeId=""
                  onSelect={handleSelectSection}
                  onReorder={handleReorder}
                  onToggleVisible={handleToggleVisible}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          ) : activeSection ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="border-b border-neutral-200 bg-white px-4 py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-2 mb-3 h-8 px-2 text-neutral-600 hover:text-neutral-900"
                  onClick={handleBackToList}
                >
                  <ChevronLeft className="size-4" />
                  Alla sektioner
                </Button>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      {activeSection.title}
                    </h2>
                    <p className="mt-1 text-xs text-neutral-500">
                      {SECTION_TYPE_META[activeSection.type].description}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetSection}
                  >
                    Återställ
                  </Button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <SectionEditor
                  section={activeSection}
                  onContentChange={(content) =>
                    updateSection(activeSection.id, { content })
                  }
                  onTitleChange={(title) =>
                    updateSection(activeSection.id, { title })
                  }
                  onSettingsChange={(settings: SectionSettings) =>
                    updateSection(activeSection.id, {
                      settings: normalizeSectionSettings(
                        activeSection.type,
                        settings,
                      ),
                    })
                  }
                />
              </div>
            </div>
          ) : null}
        </aside>
        ) : null}

        <section className="flex min-h-0 flex-col">
          <div className="flex items-center justify-end gap-2 border-b border-neutral-200 bg-white px-4 py-2">
            <Button
              type="button"
              size="icon-sm"
              variant={viewport === "desktop" ? "default" : "outline"}
              onClick={() => setViewport("desktop")}
              aria-label="Desktop-förhandsgranskning"
            >
              <Monitor className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant={viewport === "mobile" ? "default" : "outline"}
              onClick={() => setViewport("mobile")}
              aria-label="Mobil-förhandsgranskning"
            >
              <Smartphone className="size-4" />
            </Button>
          </div>
          <PagePreview
            sections={sections}
            menuItems={menuItems}
            openingHours={openingHours}
            contactEmail={contactEmail}
            newsPosts={newsPosts}
            viewport={viewport}
            activeSectionId={
              canEdit && sidebarView === "edit" ? activeSection?.id : undefined
            }
          />
        </section>
      </div>
    </div>
  );
}
