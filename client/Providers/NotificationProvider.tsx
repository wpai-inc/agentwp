import { createContext, ReactNode, useContext } from 'react';
import { Toaster } from '@/Components/ui/sonner';
import { toast } from 'sonner';

type NotificationContext = {
  notify: ( msg: string ) => void;
};

export const NotificationsContext = createContext< NotificationContext | undefined >( undefined );

export const useNotifications = () => {
  const notifications = useContext( NotificationsContext );
  if ( notifications === undefined ) {
    throw new Error( 'useNotifications must be used within a NotificationsContext' );
  }
  return notifications;
};

type NotificationType = 'error' | 'success' | 'info' | 'warning';

export const NotificationsProvider = ( { children }: { children: ReactNode } ) => {
  function notify( msg: string, type: NotificationType = 'error' ) {
    const title = 'AgentWP';

    if ( type === 'error' ) {
      toast.error( title, {
        description: msg,
      } );
    } else {
      toast.info( title, {
        description: msg,
      } );
    }
  }

  return (
    <NotificationsContext.Provider value={ { notify } }>
      { children }
      <Toaster
        toastOptions={ {
          // unstyled: true,
          classNames: {
            toast: 'rounded-none',
            title: 'text-white/50',
            description: 'text-white/80',
            closeButton: 'ring-1 ring-white/60 bg-black text-white',
            error: 'bg-black/90',
          },
        } }
        position="bottom-right"
        closeButton
      />
    </NotificationsContext.Provider>
  );
};
