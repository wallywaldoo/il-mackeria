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
import type { ContactSubmission } from "@/types/site";

interface Props {
  submissions: ContactSubmission[];
}

export function ContactSubmissionTable({ submissions }: Props) {
  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Kunde inte uppdatera");
      return;
    }
    toast.success("Status uppdaterad");
  }

  if (!submissions.length) {
    return <AdminEmptyState>Inga meddelanden ännu.</AdminEmptyState>;
  }

  return (
    <div className="overflow-x-auto">
      <table className={adminTable.table}>
        <thead className={adminTable.thead}>
          <tr>
            <th className={adminTable.th}>Datum</th>
            <th className={adminTable.th}>Namn</th>
            <th className={adminTable.th}>Ämne</th>
            <th className={adminTable.th}>Meddelande</th>
            <th className={adminTable.th}>Status</th>
          </tr>
        </thead>
        <tbody className={adminTable.tbody}>
          {submissions.map((s) => (
            <tr key={s.id} className={adminTable.tr}>
              <td className={adminTable.td}>
                {format(new Date(s.created_at), "d MMM yyyy", { locale: sv })}
                <br />
                <span className="text-xs text-neutral-500">
                  {format(new Date(s.created_at), "HH:mm", { locale: sv })}
                </span>
              </td>
              <td className={adminTable.tdMedium}>
                {s.name}
                <br />
                <a
                  href={`mailto:${s.email}`}
                  className="text-xs font-normal text-neutral-500 hover:text-[var(--admin-accent,#9E1728)]"
                >
                  {s.email}
                </a>
              </td>
              <td className={adminTable.td}>{s.subject}</td>
              <td className={`${adminTable.td} max-w-xs`}>
                <p className="line-clamp-3 whitespace-pre-wrap text-sm" title={s.message}>
                  {s.message}
                </p>
              </td>
              <td className={adminTable.td}>
                <Select
                  value={s.status}
                  onValueChange={(v) => v && updateStatus(s.id, v)}
                >
                  <SelectTrigger className="h-9 w-32 rounded-lg border-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nytt</SelectItem>
                    <SelectItem value="read">Läst</SelectItem>
                    <SelectItem value="replied">Besvarat</SelectItem>
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
