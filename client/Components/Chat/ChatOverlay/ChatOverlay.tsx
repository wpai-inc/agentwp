import React, { useState } from "react";
import { cn } from '@/lib/utils';
import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import { Button } from "@/Components/ui/button";
import { useChat } from '@/Providers/ChatProvider';

export default function ChatOverlay({ children }) {
  const [close, setClose] = useState(false);
  const { closeChatOverlay } = useChat();

  function closeClick() {
    setClose(true);
    setTimeout(() => {
      closeChatOverlay();
    }, 1000);
  }

  return (
    <div
      className={cn(
        'bg-white absolute shadow rounded',
        {
          'animate-open-chat-overlay': !close,
          'animate-close-chat-overlay': close
        }
      )}>
      <div className={cn(
        'p-2 flex justify-between'
      )}>
        <div></div>
        <div>
          <Button variant="ghost" onClick={closeClick}>
            <CloseIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
