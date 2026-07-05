import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";

export default async function AdminDashboardPage() {
  await requirePanelAccess();
  return <AdminDashboard />;
}
