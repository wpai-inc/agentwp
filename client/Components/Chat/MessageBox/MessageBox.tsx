import React, { useState, useCallback } from 'react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';
import { useStream } from '@/Providers/StreamProvider';
import { cn } from '@/lib/utils';
import UpArrowIcon from '@material-design-icons/svg/outlined/arrow_upward.svg?react';
import TuneIcon from '@material-design-icons/svg/outlined/tune.svg?react';
import Commands from '../Commands/Commands';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { usePage } from '@/Providers/PageProvider';
import ChatSettings from '@/Page/Admin/Chat/Settings/ChatSettings';
import { useInputSelect } from '@/Providers/InputSelectProvider';

export default function MessageBox() {
  const { sendMessage, setChatSetting } = useChat();
  const { setSelectedInput } = useInputSelect();
  const { streamClosed } = useStream();
  const [ message, setMessage ] = useState( '' );
  const { page } = usePage();
  const [ keyUpEvent, setKeyUpEvent ] = useState<
    React.KeyboardEvent< HTMLTextAreaElement > | undefined
  >();

  const send = useCallback(
    ( msg: string ) => {
      sendMessage( msg );
      setMessage( '' );
    },
    [ sendMessage ],
  );

  function submit( e: React.FormEvent< HTMLFormElement > ) {
    e.preventDefault();
    send( message );
  }

  function handleKeyDown( e: React.KeyboardEvent< HTMLTextAreaElement > ) {
    if ( e.key === 'Enter' && ( e.metaKey || e.ctrlKey ) ) {
      send( message );
    }
  }

  function handleKeyUp( e: React.KeyboardEvent< HTMLTextAreaElement > ) {
    setKeyUpEvent( e );
  }

  function onSettingsClick( e: React.FormEvent ) {
    e.preventDefault();
    if ( page.onboarding_completed && page.agentwp_access ) {
      setChatSetting( { component: <ChatSettings />, header: 'Settings' } );
    }
  }

  return (
    <form className="relative rounded-lg bg-white p-2" onSubmit={ submit }>
      <Commands onMessageBoxKeyUp={ keyUpEvent } onSetMessage={ setMessage } message={ message } />
      <textarea
        onChange={ e => setMessage( e.target.value ) }
        value={ message }
        className="h-24 w-full resize-none p-2 text-base"
        placeholder="Message..."
        onKeyDown={ handleKeyDown }
        onKeyUp={ handleKeyUp }
        disabled={ ! page.onboarding_completed && ! page.agentwp_access }
      />
      <div className="flex items-center justify-between">
        <AgentTooltip content="Conversation Settings">
          <Button
            asChild
            onClick={ onSettingsClick }
            variant="ghost"
            size="icon"
            disabled={ ! page.onboarding_completed && ! page.agentwp_access }
            className="text-brand-gray-50 hover:bg-inherit">
            <TuneIcon className="h-6 w-6" />
          </Button>
        </AgentTooltip>
        <Button
          type="submit"
          className={ cn( 'rounded bg-brand-primary px-2' ) }
          disabled={ ! streamClosed || ! page.onboarding_completed || ! page.agentwp_access }>
          { streamClosed ? <UpArrowIcon /> : 'Pending...' }
        </Button>
      </div>
    </form>
  );
}
