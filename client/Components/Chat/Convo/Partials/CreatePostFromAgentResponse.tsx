import { useRestRequest } from '@/Providers/RestRequestProvider';
import IconPostAdd from '@material-design-icons/svg/outlined/post_add.svg?react';
import { useState } from 'react';
import { Spinner } from '@/Components/Spinner';
import { useTranslation } from 'react-i18next';

export default function CreatePostFromAgentResponse( { message }: { message: string } ) {
  const [ creating, setCreating ] = useState( false );
  const [ error, setError ] = useState( false );
  const { t } = useTranslation();
  const { tryRequest } = useRestRequest();

  async function handleClick( e: React.MouseEvent ) {
    e.preventDefault();
    setCreating( true );

    const { data } = await tryRequest< { url: string } >( 'post', 'create_post', {
      post: message,
    } );

    if ( data.url ) {
      window.location.href = data.url;
    } else {
      setError( true );
      setCreating( false );
    }
  }

  return (
    <button className="hover:text-brand-gray-100 flex gap-2" onClick={ handleClick }>
      { creating ? (
        <>
          <Spinner />
          <span>{ t( 'Creating Post...' ) }</span>
        </>
      ) : (
        <>
          <IconPostAdd className="h-4 w-4" />
          { error ? t( 'Error Creating Post' ) : t( 'Create Post from Agent Response' ) }
        </>
      ) }
    </button>
  );
}
