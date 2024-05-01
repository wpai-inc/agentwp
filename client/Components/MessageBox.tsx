import { useState, useCallback } from 'react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';

export default function MessageBox() {
  const { sendMessage } = useChat();
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
    <form className="p-2" onSubmit={submit}>
      <textarea
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="w-full h-24 bg-white p-4 ring-1 ring-gray-400 focus:ring-2 focus:ring-blue-400 border"
        placeholder="Type your message here..."
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-end items-center">
        <Button type="submit">Send</Button>
      </div>
    </form>
  );
}
