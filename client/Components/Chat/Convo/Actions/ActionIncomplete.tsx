import { useStream } from '@/Providers/StreamProvider';
import ActionContainer from './ActionContainer';

export default function ActionIncomplete( { userRequestId }: { userRequestId: string } ) {
  const { retryStream } = useStream();

  return (
    <ActionContainer
      title="Try again"
      pending={ false }
      handleRetry={ () => retryStream( userRequestId ) }
    />
  );
}
