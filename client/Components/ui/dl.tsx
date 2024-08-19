export default function DataList( { children }: { children: React.ReactNode } ) {
  return <dl className="grid grid-cols-2 gap-6 max-w-screen-sm mx-auto">{ children }</dl>;
}

export function DataListItem( {
  children,
  label,
}: {
  children: React.ReactNode;
  label: React.ReactNode;
} ) {
  return (
    <>
      <dt className="text-right">{ label }</dt>
      <dd className="text-left">{ children }</dd>
    </>
  );
}
