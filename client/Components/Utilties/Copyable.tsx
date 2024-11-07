import { useEffect } from 'react';
import useCopy from '@/Hooks/copy';

export default function Copyable( { text }: { text: string } ) {
  const { copy, copied, setCopied } = useCopy();

  useEffect( () => {
    if ( copied ) {
      const timeout = setTimeout( () => {
        setCopied( false );
      }, 2000 );

      return () => clearTimeout( timeout );
    }
  }, [ copied, setCopied ] );

  function handleClick( e: React.MouseEvent< HTMLButtonElement > ) {
    e.preventDefault();
    copy( text );
  }

  return (
    <button className="hover:cursor-copy" onClick={ handleClick }>
      { copied ? 'Copied' : text }
    </button>
  );
}
