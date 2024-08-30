import { useState, useRef, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';
import { cn } from '@/lib/utils';
import UpArrowIcon from '@material-design-icons/svg/outlined/arrow_upward.svg?react';
import TuneIcon from '@material-design-icons/svg/outlined/tune.svg?react';
import CommandMenu from '../Commands/CommandMenu';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { usePage } from '@/Providers/PageProvider';
import ChatSettings from '@/Page/Admin/Chat/Settings/ChatSettings';
import SuggestionsBox from './SuggestionsBox';

export default function MessageBox() {
  const { sendMessage, setChatSetting, message, setMessage, messageSubmitted, cancelMessage } =
    useChat();
  const { page } = usePage();
  const [ commandMenuFocused, setCommandMenuFocused ] = useState( false );
  const textAreaRef = useRef< HTMLTextAreaElement | null >( null );
  const editorRef = useRef< HTMLDivElement >( null );
  const [ isPlaceholderVisible, setIsPlaceholderVisible ] = useState< boolean >( true );
  const [ mentionMode, setMentionMode ] = useState< boolean >( false );
  const [ keyword, setKeyword ] = useState< string >( '' );
  const [ suggestion, setSuggestion ] = useState< any >( {} );

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

  /**
   * Check if mention mode should start.
   *
   * @param {string} message The message to check.
   * @returns {boolean} Whether mention mode should start.
   */
  function isAtForReference( message: string ): boolean {
    const trimmedMessage = message.trimEnd();
    const lastChar = trimmedMessage.slice( -1 );
    const secondLastChar = trimmedMessage.slice( -2, -1 );

    return (
      lastChar === '@' &&
      ( secondLastChar === ' ' || secondLastChar === '>' || trimmedMessage.length === 1 )
    );
  }

  /**
   * Check the message for mentions.
   * If a mention is found, set the mention mode to true.
   *
   * @param {any} e The event object.
   * @returns {void}
   */
  const checkMessage = ( e: any ): void => {
    const value = e.target.innerHTML;
    handleInputChange( value );

    if ( isAtForReference( value ) ) {
      setMentionMode( true );
    }
  };

  /**
   * Handle the input change.
   *
   * @param {string} value The value of the input.
   * @returns {void}
   */
  const handleInputChange = ( value: string ): void => {
    if ( textAreaRef.current ) {
      textAreaRef.current.value = value.replace( /<[^>]+>/g, '' );
    }

    if ( mentionMode ) {
      setKeyword( value.split( '@' ).pop() || '' );

      if ( ! value.includes( '@' ) ) {
        setMentionMode( false );
      }
    }
  };

  const handleSelect = ( suggestion: any ) => {
    const value = editorRef.current?.innerText;
    const mention = `@${ value?.split( '@' ).pop() || '' }`;
    const newValue = value?.replace( mention, suggestion.title ) || '';

    editorRef.current!.innerText = `@${ newValue } `;
    setMentionMode( false );
    setSuggestion( suggestion );

    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart( editorRef.current!.childNodes[ 0 ], editorRef.current!.innerText.length );
    range.collapse( true );
    sel?.removeAllRanges();
    sel?.addRange( range );

    editorRef.current?.focus();
  };

  /**
   * Handle placeholder visibility.
   */
  useEffect( () => {
    const handleFocus = () => {
      setIsPlaceholderVisible( false );
    };

    const handleBlur = () => {
      if ( editorRef.current?.innerText.trim() === '' ) {
        setIsPlaceholderVisible( true );
      }
    };

    const contentEditableElement = editorRef.current;
    contentEditableElement?.addEventListener( 'focus', handleFocus );
    contentEditableElement?.addEventListener( 'blur', handleBlur );

    return () => {
      contentEditableElement?.removeEventListener( 'focus', handleFocus );
      contentEditableElement?.removeEventListener( 'blur', handleBlur );
    };
  }, [] );

  return (
    <CommandMenu
      deactivate={ true }
      command={ message }
      focused={ commandMenuFocused }
      handleKeyDown={ handleKeyDown }
      message={ message }
      setMessage={ setMessage }>
      <SuggestionsBox show={ mentionMode } keyword={ keyword } onSelect={ handleSelect } />
      <form className="relative rounded-lg bg-white p-2" onSubmit={ submit }>
        <div
          className="h-24 w-full resize-none p-2 text-base"
          contentEditable
          ref={ editorRef }
          onInput={ checkMessage }
          onKeyDown={ e => handleKeyDown( e, commandMenuFocused ) }
          suppressContentEditableWarning={ true }>
          { isPlaceholderVisible && <div className="text-gray-400">Message...</div> }
        </div>

        <textarea
          onChange={ e => setMessage( e.target.value ) }
          value={ message }
          ref={ textAreaRef }
          className="hidden"
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
          { messageSubmitted ? (
            <Button
              type="button"
              className={ cn( 'rounded bg-brand-primary px-3.5' ) }
              onClick={ handleCancelMessage }>
              <div className="h-4 w-4 bg-white"></div>
            </Button>
          ) : (
            <Button
              type="submit"
              className={ cn( 'rounded bg-brand-primary px-3' ) }
              disabled={ ! page.onboarding_completed || ! page.agentwp_access }>
              <UpArrowIcon className="h-5 w-5" />
            </Button>
          ) }
        </div>
      </form>
    </CommandMenu>
  );
}
