"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm } from "@/components/site/contact-form";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const copy = {
  sv: {
    title: "Hör av dig",
    description:
      "Har du frågor, feedback eller vill veta mer? Skicka ett meddelande så återkommer vi.",
  },
  en: {
    title: "Get in touch",
    description:
      "Have questions, feedback or want to know more? Send us a message and we will get back to you.",
  },
} as const;

interface ContactDialogTriggerProps {
  className?: string;
  ariaLabel: string;
  locale?: Locale;
}

export function ContactDialogTrigger({
  className,
  ariaLabel,
  locale = "sv",
}: ContactDialogTriggerProps) {
  const [open, setOpen] = useState(false);
  const text = copy[locale];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        aria-label={ariaLabel}
        className={cn(className)}
        onClick={() => setOpen(true)}
      >
        <Mail className="size-4" />
      </button>

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
          <ContactForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
