import ArrowRightIcon from '@material-design-icons/svg/outlined/keyboard_double_arrow_right.svg?react';
import Logo from '../../Logo';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

export default function ToggleButton( {
  ref,
  open,
  onClick,
  className,
}: {
  ref: any;
  open: boolean;
  onClick: () => void;
  className?: string;
} ) {
  return (
    <Button
      ref={ ref }
      onClick={ onClick }
      variant="ghost"
      className={ cn(
        'fixed bottom-12 w-9 h-9 right-0 py-1 px-2 rounded-none rounded-l-lg transition bg-white justify-center items-center shadow-lg z-[10000]',
        className,
      ) }>
      { open ? <ArrowRightIcon /> : <Logo className="w-full" /> }
      <div className="absolute -top-4 -right-1 h-5 w-5 rounded-full border-b-4 border-white -rotate-45"></div>
      <div className="absolute -bottom-4 -right-1 h-5 w-5 rounded-full border-t-4 border-white rotate-45"></div>
    </Button>
  );
}
