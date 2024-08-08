import { useState, createContext, useContext, useRef } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import type { UserRequestType, AgentAction } from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useError } from '@/Providers/ErrorProvider';
import { useInputSelect } from './InputSelectProvider';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';

type CreateUserRequestResponse = {
  stream_url: string;
  user_request: UserRequestType;
};

type ChatSettingProps = { component: React.ReactNode; header: string } | null;

const ChatContext = createContext( {
  conversation: [] as UserRequestType[],
  isEmptyConversation: false,
  sendMessage: ( _message: string ) => {},
  updateAgentMessage: ( _urId: string, _updatedAa: AgentAction ) => {},
  cancelStreaming: () => {},
  setChatSetting: ( _setting: ChatSettingProps ) => {},
  chatSetting: null as ChatSettingProps,
  clearHistory: () => {},
  open: false,
  setOpen: ( _open: boolean ) => {},
  maybeSendSiteData: () => {},
  pendingSendMessage: false,
} );

export function useChat() {
  const chat = useContext( ChatContext );
  if ( ! chat ) {
    throw new Error( 'useChat must be used within a ChatProvider' );
  }
  return chat;
}

export default function ChatProvider( {
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
} ) {
  const { client, clearConversation } = useClient();
  const { settings } = useClientSettings();
  const [ open, setOpen ] = useState( settings.chatOpen ?? defaultOpen );
  const [ chatSetting, setChatSetting ] = useState< ChatSettingProps >( null );
  const { conversation, setConversation, fetchConvo } = useUserRequests();
  const { startStream } = useStream();
  const { selectedInput } = useInputSelect();
  const { addErrors } = useError();
  const adminRequest = useAdminRoute();
  const [ pendingSendMessage, setPendingSendMessage ] = useState( false );

  const focusPromiseRef = useRef( null );

  async function clearHistory() {
    await clearConversation();
    fetchConvo( null );
  }

  async function userRequest( message: string ): Promise< CreateUserRequestResponse > {
    const response = await client.storeConversation( { message, selected_input: selectedInput } );
    return response.data;
  }

  /**
   * Adds or updates a msg in the conversation
   * @returns void
   * @param urId
   * @param updatedAa
   */
  function updateAgentMessage( urId: string, updatedAa: AgentAction ) {
    setConversation( ( prev: UserRequestType[] ) => {
      return prev.map( function ( msg ) {
        if ( msg.id === urId ) {
          return {
            ...msg,
            agent_actions: msg.agent_actions
              ? msg.agent_actions.some( aa => aa.id === updatedAa.id )
                ? msg.agent_actions.map( aa => ( aa.id === updatedAa.id ? updatedAa : aa ) )
                : [ ...msg.agent_actions, updatedAa ]
              : [ updatedAa ],
          };
        }
        return msg;
      } );
    } );
  }

  function addUserRequest( msg: UserRequestType ) {
    setConversation( [ msg, ...conversation ] );
  }

  async function maybeSendSiteData() {
    if ( ! focusPromiseRef.current ) {
      focusPromiseRef.current = adminRequest.get( 'site_data' );
    }
    return focusPromiseRef.current;
  }

  async function sendMessage( message: string ) {
    try {
      setPendingSendMessage( true );
      await maybeSendSiteData();
      const { stream_url, user_request } = await userRequest( message );
      addUserRequest( user_request );
      startStream( stream_url, user_request.id );
    } catch ( e: any ) {
      addErrors( [ e.message ] );
      console.error( e );
    }
    setPendingSendMessage( false );
  }

  async function cancelStreaming() {
    try {
      const { stream_url, user_request } = await userRequest( '' );
      addUserRequest( user_request );
      startStream( stream_url, user_request.id );
    } catch ( e: any ) {
      addErrors( [ e.message ] );
      console.error( e );
    }
  }

  const isEmptyConversation = conversation.length === 0;

  return (
    <ChatContext.Provider
      value={ {
        conversation,
        isEmptyConversation,
        sendMessage,
        updateAgentMessage,
        cancelStreaming,
        setChatSetting,
        chatSetting,
        clearHistory,
        open,
        setOpen,
        maybeSendSiteData,
        pendingSendMessage,
      } }>
      { children }
    </ChatContext.Provider>
  );
}
