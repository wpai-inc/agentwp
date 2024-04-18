import AdminRequest from '@/lib/AdminRequest';
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
  page: any;
  children: React.ReactNode;
}) {
  const admin = new AdminRequest(page);
  return (
    <PageContext.Provider value={{ page, admin }}>
      {children}
    </PageContext.Provider>
  );
}
