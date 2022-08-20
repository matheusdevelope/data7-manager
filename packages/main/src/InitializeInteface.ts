import { Global_State } from "./global_state";
import ControlTray from "./handlers/ControlTray";
import { RegisterListenersIpcMain } from "./handlers/ipmain";
import { CreateNotification } from "./handlers/notifications";
import { WindowPix } from "./windows/pix";

export function InitializeInterface() {
  CreateNotification({
    silent: true,
    body: Global_State.name_app + " ativo.",
  });
  RegisterListenersIpcMain();
  ControlTray().Create();
  WindowPix().Create();
}
