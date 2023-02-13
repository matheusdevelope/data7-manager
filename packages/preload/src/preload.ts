import { ipcRenderer } from "electron";
import { EnumIpcEvents } from "../../../types/enums/GlobalState";

export function SetLocalPassApp(password: string): Promise<true | Error> {
  return ipcRenderer.invoke(EnumIpcEvents.set_app_pass, password);
}
export function GetLocalPassApp(): Promise<string | false | Error> {
  return ipcRenderer.invoke(EnumIpcEvents.get_app_pass);
}

export function GetLocalConfig(): Promise<IObjectConfig[]> {
  return ipcRenderer.invoke(EnumIpcEvents.get_app_config);
}
export function SetLocalConfig(config: IObjectConfig[]): Promise<void | Error> {
  return ipcRenderer.invoke(EnumIpcEvents.set_app_config, config);
}
export function GetLocalConfigTabs(): Promise<ITabsConfig[]> {
  return ipcRenderer.invoke(EnumIpcEvents.get_app_config_tabs);
}
export function ResetLocalConfigTabs() {
  return ipcRenderer.send(EnumIpcEvents.reset_config_tabs);
}
export function SetLocalConfigTabs(
  config: ITabsConfig[],
): Promise<void | Error> {
  return ipcRenderer.invoke(EnumIpcEvents.set_app_config_tabs, config);
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
    EnumIpcEvents.login_with_qrcode,
    (e, obj: IDataToLoginWithQrCode) => {
      ipcRenderer
        .invoke(EnumIpcEvents.get_gererator_qrcode, JSON.stringify(obj))
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
      EnumIpcEvents.get_fc_cancel_pix,
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
    ipcRenderer.send(EnumIpcEvents.open_qrcode);
  } catch (e) {
    alert(e);
  }
}
export function CloseQr() {
  try {
    ipcRenderer.send(EnumIpcEvents.close_qrcode);
  } catch (e) {
    alert(e);
  }
}
export async function RefreshQr(id_qrcode: string): Promise<IRefreshQr> {
  try {
    const RefreshPix = (await ipcRenderer.invoke(
      EnumIpcEvents.get_fc_refresh_pix,
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
export async function SendWhats(phone: string, messages: IMessageWhatsapp[]) {
  try {
    const ret = await ipcRenderer.invoke(
      EnumIpcEvents.get_fc_send_message_on_whatsapp,
      phone,
      messages,
    );
    return Promise.resolve(ret);
  } catch (error) {
    return Promise.reject(error);
  }
}
export function CloseCurrentWindow(origin?: string) {
  ipcRenderer.send(EnumIpcEvents.close_current_window, origin);
}
export function RefreshAplication(origin?: string) {
  ipcRenderer.send(EnumIpcEvents.refresh_aplication, origin);
}
export function GetGlobalState(): Promise<string> {
  return ipcRenderer.invoke(EnumIpcEvents.get_global_state);
}
export function ToggleWindow(id_window: string): Promise<boolean> {
  return ipcRenderer.invoke(EnumIpcEvents.toggle_window, id_window || "");
}
export function VisibilityWindow(id_window: string): Promise<boolean> {
  return ipcRenderer.invoke(EnumIpcEvents.visibility_window, id_window || "");
}
export function ToggleService(service: string, active: string) {
  service && ipcRenderer.send(EnumIpcEvents.toggle_service, service, active);
}
export function GetURLLoginMobile(): Promise<string> {
  return ipcRenderer.invoke(EnumIpcEvents.get_url_login_mobile);
}

export function IsPortInUse(port: number) {
  return ipcRenderer.invoke(EnumIpcEvents.is_port_in_use, port);
}
