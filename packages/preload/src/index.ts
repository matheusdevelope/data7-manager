/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto";
export { versions } from "./versions";
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
} from "./preload";

export { MoveWindow, MinimizeWindow, CloseWindow } from "./WindowHeaderBar";

export { GenerateQrCode } from "./generate_qrcode";
