import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { getSettingDefaultValues, useClientSettings } from '@/Providers/ClientSettingsProvider';
import { useStream } from '@/Providers/StreamProvider';
import type { UserRequestType, AgentAction } from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useError } from '@/Providers/ErrorProvider';
import { WriteToEditor } from '@/Services/WriteToEditor';
import { type BlockType } from '@/Types/types';
import { getChatwindowElement, resetChatWindowPosition } from '@/lib/utils';
import { Rnd } from 'react-rnd';

type CreateUserRequestResponse = {
  stream_url: string;
  user_request: UserRequestType;
};
type PositionType = { x?: number; y?: number } | undefined;
export type SizeType =
  | {
      width?: string | number;
      height?: string | number;
    }
  | undefined;
type ChatSettingProps = { component: React.ReactNode; header: string } | null;

const ChatContext = createContext( {
  open: false,
  setOpen: ( _open: boolean ) => {},
  toggle: () => {},
  maximizeChatWindow: () => {},
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
  position: undefined as PositionType,
  setPosition: ( _position: PositionType ) => {},
  chatRef: null as React.LegacyRef< Rnd >,
  size: undefined as SizeType,
  setSize: ( _size: SizeType ) => {},
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
  const chatRef: React.LegacyRef< Rnd > = useRef( null );
  const { client } = useClient();
  const [ position, setPosition ] = useState< PositionType >();
  const [ size, setSize ] = useState< SizeType >();
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

  const setPositionHandler = ( position: PositionType ) => {
    setPosition( position );
  };
  const setSizeHandler = ( size: SizeType ) => {
    setSize( size );
  };

  useEffect( () => {
    if ( liveAction && currentUserRequestId ) {
      if ( liveAction.action.ability === 'write_to_editor' && liveAction.action.text ) {
        const text = liveAction.action.text.replace( /```json/g, '' ).replace( /```/g, '' );
        const newEditorContent = WriteToEditor( text, editorContent );
        if ( newEditorContent ) {
          setEditorContent( newEditorContent );
        }
      } else if ( liveAction.action.ability === 'message' ) {
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
    const settingsDefaultValues = getSettingDefaultValues();
    resetChatWindowPosition();
    setTimeout( () => {
      setOpen( newVal );
      setExpanding( false );
      setMinimizing( false );
      setIsMaximized( false );
      setSettings( {
        chatOpen: newVal,
        chatMaximized: false,
        x: settingsDefaultValues.x,
        y: settingsDefaultValues.y,
        width: settingsDefaultValues.width,
        height: settingsDefaultValues.height,
      } );
      setSizeHandler( {
        width: settingsDefaultValues.width,
        height: settingsDefaultValues.height,
      } );
    }, 1400 );
  }

  const maximizeChatWindow = () => {
    const newPositionX = screen.width * 0.14;
    const newPositionY = -screen.height * 1.12;
    setPositionHandler( { x: newPositionX, y: newPositionY } );
    const newWidth = screen.width * 0.85;
    const newHeight = screen.height * 0.8;
    setSizeHandler( {
      width: newWidth,
      height: newHeight,
    } );

    const chatWindowElement = getChatwindowElement();
    setMaximizing( true );
    setTimeout( () => {
      setMaximizing( false );
      setIsMaximized( true );
      if ( chatWindowElement ) {
        chatWindowElement.removeAttribute( 'style' );
        chatWindowElement.style.transform = 'translate(0px, 0px)';
      }
      setSettings( {
        chatMaximized: true,
        x: newPositionX,
        y: newPositionY,
        width: newWidth,
        height: newHeight,
      } );
    }, 1000 );
  };

  function reduceWindow() {
    const settingsDefaultValues = getSettingDefaultValues();
    setReducing( true );
    setTimeout( () => {
      setReducing( false );
      setIsMaximized( false );
      setSettings( {
        ...settings,
        x: settingsDefaultValues.x,
        y: settingsDefaultValues.y,
        width: settingsDefaultValues.width,
        height: settingsDefaultValues.height,
      } );
      setSizeHandler( {
        width: settingsDefaultValues.width,
        height: settingsDefaultValues.height,
      } );
      setPositionHandler( {
        x: settingsDefaultValues.x,
        y: settingsDefaultValues.y,
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
      const { stream_url, user_request } = await userRequest( message );
      addUserRequest( user_request );
      startStream( stream_url, user_request.id );
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
        position,
        setPosition: setPositionHandler,
        chatRef,
        size,
        setSize: setSizeHandler,
      } }>
      { children }
    </ChatContext.Provider>
  );
}
