import { PageData } from '@/Types/types';
import { createContext, useContext } from 'react';
export const PageContext = createContext<any | undefined>(undefined);

export function usePage() {
  const page = useContext(PageContext);
  if (page === undefined) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return page;
}

export function PageProvider({
  page,
  children,
}: {
  page: PageData;
  children: React.ReactNode;
}) {
  return <PageContext.Provider value={page}>{children}</PageContext.Provider>;
}
