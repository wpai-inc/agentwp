import { ChatNotice } from './ChatNotice';
import { ChatErrorType } from '@/Providers/ErrorProvider';

export default function NoticeError( { errors }: { errors: ChatErrorType[] } ) {
  return errors.map( ( err: any ) => (
    <ChatNotice variant="destructive" size="sm" key={ err.id } dismissable="Dismiss">
      { err.message }
    </ChatNotice>
  ) );
}
