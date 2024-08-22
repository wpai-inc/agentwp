import { useRef, useEffect, useState } from 'react';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/Components/ui/command';
import type { CommandPopoverProps } from '../CommandMenu';

export default function PostEdit( { handleKeyDown, message, focused }: CommandPopoverProps ) {
  const commandListRef = useRef< HTMLDivElement >( null );

  useEffect( () => {
    if ( focused && commandListRef.current ) {
      commandListRef.current.focus();
    }
  }, [ focused ] );

  const { adminRequest } = useAdminRoute();
  const searchQuery = message.replace( /\/edit /g, '' );
  const [ foundPosts, setFoundPosts ] = useState< any[] >( [] );

  function select( value: string ) {
    console.log( value );
  }

  function searchPost( search: string ) {
    return adminRequest
      .get( `/wp/v2/search`, {
        params: {
          search,
        },
      } )
      .then( res => setFoundPosts( res.data ) );
  }

  useEffect( () => {
    searchPost( searchQuery );
  }, [ searchQuery ] );

  return (
    <Command shouldFilter={ false } loop>
      <CommandList
        ref={ commandListRef }
        tabIndex={ 0 }
        onKeyDown={ e => handleKeyDown( e, focused ) }>
        <CommandEmpty>No posts found.</CommandEmpty>
        <CommandGroup>
          { foundPosts.map( post => (
            <CommandItem key={ post.id } value={ post.id } onSelect={ select }>
              { post.title }
            </CommandItem>
          ) ) }
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
