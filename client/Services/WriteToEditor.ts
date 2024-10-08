declare const wp: any;
import { parse } from 'partial-json';

import { type BlockType, GutenbergStreamType } from '@/Types/types';

export function WriteToEditor( content: string, previousContent: BlockType[] ) {
  try {
    if ( content ) {
      const updatedBlocks = parse( content ) as GutenbergStreamType;
      if ( ! updatedBlocks.content ) {
        console.info( 'No content to write...' );
        return;
      }
      const blocksCount = updatedBlocks.content.length;
      const key = blocksCount - 1;
      const block = updatedBlocks.content[ key ] || {};

      block.status = previousContent[ key ]?.status || 'initial';
      block.clientId = previousContent[ key ]?.clientId || '';
      block.valid = previousContent[ key ]?.valid || undefined;

      // validate name, if the name is not valid, skip
      if ( ! block.name || ! wp.blocks.getBlockType( block.name ) ) {
        console.info( 'Skipping... the block name is not valid...', block.name );
        return;
      }
      updatedBlocks.content[ key ].valid = true;

      // Insert the block and the status ready
      if ( ! block.clientId ) {
        insertBlock( block ).then( clientId => {
          updatedBlocks.content[ key ].clientId = clientId;
          updatedBlocks.content[ key ].status = 'ready';
        } );
      } else if (
        block.attributes?.content &&
        block.attributes?.content !== previousContent[ key ]?.attributes?.content
      ) {
        updatedBlocks.content[ key ].status = 'updating_content';
        if ( ! block.clientId ) {
          insertBlock( block ).then( clientId => {
            updatedBlocks.content[ key ].clientId = clientId;
          } );
        } else {
          updateBlockContent( block ).then( clientId => {
            if ( clientId ) {
              updatedBlocks.content[ key ].clientId = clientId;
            }
          } );
        }
      } else if (
        block.innerBlocks &&
        block.innerBlocks?.length > 0 &&
        JSON.stringify( block.innerBlocks ) !==
          JSON.stringify( previousContent[ key ]?.innerBlocks )
      ) {
        updatedBlocks.content[ key ].status = 'updating_inner_blocks';
        if ( ! block.clientId ) {
          insertBlock( block ).then( clientId => {
            updatedBlocks.content[ key ].clientId = clientId;
          } );
        } else {
          updateBlockInnerBlocks( block ).then( clientId => {
            if ( clientId ) {
              updatedBlocks.content[ key ].clientId = clientId;
            }
          } );
        }
      }
      return updatedBlocks;
    }
  } catch ( error ) {
    console.info( 'Error writing to editor', error );
  }
}

export async function CleanGutenbergContent() {
  try {
    const blocks = wp.data.select( 'core/block-editor' ).getBlocks();
    if ( blocks && blocks.length > 0 ) {
      await wp.data
        .dispatch( 'core/block-editor' )
        .removeBlocks( blocks.map( block => block.clientId ) );
    }
  } catch ( error ) {
    console.info( 'Error cleaning content', error );
  }
}

async function insertBlock( block: BlockType ) {
  if ( block.clientId ) {
    return;
  }

  const { dispatch } = wp.data;
  const { name, attributes } = block;

  // Create block with content
  const newBlock = wp.blocks.createBlock( name, attributes );

  // Insert block into editor
  await dispatch( 'core/block-editor' ).insertBlocks( newBlock );

  return newBlock.clientId;
}

async function updateBlockContent( block: BlockType ) {
  if ( ! block.clientId ) {
    return;
  }
  const { dispatch } = wp.data;
  await dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, block.attributes );
  return block.clientId;
}

async function updateBlockInnerBlocks( block: BlockType ) {
  if ( ! block.clientId ) {
    return '';
  }
  const { dispatch } = wp.data;
  try {
    // Create inner blocks
    const theInnerBlocks = wp.blocks.createBlocksFromInnerBlocksTemplate( block.innerBlocks );
    if ( theInnerBlocks ) {
      // Create new block with inner blocks
      const newBlock = wp.blocks.createBlock( block.name, block.attributes || {}, theInnerBlocks );
      // Replace the block with the new block
      await dispatch( 'core/block-editor' ).replaceBlocks( block.clientId, newBlock );
      // Return the new block clientId
      return newBlock.clientId;
    }
  } catch ( error: any ) {
    console.error( 'Skipping... the block is incomplete...', error.message );
  }
}
