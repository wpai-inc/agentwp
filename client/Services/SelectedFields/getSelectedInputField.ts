import { generateUniqueSelector } from '@/lib/utils';
import { Dispatch, MutableRefObject } from 'react';
import { Editor } from 'tinymce';
import getXPath from 'get-xpath';

const excludeKeywords = [ 'search' ];
const excludeParents = [ '.CodeMirror' ];
declare const FLBuilder: any;

export function getSelectedInputField(
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  document.addEventListener( 'focusin', function ( event ) {
    handleElementFocus( event, setSelectedInput, selectedInputRef );
  } );

  document.addEventListener( 'mousedown', event => {
    const clickedElement = event.target as HTMLElement;
    if (
      clickedElement !== selectedInputRef.current &&
      ! selectedInputRef.current?.classList.contains( 'CodeMirror' ) &&
      ! clickedElement.closest( '#agentwp-admin-chat' )
    ) {
      selectedInputRef.current = null;
      setSelectedInput( null );
    }
  } );
}

export function handleElementFocus(
  event: Event,
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  let inputElement;

  inputElement = event.target as HTMLInputElement | HTMLTextAreaElement;

  // wait for the input to be editable in case is a div
  if (
    ( ( inputElement.tagName === 'INPUT' &&
      'type' in inputElement &&
      inputElement.type === 'text' ) ||
      inputElement.tagName === 'TEXTAREA' ||
      ( inputElement.tagName === 'DIV' && inputElement.isContentEditable ) ) &&

    ( ! selectedInputRef.current ||
        ( selectedInputRef.current && inputElement.id !== selectedInputRef.current.id ) ) &&
    ! inputElement.closest( '#agentwp-admin-chat' ) &&
    ! inputElement.closest( '#agentwp-settings-chat' )
  ) {
    handleSelectedElement( inputElement, setSelectedInput, selectedInputRef );
  }
}

export function handleSelectedElement(
  inputElement: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  const inputName = inputElement.getAttribute( 'name' );
  const inputId = inputElement.getAttribute( 'id' );

  if ( excludeParents.some( parent => inputElement.closest( parent ) ) ) {
    return;
  }

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
  const inputXPath = getXPath( inputElement );
  let inputLabel = '';
  if ( inputId ) {
    inputLabel = document.querySelector( `label[for="${ inputId }"]` )?.textContent || '';
  } else if ( inputElement ) {
    inputLabel = document.querySelector( `label[for="${ inputName }"]` )?.textContent || '';
  }
  if ( ! inputLabel ) {
    //if is a div with contenteditable
    if ( inputElement.tagName === 'DIV' ) {
      inputLabel = inputElement.getAttribute( 'aria-label' ) || 'editable content';
    } else {
      inputLabel = inputElement.type || '';
    }
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
      inputXPath,
      inputLabel,
      inputName,
      inputId,
      inputValue,
    },
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
