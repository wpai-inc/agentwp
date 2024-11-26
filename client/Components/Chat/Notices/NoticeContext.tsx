import { useInputSelect } from '@/Providers/InputSelectProvider';
import { ChatNotice } from './ChatNotice';
import { useTranslation } from 'react-i18next';

export default function NoticeContext( {
  selectedInput,
}: {
  selectedInput: App.Data.StreamableFieldData;
} ) {
  const { setSelectedInput } = useInputSelect();
  const { t } = useTranslation();

  return (
    <ChatNotice
      dismissable="Deselect"
      onDismiss={ () => setSelectedInput( null ) }
      variant="informative">
      <p>
        { t( 'Field' ) } <strong>{ selectedInput.data?.inputLabel }</strong> { t( 'selected' ) }
      </p>
    </ChatNotice>
  );
}
