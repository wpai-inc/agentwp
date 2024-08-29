import NoticeContext from '@/Components/Chat/Notices/NoticeContext';
import { useInputSelect } from '@/Providers/InputSelectProvider';
import { useError } from '@/Providers/ErrorProvider';
import NoticeError from '@/Components/Chat/Notices/NoticeError';

export default function ChatNotices() {
  const { selectedInput } = useInputSelect();
  const { errors } = useError();
  return (
    <>
      { errors.length > 0 && <NoticeError errors={ errors } /> }
      { selectedInput && <NoticeContext selectedInput={ selectedInput } /> }
    </>
  );
}
