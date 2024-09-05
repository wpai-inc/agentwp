import { createContext, FC, useContext, useState } from 'react';

type ContextProps = {
  query: string;
  setQuery: ( query: string ) => void;
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
  const [ query, setQuery ] = useState< string >( '' );

  return (
    <SearchContext.Provider
      value={ {
        query,
        setQuery,
      } }>
      { children }
    </SearchContext.Provider>
  );
};
