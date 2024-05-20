import { SnackbarList } from '@wordpress/components';
import { createPortal } from 'react-dom';
import { useNotifications } from '@/Providers/NotificationProvider';
import { cn } from '@/lib/utils';

export const Notifications = ( { ...props } ) => {
  return createPortal( <NotificationsBody { ...props } />, document.body );
};
export const NotificationsBody = ( { ...props } ) => {
  const notificationsContext = useNotifications();

  return (
    <SnackbarList
      notices={ notificationsContext.notifications }
      className={ cn( 'agentwp-components-snackbar-list', props.className || '' ) }
      onRemove={ notificationsContext.removeNotification }
    />
  );
};
