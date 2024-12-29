import { useStorage } from '@extension/shared';
import { notificationStorage } from '@extension/storage';

export const useNotification = () => {
  const notification = useStorage(notificationStorage);
  const requireInteraction = notification === 'required';

  return { requireInteraction, toggle: notificationStorage.toggle };
};
