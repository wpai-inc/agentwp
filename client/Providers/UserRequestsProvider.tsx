import React, { useState, createContext, useContext, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import { MessageAction, NavigateAction, QueryAction } from '@wpai/schemas';
import { FeedbackType } from '@/Types/types';

export type ActionType = NavigateAction | MessageAction | QueryAction;

export type AgentAction = {
  id: string;
  created_at: string;
  human_created_at: string;
  action: ActionType;
  final: boolean;
  recipe_idx: number;
  result: any;
  hasExecuted: boolean;
};

export type UserRequestType = {
  id: string;
  message: string;
  user: {
    name: string;
    email: string;
  };
  created_at: string;
  human_created_at: string;
  wp_user_id?: number;
  agent_actions: AgentAction[];
  feedback?: FeedbackType;
};

type UserRequestsContextType = {
  conversation: UserRequestType[];
  setConversation: React.Dispatch< React.SetStateAction< UserRequestType[] > >;
  currentUserRequestId: string | null;
  setCurrentUserRequestId: React.Dispatch< React.SetStateAction< string | null > >;
  currentAction: AgentAction | null;
  setCurrentAction: ( action: AgentAction | null ) => void;
  fetchConvo: () => Promise< void >;
};

const UserRequestsContext = createContext< UserRequestsContextType >( {
  conversation: [],
  setConversation: () => {},
  currentUserRequestId: null,
  setCurrentUserRequestId: () => {},
  currentAction: null,
  setCurrentAction: () => {},
  fetchConvo: async () => {},
} );

export function useUserRequests() {
  const chat = useContext( UserRequestsContext );
  if ( ! chat ) {
    throw new Error( 'useUserRequests must be used within a UserRequestsProvider' );
  }
  return chat;
}

export default function UserRequestsProvider( {
  messages = [],
  children,
}: {
  messages?: UserRequestType[];
  children: React.ReactNode;
} ) {
  const { getConversation } = useClient();
  const [ conversation, setConversation ] = useState< UserRequestType[] >( messages );
  const [ currentUserRequestId, setCurrentUserRequestId ] = useState< string | null >( null );
  const [ currentAction, setCurrentAction ] = useState< AgentAction | null >( null );

  useEffect( () => {
    fetchConvo();
  }, [] );

  useEffect( () => {
    const currentRequest: UserRequestType | undefined = conversation.find(
      request => request.id === currentUserRequestId,
    );

    const currentAction: AgentAction | null = currentRequest?.agent_actions
      ? currentRequest?.agent_actions[ currentRequest?.agent_actions.length - 1 ]
      : null;

    setCurrentAction( currentAction );
  }, [ currentUserRequestId, conversation ] );

  async function fetchConvo() {
    const items = await getConversation();
    if ( items && items.length > 0 ) {
      setCurrentUserRequestId( items[ 0 ]?.id );
      setConversation( items );
    } else {
      setCurrentUserRequestId( null );
      setConversation( [] );
    }
  }

  return (
    <UserRequestsContext.Provider
      value={ {
        conversation,
        setConversation,
        currentUserRequestId,
        setCurrentUserRequestId,
        currentAction,
        setCurrentAction,
        fetchConvo,
      } }>
      { children }
    </UserRequestsContext.Provider>
  );
}
