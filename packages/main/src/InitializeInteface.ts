import ControlTray from "./handlers/ControlTray";
import { RegisterListenersIpcMain } from "./handlers/ipmain";
import { WindowPix } from "./windows/pix";

export function InitializeInterface() {
  RegisterListenersIpcMain();
  ControlTray().Create();
  WindowPix().Create();
}
