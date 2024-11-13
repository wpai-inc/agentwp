import { useState, createContext, useContext } from 'react';
import { StreamRequestType, useStream } from '@/Providers/StreamProvider';
import type {
  UserRequestType,
  AgentAction,
  ConvoPagination,
} from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useError } from '@/Providers/ErrorProvider';
import { useInputSelect } from './InputSelectProvider';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { useRestRequest } from './RestRequestProvider';
import { optimistic } from '@/lib/utils';
import { StreamingStatusEnum } from '@/Types/enums';
import type { WpResponse } from '@/Types/types';
import OverageAlert from '@/Components/Chat/Convo/Alerts/OverageAlert';

type ChatSettingProps = { component: React.ReactNode; header: string } | null;

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
  reloadConversation: () => void;
  removeUserRequest: ( ur: UserRequestType ) => void;
  fetchMore: () => Promise< void >;
  pagination: ConvoPagination;
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
    fetchMore,
    pagination,
  } = useUserRequests();
  const { startStream, cancelStream, setStreamingStatus, streamingStatus } = useStream();
  const { selectedInput } = useInputSelect();
  const { addErrors } = useError();
  const [ snippetPlugin, setSnippetPlugin ] = useState< string | null >( null );
  const { tryRequest, proxyApiRequest } = useRestRequest();
  const { since, setAlertMessage } = useUserRequests();

  async function clearHistory() {
    await optimistic(
      async () => await proxyApiRequest( 'convoClear' ),
      clear,
      ( e: any ) => {
        setConversation( conversation );
        addErrors( [ e ] );
      },
    );
  }

  async function userRequest(
    message: string,
    id: string | null = null,
    mentions: any[] = [],
  ): Promise< WpResponse< StreamRequestType > > {
    let req: App.Data.Request.StoreUserRequestData = {
      id,
      message,
      mentions,
      selected_input: selectedInput,
      site_data: null,
      since,
    };

    if ( streamingStatus === StreamingStatusEnum.OFF ) {
      setStreamingStatus( StreamingStatusEnum.CONVO );
    }

    const { data } = await tryRequest( 'get', 'site_data' );
    if ( data ) {
      req.site_data = data;
    }

    return await tryRequest(
      'post',
      'create_request',
      req,
      undefined,
      ( e: any ) => {
        setAlertMessage( () => <OverageAlert message={ e } /> );
      },
      false,
    );
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

  function reloadConversation() {
    setConversation( conversation );
  }

  function removeUserRequest( ur: UserRequestType ) {
    setConversation( conversation.filter( item => item.id !== ur.id ) );
  }

  async function sendMessage( message: string ) {
    const ur = createUserRequest( message );
    setMessageSubmitted( true );

    await optimistic(
      async () => {
        const { data } = await userRequest( ur.message, ur.id, ur.mentions );
        setCurrentUserRequestId( data.user_request.id );
        await startStream( data );
      },
      () => {
        setMessage( '' );
        addUserRequest( ur );
      },
      ( e: any ) => {
        addErrors( [ e ] );
        setMessage( message );
        removeUserRequest( ur );
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
        reloadConversation,
        removeUserRequest,
        fetchMore,
        pagination,
      } }>
      { children }
    </ChatContext.Provider>
  );
}
