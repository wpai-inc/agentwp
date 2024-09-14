import { useRef, useState, useEffect } from 'react';
import getCaretPosition from './helpers/getCaretPosition';
import isMentionMode from './helpers/isMentionMode';
import { MentionMode, Suggestion } from './helpers/types';
import SuggestionsBox from './SuggestionsBox';
import transformContentToText from './helpers/transformContentToText';

export default function TextBox( {
  callback,
  message,
  keyPress,
}: {
  callback: ( text: string ) => void;
  message: string;
  keyPress: ( e: React.KeyboardEvent< HTMLDivElement > ) => void;
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

    const span = document.createElement( 'span' );
    span.className = 'bg-[#d6ebf2] rounded px-1 mention';
    span.id = suggestion.type + '___' + suggestion.id;
    span.textContent = '@' + suggestion.type + ':' + suggestion.title;
    const spanHTML = span.outerHTML;

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
      const span = document.createElement( 'span' );
      span.className = 'bg-[#d6ebf2] rounded px-1 mention';
      span.id = item.type + '___' + item.id;
      span.textContent = '@' + item.type + ':' + item.title;
      const spanHTML = span.outerHTML;
      text = text.replace( '@' + item.type + ':' + item.title, spanHTML );
    } );

    return text;
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
        className="h-24 w-full resize-none p-2 text-base bg-transparent focus:ring-0 focus:outline-none message-box"
        onInput={ e => handleInput( e ) }
        ref={ editorRef }
        contentEditable
        suppressContentEditableWarning={ true }
        onKeyDown={ e => handleKeyDown( e ) }
        style={ {
          whiteSpace: 'pre-wrap',
        } }></div>

      <SuggestionsBox show={ mention.mode } keyword={ mention.text } onSelect={ handleSelect } />
    </>
  );
}
