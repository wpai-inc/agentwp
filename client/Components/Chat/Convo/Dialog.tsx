import React, { useState } from 'react';
import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { useError } from '@/Providers/ErrorProvider';
import { ChatError } from '@/Components/Chat/Alerts/Error';
import { cn } from '@/lib/utils';
import LoadingScreen from '@/Components/Chat/LoadingScreen';

export default function Dialog({
  conversation,
}: {
  conversation: UserRequestType[];
}) {
  const { errors } = useError();
  const [loading, setLoading] = useState(false);
  return (
    <div className={cn(
      'flex-1 flex flex-col-reverse overflow-y-auto p-4 relative'
    )}>
      {loading ? (
        <LoadingScreen />
      ): (
        <>
          {!conversation.length && (
            <ChatWelcome />
          )}
          {conversation.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
        </>
      )}

      {!!errors.length && <ChatError errors={errors} />}
    </div>
  );
}
