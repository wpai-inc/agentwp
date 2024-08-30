import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { useEffect, useState } from 'react';

export default function SuggestionsBox( {
  show,
  keyword,
  onSelect,
}: {
  show: boolean;
  keyword: string;
  onSelect: ( suggestion: any ) => void;
} ) {
  const { adminRequest } = useAdminRoute();
  const [ suggestions, setSuggestions ] = useState< any[] >( [] );

  useEffect( () => {
    if ( show ) {
      getKeywordSuggestions();
    }
  }, [ show, keyword ] );

  const getKeywordSuggestions = async () => {
    try {
      const result = await adminRequest.get( 'reference_items', { params: { keyword } } );
      setSuggestions( result.data.data );
    } catch ( e ) {
      // Do nothing
    }
  };

  return (
    <div
      className={ `w-full absolute bottom-full left-0 p-2 ${ ! show && 'hidden' }` }
      style={ { zIndex: 99 } }>
      <div className="w-full border border-grey rounded bg-white p-2 shadow overflow-y-auto max-h-64">
        { suggestions
          ? Object.keys( suggestions ).map( ( key: string | number ) => (
              <div key={ key }>
                <h5 className="font-bold border-b border-grey p-2 mb-2">{ key }</h5>
                <ul>
                  { suggestions[ key ].map( ( suggestion: any ) => (
                    <li
                      onClick={ () => onSelect( suggestion ) }
                      className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                      key={ suggestion.id }>
                      { suggestion.title }
                    </li>
                  ) ) }
                </ul>
              </div>
            ) )
          : 'Please wait...' }
      </div>
    </div>
  );
}
