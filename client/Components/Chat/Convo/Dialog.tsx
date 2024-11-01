import React from 'react';
import Message from '@/Components/Chat/Convo/Message/Message';
import {
  ConvoPagination,
  UserRequestType,
  useUserRequests,
} from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { usePage } from '@/Providers/PageProvider';
import InnerContainer from '@/Components/Chat/Partials/ChatInnerContainer';

function DialogComponent( {
  conversation,
  messageSubmitted,
  pagination,
  onScrollToTop,
}: {
  conversation: UserRequestType[];
  messageSubmitted: boolean;
  pagination: ConvoPagination;
  onScrollToTop: () => void;
} ) {
  const { page } = usePage();
  const { alertMessage } = useUserRequests();

  const handleScrollToTop = () => {
    if ( pagination.next ) {
      onScrollToTop();
    }
  };

  return (
    <InnerContainer className="flex-col-reverse" onTop={ handleScrollToTop }>
      { ! conversation.length ? (
        <ChatWelcome user={ page.user } />
      ) : (
        <>
          { alertMessage ? alertMessage : null }
          { conversation.map( userRequest => (
            <Message
              key={ userRequest.id }
              submitted={ messageSubmitted }
              userRequest={ userRequest }
            />
          ) ) }
        </>
      ) }
    </InnerContainer>
  );
}

const Dialog = React.memo( DialogComponent );

export default Dialog;
