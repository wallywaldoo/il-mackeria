"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { siteFormFieldClass } from "@/lib/constants";

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Något gick fel");
      }

      const body = (await res.json()) as {
        success?: boolean;
        emailSent?: boolean;
        message?: string;
      };

      if (body.success && body.emailSent === false) {
        toast.success(body.message ?? "Meddelandet är sparat.");
      } else {
        toast.success("Tack! Vi har tagit emot ditt meddelande.");
      }
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Kunde inte skicka meddelande",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Namn *</Label>
          <Input id="contact-name" className={siteFormFieldClass} {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">E-post *</Label>
          <Input id="contact-email" type="email" className={siteFormFieldClass} {...register("email")} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">Ämne *</Label>
        <Input id="contact-subject" className={siteFormFieldClass} {...register("subject")} />
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Meddelande *</Label>
        <Textarea id="contact-message" rows={5} className={siteFormFieldClass} {...register("message")} />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="btn-site-lg w-full rounded-full bg-burgundy hover:bg-burgundy-dark sm:w-auto"
      >
        {isSubmitting ? "Skickar..." : "Skicka meddelande"}
      </Button>
    </form>
  );
}
