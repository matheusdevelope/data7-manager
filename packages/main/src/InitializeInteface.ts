import ControlTray from "./handlers/ControlTray";
import { RegisterListenersIpcMain } from "./handlers/ipmain";
import { StartPixSrvice } from "./services/Api_Pix";
import { WindowConfigurationPanel } from "./windows/configuration";
import { WindowPix } from "./windows/pix";

function PixService() {
  try {
    StartPixSrvice();
  } catch (e) {
    console.error(e);
  }
  WindowPix().Create();
}

function ActivateServicesByConfiguration() {
  WindowConfigurationPanel().Create();
  WindowConfigurationPanel().Focus();
  PixService();
}

export function InitializeInterface() {
  RegisterListenersIpcMain();
  ControlTray().Create();
  ActivateServicesByConfiguration();
}
