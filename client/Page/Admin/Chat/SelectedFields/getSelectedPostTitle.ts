import isEditorReady from '@/lib/isEitorReady';
import React from 'react';

export default function getSelectedPostTitle(
  setSelectedInput: React.Dispatch<React.SetStateAction<any>>,
) {
  isEditorReady(() => {
    const postTitleContainer = document.querySelector('h1.wp-block-post-title');
    if (postTitleContainer) {
      postTitleContainer.addEventListener('click', () => {
        setSelectedInput({
          type: 'post_title',
          data: {
            inputPath: 'h1.wp-block-post-title',
            inputLabel: 'Post Title',
            inputName: null,
            inputId: null,
            inputValue: postTitleContainer.textContent,
          },
        });
      });
    }
  });
}
