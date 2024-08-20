import { log } from 'console';
import { Dispatch, MutableRefObject } from 'react';
import type { Editor } from 'tinymce';
import { handleSelectedElement } from './getSelectedInputField';
import { handleSelectedWisiwygEditor } from './getSelectedWysiwyg';

declare const elementor: any;

export default function getSelectedElementorField(
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  if ( typeof elementor !== 'undefined' ) {
    elementor.hooks.addAction( 'panel/open_editor/widget', function ( manager, model, view ) {
      console.log( 'open editor', { manager, model, view } );
      const elementorEditor = document.getElementById( 'elementor-panel-content-wrapper' );
      if ( elementorEditor ) {
        console.log( 'elementorEditor', elementorEditor );
        selectedInputRef.current = null;
        setSelectedInput( null );

        const texareaInputElement = elementorEditor.querySelector(
          'textarea.elementor-control-tag-area',
        );
        if ( texareaInputElement ) {
          console.log( 'texareaInputElement', texareaInputElement );
          handleSelectedElement(
            texareaInputElement as HTMLTextAreaElement,
            setSelectedInput,
            selectedInputRef,
          );
        }

        const wysiwygInputElement = elementorEditor.querySelector( 'textarea.elementor-wp-editor' );

        if ( wysiwygInputElement ) {
          console.log( 'wysiwygInputElement', wysiwygInputElement );
          const tinymceId = wysiwygInputElement.getAttribute( 'id' );
          if ( tinymceId ) {
            console.log( 'wysiwyg', tinymceId );

            tinymce.on( 'addeditor', function ( e ) {
              const editor = e.editor;
              if ( editor.id === tinymceId ) {
                handleSelectedWisiwygEditor( editor, setSelectedInput, selectedInputRef );
              }
            } );
          }
        }
      }
    } );
  }
}
