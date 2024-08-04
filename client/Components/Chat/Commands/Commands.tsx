import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import OpenPostEdit from './OpenPostEdit';
import EditGutenbergContent from '@/Components/Chat/Commands/EditGutenbergContent';
import CommandMenu from './CommandMenu';

export default function Commands( {
  onMessageBoxKeyUp,
  onSetMessage,
  message,
}: {
  onMessageBoxKeyUp: React.KeyboardEvent< HTMLTextAreaElement > | undefined;
  onSetMessage: ( message: string ) => void;
  message: string;
} ) {
  const [ firstSlashDetected, setFirstSlashDetected ] = useState( false );
  const [ selectedCommandIndex, setSelectedCommandIndex ] = useState( 0 );
  const [ selectedCommand, setSelectedCommand ] = useState< SlashCommand | null >( null );
  const [ filteredCommands, setFilteredCommands ] = useState< SlashCommand[] >( slashCommands );

  function handleMessageBoxKeyDown( e: React.KeyboardEvent< HTMLTextAreaElement > | undefined ) {
    if ( ! e?.key ) {
      return;
    }
    // Prevent the default behavior of the arrow up, arrow down and Enter keys when the textarea has only the slash character
    if (
      ( e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' ) &&
      e.target.value[ 0 ] === '/' &&
      filteredCommands.length > 0
    ) {
      e.preventDefault();
    }

    maybeIsASlashCommand( e );
  }

  function maybeIsASlashCommand( e: React.KeyboardEvent< HTMLTextAreaElement > ) {
    if (
      e.target instanceof HTMLTextAreaElement &&
      ( e.target as HTMLTextAreaElement ).value[ 0 ] === '/' &&
      ! selectedCommand
    ) {
      setFirstSlashDetected( true );
      const value = ( e.target as HTMLTextAreaElement ).value.slice( 1 );
      setFilteredCommands( filterSlashCommands( value ) );
      // key arrow up and down
      if ( e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' ) {
        if ( e.key === 'ArrowDown' ) {
          if ( selectedCommandIndex === filteredCommands.length - 1 ) {
            setSelectedCommandIndex( 0 );
          } else {
            setSelectedCommandIndex( selectedCommandIndex + 1 );
          }
        } else if ( e.key === 'ArrowUp' ) {
          if ( selectedCommandIndex === 0 ) {
            setSelectedCommandIndex( filteredCommands.length - 1 );
          } else {
            setSelectedCommandIndex( selectedCommandIndex - 1 );
          }
        } else if ( e.key === 'Enter' ) {
          if ( filteredCommands[ selectedCommandIndex ] ) {
            onSetMessage( '/' + filteredCommands[ selectedCommandIndex ].command + ' ' );
            if ( filteredCommands[ selectedCommandIndex ].action !== undefined ) {
              filteredCommands[ selectedCommandIndex ].action();
              setSelectedCommandIndex( selectedCommandIndex );
            }
            setFirstSlashDetected( false );
          }
        }
      }
    } else {
      setFirstSlashDetected( false );
    }
  }

  const onSetSelectedCommand = ( cmd: SlashCommand | null ) => {
    setSelectedCommand( cmd );
  };

  function filterSlashCommands( value: string ) {
    setSelectedCommandIndex( 0 );
    return slashCommands.filter( cmd => cmd.command.includes( value ) );
  }

  function getActiveCommand() {
    let found = false;
    slashCommands.forEach( cmd => {
      if ( message.startsWith( '/' + cmd.command + ' ' ) ) {
        onSetSelectedCommand( cmd );
        found = true;
      }
    } );
    if ( ! found ) {
      onSetSelectedCommand( null );
    }
  }

  useEffect( () => {
    handleMessageBoxKeyDown( onMessageBoxKeyUp ); // Cast the event type to KeyboardEvent
  }, [ onMessageBoxKeyUp ] );

  useEffect( () => {
    getActiveCommand();
  }, [ message ] );

  return (
    <>
      { filteredCommands.length > 0 && (
        <div
          className={ cn(
            'absolute bottom-full left-0 rounded border border-gray-300 bg-gray-100 p-1 z-50',
            {
              block: firstSlashDetected,
              hidden: ! firstSlashDetected,
            },
          ) }>
          <ul>
            { filteredCommands.map( ( cmd, index ) => (
              <li
                key={ index }
                className={ cn( 'px-1', {
                  'bg-brand-primary text-white': selectedCommandIndex === index,
                } ) }>
                <span
                  className={ cn( {
                    'bg-brand-primary text-white': selectedCommandIndex === index,
                  } ) }>
                  /
                </span>{ ' ' }
                { cmd.command }
                <span className="text-sx text-gray-500"> - { cmd.info }</span>
              </li>
            ) ) }
          </ul>
        </div>
      ) }

      { selectedCommand?.command && selectedCommand?.command === 'edit' && (
        <OpenPostEdit
          message={ message }
          onMessageBoxKeyUp={ onMessageBoxKeyUp }
          onSetMessage={ onSetMessage }
        />
      ) }
      { selectedCommand?.command && selectedCommand?.command === 'gb' && (
        <EditGutenbergContent
          message={ message }
          onMessageBoxKeyUp={ onMessageBoxKeyUp }
          onSetMessage={ onSetMessage }
        />
      ) }
    </>
  );
}
