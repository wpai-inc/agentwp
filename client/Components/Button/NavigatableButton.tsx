import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  text: string;
  link: string;
  className: string;
}

const NavigatableButton = ({
  text,
  link,
  className
}: Props) => {
  return (
    <a href={link}
       className={cn(
         'p-3',
         className
       )}
    >
      {text}
    </a>
  );
};

export default NavigatableButton;
