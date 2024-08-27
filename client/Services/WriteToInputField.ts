import { getElementByXpath } from '@/lib/utils';

declare const wp: any;
import { parse } from 'partial-json';
import { StreamableFieldType } from '@/Types/types';

export function WriteToInputField( content: string, selectedInput: StreamableFieldType ) {
  try {
    if ( content ) {
      const updatedInputField = parse( content ) as { content: string; summary: string };
      if ( ! updatedInputField.content ) {
        console.info( 'No content to write...' );
        return;
      }

      if ( ! selectedInput ) {
        console.error( 'No selected input field...' );
        return;
      }

      const inputXPath = selectedInput?.data?.inputXPath || '';
      const inputElement = getElementByXpath( inputXPath ) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLElement;
      if ( ! inputElement ) {
        console.error( 'Selected input field not found...' );
        return;
      }

      if ( inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA' ) {
        ( inputElement as HTMLInputElement | HTMLTextAreaElement ).value =
          updatedInputField.content;
      } else {
        // if the div has lost the contenteditable add it back
        if (
          ! inputElement.getAttribute( 'contenteditable' ) &&
          ! inputElement.classList.contains( 'CodeMirror' )
        ) {
          inputElement.setAttribute( 'contenteditable', 'true' );
        }
        inputElement.innerText = updatedInputField.content;
      }

      // trigger chnage event
      inputElement.dispatchEvent( new Event( 'input', { bubbles: true } ) );
      inputElement.dispatchEvent( new Event( 'keyup', { bubbles: true } ) );

      return updatedInputField;
    }
  } catch ( error ) {
    console.info( 'Error writing to editor', error );
  }
}

export function CleanInputFieldContent( selectedInput: StreamableFieldType ) {
  try {
    // clear the input field content
    const inputPath = selectedInput?.data?.inputPath || '';
    const inputElement = document.querySelector( inputPath ) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLElement;
    if ( inputElement ) {
      inputElement.setAttribute( 'value', '' );
      inputElement.innerText = '';
    }
  } catch ( error ) {
    console.info( 'Error cleaning content', error );
  }
}
