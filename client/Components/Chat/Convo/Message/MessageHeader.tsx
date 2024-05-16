export default function MessageHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">{children}</div>
  );
}
