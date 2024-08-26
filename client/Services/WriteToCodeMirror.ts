import { getElementByXpath } from '@/lib/utils';

declare const wp: any;
import { parse } from 'partial-json';
import { StreamableFieldType } from '@/Types/types';

export function WriteToCodeMirror( content: string, selectedInput: StreamableFieldType ) {
  try {
    if ( content ) {
      console.log( 'Writing to CodeMirror' );
      const updatedInputField = parse( content ) as { content: string; summary: string };
      if ( ! updatedInputField.content ) {
        console.info( 'No content to write...' );
        return;
      }

      if ( ! selectedInput ) {
        console.error( 'No selected CodeMirror...' );
        return;
      }

      const inputXPath = selectedInput?.data?.inputPath || '';
      const inputElement = getElementByXpath( inputXPath ) as HTMLElement;
      if ( ! inputElement ) {
        console.error( 'Selected CodeMirror not found...' );
        return;
      }

      if ( inputElement.tagName === 'DIV' && inputElement.classList.contains( 'CodeMirror' ) ) {
        inputElement.CodeMirror.setValue( updatedInputField.content );
      }

      return updatedInputField;
    }
  } catch ( error ) {
    console.info( 'Error writing to editor', error );
  }
}
