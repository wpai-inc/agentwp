import { Button } from '@/Components/ui/button';
import { ChatNotice } from '../../Notices/ChatNotice';
import { useDocIndexStatus } from '@/Providers/DocIndexStatusProvider';
import { useTranslation } from 'react-i18next';

export default function DocIndexStart() {
  const { startIndexing } = useDocIndexStatus();
  const { t } = useTranslation();
  return (
    <ChatNotice variant="informative" dismissable>
      <div className="flex gap-2 items-center">
        <Button onClick={ startIndexing }>{ t( 'Start Indexing' ) }</Button>
        <p>{ t( "You haven't indexed your site yet." ) }</p>
      </div>
    </ChatNotice>
  );
}
