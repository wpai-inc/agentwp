declare const wp: any;
import { parse } from 'partial-json';
import { StreamableFieldType } from '@/Types/types';

export function WriteToInputField( content: string, selectedInput: StreamableFieldType ) {
  try {
    if ( content ) {
      console.log( 'Writing to input' );
      const updatedInputField = parse( content ) as { content: string; summary: string };
      if ( ! updatedInputField.content ) {
        console.info( 'No content to write...' );
        return;
      }

      // Update the selected input field
      if ( ! selectedInput ) {
        console.info( 'No selected input field...' );
        return;
      }

      const inputPath = selectedInput?.data?.inputPath || '';
      const inputElement = document.querySelector( inputPath ) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLElement;
      if ( ! inputElement ) {
        console.info( 'No input element found...' );
        return;
      }

      console.log( 'inputElement', inputElement.tagName );

      if ( inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA' ) {
        inputElement.value = updatedInputField.content;
      } else {
        inputElement.innerText = updatedInputField.content;
      }

      return updatedInputField;
    }
  } catch ( error ) {
    console.info( 'Error writing to editor', error );
  }
}

export function CleanInputFieldContent( selectedInput ) {
  try {
    // clear the input field content
    const inputPath = selectedInput?.data?.inputPath || '';
    const inputElement = document.querySelector( inputPath );
    if ( inputElement ) {
      inputElement.setAttribute( 'value', '' );
      inputElement.innerText = '';
    }
  } catch ( error ) {
    console.info( 'Error cleaning content', error );
  }
}
