export function Tag({children}: {children: React.ReactNode}) {
  return (
    <div className={'uppercase font-bold text-xs bg-gray-300 px-3 rounded-full'}>{children}</div>
  );
}
