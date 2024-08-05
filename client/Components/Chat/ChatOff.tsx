import { useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { useApp } from '@/Providers/AppProvider';
import ToggleButton from '@/Components/Chat/ToggleButton/ToggleButton';

export default function ChatOff() {
  const { setTurnedOff } = useApp();
  const chatTriggerRef = useRef< HTMLButtonElement >( null );

  function handleTurnOn() {
    setTurnedOff( false );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleButton
            ref={ chatTriggerRef }
            open={ false }
            onClick={ handleTurnOn }
            className={ 'grayscale' }
          />
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <p>
            AgentWP is off.
            <br /> Click to reinitialize.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
