import { useInputSelect } from '@/Providers/InputSelectProvider';
import { ChatNotice } from './ChatNotice';

export default function NoticeContext( {
  selectedInput,
}: {
  selectedInput: App.Data.StreamableFieldData;
} ) {
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
