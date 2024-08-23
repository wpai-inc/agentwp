import { Dispatch, MutableRefObject } from 'react';
import type { Editor } from 'tinymce';

declare const tinymce: Editor;

export function getSelectedWysiwyg(
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  if ( typeof tinymce !== 'undefined' ) {
    tinymce.on( 'addeditor', function ( e ) {
      const editor = e.editor;

      editor.on( 'focus', function () {
        console.log( '(AWP) WYSIWYG SELECTED', editor );
        handleSelectedWysiwygEditor( editor, setSelectedInput, selectedInputRef );
      } );
    } );
  }
}

export function handleSelectedWysiwygEditor(
  editor: Editor,
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  const editorId = editor.id;

  selectedInputRef.current = editor;
  const inputValue = editor.getContent() || '';
  setSelectedInput( {
    type: 'WYSIWYG',
    data: {
      inputId: editorId,
      inputPath: '#' + editorId,
      inputLabel: 'Editor',
      inputName: 'wysiwyg editor',
      inputValue,
    },
  } );

  selectedInputRef.current?.on( 'change', ( e: KeyboardEvent ) => {
    if ( tinymce.activeEditor.id === selectedInputRef.current?.id ) {
      setSelectedInput( ( prev: any ) => ( {
        ...prev,
        data: {
          ...prev.data,
          inputValue: selectedInputRef.current?.getContent() || '',
        },
      } ) );
    }
  } );
}
