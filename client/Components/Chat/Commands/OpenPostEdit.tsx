import { cn } from '@/lib/utils';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { usePage } from '@/Providers/PageProvider';
import { useEffect, useState } from 'react';

export default function OpenPostEdit( {
  message,
  onSetMessage,
  onMessageBoxKeyDown,
}: {
  message: string;
  onSetMessage: ( message: string ) => void;
  onMessageBoxKeyDown: React.KeyboardEvent< HTMLTextAreaElement > | undefined;
} ) {
  const adminRequest = useAdminRoute();
  const { page } = usePage();

  const [ foundPosts, setFoundPosts ] = useState< any[] >( [] );
  const [ searchQuery, setSearchQuery ] = useState< string >( '' );
  const [ selectedPostIndex, setSelectedPostIndex ] = useState< number >( 0 );

  function searchPost( search: string ) {
    return adminRequest
      .get( `/wp/v2/search`, {
        params: {
          search,
        },
      } )
      .then( res => {
        setFoundPosts( res.data );
        setSelectedPostIndex( 0 );
      } );
  }

  useEffect( () => {
    const search = message.replace( /\/edit /g, '' );
    setSearchQuery( search );
    searchPost( search );
  }, [ message ] );

  useEffect( () => {
    if ( ! onMessageBoxKeyDown ) {
      return;
    }
    onMessageBoxKeyDown.preventDefault();

    if ( onMessageBoxKeyDown.key === 'ArrowUp' ) {
      if ( selectedPostIndex === 0 ) {
        setSelectedPostIndex( foundPosts.length - 1 );
      } else {
        setSelectedPostIndex( selectedPostIndex - 1 );
      }
    } else if ( onMessageBoxKeyDown.key === 'ArrowDown' ) {
      if ( selectedPostIndex === foundPosts.length - 1 ) {
        setSelectedPostIndex( 0 );
      } else {
        setSelectedPostIndex( selectedPostIndex + 1 );
      }
    } else if ( onMessageBoxKeyDown.key === 'Enter' && selectedPostIndex ) {
      onSetMessage( `/edit ${ foundPosts[ selectedPostIndex ]?.title }` );
      document.location.href = `${ page.admin_route }post.php?post=${ foundPosts[ selectedPostIndex ].id }&action=edit`;
    }
  }, [ onMessageBoxKeyDown ] );

  return (
    <div
      className={ cn(
        'absolute bottom-full left-0 rounded border border-gray-300 bg-gray-100 p-1',
      ) }>
      { foundPosts.length
        ? foundPosts.map( ( post, index ) => {
            return (
              <div
                key={ post.id }
                className={ cn(
                  'p-1',
                  index === selectedPostIndex && 'bg-brand-primary text-white',
                ) }>
                { post.title }
              </div>
            );
          } )
        : 'No posts found' }
    </div>
  );
}
