"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminEmptyState, adminTable } from "@/components/admin/admin-ui";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import type { BookingRequest } from "@/types/site";
import { BOOKING_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  bookings: BookingRequest[];
}

export function BookingRequestTable({ bookings }: Props) {
  const router = useRouter();
  const [sendingId, setSendingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("booking_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Kunde inte uppdatera");
      return;
    }
    toast.success("Status uppdaterad");
    router.refresh();
  }

  async function sendConfirmation(booking: BookingRequest) {
    const confirmed = window.confirm(
      `Skicka en bekräftelse via e-post till ${booking.name} (${booking.email})?\n\nBokningen markeras samtidigt som bekräftad.`,
    );
    if (!confirmed) return;

    setSendingId(booking.id);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/confirm`, {
        method: "POST",
      });
      const body = (await res.json()) as {
        success?: boolean;
        statusUpdated?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok || !body.success) {
        throw new Error(body.error ?? "Kunde inte skicka bekräftelse");
      }

      toast.success(body.message ?? `Bekräftelse skickad till ${booking.email}`);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Kunde inte skicka bekräftelse",
      );
    } finally {
      setSendingId(null);
    }
  }

  if (!bookings.length) {
    return <AdminEmptyState>Inga bokningsförfrågningar ännu.</AdminEmptyState>;
  }

  return (
    <div className="overflow-x-auto">
      <table className={adminTable.table}>
        <thead className={adminTable.thead}>
          <tr>
            <th className={adminTable.th}>Datum</th>
            <th className={adminTable.th}>Namn</th>
            <th className={adminTable.th}>Typ</th>
            <th className={adminTable.th}>Gäster</th>
            <th className={adminTable.th}>Status</th>
            <th className={adminTable.th}>Bekräftelse</th>
          </tr>
        </thead>
        <tbody className={adminTable.tbody}>
          {bookings.map((b) => (
            <tr key={b.id} className={adminTable.tr}>
              <td className={adminTable.td}>
                {format(new Date(b.requested_date), "d MMM yyyy", { locale: sv })}
                <br />
                <span className="text-xs text-neutral-500">
                  {b.requested_time?.slice(0, 5)}
                </span>
              </td>
              <td className={adminTable.tdMedium}>
                {b.name}
                <br />
                <span className="text-xs font-normal text-neutral-500">
                  {b.email}
                </span>
              </td>
              <td className={adminTable.td}>
                {BOOKING_TYPES.find((t) => t.value === b.booking_type)?.label ??
                  b.booking_type}
              </td>
              <td className={adminTable.td}>{b.number_of_guests}</td>
              <td className={adminTable.td}>
                <Select
                  value={b.status}
                  onValueChange={(v) => v && updateStatus(b.id, v)}
                >
                  <SelectTrigger className="h-9 w-32 rounded-lg border-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Ny</SelectItem>
                    <SelectItem value="contacted">Kontaktad</SelectItem>
                    <SelectItem value="confirmed">Bekräftad</SelectItem>
                    <SelectItem value="declined">Avböjd</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className={adminTable.td}>
                <button
                  type="button"
                  onClick={() => sendConfirmation(b)}
                  disabled={sendingId === b.id || b.status === "declined"}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full border border-[color:color-mix(in_srgb,var(--admin-accent,#9E1728)_22%,transparent)] bg-white px-3.5 text-xs font-semibold text-[var(--admin-accent,#9E1728)] shadow-sm transition hover:bg-[var(--admin-info-bg,rgba(158,23,40,0.08))] disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  <MailCheck className="size-3.5" />
                  {sendingId === b.id ? "Skickar…" : "Skicka bekräftelse"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
