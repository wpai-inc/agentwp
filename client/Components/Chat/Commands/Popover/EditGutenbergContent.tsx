import { useEffect } from 'react';
import { useScreen } from '@/Providers/ScreenProvider';

declare const wp: any;

export default function EditGutenbergContent() {
  // const { adminRequest } = useAdminRoute();
  const { screen, setScreen } = useScreen();

  const { select } = wp.data;

  useEffect( () => {
    // Get the post content
    const postContent = select( 'core/editor' ).getEditedPostContent();
    const postTitle = select( 'core/editor' ).getEditedPostAttribute( 'title' );
    setScreen( { ...screen, post: { post_content: postContent, post_title: postTitle } } );

    // You can also set up a subscription to react to changes in the content
    const unsubscribe = wp.data.subscribe( () => {
      const newContent = select( 'core/editor' ).getEditedPostContent();
      const newTitle = select( 'core/editor' ).getEditedPostAttribute( 'title' );
      if ( newContent === postContent ) return;

      setScreen( { ...screen, post: { post_content: newContent, post_title: newTitle } } );
    } );

    // Clean up the subscription
    return () => unsubscribe();
  }, [] );

  // To unsubscribe from changes when no longer needed
  // unsubscribe();

  return <div></div>;
}
