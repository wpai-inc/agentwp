import React from 'react';
import Logo from "@/Components/Logo";
import { cn } from "@/lib/utils";

export default function LoadingScreen() {
  return (
    <div className={cn(
      'w-full h-full flex flex-col justify-center items-center'
    )}>
      <Logo className="animate-pulse-bounce" />
      <h1 className={cn(
        'font-bold mt-3'
      )}>
        Getting things ready for you...
      </h1>
    </div>
  )
};
