import { useState, createContext, useContext } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import type { UserRequestType, AgentAction } from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useError } from '@/Providers/ErrorProvider';
import { useInputSelect } from './InputSelectProvider';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { useAdminRoute } from './AdminRouteProvider';
import { StreamableFieldType } from '@/Types/types';
import { optimistic } from '@/lib/utils';
import { StreamingStatusEnum } from '@/Types/enums';

type CreateUserRequestResponse = {
  stream_url: string;
  user_request: UserRequestType;
};

type ChatSettingProps = { component: React.ReactNode; header: string } | null;

type StoreRequestType = {
  id: string | null;
  message: string;
  selected_input: StreamableFieldType | null;
  site_data?: any[];
};

type ChatContextType = {
  conversation: UserRequestType[];
  isEmptyConversation: boolean;
  sendMessage: ( message: string ) => void;
  updateAgentMessage: ( urId: string, updatedAa: AgentAction ) => void;
  cancelMessage: () => void;
  setChatSetting: ( setting: ChatSettingProps ) => void;
  chatSetting: ChatSettingProps;
  clearHistory: () => void;
  open: boolean;
  setOpen: ( open: boolean ) => void;
  snippetPlugin: string | null;
  setSnippetPlugin: ( plugin: string | null ) => void;
  message: string;
  setMessage: ( message: string ) => void;
  messageSubmitted: boolean;
  addUserRequest: ( ur: UserRequestType ) => void;
  removeUserRequest: ( ur: UserRequestType ) => void;
};

const ChatContext = createContext< ChatContextType | undefined >( undefined );

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
  const [ message, setMessage ] = useState( '' );
  const [ messageSubmitted, setMessageSubmitted ] = useState< boolean >( false );
  const [ chatSetting, setChatSetting ] = useState< ChatSettingProps >( null );
  const {
    conversation,
    setConversation,
    clearConversation: clear,
    createUserRequest,
    currentUserRequestId,
    setCurrentUserRequestId,
  } = useUserRequests();
  const { startStream, cancelStream, setStreamingStatus, streamingStatus } = useStream();
  const { selectedInput } = useInputSelect();
  const { addErrors } = useError();
  const { adminRequest } = useAdminRoute();
  const [ snippetPlugin, setSnippetPlugin ] = useState< string | null >( null );

  async function clearHistory() {
    optimistic( clearConversation, clear, ( e: any ) => {
      console.error( 'SETTING conversation clear history' );
      setConversation( conversation );
      addErrors( [ e ] );
    } );
  }

  async function userRequest(
    message: string,
    id: string | null = null,
  ): Promise< CreateUserRequestResponse > {
    let req: StoreRequestType = {
      id,
      message,
      selected_input: selectedInput,
    };
    if ( streamingStatus === StreamingStatusEnum.OFF ) {
      setStreamingStatus( StreamingStatusEnum.CONVO );
    }
    const siteData = await adminRequest.get( 'site_data' );
    if ( siteData.data?.data ) {
      req.site_data = siteData.data.data;
    }

    const response = await client.storeConversation( req );
    return response.data;
  }

  /**
   * Adds or updates a msg in the conversation
   * @returns void
   * @param urId
   * @param updatedAa
   */
  function updateAgentMessage( urId: string, updatedAa: AgentAction ) {
    if ( urId === currentUserRequestId ) {
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
  }

  function addUserRequest( ur: UserRequestType ) {
    setConversation( [ ur, ...conversation ] );
  }

  function removeUserRequest( ur: UserRequestType ) {
    setConversation( conversation.filter( item => item.id !== ur.id ) );
  }

  async function sendMessage( message: string ) {
    const ur = createUserRequest( message );
    setMessageSubmitted( true );

    await optimistic(
      async () => {
        const { user_request } = await userRequest( ur.message, ur.id );
        setCurrentUserRequestId( user_request.id );
        await startStream( user_request.id );
      },
      () => {
        setMessage( '' );
        addUserRequest( ur );
      },
      ( e: any ) => {
        addErrors( [ e ] );
        setMessage( message );
        setStreamingStatus( StreamingStatusEnum.OFF );
      },
    );

    setMessageSubmitted( false );
  }

  function cancelMessage() {
    if ( currentUserRequestId ) {
      setMessageSubmitted( false );
      cancelStream( currentUserRequestId );
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
        cancelMessage,
        setChatSetting,
        chatSetting,
        clearHistory,
        open,
        setOpen,
        message,
        setMessage,
        messageSubmitted,
        snippetPlugin,
        setSnippetPlugin,
        addUserRequest,
        removeUserRequest,
      } }>
      { children }
    </ChatContext.Provider>
  );
}
