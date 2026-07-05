"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/site/booking-form";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

const copy = {
  sv: {
    title: "Boka il mackeria",
    description: "Fyll i formuläret så återkommer vi så snart vi kan.",
  },
  en: {
    title: "Book il mackeria",
    description: "Fill in the form and we will get back to you as soon as we can.",
  },
} as const;

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: Locale;
}

export function BookingDialog({
  open,
  onOpenChange,
  locale = "sv",
}: BookingDialogProps) {
  const text = copy[locale];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border border-line/40 bg-cream p-6 sm:max-w-xl md:p-8">
        <DialogHeader className="text-left">
          <DialogTitle className="font-heading text-2xl font-semibold text-charcoal">
            {text.title}
          </DialogTitle>
          <DialogDescription className="text-warm-gray">
            {text.description}
          </DialogDescription>
          <ItalianFlagAccent />
        </DialogHeader>

        <div className="mt-4">
          <BookingForm locale={locale} onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface BookingDialogButtonProps {
  className?: string;
  children?: React.ReactNode;
  locale?: Locale;
  variant?: "default" | "outline";
  onOpen?: () => void;
}

export function BookingDialogButton({
  className,
  children,
  locale = "sv",
  variant = "default",
  onOpen,
}: BookingDialogButtonProps) {
  const [open, setOpen] = useState(false);
  const copy = getUi(locale);

  return (
    <>
      <Button
        type="button"
        size="lg"
        variant={variant}
        className={cn("btn-site-lg rounded-full", className)}
        onClick={() => {
          setOpen(true);
          onOpen?.();
        }}
      >
        {children ?? copy.bookNow}
      </Button>

      <BookingDialog open={open} onOpenChange={setOpen} locale={locale} />
    </>
  );
}
