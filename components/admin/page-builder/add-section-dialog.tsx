"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SECTION_TEMPLATES } from "@/lib/cms/section-templates";
import type { SectionTemplate } from "@/lib/cms/section-templates";

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: SectionTemplate) => void;
}

export function AddSectionDialog({
  open,
  onOpenChange,
  onSelect,
}: AddSectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lägg till sektion</DialogTitle>
          <DialogDescription>
            Välj en färdig mall. Utseendet följer automatiskt sidans
            typografi, padding och färger.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTION_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                onSelect(template);
                onOpenChange(false);
              }}
              className="rounded-xl border border-neutral-200 bg-white p-4 text-left transition hover:border-[var(--admin-accent,#9E1728)]/40 hover:shadow-sm"
            >
              <p className="font-medium text-neutral-900">{template.title}</p>
              <p className="mt-1 text-sm text-neutral-500">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AddSectionButton({
  onSelect,
}: {
  onSelect: (template: SectionTemplate) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        Lägg till sektion
      </Button>
      <AddSectionDialog
        open={open}
        onOpenChange={setOpen}
        onSelect={onSelect}
      />
    </>
  );
}
