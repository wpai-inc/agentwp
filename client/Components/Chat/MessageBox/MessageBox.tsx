import { useState, useCallback } from 'react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';
import { useStream } from '@/Providers/StreamProvider';
import { cn } from '@/lib/utils';
import UpArrowIcon from '@material-design-icons/svg/outlined/arrow_upward.svg?react';
import TuneIcon from '@material-design-icons/svg/outlined/tune.svg?react';

export default function MessageBox() {
  const { sendMessage, openChatOverlay } = useChat();
  const { streamClosed } = useStream();
  const [message, setMessage] = useState('');

  const send = useCallback(
    (msg: string) => {
      sendMessage(msg);
      setMessage('');
    },
    [sendMessage, message],
  );

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send(message);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      send(message);
    }
  }

  function onSettingsClick(e: React.FormEvent) {
    e.preventDefault();
    openChatOverlay('Settings');
  }

  return (
    <form
      className="p-2 m-2 bg-white"
      onSubmit={submit}
    >
      <textarea
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="w-full h-24 p-2 resize-none text-base"
        placeholder="Message..."
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-between items-center">
        <Button
          onClick={onSettingsClick}
          variant="ghost"
          size="icon"
          className="text-brand-gray-50"
        >
          <TuneIcon />
        </Button>
        <Button
          type="submit"
          className={cn(
            'bg-brand-primary rounded px-2'
          )}
          disabled={!streamClosed}
        >
          {streamClosed ?
            <UpArrowIcon /> :
            'Pending...'
          }
        </Button>
      </div>
    </form>
  );
}
