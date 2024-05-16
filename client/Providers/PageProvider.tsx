import { createContext, useContext } from 'react';
import type { PageData } from '@/Types/types';
export const PageContext = createContext<any | undefined>(undefined);

declare const agentwp_settings: PageData;

export function usePage() {
  const page = useContext(PageContext);
  if (page === undefined) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return { ...page, ...agentwp_settings };
}

export function PageProvider({
  page,
  children,
}: {
  page: any;
  children: React.ReactNode;
}) {
  return <PageContext.Provider value={page}>{children}</PageContext.Provider>;
}
