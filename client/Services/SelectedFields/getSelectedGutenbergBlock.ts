import isEditorReady from '@/lib/isEditorReady';
import React from 'react';

declare const wp: any;

export function getSelectedGutenbergBlock(
  setSelectedInput: React.Dispatch< React.SetStateAction< any > >,
) {
  isEditorReady( () => {
    if ( typeof wp === 'undefined' ) {
      return;
    }
    const { subscribe, select } = wp.data;
    let previousSelectedBlockClientId: string | null = null;

    const onSelectionChange = () => {
      const selectedBlockClientId = select( 'core/block-editor' ).getSelectedBlockClientId();

      if ( selectedBlockClientId !== previousSelectedBlockClientId ) {
        const hasSelectedBlock = select( 'core/block-editor' ).hasSelectedBlock();
        if ( hasSelectedBlock ) {
          const theSelectedBlock = select( 'core/block-editor' ).getSelectedBlock();
          const blockClientId = theSelectedBlock.clientId;
          if ( blockClientId ) {
            const blocks = wp.blocks.getBlockTypes();
            // array of block names
            const blockNames = blocks.map( ( block: any ) => {
              return {
                name: block.name,
                description: block.description,
                attributes: Object.keys( block.attributes ),
              };
            } );

            setSelectedInput( {
              type: 'post_content',
              data: {
                inputPath: 'null',
                inputLabel: 'Post Content',
                inputName: null,
                inputId: null,
                inputValue: '', // will be part of the screen state
                availableBlocks: blockNames,
              },
            } );
          }
        }

        previousSelectedBlockClientId = selectedBlockClientId;
      }
    };

    const unsubscribe = subscribe( onSelectionChange );

    function cleanup() {
      unsubscribe();
    }
  } );
}
