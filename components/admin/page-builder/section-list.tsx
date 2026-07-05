"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, Copy, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTION_TYPE_META } from "@/lib/cms/section-types";
import { cn } from "@/lib/utils";
import type { HomePageSection } from "@/types/cms";

interface SectionListProps {
  sections: HomePageSection[];
  activeId: string;
  onSelect: (id: string) => void;
  onReorder: (sections: HomePageSection[]) => void;
  onToggleVisible: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortableSectionItem({
  section,
  active,
  onSelect,
  onToggleVisible,
  onDuplicate,
  onDelete,
}: {
  section: HomePageSection;
  active: boolean;
  onSelect: () => void;
  onToggleVisible: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const meta = SECTION_TYPE_META[section.type];
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-2 py-2",
        active
          ? "border-[var(--admin-accent,#9E1728)] bg-[var(--admin-info-bg,rgba(158,23,40,0.08))]"
          : "border-neutral-200 bg-white hover:border-neutral-300",
        !section.is_visible && "opacity-60",
      )}
    >
      <button
        type="button"
        className="cursor-grab text-neutral-400 hover:text-neutral-700"
        aria-label="Flytta sektion"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-900">
            {section.title}
          </p>
          <p className="truncate text-xs text-neutral-500">{meta.label}</p>
        </div>
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-neutral-400",
            active && "text-[var(--admin-accent,#9E1728)]",
          )}
        />
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onDuplicate}
        aria-label="Duplicera sektion"
      >
        <Copy className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onToggleVisible}
        aria-label={section.is_visible ? "Dölj sektion" : "Visa sektion"}
      >
        {section.is_visible ? (
          <Eye className="size-4" />
        ) : (
          <EyeOff className="size-4" />
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onDelete}
        aria-label="Ta bort sektion"
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  );
}

export function SectionList({
  sections,
  activeId,
  onSelect,
  onReorder,
  onToggleVisible,
  onDuplicate,
  onDelete,
}: SectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex).map(
      (section, index) => ({ ...section, sort_order: index }),
    );
    onReorder(reordered);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((section) => section.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sections.map((section) => (
            <SortableSectionItem
              key={section.id}
              section={section}
              active={section.id === activeId}
              onSelect={() => onSelect(section.id)}
              onToggleVisible={() => onToggleVisible(section.id)}
              onDuplicate={() => onDuplicate(section.id)}
              onDelete={() => onDelete(section.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
