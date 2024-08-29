import MessageBox from '@/Components/Chat/MessageBox/MessageBox';
import { TokenUsageStatus } from '@/Types/enums';
import OverCapacity from '@/Components/Chat/OverCapacity';

export default function ChatMessageInput( {
  coolDownTime,
  tokenUsageStatus,
}: {
  coolDownTime: Date | null;
  tokenUsageStatus: TokenUsageStatus;
} ) {
  return (
    <>
      { tokenUsageStatus !== TokenUsageStatus.Normal ? (
        <OverCapacity cooldownTime={ coolDownTime } tokenUsageStatus={ tokenUsageStatus } />
      ) : (
        <MessageBox />
      ) }
    </>
  );
}
