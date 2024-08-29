import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const ChatContainer = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    [ key: string ]: any;
  }
>( ( { children, className, ...props }, ref ) => {
  return (
    <div
      ref={ ref }
      className={ cn(
        'bg-white shadow-xl transition-shadow duration-500 flex flex-col rounded-xl',
        className,
      ) }
      { ...props }>
      { children }
    </div>
  );
} );

export default ChatContainer;
