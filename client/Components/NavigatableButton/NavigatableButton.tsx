import { cn } from '@/lib/utils';

type ButtonLevel = 'primary' | 'secondary' | 'danger' | 'success';
export type Button = {
  label: string;
  url: string;
  level?: ButtonLevel;
  [ k: string ]: unknown;
};

interface Props {
  text: string;
  prefixIcon?: any;
  sufixIcon?: any;
  styleType?: ButtonLevel;
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
      styleClasses = 'text-white bg-brand-secondary border-brand-secondary';
      break;
  }
  return (
    <a href={ link } className={ cn( 'p-3 border rounded-md', 'flex', styleClasses, className ) }>
      { prefixIcon }
      { text }
      { sufixIcon }
    </a>
  );
};

export default NavigatableButton;
