import { useRef, useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/Components/ui/command';
import type { CommandPopoverProps } from '../CommandMenu';

export default function SelectCommand( {
  handleKeyDown,
  commands,
  setMessage,
  focused,
}: CommandPopoverProps ) {
  const commandListRef = useRef< HTMLDivElement >( null );
  useEffect( () => {
    if ( focused && commandListRef.current ) {
      commandListRef.current.focus();
    }
  }, [ focused ] );

  function select( value: string ) {
    setMessage( '/' + value + ' ' );
  }

  return (
    <Command shouldFilter={ false } loop>
      <CommandList
        ref={ commandListRef }
        tabIndex={ 0 }
        onKeyDown={ e => handleKeyDown( e, focused ) }>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          { commands.map( c => (
            <CommandItem key={ c.command } value={ c.command } onSelect={ select }>
              <div className="flex gap-2">
                <code className="font-mono bg-brand-dark text-white rounded-md py-0.5 px-2 text-xs">
                  { '/' + c.command }
                </code>
                <span>{ c.info }</span>
              </div>
            </CommandItem>
          ) ) }
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
