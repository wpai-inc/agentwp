import { useInputSelect } from '@/Providers/InputSelectProvider';
import { ChatNotice } from './ChatNotice';
import type { StreamableFieldType } from '@/Types/types';

export default function NoticeContext( { selectedInput }: { selectedInput: StreamableFieldType } ) {
  const { setSelectedInput } = useInputSelect();

  return (
    <ChatNotice
      dismissable="Deselect"
      onDismiss={ () => setSelectedInput( null ) }
      variant="informative">
      <p>
        Field <strong>{ selectedInput.data?.inputLabel }</strong> selected
      </p>
    </ChatNotice>
  );
}
