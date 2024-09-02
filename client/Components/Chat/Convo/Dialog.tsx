import React from 'react';
import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { usePage } from '@/Providers/PageProvider';

function DialogComponent( {
  conversation,
  messageSubmitted,
}: {
  conversation: UserRequestType[];
  messageSubmitted: boolean;
} ) {
  const { page } = usePage();

  return (
    <InnerContainer>
      { ! conversation.length ? (
        <ChatWelcome user={ page.user } />
      ) : (
        conversation.map( userRequest => (
          <Message
            key={ userRequest.id }
            submitted={ messageSubmitted }
            userRequest={ userRequest }
          />
        ) )
      ) }
    </InnerContainer>
  );
}

function InnerContainer( { children }: { children: React.ReactNode } ) {
  return (
    <div className="relative mx-auto flex w-full max-w-screen-md flex-1 flex-col-reverse overflow-y-auto py-4">
      { children }
    </div>
  );
}

const Dialog = React.memo( DialogComponent );

export default Dialog;
