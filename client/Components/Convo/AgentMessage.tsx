export default function AgentMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 flex items-center justify-center font-bold bg-blue-500 text-white rounded-full">
        A
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
