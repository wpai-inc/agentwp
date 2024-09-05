import { cn } from '@/lib/utils';

/**
 * Expands to the full heigh of the chat and overflows the inner content.
 */
export default function InnerContainer( {
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
} ) {
  return (
    <div
      className={ cn(
        'relative mx-auto flex w-full max-w-screen-md flex-1 flex-col overflow-y-auto py-4 pb-12',
        className,
      ) }>
      { children }
    </div>
  );
}
