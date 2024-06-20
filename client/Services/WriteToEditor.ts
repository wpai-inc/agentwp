declare const wp: any;
import { parse } from 'partial-json';

import { type BlockType } from '@/Types/types';

export function WriteToEditor( content: string, previousContent: BlockType[] ) {
  try {
    if ( content ) {
      const updatedBlocks = parse( content ) as BlockType[];
      const blocksCount = updatedBlocks.length;
      const key = blocksCount - 1;
      const block = updatedBlocks[ key ];

      // updatedBlocks.forEach( ( block: BlockType, key: number ) => {
      //   if ( key !== blocksCount - 1 ) {
      //     return;
      //   }

      block.status = previousContent[ key ]?.status || 'initial';
      block.clientId = previousContent[ key ]?.clientId || '';
      block.valid = previousContent[ key ]?.valid || undefined;

      // Skip if block is already done
      if ( block.status === 'done' ) {
        return;
      }

      // validate name, if the name is not valid, skip
      if ( ! block.name || ! wp.blocks.getBlockType( block.name ) ) {
        return;
      }
      updatedBlocks[ key ].valid = true;

      // Insert the block and the status ready
      if ( ! block.clientId ) {
        updatedBlocks[ key ].clientId = insertBlock( block );
        updatedBlocks[ key ].status = 'ready';
        console.log( 'Block Inserted', key, updatedBlocks[ key ] );
      } else if (
        block.attributes?.content &&
        block.attributes?.content !== previousContent[ key ]?.attributes?.content
      ) {
        updatedBlocks[ key ].status = 'updating_content';
        if ( ! block.clientId ) {
          updatedBlocks[ key ].clientId = insertBlock( block );
        } else {
          updateBlockContent( block );
        }
        console.log( 'Block Content Updated', key, updatedBlocks[ key ] );
      } else if (
        block.innerBlocks &&
        block.innerBlocks?.length > 0 &&
        JSON.stringify( block.innerBlocks ) !==
          JSON.stringify( previousContent[ key ]?.innerBlocks )
      ) {
        updatedBlocks[ key ].status = 'updating_inner_blocks';
        if ( ! block.clientId ) {
          updatedBlocks[ key ].clientId = insertBlock( block );
        } else {
          updateBlockInnerBlocks( block );
        }
        console.log( 'Block Inner Blocks Updated', key, updatedBlocks[ key ] );
      }
      // } );
      return updatedBlocks;
    }
  } catch ( error ) {
    console.error( 'Error writing to editor', error );
  }
}

function insertBlock( block: BlockType ) {
  if ( block.clientId ) {
    return;
  }

  const { dispatch } = wp.data;
  const { name, attributes } = block;

  // Create block with content
  const newBlock = wp.blocks.createBlock( name, attributes );

  // Insert block into editor
  dispatch( 'core/block-editor' ).insertBlocks( newBlock );

  return newBlock.clientId;
}

function updateBlockContent( block: BlockType ) {
  if ( ! block.clientId ) {
    return;
  }
  const { dispatch } = wp.data;
  dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, block.attributes );
}

function updateBlockInnerBlocks( block: BlockType ) {
  if ( ! block.clientId ) {
    return '';
  }
  const { dispatch } = wp.data;
  // Update block content
  try {
    const theInnerBlocks = wp.blocks.createBlocksFromInnerBlocksTemplate( block.innerBlocks );
    if ( theInnerBlocks ) {
      const newBlock = wp.blocks.createBlock( block.name, block?.attributes || {}, theInnerBlocks );
      // TODO: the block is replaced but the ID is modified and I cannot retrieve the new ID
      // THE BLOCK CAN BE REMOVED AND AN NEW ONE CAN BE INSERTED BUT THEIS WILL ADD SOME FLICKERING TO THE SCREEN
      // IDEA: ADD A LOADING SPIN UNTIL THE BLOCK STREAM IS COMPLETED THEN ADD THE FINAL VERSION OF THE BLOCK
      const theNewBlock = dispatch( 'core/block-editor' ).replaceBlocks( block.clientId, newBlock );
      console.log( 'theNewBlock', theNewBlock.clientId );
    }
  } catch ( error ) {
    console.info( 'Skipping not completed...' );
  }
}
