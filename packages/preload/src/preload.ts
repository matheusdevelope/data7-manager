import { ipcRenderer } from "electron";
import { EnumIpcEvents } from "../../../types/enums/GlobalState";

const Global_State = {
  events: {
    get_global_state: "get_global_state",
    set_app_pass: "set_app_pass",
    get_app_pass: "get_app_pass",
    get_app_config: "get_app_config",
    set_app_config: "set_app_config",
    get_app_config_tabs: "get_app_config_tabs",
    set_app_config_tabs: "set_app_config_tabs",
    open_qrcode: "open-qrcode",
    close_qrcode: "close-qrcode",
    update_qrcode: "update-qrcode",
    send_message_whats: "send-message-whats",
    login_with_qrcode: "login_with_qrcode",
    close_current_window: "close_current_window",
    refresh_aplication: "refresh_aplication",
    get_gererator_qrcode: "get_gererator_qrcode",
    get_fc_refresh_pix: "get_fc_refresh_pix",
    get_fc_cancel_pix: "get_fc_cancel_pix",
    get_fc_send_message_on_whatsapp: "get_fc_send_message_on_whatsapp",
  },
};

export function SetLocalPassApp(password: string): Promise<true | Error> {
  return ipcRenderer.invoke(Global_State.events.set_app_pass, password);
}
export function GetLocalPassApp(): Promise<string | false | Error> {
  return ipcRenderer.invoke(Global_State.events.get_app_pass);
}

export function GetLocalConfig(): Promise<IObjectConfig[]> {
  return ipcRenderer.invoke(Global_State.events.get_app_config);
}
export function SetLocalConfig(config: IObjectConfig[]): Promise<void | Error> {
  return ipcRenderer.invoke(Global_State.events.set_app_config, config);
}
export function GetLocalConfigTabs(): Promise<ITabsConfig[]> {
  return ipcRenderer.invoke(Global_State.events.get_app_config_tabs);
}
export function ResetLocalConfigTabs() {
  return ipcRenderer.send(EnumIpcEvents.reset_config_tabs);
}
export function SetLocalConfigTabs(
  config: ITabsConfig[],
): Promise<void | Error> {
  return ipcRenderer.invoke(Global_State.events.set_app_config_tabs, config);
}
export function RegisterEventUpdateQr(
  event: string,
  cb: (data: IDataQrCode) => void,
) {
  ipcRenderer.on(event, (_, args: IDataQrCode) => {
    cb(args);
  });
}
interface IDataToLoginWithQrCode {
  ip: string;
  port: string;
  token: string;
}
export function RegisterEventLoginWithQr(cb: (data: string) => void) {
  ipcRenderer.on(
    Global_State.events.login_with_qrcode,
    (e, obj: IDataToLoginWithQrCode) => {
      ipcRenderer
        .invoke(Global_State.events.get_gererator_qrcode, JSON.stringify(obj))
        .then((image_base64_qrcode_login: string) => {
          return cb(image_base64_qrcode_login);
        })
        .catch(() => cb("none"));
    },
  );
}
export async function CancelQr(id_qrcode: string): Promise<ICancelQr> {
  try {
    const CancelPix = (await ipcRenderer.invoke(
      Global_State.events.get_fc_cancel_pix,
      id_qrcode,
    )) as unknown as string;

    return Promise.resolve(JSON.parse(CancelPix));
  } catch (e) {
    return Promise.resolve({
      canceled: false,
      message: "Houve um erro ao solicitar o cancelamento do PIX",
      error: String(e),
    });
  }
}
export function OpenQr() {
  try {
    ipcRenderer.send(Global_State.events.open_qrcode);
  } catch (e) {
    alert(e);
  }
}
export function CloseQr() {
  try {
    ipcRenderer.send(Global_State.events.close_qrcode);
  } catch (e) {
    alert(e);
  }
}
export async function RefreshQr(id_qrcode: string): Promise<IRefreshQr> {
  try {
    const RefreshPix = (await ipcRenderer.invoke(
      Global_State.events.get_fc_refresh_pix,
      id_qrcode,
    )) as unknown as string;
    return Promise.resolve(JSON.parse(RefreshPix));
  } catch (e) {
    return Promise.resolve({
      awaiting_payment: false,
      confirmed_payment: false,
      canceled: false,
      message: "Houve um erro ao solicitar a situação do PIX",
      error: String(e),
    });
  }
}
export function SendWhats(data: IWhatsAppMessage) {
  ipcRenderer.invoke(Global_State.events.get_fc_send_message_on_whatsapp, data);
}
export function CloseCurrentWindow(origin?: string) {
  ipcRenderer.send(Global_State.events.close_current_window, origin);
}
export function RefreshAplication(origin?: string) {
  ipcRenderer.send(Global_State.events.refresh_aplication, origin);
}
export function GetGlobalState(): Promise<string> {
  return ipcRenderer.invoke(Global_State.events.get_global_state);
}
export function ToggleWindow(id_window: string): Promise<boolean> {
  return ipcRenderer.invoke(EnumIpcEvents.toggle_window, id_window || "");
}
export function VisibilityWindow(id_window: string): Promise<boolean> {
  return ipcRenderer.invoke(EnumIpcEvents.visibility_window, id_window || "");
}
