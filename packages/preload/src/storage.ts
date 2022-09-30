import { ipcRenderer } from "electron";
import type {
  EnumKeys,
  EnumKeysFirebase,
  EnumKeysHttpServer,
  EnumKeysSendFilesWhats,
  EnumKeysTerminalData,
  EnumKeysWhatsappIntegrated,
  EnumServices,
  EnumTabs,
} from "../../../types/enums/configTabsAndKeys";
import { EnumIpcEvents } from "../../../types/enums/GlobalState";

export function Config_GetConfigTabs() {
  return ipcRenderer.invoke(EnumIpcEvents.config_get_config);
}
export function Config_SetConfigTabs(configs: IOptionConfig2[]) {
  return ipcRenderer.invoke(EnumIpcEvents.config_set_config, configs);
}
export function Config_GetServices() {
  return ipcRenderer.invoke(EnumIpcEvents.config_get_services);
}
export function Config_GetService(service: EnumServices) {
  return ipcRenderer.invoke(EnumIpcEvents.config_get_service, service);
}
export function Config_GetServiceOptions(service: EnumServices) {
  return ipcRenderer.invoke(EnumIpcEvents.config_get_service_options, service);
}

export function Config_GetKey(
  key:
    | EnumKeys
    | EnumKeysFirebase
    | EnumKeysHttpServer
    | EnumKeysSendFilesWhats
    | EnumKeysTerminalData
    | EnumKeysWhatsappIntegrated,
  sub_category?: EnumServices,
  category?: EnumTabs,
) {
  return ipcRenderer.invoke(
    EnumIpcEvents.config_get_key,
    key,
    sub_category,
    category,
  );
}

export function Config_GetKeyValue(
  key:
    | EnumKeys
    | EnumKeysFirebase
    | EnumKeysHttpServer
    | EnumKeysSendFilesWhats
    | EnumKeysTerminalData
    | EnumKeysWhatsappIntegrated,
  sub_category?: EnumServices,
  category?: EnumTabs,
) {
  return ipcRenderer.invoke(
    EnumIpcEvents.config_get_key_value,
    key,
    sub_category,
    category,
  );
}
export function Config_SetKeyValue(
  value: string | number | boolean | string[],
  key:
    | EnumKeys
    | EnumKeysFirebase
    | EnumKeysHttpServer
    | EnumKeysSendFilesWhats
    | EnumKeysTerminalData
    | EnumKeysWhatsappIntegrated,
  sub_category?: EnumServices,
  category?: EnumTabs,
) {
  return ipcRenderer.invoke(
    EnumIpcEvents.config_set_key_value,
    value,
    key,
    sub_category,
    category,
  );
}
