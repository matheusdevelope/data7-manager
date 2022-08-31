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
} from "./preload";

export { MoveWindow, MinimizeWindow, CloseWindow } from "./WindowHeaderBar";
