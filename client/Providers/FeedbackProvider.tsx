import { createContext, FC, useContext, useState } from 'react';
import { useClient } from '@/Providers/ClientProvider';

export type FeedbackType = {
  approved?: boolean;
  message?: string;
};

interface ContextProps {
  handleApproval: ( approved: boolean ) => void;
  sendFeedback: ( approved: boolean, message?: string ) => void;
  approved?: boolean;
  feedback?: FeedbackType;
  opened: boolean;
  setOpened: ( opened: boolean ) => void;
}

export const FeedbackContext = createContext< ContextProps | undefined >( undefined );

export function useFeedback() {
  const ctx = useContext( FeedbackContext );
  if ( ! ctx ) {
    throw new Error( 'useFeedback must be used within FeedbackProvider' );
  }
  return ctx;
}

export const FeedbackProvider: FC< {
  userRequestId: string;
  feedback?: FeedbackType;
  children: React.ReactNode;
} > = ( { children, userRequestId, feedback } ) => {
  const [ approved, setApproved ] = useState< boolean | undefined >( feedback?.approved );
  const [ opened, setOpened ] = useState< boolean >( false );

  const { client } = useClient();

  async function sendFeedback( approved: boolean, message?: string ) {
    client.isAuthorized()?.feedback( userRequestId, {
      approved,
      message,
    } );
  }

  function handleApproval( approved: boolean ) {
    setApproved( approved );
    sendFeedback( approved );
    setOpened( approved === false );
  }

  return (
    <FeedbackContext.Provider
      value={ {
        handleApproval,
        sendFeedback,
        approved,
        opened,
        setOpened,
      } }>
      { children }
    </FeedbackContext.Provider>
  );
};
