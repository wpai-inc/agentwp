import { handleSelectedElement } from '@/Services/SelectedFields/getSelectedInputField';
import { Dispatch, MutableRefObject } from 'react';
import { Editor } from 'tinymce';
import { handleSelectedWysiwygEditor } from '@/Services/SelectedFields/getSelectedWysiwyg';

declare const bricksData: any;
declare const tinymce: Editor;

export function getSelectedBricksBuilderFields(
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  if ( typeof bricksData !== 'undefined' ) {
    const iframe = document.querySelector( '#bricks-builder-iframe' ) as HTMLIFrameElement;
    if ( iframe ) {
      iframe.addEventListener( 'load', function () {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;

        if ( iframeDocument ) {
          iframeDocument.addEventListener( 'focusin', function () {
            setTimeout( () => {
              // TODO: improve this (find an event that is fired after the input is focused)
              // get the input element from the parent document
              const container = document.querySelector(
                '.bricks-panel-controls li[data-controlkey="text"]',
              ) as HTMLIFrameElement;

              const inputText = container?.querySelector(
                'div[data-control=text] input[type=text]',
              ) as HTMLInputElement;

              const inputTextarea = container?.querySelector(
                'div[data-control=textarea] textarea',
              ) as HTMLTextAreaElement;

              const inputWysiwyg = container?.querySelector(
                'div[data-control=editor] textarea.bricks-wp-editor',
              ) as HTMLIFrameElement;

              if ( inputText ) {
                handleSelectedElement( inputText, setSelectedInput, selectedInputRef );
              } else if ( inputTextarea ) {
                handleSelectedElement( inputTextarea, setSelectedInput, selectedInputRef );
              } else if ( inputWysiwyg ) {
                // @ts-ignore
                const editor = tinymce.get( inputWysiwyg.id );
                handleSelectedWysiwygEditor( editor, setSelectedInput, selectedInputRef );
              }
            }, 300 );
          } );
        }
      } );
    }
  }
}
