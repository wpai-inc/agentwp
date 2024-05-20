import { createContext, ReactNode, useContext, useState } from 'react';
import { nextId } from '@/lib/utils';

type Notification = {
  id: string;
  content: string;
  className: string;
};

type Notifications = Notification[] | null;

type NotificationContext = {
  notifications: Notifications;
  addNotification: ( notification: string, type?: string ) => void;
  removeNotification: ( id: string ) => void;
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
  const [ notifications, setNotifications ] = useState< Notifications >( [] );

  const addNotification = ( notification: string, type: string = 'default' ) => {
    const className = `agentwp-${ type }-notification`;

    setNotifications( [
      ...notifications,
      {
        id: nextId(),
        content: notification,
        className: className,
      },
    ] );
  };

  const removeNotification = ( id: string ) =>
    setNotifications( notifications.filter( notification => notification.id !== id ) );

  return (
    <NotificationsContext.Provider
      value={ {
        notifications,
        addNotification,
        removeNotification,
      } }>
      { children }
    </NotificationsContext.Provider>
  );
};
