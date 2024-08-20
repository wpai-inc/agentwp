declare const wp: any;
import { parse } from 'partial-json';
import { streamableFieldType } from '@/Types/types';

export function WriteToWysiwyg( content: string, selectedInput: streamableFieldType ) {
  try {
    if ( content ) {
      console.log( 'Writing to wysiwyg', selectedInput );
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

      const inputId = selectedInput?.data?.inputId || '';
      const inputElement = tinymce.get( inputId );
      if ( ! inputElement ) {
        console.info( 'No input element found...' );
        return;
      }

      inputElement.setContent( updatedInputField.content );
      inputElement.fire( 'change' );
      //   inputElement.execCommand( 'mceRepaint' );

      // trigger chnage event
      //   inputElement.dispatchEvent( new Event( 'input', { bubbles: true } ) );
      //   inputElement.dispatchEvent( new Event( 'keyup', { bubbles: true } ) );

      return updatedInputField;
    }
  } catch ( error ) {
    console.info( 'Error writing to editor', error );
  }
}

export function CleanWysiwygContent( selectedInput ) {
  try {
    // clear the input field content
    const inputId = selectedInput?.data?.inputId || '';
    const inputElement = tinymce.get( inputId );
    if ( inputElement ) {
      inputElement.setContent( '' );
    }
  } catch ( error ) {
    console.info( 'Error cleaning content', error );
  }
}
