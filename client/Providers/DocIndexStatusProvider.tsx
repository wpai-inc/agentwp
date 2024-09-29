import { useEffect, useMemo, useState } from 'react';
import { createContext, useContext } from 'react';
import { useRestRequest } from './RestRequestProvider';

type ContextProps = {
  total: number;
  indexed: number;
  percent: number;
  current?: App.Data.DocIndexStatusData;
  remaining: App.Data.DocIndexStatusData[];
  done: boolean;
  hasIndexed: boolean;
  startIndexing: () => void;
};

export const DocIndexStatusContext = createContext< ContextProps | undefined >( undefined );

export function useDocIndexStatus() {
  const ctx = useContext( DocIndexStatusContext );
  if ( ! ctx ) {
    throw new Error( 'useDocIndexStatus must be used within DocIndexStatusProvider' );
  }
  return ctx;
}

export function DocIndexStatusProvider( { children }: { children: React.ReactNode } ) {
  const { tryRequest, proxyApiRequest } = useRestRequest();
  const [ docIndex, setDocIndex ] = useState< App.Data.DocIndexStatusData[] >( [] );
  const [ hasIndexed, setHasIndexed ] = useState( true );

  const total = useMemo(
    () => docIndex.reduce( ( acc, curr ) => acc + curr.total, 0 ),
    [ docIndex ],
  );

  const indexed = useMemo(
    () => docIndex.reduce( ( acc, curr ) => acc + curr.indexed, 0 ),
    [ docIndex ],
  );

  const currentId: number | null = useMemo(
    () => docIndex.find( doc => ! doc.done )?.id ?? null,
    [ docIndex ],
  );

  // Memoize `current` to avoid unnecessary re-renders
  const current = useMemo(
    () => docIndex.find( doc => doc.id === currentId ),
    [ docIndex, currentId ],
  );

  const remaining = useMemo(
    () => docIndex.filter( doc => ! doc.done && doc.id !== current?.id ),
    [ docIndex, current ],
  );

  const percent = Math.round( ( indexed / total ) * 100 );

  const done: boolean = useMemo( () => docIndex.every( doc => doc.done ), [ docIndex ] );

  function fetchDocIndexStatus() {
    proxyApiRequest( 'siteDocsIndexStatus' ).then( data => {
      console.log( 'data', data );
      setHasIndexed( data.lastIndexedAt ? true : false );
      setDocIndex( data.statuses );
    } );
  }

  async function startIndexing() {
    setHasIndexed( true );
    tryRequest( 'post', 'index_site_docs' );
  }

  // useEffect( fetchDocIndexStatus, [] );

  useEffect( () => {
    const interval = setInterval( fetchDocIndexStatus, 3000 );

    if ( done ) {
      clearInterval( interval );
    }

    return () => clearInterval( interval );
  }, [ done ] );

  return (
    <DocIndexStatusContext.Provider
      value={ {
        total,
        indexed,
        percent,
        current,
        remaining,
        done,
        hasIndexed,
        startIndexing,
      } }>
      { children }
    </DocIndexStatusContext.Provider>
  );
}
