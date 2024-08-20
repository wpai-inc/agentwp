import { useInputSelect } from '@/Providers/InputSelectProvider';
import { ChatNotice } from '../Alerts/Notice';
import type { StreamableFieldType } from '@/Types/types';
import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';

export default function ContentContext( {
  selectedInput,
}: {
  selectedInput: StreamableFieldType;
} ) {
  const { setSelectedInput } = useInputSelect();

  return (
    <ChatNotice>
      <div className="flex justify-between items-center">
        <p>
          Streaming to: <strong>{ selectedInput.data?.inputLabel }</strong>
        </p>
        <button
          onClick={ () => setSelectedInput( null ) }
          className="hover:bg-white/60 rounded p-1">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </ChatNotice>
  );
}
