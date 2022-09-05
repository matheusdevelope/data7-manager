import type { NotificationConstructorOptions } from "electron";
import { Notification } from "electron";
import { resolve } from "path";

let notifications: Notification[] = [];

function CreateNotification(options: NotificationConstructorOptions) {
  const noti = new Notification({
    icon: resolve(__dirname, "icon.ico"),
    ...options,
  });
  notifications.push(noti);
  noti.show();
  return noti;
}
function RemoveAllNotifications() {
  notifications.forEach((notification) => notification.close());
  notifications = [];
}

export { CreateNotification, RemoveAllNotifications };
