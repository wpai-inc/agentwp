import { useEffect, useState } from 'react';
import { useChat } from '@/Providers/ChatProvider';
import { useUserRequests } from './UserRequestsProvider';
import { AWPEventChatSinceType, AWPEventChatOpenType } from '@/Types/types';
import { maybeUseChatUI } from '@/Components/Chat/Chat';
import { usePage } from '@/Providers/PageProvider';

const HotKeyProvider: React.FC< { children: React.ReactNode } > = ( { children } ) => {
  const { chatSetting, setChatSetting, cancelMessage, clearHistory } = useChat();
  const { page } = usePage();

  const chatUI = maybeUseChatUI();
  const toggleChat = chatUI?.toggle;

  const { setSince } = useUserRequests();

  /**
   * Close the chat setting with
   * the escape key
   */
  useEffect( () => {
    if ( chatSetting && page.general_settings?.keyboard_shortcuts ) {
      const handleEscape = ( e: KeyboardEvent ) => {
        if ( e.key === 'Escape' ) {
          setChatSetting( null );
        }
      };
      window.addEventListener( 'keydown', handleEscape );
      return () => {
        window.removeEventListener( 'keydown', handleEscape );
      };
    }
  }, [ chatSetting ] );

  /**
   * Toggle the chat with the
   * CMD + L key
   */
  if ( toggleChat && page.general_settings?.keyboard_shortcuts ) {
    useEffect( () => {
      const handleToggle = ( e: KeyboardEvent ) => {
        if ( ( e.metaKey || e.ctrlKey ) && e.key === 'l' ) {
          e.preventDefault();
          toggleChat();
        }
      };
      window.addEventListener( 'keydown', handleToggle );
      return () => {
        window.removeEventListener( 'keydown', handleToggle );
      };
    }, [ toggleChat ] );
  }

  /**
   * New chat with CMD + K
   * CMD + L key
   */
  if ( clearHistory && page.general_settings?.keyboard_shortcuts ) {
    useEffect( () => {
      const handleClearHistory = ( e: KeyboardEvent ) => {
        if ( ( e.metaKey || e.ctrlKey ) && e.key === 'k' ) {
          e.preventDefault();
          clearHistory();
        }
      };
      window.addEventListener( 'keydown', handleClearHistory );
      return () => {
        window.removeEventListener( 'keydown', handleClearHistory );
      };
    }, [ clearHistory ] );
  }

  /**
   * Cancel the chat with the
   * CMD + SHIFT + X key
   */
  if ( page.general_settings?.keyboard_shortcuts ) {
    useEffect( () => {
      const handleCxl = ( e: KeyboardEvent ) => {
        if ( ( e.metaKey || e.ctrlKey ) && e.shiftKey && e.key === 'x' ) {
          e.preventDefault();
          cancelMessage();
        }
      };
      window.addEventListener( 'keydown', handleCxl );
      return () => {
        window.removeEventListener( 'keydown', handleCxl );
      };
    }, [ cancelMessage ] );
  }

  /**
   * Custom Event Listener for Chat Since
   * Event: awp:chat:since
   * @param {CustomEvent} e
   * @returns {void}
   */
  useEffect( () => {
    window.agentwp.addEventListener( 'awp:chat:since', ( e: AWPEventChatOpenType ) => {
      if ( e.detail?.since ) {
        toggleChat && toggleChat();
        setSince( e.detail.since );
      }
    } );

    window.agentwp.addEventListener( 'awp:chat:toggle', ( e: AWPEventChatSinceType ) => {
      toggleChat && toggleChat();
    } );
  }, [ window.agentwp, setSince, toggleChat ] );

  return <>{ children }</>;
};

export default HotKeyProvider;
