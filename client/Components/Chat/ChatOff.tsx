import { useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { useApp } from '@/Providers/AppProvider';
import ToggleButton from '@/Components/Chat/ToggleButton/ToggleButton';
import { useTranslation } from 'react-i18next';

export default function ChatOff() {
  const { t } = useTranslation();
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
            { t( 'AgentWP is off.' ) }
            <br /> { t( 'Click to reinitialize.' ) }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
