import { CalendarDays } from "lucide-react";

import { AdminPanel } from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { BookingRequestTable } from "@/components/admin/booking-request-table";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";
import { getAdminBookingRequests } from "@/lib/data/admin-site";

export default async function AdminBookingsPage() {
  await requirePanelAccess();
  const bookings = await getAdminBookingRequests();

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Bokningar"
        description="Se och hantera bokningsförfrågningar."
      />
      <AdminPanel
        icon={CalendarDays}
        title="Förfrågningar"
        description={`${bookings.length} förfrågningar`}
      >
        <BookingRequestTable bookings={bookings} />
      </AdminPanel>
    </AdminPageContainer>
  );
}
