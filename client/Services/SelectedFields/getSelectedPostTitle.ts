import isEditorReady from '@/lib/isEditorReady';
import React from 'react';

export default function getSelectedPostTitle(
  setSelectedInput: React.Dispatch< React.SetStateAction< any > >,
) {
  isEditorReady( () => {
    const postTitleContainer = document.querySelector( 'h1.wp-block-post-title' );
    if ( postTitleContainer ) {
      postTitleContainer.addEventListener( 'click', () => {
        setSelectedInput( {
          type: 'post_title',
          data: {
            inputPath: 'h1.wp-block-post-title',
            inputLabel: 'Post Title',
            inputName: null,
            inputId: null,
            inputValue: '', // will be part of the screen state,
          },
        } );
      } );
    }
  } );
}
