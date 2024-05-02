import { useState, useCallback } from 'react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';
import { useStream } from '@/Providers/StreamProvider';

export default function MessageBox() {
  const { sendMessage } = useChat();
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

  return (
    <form
      className="p-2 m-2 bg-white focus-within:ring-2 focus-within:ring-blue-400 ring-1 ring-gray-200"
      onSubmit={submit}
    >
      <textarea
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="w-full h-24 p-2 focus:ring-0"
        placeholder="Type your message here..."
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-end items-center">
        <Button type="submit" disabled={!streamClosed}>
          {streamClosed ? 'Send' : 'Pending...'}
        </Button>
      </div>
    </form>
  );
}
