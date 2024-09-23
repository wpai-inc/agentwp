import { cn } from '@/lib/utils';

/**
 * Expands to the full heigh of the chat and overflows the inner content.
 */
export default function InnerContainer( {
  children,
  className,
  onTop,
}: {
  children: React.ReactNode;
  className?: string;
  onTop?: () => void;
} ) {
  /**
   * Determine when scrolled to the bottom of the chat.
   */
  const handleScroll = ( e: React.UIEvent< HTMLDivElement > ) => {
    const element = e.target as HTMLDivElement;
    const totalScrolled = Math.abs( element.scrollTop - element.clientHeight - 2 );
    if ( totalScrolled > element.scrollHeight ) {
      onTop?.();
    }
  };

  return (
    <div
      onScroll={ handleScroll }
      className={ cn(
        'relative mx-auto flex w-full max-w-screen-md flex-1 flex-col overflow-y-auto py-4 pb-12',
        className,
      ) }>
      { children }
    </div>
  );
}
