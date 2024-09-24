import { ChatNotice } from '../Notices/ChatNotice';
import IconComment from '@material-design-icons/svg/outlined/comment.svg?react';

export default function ConvoOnlyNotice() {
  return (
    <div className="px-2">
      <ChatNotice
        size="sm"
        variant={ 'brand' }
        action={
          <a
            href="https://agentwp.com/convo-only-mode/"
            target="_blank"
            rel="noreferrer noopener"
            className="ml-auto inline-block underline underline-offset-2">
            Learn More
          </a>
        }>
        <span className="flex gap-1">
          <IconComment className="h-4 w-4 mr-2" />
          <span>Conversation Only Mode (no Agent)</span>
        </span>
      </ChatNotice>
    </div>
  );
}
