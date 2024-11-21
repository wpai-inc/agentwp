import MessageHeader from '@/Components/Chat/Convo/Message/MessageHeader';
import Avatar from '@/Components/Chat/Avatar/Avatar';
import { logoUrl } from '@/Components/Logo';
import { Button } from '@/Components/ui/button';
import { useAccount } from '@/Providers/AccountProvider';
import { useTranslation } from 'react-i18next';

export default function OverageAlert( { message }: { message: string } ) {
  const { t } = useTranslation();
  const { account } = useAccount();
  return (
    <div className="border-b border-brand-gray-25 p-4">
      <MessageHeader>
        <Avatar
          name="AgentWP"
          time={ 'just now' }
          image={ logoUrl }
          className="border-brand border p-1"
        />
      </MessageHeader>
      <div className="flex flex-col gap-4">
        <p className="text-base">{ message }</p>
        { account?.plan?.slug === 'free' && (
          <Button variant="brand" pill={ true }>
            <a href={ account?.upgrade_link }>{ t( 'Upgrade to Pro' ) }</a>
          </Button>
        ) }
      </div>
    </div>
  );
}
