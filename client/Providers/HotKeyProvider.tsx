import { useEffect } from 'react';
import { useChat } from '@/Providers/ChatProvider';
import { useUserRequests } from './UserRequestsProvider';
import { AWPEventChatSinceType, AWPEventChatOpenType } from '@/Types/types';
import { useChatUI } from '@/Components/Chat/Chat';

const HotKeyProvider: React.FC< { children: React.ReactNode } > = ( { children } ) => {
  const { chatSetting, setChatSetting, cancelMessage } = useChat();
  const { toggle } = useChatUI();
  const { setSince } = useUserRequests();

  /**
   * Close the chat setting with
   * the escape key
   */
  useEffect( () => {
    if ( chatSetting ) {
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
  useEffect( () => {
    const handleToggle = ( e: KeyboardEvent ) => {
      if ( ( e.metaKey || e.ctrlKey ) && e.key === 'l' ) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener( 'keydown', handleToggle );
    return () => {
      window.removeEventListener( 'keydown', handleToggle );
    };
  }, [ toggle ] );

  /**
   * Cancel the chat with the
   * CMD + X key
   */
  useEffect( () => {
    const handleCxl = ( e: KeyboardEvent ) => {
      if ( ( e.metaKey || e.ctrlKey ) && e.key === 'x' ) {
        e.preventDefault();
        cancelMessage();
      }
    };
    window.addEventListener( 'keydown', handleCxl );
    return () => {
      window.removeEventListener( 'keydown', handleCxl );
    };
  }, [ cancelMessage ] );

  /**
   * Custom Event Listener for Chat Since
   * Event: awp:chat:since
   * @param {CustomEvent} e
   * @returns {void}
   */
  useEffect( () => {
    window.agentwp.addEventListener( 'awp:chat:since', ( e: AWPEventChatOpenType ) => {
      if ( e.detail?.since ) {
        toggle();
        setSince( e.detail.since );
      }
    } );

    window.agentwp.addEventListener( 'awp:chat:toggle', ( e: AWPEventChatSinceType ) => {
      toggle();
    } );
  }, [ window.agentwp, setSince, toggle ] );

  return <>{ children }</>;
};

export default HotKeyProvider;
