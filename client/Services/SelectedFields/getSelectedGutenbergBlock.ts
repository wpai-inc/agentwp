import isEditorReady from '@/lib/isEditorReady';
import React from 'react';

declare const wp: any;

export default function getSelectedGutenbergBlock(
  setSelectedInput: React.Dispatch< React.SetStateAction< any > >,
) {
  isEditorReady( () => {
    const blocksContainer = document.querySelector(
      '.block-editor-writing-flow .is-root-container',
    );
    if ( blocksContainer ) {
      blocksContainer.addEventListener( 'click', () => {
        const hasSelectedBlock = wp.data.select( 'core/block-editor' ).hasSelectedBlock();
        if ( hasSelectedBlock ) {
          const theSelectedBlock = wp.data.select( 'core/block-editor' ).getSelectedBlock();
          const blockClientId = theSelectedBlock.clientId;
          if ( blockClientId ) {
            const blocksContent = wp.data.select( 'core/editor' ).getEditedPostContent();
            setSelectedInput( {
              type: 'post_content',
              data: {
                inputPath: 'null',
                inputLabel: 'Post Content',
                inputName: null,
                inputId: null,
                inputValue: blocksContent,
              },
            } );
          }
        }
      } );
    }
  } );
}
