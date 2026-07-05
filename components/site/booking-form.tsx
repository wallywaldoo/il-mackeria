"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BOOKING_TYPES, siteFormFieldClass } from "@/lib/constants";
import { bookingSchema, type BookingFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  onSuccess?: () => void;
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  async function onSubmit(data: BookingFormData) {
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = (await res.json()) as {
        success?: boolean;
        emailSent?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(body.error ?? "Något gick fel");
      }

      if (body.success && body.emailSent === false) {
        toast.message(
          body.message ??
            "Din förfrågan är sparad, men bekräftelsemail kunde inte skickas.",
        );
      } else {
        toast.success("Tack! Vi har tagit emot din bokningsförfrågan.");
      }
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Kunde inte skicka förfrågan",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Namn *</Label>
          <Input id="name" className={siteFormFieldClass} {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-post *</Label>
          <Input id="email" type="email" className={siteFormFieldClass} {...register("email")} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input id="phone" type="tel" className={siteFormFieldClass} {...register("phone")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="requested_date">Önskat datum *</Label>
          <Input id="requested_date" type="date" className={siteFormFieldClass} {...register("requested_date")} />
          {errors.requested_date && (
            <p className="text-xs text-destructive">
              {errors.requested_date.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="requested_time">Önskad tid *</Label>
          <Input id="requested_time" type="time" className={siteFormFieldClass} {...register("requested_time")} />
          {errors.requested_time && (
            <p className="text-xs text-destructive">
              {errors.requested_time.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="number_of_guests">Antal gäster *</Label>
          <Input
            id="number_of_guests"
            type="number"
            min={1}
            className={siteFormFieldClass}
            {...register("number_of_guests")}
          />
          {errors.number_of_guests && (
            <p className="text-xs text-destructive">
              {errors.number_of_guests.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Typ av bokning *</Label>
          <Select onValueChange={(v) => setValue("booking_type", String(v ?? ""))}>
            <SelectTrigger className={cn("w-full", siteFormFieldClass)}>
              <SelectValue placeholder="Välj typ" />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.booking_type && (
            <p className="text-xs text-destructive">
              {errors.booking_type.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Meddelande</Label>
        <Textarea
          id="message"
          rows={4}
          className={siteFormFieldClass}
          placeholder="Berätta gärna mer om ert event..."
          {...register("message")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="btn-site-lg w-full rounded-full bg-burgundy hover:bg-burgundy-dark sm:w-auto"
      >
        {isSubmitting ? "Skickar..." : "Skicka bokningsförfrågan"}
      </Button>
    </form>
  );
}
