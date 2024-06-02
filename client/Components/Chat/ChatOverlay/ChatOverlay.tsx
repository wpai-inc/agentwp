import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';

export default function ChatOverlay( {
  children,
  header,
}: {
  children: React.ReactNode;
  header?: string;
} ) {
  const [ close, setClose ] = useState( false );
  const { setChatSetting } = useChat();

  function closeClick() {
    setClose( true );
    setTimeout( () => setChatSetting( null ), 1000 );
  }

  return (
    <div
      className={ cn( 'bg-white absolute shadow rounded', {
        'animate-open-chat-overlay': ! close,
        'animate-close-chat-overlay': close,
      } ) }>
      <div className={ cn( 'p-2 flex items-center justify-between' ) }>
        { header && <h2 className="px-4 font-bold">{ header }</h2> }
        <Button variant="ghost" onClick={ closeClick }>
          <CloseIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">{ children }</div>
    </div>
  );
}
