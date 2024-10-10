import { ChatNotice } from './ChatNotice';
import { ChatErrorType } from '@/Providers/ErrorProvider';

export default function NoticeError( { errors }: { errors: ChatErrorType[] } ) {
  return errors.map( ( err: any ) => (
    <ChatNotice variant="destructive" size="sm" key={ err.id } dismissable="Dismiss">
      { err.actionText && err.actionUrl ? (
        <>
          { err.message } <br />
          <a
            href={ err.actionUrl }
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline">
            { err.actionText }
          </a>
        </>
      ) : (
        <>{ err.message }</>
      ) }
    </ChatNotice>
  ) );
}
