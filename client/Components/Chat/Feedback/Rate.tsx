import { cn } from '@/lib/utils';
import IconDisapprove from '@material-design-icons/svg/outlined/thumb_down.svg?react';
import IconApprove from '@material-design-icons/svg/outlined/thumb_up.svg?react';
import { useFeedback } from '@/Providers/FeedbackProvider';

export default function Rate() {
  const { handleApproval, approved } = useFeedback();

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
