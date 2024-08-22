import { createContext, ReactNode, useContext } from 'react';
import { Toaster } from '@/Components/ui/sonner';
import { toast } from 'sonner';

type NotificationContext = {
  notify: typeof toast;
};

export const NotificationsContext = createContext< NotificationContext | undefined >( undefined );

export const useNotifications = () => {
  const notifications = useContext( NotificationsContext );
  if ( notifications === undefined ) {
    throw new Error( 'useNotifications must be used within a NotificationsContext' );
  }
  return notifications;
};

export const NotificationsProvider = ( { children }: { children: ReactNode } ) => {
  return (
    <NotificationsContext.Provider value={ { notify: toast } }>
      { children }
      <Toaster position="bottom-right" richColors closeButton />
    </NotificationsContext.Provider>
  );
};
