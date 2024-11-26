import useCopy from '@/Hooks/copy';
import IconCopy from '@material-design-icons/svg/outlined/content_copy.svg?react';
import { useTranslation } from 'react-i18next';

export default function CopyAgentResponse( { message }: { message: string } ) {
  const { copy, copied } = useCopy();
  const { t } = useTranslation();
  function handleClick( e: React.MouseEvent ) {
    e.preventDefault();
    copy( message );
  }
  return (
    <button className="hover:text-brand-gray-100 flex gap-2" onClick={ handleClick }>
      <IconCopy className="h-4 w-4" />
      { copied ? t( 'Copied!' ) : t( 'Copy Response' ) }
    </button>
  );
}
