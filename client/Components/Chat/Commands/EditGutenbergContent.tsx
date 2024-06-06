import { useEffect, useState } from 'react';
import { useScreen } from '@/Providers/ScreenProvider';

declare const wp: any;

export default function EditGutenbergContent( {
  message,
  onSetMessage,
  onMessageBoxKeyDown,
}: {
  message: string;
  onSetMessage: ( message: string ) => void;
  onMessageBoxKeyDown: React.KeyboardEvent< HTMLTextAreaElement > | undefined;
} ) {
  // const adminRequest = useAdminRoute();
  const { screen, setScreen } = useScreen();

  const [ postContent, setPostContent ] = useState( '' );
  const { select } = wp.data;

  useEffect( () => {
    // Get the post content
    const postContent = select( 'core/editor' ).getEditedPostContent();
    setPostContent( postContent );
    setScreen( { ...screen, post_content: postContent } );

    // You can also set up a subscription to react to changes in the content
    const unsubscribe = wp.data.subscribe( () => {
      const newContent = select( 'core/editor' ).getEditedPostContent();
      if ( newContent === postContent ) return;
      setPostContent( newContent );
      setScreen( { ...screen, post_content: newContent } );
      console.log( 'New Content: ', newContent === postContent, newContent );
    } );

    // Clean up the subscription
    return () => unsubscribe();
  }, [] );

  useEffect( () => {
    console.log( 'Post Content: ', screen );
  }, [ screen ] );

  // To unsubscribe from changes when no longer needed
  // unsubscribe();

  return <div></div>;
}
