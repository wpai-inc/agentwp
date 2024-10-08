import { getElementByXpath } from '@/lib/utils';

declare const wp: any;
import { parse } from 'partial-json';

export function WriteToCodeMirror( content: string, selectedInput: App.Data.StreamableFieldData ) {
  try {
    if ( content ) {
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
