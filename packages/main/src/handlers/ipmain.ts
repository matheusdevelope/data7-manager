import { app, BrowserWindow, ipcMain } from "electron";
import { toDataURL } from "qrcode";
import type { EnumServices } from "../../../../types/enums/configTabsAndKeys";
import { EnumIpcEvents } from "../../../../types/enums/GlobalState";
import { Global_State } from "../global_state";
import {
  ActivateServicesByConfiguration,
  StopServicesByConfiguration,
} from "../InitializeInteface";
import { CancelPix, RefreshPix } from "../services/Api_Pix";
import { SafeStorage, Storage } from "../services/local_storage";
import { DefaultConfigTabs } from "../services/local_storage/configuration_panel";
import { SendMessageOnWhatsapp } from "../services/protocoll_events";
import { WindowPix } from "../windows/pix";
import { ToggleWindow, WindowsCreated } from "./ControlWindows";
import { DataToLoginMobile, URL_Login_Mobile } from "./login_mobile";

function RegisterListenersIpcMain() {
  ipcMain.handle(EnumIpcEvents.set_app_pass, (_, password: string) => {
    return SafeStorage.setPassword("application_pass", password);
  });
  ipcMain.handle(EnumIpcEvents.get_app_pass, () => {
    return SafeStorage.getPassword("application_pass");
  });
  ipcMain.handle(EnumIpcEvents.get_app_config_tabs, () => {
    return Storage.get("config_tabs");
  });
  ipcMain.handle(EnumIpcEvents.set_app_config_tabs, (_, config_tabs) => {
    return Storage.set("config_tabs", [...config_tabs]);
  });
  ipcMain.on(EnumIpcEvents.reset_config_tabs, () => {
    return Storage.set("config_tabs", [...DefaultConfigTabs]);
  });
  ipcMain.on(EnumIpcEvents.open_qrcode, async () => {
    WindowPix().Window.show();
    return true;
  });
  ipcMain.on(EnumIpcEvents.close_qrcode, async () => {
    WindowPix().Window.hide();
    return true;
  });
  ipcMain.on(EnumIpcEvents.close_current_window, async () => {
    //need handle close window
    return true;
  });
  ipcMain.on(EnumIpcEvents.refresh_aplication, async () => {
    WindowsCreated.forEach((win) => {
      win.window.removeAllListeners();
      win.window.close();
    });
    app.relaunch();
    // setTimeout(
    app.exit(); //, 2000
    // );
    return true;
  });
  ipcMain.on("move-window", (_, bounds: IBounds) => {
    BrowserWindow.getFocusedWindow()?.setBounds({ x: bounds.x, y: bounds.y });
  });
  ipcMain.on("minimize-window", () => {
    BrowserWindow.getFocusedWindow()?.minimize();
  });
  ipcMain.on("close-window", () => {
    BrowserWindow.getFocusedWindow()?.close();
  });
  ipcMain.handle(EnumIpcEvents.get_global_state, () => {
    return JSON.stringify(Global_State); //   { ...Global_State }
  });
  ipcMain.handle(
    EnumIpcEvents.get_gererator_qrcode,
    async (event, image_base64_qrcode_login: string) => {
      return await toDataURL(image_base64_qrcode_login);
    },
  );
  ipcMain.handle(EnumIpcEvents.get_fc_cancel_pix, async (_, id: string) => {
    return JSON.stringify(await CancelPix(id));
  });
  ipcMain.handle(EnumIpcEvents.get_fc_refresh_pix, async (_, id: string) => {
    return JSON.stringify(await RefreshPix(id));
  });
  ipcMain.handle(
    EnumIpcEvents.get_fc_send_message_on_whatsapp,
    (_, data_to_message: IWhatsAppMessage) => {
      return SendMessageOnWhatsapp(data_to_message);
    },
  );
  ipcMain.handle(EnumIpcEvents.get_url_login_mobile, (_) => {
    return URL_Login_Mobile(DataToLoginMobile());
  });
  ipcMain.handle(EnumIpcEvents.toggle_window, (_, id_window: string) => {
    const Window = WindowsCreated.find(
      (obj) => obj.id === id_window && !obj.window.isDestroyed(),
    )?.window;
    if (Window) {
      return ToggleWindow(Window);
    }
    return false;
  });
  ipcMain.handle(EnumIpcEvents.visibility_window, (_, id_window: string) => {
    const Window = WindowsCreated.find(
      (obj) => obj.id === id_window && !obj.window.isDestroyed(),
    )?.window;
    if (Window) {
      return Window.isVisible();
    }
    return false;
  });
  ipcMain.on(
    EnumIpcEvents.toggle_service,
    (_, service: EnumServices, active: boolean) => {
      if (active) return ActivateServicesByConfiguration(service);
      return StopServicesByConfiguration(service);
    },
  );
}

export { RegisterListenersIpcMain };
