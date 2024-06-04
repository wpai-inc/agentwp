import ArrowRightIcon from '@material-design-icons/svg/outlined/keyboard_double_arrow_right.svg?react';
import { useChat } from '@/Providers/ChatProvider';
import { Button } from '@/Components/ui/button';
import Logo from '../Logo';

export default function ChatTrigger( { open }: { open: boolean } ) {
  const { toggle } = useChat();

  return (
    <Button
      onClick={ toggle }
      variant="ghost"
      className="fixed bottom-12 w-9 h-9 right-0 py-1 px-2 rounded-none rounded-l-lg transition bg-white justify-center items-center shadow-lg">
      { open ? <ArrowRightIcon /> : <Logo className="w-full" /> }
      <div className="absolute -top-4 -right-1 h-5 w-5 rounded-full border-b-4 border-white -rotate-45"></div>
      <div className="absolute -bottom-4 -right-1 h-5 w-5 rounded-full border-t-4 border-white rotate-45"></div>
    </Button>
  );
}
