import IconApprove from '@material-design-icons/svg/outlined/thumb_down.svg?react';
import IconDisapprove from '@material-design-icons/svg/outlined/thumb_up.svg?react';

export default function Feedback() {
  return (
    <div className="flex gap-2 items-center text-brand-gray-15">
      <button className="hover:text-red-400">
        <IconApprove />
      </button>
      <button className="hover:text-green-400">
        <IconDisapprove />
      </button>
    </div>
  );
}
