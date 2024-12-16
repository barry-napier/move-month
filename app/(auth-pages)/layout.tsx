export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid place-items-center p-4">
      {children}
    </div>
  );
}
