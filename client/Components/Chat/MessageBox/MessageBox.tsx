import { useState, useRef } from 'react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';
import { cn } from '@/lib/utils';
import UpArrowIcon from '@material-design-icons/svg/outlined/arrow_upward.svg?react';
import TuneIcon from '@material-design-icons/svg/outlined/tune.svg?react';
import CommandMenu from '../Commands/CommandMenu';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { usePage } from '@/Providers/PageProvider';
import ChatSettings from '@/Page/Admin/Chat/Settings/ChatSettings';

export default function MessageBox() {
  const { sendMessage, setChatSetting, message, setMessage, messageSubmitted, cancelMessage } =
    useChat();
  const { page } = usePage();
  const [ commandMenuFocused, setCommandMenuFocused ] = useState( false );
  const textAreaRef = useRef< HTMLTextAreaElement | null >( null );

  function submit( e: React.FormEvent< HTMLFormElement > ) {
    e.preventDefault();
    sendMessage( message );
  }

  function handleCancelMessage( e: React.MouseEvent< HTMLButtonElement > ) {
    e.preventDefault();
    cancelMessage();
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
      e.preventDefault();
      sendMessage( message );
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
      <form className="relative rounded-lg bg-brand-gray p-2" onSubmit={ submit }>
        <textarea
          onChange={ e => setMessage( e.target.value ) }
          value={ message }
          ref={ textAreaRef }
          className="h-24 w-full resize-none p-2 text-base bg-transparent"
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
          <Button
            type={ messageSubmitted ? 'button' : 'submit' }
            variant="brand"
            size="lg"
            onClick={ messageSubmitted ? handleCancelMessage : undefined }
            className={ cn( 'rounded bg-brand-primary h-10 w-10' ) }
            disabled={ ! page.onboarding_completed || ! page.agentwp_access }>
            { messageSubmitted ? (
              <div className="h-3 w-3 bg-white"></div>
            ) : (
              <UpArrowIcon className="h-5 w-5" />
            ) }
          </Button>
        </div>
      </form>
    </CommandMenu>
  );
}
