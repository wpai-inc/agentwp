import { log } from 'console';
import { Dispatch, MutableRefObject } from 'react';
import type { Editor } from 'tinymce';
import { handleSelectedElement } from './getSelectedInputField';
import { handleSelectedWysiwygEditor } from './getSelectedWysiwyg';

declare const elementor: any;
declare const tinymce: Editor;

export function getSelectedElementorField(
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  if ( typeof elementor !== 'undefined' ) {
    elementor.hooks.addAction( 'panel/open_editor/widget', function () {
      const elementorEditor = document.getElementById( 'elementor-panel-content-wrapper' );
      if ( elementorEditor ) {
        selectedInputRef.current = null;
        setSelectedInput( null );

        const texareaInputElement = elementorEditor.querySelector(
          'textarea.elementor-control-tag-area',
        );
        if ( texareaInputElement ) {
          handleSelectedElement(
            texareaInputElement as HTMLTextAreaElement,
            setSelectedInput,
            selectedInputRef,
          );
        }

        const wysiwygInputElement = elementorEditor.querySelector( 'textarea.elementor-wp-editor' );

        if ( wysiwygInputElement ) {
          const tinymceId = wysiwygInputElement.getAttribute( 'id' );
          if ( tinymceId ) {
            tinymce.on( 'addeditor', function ( e ) {
              const editor = e.editor;
              if ( editor.id === tinymceId ) {
                handleSelectedWysiwygEditor( editor, setSelectedInput, selectedInputRef );
              }
            } );
          }
        }
      }
    } );
  }
}
