import { Dispatch, MutableRefObject } from 'react';
import type { Editor } from 'tinymce';
import { handleElementFocus } from '@/Services/SelectedFields/getSelectedInputField';
import getXPath from 'get-xpath';

declare const CodeMirror: any;

export function getSelectedCodeMirror(
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  if ( typeof CodeMirror !== 'undefined' ) {
    document.addEventListener( 'focusin', function ( event ) {
      const inputElement = event.target as HTMLDivElement;
      if (
        inputElement.tagName === 'DIV' &&
        inputElement.isContentEditable &&
        inputElement.classList.contains( 'CodeMirror-code' )
      ) {
        const CodeMirrorInstance = inputElement.closest( '.CodeMirror' );
        handleCodeMirrorFocus( CodeMirrorInstance, setSelectedInput, selectedInputRef );
      }
    } );
  }
}

export function handleCodeMirrorFocus(
  CodeMirrorInstance: HTMLDivElement | null,
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  selectedInputRef.current = CodeMirrorInstance;
  const inputValue = CodeMirrorInstance.CodeMirror.getValue() || '';
  setSelectedInput( {
    type: 'CodeMirror',
    data: {
      inputId: '',
      inputPath: getXPath( CodeMirrorInstance ),
      inputLabel: 'Code Editor',
      inputName: 'Code Editor',
      inputValue,
    },
  } );

  selectedInputRef.current?.CodeMirror.on( 'change', ( ev: any ) => {
    setSelectedInput( ( prev: any ) => ( {
      ...prev,
      data: {
        ...prev.data,
        inputValue: selectedInputRef.current?.CodeMirror.getValue() || '',
      },
    } ) );
  } );
}
