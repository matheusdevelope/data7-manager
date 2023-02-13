/**
 * @module preload
 */
export {
  Config_GetConfigTabs,
  Config_GetKey,
  Config_GetKeyValue,
  Config_GetService,
  Config_GetServiceOptions,
  Config_GetServices,
  Config_SetConfigTabs,
  Config_SetKeyValue,
} from "./storage";
export {
  SetLocalPassApp,
  GetLocalPassApp,
  GetLocalConfig,
  SetLocalConfig,
  RegisterEventUpdateQr,
  CancelQr,
  OpenQr,
  CloseQr,
  RefreshQr,
  SendWhats,
  RegisterEventLoginWithQr,
  CloseCurrentWindow,
  RefreshAplication,
  GetGlobalState,
  GetLocalConfigTabs,
  SetLocalConfigTabs,
  ResetLocalConfigTabs,
  ToggleWindow,
  VisibilityWindow,
  ToggleService,
  GetURLLoginMobile,
  IsPortInUse,
} from "./preload";

export { MoveWindow, MinimizeWindow, CloseWindow } from "./WindowHeaderBar";

export { GenerateQrCode } from "./generate_qrcode";

export {
  GetStatusWhatsapp,
  ResetLocalStorageWhats,
  ListenerWhatsappBot,
} from "./whatsapp";
