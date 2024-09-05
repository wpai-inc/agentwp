import React from 'react';
import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { usePage } from '@/Providers/PageProvider';
import InnerContainer from '@/Components/Chat/Partials/ChatInnerContainer';

function DialogComponent( {
  conversation,
  messageSubmitted,
}: {
  conversation: UserRequestType[];
  messageSubmitted: boolean;
} ) {
  const { page } = usePage();

  return (
    <InnerContainer className="flex-col-reverse">
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

const Dialog = React.memo( DialogComponent );

export default Dialog;
