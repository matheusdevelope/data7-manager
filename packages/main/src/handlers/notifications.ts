import type { NotificationConstructorOptions } from "electron";
import { Notification } from "electron";
import { resolve } from "path";
import { Global_State } from "../global_state";

let notifications: Notification[] = [];

function CreateNotification(options: NotificationConstructorOptions) {
  const noti = new Notification({
    icon: resolve(__dirname, "icon.ico"),
    title: Global_State.name_app,
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
