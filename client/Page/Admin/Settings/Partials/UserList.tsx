export default function UserList( {
  children,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} ) {
  return <div { ...rest }>{ children }</div>;
}
