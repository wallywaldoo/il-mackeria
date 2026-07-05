"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/admin/page-builder/image-picker";
import { SectionSettingsEditor } from "@/components/admin/page-builder/section-settings-editor";
import type { HomePageSection } from "@/types/cms";
import type { ContentBlock, SectionContentMap, SectionSettings } from "@/lib/cms/schemas";

interface SectionEditorProps {
  section: HomePageSection;
  onContentChange: (content: HomePageSection["content"]) => void;
  onTitleChange: (title: string) => void;
  onSettingsChange: (settings: SectionSettings) => void;
}

function ParagraphFields({
  paragraphs,
  onChange,
}: {
  paragraphs: string[];
  onChange: (paragraphs: string[]) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>Textstycken</Label>
      {paragraphs.map((paragraph, index) => (
        <div key={index} className="space-y-1">
          <Label className="text-xs text-neutral-500">Stycke {index + 1}</Label>
          <Textarea
            value={paragraph}
            rows={4}
            onChange={(e) => {
              const next = [...paragraphs];
              next[index] = e.target.value;
              onChange(next);
            }}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...paragraphs, ""])}
      >
        Lägg till stycke
      </Button>
    </div>
  );
}

function ContentBlocksEditor({
  content,
  onChange,
}: {
  content: SectionContentMap["content_blocks"];
  onChange: (content: SectionContentMap["content_blocks"]) => void;
}) {
  function updateBlock(index: number, block: ContentBlock) {
    const blocks = [...content.blocks];
    blocks[index] = block;
    onChange({ ...content, blocks });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Etikett</Label>
        <Input
          value={content.label ?? ""}
          onChange={(e) => onChange({ ...content, label: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Rubrik</Label>
        <Input
          value={content.heading ?? ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>

      {content.blocks.map((block, index) => {
        if (block.type === "text") {
          return (
            <div
              key={block.id}
              className="space-y-3 rounded-lg border border-neutral-200 p-4"
            >
              <p className="text-sm font-medium text-neutral-900">Textblock</p>
              <div className="space-y-2">
                <Label>Etikett</Label>
                <Input
                  value={block.label ?? ""}
                  onChange={(e) =>
                    updateBlock(index, { ...block, label: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Rubrik</Label>
                <Input
                  value={block.heading ?? ""}
                  onChange={(e) =>
                    updateBlock(index, { ...block, heading: e.target.value })
                  }
                />
              </div>
              <ParagraphFields
                paragraphs={block.paragraphs}
                onChange={(paragraphs) =>
                  updateBlock(index, { ...block, paragraphs })
                }
              />
            </div>
          );
        }

        if (block.type === "image") {
          return (
            <div
              key={block.id}
              className="space-y-3 rounded-lg border border-neutral-200 p-4"
            >
              <p className="text-sm font-medium text-neutral-900">Bildblock</p>
              <ImagePicker
                label="Bild"
                value={block.image}
                onChange={(image) => updateBlock(index, { ...block, image })}
              />
              <div className="space-y-2">
                <Label>Bildtext</Label>
                <Input
                  value={block.caption ?? ""}
                  onChange={(e) =>
                    updateBlock(index, { ...block, caption: e.target.value })
                  }
                />
              </div>
            </div>
          );
        }

        return (
          <div
            key={block.id}
            className="space-y-3 rounded-lg border border-neutral-200 p-4"
          >
            <p className="text-sm font-medium text-neutral-900">CTA-block</p>
            <div className="space-y-2">
              <Label>Rubrik</Label>
              <Input
                value={block.heading}
                onChange={(e) =>
                  updateBlock(index, { ...block, heading: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Text</Label>
              <Textarea
                value={block.description ?? ""}
                rows={3}
                onChange={(e) =>
                  updateBlock(index, { ...block, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Knapptext</Label>
                <Input
                  value={block.buttonLabel}
                  onChange={(e) =>
                    updateBlock(index, { ...block, buttonLabel: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Länk</Label>
                <Input
                  value={block.buttonHref}
                  onChange={(e) =>
                    updateBlock(index, { ...block, buttonHref: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SectionEditor({
  section,
  onContentChange,
  onTitleChange,
  onSettingsChange,
}: SectionEditorProps) {
  const content = section.content as SectionContentMap[typeof section.type];

  let contentEditor: React.ReactNode = null;

  switch (section.type) {
    case "flag_band":
      contentEditor = (
        <p className="text-sm text-neutral-500">
          Den italienska flagglinjen har inga egna texter. Använd växeln i
          sektionslistan för att visa eller dölja den.
        </p>
      );
      break;

    case "hero": {
      const hero = content as SectionContentMap["hero"];
      contentEditor = (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Knapptext för meny</Label>
              <Input
                value={hero.menuButtonLabel ?? ""}
                placeholder="Se menyn"
                onChange={(e) =>
                  onContentChange({
                    ...hero,
                    menuButtonLabel: e.target.value || undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Knapptext för catering</Label>
              <Input
                value={hero.bookingButtonLabel}
                onChange={(e) =>
                  onContentChange({ ...hero, bookingButtonLabel: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Adress</Label>
            <Input
              value={hero.addressLabel ?? ""}
              placeholder="Södra Hamngatan 20 · Strömstad"
              onChange={(e) =>
                onContentChange({
                  ...hero,
                  addressLabel: e.target.value || undefined,
                })
              }
            />
            <p className="text-xs text-neutral-500">
              Texten som visas under knapparna i heron.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Länk till karta</Label>
            <Input
              value={hero.addressUrl ?? ""}
              placeholder="https://maps.google.com/..."
              onChange={(e) =>
                onContentChange({
                  ...hero,
                  addressUrl: e.target.value || undefined,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rubrik för skärmläsare</Label>
            <Input
              value={hero.srOnlyTitle}
              onChange={(e) =>
                onContentChange({ ...hero, srOnlyTitle: e.target.value })
              }
            />
            <p className="text-xs text-neutral-500">
              Syns inte visuellt, men beskriver heron för tillgänglighet och
              sidstruktur.
            </p>
          </div>
          <ImagePicker
            label="Mobilbild"
            value={hero.mobileImage}
            onChange={(mobileImage) => onContentChange({ ...hero, mobileImage })}
          />
          <ImagePicker
            label="Desktopbild"
            value={hero.desktopImage}
            onChange={(desktopImage) =>
              onContentChange({ ...hero, desktopImage })
            }
          />
        </div>
      );
      break;
    }

    case "intro":
    case "schiacciata": {
      const block = content as SectionContentMap["intro"];
      contentEditor = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Etikett</Label>
            <Input
              value={block.label}
              onChange={(e) => onContentChange({ ...block, label: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Rubrik</Label>
            <Input
              value={block.heading}
              onChange={(e) =>
                onContentChange({ ...block, heading: e.target.value })
              }
            />
          </div>
          <ParagraphFields
            paragraphs={block.paragraphs}
            onChange={(paragraphs) => onContentChange({ ...block, paragraphs })}
          />
          <ImagePicker
            label="Bild"
            value={block.image}
            onChange={(image) => onContentChange({ ...block, image })}
          />
        </div>
      );
      break;
    }

    case "menu": {
      const menu = content as SectionContentMap["menu"];
      contentEditor = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Etikett</Label>
            <Input
              value={menu.label}
              onChange={(e) => onContentChange({ ...menu, label: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Rubrik</Label>
            <Input
              value={menu.heading}
              onChange={(e) =>
                onContentChange({ ...menu, heading: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Prisrad</Label>
            <Input
              value={menu.priceLine}
              onChange={(e) =>
                onContentChange({ ...menu, priceLine: e.target.value })
              }
            />
          </div>
        </div>
      );
      break;
    }

    case "news": {
      const news = content as SectionContentMap["news"];
      contentEditor = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Etikett</Label>
            <Input
              value={news.label}
              onChange={(e) => onContentChange({ ...news, label: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Rubrik</Label>
            <Input
              value={news.heading}
              onChange={(e) =>
                onContentChange({ ...news, heading: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Antal inlägg</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={news.postCount}
              onChange={(e) =>
                onContentChange({
                  ...news,
                  postCount: Number(e.target.value) || 1,
                })
              }
            />
          </div>
          <p className="text-sm text-neutral-500">
            Själva nyhetsinläggen redigeras under Nyheter i sidomenyn.
          </p>
        </div>
      );
      break;
    }

    case "content_blocks":
      contentEditor = (
        <ContentBlocksEditor
          content={content as SectionContentMap["content_blocks"]}
          onChange={onContentChange}
        />
      );
      break;

    case "instagram": {
      const instagram = content as SectionContentMap["instagram"];
      contentEditor = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Etikett</Label>
            <Input
              value={instagram.label}
              onChange={(e) =>
                onContentChange({ ...instagram, label: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rubrik</Label>
            <Input
              value={instagram.heading}
              onChange={(e) =>
                onContentChange({ ...instagram, heading: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Länktext</Label>
            <Input
              value={instagram.linkLabel}
              onChange={(e) =>
                onContentChange({ ...instagram, linkLabel: e.target.value })
              }
            />
          </div>
        </div>
      );
      break;
    }

    case "booking": {
      const booking = content as SectionContentMap["booking"];
      contentEditor = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Etikett</Label>
            <Input
              value={booking.label}
              onChange={(e) =>
                onContentChange({ ...booking, label: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rubrik</Label>
            <Input
              value={booking.heading}
              onChange={(e) =>
                onContentChange({ ...booking, heading: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Text</Label>
            <Textarea
              value={booking.description}
              rows={4}
              onChange={(e) =>
                onContentChange({ ...booking, description: e.target.value })
              }
            />
          </div>
          <ImagePicker
            label="Bild"
            value={booking.image}
            onChange={(image) => onContentChange({ ...booking, image })}
          />
        </div>
      );
      break;
    }

    case "location": {
      const location = content as SectionContentMap["location"];
      contentEditor = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Etikett</Label>
            <Input
              value={location.label}
              onChange={(e) =>
                onContentChange({ ...location, label: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rubrik</Label>
            <Input
              value={location.heading}
              onChange={(e) =>
                onContentChange({ ...location, heading: e.target.value })
              }
            />
          </div>
        </div>
      );
      break;
    }
  }

  return (
    <div className="space-y-4">
      <SectionSettingsEditor
        section={section}
        onTitleChange={onTitleChange}
        onSettingsChange={onSettingsChange}
      />
      {contentEditor}
    </div>
  );
}
