"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSectionPresetEditable,
  normalizeSectionSettings,
} from "@/lib/cms/section-presets";
import type { HomePageSection } from "@/types/cms";
import type { SectionSettings } from "@/lib/cms/schemas";

const LAYOUT_OPTIONS: Partial<
  Record<HomePageSection["type"], { value: string; label: string }[]>
> = {
  news: [
    { value: "grid", label: "Rutnät" },
    { value: "featured", label: "Utvald" },
    { value: "compact", label: "Kompakt lista" },
  ],
  content_blocks: [
    { value: "text_image", label: "Text + bild" },
    { value: "image_text", label: "Bild + text" },
    { value: "text_only", label: "Endast text" },
    { value: "cta", label: "CTA" },
  ],
};

interface SectionSettingsEditorProps {
  section: HomePageSection;
  onTitleChange: (title: string) => void;
  onSettingsChange: (settings: SectionSettings) => void;
}

export function SectionSettingsEditor({
  section,
  onTitleChange,
  onSettingsChange,
}: SectionSettingsEditorProps) {
  const editable = getSectionPresetEditable(section.type);
  const layoutOptions = LAYOUT_OPTIONS[section.type] ?? [];
  const normalizedSettings = normalizeSectionSettings(
    section.type,
    section.settings,
  );

  function updateSettings(next: SectionSettings) {
    onSettingsChange(normalizeSectionSettings(section.type, next));
  }

  return (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Sektionsinställningar
        </p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          Nya sektioner följer samma typografi, padding och färger som resten av
          sidan automatiskt.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Namn i admin</Label>
        <Input
          value={section.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="T.ex. Nyheter"
        />
      </div>

      {layoutOptions.length > 0 ? (
        <div className="space-y-2">
          <Label>Layout</Label>
          <Select
            value={normalizedSettings.layout ?? layoutOptions[0].value}
            onValueChange={(value) =>
              value && updateSettings({ ...section.settings, layout: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {layoutOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {editable.anchorId ? (
        <div className="space-y-2">
          <Label>Ankarlänk (valfritt)</Label>
          <Input
            value={normalizedSettings.anchorId ?? ""}
            onChange={(e) =>
              updateSettings({
                ...section.settings,
                anchorId: e.target.value || undefined,
              })
            }
            placeholder="t.ex. nyheter"
          />
        </div>
      ) : null}
    </div>
  );
}
