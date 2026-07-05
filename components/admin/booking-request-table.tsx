"use client";

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

interface Props {
  bookings: BookingRequest[];
}

export function BookingRequestTable({ bookings }: Props) {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
