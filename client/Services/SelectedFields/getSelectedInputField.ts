import { generateUniqueSelector } from '@/lib/utils';
import { Dispatch, MutableRefObject } from 'react';
import { Editor } from 'tinymce';

export default function getSelectedInputField(
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  const excludeKeywords = [ 'search' ];

  const iframe = document.querySelector( 'iframe#elementor-preview-iframe' ) as HTMLIFrameElement;
  if ( iframe ) {
    iframe.contentWindow?.addEventListener( 'focusin', function ( event ) {
      handleElementFocus( event );
    } );
  }

  function handleElementFocus( event: Event ) {
    const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLElement;
    console.log( 'focusin', inputElement );
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
      } else if ( inputElement ) {
        inputLabel = document.querySelector( `label[for="${ inputName }"]` )?.textContent || '';
      }
      if ( ! inputLabel ) {
        inputLabel = inputElement.type || '';
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
      console.log( 'inputElement', inputElement );

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
  }

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
}
