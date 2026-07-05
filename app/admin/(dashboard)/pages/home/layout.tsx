export default function PageBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="-m-4 min-h-full sm:-m-6">{children}</div>;
}
