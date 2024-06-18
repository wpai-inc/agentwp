declare const wp: any;
import { parse } from 'partial-json';

import { type BlockType } from '@/Types/types';

export function WriteToEditor( content: string, previousContent: BlockType[] ) {
  try {
    if ( content ) {
      const newContent = parse( content ) as BlockType[];

      const blocksCount = newContent.length;

      newContent.forEach( ( block: BlockType, key: number ) => {
        block.status = previousContent[ key ]?.status || 'initial';
        block.clientId = previousContent[ key ]?.clientId || '';
        const { content, status } = block;

        // Skip if block is already done
        if ( status === 'done' ) {
          return;
        }

        // Insert block if the AI is already streaming the next block and status is not yet DONE
        // TODO: Also check this on stream end
        if ( status !== 'done' && key === blocksCount - 2 ) {
          if ( ! block.clientId ) {
            newContent[ key ].clientId = insertBlock( block );
          } else {
            updateBlockContent( block );
          }
          newContent[ key ].status = 'done';
          return;
        }

        // Set the status of the block to initial if it doesn't exist
        if ( ! status ) {
          newContent[ key ].status = 'initial';
        }

        if ( content && content !== previousContent[ key ]?.content ) {
          newContent[ key ].status = 'updating_content';
          if ( status !== 'updating_content' ) {
            if ( ! block.clientId ) {
              newContent[ key ].clientId = insertBlock( block );
            }
          } else {
            updateBlockContent( block );
          }
        }

        // // Insert the block if the status is ready
        // if ( status === 'ready' ) {
        //   const clientId = insertBlock( block );
        //   newContent[ key ].clientId = clientId;
        // }
      } );

      console.log( newContent );

      return newContent;
    }
  } catch ( error ) {
    console.error( 'Error writing to editor', error );
  }
}

function insertBlock( block: BlockType ) {
  const { dispatch } = wp.data;
  const { blockName, attrs, content } = block;

  // Create block attributes object
  const blockAttrs = attrs || {};

  // Create block with content
  const blockContent = wp.blocks.createBlock( blockName, {
    ...blockAttrs,
    content: content || '',
  } );

  // Insert block into editor
  dispatch( 'core/block-editor' ).insertBlocks( blockContent );

  return blockContent.clientId;
}

function updateBlockContent( block: BlockType ) {
  const { dispatch } = wp.data;
  const { clientId, content } = block;

  // Update block content
  dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { content } );
}
