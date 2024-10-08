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

type ValidationRule = {
  rule: ( text: string ) => boolean;
  message: string;
};

export default function MessageBox() {
  const { sendMessage, message, setMessage, cancelMessage } = useChat();
  const { page } = usePage();
  const [ commandMenuFocused, setCommandMenuFocused ] = useState( false );
  const textAreaRef = useRef< HTMLTextAreaElement | null >( null );
  const { streamingStatus } = useStream();
  const { addErrors } = useError();
  const [ messageError, setMessageError ] = useState< string | null >( null );
  const validation: ValidationRule[] = [
    {
      rule: ( text: string ) => text.length < 3600,
      message: 'Your message is too long',
    },
  ];

  const isDisabled =
    ! page.onboarding_completed ||
    ! page.agentwp_access ||
    streamingStatus === StreamingStatusEnum.SHOULD_ABORT ||
    streamingStatus === StreamingStatusEnum.ABORT ||
    messageError !== null;

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

  let isSubmitting = false;
  function handleMessageKeyDown( e: KeyboardEvent ) {
    if ( e.key === 'ArrowUp' || e.key === 'ArrowDown' ) {
      e.preventDefault();
      setCommandMenuFocused( true );
    } else if ( e.key === 'Enter' && ! e.metaKey && ! e.ctrlKey && ! e.shiftKey && ! e.altKey ) {
      e.preventDefault();

      if ( ! isSubmitting ) {
        isSubmitting = true;
        sendMessage( message );

        setTimeout( () => {
          isSubmitting = false;
        }, 300 );
      }
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

  function validateInput( text: string ): boolean {
    const valid = validation.every( rule => rule.rule( text ) );
    if ( ! valid ) {
      const error = validation.find( rule => ! rule.rule( text ) );
      setMessageError( error?.message || null );
    } else {
      setMessageError( null );
    }
    return valid;
  }

  const handleMessageInput = ( text: string ) => {
    const valid = validateInput( text );
    if ( valid === true ) {
      setMessage( text );
    }
  };

  return (
    <CommandMenu
      deactivate={ true }
      command={ message }
      focused={ commandMenuFocused }
      handleKeyDown={ handleKeyDown }
      message={ message }
      setMessage={ handleMessageInput }>
      <form
        className="ring-brand-primary-muted/60 ring-inset focus-within:ring-2 transition relative rounded-lg bg-brand-gray p-2"
        onSubmit={ submit }>
        <TextBox
          callback={ handleMessageInput }
          message={ message }
          keyPress={ e => handleKeyDown( e, commandMenuFocused ) }
          onFocus={ () => {} }
        />
        <textarea
          defaultValue={ message }
          ref={ textAreaRef }
          className="hidden"
          disabled={ ! page.onboarding_completed && ! page.agentwp_access }
        />
        <div className="flex items-center justify-between gap-3">
          { messageError && (
            <p className="ml-1 text-red-500 font-semibold text-sm">{ messageError }</p>
          ) }

          <div className="ml-auto flex gap-3">
            <ToggleVision />
            <Button
              type={ streamingStatus === StreamingStatusEnum.OFF ? 'submit' : 'button' }
              variant="brand"
              onClick={
                streamingStatus > StreamingStatusEnum.OFF ? handleCancelMessage : undefined
              }
              className="rounded bg-brand-primary h-10 w-10"
              disabled={ isDisabled }>
              { streamingStatus === StreamingStatusEnum.OFF ? (
                <UpArrowIcon className="h-5 w-5" />
              ) : streamingStatus >= StreamingStatusEnum.SHOULD_ABORT ? (
                <LoaderIcon className="animate-spin h-4 w-4" />
              ) : (
                <div className="h-3 w-3 bg-white"></div>
              ) }
            </Button>
          </div>
        </div>
      </form>
    </CommandMenu>
  );
}
