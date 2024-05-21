import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import OpenPostEdit from './OpenPostEdit';

type SlashCommand = {
  command: string;
  info: string;
  action?: () => void;
};

export default function Commands( {
  onMessageBoxKeyDown,
  onSetMessage,
  message,
}: {
  onMessageBoxKeyDown: React.KeyboardEvent< HTMLTextAreaElement > | undefined;
  onSetMessage: ( message: string ) => void;
  message: string;
} ) {
  const slashCommands = [
    { command: 'goto', info: 'Go to a specific page' },
    { command: 'explain', info: 'Explain a specific topic' },
    { command: 'help', info: 'Get help' },
    // TODO: Automatically add all CPT's and taxonomies
    {
      command: 'new post',
      info: 'Create a new post',
      action: () => {
        document.location.href = '/wp-admin/post-new.php';
      },
    },
    { command: 'new conversation', info: 'Create a new conversation' },
    {
      command: 'edit',
      info: 'Edit a specific page',
      action: () => {},
    },
    { command: 'settings', info: 'Open the settings page' },
    { command: 'dashboard', info: 'Go to Dashboard' },
  ];

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
    // Hack to get the right value of the textarea. If i try to get the value right away it will return the previous value
    // because the value is not updated yet
    if ( e.target.value[ 0 ] === '/' && ! selectedCommand ) {
      setFirstSlashDetected( true );
      const value = e.target.value.slice( 1 );
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
    handleMessageBoxKeyDown( onMessageBoxKeyDown ); // Cast the event type to KeyboardEvent
  }, [ onMessageBoxKeyDown ] );

  useEffect( () => {
    getActiveCommand();
  }, [ message ] );

  return (
    <>
      { filteredCommands.length && (
        <div
          className={ cn(
            'absolute bottom-full left-0 rounded border border-gray-300 bg-gray-100 p-1',
            firstSlashDetected ? 'block' : 'hidden',
          ) }>
          <ul>
            { filteredCommands.map( ( cmd, index ) => (
              <li
                key={ index }
                className={ cn(
                  'px-1',
                  selectedCommandIndex === index ? 'bg-brand-primary text-white' : '',
                ) }>
                <span
                  className={ cn(
                    selectedCommandIndex === index ? 'bg-brand-primary text-white' : '',
                  ) }>
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
          onMessageBoxKeyDown={ onMessageBoxKeyDown }
          onSetMessage={ onSetMessage }
        />
      ) }
    </>
  );
}
