import { useRef, useState, useEffect } from 'react';
import getCaretPosition from './helpers/getCaretPosition';
import isMentionMode from './helpers/isMentionMode';
import { MentionMode, Suggestion } from './helpers/types';
import SuggestionsBox from './SuggestionsBox';
import transformContentToText from './helpers/transformContentToText';
import trimMentionTitle from './helpers/trimMentionTitle';

export default function TextBox( {
  callback,
  message,
  keyPress,
  onFocus,
}: {
  callback: ( text: string ) => void;
  message: string;
  keyPress: ( e: React.KeyboardEvent< HTMLDivElement > ) => void;
  onFocus: () => void;
} ) {
  const editorRef = useRef< HTMLDivElement >( null );
  const [ html, setHtml ] = useState< string >( '' );
  const [ mention, setMention ] = useState< MentionMode >( {
    mode: false,
    text: null,
    position: null,
  } );
  const [ suggestions, setSuggestions ] = useState< Suggestion[] >( [] );

  const handleInput = ( e: React.FormEvent< HTMLDivElement > ) => {
    const value = ( e.target as HTMLDivElement ).innerText;
    const { caretOffset } = getCaretPosition( editorRef );

    setHtml( value );

    if ( mention.mode && mention.position !== null ) {
      const beforeCursor = value.substring( 0, caretOffset );
      if ( mention.position > caretOffset ) {
        setMention( {
          mode: false,
          text: null,
          position: null,
        } );
        return;
      }

      const mentionText = beforeCursor.substring( mention.position, caretOffset );
      setMention( {
        ...mention,
        text: mentionText,
      } );
      return;
    }

    const checkMentionMode = isMentionMode( value, caretOffset );
    if ( checkMentionMode ) {
      setMention( {
        mode: true,
        text: '',
        position: caretOffset,
      } );
    }
  };

  const handleKeyDown = ( e: React.KeyboardEvent< HTMLDivElement > ) => {
    if ( e.key === 'Escape' ) {
      setMention( {
        mode: false,
        text: null,
        position: null,
      } );
    }

    if ( e.key === 'Backspace' ) {
      handleSuggestionDelete();
    }

    keyPress( e );
  };

  const handleSelect = ( suggestion: Suggestion ) => {
    const textContent = editorRef.current?.innerText;
    let beforeSuggestion = textContent?.substring( 0, mention.position as number );
    beforeSuggestion = beforeSuggestion?.substring( 0, beforeSuggestion.length - 1 );

    const afterSuggestion = textContent?.substring(
      ( mention.position as number ) + ( mention.text as string ).length,
    );

    const spanHTML = getMentionHTML( suggestion );

    const newText =
      handleSuggestionReplace( beforeSuggestion as string ) +
      spanHTML +
      handleSuggestionReplace( afterSuggestion as string ) +
      '&nbsp;';
    if ( editorRef.current ) {
      editorRef.current.innerHTML = newText;
    }

    setSuggestions( [ ...suggestions, suggestion ] );
    setMention( {
      mode: false,
      text: null,
      position: null,
    } );
  };

  const handleSuggestionReplace = ( text: string ) => {
    suggestions.forEach( item => {
      const spanHTML = getMentionHTML( item );
      text = text.replace( '@' + item.type + ':' + item.title, spanHTML );
    } );

    return text;
  };

  const getMentionHTML = ( suggestion: Suggestion ) => {
    const span = document.createElement( 'span' );
    span.className =
      'bg-brand-gray-50/50 text-brand-gray-70 rounded-full py-1 px-2 mention inline-block';
    span.id = suggestion.type + '___' + suggestion.id;
    span.innerHTML = `<strong>@${ suggestion.type }</strong>:${ trimMentionTitle(
      suggestion.title,
    ) }`;
    const spanHTML = span.outerHTML;
    return spanHTML;
  };

  const handleSuggestionDelete = () => {
    const { currentNode } = getCaretPosition( editorRef );
    if ( ! currentNode ) {
      return;
    }

    if ( ( currentNode as Element ).classList.contains( 'mention' ) ) {
      const id = ( currentNode as Element ).id;
      let i = null;
      suggestions.forEach( ( item, index ) => {
        if ( item.type + '___' + item.id === id ) {
          i = index;
          return;
        }
      } );

      if ( i !== null ) {
        const newSuggestions = [ ...suggestions ];
        newSuggestions.splice( i, 1 );
        setSuggestions( newSuggestions );
      }

      ( currentNode as Element ).remove();
    }
  };

  const handlePaste = ( e: ClipboardEvent ) => {
    e.preventDefault();
    const text = e.clipboardData?.getData( 'text/plain' );
    document.execCommand( 'insertText', false, text );
  };

  useEffect( () => {
    const editor = editorRef.current;
    if ( editor ) {
      editor.addEventListener( 'paste', handlePaste );
    }
    return () => {
      if ( editor ) {
        editor.removeEventListener( 'paste', handlePaste );
      }
    };
  }, [] );

  useEffect( () => {
    callback( transformContentToText( editorRef.current?.innerHTML as string ) );
  }, [ html, suggestions ] );

  useEffect( () => {
    if ( ! message.length ) {
      editorRef.current!.innerHTML = '';
    }
  }, [ message ] );

  return (
    <>
      <div
        className="h-24 w-full resize-none p-2 text-base bg-transparent focus:ring-0 focus:outline-none message-box overflow-y-auto whitespace-pre-wrap"
        onInput={ e => handleInput( e ) }
        ref={ editorRef }
        contentEditable
        suppressContentEditableWarning={ true }
        onKeyDown={ e => handleKeyDown( e ) }
        onFocus={ () => setTimeout( onFocus, 50 ) }
      />
      <SuggestionsBox show={ mention.mode } keyword={ mention.text } onSelect={ handleSelect } />
    </>
  );
}
