import { useStream } from '@/Providers/StreamProvider';
import ActionContainer from './ActionContainer';
import IconRenew from '@material-design-icons/svg/outlined/autorenew.svg?react';

export default function ActionIncomplete( { userRequestId }: { userRequestId: string } ) {
  const { startStream } = useStream();

  return (
    <ActionContainer pending={ false }>
      <div className="flex justify-between items-center">
        <p>Try again</p>
        <button onClick={ () => startStream( userRequestId ) }>
          <IconRenew />
        </button>
      </div>
    </ActionContainer>
  );
}
