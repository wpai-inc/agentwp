export default function TabContainer( { children }: { children: React.ReactNode } ) {
  return <div className="relative flex flex-1 flex-col overflow-auto">{ children }</div>;
}
