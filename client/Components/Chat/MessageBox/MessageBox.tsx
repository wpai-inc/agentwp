import { useState, useRef } from 'react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';
import { useStream } from '@/Providers/StreamProvider';
import { cn } from '@/lib/utils';
import UpArrowIcon from '@material-design-icons/svg/outlined/arrow_upward.svg?react';
import TuneIcon from '@material-design-icons/svg/outlined/tune.svg?react';
import CommandMenu from '../Commands/CommandMenu';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { usePage } from '@/Providers/PageProvider';
import ChatSettings from '@/Page/Admin/Chat/Settings/ChatSettings';

export default function MessageBox() {
  const { sendMessage, setChatSetting, message, setMessage } = useChat();
  const { streamClosed, cancelStream } = useStream();
  const { page } = usePage();
  const [ commandMenuFocused, setCommandMenuFocused ] = useState( false );
  const textAreaRef = useRef< HTMLTextAreaElement | null >( null );

  function submit( e: React.FormEvent< HTMLFormElement > ) {
    e.preventDefault();
    sendMessage( message );
  }

  function handleKeyDown( e: React.KeyboardEvent< HTMLElement >, menuFocused: boolean ) {
    if ( menuFocused ) {
      handleMenuKeyDown( e.nativeEvent );
    } else {
      handleMessageKeyDown( e.nativeEvent );
    }
  }

  function handleMessageKeyDown( e: KeyboardEvent ) {
    if ( e.key === 'ArrowUp' || e.key === 'ArrowDown' ) {
      e.preventDefault();
      setCommandMenuFocused( true );
    } else if ( e.key === 'Enter' && ! e.metaKey && ! e.ctrlKey && ! e.shiftKey && ! e.altKey ) {
      sendMessage( message );
      e.preventDefault();
    } else {
      setCommandMenuFocused( false );
    }
  }

  function handleMenuKeyDown( e: KeyboardEvent ) {
    if ( e.key !== 'ArrowDown' && e.key !== 'ArrowUp' ) {
      setCommandMenuFocused( false );
      if ( textAreaRef.current ) {
        textAreaRef.current.focus();
      }
    } else {
      setCommandMenuFocused( true );
    }
  }

  return (
    <CommandMenu
      deactivate={ true }
      command={ message }
      focused={ commandMenuFocused }
      handleKeyDown={ handleKeyDown }
      message={ message }
      setMessage={ setMessage }>
      <form className="relative rounded-lg bg-white p-2" onSubmit={ submit }>
        <textarea
          onChange={ e => setMessage( e.target.value ) }
          value={ message }
          ref={ textAreaRef }
          className="h-24 w-full resize-none p-2 text-base"
          placeholder="Message..."
          onKeyDown={ e => handleKeyDown( e, commandMenuFocused ) }
          disabled={ ! page.onboarding_completed && ! page.agentwp_access }
        />
        <div className="flex items-center justify-between">
          <AgentTooltip content="Conversation Settings">
            <Button
              onClick={ () =>
                setChatSetting( { component: <ChatSettings />, header: 'Settings' } )
              }
              variant="ghost"
              size="icon"
              disabled={ ! page.onboarding_completed || ! page.agentwp_access }
              className="text-brand-gray-50 hover:bg-inherit">
              <TuneIcon className="h-6 w-6" />
            </Button>
          </AgentTooltip>
          { streamClosed ? (
            <Button
              type="submit"
              className={ cn( 'rounded bg-brand-primary px-3' ) }
              disabled={ ! streamClosed || ! page.onboarding_completed || ! page.agentwp_access }>
              { streamClosed ? <UpArrowIcon className="h-5 w-5" /> : 'Pending...' }
            </Button>
          ) : (
            <Button
              type="button"
              className={ cn( 'rounded bg-brand-primary px-3.5' ) }
              onClick={ cancelStream }>
              <div className="h-4 w-4 bg-white"></div>
            </Button>
          ) }
        </div>
      </form>
    </CommandMenu>
  );
}
