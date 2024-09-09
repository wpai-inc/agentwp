import { createContext, FC, useContext, useState } from 'react';
import { useAdminRoute } from './AdminRouteProvider';
import { AxiosResponse } from 'axios';

type ContextProps = {
  query: string;
  setQuery: ( query: string ) => void;
  results: any[];
  pending: boolean;
  search: ( query: string ) => void;
  summary: string;
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
  const { tryRequest } = useAdminRoute();
  const [ query, setQuery ] = useState< string >( '' );
  const [ results, setResults ] = useState< any >( [] );
  const [ pending, setPending ] = useState< boolean >( false );
  const [ summary, setSummary ] = useState< string >( '' );

  async function search( query: string ) {
    setQuery( query );
    setPending( true );
    const res: AxiosResponse< SearchQueryResponseType > = await tryRequest( 'get', 'search_query', {
      query,
    } );
    setResults( res.data.results );
    setSummary( res.data.summary || '' );
    setPending( false );
  }

  function resetQuery() {
    setQuery( '' );
    setSummary( '' );
    setResults( [] );
  }

  return (
    <SearchContext.Provider
      value={ {
        query,
        setQuery,
        results,
        pending,
        search,
        summary,
        resetQuery,
      } }>
      { children }
    </SearchContext.Provider>
  );
};
