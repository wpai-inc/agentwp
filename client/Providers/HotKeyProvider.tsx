import { useEffect } from 'react';
import { useChat } from '@/Providers/ChatProvider';
import { useUserRequests } from './UserRequestsProvider';
import { AWPEventChatSinceType } from '@/Types/types';
import { useChatUI } from '@/Components/Chat/Chat';

const HotKeyProvider: React.FC< { children: React.ReactNode } > = ( { children } ) => {
  const { chatSetting, setChatSetting } = useChat();
  const { toggle } = useChatUI();
  const { setSince } = useUserRequests();

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
   * Custom Event Listener for Chat Since
   * Event: awp:chat:since
   * @param {CustomEvent} e
   * @returns {void}
   */
  useEffect( () => {
    window.agentwp.addEventListener( 'awp:chat:since', ( e: AWPEventChatSinceType ) => {
      if ( e.detail?.since ) {
        toggle();
        setSince( e.detail.since );
      }
    } );
  }, [ window.agentwp, setSince, toggle ] );

  return <>{ children }</>;
};

export default HotKeyProvider;
