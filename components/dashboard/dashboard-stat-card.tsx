type DashboardStatCardProps = {
  label: string;
  value: string | number;
  description: string;
};

export function DashboardStatCard({
  label,
  value,
  description,
}: DashboardStatCardProps) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-neutral-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-neutral-500">{description}</p>
    </article>
  );
}
