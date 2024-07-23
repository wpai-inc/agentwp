import React, { useState, createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import { MessageAction, NavigateAction, QueryAction, WriteToEditorAction } from '@wpai/schemas';
import { FeedbackType } from '@/Providers/FeedbackProvider';

export type ActionType = NavigateAction | MessageAction | QueryAction | WriteToEditorAction;

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
  agent_actions: AgentAction[];
  feedback?: FeedbackType;
};

type UserRequestsContextType = {
  conversation: UserRequestType[];
  setConversation: React.Dispatch< React.SetStateAction< UserRequestType[] > >;
  currentUserRequestId: string | null;
  currentUserRequest?: UserRequestType;
  setCurrentUserRequestId: React.Dispatch< React.SetStateAction< string | null > >;
  currentAction: AgentAction | null;
  fetchConvo: ( since: string | null ) => Promise< void >;
  refreshConvo: () => void;
  loadingConversation: boolean;
  since: string | null;
  setSince: React.Dispatch< React.SetStateAction< string | null > >;
  addActionToCurrentRequest: ( userRequestId: string, action: AgentAction ) => void;
};

const UserRequestsContext = createContext< UserRequestsContextType >( {
  conversation: [],
  setConversation: () => {},
  currentUserRequestId: null,
  currentUserRequest: undefined,
  setCurrentUserRequestId: () => {},
  currentAction: null,
  fetchConvo: async () => {},
  refreshConvo: () => {},
  loadingConversation: false,
  since: null,
  setSince: () => {},
  addActionToCurrentRequest: () => {},
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
  const [ since, setSince ] = useState< string | null >( null );
  const [ conversation, setConversation ] = useState< UserRequestType[] >( messages );
  const [ loadingConversation, setLoadingConversation ] = useState< boolean >( true );
  const [ currentUserRequestId, setCurrentUserRequestId ] = useState< string | null >( null );
  const [ refresh, setRefresh ] = useState< boolean >( false );

  const refreshConvo = () => {
    setRefresh( prev => ! prev );
  };

  useEffect( () => {
    fetchConvo( since );
  }, [ since, refresh ] );

  useEffect( () => {
    const handleRouteChange = () => {
      fetchConvo( since );
    };

    window.addEventListener( 'popstate', handleRouteChange );
    return () => {
      window.removeEventListener( 'popstate', handleRouteChange );
    };
  }, [] );

  const currentUserRequest = useMemo(
    () => conversation.find( request => request.id === currentUserRequestId ),
    [ conversation, currentUserRequestId ],
  );

  const currentAction = useMemo(
    () =>
      currentUserRequest?.agent_actions
        ? currentUserRequest?.agent_actions[ currentUserRequest?.agent_actions.length - 1 ]
        : null,
    [ currentUserRequest ],
  );

  const addActionToCurrentRequest = useCallback(
    function ( userRequestId: string, action: AgentAction ) {
      if ( userRequestId ) {
        setConversation( conversation => {
          return conversation.map( request => {
            if ( request.id === userRequestId ) {
              return {
                ...request,
                agent_actions: [ ...request.agent_actions, action ],
              };
            }
            return request;
          } );
        } );
      }
    },
    [ conversation, currentUserRequestId ],
  );

  async function fetchConvo( since: string | null ) {
    const items = await getConversation( since );
    if ( items && items.length > 0 ) {
      setCurrentUserRequestId( items[ 0 ]?.id );
      setConversation( items );
    } else {
      setCurrentUserRequestId( null );
      setConversation( [] );
    }

    setLoadingConversation( false );
  }

  return (
    <UserRequestsContext.Provider
      value={ {
        conversation,
        setConversation,
        currentUserRequestId,
        currentUserRequest,
        setCurrentUserRequestId,
        currentAction,
        fetchConvo,
        refreshConvo,
        loadingConversation,
        since,
        setSince,
        addActionToCurrentRequest,
      } }>
      { children }
    </UserRequestsContext.Provider>
  );
}
