export function AdminSupabaseNotice() {
  return (
    <div
      role="status"
      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
    >
      <p className="font-medium">Supabase är inte konfigurerat</p>
      <p className="mt-1 text-amber-900/80">
        Admin visar bara data från databasen. Sätt{" "}
        <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
        och{" "}
        <code className="rounded bg-amber-100 px-1">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        i miljövariablerna för att koppla upp backend.
      </p>
    </div>
  );
}
