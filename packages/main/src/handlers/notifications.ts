import type { NotificationConstructorOptions } from 'electron';
import { Notification } from 'electron';
import { resolve } from 'path';

function CreateNotification(options: NotificationConstructorOptions) {
  return new Notification({
    icon: resolve(__dirname, '../', 'assets', 'icon.ico'),
    ...options,
  }).show();
}

export { CreateNotification };
