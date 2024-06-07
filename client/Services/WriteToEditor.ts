declare const wp: any;

export function WriteToEditor( content: string ) {
  const { select, dispatch } = wp.data;
  const postContent = select( 'core/editor' ).getEditedPostContent();
  const newContent = content; // postContent + content;

  dispatch( 'core/editor' ).editPost( { content: newContent } );
}
