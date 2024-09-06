import { Button } from '@/Components/ui/button';
import { ChatNotice } from '../../Notices/ChatNotice';
import { useDocIndexStatus } from '@/Providers/DocIndexStatusProvider';

export default function DocIndexStart() {
  const { startIndexing } = useDocIndexStatus();
  return (
    <ChatNotice variant="informative" dismissable>
      <div className="flex gap-2 items-center">
        <Button onClick={ startIndexing }>Start Indexing</Button>
        <p>You haven't indexed your site yet.</p>
      </div>
    </ChatNotice>
  );
}
