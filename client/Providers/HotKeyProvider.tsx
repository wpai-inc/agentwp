import { useEffect } from 'react';
import { useChat } from '@/Providers/ChatProvider';

const HotKeyProvider: React.FC< { children: React.ReactNode } > = ( { children } ) => {
  const { chatSetting, setChatSetting } = useChat();
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

  return <>{ children }</>;
};

export default HotKeyProvider;
