import { SnackbarList } from '@wordpress/components';
import { createPortal } from 'react-dom';
import { useNotificationsContext } from '@/Providers/useNotificationsContext';
import { cn } from '@/lib/utils';

export const Notifications = ({ ...props }) => {
  // const notificationsContext = useNotificationsContext();

  return createPortal(<NotificationsBody {...props} />, document.body);
};
export const NotificationsBody = ({ ...props }) => {
  const notificationsContext = useNotificationsContext();

  return (
    <SnackbarList
      notices={notificationsContext.notifications}
      className={cn('agentwp-components-snackbar-list', props.className || '')}
      onRemove={notificationsContext.removeNotification}
    />
  );
};
