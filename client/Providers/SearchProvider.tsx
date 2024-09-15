import { createContext, FC, useContext, useState } from 'react';
import { useRestRequest } from './RestRequestProvider';
import { AxiosResponse } from 'axios';

type ContextProps = {
  query: string;
  setQuery: ( query: string ) => void;
  results: SearchQueryResponseType | null;
  pending: boolean;
  search: ( query: string ) => void;
  resetQuery: () => void;
};

export const SearchContext = createContext< ContextProps | undefined >( undefined );

export function useSearch() {
  const ctx = useContext( SearchContext );
  if ( ! ctx ) {
    throw new Error( 'useSearch must be used within SearchProvider' );
  }
  return ctx;
}

export type SearchResult = {
  id: number;
  type: string;
  title: string;
  excerpt?: string;
  url: string;
  author?: string;
  date: string;
  thumbnail?: string;
  score: number;
};

type SearchQueryResponseType = {
  total: number;
  results: SearchResult[];
  summary?: string;
};

export const SearchProvider: FC< { children: React.ReactNode } > = ( { children } ) => {
  const { tryRequest } = useRestRequest();
  const [ query, setQuery ] = useState< string >( '' );
  const [ results, setResults ] = useState< SearchQueryResponseType | null >( null );
  const [ pending, setPending ] = useState< boolean >( false );

  async function search( query: string ) {
    setQuery( query );
    setPending( true );
    const res: AxiosResponse = await tryRequest( 'get', 'search_query', {
      query,
    } );
    setResults( res.data );
    setPending( false );
  }

  function resetQuery() {
    setQuery( '' );
    setResults( null );
  }

  return (
    <SearchContext.Provider
      value={ {
        query,
        setQuery,
        results,
        pending,
        search,
        resetQuery,
      } }>
      { children }
    </SearchContext.Provider>
  );
};
