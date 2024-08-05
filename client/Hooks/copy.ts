import { useState } from 'react';

export default function useCopy() {
  const [ copied, setCopied ] = useState( false );

  function copy(text: string|number) {
    navigator.clipboard.writeText( text.toString() );
    setCopied( true );
    setTimeout( () => setCopied( false ), 2000 );
  }

  return { copy, copied };
}