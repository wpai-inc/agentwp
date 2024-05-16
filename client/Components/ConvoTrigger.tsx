import { cn } from '@/lib/utils';
import ArrowRightIcon from '@material-design-icons/svg/outlined/keyboard_double_arrow_right.svg?react';
import { useChat } from '@/Providers/ChatProvider';
import { Button } from "@/Components/ui/button";

export default function ConvoTrigger() {
  const { open, toggle, expanding } = useChat();

  return (
    <Button
      onClick={toggle}
      variant="ghost"
      className={cn(
        'fixed hidden bottom-12 right-0 p-2',
        'rounded-none rounded-tl-lg rounded-bl-lg',
        'transition bg-white ',
        'justify-center items-center',
        {
          'z-50 block transition': !open,
          'hidden': expanding,
        },
      )}
    >
      <ArrowRightIcon />
    </Button>
  );
}
