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
import { siteFormFieldClass } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import { getBookingTypes, getUi } from "@/lib/i18n/messages";
import {
  getBookingSchema,
  type BookingFormData,
} from "@/lib/i18n/validations";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  locale?: Locale;
  onSuccess?: () => void;
}

export function BookingForm({ locale = "sv", onSuccess }: BookingFormProps) {
  const copy = getUi(locale).forms;
  const bookingTypes = getBookingTypes(locale);
  const schema = getBookingSchema(locale);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
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
        throw new Error(body.error ?? copy.genericError);
      }

      if (body.success && body.emailSent === false) {
        toast.message(body.message ?? copy.bookingSaved);
      } else {
        toast.success(copy.bookingSuccess);
      }
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : copy.bookingSendError,
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            {copy.name} {copy.required}
          </Label>
          <Input id="name" className={siteFormFieldClass} {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            {copy.email} {copy.required}
          </Label>
          <Input
            id="email"
            type="email"
            className={siteFormFieldClass}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{copy.phone}</Label>
        <Input
          id="phone"
          type="tel"
          className={siteFormFieldClass}
          {...register("phone")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="requested_date">
            {copy.requestedDate} {copy.required}
          </Label>
          <Input
            id="requested_date"
            type="date"
            className={siteFormFieldClass}
            {...register("requested_date")}
          />
          {errors.requested_date && (
            <p className="text-xs text-destructive">
              {errors.requested_date.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="requested_time">
            {copy.requestedTime} {copy.required}
          </Label>
          <Input
            id="requested_time"
            type="time"
            className={siteFormFieldClass}
            {...register("requested_time")}
          />
          {errors.requested_time && (
            <p className="text-xs text-destructive">
              {errors.requested_time.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="number_of_guests">
            {copy.numberOfGuests} {copy.required}
          </Label>
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
          <Label>
            {copy.bookingType} {copy.required}
          </Label>
          <Select
            onValueChange={(v) => setValue("booking_type", String(v ?? ""))}
          >
            <SelectTrigger className={cn("w-full", siteFormFieldClass)}>
              <SelectValue placeholder={copy.selectType} />
            </SelectTrigger>
            <SelectContent>
              {bookingTypes.map((t) => (
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
        <Label htmlFor="message">{copy.message}</Label>
        <Textarea
          id="message"
          rows={4}
          className={siteFormFieldClass}
          placeholder={copy.bookingMessagePlaceholder}
          {...register("message")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="btn-site-lg w-full rounded-full bg-burgundy hover:bg-burgundy-dark sm:w-auto"
      >
        {isSubmitting ? copy.submitting : copy.sendBookingRequest}
      </Button>
    </form>
  );
}
