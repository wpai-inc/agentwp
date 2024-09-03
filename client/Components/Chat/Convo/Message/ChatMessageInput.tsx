import MessageBox from '@/Components/Chat/MessageBox/MessageBox';
import { TokenUsageStatus } from '@/Types/enums';
import OverCapacity from '@/Components/Chat/OverCapacity';
import { usePage } from '@/Providers/PageProvider';

export default function ChatMessageInput( {
  coolDownTime,
  tokenUsageStatus,
}: {
  coolDownTime: Date | null;
  tokenUsageStatus: TokenUsageStatus;
} ) {
  const { page } = usePage();

  return (
    <>
      { page.account.plan.slug === 'free' && tokenUsageStatus !== TokenUsageStatus.Normal ? (
        <OverCapacity cooldownTime={ coolDownTime } tokenUsageStatus={ tokenUsageStatus } />
      ) : (
        <MessageBox />
      ) }
    </>
  );
}
