export function Tag( { children }: { children: React.ReactNode } ) {
  return (
    <div
      className={
        'uppercase font-bold text-xs bg-gray-100 text-black text-opacity-50 px-3 rounded-full'
      }>
      { children }
    </div>
  );
}
