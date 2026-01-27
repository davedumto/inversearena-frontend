import { useCallback } from 'react';
import { useNotificationContext } from '../../components/ui/NotificationProvider';
import type { NotificationConfig, NotificationType } from '../types/notification';

interface NotificationOptions {
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotifyFunction {
  (config: NotificationConfig): string;
  (message: string, options?: NotificationOptions): string;
  success: (message: string, options?: NotificationOptions) => string;
  error: (message: string, options?: NotificationOptions) => string;
  info: (message: string, options?: NotificationOptions) => string;
  warning: (message: string, options?: NotificationOptions) => string;
}

export function useNotification() {
  const { addNotification } = useNotificationContext();

  const notify = useCallback((
    configOrMessage: NotificationConfig | string,
    options?: NotificationOptions
  ): string => {
    if (typeof configOrMessage === 'string') {
      // Called with message string and options
      const config: NotificationConfig = {
        message: configOrMessage,
        type: 'info',
        ...options,
      };
      return addNotification(config);
    } else {
      // Called with full config object
      return addNotification(configOrMessage);
    }
  }, [addNotification]);

  const createTypeSpecificNotify = useCallback((type: NotificationType) => {
    return (message: string, options?: NotificationOptions): string => {
      const config: NotificationConfig = {
        message,
        type,
        ...options,
      };
      return addNotification(config);
    };
  }, [addNotification]);

  // Create type-specific methods
  const notifyWithMethods = notify as NotifyFunction;
  notifyWithMethods.success = createTypeSpecificNotify('success');
  notifyWithMethods.error = createTypeSpecificNotify('error');
  notifyWithMethods.info = createTypeSpecificNotify('info');
  notifyWithMethods.warning = createTypeSpecificNotify('warning');

  return notifyWithMethods;
}