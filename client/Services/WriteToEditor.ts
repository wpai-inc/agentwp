declare const wp: any;
import { parse } from 'partial-json';

import { type BlockType } from '@/Types/types';

export function WriteToEditor( content: string, previousContent: BlockType[] ) {
  try {
    if ( content ) {
      const newContent = parse( content ) as BlockType[];
      console.log( 'newContent', newContent );

      const blocksCount = newContent.length;

      newContent.forEach( ( block: BlockType, key: number ) => {
        // >>>>>
        block.status = previousContent[ key ]?.status || 'initial';
        block.clientId = previousContent[ key ]?.clientId || '';
        block.valid = previousContent[ key ]?.valid || undefined;
        const { blockName, content, status, innerBlocks } = block;

        // Skip if block is already done
        if ( status === 'done' ) {
          return;
        }

        // Insert block if the AI is already streaming the next block and status is not yet DONE
        // TODO: Also check this on stream end
        if ( key === blocksCount - 2 ) {
          if ( block.status !== 'done' ) {
            if ( block.valid === true ) {
              const prevBlock = updateBlock( block );
              prevBlock.clientId;
            } else {
              newContent[ blocksCount - 2 ].valid = false;
            }
            newContent[ blocksCount - 2 ].status = 'done';
          }
        }

        // validate blockName, if the blockName is not valid, skip
        if ( ! blockName || ! wp.blocks.getBlockType( blockName ) ) {
          return;
        }
        newContent[ key ].valid = true;

        // Insert the block and the status ready
        if ( ! newContent[ key ].clientId ) {
          newContent[ key ].clientId = insertBlock( block );
          newContent[ key ].status = 'ready';
        }

        if ( content && content !== previousContent[ key ]?.content ) {
          newContent[ key ].status = 'updating_content';
          if ( ! block.clientId ) {
            newContent[ key ].clientId = insertBlock( block );
          } else {
            updateBlockContent( block );
          }
        }
        if (
          innerBlocks &&
          innerBlocks?.length > 0 &&
          JSON.stringify( innerBlocks ) !== JSON.stringify( previousContent[ key ]?.innerBlocks )
        ) {
          newContent[ key ].status = 'updating_inner_blocks';
          if ( ! block.clientId ) {
            newContent[ key ].clientId = insertBlock( block );
          } else {
            updateBlockInnerBlocks( block );
          }
        }
      } );
      return newContent;
    }
  } catch ( error ) {
    console.error( 'Error writing to editor', error );
  }
}

function insertBlock( block: BlockType ) {
  console.log( 'insert block', block );
  console.log(
    'wp.blocks.getBlockType( block.blockName',
    wp.blocks.getBlockType( block.blockName ),
  );

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
  if ( ! block.clientId ) {
    return '';
  }
  console.log( 'Updating block content', block );
  const { dispatch } = wp.data;

  // Update block content
  const updatedBlock = dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, {
    ...block,
  } );
  console.log( 'Updated block content', updatedBlock );
  return updatedBlock;
}

function updateBlock( block: BlockType ) {
  if ( ! block.clientId ) {
    return '';
  }
  const { dispatch } = wp.data;
  // Update block content
  const updatedBlock = dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, {
    ...block,
  } );
  console.log( 'Updated block', updatedBlock );

  return updatedBlock;
}

const createBlocksFromObject = blockObject => {
  const { blockName, attrs, innerBlocks, content } = blockObject;
  const innerBlocksCreated = innerBlocks ? innerBlocks.map( createBlocksFromObject ) : [];
  return wp.data.createBlock( blockName, attrs, content ? { content } : {}, innerBlocksCreated );
};

function updateBlockInnerBlocks( block: BlockType ) {
  if ( ! block.clientId ) {
    return '';
  }
  const { dispatch } = wp.data;
  // Update block content
  const newBlocks = [ block ].map( createBlocksFromObject );

  const updatedBlock = dispatch( 'core/block-editor' ).replaceBlocks( block.clientId, newBlocks );
  console.log( 'Replace Inner Blocks', updatedBlock );

  return updatedBlock;
}
