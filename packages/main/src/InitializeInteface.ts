import { EnumServices } from "../../../types/enums/configTabsAndKeys";
import ControlTray from "./handlers/ControlTray";
import { RegisterListenersIpcMain } from "./handlers/ipmain";
import { StartPixSrvice } from "./services/Api_Pix";
import { GetServices } from "./services/local_storage";
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

export function ActivateServicesByConfiguration(service?: EnumServices) {
  const Services = GetServices();
  function IsActive(sub_category: EnumServices) {
    return Services.find((service) => service.sub_category === sub_category);
  }
  if (service === EnumServices.pix || IsActive(EnumServices.pix)) {
    PixService();
  }
}
export function StopServicesByConfiguration(service?: EnumServices) {
  const Services = GetServices();
  function IsActive(sub_category: EnumServices) {
    return Services.find((service) => service.sub_category === sub_category);
  }
  if (service === EnumServices.pix || !IsActive(EnumServices.pix)) {
    WindowPix().Stop();
  }
}

export function InitializeInterface() {
  RegisterListenersIpcMain();
  ControlTray().Create();
  WindowConfigurationPanel().Create();
  WindowConfigurationPanel().Focus();
  ActivateServicesByConfiguration();
}
