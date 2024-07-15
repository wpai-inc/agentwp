import { cn } from '@/lib/utils';

interface Props {
  text: string;
  prefixIcon?: any;
  sufixIcon?: any;
  styleType?: 'primary' | 'secondary';
  link: string;
  className?: string;
}

const NavigatableButton = ( {
  text,
  prefixIcon,
  sufixIcon,
  link,
  styleType = 'primary',
  className,
}: Props ) => {
  let styleClasses;
  switch ( styleType ) {
    case 'primary':
      styleClasses = 'text-white bg-brand-primary border-brand-primary';
      break;
    case 'secondary':
      styleClasses = 'text-neutral border-neutral-300';
      break;
  }
  return (
    <a
      href={ link }
      target="_blank"
      className={ cn( 'py-2 px-3 border-2 rounded-full', 'flex', styleClasses, className ) }>
      { prefixIcon }
      { text }
      { sufixIcon }
    </a>
  );
};

export default NavigatableButton;
