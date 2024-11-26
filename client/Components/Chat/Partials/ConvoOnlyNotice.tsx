import { ChatNotice } from '../Notices/ChatNotice';
import IconComment from '@material-design-icons/svg/outlined/comment.svg?react';
import { useTranslation } from 'react-i18next';

export default function ConvoOnlyNotice() {
  const { t } = useTranslation();
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
            className="underline underline-offset-2">
            { t( 'Learn More' ) }
          </a>
        }>
        <span className="flex gap-1">
          <IconComment className="mr-2 h-4 w-4" />
          <span>{ t( 'Conversation Only Mode (no Agent)' ) }</span>
        </span>
      </ChatNotice>
    </div>
  );
}
