import {
  EnumKeysHttpServer,
  EnumServices,
} from "../../../types/enums/configTabsAndKeys";
import { Global_State } from "./global_state";
import ControlTray from "./handlers/ControlTray";
import { RegisterListenersIpcMain } from "./handlers/ipmain";
import { CreateNotification } from "./handlers/notifications";
import { StartPixService } from "./services/ManageQueuePIX";
import { GetConfigTabs, GetServices } from "./services/local_storage";
import HTTP_Server from "./services/server_http";
import { WindowConfigurationPanel } from "./windows/configuration";
import { WindowPix } from "./windows/pix";
import Whatsapp from "./services/whatsapp";

function PixService() {
  WindowPix().Create(() => {
    try {
      StartPixService();
    } catch (e) {
      console.error(e);
    }
  });
}
function HttpService(Config: IOptionConfig2[]) {
  const port = Number(
    Config.find(
      (obj) =>
        obj.sub_category === EnumServices.http_server &&
        obj.key == EnumKeysHttpServer.port,
    )?.value,
  );

  HTTP_Server().execute(port, () => {
    CreateNotification({
      title: "Atenção",
      body: `O serviço HTTP do ${Global_State.name_app} está sendo executado.`,
    });
  });
}
function IsActive(sub_category: EnumServices) {
  const Services = GetServices();
  const Status = Services.find(
    (service) => service.sub_category === sub_category,
  )?.value;
  return Status;
}

export function ActivateServicesByConfiguration(_?: EnumServices) {
  const Config = GetConfigTabs();
  IsActive(EnumServices.pix) && PixService();
  IsActive(EnumServices.http_server) && HttpService(Config);
  IsActive(EnumServices.whatsapp_integrated) && Whatsapp.Start();
}
export function StopServicesByConfiguration(_?: EnumServices) {
  !IsActive(EnumServices.pix) && WindowPix().Stop();
  !IsActive(EnumServices.http_server) &&
    HTTP_Server().stop(() => {
      CreateNotification({
        title: "Atenção",
        body: `O serviço HTTP do ${Global_State.name_app} foi desativado.`,
      });
    });
  !IsActive(EnumServices.whatsapp_integrated) && Whatsapp.Stop();
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
