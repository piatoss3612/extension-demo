import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

type RequireInteraction = 'required' | 'not-required';

type NotificationStorage = BaseStorage<RequireInteraction> & {
  toggle: () => Promise<void>;
};

const storage = createStorage<RequireInteraction>('notification-storage-key', 'not-required', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const notificationStorage: NotificationStorage = {
  ...storage,
  toggle: async () => {
    await storage.set(currentValue => {
      return currentValue === 'required' ? 'not-required' : 'required';
    });
  },
};
