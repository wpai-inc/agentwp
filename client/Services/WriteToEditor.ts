declare const wp: any;

export function WriteToEditor( { content }: { content: string } ) {
  console.log( 'WRITE TO EDITOR', content );
  //   const { select } = wp.data;
  //   const { dispatch } = wp.data.dispatch( 'core/editor' );
  // const postContent = select( 'core/editor' ).getEditedPostContent();
  //   const newContent = content; // postContent + content;
  //   dispatch( 'core/editor' ).editPost( { content: newContent } );
}
