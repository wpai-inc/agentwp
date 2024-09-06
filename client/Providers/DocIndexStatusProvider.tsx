import { useEffect, useMemo, useState } from 'react';
import { createContext, FC, useContext } from 'react';
import type { DocIndexStatusData } from '@/Types/types';
import { useClient } from './ClientProvider';
import { useAdminRoute } from './AdminRouteProvider';

type ContextProps = {
  total: number;
  indexed: number;
  percent: number;
  current?: DocIndexStatusData;
  remaining: DocIndexStatusData[];
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

export const DocIndexStatusProvider: FC< {
  children: React.ReactNode;
} > = ( { children } ) => {
  const { getDocIndexStatus } = useClient();
  const { tryRequest } = useAdminRoute();
  const [ docIndex, setDocIndex ] = useState< DocIndexStatusData[] >( [] );
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
    getDocIndexStatus().then( data => {
      setHasIndexed( data.lastIndexedAt ? true : false );
      setDocIndex( data.statuses );
    } );
  }

  function startIndexing() {
    setHasIndexed( true );
    tryRequest( 'post', 'index_site_docs' );
  }

  useEffect( fetchDocIndexStatus, [] );

  useEffect( () => {
    const interval = setInterval( fetchDocIndexStatus, 3000 );

    if ( done ) {
      clearInterval( interval );
    }

    return () => clearInterval( interval );
  }, [ done ] );

  console.log( 'hasIndexed', hasIndexed );
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
};
