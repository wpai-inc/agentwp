import React from 'react';
import { cn } from "@/lib/utils";

type Props = {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export default function Handle({
  position,
  className
}: Props) {
  const postionClasses = {
    'top-left': cn(
      'cursor-nw-resize',
      'border-t-4 border-l-4 rounded-tl-full -top-1 -left-1',
      'hover:-top-2 hover:-left-2'
    ),
    'top-right': cn(
      'cursor-sw-resize',
      'border-t-4 border-r-4 rounded-tr-full -top-1 -right-1',
      'hover:-top-2 hover:-right-2'
    ),
    'bottom-left': cn(
      'cursor-sw-resize',
      'border-b-4 border-l-4 rounded-bl-full -bottom-1 -left-1',
      'hover:-bottom-2 hover:-left-2'
    ),
    'bottom-right': cn(
      'cursor-nw-resize',
      'border-b-4 border-r-4 rounded-br-full -bottom-1 -right-1',
      'hover:-bottom:-2 hover:-right-2'
    ),
  }
  return (
    <div className={cn(
      'absolute w-5 h-5 border-slate-400 hover:border-brand-primary',
      'transition-all',
      postionClasses[position],
      className,
    )}>

    </div>
  );
}
