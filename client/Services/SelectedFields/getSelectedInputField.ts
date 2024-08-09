import { generateUniqueSelector } from '@/lib/utils';
import { Dispatch, MutableRefObject } from 'react';

export default function getSelectedInputField(
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject< null | HTMLInputElement | HTMLTextAreaElement | HTMLElement >,
) {
  const excludeKeywords = [ 'search' ];

  document.body.addEventListener( 'focusin', function ( event ) {
    const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLElement;
    if (
      ( ( inputElement.tagName === 'INPUT' &&
        'type' in inputElement &&
        inputElement.type === 'text' ) ||
        inputElement.tagName === 'TEXTAREA' ||
        ( inputElement.tagName === 'DIV' && inputElement.isContentEditable ) ) &&
      ! inputElement.closest( '#agentwp-admin-chat' )
    ) {
      const inputName = inputElement.getAttribute( 'name' );
      const inputId = inputElement.getAttribute( 'id' );
      if (
        excludeKeywords.some( keyword => {
          return (
            inputName?.includes( keyword ) ||
            inputId?.includes( keyword ) ||
            inputElement.getAttribute( 'class' )?.includes( keyword ) ||
            inputElement.getAttribute( 'placeholder' )?.includes( keyword )
          );
        } )
      ) {
        return;
      }

      const inputPath = generateUniqueSelector( inputElement );
      let inputLabel = '';
      if ( inputId ) {
        inputLabel = document.querySelector( `label[for="${ inputId }"]` )?.textContent || '';
      } else if ( inputName ) {
        inputLabel = document.querySelector( `label[for="${ inputName }"]` )?.textContent || '';
      }

      selectedInputRef.current = inputElement;
      const inputValue =
        ( inputElement as HTMLInputElement | HTMLTextAreaElement ).value ||
        inputElement.innerText ||
        '';
      setSelectedInput( {
        type: 'input',
        data: {
          inputPath,
          inputLabel,
          inputName,
          inputId,
          inputValue,
        },
      } );
    }
  } );

  document.addEventListener( 'mousedown', event => {
    const clickedElement = event.target as HTMLElement;
    if (
      clickedElement !== selectedInputRef.current &&
      ! clickedElement.closest( '#agentwp-admin-chat' )
    ) {
      selectedInputRef.current = null;
      setSelectedInput( null );
    }
  } );

  selectedInputRef.current?.addEventListener( 'input', function ( ev ) {
    const inputElement = ev.target as HTMLInputElement | HTMLTextAreaElement;
    if ( inputElement === selectedInputRef.current ) {
      setSelectedInput( ( prev: any ) => ( {
        ...prev,
        data: {
          ...prev.data,
          inputValue: inputElement.value,
        },
      } ) );
    }
  } );
}
