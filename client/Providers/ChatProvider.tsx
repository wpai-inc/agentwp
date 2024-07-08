import React, { useState, createContext, useContext, useEffect } from 'react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { useStream } from '@/Providers/StreamProvider';
import type { UserRequestType, AgentAction } from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useError } from '@/Providers/ErrorProvider';
import { WriteToEditor } from '@/Services/WriteToEditor';
import { type BlockType } from '@/Types/types';

type CreateUserRequestResponse = {
  user_request_id: string;
  stream_url: string;
};

type ChatSettingProps = { component: React.ReactNode; header: string } | null;

const ChatContext = createContext( {
  open: false,
  setOpen: ( _open: boolean ) => {},
  toggle: () => {},
  maximizeChatWindow: ( _element: HTMLElement ) => {},
  reduceWindow: () => {},
  isMaximized: false,
  minimizing: false,
  expanding: false,
  maximizing: false,
  reducing: false,
  conversation: [] as UserRequestType[],
  sendMessage: ( _message: string ) => {},
  setChatSetting: ( _setting: ChatSettingProps ) => {},
  chatSetting: null as ChatSettingProps,
} );

export function useChat() {
  const chat = useContext( ChatContext );
  if ( ! chat ) {
    throw new Error( 'useChat must be used within a ChatProvider' );
  }
  return chat;
}

export default function ChatProvider( {
  defaultOpen = false,
  children,
}: {
  defaultOpen?: boolean;
  children: React.ReactNode;
} ) {
  const { client } = useClient();
  const { settings, setSettings } = useClientSettings();
  const [ open, setOpen ] = useState( settings.chatOpen ?? defaultOpen );
  const [ minimizing, setMinimizing ] = useState( false );
  const [ expanding, setExpanding ] = useState( false );
  const [ maximizing, setMaximizing ] = useState( false );
  const [ reducing, setReducing ] = useState( false );
  const [ isMaximized, setIsMaximized ] = useState( settings.chatMaximized ?? false );
  const [ chatSetting, setChatSetting ] = useState< ChatSettingProps >( null );
  const { conversation, setConversation, currentUserRequestId } = useUserRequests();
  const { startStream, liveAction, error } = useStream();
  const { addErrors } = useError();
  const [ editorContent, setEditorContent ] = useState< BlockType[] >( [] );

  useEffect( () => {
    if ( liveAction && currentUserRequestId ) {
      if ( liveAction.action.ability === 'write_to_editor' && liveAction.action.text ) {
        const text = liveAction.action.text.replace( /```json/g, '' ).replace( /```/g, '' );
        const newEditorContent = WriteToEditor( text, editorContent );
        if ( newEditorContent ) {
          console.log( 'newEditorContent', newEditorContent );
          setEditorContent( newEditorContent );
        }
      } else if ( liveAction.action.ability === 'message' ) {
        console.log( 'liveAction', liveAction );
        updateAgentMessage( currentUserRequestId, liveAction );
      }
    }
  }, [ liveAction, currentUserRequestId ] );

  useEffect( () => {
    if ( error ) {
      console.error( 'Stream error:', error );
    }
  }, [ error ] );

  function toggle() {
    const newVal = ! open;
    if ( newVal ) {
      setExpanding( true );
    } else {
      setMinimizing( true );
    }

    setTimeout( () => {
      setOpen( newVal );
      setExpanding( false );
      setMinimizing( false );
      setIsMaximized( false );
      setSettings( {
        chatOpen: newVal,
        chatMaximized: false,
        x: 0,
        y: 0,
        width: null,
        height: null,
      } );
    }, 1400 );
  }

  function maximizeChatWindow( chatWindowElement: HTMLElement ) {
    setMaximizing( true );
    setTimeout( () => {
      setMaximizing( false );
      setIsMaximized( true );
      chatWindowElement.removeAttribute( 'style' );
      chatWindowElement.style.transform = 'translate(0px, 0px)';
      setSettings( {
        chatMaximized: true,
        x: 0,
        y: 0,
        width: null,
        height: null,
      } );
    }, 1000 );
  }

  function reduceWindow() {
    setReducing( true );
    setTimeout( () => {
      setReducing( false );
      setIsMaximized( false );
      setSettings( {
        chatMaximized: false,
        x: 0,
        y: 0,
        width: null,
        height: null,
      } );
    }, 1000 );
  }

  async function userRequest( message: string ): Promise< CreateUserRequestResponse > {
    const response = await client.storeConversation( { message } );

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

  async function sendMessage( message: string ) {
    try {
      const { stream_url, user_request_id } = await userRequest( message );
      addUserRequest( {
        id: user_request_id,
        message: message,
      } as UserRequestType );
      startStream( stream_url, user_request_id );
    } catch ( e: any ) {
      addErrors( [ e.message ] );
      console.error( e );
    }
  }

  return (
    <ChatContext.Provider
      value={ {
        open,
        setOpen,
        toggle,
        maximizeChatWindow,
        reduceWindow,
        isMaximized,
        maximizing,
        reducing,
        minimizing,
        expanding,
        conversation,
        sendMessage,
        setChatSetting,
        chatSetting,
      } }>
      { children }
    </ChatContext.Provider>
  );
}
