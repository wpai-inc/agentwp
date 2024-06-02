import { useState } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import { cn } from '@/lib/utils';
import IconDisapprove from '@material-design-icons/svg/outlined/thumb_down.svg?react';
import IconApprove from '@material-design-icons/svg/outlined/thumb_up.svg?react';
import { FeedbackType } from '@/Types/types';

export default function Feedback( {
  userRequestId,
  feedback,
}: {
  userRequestId: string;
  feedback?: FeedbackType;
} ) {
  const { client } = useClient();
  const [ approved, setApproved ] = useState< boolean | undefined >( feedback?.approved );

  function handleApproval( approved: boolean ) {
    setApproved( approved );
    client.isAuthorized()?.feedback( userRequestId, {
      approved,
    } );
  }

  return (
    <div className="flex gap-2 items-center text-brand-gray-15">
      <button
        onClick={ () => handleApproval( false ) }
        className={ cn( 'hover:text-red-400', { 'text-red-400': approved === false } ) }>
        <IconDisapprove className="h-5 w-5" />
      </button>
      <button
        onClick={ () => handleApproval( true ) }
        className={ cn( 'hover:text-green-400', { 'text-green-400': approved === true } ) }>
        <IconApprove className="h-5 w-5" />
      </button>
    </div>
  );
}
