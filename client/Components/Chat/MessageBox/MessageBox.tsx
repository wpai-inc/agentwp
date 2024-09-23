import { useState, useRef } from 'react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';
import UpArrowIcon from '@material-design-icons/svg/outlined/arrow_upward.svg?react';
import CommandMenu from '../Commands/CommandMenu';
import { usePage } from '@/Providers/PageProvider';
import { useStream } from '@/Providers/StreamProvider';
import { StreamingStatusEnum } from '@/Types/enums';
import { useError } from '@/Providers/ErrorProvider';
import { LoaderIcon } from 'lucide-react';
import TextBox from './TextBox';
import ToggleVision from './partials/ToggleVision';

export default function MessageBox() {
  const { sendMessage, message, setMessage, cancelMessage } = useChat();
  const { page } = usePage();
  const [ commandMenuFocused, setCommandMenuFocused ] = useState( false );
  const textAreaRef = useRef< HTMLTextAreaElement | null >( null );
  const { streamingStatus } = useStream();
  const { addErrors } = useError();

  function submit( e: React.FormEvent< HTMLFormElement > ) {
    e.preventDefault();
    if ( message.trim() === '' ) {
      return addErrors( [ 'Message is empty' ] );
    }
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

  const handleCallback = ( text: string ) => {
    setMessage( text );
  };

  return (
    <CommandMenu
      deactivate={ true }
      command={ message }
      focused={ commandMenuFocused }
      handleKeyDown={ handleKeyDown }
      message={ message }
      setMessage={ setMessage }>
      <form
        className="border border-transparent focus-within:border-brand-primary transition relative rounded-lg bg-brand-gray p-2"
        onSubmit={ submit }>
        <TextBox
          callback={ handleCallback }
          message={ message }
          keyPress={ e => handleKeyDown( e, commandMenuFocused ) }
        />
        <textarea
          onChange={ e => setMessage( e.target.value ) }
          value={ message }
          ref={ textAreaRef }
          className="h-24 w-full resize-none p-2 text-base bg-transparent focus:ring-0 focus:bg-white transition hidden"
          placeholder="Message..."
          onKeyDown={ e => handleKeyDown( e, commandMenuFocused ) }
          disabled={ ! page.onboarding_completed && ! page.agentwp_access }
        />
        <div className="flex items-center justify-end gap-3">
          <ToggleVision />
          <Button
            type={ streamingStatus === StreamingStatusEnum.OFF ? 'submit' : 'button' }
            variant="brand"
            size="lg"
            onClick={ streamingStatus > StreamingStatusEnum.OFF ? handleCancelMessage : undefined }
            className="rounded bg-brand-primary h-10 w-10"
            disabled={
              ! page.onboarding_completed ||
              ! page.agentwp_access ||
              streamingStatus === StreamingStatusEnum.SHOULD_ABORT ||
              streamingStatus === StreamingStatusEnum.ABORT
            }>
            { streamingStatus === StreamingStatusEnum.OFF ? (
              <UpArrowIcon className="h-5 w-5" />
            ) : streamingStatus >= StreamingStatusEnum.SHOULD_ABORT ? (
              <LoaderIcon className="animate-spin h-4 w-4" />
            ) : (
              <div className="h-3 w-3 bg-white"></div>
            ) }
          </Button>
        </div>
      </form>
    </CommandMenu>
  );
}
