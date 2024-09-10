import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { useEffect, useState } from 'react';
import { SuggestionBoxProps } from './helpers/types';

export default function SuggestionsBox( { show, keyword, onSelect }: SuggestionBoxProps ) {
  const { adminRequest } = useAdminRoute();
  const [ suggestions, setSuggestions ] = useState< any[] >( [] );

  useEffect( () => {
    if ( show ) {
      getSuggestions();
    }
  }, [ show, keyword ] );

  const getSuggestions = async () => {
    try {
      const result = await adminRequest.get( 'mention_items', { params: { keyword } } );
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
        { suggestions && Object.keys( suggestions ).length > 0
          ? Object.keys( suggestions ).map( ( key: any, index ) => (
              <div key={ index }>
                <h5 className="font-bold border-b border-grey p-2 mb-2">
                  { suggestions[ key ].title }
                </h5>
                <ul>
                  { typeof suggestions[ key ].items === 'object' &&
                    suggestions[ key ].items.map( ( suggestion: any, i: number ) => (
                      <li
                        onClick={ () => onSelect( suggestion ) }
                        className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                        key={ i }>
                        { suggestion.title }
                      </li>
                    ) ) }
                </ul>
              </div>
            ) )
          : 'No suggestions found' }
      </div>
    </div>
  );
}
