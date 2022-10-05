import { ipcRenderer } from "electron";
import type { EnumServices } from "../../../types/enums/configTabsAndKeys";
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

export function Config_GetKey(filter_config: ICommonConfigIdentification) {
  return ipcRenderer.invoke(EnumIpcEvents.config_get_key, filter_config);
}

export function Config_GetKeyValue(filter_config: ICommonConfigIdentification) {
  return ipcRenderer.invoke(EnumIpcEvents.config_get_key_value, filter_config);
}
export function Config_SetKeyValue(
  values_to_set_config: IValuesToSetConfigKey,
) {
  return ipcRenderer.invoke(
    EnumIpcEvents.config_set_key_value,
    values_to_set_config,
  );
}
