import { useState, createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import {
  Graph,
  MessageAction,
  MessageActionEscalation,
  NavigateAction,
  QueryAction,
  WriteToEditorAction,
} from '@wpai/schemas';
import { FeedbackType } from '@/Providers/FeedbackProvider';
import { usePage } from './PageProvider';
// @ts-ignore
import { generate as uuid } from 'ordered-uuid-v4';
import { optimistic } from '@/lib/utils';
import transformMentionedMessage from '@/Components/Chat/MessageBox/helpers/transformMentionedMessage';
import getMentionsFromText from '@/Components/Chat/MessageBox/helpers/getMentionsFromText';
import { useRestRequest } from './RestRequestProvider';

export type ActionType =
  | NavigateAction
  | MessageAction
  | QueryAction
  | WriteToEditorAction
  | Graph
  | MessageActionEscalation;

export type AgentAction = App.Data.AgentActionData;

export type UserRequestType = {
  id: string;
  message: string;
  mentions: any[];
  user: {
    name: string;
    email: string;
  };
  created_at: string;
  human_created_at: string;
  agent_actions: AgentAction[];
  feedback?: FeedbackType;
  status?: string;
};

export type ConvoPagination = {
  current: number | null;
  next: boolean;
};

type UserRequestsContextType = {
  conversation: UserRequestType[];
  pagination: ConvoPagination;
  setConversation: React.Dispatch< React.SetStateAction< UserRequestType[] > >;
  clearConversation: () => void;
  createUserRequest: ( message: string ) => UserRequestType;
  removeUserRequest: ( ur: UserRequestType ) => void;
  currentUserRequestId: string | null;
  currentUserRequest?: UserRequestType;
  setCurrentUserRequestId: React.Dispatch< React.SetStateAction< string | null > >;
  currentAction: AgentAction | null;
  updateCurrentAction: ( action: AgentAction ) => void;
  fetchConvo: ( since: string | null ) => Promise< void >;
  fetchMore: () => Promise< void >;
  refreshConvo: () => void;
  loadingConversation: boolean;
  since: string | null;
  setSince: React.Dispatch< React.SetStateAction< string | null > >;
  addActionToCurrentRequest: ( action: AgentAction ) => void;
  setRequestAborted: ( userRequestId: string ) => void;
  alertMessage: null | React.ReactNode;
  setAlertMessage: React.Dispatch< React.SetStateAction< null | React.ReactNode > >;
};

const UserRequestsContext = createContext< UserRequestsContextType >(
  {} as UserRequestsContextType,
);

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
  const { page } = usePage();
  const { proxyApiRequest } = useRestRequest();
  const [ since, setSince ] = useState< string | null >( null );
  const [ conversation, setConversation ] = useState< UserRequestType[] >( messages );
  const [ pagination, setPagination ] = useState< ConvoPagination >( { current: 1, next: false } );
  const [ loadingConversation, setLoadingConversation ] = useState< boolean >( true );
  const [ currentUserRequestId, setCurrentUserRequestId ] = useState< string | null >( null );
  const [ refresh, setRefresh ] = useState< boolean >( false );
  const [ alertMessage, setAlertMessage ] = useState< null | React.ReactNode >( null );

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

  /**
   * The currentUserRequest is always the last request in the conversation.
   */
  const currentUserRequest = useMemo(
    () => conversation.find( request => request.id === currentUserRequestId ),
    [ conversation, currentUserRequestId ],
  );

  /**
   * The currentAction is always the last action in the currentUserRequest.
   */
  const currentAction = useMemo(
    () =>
      currentUserRequest?.agent_actions
        ? currentUserRequest?.agent_actions[ currentUserRequest?.agent_actions.length - 1 ]
        : null,
    [ currentUserRequest ],
  );

  // update the current action (last agent action) of the current user request
  const updateCurrentAction = useCallback(
    function ( action: AgentAction ) {
      if ( currentUserRequest ) {
        setConversation( conversation => {
          return conversation.map( request => {
            if ( request.id === currentUserRequest.id ) {
              return {
                ...request,
                agent_actions: [
                  ...request.agent_actions.filter( a => a.id !== action.id ),
                  action,
                ],
              };
            }
            return request;
          } );
        } );
      }
    },
    [ conversation, currentUserRequest ],
  );

  const addActionToCurrentRequest = useCallback(
    function ( action: AgentAction ) {
      if ( currentUserRequestId ) {
        setConversation( conversation => {
          return conversation.map( request => {
            if (
              request.id === currentUserRequestId &&
              ! request.agent_actions.includes( action )
            ) {
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

  const removeUserRequest = useCallback(
    function ( ur: UserRequestType ) {
      setConversation( conversation.filter( item => item.id !== ur.id ) );
    },
    [ conversation ],
  );

  const setRequestAborted = useCallback(
    function ( userRequestId: string ) {
      if ( userRequestId && currentUserRequestId === userRequestId ) {
        setConversation( conversation => {
          return conversation.map( request => {
            if ( request.id === userRequestId ) {
              return {
                ...request,
                status: 'aborted',
              };
            }
            return request;
          } );
        } );
      }
    },
    [ conversation, currentUserRequestId ],
  );

  function createUserRequest( message: string ): UserRequestType {
    return {
      id: uuid(),
      message: transformMentionedMessage( message ),
      mentions: getMentionsFromText( message ),
      user: {
        // @ts-ignore
        name: page.user.name,
        // @ts-ignore
        email: page.user.email,
      },
      created_at: new Date().toISOString(),
      human_created_at: 'just now',
      agent_actions: [],
    };
  }

  function clearConversation() {
    setConversation( [] );
  }

  async function fetchConvo( since?: string | null ) {
    const data: App.Data.Request.ConvoData = { since: since ?? null, page: 1 };
    const items = await optimistic(
      async () => await proxyApiRequest< App.Data.UserRequestData[] >( 'convo', data ),
      () => setLoadingConversation( true ),
      convoLoadFailure,
    );

    if ( items && items.data && items.data.length > 0 ) {
      setLoadingConversation( false );
      setCurrentUserRequestId( items.data[ 0 ]?.id );
      setConversation( items.data );
      setPagination( { current: items.current_page, next: items.next_page_url !== null } );
    } else {
      convoLoadFailure();
    }
  }

  async function fetchMore() {
    const data: App.Data.Request.ConvoData = {
      since: since ?? null,
      page: pagination.current ? pagination.current + 1 : 1,
    };

    const items = await optimistic(
      async () => await proxyApiRequest< App.Data.UserRequestData[] >( 'convo', data ),
    );

    if ( items && items.data && items.data.length > 0 ) {
      setConversation( [ ...conversation, ...items.data ] );
      setPagination( { current: items.current_page, next: items.next_page_url !== null } );
    }
  }

  function convoLoadFailure() {
    setLoadingConversation( false );
    setCurrentUserRequestId( null );
    clearConversation();
  }

  return (
    <UserRequestsContext.Provider
      value={ {
        conversation,
        pagination,
        setConversation,
        clearConversation,
        createUserRequest,
        removeUserRequest,
        currentUserRequestId,
        currentUserRequest,
        setCurrentUserRequestId,
        currentAction,
        updateCurrentAction,
        fetchConvo,
        fetchMore,
        refreshConvo,
        loadingConversation,
        since,
        setSince,
        addActionToCurrentRequest,
        setRequestAborted,
        alertMessage,
        setAlertMessage,
      } }>
      { children }
    </UserRequestsContext.Provider>
  );
}
