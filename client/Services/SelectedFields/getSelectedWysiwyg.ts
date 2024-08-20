import { Dispatch, MutableRefObject } from 'react';
import type { Editor } from 'tinymce';

declare const tinymce: Editor;

export default function getSelectedWysiwyg(
  setSelectedInput: Dispatch< React.SetStateAction< any > >,
  selectedInputRef: MutableRefObject<
    null | HTMLInputElement | HTMLTextAreaElement | HTMLElement | Editor
  >,
) {
  if ( typeof tinymce !== 'undefined' ) {
    tinymce.on( 'addeditor', function ( e ) {
      const editor = e.editor;

      editor.on( 'focus', function () {
        handleSelectedWisiwygEditor( editor, setSelectedInput, selectedInputRef );
      } );
    } );
  }
}

export function handleSelectedWisiwygEditor(
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
      inputLabel: 'wysiwyg editor',
      inputName: 'wysiwyg editor',
      inputValue,
    },
  } );

  selectedInputRef.current?.on( 'keyup', ( e: KeyboardEvent ) => {
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
