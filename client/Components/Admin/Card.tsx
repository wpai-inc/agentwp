import { cn } from '@/lib/utils';

export function Card( {
  children,
  className,
  title,
  ...rest
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
} ) {
  return (
    <div className={ cn( 'bg-white rounded-md p-4', className ) } { ...rest }>
      { title && <h2 className="font-bold mb-4">{ title }</h2> }
      { children }
    </div>
  );
}
