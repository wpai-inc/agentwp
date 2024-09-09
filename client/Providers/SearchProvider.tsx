import { createContext, FC, useContext, useState } from 'react';
import { useAdminRoute } from './AdminRouteProvider';

type ContextProps = {
  query: string;
  setQuery: ( query: string ) => void;
  results: any[];
  pending: boolean;
  search: ( query: string ) => void;
};

export const SearchContext = createContext< ContextProps | undefined >( undefined );

export function useSearch() {
  const ctx = useContext( SearchContext );
  if ( ! ctx ) {
    throw new Error( 'useSearch must be used within SearchProvider' );
  }
  return ctx;
}

export const SearchProvider: FC< {
  children: React.ReactNode;
} > = ( { children } ) => {
  const { tryRequest } = useAdminRoute();
  const [ query, setQuery ] = useState< string >( '' );
  const [ results, setResults ] = useState< any >( [] );
  const [ pending, setPending ] = useState< boolean >( false );

  async function search( query: string ) {
    setPending( true );
    const res = await tryRequest( 'post', 'search_query', { query } );
    setResults( res.data.results );
    // Perform search
  }

  return (
    <SearchContext.Provider
      value={ {
        query,
        setQuery,
        results,
        pending,
        search,
      } }>
      { children }
    </SearchContext.Provider>
  );
};
