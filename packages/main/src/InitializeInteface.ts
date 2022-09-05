import { EnumServices } from "../../../types/enums/configTabsAndKeys";
import { Global_State } from "./global_state";
import ControlTray from "./handlers/ControlTray";
import { RegisterListenersIpcMain } from "./handlers/ipmain";
import { CreateNotification } from "./handlers/notifications";
import { StartPixSrvice } from "./services/Api_Pix";
import { GetServices } from "./services/local_storage";
import { WindowConfigurationPanel } from "./windows/configuration";
import { WindowPix } from "./windows/pix";

function PixService() {
  WindowPix().Create(() => {
    try {
      StartPixSrvice();
    } catch (e) {
      console.error(e);
    }
  });
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
  !import.meta.env.DEV &&
    CreateNotification({
      title: "Atenção",
      body: `O serviço ${Global_State.name_app} está sendo executado.`,
    });
  ActivateServicesByConfiguration();
}
